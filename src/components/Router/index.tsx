import * as React from 'react';

import { Route, Switch } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import utils from '../../utils/utils';
import { ConfigProvider } from 'antd';
import localization from '../../lib/localization';
import ar_EG from 'antd/lib/locale/ar_EG';
import en_US from 'antd/lib/locale/en_US';

const Router = () => {
  const UserLayout = utils.getRoute('/user').component;
  const AppLayout = utils.getRoute('/').component;

  return (
    <ConfigProvider
      locale={localization.isRTL() ? ar_EG : en_US } 
      direction={localization.isRTL() ? 'rtl' : 'ltr' }
    >
      <Switch>
        <Route path="/user" render={(props: any) => <UserLayout {...props} />} />
        <ProtectedRoute path="/trainer/:id" render={(props: any) => <AppLayout {...props} exact />} />
        <ProtectedRoute path="/trainee/:id" render={(props: any) => <AppLayout {...props} exact />} />
        <ProtectedRoute path="/subscription/:id" render={(props: any) => <AppLayout {...props} exact />} />
        <ProtectedRoute path="/order/:id" render={(props: any) => <AppLayout {...props} exact />} />
        <ProtectedRoute path="/restaurant/:id" render={(props: any) => <AppLayout {...props} exact />} />
        <ProtectedRoute path="/dish/:id" render={(props: any) => <AppLayout {...props} exact />} />
        <ProtectedRoute path="/course/:id" render={(props: any) => <AppLayout {...props} exact />} />
        <ProtectedRoute path="/" render={(props: any) => <AppLayout {...props} exact />} />
      </Switch>
    </ConfigProvider>
  );
};

export default Router;
