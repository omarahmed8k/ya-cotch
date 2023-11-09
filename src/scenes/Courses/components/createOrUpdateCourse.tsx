import React from 'react';
import {  Modal, Button,Form,Input,Switch ,Select,Col,Row} from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import EditableImage from '../../../components/EditableImage';
import { FormInstance } from 'antd/lib/form';
import FormItem from 'antd/lib/form/FormItem';

import CourseStore from '../../../stores/courseStore';
import categoriesService from '../../../services/categories/categoriesService';
import { LiteEntityDto } from '../../../services/dto/liteEntityDto';
import userService from '../../../services/user/userService';
import UserType from '../../../services/types/userType';
import { ImageAttr } from '../../../services/dto/imageAttr';

export interface ICreateOrUpdateCourseProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  courseStore?: CourseStore;
  onOk: () => void;
  isSubmittingCourse: boolean;
  formRef:React.RefObject<FormInstance>;
}
export interface ICreateOrUpdateCourseState {
  hasDiscount?: boolean;
  defaultcourseImage:Array<ImageAttr>;
}


@inject(Stores.CourseStore)
@observer
class CreateOrUpdateCourse extends React.Component<ICreateOrUpdateCourseProps, ICreateOrUpdateCourseState> {
  categories:LiteEntityDto[]=[];
  trainers:LiteEntityDto[]=[];
  hasDiscount?:boolean=undefined;
  
  handleSubmit = async () => {
    await this.props.onOk();
  }

  state={
    hasDiscount:undefined,
    defaultcourseImage:[]
  }


  formItemLayout = {
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

  colLayout = {
  
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 12 },
    lg: { span: 12 },
    xl: { span: 12 },
    xxl: { span: 12 },
  
  };

  async componentDidMount(){
    let result= await categoriesService.getAllLite();
    this.categories=result.items;
    let result2= await userService.getAllLite({type:UserType.Trainer});
    this.trainers=result2.items;
  }
  
  componentDidUpdate(){
    const {courseModel} = this.props.courseStore!;
    
    if(this.state.defaultcourseImage.length ===0 && courseModel!== undefined&&  courseModel.imageUrl !==null){      
        this.setState({defaultcourseImage: [{
          uid: 1,
          name: `courseImage.png`,
          status: 'done',
          url: courseModel.imageUrl,
          thumbUrl: courseModel.imageUrl,
        }]});
    }

    if(courseModel === undefined && (this.state.defaultcourseImage.length>0)){
      this.setState({defaultcourseImage:[]});
    }

    if(courseModel !== undefined && courseModel.imageUrl !==null && this.state.defaultcourseImage.length >0&& this.state.defaultcourseImage[0]["url"] !== courseModel.imageUrl){
      this.setState({defaultcourseImage:[]});
    }

  }

  handleCancel = () => {
    this.setState({hasDiscount:undefined},()=>{
      this.props.onCancel();
    });
   
  }
 

