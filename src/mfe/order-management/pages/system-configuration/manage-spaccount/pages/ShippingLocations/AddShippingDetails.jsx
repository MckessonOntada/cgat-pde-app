import FloatingDrawer from '@src/components/floating-drawer';
import { Field, Formik, Form } from 'formik';
import React, { useTransition } from 'react';
import { Heading, Button, Alert } from '@mckesson/mcp-component-library';
import Components from '@src/components/form/Components';
import { US_STATES } from '@src/components/form/util';
import { useTranslate } from '@src/translations/useTranslation';
import { initialValuesforShippingAddress, validationSchemaforShippingAddress } from '../../util';

const stateOptions = US_STATES();
function AddShippingDetails({ open, onClose }) {
  const { t } = useTranslate();

  const onSubmitHandler = (values) => {
    console.log('Shipping Location Submitted:', values);
    onClose();
  };

  return (
    <Formik initialValues={initialValuesforShippingAddress} validationSchema={validationSchemaforShippingAddress(t)} onSubmit={() => {}}>
      {() => (
        <Form>
          <FloatingDrawer
            open={open}
            anchor="right"
            onClose={onClose}
            heading="Shipping Location Details"
            controls={
              <div className="controls">
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Add Location</Button>
              </div>
            }>
            <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 align-items-baseline">
              <div className="headingBox firstHeading">
                <Heading as="h3">{t('manageSPAccount.headings.addshippinglocation')}</Heading>
                <p className="form-instruction">
                  <span className="required">* </span> {t('userManagement.create_user.required')}
                </p>
              </div>
              <Field
                name="locationName"
                label={t('manageSPAccount.shippingLocation.inputLabel.locationName')}
                isRequired
                component={Components['input']}
              />
              <Field
                name="address1"
                label={t('manageSPAccount.shippingLocation.inputLabel.address_1')}
                placeholder=" "
                isRequired
                component={Components['input']}
                maxLength={100}
              />
              <Field
                name="address2"
                label={t('manageSPAccount.shippingLocation.inputLabel.address_2')}
                placeholder=" "
                component={Components['input']}
                maxLength={100}
              />
              <Field
                name="city"
                label={t('manageSPAccount.shippingLocation.inputLabel.city')}
                placeholder=" "
                isRequired
                component={Components['input']}
                maxLength={50}
              />
              <Field
                name="zip"
                label={t('manageSPAccount.shippingLocation.inputLabel.zip')}
                placeholder=" "
                isRequired
                component={Components['zipInput']}
                maxLength={10}
              />
              <div className="corrected-dropdown">
                <Field
                  name="state"
                  label={t('manageSPAccount.shippingLocation.inputLabel.state')}
                  placeholder=" "
                  component={Components['stateDropdown']}
                  isRequired
                  options={stateOptions}
                />
              </div>
            </div>
          </FloatingDrawer>
        </Form>
      )}
    </Formik>
  );
}

export default AddShippingDetails;
