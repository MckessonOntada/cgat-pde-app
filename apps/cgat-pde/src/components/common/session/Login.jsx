import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button, CheckboxGroup, Divider, InputField } from "@mfe/ui-components";
import "./assets/style.scss";
import { ReactComponent as OktaLockPassword } from "./../../../assets/images/okta-lock.svg";
import { ReactComponent as MckessonLogo } from "./../../../assets/images/mckesson-logo-colored.svg";
import { Link } from "react-router-dom";

const LoginForm = () => {

    const initialValues = {
        username: "",
        password: "",
        rememberMe: false,
    };

    const validationSchema = Yup.object({
        username: Yup.string()
            .email("Invalid username address")
            .required("Username is required"),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
    });

    const onSubmit = (values, { setSubmitting }) => {
        console.log("Login form values:", values);
        setSubmitting(false);
    };

    return (
        <div className="login box">
            <div className="branding">
                <div className="logo">
                    <MckessonLogo />
                </div>
            </div>
            <div className="seperator">
                <Divider className="divider" />
                <OktaLock />
                <Divider className="divider" />
            </div>
            <h4 className="box-heading">Sign In</h4>
            <div className="form-wrapper">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="fields">
                                <div className="field">
                                    <label htmlFor="username" className="field-label">
                                        Username
                                    </label>
                                    <Field
                                        type="username"
                                        id="username"
                                        name="username"

                                    >
                                        {({ field, form, ...rest }) => (

                                            <InputField
                                                {...rest}
                                                name={field.name}
                                                value={field.value}
                                                register={() => ({
                                                    onChange: field.onChange,
                                                    onBlur: field.onBlur,
                                                })}
                                                errors={field.value && form.errors}
                                                errorMessage={field.value && form.errors[field.name]}
                                                showError={!form.isValid}
                                                size="lg"
                                            />
                                        )}
                                    </Field>
                                </div>

                                <div className="field">
                                    <label htmlFor="password" className="field-label">
                                        Password
                                    </label>
                                    <Field
                                        type="password"
                                        id="password"
                                        name="password"
                                    >{({ field, form, ...rest }) => (<InputField
                                        {...rest}
                                        type="password"
                                        name={field.name}
                                        value={field.value}
                                        register={() => ({
                                            onChange: field.onChange,
                                            onBlur: field.onBlur,
                                        })}
                                        errors={field.value && form.errors}
                                        errorMessage={field.value && form.errors[field.name]}
                                        showError={!form.isValid}
                                        size="lg"
                                    />)
                                        }
                                    </Field>
                                </div>

                                <div className="field">
                                    <Field
                                        type="checkbox"
                                        id="remember_me_checkbox"
                                        name="rememberMe"
                                        component={CheckBoxComponent}
                                    />
                                </div>

                                <div className={"controls"}>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        size={"lg"}
                                    >
                                        Login
                                    </Button>
                                </div>

                                <div>
                                    <Link className="help-link" to="">Need help signing in?</Link>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

function CheckBoxComponent({ field, form, ...rest }) {
    const [checkboxOptions, setCheckboxOptions] = React.useState([
        {
            isDisabled: false,
            isChecked: false,
            label: "Remember me",
            name: "remember_me"
        },
    ]);
    const handleChange = (currentItem) => {
        const updatedOptions = checkboxOptions.map((item) =>
            item.name === currentItem.name
                ? {
                    ...currentItem,
                    isChecked: !item.isChecked,
                }
                : item,
        );
        setCheckboxOptions(updatedOptions);
        form.setFieldValue(field.name, updatedOptions);
    };
    return (
        <CheckboxGroup
            {...rest}
            id={"default"}
            name="rememberMe"
            items={checkboxOptions.map((item) => ({
                ...item,
                onChange: () => handleChange(item),
            }))}
            itemCustomStyles={{
                fontSize: "var(--brand-font-size--small)"
            }}
        />
    );
}

function OktaLock() {
    return (
        <div className="okta-lock-wrapper">
            <div className="okta-lock">
                <OktaLockPassword />
            </div>
        </div>
    );
}

export default LoginForm;
