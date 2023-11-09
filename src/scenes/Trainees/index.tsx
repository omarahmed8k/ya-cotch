import * as React from 'react';
import { Button, Card, Dropdown, Menu, Table, Tag,Select,Modal,Form,Row,Col,Avatar } from 'antd';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import moment from 'moment';
import { CheckSquareOutlined,FilterOutlined,EyeOutlined,CaretDownOutlined,EditOutlined} from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import SearchComponent from '../../components/SearchComponent';
import timingHelper from '../../lib/timingHelper';
import UserStatus from '../../services/types/userStatus';
import localization from '../../lib/localization';
import { UpdateStatusDto } from '../../services/trainees/dto/updateStatusDto';
import { EntityDto } from '../../services/dto/entityDto';
import TraineeStore from '../../stores/traineeStore';
import { UpdateTraineeDto } from '../../services/trainees/dto/updateTraineeDto';
import Gender from '../../services/types/gender';
import { TraineeDto } from '../../services/trainees/dto/traineeDto';
import CreateOrUpdateTrainee from './components/createOrUpdateTrainee';
import ImageModal from '../../components/ImageModal';

export interface ITraineeProps {
  traineeStore?: TraineeStore;
}

export interface ITraineeState {
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount:number;
  };
  status?:number,
  gender?:number,
  keyword?:string;
  traineeModalVisible: boolean,
  traineeModalId: number,
  traineeModalType: string,
  changeStatusModalVisible:boolean;
  traineeId:number;
  isImageModalOpened: boolean;
  imageModalCaption: string;
  imageModalUrl: string;

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

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.TraineeStore)
@observer
export class Trainees extends AppComponentBase<ITraineeProps, ITraineeState> {
  formRef = React.createRef<FormInstance>();
  changeStatusFormRef = React.createRef<FormInstance>();

