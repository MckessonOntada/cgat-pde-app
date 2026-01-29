import React from 'react';
import { useTranslate } from '@src/translations/useTranslation';
import { Button, Loader, Alert } from '@mckesson/mcp-component-library';
import CommonFilters from '@src/components/Filters';
import TableHeading from '@src/components/tableHeading/TableHeading';
import { List, ListItem } from '@src/components/list';
import { ReactComponent as DeleteIcon } from '@src/assets/svg/delete-icon.svg';
import MaterialService from '@src/api/commonService/MaterialService';
import { useNavigate } from 'react-router-dom';
import Materials from './Materials';
import IconButton from '@src/components/IconButton';
import { PATHS } from '../../routes';
import useRouteMode from '../../routes/useRouteMode';
import AuthUtils from '@src/util/AuthUtils';
import { useWidgetContext } from '@src/context/WidgetContext';
import { ReactComponent as ButtonLoadingIcon } from '@src/assets/svg/button-loading.svg';
import { useFilters, useTable } from '@src/context/TableContext';

const submitTranslationConfig = {
  systemAdmin: 'Add System Admin',
  user: 'Add User'
};

const getSubmitCaption = ({ isSystemAdminView, isEdit, isSaving }) => {
  if (isSaving && isEdit) return 'Updating';
  if (isSaving && !isEdit) return 'Saving';
  if (!isSaving && isEdit) return 'Update';

  return submitTranslationConfig[isSystemAdminView ? 'systemAdmin' : 'user'];
};

export default function MaterialSelection() {
  const { isEdit, id } = useRouteMode({ editSegment: 'edit', paramKey: 'userId' });
  const [isSaving, setIsSaving] = React.useState(false);
  const navigate = useNavigate();
  const [selection, setSelection] = React.useState([]);
  const [alert, setAlert] = React.useState(null);
  const { t: translateFn } = useTranslate();
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const { state, reset } = useWidgetContext();
  const { data } = useTable();
  const { applyFilters, clearFilters } = useFilters();
  React.useEffect(() => {
    if (data && data.length > 0 && !isSystemAdminView) {
      const selectedRecords = data.flatMap((trade) => {
        if (trade.isExpandable) {
          return trade.therapies;
        }
        return [trade];
      });

      setSelection(selectedRecords);
    }
  }, [data]);
  const handleOnSubmit = () => {
    const userDetails = state.userDetails;
    const selectedRole = userDetails.role?.name;
    let addMaterialPromise = null;
    if (selectedRole === 'Customer Centre') {
      const selectedMaterialIds = selection.map((item) => item.id);
      addMaterialPromise = MaterialService.addMaterial(id, selectedMaterialIds);
    } else {
      const flatIds = data.flatMap((trade) => {
        if (trade.isExpandable) {
          return trade.therapies.map((therapy) => therapy.id);
        }
        return [trade.id];
      });
      const selectedMaterialIds = selection.map((item) => item.id);
      const restrictedMaterialIds = flatIds.filter((id) => !selectedMaterialIds.includes(id));
      addMaterialPromise = MaterialService.restrictMaterial(id, restrictedMaterialIds);
    }

    if (addMaterialPromise) {
      setIsSaving(true);
      addMaterialPromise
        .then((response) => {
          reset();
          if (isEdit) {
            navigate(`./../..`, {
              state: {
                alert: {
                  pinPoint: 'materials',
                  type: 'success',
                  description: 'User material selection updated'
                }
              }
            });
          } else {
            navigate('./../../..', {
              search: `?tab=USERS`,
              state: {
                alert: {
                  type: 'success',
                  description: 'User has been created successfully.'
                }
              }
            });
          }
        })
        .catch((error) => {
          setAlert({
            type: 'error',
            description: 'Something went wrong'
          });
        })
        .finally(() => {
          setIsSaving(false);
        });
    }
  };

  const removeFromBucket = (id) => {
    const filteredSelection = selection.filter((item) => item.id !== id);
    setSelection(filteredSelection);
  };

  const handleOnBack = () => {
    const userDetails = state.userDetails;
    const selectedRole = userDetails.role?.name;
    if (selectedRole === 'Customer Centre') {
      navigate(isEdit ? `./../..` : `../${id}/${PATHS.PERMISSIONS}`);
    } else {
      navigate(isEdit ? `./..` : `../${id}/${PATHS.ACCOUNTS}`);
    }
  };

  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-module-body">
        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
        <div className="MCP-panel-container">
          <div className="MCP-panel-container">
            <CommonFilters
              onApplyFilters={({ searchQuery: query }) => applyFilters({ query })}
              onClearFilters={clearFilters}
              additionalFilters={[]}
              searchPlaceholder={translateFn('placeholder.materialTable1')}
            />
          </div>
          <TableHeading heading={translateFn('table.title.selectMaterial')} />
          <div className="table-selection-wrapper">
            <div className="table">
              <Materials omitColumns={['action', 'formulation', 'dosage']} {...{ selection, setSelection }} />
            </div>
            <div className="list">
              <List title={translateFn('list.title.selectedMaterials')}>
                {selection.map((item = {}, index) => {
                  const { cellValue, genericName, ndc } = item;

                  return (
                    <ListItem key={index}>
                      <div className="list-card-with-action">
                        <div className="card-content">
                          <label>{`${cellValue}(${genericName})(${ndc})`}</label>
                        </div>
                        <div className="card-action">
                          <IconButton icon={DeleteIcon} color={'error'} onClick={() => removeFromBucket(item.id)} />
                        </div>
                      </div>
                    </ListItem>
                  );
                })}
              </List>
            </div>
          </div>
        </div>
        <div className={'controls'}>
          <Button variant="secondary" type="button" onClick={handleOnBack} size={'md'}>
            {translateFn('userManagement.button.back')}
          </Button>
          <Button
            variant="primary"
            disabled={selection.length <= 0}
            onClick={handleOnSubmit}
            isLoadingState={isSaving}
            Icon={isSaving && ButtonLoadingIcon}
            iconPosition="left"
            type="button"
            size="md">
            {getSubmitCaption({ isSystemAdminView, isEdit, isSaving })}
          </Button>
        </div>
      </div>
    </div>
  );
}
