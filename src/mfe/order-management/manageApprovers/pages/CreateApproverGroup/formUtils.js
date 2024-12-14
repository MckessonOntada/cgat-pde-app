export const transformAttributesToRules = (values, practiceId) => {
  const { name, approverUsers, rules } = values;

  // Initialize the result object
  const result = {
    name: name || 'default',
    practiceId: practiceId || 0,
    rules: {
      price: 0,
      accounts: [],
      therapies: [],
      roles: [],
      users: []
    },
    approverUsers: []
  };

  // Process rules
  rules.forEach((rule) => {
    switch (rule.attributeType) {
      case 'Price':
        result.rules.price = parseInt(rule.value, 10);
        break;
      case 'Catalog': // Therapies
        rule.value_augmented.forEach((therapy) => {
          result.rules.therapies.push({
            therapyId: therapy.value,
            therapyName: therapy.name
          });
        });
        break;
      case 'Account':
        rule.value_augmented.forEach((account) => {
          result.rules.accounts.push({
            accountId: account.value,
            accountName: account.name
          });
        });
        break;
      case 'User':
        rule.value_augmented.forEach((user) => {
          result.rules.users.push({
            userId: user.value,
            userName: user.name
          });
        });
        break;
      default:
        break;
    }
  });

  if (approverUsers) {
    approverUsers.forEach((userId) => {
      const userName =
        rules.find((rule) => rule.attributeType === 'User')?.value_augmented.find((user) => user.value === userId)?.name ||
        `User ${userId}`;

      result.approverUsers.push({
        userId,
        userName
      });
    });
  }

  return result;
};
