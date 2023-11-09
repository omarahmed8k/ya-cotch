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
import CreateOrUpdateCity from './components/createOrUpdateCity';
import { EntityDto } from '../../services/dto/entityDto';
import { popupConfirm } from '../../lib/popupMessages';
import locationsService from '../../services/locations/locationsService';
import LocationType from '../../services/types/locationType';
import { LiteEntityDto } from '../../services/dto/liteEntityDto';

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

  parentIdFilter?:number;
  isActiveFilter?:boolean;
  keyword?:string;
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.LocationStore)
@observer
export class Cities extends AppComponentBase<ILocationsProps, ILocationsState> {
  formRef = React.createRef<FormInstance>();
  countries:LiteEntityDto[]=[];

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

    parentIdFilter:undefined,
    isActiveFilter:undefined,
    keyword:undefined

    // module:LocationType.Country,
    // parentId:0
  };

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

  async componentDidMount() {
    let result = await locationsService.getAllLite({type:LocationType.Country});
    this.countries=result.items;
   
    this.updateLocationsList(this.state.meta.pageSize, 0);
  }



  async updateLocationsList(maxResultCount: number, skipCount: number) {
    this.props.locationStore!.maxResultCount = maxResultCount;
    this.props.locationStore!.skipCount = skipCount;
    this.props.locationStore!.isActiveFilterCity = this.state.isActiveFilter;
    this.props.locationStore!.parentIdFilterCity = this.state.parentIdFilter;
    this.props.locationStore!.keywordCity = this.state.keyword;

    this.props.locationStore!.getCities();
  }

  async openLocationModal(input: EntityDto) {
    if (input.id === 0) {
      this.props.locationStore!.locationModel=undefined;
      this.setState({ locationsModalType: 'create'}); 
    } else {
      await this.props.locationStore!.getCity(input.id);
      this.setState({ locationsModalType: 'edit'});
    }
    this.setState({ locationModalVisible: !this.state.locationModalVisible, locationsModalId: input.id });
  }



  onSwitchLocationActivation = async (location: LocationDto) => {
    popupConfirm(async () => {
      if(location.isActive)
      await this.props.locationStore!.locationDeactivation({ id: location.id });
      else
      await this.props.locationStore!.locationActivation({ id: location.id });
      await this.updateLocationsList(this.state.meta.pageSize,this.state.meta.skipCount);
    }, location.isActive ? L('AreYouSureYouWantToDeactivateThisCity') : L('AreYouSureYouWantToActivateThisCity'));
  }
  
  getColumnCountrySearchProps = () => ({
    filterDropdown: ({ confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Select
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          showSearch
          placeholder={L('PleaseSelectCountry')}  
          optionFilterProp="children"
          filterOption={(input, option:any) =>
            option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          value={this.state.parentIdFilter}
          onChange={(value: any) => {           
            this.setState({parentIdFilter:value });
          }}>
          {this.countries.length>0 && this.countries.map((element:LiteEntityDto) => <Select.Option key={element.value} value={element.value}>{element.text}</Select.Option>)}
        
        
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
            this.setState({parentIdFilter:undefined},()=>{
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

  createOrUpdateLocation = () => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
      if (this.state.locationsModalId === 0) {
        await this.props.locationStore!.createLocation(values as CreateLocationDto);
      } else {
        values.id = this.state.locationsModalId;
        await this.props.locationStore!.updateLocation(values as UpdateLocationDto);
      }
      await this.props.locationStore!.getCities();
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
      title: L('Country'),
      dataIndex: 'country',
      key: 'country',
      render: (country: any,item:LocationDto) => {
        return item.parent?.text;
      },
      ...this.getColumnCountrySearchProps()
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
    const locations = this.props.locationStore!.cities;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.locationStore!.citiesTotalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={
          <div>
            <span>{L('Cities')}</span>
           
            <Button type="primary" style={{ float: localization.getFloat(), margin: '0 5px' }} icon={<PlusOutlined/>} onClick={() => this.openLocationModal({ id: 0 })}>
              {L('AddCity')}
            </Button>
           
          </div>
        }
      >
          <SearchComponent
        onSearch={(value: string)=>{
          this.setState({keyword:value},()=>{
            this.updateLocationsList(this.state.meta.pageSize,this.state.meta.skipCount);
          });
        }}
        />
        <Table
          pagination={pagination}
          rowKey={record => record.id + ""}
          style={{ marginTop: '12px' }}
          loading={this.props.locationStore!.loadingLocations}
          dataSource={locations === undefined ? [] : locations}
          columns={this.locationsTableColumns}
        />

        <CreateOrUpdateCity
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

export default Cities;
