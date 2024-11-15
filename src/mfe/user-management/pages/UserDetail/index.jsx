import React, { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { USER_DATA } from "../../mockData/UsersData";
import { useTranslate } from '@src/translations/useTranslation';
import PageHeader from "@src/components/pageHeader";
import { Badge, Switch, AutoSuggestSearch, Alert } from '@mckesson/mcp-component-library';
import './index.scss';
import { PERMISSIONS_ENUM } from "../UserPermissions/permissionsEnum";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import SelectedAccountData from '@src/mfe/org-management/mockData/SelectedAccountData';
import AccountsList from '@src/components/Accounts/AccountsList';
import arrow_right from '@src/assets/image/arrow_right.svg';
import { PATHS } from "../../routes/constants";

function getbgColorOnRole(Role) {
  switch (Role) {
    case 'ORGANIZATION ADMIN':
      return 'success';
    case 'ORGANIZATION USER':
      return 'primary';
    default:
      return 'info';
  }
}
const UserDetail = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [searchText, setSearchText] = useState("");
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const userData = USER_DATA.find((user) => user.id === parseInt(userId));
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const location = useLocation();
  const isSuccess = location.state?.isSuccess || false;

  useEffect(() => {
    if (isSuccess) {
      setIsAlertVisible(true);

      // Set a timeout to auto-close the alert after 10 seconds
      const timer = setTimeout(() => {
        handleAlertClose
      }, 10000);   //This should be as same as duration that mentioed in Alert

      // Clear timeout if component unmounts or if isSuccess changes
      return () => clearTimeout(timer);
    }
  }, [isSuccess, location.pathname, location.state, navigate]);

  const handleAlertClose = () => {
    setIsAlertVisible(false);
    navigate(location.pathname, { replace: true, state: { ...location.state, isSuccess: false } });
  };

  const goBack = () => {
    navigate(-1);
  };
  const onRemoveAccount = useCallback(
    (item) => {
      setSelectedAccounts(selectedAccounts.filter((account) => account.id !== item.id));
    },
    [selectedAccounts, setSelectedAccounts]
  );
  const handleSearchChange = (inputValue) => {
    setSearchText(inputValue);
  };
  if (!userData) {
    return <h1>User not found .</h1>;
  }
  const buttonLabels = {
    edit: t('userManagement.button.edit'),
  };
  const buttonLabelsAccount = {
    secondaryadd: t('userManagement.button.add_accounts')
  };

  return (
    <><div
      className="back-navigation py2 capitalize"
      onClick={goBack}
      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
    >
      <MdOutlineKeyboardArrowLeft size="24px" />
      <p>Back to Manage Users</p>
    </div>
      <div>
        <PageHeader
          title={t('userManagement.header.view.edit_user')}
          navigateTo={`../${PATHS.editUser}/${userId}`}
          buttonLabels={buttonLabels}
          state={{ isEdit: true }}
        /> 
        <div className="userCardContainer">
          <div className="user-header">
            <div className="user-info">
              <div className=" subheader-text">{`${userData.name.lastName} ${userData.name.firstName},${userData.name.middleName} `}
              </div>
              <Badge text={userData.role.name} type={getbgColorOnRole(userData.role.name)} />
            </div>
            <div className="user-status">
              <span className="view_label">Last Updated On:</span>
              <span className="label-text">{userData.date_added}</span>
              <Switch
                handleToggle={() => { }}
                id="id"
                label="Active"
                labelPosition="right"
                name="Toggle"
                size="lg"
                value />
            </div>
          </div>
          <div className="container grid grid-gap-24 grid-cols-1 md:grid-cols-4">
            <div>
              <span className="view_label">User Address</span>
              <p className="label-text py2">{userData.address.address1}, {userData.address.address2}, {userData.address.city}, {userData.address.state}, {userData.address.zip}</p>
            </div>
            <div>
              <span className="view_label">Email ID</span>
              <p className="label-text">{userData.contact.e_mail}</p>
            </div>
            <div>
              <span className="view_label">Phone Number</span>
              <p className="label-text">{userData.contact.phone}</p>
            </div>
            <div>
              <span className="view_label">Fax</span>
              <p className="label-text">{userData.contact.fax}</p>
            </div>
            <div>
              <span className="view_label">City</span>
              <p className="label-text">{userData.address.city}</p>
            </div>
            <div>
              <span className="view_label">Zip</span>
              <p className="label-text"> {userData.address.zip}</p>
            </div>
            <div>
              <span className="view_label">State</span>
              <p className="label-text">{userData.address.state}</p>
            </div>
          </div>
        </div>
        <PageHeader
          title={t('userManagement.header.view.permissions_granted')} 
          navigateTo={`../${PATHS.userPermissions}/${userId}`}
          buttonLabels={buttonLabels}
          state={{ isEdit: true }} />


        <div className="userCardContainer">
          {Object.keys(userData.permissions).map((categoryKey, index) => {
            if (!PERMISSIONS_ENUM[categoryKey]) return null;
            return (
              <div key={index}>
                <h2 className="subheader-text">{t(`${categoryKey}`)}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userData.permissions[categoryKey].map((permissionKey, idx) => {
                    if (!PERMISSIONS_ENUM[categoryKey][permissionKey]) return null;
                    return (
                      <div key={idx} className="permission-item">
                        <div className="permission-info">
                          <h4>{t(`${categoryKey}.${permissionKey}`)}</h4>
                          <p>{t(`${categoryKey}.${permissionKey}.DESCRIPTION`)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <PageHeader
          title={t('userManagement.header.view.linked_accounts')} 
          navigateTo={`../${PATHS.addAccounts}/${userId}`}
          buttonLabels={buttonLabelsAccount}
          state={{ isEdit: true }} />
        {isSuccess && isAlertVisible && (
          <Alert
            description="2 new accounts have been successfully linked to this user" //Number shoud be dynamic --To Do
            onClose={handleAlertClose}
            type="success"
            duration={10000}
          />)}
        <div class="filterBox line-height grid grid-gap-24 grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
          <div className="toggle-box">
            <div>
              <img src={arrow_right} className="icon-align" />
            </div>
            <div className="autoSuggestSearch-container">
              <AutoSuggestSearch
                label=" "
                onChangeInput={handleSearchChange}
                outline={true}
                placeHolder={t('userManagement.searchFilter.addaccount_label')}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-gap-16">
          <AccountsList
            data={SelectedAccountData}
            selectableRows={false}
            omitColumns={['distributionChannel']}
          />
        </div>
      </div></>
  );
};

export default UserDetail;
