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
import RestaurantManagerStore from '../../stores/restaurantManagerStore';
import { RestaurantManagerDto } from '../../services/restaurantManagers/dto/restaurantManagerDto';
import CreateOrUpdateRestaurantManager from './components/createOrUpdateRestaurantManager';
import { FormInstance } from 'antd/lib/form';
import { UpdateRestaurantManagerDto } from '../../services/restaurantManagers/dto/updateRestaurantManagerDto';
import { EntityDto } from '../../services/dto/entityDto';

export interface IRestaurantManagersProps {
  restaurantManagerStore :RestaurantManagerStore;
}


export interface IRestaurantManagersState {
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
  restaurantManagerModalVisible: boolean;
  restaurantManagerModalId: number;
  restaurantManagerModalType:string;
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];
declare var abp: any;

@inject(Stores.RestaurantManagerStore)
@observer
export class RestaurantManagers extends AppComponentBase<IRestaurantManagersProps, IRestaurantManagersState> {
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
    restaurantManagerModalVisible: false,
    restaurantManagerModalId: 0,
    restaurantManagerModalType:'create',
    };

  async componentDidMount() {

    this.updateRestaurantManagersList(this.state.meta.pageSize, 0);
  }

  async openRestaurantManagerModal(input: EntityDto) {
    if (input.id === 0) {
      
    } else {
      await this.props.restaurantManagerStore!.getRestaurantManager({id:input.id});
      this.setState({ restaurantManagerModalType: 'edit', restaurantManagerModalId: input.id });
    }
    this.setState({ restaurantManagerModalVisible: !this.state.restaurantManagerModalVisible});
  }

  async updateRestaurantManagersList(maxResultCount: number, skipCount: number) {
    this.props.restaurantManagerStore!.maxResultCount = maxResultCount;
    this.props.restaurantManagerStore!.skipCount = skipCount;
    this.props.restaurantManagerStore!.isActiveFilter =this.state.isActiveFilter;
    this.props.restaurantManagerStore!.keyword =this.state.keyword;

    this.props.restaurantManagerStore!.getRestaurantManagers();
  }

  onSwitchRestaurantManagerActivation = async (restaurantManager: RestaurantManagerDto) => {
    popupConfirm(async () => {
      if(restaurantManager.isActive)
      await this.props.restaurantManagerStore!.restaurantManagerDeactivation({ id: restaurantManager.id });
      else
      await this.props.restaurantManagerStore!.restaurantManagerActivation({ id: restaurantManager.id });
      this.updateRestaurantManagersList(this.state.meta.pageSize, this.state.meta.skipCount);

    }, restaurantManager.isActive ? L('AreYouSureYouWantToDeactivateThisRestaurantManager') : L('AreYouSureYouWantToActivateThisRestaurantManager'));
  }

  
  createOrUpdateRestaurantManager = () => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
     
      if (this.state.restaurantManagerModalId === 0) {
      } else {
        values.id = this.state.restaurantManagerModalId;
        await this.props.restaurantManagerStore!.UpdateRestaurantManager(values as UpdateRestaurantManagerDto);
      }
      this.updateRestaurantManagersList(this.state.meta.pageSize,this.state.meta.skipCount);
      this.setState({ restaurantManagerModalVisible: false });
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
            this.updateRestaurantManagersList(this.state.meta.pageSize,this.state.meta.skipCount);
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
              this.updateRestaurantManagersList(this.state.meta.pageSize,this.state.meta.skipCount);
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
  

  restaurantManagersTableColumns = [
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
      title: L('RestaurantName'),
      dataIndex: 'restaurantName',
      key: 'restaurantName',
      render:(restaurantName:string,item:RestaurantManagerDto)=>{
        return <a href={`/restaurant/${item.restaurantId}`} target="_blank" rel="noopener noreferrer">{restaurantName}</a>
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
      render: (text: string, item: RestaurantManagerDto) => (
        <div>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
                  <Menu.Item onClick={() => this.openRestaurantManagerModal({ id: item.id})}>
                  <EditOutlined className="action-icon"  />
                  <button className="inline-action">{L('Edit')}</button>
                </Menu.Item>
                <Menu.Item onClick={() => this.onSwitchRestaurantManagerActivation(item)}>
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
      this.updateRestaurantManagersList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateRestaurantManagersList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const restaurantManagers = this.props.restaurantManagerStore!.restaurantManagers;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.restaurantManagerStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={L('RestaurantManagers')}
      >
                <SearchComponent
                searchText={L('SearchByIdNameEmailPhoneRestaurantName')}
        onSearch={(value: string)=>{
          this.setState({keyword:value},()=>{
            this.updateRestaurantManagersList(this.state.meta.pageSize,this.state.meta.skipCount);
          });
        }}
        />
        <Table
          pagination={pagination}
          rowKey={record => record.id + ""}
          style={{ marginTop: '12px' }}
          loading={this.props.restaurantManagerStore!.loadingRestaurantManagers}
          dataSource={restaurantManagers === undefined ? [] : restaurantManagers}
          columns={this.restaurantManagersTableColumns}

        />

<CreateOrUpdateRestaurantManager
          visible={this.state.restaurantManagerModalVisible}
          onCancel={() =>
            this.setState({
              restaurantManagerModalVisible: false,
            })
          }
          formRef={this.formRef}
          onOk={this.createOrUpdateRestaurantManager}
          modalType={this.state.restaurantManagerModalType}
          isSubmittingRestaurantManager={this.props.restaurantManagerStore!.isSubmittingRestaurantManager}
          restaurantManagerStore={this.props.restaurantManagerStore!}
        />
      </Card>
    );
  }
}

export default RestaurantManagers;
