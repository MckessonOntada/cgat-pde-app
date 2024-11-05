import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, TabList } from "@mckesson/mcp-component-library";
import "./index.scss";
import Filters from "./Filters";
import { UserProvider } from "../../context/PageContext";
import { PATHS } from "../../routes/constants";
import UserTable from "./UserTable";
import { useTranslate } from '../../../../translations/useTranslation';
import PageHeader from "./PageHeader";


export default function Dashboard() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ACTIVE USERS");

  const handleUserClick = (userId) => {
    navigate(`${userId}`);
  };

  const handleClick = () => {
    navigate(PATHS.createUser);
  };
  const handleTabClick = (tab) => {
    console.log("tab", tab);
    setActiveTab(tab.configName);
  };

  // const { data, isLoading } = useQuery({
  //   queryKey: ["users-all"],
  //   queryFn: userService.getUsers,
  // });

  // const { data: logResponse, mutate } = useMutation({
  //   mutationFn: userService.logError,
  // });

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

  const items = [
    { label: "Home", url: "/home" },
    { label: "About", url: "/about" },
    { label: "Services", url: "/services" },
    { label: "Contact", url: "" },
  ];

  return (
    <div className="container" >
      <PageHeader />

      <UserProvider>
        <div className="filterBox">
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
