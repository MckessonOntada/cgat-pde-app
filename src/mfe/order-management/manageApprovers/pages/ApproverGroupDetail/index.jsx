import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';

import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
// Constants
import { PATHS } from '../../routes/constants';
import { RoutePaths } from '@src/routes/constants';
import { CONTROL_OPTIONS, RuleKeys, RulesConfig } from './RulesConfig';

// Components
import ModuleHeader from '@src/components/module-header';
import { Button, Heading, Loader, Switch, Alert, Modal, Pills } from '@mckesson/mcp-component-library';
import EmptyDataTable from '@src/components/EmptyTable';

// Assets
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { ReactComponent as EditPencil } from '@src/assets/image/edit_pencil.svg';

// Translations
import { useTranslate } from '@src/translations/useTranslation';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import usePermission from '@src/hooks/usePermissions';
// Styles
import './ApproverGroupDetail.scss';

// API
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import CommonUtils from '@src/util/CommonUtils';
import ApproverUserList from './ApproverUserList';

const ruleAttributeConnectingSegment = {
  Therapies: 'ORDERED ANY OF',
  Price: 'GREATER THAN',
  Accounts: 'SELECTED ANY OF',
  Roles: 'SELECTED ANY OF',
  Users: 'SELECTED ANY OF'
};

const getCamelCase = (str) => str.replace(/(^\w|[-_]\w)/g, (match) => match.replace(/[-_]/, '').toUpperCase());

