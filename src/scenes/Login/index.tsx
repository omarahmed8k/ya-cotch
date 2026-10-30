import './index.less';
import * as React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { inject, observer } from 'mobx-react';
import AccountStore from '../../stores/accountStore';
import AuthenticationStore from '../../stores/authenticationStore';
import { FormInstance } from 'antd/lib/form';
import { Redirect } from 'react-router-dom';
import SessionStore from '../../stores/sessionStore';
import Stores from '../../stores/storeIdentifier';
import rules from './index.validation';
import { L } from '../../i18next';
import Logo from '../../images/logo.png';
import LogoMark from '../../images/logo-mark.png';
import Footer from '../../components/Footer';

const FormItem = Form.Item;

export interface ILoginProps {
  authenticationStore?: AuthenticationStore;
  sessionStore?: SessionStore;
  accountStore?: AccountStore;
  history: any;
  location: any;
}

@inject(Stores.AuthenticationStore, Stores.SessionStore, Stores.AccountStore)
@observer
class Login extends React.Component<ILoginProps> {
  formRef = React.createRef<FormInstance>();
  // changeTenant = async () => {
  //   let tenancyName = this.formRef.current?.getFieldValue('tenancyName');
  //   const { loginModel } = this.props.authenticationStore!;

  //   if (!tenancyName) {
  //     abp.multiTenancy.setTenantIdCookie(undefined);
  //     window.location.href = '/';
  //     return;
  //   } else {
  //     await this.props.accountStore!.isTenantAvailable(tenancyName);
  //     const { tenant } = this.props.accountStore!;
  //     switch (tenant.state) {
  //       case TenantAvailabilityState.Available:
  //         abp.multiTenancy.setTenantIdCookie(tenant.tenantId);
  //         loginModel.tenancyName = tenancyName;
  //         loginModel.toggleShowModal();
  //         window.location.href = '/';
  //         return;
  //       case TenantAvailabilityState.InActive:
  //         Modal.error({ title: L('Error'), content: L('TenantIsNotActive') });
  //         break;
  //       case TenantAvailabilityState.NotFound:
  //         Modal.error({ title: L('Error'), content: L('ThereIsNoTenantDefinedWithName{0}', tenancyName) });
  //         break;
  //     }
  //   }
  // };

  handleSubmit = async (values: any) => {
    const { loginModel } = this.props.authenticationStore!;
    await this.props.authenticationStore!.login(values);
    sessionStorage.setItem('rememberMe', loginModel.rememberMe ? '1' : '0');
    const { state } = this.props.location;
    window.location = state ? state.from.pathname : '/';
  };

  public render() {
    let { from } = this.props.location.state || { from: { pathname: '/' } };
    if (this.props.authenticationStore!.isAuthenticated) return <Redirect to={from} />;

    const { loginModel } = this.props.authenticationStore!;
    return (
      <Form className="login-form" onFinish={this.handleSubmit} ref={this.formRef}>
          {/* <Row style={{ marginTop: 100 }}>
            <Col span={8} offset={8}>
              <Card>
                <Row>
                  {!!this.props.sessionStore!.currentLogin.tenant ? (
                    <Col span={24} offset={0} style={{ textAlign: 'center' }}>
                      <Button type="link" onClick={loginModel.toggleShowModal}>
                        {L('CurrentTenant')} : {this.props.sessionStore!.currentLogin.tenant.tenancyName}
                      </Button>
                    </Col>
                  ) : (
                    <Col span={24} offset={0} style={{ textAlign: 'center' }}>
                      <Button type="link" onClick={loginModel.toggleShowModal}>
                        {L('NotSelected')}
                      </Button>
                    </Col>
                  )}
                </Row>
              </Card>
            </Col>
          </Row> */}

          {/* <Row>
            <Modal
              visible={loginModel.showModal}
              onCancel={loginModel.toggleShowModal}
              onOk={this.changeTenant}
              title={L('ChangeTenant')}
              okText={L('OK')}
              cancelText={L('Cancel')}
            >
              <Row>
                <Col span={8} offset={8}>
                  <h3>{L('TenancyName')}</h3>
                </Col>
                <Col>
                  <FormItem name={'tenancyName'}>
                    <Input placeholder={L('TenancyName')} prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} size="large" />
                  </FormItem>
                  {!this.formRef.current?.getFieldValue('tenancyName') ? <div>{L('LeaveEmptyToSwitchToHost')}</div> : ''}
                </Col>
              </Row>
            </Modal>
          </Row>
          */}
        <div className="login-page">
          <aside className="login-brand">
            <div className="login-brand-inner">
              <img className="login-brand-mark" src={LogoMark} alt="YaCotch" />
              <h1 className="login-brand-title">YaCotch</h1>
              <p className="login-brand-tagline">{L('BrandTagline')}</p>
            </div>
            <Footer />
          </aside>

          <main className="login-panel">
            <div className="login-card">
              <img className="login-logo" src={Logo} alt="YaCotch" />
              <h2 className="login-title">{L('WelcomeMessage')}</h2>
              <p className="login-subtitle">{L('LoginSubtitle')}</p>

              <FormItem name={'userNameOrEmailAddress'} rules={rules.userNameOrEmailAddress}>
                <Input size="large" placeholder={L('UserNameOrEmail')} prefix={<UserOutlined className="login-input-icon" />} />
              </FormItem>

              <FormItem name={'password'} rules={rules.password}>
                <Input.Password size="large" visibilityToggle placeholder={L('Password')} prefix={<LockOutlined className="login-input-icon" />} type="password" />
              </FormItem>

              <div className="login-footer">
                <Checkbox checked={loginModel.rememberMe} onChange={loginModel.toggleRememberMe}>
                  {L('RememberMe')}
                </Checkbox>
                {/* <a>{L('ForgotPassword')}</a> */}
              </div>

              <Button block size="large" type="primary" htmlType={'submit'} loading={this.props.authenticationStore!.isLoggingIn}>
                {L('LogIn')}
              </Button>
            </div>
          </main>
        </div>
      </Form>
    );
  }
}

export default Login;
