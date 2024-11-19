import React from 'react';
import styles from './Summary.module.scss';
import { Button, CheckboxGroup } from '@mckesson/mcp-component-library';
import { ReactComponent as IconEditField } from '@src/assets/svg/edit-field.svg';
import ModuleHeader from '@src/components/module-header';

const summaryData = {
    accountDetails: {
        accountName: 'Revisions Aesthetics Group',
        accountNumber: '015111',
        shippingAccountName: 'BMS-WAC MD ANDERSON  CANCER CTR',
        shippingAccountNumber: '1122332',
    },
    adamJones: {
        patientIdentifier: '5682532',
        gender: 'Male',
        dob: '11/19/1997'
    },
    additionalDetails: {
        dateOfAdministration: '11/19/1997',
        patientConsent: 'Yes',
        slotNo: 123578,
        selectVariant: 'Туре А',
        poNo: 12131,
        variantDescription: 'HEMLIBRA prevents bl...'
    },
    therapyDetails: {
        "nationalDrugCode": "N5024202201",
        "uDI": "G07331689",
        "distributionsChannel": 20,
        "salesOrganization": 8545,
        "netPrice": "$117,000.00",
        "contractPrice": "$100,000.00",
        "wACPrice": "$117,000.00",
        "regularPrice": "$200,000.00",
        "340bPrice": "NA",
        "priceUnit": 1
    }
}

