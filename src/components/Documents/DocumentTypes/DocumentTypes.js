import React, { useEffect, useState } from 'react';
import useToken from '../../../useToken';
import _ from 'lodash';

async function returnDocumentTypes(credentials) {
    return fetch('http://localhost:5053/document-types', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': credentials.token
        }
    }).then(r=>r.json())
}

function DocumentTypes() {
    const { token, setToken } = useToken();
    const [data, setData] = useState([]);

    async function Exec() {
        return await returnDocumentTypes({
            token
        });
    }

    useEffect(() => {
        const d = Exec();
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

export default DocumentTypes;