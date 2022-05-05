import {
  Button, Card, Col, Input, Row, Image,
} from 'antd';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RepSelect from '../../components/repo-select';
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
                    <RepSelect placeholder="搜索项目" style={{ width: 200 }} />
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
              <img src="http://static.lzz.show/sxm/globe.jpg" alt="" width="100%" />
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
            <img src="http://static.lzz.show/sxm/astro-mona.svg" alt="" width="100%" />
          </Col>
        </Row>
      </div>
      <div className={style.preview}>
        <div className={style.previewTitle}>示例项目</div>
        <div className={style.previewProject}>
          <a href="/lz/lz-git">lz/lz-git</a>
        </div>
        <Row itemType="flex" justify="space-around">
          <Col>
            <div className={style.previewImgTitle}>文件浏览</div>
          </Col>
          <Col>
            <div className={style.previewImgTitle}>DIFF明细</div>
          </Col>
        </Row>
        <Row itemType="flex" justify="space-around">
          <Col>
            <Image
              height={300}
              src="http://www.lzuntalented.cn/img/git/git.home.png"
            />
          </Col>
          <Col>
            <Image
              height={300}
              src="http://www.lzuntalented.cn/img/git/git.diff.png"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Home;
