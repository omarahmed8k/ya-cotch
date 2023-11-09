import * as React from 'react';
import { Tag,Avatar,Tabs,Row,Form,TimePicker,Table,Dropdown,Button,Menu } from 'antd';
import { InfoCircleOutlined,ArrowRightOutlined,ArrowLeftOutlined,CaretDownOutlined, EyeOutlined,FieldTimeOutlined, CoffeeOutlined, CommentOutlined, SoundOutlined, BellOutlined } from '@ant-design/icons';
import ImageModal from '../../../components/ImageModal';
import timingHelper from '../../../lib/timingHelper';
import moment from 'moment';
import { L } from '../../../i18next';
import AppComponentBase from '../../../components/AppComponentBase';
import "./index.css";
import localization from '../../../lib/localization';
import { EntityDto } from '../../../services/dto/entityDto';
import Text from 'antd/lib/typography/Text';
import { OpeningDayDto } from '../../../services/restaurants/dto/openingDayDto';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { DishDto } from '../../../services/dishes/dto/dishDto';
import ThousandSeparator from '../../../components/ThousandSeparator';
import CategoryDetailsModal from '../../Categories/components/categoryDetailsModal';
import { ShopDto } from '../../../services/shops/dto/shopDto';
import { ProductDto } from '../../../services/products/dto/productDto';
import shopsService from '../../../services/shops/shopsService';
import productsService from '../../../services/products/productsService';
import { ReviewDto } from '../../../services/reviews/dto/reviewDto';
import { popupConfirm } from '../../../lib/popupMessages';
import reviewsService from '../../../services/reviews/reviewsService';
import ReviewRefType from '../../../services/types/reviewRefType';
import { ReportDto } from '../../../services/reports/dto/reportDto';
import SearchComponent from '../../../components/SearchComponent';
import reportsService from '../../../services/reports/reportsService';
import ReportRefType from '../../../services/types/reportRefType';
import ShopManagerDetailsModal from '../../ShopManagers/components/shopManagerDetailsModal';


const { TabPane } = Tabs;


export interface IShopDetailsModalState{
  shopModel:ShopDto;
  isImageModalOpened: boolean;
  imageModalCaption: string;
  imageModalUrl: string;
  managerDetailsModalVisible:boolean;
  managerId:number;
  products:Array<ProductDto>;
  categoryDetailsModalVisible:boolean;
  reviewsMeta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount:number;
  };
  reviews:Array<ReviewDto>;
  reviewsTotalCount:number;
  reportsMeta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount:number;
  };
  reports:Array<ReportDto>;
  reportsTotalCount:number;
  reportKeyword?:string;
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];


@inject(Stores.CategoryStore,Stores.ShopManagerStore)
@observer
export class ShopDetails extends AppComponentBase<any, IShopDetailsModalState> {

