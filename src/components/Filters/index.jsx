import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mckesson/mcp-component-library';
import arrow_right from '@src/assets/image/arrow_right.svg';
import arrow_down from '@src/assets/image/arrow_down.svg';
import ToggleUI from '@src/components/toggleui';
import AdditionalFilters from './AdditionalFilters';
import { generateInitialFilterState } from './utils';
import { Field, Formik, Form } from 'formik';
import Components from '../form/Components';
import './Filters.scss';

const Filters = ({ onApplyFilters, onClearFilters, showControls = true, additionalFilters, searchPlaceholder = "Search..." }) => {
  const initialFilters = useMemo(() => generateInitialFilterState(additionalFilters), [additionalFilters]);
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const searchRef = useRef(null);

  const handleExpandCard = () => {
    setIsCardExpanded(!isCardExpanded);
  };

  const clearSearchBox = () => {
    const inputElement = searchRef.current.querySelector('input');

    if (inputElement) {
      inputElement.value = '';
    }
  };

  const handleClearFilters = (resetForm) => {
    resetForm({ values: initialFilters });
    clearSearchBox();
    onClearFilters?.();
  };

  return (
    <Formik
      enableReinitialize
      initialValues={generateInitialFilterState(additionalFilters)}
      onSubmit={(values, actions) => {
        onApplyFilters(values);
        actions.setSubmitting(false);
      }}
      validateOnChange={false}
      validateOnBlur={false}>
      {(formik) => {
        const isAnyFilterApplied = Object.values(formik.values).some((value) => value && value.length > 0);

        return (
          <Form>
            <div className="MCP-filter-panel">
              <div className="filter-header">
                <div className="search-box">
                  <button type="button" onClick={handleExpandCard}>
                    <img src={isCardExpanded ? arrow_down : arrow_right} alt="toggle-icon" />
                  </button>
                  <div ref={searchRef} className="searchContainer">
                    <Field name={'searchQuery'} label={''} placeholder={searchPlaceholder} component={Components['input']} />
                  </div>
                </div>
                {showControls && (
                  <div className="filter-control-buttons filterControls">
                    {isAnyFilterApplied && <Button type="button" size="md" label="Clear Filters" textButton className="txtbtn" onClick={() => handleClearFilters(formik.resetForm)} />}
                    <Button type="submit" size="md" variant="secondary" label="Apply Filters" className="filter-btn" onClick={(values) => onApplyFilters(values)} />
                  </div>
                )}
              </div>
              <ToggleUI in={isCardExpanded} timeout={400}>
                <div className="additional-filters">
                  <AdditionalFilters filtersConfig={additionalFilters} />
                </div>
              </ToggleUI>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

Filters.propTypes = {
  initialFilters: PropTypes.object.isRequired,
  onApplyFilters: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func,
  additionalFilters: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['select', 'multiselect', 'datepicker', 'dateRange']),
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string.isRequired, label: PropTypes.string.isRequired }))
    })
  ),
  showControls: PropTypes.bool
};

export default Filters;
