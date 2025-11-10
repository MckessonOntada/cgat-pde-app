import ListStyle from './Style.module.scss';

export default function List(props) {
  const { title } = props;
  return (
    <div className={ListStyle['list-wrapper']}>
      {title && <div className={ListStyle['list-title']}>{title}</div>}
      <div className={ListStyle['list-item-wrapper']}>{props.children}</div>
    </div>
  );
}
