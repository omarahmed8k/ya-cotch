import * as React from 'react';
import { Modal, Button,Tag,Avatar } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import './courseDetailsModal.css';
import ImageModel from '../../../components/ImageModal';
import CourseStore from '../../../stores/courseStore';
import timingHelper from '../../../lib/timingHelper';
import moment from 'moment';
export interface ICourseDetailsModalProps{
  visible: boolean;
  onCancel: () => void;
  courseStore:CourseStore;
}

@inject(Stores.CourseStore)
@observer
class CourseDetailsModal extends React.Component<ICourseDetailsModalProps, any> {


  handleCancel = () => {
    this.props.onCancel();
  }
  
  
  openImageModal(image: string, caption: string) {
    this.setState({ isImageModalOpened: true, imageModalCaption: caption, imageModalUrl: image });
  }

  state={
    isImageModalOpened: false,
    imageModalCaption: "",
    imageModalUrl: ""
  };

  closeImageModal() {
    this.setState({ isImageModalOpened: false, imageModalCaption: '', imageModalUrl: '' });
  }
   render() {  
    const { visible } = this.props;
    const { courseModel } = this.props.courseStore!;
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
        <div className="course-details">
      <div className="details-wrapper">
        <div className="detail-wrapper">
          <span className="detail-label">{L('ArName')}:</span>
          <span className="detail-value">{courseModel !== undefined ? courseModel.arName : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('EnName')}:</span>
          <span className="detail-value">{courseModel !== undefined ? courseModel.enName : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('ArDescription')}:</span>
          <span className="detail-value">{courseModel !== undefined && courseModel.arDescription ? courseModel.arDescription : L("NotAvailable")}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('EnDescription')}:</span>
          <span className="detail-value">{courseModel !== undefined && courseModel.enDescription ? courseModel.enDescription : L("NotAvailable")}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Category')}:</span>
          <span className="detail-value">{courseModel !== undefined ? courseModel.category.text : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Trainer')}:</span>
          <span className="detail-value">{courseModel !== undefined ? courseModel.trainer.text : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Fee')}:</span>
          <span className="detail-value">{courseModel !== undefined ? courseModel.fee : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('TrainingHoursCount')}:</span>
          <span className="detail-value">{courseModel !== undefined ? courseModel.trainingHoursCount : undefined}</span>
        </div>
      
        <div className="detail-wrapper">
          <span className="detail-label">{L('HasDiscount')}:</span>
          <span className="detail-value">
            <Tag color={courseModel !== undefined && courseModel.hasDiscount ? 'green' : 'volcano'} className='ant-tag-disable-pointer'>
              {courseModel !== undefined && courseModel.hasDiscount ? L('Yes') : L('No')}
            </Tag>
          </span>
        </div>
        
        {courseModel !== undefined && courseModel.hasDiscount && (
          <div className="detail-wrapper">
          <span className="detail-label">{L('DiscountPercentage')}:</span>
          <span className="detail-value">{courseModel !== undefined ? courseModel.discountPercentage+'%' : undefined}</span>
        </div>
        )}

        <div className="detail-wrapper">
          <span className="detail-label">{L('BookingRequestsCount')}:</span>
          <span className="detail-value">{courseModel !== undefined ? courseModel.bookingRequestsCount : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('ViewsCount')}:</span>
          <span className="detail-value">{courseModel !== undefined ? courseModel.viewsCount : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('CreatedBy')}:</span>
          <span className="detail-value">{courseModel !== undefined ? courseModel.createdBy : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('CreationTime')}:</span>
          <span className="detail-value">{courseModel !== undefined ? moment(courseModel.creationTime).format(timingHelper.defaultDateFormat) : undefined}</span>
        </div>
        
        <div className="detail-wrapper">
          <span className="detail-label">{L('IsActive')}:</span>
          <span className="detail-value">
            <Tag color={courseModel !== undefined && courseModel.isActive ? 'green' : 'volcano'} className='ant-tag-disable-pointer'>
              {courseModel !== undefined && courseModel.isActive ? L('Active') : L('Inactive')}
            </Tag>
          </span>

        </div>

        <div className="detail-wrapper">
          <span className="detail-label">{L('Image')}:</span>
          <span className="detail-value">{courseModel !== undefined ?
          <div onClick={() => this.openImageModal(courseModel.imageUrl!, courseModel.name)} style={{ display: 'inline-block', cursor: "zoom-in" }}>
          <Avatar shape='square' size={50} src={courseModel.imageUrl} />
        </div>: undefined}</span>
        </div>
       
     </div>  
      </div>
      <ImageModel
          isOpen={this.state.isImageModalOpened}
          caption={this.state.imageModalCaption}
          src={this.state.imageModalUrl}
          onClose={() => { this.closeImageModal(); }} />
      </Modal>
    );
  }
}

export default CourseDetailsModal;
