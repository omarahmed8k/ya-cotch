import * as React from 'react';
import { Modal, Button,Row,Col,Form,Input,Select,Tabs, message } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import UploadImage from '../../../components/UploadImage';
import localization from '../../../lib/localization';
import { FormInstance } from 'antd/lib/form';
import { InfoCircleOutlined, InstagramOutlined, PlusOutlined } from '@ant-design/icons';
import { LiteEntityDto } from '../../../services/dto/liteEntityDto';
import "./createOrUpdateDish.css";
import DishStore from '../../../stores/dishStore';
import categoriesService from '../../../services/categories/categoriesService';
import { CreateDishDto } from '../../../services/dishes/dto/createDishDto';
import { UpdateDishDto } from '../../../services/dishes/dto/updateDishDto';
import restaurantsService from '../../../services/restaurants/restaurantsService';
import CategoryType from '../../../services/types/categoryType';


const {TabPane} = Tabs;

export interface ICreateOrUpdateDishProps{
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  dishStore?: DishStore;
  gallery:Array<string>;
  isSubmittingDish: boolean;
}

export interface ICreateOrUpdateDishState{
  categories:Array<LiteEntityDto>,
  restaurants:Array<LiteEntityDto>,

  galleryFiles:Array<string>;


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
    lg: { span: 14 },
    xl: { span: 14 },
    xxl: { span: 14 },
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
          
@inject(Stores.DishStore)
@observer
class CreateOrUpdateDish extends React.Component<ICreateOrUpdateDishProps, ICreateOrUpdateDishState> {
  galleryFiles:Array<string>=[];
  formRef = React.createRef<FormInstance>();
  defaultGalleryFiles:Array<any>=[];
  categories:Array<LiteEntityDto>=[];
  restaurants:Array<LiteEntityDto>=[];

  state={
    categories:[],
    restaurants:[],
    galleryFiles:[],
  };

  async componentDidMount(){
    let result = await categoriesService.getAllLite({type:CategoryType.Dishes});
    this.categories = result.items;
    this.setState({categories:result.items});

    let result2 = await restaurantsService.getAllLite();
    this.restaurants = result2.items;
    this.setState({restaurants:result2.items});
  }

  componentDidUpdate(){
    const {dishModel}=this.props.dishStore!;

    if((this.galleryFiles.length===0 &&  this.props.gallery.length>0)
    || dishModel!== undefined && this.props.gallery.length !== this.galleryFiles.length){
      this.defaultGalleryFiles=[];
      this.galleryFiles = this.props.gallery;
      this.props.gallery.map((item:string,index:number)=>{
        this.defaultGalleryFiles.push( {
          uid: index,
          name: `${index}.png`,
          status: 'done',
          url: item,
          thumbUrl: item,
        });
      });
      this.forceUpdate();

    }
  }
   
 
  handleSubmit = async () => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
      values.images = this.galleryFiles;
      if (this.props.modalType === "create") {
        await this.props.dishStore!.createDish(values as CreateDishDto);
      } else {
        values.id = this.props.dishStore!.dishModel!.id;
        await this.props.dishStore!.updateDish(values as UpdateDishDto);
      }
      this.props.onCancel();
      form!.resetFields();
    }).catch((reason:any)=>{
      message.error(L("PleaseFillAllRequiredFileds"));
    });
    
  }



  handleCancel = () => {
    this.galleryFiles=[];
    this.defaultGalleryFiles=[];
    this.forceUpdate();

    this.props.onCancel();
  }

  render() {
   
    const { visible, onCancel, modalType } = this.props;
    const { dishModel } = this.props.dishStore!;
   
    return (
      <Modal
        visible={visible}
        title={modalType === 'create' ? L('CreateDish') : L('EditDish')}
        onCancel={onCancel}
        centered
        width={'80%'}
        destroyOnClose
        maskClosable={false}
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button key="submit" type="primary" loading={this.props.isSubmittingDish} onClick={this.handleSubmit}>
            {modalType === 'create' ? L('Create') : L('Edit')}
          </Button>,
        ]}
      >
        <div className="dish-modal">
         <Form ref={this.formRef}>


