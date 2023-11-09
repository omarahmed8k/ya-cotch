import * as React from 'react';
import { Tag,Tabs,Avatar,Select,Table,Button } from 'antd';
import { InfoCircleOutlined,SolutionOutlined,ArrowRightOutlined,ArrowLeftOutlined,FilterOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import ImageModal from '../../../components/ImageModal';
import { L } from '../../../i18next';
import AppComponentBase from '../../../components/AppComponentBase';
import "./index.css";
import localization from '../../../lib/localization';
import { TrainerDto } from '../../../services/trainers/dto/trainerDto';
import trainersService from '../../../services/trainers/trainersService';
import moment from 'moment';
import timingHelper from '../../../lib/timingHelper';
import UserStatus from '../../../services/types/userStatus';
import categoriesService from '../../../services/categories/categoriesService';
import CategoryType from '../../../services/types/categoryType';
import { LiteEntityDto } from '../../../services/dto/liteEntityDto';
import { CourseDto } from '../../../services/courses/dto/courseDto';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import Gender from '../../../services/types/gender';
import ThousandSeparator from '../../../components/ThousandSeparator';
import { PaymentDto } from '../../../services/payments/dto/paymentDto';
import PaymentMethod from '../../../services/types/paymentMethod';
import paymentsService from '../../../services/payments/paymentsService';

const { TabPane } = Tabs;

export interface ITrainerDetailsModalState{
  trainerModel:TrainerDto;
  isImageModalOpened: boolean;
  imageModalCaption: string;
  imageModalUrl: string;
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount:number;
  };
  isActiveFilter?:boolean;
  categoryId?:number;
  hasDiscount?:boolean;
  courses:Array<LiteEntityDto>;
  paymentsMeta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount:number;
  };
  payments:Array<PaymentDto>;
  paymentsTotalCount:number;
  method?:number;
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.CourseStore)
@observer
export class TrainerDetails extends AppComponentBase<any, ITrainerDetailsModalState> {

  categories:Array<LiteEntityDto>=[];

