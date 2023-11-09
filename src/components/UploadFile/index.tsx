import * as React from 'react';
import { Component } from 'react';
import {  Upload, message,Button } from 'antd';
import { L } from '../../i18next';
import AppConsts from '../../lib/appconst';
import {  UploadOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/lib/upload/interface';

export interface IUploadFileProps {
    onSuccess?: (fileName: string) => void;
    defaultFileList?:Array<any>;
}
export interface IUploadFileState {
    isUploading: boolean;
    isUploaded:boolean;
}

class CustomUploadFile extends Component<IUploadFileProps, IUploadFileState> {

    state = {
        isUploading: false,
        isUploaded:false
    };

    componentDidMount(){
        if(this.props.defaultFileList && this.props.defaultFileList!.length>0 ){
            this.setState({isUploaded:true});
        }
    }

    isValidFileType(file: any) {
        return file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/pdf';
    }

    isValidFileSize(file: any) {
        return file.size / 1024 / 1024 < 5;    // < 5MB
    }

    validateFile = (file: any) => {
        const isValidFileType = this.isValidFileType(file);
        if (!isValidFileType) {
            message.error(L('FileTypeNotSupported'));
        }

        const isLt5M = this.isValidFileSize(file);
        if (!isLt5M) {
            message.error(L('FileSizeExceedsTheLimit'));
        }
        this.setState({isUploading:true});
        return isValidFileType && isLt5M;
    }

    handleBeforeUpload = (file: any) => {
        return this.validateFile(file);
    }

    uploadProps = {
        action: AppConsts.uploadImageEndpoint,
        headers: {
            authorization: 'bearer ' + localStorage.getItem('Abp.AuthToken'),
        },
        // data:{isFile:true},
        accept: '.pdf, .doc, .docx',
        beforeUpload: this.handleBeforeUpload,
    };

    fileList: Array<UploadFile> = [];

    
    handleFileListChanges() {
        let fileList = this.fileList;
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

    onFileChange = (info: any) => {
        this.fileList = [...info.fileList];

        if (info.file.status === 'uploading') {
            this.setState({ isUploading: true });
            return;
        }
        this.handleFileListChanges();

        if (info.file.status === 'removed') {
            this.setState({ isUploaded:false ,isUploading:false});
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
                        listType={"text"}
                        defaultFileList={[...this.props.defaultFileList]}
                        onChange={this.onFileChange}>
                        
                        {this.state.isUploaded || this.state.isUploading ? null :<Button icon={<UploadOutlined/>}>{L("ClickToUpload")}</Button>}
                    </Upload>
                    :
                    <Upload  {...this.uploadProps}
                    listType={"text"}
                    defaultFileList={[]}
                    onChange={this.onFileChange}>
                    
                    {this.state.isUploaded || this.state.isUploading ? null :<Button icon={<UploadOutlined/>}>{L("ClickToUpload")}</Button>}
                </Upload>
                    }
                   
                </div>
          </div>
        );
    }
}

export default CustomUploadFile;