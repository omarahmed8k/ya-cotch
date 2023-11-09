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
import "./createOrUpdateProduct.css";
import categoriesService from '../../../services/categories/categoriesService';
import CategoryType from '../../../services/types/categoryType';
import ProductStore from '../../../stores/productStore';
import shopsService from '../../../services/shops/shopsService';
import { CreateProductDto } from '../../../services/products/dto/createProductDto';
import { UpdateProductDto } from '../../../services/products/dto/updateProductDto';


const {TabPane} = Tabs;

export interface ICreateOrUpdateProductProps{
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  productStore?: ProductStore;
  gallery:Array<string>;
  isSubmittingProduct: boolean;
}

export interface ICreateOrUpdateProductState{
  categories:Array<LiteEntityDto>,
  shops:Array<LiteEntityDto>,
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
          
@inject(Stores.ProductStore)
@observer
class CreateOrUpdateProduct extends React.Component<ICreateOrUpdateProductProps, ICreateOrUpdateProductState> {
  galleryFiles:Array<string>=[];
  formRef = React.createRef<FormInstance>();
  defaultGalleryFiles:Array<any>=[];
  categories:Array<LiteEntityDto>=[];
  shops:Array<LiteEntityDto>=[];

  state={
    categories:[],
    shops:[],
    galleryFiles:[],
  };

  async componentDidMount(){
    let result = await categoriesService.getAllLite({type:CategoryType.Products});
    this.categories = result.items;
    this.setState({categories:result.items});

    let result2 = await shopsService.getAllLite();
    this.shops = result2.items;
    this.setState({shops:result2.items});
  }

  componentDidUpdate(){
    const {productModel}=this.props.productStore!;

    if((this.galleryFiles.length===0 &&  this.props.gallery.length>0)
    || productModel!== undefined && this.props.gallery.length !== this.galleryFiles.length){
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
        await this.props.productStore!.createProduct(values as CreateProductDto);
      } else {
        values.id = this.props.productStore!.productModel!.id;
        await this.props.productStore!.updateProduct(values as UpdateProductDto);
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
    const { productModel } = this.props.productStore!;
   
    return (
      <Modal
        visible={visible}
        title={modalType === 'create' ? L('CreateProduct') : L('EditProduct')}
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
          <Button key="submit" type="primary" loading={this.props.isSubmittingProduct} onClick={this.handleSubmit}>
            {modalType === 'create' ? L('Create') : L('Edit')}
          </Button>,
        ]}
      >
        <div className="product-modal">
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

              initialValue={productModel !== undefined && productModel.arName ? productModel.arName : undefined}
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

              initialValue={productModel !== undefined && productModel.enName ? productModel.arName : undefined}
              {...formItemLayout}
              rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
            >
              <Input />
            </Form.Item>
          </Col>
         

          <Col {...colLayout}>
                <Form.Item
                  label={L("Shop")}
                  name="shopId"              colon={false}

                  {...formItemLayout}
                  initialValue={productModel !== undefined && productModel.shop ? productModel.shop!.value : undefined}
                  rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                >
                  <Select
                    placeholder={L('PleaseSelectShop')}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option: any) =>
                      option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                  {this.state.shops.length > 0 && this.state.shops.map((element: LiteEntityDto) => <Select.Option key={element.value} value={element.value}>{element.text}</Select.Option>)}

                  </Select>
                </Form.Item>
              </Col>
   

          <Col {...colLayout}>
                <Form.Item
                  label={L("Category")}
                  name="categoryId"              colon={false}

                  {...formItemLayout}
                  initialValue={productModel !== undefined && productModel.category ? productModel.category!.value : undefined}
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
              label={L("ArDescriptions")}
              name="arComponents"
              colon={false}

              initialValue={productModel !== undefined && productModel.arComponents ? productModel.arComponents : undefined}
              {...formItemLayout}
              rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
            >
              <Input.TextArea />
            </Form.Item>
          </Col>

              <Col {...colLayout}>
            <Form.Item
              label={L("EnDescriptions")}
              name="enComponents"
              colon={false}

              initialValue={productModel !== undefined && productModel.enComponents ? productModel.enComponents : undefined}
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

              initialValue={productModel !== undefined && productModel.price ? productModel.price : undefined}
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

export default CreateOrUpdateProduct;
