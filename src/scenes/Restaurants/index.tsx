import * as React from 'react';
import { Button, Card, Dropdown, Menu, Table, Tag,Select,Avatar,Input,Form,Row,Col,Modal } from 'antd';
import { inject, observer } from 'mobx-react';
import ExcellentExport from 'excellentexport';
import { EditOutlined,FilterOutlined,PlusOutlined,CaretDownOutlined,EyeOutlined,CheckSquareOutlined, FileExcelOutlined, BranchesOutlined } from '@ant-design/icons';
import moment from 'moment';
import { FormInstance } from 'antd/lib/form';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import { EntityDto } from '../../services/dto/entityDto';
import { popupConfirm } from '../../lib/popupMessages';
import SearchComponent from '../../components/SearchComponent';
import ImageModal from '../../components/ImageModal';

import localization from '../../lib/localization';
import RestaurantStore from '../../stores/restaurantStore';
import { RestaurantDto } from '../../services/restaurants/dto/restaurantDto';
import CreateOrUpdateRestaurant from './components/createOrUpdateRestaurant';
import timingHelper from '../../lib/timingHelper';
import RestaurantManagerStore from '../../stores/restaurantManagerStore';
import RestaurantManagerDetailsModal from '../RestaurantManagers/components/restaurantManagerDetailsModal';
import { LiteEntityDto } from '../../services/dto/liteEntityDto';
import locationsService from '../../services/locations/locationsService';
import LocationType from '../../services/types/locationType';
import SubscriptionStore from '../../stores/subscriptionStore';
import { AssignSubscriptionToUserDto } from '../../services/subscriptions/dto/assignSubscriptionToUserDto';
import subscriptionsService from '../../services/subscriptions/subscriptionsService';
import SubscriptionTarget from '../../services/types/subscriptionTarget';
import userService from '../../services/user/userService';
import utils from '../../utils/utils';

export interface IRestaurantsProps {
  restaurantStore?: RestaurantStore;
  restaurantManagerStore?: RestaurantManagerStore;
  subscriptionStore?:SubscriptionStore;

}

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
    md: { span: 6 },
    lg: { span: 7 },
    xl: { span: 7 },
    xxl: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 18 },
    md: { span: 18 },
    lg: { span: 16 },
    xl: { span: 16 },
    xxl: { span: 16 },
  },
};

const colLayout = {

  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 24 },
  xl: { span: 24 },
  xxl: { span: 24 },

};
export interface IRestaurantsState {
  restaurantModalVisible: boolean;
  restaurantId:number;
  restaurantModalId: number;
  restaurantModalType: string;
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    skipCount:number;
    pageTotal: number;
    total: number;
  };
  cityId?:number;
  minRate?:number;
  maxRate?:number;
  isActiveFilter?:boolean;
  assignNewSubscription:boolean;
  keyword?:string;
  isImageModalOpened: boolean;
  imageModalCaption: string;
  imageModalUrl: string;
  managerDetailsModalVisible:boolean;
  managerId:number;
  permisssionGrantedForSubscription:boolean;
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];
declare let abp: any;

@inject(Stores.RestaurantStore,Stores.RestaurantManagerStore,Stores.SubscriptionStore)
@observer
export class Restaurants extends AppComponentBase<IRestaurantsProps, IRestaurantsState> {
  subscriptions:Array<LiteEntityDto>=[];

  assignSubscriptionFormRef = React.createRef<FormInstance>();

  currentUser:any = undefined;

  cities:Array<LiteEntityDto>=[];

