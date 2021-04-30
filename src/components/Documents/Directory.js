import React, { useEffect, useState, createRef } from 'react';
import useToken from '../../useToken';
import '../../static/css/Menu.css';
import _ from 'lodash';
import Collapse from "@kunukn/react-collapse";
import cx from "classnames";

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
    const [collapse, setCollapse] = useState([]);

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
    
                // construct the array of chain of nodes according to parenthood
                arr.forEach(r => {
                    if(r.parentId != "" && r.parentId != null) {
                        var m = [];
                        chain_of_nodes.push(Array.from(new Set(build_chain(r, m, arr))));
                        m = [];
                    }
                })
    
                // sort according to length
                var sorted_chain_of_nodes = [].concat(chain_of_nodes);
                sorted_chain_of_nodes.sort((a, b) => a.length < b.length ? 1 : -1)
    
                // remove duplicates in array
                sorted_chain_of_nodes.forEach((ch, elem) => {
                    sorted_chain_of_nodes.forEach((ch1, i) => {
                        if(ch.length > ch1.length) {
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
    
                // construct array which is suitable to build forms based on final refactored array
                if(sorted_chain_of_nodes.length > 0) {
                    var chainData = []
                    sorted_chain_of_nodes.forEach(node => {
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

                    var collapseArr = [];
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
        let collapseItem = {...collapse[index][subindex]};
        collapseItem.isOpen = !collapseItem.isOpen;
        collapseArr[index][subindex] = collapseItem;
        setCollapse(collapseArr)
    }

    const Category = ({recursive_sch, index, index2}) => {
        return (
            <div className="collapse-container">
                <button
                    className={cx("app__toggle", {
                        "app__toggle--active": collapse[index][index2]
                    })}
                    onClick={() => toggle(index, index2)}
                    >
                    <span className="app__toggle-text">Category {index+1}</span>
                    <div className="rotate90">
                        <svg
                        className={cx("icon", { "icon--expanded": collapse[index][index2] })}
                        viewBox="6 0 12 24"
                        >
                        <polygon points="8 0 6 1.8 14.4 12 6 22.2 8 24 18 12" />
                        </svg>
                    </div>
                </button>
                <Collapse isOpen={{...collapse[index][index2]}.isOpen} className={"app__collapse app__collapse--gradient " +
                (collapse[index][index2] ? "app__collapse--active" : "")}>
                    <div className="app__content">
                        <div class="wrap-form">
                            <h5>{recursive_sch[index2].id}</h5>
                            <form className="container-form">
                                {recursive_sch[index2].docStructure.map(obj => (
                                    typeof Object.values(obj)[0] == 'object' ? Object.keys(obj).map(k => (
                                        <div className="container-form-content">
                                            {isNaN(k) && <h6>{k}</h6>}:<br/>
                                        </div>                                 
                                    )) : Object.keys(obj).map(k => (
                                        <div className="container-form-subcontent">
                                            {isNaN(k) && <h6>{k}</h6>}: &nbsp;
                                            {isNaN(k) && obj[k] == 'required' ? <input type="text" required></input> : <input type="text"></input>}<br/><br/><br/>
                                        </div>
                                    ))
                                ))}
                                <input className="submit" type="submit" value="Submit"/><br/><br/>
                            </form>
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
            <div>
                <h2>Doctypes</h2>
            </div>
            {collapse.length > 0 && 
            <div className="app">
                {data.map((d, index) => (
                    <div className="wrap-container">
                        <Category recursive_sch={[...d].reverse()} index={index} index2={0}/>
                    </div>
                ))}
            </div>
            }
        </div>
    );
}

export default Directory;