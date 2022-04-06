import {
  Button, Card, Col, Row,
} from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import RepoDetailNav from '../../../components/repo-detail-nav';
import DeleteButton from './components/delete-button';

function RepoSetting() {
  const {
    user = '', repoName = '', branch = '', ...o
  } = useParams();
  return (
    <div>
      <Card title="危险操作">
        <Row itemType="flex" justify="space-between">
          <Col>
            删除这个存储库
            <br />
            一旦你删除了一个存储库，就再也回不去了。请确定。
          </Col>
          <Col>
            <DeleteButton />
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default RepoSetting;
