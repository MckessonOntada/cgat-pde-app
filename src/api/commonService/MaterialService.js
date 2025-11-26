import { serializeParams } from '@src/util/ApiUtils';
import ApiRoutes from '../ApiRoutes';
import HttpResourceService, { httpVerb } from '../HttpResourceService';
import ServiceUtil from './ServiceUtil';

async function getMaterialById(id) {
  const url = `${ApiRoutes.GET_MATERIAL_BY_ID(id)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return [];
}

async function getMaterialConfigById(id) {
  const url = `${ApiRoutes.GET_MATERIAL_CONFIG_BY_ID(id)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return [];
}

async function getUnassignedDiagnosisCodes(spProductId, params) {
  const url = `${ApiRoutes.GET_SP_MATERIAL_CONFIG_BY_ID(spProductId)}/diagnosis-codes?${serializeParams(params)}`;

  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return [];
}

async function getAssignedDiagnosisCodes(spProductId, params) {
  if (!spProductId) {
    throw new Error('Missing required params. SP product id is required.');
  }
  const url = `${ApiRoutes.GET_SP_MATERIAL_CONFIG_BY_ID(spProductId)}/diagnosis-codes?${serializeParams(params)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return [];
}

async function removeAssignedDiagnosisCode(spProductId, codes) {
  if (!codes || !Array.isArray(codes)) throw new Error("Invalid sp product id's. Provide an array of sp product id's");
  const url = `${ApiRoutes.GET_SP_MATERIAL_CONFIG_BY_ID(spProductId)}/diagnosis-codes`;

  const res = await HttpResourceService.callRest(url, httpVerb.DELETE, codes);
  if (res.data) {
    return res.data;
  }
  return [];
}

async function addDiagnosisCode(spProductId, productIds) {
  if (!productIds || !Array.isArray(productIds)) throw new Error("Invalid sp product id's. Provide an array of sp product id's");
  const url = `${ApiRoutes.GET_SP_MATERIAL_CONFIG_BY_ID(spProductId)}/diagnosis-codes`;

  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, productIds);
  if (res.data) {
    return res.data;
  }
  return [];
}

async function deleteMaterialConfig(id) {
  const url = `${ApiRoutes.DELETE_MATERIAL_CONFIG(id)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.DELETE, {});
  if (res.data) {
    return res.data;
  }
  return [];
}

export const getMaterialList = async (requestParams) => {
  const url = `${ApiRoutes.GET_ALL_MATERIALS()}?${serializeParams(requestParams)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET);
  if (res.data) {
    return res.data;
  }
  return {};
};

async function getSPMaterialById(spMaterialId, requestParams) {
  if (!spMaterialId) throw new Error('SP Material ID is missing. SP Material ID is required to fetch details.');
  const url = `${ApiRoutes.GET_SP_MATERIAL_CONFIG_BY_ID(spMaterialId)}?${serializeParams(requestParams)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return [];
}

async function getSPMaterial(requestParams) {
  console.log('Calling this method');
  const url = `${ApiRoutes.THERAPIES()}/type/speciality-pharma?${serializeParams(requestParams)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return [];
}
async function getManufacturerListSPMaterial(status) {
  const url = `${ApiRoutes.THERAPIES()}/manufacturers?status=${status}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return [];
}

async function deleteSPMaterialConfig(id) {
  const url = `${ApiRoutes.CONFIGURE_SP_MATERIALS()}/${id}`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, {});
  if (res.data) {
    return res.data;
  }
  return [];
}

async function getAllMaterials(userId, params = { listingMode: 'ALL' }) {
  const url = `${ApiRoutes.THERAPIES()}/user/${userId}?${serializeParams(params)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET);
  // const newResponse = [
  //   {
  //     tradeName: 'ALPHORA',
  //     channelType: 'BUY_AND_BILL',
  //     therapies: [
  //       {
  //         id: '5011',
  //         materialNumber: '000000000005991100',
  //         materialDescription: 'ALPHORA INJECTION 150MG',
  //         ndc: '17856022011',
  //         strength: '150',
  //         dosage: 'MG',
  //         genericName: 'Alphorizumab',
  //         manufacturerName: 'NOVARTIS',
  //         productForm: 'INJ'
  //       }
  //     ]
  //   },
  //   {
  //     tradeName: 'BENZORA',
  //     channelType: 'SPECIALITY_PHARMA',
  //     therapies: [
  //       {
  //         id: '5012',
  //         materialNumber: '000000000004882210',
  //         materialDescription: 'BENZORA TAB 20MG',
  //         ndc: '54868001220',
  //         strength: '20',
  //         dosage: 'MG',
  //         genericName: 'Benzotril',
  //         manufacturerName: 'TEVA',
  //         productForm: 'TAB'
  //       },
  //       {
  //         id: '5013',
  //         materialNumber: '000000000004882211',
  //         materialDescription: 'BENZORA TAB 40MG',
  //         ndc: '54868001221',
  //         strength: '40',
  //         dosage: 'MG',
  //         genericName: 'Benzotril',
  //         manufacturerName: 'TEVA',
  //         productForm: 'TAB'
  //       }
  //     ]
  //   },
  //   {
  //     tradeName: 'CORTAVIA',
  //     channelType: 'BUY_AND_BILL',
  //     therapies: [
  //       {
  //         id: '5014',
  //         materialNumber: '000000000007010111',
  //         materialDescription: 'CORTAVIA IV 10MG/ML',
  //         ndc: '62045010110',
  //         strength: '10',
  //         dosage: 'MG/ML',
  //         genericName: 'Cortazol',
  //         manufacturerName: 'GSK',
  //         productForm: 'IV'
  //       },
  //       {
  //         id: '5015',
  //         materialNumber: '000000000007010112',
  //         materialDescription: 'CORTAVIA IV 20MG/ML',
  //         ndc: '62045010111',
  //         strength: '20',
  //         dosage: 'MG/ML',
  //         genericName: 'Cortazol',
  //         manufacturerName: 'GSK',
  //         productForm: 'IV'
  //       },
  //       {
  //         id: '5016',
  //         materialNumber: '000000000007010113',
  //         materialDescription: 'CORTAVIA IV 40MG/ML',
  //         ndc: '62045010112',
  //         strength: '40',
  //         dosage: 'MG/ML',
  //         genericName: 'Cortazol',
  //         manufacturerName: 'GSK',
  //         productForm: 'IV'
  //       }
  //     ]
  //   },
  //   {
  //     tradeName: 'DOLTRIXA',
  //     channelType: 'SPECIALITY_PHARMA',
  //     therapies: [
  //       {
  //         id: '5017',
  //         materialNumber: '000000000001101000',
  //         materialDescription: 'DOLTRIXA SOLUTION 5MG',
  //         ndc: '44011055005',
  //         strength: '5',
  //         dosage: 'MG',
  //         genericName: 'Doltriximab',
  //         manufacturerName: 'AMGEN',
  //         productForm: 'SOL'
  //       }
  //     ]
  //   },
  //   {
  //     tradeName: 'ELYTRUX',
  //     channelType: 'BUY_AND_BILL',
  //     therapies: [
  //       {
  //         id: '5018',
  //         materialNumber: '000000000006771002',
  //         materialDescription: 'ELYTRUX 10MG CAPSULE',
  //         ndc: '73308010510',
  //         strength: '10',
  //         dosage: 'MG',
  //         genericName: 'Elytruximide',
  //         manufacturerName: 'ABBVIE',
  //         productForm: 'CAP'
  //       },
  //       {
  //         id: '5019',
  //         materialNumber: '000000000006771003',
  //         materialDescription: 'ELYTRUX 30MG CAPSULE',
  //         ndc: '73308010530',
  //         strength: '30',
  //         dosage: 'MG',
  //         genericName: 'Elytruximide',
  //         manufacturerName: 'ABBVIE',
  //         productForm: 'CAP'
  //       },
  //       {
  //         id: '5020',
  //         materialNumber: '000000000006771004',
  //         materialDescription: 'ELYTRUX 50MG CAPSULE',
  //         ndc: '73308010550',
  //         strength: '50',
  //         dosage: 'MG',
  //         genericName: 'Elytruximide',
  //         manufacturerName: 'ABBVIE',
  //         productForm: 'CAP'
  //       },
  //       {
  //         id: '5021',
  //         materialNumber: '000000000006771005',
  //         materialDescription: 'ELYTRUX 80MG CAPSULE',
  //         ndc: '73308010580',
  //         strength: '80',
  //         dosage: 'MG',
  //         genericName: 'Elytruximide',
  //         manufacturerName: 'ABBVIE',
  //         productForm: 'CAP'
  //       }
  //     ]
  //   },
  //   {
  //     tradeName: 'FENLORIX',
  //     channelType: 'SPECIALITY_PHARMA',
  //     therapies: [
  //       {
  //         id: '5022',
  //         materialNumber: '000000000003229010',
  //         materialDescription: 'FENLORIX 2MG TAB',
  //         ndc: '22131002002',
  //         strength: '2',
  //         dosage: 'MG',
  //         genericName: 'Fenlorazine',
  //         manufacturerName: 'PFIZER',
  //         productForm: 'TAB'
  //       }
  //     ]
  //   },
  //   {
  //     tradeName: 'GRASTRIOL',
  //     channelType: 'BUY_AND_BILL',
  //     therapies: [
  //       {
  //         id: '5023',
  //         materialNumber: '000000000009112211',
  //         materialDescription: 'GRASTRIOL 120MG INJECTION',
  //         ndc: '67099012001',
  //         strength: '120',
  //         dosage: 'MG',
  //         genericName: 'Grastrioten',
  //         manufacturerName: 'MERCK',
  //         productForm: 'INJ'
  //       },
  //       {
  //         id: '5024',
  //         materialNumber: '000000000009112212',
  //         materialDescription: 'GRASTRIOL 200MG INJECTION',
  //         ndc: '67099012002',
  //         strength: '200',
  //         dosage: 'MG',
  //         genericName: 'Grastrioten',
  //         manufacturerName: 'MERCK',
  //         productForm: 'INJ'
  //       }
  //     ]
  //   },
  //   {
  //     tradeName: 'HEMOTRAX',
  //     channelType: 'SPECIALITY_PHARMA',
  //     therapies: [
  //       {
  //         id: '5025',
  //         materialNumber: '000000000004440090',
  //         materialDescription: 'HEMOTRAX POWDER 150MG',
  //         ndc: '80123015090',
  //         strength: '150',
  //         dosage: 'MG',
  //         genericName: 'Hemotraxil',
  //         manufacturerName: 'SANOFI',
  //         productForm: 'PWD'
  //       }
  //     ]
  //   },
  //   {
  //     tradeName: 'IMNORIX',
  //     channelType: 'BUY_AND_BILL',
  //     therapies: [
  //       {
  //         id: '5026',
  //         materialNumber: '000000000005551221',
  //         materialDescription: 'IMNORIX VIAL 50MG',
  //         ndc: '55111050501',
  //         strength: '50',
  //         dosage: 'MG',
  //         genericName: 'Imnorizumab',
  //         manufacturerName: 'BMS',
  //         productForm: 'VIAL'
  //       },
  //       {
  //         id: '5027',
  //         materialNumber: '000000000005551222',
  //         materialDescription: 'IMNORIX VIAL 100MG',
  //         ndc: '55111050502',
  //         strength: '100',
  //         dosage: 'MG',
  //         genericName: 'Imnorizumab',
  //         manufacturerName: 'BMS',
  //         productForm: 'VIAL'
  //       },
  //       {
  //         id: '5028',
  //         materialNumber: '000000000005551223',
  //         materialDescription: 'IMNORIX VIAL 150MG',
  //         ndc: '55111050503',
  //         strength: '150',
  //         dosage: 'MG',
  //         genericName: 'Imnorizumab',
  //         manufacturerName: 'BMS',
  //         productForm: 'VIAL'
  //       },
  //       {
  //         id: '5029',
  //         materialNumber: '000000000005551224',
  //         materialDescription: 'IMNORIX VIAL 200MG',
  //         ndc: '55111050504',
  //         strength: '200',
  //         dosage: 'MG',
  //         genericName: 'Imnorizumab',
  //         manufacturerName: 'BMS',
  //         productForm: 'VIAL'
  //       },
  //       {
  //         id: '5030',
  //         materialNumber: '000000000005551225',
  //         materialDescription: 'IMNORIX VIAL 300MG',
  //         ndc: '55111050505',
  //         strength: '300',
  //         dosage: 'MG',
  //         genericName: 'Imnorizumab',
  //         manufacturerName: 'BMS',
  //         productForm: 'VIAL'
  //       }
  //     ]
  //   },

  //   {
  //     tradeName: 'JENTROVIA',
  //     channelType: 'BUY_AND_BILL',
  //     therapies: [
  //       {
  //         id: '5031',
  //         materialNumber: '000000000006660100',
  //         materialDescription: 'JENTROVIA 25MG TAB',
  //         ndc: '78045002501',
  //         strength: '25',
  //         dosage: 'MG',
  //         genericName: 'Jentrovimab',
  //         manufacturerName: 'JANSSEN',
  //         productForm: 'TAB'
  //       }
  //     ]
  //   },

  //   {
  //     tradeName: 'KELTRAMINE',
  //     channelType: 'SPECIALITY_PHARMA',
  //     therapies: [
  //       {
  //         id: '5032',
  //         materialNumber: '000000000009880011',
  //         materialDescription: 'KELTRAMINE 5MG/ML SOLUTION',
  //         ndc: '99021050101',
  //         strength: '5',
  //         dosage: 'MG/ML',
  //         genericName: 'Keltramin',
  //         manufacturerName: 'ROCHE',
  //         productForm: 'SOL'
  //       },
  //       {
  //         id: '5033',
  //         materialNumber: '000000000009880012',
  //         materialDescription: 'KELTRAMINE 10MG/ML SOLUTION',
  //         ndc: '99021050102',
  //         strength: '10',
  //         dosage: 'MG/ML',
  //         genericName: 'Keltramin',
  //         manufacturerName: 'ROCHE',
  //         productForm: 'SOL'
  //       }
  //     ]
  //   },

  //   {
  //     tradeName: 'LUMIQUEL',
  //     channelType: 'BUY_AND_BILL',
  //     therapies: [
  //       {
  //         id: '5034',
  //         materialNumber: '000000000008110990',
  //         materialDescription: 'LUMIQUEL 10MG CAPSULE',
  //         ndc: '58325001010',
  //         strength: '10',
  //         dosage: 'MG',
  //         genericName: 'Lumiqulone',
  //         manufacturerName: 'ELI-LILLY',
  //         productForm: 'CAP'
  //       }
  //     ]
  //   },

  //   {
  //     tradeName: 'MALTROXIM',
  //     channelType: 'BUY_AND_BILL',
  //     therapies: [
  //       {
  //         id: '5035',
  //         materialNumber: '000000000004411122',
  //         materialDescription: 'MALTROXIM 2MG/ML',
  //         ndc: '50123020001',
  //         strength: '2',
  //         dosage: 'MG/ML',
  //         genericName: 'Maltroximab',
  //         manufacturerName: 'GENENTECH',
  //         productForm: 'IV'
  //       },
  //       {
  //         id: '5036',
  //         materialNumber: '000000000004411123',
  //         materialDescription: 'MALTROXIM 5MG/ML',
  //         ndc: '50123020002',
  //         strength: '5',
  //         dosage: 'MG/ML',
  //         genericName: 'Maltroximab',
  //         manufacturerName: 'GENENTECH',
  //         productForm: 'IV'
  //       }
  //     ]
  //   },

  //   {
  //     tradeName: 'NEPTAMOR',
  //     channelType: 'SPECIALITY_PHARMA',
  //     therapies: [
  //       {
  //         id: '5037',
  //         materialNumber: '000000000002112899',
  //         materialDescription: 'NEPTAMOR 15MG TABLET',
  //         ndc: '44211001510',
  //         strength: '15',
  //         dosage: 'MG',
  //         genericName: 'Neptamorlin',
  //         manufacturerName: 'SUN PHARMA',
  //         productForm: 'TAB'
  //       }
  //     ]
  //   },

  //   {
  //     tradeName: 'OCTRAVEX',
  //     channelType: 'BUY_AND_BILL',
  //     therapies: [
  //       {
  //         id: '5038',
  //         materialNumber: '000000000009900667',
  //         materialDescription: 'OCTRAVEX INHALER 120 PUFFS',
  //         ndc: '99045012001',
  //         strength: '120',
  //         dosage: 'PUFFS',
  //         genericName: 'Octraxone',
  //         manufacturerName: 'ASTRAZENECA',
  //         productForm: 'INH'
  //       }
  //     ]
  //   },

  //   {
  //     tradeName: 'POLTRIXA',
  //     channelType: 'BUY_AND_BILL',
  //     therapies: [
  //       {
  //         id: '5039',
  //         materialNumber: '000000000006671111',
  //         materialDescription: 'POLTRIXA 50MG TAB',
  //         ndc: '77220005001',
  //         strength: '50',
  //         dosage: 'MG',
  //         genericName: 'Poltriximab',
  //         manufacturerName: 'TAKEDA',
  //         productForm: 'TAB'
  //       }
  //     ]
  //   },

  //   {
  //     tradeName: 'QUENTROL',
  //     channelType: 'SPECIALITY_PHARMA',
  //     therapies: [
  //       {
  //         id: '5040',
  //         materialNumber: '000000000001188877',
  //         materialDescription: 'QUENTROL 15MG CAPSULE',
  //         ndc: '41133001510',
  //         strength: '15',
  //         dosage: 'MG',
  //         genericName: 'Quentrolone',
  //         manufacturerName: 'BIOMARIN',
  //         productForm: 'CAP'
  //       }
  //     ]
  //   },

  //   {
  //     tradeName: 'RELTORIN',
  //     channelType: 'BUY_AND_BILL',
  //     therapies: [
  //       {
  //         id: '5041',
  //         materialNumber: '000000000008881000',
  //         materialDescription: 'RELTORIN 100MG IV',
  //         ndc: '60855100100',
  //         strength: '100',
  //         dosage: 'MG',
  //         genericName: 'Reltorinab',
  //         manufacturerName: 'BAYER',
  //         productForm: 'IV'
  //       },
  //       {
  //         id: '5042',
  //         materialNumber: '000000000008881001',
  //         materialDescription: 'RELTORIN 200MG IV',
  //         ndc: '60855100200',
  //         strength: '200',
  //         dosage: 'MG',
  //         genericName: 'Reltorinab',
  //         manufacturerName: 'BAYER',
  //         productForm: 'IV'
  //       },
  //       {
  //         id: '5043',
  //         materialNumber: '000000000008881002',
  //         materialDescription: 'RELTORIN 300MG IV',
  //         ndc: '60855100300',
  //         strength: '300',
  //         dosage: 'MG',
  //         genericName: 'Reltorinab',
  //         manufacturerName: 'BAYER',
  //         productForm: 'IV'
  //       },
  //       {
  //         id: '5044',
  //         materialNumber: '000000000008881003',
  //         materialDescription: 'RELTORIN 400MG IV',
  //         ndc: '60855100400',
  //         strength: '400',
  //         dosage: 'MG',
  //         genericName: 'Reltorinab',
  //         manufacturerName: 'BAYER',
  //         productForm: 'IV'
  //       }
  //     ]
  //   },

  //   {
  //     tradeName: 'SENTRILOR',
  //     channelType: 'SPECIALITY_PHARMA',
  //     therapies: [
  //       {
  //         id: '5045',
  //         materialNumber: '000000000004420002',
  //         materialDescription: 'SENTRILOR SYRUP 50ML',
  //         ndc: '77341005010',
  //         strength: '50',
  //         dosage: 'ML',
  //         genericName: 'Sentrilorin',
  //         manufacturerName: 'DR REDDYS',
  //         productForm: 'SYR'
  //       }
  //     ]
  //   },

  //   {
  //     tradeName: 'TORALVEX',
  //     channelType: 'BUY_AND_BILL',
  //     therapies: [
  //       {
  //         id: '5046',
  //         materialNumber: '000000000007777010',
  //         materialDescription: 'TORALVEX 5MG TAB',
  //         ndc: '81223000510',
  //         strength: '5',
  //         dosage: 'MG',
  //         genericName: 'Toralveximide',
  //         manufacturerName: 'NOVO NORDISK',
  //         productForm: 'TAB'
  //       }
  //     ]
  //   },

  //   {
  //     tradeName: 'ULTRAMOXA',
  //     channelType: 'SPECIALITY_PHARMA',
  //     therapies: [
  //       {
  //         id: '5047',
  //         materialNumber: '000000000001551111',
  //         materialDescription: 'ULTRAMOXA POWDER 250MG',
  //         ndc: '50125025010',
  //         strength: '250',
  //         dosage: 'MG',
  //         genericName: 'Ultramoxazone',
  //         manufacturerName: 'ROCHE',
  //         productForm: 'PWD'
  //       }
  //     ]
  //   },

  //   {
  //     tradeName: 'VENTRILIX',
  //     channelType: 'BUY_AND_BILL',
  //     therapies: [
  //       {
  //         id: '5048',
  //         materialNumber: '000000000009991221',
  //         materialDescription: 'VENTRILIX INHALER 180 PUFFS',
  //         ndc: '99122018001',
  //         strength: '180',
  //         dosage: 'PUFFS',
  //         genericName: 'Ventrilixan',
  //         manufacturerName: 'PFIZER',
  //         productForm: 'INH'
  //       }
  //     ]
  //   },

  //   {
  //     tradeName: 'WELTRAMINE',
  //     channelType: 'SPECIALITY_PHARMA',
  //     therapies: [
  //       {
  //         id: '5049',
  //         materialNumber: '000000000003331100',
  //         materialDescription: 'WELTRAMINE 5MG TAB',
  //         ndc: '33011000510',
  //         strength: '5',
  //         dosage: 'MG',
  //         genericName: 'Weltramin',
  //         manufacturerName: 'ABBOTT',
  //         productForm: 'TAB'
  //       }
  //     ]
  //   },

  //   {
  //     tradeName: 'XENTRIUM',
  //     channelType: 'BUY_AND_BILL',
  //     therapies: [
  //       {
  //         id: '5050',
  //         materialNumber: '000000000006661000',
  //         materialDescription: 'XENTRIUM 100MG INJECTION',
  //         ndc: '62221010010',
  //         strength: '100',
  //         dosage: 'MG',
  //         genericName: 'Xentriumab',
  //         manufacturerName: 'AMGEN',
  //         productForm: 'INJ'
  //       },
  //       {
  //         id: '5051',
  //         materialNumber: '000000000006661001',
  //         materialDescription: 'XENTRIUM 200MG INJECTION',
  //         ndc: '62221020010',
  //         strength: '200',
  //         dosage: 'MG',
  //         genericName: 'Xentriumab',
  //         manufacturerName: 'AMGEN',
  //         productForm: 'INJ'
  //       }
  //     ]
  //   },

  //   {
  //     tradeName: 'YOLTRAVIN',
  //     channelType: 'SPECIALITY_PHARMA',
  //     therapies: [
  //       {
  //         id: '5052',
  //         materialNumber: '000000000007222099',
  //         materialDescription: 'YOLTRAVIN 30MG TAB',
  //         ndc: '71220003010',
  //         strength: '30',
  //         dosage: 'MG',
  //         genericName: 'Yoltravimide',
  //         manufacturerName: 'NOVARTIS',
  //         productForm: 'TAB'
  //       }
  //     ]
  //   },

  //   {
  //     tradeName: 'ZENTORVEX',
  //     channelType: 'BUY_AND_BILL',
  //     therapies: [
  //       {
  //         id: '5053',
  //         materialNumber: '000000000003557711',
  //         materialDescription: 'ZENTORVEX 150MG VIAL',
  //         ndc: '35577115010',
  //         strength: '150',
  //         dosage: 'MG',
  //         genericName: 'Zentrovexab',
  //         manufacturerName: 'BMS',
  //         productForm: 'VIAL'
  //       },
  //       {
  //         id: '5054',
  //         materialNumber: '000000000003557712',
  //         materialDescription: 'ZENTORVEX 300MG VIAL',
  //         ndc: '35577130010',
  //         strength: '300',
  //         dosage: 'MG',
  //         genericName: 'Zentrovexab',
  //         manufacturerName: 'BMS',
  //         productForm: 'VIAL'
  //       },
  //       {
  //         id: '5055',
  //         materialNumber: '000000000003557713',
  //         materialDescription: 'ZENTORVEX 500MG VIAL',
  //         ndc: '35577150010',
  //         strength: '500',
  //         dosage: 'MG',
  //         genericName: 'Zentrovexab',
  //         manufacturerName: 'BMS',
  //         productForm: 'VIAL'
  //       },
  //       {
  //         id: '5056',
  //         materialNumber: '000000000003557714',
  //         materialDescription: 'ZENTORVEX 700MG VIAL',
  //         ndc: '35577170010',
  //         strength: '700',
  //         dosage: 'MG',
  //         genericName: 'Zentrovexab',
  //         manufacturerName: 'BMS',
  //         productForm: 'VIAL'
  //       }
  //     ]
  //   }
  // ];

  // const excludedResponse = [
  //   {
  //     tradeName: 'ALPHORA',
  //     channelType: 'BUY_AND_BILL',
  //     therapies: [
  //       {
  //         id: '5011',
  //         materialNumber: '000000000005991100',
  //         materialDescription: 'ALPHORA INJECTION 150MG',
  //         ndc: '17856022011',
  //         strength: '150',
  //         dosage: 'MG',
  //         genericName: 'Alphorizumab',
  //         manufacturerName: 'NOVARTIS',
  //         productForm: 'INJ'
  //       }
  //     ]
  //   },
  //   {
  //     tradeName: 'BENZORA',
  //     channelType: 'SPECIALITY_PHARMA',
  //     therapies: [
  //       {
  //         id: '5012',
  //         materialNumber: '000000000004882210',
  //         materialDescription: 'BENZORA TAB 20MG',
  //         ndc: '54868001220',
  //         strength: '20',
  //         dosage: 'MG',
  //         genericName: 'Benzotril',
  //         manufacturerName: 'TEVA',
  //         productForm: 'TAB'
  //       },
  //       {
  //         id: '5013',
  //         materialNumber: '000000000004882211',
  //         materialDescription: 'BENZORA TAB 40MG',
  //         ndc: '54868001221',
  //         strength: '40',
  //         dosage: 'MG',
  //         genericName: 'Benzotril',
  //         manufacturerName: 'TEVA',
  //         productForm: 'TAB'
  //       }
  //     ]
  //   }
  // ];

  if (res.data) {
    // return ServiceUtil.transformTherapies(params.listingMode === 'ALL' ? newResponse : excludedResponse);
    return ServiceUtil.transformTherapies(res.data);
  }
  return [];
}

async function restrictMaterial(userId, materialIds) {
  const url = `${ApiRoutes.ORDER(userId)}/restrict-materials`;
  const res = await HttpResourceService.callRest(url, httpVerb.PUT, materialIds);
  return res;
}

async function unlinkMaterial(userId, materialIds) {
  const url = `${ApiRoutes.ORDER(userId)}/restrict-materials`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, materialIds);
  return res;
}

//demo service method for notification group
export const getTherapies = async (requestParams) => {
  const url = `${ApiRoutes.USERS()}/current/therapies?${serializeParams(requestParams)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return {};
};
export const getUsers = async (requestParams) => {
  const url = `${ApiRoutes.USERS()}?${serializeParams(requestParams)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return {};
};

const MaterialService = Object.freeze({
  getMaterialById,
  getMaterialConfigById,
  deleteMaterialConfig,
  getMaterialList,
  getSPMaterialById,
  getSPMaterial,
  getManufacturerListSPMaterial,
  deleteSPMaterialConfig,
  getUnassignedDiagnosisCodes,
  getAssignedDiagnosisCodes,
  removeAssignedDiagnosisCode,
  addDiagnosisCode,
  getAllMaterials,
  restrictMaterial,
  unlinkMaterial,
  getTherapies,
  getUsers
});

export default MaterialService;
