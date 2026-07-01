import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { RoutePaths } from '@src/routes/constants';
import { CONTROL_OPTIONS, getRuleLabel, getRuleOperator } from './RulesConfig';
import ModuleHeader from '@src/components/module-header';
import { Button, Heading, Loader, Switch, Alert, Pills } from '@mckesson/mcp-component-library';
import { ReactComponent as EditPencil } from '@src/assets/image/edit_pencil.svg';
import { useTranslate } from '@src/translations/useTranslation';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import usePermission from '@src/hooks/usePermissions';
import './NotificationGroupDetail.scss';

import CommonUtils from '@src/util/CommonUtils';
import { closeModal, openModal } from '@src/store/reducer/modalReducer';
import { useDispatch } from 'react-redux';
import NotificationService from '@src/api/commonService/NotificationService';
import NotificationUserList from './NotificationUserList';

function NotificationGroupDetails() {
  const navigate = useNavigate();
  const { groupId } = useParams();
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
    queryKey: [`notification-group/${groupId}`],
    queryFn: async () => {
      return await NotificationService.getNotificationGroup(groupId);
    },
    enabled: !!groupId,
    refetchOnWindowFocus: false
  });
  const handleActivateDeactivateNotificationGroup = async ({ groupId, actionName }) => {
    if (actionName === t('notificationgroup.button.activate')) {
      const resActivate = await NotificationService.activateNotificationGroup(groupId);
    } else {
      const resDeactivate = await NotificationService.deleteNotificationGroup(groupId);
    }
  };

  const { mutate } = useMutation({
    mutationFn: handleActivateDeactivateNotificationGroup,
    onSuccess: (response, variables) => {
      const { actionName } = variables;
      refetch();
      setIsDeactivate(true);
      setIsAlertVisible(true);
      const message =
        actionName === t('notificationgroup.button.deactivate')
          ? t('notificationgroup.messages.notificationgroup_deactivate_success')
          : t('notificationgroup.messages.notificationgroup_activate_success');
      setAlertDescription(message);
    },
    onError: (error, variables) => {
      const { actionName } = variables;
      console.error(`Failed to deactivate user:`, error);
      setIsDeactivate(true);
      setIsAlertVisible(true);
      const message =
        actionName === t('notificationgroup.button.deactivate')
          ? t('notificationgroup.messages.notificationgroup_deactivate_failure')
          : t('notificationgroup.messages.notificationgroup_activate_failure');
      setAlertDescription(message);
    }
  });

  const handleActivateDeactivate = () => {
    const state = {};
    state.title = t('notificationgroup.confirmationmessage');
    state.body = (
      <div className="MCP-modal-body">
        {groupData?.active ? t('notificationgroup.confirmationmessage.message') : t('notificationgroup.confirmationmessage.activatemessage')}
      </div>
    );
    state.footer = (
      <div className="controls">
        <Button onClick={() => dispatch(closeModal())} variant="secondary" size="md">
          {t('notificationgroup.button.cancel')}
        </Button>
        <Button
          onClick={() => {
            dispatch(closeModal());
            mutate({
              groupId: groupId,
              actionName: groupData?.active ? t('notificationgroup.button.deactivate') : t('notificationgroup.button.activate')
            });
          }}
          size="md">
          {groupData?.active ? t('notificationgroup.button.deactivate') : t('notificationgroup.button.activate')}
        </Button>
      </div>
    );
    dispatch(openModal(state));
  };

  const handleAlertClose = () => {
    setIsAlertVisible(false);
    navigate(location.pathname, { replace: true, state: { ...location.state } });
  };

  const rulesData = useMemo(() => {
    if (!groupData) return [];

    const items = [];

    if (groupData.triggers?.length) {
      items.push({
        type: 'trigger',
        key: 'triggers',
        label: getRuleLabel('triggers'),
        operator: getRuleOperator('Trigger', t, true),
        values: groupData.triggers.map((trigger) => trigger.displayName)
      });
    }

    const fieldMap = {
      therapies: 'tradeName',
      roles: 'roleName',
      users: 'userName',
      accounts: 'accountName'
    };

    Object.entries(groupData.rules || {}).forEach(([key, value]) => {
      if (!value) return;

      if (key === 'price') {
        items.push({
          type: 'price',
          key,
          label: CommonUtils.getCamelCase(key),
          operator: getRuleOperator(CommonUtils.getCamelCase(key), t),
          value
        });
        return;
      }

      const valueKey = fieldMap[key] || 'accountName';

      items.push({
        type: 'pill',
        key,
        label: CommonUtils.getCamelCase(getRuleLabel(key)),
        operator: getRuleOperator(CommonUtils.getCamelCase(getRuleLabel(key)), t, true),
        values: value.map((item) => item[valueKey])
      });
    });

    return items;
  }, [groupData]);

  const RuleItem = ({ rule }) => {
    return (
      <div className="rule-wrapper alignItemsCenter">
        <div className="condition attribute-text-segment">{t('rules.clauseIf.if')}</div>

        <div className="rule-field type">
          <div className="fake-control">{rule.label}</div>
        </div>

        <div className="rule-operator attribute-text-segment">{rule.operator}</div>

        <div className="response-control">
          {rule.type === 'price' ? (
            <div className="fake-control">
              <span>${rule.value}</span>
            </div>
          ) : (
            <div className="fake-control">
              <Pills
                id={rule.key}
                labels={rule.values.map((label, index) => ({
                  id: index + 1,
                  labelText: label
                }))}
                size="sm"
                variant="secondary"
                onDelete={() => {}}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="MCP-module-wrapper">
      {isLoading && <Loader type={'screen'} />}
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={() => navigate('../')} size="md">
          {t('notificationgroup.header.backmessage')}
        </Button>
      </div>
      {isDeactivate && isAlertVisible && <Alert description={alertDescription} onClose={handleAlertClose} type="success" />}
      <div className="MCP-module-body">
        <ModuleHeader
          heading={<Heading as="h1">{t('Notification Group')}</Heading>}
          controls={
            <Button
              Icon={EditPencil}
              variant="secondary"
              className="button-icon"
              size="md"
              disabled={!groupData?.active}
              onClick={() => navigate(`../${groupId}/edit`)}>
              {t('notificationgroup.button.edit')}
            </Button>
          }
        />
        <ModuleHeader
          heading={<Heading as="h3">{t('notificationgroup.view.subheader.group_details')}</Heading>}
          controls={<Switch handleToggle={handleActivateDeactivate} id="id" name="Toggle" size="lg" value={groupData?.active} />}
        />
        <div className="MCP-CardContainer">
          <div className="grid grid-gap-24 grid-cols-1 md:grid-cols-3">
            <div className="notification-group-labelWrap">
              <span className="view_label">{t('notificationgroup.view.subheader.group_name')}</span>
              <p className="label-text">{groupData?.name || 'N/A'}</p>
            </div>

            <div className="notification-group-labelWrap">
              <span className="view_label">{t('notificationgroup.view.subheader.group_created_by')}</span>
              <p className="label-text">{groupData?.createdBy.name || 'N/A'}</p>
            </div>

            <div className="notification-group-labelWrap">
              <span className="view_label">{t('notificationgroup.view.subheader.group_created_on')}</span>
              <p className="label-text">{groupData?.createdAt ? CommonUtils.convertDateStringFormat(groupData.createdAt, 'MM/DD/YYYY') : 'N/A'}</p>
            </div>
          </div>
        </div>

        <Heading as="h3">{t('notificationgroup.view.subheader.rules')}</Heading>
        <div className="MCP-CardContainer">
          <div className="rule-list">
            <div className="rule-list">
              {rulesData.map((rule, index) => (
                <div key={rule.key} className="rule">
                  <RuleItem rule={rule} />

                  {index < rulesData.length - 1 && (
                    <div className="hr-container">
                      <div className="hr-text">{t('rules.logicalOperator.and')}</div>
                      <hr className="hr-line" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <NotificationUserList data={groupData?.notificationUsers} />
      </div>
    </div>
  );
}

export default NotificationGroupDetails;
