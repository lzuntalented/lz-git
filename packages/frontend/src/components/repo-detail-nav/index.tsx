import {
  Button, Col, Menu, Row,
} from 'antd';
import React from 'react';
import {
  Outlet,
  useLocation, useNavigate, useParams,
} from 'react-router-dom';
import {
  BookOutlined,
  CodepenOutlined, CommentOutlined, CompassOutlined, ForkOutlined,
  LineChartOutlined, PlayCircleOutlined, ProjectOutlined,
  PullRequestOutlined, SecurityScanOutlined, SettingOutlined, StarOutlined,
} from '@ant-design/icons';
import style from './index.module.css';

interface RepoDetailNavProps {
  children: React.ReactNode
}

const menus = [
  {
    key: 'code',
    icon: <CodepenOutlined />,
    href: '',
  },
  {
    key: 'issues',
    icon: <CompassOutlined />,
    href: 'issues',
  },
  {
    key: 'Pull request',
    icon: <PullRequestOutlined />,
    href: 'pr',
  },
  {
    key: 'Discussions',
    icon: <CommentOutlined />,
    href: 'discussions',
  },
  {
    key: 'Actions',
    icon: <PlayCircleOutlined />,
    href: 'actions',
  },
  {
    key: 'Projects',
    icon: <ProjectOutlined />,
    href: 'projects',
  },
  {
    key: 'Wiki',
    icon: <BookOutlined />,
    href: 'wiki',
  },
  {
    key: 'Security',
    icon: <SecurityScanOutlined />,
    href: 'security',
  },
  {
    key: 'Insights',
    icon: <LineChartOutlined />,
    href: 'insights',
  },
  {
    key: 'Setting',
    icon: <CodepenOutlined />,
    href: 'setting',
  },
];

function getHref(prefix: string, link = '') {
  if (link) {
    return `${prefix}/${link}`;
  }
  return prefix;
}

function RepoDetailNav() {
  const {
    user = '', repoName = '', ...o
  } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const navKey = pathname.split('/').slice(3, 4).join() || 'code';

  return (
    <div>
      <div className={style.comp}>
        <Row itemType="flex" justify="space-between">
          <Col>
            <div className={style.repoNameContainer}>
              <a
                onClick={() => {
                  navigate(user);
                }}
                className={style.repoName}
              >
                {user}
              </a>
              <span className={style.repoNameSpace}>/</span>
              <a
                onClick={() => {
                  navigate(`/${user}/${repoName}`);
                }}
                className={style.repoName}
              >
                {repoName}
              </a>
            </div>
          </Col>
          <Col>
            <Row gutter={12}>
              <Col>
                <Button icon={<ForkOutlined />}>Fork</Button>
              </Col>
              <Col>
                <Button icon={<StarOutlined />}>Star</Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Menu mode="horizontal" selectedKeys={[navKey]} style={{ backgroundColor: '#f6f8fa' }}>
          {
            menus.map((it) => (
              <Menu.Item key={it.href || 'code'} icon={it.icon}>
                <a onClick={() => {
                  navigate(getHref(`/${user}/${repoName}`, it.href));
                }}
                >
                  {it.key}
                </a>
              </Menu.Item>
            ))
          }
        </Menu>
      </div>
      <Outlet />
    </div>
  );
}

export default RepoDetailNav;
