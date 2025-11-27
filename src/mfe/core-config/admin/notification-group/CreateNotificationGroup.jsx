import DynamicRuleGroup from '@src/components/rule-group';
import config from './config.js';
import React from 'react';
import { Alert, Button, Heading } from '@mckesson/mcp-component-library';
import { Formik, Form } from 'formik';
import { NotificationGroupSchema } from './validation.schema.js';
import { useNavigate, useParams } from 'react-router-dom';
import NotificationService from '@src/api/commonService/NotificationService.js';
import AuthUtils from '@src/util/AuthUtils.js';
import CommonUtils from '@src/util/CommonUtils.js';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useTranslate } from '@src/translations/useTranslation.js';
import ModuleHeader from '@src/components/module-header/index.jsx';

function CreateNotificationGroup({ mode }) {
  const isEdit = mode === 'edit';
  const { t: translateFn } = useTranslate();
  const { groupId } = useParams();
  const [alert, setAlert] = React.useState(null);
  const navigate = useNavigate();
  const [initialState, setInitialState] = React.useState({
    groupName: '',
    participants: [],
    rules: []
  });

  React.useEffect(() => {
    if (isEdit && groupId) {
      NotificationService.getNotificationGroup(groupId)
        .then((response) => {
          const { name, notificationUsers, rules, triggers } = response;
          const initialState = {
            rules: []
          };
          initialState.groupName = name;
          initialState.participants = notificationUsers.map((user) => ({
            ...user,
            label: user.userName,
            value: user.userId,
            isChecked: true
          }));
          if (triggers) {
            initialState.rules.push({
              attribute: 'notification-trigger',
              value: triggers.map((trigger) => ({
                label: trigger.displayName,
                labelDescription: trigger.description,
                value: trigger.type,
                isChecked: true
              }))
            });
          }
          if (rules.price) {
            initialState.rules.push({ attribute: 'price', value: rules.price });
          }
          if (rules.accounts) {
            initialState.rules.push({
              attribute: 'account',
              value: rules.accounts.map((accounts) => ({
                ...accounts,
                label: accounts.accountName,
                labelDescription: accounts.accountId,
                value: accounts.accountId
              }))
            });
          }
          if (rules.therapies) {
            initialState.rules.push({
              attribute: 'material',
              value: rules.therapies.map((therapy) => ({
                ...therapy,
                label: therapy.tradeName,
                value: therapy.tradeName
              }))
            });
          }
          setInitialState({ ...initialState });
        })
        .catch((error) => {
          setAlert({
            description: error.message,
            type: 'error'
          });
        });
    }
  }, [groupId]);

  const handleOnSubmit = (formValues) => {
    const { groupName, participants } = formValues;
    const payload = {
      rules: {}
    };
    payload.name = groupName;
    payload.notificationUsers = participants.map((participant) => {
      return {
        userId: participant.value,
        userName: participant.label,
        email: participant.email,
        phoneNumber: participant.phoneNumber
      };
    });
    const rules = formValues.rules.reduce((acc, item) => {
      acc[item.attribute] = item.value;
      return acc;
    }, {});

    if (rules['notification-trigger']) {
      payload.triggers = rules['notification-trigger'].map((trigger) => trigger.value);
    }
    if (rules.price) {
      payload.rules.price = rules.price;
    }
    if (rules['material']) {
      payload.rules.therapies = rules['material'].map(({ value, channelType }) => ({
        tradeName: value,
        channelType
      }));
    }
    if (rules['account']) {
      payload.rules.accounts = rules['account'].map(({ accountId, accountName, channelType }) => ({
        accountId,
        accountName,
        channelType
      }));
    }
    payload.practiceName = AuthUtils.getOrgName();
    let curdPromise = null;
    if (isEdit) {
      curdPromise = NotificationService.updateNotificationGroup(groupId, payload);
    } else {
      curdPromise = NotificationService.createNotificationGroup(payload);
    }
    if (curdPromise) {
      curdPromise
        .then((response) => {
          let message = '';
          if (isEdit) message = `Notification group ${groupName} updated successfully.`;
          else message = `New notification group ${groupName} is created successfully.`;
          navigate('../', {
            state: {
              alert: {
                type: 'success',
                description: message
              }
            }
          });
        })
        .catch((error) => {
          const errorMessage = CommonUtils.getAxiosErrorMessage(error);
          setAlert({
            type: 'error',
            description: errorMessage
          });
        });
    }
  };

  return (
    <React.Fragment>
      <Formik onSubmit={handleOnSubmit} validationSchema={NotificationGroupSchema} initialValues={initialState} enableReinitialize>
        <Form>
          <div className="MCP-module-wrapper">
            <div className="MCP-module-header">
              <div>
                <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={() => navigate('../')} size="md">
                  {translateFn('button.caption.backToNotificationGroup')}
                </Button>
              </div>
              <ModuleHeader heading={<Heading as="h2">{config.moduleTitle}</Heading>} />
            </div>
            {alert && <Alert {...alert} onClick={() => setAlert(null)} />}
            <DynamicRuleGroup config={config} />
            <div className="controls">
              <Button variant="secondary" type="button" onClick={() => {}} size={'md'}>
                Cancel
              </Button>
              <Button type="submit" size="md">
                {isEdit ? 'Update Group' : 'Create Group'}
              </Button>
            </div>
          </div>
        </Form>
      </Formik>
    </React.Fragment>
  );
}

export default CreateNotificationGroup;
