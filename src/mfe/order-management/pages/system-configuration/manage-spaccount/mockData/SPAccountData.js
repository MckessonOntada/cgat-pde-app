export const SPAccountData = [
  {
    id: '1',
    accountNumber: '0000000132',
    accountName: 'Johns Hopkins Medicine',
    name: {
      firstName: 'John',
      middleName: '',
      lastName: 'Hopkins'
    },
    contact: {
      email: 'john.hopkins@jhmed.org',
      phone: '123-456-7890',
      fax: '123-456-7891'
    },
    address: {
      address1: '1234 Main Street',
      address2: 'Suite 100',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90015'
    }
  },
  {
    id: '2',
    accountNumber: '100324768',
    accountName: 'Kaiser Permanente',
    name: {
      firstName: 'John',
      middleName: '',
      lastName: 'Hopkins'
    },
    contact: {
      email: 'john.hopkins@jhmed.org',
      phone: '123-456-7890',
      fax: '123-456-7891'
    },
    address: {
      address1: '5678 Elm Avenue',
      address2: 'Suite 200',
      city: 'New York',
      state: 'NY',
      zip: '10001'
    }
  },
  {
    id: '3',
    accountNumber: '10172199',
    accountName: 'CVS Specialty',
    name: {
      firstName: 'John',
      middleName: '',
      lastName: 'Hopkins'
    },
    contact: {
      email: 'john.hopkins@jhmed.org',
      phone: '123-456-7890',
      fax: '123-456-7891'
    },
    address: {
      address1: '9101 Oak Drive',
      address2: 'Suite 300',
      city: 'Chicago',
      state: 'IL',
      zip: '60611'
    }
  },
  {
    id: '4',
    accountNumber: '10040256',
    accountName: 'Mount Sinai Health System',
    name: {
      firstName: 'John',
      middleName: '',
      lastName: 'Hopkins'
    },
    contact: {
      email: 'john.hopkins@jhmed.org',
      phone: '123-456-7890',
      fax: '123-456-7891'
    },
    address: {
      address1: '2468 Maple Road',
      address2: 'Suite 150',
      city: 'Houston',
      state: 'TX',
      zip: '77002'
    }
  },
  {
    id: '5',
    accountNumber: '10040256',
    accountName: 'Walgreens Specialty Pharmacy',
    name: {
      firstName: 'John',
      middleName: '',
      lastName: 'Hopkins'
    },
    contact: {
      email: 'john.hopkins@jhmed.org',
      phone: '123-456-7890',
      fax: '123-456-7891'
    },
    address: {
      address1: '1357 Pine Lane',
      address2: 'Suite 250',
      city: 'Miami',
      state: 'FL',
      zip: '33101'
    }
  },
  {
    id: '5',
    accountNumber: '10040256',
    accountName: 'Mass General Brigham',
    name: {
      firstName: 'John',
      middleName: '',
      lastName: 'Hopkins'
    },
    contact: {
      email: 'john.hopkins@jhmed.org',
      phone: '123-456-7890',
      fax: '123-456-7891'
    },
    address: {
      address1: '9087 Spruce Circle',
      address2: 'Suite 350',
      city: 'Boston',
      state: 'MA',
      zip: '02108'
    }
  },
  {
    id: 6,
    accountNumber: '10172199',
    accountName: 'AllianceRx Walgreens Prime',
    name: {
      firstName: 'John',
      middleName: '',
      lastName: 'Hopkins'
    },
    contact: {
      email: 'john.hopkins@jhmed.org',
      phone: '123-456-7890',
      fax: '123-456-7891'
    },
    address: {
      address1: '9087 Spruce Circle',
      address2: 'Suite 350',
      city: 'Boston',
      state: 'MA',
      zip: '02108'
    }
  },
  {
    id: 7,
    accountNumber: '10172199',
    accountName: 'Cedars-Sinai Medical Center',
    name: {
      firstName: 'John',
      middleName: '',
      lastName: 'Hopkins'
    },
    contact: {
      email: 'john.hopkins@jhmed.org',
      phone: '123-456-7890',
      fax: '123-456-7891'
    },
    address: {
      address1: '6542 Walnut Street',
      address2: 'Suite 220',
      city: 'Atlanta',
      state: 'GA',
      zip: '30303'
    }
  }
];

const SPAccounts = {
  content: SPAccountData,
  totalElements: SPAccountData.length,
  totalPages: Math.ceil(SPAccountData.length / 8)
};

export default SPAccounts;
