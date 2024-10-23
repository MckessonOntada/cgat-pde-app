import React from "react";
import PropTypes from "prop-types";
import styles from "./assets/OktaFooter.module.scss";

export const OktaFooter = (props) => {
  const {
    tncUrl,
    tncLabel,
    pnUrl,
    pnLabel,
    dnsmiUrl,
    dnsmiLabel,
    supportNumber,
    supportNumberLabel,
    copyrightLabel,
    formsPage,
  } = props;
  return (
    <div
      className={`${styles.container} ${formsPage ? styles.formGap : ""} `}
      data-testid="okta-footer-container"
    >
      <div className={styles.menuContainer}>
        <a className={styles.label} href={tncUrl} target="_blank">
          {tncLabel}
        </a>
        <a className={styles.label} href={pnUrl} target="_blank">
          {pnLabel}
        </a>
        <a className={styles.label} href={dnsmiUrl} target="_blank">
          {dnsmiLabel}
        </a>
        <a
          className={`${styles.label} ${styles.labelUndecorated}`}
          href={`tel:${supportNumber}`}
          target="_blank"
        >
          {supportNumberLabel} {supportNumber}
        </a>
      </div>
      <div className={styles.copyrightContainer}>{copyrightLabel}</div>
    </div>
  );
};
OktaFooter.propTypes = {
  supportNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  supportNumberLabel: PropTypes.string,
  tncUrl: PropTypes.string,
  tncLabel: PropTypes.string,
  pnUrl: PropTypes.string,
  pnLabel: PropTypes.string,
  dnsmiUrl: PropTypes.string,
  dnsmiLabel: PropTypes.string,
  copyrightLabel: PropTypes.string,
  formsPage: PropTypes.bool,
};
OktaFooter.defaultProps = {
  formsPage: false,
};
