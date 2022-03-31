import {
  Button, Col, Form, Input, Radio, Row, Select,
} from 'antd';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { create } from '../../../services/hooks';
import style from './index.module.css';

const methodOption = [
  {
    label: 'application/json',
    value: 1,
  },
  {
    label: 'application/x-www-form-urlencoded',
    value: 2,
  },
];

const eventTypeOption = [
  {
    label: '只推送 push 事件',
    value: 1,
  },
  {
    label: '推送 所有 事件',
    value: 2,
  },
];

function RepoHooks() {
  const {
    user = '', repoName = '',
  } = useParams();
  const [showAddBtn, setShowAddBtn] = useState(false);
  const [formRef] = Form.useForm();
  const onSubmit = () => {
    formRef.validateFields().then((r) => {
      const params = {
        ...formRef.getFieldsValue(),
        user,
        name: repoName,
      };
      create(params).then(() => {
        // console.log(r);
      });
    });
  };
  return (
    <div>
      { showAddBtn ? (
        <div>
          <Row itemType="flex" justify="space-between" className={style.titleContainer} align="bottom">
            <Col className={style.title}>
              Webhooks
            </Col>
            <Col>
              <Button>add Webhooks</Button>
            </Col>
          </Row>
          Webhooks allow external services to be notified when certain events happen.
          When the specified events happen,
          we’ll send a POST request to each of the URLs you provide.
          Learn more in our Webhooks Guide.
        </div>
      )
        : (
          <div>
            <Form
              layout="vertical"
              form={formRef}
            >
              <Form.Item name="url" label="推送地址" initialValue="http://localhost:3000/api/hooks/run">
                <Input />
              </Form.Item>
              <Form.Item name="method" label="推送格式" initialValue={1}>
                <Select options={methodOption} />
              </Form.Item>
              <Form.Item name="url" label="密钥文本">
                <Input />
              </Form.Item>
              <Form.Item name="eventType" label="请设置您希望触发 Web 钩子的事件" initialValue={1}>
                <Radio.Group options={eventTypeOption} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={onSubmit}>提交</Button>
              </Form.Item>
            </Form>
          </div>
        )}
    </div>
  );
}

export default RepoHooks;
