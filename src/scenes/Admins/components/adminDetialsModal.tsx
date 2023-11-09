import * as React from 'react';
import { Modal, Button,Tag } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import AdminStore from '../../../stores/adminStore';
import UserStore from '../../../stores/userStore';
import './adminDetailsModal.css';

export interface IAdminDetailsModalProps{
  visible: boolean;
  onCancel: () => void;
  adminStore?: AdminStore;
  userStore?:UserStore;
}

@inject(Stores.AdminStore,Stores.UserStore)
@observer
class AdminDetailsModal extends React.Component<IAdminDetailsModalProps, any> {
 
  handleCancel = () => {
    this.props.onCancel();
  }
   
   render() {  
    const { visible } = this.props;
    const { adminModel } = this.props.adminStore!;
    return (
      <Modal
        visible={visible}
        title={L('Details')}
        onCancel={this.handleCancel}
        centered
        destroyOnClose
        width="70%"
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Close')}
          </Button>,
        ]}
      >
        <div className="details-modal">
      <div className="details-wrapper">
        <div className="detail-wrapper">
          <span className="detail-label">{L('FirstName')}:</span>
          <span className="detail-value">{adminModel !== undefined ? adminModel.name : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Surname')}:</span>
          <span className="detail-value">{adminModel !== undefined ? adminModel.surname : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Email')}:</span>
          <span className="detail-value">{adminModel !== undefined ? adminModel.emailAddress : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Blocked?')}:</span>
          <span className="detail-value">
            <Tag color={adminModel !== undefined && adminModel.isActive ? 'green' : 'volcano'} className='ant-tag-disable-pointer'>
              {adminModel !== undefined && adminModel.isActive ? L('Unblocked') : L('Blocked')}
            </Tag>
          </span>
        </div>
        <div className="detail-wrapper big">
        <span className="detail-label">{L('Permissions')}:</span>
        <span className="detail-value permissions">
        {adminModel !== undefined && adminModel.permissionNames!.length>0 &&(
          <ol>
         { adminModel.permissionNames!.map((item:string)=>{
            return <li key={item}>{L(item)}</li>;
          })}
          </ol>
        )}
         </span> 
      </div>
      </div>  
      </div>
      </Modal>
    );
  }
}

export default AdminDetailsModal;
