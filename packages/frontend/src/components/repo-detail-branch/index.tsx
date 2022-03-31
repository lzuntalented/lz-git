import {
  CaretDownFilled,
  CodeOutlined, CopyOutlined, DownOutlined, ForkOutlined, QuestionCircleOutlined, TagOutlined,
} from '@ant-design/icons';
import {
  Button, Col, Row, Select, Dropdown, Tabs, Input, Popover,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBranch } from '../../services/home';
import style from './index.module.css';
import { copy } from '../../tool';

interface RepDetailBranchProps {
  onChange(v: string): void
}

function RepDetailBranch({ onChange }: RepDetailBranchProps) {
  const {
    user = '', repoName = '', branch = '',
  } = useParams();
  const [currentBranch, setCurrentBranch] = useState(branch);
  const [branchList, setBranchList] = useState([] as {label: string, value: string}[]);
  useEffect(() => {
    getBranch(user, repoName).then((res: any) => {
      const list = res.map((it: string) => ({
        lable: it,
        value: it,
      }));
      setBranchList(list);
      setCurrentBranch(list[0]?.value);
    });
  }, []);

  useEffect(() => {
    if (currentBranch) {
      onChange(currentBranch);
    }
  }, [currentBranch]);

  const gitHttpUrl = `${window.location.origin}/${user}/${repoName}.git`;
  return (
    <Row className={style.comp} itemType="flex" justify="space-between">
      <Col>
        <Row gutter={16} itemType="flex" align="middle">
          <Col>
            <Select
              value={currentBranch}
              options={branchList}
              style={{ width: 180 }}
              onChange={(v) => {
                setCurrentBranch(v);
              }}
            />
          </Col>
          <Col>
            <span>
              <ForkOutlined />
              <span className={style.iconName}>{`${branchList.length} branchs`}</span>
            </span>
            <span style={{ marginLeft: 8 }}>
              <TagOutlined />
              <span className={style.iconName}>{`${branchList.length} tags`}</span>
            </span>
          </Col>
        </Row>
      </Col>
      <Col>
        <Popover
          title=""
          trigger="click"
          placement="bottomRight"
          content={(
            <div style={{ width: 370 }}>
              <Row itemType="flex" justify="space-between">
                <Col>
                  <CodeOutlined />
                  Clone
                </Col>
                <Col>
                  <QuestionCircleOutlined />
                </Col>
              </Row>
              <Tabs>
                <Tabs.TabPane tab="https">
                  <Input.Search
                    enterButton={(
                      <CopyOutlined
                        style={{ cursor: 'pointer' }}
                      />
)}
                    onSearch={() => {
                      copy(gitHttpUrl);
                    }}
                    value={gitHttpUrl}
                  />
                </Tabs.TabPane>
              </Tabs>
            </div>
)}
        >
          <Button type="primary">
            Code
            <CaretDownFilled />
          </Button>
        </Popover>
      </Col>
    </Row>
  );
}

export default RepDetailBranch;
