import React, { useState } from 'react';
import { ReactComponent as AppLogo } from '@src/assets/image/app-logo.svg';
import { ReactComponent as IconNotification } from '@src/assets/svg/bell.svg';
import { ReactComponent as IconLogout } from '@src/assets/svg/logout.svg';
import { ReactComponent as IconMenu } from '@src/assets/svg/burger-menu.svg';
import { ReactComponent as IconArrowDown } from '@src/assets/svg/arrow-down-filled.svg';
import { ReactComponent as IconHelp } from '@src/assets/svg/help-circle-filled.svg';
import { connect } from 'react-redux';
import { setUserData } from '@src/store/reducer/userReducer';
import { debugIds, ID } from '@src/common/constants/id';
import { Button, Dropdown, DropdownMenu } from '@mckesson/mcp-component-library';
import styles from './assets/styles/Header.module.scss';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import HeaderConfig from './__mock__';
import FloatingDrawer from '../floating-drawer';


const PrimaryHeader = ({ user }) => {

    let intl = useIntl();
    const [drawerOpen, setDrawerOpen] = useState(true);
    const toggleDrawer = () => setDrawerOpen(!drawerOpen);

    const LeftSideView = () => {
        return (
            <div
                className={styles.navItemsLeft}
                id={''}
            >
                <div className={styles.branding}>
                    <Link
                        className={`${styles.appLogo} ${styles.actionLink}`}
                        to={''}
                        id={''}
                        aria-label='dashboard'
                    >
                        <AppLogo />
                    </Link>
                </div>
                <div className={styles.centerSelector}>
                    <Dropdown
                        id={''}
                        name={''}
                        aria-label="Select treatment center"
                        options={[]}
                        onChange={() => { }}
                    />
                </div>
            </div>
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
            <div
                className={styles.navItemsRight}
                id={''}
            >
                <ul className={styles.quickLinks} role="navigation" aria-label="Quick access links">
                    {
                        quickLinks.map((item, index) => {
                            return <li className={styles.linkWrapper} key={`quick-links-item-${index}`}>{item}</li>;
                        })
                    }
                </ul>
            </div>
        )
    }

    return (
        <div className={`${styles.navContainer} ${styles.primary}`}>
            <div
                className={styles.wrapper}
                id={''}
            >
                <LeftSideView />
                <div className={styles.desktopOnly}>
                    <RightSideView />
                </div>
                <div className={styles.mobileOnly}>
                    <button
                        onClick={toggleDrawer}
                        aria-label="Open drawer menu"
                    >
                        <IconMenu />
                    </button>
                    <FloatingDrawer anchor='right' open={drawerOpen} onClose={toggleDrawer}>
                        <RightSideView />
                    </FloatingDrawer>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    user: state.userState.user
});

export default connect(mapStateToProps, { setUserData })(PrimaryHeader);
