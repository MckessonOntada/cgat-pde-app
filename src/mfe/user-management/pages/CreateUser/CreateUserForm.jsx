import React from 'react';
import { Field } from "formik";
import Components from "../../components/form/Components";
import { useTranslation } from 'react-i18next';

const UserDetailsFormSegment = () => {
    const { t } = useTranslation();

    const options = [
        {
            isDisabled: true,
            value: "",
            label: t("please_select"),
        },
        {
            isDisabled: false,
            value: "maharashtra",
            label: "Maharashtra",
        },
        {
            isDisabled: false,
            value: "delhi",
            label: "Delhi",
        },
    ];


    return (
        <div className='form-container'>
            <div className="headingBox">
                <p className="form-segment-title">{t("personal_details")}</p>
                <p className="form-instruction"> <span className="requiredIcon">✱</span>{t("required")}</p>
            </div>
            <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                <Field
                    name="first_name"
                    label={t("first_name")}
                    placeholder=" "
                    isRequired
                    component={Components["input"]}
                />
                <Field
                    name="middle_name"
                    label={t("middle_name")}
                    placeholder=" "
                    component={Components["input"]}
                />
                <Field
                    name="last_name"
                    label={t("last_name")}
                    placeholder=" "
                    isRequired
                    component={Components["input"]}
                />
            </div>
            <div className="headingBox">
                <p className="form-segment-title">{t("contact_details")}</p>
            </div>
            <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 line-height">
                <Field
                    name="address_1"
                    label={t("address_1")}
                    placeholder=" "
                    isRequired
                    component={Components["input"]}
                />
                <Field
                    name="address_2"
                    label={t("address_2")}
                    placeholder=" "
                    component={Components["input"]}
                />
            </div>
            <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 line-height">
                <Field
                    name="city"
                    label={t("city")}
                    placeholder=" "
                    isRequired
                    component={Components["input"]}
                />
                <Field
                    name="zip"
                    label={t("zip")}
                    placeholder=" "
                    isRequired
                    component={Components["input"]}
                />
                <Field
                    name="state"
                    label={t("state")}
                    placeholder=" "
                    component={Components["dropdown"]}
                    isRequired
                    options={options}
                />
                <Field
                    name="email"
                    label={t("email")}
                    placeholder=" "
                    isRequired
                    component={Components["input"]}
                />
                <Field
                    name="phoneInput"
                    label={t("phone_no")}
                    component={Components["phoneInput"]}
                    className={"phoneInput"}
                    placeholder=" "
                    isRequired
                />
                <Field
                    name="fax"
                    label={t("fax")}
                    placeholder=" "
                    component={Components["input"]}
                    isRequired
                />
            </div>
        </div>
    )
}

export default UserDetailsFormSegment;