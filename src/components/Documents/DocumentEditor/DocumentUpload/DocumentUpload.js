import React, { useState, useEffect, useRef } from 'react';
// import { useForm } from "react-hook-form";
import '../../../../static/css/DocumentUpload.css';
import useToken from '../../../../useToken';
import useCurrentGeo from '../../../../useCurrentGeo';
import "../../../../static/css/DocumentTypesRootAll.css";
import _, { chain, max } from 'lodash';

export default function DocumentUpload(props) {
  const { token, setToken } = useToken();
  const { currentGeo, setCurrentGeo } = useCurrentGeo();
  const uploadRef = useRef();

  async function postFilesToStorage(credentials) {
    var body = "{";
    for(var pair of credentials.body.entries()) {
        body += "\"" + pair[0] +"\": \"" + pair[1] + "\",";
    }
    body += "\"metadata\": "+ JSON.stringify(credentials.metadata) + "\"";
    body = body.substring(0, body.length-1);
    body += "}";
    console.log(JSON.parse(body))
    let newFormData = new FormData();
    newFormData.append('file', credentials.file);
    newFormData.append('body', body);
    return fetch('http://storage-haos.apps.ocp-t.sberbank.kz/files', {
        method: 'POST',
        headers: {
            'Authorization': credentials.token,
            'Geo': credentials.currentGeo,
        },
        body: newFormData
    }).then(r => r.json())
  }

  // Запрос, который отправляется на сервер, чтобы сохранить файл и метаданные к нему в хранилище
  async function Exec3(file, body, metadata) {
    return await postFilesToStorage({
        token,
        currentGeo,
        file,
        body,
        metadata
    })
  }

  // Добавление и удаление аттрибутов
  const [attributes, setAttributes] = useState([]);
  const [inputFromForm, setInputFromForm] = useState([]);
  const [prevSelectedCategory, setPrevSelectedCategory] = useState();

  const Attribute = props => {
    document.getElementById("attrubuteFieldsKey").value = "";
    document.getElementById("attrubuteFieldsValue").value = "";
    return (<div className="attribute">
      <div className="divBlock" style={{display: 'inline-block'}}>
        <div class="rounded bg-primary text-center" style={{width: 'fit-content', color: 'white', padding: '5px 10px 5px'}}>
          <p class="d-inline">{attributes[props.id].attrubuteFieldsKey}</p> - <p class="d-inline">{attributes[props.id].attrubuteFieldsValue}</p>
        </div><br/>
      </div>
      <div className="divBlock" style={{marginLeft: 15, top: -30, position: 'relative', display: 'inline-block'}}>
        <button className="divBlock" class="d-inline" onClick={(e) => { removeAttr(e, props); }}>
          <i class="fa fa-times " aria-hidden="true"></i>
        </button><br />
      </div>
    </div>);
  }

  function modifyDocumentUploadFormSubmitStyleTop(minus) {
    if(minus) {
      var documentUploadFormSubmitStyleTop = document.getElementById('documentUploadFormSubmit').style.top;
      var matches = documentUploadFormSubmitStyleTop.match(/(\d+)/);
      document.getElementById('documentUploadFormSubmit').style.top = (parseInt(matches[0]) - 35*(attributes.length-1)) + 'px';
      if(attributes.length-1 <= 0) {
        document.getElementById('documentUploadFormSubmit').style.top = "270px";
      }
    } else {
      document.getElementById('documentUploadFormSubmit').style.top = 270 + 65*(attributes.length+1) + 'px';
    }
  }

  function addAttributeFields(e) {
    e.preventDefault()

    var selectionOfDocTypeAndAreaOfVisibility = document.getElementsByClassName('selectionOfDocTypeAndAreaOfVisibility')[0]
    var categories = selectionOfDocTypeAndAreaOfVisibility.getElementsByClassName('container')[0].getElementsByClassName('categories')[0].childNodes;
    let bodyFormData = new FormData(categories[4]);

    var arrInputFromForm = [];
    for(var pair of bodyFormData) {
        var pp = {};
        pp[pair[0]] = pair[1];
        arrInputFromForm.push(pp);
    }

    setPrevSelectedCategory(selectedCategory);
    setInputFromForm(arrInputFromForm);

    setAttributes(attributes => [...attributes, {
      attrubuteFieldsKey: document.getElementById("attrubuteFieldsKey").value,
      attrubuteFieldsValue: document.getElementById("attrubuteFieldsValue").value
    }])
    modifyDocumentUploadFormSubmitStyleTop(false)
  }

  function removeAttr(e, props) {
    let clone = [...attributes]
    clone.splice(props.id, 1)
    setAttributes(clone)
    if (attributes.length == 0) {
      setAttributes({
        attrubuteFieldsKey: "",
        attrubuteFieldsValue: ""
      })
    }
    modifyDocumentUploadFormSubmitStyleTop(true)
  }

  const [selectedFile, setSelectedFile] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const [extensionName, setExtensionName] = useState([]);
  const [unsupportedFile, setUnsupportedFile] = useState([]);
  const fileInputRef = useRef();

  const getFormJSON = (form) => {
    const data = new FormData(form);
    return Array.from(data.keys()).reduce((result, key) => {
      result[key] = data.get(key);
      return result;
    }, {});
  };

  function handleSubmit(e) {
    e.preventDefault()
    if(selectedFile) {
      var selectionOfDocTypeAndAreaOfVisibility = document.getElementsByClassName('selectionOfDocTypeAndAreaOfVisibility')[0]
      var categories = selectionOfDocTypeAndAreaOfVisibility.getElementsByClassName('container')[0].getElementsByClassName('categories')[0].childNodes;
      var metadata = getFormJSON(categories[4])

      let bodyFormData = new FormData();
      var doctype = sessionStorage.getItem('doctype')
      if(doctype != "NULL") {
        if(selectedSubSubCategory) {
            if(selectedSubSubCategory.deepest_node) {
                bodyFormData.append("type", selectedSubSubCategory.id)
            }
        }
        else if(selectedSubCategory) {
            if(selectedSubCategory.deepest_node) {
                bodyFormData.append("type", selectedSubCategory.id)
            }
        }
        else if(selectedCategory) {
            if(selectedCategory.deepest_node) {
                bodyFormData.append("type", selectedCategory.id)
            }
        }
      }
      bodyFormData.append("number", e.target[1].value)

      attributes.forEach(attr => {
        const attrubuteFieldsKey = attr.attrubuteFieldsKey;
        const attrubuteFieldsValue = attr.attrubuteFieldsValue;
        metadata[attrubuteFieldsKey] = attrubuteFieldsValue;
      });
      
      const d = Exec3(selectedFile, bodyFormData, metadata);
      d.then(function (result) {
        console.log(result)
        uploadRef.current.innerHTML = 'Файл загружен';
        uploadRef.current.style.color = 'black';
      });
    } else {
      uploadRef.current.innerHTML = 'Необходимо сначала загрузить файл';
      uploadRef.current.style.color = 'red';
    }
    
  }

  const dragOver = (e) => {
    e.preventDefault();
  }
  
  const dragEnter = (e) => {
    e.preventDefault();
  }
  
  const dragLeave = (e) => {
    e.preventDefault();
  }
  
  const fileDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files);
    }
  }

  const fileInputClicked = () => {
    fileInputRef.current.click();
  }

  const filesSelected = () => {
    if (fileInputRef.current.files.length) {
        handleFiles(fileInputRef.current.files);
    }
  }

  const handleFiles = (files) => {
    for(let i = 0; i < files.length; i++) {
      const k = 1024;
      var size = files[i].size;
      const exp = Math.floor(Math.log(size) / Math.log(k));
      var fileSize = parseFloat((size / Math.pow(k, exp)).toFixed(2))
      loadFormInputDataAfterPerformingOtherOperations()

      if (fileSize <= 2048) { // 20 MB is limit for file upload
          setExtensionName(getExtension(files[i].name))
          // add to an array so we can display the name of file
          setSelectedFile(files[i]);

          uploadRef.current.innerHTML = '';
          uploadRef.current.style.color = 'black';
      } else {
          // add a new property called invalid
          files[i]['invalid'] = true;
          // // add to the same array so we can display the name of the file
          setSelectedFile(files[i]);
          // // set error message
          setErrorMessage('Размер файла превысил лимит в 20 МБ');

          setUnsupportedFile(files[i]);
      }
    }
  }

  const getExtension = (file) => {
      return file.split('.').pop();
  }

  const fileSize = (size) => {
      if (size === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(size) / Math.log(k));
      return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function removeFile() {
      // remove the item from array
      setSelectedFile();
      setExtensionName();
      setUnsupportedFile();
  }

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

// Вернуть все имеющиеся категории с сервера
async function Exec1(parentId) {
    return await returnDocumentTypesParentIdNodes({
        token,
        currentGeo,
        parentId
    });
}

async function returnDocumentTypesParentIdNodes(credentials) {
    return fetch('http://doctype-haos.apps.ocp-t.sberbank.kz/document-types/'+credentials.parentId+'/nodes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': credentials.token,
            'Geo': credentials.currentGeo
        }
    }).then(r => r.json())
}

