import React, { Component } from 'react';
import ReactLogo from './ReactLogo.svg';
import './App.css';

import { UserManagement } from '@mfe/user-management';
import { OrderManagement } from '@mfe/order-management';
import { InventoryManagement } from '@mfe/inventory-management';
class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>CGAT PDE</h1>
          <h2>Hot Reload Your Workspaces</h2>
          <p className="body">
            <code className="file">mfe/user-management/src/UserManagement.js</code>
            <code className="file">mfe/order-management/src/OrderManagement.js</code>
            <code className="file">mfe/inventory-management/src/InventoryManagement.js</code>
          </p>
          <div className="components">
            <UserManagement />
            <br />
            <OrderManagement />
            <br />
            <InventoryManagement />
            <br />
          </div>
        </header>
      </div>
    );
  }
}

export default App;
