import PrimaryHeader from "./primary-header";
import SecondaryHeader from "./secondary-header";
import  HeaderConfig from './__mock__';

export default function Header(){
    return (
        <div className="header-wrapper">
            <PrimaryHeader />
            <SecondaryHeader navLinks={HeaderConfig.navLinks} />
        </div>
    )
}