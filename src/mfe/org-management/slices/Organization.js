import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const OrganizationApi = createApi({
  reducerPath: 'organization',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/' }), // read from env
  endpoints: (builder) => ({
    organization: builder.query({
      // useOrganizations
      query: () => `practices`
    })
  })
});

export default OrganizationApi;

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useOrganizationQuery } = OrganizationApi;
