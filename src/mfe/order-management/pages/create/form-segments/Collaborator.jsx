import { useTranslate } from '@src/translations/useTranslation';
import React, { useMemo, useState } from 'react';
import { Tooltip, Button, Loader } from '@mckesson/mcp-component-library';
import { CHANNEL_TYPE, GET_STAGE_DISPLAY_NAME, ORDER_STAGES, STAGE_COLORS, STAGE_INDEX } from './Constants';
import { useQuery } from 'react-query';
import OrderService from '@src/api/commonService/OrderService';
import { CollaboratorRoleDrawer } from './CollaboratorRoleDrawer';

const Collaborator = ({ collaborators, channelType, currentStage, orderId, showControls = true, isCustomerCentreUser }) => {
  const [openDetails, setOpenDetails] = useState(false);
  const { t } = useTranslate();

  const getStageIndex = (stageKey) => {
    const stages = Object.keys(ORDER_STAGES);
    return stages.indexOf(stageKey);
  };
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(', ')
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const { data: roles, isLoading } = useQuery({
    queryKey: [currentStage, orderId],
    queryFn: () => OrderService.getOrderStagesRoles(orderId),
    enabled: !isCustomerCentreUser
  });

  function buildCollaborators(data) {
    const userMap = {};

    Object.entries(data).forEach(([stage, users]) => {
      users.forEach((user) => {
        const { id, name } = user;

        if (!userMap[id]) {
          userMap[id] = {
            Name: name,
            id,
            initials: getInitials(name),
            collaboratedOn: {},
            color: null,
            stageId: null
          };
        }

        if (!userMap[id].collaboratedOn[stage]) {
          userMap[id].collaboratedOn[stage] = GET_STAGE_DISPLAY_NAME(stage, channelType, t);
          userMap[id].stageId = getStageIndex(stage);
        }
      });
    });

    for (const id in userMap) {
      const stages = userMap[id].collaboratedOn;
      let maxIndex = -1;
      let finalStage = null;

      Object.keys(stages).forEach((stageKey) => {
        const idx = getStageIndex(stageKey);
        if (idx > maxIndex) {
          maxIndex = idx;
          finalStage = stageKey;
        }
      });
      userMap[id].color = finalStage ? STAGE_COLORS[finalStage] : null;
    }
    return Object.values(userMap).sort((a, b) => a.stageId - b.stageId);
  }

  const collaboratorsData = buildCollaborators(collaborators);

  const getRoleAndUsersList = (permission) => {
    const found = roles?.find((r) => r.permission === permission);
    return found?.roleAndUsersList || {};
  };

  const generateStageCards = () => {
    return [
      {
        id: 1,
        name: t('labels.therapySelection') || GET_STAGE_DISPLAY_NAME(stage, channelType, t),
        labels: getRoleAndUsersList('THERAPY_SELECTION'),
        collaborators: collaborators.THERAPY_SELECTION?.map((item) => item.name),
        initialsColor: STAGE_COLORS.THERAPY_SELECTION
      },
      {
        id: 2,
        name: t('labels.accountSelection'),
        labels: getRoleAndUsersList('ACCOUNT_SELECTION'),
        collaborators: collaborators.ACCOUNT_DETAILS?.map((item) => item.name),
        initialsColor: STAGE_COLORS.ACCOUNT_DETAILS
      },
      {
        id: 3,
        name: t(channelType === CHANNEL_TYPE.SPECIALTY_PHARMA ? 'stepper.label.PATIENT_AND_PROVIDER_DETAILS' : 'labels.patientDetails'),
        labels: getRoleAndUsersList('UPDATE_PATIENTS_DETAILS'),
        collaborators: collaborators.PATIENT_DETAILS?.map((item) => item.name),
        initialsColor: STAGE_COLORS.PATIENT_DETAILS
      },
      ...(channelType === CHANNEL_TYPE.SPECIALTY_PHARMA
        ? [
            {
              id: 4,
              name: t('labels.payerDetails'),
              labels: getRoleAndUsersList('UPDATE_PATIENTS_DETAILS'),
              collaborators: collaborators.PAYER_DETAILS?.map((item) => item.name),
              initialsColor: STAGE_COLORS.PAYER_DETAILS
            }
          ]
        : []),
      {
        id: 5,
        name: t('labels.additionalDetails'),
        labels: getRoleAndUsersList('UPDATE_ADDITIONAL_DETAILS'),
        collaborators: collaborators.ADDITIONAL_DETAILS?.map((item) => item.name),
        initialsColor: STAGE_COLORS.ADDITIONAL_DETAILS
      },
      {
        id: 6,
        name: t('labels.summary'),
        labels: getRoleAndUsersList('SUBMIT_ORDER'),
        collaborators: collaborators.ORDER_SUMMARY?.map((item) => item.name),
        initialsColor: STAGE_COLORS.ORDER_SUMMARY
      }
    ];
  };

  const stageCards = useMemo(generateStageCards, [roles, collaborators, channelType]);

  return (
    collaboratorsData.length > 0 && (
      <div className="collaborator">
        {showControls && (
          <Button label="Tertiary" onClick={() => setOpenDetails(true)} size="md" variant="tertiary">
            {t('control.whoCanDoWhat')}
          </Button>
        )}
        <p>{t('labels.collaborators')}</p>
        <div className="collaborator-initials">
          {collaboratorsData.map((collab, idx) => (
            <Tooltip
              key={idx}
              body={
                <span>
                  <strong>{collab?.Name}</strong> - {Object.values(collab?.collaboratedOn).join(', ')}
                </span>
              }>
              <span style={{ backgroundColor: collab?.color }}>{collab?.initials}</span>
            </Tooltip>
          ))}
        </div>
        <CollaboratorRoleDrawer
          open={openDetails}
          onClose={() => setOpenDetails(false)}
          stageCards={stageCards}
          getInitials={getInitials}
          currentStage={STAGE_INDEX[currentStage]}
          isLoading={isLoading}
        />
      </div>
    )
  );
};

export default Collaborator;
