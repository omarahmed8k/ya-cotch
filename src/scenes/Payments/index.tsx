import * as React from 'react';
import { Button, Card, Table, Tag,Select } from 'antd';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import { FileExcelOutlined, FilterOutlined} from '@ant-design/icons';
import moment from 'moment';
import timingHelper from '../../lib/timingHelper';
import SearchComponent from '../../components/SearchComponent';
import PaymentStore from '../../stores/paymentStore';
import PaymentMethod from '../../services/types/paymentMethod';
import { PaymentDto } from '../../services/payments/dto/paymentDto';
import ThousandSeparator from '../../components/ThousandSeparator';
import localization from '../../lib/localization';
import ExcellentExport from 'excellentexport';


export interface IPaymentsProps {
  paymentStore :PaymentStore;
}


export interface IPaymentsState {
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
  method?:PaymentMethod;
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.PaymentStore)
@observer
export class Payments extends AppComponentBase<IPaymentsProps, IPaymentsState> {


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
    method:undefined,
    };

  async componentDidMount() {
    this.updatePaymentsList(this.state.meta.pageSize, 0);
  }

 
  async updatePaymentsList(maxResultCount: number, skipCount: number) {
    this.props.paymentStore!.maxResultCount = maxResultCount;
    this.props.paymentStore!.skipCount = skipCount;
    this.props.paymentStore!.isActiveFilter =this.state.isActiveFilter;
    this.props.paymentStore!.keyword =this.state.keyword;
    this.props.paymentStore!.method =this.state.method;
    this.props.paymentStore!.getPayments();
  }
 
  getColumnMethodSearchProps = () => ({
    filterDropdown: ({ confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Select
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          showSearch
          optionFilterProp="children"
          onChange={(value: any) => {
           
            this.setState({method:value === 5 ? undefined : value });
          }}
          value={this.state.method=== undefined ? 5 : this.state.method}
        >
          <Select.Option key={0} value={0}>{L('Cash')}</Select.Option>
          <Select.Option key={1} value={1}>{L('CreditCard')}</Select.Option>
          <Select.Option key={2} value={2}>{L('ApplePay')}</Select.Option>
          <Select.Option key={3} value={3}>{L('Mada')}</Select.Option>
          <Select.Option key={4} value={4}>{L('STCPay')}</Select.Option>
          <Select.Option key={5} value={5}>{L('All')}</Select.Option>
          
        </Select>
        <Button
          type="primary"
          onClick={async () => {
            confirm();
            this.updatePaymentsList(this.state.meta.pageSize,this.state.meta.skipCount);
          }}
         
          size="small"
          style={{ width: 90, marginRight: 4, marginLeft: 4 }}
        >
          {L('Filter')}
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            this.setState({method:undefined},()=>{
              this.updatePaymentsList(this.state.meta.pageSize,this.state.meta.skipCount);
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


  paymentsTableColumns = [
    {
      title: L('TransactionId'),
      dataIndex: 'transactionId',
      key: 'transactionId',
    },
    {
      title: L('PaymentId'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('OrderNumber'),
      dataIndex: 'orderNumber',
      key: 'orderNumber',
    },
    {
      title: L('BookingRequestId'),
      dataIndex: 'bookingRequestId',
      key: 'bookingRequestId',
    },
    {
      title: L('Sender'),
      dataIndex: 'sender',
      key: 'sender',
      render:(sender:any,item:PaymentDto)=>{
        return item.sender?.text;
      }
    },
    {
      title: L('Receipt'),
      dataIndex: 'receipt',
      key: 'receipt',
      render:(receipt:any,item:PaymentDto)=>{
        return item.receipt?.text;
      }
    },
    {
      title: `${L('Amount')} (${L('SAR')})`,
      dataIndex: 'amount',
      key: 'amount',
      render:(amount:any)=>{
        return <ThousandSeparator number={amount} />;
      }
    },
    {
      title: L('PaymentMethod'),
      dataIndex: 'method',
      key: 'method',
      ...this.getColumnMethodSearchProps(),
      render:(paymentMethod:number)=>{
        let paymentMethodName=undefined;
        switch(paymentMethod){
          case PaymentMethod.ApplePay:
            paymentMethodName= L('ApplePay');
            break;
          case PaymentMethod.Cash:
            paymentMethodName= L('Cash');
            break;
          case PaymentMethod.CreditCard:
            paymentMethodName=L('CreditCard');
            break;
          case PaymentMethod.Mada:
            paymentMethodName =L('Mada');
            break;
          case PaymentMethod.STCPay:
            paymentMethodName= L('STCPay');
        }
        return <Tag color={'processing'} className='ant-tag-disable-pointer'>{ paymentMethodName}</Tag>;
      }
    },
    
    {
      title: L('CreationTime'),
      dataIndex: 'creationTime',
      key: 'creationTime',
      render:(creationTime:string)=>{
        return creationTime ? moment(creationTime).format(timingHelper.defaultDateTimeFormat):undefined;
      }
    },
  
  ];
  returnPaymentMethodName=(paymentMethod:number)=>{
    let paymentMethodName=undefined;
    switch(paymentMethod){
      case PaymentMethod.ApplePay:
        paymentMethodName= L('ApplePay');
        break;
      case PaymentMethod.Cash:
        paymentMethodName= L('Cash');
        break;
      case PaymentMethod.CreditCard:
        paymentMethodName=L('CreditCard');
        break;
      case PaymentMethod.Mada:
        paymentMethodName =L('Mada');
        break;
      case PaymentMethod.STCPay:
        paymentMethodName= L('STCPay');
    }
    return paymentMethodName;
  }
  paginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.meta.pageSize = pageSize;
      this.setState(temp);
      this.updatePaymentsList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updatePaymentsList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const payments = this.props.paymentStore!.payments;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.paymentStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={
          <div>
          <span>{L('Payments')}</span>         
          <a download="payments.xlsx" className="ant-btn ant-btn-default" style={{ float: localization.getFloat(), margin: '0 5px' }} id="export" href="#"  onClick={()=>{return ExcellentExport.convert({ anchor: document.getElementById("export") as HTMLAnchorElement, filename: L("Payments"), format: 'xlsx'},[{name:L("Payments"), from: {table: document.getElementById("datatable") as HTMLTableElement}}]);}}><FileExcelOutlined/> { L('ExportToExcel')}</a>

        </div>
        }
      >
                <SearchComponent
                searchText={L('SearchByTransactionIdPaymentIdReceiptNameSenderNameOrderNumberBookingRequestId')}
        onSearch={(value: string)=>{
          this.setState({keyword:value},()=>{
            this.updatePaymentsList(this.state.meta.pageSize,this.state.meta.skipCount);
          });
        }}
        />
        <Table
          pagination={pagination}
          rowKey={record => record.id + ""}
          style={{ marginTop: '12px' }}
          loading={this.props.paymentStore!.loadingPayments}
          dataSource={payments === undefined ? [] : payments}
          columns={this.paymentsTableColumns}

        />
<table id="datatable" style={{display:'none'}}> 
<thead>
<tr>
      <td>{L('TransactionId')}</td>
      <td>{L('PaymentId')}</td>
      <td>{L('OrderNumber')}</td>
      <td>{L('BookingRequestId')}</td>
      <td>{L('Sender')}</td>
      <td>{L('Receipt')}</td>
      <td>{`${L('Amount')} (${L('SAR')})`}</td>
      <td>{L('PaymentMethod')}</td>
      <td>{L('CreationDate')}</td>
    </tr>
</thead>
   <tbody>
    {payments.length> 0 &&
    payments.map((payment:PaymentDto,index:number)=>{
      return (<tr key={index}>
        <td>{payment.transactionId}</td>
      <td>{payment.id}</td>
      <td>{payment.orderNumber}</td>
      <td>{payment.bookingRequestId}</td>
      <td>{payment.sender?.text}</td>
      <td>{payment.receipt?.text}</td>
      <td><ThousandSeparator number={payment.amount} /></td>
      <td>{this.returnPaymentMethodName(payment.method)}</td>
      <td>{moment(payment.creationTime).format(timingHelper.defaultDateFormat)}</td>
    </tr>);
    })
    
    }
    </tbody>
</table>



      </Card>
    );
  }
}

export default Payments;
