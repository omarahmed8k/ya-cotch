import * as React from 'react';
import { Button, Card, Dropdown, Menu, Table, Tag,Select } from 'antd';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import { CaretDownOutlined,CheckSquareOutlined ,FilterOutlined,EditOutlined} from '@ant-design/icons';
import { popupConfirm } from '../../lib/popupMessages';
import moment from 'moment';
import timingHelper from '../../lib/timingHelper';
import SearchComponent from '../../components/SearchComponent';
import { FormInstance } from 'antd/lib/form';
import { EntityDto } from '../../services/dto/entityDto';
import ShopManagerStore from '../../stores/shopManagerStore';
import { ShopManagerDto } from '../../services/shopManagers/dto/shopManagerDto';
import { UpdateShopManagerDto } from '../../services/shopManagers/dto/updateShopManagerDto';
import CreateOrUpdateShopManagers from './components/createOrUpdateShopManager';

export interface IShopManagersProps {
  shopManagerStore :ShopManagerStore;
}


export interface IShopManagersState {
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount:number;
  };
  isActiveFilter?:boolean;
  keyword?:string;
  shopManagerModalVisible: boolean;
  shopManagerModalId: number;
  shopManagerModalType:string;
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];
declare var abp: any;

@inject(Stores.ShopManagerStore)
@observer
export class ShopManagers extends AppComponentBase<IShopManagersProps, IShopManagersState> {
  formRef = React.createRef<FormInstance>();

