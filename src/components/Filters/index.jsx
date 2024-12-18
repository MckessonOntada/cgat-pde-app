import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { useTranslate } from '@src/translations/useTranslation';

const Filters = ({ onApplyFilters, onClearFilters, showControls = true, additionalFilters, searchPlaceholder = 'Search...', filterData = [] }) => {
  const { t } = useTranslate();
  useEffect(() => {
    if (filterData.length > 0 && additionalFilters.length > 0) {
      additionalFilters.forEach((filter, index) => {
        if (filter.id) {
          let currentFilterData = [...new Set(filterData.map((e) => e[filter.id]).filter((e) => e))];
          additionalFilters[index].options = currentFilterData.map((item) => {
            return { value: '' + item, label: '' + item };
          });
        }
      });
    }
  }, [filterData]);
  const initialFilters = useMemo(() => generateInitialFilterState(additionalFilters), [additionalFilters]);
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const formRef = useRef(null);

  const handleExpandCard = () => {
    setIsCardExpanded(!isCardExpanded);
  };

  const clearInputs = () => {
    const inputElements = formRef.current.querySelectorAll('input');

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

  const handleClearFilters = (resetForm) => {
    resetForm({ values: initialFilters });
    clearInputs();
    onClearFilters();
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
          <Form ref={formRef}>
            <div className="MCP-filter-panel">
              <div className="filter-header">
                <div className="search-box">
                  <button type="button" onClick={handleExpandCard}>
                    <img src={isCardExpanded ? arrow_down : arrow_right} alt="toggle-icon" />
                  </button>
                  <div className={'ctrl-search-box'}>
                    <Field name={'searchQuery'} label={''} placeholder={searchPlaceholder} component={Components['input']} />
                  </div>
                </div>
                {showControls && (
                  <div className="filter-control-buttons filterControls">
                    {isAnyFilterApplied && (
                      <Button type="button" size="md" textButton className="txtbtn" onClick={() => handleClearFilters(formik.resetForm)}>
                        {t('filters.clearfilters')}
                      </Button>
                    )}
                    <Button type="submit" size="md" variant="secondary" className="filter-btn">
                      {t('filters.applyfilters')}
                    </Button>
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
