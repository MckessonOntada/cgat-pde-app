import React, { useEffect, useState } from 'react';
import DocumentRenderer from './DocumentRenderer';
import { Box } from '@mui/material';
import { ReactComponent as FlagIcon } from '../../assets/svg/flag.svg';
import PopoverModel from './PopoverModel';
import DocumentOverlayElement from './DocumentOverlayElement';
import { Button } from '@mckesson/mcp-component-library';
import CommonUtils from '../../common/util/CommonUtils';

function DocumentRendererContainer({
  externalId,
  patientDetails,
  entityType,
  // content,
  heightPx = '800px',
  widthPx = '100%',
  maxWidthPx,
  zoomFactor,
  rotateFactor,
  setIsDefaultElement,
  disableFlag,
  documentStatus = '',
  flagReason = '',
  toggleFlag,
  onReasonChange
}) {
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [isDocumentFlagged, setIsDocumentFlagged] = useState(false);
  const [viewDocumentState, setViewDocumentState] = useState(false);

  useEffect(() => {
    if (documentStatus) {
      setIsDocumentFlagged(documentStatus === 'Flagged');
    }
  }, [documentStatus]);

  useEffect(() => {
    setViewDocumentState(false);
  }, [externalId]);

  const handleFlagDocument = () => {
    const res = toggleFlag('Flagged');
    onReasonChange('NA');
    if (res === 'success') {
      setIsDocumentFlagged(true);
    }
    handlePopoverClose();
  };

  //Popover anchor handling
  const handlePopoverButtonClick = (event) => {
    setPopoverAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };
  const isPopoverOpen = Boolean(popoverAnchorEl);
  //

  const handleViewDocument = (val) => {
    setViewDocumentState(val);
  };

  const handleOverlaySubmit = (val) => {
    const res = toggleFlag('Unreviewed');
    onReasonChange('NA');
    if (res === 'success') {
      setIsDocumentFlagged(val);
    }
  };

  return (
    <>
      {!isDocumentFlagged && !disableFlag && (
        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: CommonUtils.isFirefox ? '32px' : '12px',
              right: '12px',
              zIndex: 999
            }}>
            <Button
              variant="primary"
              iconButton={true}
              size="md"
              Icon={FlagIcon}
              onClick={handlePopoverButtonClick}
            />
          </div>
          <PopoverModel
            onSubmit={handleFlagDocument}
            open={isPopoverOpen}
            description="Flagging a document marks it for further review and conceals it from use in abstraction."
            submitButtonLabel="Flag Document"
            anchorEl={popoverAnchorEl}
            handleClose={handlePopoverClose}
            textAreaLabel="Reason for flag"
            onReasonChange={onReasonChange}
          />
        </div>
      )}
      <Box
        id="documentContainer"
        sx={{
          position: 'relative',
          overflow: 'auto',
          width: '100%',
          height: heightPx,
          maxWidth: maxWidthPx - 32
        }}>
        <DocumentOverlayElement
          isFlagged={isDocumentFlagged}
          setIsFlagged={(val) => handleOverlaySubmit(val)}
          reason={flagReason}
          heightPx={heightPx}
          maxWidthPx={maxWidthPx}
          onReasonChange={onReasonChange}
          disableFlag={disableFlag}
          viewDocumentState={viewDocumentState}
          handleViewDocument={handleViewDocument}
        />
        <DocumentRenderer
          externalId={externalId}
          entityType={entityType}
          patientDetails={patientDetails}
          heightPx={viewDocumentState ? `${parseInt(heightPx) - 50}px` : heightPx}
          widthPx={widthPx}
          maxWidthPx={maxWidthPx}
          zoomFactor={zoomFactor}
          rotateFactor={rotateFactor}
          setIsDefaultElement={setIsDefaultElement}
        />
      </Box>
    </>
  );
}

export default DocumentRendererContainer;
