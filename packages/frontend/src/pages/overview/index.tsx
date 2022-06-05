import { BookOutlined, StarOutlined } from '@ant-design/icons';
import { Col, Row, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useContext } from '../../context';
import Repositories from './components/repositories';
import Stars from './components/stars';
import style from './index.module.css';

function Overview() {
  const { user = '' } = useParams();
  const [searchParams] = useSearchParams();
  const linkTab = searchParams.get('tab');
  const { userInfo } = useContext();
  const [tabKey, setTabKey] = useState('repositories');
  useEffect(() => {
    setTabKey(linkTab || 'repositories');
  }, [linkTab]);
  const navigator = useNavigate();
  return (
    <Row className={style.page} itemType="flex">
      <Col style={{ width: 296 }}>
        <img src="https://avatars.githubusercontent.com/u/13075458?v=4" alt="" width="100%" className={style.avatar} />
        <div className={style.userName}>{userInfo.name}</div>
        <div className={style.account}>{userInfo.account}</div>
      </Col>
      <Col style={{ flex: 1, paddingLeft: 16 }}>
        <Tabs
          activeKey={tabKey}
          onChange={(k) => {
            setTabKey(k);
            navigator(`/${user}?tab=${k}`, { replace: true });
          }}
        >
          {/* <Tabs.TabPane tab="overview" key="overview">1</Tabs.TabPane> */}
          <Tabs.TabPane
            tab={(
              <Row>
                <Col>
                  <BookOutlined />
                </Col>
                <Col>
                  repositories
                </Col>
              </Row>
          )}
            key="repositories"
          >
            <Repositories />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={(
              <Row>
                <Col>
                  <StarOutlined />
                </Col>
                <Col>
                  stars
                </Col>
              </Row>
          )}
            key="stars"
          >
            <Stars />
          </Tabs.TabPane>
        </Tabs>
      </Col>
    </Row>
  );
}

export default Overview;
