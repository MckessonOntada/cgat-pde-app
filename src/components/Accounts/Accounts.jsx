import React from 'react';
import { AccountsProvider } from './AccountsContext';
import AccountsList from './AccountsList';
import AccountsFilter from './AccountsFilter';

function AccountsDashboard(props) {
  return (
    <div className="accounts-wrapper">
      <div className="MCP-module-body">
        <div className="MCP-panel-container">
          <div className="MCP-CardContainer">
            <AccountsFilter autoFocus={props.autoFocus} />
          </div>
          <div className="MCP-table-wrapper">
            <AccountsList {...props} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function (props) {
  return (
    <AccountsProvider showSelectedAccounts={props.showSelectedAccounts} practiceId={props.practiceId} userId={props.userId}>
      <AccountsDashboard {...props} />
    </AccountsProvider>
  );
}
