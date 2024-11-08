import React from 'react';
import styles from './Orders.module.scss';
import ToggleUI from '@src/components/toggleui';
import { AutoSuggestSearch, IconButton, Divider, SearchableDropdown } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as ArrowRight } from '@src/assets/image/arrow_right.svg';
import { ReactComponent as ArrowDown } from '@src/assets/image/arrow_down.svg';

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
    const [filters, setFilters] = React.useState({
        query: '',
        roles: [],
        status: []
    })
    const { t } = useTranslate();
    const handleOnExpandClick = () => {
        setIsExpanded(!isExpanded);
    }
    const handleOnRoleChange = (value) => {
        setFilters({
            ...filters,
            roles: value.filter(item => item.isChecked)
        })
    }
    const handleOnStatusChange = (value) => {
        setFilters({
            ...filters,
            status: value.filter(item => item.isChecked)
        })
    }
    return (
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
                <div className={styles.filterAutoSuggest}>
                    <AutoSuggestSearch
                        label=" "
                        value={'searchQuery'}
                        onChangeInput={() => { }}
                        outline={true}
                        placeHolder={t('orderManagement.controls.autosearch.label')}
                    />
                </div>
            </div>
            <ToggleUI in={isExpanded}>
                <div className={styles.filterOptions}>
                    <Divider color={'#BAC5CC'} />
                    <div className="grid grid-gap-24 grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                        <SearchableDropdown
                            id="role"
                            isSuccess
                            value={filters.roles}
                            label={t('userManagement.table.role')}
                            name={t('userManagement.table.role')}
                            isRequired={false}
                            onChange={handleOnRoleChange}
                            options={ROLES}
                            clearAllSelectedValues={() => { }}
                        />

                        <SearchableDropdown
                            id="status"
                            isSuccess
                            value={filters.status}
                            label={t('userManagement.table.status')}
                            name={t('userManagement.table.status')}
                            isRequired={false}
                            onChange={handleOnRoleChange}
                            options={STATUS}
                            clearAllSelectedValues={() => { }}
                        />
                    </div>
                </div>
            </ToggleUI>
        </div>
    )
}
export default FilterPanel;