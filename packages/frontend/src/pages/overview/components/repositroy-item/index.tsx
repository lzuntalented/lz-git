import { ForkOutlined, StarOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import style from './index.module.css';

function RepositoryItem({ data }: {
  data: {
    name: string;
    user: string;
    describe: string;
    tagNum: number
    starNum: number
  }
}) {
  const navigator = useNavigate();
  return (
    <Row className={style.item}>
      <Col>
        <a
          onClick={() => {
            navigator(`/${data.user}/${data.name}`);
          }}
          rel="noreferrer"
        >
          <span className={style.itemTitle}>
            {data.user}
            /
            {data.name}
          </span>
        </a>
        <div className={style.desc}>{data.describe}</div>
        <div className={style.tagContainer}>
          <StarOutlined />
          <span className={style.tagNum}>{data.starNum || 0}</span>
          <ForkOutlined />
          <span className={style.tagNum}>{data.tagNum || 0}</span>
        </div>
      </Col>
    </Row>
  );
}

export default RepositoryItem;
