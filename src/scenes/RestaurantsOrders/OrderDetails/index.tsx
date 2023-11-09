import * as React from 'react';
import { Tag,Avatar,Tabs,Dropdown,Button,Menu,Table } from 'antd';
import { InfoCircleOutlined,ArrowRightOutlined,ArrowLeftOutlined,EyeOutlined,CaretDownOutlined, InstagramOutlined, CommentOutlined, SoundOutlined } from '@ant-design/icons';
import ImageModal from '../../../components/ImageModal';
import timingHelper from '../../../lib/timingHelper';
import moment from 'moment';
import { L } from '../../../i18next';
import AppComponentBase from '../../../components/AppComponentBase';
import "./index.css";
import localization from '../../../lib/localization';
import { DishDto } from '../../../services/dishes/dto/dishDto';
import dishesService from '../../../services/dishes/dishesService';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import CategoryStore from '../../../stores/categoryStore';
import { EntityDto } from '../../../services/dto/entityDto';
import CategoryDetailsModal from '../../Categories/components/categoryDetailsModal';
import ThousandSeparator from '../../../components/ThousandSeparator';
import { ReviewDto } from '../../../services/reviews/dto/reviewDto';
import reviewsService from '../../../services/reviews/reviewsService';
import { popupConfirm } from '../../../lib/popupMessages';
import ReviewRefType from '../../../services/types/reviewRefType';
import { ReportDto } from '../../../services/reports/dto/reportDto';
import SearchComponent from '../../../components/SearchComponent';
import reportsService from '../../../services/reports/reportsService';
import ReportRefType from '../../../services/types/reportRefType';


const { TabPane } = Tabs;


export interface IDishDetailsModalState{
  dishModel:DishDto;
  isImageModalOpened: boolean;
  imageModalCaption: string;
  imageModalUrl: string;
  categoryDetailsModalVisible:boolean;
  categoryId:number;
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
export interface IDishDetailsModalProps{
  categoryStore:CategoryStore;
  match:any;
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];



@inject(Stores.CategoryStore)
@observer
export class DishDetails extends AppComponentBase<IDishDetailsModalProps, IDishDetailsModalState> {

  state={
    dishModel:{} as DishDto,
    isImageModalOpened: false,
    imageModalCaption: '',
    imageModalUrl: '',
    categoryDetailsModalVisible:false,
    categoryId:0,
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

  async openCourseDetailsModal(entityDto: EntityDto) {
    await this.props.categoryStore!.getCategoryById(entityDto);
    this.setState({ categoryDetailsModalVisible: !this.state.categoryDetailsModalVisible, categoryId: entityDto.id });
  }
  
  openImageModal(image: string, caption: string) {
    this.setState({ isImageModalOpened: true, imageModalCaption: caption, imageModalUrl: image });
  }

  closeImageModal() {
    this.setState({ isImageModalOpened: false, imageModalCaption: '', imageModalUrl: '' });
  }
  
  async componentDidMount(){ 
    document.title= `${L("DishDetails")} | YaCotch `;   
    try {
         if(this.props.match.params.id){
          let id = this.props.match.params.id;
          let dish = await dishesService.getDish({id:id});
          this.setState({dishModel: dish},async()=>{
            await this.updateReviewsList(this.state.reviewsMeta.pageSize, 0);
            await this.updateReportsList(this.state.reportsMeta.pageSize, 0);

          });
        }
      } catch (e) {
        window.location.href = '/restaurants-dishes';
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
      refType:ReviewRefType.Dish,
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
      refType:ReportRefType.Dish,
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


 render(){
   const {dishModel,reports,reviews}= this.state;
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
   <div className="dish-page">
     <span className="back-button">
     {localization.isRTL() ? 
     <ArrowRightOutlined onClick={()=> window.location.href = '/restaurants-dishes'} />
     :
     <ArrowLeftOutlined onClick={()=> window.location.href = '/restaurants-dishes'} />
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
          <span className="detail-value">{dishModel !== undefined ? dishModel.id : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('ArName')}</span>
          <span className="detail-value">{dishModel !== undefined ? dishModel.arName : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('EnName')}</span>
          <span className="detail-value">{dishModel !== undefined ? dishModel.enName : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('ArComponents')}</span>
          <span className="detail-value">{dishModel !== undefined && dishModel.arComponents ? dishModel.arComponents : L("NotAvailable")}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('EnComponents')}</span>
          <span className="detail-value">{dishModel !== undefined && dishModel.enComponents ? dishModel.enComponents : L("NotAvailable")}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Restaurant')}</span>
          <span className="detail-value">{dishModel !== undefined && dishModel.restaurant?
          <a href={`/restaurant/${dishModel.restaurant.value}`} target="_blank" rel="noopener noreferrer">{dishModel.restaurant.text}</a>
          : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Category')}</span>
          <span className="detail-value">{dishModel !== undefined && dishModel.category? 
          <a onClick={() => this.openCourseDetailsModal({ id: dishModel.category?.value })}>{dishModel.category?.text}</a>
          : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Price')}</span>
          <span className="detail-value">{dishModel !== undefined && dishModel.price ? <ThousandSeparator number={dishModel.price} currency={L("SAR")} /> : L("NotAvailable")}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('TotalRate')}</span>
          <span className="detail-value">{dishModel !== undefined && dishModel.rate ? dishModel.rate : L("NotAvailable")}</span>
        </div>

        <div className="detail-wrapper">
          <span className="detail-label">{L('CreationDate')}</span>
          <span className="detail-value">{dishModel !== undefined ? moment(dishModel.creationTime).format(timingHelper.defaultDateFormat) : undefined}</span>
        </div>
        
        <div className="detail-wrapper">
          <span className="detail-label">{L('Status')}</span>
          <span className="detail-value">
            <Tag color={dishModel !== undefined && dishModel.isActive ? 'green' : 'volcano'} className='ant-tag-disable-pointer'>
              {dishModel !== undefined && dishModel.isActive ? L('Active') : L('Inactive')}
            </Tag>
          </span>

        </div> 

       
     </div>  
         
    </TabPane>
    <TabPane
             tab={
               <span>
                 <InstagramOutlined/>
                 {L('Gallery')}
               </span>
             }
             key="2"
           >
             {dishModel && dishModel.images && dishModel.images.length>0
            ?<div className="gallery"> 
            {dishModel.images.map((item:string,index:number) => <div key={index} className="gallery-item" onClick={() => this.openImageModal(item, dishModel.name)} style={{ cursor: "zoom-in" }}><Avatar shape='square' size={150} src={item} /></div>)}
            </div>:
            <div>{L("ThereAreNotImages")}</div>
            }
           </TabPane>
           <TabPane
             tab={
               <span>
                 <CommentOutlined/>
                 {L('Reviews')}
               </span>
             }
             key="3"
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
             key="4"
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
   
           </Tabs>

           <ImageModal
          isOpen={this.state.isImageModalOpened}
          caption={this.state.imageModalCaption}
          src={this.state.imageModalUrl}
          onClose={() => { this.closeImageModal(); }} />

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

export default DishDetails;
