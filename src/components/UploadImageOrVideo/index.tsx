import React, { useState, useEffect } from 'react';
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/lib/upload/interface';
import { L } from '../../i18next';
import AppConstants from '../../lib/appconst';

export interface UploadFileProps {
  onSuccess?: (fileName: string) => void;
  onRemove?: () => void;
  defaultFileList?: Array<any>;
}
const CustomUploadFile: React.FC<UploadFileProps> = ({ onSuccess,onRemove, defaultFileList }) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);

  useEffect(() => {
    if (defaultFileList && defaultFileList!.length > 0) {
      setIsUploaded(true);
    }
  }, []);

  let fileList: Array<UploadFile> = [];
  const checkFileType = (file: any): boolean => {      
    return (
      file.type === 'video/mp4' ||
      file.type === 'image/png' ||
      file.type === 'image/jpg' ||
      file.type === 'image/png'||
      file.type === 'image/jpeg'
    );
  };

  const isValidFileSize = (file: any) => {
      const fileType = file.type && file.type.split('/')[0]
     return fileType === 'video'? (file.size / 1024 / 1024 < 4) :(file.size / 1024 / 1024 < 2)
  };

  const validateFile = (file: any) => {
    const fileType = file.type && file.type.split('/')[0]
    const isValidFileType: boolean = checkFileType(file);
    if (!isValidFileType) {
      message.error(L('FileTypeNotSupported'));
    }
    const checkSize = isValidFileSize(file);
    if (!checkSize && fileType ==='video')  message.error(L('videoSizeShouldBeLessThan4MB'));
    if (!checkSize && fileType ==='image')  message.error(L('ImageSizeShouldBeLessThan2MB'));
    return isValidFileType && checkSize || Upload.LIST_IGNORE;
  };

  const handleBeforeUpload = (file: any): any => validateFile(file);

  const uploadProps = {
    action: AppConstants.uploadImageEndpoint,
    headers: {
      authorization: `bearer ${localStorage.getItem('Abp.AuthToken')}`,
    },
    // data:{isFile:true},
    accept: '.png, .jpeg, .jpg, .MP4',
    beforeUpload: handleBeforeUpload,
  };

  const handleFileListChanges = () => {
    // Read from response and show file link
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.result.url;
      }
      return file;
    });
    // this.forceUpdate();
  };
  const onFileChange = (info: any) => {
    fileList = [...info.fileList];

    if (info.file.status === 'uploading') {
      setIsUploading(true);
      return;
    }
    handleFileListChanges();

    if (info.file.status === 'removed') {
      setIsUploading(false);
      setIsUploaded(false);
      onRemove && onRemove()
    }
    if (info.file.status === 'done') {
      setIsUploading(false);
      setIsUploaded(true);
      message.success(`${info.file.name} ${L('FileUploadedSuccessfully')}`);
      onSuccess && onSuccess(info.file.response.result.url);
    } else if (info.file.status === 'error') {
      setIsUploading(false);
      message.error(`${info.file.name} ${L('FileUploadFailed')}`);
    }
  };

  return (
    <Upload {...uploadProps} listType="text" defaultFileList={[]} onChange={onFileChange}>
      {isUploaded || isUploading ? null : (
        <Button icon={<UploadOutlined />}>{L('ClickToUpload')}</Button>
      )}
    </Upload>
  );
};

export default CustomUploadFile;
