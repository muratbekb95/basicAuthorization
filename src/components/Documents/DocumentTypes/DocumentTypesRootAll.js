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
    }).then(r => r.json())
}

async function returnDocumentTypesIdVersions(credentials) {
    return fetch('http://doctype-haos.apps.ocp-t.sberbank.kz/document-types/' + credentials.id + '/versions', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': credentials.token,
            'Geo': credentials.currentGeo
        }
    }).then(r => r.json())
}

function DocumentTypesRootAll() {
    const { token, setToken } = useToken();
    const { currentGeo, setCurrentGeo } = useCurrentGeo();

    // Построить цепочку нодов согласно родительской принадлежности
    function build_chain(r, m, arr) {
        var BreakException = {};
        try {
            arr.forEach(d => {
                if (r.parent_id === "") {
                    m.push(r);
                    throw BreakException;
                }
                if (r.parent_id === d.id) {
                    m.push(r);
                    build_chain(d, m, arr);
                    throw BreakException;
                }
            })
        } catch (e) {
            if (e !== BreakException) throw e;
        }
        return m;
    }

    // Обрабатывает doc_structure и под конец выплевывает данные так, чтобы оно идеально подошло под инпуты формы
    var objects = [];
    function recursive(r, m) {
        var one = [];
        for (const [k, v] of Object.entries(r)) {
            if (typeof v == 'object') {
                objects.push(k);
                recursive(v, m)
            } else {
                var dd = {};
                dd[k] = v;
                if (objects.length > 0) {
                    one.push(dd);
                } else {
                    m.push(dd);
                }
            }
        }
        if (objects.length > 0) {
            var dd = {};
            var val = objects.pop();
            dd[val] = one;
            m.push(dd);
        }
        return m
    }

    // Вернуть все имеющиеся категории с сервера
    async function Exec() {
        return await returnDocumentTypesRootAll({
            token,
            currentGeo
        });
    }

    // Вернуть версии по выбранной опций данной категорий
    async function Exec2(id) {
        return await returnDocumentTypesIdVersions({
            token,
            currentGeo,
            id
        })
    }

    // Типы данных для хранения категории и boolean значения, чтобы проверять а нашлась ли субКатегория или субСубКатегория при итерации категорий
    const [category, setCategory] = useState([]);
    const [sub_category, setSubCategory] = useState([]);
    const [sub_sub_category, setSubSubCategory] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [selectedSubSubCategory, setSelectedSubSubCategory] = useState(null);
    const [versions, setVersions] = useState([]);
    const [versionDocStructure, setVersionDocStructure] = useState(null);

    const [subCategoryFound, setSubCategoryFound] = useState(false)
    const [subSubCategoryFound, setSubSubCategoryFound] = useState(false)

    async function updateSelectedCategory(newVal) {
        await setSelectedCategory(newVal);
    }

    async function updateSelectedSubCategory(newVal) {
        await setSelectedSubCategory(newVal);
    }

    async function updateSelectedSubSubCategory(newVal) {
        await setSelectedSubSubCategory(newVal);
    }

    async function updateSubCategoryFound(newVal) {
        await setSubCategoryFound(newVal);
    }

    async function updateSubSubCategoryFound(newVal) {
        await setSubSubCategoryFound(newVal);
    }

    /* Сохраняет "отформатированный" запрос от сервера в chainData, чтобы потом отрендерить его по блокам. 
    Формат: chainData[0: категория, 1: cуб-категория, 2: суб-суб-категория], получается chainData[0][0] - это категория */
    function setD(chainData) {
        if(chainData[0][0] !== undefined) {
            chainData[0][0].splice(0, 0, {option: "Выбрать категорию 1"})
            setCategory(chainData[0][0])
            
            if(chainData.length >= 2 && chainData[1][1] !== undefined) {
                chainData[1][1].splice(0, 0, {option: "Выбрать категорию 2"})
                setSubCategory(chainData[1][1])
            }
            if(chainData.length >= 3 && chainData[2][2] !== undefined) {
                chainData[2][2].splice(0, 0, {option: "Выбрать категорию 3"})
                setSubSubCategory(chainData[2][2])
            }
        }
    }

    // Отправляем запрос на сервер, чтобы получить наши категории, а затем фильтруем всю информацию в ней.
    useEffect(() => {
        const d = Exec();
        d.then(function (result) {

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

                // построить массив из цепочек нодов согласно родительской принадлежности
                arr.forEach(r => {
                    if (r.parent_id != "" && r.parent_id != null) {
                        chain_of_nodes.push(Array.from(new Set(build_chain(r, m, arr))));
                        m = [];
                    } else {
                        chain_of_nodes.push([r])
                    }
                })

                var chainData = []
                var collapseArr = [];
                // построить массив, который будет отображать инпуты при рендере формы
                if (chain_of_nodes.length == 1) {
                    var ind = {};
                    ind[0] = chain_of_nodes[0];
                    chainData.push(ind)
                    setD(chainData)
                } else if (chain_of_nodes.length > 1) {
                    // отсортировать согласно размеру
                    var sorted_chain_of_nodes = [].concat(chain_of_nodes);
                    sorted_chain_of_nodes.sort((a, b) => a.length < b.length ? 1 : -1)

                    // удалить дубликаты
                    sorted_chain_of_nodes.forEach((ch, elem) => {
                        sorted_chain_of_nodes.forEach((ch1, i) => {
                            if (ch.length > ch1.length && ch1.length != 1) {
                                let size = ch1.length;
                                var equals = true;

                                let subChain = ch.slice(ch.length - size, size + 1);
                                subChain.forEach((sch, idx) => {
                                    if (_.isEqual(sch, ch1[idx]) === false) {
                                        equals = false;
                                    }
                                })

                                if (equals) {
                                    sorted_chain_of_nodes = sorted_chain_of_nodes.filter(x => x != ch1);
                                }
                            }
                        })
                    })

                    // это нужно, чтобы показать данные начиная сначала от родителя и затем заканчивая дочерними нодами
                    sorted_chain_of_nodes.reverse().forEach((node, index) => {
                        [...node].reverse()
                    });

                    var chainData = []
                    var chainLevel = []
                    var finishFiltering = false;
                    var indexCnt = 0;
                    var maxLevel = sorted_chain_of_nodes[sorted_chain_of_nodes.length-1].length;

                    var BreakException = {};
                    try {
                        while (!finishFiltering) {
                            sorted_chain_of_nodes.reverse().forEach((node, index) => {
                                if (indexCnt < [...node].length) {
                                    [...node].reverse().forEach((n, index2) => {
                                        if (indexCnt == index2) {
                                            chainLevel.push(n)
                                        }
                                    })

                                    if (sorted_chain_of_nodes.length - 1 == index) {
                                        chainLevel = Array.from(new Set(chainLevel))

                                        var ind = {};
                                        ind[indexCnt] = chainLevel;
                                        chainLevel = [];
                                        chainData.push(ind)

                                        indexCnt++;
                                        if (indexCnt == maxLevel) {
                                            setD(chainData)
                                            finishFiltering = true;
                                            throw BreakException;
                                        }
                                    }
                                }
                            })
                        }
                    } catch (e) {
                        if (e !== BreakException) throw e;
                    }
                }
            }
        });
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

    // Тут строится форма для заполнения данных пользователем
    const FormObject = ({ recursive_objects }) => {
        return (typeof Object.values(recursive_objects)[0] == 'object' ? Object.keys(recursive_objects).map(k => (
            <div className="container-form-content">
                {isNaN(k) && <h6>{k}:</h6>}<br />
                <FormObject recursive_objects={recursive_objects[k]} />
            </div>
        )) : Object.keys(recursive_objects).map(k => (
            <div className="container-form-subcontent">
                {isNaN(k) && <h6>{k}:</h6>}
                {isNaN(k) && recursive_objects[k] == 'required' ? <input type="text" name={k} required></input> : <input type="text" name={k}></input>}<br />
            </div>
        )));
    }

    // Вызывается, когда пользователь меняет опцию в списке и ставит текущую версию на 0 индекс
    function selectZeroIndexByDefaultAndSetVersionDocStructure(vds) {
        setVersionDocStructure(vds)
        if(document.getElementById('versions') !== undefined && document.getElementById('versions') != null) {
            document.getElementById('versions').selectedIndex = 0;
        }
    }

    // Отправляет на сервер запрос, чтобы получить версии текущей категорий
    function setVersionsAndSelectedVersionDocStructure(category) {
        setVersions([]);
        if (category.id !== undefined && category.deepest_node) {
            const d2 = Exec2(category.id);
            d2.then(function (result2) {
                // result2.versions.forEach((v, index) => {
                //     var m = [];
                //     if (!(Object.entries(v.doc_structure).length === 0)) {
                //         m = Array.from(new Set(recursive(v.doc_structure, m)));
                //         v.doc_type_id == category.id && setVersions(OldVersions => [...OldVersions, v])
                //         v.doc_type_id == category.id && index == 0 && selectZeroIndexByDefaultAndSetVersionDocStructure(m)
                //     }
                //     m = [];
                // })
                arr2.forEach(elem => {
                    if(elem.id == category.id) {
                        result2 = elem.data;
                        result2.forEach((v, index) => {
                            var m = [];
                            if (!(Object.entries(v.doc_structure).length === 0)) {
                                m = Array.from(new Set(recursive(v.doc_structure, m)));
                                v.doc_type_id == category.id && setVersions(OldVersions => [...OldVersions, v])
                                v.doc_type_id == category.id && index == 0 && selectZeroIndexByDefaultAndSetVersionDocStructure(m)
                            }
                            m = [];
                        })
                    }
                })
            })
        } else {
            setVersions([])
            setVersionDocStructure(null)
        }
    }

    return (
        <div className="container">
            {category.length > 0 ?
                <div className="categories">                
                    <div className="block">
                        <b>Категория 1</b>
                        <br />
                        <select id="category" name="category" onChange={e => {
                            if(e.target.value == "unknown") {
                                updateSubCategoryFound(false)
                                updateSubSubCategoryFound(false)
                                updateSelectedSubCategory(null)
                                updateSelectedSubSubCategory(null)
                                setVersions([])
                                setVersionDocStructure(null)
                                sessionStorage.setItem('doctype', "NULL");
                            } else {
                                category.map(c => {
                                    const str = e.target.value;
                                    var i = str.indexOf(' ');
                                    var selected_doc_type = str.substring(0, i)
                                    if (c.doc_type == selected_doc_type) {
                                        sessionStorage.setItem('doctype', selected_doc_type);
                                        updateSelectedCategory(c)
                                        if (sub_category.length > 0) {
                                            var BreakException = {};
                                            try {
                                                var foundSubCategory = false;
                                                sub_category.map(sc => {
                                                    if (sc.parent_id == c.id) {
                                                        foundSubCategory = true;
                                                        updateSelectedSubCategory(sc)
                                                        updateSubCategoryFound(true)
                                                        updateSelectedSubSubCategory(null)
                                                        updateSubSubCategoryFound(false)
                                                        setVersions([])
                                                        setVersionDocStructure(null)
                                                        throw BreakException;
                                                    }
                                                })
                                                if(!foundSubCategory) {
                                                    updateSubCategoryFound(false)
                                                    updateSubSubCategoryFound(false)
                                                    updateSelectedSubCategory(null)
                                                    updateSelectedSubSubCategory(null)
                                                    setVersionsAndSelectedVersionDocStructure(c)
                                                }
                                            } catch (e) {
                                                if (e !== BreakException) throw e;
                                            }
                                        } else {
                                            updateSubCategoryFound(false)
                                            updateSubSubCategoryFound(false)
                                            updateSelectedSubCategory(null)
                                            updateSelectedSubSubCategory(null)
                                            setVersionsAndSelectedVersionDocStructure(c)
                                        }
                                    }
                                })
                            }
                        }}>
                            {category.map((c, index) => (
                                index == 0 ? <option value="unknown">{c.option}</option> : <option value={c.doc_type + " " + c.id}>{c.doc_type + " " + c.id}</option>
                            ))}
                        </select>
                        <br />
                    </div>
                    <div className="block">
                        <b>Категория 2</b>
                        <br />
                        {subCategoryFound ? 
                            <select id="sub_category" name="sub_category" onChange={e => {
                                if(e.target.value == "unknown") {
                                    updateSubSubCategoryFound(false)
                                    updateSelectedSubCategory(null)
                                    updateSelectedSubSubCategory(null)
                                    setVersions([])
                                    setVersionDocStructure(null)
                                } else {
                                    var foundSubCategory = false;
                                    sub_category.map(sc => {
                                        const str = e.target.value;
                                        var i = str.indexOf(' ');
                                        var selected_doc_type = str.substring(0, i)
                                        if (sc.doc_type == selected_doc_type) {
                                            const selectedOptionStr = e.target.selectedOptions[0].value
                                            var i = selectedOptionStr.indexOf(' ');
                                            var selectedOptionId = selectedOptionStr.substring(i+1, selectedOptionStr.length)
                                            if(sc.id == selectedOptionId) {
                                                updateSubCategoryFound(true)
                                                updateSelectedSubCategory(sc)
                                                foundSubCategory = true;
                                                if (sub_sub_category.length > 0) {
                                                    var BreakException = {};
                                                    try {
                                                        var foundSubSubCategory = false;
                                                        sub_sub_category.map(ssc => {
                                                            if (ssc.parent_id == sc.id) {
                                                                updateSubSubCategoryFound(true)
                                                                foundSubSubCategory = true;
                                                                updateSelectedSubSubCategory(ssc)
                                                                setVersions([])
                                                                setVersionDocStructure(null)
                                                            }
                                                        })
                                                        if(!foundSubSubCategory) {
                                                            updateSubSubCategoryFound(false)
                                                            updateSelectedSubSubCategory(null)
                                                            setVersionsAndSelectedVersionDocStructure(sc)
                                                        }
                                                    } catch (e) {
                                                        if (e !== BreakException) throw e;
                                                    }
                                                } else {
                                                    updateSubSubCategoryFound(false)
                                                    updateSelectedSubSubCategory(null)
                                                    setVersionDocStructure(null);
                                                    setVersionsAndSelectedVersionDocStructure(sc)
                                                }
                                            }
                                        }
                                    })
                                    if(!foundSubCategory) {
                                        updateSubSubCategoryFound(false)
                                        updateSelectedSubCategory(null)
                                        updateSelectedSubSubCategory(null)
                                        setVersionsAndSelectedVersionDocStructure(selectedCategory)
                                    }
                                }
                            }}>
                                {sub_category.map(sc => (
                                    selectedCategory !== undefined && (sc.parent_id == selectedCategory.id || sc.option != null)
                                    ? sc.option != null 
                                    ? <option value="unknown">{sc.option}</option>
                                    : <option key={sc.id} value={sc.doc_type + " " + sc.id}>{sc.doc_type + " " + sc.id}</option> 
                                    : null
                                ))}
                            </select> :
                            <select id="sub_category" name="sub_category" disabled></select>}
                        <br />
                    </div>
                    <div className="block">
                        <b>Категория 3</b>
                        <br />
                        {subSubCategoryFound ? 
                            <select id="sub_sub_category" name="sub_sub_category" onChange={e => {
                                if(e.target.value == "unknown") {
                                    updateSelectedSubSubCategory(null)
                                    setVersions([])
                                    setVersionDocStructure(null)
                                } else {
                                    var foundSubSubCategory = false;
                                    sub_sub_category.map(ssc => {
                                        const str = e.target.value;
                                        var i = str.indexOf(' ');
                                        var selected_doc_type = str.substring(0, i)
                                        if (ssc.doc_type == selected_doc_type) {
                                            const selectedOptionStr = e.target.selectedOptions[0].value
                                            var i = selectedOptionStr.indexOf(' ');
                                            var selectedOptionId = selectedOptionStr.substring(i+1, selectedOptionStr.length)
                                            if(ssc.id == selectedOptionId) {
                                                updateSubSubCategoryFound(true)
                                                foundSubSubCategory = true;
                                                updateSelectedSubSubCategory(ssc)
                                                setVersionsAndSelectedVersionDocStructure(ssc)
                                            }
                                        }
                                    })
                                    if(!foundSubSubCategory) {
                                        updateSubSubCategoryFound(false)
                                        updateSelectedSubSubCategory(null)
                                        setVersionsAndSelectedVersionDocStructure(selectedSubCategory)
                                    }
                                }
                            }}>
                                {sub_sub_category.map((ssc, index) => (
                                    selectedSubCategory !== undefined && (ssc.parent_id == selectedSubCategory.id || ssc.option != null)
                                    ? ssc.option != null 
                                    ? <option value="unknown">{ssc.option}</option> 
                                    : <option key={ssc.id} value={ssc.doc_type + " " + ssc.id}>{ssc.doc_type + " " + ssc.id}</option> 
                                    : null
                                ))}
                            </select> :
                        <select id="sub_sub_category" name="sub_sub_category" disabled></select>}
                        <br />
                    </div>
                    <div className="block">
                        <b>Версии</b>
                        <br />
                        <select id="versions" name="versions" onChange={e => {
                            if((category.length > 0 && sub_category.length > 0 && subCategoryFound && !subSubCategoryFound) || (category.length > 0 && sub_category.length > 0 && sub_sub_category.length > 0 && subCategoryFound && subSubCategoryFound) || (category.length > 0 && !subCategoryFound && !subSubCategoryFound)) {
                                versions.map(v => {
                                    {
                                        const selected_version = e.target.value;
                                        selected_version == v.version && setVersionDocStructure(Array.from(new Set(recursive(v.doc_structure, []))))
                                    }
                                })
                            }
                        }}>
                            {versions.map(v => (
                                <option value={v.version}>{v.version}</option>
                            ))}
                        </select>
                        <br />
                    </div>
                    {versionDocStructure !== undefined && versionDocStructure != null ?
                        <form className="container-form"><FormObject recursive_objects={versionDocStructure} /></form>
                        : console.log("versionDocStructure is null")}
                </div> : <h3>Отсутствуют категории</h3>}
        </div>
    );
}

export default DocumentTypesRootAll;
