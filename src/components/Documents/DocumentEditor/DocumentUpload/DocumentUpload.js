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

  function removeAttr(e, props) {
    let clone = [...components]
    clone.splice(props.id, 1)
    setComponents(clone)
  }

  const AttributeFields = props => {

    return (
      <div className={"attributeFields" + props.id}>
        <div className="block">
          Атрибут: <input type="text" id="attrubuteFieldsKey">{ }</input><br />
          Значение: <input type="text" id="attrubuteFieldsValue">{ }</input><br />
        </div>
        <div className="block">
          <button onClick={(e) => { removeAttr(e, props); }}>
            <i class="fa fa-minus-circle" aria-hidden="true"></i> Удалить атрибут
          </button><br />
        </div>
        <br />
      </div>
    );
  }

  const [components, setComponents] = useState([<AttributeFields />]);

  function addAttributeFields(e, c) {
    if (document.getElementById(c).childNodes.length == 0) {
      setComponents({
        attrubuteFieldsKey: "",
        attrubuteFieldsValue: ""
      })
    } else {
      var AttributeFieldsNodes = []
      document.getElementById(c).childNodes.forEach(ch => {
        let blockElements = ch.childNodes[0];
        AttributeFieldsNodes.push({
          attrubuteFieldsKey: blockElements.childNodes[1].value,
          attrubuteFieldsValue: blockElements.childNodes[4].value
        })
      })
      AttributeFieldsNodes.push({
        attrubuteFieldsKey: "",
        attrubuteFieldsValue: ""
      })
      setComponents(AttributeFieldsNodes)
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
        <input type="text" placeholder="Номер документа"></input>
        {DocumentTypesRootAll()}
      </div>
      <div className="AttributesAppend">
        <h6>Добавление атрибутов</h6>
        <div id="attributes">
          {components.map((comp, i) =>
            <AttributeFields key={i} id={i} attrubuteFieldsKey={components[i].attrubuteFieldsKey} attrubuteFieldsValue={components[i].attrubuteFieldsValue} />
          )}
        </div>
        <button class="mb-5" onClick={(e) => { addAttributeFields(e, "attributes") }}>
          <i class="fa fa-plus-circle" aria-hidden="true"></i> Добавить атрибут
        </button>
      </div>
    </div>
  );
}