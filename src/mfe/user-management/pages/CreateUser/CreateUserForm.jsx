import React from 'react';
import { Field } from "formik";
import Components from "@src/components/form/Components";
import { Required } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation'; 

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
                <p className="form-segment-title">{t("userManagement.create_user.personal_details")}</p>
                <p className="form-instruction"> <Required id="Required" >
                </Required> {t("userManagement.create_user.required")}</p>
            </div>
            <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                <Field
                    id="name.firstName"
                    name="name.firstName"
                    label={t("userManagement.create_user.inputLabel.first_name")}
                    placeholder=" "
                    isRequired
                    component={Components["input"]}
                    maxLength={50}
                />
                
                <Field
                    id="name.middleName"
                    name="name.middleName"
                    label={t("userManagement.create_user.inputLabel.middle_name")}
                    placeholder=" "
                    component={Components["input"]}
                    maxLength={50}
                />
                <Field
                    name="name.lastName"
                    label={t("userManagement.create_user.inputLabel.last_name")}
                    placeholder=" "
                    isRequired
                    component={Components["input"]}
                    maxLength={50}
                />
            </div>
            <div className="headingBox">
                <p className="form-segment-title">{t("userManagement.create_user.contact_details")}</p>
            </div>
            <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 line-height">
                <Field
                    name="address.address1"
                    label={t("userManagement.create_user.inputLabel.address_1")}
                    placeholder=" "
                    isRequired
                    component={Components["input"]}
                    maxLength={100}
                />
                <Field
                    name="address.address2"
                    label={t("userManagement.create_user.inputLabel.address_2")}
                    placeholder=" "
                    component={Components["input"]}
                    maxLength={100}
                />
            </div>
            <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                <Field
                    name="address.city"
                    label={t("userManagement.create_user.inputLabel.city")}
                    placeholder=" "
                    isRequired
                    component={Components["input"]}
                    maxLength={50}
                />
                <Field
                    name="address.zip"
                    label={t("userManagement.create_user.inputLabel.zip")}
                    placeholder=" "
                    isRequired
                    component={Components["input"]}
                    maxLength={10}
                />
                <Field
                    name="address.state"
                    fieldlabel={t("userManagement.create_user.inputLabel.state")}
                    placeholder=" "
                    component={Components["dropdown"]}
                    isRequired
                    options={options}
                />
                <Field
                    name="contact.email"
                    label={t("userManagement.create_user.inputLabel.email")}
                    placeholder=" "
                    isRequired
                    component={Components["input"]}
                    maxLength={100}
                />
                <Field
                    name="contact.phone"
                    label={t("userManagement.create_user.inputLabel.phone_no")}
                    component={Components["phoneInput"]}
                    className={"phoneInput"}
                    placeholder=" "
                    isRequired
                />
                <Field
                    name="contact.fax"
                    label={t("userManagement.create_user.inputLabel.fax")}
                    placeholder=" "
                    component={Components["input"]}
                    maxLength={15}
                />
            </div>
        </div>
    )
}

export default UserDetailsFormSegment;
