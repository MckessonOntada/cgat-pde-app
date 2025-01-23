import Dropdown from '@src/components/form/Dropdown';
import React from 'react';

function SelectActions(props) {
  return (
    <div className="MCP-panel-container">
      <Dropdown
        // id="role"
        label={'Select Organization'}
        value={''}
        // onChange={handleRoleChange}
        options={[
          {
            label: 'Select Organization',
            value: ''
          }
        ]}
        // isRequired={!isRolePage}
        size="md"
      />
      <Dropdown
        // id="role"
        label={'Select Account'}
        value={''}
        // onChange={handleRoleChange}
        options={[
          {
            label: 'Select Account',
            value: ''
          }
        ]}
        // isRequired={!isRolePage}
        size="md"
      />{' '}
    </div>
  );
}
export default SelectActions;
