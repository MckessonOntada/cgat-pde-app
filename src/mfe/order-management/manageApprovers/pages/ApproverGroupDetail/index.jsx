import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { PATHS } from '../../routes/constants';
import { RoutePaths } from '@src/routes/constants';
import { CONTROL_OPTIONS, getRuleLabel, getRuleOperator } from './RulesConfig';
import ModuleHeader from '@src/components/module-header';
import { Button, Heading, Loader, Switch, Alert, Pills } from '@mckesson/mcp-component-library';
import { ReactComponent as EditPencil } from '@src/assets/image/edit_pencil.svg';
import { useTranslate } from '@src/translations/useTranslation';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import usePermission from '@src/hooks/usePermissions';
import './ApproverGroupDetail.scss';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import CommonUtils from '@src/util/CommonUtils';
import ApproverUserList from './ApproverUserList';
import { closeModal, openModal } from '@src/store/reducer/modalReducer';
import { useDispatch } from 'react-redux';

function ApproverGroupDetails() {
  const navigate = useNavigate();
  const { grpId } = useParams();
  const { t } = useTranslate();
  const dispatch = useDispatch();
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
    const state = {};
    state.title = t('approvergroup.confirmationmessage');
    state.body = (
      <div className="MCP-modal-body">
        {groupData?.active ? t('approvergroup.confirmationmessage.message') : t('approvergroup.confirmationmessage.activatemessage')}
      </div>
    );
    state.footer = (
      <div className="controls">
        <Button onClick={() => dispatch(closeModal())} variant="secondary" size="md">
          {t('approvergroup.button.cancel')}
        </Button>
        <Button
          onClick={() => {
            dispatch(closeModal());
            mutate({
              grpId: grpId,
              actionName: groupData?.active ? t('approvergroup.button.deactivate') : t('approvergroup.button.activate')
            });
          }}
          size="md">
          {groupData?.active ? t('approvergroup.button.deactivate') : t('approvergroup.button.activate')}
        </Button>
      </div>
    );
    dispatch(openModal(state));
  };

  const handleAlertClose = () => {
    setIsAlertVisible(false);
    navigate(location.pathname, { replace: true, state: { ...location.state } });
  };

  const rules = [];
  groupData?.rules &&
    Object.entries(groupData?.rules || {}).forEach((entry, index) => {
      let [key, value] = entry;

      let beautifiedValue = value && (
        <div className="fake-control">
          <span className="rule-item-value">${value}</span>
        </div>
      );
      if (key === 'price' && value) {
        rules.push(
          <div key={index} className="rule-wrapper">
            <div className="condition attribute-text-segment">{t('rules.clauseIf.if')}</div>
            <div className="rule-field type">
              <div className="fake-control">{CommonUtils.getCamelCase(key)}</div>
            </div>
            <div className="rule-operator attribute-text-segment">{getRuleOperator(CommonUtils.getCamelCase(key), t)}</div>
            <div className={`response-control ${key === CONTROL_OPTIONS.Price ? 'price' : ''}`}>{beautifiedValue}</div>
          </div>
        );
        return;
      }
      if (!value) {
        return;
      }
      let _key = 'accountName';
      if (key === 'therapies') _key = 'tradeName';
      else if (key === 'roles') _key = 'roleName';
      else if (key === 'users') _key = 'userName';

      rules.push(
        <div key={index} className="rule-wrapper alignItemsCenter">
          <div className="condition attribute-text-segment">{t('rules.clauseIf.if')}</div>
          <div className="rule-field type">
            <div className="fake-control">{CommonUtils.getCamelCase(getRuleLabel(key))}</div>
          </div>
          <div className="rule-operator attribute-text-segment">{getRuleOperator(CommonUtils.getCamelCase(getRuleLabel(key)), t, true)}</div>
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
      {isDeactivate && isAlertVisible && <Alert description={alertDescription} onClose={handleAlertClose} type="success" />}
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
              <p className="label-text">{groupData?.createdAt ? CommonUtils.convertDateStringFormat(groupData.createdAt, 'MM-DD-YYYY') : 'N/A'}</p>
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
                    {index < rules.length - 1 && <div className="hr-text">{t('rules.logicalOperator.and')}</div>}
                    <hr className="hr-line" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <ApproverUserList data={groupData?.approverUsers} />
      </div>
    </div>
  );
}

export default ApproverGroupDetails;
