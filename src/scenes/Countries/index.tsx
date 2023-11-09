import * as React from 'react';
import { Button, Card, Dropdown, Menu, Table, Tag,Select } from 'antd';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import SearchComponent from '../../components/SearchComponent';

import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import localization from '../../lib/localization';
import { EditOutlined,PlusOutlined,CaretDownOutlined,FilterOutlined ,CheckSquareOutlined} from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import LocationStore from '../../stores/locationStore';
import { CreateLocationDto } from '../../services/locations/dto/createLocationDto';
import { UpdateLocationDto } from '../../services/locations/dto/updateLocationDto';
import { LocationDto } from '../../services/locations/dto/locationDto';
import CreateOrUpdateCountry from './components/createOrUpdateCountry';
import { EntityDto } from '../../services/dto/entityDto';
import { popupConfirm } from '../../lib/popupMessages';

export interface ILocationsProps {
  locationStore?: LocationStore;
}

export interface ILocationsState {
  locationModalVisible: boolean;
  locationsModalId: number;
  locationsModalType: string;
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    skipCount:number;
    total: number;
  };

  isActiveFilter?:boolean;
  keyword?:string;

}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.LocationStore)
@observer
export class Countries extends AppComponentBase<ILocationsProps, ILocationsState> {
  formRef = React.createRef<FormInstance>();
  currentUser:any = undefined;

  state = {
    locationModalVisible: false,
    locationsModalId: 0,
    locationsModalType: 'create',
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      skipCount:0,
      total: 0,
    },

    isActiveFilter:undefined,
    keyword:undefined

  };

  async componentDidMount() {
    this.updateLocationsList(this.state.meta.pageSize, 0);
  }



  async updateLocationsList(maxResultCount: number, skipCount: number) {
    this.props.locationStore!.maxResultCount = maxResultCount;
    this.props.locationStore!.skipCount = skipCount;
    this.props.locationStore!.isActiveFilterCountry=this.state.isActiveFilter;
    this.props.locationStore!.keywordCountry = this.state.keyword;

    this.props.locationStore!.getCountries();
  }

  async openLocationModal(input: EntityDto) {
    if (input.id === 0) {
      this.props.locationStore!.locationModel=undefined;
      this.setState({ locationsModalType: 'create', locationsModalId: input.id}); 
    } else {
      await this.props.locationStore!.getCountry(input.id);
      this.setState({ locationsModalType: 'edit', locationsModalId: input.id });
    }
    this.setState({ locationModalVisible: !this.state.locationModalVisible, locationsModalId: input.id });
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
            this.updateLocationsList(this.state.meta.pageSize,this.state.meta.skipCount);
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
              this.updateLocationsList(this.state.meta.pageSize,this.state.meta.skipCount);
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

  onSwitchLocationActivation = async (location: LocationDto) => {
    popupConfirm(async () => {
      if(location.isActive)
      await this.props.locationStore!.locationDeactivation({ id: location.id });
      else
      await this.props.locationStore!.locationActivation({ id: location.id });
      await this.updateLocationsList(this.state.meta.pageSize,this.state.meta.skipCount);
    }, location.isActive ? L('AreYouSureYouWantToDeactivateThisCountry') : L('AreYouSureYouWantToActivateThisCountry'));
  }
  
  createOrUpdateLocation = () => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
     
      if (this.state.locationsModalId === 0) {
        await this.props.locationStore!.createLocation(values as CreateLocationDto);
      } else {
        values.id = this.state.locationsModalId;
        await this.props.locationStore!.updateLocation(values as UpdateLocationDto);
      }
      await this.props.locationStore!.getCountries();
      this.setState({ locationModalVisible: false });
      form!.resetFields();
    });
  }


  locationsTableColumns = [
    {
      title: L('ArName'),
      dataIndex: 'arName',
      key: 'arName',
    },
    {
      title: L('EnName'),
      dataIndex: 'enName',
      key: 'enName',
    },
    {
      title: L('IsActive'),
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
      render: (text: string, item: LocationDto) => (
        <div>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
              
                <Menu.Item onClick={() => this.openLocationModal({ id: item.id})}>
                  <EditOutlined className="action-icon"  />
                  <button className="inline-action">{L('Edit')}</button>
                </Menu.Item>
               
                <Menu.Item onClick={() => this.onSwitchLocationActivation(item)}>
                  <CheckSquareOutlined className="action-icon" />
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
      this.updateLocationsList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateLocationsList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const locations = this.props.locationStore!.countries;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.locationStore!.countriesTotalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={
          <div>
            <span>{L('Countries')}</span>
            
            <Button type="primary" style={{ float: localization.getFloat(), margin: '0 5px' }} icon={<PlusOutlined/>} onClick={() => this.openLocationModal({ id: 0 })}>
              {L('AddCountry')}
            </Button>
            
          </div>
        }
      >
          <SearchComponent
        onSearch={(value: string)=>{
          this.setState({keyword:value},()=>{
            this.updateLocationsList(this.state.meta.pageSize,this.state.meta.skipCount);
          });
        }}/>
        <Table
          pagination={pagination}
          rowKey={record => record.id + ""}
          style={{ marginTop: '12px' }}
          loading={this.props.locationStore!.loadingLocations}
          dataSource={locations === undefined ? [] : locations}
          columns={this.locationsTableColumns}
        />

        <CreateOrUpdateCountry
          formRef={this.formRef}
          visible={this.state.locationModalVisible}
          onCancel={() =>
            this.setState({
              locationModalVisible: false,
            })
          }
          modalType={this.state.locationsModalType}
          onOk={this.createOrUpdateLocation}
          isSubmittingLocation={this.props.locationStore!.isSubmittingLocation}
          locationStore={this.props.locationStore}
        />

      

      </Card>
    );
  }
}

export default Countries;
