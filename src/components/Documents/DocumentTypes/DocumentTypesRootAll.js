import React, { useEffect, useState } from 'react';
import useToken from '../../../useToken';
import useCurrentGeo from '../../../useCurrentGeo';
import '../../../static/css/DocumentTypesRootAll.css';
import _, { chain, max } from 'lodash';

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

async function postFilesToStorage(credentials) {
    return fetch('http://storage-haos.apps.ocp-t.sberbank.kz/files', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': credentials.token,
            'Geo': credentials.currentGeo
        },
        body: {
            "file": JSON.stringify(credentials.files),
            "body": JSON.stringify(credentials.body),
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

    async function Exec3(files, body) {
        return await postFilesToStorage({
            token,
            currentGeo,
            files,
            body
        })
    }

    const [category, setCategory] = useState([]);
    const [sub_category, setSubCategory] = useState([]);
    const [sub_sub_category, setSubSubCategory] = useState([]);

    function setD(chainData) {
        setData(chainData);
        setCategory(chainData[0][0])
        setSubCategory(chainData[1][1])
        setSubSubCategory(chainData[2][2])

        setSelectedCategory(category[0])
        setSelectedSubCategory(sub_category[0])
        setSelectedSubSubCategory(sub_sub_category[0])
    }

    const [selectedCategory, setSelectedCategory] = useState(category[0]);
    const [selectedSubCategory, setSelectedSubCategory] = useState(sub_category[0]);
    const [selectedSubSubCategory, setSelectedSubSubCategory] = useState(sub_sub_category[0]);
    const [versions, setVersions] = useState([]);
    const [versionDocStructure, setVersionDocStructure] = useState(null);

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

                var chainData = []
                var chainLevel = []
                var finishFiltering = false;
                var indexCnt = 0;
                var maxLevel = sorted_chain_of_nodes[0].length;

                var BreakException = {};
                try {
                    while(!finishFiltering) {
                        sorted_chain_of_nodes.reverse().forEach((node, index) => {
                            if(indexCnt < [...node].length) {
                                [...node].reverse().forEach((n, index2) => {
                                    if(indexCnt == index2) {
                                        chainLevel.push(n)
                                    }
                                })
                                
                                if(sorted_chain_of_nodes.length - 1 == index) {
                                    chainLevel = Array.from(new Set(chainLevel))
    
                                    var ind = {};
                                    ind[indexCnt] = chainLevel;
                                    chainLevel = [];
                                    chainData.push(ind)
    
                                    indexCnt++;
                                    if(indexCnt == maxLevel) {
                                        if (chainData[0][0][0] == undefined) {
                                            const timeout = setInterval(function() {
                                                if(chainData[0][0][0] != undefined)
                                                {
                                                    setD(chainData)
                                                    clearInterval(timeout)
                                                }
                                            }, 1000)
                                        } else {
                                            setD(chainData)
                                        }
                                        
                                        finishFiltering = true;
                                        throw BreakException;
                                    }
                                }
                            }
                        })
                    }
                } catch(e) {
                    if (e!==BreakException) throw e;
                }
        
                {/*sorted_chain_of_nodes.forEach(node => {
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
            
                if (chainData[0][0][0] == undefined) {
                    const timeout = setInterval(function() {
                        if(chainData[0][0] != undefined)
                        {
                            saveD(chainData)
                            clearInterval(timeout)
                        }
                    }, 1000)
                } else {
                    saveD(chainData)
                }*/}
            }
        }
    }, []);

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

    const FormObject = ({recursive_objects}) => {
        return (typeof Object.values(recursive_objects)[0] == 'object' ? Object.keys(recursive_objects).map(k => (
            <div className="container-form-content">
                {isNaN(k) && <h6>{k}:</h6>}<br/>
                <FormObject recursive_objects={recursive_objects[k]}/>
            </div>
        )) : Object.keys(recursive_objects).map(k => (
            <div className="container-form-subcontent">
                {isNaN(k) && <h6>{k}:</h6>}
                {isNaN(k) && recursive_objects[k] == 'required' ? <input type="text" required></input> : <input type="text"></input>}<br/><br/><br/>
            </div>
        )));
    }

    return (
        <div className="container">
            {category.length > 0 ?
            <div className="categories">
                <div className="block">
                    <b>Category</b>
                    <br />
                    <select id="category" name="category" onChange={e => {
                        category.map(c => {
                            if (c.doc_type == e.target.value) {
                                setSelectedCategory(prevSelectedCategory => {
                                    return { ...prevSelectedCategory, ...c };
                                });
                            }
                        })
                    }}>
                        {category.map(c => (
                            <option value={c.doc_type}>{c.doc_type}</option>
                        ))}
                    </select>
                    <br />
                </div>
                <div className="block">
                    <b>Sub-Category</b>
                    <br />
                    <select id="sub_category" name="sub_category" onChange={e => {
                        sub_category.map(c => {
                            if (c.doc_type == e.target.value) {
                                setSelectedSubCategory(prevSelectedSubCategory => {
                                    return { ...prevSelectedSubCategory, ...c };
                                });
                            }
                        })
                    }}>
                        {sub_category.map(sc => (
                            selectedCategory !== undefined && sc.parent_id == selectedCategory.id && <option value={sc.doc_type}>{sc.doc_type}</option>
                        ))}
                    </select>
                    <br />
                </div>
                <div className="block">
                    <b>Sub-Sub-Category</b>
                    <br />
                    <select id="sub_sub_category" name="sub_sub_category" onChange={e => {
                        sub_sub_category.map(c => {
                            if (c.doc_type == e.target.value) {
                                setSelectedSubSubCategory(prevSelectedSubSubCategory => {
                                    return { ...prevSelectedSubSubCategory, ...c };
                                });
                                setVersions([]);
                                arr2.map(a => {
                                    {
                                        a.id == c.id && a.data.map(version => (
                                            setVersions(OldVersions => [...OldVersions, version])
                                        ))
                                    }
                                })
                            }
                        })
                    }}>
                        {sub_sub_category.map(ssc => (
                            selectedSubCategory !== undefined && ssc.parent_id == selectedSubCategory.id && <option value={ssc.doc_type}>{ssc.doc_type}</option>
                        ))}
                    </select>
                    <br />
                </div>
                <div className="block">
                    <b>Versions</b>
                    <br />
                    <select id="versions" name="versions" onChange={e => {
                        versions.map(v => {
                            {
                                e.target.value == v.version &&
                                setVersionDocStructure(v.doc_structure)
                            }
                        })
                    }}>
                        {versions.map(v => (
                            <option value={v.version}>{v.version}</option>
                        ))}
                    </select>
                    <br />
                </div>
                {versionDocStructure !== undefined && versionDocStructure != null &&
                    <form className="container-form">
                        <FormObject recursive_objects={versionDocStructure} />
                        <input className="submit" type="submit" value="Submit" /><br /><br />
                    </form>}
            </div> : <h1>Отсутствуют категории</h1>}
        </div>
    );
}

export default DocumentTypesRootAll;