function ApproverGroupDetails() {
  const navigate = useNavigate();
  const { grpId } = useParams();
  const { t } = useTranslate();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeactivate, setIsDeactivate] = useState(false);
  const [alertDescription, setAlertDescription] = useState('');
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const { hasPermission } = usePermission();
  const {
    isLoading,
    data: groupData,
    isError,
    refetch
  } = useQuery({
    queryKey: [`approver-group/${grpId}`],
    queryFn: async () => {
      const res = await HttpResourceService.callRest(`${ApiRoutes.APPROVER_GROUP()}/${grpId}`, httpVerb.GET, {});
      if (res.data) {
        return res.data;
      }
    },
    enabled: !!grpId,
    refetchOnWindowFocus: false
  });

  const handleActivateDeactivateApproverGroup = async ({ grpId, actionName }) => {
    if (actionName === t('approvergroup.button.activate')) {
      const resActivate = await HttpResourceService.callRest(`${ApiRoutes.APPROVER_GROUP()}/${grpId}/activate`, httpVerb.PATCH, null);
      return resActivate.data;
    } else {
      const resDeactivate = await HttpResourceService.callRest(`${ApiRoutes.APPROVER_GROUP()}/${grpId}`, httpVerb.DELETE, null);
      return resDeactivate.data;
    }
  };

  const { mutate } = useMutation({
    mutationFn: handleActivateDeactivateApproverGroup,
    onSuccess: (response, variables) => {
      const { actionName } = variables;
      refetch();
      setIsDeactivate(true);
      setIsAlertVisible(true);
      const message =
        actionName === t('approvergroup.button.deactivate')
          ? t('approvergroup.messages.approvergroup_deactivate_success')
          : t('approvergroup.messages.approvergroup_activate_success');
      setAlertDescription(message);
    },
    onError: (error, variables) => {
      const { actionName } = variables;
      console.error(`Failed to deactivate user:`, error);
      setIsDeactivate(true);
      setIsAlertVisible(true);
      const message =
        actionName === t('approvergroup.button.deactivate')
          ? t('approvergroup.messages.approvergroup_deactivate_failure')
          : t('approvergroup.messages.approvergroup_activate_failure');
      setAlertDescription(message);
    }
  });

  const handleGoBack = () => {
    navigate(RoutePaths.pathApproverManagement);
  };

  const handleActivateDeactivate = () => {
    setIsOpen(true);
  };

  const handleConfirm = (actionName) => {
    setIsOpen(false);
    mutate({ grpId: grpId, actionName });
  };

  const handleConfirmCancel = () => {
    setIsOpen(false);
  };

  const handleAlertClose = () => {
    setIsAlertVisible(false);
    navigate(location.pathname, { replace: true, state: { ...location.state } });
  };

  const rules = [];
  groupData?.rules &&
    Object.entries(groupData?.rules || {}).forEach((entry, index) => {
      let [key, value] = entry;
      let beautifiedValue = <span className="rule-item-value">{value}</span>;
      if (key === 'price') {
        rules.push(
          <div key={index} className="rule-wrapper">
            <div className="condition attribute-text-segment">IF</div>
            <div className="control type">
              <div className="fake-control">{key}</div>
            </div>
            <div className="clause attribute-text-segment">{ruleAttributeConnectingSegment[getCamelCase(key)]}</div>
            <div className={`response-control ${key === CONTROL_OPTIONS.price ? 'price' : ''}`}>
              <div className="fake-control">{beautifiedValue}</div>
            </div>
          </div>
        );
        return;
      }
      if (!value) {
        return;
      }
      let _key = 'accountName';
      if (key === 'therapies') _key = 'therapyName';
      else if (key === 'roles') _key = 'roleName';
      else if (key === 'users') _key = 'userName';
      console.log(key);
      rules.push(
        <div key={index} className="rule-wrapper">
          <div className="condition attribute-text-segment">IF</div>
          <div className="control type">
            <div className="fake-control">{key.toUpperCase()}</div>
          </div>
          <div className="clause attribute-text-segment">{ruleAttributeConnectingSegment[getCamelCase(key)]}</div>
          <div className={`response-control ${key === CONTROL_OPTIONS.Price ? 'price' : ''}`}>
            <div className="fake-control">
              <Pills
                id="id"
                labels={value.map((val, index) => ({
                  id: index + 1,
                  labelText: val[_key]
                }))}
                name="Pill"
                onDelete={() => {}}
                size="sm"
                variant="secondary"
              />
            </div>
          </div>
        </div>
      );
    });
  return (
    <div className="MCP-module-wrapper">
      {isLoading && <Loader type={'screen'} />}
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleGoBack} size="md">
          {t('approvergroup.header.backmessage')}
        </Button>
      </div>
      {isDeactivate && isAlertVisible && (
        <Alert description={alertDescription} onClose={handleAlertClose} type="success" duration={10000} />
      )}
      <div className="MCP-module-body">
        <ModuleHeader
          heading={<Heading as="h1">{t('approvergroup.view.header')}</Heading>}
          controls={
            hasPermission(PERMISSIONS_ENUM.ORDER_MANAGEMENT.EDIT_APPROVER_GROUP) && (
              <Button
                Icon={EditPencil}
                variant="secondary"
                className="button-icon"
                size="md"
                disabled={!groupData?.active}
                onClick={() => navigate(`../${PATHS.editapprovergroup}/${grpId}`, { state: { data: groupData } })}>
                {t('approvergroup.button.edit')}
              </Button>
            )
          }
        />
        <ModuleHeader
          heading={<Heading as="h3">{t('approvergroup.view.subheader.group_details')}</Heading>}
          controls={
            hasPermission(PERMISSIONS_ENUM.ORDER_MANAGEMENT.EDIT_APPROVER_GROUP) && (
              <Switch handleToggle={handleActivateDeactivate} id="id" name="Toggle" size="lg" value={groupData?.active} />
            )
          }
        />
        <div className="MCP-CardContainer">
          <div className="grid grid-gap-24 grid-cols-1 md:grid-cols-3">
            <div className="approver-group-labelWrap">
              <span className="view_label">{t('approvergroup.view.subheader.group_name')}</span>
              <p className="label-text">{groupData?.name || 'N/A'}</p>
            </div>

            <div className="approver-group-labelWrap">
              <span className="view_label">{t('approvergroup.view.subheader.group_created_by')}</span>
              <p className="label-text">{groupData?.createdBy.name || 'N/A'}</p>
            </div>

            <div className="approver-group-labelWrap">
              <span className="view_label">{t('approvergroup.view.subheader.group_created_on')}</span>
              <p className="label-text">
                {groupData?.createdAt ? CommonUtils.convertDateStringFormat(groupData.createdAt, 'MM-DD-YYYY') : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <Heading as="h3">{t('approverGroup.view.subheader.rules')}</Heading>
        <div className="MCP-CardContainer">
          <div className="rule-list">
            {rules.map((rule, index) => {
              return (
                <div className="rule" key={`rule-segment-${index}`}>
                  {rule}
                  <div className="hr-container">
                    {index < rules.length - 1 && <div className="attribute-text-segment">AND</div>}
                    <hr className="hr-line" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <ApproverUserList data={groupData?.approverUsers} />
      </div>
      <Modal
        id="xxxs-modal"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        modalTitle={t('approvergroup.confirmationmessage')}
        modalBody={
          <div className="MCP-modal-body">
            {groupData?.active ? t('approvergroup.confirmationmessage.message') : t('approvergroup.confirmationmessage.activatemessage')}
          </div>
        }
        modalFooter={
          <React.Fragment>
            <Button onClick={handleConfirmCancel} variant="secondary">
              {t('approvergroup.button.cancel')}
            </Button>
            <Button
              onClick={() => handleConfirm(groupData?.active ? t('approvergroup.button.deactivate') : t('approvergroup.button.activate'))}>
              {groupData?.active ? t('approvergroup.button.deactivate') : t('approvergroup.button.activate')}
            </Button>{' '}
          </React.Fragment>
        }
        modalSize="xxxs"
      />
    </div>
  );
}

export default ApproverGroupDetails;