  render() {
    
    const { visible, modalType } = this.props;
    const { courseModel } = this.props.courseStore!;
   
    if (this.props.visible === false && document.getElementById('course-image') != null)
      document.getElementById('course-image')!.setAttribute('value', '');

    return (
      <Modal
        visible={visible}
        title={modalType === 'create' ? L('CreateCourse') : L('EditCourse')}
        onCancel={this.handleCancel}
        centered
        destroyOnClose={true}
        maskClosable={false}
        width={"80%"}
        className={localization.isRTL() ? 'course-modal rtl-modal' : 'course-modal ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button key="submit" type="primary" loading={this.props.isSubmittingCourse} onClick={this.handleSubmit}>
            {modalType === 'create' ? L('Create') : L('Edit')}
          </Button>,
        ]}
      >
        <div className="">

      
         <Form ref={this.props.formRef}>
           <Row>
           <Col {...this.colLayout}>
          <FormItem label={L('ArName')} 
          colon={false}
           initialValue={ courseModel !== undefined && courseModel.arName ? courseModel.arName : undefined}
           name="arName" {...this.formItemLayout} rules={ [{ required: true, message: L('ThisFieldIsRequired') }]}>
              <Input />
          </FormItem>
          </Col>
          <Col {...this.colLayout}>
          <FormItem label={L('EnName')}
                    colon={false}
                    name="enName"  {...this.formItemLayout}
           initialValue={ courseModel !== undefined && courseModel.enName ? courseModel.enName : undefined}
          rules={ [{ required: true, message: L('ThisFieldIsRequired') }]}>
              <Input />
          </FormItem>
          </Col>
         
        

<Col {...this.colLayout}>
<FormItem label={L('Category')} name="categoryId"
          colon={false}
          {...this.formItemLayout}
           initialValue={ courseModel !== undefined && courseModel.categoryId ? courseModel.categoryId : undefined}
           rules= {[{ required: true, message: L('ThisFieldIsRequired') }]}

           >
               <Select
          placeholder={L('PleaseSelectCategory')}  
          showSearch
          optionFilterProp="children"
          filterOption={(input, option:any) =>
            option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          >
          {this.categories.length>0 && this.categories.map((element:LiteEntityDto) => <Select.Option key={element.value} value={element.value}>{element.text}</Select.Option>)}
        </Select>
          </FormItem>
</Col>

<Col {...this.colLayout}>
          <FormItem label={L('Fee') +` (${L('SAR')})` } 
                    colon={false}

           initialValue={ courseModel !== undefined && courseModel.fee ? courseModel.fee : undefined}
           name="fee" {...this.formItemLayout} rules={ [{ required: true, message: L('ThisFieldIsRequired') }]}>
              <Input type="number" min="0"/>
          </FormItem>
</Col>
<Col {...this.colLayout}>
          <FormItem name="hasDiscount" 
                    colon={false}
                    label={L('HasDiscount')}  {...this.formItemLayout}
              initialValue={ courseModel !== undefined && courseModel.hasDiscount ? true : false}
              valuePropName="checked"
              >
                  <Switch
                  onChange={(value)=>{
                    this.setState({hasDiscount:value});
                  }}
                    checkedChildren={L('Yes')}
                    unCheckedChildren={L('No')} />
              </FormItem>
</Col>
<Col {...this.colLayout}>
              {( (courseModel !== undefined && courseModel.hasDiscount && this.props.formRef.current?.getFieldValue(['hasDiscount'])=== undefined)
               || (courseModel !== undefined && courseModel.hasDiscount && this.props.formRef.current?.getFieldValue(['hasDiscount'])=== true) ||
                this.props.formRef.current?.getFieldValue(['hasDiscount']) ) && (
            
            <FormItem label={L('DiscountPercentage')} 
                 initialValue={ courseModel !== undefined && courseModel.discountPercentage ? courseModel.discountPercentage : undefined}
                 colon={false}

                 name="discountPercentage" {...this.formItemLayout}
                 rules={ [{ required: true, message: L('ThisFieldIsRequired') }]}
                 >
                    <Input type="number" min="0"/>
                </FormItem>
                
              )}
</Col>
<Col {...this.colLayout}>
          <FormItem label={L('Trainer')} name="trainerId"  {...this.formItemLayout}
                     colon={false}
                     initialValue={ courseModel !== undefined && courseModel.trainerId ? courseModel.trainerId : undefined}
           rules= {[{ required: true, message: L('ThisFieldIsRequired') }]}

           >
               <Select
          placeholder={L('PleaseSelectTrainer')}  
          showSearch
          optionFilterProp="children"
          filterOption={(input, option:any) =>
            option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          >
          {this.trainers.length>0 && this.trainers.map((element:LiteEntityDto) => <Select.Option key={element.value} value={element.value}>{element.text}</Select.Option>)}
        </Select>
          </FormItem>
</Col>
<Col {...this.colLayout}>
          <FormItem label={L('TrainingHoursCount')} 
                 initialValue={ courseModel !== undefined && courseModel.trainingHoursCount ? courseModel.trainingHoursCount : undefined}
                 name="trainingHoursCount" {...this.formItemLayout}
                 colon={false}
                 rules= {[{ required: true, message: L('ThisFieldIsRequired') }]}
                 >
                    <Input type="number" min="0"/>
                </FormItem>
                </Col>
                <Col {...this.colLayout}>
                <FormItem label={L('ArDescription')} 
                          colon={false}

                initialValue={ courseModel !== undefined && courseModel.arDescription ? courseModel.arDescription : undefined}
                 name="arDescription" {...this.formItemLayout} >
                    <Input.TextArea/>
                </FormItem>
</Col>
<Col {...this.colLayout}>
                <FormItem label={L('EnDescription')} 
                 initialValue={ courseModel !== undefined && courseModel.enDescription ? courseModel.enDescription : undefined}
                 colon={false}
                 name="enDescription" {...this.formItemLayout} >
                    <Input.TextArea/>
                </FormItem>
          
          
          </Col>
          <Col {...this.colLayout}>   
          <FormItem label={L('Image')} 
          {...this.formItemLayout}
          colon={false}

          required
><img id='course-image' style={{display:'none'}}/>
                 
                   <EditableImage
                   defaultFileList={courseModel!== undefined && courseModel.imageUrl!==null ? this.state.defaultcourseImage:[]}
         onSuccess={fileName => {
document.getElementById('course-image')!.setAttribute("value", fileName);
}}
/>
               
          </FormItem>
          </Col>
          </Row>
        </Form>
        </div>
      </Modal>
    );
  }
}

export default CreateOrUpdateCourse;
