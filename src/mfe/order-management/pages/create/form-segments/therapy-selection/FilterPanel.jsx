import React from 'react';
import ToggleUI from '@src/components/toggleui';
import { AutoSuggestSearch, Button, Divider, SearchableDropdown } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as ArrowRight } from '@src/assets/image/arrow_right.svg';
import { ReactComponent as ArrowDown } from '@src/assets/image/arrow_down.svg';
import { useTherapy } from '../../../../context/TherapyContext';
import styles from './FilterPanel.module.scss';

const SALES_ORGANIZATIONS = [
    "MPB",
    "US East",
    "US West",
    "Global Health",
    "EMEA",
    "APAC",
    "LATAM",
    "Canada",
    "Retail Division",
    "Wholesale Division"
].map(i => ({label: i, value: i.replace(' ', '_').toLowerCase()}));

const CUSTOMER_INDICATORS =  [
    "Preferred Customer",
    "New Customer",
    "VIP Customer",
    "Loyalty Member",
    "Inactive Customer",
    "High-Value Customer",
    "Discount Eligible",
    "First-Time Buyer",
    "Recurring Buyer",
    "Potential Lead"
].map(i => ({label: i, value: i.replace(' ', '_').toLowerCase()}))

const FilterPanel = ({ onApplyFilters }) => {
    const { t } = useTranslate();
    const [isExpanded, setIsExpanded] = React.useState(false);
    const { filterState, applyFilters, clearFilters } = useTherapy();
    const [filters, setFilters] = React.useState({ ...filterState });

    const handleOnExpandClick = () => {
        setIsExpanded((prevState) => !prevState);
    };

    const handleOnStatusChange = (value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            status: value
        }));
    };

    const handleOnQueryChange = (value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            searchQuery: value
        }));
    };

    const handleOnApplyFilters = () => {
        applyFilters(filters)
        setFilters({})
    }

    return (
        <div className="MCP-panel-container">
            <div className={styles.wrapper}>
                <div className={styles.filterPanel}>
                    <div className={styles.filterHeader}>
                        <div className={styles.flex}>
                            <button
                                className={styles.iconButton}
                                onClick={handleOnExpandClick}
                                aria-expanded={isExpanded}
                                aria-label={isExpanded
                                    ? t('controls.ariaLabels.collapseFilters')
                                    : t('controls.ariaLabels.expandFilters')}
                            >
                                {isExpanded ? <ArrowDown /> : <ArrowRight />}
                            </button>
                            <div className="autoSuggestSearch-container">
                                <AutoSuggestSearch
                                    label=" "
                                    value={filterState.searchQuery}
                                    onChangeInput={handleOnQueryChange}
                                    outline
                                    placeHolder={t('controls.placeholders.autoSearch')}
                                    aria-label={t('controls.ariaLabels.searchOrders')}
                                />
                            </div>
                        </div>
                        <div>
                            <Button
                                size="md"
                                variant="secondary"
                                onClick={handleOnApplyFilters}
                            >Apply Filters</Button>
                        </div>
                    </div>

                    <ToggleUI in={isExpanded}>
                        <div className={styles.filterOptionsWrapper}>
                            <Divider />
                            <div className={`${styles.customSearchableDropdown} grid grid-gap-24 grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3`}>
                                <SearchableDropdown
                                    id="order-management-therapy-customer-indicator"
                                    isSuccess
                                    value={filters.status}
                                    label={t('labels.customerIndicator')}
                                    name="status"
                                    isRequired={false}
                                    onChange={handleOnStatusChange}
                                    options={CUSTOMER_INDICATORS}
                                    clearAllSelectedValues={() => { }}
                                    aria-labelledby={t("controls.ariaLabels.orderManagementStatue")}
                                />
                                <SearchableDropdown
                                    id="order-management-therapy-sales-organization"
                                    isSuccess
                                    value={filters.status}
                                    label={t('labels.salesOrganization')}
                                    name="status"
                                    isRequired={false}
                                    onChange={handleOnStatusChange}
                                    options={SALES_ORGANIZATIONS}
                                    clearAllSelectedValues={() => { }}
                                    aria-labelledby={t("controls.ariaLabels.orderManagementStatue")}
                                />

                                <div className={styles.filterAction}>
                                    <Button
                                        type="button"
                                        label={t('captions.clearFilters')}
                                        textButton
                                        onClick={clearFilters}
                                        aria-label={t('captions.clearFilters')}
                                    />
                                </div>
                            </div>
                        </div>
                    </ToggleUI>
                </div>
            </div>
        </div>
    );
};

export default FilterPanel;
