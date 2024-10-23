import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import styles from "./assets/styles/Modal.module.scss";
import { ReactComponent as AiOutlineLeft } from "./assets/svg/left-arrow.svg";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DialogActions from "@mui/material/DialogActions";
import muiTheme from "../../assets/theme/MuiTheme";
import { ReactComponent as CloseIcon } from "./assets/svg/close-icon.svg";
import { ModalType } from "./assets/constants/Modalconsts";

const WindowedModal = (props) => {
  WindowedModal.propTypes = {
    id: PropTypes.string,
    isOpen: PropTypes.bool,
    isFooterCenterAlign: PropTypes.bool,
    onClose: PropTypes.func,
    isMobileView: PropTypes.bool,
    modalBody: PropTypes.element,
    defaultHeight: PropTypes.bool,
    modalTitle: PropTypes.string,
    modalFooter: PropTypes.any,
    type: PropTypes.string,
    modalSize: PropTypes.oneOf([
      "xxxxs",
      "xxxs",
      "xxs",
      "xs",
      "sm",
      "md",
      "lg",
      "xl",
      "xxl",
      "xxxl",
    ]),
  };
  const { id, isOpen, onClose, type, isFooterCenterAlign } = props;
  let modalTheme = createTheme({
    breakpoints: {
      values: {
        xxxxs: 272,
        xxxs: 452,
        xxs: 608,
        xs: 764,
        sm: 920,
        md: 1076,
        lg: 1232,
        xl: 1388,
        xxl: 1544,
        xxxl: 1700,
        "4xl": 1800,
      },
    },
    components: {
      MuiDialog: {
        styleOverrides: {
          paper: {
            overflowY: "hidden",
            borderRadius: "6px",
            border: "1px solid var(--brand-color-grey-scale-cool-1)",
            [muiTheme.breakpoints.up("2md")]: {
              margin: "24px",
            },
            [muiTheme.breakpoints.down("2md")]: {
              margin: "5px",
              width: "calc(100% - 5px)",
            },
          },
        },
      },
    },
  });

  const crossButton = () => {
    return (
      <button
        data-testid={"modal-close-" + id}
        aria-label="close"
        onClick={onClose}
        className={`${styles.closeBtn} ${
          type === ModalType.INFORMATIVE && styles.closeBtnInformative
        }`}
      >
        <CloseIcon
          className={`${styles.closeIcon} ${styles.modalCloseIconDimension} ${
            type === ModalType.INFORMATIVE && styles.closeIconInformative
          }`}
        />
      </button>
    );
  };

  return (
    <ThemeProvider theme={modalTheme}>
      <Dialog
        open={isOpen}
        onClose={onClose}
        maxWidth={props.modalSize}
        fullWidth={true}
        aria-labelledby="mui-dialog-title"
        aria-describedby="mui-dialog-description"
        className={styles.mcpdialogWrapper}
        componentsProps={{
          backdrop: { style: { backgroundColor: "rgba(164, 164, 164, 0.60)" } },
        }}
        data-testid={"desktop-modal-" + id}
      >
        <DialogTitle id="mui-dialog-title">
          <div
            className={`${styles.dialogTitleHeader} ${
              type === ModalType.INFORMATIVE &&
              styles.dialogTitleHeaderInformative
            }`}
          >
            <header
              className={`${styles.modalHeaderTitle} ${
                type === ModalType.INFORMATIVE &&
                styles.modalHeaderTitleInformative
              }`}
            >
              {props.modalTitle}
            </header>
            {crossButton()}
          </div>
        </DialogTitle>
        <DialogContent
          className={`${
            type === ModalType.INFORMATIVE
              ? styles.dialogContentWrapperInformative
              : styles.dialogContentWrapper
          }`}
        >
          {props.modalBody ? props.modalBody : null}
        </DialogContent>
        <DialogActions className={styles.dialogAction}>
          {props.modalFooter && (
            <div
              className={`${styles.footerWrapper} ${
                isFooterCenterAlign ? styles.centerAlign : ""
              }`}
            >
              {props.modalFooter}
            </div>
          )}
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

const FullScreenModal = (props) => {
  FullScreenModal.propTypes = {
    id: PropTypes.string,
    isOpen: PropTypes.bool,
    isFooterCenterAlign: PropTypes.bool,
    onClose: PropTypes.func,
    isMobileView: PropTypes.bool,
    modalBody: PropTypes.element,
    defaultHeight: PropTypes.bool,
    modalTitle: PropTypes.string,
    modalFooter: PropTypes.any,
    modalSize: PropTypes.oneOf([
      "xxxxs",
      "xxxs",
      "xxs",
      "xs",
      "sm",
      "md",
      "lg",
      "xl",
      "xxl",
      "xxxl",
      "4xl",
    ]),
  };
  const { id, isOpen, onClose, isFooterCenterAlign } = props;

  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={onClose}
      className={styles.dialogWrapper}
      aria-labelledby="mui-dialog-title"
      aria-describedby="mui-dialog-description"
      data-testid={"mobile-modal-" + id}
    >
      <DialogTitle id="mui-dialog-title">
        <span className={styles.dialogTitleHeader}>
          <button aria-label="close" onClick={onClose}>
            <div>
              <AiOutlineLeft className={styles.ModalBackArrow} />
            </div>
          </button>
          <span>
            <header className={styles.modalHeaderTitle}>
              {props.modalTitle}
            </header>
          </span>
          <span />
        </span>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="mui-dialog-description">
          {props.modalBody ? props.modalBody : null}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <div
          className={`${styles.footerWrapper} ${
            isFooterCenterAlign ? styles.centerAlign : ""
          }`}
        >
          {props.modalFooter}
        </div>
      </DialogActions>
    </Dialog>
  );
};

export const Modal = (props) => {
  if (props.isMobileView) {
    return (
      <ThemeProvider theme={muiTheme}>
        {" "}
        <FullScreenModal {...props} />{" "}
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <WindowedModal {...props} />
    </ThemeProvider>
  );
};

Modal.propTypes = {
  id: PropTypes.string,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  isFooterCenterAlign: PropTypes.bool,
  isMobileView: PropTypes.bool,
  modalBody: PropTypes.element,
  defaultHeight: PropTypes.bool,
  modalTitle: PropTypes.string,
  modalFooter: PropTypes.any,
  modalSize: PropTypes.oneOf([
    "xxxxs",
    "xxxs",
    "xxs",
    "xs",
    "sm",
    "md",
    "lg",
    "xl",
    "xxl",
    "xxxl",
    "4xl",
  ]),
};

Modal.defaultProps = {
  id: "modal",
  isOpen: false,
  isMobileView: false,
  modalSize: "sm",
  modalTitle: "",
  defaultHeight: true,
};
