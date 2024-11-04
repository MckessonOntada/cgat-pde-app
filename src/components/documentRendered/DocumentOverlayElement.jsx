import React, { useState } from 'react';
import { ReactComponent as LockedDocumentSVG } from '../../assets/svg/locked-document.svg';
import { Button } from '@mckesson/mcp-component-library';
import PopoverModel from './PopoverModel';

function DocumentOverlayElement({
  isFlagged,
  setIsFlagged,
  reason,
  heightPx,
  maxWidthPx,
  onReasonChange,
  disableFlag,
  viewDocumentState,
  handleViewDocument
}) {
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const isPopoverOpen = Boolean(popoverAnchorEl);

  const handleRemoveFlag = () => {
    setIsFlagged(false);
    handleViewDocument(false);
    handlePopoverClose();
  };

  const handleRemoveButtonClick = (event) => {
    setPopoverAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };

  if (!isFlagged) {
    return null;
  }

  return (
    <>
      {viewDocumentState ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '9px 12px',
            alignItems: 'center',
            minHeight: '40px',
            backgroundColor: '#fff'
          }}>
          <Button
            size="md"
            variant="secondary"
            onClick={() => {
              handleViewDocument(false);
            }}>
            Hide Document
          </Button>
          <Button
            size="md"
            disabled={disableFlag}
            variant="secondary"
            onClick={handleRemoveButtonClick}>
            Remove Flag
          </Button>
        </div>
      ) : (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: heightPx,
            maxWidth: maxWidthPx,
            backgroundColor: '#FFFFFFD9',
            zIndex: 100,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <div
            style={{
              gap: '16px',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              display: 'flex',
              textAlign: 'center',
              width: '100%'
            }}>
            <LockedDocumentSVG />
            <div style={{ fontSize: '16px', maxWidth: '60%', fontWeight: '400' }}>
              Document has been flagged for review and is locked from use in abstraction.
            </div>
            <p style={{ fontSize: '16px', maxWidth: '60%', fontWeight: '400' }}>Reason: {reason}</p>
            <Button
              size="md"
              variant="secondary"
              onClick={() => {
                handleViewDocument(true);
              }}>
              View Document
            </Button>
            <Button
              size="md"
              disabled={disableFlag}
              variant="secondary"
              onClick={handleRemoveButtonClick}>
              Remove Flag
            </Button>
          </div>
        </div>
      )}
      <PopoverModel
        onSubmit={handleRemoveFlag}
        open={isPopoverOpen}
        submitButtonLabel="Remove Flag"
        textAreaLabel="Reason for flag removal"
        anchorEl={popoverAnchorEl}
        handleClose={handlePopoverClose}
        onReasonChange={onReasonChange}
      />
    </>
  );
}

export default DocumentOverlayElement;
