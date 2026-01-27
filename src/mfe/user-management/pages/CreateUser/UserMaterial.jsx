import { Button, Alert } from '@mckesson/mcp-component-library';
import React from 'react';
import MaterialService from '@src/api/commonService/MaterialService';
import { useParams } from 'react-router-dom';
import Materials from './Materials';
import { useTranslate } from '@src/translations/useTranslation';
import CommonFilters from '@src/components/Filters';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { closeModal, openModal } from '@src/store/reducer/modalReducer';
import { useWidgetContext } from '@src/context/WidgetContext';
import AuthUtils from '@src/util/AuthUtils';

function UserMaterial(props) {
  const { searchPlaceholder } = props;
  const [alert, setAlert] = React.useState(null);
  const { userId } = useParams();
  const { t: translateFn } = useTranslate();
  const [selection, setSelection] = React.useState([]);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = React.useState('');
  const isSystemAdmin = AuthUtils.isSystemAdmin();
  const { state } = useWidgetContext();

  const {
    data,
    isLoading: loading,
    refetch: refreshData
  } = useQuery({
    queryKey: ['unlink-material', userId],
    queryFn: () => {
      const userDetails = state.userDetails || {};
      const roleName = userDetails.role?.name;
      if (roleName === 'Customer Centre') {
        return MaterialService.getAllMaterialsForCustomerCentre(userId, { listingMode: 'INCLUDED' });
      } else {
        return MaterialService.getAllMaterials(userId, { listingMode: 'INCLUDED' });
      }
    }
  });

  const filteredData = React.useMemo(() => {
    if (!data) return [];
    return data.filter((item) => {
      const stringifiedItem = JSON.stringify(item);
      return stringifiedItem.indexOf(searchQuery) > -1 ? true : false;
    });
  }, [data, searchQuery]);

  const unlinkMaterial = (selection) => {
    const userDetails = state.userDetails;
    const selectedRole = userDetails.role.name;
    let unlinkPromise = null;
    if (isSystemAdmin && selectedRole === 'Customer Centre') {
      unlinkPromise = MaterialService.unlinkCustomerCentreMaterials(userId, selection);
    } else {
      unlinkPromise = MaterialService.unlinkMaterial(userId, selection);
    }
    if (unlinkPromise)
      unlinkPromise
        .then((response) => {
          refreshData();
          setSelection([]);
          setAlert({
            type: 'success',
            description: 'Material unlinked successfully.'
          });
        })
        .catch((error) => {
          setAlert({
            type: 'error',
            description: 'Failed  to unlink material. Please try again.'
          });
        })
        .finally(() => {
          dispatch(closeModal());
        });
  };

  const confirmMaterialUnlink = (selection) => {
    const modalState = {
      title: translateFn('messages.confirmation.unlinkMaterial'),
      body: (
        <div className="MCP-modal-body">
          <p>{translateFn('messages.confirmation.unlinkMaterialDescription')}</p>
        </div>
      ),
      footer: (
        <div className="controls">
          <Button size="md" variant="secondary" onClick={() => dispatch(closeModal())}>
            {translateFn('orgManagement.button.cancel')}
          </Button>
          <Button size="md" variant="primary" onClick={() => unlinkMaterial(selection)}>
            {translateFn('orgManagement.button.OK')}
          </Button>
        </div>
      )
    };
    dispatch(openModal(modalState));
  };

  return (
    <React.Fragment>
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      <div className="MCP-panel-container">
        <div className="MCP-panel-container">
          <CommonFilters
            onApplyFilters={(filters) => setSearchQuery(filters.searchQuery)}
            onClearFilters={() => setSearchQuery('')}
            additionalFilters={[]}
            searchPlaceholder={searchPlaceholder}
          />
        </div>
        {selection.length > 0 ? (
          <SelectionRibbon
            header={translateFn('table.ribbon.nItemsSelected', { n: selection.length })}
            controls={
              <Button variant="secondary" onClick={() => confirmMaterialUnlink(selection.map((item) => item.id))}>
                Unlink
              </Button>
            }
          />
        ) : null}
        <Materials
          columnActions={{
            onUnlink: confirmMaterialUnlink
          }}
          {...{ data: filteredData, loading, isFilterApplied: Boolean(searchQuery), selection, setSelection }}
        />
      </div>
    </React.Fragment>
  );
}

function SelectionRibbon({ header, controls }) {
  return (
    <div className="table-selection-ribbon">
      <div>{header}</div>
      <div>{controls}</div>
    </div>
  );
}

export default UserMaterial;
