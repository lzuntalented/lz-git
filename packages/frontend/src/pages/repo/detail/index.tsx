import React, { useEffect, useState } from 'react';
import {
  Select, List, Col, Row,
} from 'antd';
import {
  useLocation, useNavigate, useParams,
} from 'react-router-dom';
import { FileOutlined, FolderFilled, FolderOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import moment from 'moment';
import { getBranch, getFilesWithPath } from '../../../services/repo';
import style from './index.module.css';
import RepoDetailNav from '../../../components/repo-detail-nav';
import RepDetailBranch from '../../../components/repo-detail-branch';
import Box from '../../../components/box';
import RenderMarkdown from '../../../components/render-markdown';

interface ListItemData {
  isTree: boolean, hash: string, name: string
  commitMsg?: string
  commitTime?: string
  commitHash?: string
  isBack?: boolean
}

function RepoDir() {
  const location = useLocation();

  const {
    user = '', repoName = '', branch = '', ...o
  } = useParams();
  const subTree = Object.values(o).join();
  const { pathname } = location;
  console.log(location, o, subTree);
  const [currentBranch, setCurrentBranch] = useState(branch);
  const [files, setFiles] = useState([] as ListItemData[]);
  const [treePath, setTreePath] = useState(subTree);
  const [readmeContent, setReadmeContent] = useState('');
  const [topInfo, setTopInfo] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setTreePath(subTree);
  }, [subTree]);

  useEffect(() => {
    if (currentBranch) {
      getFilesWithPath(user, repoName, currentBranch, treePath).then((r: any) => {
        const data = (r.list || []) as ListItemData[];

        const foldArr = data.filter((it) => it.isTree).sort((a, b) => a.name.localeCompare(b.name));
        const fileArr = data.filter((it) => !it.isTree)
          .sort((a, b) => a.name.localeCompare(b.name));
        const backItem = {
          isTree: true, name: '..', hash: '..', isBack: true,
        };
        setFiles([
          ...(subTree && data.length > 0 ? [backItem] : []),
          ...foldArr, ...fileArr]);
        setReadmeContent(r.readmeContent);
        setTopInfo(r.info);
      });
    }
  }, [currentBranch, treePath]);

  return (
    <div className={style.page}>
      <RepDetailBranch onChange={(b: string) => {
        setCurrentBranch(b);
      }}
      />
      <div>
        <List
          size="small"
          header={<div>{topInfo}</div>}
          bordered
          dataSource={files}
          renderItem={(it) => (it.isBack ? (
            <List.Item>
              <Row itemType="flex" style={{ width: '100%' }}>
                <Col>
                  <div
                    className={style.fileName}
                    onClick={() => {
                      const prefixPath = subTree.split('/').slice(0, -1).join('/');
                      // console.log('subTree', prefixPath);
                      setTreePath(prefixPath);
                      if (prefixPath === '') {
                        navigate(`/${user}/${repoName}`);
                      } else {
                        navigate(`/${user}/${repoName}/tree/${currentBranch}/${prefixPath}`);
                      }
                    }}
                  >
                    {it.name}
                  </div>
                </Col>
              </Row>
            </List.Item>
          ) : (
            <List.Item>
              <Row itemType="flex" style={{ width: '100%' }}>
                <Col style={{ width: 16, marginRight: 8 }}>
                  {
               it.isTree ? <FolderFilled style={{ color: '#54aeff' }} />
                 : <FileOutlined />
}
                </Col>
                <Col style={{ flex: 1 }}>
                  <div
                    className={style.fileName}
                    onClick={() => {
                      if (it.isTree) {
                        setTreePath(subTree ? `${subTree}/${it.name}` : it.name);
                        if (branch === '') {
                          navigate(`/${user}/${repoName}/tree/${currentBranch}/${it.name}`);
                        } else {
                          navigate(`${pathname}/${it.name}`);
                        }
                      } else if (branch === '') {
                        navigate(`/${user}/${repoName}/blob/${currentBranch}/${it.name}`);
                      } else {
                        navigate(`${pathname.replace(`/${user}/${repoName}/tree`, `/${user}/${repoName}/blob`)}/${it.name}`);
                      }
                    }}
                  >
                    {it.name}

                  </div>
                </Col>
                <Col style={{ flex: 1 }}>
                  <span
                    className={style.fileName}
                    onClick={() => {
                      navigate(`/${user}/${repoName}/commit/${it.commitHash}`);
                    }}
                  >
                    {it.commitMsg}
                  </span>
                </Col>
                <Col style={{ width: 100, textAlign: 'right' }}>{moment(it.commitTime).fromNow()}</Col>
              </Row>
            </List.Item>
          ))}
        />
      </div>
      {readmeContent && (
      <Box
        className={style.boxSpace}
        header={<div>README.md</div>}
      >
        <RenderMarkdown
          data={readmeContent}
        />
      </Box>
      )}
    </div>
  );
}

export default RepoDir;
