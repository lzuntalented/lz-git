import React, { useContext, useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import {
  Col, Layout, Menu, Row, Spin,
} from 'antd';
import RepoCreate from './pages/repo/create';
import './App.css';
import 'antd/dist/antd.css';
import RepoList from './pages/repo/list';
import RepoDir from './pages/repo/detail';
import RepoSetting from './pages/repo/setting';
import RepoDetailNav from './components/repo-detail-nav';
import RepoSettingNav from './components/repo-setting-nav';
import RepoHooks from './pages/repo/hooks';
import RepoFile from './pages/repo/file';
import Install from './pages/install';
import Register from './pages/user/signup';
import Login from './pages/user/login';
import { info } from './services/user';
import Home from './pages/home';
import { GlobalProvider, UserInfo } from './context';
import Header from './components/header';
import Auth from './components/auth';

const LOADING_INIT = -1;
const LOADING_ING = 0;
const LOADING_END = 1;

function App() {
  const [globalState, setState] = useState<UserInfo>();
  const [loading, setLoading] = useState(LOADING_INIT);

  useEffect(() => {
    setLoading(LOADING_ING);
    info().then((r) => {
      setState(r);
    }).finally(() => setLoading(LOADING_END));
  }, []);
  return (
    (LOADING_END) ? (
      <GlobalProvider value={{ userInfo: globalState || {} as UserInfo }}>
        <div className="App">
          <BrowserRouter>
            <Layout>
              <Header />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/install" element={<Install />} />
                <Route path="/create" element={<Auth><RepoCreate /></Auth>} />
                <Route path="/:user" element={<RepoList />} />
                <Route path="/:user/:repoName" element={<RepoDetailNav />}>
                  <Route path="setting" element={<RepoSettingNav />}>
                    <Route path="hooks" element={<RepoHooks />} />
                    <Route path="*" element={<RepoSetting />} />
                  </Route>
                  <Route path="tree/:branch/*" element={<RepoDir />} />
                  <Route path="blob/:branch/*" element={<RepoFile />} />
                  <Route path="" element={<RepoDir />} />
                </Route>
                <Route path="*" element={<Home />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </div>
      </GlobalProvider>
    ) : <Spin spinning />
  );
}

export default App;
