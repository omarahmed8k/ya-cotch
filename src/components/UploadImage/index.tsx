import * as React from 'react';
import { Upload, message } from 'antd';
import { UploadFile, UploadProps } from 'antd/lib/upload/interface';
import { L } from '../../i18next';
import AppConsts from '../../lib/appconst';

export interface IUploadImageProps extends UploadProps {
    onUploadComplete: (result: string) => void;
    defaultFileList:Array<any>;
    onRemoveImage: (result: string) => void;  
    currentCount:number;  
}

export interface IUploadImageState {
    multiple: boolean;
}


class UploadImage extends React.Component<IUploadImageProps, IUploadImageState> {
    state = {
        multiple: true
    };

    count :number = this.props.currentCount;

    fileList: Array<UploadFile> = [];

    shouldComponentUpdate(nextProps: Readonly<IUploadImageProps>): boolean {
        if (nextProps.fileList != null && nextProps.fileList.length > 0)
            {this.fileList = nextProps.fileList;}
        else
            {this.fileList = [];}
        return true;
    }


    isValidImageType(file: any) {
        return file.type === 'image/jpeg' || file.type === 'image/png';
    }

    isValidImageSize(file: any) {
        return file.size / 1024 / 1024 < 5;    // < 5MB
    }

    validateImage = (file: any) => {
        const isValidImageType = this.isValidImageType(file);
        if (!isValidImageType) {
            message.error(L('FileTypeNotSupported'));
        }

        const isLt2M = this.isValidImageSize(file);
        if (!isLt2M) {
            message.error(L('FileSizeExceedsTheLimit'));
        }

        return isValidImageType && isLt2M;
    }

    handleBeforeUpload = (file: any) => {
        return this.validateImage(file);
    }

    handleFileListChanges() {
        const {fileList} = this;
        // Read from response and show file link
        this.fileList = fileList.map(file => {
          
            if (file.response) {
                // Component will show file.url as link
                file.url = file.response.result.url;
            }
            return file;
        });
        this.forceUpdate();
    }

    handleRemove=(info:any)=> {
        if(info.url !== undefined)
        {this.props.onRemoveImage(info.url);}
        else
        {this.props.onRemoveImage(info.response.result.url);}
        this.count--;
        this.forceUpdate();
    }

    handleChange = (info: any) => {
        
        this.fileList = [...info.fileList];

        
        if(info.file.status !== 'removed'){
            const isValidImage = this.validateImage(info.file);
        if (!isValidImage) {
            // empty files list if file is not valid
            this.fileList = new Array<UploadFile>();
            return;
        }
        this.handleFileListChanges();

        }
        if (info.file.status === 'done') {
            this.props.onUploadComplete(info.file.response.result.url);
            message.success(`${info.file.name} ${L('FileUploadedSuccessfully')}`);
            this.count++;
         
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} ${L('FileUploadFailed')}`);
        }

        this.forceUpdate();
    }


    uploadProps = {
        action: AppConsts.uploadImageEndpoint,
        headers: {
            authorization: `bearer ${  localStorage.getItem('Abp.AuthToken')}`,
        },
        beforeUpload: this.handleBeforeUpload,
        onChange: this.handleChange,
    };

    render() {
        return (
          <Upload
            {...this.uploadProps}
            listType="picture-card"
            accept=".png, .jpg, .jpeg"
            defaultFileList={[...this.props.defaultFileList]}
            onRemove={this.handleRemove}
          >
            {this.count>=15 ? null : this.props.children}
          </Upload>
        );
    }
}

export default UploadImage;