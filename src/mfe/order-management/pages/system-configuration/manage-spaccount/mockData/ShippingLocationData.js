const shippingLocationData = [
  {
    shippingAddress: '123 Health St, Suite 456, Rivertown, Texas, 75001',
    shippingAccountNumber: '1122332',
    shippingAccountName: 'BMS-WAC MD ANDERSON  CANCER CTR'
  },
  {
    shippingAddress: '456 Oakwood Avenue, Suite 200 Sunnyvale, CA 94086',
    shippingAccountNumber: '73892',
    shippingAccountName: 'UNIV OF TX MD ANDERSON CANCER CTR'
  },
  {
    shippingAddress: '789 Lakeshore Road, Suite 300 Chicago, IL 60611',
    shippingAccountNumber: '152622',
    shippingAccountName: 'UNIV OF TX MD ANDERSON CANCER CTR'
  },
  {
    shippingAddress: '202 Riverbend Street, Suite 120 Riverdale, MD 20737',
    shippingAccountNumber: '6388923',
    shippingAccountName: 'UNIV OF TX MD ANDERSON CANCER CTR'
  },
  {
    shippingAddress: '303 Heartwell Boulevard, Suite 500 Boston, MA 02118',
    shippingAccountNumber: '637723',
    shippingAccountName: 'BMS-WAC MD ANDERSON  CANCER CTR'
  }
];

const shippingLocations = {
  content: shippingLocationData,
  totalElements: shippingLocationData.length,
  totalPages: Math.ceil(shippingLocationData.length / 8)
};

export default shippingLocations;
