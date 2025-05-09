export const prepareCombinedData = (materials, accounts) => {
  const checkedAccounts = accounts?.filter((acc) => acc.isChecked);
  let __combinedData = materials?.flatMap((material) =>
    checkedAccounts.map((account) => ({
      id: `${material.id}-${account.id}`,
      materialId: material.id,
      materialNumber: material.materialNumber,
      productName: material.materialDescription,
      ndcNumber: material.ndcNumber,
      accountNumber: account.accountNumber,
      accountName: account.accountName
    }))
  );

  return {
    getAllData({
      pageSize = 8,
      pageNo = 0,
      query = '',
      sortBy = '',
      sortOrder = 'asc'
    }) {
      const totalElements = combinedData.length;
      const totalPages = Math.ceil(totalElements / pageSize);

      const paginatedData = __combinedData
        .filter((item) => {
          return Object.values(item).join('').toLowerCase().includes(query);
        })
        ?.sort((a, b) =>
          sortOrder === 'asc'
            ? a[sortBy].localeCompare(b[sortBy])
            : b[sortBy].localeCompare(a[sortBy])
        )
        ?.slice(pageNo * pageSize, (pageNo + 1) * pageSize);

      console.log('Paginated Data:', paginatedData);
      return {
        content: paginatedData,
        pageable: {
          pageNo,
          pageSize,
          offset: pageNo * pageSize,
          paged: true,
          unpaged: false,
          sort: { empty: false, sorted: true, unsorted: false }
        },
        sort: { empty: false, sorted: true, unsorted: false },
        totalElements,
        totalPages
      };
    },
    unlinkMaterial(id) {
      __combinedData = __combinedData.filter((item) => item.id !== id);
    }
  };
};
