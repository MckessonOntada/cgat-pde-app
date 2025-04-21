const shippingLocationData = [
  {
    id: '1',
    shippingAccountNumber: '1122332',
    shippingAccountName: 'BMS-WAC MD ANDERSON  CANCER CTR',
    address: {
      address1: '123 Health St, Suite 456',
      address2: '',
      city: 'Rivertown',
      state: 'Texas',
      zip: '75001'
    }
  },
  {
    id: '2',
    shippingAccountNumber: '73892',
    shippingAccountName: 'UNIV OF TX MD ANDERSON CANCER CTR',
    address: {
      address1: '456 Oakwood Avenue, Suite 200',
      address2: '',
      city: 'Sunnyvale',
      state: 'California',
      zip: '94086'
    }
  },
  {
    id: '3',
    shippingAccountNumber: '152622',
    shippingAccountName: 'UNIV OF TX MD ANDERSON CANCER CTR',
    address: {
      address1: '789 Lakeshore Road, Suite 300',
      address2: '',
      city: 'Chicago',
      state: 'Illinois',
      zip: '60611'
    }
  },
  {
    id: '4',
    shippingAccountNumber: '6388923',
    shippingAccountName: 'UNIV OF TX MD ANDERSON CANCER CTR',
    address: {
      address1: '202 Riverbend Street, Suite 120',
      address2: '',
      city: 'Riverdale',
      state: 'Illinois',
      zip: '20737'
    }
  },
  {
    id: '5',
    shippingAccountNumber: '637723',
    shippingAccountName: 'BMS-WAC MD ANDERSON  CANCER CTR',
    address: {
      address1: '202 Riverbend Street, Suite 120',
      address2: '12 test strier',
      city: 'RiverBostondale',
      state: 'Illinois',
      zip: '02118'
    }
  }
];

const shippingLocations = {
  content: shippingLocationData,
  totalElements: shippingLocationData.length,
  totalPages: Math.ceil(shippingLocationData.length / 8)
};

export default shippingLocations;
