import React, { useState, useRef, useEffect } from 'react';
import { InputField as BaseInputField, Label, TextError, Tooltip } from '@mckesson/mcp-component-library';
import { highlightFieldOnLabelClick } from './util';
import { ReactComponent as IconInfo } from '@src/assets/svg/info-2.svg';
import { ReactComponent as Clock } from '@src/assets/svg/Time.svg';
import './TimeField.scss';
import IconButton from '../IconButton';

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

export default function TimePicker(prop) {
  const {
    value = '',
    isRequired,
    placeholder = 'HH:mm',
    label,
    error,
    name,
    helpText,
    infoText,
    labelControls,
    handleOnChange,
    handleOnBlur,
    form,
    ...rest
  } = prop;
  const { errors, touched, setFieldValue, setFieldTouched } = form;
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (digits) => {
    if (digits.length >= 3) {
      return digits.slice(0, 2) + ':' + digits.slice(2);
    }
    return digits;
  };

  const isValidPartial = (digits) => {
    const hour = digits.slice(0, 2);
    const minute = digits.slice(2, 4);

    if (hour.length === 2 && Number(hour) > 23) return false;
    if (minute.length === 2 && Number(minute) > 59) return false;

    return true;
  };

  const handleInputChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);

    // if (!isValidPartial(digits)) return;

    const formatted = formatTime(digits);
    setFieldValue(`${name}`, formatted);
  };

  const handleBlur = () => {
    const digits = value?.replace(/\D/g, '');

    if (digits.length === 4) {
      const hour = digits.slice(0, 2).padStart(2, '0');
      const minute = digits.slice(2, 4).padStart(2, '0');
      const finalTime = `${hour}:${minute}`;
      setFieldValue(`${name}`, finalTime);
    }
    handleOnBlur();
  };

  const handleSelect = (h, m, isHour) => {
    const newTime = `${h}:${m}`;
    setFieldValue(`${name}`, newTime);
    if (!isHour) {
      setIsOpen(false);
    }
  };

  const selectedHour = value?.split(':')[0] || '00';
  const selectedMinute = value?.split(':')[1] || '00';

  return (
    <div className="timepicker-wrapper" ref={wrapperRef}>
      <div className="row-space-between-center">
        <Label htmlFor={name} className="label-heading">
          {label}
          {isRequired && <span className="required"> *</span>}
          {infoText && (
            <span className="info-icon">
              <Tooltip body={infoText} placement="top">
                <div type="button" aria-label="information">
                  <IconInfo />
                </div>
              </Tooltip>
            </span>
          )}
        </Label>
        {labelControls}
      </div>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        maxLength={5}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className={`timepicker-input ${error ? 'error' : ''}`}
      />
      <div className="clock-icon-btn">
        <IconButton variant="text" size="small" icon={<Clock width="18" height="18" />} onClick={() => setIsOpen(!isOpen)} />
      </div>

      {helpText && <span className="help-text">{helpText}</span>}
      {error && <TextError errorMessage={error} />}

      {isOpen && (
        <div className="timepicker-dropdown">
          <div className="time-column">
            {hours.map((h) => (
              <div key={h} className={`time-item ${h === selectedHour ? 'active' : ''}`} onMouseDown={() => handleSelect(h, selectedMinute, true)}>
                {h}
              </div>
            ))}
          </div>

          <div className="time-column">
            {minutes.map((m) => (
              <div key={m} className={`time-item ${m === selectedMinute ? 'active' : ''}`} onMouseDown={() => handleSelect(selectedHour, m, false)}>
                {m}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
