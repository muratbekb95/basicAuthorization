import React, { useEffect, useState } from 'react';
import useToken from '../../../useToken';
import '../../../static/css/Menu.css';
import _ from 'lodash';
import Collapse from "@kunukn/react-collapse";
import cx from "classnames";

async function returnDocumentTypesRootAll(credentials) {
    return fetch('http://localhost:5053/document-types/root/all', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': credentials.token
        }
    }).then(r=>r.json())
}

function DocumentTypesRootAll() {
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

    async function Exec() {
        return await returnDocumentTypesRootAll({
            token
        });
    }

    useEffect(() => {
        const d = Exec();
        d.then(function(result) {
            if (result.length > 0) {
                var chain_of_nodes = [];
                var m = [];
    
                // construct the array of chain of nodes according to parenthood
                result.forEach(r => {
                    if(r.parentId != "" && r.parentId != null) {
                        chain_of_nodes.push(Array.from(new Set(build_chain(r, m, result))));
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
                    chainData.push({id: n.id, docType: n.docType, docStructure: m, version: n.version, parentId: n.parentId, deepestNode: n.deepestNode});
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
                            if(!(Object.entries(n.docStructure).length === 0)) {
                                m = Array.from(new Set(recursive(n.docStructure, m)));    
                            }
                            chainNode.push({id: n.id, docType: n.docType, docStructure: m, version: n.version, parentId: n.parentId, deepestNode: n.deepestNode});
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
                    <span className="app__toggle-text">Category {index+1}</span>
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
                            {typeof Object.values(recursive_sch[index2].docStructure) == 'object' && recursive_sch[index2].docStructure.length > 0 &&
                            <form className="container-form">
                                <FormObject recursive_objects={recursive_sch[index2].docStructure}/>
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
            <div>
                <h2>Document Types Root All</h2>
            </div>
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