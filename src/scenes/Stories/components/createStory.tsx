import React from 'react';
import { Form, Modal, Button, Input } from 'antd';
import { L } from '../../../i18next';
import CreateStoryDto from '../../../services/story/dto/createStoryDto'
import CustomUploadFile from '../../../components/UploadImageOrVideo';
import localization from '../../../lib/localization';

interface CreateOrUpdateStoryProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values:CreateStoryDto) => void;
  isSubmittingStory: boolean;
}

const CreateOrUpdateStory: React.FC<CreateOrUpdateStoryProps> = ({
  visible,
  onCancel,
  onOk,
  isSubmittingStory,
}) => {
  const [form] = Form.useForm();
  const handleSubmit = () => {
     form.validateFields().then(async(values)=>{
      const {description,images} = values
      const extension = images&&images.split(".")[images.split(".").length - 1]
      const reqBody:CreateStoryDto = {
      description,
      images:[
        {
          url:images,
          isVideo:extension==='mp4'||extension==='wmv'
        }
      ]
      }
       await onOk(reqBody)
      form.resetFields()
     })
  };

  const onFileChange = (fileLink?: string): void => {    
    form.setFieldsValue({images:fileLink})      
  };
  return (
    <Modal
      visible={visible}
      title={L('CreateStory')}
      onCancel={onCancel}
      centered
      destroyOnClose
      maskClosable={false}
      className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
      footer={[
        <Button key="back" onClick={onCancel}>
          {L('Cancel')}
        </Button>,
        <Button key="submit" type="primary" loading={isSubmittingStory} onClick={handleSubmit}>
          {L('Create')}
        </Button>,
      ]}
    >
      <Form name="basic" layout="vertical" onFinish={handleSubmit} autoComplete="off" form={form}>
        <Form.Item
          label={L('StoryContentImageOrVideo')}
          name="images"
          rules={[{ required: true, message: L('PleaseFillThisField') }]}
        >
          <CustomUploadFile onRemove={onFileChange} onSuccess={onFileChange} defaultFileList={[]} />
        </Form.Item>

        <Form.Item
          label={L('Description')}
          name="description"
          rules={[
            { required: true, message: L('PleaseFillThisField') },
            { max: 300, message: L('StoryDescriptionShouldNotExceed300Charchters') },
          ]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default CreateOrUpdateStory;
