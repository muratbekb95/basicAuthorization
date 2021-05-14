// Searches value in every field

import React, { useEffect, useState } from 'react';
import useToken from '../../../useToken';
import _ from 'lodash';

async function findAllMetadataWithFullSearching(credentials) {
    var arr = credentials.searchParam.split(/[ ,]+/);
    // console.log(arr)
    return fetch('http://localhost:9090/metadata/search/full', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': credentials.token
        },
        body: JSON.stringify(arr)
    }).then(r=>r.json())
}

function FindAllWithFullSearching() {
    const { token, setToken } = useToken();
    const [data, setData] = useState([]);

    async function Exec(searchParam) {
        return await findAllMetadataWithFullSearching({
            token,
            searchParam
        });
    }

    useEffect(() => {
        let url = window.location.href;
        console.log(url)
        let searchParam = url.substr((url.lastIndexOf('search=') + 'search='.length), url.length - url.lastIndexOf('search='))
        const d = Exec(searchParam);
        d.then(function(result) {
            console.log(result);
            if (result.length > 0) {
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

export default FindAllWithFullSearching;