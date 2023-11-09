import * as React from 'react';
import { Tag,Tabs, Avatar, Select,Button,Table } from 'antd';
import { InfoCircleOutlined,SolutionOutlined,ArrowRightOutlined,ArrowLeftOutlined, FilterOutlined } from '@ant-design/icons';
import ImageModal from '../../../components/ImageModal';
import { L } from '../../../i18next';
import AppComponentBase from '../../../components/AppComponentBase';
import "./index.css";
import localization from '../../../lib/localization';
import moment from 'moment';
import timingHelper from '../../../lib/timingHelper';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { TraineeDto } from '../../../services/trainees/dto/traineeDto';
import traineesService from '../../../services/trainees/traineesService';
import Gender from '../../../services/types/gender';
import UserStatus from '../../../services/types/userStatus';
import { LiteEntityDto } from '../../../services/dto/liteEntityDto';
import { CourseDto } from '../../../services/courses/dto/courseDto';
import categoriesService from '../../../services/categories/categoriesService';
import CategoryType from '../../../services/types/categoryType';

const { TabPane } = Tabs;

export interface ITraineeDetailsModalState{
  traineeModel:TraineeDto;
  isImageModalOpened: boolean;
  imageModalCaption: string;
  imageModalUrl: string;
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount:number;
  };
  isActiveFilter?:boolean;
  categoryId?:number;
  hasDiscount?:boolean;
  courses:Array<CourseDto>;
}
const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];



@inject(Stores.CourseStore)
@observer
export class TraineeDetails extends AppComponentBase<any, ITraineeDetailsModalState> {

  categories:Array<LiteEntityDto>=[];

