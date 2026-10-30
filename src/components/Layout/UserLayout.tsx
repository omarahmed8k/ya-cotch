import * as React from 'react';

import './UserLayout.less';

import { Redirect, Route, Switch } from 'react-router-dom';

import DocumentTitle from 'react-document-title';
import LanguageSelect from '../LanguageSelect';
import { userRouter } from '../Router/router.config';
import utils from '../../utils/utils';
import { L } from '../../i18next';

class UserLayout extends React.Component<any> {
  render() {
    const {
      location: { pathname },
    } = this.props;

    return (
      <DocumentTitle title={L(utils.getPageTitle(pathname))}>
        <div className="user-layout">
          <div className={'lang'}>
            <span className="lang-btn">
              <LanguageSelect />
            </span>
          </div>
          <Switch>
            {userRouter
              .filter((item: any) => !item.isLayout)
              .map((item: any, index: number) => (
                <Route key={index} path={item.path} component={item.component} exact={item.exact} />
              ))}

            <Redirect from="/user" to="/user/login" />
          </Switch>
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
