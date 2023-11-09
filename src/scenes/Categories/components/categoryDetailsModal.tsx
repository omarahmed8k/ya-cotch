import * as React from 'react';
import { Modal, Button,Tag,Avatar } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import './categoryDetailsModal.css';
import ImageModel from '../../../components/ImageModal';
import CategoryStore from '../../../stores/categoryStore';
import CategoryType from '../../../services/types/categoryType';

export interface ICategoryDetailsModalProps{
  visible: boolean;
  onCancel: () => void;
  categoryStore:CategoryStore;
}

@inject(Stores.CategoryStore)
@observer
class CategoryDetailsModal extends React.Component<ICategoryDetailsModalProps, any> {


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

  resolveCategoryType(type:number){
    switch(type){
      case CategoryType.Dishes:
        return <Tag color={'processing'} className='ant-tag-disable-pointer'>{L('Dishes')}</Tag>;
      case CategoryType.Courses:
        return <Tag color={'processing'} className='ant-tag-disable-pointer'>{L('Courses1')}</Tag>;
      case CategoryType.Products:
          return <Tag color={'processing'} className='ant-tag-disable-pointer'>{L('Products')}</Tag>;
         
    }
    return "";
  }
  
   render() {  

    const { visible } = this.props;
    const { categoryModel } = this.props.categoryStore!;
    return (
      <Modal
        visible={visible}
        title={L('CategoryDetails')}
        onCancel={this.handleCancel}
        centered
        maskClosable={false}
        destroyOnClose
        width="60%"
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Close')}
          </Button>,
        ]}
      >
      <div className="details-wrapper">
        <div className="detail-wrapper">
          <span className="detail-label">{L('ArName')}</span>
          <span className="detail-value">{categoryModel !== undefined ? categoryModel.arName : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('EnName')}</span>
          <span className="detail-value">{categoryModel !== undefined ? categoryModel.enName : undefined}</span>
        </div>
     
        <div className="detail-wrapper">
          <span className="detail-label">{L('Type')}</span>
          <span className="detail-value">{categoryModel !== undefined && categoryModel.type ?this.resolveCategoryType(categoryModel.type):undefined }
          </span>

        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('IsActive')}</span>
          <span className="detail-value">
            <Tag color={categoryModel !== undefined && categoryModel.isActive ? 'green' : 'volcano'} className='ant-tag-disable-pointer'>
              {categoryModel !== undefined && categoryModel.isActive ? L('Active') : L('Inactive')}
            </Tag>
          </span>

        </div>

        <div className="detail-wrapper">
          <span className="detail-label">{L('Image')}</span>
          <span className="detail-value">{categoryModel !== undefined ?
          <div onClick={() => this.openImageModal(categoryModel.imageUrl!, categoryModel.enName)} style={{ display: 'inline-block', cursor: "zoom-in" }}>
          <Avatar shape='square' size={50} src={categoryModel.imageUrl} />
        </div>: undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Icon')}</span>
          <span className="detail-value">{categoryModel !== undefined ?
          <div onClick={() => this.openImageModal(categoryModel.iconUrl!, categoryModel.enName)} style={{ display: 'inline-block', cursor: "zoom-in" }}>
          <Avatar shape='square' size={50} src={categoryModel.iconUrl} />
        </div>: undefined}</span>
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

export default CategoryDetailsModal;
