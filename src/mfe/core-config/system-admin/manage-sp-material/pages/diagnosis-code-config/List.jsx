import React from 'react';
import ListStyle from './list.module.scss';

function List(props) {
  const { title } = props;
  return (
    <div className={ListStyle['list-wrapper']}>
      {title && <div className={ListStyle['list-title']}>{title}</div>}
      <div className={ListStyle['list-item-wrapper']}>{props.children}</div>
    </div>
  );
}
function ListItem(props) {
  return <div className={ListStyle['list-item']}>{props.children}</div>;
}

export { List, ListItem };
