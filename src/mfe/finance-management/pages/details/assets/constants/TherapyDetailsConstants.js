export const TherapyDetailsConstants =  [
    {
      sectionHeading: 'paymentInvoices.table.therapyInfo',
      sectionData: [
        { label: 'labels.therapyDescription', value: "materialNumber" },
        { label: 'labels.therapy.ndc', value: "ndcNumber" },
        { label: 'labels.UDI', value: "strength" },
        { label: 'account.sales_org', value: "salesOrg" },
        { label: 'paymentInvoices.details.distChannel', value: "xdistributionChannelStatus" },
        { label: 'paymentInvoices.details.division', value: "vendorName" },
        { label: 'paymentInvoices.details.SAPMaterial', value: "upcCode" },
      ]
    },
    {
      sectionHeading: 'paymentInvoices.details.variantinfo',
      sectionData: [
        { label: 'paymentInvoices.details.Variant', value: "variant" },
        { label: 'paymentInvoices.details.VariantDescription', value: "VariantDescriptiov" },
      ]
    },
    {
      sectionHeading: 'paymentInvoices.details.contractInfo',
      sectionData: [
        { label: 'paymentInvoices.details.ContractNumber', value: "contractNumber" },
        { label: 'paymentInvoices.details.ContractType', value: "contractType" },
        { label: 'paymentInvoices.details.ContractTypeDescription', value: "contractTypeDescription" },
        { label: 'paymentInvoices.details.ContractValidFrom', value: "contractValidFrom" },
        { label: 'paymentInvoices.details.ContractValidTill', value: "contractValidTill" },
        { label: 'paymentInvoices.details.division', value: "division" },
        { label: 'paymentInvoices.details.Identifier340B', value: "Identifier340B" },
      ]
    },
    {
      sectionHeading: 'paymentInvoices.details.pricingInfo',
      sectionData: [
        { label: 'paymentInvoices.details.PriceDate', value: "priceDate" },
        { label: 'paymentInvoices.details.NetPrice', value: "netPrice" },
        { label: 'paymentInvoices.details.RegularPrice', value: "regularPrice" },
        { label: 'paymentInvoices.details.ContractPrice', value: "contractPrice" },
        { label: 'paymentInvoices.details.WACPrice', value: "WACPrice" },
        { label: 'paymentInvoices.details.Discounts', value: "discounts" },
        { label: 'paymentInvoices.details.Price340B', value: "price340" },
        { label: 'paymentInvoices.details.PriceUnit', value: "priceUnit" },
        { label: 'paymentInvoices.details.Currency', value: "currency" },
        { label: 'paymentInvoices.details.MinimumOrderQuantity', value: "minimumOrderQuantity" },
      ]
    }
  ];