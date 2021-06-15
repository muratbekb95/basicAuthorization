import React, { useState } from 'react';
// import { useForm } from "react-hook-form";
import upload from "../DocumentUpload/upload.svg";
import '../../../../static/css/DocumentUpload.css';
import useToken from '../../../../useToken';
import useCurrentGeo from '../../../../useCurrentGeo';
import DocumentTypesRootAll from "../../DocumentTypes/DocumentTypesRootAll";

export default function DocumentUpload(props) {
  const { token, setToken } = useToken();
  const { currentGeo, setCurrentGeo } = useCurrentGeo();

  const { onSubmit } = props;

  async function postFilesToStorage(credentials) {

    // console.log("Files:")
    // for(var pair of credentials.files.entries()) {
    //     console.log(pair)
    // }
  
    // console.log("Body:")
    // for(var pair of credentials.body.entries()) {
    //   console.log(pair)
    // }

    return fetch('http://storage-haos.apps.ocp-t.sberbank.kz/files', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': credentials.token,
            'Geo': credentials.currentGeo
        },
        body: {
            "file": credentials.files,
            "body": credentials.body,
        }
    }).then(r => r.json())
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

  // Вызывается при загрузке файла, достаёт "имя" файла
  function fileInputClicked(e) {
    document.getElementById("fileNameFromInputFile").value = e.target.files[0].name;
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
    for(var i=0;i<e.target[1].files.length;i++) {
      fileFormData.append("file_"+(i+1), e.target[1].files[i])
    }

    var selectionOfDocTypeAndAreaOfVisibility = document.getElementsByClassName('selectionOfDocTypeAndAreaOfVisibility')[0]
    var categories = selectionOfDocTypeAndAreaOfVisibility.getElementsByClassName('container')[0].getElementsByClassName('categories')[0].childNodes;

    let bodyFormData = new FormData(categories[4]);
    var doctype = sessionStorage.getItem('doctype')
    if(doctype != "NULL") {
      bodyFormData.append("type", doctype)
    }
    bodyFormData.append("number", e.target[2].value)

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
    });
  }

  return (
    <div>
      <form className="documentUploadForm" onSubmit={e => handleSubmit(e)}>
        <div className="fileUploadSection">
          <h6>Выбор файла</h6>
          <input type="text" disabled id="fileNameFromInputFile"></input>
          <br />
          <div className="container-organization">
            <input
              type="file"
              name="docContent"
              placeholder="Выберите документ"
              id="input__file"
              className="input__file"
              onChange={fileInputClicked}
            />
            <label htmlFor="input__file" className="input__file-button">
              <span className="input__file-icon-wrapper"><img className="input__file-icon" src={upload} alt="Выбрать файл" /></span>
              <span className="input__file-button-text">Выберите файл</span>
            </label>
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