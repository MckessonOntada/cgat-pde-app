import React from 'react';
import { connect } from 'react-redux';
import { setUserData } from '@src/store/reducer/userReducer';
import { Button, TabList } from '@mckesson/mcp-component-library';
import styles from './assets/styles/Header.module.scss';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';


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
            <div
                className={`${styles.navItemsLeft} ${styles.secondaryNav}`}
                
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
            </div>
        )
    }

    const RightSideView = () => {

        return (
            <div
                className={styles.navItemsRight}
                
                aria-label="System administration view"
            >
                <div className={styles.navOptions}>
                    <Button color="secondary">
                        {intl.formatMessage({ id: 'header.label.systemAdminView' })}
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className={`${styles.navContainer} ${styles.secondary}`} aria-label="Secondary header">
            <div
                className={styles.wrapper}
                
            >
                <LeftSideView />
                <RightSideView />
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    user: state.userState.user
});

export default connect(mapStateToProps, { setUserData })(SecondaryHeader);