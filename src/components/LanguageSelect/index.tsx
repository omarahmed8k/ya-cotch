import './index.less';
import 'famfamfam-flags/dist/sprite/famfamfam-flags.css';

import * as React from 'react';

import { Dropdown, Menu } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';

import { L } from '../../lib/abpUtility';
import Stores from '../../stores/storeIdentifier';
import UserStore from '../../stores/userStore';
import classNames from 'classnames';
import { inject } from 'mobx-react';
import i18n from '../../i18next';
import localization from '../../lib/localization';
import AuthenticationStore from '../../stores/authenticationStore';

declare var abp: any;

export interface ILanguageSelectProps {
  userStore?: UserStore;
  authenticationStore? : AuthenticationStore;
}

@inject(Stores.UserStore,Stores.AuthenticationStore)
class LanguageSelect extends React.Component<ILanguageSelectProps> {


  async changeLanguage(languageName: string) {
    i18n.changeLanguage(languageName);
    if(this.props.authenticationStore!.isAuthenticated)
    await this.props.userStore!.changeLanguage(languageName);


    abp.utils.setCookieValue(
      'Abp.Localization.CultureName_YaCotch',
      languageName,
      new Date(new Date().getTime() + 5 * 365 * 86400000), //5 year
      abp.appPath
    );

    window.location.reload();
  }



  render() {
    const langMenu = (
      <Menu className={'menu'} selectedKeys={[localization.getCurrentLanguage()]}>
        {localization.getLanguages().map((item: any) => (
          <Menu.Item key={item.name} onClick={() => this.changeLanguage(item.name)}>
            <i className={item.icon} /> {item.displayName}
          </Menu.Item>
        ))}
      </Menu>
    );

    return (
      <Dropdown overlay={langMenu} placement="bottomRight">
        <GlobalOutlined className={classNames('dropDown', 'global-icon')} title={L('Languages')} />
      </Dropdown>
    );
  }
}

export default LanguageSelect;
