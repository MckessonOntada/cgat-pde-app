import React, { useState } from 'react';
import { Box, Drawer } from '@mui/material';
import { ReactComponent as AppLogo } from './../../assets/image/app-logo.svg';
import { ReactComponent as IconNotification } from './../../assets/svg/bell.svg';
import { ReactComponent as IconLogout } from './../../assets/svg/logout.svg';
import { ReactComponent as IconMenu } from './../../assets/svg/burger-menu.svg';
import { ReactComponent as IconArrowDown } from './../../assets/svg/arrow-down-filled.svg';
import { ReactComponent as IconHelp } from './../../assets/svg/help-circle-filled.svg';
import { connect } from 'react-redux';
import { setUserData } from '../../store/reducer/userReducer';
import { debugIds, ID } from '../../common/constants/id';
import { Button, Dropdown, DropdownMenu } from '@mckesson/mcp-component-library';
import styles from './assets/styles/Header.module.scss';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import HeaderConfig from './__mock__';


const PrimaryHeader = ({ user, setUserData, debugId }) => {

    let intl = useIntl();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const toggleDrawer = () => setDrawerOpen(!drawerOpen);

    const LeftSideView = () => {
        return (
            <Box
                className={styles.navItemsLeft}
                id={''}
            >
                <Box className={styles.branding}>
                    <Link
                        className={`${styles.appLogo} ${styles.actionLink}`}
                        to={''}
                        id={''}
                        aria-label='dashboard'
                    >
                        <AppLogo />
                    </Link>
                </Box>
                <Box className={styles.centerSelector}>
                    <Dropdown
                        id={''}
                        name={''}
                        aria-label="Select treatment center"
                        options={[]}
                        onChange={() => { }}
                    />
                </Box>
            </Box>
        )
    }

    const RightSideView = () => {
        const quickLinks = [
            <Link
                className={styles.actionLink}
                to={"notifications"}
                aria-label="View notifications"
            >
                <span>{intl.formatMessage({ id: 'header.label.notifications' })}</span><IconNotification />
            </Link>,
            <DropdownMenu
                anchorEl={<button className={styles.actionLink} aria-label="Account options"><span>{user || 'Anonymous'}</span><IconArrowDown /></button>}
                handleSelect={() => { }}
                options={HeaderConfig.profileOptions}
                aria-label="Profile options"
            />,
            <Link
                className={styles.actionLink}
                to={"help"}
                aria-label="Help center"
            >
                <span>{intl.formatMessage({ id: 'header.label.help' })}</span>
                <IconHelp />
            </Link>,
            <Button
                label={'button.logout'}
                aria-label="Log out of account"
                icon={<IconLogout />}
                iconPosition={"right"}
                id={debugIds(ID.HEADER, ID.NAV, ID.RIGHT, ID.BUTTON, ID.LOGOUT)}
                data-testid={'LOGOUT'}
                size="sm"
                variant="primary"
                onClick={() => { }}
            >
                {intl.formatMessage({ id: 'header.label.logout' })}
            </Button>
        ]
        return (
            <Box
                className={styles.navItemsRight}
                id={''}
            >
                <ul className={styles.quickLinks} role="navigation"  aria-label="Quick access links">
                    {
                        quickLinks.map((item, index) => {
                            return <li className={styles.linkWrapper} key={`quick-links-item-${index}`}>{item}</li>;
                        })
                    }
                </ul>
            </Box>
        )
    }

    return (
        <Box className={`${styles.navContainer} ${styles.primary}`}>
            <Box
                className={styles.wrapper}
                id={''}
            >
                <LeftSideView />
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <RightSideView />
                </Box>
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                    <button
                        onClick={toggleDrawer}
                        aria-label="Open drawer menu"
                    >
                        <IconMenu />
                    </button>
                    <Drawer
                        anchor="right"
                        open={drawerOpen}
                        onClose={toggleDrawer}
                        sx={{ '.MuiDrawer-paper': { width: '80vw', p: 2 } }}
                        aria-label="Drawer menu with quick links"
                    >
                        <Box className={styles.drawerContent} onClick={toggleDrawer}>
                            <RightSideView />
                        </Box>
                    </Drawer>
                </Box>
            </Box>
        </Box>
    )
}

const mapStateToProps = (state) => ({
    user: state.userState.user
});

export default connect(mapStateToProps, { setUserData })(PrimaryHeader);
