import React from 'react'
import {Modal} from 'antd'
import {L} from '../../../i18next'
import localization from '../../../lib/localization';

interface VideoPreviewProps  {
    videoUrl?:string;
    visible:boolean;
    handleCancel:()=>void
}
const VideoPreviewModal = (props:VideoPreviewProps):JSX.Element => {
  const {videoUrl,visible,handleCancel} = props
  return (
    <Modal
      visible={visible}
      title={L('StoryVideo')}
      onCancel={handleCancel}
      centered
      destroyOnClose
      maskClosable={false}
      width="60%"
      className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
      footer={false}
    >
      {videoUrl&&(
      <video autoPlay width="100%" height="380" controls>
        <source src={videoUrl} />
        Your browser does not support the video tag.
      </video>
      )}
    </Modal>

)}

export default VideoPreviewModal