import React from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import './CreateUser.scss';
import { Button, Stepper } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import UserDetailsFormSegment from './CreateUserForm';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md'; 
import { USER_DATA } from '../../mockData/UsersData';
import { PATHS } from "../../routes/constants";
import ModuleHeader from '@src/components/module-header';

const CreateUser = () => {
	const { t } = useTranslate();
	const navigate = useNavigate();
	const { userId } = useParams();
	const location = useLocation();
	const { isEdit } = location.state || {};

	// Fetch user data based on userId 
	const userData = USER_DATA.find(user => user.id === parseInt(userId));

	const goBack = () => {
		navigate(-1);
	};

	const initialValues = {
		name: {
			firstName: userData?.name?.firstName || '',
			middleName: userData?.name?.middleName || '',
			lastName: userData?.name?.lastName || '',
		},
		contact: {
			email: userData?.contact?.e_mail || '',
			phone: userData?.contact?.phone || '',
			fax: userData?.contact?.fax || '',
		},
		address: {
			address1: userData?.address?.address1 || '',
			address2: userData?.address?.address2 || '',
			city: userData?.address?.city || '',
			state: userData?.address?.state || '',
			zip: userData?.address?.zip || '',
		},
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

	});


	const handleSubmit = values => {
		if (userData) {
			const { id, isActive, ...rest } = userData;
			alert(JSON.stringify({ id, isActive, ...rest }, null, 2));
			console.log(JSON.stringify({ id, isActive, ...rest }, null, 2));
		}
		else {
			alert(JSON.stringify(values, null, 2));
			console.log(JSON.stringify(values, null, 2));
		}
		if (userId) {
			navigate(isEdit ? -1 : `../${PATHS.userPermissions}/${userId}`);
		} else {
			navigate(isEdit ? -1 : `../${PATHS.userPermissions}/7`); // Need to Replace `7` with appropriate User id when Creating a user
		}
	};

	const handleGoBack = () => {
		navigate(-1);
	};

	return (
		<div className="MCP-module-wrapper">
			<div
				className="back-navigation py2 capitalize"
				onClick={goBack}
				style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
			>
				<MdOutlineKeyboardArrowLeft size="24px" />
				<p>Back to Manage Users</p>
			</div>


			<ModuleHeader
				heading={<p className='primaryHeading'>{t('userManagement.create_user')}</p>} 
			/>
			<div className="stepper">
				<Stepper
					activeIndex={1}
					dividerText="of"
					stepHeaders={[
						{
							label: t('userManagement.stepper.option.user_details'),
						},
						{
							label: t('userManagement.stepper.option.roles_and_permissions'),
						},
						{
							label: t('userManagement.stepper.option.associate_accounts'),
						},
					]}
				/>
			</div>

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
							<p className="font-bold-title-s"> {t('userManagement.create_user.details_to_create_user')}</p>
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
