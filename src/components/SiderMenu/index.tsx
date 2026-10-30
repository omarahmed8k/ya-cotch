import './index.less';

import * as React from 'react';

import { Layout, Menu } from 'antd';
import { isGranted } from '../../lib/abpUtility';
import LogoMark from '../../images/logo-mark.png';
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
    <Sider trigger={null} className={'sidebar'} width={256} collapsedWidth={76} collapsible collapsed={collapsed} onCollapse={onCollapse}>
      <div className={collapsed ? 'sidebar-brand collapsed' : 'sidebar-brand'}>
        <img className="sidebar-brand-mark" src={LogoMark} alt="YaCotch" />
        {!collapsed && (
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">YaCotch</span>
            <span className="sidebar-brand-caption">{L('AdminPanel')}</span>
          </div>
        )}
      </div>

      <Menu className="sidebar-menu" theme="dark" mode="inline" selectedKeys={[path]} defaultOpenKeys={handleSelectedSubmenuItem(path) }>
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
