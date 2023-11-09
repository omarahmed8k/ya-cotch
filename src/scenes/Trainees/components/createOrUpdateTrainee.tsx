import React from 'react';
import {  Modal, Button,Form,Input ,Select,Col,Row,DatePicker} from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import { FormInstance } from 'antd/lib/form';
import FormItem from 'antd/lib/form/FormItem';
import timingHelper from '../../../lib/timingHelper';
import moment from 'moment';
import TraineeStore from '../../../stores/traineeStore';
import EditableImage from '../../../components/EditableImage';
import { ImageAttr } from '../../../services/dto/imageAttr';

export interface ICreateOrUpdateTraineeProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  traineeStore?: TraineeStore;
  onOk: () => void;
  isSubmittingTrainee: boolean;
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
  md: { span: 12 },
  lg: { span: 12 },
  xl: { span: 12 },
  xxl: { span: 12 },

};

export interface ICreateOrUpdateTraineeState {
  email:any;
  defaultTraineeImage:Array<ImageAttr>;

}

@inject(Stores.TraineeStore)
@observer
class CreateOrUpdateTrainee extends React.Component<ICreateOrUpdateTraineeProps, ICreateOrUpdateTraineeState> {
  handleSubmit = async () => {
    await this.props.onOk();
  }


  componentDidUpdate(){
    const {traineeModel} = this.props.traineeStore!;
    if(traineeModel !== undefined && this.state.email.value !== traineeModel.emailAddress){
        this.onEmailChange({target:{value:traineeModel.emailAddress}});
    }

    if(this.state.defaultTraineeImage.length ===0 && traineeModel!== undefined&&  traineeModel.imageUrl !==null){      
      this.setState({defaultTraineeImage: [{
        uid: 1,
        name: `traineeImage.png`,
        status: 'done',
        url: traineeModel.imageUrl,
        thumbUrl: traineeModel.imageUrl,
      }]});
  }

  if(traineeModel === undefined && (this.state.defaultTraineeImage.length>0)){
    this.setState({defaultTraineeImage:[]});
  }

  if(traineeModel !== undefined && traineeModel.imageUrl !==null && this.state.defaultTraineeImage.length >0&& this.state.defaultTraineeImage[0]["url"] !== traineeModel.imageUrl){
    this.setState({defaultTraineeImage:[]});
  }
   
  }

  state={
    email:{ value: "",validateStatus:undefined,errorMsg:null},
    defaultTraineeImage:[],

  }

