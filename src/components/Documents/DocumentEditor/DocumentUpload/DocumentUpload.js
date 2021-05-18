import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import upload from "../DocumentUpload/upload.svg";
import "../DocumentUpload/DocumentUpload.css";
import DocumentTypesRootAll from "../../DocumentTypes/DocumentTypesRootAll";

export default function DocumentUpload(props) {
  const { onSubmit } = props;
  const { register, handleSubmit } = useForm();

  function fileInputClicked(e) {
    document.getElementById("fileNameFromInputFile").value = e.target.files[0].name;
  }

  const [attributes, setAttributes] = useState([]);

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

  const Attribute = props => {
    document.getElementById("attrubuteFieldsKey").value = "";
    document.getElementById("attrubuteFieldsValue").value = "";
    return (<div>
      <div class="">
        <p class="inline-block">{attributes[props.id].attrubuteFieldsKey}</p>
        <p class="inline-block">{attributes[props.id].attrubuteFieldsValue}</p>
      </div>
      <div className="block">
        <button onClick={(e) => { removeAttr(e, props); }}>
          <i class="fa fa-times" aria-hidden="true"></i> Удалить атрибут
        </button><br />
      </div><br/>
    </div>);
  }

  function addAttributeFields(e) {
    e.preventDefault()
    setAttributes(attributes => [...attributes, {
      attrubuteFieldsKey: document.getElementById("attrubuteFieldsKey").value,
      attrubuteFieldsValue: document.getElementById("attrubuteFieldsValue").value
    }])
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
        <input type="text" placeholder="Номер документа"></input>
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
    </div>
  );
}