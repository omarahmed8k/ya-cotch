import * as React from 'react';
import { Card, Table, Image, Button,Tooltip,Dropdown,Menu } from 'antd';
import { inject, observer } from 'mobx-react';
import { PlayCircleOutlined, PlusOutlined ,EyeOutlined,CaretDownOutlined} from '@ant-design/icons';
import moment from 'moment';
import { FormInstance } from 'antd/lib/form';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import timingHelper from '../../lib/timingHelper';
import SearchComponent from '../../components/SearchComponent';
import ParagWithSeeMore from '../../components/ParagWithSeeMore';
import StoryStore from '../../stores/storyStore';
import { StoryDto } from '../../services/story/dto/storyDto';
import { StoryImageItemDto } from '../../services/story/dto/storyImageDto';
import VideoPreviewModal from './components/VideoPreviewModal';
import CreateStory from './components/createStory';
import { LiteEntityDto } from '../../services/dto/liteEntityDto';
import CreateStoryDto from '../../services/story/dto/createStoryDto'
import StoryDetailsModal from './components/storyDetailsModal'
import './index.css';

export interface StoriesProps {
  storyStore: StoryStore;
}

export interface StoriesState {
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  isActiveFilter?: boolean;
  keyword?: string;
  createStoryModalVisible: boolean;
  storyData?: StoryDto;
  videoUrl?: string;
  videoModalVisible: boolean;
  detailsModalVisible:boolean
}

const INDEX_PAGE_SIZE_DEFAULT = 8;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];
declare let abp: any;

@inject(Stores.StoryStore)
@observer
export class Stories extends AppComponentBase<StoriesProps, StoriesState> {
  formRef = React.createRef<FormInstance>();

  state = {
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
    isActiveFilter: undefined,
    keyword: undefined,
    createStoryModalVisible: false,
    storyData: undefined,
    videoUrl: undefined,
    videoModalVisible: false,
    detailsModalVisible:false,
  };

  async componentDidMount() {
    this.updateStoriesList(this.state.meta.pageSize, 0);
  }

  openCreateStoryModal() {
    this.setState({ createStoryModalVisible: true });
  }

  async updateStoriesList(maxResultCount: number, skipCount: number) {
    this.props.storyStore!.maxResultCount = maxResultCount;
    this.props.storyStore!.skipCount = skipCount;
    this.props.storyStore!.isActiveFilter = this.state.isActiveFilter;
    this.props.storyStore!.keyword = this.state.keyword;

    await this.props.storyStore!.getStories();
  }

  handleCancelVideoModal = (): void => {
    this.setState({ videoModalVisible: false });
  };

  openVideoModal = (videoUrl: string): void => {
    this.setState({ videoModalVisible: true, videoUrl });
  };

  openAddStoryModal = (): void => {
    this.setState({ createStoryModalVisible: true });
  };

  openStoryDetailsModal = (details:StoryDto): void => {
    this.setState({ detailsModalVisible: true,storyData: details});
  };


  onCreateStoryModalCancel = (): void => {
    this.setState({ createStoryModalVisible: false });
  };

    onCreateStoryOk = async(values:CreateStoryDto) => {
       await this.props.storyStore!.createStory(values);
       this.setState({ createStoryModalVisible: false });
  };

  shopManagersTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('CreationDate'),
      dataIndex: 'creationTime',
      key: 'creationTime',
      render: (creationTime: Date): string =>
        moment(creationTime).format(timingHelper.defaultDateTimeFormat),
    },
    {
      title: L('CreatedBy'),
      dataIndex: 'user',
      key: 'CreatedBy',
      render: (user: LiteEntityDto): string => user.text,
    },
    {
      title: L('StoryImageOrVideo'),
      dataIndex: 'storyImages',
      key: 'storyImages',
      render: (storyImages: StoryImageItemDto[]): any => {
        if (storyImages[0]) {
          const { isVideo, fileUrl } = storyImages[0];
          if (isVideo) {
            return(
              <div className='video-preview'>
                <Tooltip placement="top" title={L('ClickToPreviewStoryVideo')}>
                  <PlayCircleOutlined onClick={() => this.openVideoModal(fileUrl)} />
                </Tooltip>
              </div>
            ) 
          }
          return(
            <div className='image-preview'>
              <Image className='story-image' width={50} height={50} src={fileUrl} />
            </div>
          ) 
        }
      },
    },
    {
      title: L('Description'),
      dataIndex: 'description',
      key: 'description',
      width:'45%',
      render: (description: string): JSX.Element => (
        <ParagWithSeeMore textLength={50} text={description} />
      ),
    },

    {
      title: L('Action'),
      key: 'action',
      width: '10%',
      render: (text: string, item: StoryDto) => (
        <div>
          <Dropdown
            trigger={['click']}
            overlay={(
              <Menu>
                <Menu.Item onClick={() => this.openStoryDetailsModal(item)}>
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
    onShowSizeChange: async (_: any, pageSize: any) => {
      const temp = this.state;
      temp.meta.pageSize = pageSize;
      this.setState(temp);
      this.updateStoriesList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateStoriesList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const { stories, isSubmittingStory } = this.props.storyStore!;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.storyStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    const { videoUrl, videoModalVisible,storyData, createStoryModalVisible,detailsModalVisible } = this.state;
    return (
      <Card
        title={(
          <div className="title">
            <span>{L('Stories')}</span>
            <Button type="primary" icon={<PlusOutlined />} onClick={this.openAddStoryModal}>
              {L('AddStory')}
            </Button>
          </div>
        )}
      >
        <SearchComponent
          searchText={L('SearchByDescription')}
          onSearch={(value: string)=>{
          this.setState({keyword:value},()=>{
            this.updateStoriesList(this.state.meta.pageSize,this.state.meta.skipCount);
          });
        }}
        />
        <Table
          pagination={pagination}
          rowKey={(record) => `${record.id}`}
          style={{ marginTop: '12px' }}
          loading={this.props.storyStore!.loadingStories}
          dataSource={stories || []}
          columns={this.shopManagersTableColumns}
        />
        <VideoPreviewModal
          handleCancel={this.handleCancelVideoModal}
          videoUrl={videoUrl}
          visible={videoModalVisible}
        />
        <CreateStory
          onOk={this.onCreateStoryOk}
          onCancel={this.onCreateStoryModalCancel}
          isSubmittingStory={isSubmittingStory}
          visible={createStoryModalVisible}
        />
        <StoryDetailsModal
          details={storyData} 
          visible={detailsModalVisible} 
          onCancel={()=>this.setState({ detailsModalVisible: false })}
        />
      </Card>
    );
  }
}

export default Stories;
