import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import { Badge, Button, Heading, Label } from '@mckesson/mcp-component-library';
import './index.scss';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import ModuleHeader from '@src/components/module-header';
import CommonUtils, { formatFields } from '@src/util/CommonUtils.js';
import { RoutePaths } from '@src/routes/constants';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import DetailSegment from '@src/components/DetailSegment';
import { useWidgetContext } from '@src/context/WidgetContext';

const ReviewUser = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { state } = useWidgetContext();
  const { userDetails = {} } = state;

  const goBack = () => {
    navigate(RoutePaths.pathUserManagement);
  };

  const { address, contact, comment, name, status } = userDetails;
  const userFullName = CommonUtils.getFullName(name);
  const fullAddress = formatFields(address, ['address1', 'address2']);
  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={goBack} size="md">
          {t('userManagement.user.backmessage')}
        </Button>
      </div>

      <div className="MCP-module-body">
        <ModuleHeader
          heading={<Heading as="h1">{t('userManagement.header.review_user')}</Heading>}
          controls={
            <div className="row-space-between-center lblStatusDetails">
              <Label className="lblStatus">{t(`userManagement.table.status`)}</Label>
              <Badge text={status} type={status === 'REJECTED' ? 'error' : 'info'} />
            </div>
          }
        />

        <div className="MCP-panel-container">
          <ModuleHeader
            heading={
              <div className="subheader-text">
                <Heading as="h2" className={'entity-name'}>
                  <EclipsesTextcss str={userFullName} maxWidth={500} />
                </Heading>
              </div>
            }
          />

          <div className="grid grid-gap-24 grid-cols-1 md:grid-cols-4">
            <DetailSegment label={t('userManagement.userDetails.userAddress')} value={fullAddress} />
            <DetailSegment label={t('userManagement.create_user.inputLabel.email')} value={contact.email} />
            <DetailSegment
              label={t('userManagement.create_user.inputLabel.phone_no')}
              value={contact.phone ? CommonUtils.formatPhoneNumber(contact.phone) : '-'}
            />
            <DetailSegment label={t('userManagement.create_user.inputLabel.fax')} value={contact.fax || '-'} />
            <DetailSegment label={t('userManagement.create_user.inputLabel.city')} value={address.city || '-'} />
            <DetailSegment label={t('userManagement.create_user.inputLabel.zip')} value={address.zip || '-'} />
            <DetailSegment label={t('userManagement.create_user.inputLabel.state')} value={address.state || '-'} />
          </div>
          <div>
            <DetailSegment label={t('label.comment')} value={comment || '-'} isTooltipRequired={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewUser;
