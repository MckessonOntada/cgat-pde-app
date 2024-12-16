import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

// Contexts
import { useApprover } from '../../context/ApproverContext';

// Constants
import { PATHS } from '../../routes/constants';
import { RoutePaths } from '@src/routes/constants';
import { RulesConfig } from './RulesConfig';

// Components
import ModuleHeader from '@src/components/module-header';
import { Button, Heading } from '@mckesson/mcp-component-library';
import EmptyDataTable from '@src/components/EmptyTable';

// Assets
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { ReactComponent as EditPencil } from '@src/assets/image/edit_pencil.svg';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';

// Translations
import { useTranslate } from '@src/translations/useTranslation';

// Styles
import './ApproverGroupDetail.scss';

// API
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';

import { APPROVER_GROUP_DATA as resData } from '../../mockData/_mock_';
function ApproverGroupDetails() {
  const navigate = useNavigate();
  const { grpId } = useParams();
  const { t } = useTranslate();

  const {
    isLoading,
    data: groupData,
    isError
  } = useQuery({
    queryKey: [`practices/${grpId}`],
    queryFn: async () => {
      // const res = await HttpResourceService.callRest(
      //   `${ApiRoutes.GET_APPROVER_GROUP_DATA(grpId)}`, // Use practice id from organization
      //   httpVerb.GET,
      //   {}
      // );

      return resData;
    },
    refetchOnWindowFocus: false
  });

  // const groupData = data?.[id - 1];

  const handleGoBack = () => {
    navigate(RoutePaths.pathApproverManagement);
  };

  return (
    <div className="MCP-module-wrapper">
      <div
        className="back-navigation py2 capitalize"
        onClick={() => {
          handleGoBack();
        }}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <MdOutlineKeyboardArrowLeft size="24px" />
        <p>{t('approvergroup.header.backmessage')}</p>
      </div>

      <div className="MCP-module-body">
        <ModuleHeader
          heading={<Heading as="h1">{t('approvergroup.view.header')}</Heading>}
          controls={
            <Button
              Icon={EditPencil}
              variant="secondary"
              className="button-icon"
              size="md"
              disabled={false}
              onClick={() => navigate(`../${PATHS.editapprovergroup}/${grpId}`, { state: { data: resData } })}>
              {t('approvergroup.button.edit')}
            </Button>
          }
        />

        <Heading as="h3">{t('approvergroup.view.subheader.group_details')}</Heading>
        <div className="MCP-panel-container">
          <div className="grid grid-gap-24 grid-cols-1 md:grid-cols-3">
            <div className="approver-group-labelWrap">
              <span className="view_label">{t('approvergroup.view.subheader.group_name')}</span>
              <p className="label-text">{groupData?.groupName || 'N/A'}</p>
            </div>

            <div className="approver-group-labelWrap">
              <span className="view_label">{t('approvergroup.view.subheader.group_created_by')}</span>
              <p className="label-text">{groupData?.createdBy || 'N/A'}</p>
            </div>

            <div className="approver-group-labelWrap">
              <span className="view_label">{t('approvergroup.view.subheader.group_created_on')}</span>
              <p className="label-text">{groupData?.createdOn || 'N/A'}</p>
            </div>
          </div>
        </div>

        <Heading as="h3">{t('approvergroup.view.subheader.attributes')}</Heading>
        <div className="MCP-panel-container grid grid-gap-16">
          {!(groupData?.rules && Object.keys(groupData.rules).length > 0) ? (
            <EmptyDataTable
              image={EmptyDataImage}
              heading={t('message.emptyTableTitle')}
              description={t('approvergroup.messages.emptysubtitle')}
            />
          ) : (
            RulesConfig.map(({ key, label, valueKey }) =>
              groupData.rules[key] !== undefined &&
              (Array.isArray(groupData.rules[key]) ? groupData.rules[key].length > 0 : groupData.rules[key]) ? (
                <div key={key} className="MCP-module-body attribute-category">
                  <div className="subheader-text">{t(label)}</div>
                  <div className="attribute-category">
                    <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 attribute-list">
                      {Array.isArray(groupData.rules[key])
                        ? groupData.rules[key].map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between attribute-item">
                              <div>
                                <h4>{item[valueKey]}</h4>
                              </div>
                            </div>
                          ))
                        : valueKey === null && (
                            <div className="flex items-center justify-between attribute-item">
                              <div>
                                <h4>{groupData.rules[key]}</h4>
                              </div>
                            </div>
                          )}
                    </div>
                  </div>
                </div>
              ) : null
            )
          )}
        </div>

        <Heading as="h3">{t('approvergroup.view.subheader.manage_treatment_center')}</Heading>
        <div className="MCP-panel-container grid grid-gap-16">
          {groupData?.approverUsers && groupData?.approverUsers.length > 0 ? (
            <div className="grid grid-gap-16 grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 approver-user-list">
              {groupData.approverUsers.map(({ userId, userName }, idx) => (
                <React.Fragment key={userId}>
                  <div className="flex items-center justify-between attribute-item approver-user-item">
                    <div>
                      <h4>{userName}</h4>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          ) : (
            <EmptyDataTable
              image={EmptyDataImage}
              heading={t('message.emptyTableTitle')}
              description={t('approvergroup.messages.emptysubtitle')}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ApproverGroupDetails;
