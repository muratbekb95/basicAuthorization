import React, { useEffect, useState } from 'react';
import useToken from '../../../useToken';
import useGeo from '../../../useGeo';
import '../../../static/css/DocumentTypesRootAll.css';
import _ from 'lodash';
import Collapse from "@kunukn/react-collapse";
import cx from "classnames";

async function returnDocumentTypesRootAll(credentials) {
    return fetch('http://localhost:9091/document-types/root/all', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': credentials.token,
            'Geo': credentials.geo
        }
    }).then(r=>r.json())
}

function DocumentTypesRootAll() {
    const { token, setToken } = useToken();
    const { geo, setGeo } = useGeo();
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
            geo
        });
    }

    useEffect(() => {
        const d = Exec();
        d.then(function(result) {
            const arr = [
                {
                    id: "076b114a-0e8e-4995-a18e-201521fdedc1",
                    doc_type: "string",
                    doc_structure: { "iin": "required" },
                    version: "string",
                    parent_id: "",
                    deepest_node: true
                },
                {
                    id: "bb2501e5-ef16-4982-b06c-f84882b5fb3e",
                    doc_type: "string",
                    doc_structure: { "iin": "required", "person": { "name": "required" } },
                    version: "string",
                    parent_id: "",
                    deepest_node: true
                },
                {
                    id: "bb0a253e-d1f2-4ca2-8c13-f05b9d08359a",
                    doc_type: "string",
                    doc_structure: {},
                    version: "string",
                    parent_id: "",
                    deepest_node: true
                },
                {
                    id: "20f5a43c-a639-11eb-bcbc-0242ac130002",
                    doc_type: "string",
                    doc_structure: { "iin": "", "good": "required", "person": { "name": "required" } },
                    version: "string",
                    parent_id: "bb0a253e-d1f2-4ca2-8c13-f05b9d08359a",
                    deepest_node: true
                },
                {
                    id: "9f25ae26-a66e-11eb-bcbc-0242ac130002",
                    doc_type: "string",
                    doc_structure: {},
                    version: "string",
                    parent_id: "bb0a253e-d1f2-4ca2-8c13-f05b9d08359a",
                    deepest_node: true
                },
                {
                    id: "288f55a8-a639-11eb-bcbc-0242ac130002",
                    doc_type: "string",
                    doc_structure: {},
                    version: "string",
                    parent_id: "",
                    deepest_node: true
                },
                {
                    id: "400e49be-a639-11eb-bcbc-0242ac130002",
                    doc_type: "string",
                    doc_structure: { "iin": "required", "good": "", "person": { "name": "required" } },
                    version: "string",
                    parent_id: "076b114a-0e8e-4995-a18e-201521fdedc1",
                    deepest_node: true
                },
                {
                    id: "30c92410-a639-11eb-bcbc-0242ac130002",
                    doc_type: "string",
                    doc_structure: {},
                    version: "string",
                    parent_id: "076b114a-0e8e-4995-a18e-201521fdedc1",
                    deepest_node: true
                },
                {
                    id: "772b18b4-a639-11eb-bcbc-0242ac130002",
                    doc_type: "string",
                    doc_structure: { "ip": "required", "type": "required", "terms": { "id": "required", "scope": "required", "partner": { "id": "required", "title": "required", "externalId": "required" }, "version": "required", "activity": "required", "beginDate": "required", "documentID": "required", "publickLink": "required", "termVersionID": "required" }, "customer": { "id": "required", "iin": "required", "phone": "required", "surname": "required", "firstname": "required", "externalId": "required" }, "location": "required", "beginDate": "required", "initiator": { "ip": "required", "system": "required", "userName": "required", "userSurname": "required", "userExternalId": "required" }, "expirationDate": "required", "revocationDate": "required" },
                    version: "string",
                    parent_id: "30c92410-a639-11eb-bcbc-0242ac130002",
                    deepest_node: true
                },
                {
                    id: "8091a08a-a639-11eb-bcbc-0242ac130002",
                    doc_type: "string",
                    doc_structure: {},
                    version: "string",
                    parent_id: "",
                    deepest_node: true
                },
                {
                    id: "8512f370-a639-11eb-bcbc-0242ac130002",
                    doc_type: "string",
                    doc_structure: { "ip": "required", "type": "required", "terms": { "id": "required", "scope": "required", "partner": { "id": "required", "title": "required", "externalId": "required" }, "version": "required", "activity": "required", "beginDate": "required", "documentID": "required", "publickLink": "required", "termVersionID": "required" }, "customer": { "id": "required", "iin": "required", "phone": "required", "surname": "required", "firstname": "required", "externalId": "required" }, "location": "required", "beginDate": "required", "initiator": { "ip": "required", "system": "required", "userName": "required", "userSurname": "required", "userExternalId": "required" }, "expirationDate": "required", "revocationDate": "required" },
                    version: "string",
                    parent_id: "",
                    deepest_node: true
                },
                {
                    id: "9019c17c-a639-11eb-bcbc-0242ac130002",
                    doc_type: "string",
                    doc_structure: {},
                    version: "string",
                    parent_id: "30c92410-a639-11eb-bcbc-0242ac130002",
                    deepest_node: true
                },
                {
                    id: "94dd5fde-a639-11eb-bcbc-0242ac130002",
                    doc_type: "string",
                    doc_structure: {},
                    version: "string",
                    parent_id: "20f5a43c-a639-11eb-bcbc-0242ac130002",
                    deepest_node: true
                },
                {
                    id: "a04c3160-a639-11eb-bcbc-0242ac130002",
                    doc_type: "string",
                    doc_structure: {},
                    version: "string",
                    parent_id: "076b114a-0e8e-4995-a18e-201521fdedc1",
                    deepest_node: true
                }
            ]
            console.log(result)
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
                    chainData.push({id: n.id, doc_type: n.doc_type, doc_structure: m, version: n.version, parent_id: n.parent_id, deepest_node: n.deepest_node});
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
                            if(!(Object.entries(n.doc_structure).length === 0)) {
                                m = Array.from(new Set(recursive(n.doc_structure, m)));    
                            }
                            chainNode.push({id: n.id, doc_type: n.doc_type, doc_structure: m, version: n.version, parent_id: n.parent_id, deepest_node: n.deepest_node});
                            m = [];
                        })
                        chainData.push(chainNode)
                    })
                    setData(chainData);

                    sorted_chain_of_nodes.forEach(sch => {
                        var one = [];
                        sch.forEach(n => {
                            one.push({isOpen: false})
                        })
                        collapseArr.push(one);
                    })
                    setCollapse(collapseArr);
                }
            }
        });
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
                <button
                    className={cx("app__toggle", {
                        "app__toggle--active": collapseIsOpen
                    })}
                    onClick={() => toggle(index, index2)}
                    >
                    <span className="app__toggle-text">Категория {index+1}</span>
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
                            <h5>{recursive_sch[index2].id}</h5>
                            {typeof Object.values(recursive_sch[index2].doc_structure) == 'object' && recursive_sch[index2].doc_structure.length > 0 &&
                            <form className="container-form">
                                <FormObject recursive_objects={recursive_sch[index2].doc_structure}/>
                                <input className="submit" type="submit" value="Submit"/><br/><br/>
                            </form>}
                        </div>
                        <button onClick={() => toggle(index, index2)} className="app__button">
                            close
                        </button>
                        {index2 < recursive_sch.length-1 && <Category recursive_sch={recursive_sch} index={index} index2={index2+1}/>}
                    </div>
                </Collapse>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="app">
                {data.length > 1 ? data.map((d, index) => (
                    <div className="wrap-container">
                        <Category recursive_sch={[...d].reverse()} index={index} index2={0}/>
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