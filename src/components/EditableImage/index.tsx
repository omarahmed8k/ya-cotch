import * as React from 'react';
import { Component } from 'react';
import {  Upload, message } from 'antd';
import './index.less';
import { L } from '../../i18next';
import AppConsts from '../../lib/appconst';
import { PlusOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/lib/upload/interface';

export interface IEditableImageProps {
    onSuccess?: (fileName: string) => void;
    defaultFileList?:Array<any>;
}
export interface IEditableImageState {
    isUploading: boolean;
    isUploaded:boolean;
}

class EditableImage extends Component<IEditableImageProps, IEditableImageState> {

    state = {
        isUploading: false,
        isUploaded:false
    };

    componentDidMount(){
        if(this.props.defaultFileList && this.props.defaultFileList!.length>0 ){
            this.setState({isUploaded:true});
        }
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

        const isLt5M = this.isValidImageSize(file);
        if (!isLt5M) {
            message.error(L('FileSizeExceedsTheLimit'));
        }

        return isValidImageType && isLt5M;
    }

    handleBeforeUpload = (file: any) => {
        return this.validateImage(file);
    }

    uploadProps = {
        action: AppConsts.uploadImageEndpoint,
        headers: {
            authorization: 'bearer ' + localStorage.getItem('Abp.AuthToken'),
        },
        accept: '.png, .jpg, .jpeg',
        beforeUpload: this.handleBeforeUpload,
    };

    fileList: Array<UploadFile> = [];

    
    handleFileListChanges() {
        let fileList = this.fileList;
        // Read from response and show file link
        this.fileList = fileList.map(file => {
          
            if (file.response) {
                // Component will show file.url as link
                console.log(file.response);
                file.url = file.response.result.url;
            }
            return file;
        });
        this.forceUpdate();
    }

    onEditableImageChange = (info: any) => {
        this.fileList = [...info.fileList];

        if (info.file.status === 'uploading') {
            this.setState({ isUploading: true });
            return;
        }
        this.handleFileListChanges();

        if (info.file.status === 'removed') {
            this.setState({ isUploaded:false });
        }
        if (info.file.status === 'done') {
            this.setState({ isUploading: false,isUploaded:true });
            message.success(`${info.file.name} ${L('FileUploadedSuccessfully')}`);
            if (this.props.onSuccess != null) this.props.onSuccess!(info.file.response.result.url);
        } else if (info.file.status === 'error') {
            this.setState({ isUploading: false });
            message.error(`${info.file.name} ${L('FileUploadFailed')}`);
        }
    }

    render() {
        return (
            <div>
                <div>
                    {
                        this.props.defaultFileList && this.props.defaultFileList!.length>0 ?
                        <Upload  {...this.uploadProps}
                        listType={"picture-card"}
                        defaultFileList={[...this.props.defaultFileList]}
                        onChange={this.onEditableImageChange}>
                        
                        {this.state.isUploaded || this.state.isUploading ? null :<PlusOutlined/>}
                    </Upload>
                    :
                    <Upload  {...this.uploadProps}
                    listType={"picture-card"}
                    defaultFileList={[]}
                    onChange={this.onEditableImageChange}>
                    
                    {this.state.isUploaded || this.state.isUploading ? null :<PlusOutlined/>}
                </Upload>
                    }
                   
                </div>
          </div>
        );
    }
}

export default EditableImage;