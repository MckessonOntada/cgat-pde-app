import React from 'react';
import ModuleHeader from '@src/components/module-header';
import { Required, Button } from '@mckesson/mcp-component-library';
import Components from '@src/components/form/Components';
import { Field, Formik, Form } from 'formik';

const RoleDetailsForm = () => {
    return (
        <div className='MCP-module-wrapper'>
            <div className="MCP-panel-container">
                <ModuleHeader
                    heading="Permission Details"
                    variant={"l2"}
                >
                    <p>
                        <Required /> Required
                    </p>
                </ModuleHeader>

                <div>
                    <Formik
                        initialValues={{}}
                        onSubmit={(values, actions) => {
                        }}
                        validateOnChange={false}
                        validateOnBlur={true}>
                        {({ values }) => (
                            <Form>
                                <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                                    <Field
                                        name="name"
                                        label={"Role Name"}
                                        placeholder=" "
                                        isRequired
                                        component={Components['input']}
                                    />
                                </div>
                                <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1">
                                    <Field
                                        name="description"
                                        label={'Role Derscription'}
                                        placeholder=" "
                                        isRequired
                                        maxCharHelperText="Maximum 1,000 Characters"
                                        component={Components['textarea']}
                                    />
                                </div>
                            </Form>)}
                    </Formik>
                </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px'}}>
                <Button size="md" variant="secondary">Cancel</Button>
                <Button size="md" variant="primary">Save And Continue</Button>
            </div>
        </div>
    )
}

export default RoleDetailsForm;