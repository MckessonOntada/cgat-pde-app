import React, { useState } from "react";
import { TabList } from "@mckesson/mcp-component-library";
import "./index.scss";
import Filters from "./Filters";
import { UserProvider } from "../../context/PageContext";
import UserTable from "./UserTable";
import PageHeader from "./PageHeader";


export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("ACTIVE USERS");

  const handleTabClick = (tab) => {
    console.log("tab", tab);
    setActiveTab(tab.configName);
  };

  const tabs = [
    {
      id: 1,
      configName: "ACTIVE USERS",
      isActive: true,
      isActiveTab: activeTab === "ACTIVE USERS",
      sequence: 1,
      lableForMobile: "ACTIVE USERS",
    },
    {
      id: 2,
      configName: "PENDING REQUESTS",
      isActiveTab: activeTab === "PENDING REQUESTS",
      isActive: true,

      sequence: 2,
      lableForMobile: "ACTIVE USERS",
    },
  ];

  return (
    <div>
      {/* <PageHeader /> */}

      <UserProvider>
        <div>
          <Filters showRoleDropdown={true} showStatusDropdown={true} />
          <TabList
            options={tabs}
            alignment="left"
            onTabClick={handleTabClick}
            showShadow={false}
            variant={"text"}
            useAsButton={true}
          />
          {activeTab === "ACTIVE USERS" && <UserTable />}
          {activeTab === "PENDING REQUESTS" && <UserTable />}
        </div>
      </UserProvider>
    </div>
  );
}
