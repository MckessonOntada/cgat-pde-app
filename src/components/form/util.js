   export const getNestedValue = (obj, fieldName) => {
    const keys = fieldName.split('.');
    return keys.reduce((acc, key) => (acc ? acc[key] : undefined), obj);
  };
  
 