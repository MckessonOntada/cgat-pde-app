import React from 'react';
import { Heading } from '@mckesson/mcp-component-library';
import mainLayoutStyles from '@src/assets/styles/MainLayout.module.scss';
import PrimaryHeader from '@src/components/header/PrimaryHeader';
import style from './Footer.module.scss';
import { ReactComponent as McKessonLogo } from '@src/assets/svg/InspiroLink.svg';
import { Link } from 'react-router-dom';
import Footer from '@src/components/footer';
const TermsOfUse = () => {
  return (
    <div className={mainLayoutStyles.appContainer}>
      <PrimaryHeader />
      <div className={`${mainLayoutStyles['app-wrapper']}`}>
        <div className={`${mainLayoutStyles.home} max-container`}>
          <div className="MCP-module-wrapper">
            <div className="MCP-panel-container">
              <div className={style.contantHeading}>
                <McKessonLogo aria-hidden="true" focusable="false" title={'company.logoAltText'} />
                <Heading as="h1">InspiroLink Terms of Use </Heading>
                <Heading as="h3">Last Updated: July 22, 2025 </Heading>
              </div>
              <div className={style.contentWrapper}>
                <div>
                  <Heading as="h3">1. Introduction and Acceptance</Heading>
                  <p>
                    The InspiroLink platform (the Site) is provided by McKesson Cell, Gene, and Advanced Therapy Solutions LLC dba InspiroGene by McKesson and
                    its affiliates (collectively, “InspiroGene,” “we,” “us,” or “our”). These Terms of Use (the “Terms of Use”) are entered into by and between
                    you (“you” or “your”) and InspiroGene and govern your access to and use of the Site, and any sites we have now or in the future that
                    reference these Terms of Use. This Site is the property of InspiroGene and its licensors.
                  </p>
                  <p>
                    PLEASE READ CAREFULLY AND ENSURE YOU UNDERSTAND THESE TERMS OF USE AND INSPIROGENE'S <Link to="/privacy-notice">PRIVACY NOTICE</Link> BEFORE
                    ACCESSING OR USING THIS SITE. BY ACCESSING OR USING THIS SITE, YOU ACCEPT AND AGREE TO THESE TERMS OF USE AND TO OUR PRIVACY NOTICE, WHICH
                    IS MADE A PART OF THESE TERMS OF USE BY THIS REFERENCE. IF YOU DO NOT AGREE TO THESE TERMS OF USE AND THE PRIVACY NOTICE , YOU MUST NOT
                    ACCESS OR USE THIS SITE.
                  </p>
                  <p>
                    You understand and agree that through the use of this Site, we may access, store, process and use any information and personal data that you
                    provide in accordance with the terms of our Privacy Notice. If you are an individual accessing or using this Site on behalf of, or for the
                    benefit of any, corporation, partnership, or other entity with which you are associated (an ”organization”), then you are agreeing to these
                    Terms of Use on behalf of yourself and such organization, and you represent and warrant that you have the legal authority to bind such
                    organization to these Terms of Use. References to ”you” and ”your” in these Terms of Use will refer to both the individual using this Site
                    and to any such organization.
                  </p>
                </div>
                <div>
                  <Heading as="h3">2. Age Restriction</Heading>
                  <p>
                    By accessing and using this Site, you affirm that you are of legal age and fully able and competent to enter into and comply with these
                    Terms of Use.
                  </p>
                </div>
                <div>
                  <Heading as="h3">3. Access and Use</Heading>
                  <p>
                    InspiroLink is offered to customers of InspiroLink and its affiliates for legitimate business purposes.  You may access and use this Site
                    and entire contents , text, data, databases, graphics, sound recordings, visual clips, trademarks, service marks, trade dress, trade names,
                    logos, services, features, and functionality (including but not limited to all information, materials, information, software, systems, text,
                    displays, images, video, and audio, and the design selection, and arrangement thereof) (collectively, “Content”) only for your personal and
                    non-commercial use and for lawful purposes. You agree that you will comply with all applicable local, state, national and international
                    laws, including, without limitation, privacy laws (including HIPAA), intellectual property laws, anti-spam laws, export control laws, tax
                    laws, antitrust laws and regulatory requirements. In addition, you agree that you will not:
                  </p>
                  <ul>
                    <li>
                      Use any “robot”, “spider”, “deep-link”, “page scrape” site search/retrieval application or other manual or automatic device to access,
                      copy, retrieve, index, scrape, circumvent, reproduce, data mine or monitor any portion of this Site or otherwise gather Content from this
                      Site.
                    </li>
                    <li>Probe, scan or test the vulnerability of this Site or any network connected to this Site</li>
                    <li>Interfere with, restrict or otherwise disrupt another user's use and enjoyment of this Site.</li>
                    <li>
                      Interfere with or disrupt the operation of this Site or the servers or networks used to make this Site available, including by hacking or
                      defacing any portion of this Site; or violate any requirement, procedure or policy of such servers or networks.
                    </li>
                    <li>
                      Reproduce, modify, adapt, translate, create derivative works of, sell, rent, lease, loan, timeshare, distribute or otherwise exploit any
                      portion of (or any use of) this Site, except as expressly authorized herein.
                    </li>
                    <li>
                      Transmit or otherwise make available through or in connection with this Site any virus, worm, Trojan horse, Easter egg, time bomb,
                      cancelbots, adware, malware, spyware or other computer code, file or program that is or is potentially harmful or invasive or intended to
                      damage or hijack the operation of, or to monitor the use of any hardware, software, system, data, or personal information
                    </li>
                    <li>
                      To the extent any Content consists of software, you may not modify, reverse engineer, decompile, disassemble, or create derivative works
                      based on the Content, or remove any proprietary notices or labels that it contains.
                    </li>
                    <li>Circumvent the navigational structure or presentation of the Site</li>
                    <li>Harvest or collect information about users of this Site.</li>
                    <li>Remove any copyright, trademark or other proprietary rights notice from this Site.</li>
                    <li>Use this Site for any purpose that is fraudulent, tortious, unlawful, or prohibited by these Terms of Use.</li>
                  </ul>
                </div>
                <div>
                  <Heading as="h3">4. Geographic Restrictions</Heading>
                  <p>
                    The owner of this Site is based in the State of Texas in the United States, and we provide this Site for use by persons located in the
                    United States. We make no representation that this Site or any of its content is appropriate or available for use in locations other than
                    the United States. Any offer for any feature, product, or service made on this Site is void where prohibited. If you choose to access this
                    Site from locations other than in the United States, you do so at your own initiative, at your own risk and are responsible for complying
                    with applicable local laws. 
                  </p>
                </div>
                <div>
                  <Heading as="h3">5. Changes </Heading>
                  <p>
                    Our products and services evolve constantly. We reserve the right at any time and in our sole discretion, to change, modify, add, or remove
                    portions of this Site or its Content without notice.  We reserve the right to modify these Terms of Use at any time, in our sole discretion
                    and without notice. It is your responsibility to check these Terms of Use periodically for changes. The “Last Updated” legend at the top of
                    this page indicates when these Terms of Use were last changed. All changes are effective immediately upon posting to this Site. By
                    continuing to access or use this Site after the revisions become effective, you accept and agree to the changes.  DISCONTINUATION OF USE OF
                    THE SITE IS YOUR SOLE RIGHT AND REMEDY FOR ANY DISSATISFACTION WITH THE SITE OR ANY OF THE CONTENT. 
                  </p>
                </div>
                <div>
                  <Heading as="h3">6. Intellectual Property </Heading>
                  <p>
                    InspiroGene enforces its intellectual property rights to the fullest extent allowed by law. This Site and its Content are the property of
                    InspiroGene, its affiliates or its licensors and is protected by United States and international copyright and intellectual property laws
                    and treaty provisions. All rights to patents, copyrights, trademarks, service marks, trade secrets and other intangible property rights in
                    this Site, the Content or any modifications to this Site or the Content shall remain in InspiroGene, its affiliates and its licensors.
                  </p>
                  <p>
                    No part of this Site may be reproduced, stored in a retrieval system, transmitted or retransmitted in any form or by any means, electronic,
                    mechanical, photocopying, recording or otherwise, without the prior written permission of InspiroGene.
                  </p>
                  <p>
                    You may print and download portions of material from the different areas of this Site solely for your own informational, non-commercial,
                    individual, and internal reference, provided that you reproduce the copyright notice which appears at the end of these Terms of Use. Subject
                    to the foregoing, you may make: (a) one machine-readable copy, (b) one backup copy, and (c) one print copy of any portions of material
                    downloaded from different areas of this Site solely for your own informational, non-commercial, individual reference, provided that you
                    reproduce the copyright notice which appears at the end of these Terms of Use. Any other copying, distribution or publication is strictly
                    prohibited without the express prior written consent of InspiroGene. If you print, copy, modify, download, or otherwise use or provide any
                    other person with access to any part of this Site or the Content in breach of these Terms of Use, your right to use this Site will stop
                    immediately and you must, at our option, return or destroy any copies you have made. No right, title, or interest in or to this Site or any
                    Content is transferred to you, and all rights not expressly granted are reserved by InspiroGene and its affiliates and its licensors.
                  </p>
                </div>
                <div>
                  <Heading as="h3">7. Trademarks</Heading>
                  <p>
                    The InspiroGene name, its service and product names, and all related names, logos, designs, and slogans are trademarks and/or service marks
                    (collectively, “Trademarks”) of InspiroGene, its affiliates, its subsidiaries and/or licensors. The Trademarks and all other names, logos
                    and marks on this Site are owned or licensed by InspiroGene and may not be used by you without express prior written permission from
                    InspiroGene.
                  </p>
                </div>
                <div>
                  <Heading as="h3">8. Accounts </Heading>
                  <p>
                    The Site is offered exclusively to customers of InspiroGene and its affiliates for legitimate business purposes.  To access the Site you
                    must have a user ID and password. You may need to provide certain information, registration details, or create an account to use certain
                    features or services offered on or through this Site. It is a condition of your use of this Site that all the information you provide is
                    correct, current, and complete, and that you update such information as needed. You agree that all information you provide and any
                    registration or account details, including, but not limited to, through the use of any interactive features on this Site, is governed by our
                    Privacy Notice, and you consent to all actions we take with respect to your information consistent with our Privacy Notice.
                  </p>
                  <p>
                    If you choose, or are provided with, a username, password, or any other piece of information as part of our security procedures for any
                    registration or account creation, you must treat such information as confidential, and you must not disclose it to any other person or
                    entity. You also acknowledge that your registration or account is personal to you and agree not to provide any other person with access to
                    this Site or portions of it using your username, password, or other security information.
                  </p>
                  <p>
                    You agree to notify us immediately of any unauthorized access to or use of your username or password or any other breach of security. You
                    also agree to ensure that you exit your account at the end of each session. You are entirely responsible for safeguarding your account, and
                    for any activity that happens through your account. You agree to notify InspiroGene immediately if your username or password is lost or
                    stolen, or if you believe there has been unauthorized access to your account. You may be held liable for losses incurred by InspiroGene or
                    any other user of or visitor to this Site due to someone else using your account as a result of your failing to keep your account
                    information secure and confidential.
                  </p>
                </div>
                <div>
                  <Heading as="h3">9. Copyright Infringement</Heading>
                  <p>
                    The Digital Millennium Copyright Act of 1998 (the “DMCA”) provides recourse for copyright owners who believe that material appearing on the
                    Internet infringes their rights under U.S. copyright law.
                  </p>
                  <p>
                    We take claims of copyright infringement seriously and will respond to notices of alleged copyright infringement submitted in accordance
                    with applicable law. If you believe any materials accessible on or from this Site infringe your copyright, please let us know by submitting
                    written notification to our Copyright Agent (designated below). The written notice (the “DMCA Notice”) must include substantially the
                    following as required by Title 17 of the United States Code, Section 512(c)(3) (please consult your legal counsel to confirm these
                    requirements):
                  </p>
                  <ul>
                    <li>Your physical or electronic signature (or that of your designated agent). </li>
                    <li>
                      Identification of the copyrighted work you believe to have been infringed or, if the claim involves multiple works on this Site, a
                      representative list of such works. 
                    </li>
                    <li>Identification of the material you believe to be infringing in a sufficiently precise manner to allow us to locate that material.</li>
                    <li>
                      Adequate information by which we can contact you (including your name, postal address, telephone number and, if available, e-mail
                      address).
                    </li>
                    <li>
                      A statement that you have a good faith belief that use of the copyrighted material is not authorized by the copyright owner, its agent, or
                      the law. 
                    </li>
                    <li>A statement that the information in the written notice is accurate.</li>
                    <li>A statement, under penalty of perjury, that you are the copyright owner or authorized to act on behalf of the copyright owner.</li>
                  </ul>
                  <p>
                    Claims of copyright infringement can be sent to our designated Copyright Agent:
                    <br />
                    Managing Lead Counsel
                    <br />
                    Intellectual Property Group
                    <br />2 National Data Plaza, NE
                    <br />
                    Atlanta, GA 30329
                    <br />
                    Phone: (404) 461-5216
                    <br />
                    Email: <a href="mailto:copyrightrequests@mckesson.com">copyrightrequests@mckesson.com</a>
                  </p>
                  <p>
                    Please be aware that if you fail to comply with all the requirements of Section 512(c)(3) of the DMCA, your DMCA Notice may not be
                    effective. If you knowingly materially misrepresent that material or activity on this Site is infringing your copyright, you may be held
                    liable for damages (including costs and attorneys’ fees) under Section 512(f) of the DMCA.
                  </p>
                </div>
                <div>
                  <Heading as="h3">10. Disclaimer</Heading>
                  <p>
                    Nothing contained on this Web Site is to be construed as medical, legal, investment, financial or other advice, or any instruction on the
                    appropriate use of products produced, supplied or under development by InspiroGene, its affiliates, related companies, or its licensors or
                    joint venture partners. Your access to and use of this Site, services or any Content are at your own risk. You understand and agree that the
                    services are provided to you on an “AS IS” and “AS AVAILABLE” basis. INSPIROGENE MAKES NO REPRESENTATION AND WE DO NOT GUARANTEE THAT THIS
                    SITE OR ANY CONTENT WILL BE UPDATED, COMPLETE, SECURE, CURRENT, RELEVANT, RELIABLE, ERROR-FREE OR UNINTERRUPTED, OR THAT ANY DEFECTS WILL BE
                    CORRECTED, OR THAT YOUR USE OF THIS SITE WILL PROVIDE SPECIFIC RESULTS. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, INSPIROGENE
                    DISCLAIMS AND EXCLUDES ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING ANY WARRANTIES OF ACCURACY, TITLE AND NON-INFRINGEMENT, MERCHANTABILITY
                    AND FITNESS FOR A PARTICULAR PURPOSE.
                  </p>
                </div>
                <div>
                  <Heading as="h3">11. Limitation of Liability</Heading>
                  <p>
                    To the fullest extent permitted by law, InspiroGene and its affiliates and licensors will not be liable to you or any third party for lost
                    profits, loss of goodwill, loss of or damage to property, loss of business opportunities, business interruption, reputation (e.g., offensive
                    or defamatory statements), loss of data (e.g., down time or loss, use of, or changes to, your information or content) or any indirect,
                    incidental, consequential, aggravated, exemplary or punitive damages or similar damages or costs arising out of or in connection with these
                    Terms of Use or use of the Site or the Content, or the transmission of information to or from the Site over the internet, even if we were
                    advised, knew or should have known of the possibility of such damages or costs.  YOUR SOLE REMEDY AGAINST INSPIROGENE FOR DISSATISFACTION
                    WITH THIS SITE OR ANY CONTENT IS TO STOP USING THIS SITE OR ANY SUCH CONTENT. THIS LIMITATION OF RELIEF IS A PART OF THE BARGAIN BETWEEN THE
                    PARTIES.
                  </p>
                  <p>
                    If, notwithstanding the other provisions of these Terms of Use, InspiroGene is found to be liable to you for any damage or loss which arises
                    out of or is in any way connected with your use of this Site or any Content, InspiroGene’s liability shall not exceed the lesser of (a) the
                    total fees paid or payable by you to InspiroGene for any services or products made available through or relating to this Site, if any, or
                    (b) US $500. 
                  </p>
                  <p>
                    You agree that regardless of any statute or law to the contrary, any claim under these Terms of Use must be brought within one (1) year
                    after the date the party asserting the claim first knows or reasonably should know of the act, omission, or default giving rise to the
                    claim; and there shall be no right to any remedy for any claim not asserted within that time period. 
                  </p>
                </div>
                <div>
                  <Heading as="h3">12. Indemnity </Heading>
                  <p>
                    You agree to indemnify, defend, and hold harmless InspiroGene, its affiliates and their respective officers, directors, representatives,
                    consultants, affiliates, shareholders, predecessors, successors in interest, employees, agents, subsidiaries, licensors, suppliers and any
                    third-party information providers to this Site,  from and against any and all claims, liabilities, judgments, awards, losses, expenses,
                    damages, fees and costs, including reasonable attorneys’ fees, arising out of or in connection with (a) your violation of any applicable
                    law, including without limitation, any privacy or data security law or regulation; your access to,  use or misuse of this Site, the Content
                    and services available on or through the Site; (c) your violation of the Terms of Use; (d) your violation of any rights of any third party;
                    and (e) any unauthorized use of a username, password or account number.  We reserve the right, and you grant to us, the right to assume the
                    exclusive defense and control of any matter subject to indemnification by you.
                  </p>
                </div>
                <div>
                  <Heading as="h3">13. Links </Heading>
                  <p>
                    This Site may contain links to other independent third-party Web sites (“Linked Sites”). InspiroGene provides these Linked Sites to you
                    solely as a convenience. We neither control nor endorse, nor are we responsible for, any Linked Sites, including the accuracy, validity,
                    timeliness, completeness, reliability, integrity, quality, legality, usefulness or safety of Linked Sites, or any intellectual property
                    rights therein. You will need to make your own independent judgment regarding your interaction with these Linked Sites.
                  </p>
                  <p>
                    YOUR USE OF THIRD-PARTY MATERIALS IS AT YOUR OWN RISK AND INSPIROGENE AND ITS AFFILIATES WILL HAVE NO LIABILITY FOR ANY LOSS OR DAMAGE
                    ARISING FROM YOUR ACCESS OR USE OF SUCH THIRD-PARTY MATERIALS. The terms of use and privacy policies applicable to third-party materials may
                    be different from those that apply to this site and we encourage you to visit such terms and policies as provided by such sites. 
                  </p>
                </div>
                <div>
                  <Heading as="h3">14. Termination </Heading>
                  <p>You may end your agreement at any time by deactivating your account and discontinuing your use of this Site.</p>
                  <p>
                    We have the right to disable any username, password, or other identifier, whether chosen by you or provided by us, or otherwise terminate
                    your access to all or part of the Site without notice or liability, at any time in our sole discretion for any or no reason, including (a)
                    the unauthorized use of any username or password; or (b) violation of any provision of these Terms of Use.  We may terminate your account or
                    terminate or suspend your access to and use of all or part of the Site at any time and without prior notice, for any or no reason, including
                    if InspiroGene believes that you have violated these Terms, or if you engage in any conduct that we, in our sole discretion, believe is in
                    violation of any applicable Law or is otherwise harmful to the interests of InspiroGene, its affiliates,  any other customer or supplier of
                    InspiroGene or its affiliate, or any third party. Upon any such termination or suspension, your right to use the Site will immediately
                    cease, and InspiroGene may, without liability to you or any third party, immediately deactivate or delete your user ID password and the Site
                    account, and all associated materials, without any obligation to provide any further access to such materials. Any provisions of these Terms
                    that are intended to survive termination (including, but not limited to, any provisions regarding confidentiality, limitation of our
                    liability, or indemnification) will continue in effect beyond any such termination of access to the Site.
                  </p>
                </div>
                <div>
                  <Heading as="h3">15. Violation </Heading>
                  <p>
                    InspiroGene reserves the right to disclose any information we have about you in connection with any investigation or complaint regarding
                    your use of this Site, or to identify, contact, or bring legal action against anyone who may be causing injury to or interfering with the
                    use of this Site.
                  </p>
                  <p>
                    If InspiroGene takes legal action against you as a result of your violation of these Terms of Use, InspiroGene will be entitled to recover
                    from you, and you agree to pay, all reasonable attorneys’ fees and costs of such action, in addition to any other relief granted to
                    InspiroGene. 
                  </p>
                </div>
                <div>
                  <Heading as="h3">16. Governing Law </Heading>
                  <p>
                    You agree that the laws of the State of Delware without regard to its conflicts of laws provisions, will govern these Terms of Use,
                    including any dispute that arises between you and InspiroGene. You agree to be bound by such laws and to submit to the jurisdiction of the
                    state and federal courts of the State of Texas in connection with the interpretation or application of these Terms of Use and waive any
                    objection to such jurisdiction or venue. 
                  </p>
                </div>
                <div>
                  <Heading as="h3">17. Dispute Resolution</Heading>
                  <p>
                    In the event of a controversy or dispute between you and InspiroGene arising out of or in connection with your use of this Site (whether
                    based in contract, tort, statute, fraud, misrepresentation, or any other legal theory, and whether the claims arise during or after the
                    termination of these Terms of Use), the parties agree to try to resolve the dispute promptly, amicably, and in good faith. If we are unable
                    to resolve any such controversy or dispute within a reasonable time (not to exceed thirty (30) days), either party may seek mediation. If
                    the dispute cannot be resolved through mediation, then you must assert any claims relating to your use of this Site in a binding
                    arbitration.
                  </p>
                </div>
                <div>
                  <Heading as="h3">18. Waiver of Jury Trial</Heading>
                  <p>
                    You hereby knowingly and voluntarily waive the right to a jury trial in any actions, suits or proceedings arising out of or relating to your
                    use of this Site or the Terms of Use and the matters contemplated hereby. 
                  </p>
                </div>
                <div>
                  <Heading as="h3">19. Feedback</Heading>
                  <p>
                    By disclosing or offering any information to us, including any ideas, proposals, suggestions or other materials ("Feedback"), whether
                    related to the Customer Center or otherwise – for example, about how to improve or expand the Customer Center – you hereby grant, and
                    represent and warrant that you have the right to grant, to McKesson an irrevocable, perpetual, non-exclusive, transferable, fully paid,
                    worldwide license (with the right to sublicense) to use, copy, publicly perform, publicly display, reformat, translate, excerpt (in whole or
                    in part) and distribute such Feedback for any purpose, commercial, advertising, or otherwise, on or in connection with the Customer Center
                    or the promotion thereof, to prepare derivative works of, or incorporate into other works, such Feedback, and to grant and authorize
                    sublicenses of the foregoing.
                  </p>
                  <p>
                    By providing Feedback, you grant us the right, but not the obligation, to use the name that you submit in connection with such Feedback, and
                    you waive any right and agree not to assert that any such use infringes or violates your right of privacy, right of publicity or other
                    right. You further represent that you have all requisite rights to, and are authorized to disclose, all of the information contained in the
                    Feedback. You are fully responsible for any Feedback you make and for the legality, reliability, appropriateness and originality thereof.
                  </p>
                </div>
                <div>
                  <Heading as="h3">20. Electronic and Telephonic Communication </Heading>
                  <p>
                    When you communicate with us through email or instant messaging systems you are communicating with us electronically, and consent to receive
                    any return communications from us electronically. We may communicate with you via email and other means for purposes relating to the Site
                    account, or any other services we provide to you. You also agree that all communications that we provide to you electronically, such as
                    notices, agreements, disclosures, consents and other communications, satisfy any legal requirement that such communications be in writing.
                  </p>
                  <Heading as="h4">Attribution</Heading>
                  <p>
                    Certain data and information provided on this platform are sourced from third-party licensors. The data provided by these licensors is used
                    under license and is subject to their respective terms and conditions. 
                  </p>
                </div>
                <div>
                  <Heading as="h3">21. Confidentiality </Heading>
                  <p>
                    You agree (a) to hold all non-public information disclosed or otherwise made available by InspiroGene and its affiliates through the Site
                    ("Confidential Information"), in strict confidence, (b) not to disclose such Confidential Information to any third parties, and (c) not to
                    use any Confidential Information for any purpose except for your internal business purposes. Subject to the terms and conditions of these
                    Terms, you may disclose the Confidential Information to any of your employees who has a bona fide need to know. You agree to instruct all
                    such employees not to disclose such Confidential Information to third parties, including consultants, without the prior written permission
                    of InspiroGene. Confidential Information will not include information that: (i) is now, or hereafter becomes, through no act or failure to
                    act by you, generally known or available to the public; (ii) was acquired by you before receiving such information from InspiroGene and
                    without restriction as to use or disclosure; (iii) is hereafter rightfully furnished to you by a third party without restriction as to use
                    or disclosure; or (iv) is disclosed with the prior written consent of InspiroGene. 
                  </p>
                  <p>
                    You recognize and agree that nothing contained in these Terms will be construed as granting any rights to you, by agreement or otherwise, to
                    any Confidential Information except as specified in these Terms.  You acknowledge that all Confidential Information is owned solely by
                    InspiroGene, its affilites or its licensors, and that the unauthorized disclosure or use of such Confidential Information would cause
                    irreparable harm and significant injury, the degree of which may be difficult to ascertain. Accordingly, you agree that InspiroGene will
                    have the right to obtain an immediate injunction enjoining any breach of these Terms, as well as the right to pursue any and all other
                    rights and remedies available at law or in equity for such a breach.
                  </p>
                </div>
                <div>
                  <Heading as="h3">22. Force Majeure</Heading>
                  <p>
                    InspiroGene will not be responsible for any failure to fulfill any obligation due to acts or causes beyond its control including but not
                    limited to Acts of God, strikes, lockouts, communications line or equipment failures, power failure, failure of the internet, earthquakes or
                    other disasters. 
                  </p>
                </div>
                <div>
                  <Heading as="h3">23. Product Order Placement; Government Contracts </Heading>
                  <p>
                    If you have valid ordering permissions, you may place a product order with us through InspiroLink.  All payment and other obligations
                    concerning such order placement are governed in a separate agreement between you and the applicable InspiroGene affiliate.  These Terms are
                    not intended to amend such agreements.  Unless specifically notified and agreed to in writing by the applicable InspiroGene affiliate, we
                    will not be bound by the terms and conditions of any government contracts to which you may be a party. 
                  </p>
                </div>
                <div>
                  <Heading as="h3">24.  No Medical Advice </Heading>
                  <p>
                    CAREFULLY READ ALL MANUFACTURER PACKAGING, INSTRUCTIONS, AND OTHER INFORMATION PROVIDED BY THE MANUFACTURER BEFORE USING PRODUCTS PURCHASED
                    THROUGH INSPIROLINK.  InspiroGene and its affiliates do not provide instructions on the appropriate use of the products supplied through
                    InspiroLink.  InspiroLink and the resources contained therein are not intended as, and should not be taken as, the delivery of medical,
                    nursing, legal or any other type of professional advice. 
                  </p>
                  <p>
                    The information provided on or through InspiroLink is for informational purposes only and does not constitute medical advice for you or any
                    other person.  Information provided on this website does not create a doctor-patient relationship between you and any physician. 
                    InspiroGene and its affiliates make no warranty or representations regarding the accuracy or completeness of any such information.  Consult
                    your medical provider about any health care questions and do not rely on this or any other web site to make medical decisions.  Never delay
                    seeking medical advice or disregard medical advice because of anything you read on this site.
                  </p>
                  <Heading as="h4">General Terms</Heading>
                  <p>
                    In the event that any provision of these Terms of Use is held to be invalid or unenforceable, then that provision will be limited or
                    eliminated to the minimum extent necessary, and the remaining provisions of these Terms of Use will remain in full force and effect
                  </p>
                  <p>InspiroGene’s failure to enforce any right or provision of these Terms of Use will not be deemed a waiver of such right or provision. </p>
                  <p>
                    Other than as stated in this section or as explicitly agreed upon in writing between you and InspiroGene, these Terms of Use constitute all
                    of the terms and conditions agreed upon between you and InspiroGene and supersede any prior agreements in relation to the subject matter of
                    these Terms of Use, whether written or oral. You may not assign, transfer or sublicense any or all of your rights or obligations under these
                    Terms without our express prior written consent. We may assign, transfer or sublicense any or all of our rights or obligations under these
                    Terms without restriction.
                  </p>
                  <p>
                    Any provisions of these Terms of Use that are intended to survive termination (including, but not limited to, any provisions regarding
                    limitation of our liability or indemnification) will continue in effect beyond any such termination of access to this Site.
                  </p>
                </div>
                <div>
                  <Heading as="h3">25. Contact Us</Heading>
                  <p>For general inquiries, legal notices, or service of processes, you may contact us at:</p>
                  <p>
                    InspiroGene
                    <br />
                    6555 State Hwy 161
                    <br />
                    Irving, TX 75039
                  </p>
                  <p>
                    © 2025 MCKESSON CORPORATION <br />
                    Last Updated: July 22, 2025
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default TermsOfUse;
