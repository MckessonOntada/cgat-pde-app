import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mckesson/mcp-component-library';
import arrow_right from '@src/assets/image/arrow_right.svg';
import arrow_down from '@src/assets/image/arrow_down.svg';
import ToggleUI from '@src/components/toggleui';
import AdditionalFilters from './AdditionalFilters';
import { generateInitialFilterState } from './utils';
import { Field, Formik, Form } from 'formik';
import Components from '../form/Components';

const Filters = ({ initialFilters, onApplyFilters, onClearFilters, showControls = true, additionalFilters }) => {
  const [filters, setFilters] = useState(generateInitialFilterState(additionalFilters));
  const [isCardExpanded, setIsCardExpanded] = useState(false);

  const handleExpandCard = () => {
    setIsCardExpanded(!isCardExpanded);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    onClearFilters?.();
  };

  const handleApplyFilters = () => {
    onApplyFilters?.(filters);
  };

  const handleFilterChange = (key, value) => {
    if (!key || typeof key !== 'string') {
      console.error('Invalid key passed to handleFilterChange:', key);
      return;
    }
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value
    }));
  };

  const anyFilterIsApplied = Object.values(filters).some((filter) => filter && filter.length > 0);

  return (
    <Formik
      enableReinitialize
      initialValues={filters}
      onSubmit={(values, actions) => {
        onApplyFilters(values);
        actions.setSubmitting(false);
      }}
      validateOnChange={false}
      validateOnBlur={false}>
      {(formik) => (
        <Form>
          <div className="MCP-filter-panel">
          <div className="filter-header">
            <div className="search-box">
              <button type="button" onClick={handleExpandCard}>
                <img src={isCardExpanded ? arrow_down : arrow_right} alt="toggle-icon" />
              </button>
              <Field name={'searchQuery'} label={''} placeholder={'Search...'} component={Components['input']} />
            </div>
            {showControls && (
              <div className="filter-control-buttons">
                {anyFilterIsApplied && <Button type="button" size="md" label="Clear Filters" textButton className="txtbtn" onClick={handleClearFilters} />}
                <Button type="submit" size="md" variant="secondary" label="Apply Filters" className="filter-btn" onClick={handleApplyFilters} />
              </div>
            )}
          </div>
          <ToggleUI in={isCardExpanded} timeout={400}>
            <div className="additional-filters">
              <AdditionalFilters filterState={filters} filtersConfig={additionalFilters} handleFilterChange={handleFilterChange} formData={formik} />
            </div>
          </ToggleUI>
        </div>
        </Form>
      )}
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
