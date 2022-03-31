import { Menu } from 'antd';
import React from 'react';
import {
  Outlet,
  useLocation, useNavigate, useParams,
} from 'react-router-dom';
import { CodepenOutlined, SettingOutlined } from '@ant-design/icons';
import style from './index.module.css';

interface RepoDetailNavProps {
  children: React.ReactNode
}

function RepoDetailNav() {
  const {
    user = '', repoName = '', ...o
  } = useParams();
  const location = useLocation();
  const { pathname } = location;
  const navKey = pathname.split('/').slice(3, 4).join() || 'code';
  return (
    <div>
      <div className={style.comp}>
        <div className={style.repoNameContainer}>
          <a className={style.repoName}>{user}</a>
          <span className={style.repoNameSpace}>/</span>
          <a className={style.repoName}>{repoName}</a>
        </div>
        <Menu mode="horizontal" selectedKeys={[navKey]} style={{ backgroundColor: '#f6f8fa' }}>
          <Menu.Item key="code" icon={<CodepenOutlined />}>
            <a href={`/${user}/${repoName}`}>
              Code
            </a>
          </Menu.Item>
          <Menu.Item key="setting" icon={<SettingOutlined />}>
            <a href={`/${user}/${repoName}/setting`}>
              Setting
            </a>
          </Menu.Item>
        </Menu>
      </div>
      <Outlet />
    </div>
  );
}

export default RepoDetailNav;
