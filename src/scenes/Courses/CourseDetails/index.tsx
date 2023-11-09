import * as React from 'react';
import { Tag,Avatar,Tabs,Table,Dropdown,Menu,Select,Button } from 'antd';
import { InfoCircleOutlined,RiseOutlined,ArrowRightOutlined,CaretDownOutlined,FilterOutlined,ArrowLeftOutlined,EyeOutlined, CommentOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import ImageModal from '../../../components/ImageModal';
import timingHelper from '../../../lib/timingHelper';
import moment from 'moment';
import { L } from '../../../i18next';
import AppComponentBase from '../../../components/AppComponentBase';
import "./index.css";
import localization from '../../../lib/localization';
import { CourseDto } from '../../../services/courses/dto/courseDto';
import coursesService from '../../../services/courses/coursesService';
import { EntityDto } from '../../../services/dto/entityDto';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import BookingRequestStatus from '../../../services/types/bookingRequestStatus';
import { BookingRequestsDto } from '../../../services/bookingRequests/dto/bookingRequestsDto';
import BookingRequestDetailsModal from '../../BookingRequests/components/bookingRequestDetailsModal';
import { ReviewDto } from '../../../services/reviews/dto/reviewDto';
import reviewsService from '../../../services/reviews/reviewsService';
import ReviewRefType from '../../../services/types/reviewRefType';
import { popupConfirm } from '../../../lib/popupMessages';
import ThousandSeparator from '../../../components/ThousandSeparator';
import { PaymentDto } from '../../../services/payments/dto/paymentDto';
import paymentsService from '../../../services/payments/paymentsService';
import PaymentMethod from '../../../services/types/paymentMethod';


const { TabPane } = Tabs;


export interface ICourseDetailsModalState{
  courseModel:CourseDto;
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
  reviewsMeta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount:number;
  };
  bookingRequests:Array<BookingRequestsDto>;
  status?:BookingRequestStatus;
  bookingRequestDetailsModalVisible: boolean;
  reviews:Array<ReviewDto>;
  reviewsTotalCount:number;
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

@inject(Stores.BookingRequestStore)
@observer
export class CourseDetails extends AppComponentBase<any, ICourseDetailsModalState> {

  async openBookingRequestDetailsModal(entityDto: EntityDto) {
    await this.props.bookingRequestStore!.getBookingRequest(entityDto);
    this.setState({ bookingRequestDetailsModalVisible: !this.state.bookingRequestDetailsModalVisible });
  }

  state={
    courseModel:{} as CourseDto,
    bookingRequests:[],
    isImageModalOpened: false,
    imageModalCaption: '',
    imageModalUrl: '',
    status:undefined,
    bookingRequestDetailsModalVisible: false,
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount:0
    },
    reviewsMeta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount:0
    },
    reviews:[],
    reviewsTotalCount:0,
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
  
  openImageModal(image: string, caption: string) {
    this.setState({ isImageModalOpened: true, imageModalCaption: caption, imageModalUrl: image });
  }

  closeImageModal() {
    this.setState({ isImageModalOpened: false, imageModalCaption: '', imageModalUrl: '' });
  }
  
  async componentDidMount(){ 
    document.title= `${L("CourseDetails")} | YaCotch `;   
    try {
         if(this.props.match.params.id){
          let id = this.props.match.params.id;
          let course = await coursesService.getCourse({id:id});
          this.setState({courseModel: course},async()=>{
            await this.updateBookingRequestsList(this.state.meta.pageSize, 0);
            await this.updateReviewsList(this.state.reviewsMeta.pageSize, 0);
            await this.updatePaymentsList(this.state.paymentsMeta.pageSize, 0);

          });
        }
      } catch (e) {
        window.location.href = '/courses';
      }
  }

  getColumnStatusSearchProps = () => ({
    filterDropdown: ({ confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Select
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          showSearch
          optionFilterProp="children"
          onChange={(value: any) => {
           
            this.setState({status:value === 5 ? undefined : value });
          }}
          value={this.state.status=== undefined ? 5 : this.state.status}
        >
          <Select.Option key={0} value={0}>{L('Pending')}</Select.Option>
          <Select.Option key={1} value={1}>{L('Approved')}</Select.Option>
          <Select.Option key={2} value={2}>{L('Rejected')}</Select.Option>
          <Select.Option key={3} value={3}>{L('Paid')}</Select.Option>
          <Select.Option key={4} value={4}>{L('Cancelled')}</Select.Option>
          <Select.Option key={5} value={5}>{L('All')}</Select.Option>
         
        </Select>
        <Button
          type="primary"
          onClick={async () => {
            confirm();
            this.updateBookingRequestsList(this.state.meta.pageSize,this.state.meta.skipCount);
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
              this.updateBookingRequestsList(this.state.meta.pageSize,this.state.meta.skipCount);
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

   
  async updateBookingRequestsList(maxResultCount: number, skipCount: number) {
    this.props.bookingRequestStore!.maxResultCount = maxResultCount;
    this.props.bookingRequestStore!.skipCount = skipCount;
    this.props.bookingRequestStore!.status =this.state.status;
    this.props.bookingRequestStore!.courseId =this.state.courseModel.id;
    await this.props.bookingRequestStore!.getBookingRequests();
    this.setState({bookingRequests:this.props.bookingRequestStore!.bookingRequests});
  }

  
  onSwitchReviewStatus = async (review: ReviewDto) => {
    popupConfirm(async () => {
      if(review.isHidden)
      await reviewsService.showReview({ id: review.id });
      else
      await reviewsService.hideReview({ id: review.id });
      await this.updateReviewsList(this.state.reviewsMeta.pageSize,this.state.reviewsMeta.skipCount);

    }, review.isHidden ? L('AreYouSureYouWantToShowThisReview') : L('AreYouSureYouWantToHideThisReview'));
  }

  async updateReviewsList(maxResultCount: number, skipCount: number) {
    let result = await reviewsService.getAll({
      refType:ReviewRefType.Course,
      maxResultCount:maxResultCount,
      skipCount:skipCount
    });

    this.setState({reviews:result.items,reviewsTotalCount:result.totalCount});
   }

  bookingRequestsTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
      sorter: (a:any, b:any) => a.id - b.id,

    },
    {
      title: L('TraineeName'),
      dataIndex: 'trainee',
      key: 'trainee',
      render:(trainee:any,item:BookingRequestsDto)=>{
        return <a href={`/trainee/${item.trainee.id}`} target="_blank" rel="noopener noreferrer">{item.trainee?.name}</a>;
      }
    },
    {
      title: L('TraineePhoneNumber'),
      dataIndex: 'trainee',
      key: 'trainee',
      render:(trainee:any,item:BookingRequestsDto)=>{
        return item.trainee?.phoneNumber;
      }
    },
   
    { 
      title: L('CreationDate'),
      dataIndex: 'creationTime',
      key: 'creationTime',
      sorter: (a:any, b:any) => a.creationTime - b.creationTime,

      render:(creationTime:string)=>{
        return creationTime ? moment(creationTime).format(timingHelper.defaultDateTimeFormat):undefined;
      }
    },
      
    {
      title: L('Status'),
      dataIndex: 'status',
      key: 'status',
      ...this.getColumnStatusSearchProps(),
      render: (status: number) => {
        switch(status){
          case BookingRequestStatus.Approved:
            return <Tag color={'green'} className='ant-tag-disable-pointer'>{L('Approved')}</Tag>;
          case BookingRequestStatus.Cancelled:
            return <Tag color={'volcano'} className='ant-tag-disable-pointer'>{L('Cancelled')}</Tag>;
          case BookingRequestStatus.Paid:
            return <Tag color={'green'} className='ant-tag-disable-pointer'>{L('Paid')}</Tag>;
          case BookingRequestStatus.Pending:
            return <Tag color={'warning'} className='ant-tag-disable-pointer'>{L('Pending')}</Tag>;
          case BookingRequestStatus.Rejected:
            return <Tag color={'volcano'} className='ant-tag-disable-pointer'>{L('Rejected')}</Tag>;
          }
        return '';      
      },
    },
    {
      title: L('Action'),
      key: 'action',
      width: '10%',
      render: (text: string, item: BookingRequestsDto) => (
        <div>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
                  <Menu.Item onClick={() => this.openBookingRequestDetailsModal({ id: item.id})}>
                  <EyeOutlined className="action-icon"  />
                  <button className="inline-action">{L('Details')}</button>
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


  reviewsTableColumns = [
    {
      title: L('ReviewerName'),
      dataIndex: 'reviewer',
      key: 'reviewer',
      render:(reviewer:any,item:ReviewDto)=>{
        return <a href={`/trainee/${item.reviewer.value}`} target="_blank" rel="noopener noreferrer">{item.reviewer?.text}</a>;
      }
    },
    {
      title: L('Image'),
      dataIndex: 'reviewer',
      key: 'reviewer',
      render:(reviewer:any,item:ReviewDto)=>{
        return (
          <div onClick={() => this.openImageModal(item.reviewer?.imageUrl!, item.reviewer?.text)} style={{ display: 'inline-block', cursor: "zoom-in" }}>
            <Avatar shape='square' size={50} src={item.reviewer?.imageUrl} />
          </div>
        );
      }
    },
    {
      title: L('Rate'),
      dataIndex: 'rate',
      key: 'rate',
    },

    {
      title: L('Comment'),
      dataIndex: 'comment',
      key: 'comment',
      
    },
   
    {
      title: L('CreationDate'),
      dataIndex: 'creationTime',
      key: 'creationTime',

      render:(creationTime:string)=>{
        return creationTime ? moment(creationTime).format(timingHelper.defaultDateTimeFormat):undefined;
      }
    },
      
    {
      title: L('Status'),
      dataIndex: 'isHidden',
      key: 'isHidden',
      render: (isHidden: boolean) => {
        return <Tag color={isHidden ? 'warning' : 'green'} className='ant-tag-disable-pointer'>{isHidden ? L('Hidden') : L('Shown')}</Tag>;
     
      },
    },
    {
      title: L('Action'),
      key: 'action',
      width: '10%',
      render: (text: string, item: ReviewDto) => (
        <div>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
                  <Menu.Item onClick={() => this.onSwitchReviewStatus(item)}>
                  <EyeOutlined className="action-icon"  />
                  <button className="inline-action">{item.isHidden ? L('Show'): L('Hide')}</button>
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
      this.updateBookingRequestsList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateBookingRequestsList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  reviewsPaginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.reviewsMeta.pageSize = pageSize;
      this.setState(temp);
      this.updateReviewsList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.reviewsMeta.page = page;
      this.setState(temp);
      await this.updateReviewsList(this.state.reviewsMeta.pageSize, (page - 1) * this.state.reviewsMeta.pageSize);
    },
    pageSizeOptions: this.state.reviewsMeta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

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
      courseId:this.state.courseModel.id,
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
   const {courseModel,reviews,payments,bookingRequests}= this.state;
   const pagination = {
    ...this.paginationOptions,
    total: this.props.bookingRequestStore!.totalCount,
    current: this.state.meta.page,
    pageSize: this.state.meta.pageSize,
  };
  const reviewsPagination = {
    ...this.reviewsPaginationOptions,
    total: this.state.reviewsTotalCount,
    current: this.state.reviewsMeta.page,
    pageSize: this.state.reviewsMeta.pageSize,
  };
  const paymentsPagination = {
    ...this.paymentsPaginationOptions,
    total: this.state.paymentsTotalCount,
    current: this.state.paymentsMeta.page,
    pageSize: this.state.paymentsMeta.pageSize,
  };
   return (
   <div className="course-page">
     <span className="back-button">
     {localization.isRTL() ? 
     <ArrowRightOutlined onClick={()=> window.location.href = '/courses'} />
     :
     <ArrowLeftOutlined onClick={()=> window.location.href = '/courses'} />
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
          <span className="detail-label">{L('ID')}</span>
          <span className="detail-value">{courseModel !== undefined ? courseModel.id : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Image')}</span>
          <span className="detail-value">{courseModel !== undefined ?
          <div onClick={() => this.openImageModal(courseModel.imageUrl!, courseModel.name)} style={{ display: 'inline-block', cursor: "zoom-in" }}>
          <Avatar shape='square' size={50} src={courseModel.imageUrl} />
        </div>: undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('ArName')}</span>
          <span className="detail-value">{courseModel !== undefined ? courseModel.arName : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('EnName')}</span>
          <span className="detail-value">{courseModel !== undefined ? courseModel.enName : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('ArDescription')}</span>
          <span className="detail-value">{courseModel !== undefined && courseModel.arDescription ? courseModel.arDescription : L("NotAvailable")}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('EnDescription')}</span>
          <span className="detail-value">{courseModel !== undefined && courseModel.enDescription ? courseModel.enDescription : L("NotAvailable")}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Category')}</span>
          <span className="detail-value">{courseModel !== undefined ? courseModel.category?.text : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Fee')}</span>
          <span className="detail-value">{courseModel !== undefined && courseModel.fee!== undefined ? <ThousandSeparator number={courseModel.fee} currency={L('SAR')} /> : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Trainer')}</span>
          <span className="detail-value">{courseModel !== undefined ? 
          <a href={`/trainer/${courseModel.trainer?.value}`} target="_blank" rel="noopener noreferrer">{courseModel.trainer?.text}</a> : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('TrainerImage')}</span>
          <span className="detail-value">{courseModel !== undefined ? 
          <div onClick={() => this.openImageModal(courseModel.trainer?.imageUrl!, courseModel.trainer?.text)} style={{ display: 'inline-block', cursor: "zoom-in" }}>
          <Avatar shape='square' size={50} src={courseModel.trainer?.imageUrl} />
        </div> : undefined}</span>
        </div>
      
        <div className="detail-wrapper">
          <span className="detail-label">{L('TrainingHoursCount')}</span>
          <span className="detail-value">{courseModel !== undefined ? courseModel.trainingHoursCount : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('TraineesCount')}</span>
          <span className="detail-value">{courseModel !== undefined ? courseModel.traineesCount : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('HasDiscount')}</span>
          <span className="detail-value">
            <Tag color={courseModel !== undefined && courseModel.hasDiscount ? 'green' : 'volcano'} className='ant-tag-disable-pointer'>
              {courseModel !== undefined && courseModel.hasDiscount ? L('Yes') : L('No')}
            </Tag>
          </span>
        </div>
        
        {courseModel !== undefined && courseModel.hasDiscount && (
          <div className="detail-wrapper">
          <span className="detail-label">{L('DiscountPercentage')}</span>
          <span className="detail-value">{courseModel !== undefined ? courseModel.discountPercentage+'%' : undefined}</span>
        </div>
        )}

        <div className="detail-wrapper">
          <span className="detail-label">{L('BookingRequestsCount')}</span>
          <span className="detail-value">{courseModel !== undefined ? courseModel.bookingRequestsCount : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('ViewsCount')}</span>
          <span className="detail-value">{courseModel !== undefined ? courseModel.viewsCount : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('CreatedBy')}</span>
          <span className="detail-value">{courseModel !== undefined ? courseModel.createdBy : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('CreationDate')}</span>
          <span className="detail-value">{courseModel !== undefined ? moment(courseModel.creationTime).format(timingHelper.defaultDateFormat) : undefined}</span>
        </div>
        
        <div className="detail-wrapper">
          <span className="detail-label">{L('IsActive')}</span>
          <span className="detail-value">
            <Tag color={courseModel !== undefined && courseModel.isActive ? 'green' : 'volcano'} className='ant-tag-disable-pointer'>
              {courseModel !== undefined && courseModel.isActive ? L('Active') : L('Inactive')}
            </Tag>
          </span>

        </div>

     
       
     </div>  
         
    </TabPane>
    <TabPane
             tab={
               <span>
                 <RiseOutlined/>
                 {L('BookingRequest')}
               </span>
             }
             key="2"
           >
             <Table
          pagination={pagination}
          rowKey={record => record.id + ""}
          style={{ marginTop: '12px' }}
          loading={this.props.bookingRequestStore!.loadingBookingRequests}
          dataSource={bookingRequests === undefined ? [] : bookingRequests}
          columns={this.bookingRequestsTableColumns}

        />

<BookingRequestDetailsModal
          visible={this.state.bookingRequestDetailsModalVisible}
          onCancel={() =>
            this.setState({
              bookingRequestDetailsModalVisible: false,
            })
          }
          bookingRequestStore={this.props.bookingRequestStore!}
        />
           </TabPane>
           <TabPane
             tab={
               <span>
                 <CommentOutlined/>
                 {L('Reviews')}
               </span>
             }
             key="3"
           >
             <Table
          pagination={reviewsPagination}
          rowKey={record => record.id + ""}
          style={{ marginTop: '12px' }}
          dataSource={reviews === undefined ? [] : reviews}
          columns={this.reviewsTableColumns}

        />

           </TabPane>
           <TabPane
             tab={
               <span>
                 <ShoppingCartOutlined/>
                 {L('Payments')}
               </span>
             }
             key="4"
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

export default CourseDetails;
