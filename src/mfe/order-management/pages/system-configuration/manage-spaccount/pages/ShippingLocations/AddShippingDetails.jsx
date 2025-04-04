import FloatingDrawer from '@src/components/floating-drawer';
import { Field, Formik, Form } from 'formik';
import React from 'react';
import { Heading, Button } from '@mckesson/mcp-component-library';
import Components from '@src/components/form/Components';
import { useTranslate } from '@src/translations/useTranslation';
import { initialValuesforShippingAddress, stateOptions, validationSchemaforShippingAddress } from '../../util';

function AddShippingDetails({ open, onClose, row, onFormSubmit }) {
  const { t } = useTranslate();
  console.log('row', row);
  const onSubmitHandler = (values) => {
    try {
      console.log('Shipping Location Submitted:', values);

      //  API call

      if (onFormSubmit) {
        onFormSubmit(
          'success',
          t(
            !!row && Object.keys(row).length > 0
              ? 'manageSPAccount.message.updateshippinglocation.success'
              : 'manageSPAccount.message.addshippinglocation.success'
          )
        );
      }
    } catch (error) {
      if (onFormSubmit) {
        onFormSubmit('error', t('manageSPAccount.message.addshippinglocation.error'));
      }
    }
    onClose();
  };

  return (
    <Formik
      initialValues={initialValuesforShippingAddress(row)}
      validationSchema={validationSchemaforShippingAddress(t)}
      onSubmit={(values, actions) => {
        onSubmitHandler(values);
        actions.setSubmitting(false);
      }}>
      {() => (
        <Form>
          <FloatingDrawer
            open={open}
            anchor="right"
            onClose={onClose}
            heading={t('manageSPAccount.headings.addshippinglocation')}
            controls={
              <div className="controls">
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">{t('manageSPAccount.button.addLocation')}</Button>
              </div>
            }>
            <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 align-items-baseline">
              <div className="headingBox firstHeading">
                <div className="styled-heading">
                  <Heading as="h4">{t('manageSPAccount.headings.shippinglocationdetails')}</Heading>
                </div>

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
                name="address.address1"
                label={t('manageSPAccount.shippingLocation.inputLabel.address_1')}
                placeholder=" "
                isRequired
                component={Components['input']}
                maxLength={100}
              />
              <Field
                name="address.address2"
                label={t('manageSPAccount.shippingLocation.inputLabel.address_2')}
                placeholder=" "
                component={Components['input']}
                maxLength={100}
              />
              <Field
                name="address.city"
                label={t('manageSPAccount.shippingLocation.inputLabel.city')}
                placeholder=" "
                isRequired
                component={Components['input']}
                maxLength={50}
              />
              <Field
                name="address.zip"
                label={t('manageSPAccount.shippingLocation.inputLabel.zip')}
                placeholder=" "
                isRequired
                component={Components['zipInput']}
                maxLength={10}
              />
              <div className="corrected-dropdown">
                <Field
                  name="address.state"
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
