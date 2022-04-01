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
        <div className={style.topContent}>
          <div className={style.header}>
            <Row itemType="flex" justify="space-between" align="middle" className={style.headerContent}>
              <Col />
              <Col>
                <Row itemType="flex" justify="space-between" align="middle" gutter={12}>
                  <Col>
                    <Input placeholder="Search Github" />
                  </Col>
                  <Col>
                    <a onClick={() => { navigate('/login'); }}>登录</a>
                  </Col>
                  <Col>
                    <Button onClick={() => { navigate('/register'); }}>注册</Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
          <Row className={style.gobla} align="middle">
            <Col span={12}>
              <div className={style.webName}>
                随心码
              </div>
              <div className={style.webDesc}>
                一款基于 Javascript 开发的 git 代码管理平台
              </div>
              <Button type="primary" onClick={() => { navigate('/login'); }}>
                立即体验, 登录
              </Button>
            </Col>
            <Col span={12}>
              <img src="https://github.githubassets.com/images/modules/site/home/globe.jpg" alt="" width="100%" />
            </Col>
          </Row>
        </div>
        <div className={style.bgPoint}>
          <img src="https://github.githubassets.com/images/modules/site/home/hero-glow.svg" alt="" width="100%" />
        </div>
      </div>
      <div className={style.person}>
        <div className={style.personWhite} />
        <Row itemRef="flex" justify="space-between" align="bottom">
          <Col>
            1123
          </Col>
          <Col span={8}>
            <img src="https://github.githubassets.com/images/modules/site/home/astro-mona.svg" alt="" width="100%" />
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Home;