  state = {
    traineeModalVisible: false,
    traineeModalId: 0,
    traineeModalType: 'create',
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount:0
    },  
    changeStatusModalVisible:false,
    traineeId:0,
    gender:undefined,
    status:undefined,
    keyword:undefined,
    isImageModalOpened: false,
    imageModalCaption: '',
    imageModalUrl: '',
  };

  async componentDidMount() {
    await this.updateTraineeList(this.state.meta.pageSize, 0);
  }

  openImageModal(image: string, caption: string) {
    this.setState({ isImageModalOpened: true, imageModalCaption: caption, imageModalUrl: image });
  }

  closeImageModal() {
    this.setState({ isImageModalOpened: false, imageModalCaption: '', imageModalUrl: '' });
  }

  async updateTraineeList(maxResultCount: number, skipCount: number) {
    this.props.traineeStore!.maxResultCount = maxResultCount;
    this.props.traineeStore!.skipCount = skipCount;
    this.props.traineeStore!.gender = this.state.gender;
    this.props.traineeStore!.status =  this.state.status;
    this.props.traineeStore!.keyword = this.state.keyword;
    await this.props.traineeStore!.getTraniees();
  }



  async openTraineeModal(input: EntityDto) {
    if (input.id === 0) {
     
    } else {
      await this.props.traineeStore!.getTranieeById({id:input.id});
      this.setState({ traineeModalType: 'edit', traineeModalId: input.id });
    }
    this.setState({ traineeModalVisible: !this.state.traineeModalVisible});
  }

  getColumnStatusSearchProps = () => ({
    filterDropdown: ({ confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Select
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          showSearch
          optionFilterProp="children"
          onChange={(value: any) => {
           
            this.setState({status:value === 3 ? undefined : value });
          }}
          value={this.state.status=== undefined ? 3 : this.state.status}
        >
          <Select.Option key={0} value={0}>{L('Active')}</Select.Option>
          <Select.Option key={1} value={1}>{L('Inactive')}</Select.Option>
          <Select.Option key={2} value={2}>{L('Blocked')}</Select.Option>

          <Select.Option key={3} value={3}>{L('All')}</Select.Option>
        </Select>
        <Button
          type="primary"
          onClick={async () => {
            confirm();
            this.updateTraineeList(this.state.meta.pageSize,this.state.meta.skipCount);
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
              this.updateTraineeList(this.state.meta.pageSize,this.state.meta.skipCount);
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

  getColumnGenderSearchProps = () => ({
    filterDropdown: ({ confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Select
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          showSearch
          optionFilterProp="children"
          onChange={(value: any) => {
           
            this.setState({gender:value === 3 ? undefined : value });
          }}
          value={this.state.gender=== undefined ? 3 : this.state.gender}
        >
          <Select.Option key={0} value={0}>{L('Female')}</Select.Option>
          <Select.Option key={1} value={1}>{L('Male')}</Select.Option>
          <Select.Option key={3} value={3}>{L('All')}</Select.Option>
        </Select>
        <Button
          type="primary"
          onClick={async () => {
            confirm();
            this.updateTraineeList(this.state.meta.pageSize,this.state.meta.skipCount);
          }}
         
          size="small"
          style={{ width: 90, marginRight: 4, marginLeft: 4 }}
        >
          {L('Filter')}
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            this.setState({gender:undefined},()=>{
              this.updateTraineeList(this.state.meta.pageSize,this.state.meta.skipCount);
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

  createOrUpdateTrainee = () => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
      values.imageUrl = document.getElementById('trainee-image')!.getAttribute("value") !== null ? document.getElementById('trainee-image')!.getAttribute("value") : this.props.traineeStore!.traineeModel?.imageUrl;    

      if (this.state.traineeModalId === 0) {
      } else {
        values.id = this.state.traineeModalId;
        await this.props.traineeStore!.updateTrainee(values as UpdateTraineeDto);
      }
      await this.updateTraineeList(this.state.meta.pageSize,this.state.meta.skipCount);
      this.setState({ traineeModalVisible: false });
      form!.resetFields();
    });
  }
 

  traineesTableColumns = [
    {
      title: L('Name'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a:any, b:any) => a.name.localeCompare(b.name),

    },
    {
      title: L('Image'),
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl: string,item:TraineeDto) => {
        return (
          <div onClick={() => this.openImageModal(item.imageUrl!, item.name)} style={{ display: 'inline-block', cursor: "zoom-in" }}>
            <Avatar shape='square' size={50} src={item.imageUrl} />
          </div>
        );
      }
    },
    {
      title: L('Email'),
      dataIndex: 'emailAddress',
      key: 'emailAddress',
    },
  
    {
      title: L('PhoneNumber'),
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: L('Gender'),
      dataIndex: 'gender',
      key: 'gender',
      ...this.getColumnGenderSearchProps(),
      render: (gender: number) => {
        switch(gender){
          case Gender.Male:
            return <Tag color={'processing'} className='ant-tag-disable-pointer'>{L('Male')}</Tag>;
          case Gender.Female:
            return <Tag color={'processing'} className='ant-tag-disable-pointer'>{L('Female')}</Tag>;
       
        }
        return "";
      },
    },
      {
        title: L('Age'),
        dataIndex: 'age',
        key: 'age',
        sorter: (a:any, b:any) => a.age - b.age,

      },
  
      
      {
        title: L('LastLoginDate'),
        dataIndex: 'lastLoginDate',
        key: 'lastLoginDate',
        sorter: (a:any, b:any) => a.lastLoginDate - b.lastLoginDate,

        render:(lastLoginDate:string)=>{
          return lastLoginDate ? moment(lastLoginDate).format(timingHelper.defaultDateFormat):null;
        }
      },
      {
        title: L('AppliedCoursesCount'),
        dataIndex: 'appliedCoursesCount',
        key: 'appliedCoursesCount',
        sorter: (a:any, b:any) => a.appliedCoursesCount - b.appliedCoursesCount,

      },
      {
        title: L('Status'),
        dataIndex: 'status',
        key: 'status',
        render: (status: number) => {
          switch(status){
            case UserStatus.Active:
              return <Tag color={'success'} className='ant-tag-disable-pointer'>{L('Active')}</Tag>;
            case UserStatus.Blocked:
              return <Tag color={'volcano'} className='ant-tag-disable-pointer'>{L('Blocked')}</Tag>;
              case UserStatus.Inactive:
                return <Tag color={'warning'} className='ant-tag-disable-pointer'>{L('Inactive')}</Tag>;
              
          }
          return "";
        },
        ...this.getColumnStatusSearchProps()
      },
     
    {
      title: L('Action'),
      key: 'action',
      render: (text: string, item: TraineeDto) => (
        <div>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
                 <Menu.Item onClick={() => window.location.href=`/trainee/${item.id}`}>
                  <EyeOutlined className="action-icon"  />
                  <button className="inline-action">{L('Details')}</button>
                </Menu.Item>
                <Menu.Item onClick={() => this.openTraineeModal({id:item.id})}>
                 <EditOutlined  className="action-icon" />
                  <button className="inline-action" >{L('Edit')}</button>
                </Menu.Item>
                <Menu.Item onClick={() => this.setState({changeStatusModalVisible:true,traineeId:item.id})}>
                 <CheckSquareOutlined  className="action-icon" />
                  <button className="inline-action" >{L('ChangeStatus')}</button>
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
      this.updateTraineeList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateTraineeList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  handleChangeStatus =()=>{
    const form = this.changeStatusFormRef.current;
    form!.validateFields().then(async (values: any) => {
      values.traineeId=this.state.traineeId;
      await this.props.traineeStore!.updateStatus(values as UpdateStatusDto);
      this.setState({ changeStatusModalVisible: false});
      form!.resetFields();
    });
  }

  public render() {
    const trainees = this.props.traineeStore!.trainees;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.traineeStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={
          <div>
            <span>{L('Trainees')}</span>
            {/* <Button type="primary" style={{ float: localization.getFloat(), margin: '0 5px' }} icon={<PlusOutlined/>} onClick={() => this.openTrainerModal({ id: 0 })}>
              {L('AddTrainer')}
            </Button> */}
          </div>
        }
      >
          <SearchComponent
          searchText={L('SearchByNamePhoneNumberEmail')}
        onSearch={(value: string)=>{
          this.setState({keyword:value},()=>{
            this.updateTraineeList(this.state.meta.pageSize,this.state.meta.skipCount);
          });
        }}
        />

<CreateOrUpdateTrainee
          formRef={this.formRef}
          visible={this.state.traineeModalVisible}
          onCancel={() =>
            this.setState({
              traineeModalVisible: false,
            })
          }
          modalType={this.state.traineeModalType}
          onOk={this.createOrUpdateTrainee}
          isSubmittingTrainee={this.props.traineeStore!.isSubmittingTrainee!}
          traineeStore={this.props.traineeStore!}
        />
        <Table
          pagination={pagination}
          rowKey={record => record.id + ""}
          style={{ marginTop: '12px' }}
          loading={this.props.traineeStore!.loadingTrainees}
          dataSource={trainees === undefined ? [] : trainees}
          columns={this.traineesTableColumns}

        />

              <Modal   
    visible={this.state.changeStatusModalVisible}
    title={L('ChangeStatus')}
    centered
    destroyOnClose
    maskClosable={false}
    className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
    onCancel={()=>{this.setState({changeStatusModalVisible:false})}}    
    footer={[
      <Button key="back" onClick={()=>{this.setState({changeStatusModalVisible:false})}}>
        {L('Cancel')}
      </Button>,
      <Button key="submit" type="primary" onClick={this.handleChangeStatus}>
         {L('Change')}
      </Button>,
    ]}
  >
    <Form ref={this.changeStatusFormRef}>
        <Row>
          <Col {...colLayout}>
          <Form.Item
            label={L("Status")}
            name="status"
            {...formItemLayout}
            rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
        > 
<Select
          showSearch
          placeholder={L('PleaseSelectStatus')}  
          optionFilterProp="children"
          filterOption={(input, option:any) =>
            option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
         >
          <Select.Option value={UserStatus.Active} key={UserStatus.Active}>{L('Active')}</Select.Option>
          <Select.Option value={UserStatus.Blocked} key={UserStatus.Blocked}>{L('Blocked')}</Select.Option>
          <Select.Option value={UserStatus.Inactive} key={UserStatus.Inactive}>{L('Inactive')}</Select.Option>

        </Select>
 </Form.Item>
 </Col>
 </Row>
 </Form>
  </Modal>
           <ImageModal
          isOpen={this.state.isImageModalOpened}
          caption={this.state.imageModalCaption}
          src={this.state.imageModalUrl}
          onClose={() => { this.closeImageModal(); }} />

      </Card>
    );
  }
}

export default Trainees;
