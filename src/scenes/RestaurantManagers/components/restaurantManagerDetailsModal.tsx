import * as React from 'react';
import { Modal, Button,Tag } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import './restaurantManagerDetailsModal.css';
import timingHelper from '../../../lib/timingHelper';
import moment from 'moment';
import RestaurantManagerStore from '../../../stores/restaurantManagerStore';

export interface IRestaurantManagerDetailsModalProps{
  visible: boolean;
  onCancel: () => void;
  restaurantManagerStore?:RestaurantManagerStore;
}

@inject(Stores.RestaurantManagerStore)
@observer
class RestaurantManagerDetailsModal extends React.Component<IRestaurantManagerDetailsModalProps, any> {


  handleCancel = () => {
    this.props.onCancel();
  }
  
   render() {  
    const { visible } = this.props;
    const { restaurantManagerModel } = this.props.restaurantManagerStore!;
    return (
      <Modal
        visible={visible}
        title={L('RestaurantManagerDetails')}
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
        <div>
      <div className="details-wrapper">
        <div className="detail-wrapper">
          <span className="detail-label">{L('Name')}:</span>
          <span className="detail-value">{restaurantManagerModel !== undefined ? restaurantManagerModel.name : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Email')}:</span>
          <span className="detail-value">{restaurantManagerModel !== undefined ? restaurantManagerModel.emailAddress : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('PhoneNumber')}:</span>
          <span className="detail-value">{restaurantManagerModel !== undefined ? restaurantManagerModel.phoneNumber : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('LastLoginDate')}:</span>
          <span className="detail-value">{restaurantManagerModel !== undefined &&  restaurantManagerModel.lastLoginDate? moment(restaurantManagerModel.lastLoginDate).format(timingHelper.defaultDateFormat) : L("NotAvailable")}</span>
        </div>
      
        
            
        <div className="detail-wrapper">
          <span className="detail-label">{L('Status')}:</span>
          <span className="detail-value">
            <Tag color={restaurantManagerModel !== undefined && restaurantManagerModel.isActive ? 'green' : 'volcano'} className='ant-tag-disable-pointer'>
              {restaurantManagerModel !== undefined && restaurantManagerModel.isActive ? L('Activated') : L('Deactivated')}
            </Tag>
          </span>

        </div>

       
     </div>  
      </div>
      </Modal>
    );
  }
}

export default RestaurantManagerDetailsModal;
