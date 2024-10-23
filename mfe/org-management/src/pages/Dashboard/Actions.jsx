import { IconButton, Switch } from "@mfe/ui-components";
import React, { useState, useEffect } from "react";
import { FaPen } from "react-icons/fa";
import "./index.scss";

export default function Actions({ status, row, onToggleChange, onEditClick }) {
  const [isChecked, setIsChecked] = useState(status === "ACTIVE");

  useEffect(() => {
    setIsChecked(status === "ACTIVE");
  }, [status]);

  const handleToggle = (event) => {
    const checked = event.target.checked;
    setIsChecked(checked);

    if (onToggleChange) {
      onToggleChange(row.id, checked);
    }

    alert(checked ? "The switch is ON!" : "The switch is OFF!");
  };

  return (
    <div className="actionsBox">
      {/* <IconButton onClick={onEditClick}> */}
        <FaPen className="actionEditIcon" />
      {/* </IconButton> */}
      <Switch checked={isChecked} size="md" onChange={handleToggle} />
    </div>
  );
}
