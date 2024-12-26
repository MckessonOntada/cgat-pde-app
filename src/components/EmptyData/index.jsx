import React from 'react';
import './EmptyDataContainer.scss';

export default function EmptyDataContainer({ image, heading = '', description = '' }) {
  return (
    <div className="emptyDataContainer">
      <div className="emptyDataWrapper">
        {/* <img src={image} alt="No image found" className="emptyDataImage" /> */}
        {image}
        <h2 className="emptyDataHeading">{heading}</h2>
        <p className="emptyDataDescription">{description}</p>
      </div>
    </div>
  );
}
