import React, { useEffect, useState } from 'react';
import useToken from '../../../useToken';
import '../../../static/css/Menu.css';
import _ from 'lodash';

async function findAllMetadata(credentials) {
    return fetch('http://localhost:9090/metadata', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': credentials.token
        }
    }).then(r=>r.json())
}

function FindAll() {
    const { token, setToken } = useToken();
    const [data, setData] = useState([]);

    async function Exec() {
        return await findAllMetadata({
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

export default FindAll;