  state={
    trainerModel:{} as TrainerDto,
    isImageModalOpened: false,
    imageModalCaption: '',
    imageModalUrl: '',
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount:0
    },
    courses:[],
    isActiveFilter:undefined,
    categoryId:undefined,
    hasDiscount:undefined,
    paymentsMeta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount:0
    },
    payments:[],
    paymentsTotalCount:0,
    method:undefined
  }
  
  async updateCorsesList(maxResultCount: number, skipCount: number) {
    this.props.courseStore!.maxResultCount = maxResultCount;
    this.props.courseStore!.skipCount = skipCount;
    this.props.courseStore!.isActiveFilter = this.state.isActiveFilter;
    this.props.courseStore!.categoryId = this.state.categoryId;
    this.props.courseStore!.trainerId = this.state.trainerModel.id;
    this.props.courseStore!.hasDiscount = this.state.hasDiscount;

    await this.props.courseStore!.getCourses();
    this.setState({courses:this.props.courseStore?.courses});
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
            this.updateCorsesList(this.state.meta.pageSize,this.state.meta.skipCount);
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
              this.updateCorsesList(this.state.meta.pageSize,this.state.meta.skipCount);
            })
           
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
            this.updateCorsesList(this.state.meta.pageSize,this.state.meta.skipCount);
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
              this.updateCorsesList(this.state.meta.pageSize,this.state.meta.skipCount);
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

  getColumnHasDiscountSearchProps = () => ({
    filterDropdown: ({ confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Select
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          showSearch
          optionFilterProp="children"
          onChange={(value: any) => {
           
            this.setState({hasDiscount:value === 3 ? undefined : value === 1 ? true : false});
          }}
          value={this.state.hasDiscount=== undefined ? 3 : !this.state.hasDiscount ? 0 : 1}
        >
          <Select.Option key={1} value={1}>{L('Yes')}</Select.Option>
          <Select.Option key={0} value={0}>{L('No')}</Select.Option>
          <Select.Option key={3} value={3}>{L('All')}</Select.Option>
        </Select>
        <Button
          type="primary"
          onClick={async () => {
            confirm();
            this.updateCorsesList(this.state.meta.pageSize,this.state.meta.skipCount);
          }}
         
          size="small"
          style={{ width: 90, marginRight: 4, marginLeft: 4 }}
        >
          {L('Filter')}
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            this.setState({hasDiscount:undefined},()=>{
              this.updateCorsesList(this.state.meta.pageSize,this.state.meta.skipCount);
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

  coursesTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('Name'),
      dataIndex: 'name',
      key: 'name',
      render:(name:string,item:CourseDto)=>{
        return <a target="_blank" href={`/course/${item.id}`} rel="noopener noreferrer">{item.name}</a>;
      }
    },

    {
      title: L('Image'),
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl: string, item: CourseDto) => {
        return (
          <div onClick={() => this.openImageModal(item.imageUrl!, item.name)} style={{ display: 'inline-block', cursor: "zoom-in" }}>
            <Avatar shape='square' size={50} src={item.imageUrl} />
          </div>
        );
      }
    },
    {
      title: `${L('Fee')} (${L('SAR')})`,
      dataIndex: 'fee',
      key: 'fee',
      render:(fee:number)=>{
        return <ThousandSeparator number={fee} />;
      }
    },
    {
      title: L('HasDiscount'),
      dataIndex: 'hasDiscount',
      key: 'hasDiscount',
      render: (hasDiscount: boolean) => {
        return <Tag color={hasDiscount ? 'green' : 'volcano'} className='ant-tag-disable-pointer'>{hasDiscount ? L('Yes') : L('No')}</Tag>;
      },
      ...this.getColumnHasDiscountSearchProps()
    },
      {
        title: L('BookingRequestsCount'),
        dataIndex: 'bookingRequestsCount',
        key: 'bookingRequestsCount',
        sorter: (a:any, b:any) => a.bookingRequestsCount - b.bookingRequestsCount,

      },
      {
        title: L('CategoryName'),
        dataIndex: 'category',
        key: 'category',
        render:(category :any,item:CourseDto)=>{
          return item.category?.text;
        },
        sorter: (a:any, b:any) =>a.category.text.localeCompare(b.category.text),

        ...this.getColumnCategorySearchProps()
      },
      {
        title: L('ViewsCount'),
        dataIndex: 'viewsCount',
        key: 'viewsCount',
    sorter: (a:any, b:any) => a.viewsCount - b.viewsCount,
      },
    {
      title: L('IsActive'),
      dataIndex: 'isActive',
      key: 'isActive',
      ...this.getColumnStatusSearchProps(),
      render: (isActive: boolean) => {
        return <Tag color={isActive ? 'green' : 'volcano'} className='ant-tag-disable-pointer'>{isActive ? L('Active') : L('Inactive')}</Tag>;
      }
    },
 
  ];

  paginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.meta.pageSize = pageSize;
      this.setState(temp);
      this.updateCorsesList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateCorsesList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  resolveStatus(status: number){
    switch(status){
      case UserStatus.Active:
        return <Tag color={'success'} className='ant-tag-disable-pointer'>{L('Active')}</Tag>;
      case UserStatus.Blocked:
        return <Tag color={'volcano'} className='ant-tag-disable-pointer'>{L('Blocked')}</Tag>;
        case UserStatus.Inactive:
          return <Tag color={'warning'} className='ant-tag-disable-pointer'>{L('Inactive')}</Tag>;
    }
    return "";
  }
  openImageModal(image: string, caption: string) {
    this.setState({ isImageModalOpened: true, imageModalCaption: caption, imageModalUrl: image });
  }

  closeImageModal() {
    this.setState({ isImageModalOpened: false, imageModalCaption: '', imageModalUrl: '' });
  }
  
  async componentDidMount(){ 
    document.title= `${L("TrainerDetails")} | YaCotch `;   
    try {
         if(this.props.match.params.id){
          let id = this.props.match.params.id;
          let trainer = await trainersService.getTrainer({id:id});
          let result= await categoriesService.getAllLite({type:CategoryType.Courses});
          this.categories=result.items;
         
          this.setState({trainerModel: trainer},async()=>{
            await this.updateCorsesList(this.state.meta.pageSize, 0);
            await this.updatePaymentsList(this.state.paymentsMeta.pageSize, 0);

          });
        }
      } catch (e) {
        window.location.href = '/trainers';
      }
  }
  resolveGender= (gender: number) => {
    switch(gender){
      case Gender.Male:
        return <Tag color={'processing'} className='ant-tag-disable-pointer'>{L('Male')}</Tag>;
      case Gender.Female:
        return <Tag color={'processing'} className='ant-tag-disable-pointer'>{L('Female')}</Tag>;
   
    }
    return "";
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
  async updatePaymentsList(maxResultCount: number, skipCount: number) {
    let result = await paymentsService.getAll({
      trainerId:this.state.trainerModel.id,
      maxResultCount:maxResultCount,
      method:this.state.method,
      skipCount:skipCount
    });

    this.setState({payments:result.items,paymentsTotalCount:result.totalCount});
   }

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

  paymentsPaginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.paymentsMeta.pageSize = pageSize;
      this.setState(temp);
      this.updatePaymentsList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.paymentsMeta.page = page;
      this.setState(temp);
      await this.updatePaymentsList(this.state.paymentsMeta.pageSize, (page - 1) * this.state.paymentsMeta.pageSize);
    },
    pageSizeOptions: this.state.paymentsMeta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };


 render(){
   const {trainerModel,courses,payments}= this.state;
   const pagination = {
    ...this.paginationOptions,
    total: this.props.courseStore!.totalCount,
    current: this.state.meta.page,
    pageSize: this.state.meta.pageSize,
  };
  const paymentsPagination = {
    ...this.paymentsPaginationOptions,
    total: this.state.paymentsTotalCount,
    current: this.state.paymentsMeta.page,
    pageSize: this.state.paymentsMeta.pageSize,
  };
   return (
   <div className="trainer-page">
     <span className="back-button">
     {localization.isRTL() ? 
     <ArrowRightOutlined onClick={()=> window.location.href = '/trainers'} />
     :
     <ArrowLeftOutlined onClick={()=> window.location.href = '/trainers'} />
     }
     </span>
     
     <Tabs defaultActiveKey="1">
           <TabPane
             tab={
               <span>
                 <InfoCircleOutlined/>
                 {L('General')}
               </span>
             }
             key="1"
           >
       <div className="details-wrapper">
        <div className="detail-wrapper">
          <span className="detail-label">{L('Name')}</span>
          <span className="detail-value">{trainerModel !== undefined ? trainerModel.name : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Image')}</span>
          <span className="detail-value">{trainerModel !== undefined ?
          <div onClick={() => this.openImageModal(trainerModel.imageUrl!, trainerModel.name)} style={{ display: 'inline-block', cursor: "zoom-in" }}>
          <Avatar shape='square' size={50} src={trainerModel.imageUrl} />
        </div>: undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Email')}</span>
          <span className="detail-value">{trainerModel !== undefined ? trainerModel.emailAddress : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('PhoneNumber')}</span>
          <span className="detail-value">{trainerModel !== undefined ? trainerModel.phoneNumber : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Age')}</span>
          <span className="detail-value">{trainerModel !== undefined ?  trainerModel.age : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Gender')}</span>
          <span className="detail-value">{trainerModel !== undefined && trainerModel.gender!==undefined ? this.resolveGender(trainerModel.gender) :  L('NotAvailable')} </span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Address')}</span>
          <span className="detail-value">{trainerModel !== undefined && trainerModel.address ?  trainerModel.address : L('NotAvailable')}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Specialization')}</span>
          <span className="detail-value">{trainerModel !== undefined ? trainerModel.specialization?.text : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('CV')}</span>
          <span className="detail-value">{trainerModel !== undefined && trainerModel.cvUrl ? <a href={trainerModel.cvUrl} download>{L('DownloadCV')}</a> : L('NotAvailable')}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('YearsOfExperience')}</span>
          <span className="detail-value">{trainerModel !== undefined ? trainerModel.yearsOfExperience :  L('NotAvailable')} </span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('LastLoginDate')}</span>
          <span className="detail-value">{trainerModel !== undefined && trainerModel.lastLoginDate? moment(trainerModel.lastLoginDate).format(timingHelper.defaultDateFormat) :  L('NotAvailable')} </span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('CoursesCount')}</span>
          <span className="detail-value">{trainerModel !== undefined && trainerModel.coursesCount !== undefined? trainerModel.coursesCount :  L('NotAvailable')} </span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Status')}</span>
          <span className="detail-value">
          {trainerModel !== undefined ? this.resolveStatus(trainerModel.status) : undefined } 
          </span>

        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('VerifiedStatus')}</span>
          <span className="detail-value">
            <Tag color={trainerModel !== undefined && trainerModel.isVerified ? 'green' : 'volcano'} className='ant-tag-disable-pointer'>
              {trainerModel !== undefined && trainerModel.isVerified ? L('Verified') : L('NotVerified')}
            </Tag>
          </span>

        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Rate')}</span>
          <span className="detail-value">{trainerModel !== undefined && trainerModel.rate !== undefined? trainerModel.rate :  L('NotAvailable')} </span>
        </div>
       
     </div>  
       
    </TabPane>
    <TabPane
             tab={
               <span>
                 <SolutionOutlined/>
                 {L('Courses')}
               </span>
             }
             key="2"
           >
             <Table
          pagination={pagination}
          rowKey={record => record.id + ""}
          style={{ marginTop: '12px' }}
          loading={this.props.courseStore!.loadingCourses}
          dataSource={courses === undefined ? [] : courses}
          columns={this.coursesTableColumns}

        />
           </TabPane>
           <TabPane
             tab={
               <span>
                 <ShoppingCartOutlined/>
                 {L('Payments')}
               </span>
             }
             key="3"
           >
             <Table
          pagination={paymentsPagination}
          rowKey={record => record.id + ""}
          style={{ marginTop: '12px' }}
          dataSource={payments === undefined ? [] : payments}
          columns={this.paymentsTableColumns}

        />

           </TabPane>
   
           </Tabs>

           <ImageModal
          isOpen={this.state.isImageModalOpened}
          caption={this.state.imageModalCaption}
          src={this.state.imageModalUrl}
          onClose={() => { this.closeImageModal(); }} />

   </div>
   );
 }
}

export default TrainerDetails;
