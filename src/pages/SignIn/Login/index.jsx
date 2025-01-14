import React from "react";
import { Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { useNavigate } from 'react-router-dom';
import "./index.scss";

const LoginForm = () => {
    const { t } = useTranslate();
    const navigate = useNavigate();
    return (
        <div>
            <div className="box">
                <div className="boxHeader">
                    <div className="box-padding">
                    {t('loginrequest.heading')}
                    </div>
                    <div className="boxContent">{t('loginrequest.content')}
                    </div>
                </div>
                <div><Button variant="primary" buttonWidth="100%" size={'md'} onClick={() => navigate('/login')} >{t('loginrequest.button')}</Button></div>
            </div>
        </div>
    );
};


export default LoginForm;
