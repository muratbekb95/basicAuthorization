import React, { useState, useEffect, useRef } from 'react';
// import { useForm } from "react-hook-form";
import '../../../../static/css/DocumentUpload.css';
import useToken from '../../../../useToken';
import useCurrentGeo from '../../../../useCurrentGeo';
import DocumentTypesRootAll from "../../DocumentTypes/DocumentTypesRootAll";
import axios from 'axios';

export default function DocumentUpload(props) {
  const { token, setToken } = useToken();
  const { currentGeo, setCurrentGeo } = useCurrentGeo();

  const { onSubmit } = props;

  async function postFilesToStorage(credentials) {

    console.log("Files:")
    for(var pair of credentials.files.entries()) {
        console.log(pair)
    }
  
    console.log("Body:")
    for(var pair of credentials.body.entries()) {
      console.log(pair)
    }

    return axios({
      method: "post",
      url: "http://storage-haos.apps.ocp-t.sberbank.kz/files",
      headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': credentials.token,
          'Geo': credentials.currentGeo,
      },
      body: {
          "file": credentials.files,
          "body": credentials.body,
      }
    })
    .then(r => r.json())
    .catch(() => {
        // If error, display a message on the upload modal
        uploadRef.current.innerHTML = `<span class="error">Error Uploading File(s)</span>`;
        // set progress bar background color to red
        progressRef.current.style.backgroundColor = 'red';
    });
  }

  // Запрос, который отправляется на сервер, чтобы сохранить файл и метаданные к нему в хранилище
  async function Exec3(files, body) {
    return await postFilesToStorage({
        token,
        currentGeo,
        files,
        body
    })
  }

  // Добавление и удаление аттрибутов
  const [attributes, setAttributes] = useState([]);

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

  const docTypes = DocumentTypesRootAll()

  function handleSubmit(e) {
    e.preventDefault()
    let fileFormData = new FormData();
    for(var i=0;i<validFiles.length;i++) {
      fileFormData.append("file_"+(i+1), validFiles[i])
    }

    var selectionOfDocTypeAndAreaOfVisibility = document.getElementsByClassName('selectionOfDocTypeAndAreaOfVisibility')[0]
    var categories = selectionOfDocTypeAndAreaOfVisibility.getElementsByClassName('container')[0].getElementsByClassName('categories')[0].childNodes;

    let bodyFormData = new FormData(categories[4]);
    var doctype = sessionStorage.getItem('doctype')
    if(doctype != "NULL") {
      bodyFormData.append("type", doctype)
    }
    bodyFormData.append("number", e.target[1].value)

    attributes.forEach(attr => {
      const attrubuteFieldsKey = attr.attrubuteFieldsKey;
      const attrubuteFieldsValue = attr.attrubuteFieldsValue;
      var attribute = {};
      attribute[attrubuteFieldsKey] = attrubuteFieldsValue;
      bodyFormData.append("attributes", attribute);
    });

    const d = Exec3(fileFormData, bodyFormData);
    d.then(function (result) {
      console.log(result)
      uploadRef.current.innerHTML = 'File(s) Uploaded';
    });
  }

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [validFiles, setValidFiles] = useState([]);
  const [unsupportedFiles, setUnsupportedFiles] = useState([]);
  const fileInputRef = useRef();

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
          if (validateFile(files[i])) {
              // add to an array so we can display the name of file
              setSelectedFiles(prevArray => [...prevArray, files[i]]);
          } else {
              // add a new property called invalid
              files[i]['invalid'] = true;
              // // add to the same array so we can display the name of the file
              setSelectedFiles(prevArray => [...prevArray, files[i]]);
              // // set error message
              setErrorMessage('File type not permitted');

              setUnsupportedFiles(prevArray => [...prevArray, files[i]]);
          }
      }
  }

  const fileType = (fileName) => {
      return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
  }

  const validateFile = (file) => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/x-icon'];
      if (validTypes.indexOf(file.type) === -1) {
          return false;
      }
      return true;
  }

  const fileSize = (size) => {
      if (size === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(size) / Math.log(k));
      return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  const removeFile = (name) => {
      // find the index of the item
      // remove the item from array
  
      const validFileIndex = validFiles.findIndex(e => e.name === name);
      validFiles.splice(validFileIndex, 1);
      // update validFiles array
      setValidFiles([...validFiles]);
      const selectedFileIndex = selectedFiles.findIndex(e => e.name === name);
      selectedFiles.splice(selectedFileIndex, 1);
      // update selectedFiles array
      setSelectedFiles([...selectedFiles]);

      const unsupportedFileIndex = unsupportedFiles.findIndex(e => e.name === name);
      if (unsupportedFileIndex !== -1) {
          unsupportedFiles.splice(unsupportedFileIndex, 1);
          // update unsupportedFiles array
          setUnsupportedFiles([...unsupportedFiles]);
      }
  }

  useEffect(() => {
    let filteredArray = selectedFiles.reduce((file, current) => {
        const x = file.find(item => item.name === current.name);
        if (!x) {
            return file.concat([current]);
        } else {
            return file;
        }
    }, []);
    setValidFiles([...filteredArray]);

  }, [selectedFiles]);

  const uploadRef = useRef();
  const progressRef = useRef();

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
                    multiple
                    onChange={filesSelected}
                />
            </div>
            <div className="file-display-container">
                {
                    validFiles.map((data, i) => 
                        <div className="file-status-bar">
                            <div>
                                {/* <div className="file-type-logo"></div> */}
                                <div className="file-type">png</div>
                                <span className={`file-name ${data.invalid ? 'file-error' : ''}`}>{data.name}</span>
                                <span className="file-size">({fileSize(data.size)})</span> {data.invalid && <span className='file-error-message'>({errorMessage})</span>}
                            </div>
                            <div className="file-remove" onClick={() => removeFile(data.name)}>X</div>
                        </div>
                    )
                }
            </div>
            <div className="progress-container">
              <span ref={uploadRef}></span>
              <div className="progress">
                  <div className="progress-bar" ref={progressRef}></div>
              </div>
            </div>
        </div>
        <div className="selectionOfDocTypeAndAreaOfVisibility">
          <h6>Выбор - Документ типа и область видимости</h6>
          <input type="text" placeholder="Номер документа" id="docNumber"></input>
          {docTypes}
        </div>
        <input id="documentUploadFormSubmit" style={{position: 'relative', top: 270}} type="submit" value="Submit" /><br />
      </form>
      <div className="AttributesAppend">
        <h6>Добавление атрибутов</h6>
        <div className="attributes">
          {attributes.map((attr, i) => (
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
        document.getElementById("fileNameFromInputFile").value = "";

        var oldInput = document.getElementById("input__file");
        var newInput = document.createElement("input");
        newInput.type = "file";
        newInput.name = oldInput.name;
        newInput.placeholder = oldInput.placeholder;
        newInput.id = oldInput.id;
        newInput.className = oldInput.className;
        newInput.onchange = oldInput.onchange;
        newInput.style.cssText = oldInput.style.cssText;
        oldInput.parentNode.replaceChild(newInput, oldInput);

        document.getElementById("docNumber").value = "";

        console.log(oldInput.files[0].name)
        // setAttributes([])
        // setAttributes({
        //   attrubuteFieldsKey: "",
        //   attrubuteFieldsValue: ""
        // })

      }}>Сбросить настройки</button>
    </div>
  );
}