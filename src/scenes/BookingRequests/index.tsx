import * as React from 'react';
import { Button, Card, Dropdown, Menu, Table, Tag,Select } from 'antd';
import { inject, observer } from 'mobx-react';
import { CaretDownOutlined,EyeOutlined,FilterOutlined} from '@ant-design/icons';
import moment from 'moment';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import timingHelper from '../../lib/timingHelper';
import SearchComponent from '../../components/SearchComponent';
import { EntityDto } from '../../services/dto/entityDto';
import BookingRequestStore from '../../stores/bookingRequestStore';
import BookingRequestStatus from '../../services/types/bookingRequestStatus';
import { BookingRequestsDto } from '../../services/bookingRequests/dto/bookingRequestsDto';
import BookingRequestDetailsModal from './components/bookingRequestDetailsModal';
import { LiteEntityDto } from '../../services/dto/liteEntityDto';
import coursesService from '../../services/courses/coursesService';

export interface IBookingRequestsProps {
  bookingRequestStore :BookingRequestStore;
}


export interface IBookingRequestsState {
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount:number;
  };
  isActiveFilter?:boolean;
  keyword?:string;
  courseId?:number;
  status?:BookingRequestStatus;
  bookingRequestDetailsModalVisible: boolean;
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.BookingRequestStore)
@observer
export class BookingRequests extends AppComponentBase<IBookingRequestsProps, IBookingRequestsState> {
  courses:Array<LiteEntityDto>=[];
  
  async openBookingRequestDetailsModal(entityDto: EntityDto) {
    await this.props.bookingRequestStore!.getBookingRequest(entityDto);
    this.setState({ bookingRequestDetailsModalVisible: !this.state.bookingRequestDetailsModalVisible });
  }

