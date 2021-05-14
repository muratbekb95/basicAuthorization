import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import sberbankLogo from "../../../static/img/sberbank-logo.png"

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import Dashboard from '../../Dashboard/Dashboard';
import "../DocumentEditor/DocumentEditor.css"
import DocumentUpload from './DocumentUpload/DocumentUpload';
import DocumentSearch from './DocumentSearch/DocumentSearch';

import useGeo from '../../../useGeo';

export default function DocumentEditor() {
    const usernameString = sessionStorage.getItem('username');
    const userUsername = JSON.parse(usernameString);

    const { geo, setGeo } = useGeo();
    
    return (
        <div className="container">
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#">
                        <img src={sberbankLogo} alt="Логотип Сбербанка" />
                    </a>
                    <form class="mx-5 d-flex">
                        <input class="form-control me-2" type="search" placeholder="Поиск" aria-label="Поиск"/>
                            <button class="btn btn-outline-success" type="submit">Поиск</button>
                    </form>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Dropdown
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    {geo.map(g => {
                                        <li><button class="dropdown-item" onClick={console.log()}>{g}</button></li>
                                    })}
                                </ul>
                            </li>
                            <li class="nav-item">
                                <p class="lead" tabindex="-1" aria-disabled="true" dangerouslySetInnerHTML={{__html: userUsername}}></p>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <br/>
            <BrowserRouter>
                <Switch>
                    <Route render={({ location, history }) => (
                        <React.Fragment>
                            <SideNav
                                onSelect={(selected) => {
                                    const to = '/' + selected;
                                    if (location.pathname !== to) {
                                        history.push(to);
                                    }
                                }}
                            >
                                <SideNav.Toggle />
                                <SideNav.Nav defaultSelected="home">
                                    <NavItem eventKey="doc-upload">
                                        <NavIcon>
                                            <i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em' }} />
                                        </NavIcon>
                                        <NavText>
                                            Загрузка документов
                                        </NavText>
                                    </NavItem>
                                    <NavItem eventKey="doc-search">
                                        <NavIcon>
                                            <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />
                                        </NavIcon>
                                        <NavText>
                                            Поиск документов
                                        </NavText>
                                    </NavItem>
                                    <NavItem eventKey="template-upload">
                                        <NavIcon>
                                            <i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em' }} />
                                        </NavIcon>
                                        <NavText>
                                            Загрузка шаблонов
                                        </NavText>
                                    </NavItem>
                                    <NavItem eventKey="work-with-archives">
                                        <NavIcon>
                                            <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />
                                        </NavIcon>
                                        <NavText>
                                            Работа с архивом
                                        </NavText>
                                    </NavItem>
                                </SideNav.Nav>
                            </SideNav>
                            <main className="content">
                                <Route path="/" exact component={props => <Dashboard />} />
                                <Route path="/doc-upload" component={props => <DocumentUpload />} />
                                <Route path="/doc-search" component={props => <DocumentSearch />} />
                            </main>
                        </React.Fragment>
                    )}
                    />
                </Switch>
            </BrowserRouter>
        </div>
    );
}