import * as React from 'react';
import { Modal, Button,Row,Col,Form,Input,Select,Switch } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import { FormInstance } from 'antd/lib/form';
import "./createOrUpdateSubscription.css";
import SubscriptionStore from '../../../stores/subscriptionStore';
import { UpdateSubscriptionDto } from '../../../services/subscriptions/dto/updateSubscriptionDto';
import { CreateSubscriptionDto } from '../../../services/subscriptions/dto/createSubscriptionDto';


export interface ICreateOrUpdateSubscriptionProps{
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  subscriptionStore?: SubscriptionStore;
  isSubmittingSubscription: boolean;
}

export interface ICreateOrUpdateSubscriptionState{
  selectedTarget?:number;
  unlimeted: boolean;
  loadingStatus:boolean;

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
          
@inject(Stores.SubscriptionStore)
@observer
class CreateOrUpdateSubscription extends React.Component<ICreateOrUpdateSubscriptionProps, ICreateOrUpdateSubscriptionState> {
  formRef = React.createRef<FormInstance>();
  unlimeted?:boolean=undefined;
  selectedTarget?:number=undefined;


  state={
    selectedTarget:undefined,
    unlimeted:false,
    loadingStatus:false

  };

componentDidUpdate(){
  const {subscriptionModel} = this.props.subscriptionStore!;
  if(subscriptionModel !== undefined && this.props.modalType==='edit' && this.state.selectedTarget !== subscriptionModel.target){
    this.setState({selectedTarget:subscriptionModel.target});
    this.selectedTarget=subscriptionModel.target;
  }
  if(this.props.modalType==='create' && this.state.selectedTarget !== undefined && this.selectedTarget !== undefined){
    this.setState({selectedTarget:undefined},()=>{
      this.selectedTarget=undefined;
    });
  }
  if(subscriptionModel !== undefined && subscriptionModel.priceTo === null && this.state.unlimeted !== true && !this.state.loadingStatus){
    this.setState({unlimeted:true,loadingStatus:true});
  }

}

 
  handleSubmit = async () => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
      if (this.props.modalType === "create") {
        await this.props.subscriptionStore!.createSubscription(values as CreateSubscriptionDto);
      } else {
        values.id = this.props.subscriptionStore!.subscriptionModel!.id;
        await this.props.subscriptionStore!.updateSubscription(values as UpdateSubscriptionDto);
      }
      this.props.onCancel();
      form!.resetFields();
    }).catch((reason:any)=>{
    });
    
  }



  handleCancel = () => {
    this.setState({unlimeted:false,selectedTarget:undefined,loadingStatus:false},()=>{
      this.unlimeted=undefined;
      this.props.onCancel();
    });
   
  }

  render() {
   
    const { visible, modalType } = this.props;
    const { subscriptionModel } = this.props.subscriptionStore!;
   
    return (
      <Modal
        visible={visible}
        title={modalType === 'create' ? L('CreateSubscription') : L('EditSubscription')}
        onCancel={this.handleCancel}
        centered
        width={'80%'}
        destroyOnClose
        maskClosable={false}
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button key="submit" type="primary" loading={this.props.isSubmittingSubscription} onClick={this.handleSubmit}>
            {modalType === 'create' ? L('Create') : L('Edit')}
          </Button>,
        ]}
      >
        <div className="subscription-modal">
         <Form ref={this.formRef}>

        <Row>
          
          <Col {...colLayout}>
            <Form.Item
              label={L("Name")}
              name="name"
              colon={false}

              initialValue={subscriptionModel !== undefined && subscriptionModel.name ? subscriptionModel.name : undefined}
              {...formItemLayout}
              rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col {...colLayout}>
            <Form.Item
              label={L("Fee")+" ("+L("SAR")+")"}
              name="fee"
              colon={false}

              initialValue={subscriptionModel !== undefined && subscriptionModel.fee ? subscriptionModel.fee : undefined}
              {...formItemLayout}
              rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
            >
              <Input type="number" min="0"/>
            </Form.Item>
          </Col>
   
          <Col {...colLayout}>
            <Form.Item
              label={L("Color")}
              name="colorCode"
              colon={false}
              initialValue={subscriptionModel !== undefined && subscriptionModel.colorCode ? subscriptionModel.colorCode : undefined}
              {...formItemLayout}
              rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
            >
              <Input type="color" defaultValue="#000000"/>
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item
              label={`${L("Duration")} (${L('Days')})`}
              name="duration"
              colon={false}

              initialValue={subscriptionModel !== undefined && subscriptionModel.duration ? subscriptionModel.duration : undefined}
              {...formItemLayout}
              rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
            >
              <Input type="number" min="0"/>
            </Form.Item>
          </Col>
         
          <Col {...colLayout}>
                <Form.Item
                  label={L("Target")}
                  name="target"     
                  colon={false}
                  {...formItemLayout}
                  initialValue={subscriptionModel !== undefined && subscriptionModel.target !== undefined ? subscriptionModel.target : undefined}
                  rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                >
                  <Select
                    placeholder={L('PleaseSelectTarget')}
                    showSearch
                    onChange={(value:number)=>{
                      this.setState({selectedTarget:value});
                    }}
                    optionFilterProp="children"
                    filterOption={(input, option: any) =>
                      option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Select.Option key={0} value={0}>{L('Trainer')}</Select.Option>
                    <Select.Option key={1} value={1}>{L('Restaurant')}</Select.Option>
                    <Select.Option key={2} value={2}>{L('Shop')}</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
 
              {this.state.selectedTarget === 0 ?(
                <>
                <Col {...colLayout}>
                  <Form.Item
                    label={L("BookingRequestsCount")}
                    name="requestsCount"
                    colon={false}
                    initialValue={subscriptionModel !== undefined && subscriptionModel.requestsCount!==undefined ? subscriptionModel.requestsCount : undefined}
                    {...formItemLayout}
                    rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                  >
                    <Input type="number" min="1"/>
                  </Form.Item>
                </Col>
                <Col {...colLayout}>
                <Form.Item
                  label={L("CoursesCount")}
                  name="itemsCount"
                  colon={false}
                  initialValue={subscriptionModel !== undefined && subscriptionModel.itemsCount!==undefined ? subscriptionModel.itemsCount : undefined}
                  {...formItemLayout}
                  rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                >
                  <Input type="number" min="1"/>
                </Form.Item>
              </Col>
              </>
              ): this.state.selectedTarget === 1 ?
              (
                <>
                <Col {...colLayout}>
                  <Form.Item
                    label={L("OrdersCount")}
                    name="requestsCount"
                    colon={false}
                    initialValue={subscriptionModel !== undefined && subscriptionModel.requestsCount!==undefined ? subscriptionModel.requestsCount : undefined}
                    {...formItemLayout}
                    rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                  >
                    <Input type="number" min="1"/>
                  </Form.Item>
                </Col>
                <Col {...colLayout}>
                <Form.Item
                  label={L("DishesCount")}
                  name="itemsCount"
                  colon={false}
                  initialValue={subscriptionModel !== undefined && subscriptionModel.itemsCount!==undefined ? subscriptionModel.itemsCount : undefined}
                  {...formItemLayout}
                  rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                >
                  <Input type="number" min="1"/>
                </Form.Item>
              </Col>
              </>
              ): this.state.selectedTarget === 2 ? 
              (
                <>
                <Col {...colLayout}>
                  <Form.Item
                    label={L("OrdersCount")}
                    name="requestsCount"
                    colon={false}
                    initialValue={subscriptionModel !== undefined && subscriptionModel.requestsCount!==undefined ? subscriptionModel.requestsCount : undefined}
                    {...formItemLayout}
                    rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                  >
                    <Input type="number" min="1"/>
                  </Form.Item>
                </Col>
                <Col {...colLayout}>
                <Form.Item
                  label={L("ProductsCount")}
                  name="itemsCount"
                  colon={false}
                  initialValue={subscriptionModel !== undefined && subscriptionModel.itemsCount!==undefined ? subscriptionModel.itemsCount : undefined}
                  {...formItemLayout}
                  rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                >
                  <Input type="number" min="1"/>
                </Form.Item>
              </Col>
              </>
              ): null
            }
            {this.state.selectedTarget === 0 || this.state.selectedTarget === 1 || this.state.selectedTarget=== 2 ?(
              <>
                <Col {...colLayout}>
            <Form.Item name="unlimeted" 
                      colon={false}
                      label={L('Unlimited?')}  {...formItemLayout}
                      initialValue={ subscriptionModel !== undefined && subscriptionModel.priceTo=== null ? true : false}
                      // initialValue={ subscriptionModel !== undefined && subscriptionModel.priceTo=== undefined ? true : false}
                valuePropName="checked"
                >
                    <Switch
                    onChange={(value)=>{
                      this.setState({unlimeted:value});
                    }}
                      checkedChildren={L('Yes')}
                      unCheckedChildren={L('No')} />
                </Form.Item>
  </Col>
 

                             
                              {(this.state.unlimeted === true )
                              
                                 ? (
                                <Col {...colLayout}>
                                <Form.Item label={`${L('Price')} (${L('From')} / ${L('SAR')})`} 
                                initialValue={ subscriptionModel !== undefined ? subscriptionModel.priceFrom : undefined}
                                colon={false}
                                name="priceFrom"
                                {...formItemLayout}
                                rules={ [{ required: true, message: L('ThisFieldIsRequired') }]}
                                >
                                    <Input type="number" min="0"/>
                                </Form.Item>
                                </Col>
                           
                             ) : 
                             (this.state.unlimeted === false || subscriptionModel === undefined )?
                              (
                                <>
                                <Col {...colLayout}>
                           <Form.Item label={`${L('Price')} (${L('From')} / ${L('SAR')})`} 
                           initialValue={ subscriptionModel !== undefined ? subscriptionModel.priceFrom : undefined}
                           colon={false}
                           name="priceFrom"
                           {...formItemLayout}
                           rules={ [{ required: true, message: L('ThisFieldIsRequired') }]}
                           >
                               <Input type="number" min="0"/>
                           </Form.Item>
                           </Col>
                           <Col {...colLayout}>
                     <Form.Item label={`${L('Price')} (${L('To')} / ${L('SAR')})`} 
                         initialValue={ subscriptionModel !== undefined ? subscriptionModel.priceTo : undefined}
                         colon={false}
                         name="priceTo"
                         {...formItemLayout}
                         rules={ [{ required: true, message: L('ThisFieldIsRequired') }]}
                         >
                             <Input type="number" min="0"/>
                         </Form.Item>
                         </Col>
                          </>
                
                                ):null}
           

              </>
              )
:null
            }
        
            
        </Row>

</Form>

</div>
      </Modal>
    );
  }
}

export default CreateOrUpdateSubscription;
