import {
  Button, Form, Input, message,
} from 'antd';
import React, { useState } from 'react';
import { API_CODE } from '../../common/constants';
import { init } from '../../services/install';
import style from './index.module.css';

function Install() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const onSubmit = () => {
    form.validateFields().then((v) => {
      setLoading(true);
      init(v).then((res) => {
        message.success('初始化成功');
      }).finally(() => setLoading(false));
    });
  };
  return (
    <div className={style.page}>
      <div className={style.title}>
        Git 配置
      </div>
      <Form layout="vertical" form={form}>
        <Form.Item required name="rootPath" label="git root path">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={onSubmit} loading={loading}>提交</Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Install;