  state={
    traineeModel:{} as TraineeDto,
    isImageModalOpened: false,
    imageModalCaption: '',
    imageModalUrl: '',
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount:0
    },
    courses:[],
    isActiveFilter:undefined,
    categoryId:undefined,
    hasDiscount:undefined
  }
  
  async updateCorsesList(maxResultCount: number, skipCount: number) {
    this.props.courseStore!.maxResultCount = maxResultCount;
    this.props.courseStore!.skipCount = skipCount;
    this.props.courseStore!.isActiveFilter = this.state.isActiveFilter;
    this.props.courseStore!.categoryId = this.state.categoryId;
    this.props.courseStore!.traineeId = this.state.traineeModel.id;
    this.props.courseStore!.hasDiscount = this.state.hasDiscount;

    await this.props.courseStore!.getCourses();
    this.setState({courses:this.props.courseStore?.courses});
  }

  getColumnStatusSearchProps = () => ({
    filterDropdown: ({ confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Select
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          showSearch
          optionFilterProp="children"
          onChange={(value: any) => {
           
            this.setState({isActiveFilter:value === 3 ? undefined : value === 1 ? true : false});
          }}
          value={this.state.isActiveFilter=== undefined ? 3 : !this.state.isActiveFilter ? 0 : 1}
        >
          <Select.Option key={1} value={1}>{L('Activated')}</Select.Option>
          <Select.Option key={0} value={0}>{L('Deactivated')}</Select.Option>
          <Select.Option key={3} value={3}>{L('All')}</Select.Option>
        </Select>
        <Button
          type="primary"
          onClick={async () => {
            confirm();
            this.updateCorsesList(this.state.meta.pageSize,this.state.meta.skipCount);
          }}
         
          size="small"
          style={{ width: 90, marginRight: 4, marginLeft: 4 }}
        >
          {L('Filter')}
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            this.setState({isActiveFilter:undefined},()=>{
              this.updateCorsesList(this.state.meta.pageSize,this.state.meta.skipCount);
            })
           
          }}
          size="small"
          style={{ width: 90 }}
        >
          {L('ResetFilter')}
        </Button>
      </div>
    ),
    filterIcon: (filtered: any) => <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
  });

  getColumnCategorySearchProps = () => ({
    filterDropdown: ({ confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Select
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          showSearch
          placeholder={L('PleaseSelectCategory')}  
          optionFilterProp="children"
          filterOption={(input, option:any) =>
            option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          value={this.state.categoryId}
          onChange={(value: any) => {           
            this.setState({categoryId:value });
          }}>
          {this.categories.length>0 && this.categories.map((element:LiteEntityDto) => <Select.Option key={element.value} value={element.value}>{element.text}</Select.Option>)}
        
        
        </Select>
        <Button
          type="primary"
          onClick={async () => {
            confirm();
            this.updateCorsesList(this.state.meta.pageSize,this.state.meta.skipCount);
          }}
         
          size="small"
          style={{ width: 90, marginRight: 4, marginLeft: 4 }}
        >
          {L('Filter')}
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            this.setState({categoryId:undefined},()=>{
              this.updateCorsesList(this.state.meta.pageSize,this.state.meta.skipCount);
            });
          }}
          size="small"
          style={{ width: 90 }}
        >
          {L('ResetFilter')}
        </Button>
      </div>
    ),
    filterIcon: (filtered: any) => <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
  });

  getColumnHasDiscountSearchProps = () => ({
    filterDropdown: ({ confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Select
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          showSearch
          optionFilterProp="children"
          onChange={(value: any) => {
           
            this.setState({hasDiscount:value === 3 ? undefined : value === 1 ? true : false});
          }}
          value={this.state.hasDiscount=== undefined ? 3 : !this.state.hasDiscount ? 0 : 1}
        >
          <Select.Option key={1} value={1}>{L('Yes')}</Select.Option>
          <Select.Option key={0} value={0}>{L('No')}</Select.Option>
          <Select.Option key={3} value={3}>{L('All')}</Select.Option>
        </Select>
        <Button
          type="primary"
          onClick={async () => {
            confirm();
            this.updateCorsesList(this.state.meta.pageSize,this.state.meta.skipCount);
          }}
         
          size="small"
          style={{ width: 90, marginRight: 4, marginLeft: 4 }}
        >
          {L('Filter')}
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            this.setState({hasDiscount:undefined},()=>{
              this.updateCorsesList(this.state.meta.pageSize,this.state.meta.skipCount);
            });
          }}
          size="small"
          style={{ width: 90 }}
        >
          {L('ResetFilter')}
        </Button>
      </div>
    ),
    filterIcon: (filtered: any) => <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
  });

  coursesTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('Name'),
      dataIndex: 'name',
      key: 'name',
      render:(name:string,item:CourseDto)=>{
        return <a target="_blank" href={`/course/${item.id}`} rel="noopener noreferrer">{item.name}</a>;
      }
    },

    {
      title: L('Image'),
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl: string, item: CourseDto) => {
        return (
          <div onClick={() => this.openImageModal(item.imageUrl!, item.name)} style={{ display: 'inline-block', cursor: "zoom-in" }}>
            <Avatar shape='square' size={50} src={item.imageUrl} />
          </div>
        );
      }
    },
    {
      title: L('Fee'),
      dataIndex: 'fee',
      key: 'fee',
    },
    {
      title: L('HasDiscount'),
      dataIndex: 'hasDiscount',
      key: 'hasDiscount',
      render: (hasDiscount: boolean) => {
        return <Tag color={hasDiscount ? 'green' : 'volcano'} className='ant-tag-disable-pointer'>{hasDiscount ? L('Yes') : L('No')}</Tag>;
      },
      ...this.getColumnHasDiscountSearchProps()
    },
      {
        title: L('BookingRequestsCount'),
        dataIndex: 'bookingRequestsCount',
        key: 'bookingRequestsCount',
        sorter: (a:any, b:any) => a.bookingRequestsCount - b.bookingRequestsCount,

      },
      {
        title: L('CategoryName'),
        dataIndex: 'category',
        key: 'category',
        render:(category :any,item:CourseDto)=>{
          return item.category?.text;
        },
        sorter: (a:any, b:any) =>a.category.text.localeCompare(b.category.text),

        ...this.getColumnCategorySearchProps()
      },
      {
        title: L('ViewsCount'),
        dataIndex: 'viewsCount',
        key: 'viewsCount',
    sorter: (a:any, b:any) => a.viewsCount - b.viewsCount,
      },
    {
      title: L('IsActive'),
      dataIndex: 'isActive',
      key: 'isActive',
      ...this.getColumnStatusSearchProps(),
      render: (isActive: boolean) => {
        return <Tag color={isActive ? 'green' : 'volcano'} className='ant-tag-disable-pointer'>{isActive ? L('Active') : L('Inactive')}</Tag>;
      }
    },
 
  ];

  paginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.meta.pageSize = pageSize;
      this.setState(temp);
      this.updateCorsesList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateCorsesList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };


  openImageModal(image: string, caption: string) {
    this.setState({ isImageModalOpened: true, imageModalCaption: caption, imageModalUrl: image });
  }

  closeImageModal() {
    this.setState({ isImageModalOpened: false, imageModalCaption: '', imageModalUrl: '' });
  }
  
  async componentDidMount(){ 
    document.title= `${L("TraineeDetails")} | YaCotch `;   
    try {
         if(this.props.match.params.id){
          let id = this.props.match.params.id;
          let trainee = await traineesService.getTrainee({id:id});
          let result= await categoriesService.getAllLite({type:CategoryType.Courses});
          this.categories=result.items;
         
          this.setState({traineeModel: trainee},async()=>{
            await this.updateCorsesList(this.state.meta.pageSize, 0);

          });
        }
      } catch (e) {
        window.location.href = '/trainees';
      }
  }

  resolveGender= (gender: number) => {
    switch(gender){
      case Gender.Male:
        return <Tag color={'processing'} className='ant-tag-disable-pointer'>{L('Male')}</Tag>;
      case Gender.Female:
        return <Tag color={'processing'} className='ant-tag-disable-pointer'>{L('Female')}</Tag>;
   
    }
    return "";
  }
  resolveStatus(status: number){
    switch(status){
      case UserStatus.Active:
        return <Tag color={'success'} className='ant-tag-disable-pointer'>{L('Active')}</Tag>;
      case UserStatus.Blocked:
        return <Tag color={'volcano'} className='ant-tag-disable-pointer'>{L('Blocked')}</Tag>;
        case UserStatus.Inactive:
          return <Tag color={'warning'} className='ant-tag-disable-pointer'>{L('Inactive')}</Tag>;
    }
    return "";
  }
 render(){
   const {traineeModel,courses}= this.state;
   const pagination = {
    ...this.paginationOptions,
    total: this.props.courseStore!.totalCount,
    current: this.state.meta.page,
    pageSize: this.state.meta.pageSize,
  };

   return (
   <div className="trainer-page">
     <span className="back-button">
     {localization.isRTL() ? 
     <ArrowRightOutlined onClick={()=> window.location.href = '/trainees'} />
     :
     <ArrowLeftOutlined onClick={()=> window.location.href = '/trainees'} />
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
          <span className="detail-value">{traineeModel !== undefined ? traineeModel.name : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Image')}</span>
          <span className="detail-value">{traineeModel !== undefined ?
          <div onClick={() => this.openImageModal(traineeModel.imageUrl!, traineeModel.name)} style={{ display: 'inline-block', cursor: "zoom-in" }}>
          <Avatar shape='square' size={50} src={traineeModel.imageUrl} />
        </div>: undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Email')}</span>
          <span className="detail-value">{traineeModel !== undefined ? traineeModel.emailAddress : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('PhoneNumber')}</span>
          <span className="detail-value">{traineeModel !== undefined ? traineeModel.phoneNumber : undefined}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Age')}</span>
          <span className="detail-value">{traineeModel !== undefined && traineeModel.age ?  traineeModel.age : L('NotAvailable')}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Length')}</span>
          <span className="detail-value">{traineeModel !== undefined && traineeModel.length  ?  traineeModel.length : L('NotAvailable')}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Weight')}</span>
          <span className="detail-value">{traineeModel !== undefined && traineeModel.weight ?  traineeModel.weight : L('NotAvailable')}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('BMI')}</span>
          <span className="detail-value">{traineeModel !== undefined && traineeModel.bmi ?  traineeModel.bmi : L('NotAvailable')}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Address')}</span>
          <span className="detail-value">{traineeModel !== undefined && traineeModel.address ?  traineeModel.address : L('NotAvailable')}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Gender')}</span>
          <span className="detail-value">{traineeModel !== undefined && traineeModel.gender!==undefined ? this.resolveGender(traineeModel.gender) :  L('NotAvailable')} </span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('LastLoginDate')}</span>
          <span className="detail-value">{traineeModel !== undefined && traineeModel.lastLoginDate? moment(traineeModel.lastLoginDate).format(timingHelper.defaultDateFormat) :  L('NotAvailable')} </span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('AppliedCoursesCount')}</span>
          <span className="detail-value">{traineeModel !== undefined && traineeModel.appliedCoursesCount !== undefined? traineeModel.appliedCoursesCount :  L('NotAvailable')} </span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('Status')}</span>
          <span className="detail-value">
          {traineeModel !== undefined ? this.resolveStatus(traineeModel.status) : undefined } 
          </span>

        </div>
      
       
     </div>  
       
    </TabPane>
    <TabPane
             tab={
               <span>
                 <SolutionOutlined/>
                 {L('Courses')}
               </span>
             }
             key="2"
           >
              <Table
          pagination={pagination}
          rowKey={record => record.id + ""}
          style={{ marginTop: '12px' }}
          loading={this.props.courseStore!.loadingCourses}
          dataSource={courses === undefined ? [] : courses}
          columns={this.coursesTableColumns}

        />
           </TabPane>
           </Tabs>

           <ImageModal
          isOpen={this.state.isImageModalOpened}
          caption={this.state.imageModalCaption}
          src={this.state.imageModalUrl}
          onClose={() => { this.closeImageModal(); }} />

   </div>
   );
 }
}

export default TraineeDetails;
