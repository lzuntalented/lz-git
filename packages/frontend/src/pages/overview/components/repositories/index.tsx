import { StarOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getList } from '../../../../services/repo';
import RepositoryItem from '../repositroy-item';

function Repositories() {
  const { user = '' } = useParams();
  const [data, setData] = useState([] as {
    name: string;
    user: string;
    describe: string;
    tagNum: number
    starNum: number
  }[]);
  useEffect(() => {
    getList(user).then((res) => {
      setData(res || []);
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

export default Repositories;
