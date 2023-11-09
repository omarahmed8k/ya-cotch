import * as React from 'react';
import { Button, Card, Dropdown, Menu, Table, Tag,Select } from 'antd';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import { EntityDto } from '../../services/dto/entityDto';
import { popupConfirm } from '../../lib/popupMessages';
import localization from '../../lib/localization';
import AdminStore from '../../stores/adminStore';
import SearchComponent from '../../components/SearchComponent';
import ResetPasswordModal from '../../components/ResetPasswordModal';
import { CreateAdminDto } from '../../services/admins/dto/createAdminDto';
import { UpdateAdminDto } from '../../services/admins/dto/updateAdminDto';
import { AdminDto } from '../../services/admins/dto/adminDto';
import CreateOrUpdateAdmin from './components/createOrUpdateAdmin';
import moment from 'moment';
import AdminDetailsModal from './components/adminDetialsModal';
import { CheckSquareOutlined, DeleteOutlined,FilterOutlined,EyeOutlined,LockOutlined, EditOutlined,PlusOutlined,CaretDownOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import timingHelper from '../../lib/timingHelper';
import userService from '../../services/user/userService';


export interface IAdminsProps {
  adminStore?: AdminStore;
}

export interface IAdminsState {
  adminModalVisible: boolean;
  adminsModalId: number;
  resetPasswordModalVisible: boolean;
  adminId:number;
  adminsModalType: string;
  adminDetailsModalVisible:boolean;
  meta: {
    page: number;
    pageSize: number | undefined;
    skipCount:number;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
  };
  keyword?:string;
  isActiveFilter?:boolean;
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];
declare var abp: any;


@inject(Stores.AdminStore)
@observer
export class Admins extends AppComponentBase<IAdminsProps, IAdminsState> {
  formRef = React.createRef<FormInstance>();
  resetPasswordFormRef = React.createRef<FormInstance>();
  currentUser:any = undefined;

  state = {
    adminModalVisible: false,
    adminsModalId: 0,
    adminsModalType: 'create',
    resetPasswordModalVisible: false,
    adminId:0,
    adminDetailsModalVisible:false,
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      skipCount:0,
      total: 0,
    },
    keyword:undefined,
    isActiveFilter:undefined
  };

  async componentDidMount() {
    this.currentUser = await userService.get({id:abp.session.userId});
    this.updateAdminsList(this.state.meta.pageSize, 0);
  }

  openResetPasswordModal(adminId: number) {
    this.setState({adminId: adminId, resetPasswordModalVisible: true });
  }

  async openAdminDetailsModal(entityDto: EntityDto) {
    await this.props.adminStore!.getAdmin(entityDto);
    this.setState({ adminDetailsModalVisible: !this.state.adminDetailsModalVisible, adminsModalId: entityDto.id });
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
          <Select.Option key={1} value={1}>{L('Unblocked')}</Select.Option>
          <Select.Option key={0} value={0}>{L('Blocked')}</Select.Option>
          <Select.Option key={3} value={3}>{L('All')}</Select.Option>
        </Select>
        <Button
          type="primary"
          onClick={async () => {
            confirm();
            this.updateAdminsList(this.state.meta.pageSize,this.state.meta.skipCount);
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
              this.updateAdminsList(this.state.meta.pageSize,this.state.meta.skipCount);
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

  async updateAdminsList(maxResultCount: number, skipCount: number) {
    this.props.adminStore!.maxResultCount = maxResultCount;
    this.props.adminStore!.skipCount = skipCount;
    this.props.adminStore!.isActiveFilter = this.state.isActiveFilter;
    this.props.adminStore!.keyword = this.state.keyword;
    this.props.adminStore!.getAdmins();
  }

  async openAdminModal(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      this.props.adminStore!.adminModel=undefined;
      this.setState({ adminsModalType: 'create'}); 
    } else {
      await this.props.adminStore!.getAdmin(entityDto);
      this.setState({ adminsModalType: 'edit'});
    }
    this.setState({ adminModalVisible: !this.state.adminModalVisible, adminsModalId: entityDto.id });
  }


  createOrUpdateAdmin = () => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
      if (this.state.adminsModalId === 0) {
        await this.props.adminStore!.createAdmin(values as CreateAdminDto);
      } else {
        values.id = this.state.adminsModalId;
        await this.props.adminStore!.updateAdmin(values as UpdateAdminDto);
      }
      this.setState({ adminModalVisible: false });
      form!.resetFields();
    });
  }

  onSwitchAdminActivation = async (admin: AdminDto) => {
    popupConfirm(async () => {
      if(admin.isActive)
      await this.props.adminStore!.adminDeactivation({ id: admin.id });
      else
      await this.props.adminStore!.adminActivation({ id: admin.id });
    }, admin.isActive ? L('AreYouSureYouWantToBlockThisAdmin') : L('AreYouSureYouWantToUnBlockThisAdmin'));
  }

  onDeleteAdmin = async (input: EntityDto) => {
    popupConfirm(async () => {
      await this.props.adminStore!.deleteAdmin({ id: input.id });
    }, L('AreYouSureYouWantToDeleteThisAdmin'));
  }

  adminsTableColumns = [
    {
      title: L('Name'),
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: L('Email'),
      dataIndex: 'emailAddress',
      key: 'emailAddress',
    },
    {
      title: L('CreationTime'),
      dataIndex: 'creationTime',
      key: 'creationTime',
      render: (creationTime: string) => {
        return moment(creationTime).format(timingHelper.defaultDateTimeFormat);
      }
    },
    {
      title: L('Blocked?'),
      dataIndex: 'isActive',
      key: 'isActive',
      ...this.getColumnStatusSearchProps(),
      render: (isActive: boolean) => {
        return <Tag color={isActive ? 'green' : 'volcano'} className='ant-tag-disable-pointer'>{isActive ? L('Unblocked') : L('Blocked')}</Tag>;
      }
    },
    {
      title: L('Action'),
      key: 'action',
      render: (text: string, item: AdminDto) => (
        <div>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
                 <Menu.Item onClick={() => this.openAdminDetailsModal({ id: item.id })}>
                  <EyeOutlined className="action-icon"  />
                  <button className="inline-action">{L('Details')}</button>
                </Menu.Item>
                { item.name !== 'admin' &&
                <>
                <Menu.Item onClick={() => this.openAdminModal({ id: item.id })}>
                  <EditOutlined className="action-icon"  />
                  <button className="inline-action">{L('Edit')}</button>
                </Menu.Item>
   
                <Menu.Item onClick={() => this.onSwitchAdminActivation(item)}>
                  <CheckSquareOutlined className="action-icon" />
                  <button className="inline-action" >{item.isActive ? L('Block') : L('Unblock')}</button>
                </Menu.Item>
                </>
            }
             {this.currentUser && this.currentUser!.name !== 'admin' && item.name === 'admin' ? null : (
                  <Menu.Item onClick={() => this.openResetPasswordModal(item.id)}>
                  <LockOutlined className="action-icon"  />
                  <button className="inline-action">{L('ResetPassword')}</button>
                </Menu.Item>
                )}

            {item.name !== 'admin' &&
                <Menu.Item onClick={() => this.onDeleteAdmin({ id: item.id })}>
                  <DeleteOutlined className="action-icon" />      
                  <button className="inline-action">{L('Delete')}</button>
                </Menu.Item>
                
                         }

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
      this.updateAdminsList(pageSize, 0);
      
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateAdminsList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const admins = this.props.adminStore!.admins;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.adminStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={
          <div>
            <span>{L('Admins')}</span>
            <Button type="primary" style={{ float: localization.getFloat(), margin: '0 5px' }} icon={<PlusOutlined/>} onClick={() => this.openAdminModal({ id: 0 })}>
              {L('AddAdmin')}
            </Button>
          </div>
        }
      >
         <SearchComponent
        onSearch={(value: string)=>{
          this.setState({keyword:value},()=>{
            this.updateAdminsList(this.state.meta.pageSize,this.state.meta.skipCount);
          });
        }}
        />
        <Table
          pagination={pagination}
          rowKey={record => record.id + ""}
          style={{ marginTop: '12px' }}
          loading={this.props.adminStore!.loadingAdmins}
          dataSource={admins === undefined ? [] : admins}
          columns={this.adminsTableColumns}
        />

        <CreateOrUpdateAdmin
          formRef={this.formRef}
          visible={this.state.adminModalVisible}
          onCancel={() =>
            this.setState({
              adminModalVisible: false,
            })
          }
          modalType={this.state.adminsModalType}
          onOk={this.createOrUpdateAdmin}
          isSubmittingAdmin={this.props.adminStore!.isSubmittingAdmin}
          adminStore={this.props.adminStore}
        />
        <AdminDetailsModal
          visible={this.state.adminDetailsModalVisible}
          onCancel={() =>
            this.setState({
              adminDetailsModalVisible: false,
            })
          }
          adminStore={this.props.adminStore}
        />

        <ResetPasswordModal
          formRef={this.resetPasswordFormRef}
          isOpen={this.state.resetPasswordModalVisible}
          userId={this.state.adminId}
          onClose={ () =>
            this.setState({
              resetPasswordModalVisible: false,
          })}
        />
      </Card>
    );
  }
}

export default Admins;
