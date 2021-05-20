import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import upload from "../DocumentUpload/upload.svg";
import "../DocumentUpload/DocumentUpload.css";
import DocumentTypesRootAll from "../../DocumentTypes/DocumentTypesRootAll";

export default function DocumentUpload(props) {
  const { onSubmit } = props;
  const { register, handleSubmit } = useForm();

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

  function addAttributeFields(e) {
    e.preventDefault()
    setAttributes(attributes => [...attributes, {
      attrubuteFieldsKey: document.getElementById("attrubuteFieldsKey").value,
      attrubuteFieldsValue: document.getElementById("attrubuteFieldsValue").value
    }])
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
  }

  return (
    <div>
      <div className="fileUploadSection">
        <h6>Выбор файла</h6>
        <input type="text" disabled id="fileNameFromInputFile"></input>
        <br />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="container-organization">
            <input
              type="file"
              name="docContent"
              placeholder="Выберите документ"
              id="input__file"
              className="input__file"
              onChange={fileInputClicked}
            />
            <br />
            <label htmlFor="input__file" className="input__file-button">
              <span className="input__file-icon-wrapper"><img className="input__file-icon" src={upload} alt="Выбрать файл" /></span>
              <span className="input__file-button-text">Выберите файл</span>
            </label>
          </div>

          <input value="Сохранить" type="submit" />
        </form>
      </div>
      <div className="selectionOfDocTypeAndAreaOfVisibility">
        <h6>Выбор - Документ типа и область видимости</h6>
        <input type="text" placeholder="Номер документа" id="docNumber"></input>
        {DocumentTypesRootAll()}
      </div>
      <div className="AttributesAppend">
        <h6>Добавление атрибутов</h6>
        <div id="attributes">
          {attributes.map((attr, i) => (
            <Attribute key={i} id={i} />
          ))}
        </div>
        <div className="AttributeFields">
          <form className="container-form" onSubmit={(e) => addAttributeFields(e)}>
            <label htmlFor="attrubuteFieldsKey">Атрибут:</label> <input type="text" id="attrubuteFieldsKey" required/><br />
            <label htmlFor="attrubuteFieldsValue">Значение:</label> <input type="text" id="attrubuteFieldsValue" required/><br />
            <div>
              <input class="fa fa-plus-circle" className="submit" type="submit" value="Добавить атрибут"/><br/><br/>
            </div>
          </form>
        </div>
      </div>
      <button class="mb-5" style={{float: 'right'}} onClick={(e) => {
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