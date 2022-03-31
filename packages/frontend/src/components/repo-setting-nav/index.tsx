import { AimOutlined, SettingOutlined } from '@ant-design/icons';
import { Col, Menu, Row } from 'antd';
import React from 'react';
import {
  Outlet, useLocation, useNavigate, useParams,
} from 'react-router-dom';
import style from './index.module.css';

function RepoSettingNav() {
  const {
    user = '', repoName = '',
  } = useParams();
  const location = useLocation();
  const { pathname } = location;
  const navKey = pathname.split('/').slice(4, 5).join() || 'setting';
  const navigate = useNavigate();
  return (
    <Row className={style.comp} itemType="flex">
      <Col style={{ width: 296 }}>
        <Menu selectedKeys={[navKey]}>
          <Menu.Item
            key="setting"
            icon={<SettingOutlined />}
            onClick={() => {
              navigate(`/${user}/${repoName}/setting`);
            }}
          >
            Setting
          </Menu.Item>
          <Menu.ItemGroup
            key="g1"
            title="Code and automation"
          >
            <Menu.Item
              key="hooks"
              icon={<AimOutlined />}
              onClick={() => {
                navigate(`/${user}/${repoName}/setting/hooks`);
              }}
            >
              Webhooks
            </Menu.Item>
          </Menu.ItemGroup>
        </Menu>
      </Col>
      <Col className={style.content}>
        <Outlet />
      </Col>
    </Row>
  );
}

export default RepoSettingNav;
