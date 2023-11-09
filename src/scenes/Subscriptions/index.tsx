import * as React from 'react';
import { Button, Card, Dropdown, Menu, Table, Tag,Select } from 'antd';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import { EntityDto } from '../../services/dto/entityDto';
import { popupConfirm } from '../../lib/popupMessages';
import SearchComponent from '../../components/SearchComponent';
import localization from '../../lib/localization';
import { EditOutlined,FilterOutlined,PlusOutlined,CaretDownOutlined,CheckSquareOutlined,EyeOutlined, BranchesOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import moment from 'moment';
import timingHelper from '../../lib/timingHelper';
import ThousandSeparator from '../../components/ThousandSeparator';
import SubscriptionStore from '../../stores/subscriptionStore';
import { SubscriptionDto } from '../../services/subscriptions/dto/subscriptionDto';
import SubscriptionTarget from '../../services/types/subscriptionTarget';
import CreateOrUpdateSubscription from './components/createOrUpdateSubscription';
import AssignSubscriptionToUser from './components/assignSubscriptionToUser';

export interface ISubscriptionsProps {
  subscriptionStore?: SubscriptionStore;
}

export interface ISubscriptionsState {
  subscriptionModalVisible: boolean;
  subscriptionModalId: number;
  subscriptionModalType: string;
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    skipCount:number;
    pageTotal: number;
    total: number;
  };
  isActiveFilter?:boolean;
  keyword?:string;
  assignToUserModalVisible:boolean;
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.SubscriptionStore)
@observer
export class Subscriptions extends AppComponentBase<ISubscriptionsProps, ISubscriptionsState> {
  formRef = React.createRef<FormInstance>();

