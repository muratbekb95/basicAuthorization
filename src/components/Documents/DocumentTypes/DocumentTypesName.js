import React, { useEffect, useState } from 'react';
import useToken from '../../../useToken';
import useCurrentGeo from '../../../useCurrentGeo';
import _ from 'lodash';

async function returnDocumentTypes(credentials) {
    return fetch('http://doctype-haos.apps.ocp-t.sberbank.kz/document-types/name'+credentials.name, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': credentials.token,
            'Geo': credentials.currentGeo
        }
    }).then(r=>r.json())
}

function DocumentTypesName() {
    const { token, setToken } = useToken();
    const { currentGeo, setCurrentGeo } = useCurrentGeo();

    async function Exec(name) {
        return await returnDocumentTypes({
            token,
            currentGeo,
            name
        });
    }

    useEffect(() => {
        let url = window.location.href;
        console.log(url)
        let urlStr = url.substr(url.lastIndexOf('/'), url.length-url.lastIndexOf('/'))
        const d = Exec(urlStr);
        d.then(function(result) {
            console.log(result)
            if (result.length > 0) {
                console.log(result);
            }
        });
    })

    return (
        <div className="container">
            <div>
                <h2>Document Types</h2>
            </div>
            {/* <div className="app">
            <div> */}
        </div>
    );
}

export default DocumentTypesName;