import * as React from 'react';
import { Form, Modal, Button, Input } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import FormItem from 'antd/lib/form/FormItem';
import { FormInstance } from 'antd/lib/form';
import LocationStore from '../../../stores/locationStore';
import localization from '../../../lib/localization';


export interface ICreateOrUpdateCountryProps{
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  locationStore?: LocationStore;
  onOk: () => void;
  isSubmittingLocation: boolean;
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

@inject(Stores.LocationStore)
@observer
class CreateOrUpdateCountry extends React.Component<ICreateOrUpdateCountryProps, any> {
  
  handleSubmit = async () => {
    await this.props.onOk();
  }


  handleCancel = () => {
    this.props.onCancel();
    this.props.locationStore!.locationModel=undefined;
  }

  render() {
   
    const { visible, modalType } = this.props;
    const { locationModel } = this.props.locationStore!;
   
    
    return (
      <Modal
        visible={visible}
        title={modalType === 'create' ? L('CreateCountry'):L('EditCountry')}
         className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
       
        onCancel={this.handleCancel}
        centered
        maskClosable={false}
        destroyOnClose
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button key="submit" type="primary" loading={this.props.isSubmittingLocation} onClick={this.handleSubmit}>
            {modalType === 'create' ? L('Create') : L('Edit')}
          </Button>,
        ]}
      >
        <Form ref={this.props.formRef}>
        
            <>
              <FormItem label={L('ArName')} name="arName" {...formItemLayout}
                rules= {[{ required: true, message: L('ThisFieldIsRequired') }]}
              colon={false}
              initialValue={locationModel !== undefined ? locationModel.arName : undefined}
              >
                  <Input /> 
              </FormItem>
              <FormItem label={L('EnName')} name="enName"  {...formItemLayout}
            rules= {[{ required: true, message: L('ThisFieldIsRequired') }]}
            colon={false}

              initialValue={locationModel !== undefined ? locationModel.enName : undefined}
              >
                  <Input />
                
              </FormItem>
              
            </>
         
           
        </Form>
      </Modal>
    );
  }
}

export default CreateOrUpdateCountry;
