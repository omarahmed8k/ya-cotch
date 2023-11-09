import * as React from 'react';
import { Component } from 'react';
import { FormInstance } from 'antd/lib/form';
import localization from '../../lib/localization';
import { Form, Modal, Button, Input } from 'antd';
import { L } from '../../i18next';
import FormItem from 'antd/lib/form/FormItem';
import { ResetPasswordDto } from '../../services/user/dto/resetPasswordDto';
import userService from '../../services/user/userService';
import { notifySuccess } from '../../lib/notifications';

export interface IResetPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    formRef:React.RefObject<FormInstance>;
    userId:number;
}

const formItemLayout = {
    labelCol: {
      xs: { span: 9 },
      sm: { span: 9 },
      md: { span: 9 },
      lg: { span: 9 },
      xl: { span: 9 },
      xxl: { span: 9 },
    },
    wrapperCol: {
      xs: { span: 15 },
      sm: { span: 15 },
      md: { span: 15 },
      lg: { span: 15 },
      xl: { span: 15 },
      xxl: { span: 15 },
    },
  };

class ResetPasswordModal extends Component<IResetPasswordModalProps, any> {
    
    state={
        isSubmitting:false
    };

    handleSubmit = async () => {
        const form = this.props.formRef.current;
        form!.validateFields().then(async (values: any) => {
          values.userId = this.props.userId;
          let resetPasswordObj:ResetPasswordDto = {
              userId : values.userId,
              adminPassword : values.adminPassword,
              newPassword:values.newPassword
          };
         
        try{
            this.setState({isSubmitting:true});
            console.log(resetPasswordObj);
            await userService.resetPassword(resetPasswordObj);
            form!.resetFields();
            this.props.onClose();
            notifySuccess();
        }catch{
            this.setState({isSubmitting:false});
        }
                  
        });
      }
    
      handleCancel = () => {
        this.props.onClose();
      }

    render() {
        const { isOpen,onClose } = this.props;
        return (
            <Modal
            visible={isOpen}
            title={L('ResetPassword')}
            onCancel={onClose}
            centered
            destroyOnClose
            className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
            footer={[
              <Button key="back" onClick={this.handleCancel}>
                {L('Cancel')}
              </Button>,
              <Button key="submit" type="primary" loading={this.state.isSubmitting} onClick={this.handleSubmit}>
                {L('Reset')}
              </Button>,
            ]}
            >
                <Form ref={this.props.formRef}>
                    <FormItem label={L('YourPassword')} name="adminPassword" {...formItemLayout}
                    rules={ [{ required: true, message: L('ThisFieldIsRequired') }] }
                    >
                        <Input.Password visibilityToggle /> 
                    </FormItem>
                    <FormItem label={L('NewPassword')} name="newPassword" {...formItemLayout}
                    rules={ [{ required: true, message: L('ThisFieldIsRequired') }] }
                    >
                        <Input.Password visibilityToggle /> 
                    </FormItem>
                    <FormItem label={L('ConfirmNewPassword')} name="confirmNewPassword"
                    dependencies={['newPassword']}
                    {...formItemLayout}
                    rules={ [{ required: true, message: L('ThisFieldIsRequired') },({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error(L('TheTwoPasswordsThatYouEnteredDoNotMatch')));
                        },
                      }),] }
                    >
                        <Input.Password visibilityToggle /> 
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default ResetPasswordModal;