  state={
    shopModel:{} as ShopDto,
    isImageModalOpened: false,
    imageModalCaption: '',
    imageModalUrl: '',
    managerDetailsModalVisible:false,
    managerId:0,
    products:[],
    categoryDetailsModalVisible:false,
    reviewsMeta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount:0
    },
    reviews:[],
    reviewsTotalCount:0,
    reportsMeta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount:0
    },
    reports:[],
    reportsTotalCount:0,
    reportKeyword:undefined
  }
  
  async openManagerDetailsModal(entityDto: EntityDto) {
    await this.props.shopManagerStore!.getShopManager(entityDto);
    this.setState({ managerDetailsModalVisible: !this.state.managerDetailsModalVisible, managerId: entityDto.id });
  }

  
  async openCategoryDetailsModal(entityDto: EntityDto) {
    await this.props.categoryStore!.getCategoryById(entityDto);
    this.setState({ categoryDetailsModalVisible: !this.state.categoryDetailsModalVisible });
  }
  openImageModal(image: string, caption: string) {
    this.setState({ isImageModalOpened: true, imageModalCaption: caption, imageModalUrl: image });
  }

  closeImageModal() {
    this.setState({ isImageModalOpened: false, imageModalCaption: '', imageModalUrl: '' });
  }
  
  async componentDidMount(){ 
    document.title= `${L("ShopDetails")} | YaCotch `;   
    try {
         if(this.props.match.params.id){
          let id:number = this.props.match.params.id;
          let shop = await shopsService.getShop({id:id});
          let products = (await productsService.getAll({shopId:id})).items;
          this.setState({shopModel: shop,products:products},async()=>{
            await this.updateReviewsList(this.state.reviewsMeta.pageSize, 0);
            await this.updateReportsList(this.state.reportsMeta.pageSize, 0);

          });
        }
      } catch (e) {
        window.location.href = '/shops';
      }
  }

  onSwitchReviewStatus = async (review: ReviewDto) => {
    popupConfirm(async () => {
      if(review.isHidden)
      await reviewsService.showReview({ id: review.id });
      else
      await reviewsService.hideReview({ id: review.id });
      await this.updateReviewsList(this.state.reviewsMeta.pageSize,this.state.reviewsMeta.skipCount);

    }, review.isHidden ? L('AreYouSureYouWantToShowThisReview') : L('AreYouSureYouWantToHideThisReview'));
  }

  async updateReviewsList(maxResultCount: number, skipCount: number) {
    let result = await reviewsService.getAll({
      refType:ReviewRefType.Shop,
      maxResultCount:maxResultCount,
      skipCount:skipCount
    });

    this.setState({reviews:result.items,reviewsTotalCount:result.totalCount});
   }

   reviewsTableColumns = [
    {
      title: L('ReviewerName'),
      dataIndex: 'reviewer',
      key: 'reviewer',
      render:(reviewer:any,item:ReviewDto)=>{
        return <a href={`/trainee/${item.reviewer.value}`} target="_blank" rel="noopener noreferrer">{item.reviewer?.text}</a>;
      }
    },
    {
      title: L('Image'),
      dataIndex: 'reviewer',
      key: 'reviewer',
      render:(reviewer:any,item:ReviewDto)=>{
        return (
          <div onClick={() => this.openImageModal(item.reviewer?.imageUrl!, item.reviewer?.text)} style={{ display: 'inline-block', cursor: "zoom-in" }}>
            <Avatar shape='square' size={50} src={item.reviewer?.imageUrl} />
          </div>
        );
      }
    },
    {
      title: L('Rate'),
      dataIndex: 'rate',
      key: 'rate',
    },

    {
      title: L('Comment'),
      dataIndex: 'comment',
      key: 'comment',
      
    },
   
    {
      title: L('Date'),
      dataIndex: 'creationTime',
      key: 'creationTime',

      render:(creationTime:string)=>{
        return creationTime ? moment(creationTime).format(timingHelper.defaultDateTimeFormat):undefined;
      }
    },
      
    {
      title: L('Status'),
      dataIndex: 'isHidden',
      key: 'isHidden',
      render: (isHidden: boolean) => {
        return <Tag color={isHidden ? 'warning' : 'green'} className='ant-tag-disable-pointer'>{isHidden ? L('Hidden') : L('Shown')}</Tag>;
     
      },
    },
    {
      title: L('Action'),
      key: 'action',
      width: '10%',
      render: (text: string, item: ReviewDto) => (
        <div>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
                  <Menu.Item onClick={() => this.onSwitchReviewStatus(item)}>
                  <EyeOutlined className="action-icon"  />
                  <button className="inline-action">{item.isHidden ? L('Show'): L('Hide')}</button>
                </Menu.Item>
               
              </Menu>
            }
            placement="bottomLeft"
          >
            <Button type="primary" icon={<CaretDownOutlined />} />
          </Dropdown>
        </div>
      ),
    },
  ];

  reviewsPaginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.reviewsMeta.pageSize = pageSize;
      this.setState(temp);
      this.updateReviewsList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.reviewsMeta.page = page;
      this.setState(temp);
      await this.updateReviewsList(this.state.reviewsMeta.pageSize, (page - 1) * this.state.reviewsMeta.pageSize);
    },
    pageSizeOptions: this.state.reviewsMeta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };


  async updateReportsList(maxResultCount: number, skipCount: number) {
    let result = await reportsService.getAll({
      refType:ReportRefType.Shop,
      maxResultCount:maxResultCount,
      keyword:this.state.reportKeyword,
      skipCount:skipCount
    });

    this.setState({reports:result.items,reportsTotalCount:result.totalCount});
   }

   reportsTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
     
    },
    {
      title: L('CustomerName'),
      dataIndex: 'reporter',
      key: 'reporter',
      render:(reporter:any,item:ReportDto)=>{
        return <a href={`/trainee/${item.reporter.value}`} target="_blank" rel="noopener noreferrer">{item.reporter?.text}</a>;
      }
    },

    {
      title: L('Date'),
      dataIndex: 'creationTime',
      key: 'creationTime',
      sorter: (a:any, b:any) => a.creationTime - b.creationTime,
      render:(creationTime:string)=>{
        return creationTime ? moment(creationTime).format(timingHelper.defaultDateTimeFormat):undefined;
      }
    },
    {
      title: L('Description'),
      dataIndex: 'description',
      key: 'description',
    }, 
         
  ];

  reportsPaginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.reportsMeta.pageSize = pageSize;
      this.setState(temp);
      this.updateReportsList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.reportsMeta.page = page;
      this.setState(temp);
      await this.updateReportsList(this.state.reportsMeta.pageSize, (page - 1) * this.state.reportsMeta.pageSize);
    },
    pageSizeOptions: this.state.reportsMeta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };


  productsColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
      sorter: (a:any, b:any) => a.id - b.id,

    },
    {
      title: L('Name'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a:any, b:any) =>a.name.localeCompare(b.name),

    },
  
    {
      title: L('TotalRate'),
      dataIndex: 'rate',
      key: 'rate',
      sorter: (a:any, b:any) => a.rate - b.rate,
    },
    {
      title: `${L('Price')} (${L('SAR')})`,
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => {
        return <ThousandSeparator number={price} />;
      }
    },
    {
      title: L('CategoryName'),
      dataIndex: 'category',
      key: 'category',
      render: (category: any,item :DishDto) => {
         return  <a onClick={() => this.openCategoryDetailsModal({ id: item.category?.value })}>{item.category?.text}</a>;
      }
    },
    {
      title: L('CreationDate'),
      dataIndex: 'creationTime',
      key: 'creationTime',
      sorter: (a:any, b:any) => a.creationTime - b.creationTime,

      render: (creationTime: string) => {
        return moment(creationTime).format(timingHelper.defaultDateFormat);
      }
    },
    {
      title: L('Status'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => {
        return <Tag color={isActive ? 'green' : 'volcano'} className='ant-tag-disable-pointer'>{isActive ? L('Active') : L('Inactive')}</Tag>;
      }
    }
  ];

 render(){
   const {shopModel,reviews,reports,products}= this.state;
   const reviewsPagination = {
    ...this.reviewsPaginationOptions,
    total: this.state.reviewsTotalCount,
    current: this.state.reviewsMeta.page,
    pageSize: this.state.reviewsMeta.pageSize,
  };
  const reportsPagination = {
    ...this.reportsPaginationOptions,
    total: this.state.reportsTotalCount,
    current: this.state.reportsMeta.page,
    pageSize: this.state.reportsMeta.pageSize,
  };
   return (
   <div className="shop-page">
     <span className="back-button">
     {localization.isRTL() ? 
     <ArrowRightOutlined onClick={()=> window.location.href = '/shops'} />
     :
     <ArrowLeftOutlined onClick={()=> window.location.href = '/shops'} />
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
          <span className="detail-label">{L('ID')}</span>
          <span className="detail-value">{shopModel !== undefined ? shopModel.id : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('ArName')}</span>
          <span className="detail-value">{shopModel !== undefined ? shopModel.arName : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('EnName')}</span>
          <span className="detail-value">{shopModel !== undefined ? shopModel.enName : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('City')}</span>
          <span className="detail-value">{shopModel !== undefined ? shopModel.city?.text : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('PhoneNumber')}</span>
          <span className="detail-value">{shopModel !== undefined ? shopModel.phoneNumber : undefined}</span>
        </div>
        <div className="detail-wrapper">
        <span className="detail-label">{L('ManagerName')}</span>
          <span className="detail-value">{shopModel !== undefined && shopModel.manager ? 
          <a onClick={() => this.openManagerDetailsModal({ id: shopModel.manager?.id })}>{shopModel.manager?.name}</a>
          : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('ArLogo')}</span>
          <span className="detail-value">{shopModel !== undefined ?
          <div onClick={() => this.openImageModal(shopModel.arLogo!, shopModel.name)} style={{ display: 'inline-block', cursor: "zoom-in" }}>
          <Avatar shape='square' size={50} src={shopModel.arLogo} />
        </div>: undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('EnLogo')}</span>
          <span className="detail-value">{shopModel !== undefined ?
          <div onClick={() => this.openImageModal(shopModel.enLogo!, shopModel.name)} style={{ display: 'inline-block', cursor: "zoom-in" }}>
          <Avatar shape='square' size={50} src={shopModel.enLogo} />
        </div>: undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('ArCover')}</span>
          <span className="detail-value">{shopModel !== undefined ?
          <div onClick={() => this.openImageModal(shopModel.arCover!, shopModel.name)} style={{ display: 'inline-block', cursor: "zoom-in" }}>
          <Avatar shape='square' size={50} src={shopModel.arCover} />
        </div>: undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('EnCover')}</span>
          <span className="detail-value">{shopModel !== undefined ?
          <div onClick={() => this.openImageModal(shopModel.enCover!, shopModel.name)} style={{ display: 'inline-block', cursor: "zoom-in" }}>
          <Avatar shape='square' size={50} src={shopModel.enCover} />
        </div>: undefined}</span>
        </div>
        
  
      
        <div className="detail-wrapper">
          <span className="detail-label">{L('TotalRate')}</span>
          <span className="detail-value">{shopModel !== undefined ? shopModel.rate : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('FacebookUrl')}</span>
          <span className="detail-value">{shopModel !== undefined &&  shopModel.facebookUrl? shopModel.facebookUrl : L('NotAvailable')}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('TwitterUrl')}</span>
          <span className="detail-value">{shopModel !== undefined && shopModel.twitterUrl ? shopModel.twitterUrl : L('NotAvailable')}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('InstagramUrl')}</span>
          <span className="detail-value">{shopModel !== undefined && shopModel.instagramUrl ? shopModel.instagramUrl : L('NotAvailable')}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Website')}</span>
          <span className="detail-value">{shopModel !== undefined && shopModel.websiteUrl ? shopModel.websiteUrl : L('NotAvailable')}</span>
        </div>
        
      
        <div className="detail-wrapper">
          <span className="detail-label">{L('CreationDate')}</span>
          <span className="detail-value">{shopModel !== undefined ? moment(shopModel.creationTime).format(timingHelper.defaultDateFormat) : undefined}</span>
        </div>
        
        <div className="detail-wrapper">
          <span className="detail-label">{L('Status')}</span>
          <span className="detail-value">
            <Tag color={shopModel !== undefined && shopModel.isActive ? 'green' : 'volcano'} className='ant-tag-disable-pointer'>
              {shopModel !== undefined && shopModel.isActive ? L('Active') : L('Inactive')}
            </Tag>
          </span>

        </div>

        
       
     </div>  
         
    </TabPane>
    <TabPane
             tab={
               <span>
                 <FieldTimeOutlined/>
                 {L('OpeningTimes')}
               </span>
             }
             key="2"
           >
             <Row>
        <div className="opening-times-row">
            <Text style={{ width: '10%' }}>{L('Day')}</Text>
            <Text style={{ width: '20%' }}>{L('FromTime')}</Text>
            <Text style={{ width: '20%' }}>{L('ToTime')}</Text>
          </div>

          {
            shopModel && shopModel.openingDays && shopModel.openingDays.map((row: OpeningDayDto, key:number) => {
              return (
                <div className="opening-times-row" key={key}>
                

                  <Text style={{ width: '10%' }}>{timingHelper.getDay(row.day)}</Text>

                  <Form.Item style={{ width: '20%' }} 
                name={`fromTime_${key}`}
               
                >
                  <TimePicker
                      use12Hours={true}
                      minuteStep={30}
                     disabled
                     defaultValue={moment(row.from)}
                      className='fromTimePicker'
                      format={timingHelper.defaultTimeFormat}
                    />
</Form.Item>
<Form.Item style={{ width: '20%' }} 
                name={`toTime_${key}`}
                
                >
                  <TimePicker
                      use12Hours={true}
                      minuteStep={30}
                      disabled
                      defaultValue={moment(row.to)}
                      className='toTimePicker'
                      format={timingHelper.defaultTimeFormat}
                    />
                    </Form.Item>
                    
                    
                  
                </div>
              );
            })
          }
        </Row>
           </TabPane>
           <TabPane
             tab={
               <span>
                 <CoffeeOutlined/>
                 {L('Products1')}
               </span>
             }
             key="3"
           >
              <Table
        dataSource={products !== undefined ? products :[]}
        columns={this.productsColumns}
        pagination={false}
      />
           </TabPane>
           <TabPane
             tab={
               <span>
                 <CommentOutlined/>
                 {L('Reviews')}
               </span>
             }
             key="4"
           >
             <Table
          pagination={reviewsPagination}
          rowKey={record => record.id + ""}
          style={{ marginTop: '12px' }}
          dataSource={reviews === undefined ? [] : reviews}
          columns={this.reviewsTableColumns}

        />

           </TabPane>
           <TabPane
             tab={
               <span>
<SoundOutlined />
                 {L('Reports')}
               </span>
             }
             key="5"
           >
               <SearchComponent
           searchText={L("SearchByIdCustomerName")}
        onSearch={(value: string)=>{
          this.setState({reportKeyword:value},()=>{
            this.updateReportsList(this.state.reportsMeta.pageSize,this.state.reportsMeta.skipCount);
          });
        }}
        />
             <Table
          pagination={reportsPagination}
          rowKey={record => record.id + ""}
          style={{ marginTop: '12px' }}
          dataSource={reports === undefined ? [] : reports}
          columns={this.reportsTableColumns}

        />

           </TabPane>
             <TabPane
                  tab={
                    <span>
     <BellOutlined />
                      {L('Subscription')}
                    </span>
                  }
                  key="6"
                >
                  {shopModel.subscription === null ?
                  (
                  <>
                  <div>
                   {L('ThereIsNoSubscriptionYet')}  
                  </div>
                  </>):
                 (
                   <>
                    <div className="details-wrapper">
           <div className="detail-wrapper">
               <span className="detail-label">{L('SubscriptionName')}</span>
               <span className="detail-value">{shopModel !== undefined ? shopModel.subscription?.name : undefined}</span>
             </div>
             <div className="detail-wrapper">
               <span className="detail-label">{L('SubscriptionDuration')}</span>
               <span className="detail-value">{shopModel !== undefined ? `${shopModel.subscription?.duration} ${L('Days')}` : undefined}</span>
             </div>
             <div className="detail-wrapper">
               <span className="detail-label">{L('SubscriptionFee')}</span>
               <span className="detail-value">{shopModel !== undefined && shopModel.subscription?.fee !==undefined ? <ThousandSeparator number={shopModel.subscription?.fee} currency={L("SAR")} /> : L("NotAvailable")}</span>
             </div>
             <div className="detail-wrapper">
               <span className="detail-label">{L('SubscribedDate')}</span>
               <span className="detail-value">{shopModel !== undefined && shopModel.subscription?.creationTime !==undefined ? 
               moment(shopModel.subscription?.creationTime).format(timingHelper.defaultDateFormat) : L("NotAvailable")}</span>
     
             </div>
             <div className="detail-wrapper">
               <span className="detail-label">{L('ReminingDays')}</span>
               <span className="detail-value">{shopModel !== undefined && shopModel.subscription?.remainingDays !==undefined ? 
               `${shopModel.subscription?.remainingDays} ${L('Days')}` : L("NotAvailable")}</span>
     
             </div>
             </div>
                   </>
                 )}
                
     
                </TabPane>
             
   
           </Tabs>

           <ImageModal
          isOpen={this.state.isImageModalOpened}
          caption={this.state.imageModalCaption}
          src={this.state.imageModalUrl}
          onClose={() => { this.closeImageModal(); }} />
<ShopManagerDetailsModal
          visible={this.state.managerDetailsModalVisible}
          onCancel={() =>
            this.setState({
              managerDetailsModalVisible: false,
            })
          }
        />
                <CategoryDetailsModal
          visible={this.state.categoryDetailsModalVisible}
          onCancel={() =>
            this.setState({
              categoryDetailsModalVisible: false,
            })
          }
          categoryStore={this.props.categoryStore!}
        />
   </div>
   
   );
 }
}

export default ShopDetails;
