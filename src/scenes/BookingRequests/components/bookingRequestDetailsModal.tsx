import * as React from 'react';
import { Modal, Button,Tag ,Tabs,Timeline} from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import './bookingRequestDetailsModal.css';
import timingHelper from '../../../lib/timingHelper';
import moment from 'moment';
import BookingRequestStore from '../../../stores/bookingRequestStore';
import BookingRequestStatus from '../../../services/types/bookingRequestStatus';
import PaymentMethod from '../../../services/types/paymentMethod';
import { ClockCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import ThousandSeparator from '../../../components/ThousandSeparator';
import { ActionDto } from '../../../services/bookingRequests/dto/actionDto';

export interface IBookingRequestDetailsModalProps{
  visible: boolean;
  onCancel: () => void;
  bookingRequestStore?:BookingRequestStore;
}

const { TabPane } = Tabs;


@inject(Stores.BookingRequestStore)
@observer
class BookingRequestDetailsModal extends React.Component<IBookingRequestDetailsModalProps, any> {


  handleCancel = () => {
    this.props.onCancel();
  }

  resolveStatus= (status: number) => {
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
  }

  resolvePaymentMethod = (paymentMethod:number)=>{
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

  
  resolveTargetStatusName = (status:number)=>{
    let statusName=undefined;
    switch(status){
      case BookingRequestStatus.Approved:
        statusName= L('Approved');
        break;
      case BookingRequestStatus.Cancelled:
        statusName= L('Cancelled');
        break;
      case BookingRequestStatus.Paid:
        statusName=L('Paid');
        break;
      case BookingRequestStatus.Pending:
        statusName =L('Pending');
        break;
      case BookingRequestStatus.Rejected:
        statusName= L('Rejected');
    }
    return  statusName;
  }


   render() {  
    const { visible } = this.props;
    const { bookingRequestModel } = this.props.bookingRequestStore!;
    return (
      <Modal
        visible={visible}
        title={L('BookingRequestDetails')}
        onCancel={this.handleCancel}
        centered
        destroyOnClose
        maskClosable={false}
        width="60%"
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Close')}
          </Button>,
        ]}
      >
        <div className="booking-req-modal">
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
                <div>
      <div className="details-wrapper">
        <div className="detail-wrapper">
          <span className="detail-label">{L('ID')}</span>
          <span className="detail-value">{bookingRequestModel !== undefined ? bookingRequestModel.id : undefined}</span>
        </div>
        
        <div className="detail-wrapper">
          <span className="detail-label">{L('CourseName')}</span>
          <span className="detail-value">{bookingRequestModel !== undefined ?
           <a target="_blank" rel="noopener noreferrer" href={`/course/${bookingRequestModel.course.value}`}>{bookingRequestModel.course?.text }</a>: undefined}</span>
        </div>

        <div className="detail-wrapper">
          <span className="detail-label">{L('TraineeName')}</span>
          <span className="detail-value">{bookingRequestModel !== undefined ? <a rel="noopener noreferrer" href={`/trainee/${bookingRequestModel.trainee.id}`} target="_blank">{bookingRequestModel.trainee?.name}</a> : undefined}</span>
        </div>

        <div className="detail-wrapper">
          <span className="detail-label">{L('TraineePhoneNumber')}</span>
          <span className="detail-value">{bookingRequestModel !== undefined ? bookingRequestModel.trainee?.phoneNumber : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Status')}</span>
          <span className="detail-value">
           {bookingRequestModel !== undefined ? this.resolveStatus(bookingRequestModel.status) : undefined}
          </span>

        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('PaymentMethod')}</span>
          <span className="detail-value">
           {bookingRequestModel !== undefined ? this.resolvePaymentMethod(bookingRequestModel.paymentMethod) : undefined}
          </span>

        </div>

        <div className="detail-wrapper">
          <span className="detail-label">{L('PaidAmount')}</span>
          <span className="detail-value">{bookingRequestModel !== undefined && bookingRequestModel.paidAmount!== undefined ?
           <ThousandSeparator number={bookingRequestModel.paidAmount} currency={L('SAR')} /> : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('TransactionId')}</span>
          <span className="detail-value">{bookingRequestModel !== undefined ? bookingRequestModel.transactionId : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('CreationTime')}</span>
          <span className="detail-value">{bookingRequestModel !== undefined &&  bookingRequestModel.creationTime? moment(bookingRequestModel.creationTime).format(timingHelper.defaultDateTimeFormat) : L("NotAvailable")}</span>
        </div>
      

     </div>  
      </div>
           </TabPane>
            <TabPane
             tab={
               <span>
                  <ClockCircleOutlined />
                  {L('Timeline')}
               </span>
             }
             key="2"
           >
              <Timeline>
   {bookingRequestModel !== undefined && bookingRequestModel!.actions && bookingRequestModel.actions.length>0 &&

bookingRequestModel.actions.map((action:ActionDto)=>{
    return <Timeline.Item>{`${this.resolveTargetStatusName(action.targetStatus)} (${action.creatorUserName})   ${moment(action.creationTime).format(timingHelper.defaultDateTimeFormat)}`}</Timeline.Item>
   })
  
   }
    
    
  </Timeline>
           </TabPane>
           </Tabs>
    
        </div>
    
      </Modal>
    );
  }
}

export default BookingRequestDetailsModal;
