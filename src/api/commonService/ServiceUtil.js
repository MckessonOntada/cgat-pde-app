const getUniqueValues = (data, key) => [...new Set(data.map((t) => t[key]).filter(Boolean))];

function transformTherapy(therapy = {}, additionalProperties) {
  return {
    ...therapy,
    isExpandable: false,
    isParent: false,
    cellValue: therapy.materialDescription,
    ...additionalProperties,
    formulation: therapy.strength
  };
}

function transformTherapies(data) {
  return data.map((item) => {
    const { tradeName, therapies, channelType } = item;

    if (therapies.length > 1) {
      return {
        cellValue: tradeName,
        channelType,
        tradeName,
        isExpandable: true,
        isParent: true,
        genericName: getUniqueValues(therapies, 'genericName'),
        ndc: getUniqueValues(therapies, 'ndc'),
        manufacturer: getUniqueValues(therapies, 'manufacturer'),
        formulation: '-',
        dosage: '-',
        therapies: therapies.map(transformTherapy, { channelType, tradeName })
      };
    } else {
      const therapy = therapies[0] || {};
      return transformTherapy(therapy, { tradeName, channelType });
    }
  });
}

const ServiceUtil = Object.freeze({
  transformTherapies
});

export default ServiceUtil;
