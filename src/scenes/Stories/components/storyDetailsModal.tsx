import React,{useState} from 'react';
import { Modal,Image,Tooltip } from 'antd'; 
import moment from 'moment'
import { PlayCircleOutlined } from '@ant-design/icons';
import VideoPreviewModal from './VideoPreviewModal'
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import { StoryDto } from '../../../services/story/dto/storyDto';
import timingHelper from '../../../lib/timingHelper';
import './storyDetailsModal.css'

interface StoryDetailsProps {
  visible: boolean;
  onCancel: () => void;
  details?: StoryDto;
}

const StoryDetails: React.FC<StoryDetailsProps> = ({
  visible,
  onCancel,
  details
}) => {
  const [videoModalVisible,setVideoModalVisible] = useState(false)
  const [videoUrl,setVideoUrl]= useState<string>()

  const openVideoModal = (linkUrl:string)=>{
    setVideoModalVisible(true)
    setVideoUrl(linkUrl)
  }
  const {id,creationTime,user,storyImages=[],description} = details||{}
  const { isVideo, fileUrl } = storyImages![0]||{};
  return (
    <Modal
      visible={visible}
      title={L('StoryDetails')}
      onCancel={onCancel}
      centered
      destroyOnClose
      maskClosable={false}
      className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
      footer={false}
    >
      <div className="details-wrapper">
        <div className="detail-wrapper">
          <span className="detail-label">{L('ID')}:</span>
          <span className="detail-value">{id || L('NotAvailable')}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('CreationDate')}:</span>
          <span className="detail-value">{ moment(creationTime).format(timingHelper.defaultDateTimeFormat)}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('CreatedBy')}:</span>
          <span className="detail-value">{user&&user.text || L('NotAvailable')}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('StoryImageOrVideo')}:</span>
          <span className="detail-value">
            {isVideo && (
            <div className='video-preview video-preview--details'>
              <Tooltip placement="top" title={L('ClickToPreviewStoryVideo')}>
                <PlayCircleOutlined onClick={() => openVideoModal(fileUrl)} />
              </Tooltip>
            </div>
            )}
            {!isVideo && (
            <div className='image-preview image-preview--details'>
              {fileUrl?<Image className='story-image' width={50} height={50} src={fileUrl} />:L('NotAvailable')} 
            </div>
            )}
          </span>
        </div>
        <div>
          <span className="detail-label">{L('Description')}:</span>
          <span className="detail-value">{description || L('NotAvailable')}</span>
        </div>
      </div>
      <VideoPreviewModal handleCancel={()=>setVideoModalVisible(false)} videoUrl={videoUrl} visible={videoModalVisible} />
    </Modal>
  );
};
export default StoryDetails;
