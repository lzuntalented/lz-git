import { StarOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getList, getStarList } from '../../../../services/repo';
import RepositoryItem from '../repositroy-item';

function Stars() {
  const { user = '' } = useParams();
  const [data, setData] = useState([] as {
    name: string;
    user: string;
    describe: string;
    tagNum: number
    starNum: number
  }[]);
  useEffect(() => {
    getStarList(user).then((res) => {
      setData(res.list || []);
    });
  }, []);
  return (
    <div>
      {
      data.map((it) => <RepositoryItem key={it.name} data={it} />)
    }
    </div>
  );
}

export default Stars;
