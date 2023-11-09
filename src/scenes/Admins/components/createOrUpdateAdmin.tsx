import React from 'react';
import { Form, Modal, Button, Input, Tabs,Checkbox } from 'antd';
import { inject, observer } from 'mobx-react';
import FormItem from 'antd/lib/form/FormItem';
import { FormInstance } from 'antd/lib/form';
import { DeploymentUnitOutlined, InfoCircleOutlined } from '@ant-design/icons';
import Stores from '../../../stores/storeIdentifier';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import AdminStore from '../../../stores/adminStore';
import RoleStore from '../../../stores/roleStore';
import { GetAllPermissionsOutput } from '../../../services/role/dto/getAllPermissionsOutput';

const { TabPane } = Tabs;

export interface ICreateOrUpdateAdminProps{
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  adminStore?: AdminStore;
  roleStore?: RoleStore;
  onOk: () => void;
  isSubmittingAdmin: boolean;
  formRef:React.RefObject<FormInstance>;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
    md: { span: 6 },
    lg: { span: 6 },
    xl: { span: 6 },
    xxl: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 18 },
    md: { span: 18 },
    lg: { span: 18 },
    xl: { span: 18 },
    xxl: { span: 18 },
  },
};

@inject(Stores.AdminStore, Stores.RoleStore)
@observer
class CreateOrUpdateAdmin extends React.Component<ICreateOrUpdateAdminProps, any> {
  async componentDidMount() {
    await this.props.roleStore!.getAllPermissions();
  }

  componentDidUpdate(){
    const {adminModel} = this.props.adminStore!;
    if(adminModel !== undefined && this.state.email.value !== adminModel.emailAddress){
        this.onEmailChange({target:{value:adminModel.emailAddress}});
    }
  }

  handleSubmit = async () => {
    await this.props.onOk();
  }

  handleCancel = () => {
    this.props.onCancel();
  }

  state={
    email:{ value: "",validateStatus:undefined,errorMsg:null},
  }

  validateEmail =(value:string) =>{
    const reqex =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (value !== "" && !reqex.test(value) ) {
      return {
        validateStatus: 'error',
        errorMsg: L('ThisEmailIsInvalid'),
      };
    }
    if (value !== "" ) {
      return {
        validateStatus: 'success',
        errorMsg: null,
      };
    }
   
    return {
      validateStatus: 'error',
      errorMsg: L('ThisFieldIsRequired'),
    };
  }

  onEmailChange = (e: any) => {
    console.log("ali",e.target.value);
    const {value} = e.target;
    this.setState({email:{ ...this.validateEmail(value),
      value,}});
  };

  render() {
   
    const { visible, onCancel, modalType } = this.props;
    const { adminModel } = this.props.adminStore!;
    const { allPermissions } = this.props.roleStore!;

    const options = allPermissions.map((x: GetAllPermissionsOutput) => {
      return { label: L(x.name), value: x.name };
    });
    return (
      <Modal
        visible={visible}
        title={modalType === 'create' ? L('CreateAdmin') : L('EditAdmin')}
        onCancel={onCancel}
        centered
        destroyOnClose
        className={localization.isRTL() ? 'rtl-modal admin-modal' : 'ltr-modal admin-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button key="submit" type="primary" loading={this.props.isSubmittingAdmin} onClick={this.handleSubmit}>
            {modalType === 'create' ? L('Create') : L('Save')}
          </Button>,
        ]}
      >
        <Form ref={this.props.formRef}>
          <Tabs defaultActiveKey="1">
            <TabPane
              tab={(
                <span>
                  <InfoCircleOutlined />
                  {L('General')}
                </span>
            )}
              key="1"
            >
              <>
                <FormItem
                  label={L('FirstName')}
                  name="name"
                  {...formItemLayout}
                  rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                  initialValue={adminModel !== undefined ? adminModel.name : undefined}
                >
                  <Input /> 
                </FormItem>
                <FormItem
                  label={L('Surname')}
                  name="surname"
                  {...formItemLayout}
                  rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                  initialValue={adminModel !== undefined ? adminModel.surname : undefined}
                >
                  <Input />
                
                </FormItem>
                <FormItem
                  label={L('Email')}
                  name="emailAddress"
                  {...formItemLayout}
                  initialValue={adminModel !== undefined ? adminModel.emailAddress : undefined}
                  validateStatus={this.state.email.validateStatus}
                  rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                  help={this.state.email.errorMsg}
                >
                  <Input type="text" onLoad={this.onEmailChange} onChange={this.onEmailChange} />
                </FormItem>

                {modalType === 'create' ? (
                  <Form.Item
                    name="password"
                    label={L('Password')}
                    {...formItemLayout}
                    rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                  >
                    <Input.Password visibilityToggle />
                  </Form.Item>
              ) : null}
              

              
              </>
            </TabPane>
            <TabPane
              tab={(
                <span>
                  <DeploymentUnitOutlined />
                  {L('Permissions')}
                </span>
            )}
              key="2"
            >
              <FormItem
                name="permissionNames"
                {...formItemLayout}
                initialValue={adminModel !== undefined ? adminModel.permissionNames : []}
              >
                <Checkbox.Group className="permission-options" options={options} />
              </FormItem>
            </TabPane>
          </Tabs>
        </Form>
      </Modal>
    );
  }
}

export default CreateOrUpdateAdmin;
