import React, { useState, useRef } from 'react';
import "../../../../static/css/DropZone.css"

const DropZone = () => {
    const [selectedFile, setSelectedFile] = useState();
    const [errorMessage, setErrorMessage] = useState('');
    const [extensionName, setExtensionName] = useState([]);
    const [unsupportedFile, setUnsupportedFile] = useState([]);
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
            const k = 1024;
            var size = files[i].size;
            const exp = Math.floor(Math.log(size) / Math.log(k));
            var fileSize = parseFloat((size / Math.pow(k, exp)).toFixed(2))

            if (fileSize <= 2048) { // 20 MB is limit for file upload
                setExtensionName(getExtension(files[i].name))
                // add to an array so we can display the name of file
                setSelectedFile(files[i]);
            } else {
                // add a new property called invalid
                files[i]['invalid'] = true;
                // // add to the same array so we can display the name of the file
                setSelectedFile(files[i]);
                // // set error message
                setErrorMessage('File size exceeds limit of 20 MB');

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

    return (
        <div className="container">
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
                            {/* <div className="file-type-logo"></div> */}
                            <div className="file-type">({extensionName})</div>
                            <span className={`file-name ${selectedFile.invalid ? 'file-error' : ''}`}>{selectedFile.name}</span>
                            <span className="file-size">({fileSize(selectedFile.size)})</span> {selectedFile.invalid && <span className='file-error-message'>({errorMessage})</span>}
                        </div>
                        <div className="file-remove" onClick={() => removeFile()}>X</div>
                    </div>
                }
            </div>
        </div>
    )
}
export default DropZone;