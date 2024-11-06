import React from 'react';
import { Box, Typography } from '@mui/material';
import { connect } from 'react-redux';
import { setUserData } from '../../store/reducer/userReducer';
import { debugIds, ID } from '../../common/constants/id';
import { Button, TabList, DropdownMenu } from '@mckesson/mcp-component-library';
import styles from './assets/styles/Header.module.scss';
import { useIntl } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';
import Breadcrumbs from '../breadCrumbs/Breadcrumbs';


const SecondaryHeader = ({ user, setUserData, debugId, navLinks }) => {

    let intl = useIntl();
    const [tabs, setTabs] = React.useState([]);
    const location = useLocation();

    React.useEffect(() => {
        if (Array.isArray(navLinks) && navLinks.length > 0) {
            const updatedTabs = navLinks.map(item => ({
                ...item,
                isActiveTab: location.pathname.includes(item.path),
                ariaSelected: location.pathname.includes(item.path) ? 'true' : 'false'
            }));
            setTabs(updatedTabs);
        }
    }, [navLinks, location.pathname]);

    const LeftSideView = () => {
        return (
            <Box
                className={`${styles.navItemsLeft} ${styles.secondaryNav}`}
                id={''}
                aria-label="Navigation tabs"
            >
                <TabList
                    className={styles.compactTablist}
                    type="link"
                    options={tabs}
                    showShadow={false}
                    alignment={"left"}
                    useAsButton={false}
                    role="tablist"
                    aria-label="Secondary navigation tabs"
                />
            </Box>
        )
    }

    const RightSideView = () => {

        return (
            <Box
                className={styles.navItemsRight}
                id={''}
                aria-label="System administration view"
            >
                <div className={styles.navOptions}>
                    <Button color="secondary">
                        {intl.formatMessage({ id: 'header.label.systemAdminView' })}
                    </Button>
                </div>
            </Box>
        )
    }

    return (
        <Box className={`${styles.navContainer} ${styles.secondary}`} aria-label="Secondary header">
            <Box
                className={styles.wrapper}
                id={''}
            >
                <LeftSideView />
                <RightSideView />
            </Box>
        </Box>
    )
}

const mapStateToProps = (state) => ({
    user: state.userState.user
});

export default connect(mapStateToProps, { setUserData })(SecondaryHeader);