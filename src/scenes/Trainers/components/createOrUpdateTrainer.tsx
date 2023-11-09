import React from 'react';
import {  Modal, Button,Form,Input ,Select,Col,Row,DatePicker} from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import { FormInstance } from 'antd/lib/form';
import FormItem from 'antd/lib/form/FormItem';
import { LiteEntityDto } from '../../../services/dto/liteEntityDto';
import TrainerStore from '../../../stores/trainerStore';
import { ImageAttr } from '../../../services/dto/imageAttr';
import indexesService from '../../../services/indexes/indexesService';
import IndexType from '../../../services/types/indexType';
import EditableImage from '../../../components/EditableImage';
import timingHelper from '../../../lib/timingHelper';
import moment from 'moment';
import CustomUploadFile from '../../../components/UploadFile';

export interface ICreateOrUpdateTrainerProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  trainerStore?: TrainerStore;
  onOk: () => void;
  isSubmittingTrainer: boolean;
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

export interface ICreateOrUpdateTrainerState {
  defaultTrainerImage:Array<ImageAttr>;
  defaultTrainerCV:Array<ImageAttr>;

  email:any;
}

@inject(Stores.TrainerStore)
@observer
class CreateOrUpdateTrainer extends React.Component<ICreateOrUpdateTrainerProps, ICreateOrUpdateTrainerState> {
  specializations:LiteEntityDto[]=[];
  handleSubmit = async () => {
    await this.props.onOk();
  }

  async componentDidMount(){
    let result= await indexesService.getAllLite({type:IndexType.Specialization});
    this.specializations=result.items;
  }

  componentDidUpdate(){
    const {trainerModel} = this.props.trainerStore!;
    if(trainerModel !== undefined && this.state.email.value !== trainerModel.emailAddress){
        this.onEmailChange({target:{value:trainerModel.emailAddress}});
    }
    if(this.state.defaultTrainerImage.length ===0 && trainerModel!== undefined&&  trainerModel.imageUrl !==null){      
        this.setState({defaultTrainerImage: [{
          uid: 1,
          name: `trainerImage.png`,
          status: 'done',
          url: trainerModel.imageUrl,
          thumbUrl: trainerModel.imageUrl,
        }]});
    }

    if(trainerModel === undefined && (this.state.defaultTrainerImage.length>0)){
      this.setState({defaultTrainerImage:[]});
    }

    if(trainerModel !== undefined && trainerModel.imageUrl !==null && this.state.defaultTrainerImage.length >0&& this.state.defaultTrainerImage[0]["url"] !== trainerModel.imageUrl){
      this.setState({defaultTrainerImage:[]});
    }

    if(this.state.defaultTrainerCV.length ===0 && trainerModel!== undefined&&  trainerModel.cvUrl !==null){      
      this.setState({defaultTrainerCV: [{
        uid: 1,
        name: `trainerCV`,
        status: 'done',
        url: trainerModel.cvUrl,
        thumbUrl: trainerModel.cvUrl,
      }]});
  }

  if(trainerModel === undefined && (this.state.defaultTrainerCV.length>0)){
    this.setState({defaultTrainerCV:[]});
  }

  if(trainerModel !== undefined && trainerModel.cvUrl !==null && this.state.defaultTrainerCV.length >0&& this.state.defaultTrainerCV[0]["url"] !== trainerModel.cvUrl){
    this.setState({defaultTrainerCV:[]});
  }
  }
  state={
    defaultTrainerImage:[],
    defaultTrainerCV:[],
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
    const { trainerModel } = this.props.trainerStore!;
   
    return (
      <Modal
        visible={visible}
        title={modalType === 'create' ? L('CreateTrainer') : L('EditTrainer')}
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
          <Button key="submit" type="primary" loading={this.props.isSubmittingTrainer} onClick={this.handleSubmit}>
            {modalType === 'create' ? L('Create') : L('Edit')}
          </Button>,
        ]}
      >
         <Form ref={this.props.formRef}>
           <Row>
            <Col {...colLayout}>
            <FormItem label={L('Name')} 
                                  colon={false}

