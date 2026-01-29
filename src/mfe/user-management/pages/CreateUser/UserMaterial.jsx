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
import { useFilters, useTable } from '@src/context/TableContext';

function UserMaterial(props) {
  const { searchPlaceholder, onAlert } = props;
  const [alert, setAlert] = React.useState(null);
  const { userId } = useParams();
  const { t: translateFn } = useTranslate();
  const [selection, setSelection] = React.useState([]);
  const dispatch = useDispatch();
  const isSystemAdmin = AuthUtils.isSystemAdmin();
  const { state } = useWidgetContext();
  const { refreshTable } = useTable();
  const { applyFilters, clearFilters } = useFilters();

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
          refreshTable();
          setSelection([]);
          const alert = {
            type: 'success',
            description: 'Material unlinked successfully.'
          };
          if (onAlert && typeof onAlert === 'function') {
            onAlert({ ...alert, pinPoint: 'materials' });
          } else {
            setAlert(alert);
          }
        })
        .catch((error) => {
          const alert = {
            type: 'error',
            description: 'Failed  to unlink material. Please try again.'
          };
          if (onAlert && typeof onAlert === 'function') {
            onAlert({ ...alert, pinPoint: 'materials' });
          } else {
            setAlert(alert);
          }
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
    <div className="stack">
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      <div className="MCP-panel-container">
        <div className="MCP-panel-container">
          <CommonFilters
            onApplyFilters={({ searchQuery: query }) => applyFilters({ query })}
            onClearFilters={clearFilters}
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
          {...{ selection, setSelection }}
        />
      </div>
    </div>
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
