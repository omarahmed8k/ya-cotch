import { Component } from 'react';
import * as React from 'react';
import './index.less';
import { CloseCircleOutlined } from '@ant-design/icons';

export interface IImageModalProps {
    isOpen: boolean;
    src?: string;
    caption?: string;
    onClose: () => void;
}

export interface IImageModalState {
}


class ImageModal extends Component<IImageModalProps, IImageModalState> {
    close(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        this.props.onClose();
    }

    render() {
        return (
            <div className='image-modal' style={{display: this.props.isOpen ? 'block' : 'none'}}>
                <div className='close-icon' onClick={(event) => this.close(event)}>
                    <CloseCircleOutlined/>
                </div>
                <div className='overlay-div' onClick={(event) => this.close(event)}>
                </div>
                <div className='image-container'>
                    <img src={this.props.src} alt="" />
                </div>
            </div>
        );
    }
}

export default ImageModal;