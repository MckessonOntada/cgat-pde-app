import React from 'react';
import styles from './Orders.module.scss';
import ToggleUI from '@src/components/toggleui';
import { AutoSuggestSearch, Button, Divider, SearchableDropdown } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as ArrowRight } from '@src/assets/image/arrow_right.svg';
import { ReactComponent as ArrowDown } from '@src/assets/image/arrow_down.svg';
import { useOrders } from '../../context';

const ROLES = [
    { label: "Admin", value: "Admin" },
    { label: "Supervisor", value: "Supervisor" },
    { label: "SuperAdmin", value: "SuperAdmin" },
];

const STATUS = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
];

const FilterPanel = ({ onApplyFilters }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const { filterState, applyFilters, clearFilters } = useOrders();
    const { t } = useTranslate();
    const handleOnExpandClick = () => {
        setIsExpanded(!isExpanded);
    }

    const handleOnStatusChange = (value) => {
        applyFilters({
            status: value.filter(item => item.isChecked)
        })
    }

    const handleOnQueryChange = (value) => {
        applyFilters({ searcgQuery: value });
    }


    return (
        <div className={styles.wrapper} >
            <div className={styles.filterPanel}>
                <div className={styles.filterHeader}>
                    <button
                        className={styles.iconButton}
                        onClick={handleOnExpandClick}
                    >
                        {
                            isExpanded ?
                                <ArrowDown />
                                :
                                <ArrowRight />
                        }
                    </button>
                    <div className="autoSuggestSearch-container">
                        <AutoSuggestSearch
                            label=" "
                            value={filterState.searchQuery}
                            onChangeInput={handleOnQueryChange}
                            outline={true}
                            placeHolder={t('orderManagement.controls.autosearch.label')}
                        />
                    </div>
                </div>
                <ToggleUI in={isExpanded}>
                    <div className={styles.filterOptionsWrapper}>
                        <Divider />
                        <div className="grid grid-gap-24 grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                            <SearchableDropdown
                                id="status"
                                isSuccess
                                value={filterState.status}
                                label={t('orderManagement.captions.status')}
                                name={'status'}
                                isRequired={false}
                                onChange={handleOnStatusChange}
                                options={STATUS}
                                clearAllSelectedValues={() => { }}
                            />

                            <div className={styles.filterAction}>
                                <Button
                                    type="button"
                                    label={t('orderManagement.captions.clearFilters')}
                                    textButton
                                    className="txtbtn"
                                    onClick={clearFilters}
                                />
                            </div>
                        </div>
                    </div>
                </ToggleUI>
            </div>
        </div>
    )
}
export default FilterPanel;