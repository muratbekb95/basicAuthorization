import React, {useEffect, useState} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import sberbankLogo from "../../../static/img/sberbank-logo.png"

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import DocumentUpload from './DocumentUpload/DocumentUpload';
import DocumentSearch from './DocumentSearch/DocumentSearch';

export default function DocumentEditor() {

    const loginString = sessionStorage.getItem('login');
    const userLogin = JSON.parse(loginString);

    const geoString = sessionStorage.getItem('geo');
    const geo = JSON.parse(geoString);

    const [currentGeo, setCurrentGeo] = useState();

    useEffect(() => {
        if(geo.length != 0) {
            sessionStorage.setItem('currentGeo', JSON.stringify(geo[0]));
            setCurrentGeo(geo[0])
        }
    }, [])

    return (
        <div class="container">
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#">
                        <img src={sberbankLogo} alt="Логотип Сбербанка" />
                    </a>
                    <form class="mx-5 d-flex">
                        <input class="form-control me-2" type="search" placeholder="Поиск" aria-label="Поиск"/>
                            <button class="fa fa-search px-3" type="submit"></button>
                    </form>
                    {geo.length !=0 && 
                    <div class="navbar-nav">
                        <select id="geo" name="geo" onChange={e => {
                            setCurrentGeo(e.target.value)
                            sessionStorage.setItem('currentGeo', JSON.stringify(e.target.value));
                        }}>
                            {geo.map(g => (
                                <option value={g}>{g}</option>
                            ))}
                        </select>
                    </div>}
                    {userLogin != null &&
                    <p class="lead">{userLogin}</p>}
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
                                    <NavItem eventKey="">
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
                                <Route path="/" exact component={props => <DocumentUpload />} />
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