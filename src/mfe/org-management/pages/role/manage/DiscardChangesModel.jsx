import React from "react";
import { Button, Modal } from "@mckesson/mcp-component-library";

const DiscardChangesModal = ({ isOpen, onClose, onConfirm }) => {
    return (
        <Modal
            id="discard-role-permissions-modal"
            isOpen={isOpen}
            onClose={onClose}
            modalTitle="Discard Changes?"
            modalBody={
                <div className="tertiaryHeading">
                    You have changed role permissions. Do you still want to go back? Your changes will be discarded!
                </div>
            }
            modalFooter={
                <div className="controls">
                    <Button size="md" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button size="md" variant="primary" onClick={onConfirm}>
                        Okay
                    </Button>
                </div>
            }
            modalSize="md"
        />
    );
};

export default DiscardChangesModal;
