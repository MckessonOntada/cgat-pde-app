export function getMergedPreferences(prevConfig = {}, userPreferences = {}, rolePreferences = {}) {
  if (!prevConfig.sections) return {};
  const optionMap = ['email', 'inApp', 'sms'];

  const updatedConfig = {
    ...prevConfig,
    sections: prevConfig.sections.map((section) => {
      const userSection = userPreferences[section.id] || {};
      const roleSection = rolePreferences[section.id] || {};

      if (section.rows) {
        return {
          ...section,
          rows: section.rows.map((row) => {
            const userRow = userSection[row.id] || {};
            const roleRow = roleSection[row.id] || {};

            const optionValues = row.optionValues.map((opt, idx) => {
              const channel = optionMap[idx];

              const updatedOptions = { ...opt };
              updatedOptions.value = userRow[channel] ?? opt.value;
              if (roleRow[channel] === true) {
                updatedOptions.value = true;
                updatedOptions.isPreferred = true;
              }

              return updatedOptions;
            });

            return { ...row, optionValues };
          })
        };
      }

      if (section.optionValues) {
        const userRow = userSection['PROCESS_UPDATES'] || {};
        const roleRow = roleSection['PROCESS_UPDATES'] || {};

        const optionValues = section.optionValues.map((opt, idx) => {
          const channel = optionMap[idx];
          const updatedOptions = { ...opt };

          updatedOptions.value = userRow[channel] ?? opt.value;
          if (roleRow[channel] === true) {
            updatedOptions.value = true;
            updatedOptions.isPreferred = true;
          }

          return updatedOptions;
        });

        return { ...section, optionValues };
      }

      return section;
    })
  };

  return updatedConfig;
}

export function extractUserPreferences(preferencesConfig) {
  const optionMap = ['email', 'inApp', 'sms'];
  const preferences = {};

  preferencesConfig.sections.forEach((section) => {
    if (section.rows) {
      preferences[section.id] = {};

      section.rows.forEach((row) => {
        const userRow = {};

        row.optionValues.forEach((opt, idx) => {
          const channel = optionMap[idx];
          userRow[channel] = opt.value;
        });

        preferences[section.id][row.id] = userRow;
      });
    }

    if (section.optionValues) {
      const userRow = {};
      section.optionValues.forEach((opt, idx) => {
        const channel = optionMap[idx];
        userRow[channel] = opt.value;
      });
      preferences[section.id] = { PROCESS_UPDATES: userRow };
    }
  });

  return { preferences };
}
