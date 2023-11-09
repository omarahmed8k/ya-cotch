import * as React from 'react';
import { Button, Card, Dropdown, Menu, Table, Tag,Select,Modal,Form,Row,Col } from 'antd';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import moment from 'moment';
import { popupConfirm } from '../../lib/popupMessages';
import { CheckSquareOutlined,FilterOutlined,EyeOutlined,CaretDownOutlined,EditOutlined} from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import SearchComponent from '../../components/SearchComponent';
import { LiteEntityDto } from '../../services/dto/liteEntityDto';
import TrainerStore from '../../stores/trainerStore';
import { TrainerDto } from '../../services/trainers/dto/trainerDto';
import timingHelper from '../../lib/timingHelper';
import UserStatus from '../../services/types/userStatus';
import indexesService from '../../services/indexes/indexesService';
import IndexType from '../../services/types/indexType';
import localization from '../../lib/localization';
import { UpdateStatusDto } from '../../services/trainers/dto/updateStatusDto';
import { EntityDto } from '../../services/dto/entityDto';
import CreateOrUpdateTrainer from './components/createOrUpdateTrainer';
import { UpdateTrainerDto } from '../../services/trainers/dto/updateTrainerDto';

export interface ITrainerProps {
  trainerStore?: TrainerStore;
}

export interface ITrainerState {
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount:number;
  };
  trainerDetailsModalVisible:boolean;
  isVerified?:boolean,
  status?:number,
  specializationId?:number,
  keyword?:string;
  trainerModalVisible: boolean,
  trainerModalId: number,
  trainerModalType: string,
  changeStatusModalVisible:boolean;
  trainerId:number;

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

@inject(Stores.TrainerStore)
@observer
export class Trainers extends AppComponentBase<ITrainerProps, ITrainerState> {
  formRef = React.createRef<FormInstance>();
  specializations:LiteEntityDto[]=[];
  changeStatusFormRef = React.createRef<FormInstance>();


