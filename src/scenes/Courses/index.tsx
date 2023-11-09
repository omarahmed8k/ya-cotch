import * as React from 'react';
import { Avatar, Button, Card, Dropdown, Menu, Table, Tag,Select } from 'antd';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import { EntityDto } from '../../services/dto/entityDto';
import CreateOrUpdateCourse from './components/createOrUpdateCourse';
import { popupConfirm } from '../../lib/popupMessages';
import localization from '../../lib/localization';
import ImageModel from '../../components/ImageModal';
import { CheckSquareOutlined, EditOutlined,FilterOutlined,PlusOutlined,EyeOutlined,CaretDownOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import SearchComponent from '../../components/SearchComponent';
import CourseStore from '../../stores/courseStore';
import { CreateCourseDto } from '../../services/courses/dto/createCourseDto';
import { UpdateCourseDto } from '../../services/courses/dto/updateCourseDto';
import { CourseDto } from '../../services/courses/dto/courseDto';
import categoriesService from '../../services/categories/categoriesService';
import { LiteEntityDto } from '../../services/dto/liteEntityDto';
import userService from '../../services/user/userService';
import UserType from '../../services/types/userType';
import CategoryType from '../../services/types/categoryType';
import ThousandSeparator from '../../components/ThousandSeparator';
// import moment from 'moment';
// import timingHelper from '../../lib/timingHelper';

export interface ICoursesProps {
  courseStore?: CourseStore;
}

export interface ICourseState {
  courseModalVisible: boolean;
  courseModalId: number;
  courseModalType: string;
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount:number;
  };
  isImageModalOpened: boolean;
  imageModalCaption: string;
  imageModalUrl: string;
  isActiveFilter?:boolean;
  keyword?:string;
  categoryId?:number;
  trainerId?:number;
  hasDiscount?:boolean;

}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.CourseStore)
@observer
export class Courses extends AppComponentBase<ICoursesProps, ICourseState> {
  formRef = React.createRef<FormInstance>();
  categories:LiteEntityDto[]=[];
  trainers:LiteEntityDto[]=[];