  state = {
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount:0
    },
    isActiveFilter:undefined,
    keyword:undefined,
    shopManagerModalVisible: false,
    shopManagerModalId: 0,
    shopManagerModalType:'create',
    };

  async componentDidMount() {

    this.updateShopManagersList(this.state.meta.pageSize, 0);
  }

  async openShopManagerModal(input: EntityDto) {
    if (input.id === 0) {
      
    } else {
      await this.props.shopManagerStore!.getShopManager({id:input.id});
      this.setState({ shopManagerModalType: 'edit', shopManagerModalId: input.id });
    }
    this.setState({ shopManagerModalVisible: !this.state.shopManagerModalVisible});
  }

  async updateShopManagersList(maxResultCount: number, skipCount: number) {
    this.props.shopManagerStore!.maxResultCount = maxResultCount;
    this.props.shopManagerStore!.skipCount = skipCount;
    this.props.shopManagerStore!.isActiveFilter =this.state.isActiveFilter;
    this.props.shopManagerStore!.keyword =this.state.keyword;

    await this.props.shopManagerStore!.getShopManagers();
  }

  onSwitchShopManagerActivation = async (shopManager: ShopManagerDto) => {
    popupConfirm(async () => {
      if(shopManager.isActive)
      await this.props.shopManagerStore!.shopManagerDeactivation({ id: shopManager.id });
      else
      await this.props.shopManagerStore!.shopManagerActivation({ id: shopManager.id });
      this.updateShopManagersList(this.state.meta.pageSize, this.state.meta.skipCount);

    }, shopManager.isActive ? L('AreYouSureYouWantToDeactivateThisShopManager') : L('AreYouSureYouWantToActivateThisShopManager'));
  }

  
  createOrUpdateShopManager = () => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
     
      if (this.state.shopManagerModalId === 0) {
      } else {
        values.id = this.state.shopManagerModalId;
        await this.props.shopManagerStore!.UpdateShopManager(values as UpdateShopManagerDto);
      }
      this.updateShopManagersList(this.state.meta.pageSize,this.state.meta.skipCount);
      this.setState({ shopManagerModalVisible: false });
      form!.resetFields();
    });
  }
  getColumnStatusSearchProps = () => ({
    filterDropdown: ({ confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Select
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          showSearch
          optionFilterProp="children"
          onChange={(value: any) => {
           
            this.setState({isActiveFilter:value === 3 ? undefined : value === 1 ? true : false});
          }}
          value={this.state.isActiveFilter=== undefined ? 3 : !this.state.isActiveFilter ? 0 : 1}
        >
          <Select.Option key={1} value={1}>{L('Activated')}</Select.Option>
          <Select.Option key={0} value={0}>{L('Deactivated')}</Select.Option>
          <Select.Option key={3} value={3}>{L('All')}</Select.Option>
        </Select>
        <Button
          type="primary"
          onClick={async () => {
            confirm();
            this.updateShopManagersList(this.state.meta.pageSize,this.state.meta.skipCount);
          }}
         
          size="small"
          style={{ width: 90, marginRight: 4, marginLeft: 4 }}
        >
          {L('Filter')}
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            this.setState({isActiveFilter:undefined},()=>{
              this.updateShopManagersList(this.state.meta.pageSize,this.state.meta.skipCount);
            });
          }}
          size="small"
          style={{ width: 90 }}
        >
          {L('ResetFilter')}
        </Button>
      </div>
    ),
    filterIcon: (filtered: any) => <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
  });
  

  shopManagersTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    
    {
      title: L('Name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: L('ShopName'),
      dataIndex: 'shopName',
      key: 'shopName',
      render:(shopName:string,item:ShopManagerDto)=>{
        return <a href={`/shop/${item.shopId}`} target="_blank" rel="noopener noreferrer">{shopName}</a>
      }
    },
    {
      title: L('Email'),
      dataIndex: 'emailAddress',
      key: 'emailAddress',
    },
    {
      title: L('PhoneNumber'),
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: L('LastLoginDate'),
      dataIndex: 'lastLoginDate',
      key: 'lastLoginDate',
      sorter: (a:any, b:any) => a.lastLoginDate - b.lastLoginDate,

      render:(lastLoginDate:string)=>{
        return lastLoginDate ? moment(lastLoginDate).format(timingHelper.defaultDateFormat):undefined;
      }
    },
      
    {
      title: L('Status'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => {
        return <Tag color={isActive ? 'green' : 'volcano'} className='ant-tag-disable-pointer'>{isActive ? L('Active') : L('Inactive')}</Tag>;
      },
      ...this.getColumnStatusSearchProps()
    },
    {
      title: L('Action'),
      key: 'action',
      width: '10%',
      render: (text: string, item: ShopManagerDto) => (
        <div>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
                  <Menu.Item onClick={() => this.openShopManagerModal({ id: item.id})}>
                  <EditOutlined className="action-icon"  />
                  <button className="inline-action">{L('Edit')}</button>
                </Menu.Item>
                <Menu.Item onClick={() => this.onSwitchShopManagerActivation(item)}>
                 <CheckSquareOutlined  className="action-icon" />
                  <button className="inline-action" >{item.isActive ? L('Deactivate') : L('Activate')}</button>
                </Menu.Item>
              
              
              </Menu>
            }
            placement="bottomLeft"
          >
            <Button type="primary" icon={<CaretDownOutlined />} />
          </Dropdown>
        </div>
      ),
    },
  ];

  paginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.meta.pageSize = pageSize;
      this.setState(temp);
      this.updateShopManagersList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateShopManagersList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const shopManagers = this.props.shopManagerStore!.shopManagers;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.shopManagerStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={L('ShopManagers')}
      >
                <SearchComponent
                searchText={L('SearchByIdNameEmailPhoneShopName')}
        onSearch={(value: string)=>{
          this.setState({keyword:value},()=>{
            this.updateShopManagersList(this.state.meta.pageSize,this.state.meta.skipCount);
          });
        }}
        />
        <Table
          pagination={pagination}
          rowKey={record => record.id + ""}
          style={{ marginTop: '12px' }}
          loading={this.props.shopManagerStore!.loadingShopManagers}
          dataSource={shopManagers === undefined ? [] : shopManagers}
          columns={this.shopManagersTableColumns}

        />

<CreateOrUpdateShopManagers
          visible={this.state.shopManagerModalVisible}
          onCancel={() =>
            this.setState({
              shopManagerModalVisible: false,
            })
          }
          formRef={this.formRef}
          onOk={this.createOrUpdateShopManager}
          modalType={this.state.shopManagerModalType}
          isSubmittingShopManager={this.props.shopManagerStore!.isSubmittingShopManager}
          shopManagerStore={this.props.shopManagerStore!}
        />
      </Card>
    );
  }
}

export default ShopManagers;
