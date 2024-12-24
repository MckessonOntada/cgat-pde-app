/**
 * Aggregates the components of an address into a single string.
 *
 * @param {Object} address - The address object.
 * @param {string} address.houseNumber - The house number of the address.
 * @param {string} address.street - The street name of the address.
 * @param {string} [address.street2] - The second line of the street address (optional).
 * @param {string} [address.street3] - The third line of the street address (optional).
 * @param {string} address.city - The city of the address.
 * @param {string} address.district - The district of the address.
 * @param {string} address.state - The state of the address.
 * @param {string} address.country - The country of the address.
 * @param {string} address.zipCode - The zip code of the address.
 * @returns {string} The aggregated address string.
 */
const addressAggregator = (address) => {
  if (!address) {
    return '';
  }
  return [address.houseNumber, address.street, address.street2, address.street3, address.city, address.district, address.state, address.country, address.zipCode].filter(Boolean).join(' ');
};

export const GeographicUtils = Object.freeze({
  addressAggregator
});
