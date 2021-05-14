import React, { useEffect, useState } from 'react';
import useToken from '../../../useToken';
import _ from 'lodash';

async function returnDocumentTypes(credentials) {
    return fetch('http://localhost:5053/document-types/name'+credentials.name, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': credentials.token
        }
    }).then(r=>r.json())
}

function DocumentTypesName() {
    const { token, setToken } = useToken();
    const [data, setData] = useState([]);

    async function Exec(name) {
        return await returnDocumentTypes({
            token,
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