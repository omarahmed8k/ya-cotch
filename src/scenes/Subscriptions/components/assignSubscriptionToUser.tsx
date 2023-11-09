import * as React from 'react';
import { Modal, Button,Row,Col,Form,Select } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import { FormInstance } from 'antd/lib/form';
import "./createOrUpdateSubscription.css";
import SubscriptionStore from '../../../stores/subscriptionStore';
import { AssignSubscriptionToUserDto } from '../../../services/subscriptions/dto/assignSubscriptionToUserDto';
import { LiteEntityDto } from '../../../services/dto/liteEntityDto';
import restaurantsService from '../../../services/restaurants/restaurantsService';
import shopsService from '../../../services/shops/shopsService';
import userService from '../../../services/user/userService';
import UserType from '../../../services/types/userType';


export interface IAssignSubscriptionToUserProps{
  visible: boolean;
  onCancel: () => void;
  subscriptionStore?: SubscriptionStore;
  isSubmittingSubscription: boolean;
  subscriptionId:number;
}

export interface IAssignSubscriptionToUserState{
  trainers:Array<LiteEntityDto>;
  restaurants:Array<LiteEntityDto>;
  shops:Array<LiteEntityDto>;

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
  md: { span: 24 },
  lg: { span: 24 },
  xl: { span: 24 },
  xxl: { span: 24 },

};
          
@inject(Stores.SubscriptionStore)
@observer
class AssignSubscriptionToUser extends React.Component<IAssignSubscriptionToUserProps, IAssignSubscriptionToUserState> {
  formRef = React.createRef<FormInstance>();
  trainers:Array<LiteEntityDto>=[];
  restaurants:Array<LiteEntityDto>=[];
  shops:Array<LiteEntityDto>=[];
  state={
    trainers:[],
    restaurants:[],
    shops:[]
  };

async componentDidMount(){
  let result = await restaurantsService.getAllLite();
  this.restaurants=result.items;
  let result2 = await shopsService.getAllLite();
  this.shops=result2.items;
  let result3 = await userService.getAllLite({type:UserType.Trainer});
  this.trainers=result3.items;
  this.setState({shops:this.shops,restaurants:this.restaurants,trainers:this.trainers});
}

  handleSubmit = async () => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
      
        values.subscriptionId = this.props.subscriptionId;
        await this.props.subscriptionStore!.assignSubscriptionToUser(values as AssignSubscriptionToUserDto);
     
      this.props.onCancel();
      form!.resetFields();
    }).catch((reason:any)=>{
    });
    
  }

  handleCancel = () => {
    this.props.onCancel();
   
  }

  render() {
   
    const { visible } = this.props;

    return (
      <Modal
        visible={visible}
        title={L('AssignSubscriptionToUser')}
        onCancel={this.handleCancel}
        centered
        destroyOnClose
        maskClosable={false}
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button key="submit" type="primary" loading={this.props.isSubmittingSubscription} onClick={this.handleSubmit}>
            { L('Assign')}
          </Button>,
        ]}
      >
         <Form ref={this.formRef}>

        <Row>
          
   
              {this.props.subscriptionStore && this.props.subscriptionStore!.subscriptionModel && this.props.subscriptionStore!.subscriptionModel!.target === 0 ?(
           
                <Col {...colLayout}>
                  <Form.Item
                    label={L("Trainer")}
                    name="trainerId"
                    colon={false}
                    {...formItemLayout}
                    rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                  >
                     <Select
                    placeholder={L('PleaseSelectTrainer')}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option: any) =>
                      option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                  {this.trainers.length>0 && this.trainers.map((element:LiteEntityDto) => <Select.Option key={element.value} value={element.value}>{element.text}</Select.Option>)}
                  </Select>
                  </Form.Item>
                </Col>
               
              ): this.props.subscriptionStore && this.props.subscriptionStore!.subscriptionModel && this.props.subscriptionStore!.subscriptionModel!.target === 1 ?
              (
                <Col {...colLayout}>
                <Form.Item
                  label={L("Restaurant")}
                  name="restaurantId"
                  colon={false}
                  {...formItemLayout}
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
                {this.restaurants.length>0 && this.restaurants.map((element:LiteEntityDto) => <Select.Option key={element.value} value={element.value}>{element.text}</Select.Option>)}
                </Select>
                </Form.Item>
              </Col>
         
                ): this.props.subscriptionStore && this.props.subscriptionStore!.subscriptionModel && this.props.subscriptionStore!.subscriptionModel!.target === 2 ? 
              (
                <Col {...colLayout}>
                <Form.Item
                  label={L("Shop")}
                  name="shopId"
                  colon={false}
                  {...formItemLayout}
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
                {this.shops.length>0 && this.shops.map((element:LiteEntityDto) => <Select.Option key={element.value} value={element.value}>{element.text}</Select.Option>)}
                </Select>
                </Form.Item>
              </Col>
         
               ): null
            }
 
        </Row>

</Form>

      </Modal>
    );
  }
}

export default AssignSubscriptionToUser;
