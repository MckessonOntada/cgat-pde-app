import React, { useEffect, useState } from 'react';
import footerData from './__mock__.js';
import './assets/style.scss';
import { Divider } from '@mfe/ui-components';
import { ReactComponent as CompanyLogo } from './../../../assets/images/mckesson_logo.svg';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const [data, setData] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        setData(footerData);
    }, []);

    console.log(data);

    return (
        <footer className="site-footer">
            <div className="footer-columns">
                {data.map((column, index) => (
                    <div key={index} className="footer-column">
                        <h4>{column.title}</h4>
                        {column.links ? (
                            <ul>
                                {column.links.map((link, idx) => (
                                    <li key={idx}>
                                        <a href={link.url}>{link.label}</a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>{column.content}</p>
                        )}
                    </div>
                ))}
            </div>
            <Divider className="divider" />
            <div className="footer-company-info">
                <CompanyLogo className="company-logo" />
                <p>
                    &copy; {new Date().getFullYear()} {t('footer.copyright', { company: 'McKesson Corporation Health Technology Products LLC' })}
                </p>
            </div>
        </footer>
    );
};

export default Footer;
