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
                    docStructure: {},
                    version: "string",
                    parentId: "",
                    deepestNode: true
                },
                {
                    id: "bb2501e5-ef16-4982-b06c-f84882b5fb3e",
                    docType: "string",
                    docStructure: {},
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
                    docStructure: {},
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
                    docStructure: {},
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
                    docStructure: {},
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
                    docStructure: {},
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
                arr.forEach(r => {
                    if(r.parentId == null || r.parentId == "") {
                        let ds = {id: r.id, docType: r.docType, docStructure: r.docStructure, version: r.version, parentId: r.parentId, deepestNode: r.deepestNode};
                        setData(data => [...data, {
                            ds: ds,
                            next: null
                        }]);
                    }
                });
                arr.forEach(r => {
                    if(r.parentId != null && r.parentId != "") {
                        arr.forEach((d, idx) => {
                            if(d.id == r.parentId && d.parentId == null || d.parentId == "") {
                                let ds = {id: d.id, docType: d.docType, docStructure: d.docStructure, version: d.version, parentId: d.parentId, deepestNode: d.deepestNode}; // parent
                                let nextDs = {id: r.id, docType: r.docType, docStructure: r.docStructure, version: r.version, parentId: r.parentId, deepestNode: r.deepestNode}; // child
                                const dataArr = Array.from(data);
                                dataArr[idx] = {ds: ds, next: {ds: nextDs, next: null}}
                                setData(dataArr);
                            } else {
                                /*let ds = {id: d.id, docType: d.docType, docStructure: d.docStructure, version: d.version, parentId: d.parentId, deepestNode: d.deepestNode};
                                let nextDs = {id: r.id, docType: r.docType, docStructure: r.docStructure, version: r.version, parentId: r.parentId, deepestNode: r.deepestNode};
                                setData(data => [...data, {
                                    ds: ds,
                                    next: {ds: nextDs, next: null}
                                }]);*/
                            }
                        });
                    }
                });
            }
        });
    }, []);

    return (
        <div className="container">
            <div>
                <h2>Doctypes</h2>
            </div>
            {
                <div className="navbar">
                    {data.map(d => {
                        if(d.next != null) {
                            console.log("id: " + d.ds.id + ", next id: " + d.next.ds.id)
                        }
                        //return <a href="#" key={d.ds.id}>id: {d.ds.id}</a>
                    })}
                    {/* if (d.parentId == null || d.parentId == "") {
                        return <a href="#" key={d.id}>id: {d.id}</a>
                    } */}
                    {/* Displays only elements with parent id */}
                    {/* {data.map((d => {
                        data.map((z, index) => {
                            if(z.parentId == d.parentId) {
                                
                                <div className="dropdown">
                                    <button className="dropbtn" key={z.id}>{z.id}
                                        <i className="fa fa-caret-down"></i>
                                    </button>
                                    <div className="dropdown-content">
                                        <a href=""></a>
                                    </div>
                                </div>
                            }
                        });
                    }))} */}
                </div>
            }
        </div>
    );
}

export default Directory;