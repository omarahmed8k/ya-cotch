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
import timingHelper from '../../lib/timingHelper';
import ThousandSeparator from '../../components/ThousandSeparator';
import CategoryStore from '../../stores/categoryStore';
import CategoryDetailsModal from '../Categories/components/categoryDetailsModal';
import ProductStore from '../../stores/productStore';
import { ProductDto } from '../../services/products/dto/productDto';
import CreateOrUpdateProduct from './components/createOrUpdateProduct';
import shopsService from '../../services/shops/shopsService';
import categoriesService from '../../services/categories/categoriesService';
import CategoryType from '../../services/types/categoryType';
import { LiteEntityDto } from '../../services/dto/liteEntityDto';

export interface IProductsProps {
  productStore?: ProductStore;
  categoryStore:CategoryStore;
}

export interface IProductsState {
  productModalVisible: boolean;
  productId:number;
  productModalId: number;
  productModalType: string;
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    skipCount:number;
    pageTotal: number;
    total: number;
  };
   categoryId?:number;
  shopId?:number;
  minPrice?:number;
  maxPrice?:number; 
  isActiveFilter?:boolean;
  keyword?:string;
  categoryDetailsModalVisible:boolean;
  categoryId2:number;
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.ProductStore,Stores.CategoryStore)
@observer
export class Products extends AppComponentBase<IProductsProps, IProductsState> {
  formRef = React.createRef<FormInstance>();
  shops:Array<LiteEntityDto>=[];
  categories:Array<LiteEntityDto>=[];
  state = {
    productModalVisible: false,
    productId:0,
    productModalId: 0,
    productModalType: 'create',
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
    shopId:undefined,
    minPrice:undefined,
    maxPrice:undefined,
    categoryDetailsModalVisible:false,
  categoryId2:0
  };

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
            this.updateProductsList(this.state.meta.pageSize,this.state.meta.skipCount);
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
              this.updateProductsList(this.state.meta.pageSize,this.state.meta.skipCount);
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
  async componentDidMount() {
    let result = await shopsService.getAllLite();
    this.shops=result.items;
    let result2 = await categoriesService.getAllLite({type:CategoryType.Products});
    this.categories=result2.items;
    this.updateProductsList(this.state.meta.pageSize, 0);
  }

