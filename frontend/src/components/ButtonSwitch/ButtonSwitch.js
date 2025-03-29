import React from "react";
import "./ButtonSwitch.css";

const ButtonSwitch = ({ checked, onToggle, labelOn = "Bật", labelOff = "Tắt" }) => {
  return (
    <div className="d-flex align-items-center">
      <span className="mr-2">{checked ? labelOn : labelOff}</span>
      <label className="switch">
        <input type="checkbox" checked={checked} onChange={onToggle} />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default ButtonSwitch;