  state = {
    courseModalVisible: false,
    courseModalId: 0,
    courseModalType: 'create',
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount:0
    },
    isImageModalOpened: false,
    imageModalCaption: '',
    imageModalUrl: '',
    isActiveFilter:undefined,
    keyword:undefined,
    categoryId:undefined,
    trainerId:undefined,
    hasDiscount:undefined
  };

  async componentDidMount() {
    let result= await categoriesService.getAllLite({type:CategoryType.Courses});
    this.categories=result.items;
    let result2= await userService.getAllLite({type:UserType.Trainer});
    this.trainers=result2.items;
    this.updateCorsesList(this.state.meta.pageSize, 0);

  }
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

  getColumnTrainerSearchProps = () => ({
    filterDropdown: ({ confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Select
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          showSearch
          placeholder={L('PleaseSelectTrainer')}  
          optionFilterProp="children"
          filterOption={(input, option:any) =>
            option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          value={this.state.trainerId}
          onChange={(value: any) => {           
            this.setState({trainerId:value });
          }}>
          {this.trainers.length>0 && this.trainers.map((element:LiteEntityDto) => <Select.Option key={element.value} value={element.value}>{element.text}</Select.Option>)}
        
        
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
            this.setState({trainerId:undefined},()=>{
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

  async updateCorsesList(maxResultCount: number, skipCount: number) {
    this.props.courseStore!.maxResultCount = maxResultCount;
    this.props.courseStore!.skipCount = skipCount;
    this.props.courseStore!.isActiveFilter = this.state.isActiveFilter;
    this.props.courseStore!.keyword = this.state.keyword;
    this.props.courseStore!.categoryId = this.state.categoryId;
    this.props.courseStore!.trainerId = this.state.trainerId;
    this.props.courseStore!.hasDiscount = this.state.hasDiscount;

    this.props.courseStore!.getCourses();
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

  async openCourseModal(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      this.props.courseStore!.courseModel=undefined;
      this.setState({ courseModalType: 'create' });

    } else {
      await this.props.courseStore!.getCourse(entityDto);
      this.setState({ courseModalType: 'edit' });
    }
    this.setState({ courseModalVisible: !this.state.courseModalVisible,courseModalId:entityDto.id});
  }


  createOrUpdateCourse = () => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
         values.imageUrl = document.getElementById('course-image')!.getAttribute("value") !== null ? document.getElementById('course-image')!.getAttribute("value") : this.props.courseStore!.courseModel?.imageUrl;    
      if (this.state.courseModalId === 0) {
        await this.props.courseStore!.createCourse(values as CreateCourseDto);
      } else {
        values.id = this.state.courseModalId; 
        if(!values.hasDiscount){
          values.discountPercentage=undefined;
        }else{
          values.discountPercentage=parseInt(values.discountPercentage);
        }
        
        await this.props.courseStore!.updateCourses(values as UpdateCourseDto);
      }
      this.setState({ courseModalVisible: false });
      form!.resetFields();
    });
     
  }

  onSwitchCourseActivation = async (course: CourseDto) => {
    popupConfirm(async () => {
      if(course.isActive)
      await this.props.courseStore!.courseDeactivation({ id: course.id });
      else
      await this.props.courseStore!.courseActivation({ id: course.id });
    }, course.isActive ? L('AreYouSureYouWantToDeactivateThisCourse') : L('AreYouSureYouWantToActivateThisCourse'));
  }

  openImageModal(image: string, caption: string) {
    this.setState({ isImageModalOpened: true, imageModalCaption: caption, imageModalUrl: image });
  }


  closeImageModal() {
    this.setState({ isImageModalOpened: false, imageModalCaption: '', imageModalUrl: '' });
  }
  categoriesTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('Name'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a:any, b:any) =>a.name.localeCompare(b.name),
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
      title: `${L('Fee')} (${L('SAR')})`,
      dataIndex: 'fee',
      key: 'fee',
      render:(fee:number)=>{
        return <ThousandSeparator number={fee} />
      }
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
        title: L('TrainerName'),
        dataIndex: 'trainer',
        key: 'trainer',
        render:(trainer :any,item:CourseDto)=>{
          return item.trainer?.text;
        },
      ...this.getColumnTrainerSearchProps()

      },
      {
        title: L('CategoryName'),
        dataIndex: 'category',
        key: 'category',
        render:(category :any,item:CourseDto)=>{
          return item.category?.text;
        },
      

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
    {
      title: L('Action'),
      key: 'action',
      render: (text: string, item: CourseDto) => (
        <div>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
                 <Menu.Item onClick={() =>window.location.href=`/course/${item.id}`}>
                  <EyeOutlined className="action-icon"  />
                  <button className="inline-action">{L('Details')}</button>
                </Menu.Item>
                <Menu.Item onClick={() => this.openCourseModal({ id: item.id })}>
                  <EditOutlined   className="action-icon" />
                  <button className="inline-action">{L('Edit')}</button>
                </Menu.Item>
                <Menu.Item onClick={() => this.onSwitchCourseActivation(item)}>
                 <CheckSquareOutlined  className="action-icon" />
                  <button className="inline-action" >{item.isActive ? L('Deactivate') : L('Activate')}</button>
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

  public render() {
    const courses = this.props.courseStore!.courses;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.courseStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={
          <div>
            <span>{L('Courses')}</span>

            <Button type="primary" style={{ float: localization.getFloat(), margin: '0 5px' }} icon={<PlusOutlined/>} onClick={() => this.openCourseModal({ id: 0 })}>
              {L('AddCourse')}
            </Button>
          </div>
        }
      >
          <SearchComponent
            searchText={L('SearchByNameIdTrainer')}
        onSearch={(value: string)=>{
          this.setState({keyword:value},()=>{
            this.updateCorsesList(this.state.meta.pageSize,this.state.meta.skipCount);
          });
        }}
        />

        <Table
          pagination={pagination}
          rowKey={record => record.id + ""}
          style={{ marginTop: '12px' }}
          loading={this.props.courseStore!.loadingCourses}
          dataSource={courses === undefined ? [] : courses}
          columns={this.categoriesTableColumns}

        />
       
        <CreateOrUpdateCourse
          formRef={this.formRef}
          visible={this.state.courseModalVisible}
          onCancel={() =>
            this.setState({
              courseModalVisible: false,
            })
          }
          modalType={this.state.courseModalType}
          onOk={this.createOrUpdateCourse}
          isSubmittingCourse={this.props.courseStore!.isSubmittingCourse}
          courseStore={this.props.courseStore!}
        />

        <ImageModel
          isOpen={this.state.isImageModalOpened}
          caption={this.state.imageModalCaption}
          src={this.state.imageModalUrl}
          onClose={() => { this.closeImageModal(); }} />

        
      </Card>
    );
  }
}

export default Courses;
