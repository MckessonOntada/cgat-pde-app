import OrderService from '@src/api/commonService/OrderService';
import CommonUtils from '@src/util/CommonUtils';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

function denormalizeInsurance(insurance, isMedical = true) {
  if (!insurance) return null;

  const { medicalCardFront, medicalCardBack, pharmacyCardFront, pharmacyCardBack, ...rest } = insurance;
  const result = {
    ...rest
  };

  if (isMedical) {
    result.medicalCardFront =
      typeof medicalCardFront === 'string' ? { ...CommonUtils.getFileNameAndType(medicalCardFront), url: medicalCardFront } : medicalCardFront;
    result.medicalCardBack =
      typeof medicalCardBack === 'string' ? { ...CommonUtils.getFileNameAndType(medicalCardBack), url: medicalCardBack } : medicalCardBack;
  } else {
    result.pharmacyCardFront =
      typeof pharmacyCardFront === 'string' ? { ...CommonUtils.getFileNameAndType(pharmacyCardFront), url: pharmacyCardFront } : pharmacyCardFront;
    result.pharmacyCardBack =
      typeof pharmacyCardBack === 'string' ? { ...CommonUtils.getFileNameAndType(pharmacyCardBack), url: pharmacyCardBack } : pharmacyCardBack;
  }

  return result;
}

const useOrder = (orderId) => {
  const navigate = useNavigate();

  const result = useQuery({
    queryKey: ['order-details', orderId],
    queryFn: async () => OrderService.getOrderById(orderId),
    cacheTime: 0,
    enabled: Boolean(orderId),
    select: (result) => {
      if (result) {
        Object.entries(result).forEach((entry) => {
          const [key, value] = entry;
          if (value === null) {
            result[key] = undefined;
          }
        });
        const { accountDetails, provider, payerDetails, therapy, spTherapyConfig } = result;
        if (accountDetails?.soldToAccount?.channelType) {
          result.channelType = accountDetails.soldToAccount.channelType;
        }
        if (provider) {
          provider.id = +provider.id;
        }
        if (therapy?.materialNumber) therapy.displayMaterialNumber = CommonUtils.removeLeadingZeros(therapy.materialNumber);
        if (payerDetails) {
          [
            ['primaryMedicalInsurance', true],
            ['secondaryMedicalInsurance', true],
            ['primaryPharmacyInsurance', false],
            ['secondaryPharmacyInsurance', false]
          ].forEach(([key, isMedical]) => {
            result.payerDetails[key] = denormalizeInsurance(result.payerDetails[key], isMedical);
          });
        }
        if (therapy.strength && therapy.dosage) {
          spTherapyConfig.strength = `${therapy.strength} ${therapy.dosage}`;
        }
      }

      return result;
    },
    onError: (error) => {
      if (error.status === 404) {
        navigate('/orders', {
          state: {
            alert: {
              type: 'error',
              description: 'Order details not found.'
            }
          }
        });
      }
    }
  });

  return result;
};

export default useOrder;
