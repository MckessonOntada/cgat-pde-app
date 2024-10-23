import React from "react";
import { Label } from "./label";

export default function Task({
  task: { id, title, state },
  onArchiveTask,
  onPinTask,
}) {
  return (
    <div className="list-item">
      <Label htmlFor="title" aria-label={title}>
        <input type="text" value={title} readOnly={true} name="title" />
      </Label>
    </div>
  );
}
