import { CaretDownOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Col, Layout, Menu, Popconfirm, Popover, Row,
} from 'antd';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LOGO } from '../../common/constants';
import { useContext } from '../../context';
import { logout } from '../../services/user';
import Avatar from '../avatar';
import style from './index.module.css';

function Header() {
  const { userInfo } = useContext();
  const location = useLocation();
  const navigate = useNavigate();
  const menus = [
    {
      title: '创建新仓库',
      href: '/create',
    },
  ];
  const userMenus = [
    {
      title: 'Your profile',
      href: `/${userInfo.account}`,
    },
    {
      title: 'Your stars',
      href: `/${userInfo.account}?tab=stars`,
    },
    {
      title: '退出登录',
      onClick: () => {
        logout().then(() => {
          window.location.href = '/';
        });
      },
    },
  ];
  useEffect(() => {
    if (userInfo.account) navigate(`/${userInfo.account}`);
  }, []);
  return (
    ['/', '/login', '/register'].includes(location.pathname) ? null
      : (
        <Layout.Header className={style.bg}>
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
              {
              userInfo.account && (
              <Row itemType="flex" justify="space-between" align="middle" gutter={24}>
                <Col>
                  <Popover
                    placement="bottomRight"
                    trigger={['click']}
                    getPopupContainer={(n) => n.parentNode as HTMLDivElement}
                    overlayInnerStyle={{ width: 160 }}
                    content={(
                      <div>
                        {menus.map((it) => (
                          <a
                            className={style.menuItem}
                            key={it.title}
                            onClick={() => {
                              navigate(it.href);
                            }}
                          >
                            {it.title}
                          </a>
                        ))}
                      </div>
)}
                  >
                    <span className={style.add}>
                      <PlusOutlined className={style.addIcon} />
                      <CaretDownOutlined className={style.downIcon} />
                    </span>
                  </Popover>
                </Col>
                <Col>
                  <Popover
                    placement="bottomRight"
                    trigger={['click']}
                    title={(
                      <div>
                        当前登录帐号
                        <br />
                        <b>{userInfo.account}</b>
                      </div>
)}
                    content={(
                      <div>
                        {userMenus.map((it) => (
                          <a
                            className={style.menuItem}
                            key={it.title}
                            onClick={() => {
                              if (it.onClick) {
                                it.onClick();
                              } else {
                                navigate(it.href);
                              }
                            }}
                          >
                            {it.title}
                          </a>
                        ))}
                      </div>
                    )}
                    // onConfirm={() => {
                    //   logout().then(() => {
                    //     window.location.href = '/';
                    //   });
                    // }}
                    // placement="bottomRight"
                  >
                    <span className={style.user}>
                      <span className={style.userImg}>
                        <Avatar url={userInfo.avatar} name={userInfo.account || userInfo.name || ''} />
                      </span>
                      <CaretDownOutlined className={style.downIcon} />
                    </span>
                  </Popover>
                </Col>
              </Row>
              )
            }
              {
            !userInfo?.account && (
            <Button
              type="primary"
              onClick={() => {
                navigate('/login');
              }}
            >
              登录
            </Button>
            )
          }
            </Col>
          </Row>
        </Layout.Header>
      )
  );
}

export default Header;
