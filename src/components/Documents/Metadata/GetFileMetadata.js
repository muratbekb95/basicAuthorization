import React, { useEffect, useState } from 'react';
import useToken from '../../../useToken';
import '../../../static/css/Menu.css';
import _ from 'lodash';

async function getFileMetadata(credentials) {
    return fetch('http://localhost:9090/metadata/' + credentials.metadata_id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': credentials.token
        }
    }).then(r=>r.json())
}

function GetFileMetadata() {
    const { token, setToken } = useToken();
    const [data, setData] = useState([]);

    async function Exec(metadata_id) {
        return await getFileMetadata({
            token,
            metadata_id
        });
    }

    useEffect(() => {
        let url = window.location.href;
        let urlStr = url.substr(url.lastIndexOf('metadata/') + 'metadata/'.length, url.length - url.lastIndexOf('metadata/'))
        const d = Exec(urlStr);
        d.then(function(result) {
            if (result.length > 0 || result != null || result != "") {
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

export default GetFileMetadata;