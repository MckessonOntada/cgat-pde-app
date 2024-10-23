import React from "react";
import PropTypes from "prop-types";
import { CommonUtils } from "../../common/utils/CommonUtils";
import styles from "./assests/styles/Address.module.scss";

export const Address = ({
  addressHeader,
  addressLine1,
  addressLine2,
  addressLine3,
  state,
  zip,
  city,
  phone,
  phoneNumber,
  customUi,
  link,
  addressWithDirections,
}) => {
  const AddressLine = ({ addressLine1, addressLine2, addressLine3 }) => {
    if (
      !CommonUtils.isNonEmptyString(addressLine1) &&
      !CommonUtils.isNonEmptyString(addressLine2)
    ) {
      return null;
    }
    return (
      <p data-testid={"addressLines"}>
        {CommonUtils.isNonEmptyString(addressLine1) && addressLine1}
        {CommonUtils.isNonEmptyString(addressLine2) && <br />}
        {CommonUtils.isNonEmptyString(addressLine2) && addressLine2}
        {CommonUtils.isNonEmptyString(addressLine3) && addressLine3}
      </p>
    );
  };

  const AddressInfo = ({ state, zip, city }) => {
    if (
      !CommonUtils.isNonEmptyString(state) &&
      !CommonUtils.isNonEmptyString(city) &&
      !CommonUtils.isNonEmptyString(zip)
    ) {
      return null;
    }
    return (
      <p data-testid={"city"}>
        {CommonUtils.isNonEmptyString(city) && city + ", "}
        {CommonUtils.isNonEmptyString(state) && state + " "}
        {CommonUtils.isNonEmptyString(zip) && zip}
      </p>
    );
  };

  if (customUi) {
    return customUi.children;
  }

  const address = (
    <>
      {CommonUtils.isNonEmptyString(addressHeader) ? (
        <p className={styles.address_header} data-testid={"address-header"}>
          {addressHeader}
        </p>
      ) : null}
      <AddressLine
        addressLine1={addressLine1}
        addressLine2={addressLine2}
        addressLine3={addressLine3}
      />
      <AddressInfo state={state} city={city} zip={zip} />

      {CommonUtils.isNonEmptyString(phoneNumber) ? (
        <div
          className={styles.address_phoneNumber_wrapper}
          data-testid="phoneNo"
        >
          {phone}
          <a
            href={"tel:" + phoneNumber}
            className={styles.address_phoneNumber}
            data-testid="phoneLink"
          >
            {CommonUtils.formattedPhoneNumber(phoneNumber)}
          </a>
        </div>
      ) : null}
    </>
  );
  const addressDirections = (
    <>
      {CommonUtils.isNonEmptyString(addressHeader) ? (
        <p
          className={styles.address_header_directions}
          data-testid={"address-header"}
        >
          {addressHeader}
        </p>
      ) : null}
      <div className={styles.addressline}>
        <AddressLine
          addressLine1={addressLine1}
          addressLine2={addressLine2}
          addressLine3={addressLine3}
        />
        <AddressInfo state={state} city={city} zip={zip} />
      </div>
      {link}
      {CommonUtils.isNonEmptyString(phoneNumber) ? (
        <div
          className={styles.address_phoneNumber_directions}
          data-testid="phoneNo"
        >
          {phone}{" "}
          <a
            href={"tel:" + phoneNumber.replaceAll(" ", "%20")}
            data-testid="phoneLink"
          >
            {CommonUtils.formattedPhoneNumber(phoneNumber)}
          </a>
        </div>
      ) : null}
    </>
  );

  return (
    <address className={styles.address_wrap} data-testid={"address-wrapper"}>
      {addressWithDirections ? addressDirections : address}
    </address>
  );
};

Address.propTypes = {
  addressHeader: PropTypes.string,
  addressLine1: PropTypes.string,
  addressLine2: PropTypes.string,
  addressLine3: PropTypes.string,
  state: PropTypes.string,
  zip: PropTypes.any,
  city: PropTypes.string,
  phoneNumber: PropTypes.any,
  addressWithDirections: PropTypes.bool,
  customUi: PropTypes.any,
};
