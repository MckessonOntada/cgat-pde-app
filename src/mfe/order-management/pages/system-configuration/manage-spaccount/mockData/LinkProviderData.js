const linkProvidersData = [
  {
    id: '1',
    providerName: 'Mike John',
    address: {
      address1: '123 Health St, Suite 456',
      address2: '',
      city: 'Rivertown',
      state: 'Texas',
      zip: '75001'
    },
    deaNumber: '213241',
    npiNumber: '028261',
  },
  {
    id: '2',
    providerName: 'Sarah Lee',
    address: {
      address1: '789 Wellness Ave',
      address2: 'Apt 12B',
      city: 'Lakeview',
      state: 'California',
      zip: '90210'
    },
    deaNumber: '874521',
    npiNumber: '192837',
  },
  {
    id: '3',
    providerName: 'Dr. James Smith',
    address: {
      address1: '456 Care Blvd',
      address2: '',
      city: 'Springfield',
      state: 'Illinois',
      zip: '62704'
    },
    deaNumber: '293847',
    npiNumber: '837465',
  },
  {
    id: '4',
    providerName: 'Linda Moore',
    address: {
      address1: '321 Clinic Ln',
      address2: 'Suite 101',
      city: 'Greenville',
      state: 'Ohio',
      zip: '45331'
    },
    deaNumber: '382910',
    npiNumber: '746382',
  },
  {
    id: '5',
    providerName: 'Robert Brown',
    address: {
      address1: '654 Medical Pkwy',
      address2: '',
      city: 'Mapleton',
      state: 'Georgia',
      zip: '30301'
    },
    deaNumber: '109283',
    npiNumber: '384756',
  },
  {
    id: '6',
    providerName: 'Patricia Davis',
    address: {
      address1: '888 Health Plaza',
      address2: 'Floor 3',
      city: 'Clearwater',
      state: 'Florida',
      zip: '33755'
    },
    deaNumber: '564738',
    npiNumber: '827364',
  },
  {
    id: '7',
    providerName: 'Thomas Clark',
    address: {
      address1: '777 Therapy Rd',
      address2: '',
      city: 'Boulder',
      state: 'Colorado',
      zip: '80301'
    },
    deaNumber: '736482',
    npiNumber: '928374',
  },
  {
    id: '8',
    providerName: 'Emily Taylor',
    address: {
      address1: '432 Healing Way',
      address2: 'Suite 220',
      city: 'Asheville',
      state: 'North Carolina',
      zip: '28801'
    },
    deaNumber: '374829',
    npiNumber: '736483',
  },
  {
    id: '9',
    providerName: 'William Harris',
    address: {
      address1: '900 Doctor Dr',
      address2: '',
      city: 'Madison',
      state: 'Wisconsin',
      zip: '53703'
    },
    deaNumber: '827364',
    npiNumber: '273645',
  },
  {
    id: '10',
    providerName: 'Barbara Wilson',
    address: {
      address1: '654 Wellness Loop',
      address2: '',
      city: 'Albany',
      state: 'New York',
      zip: '12207'
    },
    deaNumber: '564738',
    npiNumber: '192837',
  },
  {
    id: '11',
    providerName: 'Steven Martinez',
    address: {
      address1: '300 Care Circle',
      address2: 'Suite 500',
      city: 'Phoenix',
      state: 'Arizona',
      zip: '85004'
    },
    deaNumber: '109283',
    npiNumber: '384756',
  },
  {
    id: '12',
    providerName: 'Elizabeth Thomas',
    address: {
      address1: '210 Med Center Blvd',
      address2: '',
      city: 'Nashville',
      state: 'Tennessee',
      zip: '37203'
    },
    deaNumber: '938475',
    npiNumber: '837465',
  },
];

const linkProviders = {
  content: linkProvidersData,
  totalElements: linkProvidersData.length,
  totalPages: Math.ceil(linkProvidersData.length / 8)
};

export default linkProviders;
