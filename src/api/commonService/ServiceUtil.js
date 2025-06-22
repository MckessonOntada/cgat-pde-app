const getUniqueValues = (data, key) => [...new Set(data.map((t) => t[key]).filter(Boolean))];

function transformTherapies(content) {
  return content.map((item) => {
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
        manufacturer: getUniqueValues(therapies, 'manufacturerName'),
        formulation: '-',
        dosage: '-',
        therapies: therapies.map((therapy) => ({
          isExpandable: false,
          isParent: false,
          cellValue: therapy.materialDescription,
          channelType,
          tradeName,
          ...therapy,
          formulation: therapy.strength
        }))
      };
    } else {
      const therapy = therapies[0] || {};
      return {
        ...therapy,
        isExpandable: false,
        isParent: false,
        cellValue: tradeName,
        channelType,
        tradeName,
        formulation: therapy.strength
      };
    }
  });
}

const ServiceUtil = Object.freeze({
  transformTherapies
});

export default ServiceUtil;
