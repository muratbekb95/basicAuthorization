import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './App.css';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Preferences from './components/Documents/DocumentEditor/DocumentUpload/DocumentUpload';
import DocumentEditor from './components/Documents/DocumentEditor/DocumentEditor'

import DocumentTypes from './components/Documents/DocumentTypes/DocumentTypes';
import DocumentTypesName from './components/Documents/DocumentTypes/DocumentTypesName';
import DocumentTypesRootAll from './components/Documents/DocumentTypes/DocumentTypesRootAll';
import DocumentTypesDocId from './components/Documents/DocumentTypes/DocumentTypesDocId';
import DocumentTypesParentIdNodes from './components/Documents/DocumentTypes/DocumentTypesParentIdNodes';

import FindAllWithFullSearching from './components/Documents/Metadata/FindAllWithFullSearching';
import FindAllWithTextSearching from './components/Documents/Metadata/FindAllWithTextSearching';
import FindAllWithConditions from './components/Documents/Metadata/FindAllWithConditions';
import GetFileMetadata from './components/Documents/Metadata/GetFileMetadata';
import FindAll from './components/Documents/Metadata/FindAll';

import Search from './components/Documents/Search';
import DownloadUpload from './components/Documents/DownloadUpload';
import useToken from './useToken';
import useGeo from './useGeo';
import useLogin from './useLogin';

import { Redirect } from "react-router-dom";

function App() {

  const { token, setToken } = useToken();
  const { geo, setGeo } = useGeo();
  const {login, setLogin} = useLogin();

  if(!token && !geo && !login) {
    return <Login setToken={setToken} setGeo={setGeo} setLogin={setLogin} />;
  }

  return (
    <div className="wrapper">
      <h1>Application</h1>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            {<Redirect to="/document-editor" />}
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/preferences">
            <Preferences />
          </Route>

          <Route path="/document-types/root/all">
            <DocumentTypesRootAll />
          </Route>
          <Route path="/document-types/:parentId/nodes">
            <DocumentTypesParentIdNodes />
          </Route>
          <Route path="/document-types/name/:name">
            <DocumentTypesName />
          </Route>
          <Route path="/document-types/:docId">
            <DocumentTypesDocId />
          </Route>
          <Route path="/document-types">
            <DocumentTypes />
          </Route>
          
          <Route path="/metadata/search/full">
            <FindAllWithFullSearching />
          </Route>
          <Route path="/metadata/search/text">
            <FindAllWithTextSearching />
          </Route>
          <Route path="/metadata/search/:search">
            <FindAllWithConditions />
          </Route>
          <Route path="/metadata/:metadata_id">
            <GetFileMetadata />
          </Route>
          <Route path="/metadata">
            <FindAll />
          </Route>

          <Route path="/document-editor">
            <DocumentEditor />
          </Route>
          <Route path="/search">
            <Search />
          </Route>
          <Route path="/download-upload">
            <DownloadUpload />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
