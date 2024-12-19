import InputFieldFormik from './formik/InputFieldFormik';
import TextareaFormik from './formik/TextareaFormik';
import DropdownFormik from './formik/DropdownFormik';
import PhoneInputFormik from './formik/PhoneInputFormik';
import ZipInput from './ZipInput';
import DateRangePickerFormik from './formik/DateRangePickerFormik';
import MultiSelectDropdownFormik from './formik/MultiSelectDropdownFormik';
import RadioGroup from './RadioGroup';

const Components = {
  input: InputFieldFormik,
  textarea: TextareaFormik,
  dropdown: DropdownFormik,
  phoneInput: PhoneInputFormik,
  zipInput: ZipInput,
  dateRangePicker: DateRangePickerFormik,
  multiSelectDropdown: MultiSelectDropdownFormik,
  radioGroup: RadioGroup
};

export default Components;
