import React from 'react';
import { Form, Modal, Button, Input,Col,Row,Select } from 'antd';
import CategoryStore from '../../../stores/categoryStore';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import FormItem from 'antd/lib/form/FormItem';
import localization from '../../../lib/localization';
import { FormInstance } from 'antd/lib/form';
import EditableImage from '../../../components/EditableImage';
import { ImageAttr } from '../../../services/dto/imageAttr';

export interface ICreateOrUpdateCategoryProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  categoryStore?: CategoryStore;
  onOk: () => void;
  isSubmittingCategory: boolean;
  formRef:React.RefObject<FormInstance>;
}


export interface ICreateOrUpdateCategoryState {
  defaultcategoryIcon:Array<ImageAttr>;
  defaultcategoryImage:Array<ImageAttr>;
}


@inject(Stores.CategoryStore)
@observer
class CreateOrUpdateCategory extends React.Component<ICreateOrUpdateCategoryProps, ICreateOrUpdateCategoryState> {
  formRef = React.createRef<FormInstance>();

state={
  defaultcategoryIcon:[],
  defaultcategoryImage:[]
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
    md: { span: 24 },
    lg: { span: 24 },
    xl: { span: 24 },
    xxl: { span: 24 },
  
  };
  handleSubmit = async () => {
    await this.props.onOk();
  }

  handleCancel = () => {
      this.props.onCancel();
  }

  componentDidUpdate(){
    const {categoryModel} = this.props.categoryStore!;
    
    if(this.state.defaultcategoryImage.length ===0 && categoryModel!== undefined&&  categoryModel.imageUrl !==null){      
        this.setState({defaultcategoryImage: [{
          uid: 1,
          name: `categoryImage.png`,
          status: 'done',
          url: categoryModel.imageUrl,
          thumbUrl: categoryModel.imageUrl,
        }]});
    }
    if(this.state.defaultcategoryIcon.length === 0 && categoryModel!== undefined&&  categoryModel.iconUrl !==null){      
        this.setState({defaultcategoryIcon: [{
          uid: 1,
          name: 'categoryIcon.png',
          status: 'done',
          url: categoryModel.iconUrl,
          thumbUrl: categoryModel.iconUrl,
        }]});
              
    }

    if(categoryModel === undefined && (this.state.defaultcategoryImage.length>0 || this.state.defaultcategoryIcon.length>0)){
      this.setState({defaultcategoryImage:[],defaultcategoryIcon:[]});
    }
    if(categoryModel !== undefined && categoryModel.imageUrl !==null && this.state.defaultcategoryImage.length >0&& this.state.defaultcategoryImage[0]["url"] !== categoryModel.imageUrl){
      this.setState({defaultcategoryImage:[],defaultcategoryIcon:[]});
    }
    if(categoryModel !== undefined && categoryModel.iconUrl !==null && this.state.defaultcategoryIcon.length >0 && this.state.defaultcategoryIcon[0]["url"] !== categoryModel.iconUrl ){
      this.setState({defaultcategoryImage:[],defaultcategoryIcon:[]});
    }

  }
  render() {
    
    const { visible, modalType } = this.props;
    const { categoryModel } = this.props.categoryStore!;
    if (this.props.visible === false && document.getElementById('category-image') != null)
      document.getElementById('category-image')!.setAttribute('value', '');
      if (this.props.visible === false && document.getElementById('category-icon') != null)
      document.getElementById('category-icon')!.setAttribute('value', '');

    return (
      <Modal
        visible={visible}
        title={modalType === 'create' ? L('CreateCategory') : L('EditCategory')}
        onCancel={this.handleCancel}
        centered
        destroyOnClose
        maskClosable={false}
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button key="submit" type="primary" loading={this.props.isSubmittingCategory} onClick={this.handleSubmit}>
            {modalType === 'create' ? L('Create') : L('Edit')}
          </Button>,
        ]}
      >
         <Form ref={this.props.formRef}>
           <Row>
           <Col {...this.colLayout}>
           
          <FormItem label={L('ArName')} 
          {...this.formItemLayout}
          colon={false}
           initialValue={ categoryModel !== undefined && categoryModel.arName ? categoryModel.arName : undefined}
           name="arName"  rules={ [{ required: true, message: L('ThisFieldIsRequired') }]}>
              <Input />
          </FormItem>
          </Col>
          <Col {...this.colLayout}>
          <FormItem label={L('EnName')} name="enName" 
          {...this.formItemLayout}
          colon={false}

           initialValue={ categoryModel !== undefined && categoryModel.enName ? categoryModel.enName : undefined}
          rules={ [{ required: true, message: L('ThisFieldIsRequired') }]}>
              <Input />
          </FormItem>
          </Col>
          <Col {...this.colLayout}>
          <FormItem label={L('Type')} name="type" 
          {...this.formItemLayout}
          colon={false}
           initialValue={ categoryModel !== undefined ? categoryModel.type : undefined}
          rules={ [{ required: true, message: L('ThisFieldIsRequired') }]}>
               <Select
                  placeholder={L('PleaseSelectType')}  
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option:any) =>
                    option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  >
                    <Select.Option key={0} value={0}>{L("Courses1")}</Select.Option>
                    <Select.Option key={1} value={1}>{L("Dishes")}</Select.Option>
                    <Select.Option key={2} value={2}>{L("Products")}</Select.Option>

                    
                   
                </Select>
          </FormItem>
          </Col>
          <Col {...this.colLayout}>
         
          <FormItem label={L('Image')} 
          {...this.formItemLayout}
          colon={false}

          required
><img id='category-image' style={{display:'none'}}/>
                 
                   <EditableImage
                   defaultFileList={categoryModel!== undefined && categoryModel.imageUrl!==null ? this.state.defaultcategoryImage:[]}
         onSuccess={fileName => {
document.getElementById('category-image')!.setAttribute("value", fileName);
}}
/>
               
          </FormItem>
          
          
          </Col>

          <Col {...this.colLayout}>
          <FormItem label={L('Icon')} 
          {...this.formItemLayout}
          colon={false}

>
          <img id='category-icon' style={{display:'none'}}/>
           
           <EditableImage
                   defaultFileList={categoryModel!== undefined && categoryModel.iconUrl!==null ? this.state.defaultcategoryIcon:[]}
                   onSuccess={fileName => {
         document.getElementById('category-icon')!.setAttribute("value", fileName);
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

export default CreateOrUpdateCategory;
