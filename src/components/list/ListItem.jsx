import React from 'react';
import ListStyle from './Style.module.scss';

export default function ListItem(props) {
  return <div className={ListStyle['list-item']}>{props.children}</div>;
}
