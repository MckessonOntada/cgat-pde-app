import CommonUtils from '@src/util/CommonUtils';

const getUniqueValues = (data, key) => [...new Set(data.map((t) => t[key]).filter(Boolean))];
const getListOverflowingDisplayLabel = (data = [], length = 3) => {
  if (CommonUtils.isNonEmptyArray(data) && data.length > length) {
    debugger;
    const markerLabel = data.slice(0, length).join(', ');
    return `${markerLabel} and ${data.length - length} more`;
  } else {
    return data.join(', ');
  }
};

function transformContent(content) {
  return content.map((item) => {
    const { tradeName, therapies, channelType } = item;

    if (therapies.length > 1) {
      const genericNameList = getUniqueValues(therapies, 'genericName');
      const ndcList = getUniqueValues(therapies, 'ndc');
      const manufacturerList = getUniqueValues(therapies, 'manufacturer');
      return {
        cellValue: tradeName,
        channelType,
        tradeName,
        isExpandable: true,
        isParent: true,
        genericName: getListOverflowingDisplayLabel(genericNameList, 2),
        genericNameTooltip: genericNameList.join(', '),
        ndc: getListOverflowingDisplayLabel(ndcList, 2),
        ndcTooltip: ndcList.join(', '),
        manufacturer: getListOverflowingDisplayLabel(manufacturerList, 2),
        manufacturerTooltip: manufacturerList.join(', '),
        formulation: '-',
        dosage: '-',
        therapies: therapies.map((therapy) => ({
          isExpandable: false,
          isParent: false,
          cellValue: therapy.materialDescription,
          channelType,
          tradeName,
          ...therapy
        }))
      };
    } else {
      const therapy = therapies[0] || {};
      return {
        isExpandable: false,
        isParent: false,
        cellValue: therapy.materialDescription,
        channelType,
        tradeName,
        ...therapy
      };
    }
  });
}

const ServiceUtil = Object.freeze({
  transformContent
});

export default ServiceUtil;
