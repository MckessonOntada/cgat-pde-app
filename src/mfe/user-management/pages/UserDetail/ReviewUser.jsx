import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import {
  Badge,
  Button,
  Heading,
  Loader,
  Label
} from '@mckesson/mcp-component-library';
import './index.scss';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import ModuleHeader from '@src/components/module-header';
import { useQuery, useMutation } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import CommonUtils, { formatAddress } from '@src/util/CommonUtils.js';
import { RoutePaths } from '@src/routes/constants';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import DetailSegment from '@src/components/DetailSegment';

const ReviewUser = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { userId } = useParams();

  const { isLoading, isError, data, refetch } = useQuery({
    queryKey: [`users/${userId}`],
    queryFn: async () => {
      const url = `${ApiRoutes.USERS_PROVISIONING()}/${userId}`;
      const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
      return res.data;
    },
    enabled: !!userId,
    refetchOnWindowFocus: false
  });

  const goBack = () => {
    navigate(RoutePaths.pathUserManagement);
  };

  if (isLoading) {
    return <Loader type={'screen'} />;
  }
  const userFullName = `${data?.name.lastName} ${data?.name.firstName}${
    data?.name.middleName ? `, ${data?.name.middleName}` : ''
  }`;
  const fullAddress = formatAddress(data?.address);
  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button
          className="back-button-control"
          variant="tertiary"
          Icon={() => <IconArrowLeft />}
          onClick={goBack}
          size="md">
          {t('userManagement.user.backmessage')}
        </Button>
      </div>

      <div className="MCP-module-body">
        <ModuleHeader
          heading={
            <Heading as="h1">{t('userManagement.header.review_user')}</Heading>
          }
          controls={
            <div className="row-space-between-center lblStatusDetails">
              <Label className="lblStatus">
                {t(`userManagement.table.status`)}
              </Label>
              <Badge text="REJECTED" type="error" />
            </div>
          }
        />

        <div className="MCP-panel-container">
          <ModuleHeader
            heading={
              <div className="subheader-text">
                <Heading as="h2">
                  <EclipsesTextcss str={userFullName} maxWidth={500} />
                </Heading>
              </div>
            }
          />

          <div className="grid grid-gap-24 grid-cols-1 md:grid-cols-4">
            <DetailSegment
              label={t('userManagement.userDetails.userAddress')}
              value={fullAddress}
            />
            <DetailSegment
              label={t('userManagement.create_user.inputLabel.email')}
              value={data?.contact.email}
            />
            <DetailSegment
              label={t('userManagement.create_user.inputLabel.phone_no')}
              value={
                data?.contact.phone
                  ? CommonUtils.formatPhoneNumber(data.contact.phone)
                  : '-'
              }
            />
            <DetailSegment
              label={t('userManagement.create_user.inputLabel.fax')}
              value={data?.contact.fax || '-'}
            />
            <DetailSegment
              label={t('userManagement.create_user.inputLabel.city')}
              value={data?.address.city || '-'}
            />
            <DetailSegment
              label={t('userManagement.create_user.inputLabel.zip')}
              value={data?.address.zip || '-'}
            />
            <DetailSegment
              label={t('userManagement.create_user.inputLabel.state')}
              value={data?.address.state || '-'}
            />
          </div>
          <div>
            <DetailSegment
              label={t('label.comment')}
              value={data?.comment || '-'}
              isTooltipRequired={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewUser;