  validateEmail =(value:string) =>{
    let reqex =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (value !== "" && !reqex.test(value) ) {
      return {
        validateStatus: 'error',
        errorMsg: L('ThisEmailIsInvalid'),
      };
    }
    if (value !== "" ) {
      return {
        validateStatus: 'success',
        errorMsg: null,
      };
    }
   
    return {
      validateStatus: 'error',
      errorMsg: L('ThisFieldIsRequired'),
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
    const { traineeModel } = this.props.traineeStore!;
   
    return (
      <Modal
        visible={visible}
        title={modalType === 'create' ? L('CreateTrainee') : L('EditTrainee')}
        onCancel={onCancel}
        centered
        destroyOnClose
        width={"80%"}
        maskClosable={false}
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button key="submit" type="primary" loading={this.props.isSubmittingTrainee} onClick={this.handleSubmit}>
            {modalType === 'create' ? L('Create') : L('Edit')}
          </Button>,
        ]}
      >
         <Form ref={this.props.formRef}>
           <Row>
            <Col {...colLayout}>
            <FormItem label={L('Name')} 
                                  colon={false}

           initialValue={ traineeModel !== undefined && traineeModel.name ? traineeModel.name : undefined}
           name="name" {...formItemLayout} rules={ [{ required: true, message: L('ThisFieldIsRequired') }]}>
              <Input />
          </FormItem>
         
            </Col>

            <Col {...colLayout}>
                    <Form.Item
                      label={L("Email")}
                      name="emailAddress"
                      colon={false}
                      initialValue={ traineeModel !== undefined && traineeModel.emailAddress ? traineeModel.emailAddress : undefined}

                       validateStatus={this.state.email.validateStatus}
                      rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                     
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
                      colon={false}
                      initialValue={ traineeModel !== undefined && traineeModel.phoneNumber ? traineeModel.phoneNumber : undefined}

                      rules= {[{ required: true, message: L('ThisFieldIsRequired') }]}

                      {...formItemLayout}
                    >
                     <Input />
                    </Form.Item>
                  </Col>
                  <Col {...colLayout}>
                    <Form.Item
                      label={L("CountryCode")}
                      name="countryCode"
                      colon={false}
                      initialValue={ traineeModel !== undefined && traineeModel.countryCode ? traineeModel.countryCode : undefined}

                      rules= {[{ required: true, message: L('ThisFieldIsRequired') }]}

                      {...formItemLayout}
                    >
                     <Input  />
                    </Form.Item>
                  </Col>

            <Col {...colLayout}>
                    <Form.Item
                      label={L("BirthDate")}
                      name="birthDate"
                      colon={false}
                      initialValue={ traineeModel !== undefined && traineeModel.birthDate ? moment(traineeModel.birthDate) : undefined}

                      {...formItemLayout}
                    >
                      <DatePicker
                        placeholder={L('SelectDate')}
                        format={timingHelper.defaultDateFormat}
                      />
                    </Form.Item>
                  </Col>
                  <Col {...colLayout}>
                    <Form.Item
                      label={L("Address")}
                      name="address"
                      colon={false}                      
                      initialValue={ traineeModel !== undefined && traineeModel.address ? traineeModel.address : undefined}


                      {...formItemLayout}
                    >
                     <Input />
                    </Form.Item>
                  </Col>
            
                  <Col {...colLayout}>
                    <Form.Item
                      label={L("Gender")}
                      name="gender"
                      colon={false}                      
                      initialValue={ traineeModel !== undefined ? traineeModel.gender : undefined}
                      {...formItemLayout}
                    >

               <Select
          placeholder={L('PleaseSelectGender')}  
          showSearch
          optionFilterProp="children"
          filterOption={(input, option:any) =>
            option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          >
           <Select.Option key={0} value={0}>{L("Female")}</Select.Option>
           <Select.Option key={1} value={1}>{L("Male")}</Select.Option>
        </Select>
                         </Form.Item>
                  </Col>
                  <Col {...colLayout}>
                    <Form.Item
                      label={L("Length")}
                      name="length"
                      colon={false}                      
                      initialValue={ traineeModel !== undefined ? traineeModel.length : undefined}


                      {...formItemLayout}
                    >
                     <Input type="number" min="0" />
                    </Form.Item>
                  </Col>
                  <Col {...colLayout}>
                    <Form.Item
                      label={L("Weight")}
                      name="weight"
                      colon={false}                      
                      initialValue={ traineeModel !== undefined ? traineeModel.weight : undefined}


                      {...formItemLayout}
                    >
                     <Input  type="number" min="0"/>
                    </Form.Item>
                  </Col>

                  <Col {...colLayout}>
          <Form.Item
            label={L("Password")}
            name="password"
            {...formItemLayout}              colon={false}

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
            rules={[{ required: false, message: L('') }, ({ getFieldValue }) => ({
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


                  <Col {...colLayout}>   
          <FormItem label={L('Image')} 
          {...formItemLayout}
          colon={false}

><img id='trainee-image' style={{display:'none'}} alt="image"/>
                 
                   <EditableImage
                   defaultFileList={traineeModel!== undefined && traineeModel.imageUrl!==null ? this.state.defaultTraineeImage:[]}
         onSuccess={fileName => {
document.getElementById('trainee-image')!.setAttribute("value", fileName);
}}
/>
               
          </FormItem>
          </Col>
     
    
           </Row>

          
          

         
        </Form>

      </Modal>
    );
  }
}

export default CreateOrUpdateTrainee;
