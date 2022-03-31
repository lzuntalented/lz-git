import {
  Button, Col, Input, Row,
} from 'antd';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from '../../context';
import style from './index.module.css';

function Home() {
  const { userInfo } = useContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (userInfo.account) {
      navigate(`/${userInfo.account}`);
    }
  }, [userInfo]);
  return (
    <div className={style.page}>
      <div className={style.top}>
        <Row itemType="flex" justify="space-between" align="middle" className={style.header}>
          <Col />
          <Col>
            <Row itemType="flex" justify="space-between" align="middle" gutter={12}>
              <Col>
                <Input placeholder="Search Github" />
              </Col>
              <Col>
                <a onClick={() => { navigate('/login'); }}>Sign in</a>
              </Col>
              <Col>
                <Button onClick={() => { navigate('/register'); }}>Sign up</Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col className={style.center} span={24}>
            <span onClick={() => { navigate('/login'); }}>
              登录，立即体验
            </span>
          </Col>
          <Col />
        </Row>
      </div>
    </div>
  );
}

export default Home;
