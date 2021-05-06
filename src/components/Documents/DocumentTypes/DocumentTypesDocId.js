import React, { useEffect, useState } from 'react';
import useToken from '../../../useToken';
import '../../../static/css/Menu.css';
import _ from 'lodash';

async function returnDocumentTypes(credentials) {
    return fetch('http://localhost:5053/document-types'+credentials.Id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': credentials.token
        }
    }).then(r=>r.json())
}

function DocumentTypesDocId() {
    const { token, setToken } = useToken();
    const [data, setData] = useState([]);

    async function Exec(Id) {
        return await returnDocumentTypes({
            token,
            Id
        });
    }

    useEffect(() => {
        let url = window.location.href;
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

export default DocumentTypesDocId;