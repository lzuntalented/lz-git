import React, { useEffect, useRef, useState } from 'react';
import {
  Select, List, Col, Row,
} from 'antd';
import {
  useLocation, useNavigate, useParams,
} from 'react-router-dom';
import { FileOutlined, FolderFilled, FolderOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import { getBranch, getFileContent, getFilesWithPath } from '../../../services/repo';
import style from './index.module.css';
import './index.css';
import RenderMarkdown from '../../../components/render-markdown';
import Box from '../../../components/box';

interface ListItemData {
  isTree: boolean, hash: string, name: string
  commitMsg?: string
  commitTime?: string
  isBack?: boolean
}

function RepoFile() {
  const location = useLocation();

  const {
    user = '', repoName = '', branch = '', ...o
  } = useParams();
  const subTree = Object.values(o).join();
  const { pathname } = location;
  console.log(location, o, subTree);
  const [branchList, setBranchList] = useState([] as {label: string, value: string}[]);
  const [currentBranch, setCurrentBranch] = useState(branch);
  const [files, setFiles] = useState([] as ListItemData[]);
  const [treePath, setTreePath] = useState(subTree);
  const [readmeContent, setReadmeContent] = useState('');
  const navigate = useNavigate();
  const codeRef = useRef<HTMLDivElement>(null);
  const [fileContent, setFileContent] = useState('');

  useEffect(() => {
    if (branch) {
      getFileContent(user, repoName, currentBranch, treePath).then((r) => {
        setFileContent(r);
        if (codeRef.current) {
          Codemirror(codeRef.current, {
            value: r,
            lineNumbers: true,
            readOnly: true,
            mode: 'javascript',
          });
        }
      });
    }
  }, [branch, treePath]);

  return (
    <div className={style.page}>
      <div>
        {subTree.endsWith('.md') ? (
          <Box header="header">
            <RenderMarkdown data={fileContent} />
          </Box>
        ) : (
          <List
            size="small"
            header={<div>Header</div>}
            bordered
            dataSource={[1]}
            renderItem={(it) => (
              <List.Item>
                <div className="page-repo-file" ref={codeRef} />
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );
}

export default RepoFile;
