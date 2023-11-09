import './index.less';

import * as React from 'react';

import { Avatar, Col, Layout, Menu } from 'antd';
import { isGranted } from '../../lib/abpUtility';
import Logo from '../../images/logo.png';
import { appRouters } from '../../components/Router/router.config';
import { L } from '../../i18next';
import SubMenu from 'antd/lib/menu/SubMenu';

const { Sider } = Layout;

export interface ISiderMenuProps {
  path: any;
  collapsed: boolean;
  onCollapse: any;
  history: any;
}

const handleSelectedSubmenuItem = (path:string) => {
  switch(path){
    
    case '/specializations':
    case '/trainers':
      return ['trainer-menu'];
      case '/countries':
        case '/cities':
          return ['location'];
          case '/restaurants':
            case '/restaurants-managers':
              case '/restaurants-dishes':
            return ['restaurant-menu'];
            case '/shops':
                case '/products':
              return ['shop-menu'];
    default:
      return [];
  }
};

const SiderMenu = (props: ISiderMenuProps) => {
  const { collapsed, history, onCollapse,path } = props;
  return (
    <Sider trigger={null} className={'sidebar'} width={240} collapsible collapsed={collapsed} onCollapse={onCollapse}>
      {collapsed ? (
         <Col style={{ textAlign: 'center', marginTop: 15, marginBottom: 10 }}>
         <Avatar shape="square" style={{ height: 45, width: 40 }} src={Logo} />
       </Col>
      ) : (
        <Col style={{ textAlign: 'center', marginTop: 15, marginBottom: 20 }}>
        <Avatar shape="square" style={{ height: 92, width: 80 }} src={Logo} />
      </Col>
      )}

      <Menu  mode="inline" selectedKeys={[path]} defaultOpenKeys={handleSelectedSubmenuItem(path) }>
        {appRouters
          .filter((item: any) => !item.isLayout && item.showInMenu && item.baseMenuItem === undefined)
          .map((route: any, index: number) => {
            if (route.permission && !isGranted(route.permission)) return null;
            const nestedItems = appRouters.filter((item: any) => item.baseMenuItem === route.name);

            if (nestedItems.length === 0) {
              return (
                <Menu.Item key={route.path} onClick={() => history.push(route.path)}>
                  <route.icon />
                  <span>{L(route.title)}</span>
                </Menu.Item>
              );
            }
            

            return (
              <SubMenu
                className='submenu'
                key={route.name}
                title={
                  <span>
                   <route.icon />
                    <span>{L(route.title)}</span>
                  </span>
                }
              >
                {nestedItems &&
                  nestedItems.map((nestedRoute: any, index: number) => {
                    if (nestedRoute.permission && !isGranted(nestedRoute.permission)) return null;
 
                    return <Menu.Item key={nestedRoute.path}  onClick={() => history.push(nestedRoute.path)}>
                      <nestedRoute.icon/>
                      <span>{L(nestedRoute.title)}</span>
                    </Menu.Item>
          })}
              </SubMenu>
            );
          })}
      </Menu>
    </Sider>
  );
};

export default SiderMenu;