  state = {
    restaurantModalVisible: false,
    assignNewSubscription:false,
    restaurantId:0,
    restaurantModalId: 0,
    restaurantModalType: 'create',
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      skipCount:0,
      pageTotal: 1,
      total: 0,
    },
    isImageModalOpened: false,
    imageModalCaption: '',
    imageModalUrl: '',
    isActiveFilter:undefined,
    keyword:undefined,
    cityId:undefined,
    minRate:undefined,
    maxRate:undefined,
    managerDetailsModalVisible:false,
    managerId:0,
    permisssionGrantedForSubscription:false
  };

  async componentDidMount() {
    this.currentUser = await userService.get({id:abp.session.userId});
    this.setState({permisssionGrantedForSubscription:(await utils.checkIfGrantedPermission('SubscriptionsManagement')).valueOf() });
    const result = await locationsService.getAllLite({type:LocationType.City});
    this.cities=result.items; 
    const result2 = await subscriptionsService.getAllLite({target:SubscriptionTarget.Restaurant});
    this.subscriptions=result2.items; 
    this.updateRestaurantsList(this.state.meta.pageSize, 0);
  }

  openImageModal(image: string, caption: string) {
    this.setState({ isImageModalOpened: true, imageModalCaption: caption, imageModalUrl: image });
  }

  closeImageModal() {
    this.setState({ isImageModalOpened: false, imageModalCaption: '', imageModalUrl: '' });
  }

  async updateRestaurantsList(maxResultCount: number, skipCount: number) {
    this.props.restaurantStore!.maxResultCount = maxResultCount;
    this.props.restaurantStore!.skipCount = skipCount;
    this.props.restaurantStore!.keyword = this.state.keyword;
    this.props.restaurantStore!.isActiveFilter = this.state.isActiveFilter;
    this.props.restaurantStore!.cityId = this.state.cityId;
    this.props.restaurantStore!.maxRate = this.state.maxRate;
    this.props.restaurantStore!.minRate = this.state.minRate;

    this.props.restaurantStore!.getRestaurants();
  }

  async openRestaurantModal(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      this.props.restaurantStore!.restaurantModel=undefined;
      this.setState({ restaurantModalType: 'create' }); 
    } else {
      await this.props.restaurantStore!.getRestaurant(entityDto);
      this.setState({ restaurantModalType: 'edit' });
    }
    this.setState({ restaurantModalVisible: !this.state.restaurantModalVisible, restaurantModalId: entityDto.id });
  }
  
  async openManagerDetailsModal(entityDto: EntityDto) {
    await this.props.restaurantManagerStore!.getRestaurantManager(entityDto);
    this.setState({ managerDetailsModalVisible: !this.state.managerDetailsModalVisible, managerId: entityDto.id });
  }

  getColumnStatusSearchProps = () => ({
    filterDropdown: ({ confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Select
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          showSearch
          optionFilterProp="children"
          onChange={(value: any) => {
           
            this.setState({isActiveFilter:value === 3 ? undefined : value === 1});
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
            this.updateRestaurantsList(this.state.meta.pageSize,this.state.meta.skipCount);
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
              this.updateRestaurantsList(this.state.meta.pageSize,this.state.meta.skipCount);
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
  
  getColumnCitySearchProps = () => ({
    filterDropdown: ({ confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Select
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          showSearch
          placeholder={L('PleaseSelectCity')}  
          optionFilterProp="children"
          filterOption={(input, option:any) =>
            option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          value={this.state.cityId}
          onChange={(value: any) => {           
            this.setState({cityId:value });
          }}
        >
          {this.cities.length>0 && this.cities.map((element:LiteEntityDto) => <Select.Option key={element.value} value={element.value}>{element.text}</Select.Option>)}
        
        
        </Select>
        <Button
          type="primary"
          onClick={async () => {
            confirm();
            this.updateRestaurantsList(this.state.meta.pageSize,this.state.meta.skipCount);
          }}
         
          size="small"
          style={{ width: 90, marginRight: 4, marginLeft: 4 }}
        >
          {L('Filter')}
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            this.setState({cityId:undefined},()=>{
              this.updateRestaurantsList(this.state.meta.pageSize,this.state.meta.skipCount);
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

  getColumnRateSearchProps = () => ({
    filterDropdown: ({ confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <div style={{ width: 220, marginBottom: 8, display: 'block' }}>
          <Input
            type="number"
            min={0}
            max={5}
            style={{ width: 106, margin:"0 4px",display: 'inline-block' }}
            placeholder={L('Min')}  
            onChange={(e: any) => {           
            this.setState({minRate:e.target.value });
          }}
          />
          <Input
            type="number"
            min={0}
            max={5}
            style={{ width: 106,display: 'inline-block' }}
            placeholder={L('Max')}  
            onChange={(e: any) => {           
            this.setState({maxRate:e.target.value });
          }}
          />
        </div>
        
        <Button
          type="primary"
          onClick={async () => {
            confirm();
            this.updateRestaurantsList(this.state.meta.pageSize,this.state.meta.skipCount);
          }}
         
          size="small"
          style={{ width: 106, marginRight: 4, marginLeft: 4 }}
        >
          {L('Filter')}
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            this.setState({minRate:undefined,maxRate:undefined},()=>{
              this.updateRestaurantsList(this.state.meta.pageSize,this.state.meta.skipCount);
            });
          }}
          size="small"
          style={{ width:  106}}
        >
          {L('ResetFilter')}
        </Button>
      </div>
    ),
    filterIcon: (filtered: any) => <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
  });

  onSwitchRestaurantActivation = async (restaurant: RestaurantDto) => {
    popupConfirm(async () => {
      if(restaurant.isActive)
      {await this.props.restaurantStore!.restaurantDeactivation({ id: restaurant.id });}
      else
      {await this.props.restaurantStore!.restaurantActivation({ id: restaurant.id });}
      await this.updateRestaurantsList(this.state.meta.pageSize,this.state.meta.skipCount);
    }, restaurant.isActive ? L('AreYouSureYouWantToDeactivateThisRestaurant') : L('AreYouSureYouWantToActivateThisRestaurant'));
  }

  assignNewSubscription = (restaurantId:number)=>{
    this.setState({assignNewSubscription:true,restaurantId});
  }

  assignNewSubscriptionAction =()=>{
    const form = this.assignSubscriptionFormRef.current;
    form!.validateFields().then(async (values: any) => {
      values.restaurantId=this.state.restaurantId;
      await this.props.subscriptionStore!.assignSubscriptionToUser(values as AssignSubscriptionToUserDto);
      this.setState({ assignNewSubscription: false});
      form!.resetFields();
    });

  }

  restaurantsTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
      sorter: (a:any, b:any) => a.id - b.id,

    },
    {
      title: L('Name'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a:any, b:any) =>a.name.localeCompare(b.name),

    },
  
    {
      title: L('Logo'),
      dataIndex: 'logo',
      key: 'logo',
      render: (logo: string, item: RestaurantDto) => {
        return (
          <div onClick={() => this.openImageModal(item.logo!, item.name)} style={{ display: 'inline-block', cursor: "zoom-in" }}>
            <Avatar shape='square' size={50} src={item.logo} />
          </div>
        );
      }
    },

    {
      title: L('PhoneNumber'),
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },

    {
      title: L('City'),
      dataIndex: 'cityId',
      key: 'cityId',
      render: (cityId: number,item :RestaurantDto) => {
        return item.city?.text;
      },
      ...this.getColumnCitySearchProps()

    },

    {
      title: L('TotalRate'),
      dataIndex: 'rate',
      key: 'rate',
      ...this.getColumnRateSearchProps(),
      sorter: (a:any, b:any) => a.rate - b.rate,

    },
    {
      title: L('ManagerName'),
      dataIndex: 'manager',
      key: 'manager',
      sorter: (a:any, b:any) =>a.manager?.name.localeCompare(b.manager?.name),

      render: (manager: any,item :RestaurantDto) => {
        return <a onClick={() => this.openManagerDetailsModal({ id: item.manager?.id })}>{item.manager?.name}</a>;
      }
    },
    {
      title: L('CreationDate'),
      dataIndex: 'creationTime',
      key: 'creationTime',
      sorter: (a:any, b:any) => a.creationTime - b.creationTime,

      render: (creationTime: string) => {
        return moment(creationTime).format(timingHelper.defaultDateFormat);
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
      render: (text: string, item: RestaurantDto) => (
        <div>
          <Dropdown
            trigger={['click']}
            overlay={(
              <Menu>
                <Menu.Item onClick={() => window.location.href=`/restaurant/${item.id}`}>
                  <EyeOutlined className="action-icon"  />
                  <button className="inline-action">{L('Details')}</button>
                </Menu.Item>
                <Menu.Item onClick={() => this.openRestaurantModal({ id: item.id })}>
                  <EditOutlined className="action-icon"  />
                  <button className="inline-action">{L('Edit')}</button>
                </Menu.Item>
                <Menu.Item onClick={() => this.onSwitchRestaurantActivation(item)}>
                  <CheckSquareOutlined className="action-icon" />
                  <button className="inline-action">{item.isActive ? L('Deactivate') : L('Activate')}</button>
                </Menu.Item>
                { this.state.permisssionGrantedForSubscription ? (
                  <Menu.Item onClick={() => this.assignNewSubscription(item.id)}>
                    <BranchesOutlined className="action-icon" />
                    <button className="inline-action">{L('AssignANewSubscription')}</button>
                  </Menu.Item>
              )
                :null}
              </Menu>
            )}
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
      this.updateRestaurantsList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateRestaurantsList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const {restaurants} = this.props.restaurantStore!;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.restaurantStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={(
          <div>
            <span>{L('Restaurants')}</span>
            <Button type="primary" style={{ float: localization.getFloat(), margin: '0 5px' }} icon={<PlusOutlined />} onClick={() => this.openRestaurantModal({ id: 0 })}>
              {L('AddRestaurant')}
            </Button>
           
            <a download="restaurants.xlsx" className="ant-btn ant-btn-default" style={{ float: localization.getFloat(), margin: '0 5px' }} id="export" href="#" onClick={()=>{return ExcellentExport.convert({ anchor: document.getElementById("export") as HTMLAnchorElement, filename: L("Restaurants"), format: 'xlsx'},[{name:L("Restaurants"), from: {table: document.getElementById("datatable") as HTMLTableElement}}]);}}><FileExcelOutlined /> { L('ExportToExcel')}</a>

          </div>
        )}
      >
        <SearchComponent
          searchText={L("SearchByNameCityIdPhoneManagerName")}
          onSearch={(value: string)=>{
          this.setState({keyword:value},()=>{
            this.updateRestaurantsList(this.state.meta.pageSize,this.state.meta.skipCount);
          });
        }}
        />
        <ImageModal
          isOpen={this.state.isImageModalOpened}
          caption={this.state.imageModalCaption}
          src={this.state.imageModalUrl}
          onClose={() => { this.closeImageModal(); }}
        />

        <table id="datatable" style={{display:'none'}}> 
          <thead>
            <tr>
              <td>{L('ID')}</td>
              <td>{L('Name')}</td>
              {/* <td>{L('Logo')}</td> */}
              <td>{L('PhoneNumber')}</td>
              <td>{L('City')}</td>
              <td>{L('TotalRate')}</td>
              <td>{L('ManagerName')}</td>
              <td>{L('CreationDate')}</td>
              <td>{L('Status')}</td>
            </tr>
          </thead>
          <tbody>
            {restaurants.length> 0 &&
    restaurants.map((restaurant:RestaurantDto,index:number)=>{
      return (
        <tr key={index}>
          <td>{restaurant.id}</td>
          <td>{restaurant.name}</td>
          {/* <td>{restaurant.logo? <img width="50" height="50" src={restaurant.logo}/> : ''}</td> */}
          <td>{restaurant.phoneNumber}</td>
          <td>{restaurant.city?.text}</td>
          <td>{restaurant.rate}</td>
          <td>{restaurant.manager?.name}</td>
          <td>{moment(restaurant.creationTime).format(timingHelper.defaultDateFormat)}</td>
          <td>{restaurant.isActive ? L('Active') : L('Inactive')}</td>
        </tr>
);
    })}
          </tbody>
        </table>


        <Table
          pagination={pagination}
          rowKey={record => `${record.id  }`}
          style={{ marginTop: '12px' }}
          loading={this.props.restaurantStore!.loadingRestaurants}
          dataSource={restaurants === undefined ? [] : restaurants}
          columns={this.restaurantsTableColumns}
        />

        <CreateOrUpdateRestaurant
          visible={this.state.restaurantModalVisible}
          onCancel={() =>
            this.setState({
              restaurantModalVisible: false,
            })}
          modalType={this.state.restaurantModalType}
          isSubmittingRestaurant={this.props.restaurantStore!.isSubmittingRestaurant}
          restaurantStore={this.props.restaurantStore}
        />

        <RestaurantManagerDetailsModal
          visible={this.state.managerDetailsModalVisible}
          onCancel={() =>
            this.setState({
              managerDetailsModalVisible: false,
            })}
          restaurantManagerStore={this.props.restaurantManagerStore!}
        />

        <Modal   
          visible={this.state.assignNewSubscription}
          title={L('AssignANewSubscription')}
          centered
          destroyOnClose
          maskClosable={false}
          className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
          onCancel={()=>{this.setState({assignNewSubscription:false})}}    
          footer={[
            <Button key="back" onClick={()=>{this.setState({assignNewSubscription:false})}}>
              {L('Cancel')}
            </Button>,
            <Button key="submit" type="primary" loading={this.props.subscriptionStore!.isSubmittingSubscription} onClick={this.assignNewSubscriptionAction}>
              {L('Assign')}
            </Button>,
    ]}
        >
          <Form ref={this.assignSubscriptionFormRef}>
            <Row>
              <Col {...colLayout}>
                <Form.Item
                  label={L("Subscription")}
                  name="subscriptionId"
                  {...formItemLayout}
                  colon={false}
                  rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                > 
                  <Select
                    showSearch
                    placeholder={L('PleaseSelectSubscription')}  
                    optionFilterProp="children"

                    filterOption={(input, option:any) =>
            option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {this.subscriptions.length > 0 && this.subscriptions.map((element: LiteEntityDto) => <Select.Option key={element.value} value={element.value}>{element.text}</Select.Option>)}

                  </Select>
                </Form.Item>
              </Col>

            </Row>
          </Form>
        </Modal>
  
      </Card>
    );
  }
}

export default Restaurants;
