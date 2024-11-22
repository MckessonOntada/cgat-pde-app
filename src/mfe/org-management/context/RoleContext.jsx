import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
  } from "react";
import HttpResourceService, { httpVerb } from "../../../api/HttpResourceService";
import ApiRoutes from "../../../api/ApiRoutes";
import { useQuery } from "react-query";
  
  const RoleContext = createContext();
  
  export const useRole = () => {
    
    const context = useContext(RoleContext);
    if (!context) {
      throw new Error("useRole must be used within an RoleProvider.");
    }
    return context;
  };
  
  const INITIAL_STATE = {
    searchQuery: "",
    location: [],
    status: [],
  };

  const initialPageConfig = {
    totalElements: 0, 
    pageSize: 8, 
    totalPages: 0, 
    pageNumber: 1, 
  };
  
  export const RoleProvider = ({ children }) => {
    const [filterState, setFilterState] = useState(INITIAL_STATE);
    const [originalData, setOriginalData] = useState([]);
    const [currentPageData, setCurrentPageData] = useState([]);
    const [paginationConfig, setPaginationConfig] = useState(initialPageConfig);

    const { isLoading, isError, data: responseData } = useQuery({
      queryKey: [`users/getAll}`],
      queryFn: async () => {
          const res = await HttpResourceService.callRest(
              `${ApiRoutes.getRoles()}`,
              httpVerb.GET,
              {}
          );

          if(res.data){
            const {
              content: data,
              totalElements,
              totalPages,
              pageable
            } = res.data;

            setPaginationConfig({
              totalElements,
              totalPages,
              pageSize: pageable.pageSize,
              pageNumber: (pageable.pageNumber + 1),
            })
            setOriginalData(data);
          }
      },
      refetchOnWindowFocus: false
  });
    
    const updateFilterState = useCallback((field, value) => {
      setFilterState((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    }, []);
  
    const clearFilters = useCallback(() => {
      setFilterState(INITIAL_STATE);
      console.log("Filters cleared.");
    }, []);

    useEffect(() => {
      const indexOfLastRecord = paginationConfig?.pageNumber * paginationConfig?.pageSize;
      const indexOfFirstRecord = indexOfLastRecord - paginationConfig?.pageSize;
      setCurrentPageData(
        originalData.slice(indexOfFirstRecord, indexOfLastRecord)
      );
    }, [originalData, paginationConfig.pageNumber]);
    
    const ctxValue = useMemo(() => ({
      currentPageData,
      filters: {
        ...filterState,
        update: {
          setSearchQuery: (value) => updateFilterState("searchQuery", value),
          setLocation: (value) => updateFilterState("location", value),
          setStatus: (value) => updateFilterState("status", value),
        },
        clearFilters,
      },
      paginationConfig:{
        ...paginationConfig,
        setCurrentPage: (pageNumber) => setPaginationConfig({...paginationConfig, pageNumber})
      }
    }), [
      currentPageData,
      filterState,
      clearFilters,
      updateFilterState,
      paginationConfig
    ]);
  
    return (
      <RoleContext.Provider value={ctxValue}>
        {children}
      </RoleContext.Provider>
    );
  };
  