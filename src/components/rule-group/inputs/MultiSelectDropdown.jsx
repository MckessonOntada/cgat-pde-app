import React from 'react';
import { Pills } from '@mckesson/mcp-component-library';
import { getNestedValue } from '@src/components/form/util';
import BaseMultiSelectDropdown from '@src/components/form/MultiSelectDropdown';

function mergeWithChecked(options = [], selected = []) {
  const selectedSet = new Set(selected.map((i) => i.value));
  let changed = false;

  const updated = options.map((item) => {
    const shouldCheck = selectedSet.has(item.value);
    if (item.isChecked !== shouldCheck) changed = true;
    if (shouldCheck !== item.isChecked) return { ...item, isChecked: shouldCheck };
    return item;
  });

  const missing = selected.filter((s) => !options.some((o) => o.value === s.value));
  if (missing.length > 0) changed = true;

  const extra = missing.map((m) => ({
    label: m.label,
    value: m.value,
    isChecked: true
  }));

  if (!changed) return options;
  return [...updated, ...extra];
}

const MultiSelectDropdown = (props) => {
  const {
    field,
    form,
    fieldLabel,
    isRequired,
    isPillsVisible = false,
    pillsCount = null,
    pillsLabels = [],
    onRemoveClick = () => {},
    searchFn,
    ...rest
  } = props;

  const { name, value = [] } = field;
  const { setFieldValue, errors, touched } = form;
  const errorMessage = getNestedValue(errors, name);
  const isFieldTouched = getNestedValue(touched, name);

  const [fetched, setFetched] = React.useState([]);

  React.useEffect(() => {
    if (!searchFn) return;
    let mounted = true;

    searchFn().then((res) => {
      if (!mounted) return;
      setFetched(res);
    });

    return () => {
      mounted = false;
    };
  }, [searchFn]);

  const options = React.useMemo(() => {
    if (Array.isArray(fetched) && Array.isArray(value)) return mergeWithChecked(fetched, value);
    return [];
  }, [fetched, value]);

  const lastSelectedRef = React.useRef(Array.isArray(value) ? value : []);

  const handleChange = React.useCallback(
    (values) => {
      const newSelected = values.filter((v) => v.isChecked).map((v) => v.value);
      const oldSelected = lastSelectedRef.current.map((v) => v.value);

      const same = newSelected.length === oldSelected.length && newSelected.every((v) => oldSelected.includes(v));

      if (same) return;

      lastSelectedRef.current = values.filter((v) => v.isChecked);

      const mapped = values.filter((v) => v.isChecked).map((v) => ({ label: v.label, value: v.value, isChecked: true }));

      setFieldValue(name, mapped);
    },
    [name, setFieldValue]
  );

  const handleSearch = React.useCallback(
    async (keyword) => {
      if (!searchFn) return;
      const res = await searchFn(keyword);
      setFetched(res);
    },
    [searchFn]
  );

  return (
    <div>
      <BaseMultiSelectDropdown
        id={name}
        name={name}
        label={fieldLabel}
        isSuccess
        error={isFieldTouched && errorMessage}
        onChange={handleChange}
        isRequired={isRequired}
        options={options}
        onSearch={handleSearch}
        {...rest}
      />

      {isPillsVisible && value.length > 0 && (
        <div className="pills-container">
          <Pills id={`pills-${name}`} labels={pillsLabels} variant="secondary" hasDeleteIcon onDelete={onRemoveClick} showPillsCount={pillsCount} />
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
