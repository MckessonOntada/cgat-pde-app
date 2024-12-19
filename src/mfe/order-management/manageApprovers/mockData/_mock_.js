export const APPROVER_GROUP_DATA = {
  createdAt: '2024-12-13T07:49:57.016Z',
  createdBy: 'Michael Scott',
  updatedAt: '2024-12-14T09:15:23.516Z',
  updatedBy: 'Pam Beesly',
  id: 'AG-001',
  name: 'Primary Approver Group',
  practiceId: 501,
  rules: {
    price: 200,
    accounts: [
      {
        accountId: 77,
        accountName: 'Healthcare Account A'
      },
      {
        accountId: 79,
        accountName: 'Healthcare Account B'
      }
    ],
    therapies: [
      {
        therapyId: 77,
        therapyName: 'Cognitive Behavioral Therapy'
      },
      {
        therapyId: 79,
        therapyName: 'Physical Rehabilitation Therapy'
      },
      {
        therapyId: 201,
        therapyName: 'Cognitive Behavioral Therapy'
      },
      {
        therapyId: 202,
        therapyName: 'Physical Rehabilitation Therapy'
      },
      {
        therapyId: 201,
        therapyName: 'Cognitive Behavioral Therapy'
      },
      {
        therapyId: 202,
        therapyName: 'Physical Rehabilitation Therapy'
      },
      {
        therapyId: 201,
        therapyName: 'Cognitive Behavioral Therapy'
      },
      {
        therapyId: 202,
        therapyName: 'Physical Rehabilitation Therapy'
      }
    ],
    roles: [
      // {
      //   roleId: 301,
      //   roleName: 'Approver'
      // },
      // {
      //   roleId: 302,
      //   roleName: 'Reviewer'
      // }
    ],
    users: [
      {
        userId: 4103,
        userName: 'Dwight Schrute'
      },
      {
        userId: 4222,
        userName: 'Jim Halpert'
      }
    ]
  },
  approverUsers: [
    {
      userId: 4103,
      userName: 'Stanley Hudson'
    },
    {
      userId: 4222,
      userName: 'Kevin Malone'
    }
  ],
  active: true
};
