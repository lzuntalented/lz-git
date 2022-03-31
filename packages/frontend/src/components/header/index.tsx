import {
  Button,
  Col, Layout, Menu, Popconfirm, Row,
} from 'antd';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LOGO } from '../../common/constants';
import { useContext } from '../../context';
import { logout } from '../../services/user';

function Header() {
  const { userInfo } = useContext();
  const location = useLocation();
  const menus = [
    {
      title: 'create',
      href: '/create',
    },
  ];
  const navigate = useNavigate();
  useEffect(() => {
    if (userInfo.account) navigate(`/${userInfo.account}`);
  }, []);
  return (
    ['/', '/login', '/register'].includes(location.pathname) ? null
      : (
        <Layout.Header className="header">
          <Row itemType="flex" justify="space-between" align="middle">
            <Col>
              <a
                onClick={() => {
                  navigate('/');
                }}
              >
                <img
                  src={LOGO}
                  alt=""
                  width={48}
                />
              </a>
            </Col>
            <Col>
              <Row itemType="flex" justify="space-between" align="middle" gutter={24}>
                {userInfo.account && (
                <Col>
                  <Menu theme="dark" selectedKeys={[]}>
                    {menus.map((it) => (
                      <Menu.Item
                        key={it.title}
                        onClick={() => {
                          navigate(it.href);
                        }}
                      >
                        {it.title}
                      </Menu.Item>
                    ))}
                  </Menu>
                </Col>
                )}
                <Col>
                  {userInfo.account ? (
                    <Popconfirm
                      title="是否退出登录"
                      onConfirm={() => {
                        logout().then(() => {
                          window.location.href = '/';
                        });
                      }}
                      placement="bottomRight"
                    >
                      <span className="user" onClick={() => navigate(`/${userInfo.account}`)}>
                        Hi，
                        {userInfo.account}
                      </span>
                    </Popconfirm>
                  ) : (
                    <Button
                      type="primary"
                      onClick={() => {
                        navigate('/login');
                      }}
                    >
                      登录
                    </Button>
                  )}
                </Col>
              </Row>

            </Col>
          </Row>
        </Layout.Header>
      )
  );
}

export default Header;
