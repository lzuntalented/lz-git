import {
  Button, Col, Form, Input, message, Row,
} from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGO } from '../../../common/constants';
import { login } from '../../../services/user';
import style from './index.module.css';

function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const onSubmit = () => {
    form.validateFields().then((v) => {
      login(v).then((r) => {
        message.success('登录成功');
        window.location.href = '/';
      });
    });
  };
  return (
    <div className={style.page}>
      <div className={style.header}>
        <div>
          <a onClick={() => {
            navigate('/');
          }}
          >
            <img src={LOGO} alt="" width={80} />
          </a>
        </div>
        登录 随心码!
      </div>
      <Form className={style.form} layout="vertical" form={form}>
        <Form.Item label="Username or email address" name="account">
          <Input />
        </Form.Item>

        <Form.Item label="Password" name="password">
          <Input />
        </Form.Item>
        <Row itemType="flex" justify="space-around">
          <Col>
            <Button type="primary" onClick={onSubmit}>登录</Button>
          </Col>
          <Col>
            <Button
              onClick={() => {
                navigate('/register');
              }}
            >
              注册
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default Login;
