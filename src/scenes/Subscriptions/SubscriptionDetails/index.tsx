import * as React from 'react';
import { Tag,Tabs,Table } from 'antd';
import { InfoCircleOutlined,ArrowRightOutlined,ArrowLeftOutlined, UserOutlined} from '@ant-design/icons';

import timingHelper from '../../../lib/timingHelper';
import moment from 'moment';
import { L } from '../../../i18next';
import AppComponentBase from '../../../components/AppComponentBase';
import "./index.css";
import localization from '../../../lib/localization';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import ThousandSeparator from '../../../components/ThousandSeparator';
import { SubscriptionDto } from '../../../services/subscriptions/dto/subscriptionDto';
import subscriptionsService from '../../../services/subscriptions/subscriptionsService';
import SubscriptionTarget from '../../../services/types/subscriptionTarget';
import { UserSubscriptionDto } from '../../../services/subscriptions/dto/userSubscriptionDto';

const { TabPane } = Tabs;

export interface ISubscriptionDetailsModalState{
  subscriptionModel:SubscriptionDto;
}


@inject(Stores.CategoryStore)
@observer
export class SubscriptionDetails extends AppComponentBase<any, ISubscriptionDetailsModalState> {

  state={
    subscriptionModel:{} as SubscriptionDto,
  }


  async componentDidMount(){ 
    document.title= `${L("SubscriptionDetails")} | YaCotch `;   
    try {
         if(this.props.match.params.id){
          let id = this.props.match.params.id;
          let subscription = await subscriptionsService.getSubscription({id:id});
          this.setState({subscriptionModel: subscription},async()=>{
          });
        }
      } catch (e) {
        window.location.href = '/subscriptions';
      }
  }


  resolveTarget=(target:number)=>{
    let targetName=undefined;
    switch(target){
      case SubscriptionTarget.Restaurant:
        targetName= L('Restaurant');
        break;
      case SubscriptionTarget.Shop:
        targetName= L('Shop');
        break;
      case SubscriptionTarget.Trainer:
        targetName=L('Trainer');
        break;
     
    }
    return <Tag color={'processing'} className='ant-tag-disable-pointer'>{ targetName}</Tag>;
 
  }

  subscribersTableColumns = [
    {
      title: L('SubscriberName'),
      dataIndex: 'user',
      key: 'user',
      render:(user:any,item:UserSubscriptionDto)=>{
        return item.user?.text;
      }
    },
    {
      title: L('Status'),
      dataIndex: 'isExpired',
      key: 'isExpired',
      render:(isExpired:any,item:UserSubscriptionDto)=>{
        return <Tag color={ !item.isExpired ? 'green' : 'volcano'} className='ant-tag-disable-pointer'>
        {!item.isExpired ? L('Valid') : L('Expired')}
      </Tag>
      }
    },

    {
      title: L('SubscribedTime'),
      dataIndex: 'creationTime',
      key: 'creationTime',
      render:(creationTime:string, item:UserSubscriptionDto)=>{
        return item.creationTime ? moment(item.creationTime).format(timingHelper.defaultDateTimeFormat):undefined;
      }
    },
    {
      title: L('ReminingDays'),
      dataIndex: 'ReminingDays',
      key: 'ReminingDays',
      render:(creationTime:string, item:UserSubscriptionDto)=>{
        return  parseInt(moment.duration(moment(new Date()).diff(item.creationTime)).asDays()+"");
      
      }
    }, 
         
  ];