  state = {
    subscriptionModalVisible: false,
    subscriptionModalId: 0,
    subscriptionModalType: 'create',
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      skipCount:0,
      pageTotal: 1,
      total: 0,
    },
    isActiveFilter:undefined,
    keyword:undefined,
    assignToUserModalVisible:false
  };


  async componentDidMount() {
    this.updateSubscriptionsList(this.state.meta.pageSize, 0);
  }

  async updateSubscriptionsList(maxResultCount: number, skipCount: number) {
    this.props.subscriptionStore!.maxResultCount = maxResultCount;
    this.props.subscriptionStore!.skipCount = skipCount;
    this.props.subscriptionStore!.keyword = this.state.keyword;
    this.props.subscriptionStore!.isActiveFilter = this.state.isActiveFilter;

    this.props.subscriptionStore!.getSubscriptions();
  }

  async openSubscriptionModal(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      this.props.subscriptionStore!.subscriptionModel=undefined;
      this.setState({ subscriptionModalType: 'create' }); 
    } else {
      await this.props.subscriptionStore!.getSubscription(entityDto);
      this.setState({ subscriptionModalType: 'edit' });
    }
    this.setState({ subscriptionModalVisible: !this.state.subscriptionModalVisible, subscriptionModalId: entityDto.id });
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
            this.updateSubscriptionsList(this.state.meta.pageSize,this.state.meta.skipCount);
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
              this.updateSubscriptionsList(this.state.meta.pageSize,this.state.meta.skipCount);
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
  

  onSwitchSubscriptionActivation = async (subscription: SubscriptionDto) => {
    popupConfirm(async () => {
      if(subscription.isActive)
      await this.props.subscriptionStore!.subscriptionDeactivation({ id: subscription.id });
      else
      await this.props.subscriptionStore!.subscriptionActivation({ id: subscription.id });
      await this.updateSubscriptionsList(this.state.meta.pageSize,this.state.meta.skipCount);
    }, subscription.isActive ? L('AreYouSureYouWantToDeactivateThisSubscription') : L('AreYouSureYouWantToActivateThisSubscription'));
  }


  subscriptionsTableColumns = [
    {
      title: L('Name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: `${L('Fee')} (${L('SAR')})`,
      dataIndex: 'fee',
      key: 'fee',
      render: (fee: number) => {
        return <ThousandSeparator number={fee} />;
      }
    },
    {
      title: L('ColorCode'),
      dataIndex: 'colorCode',
      key: 'colorCode',
      render: (colorCode: string) => {
        return <div className="colorCode" style={{background:colorCode}}>{colorCode}</div>;
      }
    },
    {
      title: L('SubscriptionDuration'),
      dataIndex: 'duration',
      key: 'duration',
      sorter: (a:any, b:any) => a.duration - b.duration,

      render: (duration: number) => {
        return `${duration} ${L('Days')}`;
      }
    },
    {
      title: L('SubscribersCount'),
      dataIndex: 'subscribersCount',
      sorter: (a:any, b:any) => a.usedSubscriptions?.length - b.usedSubscriptions?.length,

      key: 'subscribersCount',
      render: (subscribersCount: number,item:SubscriptionDto) => {
        return item.usedSubscriptions?.length;
      }
    },
    {
      title: L('Target'),
      dataIndex: 'target',
      key: 'target',
      render: (target: number) => {
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
    },
    
    {
      title: L('CreationTime'),
      dataIndex: 'creationTime',
      key: 'creationTime',
      sorter: (a:any, b:any) => a.creationTime - b.creationTime,

      render: (creationTime: string) => {
        return moment(creationTime).format(timingHelper.defaultDateTimeFormat);
      }
    },
    {
      title: L('Status'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => {
        return <Tag color={isActive ? 'green' : 'volcano'} className='ant-tag-disable-pointer'>{isActive ? L('Active') : L('Inactive')}</Tag>;
      },
      ...this.getColumnStatusSearchProps()
    },
    {
      title: L('Action'),
      key: 'action',
      render: (text: string, item: SubscriptionDto) => (
        <div>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
                 <Menu.Item onClick={() => {window.location.href=`/subscription/${item.id}`}}>
                  <EyeOutlined className="action-icon"  />
                  <button className="inline-action">{L('Details')}</button>
                </Menu.Item>
                <Menu.Item onClick={() => this.openSubscriptionModal({ id: item.id })}>
                  <EditOutlined className="action-icon"  />
                  <button className="inline-action">{L('Edit')}</button>
                </Menu.Item>
                <Menu.Item onClick={() => this.assignToUser(item.id)}>
                 <BranchesOutlined className="action-icon" />
                  <button className="inline-action" >{L('AssignToUser')}</button>
                </Menu.Item>
                <Menu.Item onClick={() => this.onSwitchSubscriptionActivation(item)}>
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

   assignToUser=async(subscriptionId:number)=>{
    await this.props.subscriptionStore!.getSubscription({id:subscriptionId}); 
    this.setState({subscriptionModalId:subscriptionId,assignToUserModalVisible:true})
  }

  paginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.meta.pageSize = pageSize;
      this.setState(temp);
      this.updateSubscriptionsList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateSubscriptionsList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const subscriptions = this.props.subscriptionStore!.subscriptions;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.subscriptionStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={
          <div>
            <span>{L('Subscriptions')}</span>
            <Button type="primary" style={{ float: localization.getFloat(), margin: '0 5px' }} icon={<PlusOutlined/>} onClick={() => this.openSubscriptionModal({ id: 0 })}>
              {L('AddSubscription')}
            </Button>
           
          </div>
        }
      >
           <SearchComponent
           searchText={L("SearchByName")}
        onSearch={(value: string)=>{
          this.setState({keyword:value},()=>{
            this.updateSubscriptionsList(this.state.meta.pageSize,this.state.meta.skipCount);
          });
        }}
        />
           
        <Table
          pagination={pagination}
          rowKey={record => record.id + ""}
          style={{ marginTop: '12px' }}
          loading={this.props.subscriptionStore!.loadingSubscriptions}
          dataSource={subscriptions === undefined ? [] : subscriptions}
          columns={this.subscriptionsTableColumns}
        />

        <CreateOrUpdateSubscription
          visible={this.state.subscriptionModalVisible}
          onCancel={() =>
            this.setState({
              subscriptionModalVisible: false,
            })
          }
          modalType={this.state.subscriptionModalType}
          isSubmittingSubscription={this.props.subscriptionStore!.isSubmittingSubscription}
          subscriptionStore={this.props.subscriptionStore!}
        />

 <AssignSubscriptionToUser
          visible={this.state.assignToUserModalVisible}
          onCancel={() =>
            this.setState({
              assignToUserModalVisible: false,
            })
          }
          isSubmittingSubscription={this.props.subscriptionStore!.isSubmittingSubscription}
          subscriptionStore={this.props.subscriptionStore!}
          subscriptionId={this.state.subscriptionModalId}
        />


      </Card>
    );
  }
}

export default Subscriptions;
