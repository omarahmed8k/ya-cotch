import * as React from 'react';
import './AppLayout.less';
import { Redirect, Switch } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { Layout } from 'antd';
import ProtectedRoute from '../../components/Router/ProtectedRoute';
import SiderMenu from '../../components/SiderMenu';
import { appRouters } from '../Router/router.config';
import utils from '../../utils/utils';
import Stores from '../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import i18n, { L } from '../../i18next';

const { Content } = Layout;


@inject(Stores.AuthenticationStore,Stores.UserStore)
@observer
class AppLayout extends React.Component<any> {
  state = {
    collapsed: false,
  };

  async componentDidMount(){
    let languageName = i18n.language;
    if(this.props.authenticationStore!.isAuthenticated)
    await this.props.userStore!.changeLanguage(languageName);
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  onCollapse = (collapsed: any) => {
    this.setState({ collapsed });
  };

  render() {
    const {
      history,
      location: { pathname },
    } = this.props;

    const { collapsed } = this.state;

    const layout = (
      <Layout style={{ minHeight: '100vh' }}>
        <SiderMenu path={this.props.location.pathname} onCollapse={this.onCollapse} history={history} collapsed={collapsed} />
        <Layout>
          <Layout.Header style={{ minHeight: 52, padding: 0 }}>
            <Header collapsed={this.state.collapsed} toggle={this.toggle} pageTitle={L(utils.getPageTitleForHeader(pathname))} />
          </Layout.Header>
          <Content style={{ margin: 16 }}>
            <Switch>
            {appRouters
                .filter((item: any) => !item.isLayout && item.component !== undefined)
                .map((route: any, index: any) => (
                  <ProtectedRoute key={index} path={route.path} component={route.component} permission={route.permission} />
                ))}
                 <Redirect from="/" to="/dashboard" />
            </Switch>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    );

    return <DocumentTitle title={L(utils.getPageTitle(pathname))}>{layout}</DocumentTitle>;
  }
}

export default AppLayout;
