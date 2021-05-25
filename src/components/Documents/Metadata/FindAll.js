import React, { useEffect, useState } from 'react';
import useToken from '../../../useToken';
import useCurrentGeo from '../../../useCurrentGeo';
import _ from 'lodash';

async function findAllMetadata(credentials) {
    return fetch('http://metadata-haos.apps.ocp-t.sberbank.kz/metadata', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': credentials.token,
            'Geo': credentials.currentGeo
        }
    }).then(r=>r.json())
}

function FindAll() {
    const { token, setToken } = useToken();
    const { currentGeo, setCurrentGeo } = useCurrentGeo();

    async function Exec() {
        return await findAllMetadata({
            token,
            currentGeo
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

export default FindAll;