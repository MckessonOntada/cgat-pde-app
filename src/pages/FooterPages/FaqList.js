export default [
  {
    title: 'Getting Started',
    accessibleWithoutLogin: true,
    question: [
      {
        questionTitle: 'What is InspiroLink and what does it do?',
        answerSegment: [
          {
            type: 'p',
            content:
              'InspiroLink is a secure, purpose-built digital platform that supports the full lifecycle of ordering, tracking, invoicing, and payment management for cell, gene, and advanced therapies (CGATs) within the InspiroGene network. The platform enables authorized treatment site personnel to: submit and manage therapy orders; monitor real-time order status; view and manage invoices and account statements; apply available credits; and process payments.'
          }
        ]
      },
      {
        questionTitle: 'Why InspiroLink was created?',
        answerSegment: [
          {
            type: 'p',
            content:
              'InspiroLink was created to simplify how treatment centers order Cell & Gene therapies from McKesson. CGT therapies are among the most complex products in healthcare — they are patient-specific, time-sensitive, and require precise coordination across ordering, fulfillment, specialty pharmacy, and financial workflows. InspiroLink gives treatment centers a structured, auditable way to place Buy & Bill and Specialty Pharmacy orders, manage approvals, track invoices, and make payments, with the right controls and visibility built in from the start. '
          }
        ]
      },
      {
        questionTitle: 'Who should use InspiroLink?',
        answerSegment: [
          {
            type: 'p',
            content:
              'InspiroLink is intended for authorized treatment sites that have been approved to order and administer specific cell, gene, and advanced therapies. Access is granted based on a user’s role and responsibilities within their organization’s therapy program.'
          }
        ]
      },
      {
        questionTitle: 'How do I create an account?',
        answerSegment: [
          {
            type: 'p',
            content: 'User accounts are provisioned by the InspiroGene support team or your site’s administration team. To request access: '
          },
          {
            type: 'ul',
            content: [
              'Navigate to InspiroLink by McKesson (inspirolink.inspirogene.com). ',
              'Click New User',
              'Complete all required fields under Register as a New User. ',
              'Click Create Account to submit your request. '
            ]
          },
          {
            type: 'p',
            content: 'Once approved, you will receive an email to activate your account and set your password.'
          }
        ]
      },
      {
        questionTitle: 'How do I log in?',
        answerSegment: [
          {
            type: 'p',
            content: 'To login to InspiroLink: '
          },
          {
            type: 'ul',
            content: ['Navigate to the InspiroLink login page.', 'Enter your registered email address and password. ', 'Click Log In']
          },
          {
            type: 'p',
            content: 'Multi-factor authentication (MFA) is enabled. You may be prompted to complete an additional verification step to confirm your identity.'
          }
        ]
      },
      {
        questionTitle: 'I’m not able to log in using MFA email link. What should I do?',
        answerSegment: [
          {
            type: 'p',
            content: 'If you’re having trouble logging in using the “Sign In” button in the MFA email:'
          },
          {
            type: 'ul',
            content: [
              'Go to the InspiroLink login page and enter your username and password',
              'When prompted for MFA, select “Send Me an Email.” ',
              'Choose “Enter a verification code instead.”',
              'Open the MFA email, copy the verification code, and do not click the “Sign In” button in the email. ',
              'Paste the code into the InspiroLink screen and select Verify. '
            ]
          },
          {
            type: 'p',
            content: 'If you still can’t log in after trying this, contact InspiroLink Support at celgenecart@mckesson.com for assistance. '
          }
        ]
      },
      {
        questionTitle: 'What should I do if I forgot my password?',
        answerSegment: [
          { type: 'p', content: 'To reset your password: ' },
          {
            type: 'ul',
            content: [
              'Navigate to the InspiroLink login page. ',
              'Click Forgot Password. ',
              'Enter your registered email address. ',
              'Follow the instructions sent to your email. '
            ]
          },
          {
            type: 'p',
            content:
              'If you do not receive the reset email within a few minutes, check your spam or junk folder. If the issue persists, contact support at celgenecart@mckesson.com. '
          }
        ]
      },
      {
        questionTitle: 'How do I unlock my account?',
        answerSegment: [
          { type: 'p', content: 'If your account has been locked: ' },
          {
            type: 'ul',
            content: [
              'Navigate to the InspiroLink login page. ',
              'Click Unlock Account. ',
              'Enter your registered email address. ',
              'Follow the instructions sent to your email. '
            ]
          },
          { type: 'p', content: 'If you do not receive an unlock email, check your spam folder or contact your system administrator. ' }
        ]
      },
      {
        questionTitle: 'Which browsers and devices are supported?',
        answerSegment: [
          { type: 'p', content: 'InspiroLink is optimized for modern web browsers. For the best experience, use the latest version of one of the following: ' },
          {
            type: 'ul',
            content: ['Google Chrome', 'Microsoft Edge', 'Mozilla Firefox', 'Apple Safari']
          },
          {
            type: 'p',
            content:
              'The application is accessible from desktop and laptop computers. It may also be used on tablets or mobile devices via a supported browser, though a desktop experience is recommended for full functionality. '
          }
        ]
      },
      {
        questionTitle: 'Is there a mobile version of the application?',
        answerSegment: [
          {
            type: 'p',
            content:
              'InspiroLink does not have a dedicated native mobile app. However, the platform is accessible through a mobile browser on smartphones and tablets. For the most complete experience, a desktop or laptop is recommended. '
          }
        ]
      },
      {
        questionTitle: 'What should I check if I am unable to log in?',
        answerSegment: [
          { type: 'p', content: 'If you are having trouble logging in, work through the following steps: ' },
          {
            type: 'ul',
            content: [
              'Verify your credentials. Confirm you are using the correct registered email address and password. Ensure Caps Lock is not enabled, as passwords are case-sensitive. ',
              'Reset your password. Use the Forgot Password link on the login page if needed. ',
              'Confirm account activation. Ensure you have completed account setup via the invitation email. If the invitation has expired, contact your administrator to request a new activation link. ',
              'Check your account status. Your account may be locked. Use the Unlock Account option on the login page. ',
              'Verify browser compatibility. Confirm you are using a supported browser (Chrome, Edge, Firefox, or Safari). Try clearing your browser cache and cookies, or use a different browser. ',
              'Review network or security settings. Your organization’s VPN, firewall, or network restrictions may be blocking access. Contact your IT team if you suspect this is the case. '
            ]
          },
          {
            type: 'p',
            content: 'If the issue remains unresolved, contact InspiroLink support at celgenecart@mckesson.com. '
          }
        ]
      }
    ]
  },
  {
    title: 'Orders & Basic Usage',
    accessibleWithoutLogin: false,
    question: [
      {
        questionTitle: 'How do I navigate the Orders Dashboard?',
        answerSegment: [
          {
            type: 'p',
            content:
              'The Orders Dashboard provides a centralized view of all orders associated with your site. Orders are organized by status to help you quickly identify what requires attention. '
          },
          { type: 'p', content: 'Order statuses are defined as follows: ' },
          {
            type: 'ul',
            content: [
              'Pending Submission — Order is saved as a draft and has not yet been submitted. ',
              'Pending Approval — Order has been submitted and is awaiting authorization from your site’s designated Approver (if configured). ',
              'CS Review — Order is under review by InspiroLink Customer Service. ',
              'Submitted — Order has been verified and submitted for fulfillment. ',
              'Verified — Order has been accepted by the manufacturer and a McKesson PO number has been generated. ',
              'Cancelled — Order has been cancelled by the treatment site, site approver, or customer service. '
            ]
          }
        ]
      },
      {
        questionTitle: 'How do I place a new order?',
        answerSegment: [
          {
            type: 'p',
            content: 'Login into InspiroLink, Click on ‘Orders’ tab in the top navigation, Click on ‘Create new Order’.'
          },
          {
            type: 'p',
            content: 'Ensure you have reviewed the therapy-specific addendum before submitting an order, as requirements may vary by therapy.'
          }
        ]
      },
      {
        questionTitle: 'Can I save a draft order and complete it later?',
        answerSegment: [
          {
            type: 'p',
            content:
              'Yes. Orders can be saved in draft format at any point during the ordering process. Draft orders appear under the Pending Submission section of the Orders Dashboard and can be accessed, edited, and submitted at any time. '
          }
        ]
      },
      {
        questionTitle: 'How do I edit or update an existing order?',
        answerSegment: [
          {
            type: 'p',
            content:
              'Orders in Pending Submission status can be edited or updated at any time before submission. Once an order has been submitted, edits are no longer available. To make changes to an order, contact customer service at celgenecart@mckesson.com. '
          }
        ]
      },
      {
        questionTitle: 'How do I cancel an order?',
        answerSegment: [
          { type: 'p', content: 'Cancellation options depend on the current status of the order: ' },
          {
            type: 'ul',
            content: [
              'Pending Submission — Orders can be cancelled directly by the user at any time. ',
              'CS Review — Orders can be cancelled by the treatment site or by requesting cancellation through a Customer Service agent. ',
              'Submitted — Cancellation requires contacting a Customer Service agent directly. '
            ]
          },
          {
            type: 'p',
            content: 'For time-sensitive cancellations, contact InspiroLink support immediately at celgenecart@mckesson.com.'
          }
        ]
      },
      {
        questionTitle: 'How do I search for an order?',
        answerSegment: [
          {
            type: 'p',
            content: 'Use the search bar within the Orders Dashboard to locate an order. You can search by Order ID, Patient Name, or Therapy'
          }
        ]
      },
      {
        questionTitle: 'What do warning messages mean when placing an order?',
        answerSegment: [
          {
            type: 'p',
            content: 'Warning messages indicate non-critical validation issues that do not necessarily prevent submission. Common reasons include: '
          },
          {
            type: 'ul',
            content: [
              'Potential duplicate order — The system has detected a possible duplicate based on existing order data. ',
              'Non-standard patient identifier format — The patient information entered may not match expected formats. '
            ]
          },
          {
            type: 'p',
            content:
              'In most cases, orders with warnings can still be submitted. A Customer Service representative may follow up to confirm details before the order is finalized. '
          }
        ]
      },
      {
        questionTitle: 'How do I handle a duplicate order submission?',
        answerSegment: [
          {
            type: 'p',
            content: 'Before submission: If you identify a duplicate while drafting, delete the draft or cancel the order before submitting. '
          },
          {
            type: 'p',
            content: 'After submission: Contact your McKesson Customer Service at celgenecart@mckesson.com to request cancellation of the duplicate order. '
          }
        ]
      },
      {
        questionTitle: 'What should I verify if my site is unable to place an order?',
        answerSegment: [
          {
            type: 'p',
            content: 'If your site is unable to place an order, verify the following:'
          },
          {
            type: 'ul',
            content: [
              'Site Status — Confirm your site is approved and activated for the specific therapy being ordered. ',
              'User Role — Verify that your user role includes order submission permissions. ',
              'Form Completion — Ensure all required fields (marked with an asterisk) are fully completed. ',
              'Order Quantity — Confirm the order quantity complies with any therapy- or site-specific restrictions. ',
              'System Messages — Review any error or warning messages displayed on the screen. '
            ]
          },
          {
            type: 'p',
            content: 'If the issue persists, contact support at celgenecart@mckesson.com.'
          }
        ]
      },
      {
        questionTitle: 'How do I customize my notification preferences?',
        answerSegment: [
          {
            type: 'p',
            content: 'To manage notification settings: '
          },
          {
            type: 'ul',
            content: [
              'Log in to InspiroLink. ',
              'Navigate to the Account Settings section. ',
              'Select Notification Settings. ',
              'Click Save to apply your changes. '
            ]
          },
          {
            type: 'p',
            content:
              'Please note that some settings can only be modified by an organization administrator. If you require changes to these settings, please contact your organization administrator or support at celgenecart@mckesson.com. '
          }
        ]
      }
    ]
  },
  {
    title: 'Invoices & Payments',
    accessibleWithoutLogin: false,
    question: [
      {
        questionTitle: 'How do I view outstanding invoices?',
        answerSegment: [
          {
            type: 'p',
            content:
              'Navigate to the Invoices & Payments Dashboard. This view provides a summary of outstanding balances, monthly account statements, and any available credits that can be applied toward payments. Refer to the Invoices and Payments Dashboard section of the InspiroLink End User Guide for detailed instructions. '
          }
        ]
      },
      {
        questionTitle: 'How do I view available credits?',
        answerSegment: [
          {
            type: 'p',
            content:
              'Available credits are displayed within the Invoices & Payments Dashboard alongside your outstanding balances and account statements. Credits can be applied directly when processing a payment. '
          }
        ]
      },
      {
        questionTitle: 'What payment methods and scheduling options are available?',
        answerSegment: [
          {
            type: 'p',
            content: 'InspiroLink supports ACH (electronic bank transfer) payments. When scheduling a payment, users can choose from the following options: '
          },
          {
            type: 'ul',
            content: [
              'Pay Today — Submit an immediate payment. ',
              'Pay on Due Date — Schedule payment to be processed automatically on the invoice due date. ',
              'Pay on Specific Date — Select a custom future date for payment processing. '
            ]
          }
        ]
      },
      {
        questionTitle: 'How do I dispute an invoice amount?',
        answerSegment: [
          {
            type: 'p',
            content:
              'If you believe an invoice contains an error, contact your McKesson Customer Service representative at celgenecart@mckesson.com with the following information: '
          },
          {
            type: 'ul',
            content: ['Invoice number and date ', 'The specific line item(s) in question ', 'A brief description of the discrepancy ']
          },
          {
            type: 'p',
            content: 'A representative will review your concern and respond with next steps. Timely notification helps ensure prompt resolution. '
          }
        ]
      },
      {
        questionTitle: 'How do I download or export an invoice?',
        answerSegment: [
          {
            type: 'p',
            content:
              'Invoices can be viewed and downloaded directly from the Invoices & Payments Dashboard. Select the relevant invoice to open it, then use the available export or download option. '
          }
        ]
      }
    ]
  },
  {
    title: 'Permissions & User Management',
    accessibleWithoutLogin: false,
    question: [
      {
        questionTitle: 'How are user roles and permissions are managed?',
        answerSegment: [
          {
            type: 'p',
            content:
              'InspiroLink uses role-based access control (RBAC) to manage what each user can see and do within the platform. Each user is assigned a role that determines their ability to place orders, view orders, access invoices, make payments, and manage other users within their organization. '
          }
        ]
      },
      {
        questionTitle: 'How do administrators add a new user?',
        answerSegment: [
          { type: 'p', content: 'To add a new user: ' },
          {
            type: 'ul',
            content: [
              'Login to InspiroLink with administrator privileges. ',
              'Navigate to the Admin section. ',
              'Select Manage Users. ',
              'Click Add User. ',
              'Enter the required user details. ',
              'Assign the appropriate user role and permissions. ',
              'Assign the relevant Ship-to and Sold-to accounts. ',
              'Assign applicable therapy materials. ',
              'Click Add User to complete the process. '
            ]
          },
          {
            type: 'p',
            content: 'The new user will receive an email invitation to activate their account and set a password. '
          }
        ]
      },
      {
        questionTitle: 'How do administrators deactivate a user? ',
        answerSegment: [
          {
            type: 'p',
            content: 'To deactivate a user: '
          },
          {
            type: 'p',
            content: [
              'Log in to InspiroLink as an administrator. ',
              'Navigate to the Admin section. ',
              'Locate the user in the user list. ',
              'Select the user’s profile. ',
              'Toggle the Active status to deactivate the user. ',
              'Confirm the action. '
            ]
          },
          {
            type: 'p',
            content: 'Deactivating a user immediately revokes their system access while preserving all historical data and records. '
          }
        ]
      },
      {
        questionTitle: 'How do I request a change to my user role?',
        answerSegment: [
          {
            type: 'p',
            content: 'User roles can only be modified by a system administrator. To request a change: '
          },
          {
            type: 'ul',
            content: ['Contact your InspiroLink administrator or program manager. ', 'Provide the reason for the role change and the access level required. ']
          },
          {
            type: 'p',
            content: 'Updated permissions take effect the next time you login. '
          }
        ]
      },
      {
        questionTitle: 'What is the difference between a Ship-to and Sold-to account?',
        answerSegment: [
          {
            type: 'p',
            content:
              'A Sold-to account represents the billing entity responsible for payment — typically the treatment site or organization. A Ship-to account represents the physical delivery address where therapy products are shipped. A single Sold-to account may be associated with multiple Ship-to locations. '
          }
        ]
      }
    ]
  },
  {
    title: 'Data & Security',
    accessibleWithoutLogin: false,
    question: [
      {
        questionTitle: 'How is my data stored and protected? ',
        answerSegment: [
          {
            type: 'p',
            content:
              'All data in InspiroLink is stored in secure, access-controlled systems built to protect sensitive patient and organizational information. The platform adheres to established data protection practices and uses secure infrastructure to safeguard all information entered within the system. '
          }
        ]
      },
      {
        questionTitle: 'Is InspiroLink a secure application?',
        answerSegment: [
          { type: 'p', content: 'Yes. InspiroLink is designed with multiple layers of security, including:' },
          {
            type: 'ul',
            content: [
              'Secure user authentication and multi-factor authentication (MFA) ',
              'Role-based permissions that restrict access to authorized users only ',
              'Continuous monitoring and security safeguards to protect system access '
            ]
          }
        ]
      },
      {
        questionTitle: 'Who can see my data?',
        answerSegment: [
          {
            type: 'p',
            content:
              'Access to data within InspiroLink is restricted to authorized treatment site users based on assigned roles and permissions. Users can only view data associated with their organization and accounts. InspiroLink administrators and McKesson support staff may access data as necessary to provide support. '
          }
        ]
      },
      {
        questionTitle: 'Can deleted or lost data be recovered?',
        answerSegment: [
          {
            type: 'p',
            content:
              'Data entered into InspiroLink is not permanently deleted. If information is removed or modified unintentionally, contact support at celgenecart@mckesson.com. '
          }
        ]
      },
      {
        questionTitle: ' Is patient data handled in compliance with HIPAA? ',
        answerSegment: [
          {
            type: 'p',
            content:
              'InspiroLink is designed to support treatment sites in managing therapy orders in a secure environment. For specific questions regarding HIPAA compliance, data handling agreements, or Business Associate Agreements (BAAs), please contact InspiroLink support at celgenecart@mckesson.com. '
          }
        ]
      }
    ]
  },
  {
    title: 'Updates & Release Management',
    accessibleWithoutLogin: false,
    question: [
      {
        questionTitle: 'How often is InspiroLink updated? ',
        answerSegment: [
          {
            type: 'p',
            content:
              'InspiroLink is updated periodically throughout the year to introduce new features, improve performance, and address security or functionality enhancements. '
          }
        ]
      },
      {
        questionTitle: 'Will system updates affect my data?',
        answerSegment: [
          {
            type: 'p',
            content:
              'No. System updates are designed to preserve all existing data and records. Your orders, invoices, payment history, and account information will remain intact following any update. '
          }
        ]
      },
      {
        questionTitle: 'Will I be notified before an update occurs? ',
        answerSegment: [
          {
            type: 'p',
            content:
              'For updates that may affect platform availability or require user awareness, notifications will be communicated via email to registered users or through announcements within the InspiroLink platform. Most routine updates are applied in the background and require no action from users.  '
          }
        ]
      },
      {
        questionTitle: 'Where can I view release notes?',
        answerSegment: [
          {
            type: 'p',
            content:
              'Release notes summarizing new features, improvements, and important changes are shared via email and through the InspiroLink support or resource section within the platform. '
          }
        ]
      },
      {
        questionTitle: 'Do I need to update my browser or device?',
        answerSegment: [
          {
            type: 'p',
            content:
              'No device action is required. However, keeping your web browser updated to the latest version of a supported browser (Chrome, Edge, Safari, or Firefox) ensures optimal performance and security. '
          }
        ]
      }
    ]
  },
  {
    title: 'Training & Documentation',
    accessibleWithoutLogin: false,
    question: [
      {
        questionTitle: 'Are there therapy-specific requirements I should be aware of? ',
        answerSegment: [
          {
            type: 'p',
            content:
              'Yes. A therapy-specific addendum is created for each therapy onboarded to InspiroLink. Users are required to review the applicable addendum before placing an order to ensure all therapy-specific requirements are met. To get access to the therapy specific addendum, Please contact your designated ATC account director or the InspiroLink support team at celgenecart@mckesson.com '
          }
        ]
      },
      {
        questionTitle: 'Who should I contact if I need additional training or onboarding support? ',
        answerSegment: [
          {
            type: 'p',
            content:
              'For onboarding support or training requests, contact your designated ATC account director or the InspiroLink support team at celgenecart@mckesson.com. '
          }
        ]
      }
    ]
  },
  {
    title: 'Support',
    accessibleWithoutLogin: true,
    question: [
      {
        questionTitle: 'How do I contact InspiroLink support? ',
        answerSegment: [
          {
            type: 'p',
            content: 'For assistance, contact the InspiroLink support team: '
          },
          {
            type: 'p',
            content: 'Email: celgenecart@mckesson.com  '
          },
          {
            type: 'p',
            content:
              'When contacting support, please include your site name, a description of the issue, and any relevant order or invoice numbers to help expedite your request. '
          }
        ]
      },
      {
        questionTitle: 'What information should I have ready when contacting support? ',
        answerSegment: [
          {
            type: 'p',
            content: 'To help the support team assist you efficiently, have the following information available: '
          },
          {
            type: 'ul',
            content: [
              'Your registered email address and site name ',
              'A clear description of the issue or question ',
              'Relevant order ID(s), invoice number(s), or patient identifiers (as applicable) ',
              'The browser and device you are using ',
              'Any error messages or screenshots, if available '
            ]
          }
        ]
      }
    ]
  }
];
