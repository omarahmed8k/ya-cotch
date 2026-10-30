import * as React from 'react';
import './index.less';
import { Avatar, Dropdown, Menu } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, LogoutOutlined, DownOutlined, UserOutlined } from '@ant-design/icons';
import { inject, observer } from 'mobx-react';
import LanguageSelect from '../LanguageSelect';
import { L } from '../../i18next';
import localization from '../../lib/localization';
import Stores from '../../stores/storeIdentifier';
import AuthenticationStore from '../../stores/authenticationStore';
import SessionStore from '../../stores/sessionStore';


export interface IHeaderProps {
  collapsed?: any;
  toggle?: any;
  authenticationStore?:AuthenticationStore;
  sessionStore?: SessionStore;
  pageTitle:string;

}


@inject(Stores.AuthenticationStore, Stores.SessionStore)
@observer
export class Header extends React.Component<IHeaderProps> {
  userDropdownMenu = (
    <Menu>
      <Menu.Item key="2">
        <div onClick={()=>{this.props.authenticationStore!.logout();window.location.href = '/';}}>
          <LogoutOutlined />
          <span> {L('Logout')}</span>
        </div>
      </Menu.Item>
    </Menu>
  );

  render() {
    const user = this.props.sessionStore!.currentLogin.user;
    const displayName = user ? user.name || user.userName : '';
    const isRTL = localization.isRTL();
    const ToggleIcon = this.props.collapsed !== isRTL ? MenuUnfoldOutlined : MenuFoldOutlined;

    return (
      <div className={isRTL ? 'rtl header-container' : 'ltr header-container'}>
        <div className="header-start">
          <button type="button" className="header-icon-btn" onClick={this.props.toggle}>
            <ToggleIcon className="trigger" />
          </button>
          <span className="pageTitle">{this.props.pageTitle}</span>
        </div>
        <div className="header-end">
          <span className="header-icon-btn">
            <LanguageSelect />
          </span>
          <Dropdown overlay={this.userDropdownMenu} trigger={['click']} placement={isRTL ? 'bottomLeft' : 'bottomRight'}>
            <div className="header-user">
              <Avatar size={34} className="header-user-avatar" icon={!displayName ? <UserOutlined /> : undefined}>
                {displayName ? displayName.charAt(0).toUpperCase() : null}
              </Avatar>
              {displayName && <span className="header-user-name">{displayName}</span>}
              <DownOutlined className="header-user-caret" />
            </div>
          </Dropdown>
        </div>
      </div>
    );
  }
}

export default Header;
