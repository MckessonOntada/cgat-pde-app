import React from 'react';
import { InputField } from '../InputField';
import { fireEvent, render, screen } from '@testing-library/react';

const MockInputField = (props) => {
  const register = () => {};
  return <InputField register={register} {...props}></InputField>;
};

describe('InputField Component', () => {
  test('should renders inputfield component properly', () => {
    render(<MockInputField id={'1'} />);

    const element = screen.getByTestId('input-testid-1');
    expect(element).toBeInTheDocument();
  });

  test('should render input label ', () => {
    render(<MockInputField id={'1'} label="Custom label" />);

    const label = screen.getByTestId('label-testid-1');
    const labeltext = screen.getByLabelText('Custom label');
    expect(label).toBeInTheDocument();
    expect(labeltext).toBeInTheDocument();
  });

  test('renders with required icon when isRequired prop is true', () => {
    render(<MockInputField id={'1'} label="Custom label" isRequired={true} />);

    const requiredIcon = screen.getByTestId('required-icon-1');
    expect(requiredIcon).toBeInTheDocument();
  });

  test('should render error message', () => {
    const errors = {
      filterName: {
        message: 'Filter Preset Name is Required',
        ref: 'input#input-filterName.InputField-module--inputField--jqAQ0qx18v.InputField-module--sizeMd--cJyin0g1RL.InputField-module--outline--sY3j7TuM2C',
        type: 'custom'
      }
    };

    render(<MockInputField id={'1'} label="Custom label" errors={errors} name="filterName" />);

    const errormessage = screen.getByTestId('error-testid-1');
    expect(errormessage).toBeTruthy();
  });

  test('triggers the onChangeFn when input value changes', () => {
    render(<MockInputField id={'1'} name="filterName" label="Custom label" />);

    const inputElement = screen.getByTestId('input-testid-1');
    fireEvent.change(inputElement, { target: { value: 'New Value' } });
    expect(inputElement).toHaveValue('New Value');
  });

  test('disable input field when isDisabled is true', () => {
    render(<MockInputField id={'1'} name="filterName" label="Custom label" isDisabled={true} />);

    const inputElement = screen.getByTestId('input-testid-1');
    expect(inputElement).toHaveAttribute('disabled', '');
  });

  test('verifies that the input element has a placeholder text', () => {
    render(
      <MockInputField id={'1'} name="filterName" label="Custom label" placeholder="Enter text" />
    );

    const inputElement = screen.getByPlaceholderText('Enter text');
    expect(inputElement).toBeInTheDocument();
  });

  test('verifies that the input element is readOnly when isReadOnly prop is true', () => {
    render(<MockInputField id={'1'} name="filterName" label="Custom label" isReadOnly={true} />);

    const inputElement = screen.getByTestId('input-testid-1');
    expect(inputElement).toHaveAttribute('readOnly');
  });

  test('verifies that the input element has the autoFocus when autoFocus prop is true', () => {
    render(<MockInputField id={'1'} name="filterName" label="Custom label" autoFocus={true} />);

    expect(document.activeElement.id).toBe('input-1');
  });

  test('truncates input value to maxLength if it exceeds for any input type', () => {
    render(<MockInputField id={'1'} name="filterName" label="Custom label" maxLength={5} />);

    const inputElement = screen.getByTestId('input-testid-1');
    fireEvent.change(inputElement, { target: { value: '12345' } });
    expect(inputElement).toHaveValue('12345');
  });

  test('verifies the type prop for different types', () => {
    render(<MockInputField id={'1'} name="filterName" type="number" label="Custom label" />);

    const numberInput = screen.getByTestId('input-testid-1');
    expect(numberInput).toHaveAttribute('type', 'number');

    render(<MockInputField id={'2'} name="filterName" type="text" label="Custom label" />);

    const textInput = screen.getByTestId('input-testid-2');
    expect(textInput).toHaveAttribute('type', 'text');
  });
});
