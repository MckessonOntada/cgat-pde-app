import React from 'react';
import * as Yup from 'yup';
import { Formik, Form, useFormik } from 'formik'; 
import './CreateUser.scss';
import { Button } from '@mckesson/mcp-component-library';
import { Card, Stepper } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import UserDetailsFormSegment from './CreateUserForm';
import { useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import PageHeader from '@src/components/PageHeader/PageHeader'

const CreateUser = () => {
	const { t } = useTranslate();
	const navigate = useNavigate();

	const goBack = () => {
		navigate(-1);
	};

	const initialValues = {
		first_name: '',
		middle_name: '',
		last_name: '',
		address_1: '',
		address_2: '',
		city: '',
		zip: '',
		state: '',
		email: '',
		phoneInput: '',
		fax: '',
	};

	const validationSchema = Yup.object({
		first_name: Yup.string().matches(/^[A-Za-z]+$/, t('userManagement.create_user.validation.first_name')) // Only alphabets
			.required(t('userManagement.create_user.validation.first_name_required')),
		middle_name: Yup.string().matches(/^[A-Za-z]+$/, t('userManagement.create_user.validation.middle_name')) ,
		last_name: Yup.string().matches(/^[A-Za-z]+$/, t('userManagement.create_user.validation.last_name')) // Only alphabets
			.required(t('userManagement.create_user.validation.last_name_required')),
		address_1: Yup.string().required(t('userManagement.create_user.validation.address_1_required')),
		address_2: Yup.string(),
		city: Yup.string().matches(/^[A-Za-z]+$/, t('userManagement.create_user.validation.city')) // Only alphabets
			.required(t('userManagement.create_user.validation.city_required')),
		zip: Yup.string()
			.matches(/^[0-9]+$/, t('userManagement.create_user.validation.zip')) // Only digits
			.required(t('userManagement.create_user.validation.zip_required')),
		state: Yup.string().required(t('userManagement.create_user.validation.state_required')),
		email: Yup.string().email(t('userManagement.create_user.validation.invalid_email')).required(t('userManagement.create_user.validation.email_required')),
		phoneInput: Yup.string()
			.matches(/^[0-9]{10}$/, t('userManagement.create_user.validation.phone_no'))
			.required(t('userManagement.create_user.validation.phone_no_required')),
		fax: Yup.string().matches(/^[0-9]{15}$/, (t('userManagement.create_user.validation.fax'))),

	});
 

	const handleSubmit = values => {
		alert(JSON.stringify(values, null, 2));
		console.log(JSON.stringify(values, null, 2));
	};

	const handleGoBack = () => {
		navigate(-1);
	};

	return (
		<div>
			<div
				className="back-navigation py2 capitalize"
				onClick={goBack}
				style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
			>
				<MdOutlineKeyboardArrowLeft size="24px" />
				<p>Back to Manage Users</p>
			</div>
			<PageHeader
				title={t('userManagement.create_user')}
			/>
			<div className="stepper">
				<Stepper
					activeIndex={1}
					dividerText="of"
					stepHeaders={[
						{
							label: 'User Details',
						},
						{
							label: 'Roles and Permissions',
						},
						{
							label: 'Associate Accounts',
						},
					]}
				/>
			</div>

			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={(values, actions) => {
					handleSubmit(values);
					actions.setSubmitting(false);
				}}

			>
				{() => (
					<Form>

						<div className="container">
							<div className="headingBox">
								<p className="font-bold-title-s"> {t('userManagement.create_user.details_to_create_user')}</p>
							</div>
							<UserDetailsFormSegment />
						</div>
						<div className={'buttonGroup'}>
							<Button variant="secondary" type="button" onClick={handleGoBack} size={'md'}>
								{t('userManagement.button.back')}
							</Button>
							<Button type="submit" size={'md'}>{t('userManagement.button.next')}</Button>
						</div>
					</Form>)
				}
			</Formik>
		</div>
	);
};

export default CreateUser;
export { UserDetailsFormSegment };