           initialValue={ trainerModel !== undefined && trainerModel.name ? trainerModel.name : undefined}
           name="name" {...formItemLayout} rules={ [{ required: true, message: L('ThisFieldIsRequired') }]}>
              <Input />
          </FormItem>
         
            </Col>

            <Col {...colLayout}>
                    <Form.Item
                      label={L("Email")}
                      name="emailAddress"
                      colon={false}
                      initialValue={ trainerModel !== undefined && trainerModel.emailAddress ? trainerModel.emailAddress : undefined}

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
                      initialValue={ trainerModel !== undefined && trainerModel.phoneNumber ? trainerModel.phoneNumber : undefined}

                      rules= {[{ required: true, message: L('ThisFieldIsRequired') }]}

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
                      initialValue={ trainerModel !== undefined && trainerModel.gender!== undefined ? trainerModel.gender : undefined}

                      rules= {[{ required: true, message: L('ThisFieldIsRequired') }]}

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
          <Select.Option key={0} value={0}>{L('Female')}</Select.Option>
          <Select.Option key={1} value={1}>{L('Male')}</Select.Option>

        </Select>
                    </Form.Item>
                  </Col>
                  <Col {...colLayout}>
                    <Form.Item
                      label={L("CountryCode")}
                      name="countryCode"
                      colon={false}
                      initialValue={ trainerModel !== undefined && trainerModel.countryCode!== undefined ? trainerModel.countryCode : undefined}

                      rules= {[{ required: true, message: L('ThisFieldIsRequired') }]}

                      {...formItemLayout}
                    >
                     <Input  />
                    </Form.Item>
                  </Col>
                  <Col {...colLayout}>
                    <Form.Item
                      label={L("Address")}
                      name="address"
                      colon={false}
                      initialValue={ trainerModel !== undefined && trainerModel.address!== undefined ? trainerModel.address : undefined}
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
                      initialValue={ trainerModel !== undefined && trainerModel.birthDate ? moment(trainerModel.birthDate) : undefined}

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
                      label={L("YearsOfExperience")}
                      name="yearsOfExperience"
                      colon={false}                      
                      initialValue={ trainerModel !== undefined && trainerModel.yearsOfExperience ? trainerModel.yearsOfExperience : undefined}


                      {...formItemLayout}
                    >
                     <Input type="number" min="0" />
                    </Form.Item>
                  </Col>
            <Col {...colLayout}>
            <FormItem label={L('Specialization')}
                                  colon={false}
                                  name="specializationId"  {...formItemLayout}
           initialValue={ trainerModel !== undefined && trainerModel.specialization ? trainerModel.specialization.value : undefined}
           rules= {[{ required: true, message: L('ThisFieldIsRequired') }]}
           >
               <Select
          placeholder={L('PleaseSelectSpecialization')}  
          showSearch
          optionFilterProp="children"
          filterOption={(input, option:any) =>
            option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          >
          {this.specializations.length>0 && this.specializations.map((element:LiteEntityDto) => <Select.Option key={element.value} value={element.value}>{element.text}</Select.Option>)}
        </Select>
          </FormItem>

            </Col>
            <Col {...colLayout}>   
          <FormItem label={L('CV')} 
          {...formItemLayout}
          colon={false}

><input id='trainer-cv' type="hidden"/>
                 
                   <CustomUploadFile
                   defaultFileList={trainerModel!== undefined && trainerModel.cvUrl!==null ? this.state.defaultTrainerCV:[]}
         onSuccess={fileName => {
document.getElementById('trainer-cv')!.setAttribute("value", fileName);
}}
/>
               
          </FormItem>
          </Col>

            <Col {...colLayout}>   
          <FormItem label={L('Image')} 
          {...formItemLayout}
          colon={false}

><img id='trainer-image' style={{display:'none'}} alt="image"/>
                 
                   <EditableImage
                   defaultFileList={trainerModel!== undefined && trainerModel.imageUrl!==null ? this.state.defaultTrainerImage:[]}
         onSuccess={fileName => {
document.getElementById('trainer-image')!.setAttribute("value", fileName);
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

export default CreateOrUpdateTrainer;