  state = {
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount:0
    },
    isActiveFilter:undefined,
    keyword:undefined,
    courseId:undefined,
    status:undefined,
    bookingRequestDetailsModalVisible: false,
    };

  async componentDidMount() {
    
    const result = await coursesService.getAllLite();
    this.courses=result.items;
    this.updateBookingRequestsList(this.state.meta.pageSize, 0);
  }

 
  async updateBookingRequestsList(maxResultCount: number, skipCount: number) {
    this.props.bookingRequestStore!.maxResultCount = maxResultCount;
    this.props.bookingRequestStore!.skipCount = skipCount;
    this.props.bookingRequestStore!.isActiveFilter =this.state.isActiveFilter;
    this.props.bookingRequestStore!.keyword =this.state.keyword;
    this.props.bookingRequestStore!.status =this.state.status;
    this.props.bookingRequestStore!.courseId =this.state.courseId;
    this.props.bookingRequestStore!.getBookingRequests();
  }
 
  getColumnStatusSearchProps = () => ({
    filterDropdown: ({ confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Select
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          showSearch
          optionFilterProp="children"
          onChange={(value: any) => {
           
            this.setState({status:value === 5 ? undefined : value });
          }}
          value={this.state.status=== undefined ? 5 : this.state.status}
        >
          <Select.Option key={0} value={0}>{L('Pending')}</Select.Option>
          <Select.Option key={1} value={1}>{L('Approved')}</Select.Option>
          <Select.Option key={2} value={2}>{L('Rejected')}</Select.Option>
          <Select.Option key={3} value={3}>{L('Paid')}</Select.Option>
          <Select.Option key={4} value={4}>{L('Cancelled')}</Select.Option>
          <Select.Option key={5} value={5}>{L('All')}</Select.Option>
         
        </Select>
        <Button
          type="primary"
          onClick={async () => {
            confirm();
            this.updateBookingRequestsList(this.state.meta.pageSize,this.state.meta.skipCount);
          }}
         
          size="small"
          style={{ width: 90, marginRight: 4, marginLeft: 4 }}
        >
          {L('Filter')}
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            this.setState({status:undefined},()=>{
              this.updateBookingRequestsList(this.state.meta.pageSize,this.state.meta.skipCount);
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

  getColumnCourseSearchProps = () => ({
    filterDropdown: ({ confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Select
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          showSearch
          placeholder={L('PleaseSelectCourse')}  
          optionFilterProp="children"
          filterOption={(input, option:any) =>
            option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          value={this.state.courseId}
          onChange={(value: any) => {           
            this.setState({courseId:value });
          }}
        >
          {this.courses.length>0 && this.courses.map((element:LiteEntityDto) => <Select.Option key={element.value} value={element.value}>{element.text}</Select.Option>)}
        
        
        </Select>
        <Button
          type="primary"
          onClick={async () => {
            confirm();
            this.updateBookingRequestsList(this.state.meta.pageSize,this.state.meta.skipCount);
          }}
         
          size="small"
          style={{ width: 90, marginRight: 4, marginLeft: 4 }}
        >
          {L('Filter')}
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            this.setState({courseId:undefined},()=>{
              this.updateBookingRequestsList(this.state.meta.pageSize,this.state.meta.skipCount);
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

  bookingRequestsTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
      sorter: (a:any, b:any) => a.id - b.id,

    },
    {
      title: L('CourseName'),
      dataIndex: 'course',
      key: 'course',
      ...this.getColumnCourseSearchProps(),
      render:(course:any,item:BookingRequestsDto)=>{
        return <a href={`/course/${item.course?.value}`} target="_blank" rel="noopener noreferrer">{item.course?.text}</a>;
      }
    },
    {
      title: L('TraineeName'),
      dataIndex: 'trainee',
      key: 'trainee',
      render:(trainee:any,item:BookingRequestsDto)=>{
        return  <a href={`/trainee/${item.trainee.id}`} target="_blank" rel="noopener noreferrer">{item.trainee?.name}</a>;
      }
    },
    {
      title: L('TraineePhoneNumber'),
      dataIndex: 'trainee',
      key: 'trainee',
      render:(trainee:any,item:BookingRequestsDto)=>{
        return item.trainee?.phoneNumber;
      }
    },
   
    {
      title: L('CreationTime'),
      dataIndex: 'creationTime',
      key: 'creationTime',
      sorter: (a:any, b:any) => a.creationTime - b.creationTime,

      render:(creationTime:string)=>{
        return creationTime ? moment(creationTime).format(timingHelper.defaultDateTimeFormat):undefined;
      }
    },
      
    {
      title: L('Status'),
      dataIndex: 'status',
      key: 'status',
      ...this.getColumnStatusSearchProps(),
      render: (status: number) => {
        switch(status){
          case BookingRequestStatus.Approved:
            return <Tag color="green" className='ant-tag-disable-pointer'>{L('Approved')}</Tag>;
          case BookingRequestStatus.Cancelled:
            return <Tag color="volcano" className='ant-tag-disable-pointer'>{L('Cancelled')}</Tag>;
          case BookingRequestStatus.Paid:
            return <Tag color="green" className='ant-tag-disable-pointer'>{L('Paid')}</Tag>;
          case BookingRequestStatus.Pending:
            return <Tag color="warning" className='ant-tag-disable-pointer'>{L('Pending')}</Tag>;
          case BookingRequestStatus.Rejected:
            return <Tag color="volcano" className='ant-tag-disable-pointer'>{L('Rejected')}</Tag>;
          }
        return '';      
      },
    },
    {
      title: L('Action'),
      key: 'action',
      width: '10%',
      render: (text: string, item: BookingRequestsDto) => (
        <div>
          <Dropdown
            trigger={['click']}
            overlay={(
              <Menu>
                <Menu.Item onClick={() => this.openBookingRequestDetailsModal({ id: item.id})}>
                  <EyeOutlined className="action-icon"  />
                  <button className="inline-action">{L('Details')}</button>
                </Menu.Item>
               
              </Menu>
            )}
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
      this.updateBookingRequestsList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateBookingRequestsList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const {bookingRequests} = this.props.bookingRequestStore!;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.bookingRequestStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={L('BookingRequests')}
      >
        <SearchComponent
          searchText={L('SearchByIdTraineePhoneTraineeName')}
          onSearch={(value: string)=>{
          this.setState({keyword:value},()=>{
            this.updateBookingRequestsList(this.state.meta.pageSize,this.state.meta.skipCount);
          });
        }}
        />
        <Table
          pagination={pagination}
          rowKey={record => `${record.id  }`}
          style={{ marginTop: '12px' }}
          loading={this.props.bookingRequestStore!.loadingBookingRequests}
          dataSource={bookingRequests === undefined ? [] : bookingRequests}
          columns={this.bookingRequestsTableColumns}

        />

        <BookingRequestDetailsModal
          visible={this.state.bookingRequestDetailsModalVisible}
          onCancel={() =>
            this.setState({
              bookingRequestDetailsModalVisible: false,
            })}
          bookingRequestStore={this.props.bookingRequestStore!}
        />

      </Card>
    );
  }
}

export default BookingRequests;