  state = {
    trainerDetailsModalVisible:false,
    trainerModalVisible: false,
    trainerModalId: 0,
    trainerModalType: 'create',
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount:0
    },  
    changeStatusModalVisible:false,
    trainerId:0,
    isVerified:undefined,
    status:undefined,
    specializationId:undefined,
    keyword:undefined,
  };

  async componentDidMount() {
    await this.updateTrainerList(this.state.meta.pageSize, 0);
    let result = await indexesService.getAllLite({type:IndexType.Specialization});
    this.specializations=result.items;
  }

  async updateTrainerList(maxResultCount: number, skipCount: number) {
    this.props.trainerStore!.maxResultCount = maxResultCount;
    this.props.trainerStore!.skipCount = skipCount;
    this.props.trainerStore!.isVerified = this.state.isVerified;
    this.props.trainerStore!.status =  this.state.status;
    this.props.trainerStore!.specializationId =  this.state.specializationId;

     this.props.trainerStore!.keyword = this.state.keyword;
   await this.props.trainerStore!.getTraniers();
  }

  getColumnVerifiedSearchProps = () => ({
    filterDropdown: ({ confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Select
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          showSearch
          optionFilterProp="children"
          onChange={(value: any) => {
           
            this.setState({isVerified:value === 3 ? undefined : value === 1 ? true : false});
          }}
          value={this.state.isVerified=== undefined ? 3 : !this.state.isVerified ? 0 : 1}
        >
          <Select.Option key={1} value={1}>{L('Verified')}</Select.Option>
          <Select.Option key={0} value={0}>{L('NotVerified')}</Select.Option>
          <Select.Option key={3} value={3}>{L('All')}</Select.Option>
        </Select>
        <Button
          type="primary"
          onClick={async () => {
            confirm();
            this.updateTrainerList(this.state.meta.pageSize,this.state.meta.skipCount);
          }}
         
          size="small"
          style={{ width: 90, marginRight: 4, marginLeft: 4 }}
        >
          {L('Filter')}
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            this.setState({isVerified:undefined},()=>{
              this.updateTrainerList(this.state.meta.pageSize,this.state.meta.skipCount);

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

  async openTrainerModal(input: EntityDto) {
    if (input.id === 0) {
     
    } else {
      await this.props.trainerStore!.getTranierById({id:input.id});
      this.setState({ trainerModalType: 'edit', trainerModalId: input.id });
    }
    this.setState({ trainerModalVisible: !this.state.trainerModalVisible});
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
            this.updateTrainerList(this.state.meta.pageSize,this.state.meta.skipCount);
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
              this.updateTrainerList(this.state.meta.pageSize,this.state.meta.skipCount);
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



  createOrUpdateTrainer = () => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
      values.imageUrl = document.getElementById('trainer-image')!.getAttribute("value") !== null ? document.getElementById('trainer-image')!.getAttribute("value") : this.props.trainerStore!.trainerModel?.imageUrl;    
      values.cvUrl = document.getElementById('trainer-cv')!.getAttribute("value") !== null ? document.getElementById('trainer-cv')!.getAttribute("value") : this.props.trainerStore!.trainerModel?.cvUrl;    

      if (this.state.trainerModalId === 0) {
      } else {
        values.id = this.state.trainerModalId;
        await this.props.trainerStore!.updateTrainer(values as UpdateTrainerDto);
      }
      await this.updateTrainerList(this.state.meta.pageSize,this.state.meta.skipCount);
      this.setState({ trainerModalVisible: false });
      form!.resetFields();
    });
  }
  getColumnSpecializationSearchProps = () => ({
    filterDropdown: ({ confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Select
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          showSearch
          placeholder={L('PleaseSelectSpecialization')}  
          optionFilterProp="children"
          filterOption={(input, option:any) =>
            option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          value={this.state.specializationId}
          onChange={(value: any) => {           
            this.setState({specializationId:value });
          }}>
          {this.specializations.length>0 && this.specializations.map((element:LiteEntityDto) => <Select.Option key={element.value} value={element.value}>{element.text}</Select.Option>)}
        
        
        </Select>
        <Button
          type="primary"
          onClick={async () => {
            confirm();
            this.updateTrainerList(this.state.meta.pageSize,this.state.meta.skipCount);
          }}
         
          size="small"
          style={{ width: 90, marginRight: 4, marginLeft: 4 }}
        >
          {L('Filter')}
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            this.setState({specializationId:undefined},()=>{
              this.updateTrainerList(this.state.meta.pageSize,this.state.meta.skipCount);
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


  onSwitchTrainerActivation = async (trainer: TrainerDto) => {
    popupConfirm(async () => {
      if(trainer.isActive)
      await this.props.trainerStore!.trainerDeactivation({ id: trainer.id });
      else
      await this.props.trainerStore!.trainerActivation({ id: trainer.id });
    }, trainer.isActive ? L('AreYouSureYouWantToBlockThisTrainer') : L('AreYouSureYouWantToUnblockThisTrainer'));
  }


  categoriesTableColumns = [
    {
      title: L('Name'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a:any, b:any) => a.name.localeCompare(b.name),

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
      title: L('Address'),
      dataIndex: 'address',
      key: 'address',
    },
      {
        title: L('Age'),
        dataIndex: 'age',
        key: 'age',
        sorter: (a:any, b:any) => a.age - b.age,

      },
      {
        title: L('Specialization'),
        dataIndex: 'specialization',
        key: 'specialization',
        ...this.getColumnSpecializationSearchProps(),
        render:(specialization:string,item:TrainerDto)=>{
          return item.specialization?.text;
        }
      },
      {
        title: L('YearsOfExperience'),
        dataIndex: 'yearsOfExperience',
        key: 'yearsOfExperience',
        sorter: (a:any, b:any) => a.yearsOfExperience - b.yearsOfExperience,

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
        title: L('CoursesCount'),
        dataIndex: 'coursesCount',
        key: 'coursesCount',
        sorter: (a:any, b:any) => a.coursesCount - b.coursesCount,

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
        title: L('Rate'),
        dataIndex: 'rate',
        key: 'rate',
        sorter: (a:any, b:any) => a.rate - b.rate,
      },
    {
      title: L('VerifiedStatus'),
      dataIndex: 'isVerified',
      key: 'isVerified',
      ...this.getColumnVerifiedSearchProps(),
      render: (isVerified: boolean) => {
        return <Tag color={isVerified ? 'green' : 'volcano'} className='ant-tag-disable-pointer'>{isVerified ? L('Verified') : L('NotVerified')}</Tag>;
      }
    },
    {
      title: L('Action'),
      key: 'action',
      render: (text: string, item: TrainerDto) => (
        <div>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
                 <Menu.Item onClick={() => window.location.href=`/trainer/${item.id}`}>
                  <EyeOutlined className="action-icon"  />
                  <button className="inline-action">{L('Details')}</button>
                </Menu.Item>
                <Menu.Item onClick={() => this.openTrainerModal({id:item.id})}>
                 <EditOutlined  className="action-icon" />
                  <button className="inline-action" >{L('Edit')}</button>
                </Menu.Item>
                <Menu.Item onClick={() => this.setState({changeStatusModalVisible:true,trainerId:item.id})}>
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
      this.updateTrainerList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateTrainerList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  handleChangeStatus =()=>{
    const form = this.changeStatusFormRef.current;
    form!.validateFields().then(async (values: any) => {
      values.trainerId=this.state.trainerId;
      await this.props.trainerStore!.updateStatus(values as UpdateStatusDto);
      this.setState({ changeStatusModalVisible: false});
      form!.resetFields();
    });
  }

  public render() {
    const trainers = this.props.trainerStore!.trainers;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.trainerStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={
          <div>
            <span>{L('Trainers')}</span>
            {/* <Button type="primary" style={{ float: localization.getFloat(), margin: '0 5px' }} icon={<PlusOutlined/>} onClick={() => this.openTrainerModal({ id: 0 })}>
              {L('AddTrainer')}
            </Button> */}
          </div>
        }
      >
          <SearchComponent
          searchText={L('SearchByNameIdPhoneNumber')}
        onSearch={(value: string)=>{
          this.setState({keyword:value},()=>{
            this.updateTrainerList(this.state.meta.pageSize,this.state.meta.skipCount);
          });
        }}
        />

<CreateOrUpdateTrainer
          formRef={this.formRef}
          visible={this.state.trainerModalVisible}
          onCancel={() =>
            this.setState({
              trainerModalVisible: false,
            })
          }
          modalType={this.state.trainerModalType}
          onOk={this.createOrUpdateTrainer}
          isSubmittingTrainer={this.props.trainerStore!.isSubmittingTrainer!}
          trainerStore={this.props.trainerStore!}
        />
        <Table
          pagination={pagination}
          rowKey={record => record.id + ""}
          style={{ marginTop: '12px' }}
          loading={this.props.trainerStore!.loadingTrainers}
          dataSource={trainers === undefined ? [] : trainers}
          columns={this.categoriesTableColumns}

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
     
      </Card>
    );
  }
}

export default Trainers;
