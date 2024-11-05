import React from 'react';
import { Field } from "formik";
import Components from "../../components/form/Components";
import { useTranslate  } from '../../../../translations/useTranslation';

const UserDetailsFormSegment = () => {
    const { t } = useTranslate();

    const options = [
        {
            isDisabled: true,
            value: "",
            label: t("userManagement.create_user.option.please_select"),
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
                    label={t("userManagement.create_user.inputLabel.first_name")}
                    placeholder=" "
                    isRequired
                    component={Components["input"]}
                />
                <Field
                    name="middle_name"
                    label={t("userManagement.create_user.inputLabel.middle_name")}
                    placeholder=" "
                    component={Components["input"]}
                />
                <Field
                    name="last_name"
                    label={t("userManagement.create_user.inputLabel.last_name")}
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
                    label={t("userManagement.create_user.inputLabel.address_1")}
                    placeholder=" "
                    isRequired
                    component={Components["input"]}
                />
                <Field
                    name="address_2"
                    label={t("userManagement.create_user.inputLabel.address_2")}
                    placeholder=" "
                    component={Components["input"]}
                />
            </div>
            <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 line-height">
                <Field
                    name="city"
                    label={t("userManagement.create_user.inputLabel.city")}
                    placeholder=" "
                    isRequired
                    component={Components["input"]}
                />
                <Field
                    name="zip"
                    label={t("userManagement.create_user.inputLabel.zip")}
                    placeholder=" "
                    isRequired
                    component={Components["input"]}
                />
                <Field
                    name="state"
                    label={t("userManagement.create_user.inputLabel.state")}
                    placeholder=" "
                    component={Components["dropdown"]}
                    isRequired
                    options={options}
                />
                <Field
                    name="email"
                    label={t("userManagement.create_user.inputLabel.email")}
                    placeholder=" "
                    isRequired
                    component={Components["input"]}
                />
                <Field
                    name="phoneInput"
                    label={t("userManagement.create_user.inputLabel.phone_no")}
                    component={Components["phoneInput"]}
                    className={"phoneInput"}
                    placeholder=" "
                    isRequired
                />
                <Field
                    name="fax"
                    label={t("userManagement.create_user.inputLabel.fax")}
                    placeholder=" "
                    component={Components["input"]}
                    isRequired
                />
            </div>
        </div>
    )
}

export default UserDetailsFormSegment;