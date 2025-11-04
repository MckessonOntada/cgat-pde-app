import React from 'react';
import style from './list.module.scss';

function List(props) {
  const { title } = props;
  return (
    <div className={style['list-wrapper']}>
      {title && <div className={style['list-title']}>{title}</div>}
      <div className={style['list-item-wrapper']}>{props.children}</div>
    </div>
  );
}
function ListItem(props) {
  return <div className={style['list-item']}>{props.children}</div>;
}

export { List, ListItem };
