// Searches value by key-value

import React, { useEffect, useState } from 'react';
import useToken from '../../../useToken';
import useCurrentGeo from '../../../useCurrentGeo';
import _ from 'lodash';

async function findAllMetadataWithConditions(credentials) {
    return fetch('http://metadata-haos.apps.ocp-t.sberbank.kz/metadata/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': credentials.token,
            'Geo': credentials.currentGeo
        },
        body: JSON.stringify(JSON.stringify(credentials.metadata))
    }).then(r=>r.json())
}

function FindAllWithConditions() {
    const { token, setToken } = useToken();
    const { currentGeo, setCurrentGeo } = useCurrentGeo();

    async function Exec(metadata) {
        return await findAllMetadataWithConditions({
            token,
            currentGeo,
            metadata
        });
    }

    useEffect(() => {
        let url = window.location.href;
        let metadata = url.substr(url.lastIndexOf('search') + 'search'.length, url.length - url.lastIndexOf('search'))
        console.log(metadata)
        const d = Exec(metadata);
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

export default FindAllWithConditions;