import React from 'react';
import { Heading } from '@mckesson/mcp-component-library';
import mainLayoutStyles from '@src/assets/styles/MainLayout.module.scss';
import PrimaryHeader from '@src/components/header/PrimaryHeader';
import style from './Footer.module.scss';
import { ReactComponent as McKessonLogo } from '@src/assets/svg/InspiroLink.svg';
import { Link } from 'react-router-dom';
const PrivacyNotice = () => {
  return (
    <div className={mainLayoutStyles.appContainer}>
      <PrimaryHeader />
      <div className={`${mainLayoutStyles['app-wrapper']}`}>
        <div className={`${mainLayoutStyles.home} max-container`}>
          <div className="MCP-module-wrapper">
            <div className="MCP-panel-container">
              <div className={style.contantHeading}>
                <McKessonLogo aria-hidden="true" focusable="false" title={'company.logoAltText'} />
                <Heading as="h1">
                  Privacy Notice - InspiroLink
                  <br />
                  Ordering Platform
                </Heading>
                <Heading as="h3">Effective Date: July 8, 2025</Heading>
                <Link to={'/privacy-notice-for-state-specific-privacy-laws'}>View state-specific privacy rights HERE</Link>
              </div>
              <div className={style.contentWrapper}>
                <div>
                  <p>
                    At Pharmaceutical Solutions and Services (“PSAS”, “McKesson”, “our”, “us”, or “we”), we value the trust that employees, customers, and
                    pharmaceutical or drug manufacturers place in us to use and protect personal information. This Privacy Notice informs you how we will use,
                    share and protect your personal information. When you use the InspiroLink Ordering Platform or provide personal information, you accept the
                    privacy practices described in this Privacy Notice. Please read this Privacy Notice in full to understand our privacy practices before you
                    use our Portal or submit any personal information. You are also encouraged to access our supplemental privacy notice linked above titled,
                    “view state-specific privacy rights HERE” that is applicable in specific situations.
                  </p>
                </div>
                <div>
                  <Heading as="h3">Scope</Heading>
                  <p>
                    This Privacy Notice applies to our use of personal information we collect when your use our Portal{' '}
                    <a href="https://www.inspirolink.inspirogene.com" target="_blank" rel="noopener noreferrer">
                      https://www.inspirolink.inspirogene.com
                    </a>{' '}
                    or in the ordinary course of business. The Privacy Notice does not apply to:
                    <ul>
                      <li>Individual health providers and practices who have separate privacy notices or Notice of Privacy Practices.</li>
                      <li>
                        McKesson affiliates and subsidiaries that may have separate websites, subdomains, and applications through other web, mobile, cloud or
                        SaaS platforms which are not subject to this Privacy Notice.
                      </li>
                      <li>
                        McKesson business partners, ad networks and other third parties that may have their own websites and services with separate privacy
                        notices.
                      </li>
                    </ul>
                    <p>
                      We encourage you to read the privacy notices of all websites and applications that you visit so that you understand their privacy
                      practices.
                    </p>
                  </p>
                </div>
                <div>
                  <Heading as="h3">Personal Information We Collect</Heading>
                  <p>
                    When you use our Portal, we may collect personal information about you. The personal information we may collect includes, but is not limited
                    to:
                    <ul>
                      <li>Name </li>
                      <li>Phone number (office, cell, fax, etc.)</li>
                      <li>Date of birth</li>
                      <li>Gender</li>
                      <li>Business telephone number (office, cell, fax, etc.)</li>
                      <li>Business electronic mail address</li>
                      <li>Business address</li>
                      <li>Manufacturer Patient ID</li>
                      <li>Insurance Details</li>
                      <li>ICD codes</li>
                      <li>User ID and password</li>
                      <li>IP address</li>
                      <li>User’s browser type</li>
                      <li>User’s operating system</li>
                      <li>Information directly related to your order</li>
                      <li>
                        Information you provide directly to us:
                        <ul>
                          <li>When you use the Portal and Ordering Platform.</li>
                          <li>When you use offline features related to our Ordering Platform, such as communicating with us by phone, e-mail, or in person.</li>
                          <li>When you interact with us in the ordinary course of business.</li>
                        </ul>
                      </li>
                    </ul>
                    Personal information may be combined with information that does not identify you. If we combine information that does not identify you with
                    your personal information, it will be treated as personal information.
                  </p>
                </div>
                <div>
                  <Heading as="h3">Tracking Technologies We Use</Heading>
                  <p>
                    We and our subsidiaries, business partners, marketing partners, affiliates or other service provides may use various technologies to collect
                    personal information including:
                    <ul>
                      <li>Third party software codes, such as SDKS, open source or other embedded API.</li>
                      <li>
                        Local storage such as HTML5 to store content information and preferences. Our third-party partners who provide certain features or
                        display advertising on our site may do the same.
                      </li>
                      <li>Server logs, tags, and scripts to track our website traffic. </li>
                    </ul>
                    These tracking technologies are used for analytics purposes. When the tracking information we collect is considered individually
                    identifiable information, the data is treated as Protected Health Information (''PHI'') which is defined in the Health Insurance Portability
                    and Accountability Act (''HIPAA''). We will use and disclosure this information as required by HIPAA’s Privacy and Security Rule.
                  </p>
                </div>
                <div>
                  <Heading as="h3">How We Use the Personal Information Collected</Heading>
                  <p>
                    We may use the personal information we collect for purposes such as:
                    <ul>
                      <li>To facilitate order(s) via customized workflows</li>
                      <li>Scheduling orders.</li>
                      <li>Tracking and facilitating orders</li>
                      <li>Collecting Payments</li>
                      <li>
                        Part of a Corporate Transaction, such as in connection with the sale of part or all our assets or business, the acquisition of part or
                        all of another business or another corporate transaction, including bankruptcy.
                      </li>
                    </ul>
                  </p>
                </div>
                <div>
                  <Heading as="h3">How We Share Personal Information Collected</Heading>
                  <p>
                    We may provide your personal information to third parties that provide services to help us with our business activities. These companies are
                    authorized to use personal information about you only as necessary to provide these services to us.
                    <br />
                    We may need to share information with other companies, organizations or individuals if we have a good faith belief that access, use,
                    preservation, or disclosure of that information is reasonably necessary to:
                    <ul>
                      <li>Meet applicable laws, regulations, legal processes, or enforceable governmental requests</li>
                      <li>Enforce applicable Terms of Service, including investigation of potential violations</li>
                      <li>Detect, prevent, or otherwise address fraud, security or technical issues</li>
                      <li>Protect against harm to the rights, property or safety of our users, McKesson, or the public as required or permitted by law</li>
                      <li>Engage in a merger, acquisition, reorganization, or sale of all or a portion of McKesson assets.</li>
                    </ul>
                  </p>
                </div>
                <div>
                  <Heading as="h3">Your Choices</Heading>
                  <p>
                    You can limit the personal information we have by choosing not to provide it within our Portal or by failing to provide information through
                    any offline features or in the ordinary course of business. Depending on where you live, you may have certain rights with respect to your
                    personal information under applicable data protection laws. You may assert those rights by clicking on the “view state privacy rights HERE”
                    link located at the top of this notice underneath the effective date. which can be
                  </p>
                  <p>
                    <Heading as="h4">Access to Personal Information</Heading>
                    Our Portal allows you to directly view and edit information about you through the Portal’s user profile page. Should you need to change
                    anything please contact us at <a href="mailto:Privacy@McKesson.com">Privacy@McKesson.com</a>.
                  </p>
                  <p>
                    <Heading as="h4">Retention</Heading>
                    We will retain your personal information as long as you use our Portal, your account is active, as necessary to comply with our legal
                    obligations, resolve disputes or enforce our agreements.
                  </p>
                </div>
                <div>
                  <Heading as="h3">Children’s Privacy</Heading>
                  <p>
                    We do not knowingly collect of solicit any personal information from children, as defined under applicable law, without verified written
                    parental consent, and we have no actual knowledge of selling such personal information of minors under 18 years of age. If we learn that we
                    have collected personal information from a child, we will promptly take steps to delete that information. If you believe we might have any
                    information from or about a child, please refer to the Contact Information section below.
                  </p>
                </div>
                <div>
                  <p>
                    <Heading as="h3">How We Protect Your Information</Heading>
                    We protect the information we collect with proper physical, electronic and administrative safeguards. We only allow our employees,
                    contractors, and agents to access personal information if they need access to perform services on our behalf. They are also subject to
                    confidentiality obligations.
                    <br />
                    Any sensitive personal information (e.g., credit card information) is transmitted in an encrypted form using SSL encryption. Even though we
                    have security safeguards, it is impossible to guarantee 100% security. If you have any questions about security or believe that your
                    interactions with us are no longer secure (for example, you feel that your account with us has been compromised), you must notify us
                    immediately by email at <a href="mailto:Privacy@McKesson.com">Privacy@McKesson.com</a>.
                  </p>
                  <p>
                    <Heading as="h4">International Use and Cross-Border Data Transfers</Heading>
                    If you are visiting our site from outside of the United States, please note that our site is hosted in the United States. Where permitted by
                    applicable law, we may transfer the personal data we collect about you to the United States and other jurisdictions that may not be deemed
                    to provide the same level of data protection as your home country, as necessary for the purposes set out in this notice. For individuals in
                    the European Union, European Economic Area, Switzerland, and United Kingdom: We will only transfer Personal Data to third parties located
                    outside of this region when it has ensured appropriate safeguards for such Personal Information through use of the standard contractual
                    clauses or other lawful and approved methods. To request a copy of applicable cross-border data transfer agreements, please reach out to us.
                  </p>
                </div>
                <div>
                  <Heading as="h3">Changes to this Privacy Notice </Heading>
                  <p>
                    We may update this Privacy Notice from time to time. Updates may describe new features, products or services. Updates may also describe
                    changes in how we use your personal information or to your controls. We will not apply changes to this Privacy Notice retroactively to
                    personal information we have previously collected. Since we may make changes, we recommend that you read the current version of this Privacy
                    Notice from time to time. If we change this notice, we will update the “Effective Date” at the beginning of this notice.
                  </p>
                </div>
                <div>
                  <Heading as="h3">Contact Information</Heading>
                  <p>
                    If you have questions or concerns about this Privacy Notice, our information handling practices, or any other aspect of privacy and security
                    of your personal information, please contact us at <a href="mailto:Privacy@McKesson.com">Privacy@McKesson.com</a>.
                    <br />
                    You may also write to us at:
                    <br />
                    McKesson Corporation
                    <br />
                    ATTN: Privacy Officer (Privacy Notice, InspiroLink Ordering Plaform)
                    <br />2 National Data Plaza NE, 3rd Floor
                    <br /> Atlanta, GA 30329
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyNotice;
