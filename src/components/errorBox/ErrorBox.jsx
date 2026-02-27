import React from 'react'
import '../errorBox/ErrorBox.css'
import { RiHeartFill } from "@remixicon/react";


const ErrorBox = ({errorName, isError}) => {
  const ERROR_MAP = {
    OUT_OF_MEMORY: { icon: "ri-ram-2-line", text: "Out of memory" },
    CPU_OVERLOAD: { icon: "ri-cpu-line", text: "CPU overload" },
    OUT_OF_STORAGE: { icon: "ri-database-line", text: "Out of storage" },
    INODE_NOT_FOUND: { icon: "ri-folder-4-line", text: "Item not found" },
    FILE_NOT_FOUND: { icon: "ri-file-4-line", text: "File not found" },
    FOLDER_NOT_FOUND: { icon: "ri-folder-4-line", text: "Folder not found" },
    INVALID_PATH: { icon: "ri-error-warning-line", text: "Invalid path" },
    INVALID_FILE: { icon: "ri-error-warning-line", text: "Invalid file" },
    INVALID_FOLDER: { icon: "ri-error-warning-line", text: "Invalid folder" },
    NAME_ALREADY_EXISTS: { icon: "ri-file-copy-line", text: "Name already exists" },
    FILE_ALREADY_EXISTS: { icon: "ri-file-copy-line", text: "Name already exists" },
    CANNOT_DELETE_ROOT: { icon: "ri-lock-line", text: "Cannot delete root" },
  };

  const info = ERROR_MAP[errorName] || { icon: "ri-error-warning-line", text: errorName };

  return (
    <>
      <div className="error-page">
        <div className="error-box">
          <div className="errorImg">
            <i className={info.icon}></i>
          </div>
          <div className="error-name">
            <p>{info.text}</p>
            <button onClick={() => isError()} className='cursor-target'>OK</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorBox
