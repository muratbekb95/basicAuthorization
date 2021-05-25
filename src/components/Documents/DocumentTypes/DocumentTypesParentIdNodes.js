import React, { useEffect, useState } from 'react';
import useToken from '../../../useToken';
import useCurrentGeo from '../../../useCurrentGeo';
import _ from 'lodash';

async function returnDocumentTypes(credentials) {
    return fetch('http://doctype-haos.apps.ocp-t.sberbank.kz/document-types'+credentials.parentId+'/nodes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': credentials.token,
            'Geo': credentials.currentGeo
        }
    }).then(r=>r.json())
}

function DocumentTypesParentIdNodes() {
    const { token, setToken } = useToken();
    const { currentGeo, setCurrentGeo } = useCurrentGeo();

    async function Exec(parentId) {
        return await returnDocumentTypes({
            token,
            currentGeo,
            parentId
        });
    }

    useEffect(() => {
        let url = window.location.href;
        let urlStr = url.substr((url.indexOf('/document-types/') + '/document-types/'.length - 1), url.indexOf('/nodes') - (url.indexOf('/document-types/') + '/document-types/'.length-1));
        const d = Exec(urlStr);
        d.then(function(result) {
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

export default DocumentTypesParentIdNodes;