// Вернуть версии по выбранной опций данной категорий
async function Exec2(id) {
    return await returnDocumentTypesIdVersions({
        token,
        currentGeo,
        id
    })
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

async function updateCategory(newVal) {
    await setCategory(newVal);
}

async function updateSubCategory(newVal) {
    await setSubCategory(newVal);
}

async function updateSubSubCategory(newVal) {
    await setSubSubCategory(newVal);
}

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

// Отправляем запрос на сервер, чтобы получить наши категории, а затем фильтруем всю информацию в ней.
useEffect(() => {
    const d = Exec();
    d.then(function (result) {
        if (result.length > 0) {
            updateCategory(result)
        }
    });
}, []);

function loadFormInputDataAfterPerformingOtherOperations() {
    if((!prevSelectedCategory || prevSelectedCategory == selectedCategory) && inputFromForm.length > 0) {
        var selectionOfDocTypeAndAreaOfVisibility = document.getElementsByClassName('selectionOfDocTypeAndAreaOfVisibility')[0];
        var categories = selectionOfDocTypeAndAreaOfVisibility.getElementsByClassName('container')[0].getElementsByClassName('categories');
        var containerFormContent = categories[0].getElementsByClassName('container-form-content')
        for(var i=0;i<containerFormContent.length;i++) {
            containerFormContent[i].getElementsByClassName('container-form-subcontent')[0].getElementsByTagName('input')[0].value = Object.values(inputFromForm[i]);
        }
    }
}

// Вызывается, когда выполняется подтверждение формы при добавлении атрибута
useEffect(() => {
    loadFormInputDataAfterPerformingOtherOperations()
}, [inputFromForm]);

// Тут строится форма для заполнения данных пользователем
const FormObject = ({ recursive_objects }) => {
    return (typeof Object.values(recursive_objects)[0] == 'object' ? 
        Object.keys(recursive_objects).map(k => (
            <div className="container-form-content">
                {isNaN(k) && <h6>{k}:</h6>}<br />
                <FormObject recursive_objects={recursive_objects[k]} />
            </div>
        )) : Object.keys(recursive_objects).map(k => (
            <div className="container-form-subcontent">
                {isNaN(k) && <h6>{k}:</h6>}
                {isNaN(k) && recursive_objects[k] == 'required' ? 
                    <input type="text" name={k} id={k} required></input> : 
                    <input type="text" name={k} id={k}></input>
                }<br />
            </div>
        ))
    );
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
            if(result2.versions.length > 0) {
                result2.versions.forEach((v, index) => {
                    var m = [];
                    if (!(Object.entries(v.doc_structure).length === 0)) {
                        m = Array.from(new Set(recursive(v.doc_structure, m)));
                        v.doc_type_id == category.id && setVersions(OldVersions => [...OldVersions, v])
                        v.doc_type_id == category.id && index == 0 && selectZeroIndexByDefaultAndSetVersionDocStructure(m)
                    }
                    m = [];
                })
            } else {
                setVersions([])
                setVersionDocStructure(null)
            }
        })
    } else {
        setVersions([])
        setVersionDocStructure(null)
    }
}

  return (
    <div>
      <form className="documentUploadForm" onSubmit={e => handleSubmit(e)}>
        <div className="dragAndDrop">
          <div className="drop-container" 
              onDragOver={dragOver}
              onDragEnter={dragEnter}
              onDragLeave={dragLeave}
              onDrop={fileDrop}
              onClick={fileInputClicked}
          >
            <div className="drop-message">
                <div className="upload-icon"></div>
                Перетащите или нажмите левой кнопкой мыши, чтобы загрузить файл
            </div>
            <input
                ref={fileInputRef}
                className="file-input"
                type="file"
                onChange={filesSelected}
            />
          </div>
          <div className="file-display-container">
              {
                  selectedFile &&
                  <div className="file-status-bar">
                      <div>
                          <div className="file-type">({extensionName})</div>
                          <span className={`file-name ${selectedFile.invalid ? 'file-error' : ''}`}>{selectedFile.name}</span>
                          <span className="file-size">({fileSize(selectedFile.size)})</span> {selectedFile.invalid && <span className='file-error-message'>({errorMessage})</span>}
                      </div>
                      <div className="file-remove" onClick={() => removeFile()}>X</div>
                  </div>
              }
          </div>
          <span className="file-upload-status" ref={uploadRef}></span>
        </div>
        <div className="selectionOfDocTypeAndAreaOfVisibility">
          <h6>Выбор - Документ типа и область видимости</h6>
          <input type="text" placeholder="Номер документа" id="docNumber"></input>
          <div className="container">
            {category.length > 0 ?
                <div className="categories">                
                    <div className="block">
                        <b>Категория 1</b>
                        <br />
                        <select id="category" name="category" onChange={e => {
                            if(e.target.value == "unknown") {
                                updateSubCategory([])
                                updateSubSubCategory([])
                                updateSelectedSubCategory(null)
                                updateSelectedSubSubCategory(null)
                                updateSubCategoryFound(false)
                                updateSubSubCategoryFound(false)
                                setVersions([])
                                setVersionDocStructure(null)
                            } else {
                                category.map(c => {
                                    if(c.id == e.target.value) {
                                        updateSelectedCategory(c)
                                        const subCategoryExec = Exec1(c.id)
                                        var BreakException = {}
                                        try {
                                            subCategoryExec.then(function (result) {
                                                if (result.length > 0) {
                                                    result.splice(0, 0, {option: "Выбрать категорию 1"})
                                                    updateSubCategory(result)
                                                    updateSubCategoryFound(true)
                                                    setVersions([])
                                                    setVersionDocStructure(null)
                                                } else {
                                                    updateSubCategory([])
                                                    updateSubCategoryFound(false)
                                                    setVersionsAndSelectedVersionDocStructure(c)
                                                }
                                            });
                                            updateSubSubCategory([])
                                            updateSelectedSubCategory(null)
                                            updateSelectedSubSubCategory(null)
                                            updateSubSubCategoryFound(false)
                                            throw BreakException;
                                        } catch (e) {
                                            if (e !== BreakException) throw e;
                                        }
                                    }
                                })
                            }
                        }}>
                            {category.map((c, index) => (
                                index == 0 ? <option value="unknown">Выбрать категорию 1</option> : <option value={c.id}>{c.doc_type}</option>
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
                                    updateSubSubCategory([])
                                    updateSelectedSubCategory(null)
                                    updateSelectedSubSubCategory(null)
                                    setVersions([])
                                    setVersionDocStructure(null)
                                } else {
                                    sub_category.map(sc => {
                                        if(sc.id == e.target.value) {
                                            updateSelectedSubCategory(sc)
                                            const d = Exec1(sc.id)
                                            var BreakException = {}
                                            try {
                                                d.then(function (result) {
                                                    if (result.length > 0) {
                                                        result.splice(0, 0, {option: "Выбрать категорию 2"})
                                                        updateSubSubCategory(result)
                                                        updateSubSubCategoryFound(true)
                                                        setVersions([])
                                                        setVersionDocStructure(null)
                                                    } else {
                                                        updateSubSubCategoryFound(false)
                                                        setVersionsAndSelectedVersionDocStructure(sc)
                                                    }
                                                });
                                                updateSelectedSubSubCategory(null)
                                                throw BreakException;
                                            } catch (e) {
                                                if (e !== BreakException) throw e;
                                            }
                                        }
                                    })
                                }
                            }}>
                                {sub_category.map(sc => (
                                    selectedCategory !== undefined && (sc.parent_id == selectedCategory.id || sc.option != null)
                                    ? sc.option != null 
                                    ? <option value="unknown">Выбрать категорию 2</option>
                                    : <option key={sc.id} value={sc.id}>{sc.doc_type}</option> 
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
                                        if(ssc.id == e.target.value) {
                                            foundSubSubCategory = true;
                                            updateSelectedSubSubCategory(ssc)
                                            setVersionsAndSelectedVersionDocStructure(ssc)
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
                                    ? <option value="unknown">Выбрать категорию 3</option> 
                                    : <option key={ssc.id} value={ssc.id}>{ssc.doc_type}</option> 
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
        </div>
        <input id="documentUploadFormSubmit" style={{position: 'relative', top: 270}} type="submit" value="Подтвердить" /><br />
      </form>
      <div className="AttributesAppend">
        <h6>Добавление атрибутов</h6>
        <div className="attributes">
          {attributes.length > 0 && attributes.map((_, i) => (
            <Attribute key={i} id={i} />
          ))}
        </div>
        <div className="AttributeFields">
          <form className="container-form" onSubmit={(e) => addAttributeFields(e)}>
            <label htmlFor="attrubuteFieldsKey">Атрибут:</label> <input type="text" id="attrubuteFieldsKey" required /><br />
            <label htmlFor="attrubuteFieldsValue">Значение:</label> <input type="text" id="attrubuteFieldsValue" required /><br />
            <input class="fa fa-plus-circle" className="submit" type="submit" value="Добавить атрибут" /><br /><br />
          </form>
        </div>
      </div>
      <button class="mb-5" style={{ float: 'right' }} onClick={(e) => {
        document.getElementById("docNumber").value = "";
        setSelectedFile()
        setUnsupportedFile()
        setExtensionName()

        updateSelectedCategory(category[0])
        updateSubCategoryFound(false)
        updateSelectedSubCategory(null)
        updateSubSubCategoryFound(false)
        updateSelectedSubSubCategory(null)
        document.getElementById('category').getElementsByTagName('option')[0].selected = 'selected'
        setVersionsAndSelectedVersionDocStructure([])
        setAttributes([])
        setInputFromForm([])
        modifyDocumentUploadFormSubmitStyleTop(true)
        uploadRef.current.innerHTML = '';
      }}>Сбросить настройки</button>
    </div>
  );
}