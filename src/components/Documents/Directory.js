import React, { useEffect, useState, createRef } from 'react';
import useToken from '../../useToken';
import '../../static/css/Menu.css';

async function returnAllDocTypes(credentials) {
    return fetch('http://localhost:5053/document-types/root/all', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': credentials.token
        }
    }).then(r=>r.json())
}

function Directory() {
    const { token, setToken } = useToken();
    const [data, setData] = useState([]);

    function build_chain(r, m, arr) {
        var BreakException = {};
        try {
            arr.forEach(d => {
                if(r.parentId === "") {
                    m.push(r);
                    throw BreakException;
                }
                if(r.parentId === d.id) {
                    m.push(r);
                    build_chain(d, m, arr);
                    throw BreakException;
                }
            })
        } catch(e) {
            if (e!==BreakException) throw e;
        }
        return m;
    }

    var objects = [];
    function recursive(r, m) {
        var one = [];
        for(const[k,v] of Object.entries(r)) {            
            if (typeof v == 'object') {
                objects.push(k);
                recursive(v, m)
            } else {
                var dd = {};
                dd[k] = v;
                if(objects.length > 0) {
                    one.push(dd);
                } else {
                    m.push(dd);
                }
            }
        }
        if(objects.length > 0) {
            var dd = {};
            var val = objects.pop();
            dd[val] = one;
            m.push(dd);
        }
        return m
    }

    async function Comp() {
        return await returnAllDocTypes({
            token
        });
    }

    useEffect(() => {
        const d = Comp();
        d.then(function(result) {
            const arr = [
                {
                    id: "076b114a-0e8e-4995-a18e-201521fdedc1",
                    docType: "string",
                    docStructure: {"iin":"required"},
                    version: "string",
                    parentId: "",
                    deepestNode: true
                },
                {
                    id: "bb2501e5-ef16-4982-b06c-f84882b5fb3e",
                    docType: "string",
                    docStructure: {"iin": "required", "person": {"name": "required"}},
                    version: "string",
                    parentId: "",
                    deepestNode: true
                },
                {
                    id: "bb0a253e-d1f2-4ca2-8c13-f05b9d08359a",
                    docType: "string",
                    docStructure: {},
                    version: "string",
                    parentId: "",
                    deepestNode: true
                },
                {
                    id: "20f5a43c-a639-11eb-bcbc-0242ac130002",
                    docType: "string",
                    docStructure: {"iin": "", "good": "required", "person": {"name": "required"}},
                    version: "string",
                    parentId: "bb0a253e-d1f2-4ca2-8c13-f05b9d08359a",
                    deepestNode: true
                },
                {
                    id: "9f25ae26-a66e-11eb-bcbc-0242ac130002",
                    docType: "string",
                    docStructure: {},
                    version: "string",
                    parentId: "bb0a253e-d1f2-4ca2-8c13-f05b9d08359a",
                    deepestNode: true
                },
                {
                    id: "288f55a8-a639-11eb-bcbc-0242ac130002",
                    docType: "string",
                    docStructure: {},
                    version: "string",
                    parentId: "",
                    deepestNode: true
                },
                {
                    id: "400e49be-a639-11eb-bcbc-0242ac130002",
                    docType: "string",
                    docStructure: {"iin": "required", "good": "", "person": {"name": "required"}},
                    version: "string",
                    parentId: "076b114a-0e8e-4995-a18e-201521fdedc1",
                    deepestNode: true
                },
                {
                    id: "30c92410-a639-11eb-bcbc-0242ac130002",
                    docType: "string",
                    docStructure: {},
                    version: "string",
                    parentId: "076b114a-0e8e-4995-a18e-201521fdedc1",
                    deepestNode: true
                },
                {
                    id: "772b18b4-a639-11eb-bcbc-0242ac130002",
                    docType: "string",
                    docStructure: {"ip": "required", "type": "required", "terms": {"id": "required", "scope": "required", "partner": {"id": "required", "title": "required", "externalId": "required"}, "version": "required", "activity": "required", "beginDate": "required", "documentID": "required", "publickLink": "required", "termVersionID": "required"}, "customer": {"id": "required", "iin": "required", "phone": "required", "surname": "required", "firstname": "required", "externalId": "required"}, "location": "required", "beginDate": "required", "initiator": {"ip": "required", "system": "required", "userName": "required", "userSurname": "required", "userExternalId": "required"}, "expirationDate": "required", "revocationDate": "required"},
                    version: "string",
                    parentId: "30c92410-a639-11eb-bcbc-0242ac130002",
                    deepestNode: true
                },
                {
                    id: "8091a08a-a639-11eb-bcbc-0242ac130002",
                    docType: "string",
                    docStructure: {},
                    version: "string",
                    parentId: "",
                    deepestNode: true
                },
                {
                    id: "8512f370-a639-11eb-bcbc-0242ac130002",
                    docType: "string",
                    docStructure: {"ip": "required", "type": "required", "terms": {"id": "required", "scope": "required", "partner": {"id": "required", "title": "required", "externalId": "required"}, "version": "required", "activity": "required", "beginDate": "required", "documentID": "required", "publickLink": "required", "termVersionID": "required"}, "customer": {"id": "required", "iin": "required", "phone": "required", "surname": "required", "firstname": "required", "externalId": "required"}, "location": "required", "beginDate": "required", "initiator": {"ip": "required", "system": "required", "userName": "required", "userSurname": "required", "userExternalId": "required"}, "expirationDate": "required", "revocationDate": "required"},
                    version: "string",
                    parentId: "",
                    deepestNode: true
                },
                {
                    id: "9019c17c-a639-11eb-bcbc-0242ac130002",
                    docType: "string",
                    docStructure: {},
                    version: "string",
                    parentId: "30c92410-a639-11eb-bcbc-0242ac130002",
                    deepestNode: true
                },
                {
                    id: "94dd5fde-a639-11eb-bcbc-0242ac130002",
                    docType: "string",
                    docStructure: {},
                    version: "string",
                    parentId: "20f5a43c-a639-11eb-bcbc-0242ac130002",
                    deepestNode: true
                },
                {
                    id: "a04c3160-a639-11eb-bcbc-0242ac130002",
                    docType: "string",
                    docStructure: {},
                    version: "string",
                    parentId: "076b114a-0e8e-4995-a18e-201521fdedc1",
                    deepestNode: true
                }
            ]
            if (arr.length > 0) {
                var chain_of_nodes = [];
                var m = [];
                arr.forEach(r => {
                    if(r.parentId != "" && r.parentId != null) {
                        var m = [];
                        chain_of_nodes.push(Array.from(new Set(build_chain(r, m, arr))));
                        m = [];
                    }
                })

                if(chain_of_nodes.length > 0) {
                    var chainData = []
                    chain_of_nodes.forEach(node => {
                        var chainNode = []
                        node.forEach(n => {
                            if(!(Object.entries(n.docStructure).length === 0)) {
                                m = Array.from(new Set(recursive(n.docStructure, m)));    
                            }
                            chainNode.push({id: n.id, docType: n.docType, docStructure: m, version: n.version, parentId: n.parentId, deepestNode: n.deepestNode});
                            m = [];
                        })
                        chainData.push(chainNode)
                    })
                    setData(chainData);
                }
            }
        });
    }, []);

    return (
        <div className="container">
            <div>
                <h2>Doctypes</h2>
            </div>
            <div>
                {data.map(d => (
                    <div className="container-chain">
                        {d.map((key, i) => (
                            <div className="container-chain-form-block">
                                <h1>{key.id}</h1>
                                <form className="container-form">
                                    {key.docStructure.map(obj => (
                                        typeof Object.values(obj)[0] == 'object' ? Object.keys(obj).map(k => (
                                            <div className="container-form-content">
                                                {isNaN(k) && <h1>{k}</h1>}:<br/>
                                            </div>                                 
                                        )) : Object.keys(obj).map(k => (
                                            <div className="container-form-content">
                                                {isNaN(k) && k}: &nbsp;
                                                {isNaN(k) && obj[k] == 'required' ? <input type="text" required></input> : <input type="text"></input>}<br/><br/><br/>
                                            </div>
                                        ))
                                    ))}
                                    <input className="submit" type="submit" value="Submit"/><br/><br/>
                                </form>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Directory;