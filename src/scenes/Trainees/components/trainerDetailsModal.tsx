import * as React from 'react';
import { Modal, Button,Tag } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import './trainerDetailsModal.css';
import TrainerStore from '../../../stores/trainerStore';
import timingHelper from '../../../lib/timingHelper';
import moment from 'moment';

export interface ITrainerDetailsModalProps{
  visible: boolean;
  onCancel: () => void;
  trainerStore:TrainerStore;
}

@inject(Stores.TrainerStore)
@observer
class TrainerDetailsModal extends React.Component<ITrainerDetailsModalProps, any> {


  handleCancel = () => {
    this.props.onCancel();
  }
  
   render() {  
    const { visible } = this.props;
    const { trainerModel } = this.props.trainerStore!;
    return (
      <Modal
        visible={visible}
        title={L('Details')}
        onCancel={this.handleCancel}
        centered
        destroyOnClose
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
          <span className="detail-value">{trainerModel !== undefined ? trainerModel.name : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Email')}:</span>
          <span className="detail-value">{trainerModel !== undefined ? trainerModel.emailAddress : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('PhoneNumber')}:</span>
          <span className="detail-value">{trainerModel !== undefined ? trainerModel.phoneNumber : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Birthdate')}:</span>
          <span className="detail-value">{trainerModel !== undefined &&  trainerModel.birthDate? moment(trainerModel.birthDate).format(timingHelper.defaultDateFormat) : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Specialization')}:</span>
          <span className="detail-value">{trainerModel !== undefined ? trainerModel.specialization?.text : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('YearsOfExperience')}:</span>
          <span className="detail-value">{trainerModel !== undefined ? trainerModel.yearsOfExperience : undefined}</span>
        </div>
            
        <div className="detail-wrapper">
          <span className="detail-label">{L('Blocked?')}:</span>
          <span className="detail-value">
            <Tag color={trainerModel !== undefined && trainerModel.isActive ? 'green' : 'volcano'} className='ant-tag-disable-pointer'>
              {trainerModel !== undefined && trainerModel.isActive ? L('Unblocked') : L('Blocked')}
            </Tag>
          </span>

        </div>

       
     </div>  
      </div>
      </Modal>
    );
  }
}

export default TrainerDetailsModal;
