import React, { useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import './CreateUser.scss';
import { Button, Stepper } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import UserDetailsFormSegment from './CreateUserForm';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { PATHS } from "../../routes/constants";
import ModuleHeader from '@src/components/module-header';
import { useQuery, useMutation } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/common/util/ApiUtils';
import AuthUtils from '@src/common/util/AuthUtils';

const CreateUser = () => {
	const { t } = useTranslate();
	const navigate = useNavigate();
	const { userId } = useParams();
	const location = useLocation();
	const { isEdit } = location.state || {};
	const { isPending } = location.state || {};
	// Fetch user data based on userId 
	//const userData = USER_DATA.find(user => user.id === parseInt(userId));

	const requestParams = {
		userType: AuthUtils.getUserRole() === 'SYSTEM_ADMIN' ? 'ADMIN' : 'GENERAL'
	};
	const practiceId = AuthUtils.getPracticeId() ? 1 : AuthUtils.getPracticeId();

	const { isLoading: isGetUserdetails, isError: isGetUserError, data: userData } = useQuery({
		queryKey: [`users/${userId}`],
		queryFn: async () => {
			const res = await HttpResourceService.callRest(
				`${ApiRoutes.USERS()}/${userId}?${serializeParams(requestParams)}`, // Use practice id from organization
				httpVerb.GET,
				{}
			);
			//userData = res.data;
			return res.data;
		},
		refetchOnWindowFocus: false
	});


	const { mutate, isLoading, isError, data } = useMutation(async ({ payload }) => {
		if (isEdit) {
			const res = await HttpResourceService.callRest(
				`${ApiRoutes.USERS()}/${userId}?${serializeParams(requestParams)}`,
				httpVerb.PUT,
				payload
			);
			return res.data;
		} else {
			const res = await HttpResourceService.callRest(
				`${ApiRoutes.USERS()}?${serializeParams(requestParams)}`,
				httpVerb.POST,
				payload
			);
			return res.data;
		}
	});

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
			email: userData?.contact?.email || '',
			phone: userData?.contact?.phone || '',
			countryCode: "91",
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
				.matches(/^[A-Za-z]+$/, t('userManagement.create_user.validation.middle_name')).nullable(),
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

	const handleRejectRequest = () => {
		navigate(-1);
	};


	const handleSubmit = values => {
		const payload = {
			practiceId, // Append the practiceId
			...values, // Spread the existing form values
			"isActive": true
		};

		mutate(
			{
				payload
			},
			{
				onSuccess: (response) => {
					console.log('User created/updated successfully:', response);
					navigate(isEdit ? -1 : `../${PATHS.userPermissions}/${response.id || userId}`);
				},
				onError: (error) => {
					console.log('Failed to create/update user:', error);
					alert('An error occurred. Please try again.');
				},
			}
		);
		if (isLoading) {
			console.log('Submitting user...');
		}

		if (isError) {
			console.log('Error occurred while submitting the user');
		}

		if (data) {
			console.log('Submission successful:', data);
			navigate(isEdit ? -1 : `../${PATHS.userPermissions}/${data.id || userId}`);
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
							{isPending && <Button variant="secondary" type="button" onClick={handleRejectRequest} size={'md'}>
								{t('userManagement.button.rejectrequest')}
							</Button>}
							<Button type="submit" size={'md'}>{t('userManagement.button.savencontinue')}</Button>

						</div>
					</Form>)
				}
			</Formik>
		</div>
	);
};

export default CreateUser;
export { UserDetailsFormSegment };
