import React, { useState, useCallback, useEffect } from 'react'
import { Stepper, AutoSuggestSearch, Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import PageHeader from '@src/components/pageHeader';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import arrow_right from '@src/assets/image/arrow_right.svg';
import AccountsList from '@src/components/Accounts/AccountsList';
import AllAccountsData from '@src/mfe/org-management/mockData/AllAccounts';
import { RoutePaths } from '@src/routes/constants';
import { PATHS } from '../../routes/constants';

const AddAccounts = () => {
    const { t } = useTranslate();
    const navigate = useNavigate();
    const location = useLocation();
    const { userId } = useParams();
    const [searchText, setSearchText] = useState("");
    const [selectedAccounts, setSelectedAccounts] = useState([]);
    const { isEdit } = location.state || {};
    const isSuccess = location.state?.isSuccess || false;


    const handleGoBack = () => {
        navigate(-1);
    };

    const handleSearchChange = (inputValue) => {
        setSearchText(inputValue);
    };
    const onRemoveAccount = useCallback(
        (item) => {
            setSelectedAccounts(selectedAccounts.filter((account) => account.id !== item.id));
        },
        [selectedAccounts, setSelectedAccounts]
    );

    const handleSaveandContinue = () => {
        navigate(RoutePaths.pathUserManagement, { state: { isSuccess: true } });
        alert(
            `Selected Accounts: ${JSON.stringify(selectedAccounts, null, 2)}`
        );
    };

    const handleAddAccounts = () => {
        navigate(`../${userId}`, { state: { isSuccess: true } });
        alert(
            `Selected Accounts: ${JSON.stringify(selectedAccounts, null, 2)}`
        );
    };

    return (
        <div>
            <div
                className="back-navigation py2 capitalize"
                onClick={handleGoBack}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
                <MdOutlineKeyboardArrowLeft size="24px" />
                <p>Back to Manage Users</p>
            </div>
            <PageHeader
                title={t('userManagement.create_user')}
            /><div className="stepper">
                <Stepper
                    activeIndex={3}
                    dividerText="of"
                    stepHeaders={[
                        {
                            label: t('userManagement.stepper.option.user_details'),
                        },
                        {
                            label: t('userManagement.stepper.option.roles_and_permissions'),
                        },
                        {
                            label: t('userManagement.stepper.option.associate_accounts'),
                        },
                    ]}
                />
            </div>
            <div class="MCP-panel-container line-height grid grid-gap-24 grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
                <div className="toggle-box">
                    <img src={arrow_right} className="icon-align" />
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

            <div className="">
                <div className="grid grid-gap-16">
                    <AccountsList
                        data={AllAccountsData}
                        selectedRows={selectedAccounts}
                        setSelectedRows={setSelectedAccounts}
                        onRemoveAccount={onRemoveAccount}
                        showSelectedAccounts
                        omitColumns={['action', 'cgatIdentifier', 'address']}
                    />
                </div>
            </div>
            <div className={'buttonGroup'}>
                <Button variant="secondary" type="button" onClick={handleGoBack} size={'md'}>
                    {t('userManagement.button.back')}
                </Button>
                {!isEdit && (
                    <Button variant="primary" type="button" onClick={handleSaveandContinue} size={'md'}>{t('userManagement.button.adduser')}</Button>)}
                {isEdit && (
                    <Button variant="primary" type="button" onClick={handleAddAccounts} size={'md'}>{t('userManagement.button.add_accounts')}</Button>)}
            </div>
        </div>

    )
}

export default AddAccounts;