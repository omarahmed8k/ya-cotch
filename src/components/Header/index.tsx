import * as React from 'react';
import './index.less';
import { Col, Dropdown, Menu, Row } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, LogoutOutlined, MoreOutlined } from '@ant-design/icons';
import { inject } from 'mobx-react';
import LanguageSelect from '../LanguageSelect';
import { L } from '../../i18next';
import localization from '../../lib/localization';
import Stores from '../../stores/storeIdentifier';
import AuthenticationStore from '../../stores/authenticationStore';


export interface IHeaderProps {
  collapsed?: any;
  toggle?: any;
  authenticationStore?:AuthenticationStore;
  pageTitle:string;

}


@inject(Stores.AuthenticationStore)
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
    return (
      <Row className={localization.isRTL() ? 'rtl header-container':"ltr header-container"}>
        <Col className="first-col">
          {!localization.isRTL() ? (this.props.collapsed ? (
            <MenuUnfoldOutlined className="trigger" onClick={this.props.toggle} />
          ) : (
            <MenuFoldOutlined className="trigger" onClick={this.props.toggle} />
          )) :
          
          (this.props.collapsed ? (
            <MenuFoldOutlined className="trigger" onClick={this.props.toggle} />
          ) : (
            <MenuUnfoldOutlined className="trigger" onClick={this.props.toggle} />
          ))}
          <span className="pageTitle">{this.props.pageTitle}</span>

        </Col>
        <Col style={{ padding: '0px 15px' }} className="second-col">
          <LanguageSelect /> 
          <Dropdown overlay={this.userDropdownMenu} trigger={['click']}>
            <MoreOutlined className="more-icon" />
          </Dropdown>
        </Col>
      </Row>
    );
  }
}

export default Header;
