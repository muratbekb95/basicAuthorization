import React, { useEffect, useState } from 'react';
import useToken from '../../../useToken';
import _ from 'lodash';

async function returnDocumentTypes(credentials) {
    return fetch('http://localhost:5053/document-types'+credentials.parentId+'/nodes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': credentials.token
        }
    }).then(r=>r.json())
}

function DocumentTypesParentIdNodes() {
    const { token, setToken } = useToken();
    const [data, setData] = useState([]);

    async function Exec(parentId) {
        return await returnDocumentTypes({
            token,
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