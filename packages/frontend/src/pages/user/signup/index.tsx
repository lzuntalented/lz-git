import { ArrowRightOutlined } from '@ant-design/icons';
import {
  Button, Col, Form, Input, message, Row,
} from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGO } from '../../../common/constants';
import { register } from '../../../services/user';
import style from './index.module.css';

function Signup() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const onSubmit = () => {
    form.validateFields().then((v) => {
      register(v).then((r) => {
        console.log(r, ',r');
        message.success('注册成功');
      });
    });
  };
  return (
    <div className={style.page}>
      <div className={style.header}>
        <a onClick={() => {
          navigate('/');
        }}
        >
          <img src={LOGO} alt="" width={80} />
        </a>
        <br />
        Welcome to 随心码!
        {' '}
        <br />
        Let’s begin the adventure
      </div>
      <Form className={style.form} layout="vertical" form={form}>
        <Form.Item label="Enter your email" name="email">
          <Input
            className={style.formItemInput}
          />
        </Form.Item>
        <Form.Item label="Create a password" name="password">
          <Input
            className={style.formItemInput}
          />
        </Form.Item>
        <Form.Item label="Enter a username" name="account">
          <Input
            className={style.formItemInput}
          />
        </Form.Item>
        <Row itemType="flex" justify="space-between">
          <Col>
            <Button type="primary" onClick={onSubmit}>注册</Button>
          </Col>
          <Col>
            <Button
              onClick={() => {
                navigate('/login');
              }}
            >
              登录
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default Signup;
