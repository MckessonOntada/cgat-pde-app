import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as EditPencil } from '@src/assets/image/edit_pencil.svg';
import { Button, Heading } from '@mckesson/mcp-component-library';
import './index.scss';
import ModuleHeader from '@src/components/module-header';
import { useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import CommonUtils from '@src/util/CommonUtils.js';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import EmptyDataTable from '@src/components/EmptyTable';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import PermittedComponent from '@src/components/permitted-component';

const roleDetail = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { roleId } = useParams();

  const { isLoading, isError, data } = useQuery({
    queryKey: [`roles/${roleId}`],
    queryFn: async () => {
      const res = await HttpResourceService.callRest(`${ApiRoutes.GET_ROLES()}/${roleId}`, httpVerb.GET, {});
      return res.data;
    },
    enabled: !!roleId,
    refetchOnWindowFocus: false
  });

  const handleGoBack = () => {
    navigate('/admin/organization/roles');
  };

  const groupPermissionsByCategory = (rolePermissions, permissionsEnum) => {
    const groupedPermissions = {};

    rolePermissions.forEach((permission) => {
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

  const groupedPermissions = groupPermissionsByCategory(data?.permissions || [], PERMISSIONS_ENUM);

  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-module-wrapper">
        <div>
          <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleGoBack} size="md">
            {t('orgManagement.role.captionsBtnBackToManageRoles')}
          </Button>
        </div>

        <div className="MCP-module-body">
          <ModuleHeader
            heading={<Heading as="h1">{t('orgManagement.role.labelRolesDetails')}</Heading>}
            controls={
              <PermittedComponent permissions={[PERMISSIONS_ENUM.USER_MANAGEMENT.EDIT_ROLES]}>
                <Button
                  Icon={EditPencil}
                  variant="secondary"
                  className="button-icon"
                  size="md"
                  disabled={!data?.isActive}
                  onClick={() => navigate(`edit-role`, { state: data })}>
                  {t('userManagement.button.edit')}
                </Button>
              </PermittedComponent>
            }
          />

          <div className="MCP-panel-container">
            <div className="role-header">
              <div className="role-info">
                <Heading as="h2">{data?.name}</Heading>
              </div>
              <div className="user-status">
                <span className="view_label">{t('userManagement.label.createdOn')}:</span>
                <span className="label-text">
                  {CommonUtils.convertDateStringFormat(data?.createdAt ? data?.createdAt : data?.updatedAt, 'MM-DD-YYYY')}
                </span>
              </div>
            </div>

            <div className="grid grid-gap-24 grid-cols-1 md:grid-cols-2">
              <div>
                <span className="view_label">{t('userManagement.label.description')}</span>
                <p className="label-text">{data?.description || '-'}</p>
              </div>
            </div>
          </div>

          <ModuleHeader
            heading={<Heading as="h1">{t('userManagement.header.view.permissions_granted')}</Heading>}
            controls={
              <div className="controls">
                <PermittedComponent permissions={[PERMISSIONS_ENUM.USER_MANAGEMENT.EDIT_ROLES]}>
                  <Button
                    Icon={EditPencil}
                    variant="secondary"
                    className="button-icon"
                    size="md"
                    disabled={!data?.isActive}
                    onClick={() => navigate(`permissions`, { state: { data, isEdit: true } })}>
                    {t('userManagement.button.edit')}
                  </Button>
                </PermittedComponent>
              </div>
            }
          />

          <div className="MCP-panel-container grid grid-gap-16">
            {data?.permissions?.length > 0 ? (
              Object.entries(groupedPermissions).map(([categoryKey, permissions]) => (
                <div key={categoryKey} className="MCP-module-body permission-category">
                  <div className="subheader-text">{t(categoryKey)}</div>
                  <div className="permission-category">
                    <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 permission-list">
                      {permissions.map((permissionKey, idx) => {
                        if (!PERMISSIONS_ENUM[categoryKey][permissionKey]) return null; // Validate if permission exists

                        return (
                          <React.Fragment key={idx}>
                            <div className="flex items-center justify-between permission-item">
                              <div className="permission-info">
                                <h4>{t(`${categoryKey}.${permissionKey}`)}</h4>
                                <p>{t(`${categoryKey}.${permissionKey}.DESCRIPTION`)}</p>
                              </div>
                            </div>
                            {/* Add a divider dynamically */}
                            {idx % 2 === 0 && idx !== permissions.length - 1 && <div className="divider"></div>}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyDataTable
                isLoading={false}
                image={EmptyDataImage}
                heading={t('userManagement.label.emptyPermissionListTitle')}
                description={t('userManagement.label.emptyPermissionListSubtitle')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default roleDetail;
