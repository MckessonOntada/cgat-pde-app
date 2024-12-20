import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';

const OrderSummary = () => {
  const { id } = useParams();
  const { t } = useTranslate;
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!id) {
      navigate('/orders');
    }
  }, []);

  return (
    <div>
      <p>
        {t('headings.orderSummary')} {id}
      </p>
    </div>
  );
};

export default OrderSummary;
