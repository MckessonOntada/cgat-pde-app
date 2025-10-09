import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes, { element } from 'prop-types';
import { Button } from '@mckesson/mcp-component-library';
import arrow_right from '@src/assets/image/arrow_right.svg';
import arrow_down from '@src/assets/image/arrow_down.svg';
import ToggleUI from '@src/components/toggleui';
import AdditionalFilters from './AdditionalFilters';
import { generateInitialFilterState } from './utils';
import { Field, Formik, Form } from 'formik';
import Components from '../form/Components';
import './Filters.scss';
import { useTranslate } from '@src/translations/useTranslation';
import CommonUtils from '@src/util/CommonUtils';

const Filters = ({
  onApplyFilters,
  onClearFilters,
  showControls = true,
  additionalFilters,
  searchPlaceholder = 'Search...',
  actualData = [],
  initialData = {},
  onLoadExpanded = false,
  autoFocus = false
}) => {
  const { t } = useTranslate();

  useEffect(() => {
    if (actualData.length === 0 && additionalFilters.length === 0) return;

    additionalFilters.forEach((filter, index) => {
      if (filter.tableColumnId) {
        let currentFilterData = [...new Set(actualData.map((e) => e[filter.tableColumnId]).filter((e) => e))];
        additionalFilters[index].options = currentFilterData.map((item) => {
          return {
            value: '' + item,
            label: filter.customLabel ? filter.customLabel(item) : '' + item
          };
        });
      }
    });
  }, [actualData]);

  const initialFilters = useMemo(() => generateInitialFilterState(additionalFilters), [additionalFilters]);
  const [isCardExpanded, setIsCardExpanded] = useState(onLoadExpanded);
  const formRef = useRef(null);

  const handleExpandCard = () => {
    setIsCardExpanded(!isCardExpanded);
  };

  const clearInputs = () => {
    const inputElements = [...formRef.current.querySelectorAll('input')];

    if (inputElements && Array.isArray(inputElements)) {
      setTimeout(() => {
        inputElements.forEach((inputElement) => {
          try {
            if (inputElement.value) {
              inputElement.value = '';
            }
          } catch (e) {}
        });
      }, 100);
    }
  };

  const clearOptions = () => {
    additionalFilters.forEach((filter, index) => {
      if (filter.options && Array.isArray(filter.options)) {
        additionalFilters[index].options = filter.options.map((option) => ({
          ...option,
          isChecked: false
        }));
      }
    });
  };

  const handleClearFilters = (resetForm) => {
    resetForm({ values: initialFilters });
    clearInputs();
    clearOptions();
    onClearFilters();
  };

  const getDateKeysAndValues = (values) => {
    return Object.keys(values)
      .filter((key) => key.toLowerCase().includes('date')) // Find keys containing "date"
      .reduce((acc, key) => {
        acc[key] = values[key]; // Store raw date values
        return acc;
      }, {});
  };

  const validateForm = (values) => {
    let errors = {};
    const dateKeyValues = getDateKeysAndValues(values);

    Object.keys(dateKeyValues).forEach((key) => {
      const value = dateKeyValues[key];

      let config = additionalFilters?.find((f) => f.name === key);
      // For Linked Filters
      config = additionalFilters.flatMap((f) => f.linkedFilters?.(values[f.name] || '') || []).find((lf) => lf.name === key);

      if (config?.required) {
        const [start, end] = value || [];
        const range = CommonUtils.getDateRangeValidationError(start, end, config?.required ?? False);
        // if (!start || !end) {
        //   errors[key] = 'Please select a valid date range.';
        //   return;
        // }
        if (range) {
          errors[key] = range;
        }
      } else {
        const error = CommonUtils.validateDateRange(value);
        if (error) {
          errors[key] = error;
        }
      }
    });
    return errors;
  };

  React.useEffect(() => {
    if (formRef.current && autoFocus) {
      const searchField = formRef.current.querySelector('input[id="input-searchQuery"]');
      if (searchField) searchField.focus();
    }
  }, []);

  const isAdditionalFiltersAdded = additionalFilters && CommonUtils.isNonEmptyObject(additionalFilters);
  const initialValues = generateInitialFilterState(additionalFilters);

  return (
    <Formik
      enableReinitialize
      initialValues={{ ...initialValues, ...initialData }}
      validate={validateForm}
      onSubmit={(values, { setSubmitting, setErrors }) => {
        const errors = validateForm(values);
        if (Object.keys(errors).length > 0) {
          setTimeout(() => setErrors(errors), 0);
          setSubmitting(false);
          return;
        }

        onApplyFilters(values);
      }}
      validateOnChange={false}
      validateOnBlur={false}>
      {(formik) => {
        const isAnyFilterApplied = Object.values(formik.values).some(
          (value) =>
            value !== '' &&
            value !== null &&
            value !== undefined &&
            !(Array.isArray(value) && value.length === 0) &&
            !(Array.isArray(value) && value.every((ele) => !ele))
        );
        return (
          <Form ref={formRef} autoComplete="off">
            <div className="MCP-filter-panel">
              <div className="filter-header">
                <div className="search-box">
                  {isAdditionalFiltersAdded && (
                    <Button variant="tertiary" type="button" onClick={handleExpandCard}>
                      <img src={isCardExpanded ? arrow_down : arrow_right} alt="toggle-icon" />
                    </Button>
                  )}
                  <div className={'ctrl-search-box'}>
                    <Field name={'searchQuery'} label={''} placeholder={searchPlaceholder} component={Components['input']} />
                  </div>
                </div>
                {showControls && !isCardExpanded && (
                  <div className="filter-control-buttons filterControls">
                    {isAnyFilterApplied && (
                      <Button type="button" size="md" textButton className="txtbtn" onClick={() => handleClearFilters(formik.resetForm)}>
                        {isAdditionalFiltersAdded ? t('filters.clearfilters') : t('filters.clearsearch')}
                      </Button>
                    )}
                    <Button type="submit" size="md" variant="secondary" className="filter-btn">
                      {isAdditionalFiltersAdded ? t('filters.applyfilters') : t('filters.search')}
                    </Button>
                  </div>
                )}
              </div>
              {isAdditionalFiltersAdded && (
                <ToggleUI in={isCardExpanded} timeout={400}>
                  <div className="additional-filters">
                    <AdditionalFilters filtersConfig={additionalFilters} />
                    {showControls && (
                      <div className="filter-control-buttons">
                        <Button type="submit" size="md" variant="secondary" className="filter-btn">
                          {isAdditionalFiltersAdded ? t('filters.applyfilters') : t('filters.search')}
                        </Button>
                        {isAnyFilterApplied && (
                          <Button type="button" size="md" textButton className="txtbtn" onClick={() => handleClearFilters(formik.resetForm)}>
                            {isAdditionalFiltersAdded ? t('filters.clearfilters') : t('filters.clearsearch')}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </ToggleUI>
              )}
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

Filters.propTypes = {
  onApplyFilters: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func,
  additionalFilters: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['select', 'multiselect', 'datepicker', 'dateRange', 'multiSelectDropdown', 'dateRangePicker']),
      name: PropTypes.string.isRequired,
      label: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired
        })
      )
    })
  ),
  showControls: PropTypes.bool
};

export default Filters;