const Summary = () => {
    const { accountDetails, adamJones, additionalDetails, therapyDetails } = summaryData;
    return (
        <div className={styles.wrapper}>
            <div className={styles.lauout}>
                <div className="MCP-panel-container">
                    <div class={styles.sect}>
                        <ModuleHeader 
                            heading={<p className='tertiaryHeading'>Price</p>}
                        />
                        <div className={`${styles.pricingDetails}`}>
                            <div className={`${styles.col} ${styles.detailSegment}`}>
                                <div className={styles.fieldName}>Material Description</div>
                                <div className={styles.fieldValue}>VENOFER 20MG/ML 5ML SDV PF NR</div>
                            </div>
                            <div className={`${styles.col} ${styles.detailSegment}`}>
                                <div className={styles.fieldName}>Order Cost</div>
                                <div className={`${styles.fieldValue} ${styles.price}`}>$45,000.00</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="MCP-panel-container">
                    <div className={styles.sect}>
                        <ModuleHeader 
                            heading={<p className='tertiaryHeading'>Account Details</p>}
                            controls={
                                <button className={styles.actionLink}>
                                    <IconEditField />
                                    <span>Edit</span>
                                </button>
                            }
                        />
                        <div className={`${styles.details} ${styles.row}`}>
                            <div className={styles.col}>
                                <div className={styles.row}>
                                    <div className={`${styles.col} ${styles.detailSegment}`}>
                                        <div className={styles.fieldName}>Account Name</div>
                                        <div className={styles.fieldValue}>{accountDetails.accountName}</div>
                                    </div>
                                    <div className={`${styles.col} ${styles.detailSegment}`}>
                                        <div className={styles.fieldName}>Account No.</div>
                                        <div className={styles.fieldValue}>{accountDetails.accountNumber}</div>
                                    </div>
                                </div>

                            </div>
                            <div className={styles.col}>
                                <div className={styles.row}>
                                    <div className={`${styles.col} ${styles.detailSegment}`}>
                                        <div className={styles.fieldName}>Shiping Account Name</div>
                                        <div className={styles.fieldValue}>{accountDetails.shippingAccountName}</div>
                                    </div>
                                    <div className={`${styles.col} ${styles.detailSegment}`}>
                                        <div className={styles.fieldName}>Shipping Account No.</div>
                                        <div className={styles.fieldValue}>{accountDetails.shippingAccountNumber}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.col}>
                        <div className="MCP-panel-container">
                            <div class={styles.sect}>
                                <ModuleHeader 
                                    heading={<p className="tertiaryHeading">Therapy</p>} 
                                    controls={
                                        <button className={styles.actionLink}>
                                            <IconEditField />
                                            <span>Edit</span>
                                        </button>
                                    }
                                />
                                <div className={`${styles.details} ${styles.row}`}>
                                    <div className={styles.col}>
                                        <div className={styles.row}>
                                            <div className={`${styles.col} ${styles.detailSegment}`}>
                                                <div className={styles.fieldName}>National Drug Code</div>
                                                <div className={styles.fieldValue}>{therapyDetails.nationalDrugCode}</div>
                                            </div>
                                            <div className={`${styles.col} ${styles.detailSegment}`}>
                                                <div className={styles.fieldName}>UDI</div>
                                                <div className={styles.fieldValue}>{therapyDetails.uDI}</div>
                                            </div>
                                            <div className={`${styles.col} ${styles.detailSegment}`}>
                                                <div className={styles.fieldName}>Distributions Channel</div>
                                                <div className={styles.fieldValue}>{therapyDetails.distributionsChannel}</div>
                                            </div>
                                        </div>
                                        <div className={styles.row}>
                                            <div className={`${styles.col} ${styles.detailSegment}`}>
                                                <div className={styles.fieldName}>Sales Organization</div>
                                                <div className={styles.fieldValue}>{therapyDetails.salesOrganization}</div>
                                            </div>
                                            <div className={`${styles.col} ${styles.detailSegment}`}>
                                                <div className={styles.fieldName}>Net Price</div>
                                                <div className={styles.fieldValue}>{therapyDetails.netPrice}</div>
                                            </div>
                                            <div className={`${styles.col} ${styles.detailSegment}`}>
                                                <div className={styles.fieldName}>Contract Price</div>
                                                <div className={styles.fieldValue}>{therapyDetails.contractPrice}</div>
                                            </div>
                                        </div>
                                        <div className={styles.row}>
                                            <div className={`${styles.col} ${styles.detailSegment}`}>
                                                <div className={styles.fieldName}>WAC Price</div>
                                                <div className={styles.fieldValue}>{therapyDetails.wACPrice}</div>
                                            </div>
                                            <div className={`${styles.col} ${styles.detailSegment}`}>
                                                <div className={styles.fieldName}>Regular Price</div>
                                                <div className={styles.fieldValue}>{therapyDetails.regularPrice}</div>
                                            </div>
                                            <div className={`${styles.col} ${styles.detailSegment}`}>
                                                <div className={styles.fieldName}>340b Price</div>
                                                <div className={styles.fieldValue}>{therapyDetails["340bPrice"]}</div>
                                            </div>
                                        </div>
                                        <div className={styles.row}>
                                            <div className={`${styles.col} ${styles.detailSegment}`}>
                                                <div className={styles.fieldName}>Price Unit</div>
                                                <div className={styles.fieldValue}>{therapyDetails.priceUnit}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className={styles.col}>
                        <div className="MCP-panel-container">
                            <div class={styles.sect}>
                                <ModuleHeader 
                                    heading={<p className="tertiaryHeading">Adam Jones</p>}
                                    controls={
                                        <button className={styles.actionLink}>
                                            <IconEditField />
                                            <span>Edit</span>
                                        </button>
                                    }
                                />
                                <div className={`${styles.details} ${styles.row}`}>
                                    <div className={styles.col}>
                                        <div className={styles.row}>
                                            <div className={`${styles.col} ${styles.detailSegment}`}>
                                                <div className={styles.fieldName}>Patient Identifier</div>
                                                <div className={styles.fieldValue}>{adamJones.patientIdentifier}</div>
                                            </div>
                                            <div className={`${styles.col} ${styles.detailSegment}`}>
                                                <div className={styles.fieldName}>Gender</div>
                                                <div className={styles.fieldValue}>{adamJones.gender}</div>
                                            </div>
                                            <div className={`${styles.col} ${styles.detailSegment}`}>
                                                <div className={styles.fieldName}>DOB</div>
                                                <div className={styles.fieldValue}>{adamJones.dob}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="MCP-panel-container">
                            <div class={styles.sect}>
                                <ModuleHeader 
                                    heading={<p className='tertiaryHeading'>Additional Details</p>} 
                                    controls={
                                        <button className={styles.actionLink}>
                                            <IconEditField />
                                            <span>Edit</span>
                                        </button>
                                    }    
                                />
                                <div className={`${styles.details} ${styles.row}`}>
                                    <div className={styles.col}>
                                        <div className={styles.row}>
                                            <div className={`${styles.col} ${styles.detailSegment}`}>
                                                <div className={styles.fieldName}>Slot No.</div>
                                                <div className={styles.fieldValue}>{additionalDetails.slotNo}</div>
                                            </div>
                                            <div className={`${styles.col} ${styles.detailSegment}`}>
                                                <div className={styles.fieldName}>PO No.</div>
                                                <div className={styles.fieldValue}>{additionalDetails.poNo}</div>
                                            </div>
                                            <div className={`${styles.col} ${styles.detailSegment}`}>
                                                <div className={styles.fieldName}>Date of Administration</div>
                                                <div className={styles.fieldValue}>{additionalDetails.dateOfAdministration}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={`${styles.details} ${styles.row}`}>
                                    <div className={styles.col}>
                                        <div className={styles.row}>
                                            <div className={`${styles.col} ${styles.detailSegment}`}>
                                                <div className={styles.fieldName}>Select Variant</div>
                                                <div className={styles.fieldValue}>{additionalDetails.selectVariant}</div>
                                            </div>
                                            <div className={`${styles.col} ${styles.detailSegment}`}>
                                                <div className={styles.fieldName}>Variant Description</div>
                                                <div className={styles.fieldValue}>{additionalDetails.variantDescription}</div>
                                            </div>
                                            <div className={`${styles.col} ${styles.detailSegment}`}>
                                                <div className={styles.fieldName}>Patient Concent</div>
                                                <div className={styles.fieldValue}>{additionalDetails.patientConsent}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div>
                <CheckboxGroup id={"default"} caption="Select option" items={[{ value: "Apple" }].map(item => ({
                    ...item,
                    onChange: () => handleChange(item.value)
                }))} />
            </div>
            <div className="controls">
                <Button size="md" variant="secondary">Print Summary</Button>
                <Button size="md" variant="secondary">Cancel</Button>
                <Button size="md" variant="primary">Submit Order</Button>
            </div>
        </div>
    )
}

export default Summary;