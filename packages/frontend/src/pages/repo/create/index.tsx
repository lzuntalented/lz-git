import React, { useState } from 'react';
import {
  Form, Input, Checkbox, Row, Col, Button, message,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import style from './index.module.css';
import { create } from '../../../services/repo';
import { useContext } from '../../../context';

function RepoCreate() {
  const navigate = useNavigate();
  const { userInfo } = useContext();
  const [info, setInfo] = useState({
    user: userInfo.account,
    name: '',
    readme: false,
    describe: '',
  });

  const onCreate = () => {
    create(info).then(() => {
      message.success('创建成功');
      navigate(`/${userInfo.account}`);
    });
  };

  return (
    <div className={style.page}>
      <div className={style.title}>
        <h1> Create a new repository</h1>
        A repository contains all project files,
        including the revision history. Already have a project repository elsewhere?
      </div>
      <Row itemType="flex" align="bottom" className={style.owner}>
        <Col>
          <div className={style.ownerTitle}>Owner</div>
          <Input
            disabled
            value={info.user}
            onChange={(e) => setInfo({ ...info, user: e.target.value })}
          />
        </Col>
        <Col className={style.ownerSpace}>/</Col>
        <Col>
          <div className={style.ownerTitle}>Repository name</div>
          <Input value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} />
        </Col>
      </Row>
      <Row itemType="flex" align="bottom" className={style.describe}>
        <Col span={24}>
          <div className={style.ownerTitle}>Description (optional)</div>
          <Input
            value={info.describe}
            onChange={(e) => setInfo({ ...info, describe: e.target.value })}
            style={{ width: '100%' }}
          />
        </Col>
      </Row>
      <Row className={style.initArea} gutter={8}>
        <Col span={24} className={style.item}>
          <div className={style.itemTitle}>Initialize this repository with: </div>
          <div className={style.tip}>
            Skip this step if you’re importing an existing repository.
          </div>
        </Col>
        <Col>
          <Checkbox
            checked={info.readme}
            onChange={(e) => setInfo({ ...info, readme: e.target.checked })}
          />
        </Col>
        <Col>
          Add a README file
        </Col>
      </Row>
      <Row itemType="flex" justify="center">
        <Col>
          <Button onClick={onCreate}>提交</Button>
        </Col>
      </Row>
    </div>
  );
}

export default RepoCreate;
