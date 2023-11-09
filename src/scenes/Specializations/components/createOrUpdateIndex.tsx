import * as React from 'react';
import { Form, Modal, Button, Input } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import FormItem from 'antd/lib/form/FormItem';
import { FormInstance } from 'antd/lib/form';
import localization from '../../../lib/localization';
import IndexStore from '../../../stores/indexStore';
import IndexType from '../../../services/types/indexType';


export interface ICreateOrUpdateIndexProps{
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  indexStore?: IndexStore;
  onOk: () => void;
  indexType:IndexType;
  isSubmittingIndex: boolean;
  formRef:React.RefObject<FormInstance>;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
    md: { span: 6 },
    lg: { span: 6 },
    xl: { span: 6 },
    xxl: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 18 },
    md: { span: 18 },
    lg: { span: 18 },
    xl: { span: 18 },
    xxl: { span: 18 },
  },
};

@inject(Stores.IndexStore)
@observer
class CreateOrUpdateIndex extends React.Component<ICreateOrUpdateIndexProps, any> {
  

  handleSubmit = async () => {
    await this.props.onOk();
  }


  handleCancel = () => {
    this.props.onCancel();
    this.props.indexStore!.indexModel=undefined;
  }

  render() {
   
    const { visible, modalType ,indexType} = this.props;
    const { indexModel } = this.props.indexStore!;
   
    
    return (
      <Modal
        visible={visible}
        title={modalType === 'create' ? indexType===IndexType.Specialization ? L('CreateSpecialization'):null:
        indexType===IndexType.Specialization ? L('EditSpecialization'):null }
         className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
       
        onCancel={this.handleCancel}
        centered
        destroyOnClose
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button key="submit" type="primary" loading={this.props.isSubmittingIndex} onClick={this.handleSubmit}>
            {modalType === 'create' ? L('Create') : L('Save')}
          </Button>,
        ]}
      >
        <Form ref={this.props.formRef}>
        
            <>
              <FormItem label={L('ArName')} name="arName" {...formItemLayout}
               rules= {[{ required: true, message: L('ThisFieldIsRequired') }]}

              initialValue={indexModel !== undefined ? indexModel.arName : undefined}
              >
                  <Input/> 
              </FormItem>
              <FormItem label={L('EnName')} name="enName"  {...formItemLayout}
            rules= {[{ required: true, message: L('ThisFieldIsRequired') }]}
              initialValue={indexModel !== undefined ? indexModel.enName : undefined}
              >
                  <Input />
                
              </FormItem>
              
            </>
         
           
        </Form>
      </Modal>
    );
  }
}

export default CreateOrUpdateIndex;
