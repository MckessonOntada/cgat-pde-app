import React from "react";
import { MaskedInput, TextError } from "@mfe/ui-components";

export default function PhoneInput(props) {
  const { field, form } = props;

  return (
    <div style={{ display: "grid" }}>
      <MaskedInput
        {...props}
        mask="(XXX) XXX-XXXX"
        onChangeFn={(value) => form.setFieldValue(field.name, value)}
        onBlurFn={() => form.setFieldTouched(field.name, true)}
        value={field.value}
        dataTestId="mobile-input"
        useUnmaskedValue={false}
      />
      {form.errors[field.name] && form.touched[field.name] && (
        <TextError errorMessage={form.errors[field.name]} id={field.name} />
      )}
    </div>
  );
}
