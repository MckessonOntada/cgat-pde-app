import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';

const OrderSummary = () => {
  const { id } = useParams();
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  React.useEffect(() => {
    if (!id) {
      navigate(`/orders?${searchParams.toString()}`, { state: { activeTab: location?.state?.fromTab } });
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
