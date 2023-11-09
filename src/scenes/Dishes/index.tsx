import * as React from 'react';
import { Button, Card, Dropdown, Menu, Table, Tag,Select,Input } from 'antd';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import { EntityDto } from '../../services/dto/entityDto';
import { popupConfirm } from '../../lib/popupMessages';
import SearchComponent from '../../components/SearchComponent';
import localization from '../../lib/localization';
import { EditOutlined,FilterOutlined,PlusOutlined,CaretDownOutlined,CheckSquareOutlined,EyeOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import moment from 'moment';
import CreateOrUpdateDish from './components/createOrUpdateDish';
import timingHelper from '../../lib/timingHelper';
import DishStore from '../../stores/dishStore';
import { DishDto } from '../../services/dishes/dto/dishDto';
import ThousandSeparator from '../../components/ThousandSeparator';
import CategoryStore from '../../stores/categoryStore';
import CategoryDetailsModal from '../Categories/components/categoryDetailsModal';
import { LiteEntityDto } from '../../services/dto/liteEntityDto';
import restaurantsService from '../../services/restaurants/restaurantsService';
import categoriesService from '../../services/categories/categoriesService';
import CategoryType from '../../services/types/categoryType';

export interface IDishesProps {
  dishStore?: DishStore;
  categoryStore:CategoryStore;
}

export interface IDishesState {
  dishModalVisible: boolean;
  dishId:number;
  dishModalId: number;
  dishModalType: string;
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    skipCount:number;
    pageTotal: number;
    total: number;
  };
   categoryId?:number;
  restaurantId?:number;
  minPrice?:number;
  maxPrice?:number; 
  isActiveFilter?:boolean;
  keyword?:string;
  categoryDetailsModalVisible:boolean;
  categoryId2:number;
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.DishStore,Stores.CategoryStore)
@observer
export class Dishes extends AppComponentBase<IDishesProps, IDishesState> {
  formRef = React.createRef<FormInstance>();
  restaurants:Array<LiteEntityDto>=[];
  categories:Array<LiteEntityDto>=[];
  state = {
    dishModalVisible: false,
    dishId:0,
    dishModalId: 0,
    dishModalType: 'create',
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      skipCount:0,
      pageTotal: 1,
      total: 0,
    },
    isActiveFilter:undefined,
    keyword:undefined,
    categoryId:undefined,
    restaurantId:undefined,
    minPrice:undefined,
    maxPrice:undefined,
    categoryDetailsModalVisible:false,
  categoryId2:0
  };

  async componentDidMount() {
    let result = await restaurantsService.getAllLite();
    this.restaurants=result.items;
    let result2 = await categoriesService.getAllLite({type:CategoryType.Dishes});
    this.categories=result2.items; 
    this.updateDishesList(this.state.meta.pageSize, 0);
  }

  async openCategoryDetailsModal(entityDto: EntityDto) {
    await this.props.categoryStore!.getCategoryById(entityDto);
    this.setState({ categoryDetailsModalVisible: !this.state.categoryDetailsModalVisible, categoryId2: entityDto.id });
  }

  getColumnPriceSearchProps = () => ({
    filterDropdown: ({ confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
         <div  style={{ width: 220, marginBottom: 8, display: 'block' }}>
         <Input
         type="number"
         min={0}
        
          style={{ width: 106, margin:"0 4px",display: 'inline-block' }}
          placeholder={L('From')}  
          onChange={(e: any) => {           
            this.setState({minPrice:e.target.value });
          }}
        />
        <Input
        type="number"
        min={0}
        
          style={{ width: 106,display: 'inline-block' }}
          placeholder={L('To')}  
          onChange={(e: any) => {           
            this.setState({maxPrice:e.target.value });
          }}
        />
         </div>
        
        <Button
          type="primary"
          onClick={async () => {
            confirm();
            this.updateDishesList(this.state.meta.pageSize,this.state.meta.skipCount);
          }}
         
          size="small"
          style={{ width: 106, marginRight: 4, marginLeft: 4 }}
        >
          {L('Filter')}
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            this.setState({minPrice:undefined,maxPrice:undefined},()=>{
              this.updateDishesList(this.state.meta.pageSize,this.state.meta.skipCount);
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

  async updateDishesList(maxResultCount: number, skipCount: number) {
    this.props.dishStore!.maxResultCount = maxResultCount;
    this.props.dishStore!.skipCount = skipCount;
    this.props.dishStore!.keyword = this.state.keyword;
    this.props.dishStore!.isActiveFilter = this.state.isActiveFilter;
    this.props.dishStore!.restaurantId = this.state.restaurantId;
    this.props.dishStore!.maxPrice = this.state.maxPrice;
    this.props.dishStore!.minPrice = this.state.minPrice;
    this.props.dishStore!.categoryId = this.state.categoryId;

    this.props.dishStore!.getDishes();
  }

  async openDishModal(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      this.props.dishStore!.dishModel=undefined;
      this.setState({ dishModalType: 'create' }); 
    } else {
      await this.props.dishStore!.getDish(entityDto);
      this.setState({ dishModalType: 'edit' });
    }
    this.setState({ dishModalVisible: !this.state.dishModalVisible, dishModalId: entityDto.id });
  }
  

  getColumnCategorySearchProps = () => ({
    filterDropdown: ({ confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Select
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          showSearch
          placeholder={L('PleaseSelectCategory')}  
          optionFilterProp="children"
          filterOption={(input, option:any) =>
            option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          value={this.state.categoryId}
          onChange={(value: any) => {           
            this.setState({categoryId:value });
          }}>
          {this.categories.length>0 && this.categories.map((element:LiteEntityDto) => <Select.Option key={element.value} value={element.value}>{element.text}</Select.Option>)}
        
        
        </Select>
        <Button
          type="primary"
          onClick={async () => {
            confirm();
            this.updateDishesList(this.state.meta.pageSize,this.state.meta.skipCount);
          }}
         
          size="small"
          style={{ width: 90, marginRight: 4, marginLeft: 4 }}
        >
          {L('Filter')}
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            this.setState({categoryId:undefined},()=>{
              this.updateDishesList(this.state.meta.pageSize,this.state.meta.skipCount);
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

  getColumnRestaurantSearchProps = () => ({
    filterDropdown: ({ confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Select
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          showSearch
          placeholder={L('PleaseSelectRestaurant')}  
          optionFilterProp="children"
          filterOption={(input, option:any) =>
            option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          value={this.state.restaurantId}
          onChange={(value: any) => {           
            this.setState({restaurantId:value });
          }}>
          {this.restaurants.length>0 && this.restaurants.map((element:LiteEntityDto) => <Select.Option key={element.value} value={element.value}>{element.text}</Select.Option>)}
        
        
        </Select>
        <Button
          type="primary"
          onClick={async () => {
            confirm();
            this.updateDishesList(this.state.meta.pageSize,this.state.meta.skipCount);
          }}
         
          size="small"
          style={{ width: 90, marginRight: 4, marginLeft: 4 }}
        >
          {L('Filter')}
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            this.setState({restaurantId:undefined},()=>{
              this.updateDishesList(this.state.meta.pageSize,this.state.meta.skipCount);
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
            this.updateDishesList(this.state.meta.pageSize,this.state.meta.skipCount);
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
              this.updateDishesList(this.state.meta.pageSize,this.state.meta.skipCount);
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
  

  onSwitchDishActivation = async (dish: DishDto) => {
    popupConfirm(async () => {
      if(dish.isActive)
      await this.props.dishStore!.dishDeactivation({ id: dish.id });
      else
      await this.props.dishStore!.dishActivation({ id: dish.id });
      await this.updateDishesList(this.state.meta.pageSize,this.state.meta.skipCount);
    }, dish.isActive ? L('AreYouSureYouWantToDeactivateThisDish') : L('AreYouSureYouWantToActivateThisDish'));
  }


  dishesTableColumns = [
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
      title: L('RestaurantName'),
      dataIndex: 'restaurant',
      key: 'restaurant',
      render:(restaurantName:string,item:DishDto)=>{
        return <a href={`/restaurant/${item.restaurant?.value}`} target="_blank">{item.restaurant?.text}</a>
      },
      ...this.getColumnRestaurantSearchProps()
    },
  
    {
      title: L('TotalRate'),
      dataIndex: 'rate',
      key: 'rate',
      sorter: (a:any, b:any) => a.rate - b.rate,
    },
    {
      title: `${L('Price')} (${L('SAR')})`,
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => {
        return <ThousandSeparator number={price} />;
      },
      ...this.getColumnPriceSearchProps()
    },
    {
      title: L('CategoryName'),
      dataIndex: 'category',
      key: 'category',
      render: (category: any,item :DishDto) => {
        return  <a onClick={() => this.openCategoryDetailsModal({ id: item.category?.value })}>{item.category?.text}</a>;
      },
      ...this.getColumnCategorySearchProps()
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
      render: (text: string, item: DishDto) => (
        <div>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
                 <Menu.Item onClick={() => {window.location.href=`/dish/${item.id}`}}>
                  <EyeOutlined className="action-icon"  />
                  <button className="inline-action">{L('Details')}</button>
                </Menu.Item>
                <Menu.Item onClick={() => this.openDishModal({ id: item.id })}>
                  <EditOutlined className="action-icon"  />
                  <button className="inline-action">{L('Edit')}</button>
                </Menu.Item>
                <Menu.Item onClick={() => this.onSwitchDishActivation(item)}>
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
      this.updateDishesList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateDishesList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const dishes = this.props.dishStore!.dishes;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.dishStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={
          <div>
            <span>{L('Dishes1')}</span>
            <Button type="primary" style={{ float: localization.getFloat(), margin: '0 5px' }} icon={<PlusOutlined/>} onClick={() => this.openDishModal({ id: 0 })}>
              {L('AddDish')}
            </Button>
           
          </div>
        }
      >
           <SearchComponent
           searchText={L("SearchByIdName")}
        onSearch={(value: string)=>{
          this.setState({keyword:value},()=>{
            this.updateDishesList(this.state.meta.pageSize,this.state.meta.skipCount);
          });
        }}
        />
           
        <Table
          pagination={pagination}
          rowKey={record => record.id + ""}
          style={{ marginTop: '12px' }}
          loading={this.props.dishStore!.loadingDishes}
          dataSource={dishes === undefined ? [] : dishes}
          columns={this.dishesTableColumns}
        />

        <CreateOrUpdateDish
          visible={this.state.dishModalVisible}
          onCancel={() =>
            this.setState({
              dishModalVisible: false,
            })
          }
          gallery={this.props.dishStore!.dishModel?.images?this.props.dishStore!.dishModel!.images:[]}

          modalType={this.state.dishModalType}
          isSubmittingDish={this.props.dishStore!.isSubmittingDish}
          dishStore={this.props.dishStore!}
        />

       
<CategoryDetailsModal
          visible={this.state.categoryDetailsModalVisible}
          onCancel={() =>
            this.setState({
              categoryDetailsModalVisible: false,
            })
          }
          categoryStore={this.props.categoryStore!}
        />

      </Card>
    );
  }
}

export default Dishes;