<Row>
    <Tabs defaultActiveKey="1">
      <TabPane
        tab={
          <span>
            <InfoCircleOutlined />
            {L('General')}
          </span>
        }
        key="1"
      >
        <Row>
          
          <Col {...colLayout}>
            <Form.Item
              label={L("ArName")}
              name="arName"
              colon={false}

              initialValue={dishModel !== undefined && dishModel.arName ? dishModel.arName : undefined}
              {...formItemLayout}
              rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item
              label={L("EnName")}
              name="enName"
              colon={false}

              initialValue={dishModel !== undefined && dishModel.enName ? dishModel.arName : undefined}
              {...formItemLayout}
              rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
            >
              <Input />
            </Form.Item>
          </Col>
         

          <Col {...colLayout}>
                <Form.Item
                  label={L("Restaurant")}
                  name="restaurantId"
                  {...formItemLayout}              colon={false}

                  initialValue={dishModel !== undefined && dishModel.restaurant ? dishModel.restaurant!.value : undefined}
                  rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                >
                  <Select
                    placeholder={L('PleaseSelectRestaurant')}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option: any) =>
                      option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                  {this.state.restaurants.length > 0 && this.state.restaurants.map((element: LiteEntityDto) => <Select.Option key={element.value} value={element.value}>{element.text}</Select.Option>)}

                  </Select>
                </Form.Item>
              </Col>
   

          <Col {...colLayout}>
                <Form.Item
                  label={L("Category")}
                  name="categoryId"
                  {...formItemLayout}              colon={false}

                  initialValue={dishModel !== undefined && dishModel.category ? dishModel.category!.value : undefined}
                  rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                >
                  <Select
                    placeholder={L('PleaseSelectCategory')}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option: any) =>
                      option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                  {this.state.categories.length > 0 && this.state.categories.map((element: LiteEntityDto) => <Select.Option key={element.value} value={element.value}>{element.text}</Select.Option>)}

                  </Select>
                </Form.Item>
              </Col>
   

              <Col {...colLayout}>
            <Form.Item
              label={L("ArComponents")}
              name="arComponents"
              colon={false}

              initialValue={dishModel !== undefined && dishModel.arComponents ? dishModel.arComponents : undefined}
              {...formItemLayout}
              rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
            >
              <Input.TextArea />
            </Form.Item>
          </Col>

              <Col {...colLayout}>
            <Form.Item
              label={L("EnComponents")}
              name="enComponents"
              colon={false}

              initialValue={dishModel !== undefined && dishModel.enComponents ? dishModel.enComponents : undefined}
              {...formItemLayout}
              rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
            >
              <Input.TextArea />
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item
              label={L("Price")+" ("+L("SAR")+")"}
              name="price"
              colon={false}

              initialValue={dishModel !== undefined && dishModel.price ? dishModel.price : undefined}
              {...formItemLayout}
              rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
            >
              <Input type="number" min="0" />
            </Form.Item>
          </Col>
        </Row>

      </TabPane>
    
     <TabPane
        tab={
          <span>
            <InstagramOutlined />
            {L('Gallery')}
          </span>
        }
        key="2"
      >
       <Form.Item label={L('Images')}     colon={false}
 extra={
                    <span>
                        {L('SupportedTypesPNGJPGJPEG')}
                        <br /> 
                        {L('MaxFileLimitIs5MB')}
                    </span>}>
                    {
                     this.galleryFiles.length>0 &&  this.props.gallery.length>0?
                     <UploadImage 
                     defaultFileList={this.defaultGalleryFiles}
                     currentCount={this.defaultGalleryFiles.length}
              onUploadComplete={(fileName: string) => {this.galleryFiles.push(fileName);}}
              onRemoveImage={(fileName:string)=>{this.galleryFiles=this.galleryFiles.filter(file=> file !== fileName);}}
          >
            <PlusOutlined/>
          </UploadImage> :<UploadImage 
                     defaultFileList={[]}
                     currentCount={0}
              onUploadComplete={(fileName: string) => {this.galleryFiles.push(fileName);}}
              onRemoveImage={(fileName:string)=>{this.galleryFiles=this.galleryFiles.filter(file=> file !== fileName);}}
          >
            <PlusOutlined/>
          </UploadImage>
                  }
                                  
                </Form.Item>
  
      </TabPane>
    </Tabs>

</Row>
</Form>

</div>
      </Modal>
    );
  }
}

export default CreateOrUpdateDish;
