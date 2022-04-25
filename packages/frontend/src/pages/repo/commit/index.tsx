import { MinusCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Box from '../../../components/box';
import RenderCodeMirror from '../../../components/render-codemirror';
import RenderMarkdown from '../../../components/render-markdown';
import { getCommitContent } from '../../../services/repo';

import style from './index.module.css';

interface DiffItem {
  file: string; str: string[]
  startLine: number,
  endLine: number,
  lineStr: string,
}

interface CommitInfo {
  author: string,
  date: number,
  message: string,
  hash: string,
}

const noFileEnd = '\\ No newline at end of file';

function RepoCommit() {
  const {
    user = '', repoName = '', hash = '',
  } = useParams();
  const [diffList, setDiffList] = useState({
    commitInfo: {} as CommitInfo,
    fileMap: [],
  } as {
    commitInfo: CommitInfo
    fileMap: DiffItem[]
  });
  useEffect(() => {
    getCommitContent(user, repoName, hash).then((r) => {
      setDiffList(r as any);
    });
  }, []);
  function renderFile(item: DiffItem) {
    const ins = 0;
    const del = 0;
    let insNormal = item.startLine;
    let delNormal = item.startLine;
    return item.str.map((it, i) => {
      if (it === noFileEnd) return null;
      let leftNum = delNormal;
      let rightNum = insNormal;
      let flag = 0;
      if (it.startsWith('-')) {
        leftNum += 1;
        flag = -1;
      } else if (it.startsWith('+')) {
        rightNum += 1;
        flag = 1;
      } else {
        leftNum += 1;
        rightNum += 1;
      }
      // console.log(flag, delNormal, insNormal);
      const result = {
        leftNum: flag <= 0 ? delNormal : null,
        rightNum: flag >= 0 ? insNormal : null,
        str: it,
        end: (i + 1 < item.str.length) && item.str[i + 1] === noFileEnd,
      };
      insNormal = rightNum;
      delNormal = leftNum;
      return result;
    }).filter((it) => it) as {
      leftNum: null | number,
      rightNum:null | number,
      str: string,
      end?: boolean
    }[];
  }
  return (
    <div style={{ padding: 20 }}>
      <Box header={diffList.commitInfo.message} className={style.box}>
        <Row itemType="flex" justify="space-between">
          <Col>
            {diffList.commitInfo.author}
            {' '}
            committed
            {' '}
            {moment(diffList.commitInfo.date).fromNow()}
          </Col>
          <Col>
            commit:
            {' '}
            {diffList.commitInfo.hash}
          </Col>
        </Row>
      </Box>
      {diffList.fileMap.map((it) => (
        <Box header={it.file} key={it.file} className={style.box}>
          <table style={{ width: '100%' }}>
            <tbody>
              <tr className={style.trLineRange}>
                <td colSpan={3}>{it.lineStr}</td>
              </tr>
              {
                renderFile(it).map((item, i) => (
                  <tr className={item.leftNum === null ? style.trIns : item.rightNum === null ? style.trDel : ''}>
                    <td className={style.tdLeft}>{item.leftNum}</td>
                    <td className={style.tdRight}>{item.rightNum}</td>
                    <td>
                      {item.str}
                      {item.end && (
                      <Tooltip title={noFileEnd}>
                        <MinusCircleOutlined style={{ marginLeft: 4, color: 'red' }} />
                      </Tooltip>
                      )}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </Box>
      ))}
    </div>
  );
}

export default RepoCommit;
