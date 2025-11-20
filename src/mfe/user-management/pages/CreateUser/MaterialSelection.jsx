import React from 'react';
import UserCreationStepper from '../UserCreationStepper';
import { useTranslate } from '@src/translations/useTranslation';
import { Button, Heading, Loader, Alert } from '@mckesson/mcp-component-library';
import ModuleHeader from '@src/components/module-header';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import CommonFilters from '@src/components/Filters';
import TableHeading from '@src/components/tableHeading/TableHeading';
import { List, ListItem } from '@src/components/list';
import { ReactComponent as DeleteIcon } from '@src/assets/svg/delete-icon.svg';
import MaterialService from '@src/api/commonService/MaterialService';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Materials from './Materials';
import IconButton from '@src/components/IconButton';

export default function MaterialSelection(props) {
  const location = useLocation();
  const isEdit = location.state?.isCreate !== true;
  const { userId } = useParams();
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const [data, setData] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selection, setSelection] = React.useState([]);
  const [alert, setAlert] = React.useState(null);
  const { t: translateFn } = useTranslate();

  React.useEffect(() => {
    MaterialService.getAllMaterials(userId)
      .then((response) => {
        const selectedRecords = response.flatMap((trade) => {
          if (trade.isExpandable) {
            return trade.therapies;
          }
          return [trade];
        });

        setData(response);

        if (!isEdit) {
          setSelection(selectedRecords);
          return null;
        }

        return MaterialService.getAllMaterials(userId, { listingMode: 'EXCLUDED' }).then((excluded) => {
          const flatMapExcluded = excluded.flatMap((trade) => {
            if (trade.isExpandable) {
              return trade.therapies;
            }
            return [trade];
          });
          const filtered = selectedRecords.filter((record) => {
            return !flatMapExcluded.some((ex) => ex.id === record.id);
          });
          setSelection(filtered);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  React.useEffect(() => {
    setLoading(false);
  }, []);

  const handleOnAddMaterials = () => {
    const flatIds = data.flatMap((trade) => {
      if (trade.isExpandable) {
        return trade.therapies.map((therapy) => therapy.id);
      }
      return [trade.id];
    });
    const selectedMaterialIds = selection.map((item) => item.id);
    const restrictedMaterialIds = flatIds.filter((id) => !selectedMaterialIds.includes(id));

    MaterialService.restrictMaterial(userId, restrictedMaterialIds)
      .then((response) => {
        if (isEdit) {
          navigate(`./..`, {
            state: {
              alert: {
                pinPoint: 'linked_materials',
                type: 'success',
                description: 'User material selection updated'
              }
            }
          });
        } else {
          navigate('/admin/user', {
            state: {
              alert: {
                type: 'success',
                description: 'New user is created.'
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
      });
  };

  const removeFromBucket = (id) => {
    const filteredSelection = selection.filter((item) => item.id !== id);
    setSelection(filteredSelection);
  };

  const handleOnBack = () => {
    navigate(isEdit ? `./..` : `../${PATHS.PERMISSIONS}`, {
      state: { isBack: true }
    });
  };

  const filteredData = React.useMemo(() => {
    if (!data) return [];
    return data.filter((item) => {
      const stringifiedItem = JSON.stringify(item);
      return stringifiedItem.indexOf(searchQuery) > -1 ? true : false;
    });
  }, [data, searchQuery]);

  if (loading) {
    return <Loader type={'screen'} />;
  }

  return (
    <div className="MCP-module-wrapper">
      {isEdit && (
        <div>
          <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={() => navigate('./..')} size="md">
            {translateFn('userManagement.back_to_user_details')}
          </Button>
        </div>
      )}
      <div className="MCP-module-body">
        <ModuleHeader
          heading={<Heading as="h1">{isEdit ? translateFn('userManagement.button.edit_materials') : translateFn('userManagement.create_user')}</Heading>}
        />

        {!isEdit && (
          <div className="stepper">
            <UserCreationStepper activeIndex={4} />
          </div>
        )}

        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
        <div className="MCP-panel-container">
          <div className="MCP-panel-container">
            <CommonFilters
              onApplyFilters={(filters) => setSearchQuery(filters.searchQuery)}
              onClearFilters={() => setSearchQuery('')}
              additionalFilters={[]}
              searchPlaceholder={translateFn('placeholder.materialTable')}
            />
          </div>
          <TableHeading heading={translateFn('table.title.selectMaterial')} />
          <div className="table-selection-container">
            <Materials
              omitColumns={['action', 'formulation', 'dosage']}
              {...{ data: filteredData, loading, isFilterApplied: Boolean(searchQuery), selection, setSelection }}
            />
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
        <div className={'controls'}>
          <Button variant="secondary" type="button" onClick={handleOnBack} size={'md'}>
            {translateFn('userManagement.button.back')}
          </Button>
          {!isEdit && (
            <Button variant="primary" type="button" onClick={handleOnAddMaterials} size={'md'}>
              {translateFn('userManagement.button.adduser')}
            </Button>
          )}
          {isEdit && (
            <Button variant="primary" type="button" onClick={handleOnAddMaterials} size={'md'}>
              {translateFn('userManagement.button.addMaterials')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
