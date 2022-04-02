import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { ForkOutlined, StarOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { getList } from '../../../services/repo';
import style from './index.module.css';
import { useContext } from '../../../context';

function RepoList() {
  const {
    user = '',
  } = useParams();
  const [data, setData] = useState([] as {name: string;describe: string}[]);
  const { userInfo } = useContext();
  const navigate = useNavigate();
  useEffect(() => {
    getList(user).then((res) => {
      setData(res || []);
    });
  }, []);
  return (
    <Row className={style.page} itemType="flex">
      <Col style={{ width: 296 }}>
        <img src="https://avatars.githubusercontent.com/u/13075458?v=4" alt="" width="100%" className={style.avatar} />
        <div className={style.userName}>{userInfo.name}</div>
        <div className={style.account}>{userInfo.account}</div>
      </Col>
      <Col style={{ flex: 1, paddingLeft: 16 }}>
        {
        data.map((it) => (
          <Row className={style.item} key={it.name}>
            <Col>
              <a
                onClick={() => {
                  navigate(`/${userInfo.account}/${it.name}`);
                }}
                rel="noreferrer"
              >
                <span className={style.itemTitle}>{it.name}</span>
              </a>
              <div className={style.desc}>{it.describe}</div>
              <div className={style.tagContainer}>
                <StarOutlined />
                <span className={style.tagNum}>1</span>
                <ForkOutlined />
                <span className={style.tagNum}>1</span>
              </div>
            </Col>
          </Row>
        ))
        }
      </Col>
    </Row>
  );
}

export default RepoList;