  async openCategoryDetailsModal(entityDto: EntityDto) {
    await this.props.categoryStore!.getCategoryById(entityDto);
    this.setState({ categoryDetailsModalVisible: !this.state.categoryDetailsModalVisible, categoryId2: entityDto.id });
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
            this.updateProductsList(this.state.meta.pageSize,this.state.meta.skipCount);
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
              this.updateProductsList(this.state.meta.pageSize,this.state.meta.skipCount);
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

  getColumnShopSearchProps = () => ({
    filterDropdown: ({ confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Select
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          showSearch
          placeholder={L('PleaseSelectShop')}  
          optionFilterProp="children"
          filterOption={(input, option:any) =>
            option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          value={this.state.shopId}
          onChange={(value: any) => {           
            this.setState({shopId:value });
          }}>
          {this.shops.length>0 && this.shops.map((element:LiteEntityDto) => <Select.Option key={element.value} value={element.value}>{element.text}</Select.Option>)}
        
        
        </Select>
        <Button
          type="primary"
          onClick={async () => {
            confirm();
            this.updateProductsList(this.state.meta.pageSize,this.state.meta.skipCount);
          }}
         
          size="small"
          style={{ width: 90, marginRight: 4, marginLeft: 4 }}
        >
          {L('Filter')}
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            this.setState({shopId:undefined},()=>{
              this.updateProductsList(this.state.meta.pageSize,this.state.meta.skipCount);
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


  async updateProductsList(maxResultCount: number, skipCount: number) {
    this.props.productStore!.maxResultCount = maxResultCount;
    this.props.productStore!.skipCount = skipCount;
    this.props.productStore!.keyword = this.state.keyword;
    this.props.productStore!.isActiveFilter = this.state.isActiveFilter;
    this.props.productStore!.shopId = this.state.shopId;
    this.props.productStore!.maxPrice = this.state.maxPrice;
    this.props.productStore!.minPrice = this.state.minPrice;
    this.props.productStore!.categoryId = this.state.categoryId;

    this.props.productStore!.getProducts();
  }

  async openProductModal(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      this.props.productStore!.productModel=undefined;
      this.setState({ productModalType: 'create' }); 
    } else {
      await this.props.productStore!.getProduct(entityDto);
      this.setState({ productModalType: 'edit' });
    }
    this.setState({ productModalVisible: !this.state.productModalVisible, productModalId: entityDto.id });
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
            this.updateProductsList(this.state.meta.pageSize,this.state.meta.skipCount);
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
              this.updateProductsList(this.state.meta.pageSize,this.state.meta.skipCount);
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
  

  onSwitchProductActivation = async (dish: ProductDto) => {
    popupConfirm(async () => {
      if(dish.isActive)
      await this.props.productStore!.productDeactivation({ id: dish.id });
      else
      await this.props.productStore!.productActivation({ id: dish.id });
      await this.updateProductsList(this.state.meta.pageSize,this.state.meta.skipCount);
    }, dish.isActive ? L('AreYouSureYouWantToDeactivateThisProduct') : L('AreYouSureYouWantToActivateThisProduct'));
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
      title: L('ShopName'),
      dataIndex: 'shop',
      key: 'shop',
      render:(restaurantName:string,item:ProductDto)=>{
        return <a href={`/shop/${item.shop?.value}`} target="_blank">{item.shop?.text}</a>
      },
      ...this.getColumnShopSearchProps()
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
      ...this.getColumnPriceSearchProps(),
      render: (price: number) => {
        return <ThousandSeparator number={price} />;
      }
    },
    {
      title: L('CategoryName'),
      dataIndex: 'category',
      key: 'category',
      render: (category: any,item :ProductDto) => {
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
      render: (text: string, item: ProductDto) => (
        <div>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
                 <Menu.Item onClick={() => {window.location.href=`/product/${item.id}`}}>
                  <EyeOutlined className="action-icon"  />
                  <button className="inline-action">{L('Details')}</button>
                </Menu.Item>
                <Menu.Item onClick={() => this.openProductModal({ id: item.id })}>
                  <EditOutlined className="action-icon"  />
                  <button className="inline-action">{L('Edit')}</button>
                </Menu.Item>
                <Menu.Item onClick={() => this.onSwitchProductActivation(item)}>
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
      this.updateProductsList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateProductsList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const dishes = this.props.productStore!.products;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.productStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={
          <div>
            <span>{L('Products1')}</span>
            <Button type="primary" style={{ float: localization.getFloat(), margin: '0 5px' }} icon={<PlusOutlined/>} onClick={() => this.openProductModal({ id: 0 })}>
              {L('AddProduct')}
            </Button>
           
          </div>
        }
      >
           <SearchComponent
           searchText={L("SearchByIdName")}
        onSearch={(value: string)=>{
          this.setState({keyword:value},()=>{
            this.updateProductsList(this.state.meta.pageSize,this.state.meta.skipCount);
          });
        }}
        />
           
        <Table
          pagination={pagination}
          rowKey={record => record.id + ""}
          style={{ marginTop: '12px' }}
          loading={this.props.productStore!.loadingProducts}
          dataSource={dishes === undefined ? [] : dishes}
          columns={this.dishesTableColumns}
        />

        <CreateOrUpdateProduct
          visible={this.state.productModalVisible}
          onCancel={() =>
            this.setState({
              productModalVisible: false,
            })
          }
          gallery={this.props.productStore!.productModel?.images?this.props.productStore!.productModel!.images:[]}

          modalType={this.state.productModalType}
          isSubmittingProduct={this.props.productStore!.isSubmittingProduct}
          productStore={this.props.productStore!}
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

export default Products;
