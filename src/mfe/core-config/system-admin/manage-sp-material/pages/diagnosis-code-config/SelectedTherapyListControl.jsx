import { Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import style from './style.module.scss';
const SelectedTherapyListControl = ({ therapies = [], onChange }) => {
  const { t: translateFn } = useTranslate();
  if (!therapies || !Array.isArray(therapies) || therapies.length === 0) return null;

  return (
    <div className={style['therapy-selection-panel']}>
      <label className={style['therapies']}>
        <span>{translateFn('label.therapies')}</span>:&nbsp;
        <span>{therapies.map((therapy) => `${therapy.name}(${therapy.description})`).join(', ')}</span>
      </label>
      <Button variant="tertiary" onClick={onChange}>
        {translateFn('button.caption.change')}
      </Button>
    </div>
  );
};

export default SelectedTherapyListControl;
