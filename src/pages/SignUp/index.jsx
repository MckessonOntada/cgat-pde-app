import React from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { UserDetailsFormSegment } from "@src/mfe/user-management/pages/CreateUser";
import Components from "@src/components/form/Components";
import ModuleHeader from '@src/components/module-header';
import './index.scss'; 
import mainLayoutStyles from '@src/assets/styles/MainLayout.module.scss'; 
import AppRoutes from '@src/routes/AppRoutes';
import { useNavigate } from "react-router-dom";
import PrimaryHeader from "@src/components/header/PrimaryHeader";
import { useMutation } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';


const SignUp = () => {
    const { t } = useTranslate();
    const navigate = useNavigate();
    const { mutate, isLoading, isError, data } = useMutation(async ({ payload }) => {
		const res = await HttpResourceService.callRest(
            `${ApiRoutes.POST_SIGNUP_USER}`,
            httpVerb.POST,
            payload
        );
        return res.data;
	});
    const initialValues = {
        name: {
            firstName: '',
            middleName: '',
            lastName: '',
        },
        contact: {
            email: '',
            countryCode: "91",
            phone: '',
            fax: '',
        },
        address: {
            address1: '',
            address2: '',
            city: '',
            state: '',
            zip: '',
        },
        practiceId: '',
        comment: ''
    };

    const validationSchema = Yup.object({
        name: Yup.object({
            firstName: Yup.string()
                .matches(/^[A-Za-z]+$/, t('userManagement.create_user.validation.first_name')) // Only alphabets
                .required(t('userManagement.create_user.validation.first_name_required')),
            middleName: Yup.string()
                .matches(/^[A-Za-z]+$/, t('userManagement.create_user.validation.middle_name')),
            lastName: Yup.string()
                .matches(/^[A-Za-z]+$/, t('userManagement.create_user.validation.last_name')) // Only alphabets
                .required(t('userManagement.create_user.validation.last_name_required')),
        }),

        contact: Yup.object({
            email: Yup.string()
                .email(t('userManagement.create_user.validation.invalid_email'))
                .required(t('userManagement.create_user.validation.email_required')),
            phone: Yup.string()
                .matches(/^[0-9]{10}$/, t('userManagement.create_user.validation.phone_no')) // 10 digits only
                .required(t('userManagement.create_user.validation.phone_no_required')),
            fax: Yup.string()
                .matches(/^[0-9]{15}$/, t('userManagement.create_user.validation.fax')),
        }),

        address: Yup.object({
            address1: Yup.string()
                .matches(/^[A-Za-z0-9\s.,#&/-]*$/, t('userManagement.create_user.validation.address_1')) // Alphanumeric and special characters
                .required(t('userManagement.create_user.validation.address_1_required')),
            address2: Yup.string().matches(/^[A-Za-z0-9\s.,#&/-]*$/, t('userManagement.create_user.validation.address_1')), // Optional field
            city: Yup.string()
                .matches(/^[A-Za-z]+$/, t('userManagement.create_user.validation.city')) // Only alphabets
                .required(t('userManagement.create_user.validation.city_required')),
            state: Yup.string()
                .required(t('userManagement.create_user.validation.state_required')),
            zip: Yup.string()
                .matches(/^\d{5}(-\d{4})?$/, t('userManagement.create_user.validation.zip')) // Only digits
                .required(t('userManagement.create_user.validation.zip_required')),
        }),
        practiceId: Yup.string().required(t("form.organization_required"))
    });

   

    const handleSubmit = (values) => {
        // alert(JSON.stringify(values, null, 2));
        console.log(JSON.stringify(values, null, 2));
        const payload = {			
			...values,
            "isActive": true
		};

		mutate(
			{
				payload
			},
			{
				onSuccess: (response) => {
					console.log('User created/updated successfully:', response);
					navigate(`../${AppRoutes.pathSignin}`);
				},
				onError: (error) => { 
					setAlert({ type: "error", message: "Failed to create/update user" });
					setIsAlertVisible(true); 
				},
			}
		); 
    };

    return (
        <div className={mainLayoutStyles.appContainer}> 
            <PrimaryHeader/>
            <div className={mainLayoutStyles.home}>
                <div className="MCP-module-wrapper py3">
                    <ModuleHeader heading={<p className='primaryHeading'>{t('forms.headings.newUserRegistration')}</p>} />
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        enableReinitialize
                        onSubmit={(values, actions) => {
                            handleSubmit(values);
                            actions.setSubmitting(false);
                        }}
                    >
                        {() => (
                            <Form>
                                <div className="MCP-panel-container">
                                    <UserDetailsFormSegment />
                                    <div>
                                        <p className="form-segment-title">{t("forms.headings.organization_details")}</p>
                                    </div>
                                    <div className="form-segment">
                                        <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 line-height">
                                            <Field
                                                name="practiceId"
                                                fieldlabel={t("forms.labels.organization")}
                                                placeholder=" "
                                                component={Components["dropdown"]}
                                                 isRequired
                                                options={[{
                                                    label: 'ten', 
                                                    value: 10
                                                  },
                                                  {
                                                    label: 'TXO',
                                                    value: 261
                                                  }, ]} />
                                        </div>
                                        <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                                            <Field
                                                name="comment"
                                                fieldlabel={t("forms.labels.comment")}
                                                placeholder=" "
                                                component={Components["textarea"]}
                                                maxCharHelperText={t('forms.placeholder.max_5000_chars')}
                                                maxCharLimit={5000} />
                                        </div>
                                    </div>  </div><div className={"buttonGroup"}>
                                    <Button
                                        size="md" variant="primary"
                                        type="button"
                                        onClick={() => console.log("go back")}
                                    >
                                        {t("forms.buttons.cancel")}
                                    </Button>
                                    <Button type="submit" variant="primary" size="md">{t("forms.buttons.createaccount")}</Button>
                                </div>
                            </Form>)}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default SignUp;