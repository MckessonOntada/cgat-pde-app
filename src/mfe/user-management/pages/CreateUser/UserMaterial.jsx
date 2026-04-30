import { Button, Alert, Modal } from '@mckesson/mcp-component-library';
import React from 'react';
import MaterialService from '@src/api/commonService/MaterialService';
import { useParams } from 'react-router-dom';
import Materials from './Materials';
import { useTranslate } from '@src/translations/useTranslation';
import CommonFilters from '@src/components/Filters';
import { useWidgetContext } from '@src/context/WidgetContext';
import AuthUtils from '@src/util/AuthUtils';
import { useFilters, usePagination, useTable } from '@src/context/TableContext';
import { ReactComponent as ButtonLoadingIcon } from '@src/assets/svg/button-loading.svg';

function UserMaterial(props) {
  const { searchPlaceholder, onAlert } = props;
  const [alert, setAlert] = React.useState(null);
  const { userId } = useParams();
  const { t: translateFn } = useTranslate();
  const [selection, setSelection] = React.useState([]);
  const [unlinkConfirmationOpen, setUnlinkConfirmationOpen] = React.useState(false);
  const [unlinkSelection, setUnlinkSelection] = React.useState([]);
  const isSystemAdmin = AuthUtils.isSystemAdmin();
  const { state } = useWidgetContext();
  const { refreshTable } = useTable();
  const { data, loading } = useTable();
  const { pagination } = usePagination();
  const { changePage } = usePagination();
  const { applyFilters, clearFilters } = useFilters();

  const unlinkMaterial = () => {
    const userDetails = state.userDetails;
    const selectedRole = userDetails.role.name;
    const materialToUnlink = unlinkSelection.map((item) => ({
      ndc: item.ndc,
      tradeName: item.tradeName
    }));
    let unlinkPromise = null;
    if (isSystemAdmin && selectedRole === 'Customer Centre') {
      unlinkPromise = MaterialService.unlinkCustomerCentreMaterials(userId, materialToUnlink);
    } else {
      unlinkPromise = MaterialService.unlinkMaterial(userId, materialToUnlink);
    }
    if (unlinkPromise)
      unlinkPromise
        .then((_response) => {
          const totalAfterDelete = pagination.totalElements - unlinkSelection.length;
          const lastPageAfterDelete = Math.ceil(totalAfterDelete / pagination.pageSize);

          if (pagination.pageNo > lastPageAfterDelete) {
            changePage(lastPageAfterDelete || 1);
          } else {
            refreshTable();
          }
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
          setUnlinkSelection([]);
          setUnlinkConfirmationOpen(false);
        });
  };

  const handleOnUnlink = (selection) => {
    setUnlinkSelection(selection);
    setUnlinkConfirmationOpen(true);
  };
  const handleOnNo = () => {
    setSelection([]);
    setUnlinkConfirmationOpen(false);
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
              <Button variant="secondary" onClick={() => handleOnUnlink(selection)}>
                Unlink
              </Button>
            }
          />
        ) : null}
        <Materials
          columnActions={{
            onUnlink: handleOnUnlink
          }}
          {...{ selection, setSelection, data, loading }}
        />
      </div>
      {unlinkConfirmationOpen && <UnlinkConfirmation onYes={unlinkMaterial} onNo={handleOnNo} />}
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

const UnlinkConfirmation = ({ onYes, onNo }) => {
  const { t: translateFn } = useTranslate();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleOnYes = (...args) => {
    setIsLoading(true);
    onYes && onYes(args);
  };

  return (
    <Modal
      {...{
        id: 'material-unlink-consent-modal',
        isOpen: true,
        onClose: onNo,
        modalTitle: translateFn('messages.confirmation.unlinkMaterial'),
        modalBody: (
          <div className="MCP-modal-body">
            <p>{translateFn('messages.confirmation.unlinkMaterialDescription')}</p>
          </div>
        ),
        modalFooter: (
          <div className="controls">
            <Button size="md" variant="secondary" onClick={onNo}>
              {translateFn('orgManagement.button.cancel')}
            </Button>
            <Button variant="primary" isLoadingState={isLoading} Icon={isLoading && ButtonLoadingIcon} iconPosition="left" onClick={handleOnYes} size="md">
              {isLoading ? 'Unlinking' : translateFn('orgManagement.button.OK')}
            </Button>
          </div>
        ),
        modalSize: 'md'
      }}
    />
  );
};

export default UserMaterial;
