import * as React from 'react';
import { Modal, Button,Tag } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import './shopManagerDetailsModal.css';
import timingHelper from '../../../lib/timingHelper';
import moment from 'moment';
import ShopManagerStore from '../../../stores/shopManagerStore';

export interface IShopManagerDetailsModalProps{
  visible: boolean;
  onCancel: () => void;
  shopManagerStore?:ShopManagerStore;
}

@inject(Stores.ShopManagerStore)
@observer
class ShopManagerDetailsModal extends React.Component<IShopManagerDetailsModalProps, any> {


  handleCancel = () => {
    this.props.onCancel();
  }
  
   render() {  
    const { visible } = this.props;
    const { shopManagerModel } = this.props.shopManagerStore!;
    return (
      <Modal
        visible={visible}
        title={L('ShopManagerDetails')}
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
          <span className="detail-value">{shopManagerModel !== undefined ? shopManagerModel.name : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Email')}:</span>
          <span className="detail-value">{shopManagerModel !== undefined ? shopManagerModel.emailAddress : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('PhoneNumber')}:</span>
          <span className="detail-value">{shopManagerModel !== undefined ? shopManagerModel.phoneNumber : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('LastLoginDate')}:</span>
          <span className="detail-value">{shopManagerModel !== undefined &&  shopManagerModel.lastLoginDate? moment(shopManagerModel.lastLoginDate).format(timingHelper.defaultDateFormat) : L("NotAvailable")}</span>
        </div>
      
        
            
        <div className="detail-wrapper">
          <span className="detail-label">{L('Status')}:</span>
          <span className="detail-value">
            <Tag color={shopManagerModel !== undefined && shopManagerModel.isActive ? 'green' : 'volcano'} className='ant-tag-disable-pointer'>
              {shopManagerModel !== undefined && shopManagerModel.isActive ? L('Activated') : L('Deactivated')}
            </Tag>
          </span>

        </div>

       
     </div>  
      </div>
      </Modal>
    );
  }
}

export default ShopManagerDetailsModal;
