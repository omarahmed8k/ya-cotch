import * as React from 'react';
import { Button, Card, Table, Tag,Select } from 'antd';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import SearchComponent from '../../components/SearchComponent';
import { FilterOutlined,EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import timingHelper from '../../lib/timingHelper';
import { LiteEntityDto } from '../../services/dto/liteEntityDto';
import OrderStore from '../../stores/orderStore';
import OrderStatus from '../../services/types/orderStatus';
import { OrderDto } from '../../services/orders/dto/orderDto';
import shopsService from '../../services/shops/shopsService';

export interface IShopOrdersProps {
  orderStore?: OrderStore;
}

export interface IShopOrdersState {

  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    skipCount:number;
    pageTotal: number;
    total: number;
  };
  shopId?:number;
  status?:OrderStatus;
  keyword?:string;
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.OrderStore)
@observer
export class ShopOrders extends AppComponentBase<IShopOrdersProps, IShopOrdersState> {
  shops:Array<LiteEntityDto>=[];
  state = {
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      skipCount:0,
      pageTotal: 1,
      total: 0,
    },
    status:undefined,
    keyword:undefined,
    shopId:undefined,
  };

  async componentDidMount() {
    let result = await shopsService.getAllLite();
    this.shops=result.items;
    this.updateOrdersList(this.state.meta.pageSize, 0);
  }


  async updateOrdersList(maxResultCount: number, skipCount: number) {
    this.props.orderStore!.maxResultCount = maxResultCount;
    this.props.orderStore!.skipCount = skipCount;
    this.props.orderStore!.keyword = this.state.keyword;
    this.props.orderStore!.status = this.state.status;
    this.props.orderStore!.shopId = this.state.shopId;
    this.props.orderStore!.isFromRestaurants = false;
    await this.props.orderStore!.getOrders();
  }

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
            this.updateOrdersList(this.state.meta.pageSize,this.state.meta.skipCount);
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
              this.updateOrdersList(this.state.meta.pageSize,this.state.meta.skipCount);
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
           
            this.setState({status:value === 6 ? undefined : value });
          }}
          value={this.state.status=== undefined ? 6 : this.state.status}
        >
          <Select.Option key={0} value={0}>{L('Pending')}</Select.Option>
          <Select.Option key={1} value={1}>{L('Approved')}</Select.Option>
          <Select.Option key={2} value={2}>{L('Rejected')}</Select.Option>
          <Select.Option key={3} value={3}>{L('Paid')}</Select.Option>
          <Select.Option key={4} value={4}>{L('Cancelled')}</Select.Option>
          <Select.Option key={5} value={5}>{L('Delivered')}</Select.Option>
          <Select.Option key={6} value={6}>{L('All')}</Select.Option>

        </Select>
        <Button
          type="primary"
          onClick={async () => {
            confirm();
            this.updateOrdersList(this.state.meta.pageSize,this.state.meta.skipCount);
          }}
         
          size="small"
          style={{ width: 90, marginRight: 4, marginLeft: 4 }}
        >
          {L('Filter')}
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            this.setState({status:undefined},()=>{
              this.updateOrdersList(this.state.meta.pageSize,this.state.meta.skipCount);
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
  


  ordersTableColumns = [
    {
      title: L('Number'),
      dataIndex: 'number',
      key: 'number',
      sorter: (a:any, b:any) => a.number - b.number,

    },
    {
      title: L('ShopName'),
      dataIndex: 'shop',
      key: 'shop',
      render:(shopName:string,item:OrderDto)=>{
        return <a href={`/shop/${item.shop?.value}`} target="_blank">{item.shop?.text}</a>
      },
      ...this.getColumnShopSearchProps()
    },
    {
      title: L('TraineeName'),
      dataIndex: 'name',
      key: 'name',
      render:(name:string,item:OrderDto)=>{
        return item.trainee?.name;
      }
    },
    {
      title: L('TraineePhoneNumber'),
      dataIndex: 'name',
      key: 'name',
      render:(name:string,item:OrderDto)=>{
        return item.trainee?.phoneNumber;
      }
    },
    {
      title: L('CreationTime'),
      dataIndex: 'creationTime',
      key: 'creationTime',
      sorter: (a:any, b:any) => a.creationTime - b.creationTime,

      render: (creationTime: string) => {
        return moment(creationTime).format(timingHelper.defaultDateTimeFormat);
      }
    },
    {
      title: L('Status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => {
        let StatusName=undefined;
        switch(status){
          case OrderStatus.Approved:
            StatusName= L('Approved');
            break;
          case OrderStatus.Cancelled:
            StatusName= L('Cancelled');
            break;
          case OrderStatus.Delivered:
            StatusName=L('Delivered');
            break;
          case OrderStatus.Paid:
            StatusName =L('Paid');
            break;
            case OrderStatus.Rejected:
              StatusName =L('Rejected');
              break;
          case OrderStatus.Pending:
            StatusName= L('Pending');
        }
        return <Tag color={'processing'} className='ant-tag-disable-pointer'>{ StatusName}</Tag>;
           },
      ...this.getColumnStatusSearchProps()
    },
    {
      title: L('Action'),
      key: 'action',
      render: (text: string, item: OrderDto) => (
        <div>
         <div onClick={() => {window.location.href=`/order/${item.id}`}}>
                  <EyeOutlined className="action-icon"  />
                  
                </div>
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
      this.updateOrdersList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateOrdersList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const orders = this.props.orderStore!.orders;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.orderStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={
          <div>
            <span>{L('Orders1')}</span>
           
          </div>
        }
      >
           <SearchComponent
           searchText={L("SearchByNumberTraineeNameTraineePhone")}
        onSearch={(value: string)=>{
          this.setState({keyword:value},()=>{
            this.updateOrdersList(this.state.meta.pageSize,this.state.meta.skipCount);
          });
        }}
        />
           
        <Table
          pagination={pagination}
          rowKey={record => record.id + ""}
          style={{ marginTop: '12px' }}
          loading={this.props.orderStore!.loadingOrders}
          dataSource={orders === undefined ? [] : orders}
          columns={this.ordersTableColumns}
        />

    
      </Card>
    );
  }
}

export default ShopOrders;