 render(){
   const {subscriptionModel}= this.state;

   return (
   <div className="product-page">
     <span className="back-button">
     {localization.isRTL() ? 
     <ArrowRightOutlined onClick={()=> window.location.href = '/subscriptions'} />
     :
     <ArrowLeftOutlined onClick={()=> window.location.href = '/subscriptions'} />
     }
     </span>
     
     <Tabs defaultActiveKey="1">
           <TabPane
             tab={
               <span>
                 <InfoCircleOutlined/>
                 {L('General')}
               </span>
             }
             key="1"
           >
      <div className="details-wrapper">
      <div className="detail-wrapper">
          <span className="detail-label">{L('Name')}</span>
          <span className="detail-value">{subscriptionModel !== undefined ? subscriptionModel.name : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Fee')}</span>
          <span className="detail-value">{subscriptionModel !== undefined && subscriptionModel.fee!==undefined ? <ThousandSeparator number={subscriptionModel.fee} currency={L("SAR")} /> : L("NotAvailable")}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('ColorCode')}</span>
          <span className="detail-value">{subscriptionModel !== undefined ? <div className="colorCode" style={{background:subscriptionModel.colorCode}}>{subscriptionModel.colorCode}</div> : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('SubscriptionDuration')}</span>
          <span className="detail-value">{subscriptionModel !== undefined ? `${subscriptionModel.duration} ${L('Days')}` : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('SubscribersCount')}</span>
          <span className="detail-value">{subscriptionModel !== undefined ? subscriptionModel.usedSubscriptions?.length : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Target')}</span>
          <span className="detail-value">{subscriptionModel !== undefined && subscriptionModel.target !== undefined ? this.resolveTarget(subscriptionModel.target)  : undefined}</span>
        </div>
             
        {subscriptionModel !== undefined && subscriptionModel.target !== undefined ? 
        
        subscriptionModel.target===0 ?
        (<>
         <div className="detail-wrapper">
          <span className="detail-label">{L('BookingRequestsCount')}</span>
          <span className="detail-value">{subscriptionModel !== undefined ? subscriptionModel.requestsCount : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('CoursesCount')}</span>
          <span className="detail-value">{subscriptionModel !== undefined ? subscriptionModel.itemsCount : undefined}</span>
        </div>
        </>)
        : subscriptionModel.target === 1 ?
        (<>
           <div className="detail-wrapper">
          <span className="detail-label">{L('OrdersCount')}</span>
          <span className="detail-value">{subscriptionModel !== undefined ? subscriptionModel.requestsCount : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('DishesCount')}</span>
          <span className="detail-value">{subscriptionModel !== undefined ? subscriptionModel.itemsCount : undefined}</span>
        </div>
        </>)
        : subscriptionModel.target === 2 ?
        (<>
           <div className="detail-wrapper">
          <span className="detail-label">{L('OrdersCount')}</span>
          <span className="detail-value">{subscriptionModel !== undefined ? subscriptionModel.requestsCount : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('ProductsCount')}</span>
          <span className="detail-value">{subscriptionModel !== undefined ? subscriptionModel.itemsCount : undefined}</span>
        </div>
        </>)
        :undefined
        : undefined}

        <div className="detail-wrapper">
          <span className="detail-label">{`${L('Price')} (${L('From')} / ${L('SAR')})`}</span>
          <span className="detail-value">{subscriptionModel !== undefined && subscriptionModel.priceFrom ? <ThousandSeparator number={subscriptionModel.priceFrom} /> : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{`${L('Price')} (${L('To')} / ${L('SAR')})`}</span>
          <span className="detail-value">{subscriptionModel !== undefined && subscriptionModel.priceTo ? <ThousandSeparator number={subscriptionModel.priceTo} /> : L('Unlimited')}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('CreationTime')}</span>
          <span className="detail-value">{subscriptionModel !== undefined ? moment(subscriptionModel.creationTime).format(timingHelper.defaultDateTimeFormat) : undefined}</span>
        </div>
        
        <div className="detail-wrapper">
          <span className="detail-label">{L('Status')}</span>
          <span className="detail-value">
            <Tag color={subscriptionModel !== undefined && subscriptionModel.isActive ? 'green' : 'volcano'} className='ant-tag-disable-pointer'>
              {subscriptionModel !== undefined && subscriptionModel.isActive ? L('Active') : L('Inactive')}
            </Tag>
          </span>

        </div>

       
     </div>  
         
    </TabPane>
          <TabPane
             tab={
               <span>
<UserOutlined />
                 {L('Subscribers')}
               </span>
             }
             key="2"
           >
         
        
             <Table
          pagination={false}
          //rowKey={record => record.id + ""}
          style={{ marginTop: '12px' }}
          dataSource={subscriptionModel !== undefined && subscriptionModel.usedSubscriptions !== undefined ? subscriptionModel.usedSubscriptions:[]}
          columns={this.subscribersTableColumns}

        />

           </TabPane>
   
           </Tabs>

 
   </div>
   );
 }
}

export default SubscriptionDetails;
