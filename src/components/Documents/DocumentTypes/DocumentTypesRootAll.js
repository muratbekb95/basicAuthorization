import React, { useEffect, useState } from 'react';
import useToken from '../../../useToken';
import useCurrentGeo from '../../../useCurrentGeo';
import '../../../static/css/DocumentTypesRootAll.css';
import _, { chain } from 'lodash';
import Collapse from "@kunukn/react-collapse";
import cx from "classnames";

async function returnDocumentTypesIdVersions(credentials) {
    return fetch('http://doctype-haos.apps.ocp-t.sberbank.kz/document-types/'+credentials.id+'/versions', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': credentials.token,
            'Geo': credentials.currentGeo
        }
    }).then(r=>r.json())
}

async function returnDocumentTypesRootAll(credentials) {
    return fetch('http://doctype-haos.apps.ocp-t.sberbank.kz/document-types/root/all', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': credentials.token,
            'Geo': credentials.currentGeo
        }
    }).then(r=>r.json())
}

function DocumentTypesRootAll() {
    const { token, setToken } = useToken();
    const { currentGeo, setCurrentGeo } = useCurrentGeo();
    const [data, setData] = useState([]);
    const [collapse, setCollapse] = useState([]);

    function build_chain(r, m, arr) {
        var BreakException = {};
        try {
            arr.forEach(d => {
                if(r.parent_id === "") {
                    m.push(r);
                    throw BreakException;
                }
                if(r.parent_id === d.id) {
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

    async function Exec() {
        return await returnDocumentTypesRootAll({
            token,
            currentGeo
        });
    }

    async function Exec2(id) {
        return await returnDocumentTypesIdVersions({
            token,
            currentGeo,
            id
        })
    }

    function saveD(chainData) {
        setData(chainData);
        var collapseArr = [];
        chainData.forEach(ch => {
            var one = [];
            ch.forEach(n => {
                one.push({isOpen: false})
            })
            collapseArr.push(one);
        })
        setCollapse(collapseArr);
    }

    useEffect(() => {
        // const d = Exec();
        // d.then(function(result) {
        //     if (result.length > 0) {
        //         var chain_of_nodes = [];
        //         var m = [];
    
        //         // construct the array of chain of nodes according to parenthood
        //         result.forEach(r => {
        //             if(r.parent_id != "" && r.parent_id != null) {
        //                 chain_of_nodes.push(Array.from(new Set(build_chain(r, m, result))));
        //                 m = [];
        //             } else {
        //                 chain_of_nodes.push([r])
        //             }
        //         })

        //         var chainData = []
        //         var collapseArr = [];
        //         // construct an array which is suitable to build forms based on final refactored array
        //         if(chain_of_nodes.length == 1) {
        //             var n = chain_of_nodes[0][0];
        //             if(!(Object.entries(n.doc_structure).length === 0)) {
        //                 m = Array.from(new Set(recursive(n.doc_structure, m)));    
        //             }
        //             chainData.push({id: n.id, doc_type: n.doc_type, doc_type_id: n.doc_type_id, doc_structure: m, version: n.version});
        //             setData(chainData);
                    
        //             collapseArr.push({isOpen: false});
        //             setCollapse(collapseArr);
        //         } else if(chain_of_nodes.length > 1) {
        //             // sort according to length
        //             var sorted_chain_of_nodes = [].concat(chain_of_nodes);
        //             sorted_chain_of_nodes.sort((a, b) => a.length < b.length ? 1 : -1)

        //             // remove duplicates in array
        //             sorted_chain_of_nodes.forEach((ch, elem) => {
        //                 sorted_chain_of_nodes.forEach((ch1, i) => {
        //                     if(ch.length > ch1.length && ch1.length != 1) {
        //                         let size = ch1.length;
        //                         var equals = true;
                                
        //                         let subChain = ch.slice(ch.length - size, size+1);
        //                         subChain.forEach((sch, idx) => {
        //                             if(_.isEqual(sch, ch1[idx]) === false) {
        //                                 equals = false;
        //                             }
        //                         })
        
        //                         if(equals) {
        //                             sorted_chain_of_nodes = sorted_chain_of_nodes.filter(x=> x != ch1);
        //                         }
        //                     }
        //                 })
        //             })

                    // sorted_chain_of_nodes.forEach(node => {
                    //     var chainNode = []
                    //     node.forEach(n => {
                    //         if(n.deepest_node) {
                    //             const d2 = Exec2(n.id);
                    //             d2.then(function(result2) {
                    //                 result2.versions.forEach(v => {
                    //                     if(!(Object.entries(v.doc_structure).length === 0)) {
                    //                         m = Array.from(new Set(recursive(v.doc_structure, m)));
                    //                     }
                    //                     chainNode.push({id: v.id, doc_type: n.doc_type, doc_type_id: v.doc_type_id, doc_structure: m, version: v.version})
                    //                     m = [];
                    //                 })
                    //             })
                    //         } else {
                    //             chainNode.push({id: n.id, doc_type: n.doc_type, doc_structure: []})
                    //         }
                    //     })
                    //     chainData.push(chainNode)
                    // })
                    
                        // if (chainData[0][0] == undefined) {
                        //     const timeout = setInterval(function() {
                        //         if(chainData[0][0] != undefined)
                        //         {
                        //             saveD(chainData)
                        //             clearInterval(timeout)
                        //         }
                        //     }, 1000)
                        // } else {
                        //     saveD(chainData)
                        // }
        //         }
        //     }
        // });
        const arr = [
            {
                id: "076b114a-0e8e-4995-a18e-201521fdedc1",
                doc_type: "CREDIT",
                parent_id: "",
                deepest_node: false
            },
            {
                id: "bb2501e5-ef16-4982-b06c-f84882b5fb3e",
                doc_type: "MORTGAGE",
                parent_id: "",
                deepest_node: false
            },
            {
                id: "bb0a253e-d1f2-4ca2-8c13-f05b9d08359a",
                doc_type: "CONSENT",
                parent_id: "",
                deepest_node: false
            },
            {
                id: "20f5a43c-a639-11eb-bcbc-0242ac130002",
                doc_type: "CONSENT",
                parent_id: "bb0a253e-d1f2-4ca2-8c13-f05b9d08359a",
                deepest_node: false
            },
            {
                id: "9f25ae26-a66e-11eb-bcbc-0242ac130002",
                doc_type: "MORTGAGE",
                parent_id: "bb2501e5-ef16-4982-b06c-f84882b5fb3e",
                deepest_node: false
            },
            {
                id: "288f55a8-a639-11eb-bcbc-0242ac130002",
                doc_type: "TAX",
                parent_id: "",
                deepest_node: false
            },
            {
                id: "400e49be-a639-11eb-bcbc-0242ac130002",
                doc_type: "TAX",
                parent_id: "a04c3160-a639-11eb-bcbc-0242ac130002",
                deepest_node: true
            },
            {
                id: "30c92410-a639-11eb-bcbc-0242ac130002",
                doc_type: "CREDIT",
                parent_id: "076b114a-0e8e-4995-a18e-201521fdedc1",
                deepest_node: false
            },
            {
                id: "772b18b4-a639-11eb-bcbc-0242ac130002",
                doc_type: "CREDIT",
                parent_id: "30c92410-a639-11eb-bcbc-0242ac130002",
                deepest_node: true
            },
            {
                id: "8091a08a-a639-11eb-bcbc-0242ac130002",
                doc_type: "INVESTMENT",
                parent_id: "",
                deepest_node: false
            },
            {
                id: "8512f370-a639-11eb-bcbc-0242ac130002",
                doc_type: "SHARE",
                parent_id: "",
                deepest_node: false
            },
            {
                id: "9019c17c-a639-11eb-bcbc-0242ac130002",
                doc_type: "MORTGAGE",
                parent_id: "9f25ae26-a66e-11eb-bcbc-0242ac130002",
                deepest_node: true
            },
            {
                id: "3d0f1c9a-b7ad-11eb-8529-0242ac130003",
                doc_type: "CREDIT",
                parent_id: "30c92410-a639-11eb-bcbc-0242ac130002",
                deepest_node: true
            },
            {
                id: "94dd5fde-a639-11eb-bcbc-0242ac130002",
                doc_type: "CONSENT",
                parent_id: "20f5a43c-a639-11eb-bcbc-0242ac130002",
                deepest_node: true
            },
            {
                id: "a04c3160-a639-11eb-bcbc-0242ac130002",
                doc_type: "TAX",
                parent_id: "288f55a8-a639-11eb-bcbc-0242ac130002",
                deepest_node: false
            },
            {
                id: "a08a22f2-b7ac-11eb-8529-0242ac130003",
                doc_type: "TAX",
                parent_id: "288f55a8-a639-11eb-bcbc-0242ac130002",
                deepest_node: false
            },
            {
                id: "c508cfc0-b7ac-11eb-8529-0242ac130003",
                doc_type: "TAX",
                parent_id: "a08a22f2-b7ac-11eb-8529-0242ac130003",
                deepest_node: true
            },
            {
                id: "b7906c38-b7af-11eb-8529-0242ac130003",
                doc_type: "CONSENT",
                parent_id: "20f5a43c-a639-11eb-bcbc-0242ac130002",
                deepest_node: true
            }
        ]
        
        if (arr.length > 0) {
            var chain_of_nodes = [];
            var m = [];
        
            // construct the array of chain of nodes according to parenthood
            arr.forEach(r => {
                if(r.parent_id != "" && r.parent_id != null) {
                    chain_of_nodes.push(Array.from(new Set(build_chain(r, m, arr))));
                    m = [];
                } else {
                    chain_of_nodes.push([r])
                }
            })
        
            var chainData = []
            var collapseArr = [];
            // construct an array which is suitable to build forms based on final refactored array
            if(chain_of_nodes.length == 1) {
                var n = chain_of_nodes[0][0];
                if(!(Object.entries(n.doc_structure).length === 0)) {
                    m = Array.from(new Set(recursive(n.doc_structure, m)));    
                }
                chainData.push({id: n.id, doc_type: n.doc_type, doc_type_id: n.doc_type_id, doc_structure: m, version: n.version});
                setData(chainData);
                
                collapseArr.push({isOpen: false});
                setCollapse(collapseArr);
            } else if(chain_of_nodes.length > 1) {
                // sort according to length
                var sorted_chain_of_nodes = [].concat(chain_of_nodes);
                sorted_chain_of_nodes.sort((a, b) => a.length < b.length ? 1 : -1)
        
                // remove duplicates in array
                sorted_chain_of_nodes.forEach((ch, elem) => {
                    sorted_chain_of_nodes.forEach((ch1, i) => {
                        if(ch.length > ch1.length && ch1.length != 1) {
                            let size = ch1.length;
                            var equals = true;
                            
                            let subChain = ch.slice(ch.length - size, size+1);
                            subChain.forEach((sch, idx) => {
                                if(_.isEqual(sch, ch1[idx]) === false) {
                                    equals = false;
                                }
                            })
        
                            if(equals) {
                                sorted_chain_of_nodes = sorted_chain_of_nodes.filter(x=> x != ch1);
                            }
                        }
                    })
                })
        
                sorted_chain_of_nodes.forEach(node => {
                    var chainNode = []
                    node.forEach(n => {
                        if (n.deepest_node) {
                            const arr2 = [
                                {
                                    "id": "400e49be-a639-11eb-bcbc-0242ac130002",
                                    "data": [
                                        {
                                            "id": "73a41174-b7b3-11eb-8529-0242ac130003",
                                            "doc_type_id": "400e49be-a639-11eb-bcbc-0242ac130002",
                                            "doc_structure": {
                                                "iin": "required"
                                            },
                                            "version": 1
                                        },
                                        {
                                            "id": "809597ea-b7b3-11eb-8529-0242ac130003",
                                            "doc_type_id": "400e49be-a639-11eb-bcbc-0242ac130002",
                                            "doc_structure": {
                                                "consent": {
                                                    "beginDate": "required",
                                                    "customer": {
                                                        "externalId": "required",
                                                        "firstname": "required",
                                                        "id": "required",
                                                        "iin": "required",
                                                        "phone": "required",
                                                        "surname": ""
                                                    },
                                                    "expirationDate": "required",
                                                    "id": "required",
                                                    "iin": "required",
                                                    "initiator": {
                                                        "ip": "required",
                                                        "system": "required",
                                                        "userExternalId": "required",
                                                        "userName": "required",
                                                        "userSurname": ""
                                                    },
                                                    "ip": "required",
                                                    "location": "required",
                                                    "revocationDate": "required",
                                                    "terms": {
                                                        "activity": "",
                                                        "beginDate": "required",
                                                        "documentID": "required",
                                                        "id": "required",
                                                        "partner": {
                                                            "externalId": "required",
                                                            "id": "required",
                                                            "title": "required"
                                                        },
                                                        "publicLink": "required",
                                                        "scope": "required",
                                                        "termVersionID": "required",
                                                        "version": "required"
                                                    },
                                                    "type": "required"
                                                },
                                                "image_file_link": "required"
                                            },
                                            "version": 2
                                        },
                                        {
                                            "id": "86267e7c-b7b3-11eb-8529-0242ac130003",
                                            "doc_type_id": "400e49be-a639-11eb-bcbc-0242ac130002",
                                            "doc_structure": {
                                                "office": {
                                                    "officeId": "required",
                                                    "title": "required",
                                                    "location": "required",
                                                    "phone": "required",
                                                    "fax": ""
                                                }
                                            },
                                            "version": 3
                                        }
                                    ]
                                },
                                {
                                    "id": "772b18b4-a639-11eb-bcbc-0242ac130002",
                                    "data": [
                                        {
                                            "id": "20616078-b7b5-11eb-8529-0242ac130003",
                                            "doc_type_id": "772b18b4-a639-11eb-bcbc-0242ac130002",
                                            "doc_structure": {
                                                "iin": "required"
                                            },
                                            "version": 1
                                        },
                                    ]
                                },
                                {
                                    "id": "9019c17c-a639-11eb-bcbc-0242ac130002",
                                    "data": [
                                        {
                                            "id": "343eeb60-b7b5-11eb-8529-0242ac130003",
                                            "doc_type_id": "9019c17c-a639-11eb-bcbc-0242ac130002",
                                            "doc_structure": {
                                                "iin": "required",
                                                "name": "required",
                                                "telephone": "required"
                                            },
                                            "version": 1
                                        },
                                    ]
                                },
                                {
                                    "id": "3d0f1c9a-b7ad-11eb-8529-0242ac130003",
                                    "data": [
                                        {
                                            "id": "558573e8-b7b5-11eb-8529-0242ac130003",
                                            "doc_type_id": "3d0f1c9a-b7ad-11eb-8529-0242ac130003",
                                            "doc_structure": {
                                                "iin": "required",
                                                "name": "required",
                                                "telephone": "required"
                                            },
                                            "version": 1
                                        },
                                    ]
                                },
                                {
                                    "id": "94dd5fde-a639-11eb-bcbc-0242ac130002",
                                    "data": [
                                        {
                                            "id": "662ca202-b7b5-11eb-8529-0242ac130003",
                                            "doc_type_id": "94dd5fde-a639-11eb-bcbc-0242ac130002",
                                            "doc_structure": {
                                                "iin": "required",
                                                "name": "required",
                                                "telephone": "required"
                                            },
                                            "version": 1
                                        },
                                    ]
                                },
                                {
                                    "id": "c508cfc0-b7ac-11eb-8529-0242ac130003",
                                    "data": [
                                        {
                                            "id": "7b5cb568-b7b5-11eb-8529-0242ac130003",
                                            "doc_type_id": "c508cfc0-b7ac-11eb-8529-0242ac130003",
                                            "doc_structure": {
                                                "iin": "required",
                                                "name": "required",
                                                "telephone": "required"
                                            },
                                            "version": 1
                                        },
                                    ]
                                },
                                {
                                    "id": "b7906c38-b7af-11eb-8529-0242ac130003",
                                    "data": [
                                        {
                                            "id": "957249cc-b7b5-11eb-8529-0242ac130003",
                                            "doc_type_id": "b7906c38-b7af-11eb-8529-0242ac130003",
                                            "doc_structure": {
                                                "iin": "required",
                                                "name": "required",
                                                "telephone": "required"
                                            },
                                            "version": 1
                                        },
                                    ]
                                }
                            ]
                            arr2.forEach(d => {
                                if (d.id == n.id) {
                                    d.data.forEach(dd => {
                                        if (!(Object.entries(dd.doc_structure).length === 0)) {
                                            m = Array.from(new Set(recursive(dd.doc_structure, m)));
                                        }
                                        chainNode.push({ id: dd.id, doc_type: n.doc_type, doc_type_id: dd.doc_type_id, doc_structure: m, version: dd.version })
                                        m = [];
                                    })
                                }
                            })
                        } else {
                            chainNode.push({ id: n.id, doc_type: n.doc_type, doc_structure: [] })
                        }
                    })
                    chainData.push(chainNode)
                })
            
                if (chainData[0][0] == undefined) {
                    const timeout = setInterval(function() {
                        if(chainData[0][0] != undefined)
                        {
                            saveD(chainData)
                            clearInterval(timeout)
                        }
                    }, 1000)
                } else {
                    saveD(chainData)
                }
            }
        }
    }, []);

    function toggle(index, subindex) {
        let collapseArr = {...collapse};
        if(Object.keys(collapseArr).length > 1) {
            let collapseItem = {...collapse[index][subindex]};
            collapseItem.isOpen = !collapseItem.isOpen;
            collapseArr[index][subindex] = collapseItem;
            setCollapse(collapseArr)
        }
        else {
            let collapseItem = {...collapse[0]};
            collapseItem.isOpen = !collapseItem.isOpen;
            collapseArr[0] = collapseItem;
            setCollapse(collapseArr)
        }
    }

    const FormObject = ({recursive_objects}) => {
        return (recursive_objects.map(obj => (
            typeof Object.values(obj)[0] == 'object' ? Object.keys(obj).map(k => (
                <div className="container-form-content">
                    {isNaN(k) && <h6>{k}:</h6>}<br/>
                    <FormObject recursive_objects={obj[k]}/>
                </div>
            )) : Object.keys(obj).map(k => (
                <div className="container-form-subcontent">
                    {isNaN(k) && <h6>{k}:</h6>}
                    {isNaN(k) && obj[k] == 'required' ? <input type="text" required></input> : <input type="text"></input>}<br/><br/><br/>
                </div>
            ))
        )));
    }

    const Category = ({recursive_sch, index, index2}) => {

        if(collapse.length <= 0)
        {
            return <div>No Content</div>
        }

        var collapseIsOpen = false;
        if(data.length == 1) {
            collapseIsOpen = collapse[index2].isOpen;
        } else {
            collapseIsOpen = collapse[index][index2].isOpen;
        }

        return ( 
            <div className="collapse-container">
                {recursive_sch.length > 0 && 
                <div>
                    <button
                        className={cx("app__toggle", {
                            "app__toggle--active": collapseIsOpen
                        })}
                        onClick={() => toggle(index, index2)}
                    >
                        <span className="app__toggle-text">{recursive_sch[0].doc_type}</span>
                        <div className="rotate90">
                            <svg
                                className={cx("icon", { "icon--expanded": collapseIsOpen })}
                                viewBox="6 0 12 24"
                            >
                                <polygon points="8 0 6 1.8 14.4 12 6 22.2 8 24 18 12" />
                            </svg>
                        </div>
                    </button>
                    <Collapse isOpen={collapseIsOpen} className={"app__collapse app__collapse--gradient " +
                        (collapseIsOpen ? "app__collapse--active" : "")}>
                        <div className="app__content">
                            <div class="wrap-form">
                                {recursive_sch[index2].version !== undefined ?
                                    typeof Object.values(recursive_sch[index2].doc_structure) == 'object' && recursive_sch[index2].doc_structure.length > 0 &&
                                    <h5>{recursive_sch[index2].id}</h5> && 
                                    <form className="container-form">
                                        <FormObject recursive_objects={recursive_sch[index2].doc_structure} />
                                        <input className="submit" type="submit" value="Submit" /><br /><br />
                                    </form> : <h5>{recursive_sch[index2].id}</h5>
                                }
                            </div>
                            <button onClick={() => toggle(index, index2)} className="app__button">
                                close
                            </button>
                            {index2 < recursive_sch.length - 1 && <Category recursive_sch={recursive_sch} index={index} index2={index2 + 1} />}
                        </div>
                    </Collapse>
                </div>}
            </div>
        );
    }

    return (
        <div className="container">
            <div className="app">
                {data.length > 1 ? [...data].map((d, index) => (
                    <div className="wrap-container">
                        {d.length > 1 ? <Category recursive_sch={[...d].reverse()} index={index} index2={0}/> : <Category recursive_sch={d} index={index} index2={0}/>}
                    </div>
                )) : 
                <div className="wrap-container">
                    <Category recursive_sch={data} index={0} index2={0}/>
                </div>}
            </div>
        </div>
    );
}

export default DocumentTypesRootAll;