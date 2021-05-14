// Searches value only in metadata field

import React, { useEffect, useState } from 'react';
import useToken from '../../../useToken';
import _ from 'lodash';

async function findAllMetadataWithTextSearching(credentials) {
    var arr = credentials.searchParam.split(/[ ,]+/);
    console.log(arr)
    return fetch('http://localhost:9090/metadata/search/text', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': credentials.token
        },
        body: JSON.stringify(arr)
    }).then(r=>r.json())
}

function FindAllWithTextSearching() {
    const { token, setToken } = useToken();
    const [data, setData] = useState([]);

    async function Exec(searchParam) {
        return await findAllMetadataWithTextSearching({
            token,
            searchParam
        });
    }

    useEffect(() => {
        let url = window.location.href;
        let searchParam = url.substr((url.lastIndexOf('search=') + 'search='.length), url.length - url.lastIndexOf('search='))
        const d = Exec(searchParam);
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

export default FindAllWithTextSearching;