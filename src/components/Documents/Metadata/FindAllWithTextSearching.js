// Searches value only in metadata field

import React, { useEffect, useState } from 'react';
import useToken from '../../../useToken';
import useCurrentGeo from '../../../useCurrentGeo';
import _ from 'lodash';

async function findAllMetadataWithTextSearching(credentials) {
    var arr = credentials.searchParam.split(/[ ,]+/);
    console.log(arr)
    return fetch('http://metadata-haos.apps.ocp-t.sberbank.kz/metadata/search/text', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': credentials.token,
            'Geo': credentials.currentGeo
        },
        body: JSON.stringify(arr)
    }).then(r=>r.json())
}

function FindAllWithTextSearching() {
    const { token, setToken } = useToken();
    const { currentGeo, setCurrentGeo } = useCurrentGeo();

    async function Exec(searchParam) {
        return await findAllMetadataWithTextSearching({
            token,
            currentGeo,
            searchParam
        });
    }

    useEffect(() => {
        let url = window.location.href;
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

export default FindAllWithTextSearching;