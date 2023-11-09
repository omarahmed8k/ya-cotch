import * as React from 'react';
import {  Modal, Button,Form,Input,Col,Row} from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import { FormInstance } from 'antd/lib/form';
import FormItem from 'antd/lib/form/FormItem';
import ShopManagerStore from '../../../stores/shopManagerStore';

export interface ICreateOrUpdateShopManagerSProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  shopManagerStore?: ShopManagerStore;
  onOk: () => void;
  isSubmittingShopManager: boolean;
  formRef:React.RefObject<FormInstance>;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
    md: { span: 6 },
    lg: { span: 8 },
    xl: { span: 8 },
    xxl: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 18 },
    md: { span: 18 },
    lg: { span: 16 },
    xl: { span: 16 },
    xxl: { span: 16 },
  },
};

const colLayout = {

  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 24 },
  xl: { span: 24 },
  xxl: { span: 24 },

};

export interface ICreateOrUpdateShopManagerState {
  email:any;
}

@inject(Stores.ShopManagerStore)
@observer
class CreateOrUpdateShopManagers extends React.Component<ICreateOrUpdateShopManagerSProps, ICreateOrUpdateShopManagerState> {

  handleSubmit = async () => {
    await this.props.onOk();
  }

  componentDidUpdate(){
    const {shopManagerModel} = this.props.shopManagerStore!;

    if(shopManagerModel !== undefined && this.state.email.value !== shopManagerModel.emailAddress){
        this.onEmailChange({target:{value:shopManagerModel.emailAddress}});
    }
   
  }

  state={
    email:{ value: "",validateStatus:undefined,errorMsg:null},
  }

  validateEmail =(value:string) =>{
    let reqex =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (value !== "" && !reqex.test(value) ) {
      return {
        validateStatus: 'error',
        errorMsg: L('ThisEmailIsInvalid'),
      };
    }
    
    return {
      validateStatus: 'success',
        errorMsg: null,
    };
  }

  onEmailChange = (e: any) => {
    let value= e.target.value;
    this.setState({email:{ ...this.validateEmail(value),
      value,}});
  };

  handleCancel = () => {
    this.props.onCancel();
  }

  render() {
    
    const { visible, onCancel, modalType } = this.props;
    const { shopManagerModel } = this.props.shopManagerStore!;
   
    return (
      <Modal
        visible={visible}
        title={modalType === 'create' ? L('CreateShopManager') : L('EditShopManager')}
        onCancel={onCancel}
        centered
        destroyOnClose
        maskClosable={false}
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button key="submit" type="primary" loading={this.props.isSubmittingShopManager} onClick={this.handleSubmit}>
            {modalType === 'create' ? L('Create') : L('Edit')}
          </Button>,
        ]}
      >
         <Form ref={this.props.formRef}>
           <Row>
            <Col {...colLayout}>
            <FormItem label={L('Name')} 
                                  colon={false}

           initialValue={ shopManagerModel !== undefined && shopManagerModel.name ? shopManagerModel.name : undefined}
           name="name" {...formItemLayout} rules={ [{ required: true, message: L('ThisFieldIsRequired') }]}>
              <Input />
          </FormItem>
         
            </Col>

            <Col {...colLayout}>
                    <Form.Item
                      label={L("Email")}
                      name="emailAddress"
                      colon={false}
                      initialValue={ shopManagerModel !== undefined && shopManagerModel.emailAddress ? shopManagerModel.emailAddress : undefined}

                       validateStatus={this.state.email.validateStatus}
                     
                      help={this.state.email.errorMsg}
                      {...formItemLayout}
                    >
                     <Input onLoad={this.onEmailChange} onChange={this.onEmailChange} />
                    </Form.Item>
                  </Col>
                  <Col {...colLayout}>
                    <Form.Item
                      label={L("PhoneNumber")}
                      name="phoneNumber"
                      initialValue={ shopManagerModel !== undefined && shopManagerModel.phoneNumber ? shopManagerModel.phoneNumber : undefined}

                      colon={false}
                      rules= {[{ required: true, message: L('ThisFieldIsRequired') }]}

                      {...formItemLayout}
                    >
                     <Input />
                    </Form.Item>
                  </Col>
                  
                  <Col {...colLayout}>
          <Form.Item
            label={L("Password")}
            name="password"
            {...formItemLayout}              colon={false}

            rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
          >
            <Input.Password visibilityToggle />
          </Form.Item>
        </Col>
        <Col {...colLayout}>
          <Form.Item
            label={L("ConfirmPassword")}
            dependencies={['password']}
            name="confirmPassword"              colon={false}

            {...formItemLayout}
            rules={[{ required: true, message: L('ThisFieldIsRequired') }, ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(L('TheTwoPasswordsThatYouEnteredDoNotMatch')));
              },
            }),]}                >
            <Input.Password visibilityToggle />
          </Form.Item>
        </Col>

          
           </Row>

        </Form>

      </Modal>
    );
  }
}

export default CreateOrUpdateShopManagers;
