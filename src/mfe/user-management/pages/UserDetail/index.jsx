import React, { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; 
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as pencil_write_edit } from '@src/assets/image/pencil-write-edit.svg';
import { ReactComponent as add_circle_bold } from '@src/assets/image/add_circle_bold.svg';
import { Badge, Button, Switch, AutoSuggestSearch, Alert } from '@mckesson/mcp-component-library';
import './index.scss';
import { PERMISSIONS_ENUM } from "../UserPermissions/permissionsEnum";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import SelectedAccountData from '@src/mfe/org-management/mockData/SelectedAccountData';
import AccountsList from '@src/components/Accounts/AccountsList';
import arrow_right from '@src/assets/image/arrow_right.svg';
import { PATHS } from "../../routes/constants";
import ModuleHeader from "../../../../components/module-header";
import { useQuery } from "react-query";
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/common/util/ApiUtils';
import AuthUtils from '@src/common/util/AuthUtils';


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
  const [userData ,setUserData] = useState();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const location = useLocation();
  const isSuccess = location.state?.isSuccess || false;

  const requestParams = {
    userType: AuthUtils.getUserRole() === 'SYSTEM_ADMIN' ? 'ADMIN' : 'GENERAL'
  };

  const { isLoading, isError, data } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await HttpResourceService.callRest(
        `${ApiRoutes.USERS()}/${userId}?${serializeParams(requestParams)}`, // Use practice id from organization
        httpVerb.GET,
        {}
      );
      return res.data;
    },
    refetchOnWindowFocus: false
  });
  useEffect(() => {
    if (data?.content) {
      setUserData(data.content[0]);  
    }
  },[data])

  console.log("data", isLoading, isError, data)

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
   

  const groupPermissionsByCategory = (userPermissions, permissionsEnum) => {
    const groupedPermissions = {}; 
    userPermissions.forEach((permission) => { 
      Object.keys(permissionsEnum).forEach((category) => {
        const categoryPermissions = permissionsEnum[category]; 
        if (Object.values(categoryPermissions).includes(permission)) { 
          if (!groupedPermissions[category]) {
            groupedPermissions[category] = [];
          }
          groupedPermissions[category].push(permission);
        }
      });
    });
  
    return groupedPermissions;
  };
  const groupedPermissions = groupPermissionsByCategory(userData?.permissions || [], PERMISSIONS_ENUM);


  return (
    <div className="MCP-module-wrapper">
      <div
        className="back-navigation py2 capitalize"
        onClick={goBack}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        <MdOutlineKeyboardArrowLeft size="24px" />
        <p>Back to Manage Users</p>
      </div>
      <div className="MCP-module-body">

        <ModuleHeader
          heading={<p className='primaryHeading'>{t('userManagement.header.view.edit_user')}</p>}
          controls={
            <Button Icon={pencil_write_edit} variant="secondary" className="button-icon" size="md" onClick={() => navigate(`../${PATHS.editUser}/${userId}`, { state: { isEdit: true } })}>
              {t('userManagement.button.edit')}
            </Button>
          }
        />
        <div className="MCP-panel-container">
          <div className="user-header">
            <div className="user-info">
              <div className=" subheader-text">{`${userData?.name.lastName} ${userData?.name.firstName},${userData?.name.middleName} `}
              </div>
              <Badge text={userData?.role.name} type={getbgColorOnRole(userData?.role.name)} />
            </div>
            <div className="user-status">
              <span className="view_label">Last Updated On:</span>
              <span className="label-text">{userData?.date_added}</span>
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
              <p className="label-text">{userData?.address.address1}, {userData?.address.address2}, {userData?.address.city}, {userData?.address.state}, {userData?.address.zip}</p>
            </div>
            <div>
              <span className="view_label">Email ID</span>
              <p className="label-text">{userData?.contact.email}</p>
            </div>
            <div>
              <span className="view_label">Phone Number</span>
              <p className="label-text">{userData?.contact.phone}</p>
            </div>
            <div>
              <span className="view_label">Fax</span>
              <p className="label-text">{userData?.contact.fax}</p>
            </div>
            <div>
              <span className="view_label">City</span>
              <p className="label-text">{userData?.address.city}</p>
            </div>
            <div>
              <span className="view_label">Zip</span>
              <p className="label-text"> {userData?.address.zip}</p>
            </div>
            <div>
              <span className="view_label">State</span>
              <p className="label-text">{userData?.address.state}</p>
            </div>
          </div>
        </div>

        <ModuleHeader
          heading={<p className='primaryHeading'>{t('userManagement.header.view.permissions_granted')}</p>}
          controls={
            <div className="controls">
              <Button  Icon={pencil_write_edit} variant="secondary"  className="button-icon"  size="md" onClick={() => navigate(`../${PATHS.userPermissions}/${userId}`, { state: { isEdit: true } })}>
                {t('userManagement.button.edit')}
              </Button>              
            </div>
          }
        /> 

        <div className="MCP-panel-container">
          {Object.keys(groupedPermissions).map((categoryKey, index) => {         
            return (
              <div key={index}>
                <h2 className="subheader-text">{t(`${categoryKey}`)}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupedPermissions[categoryKey].map((permissionKey, idx) => {
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
 

        <div className="MCP-module-body">
          <ModuleHeader
            heading={<p className='primaryHeading'>{t('userManagement.header.view.linked_accounts')}</p>}
            controls={
              <div className="controls">
                <Button Icon={add_circle_bold} variant="secondary" className="button-icon"  size="md" onClick={() => navigate(`../${PATHS.addAccounts}/${userId}`, { state: { isEdit: true } })}>{t('userManagement.button.add_accounts')}</Button>
              </div>
            }
          />
          {isSuccess && isAlertVisible && (
            <Alert
              description="2 new accounts have been successfully linked to this user" //Number shoud be dynamic --To Do
              onClose={handleAlertClose}
              type="success"
              duration={10000}
            />)}
          <div className="MCP-panel-container">
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
          </div>
        </div>


      </div></div>
  );
};

export default UserDetail;
