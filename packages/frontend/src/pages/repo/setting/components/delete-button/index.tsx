import {
  Button, Input, message, Modal,
} from 'antd';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { removeRepo } from '../../../../../services/repo';

function DeleteButton() {
  const {
    user = '', repoName = '', branch = '', ...o
  } = useParams();
  const navigate = useNavigate();
  const name = `${user}/${repoName}`;
  const [inputVal, setInputVal] = useState('');
  const [visible, setvVisible] = useState(false);

  const onRemove = () => {
    removeRepo(repoName).then((r) => {
      message.success('操作成功');
      navigate(`/${user}`);
    });
  };

  return (
    <>
      <Button danger onClick={() => setvVisible(true)}>删除仓库</Button>
      <Modal title="确定删除此仓库码？" visible={visible} footer={false} onCancel={() => setvVisible(false)}>
        <div>
          <div>
            请输入`
            {name}
            `确认删除
          </div>
          <div style={{ margin: '12px 0' }}>
            <Input value={inputVal} onChange={(e) => setInputVal(e.target.value)} />
          </div>
          <div>
            <Button disabled={name !== inputVal} danger onClick={onRemove}>我明白此操作行为，并确认删除</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default DeleteButton;
