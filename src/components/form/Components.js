import InputFieldFormik from './formik/InputFieldFormik';
import TextareaFormik from './formik/TextareaFormik';
import DropdownFormik from './formik/DropdownFormik';
import PhoneInputFormik from './formik/PhoneInputFormik';
import ZipInput from './ZipInput';
import DateRangePickerFormik from './formik/DateRangePickerFormik';
import MultiSelectDropdownFormik from './formik/MultiSelectDropdownFormik';
import DatePickerFormik from './formik/DatePickerFormik';
import RadioGroup from './RadioGroup';
import ToggleButtonFieldFormik from './formik/ToggleButtonFormik';
import InputFileFormik from './formik/InputFileFormik';
import StateDropdown from './StateDropdown';

const Components = {
  input: InputFieldFormik,
  textarea: TextareaFormik,
  dropdown: DropdownFormik,
  phoneInput: PhoneInputFormik,
  zipInput: ZipInput,
  dateRangePicker: DateRangePickerFormik,
  multiSelectDropdown: MultiSelectDropdownFormik,
  datePicker: DatePickerFormik,
  radioGroup: RadioGroup,
  toggleButton: ToggleButtonFieldFormik,
  inputFile: InputFileFormik,
  stateDropdown: StateDropdown
};

export default Components;
