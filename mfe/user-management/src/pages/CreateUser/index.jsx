import React from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import "./CreateUser.scss";
import { Button } from "@mfe/ui-components";
import Components from "../../components/form/Components";
import { Card,Stepper } from "@mfe/ui-components";
import { useTranslation } from "react-i18next";

const CreateUser = () => {
  const { t } = useTranslation();

  const initialValues = {
    first_name: "",
    middle_name: "",
    last_name: "",
    address_1: "",
    address_2: "",
    city: "",
    zip: "",
    state: "",
    email: "",
    phoneInput: "",
    fax: "",
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required(t("first_name_required")),
    middle_name: Yup.string().required(t("middle_name_required")),
    last_name: Yup.string().required(t("last_name_required")),
    address_1: Yup.string().required(t("address_1_required")),
    address_2: Yup.string(),
    city: Yup.string().required(t("city_required")),
    zip: Yup.string().required(t("zip_required")),
    state: Yup.string().required(t("state_required")),
    email: Yup.string().email(t("invalid_email")).required(t("email_required")),
    phoneInput: Yup.string()
      .matches(/^[0-9]{10}$/, t("phone_no_required"))
      .required(t("phone_no_required")),
    fax: Yup.string().required(t("fax_required")),
  });

  const handleSubmit = (values) => {
    alert(JSON.stringify(values, null, 2));
    console.log(JSON.stringify(values, null, 2));
  };

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
    <div className="userContainer" >
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
            <Card
              bodyContent={
                <div>
                  <div className="line-height">
                    <Stepper 
                      activeIndex={1}
                      dividerText="of" 
                      stepHeaders={[
                        {
                          label: 'User Details'
                        },
                        {
                          label: 'Roles and Permissions'
                        },
                        {
                          label: 'Associate Accounts'
                        }
                      ]}
                    />
                  </div>
                  <div className="headingBox">
                    <p className="font-bold-title-m"> {t("details_to_create_user")}</p>
                  </div>
                  <div className="headingBox">
                    <p className="font-bold-title-s">{t("personal_details")}</p>
                    <p> <span className="requiredIcon">✱</span>{t("required")}</p>
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
                    <p className="font-bold-title-s">{t("contact_details")}</p>
                    {/* <p>{t("required")}</p> */}
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
                      label={t("phone_no") }
                      component={Components["phoneInput"]}
                      className={"phoneInput"}
                      placeholder=""
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
              }
            />
            <div className={"buttonGroup"}>
              <Button
                variant="secondary"
                type="button"
                onClick={() => console.log("go back")}
              >
                {t("back")}
              </Button>
              <Button type="submit">{t("next")}</Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateUser;
