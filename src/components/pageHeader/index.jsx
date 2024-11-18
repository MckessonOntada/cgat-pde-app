import React from 'react';
import PropTypes from 'prop-types';
import styles from './PageHeader.module.scss';

const PageHeader = ({ heading = '', subheading = '', children }) => {
   
    return (
        <div className={styles.headerSegment}>
            {/* Responsive mobile ui title, controls in column direction */}
            <div className={`${styles.headings}`}>
                {heading && <h1 className={styles.primaryHeading}>{heading}</h1>}
                {subheading && <h2 className={styles.subheading}>{subheading}</h2>}
            </div>
        </div>
    );
};

PageHeader.propTypes = {
    heading: PropTypes.string.isRequired,
    subheading: PropTypes.string,
};

export default PageHeader;


// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTranslate } from '@src/translations/useTranslation';
// import { Button } from '@mckesson/mcp-component-library';
// import { ReactComponent as add_circle_bold } from '@src/assets/image/add_circle_bold.svg';
// import { ReactComponent as upload_bottom } from '@src/assets/image/upload_bottom.svg';
// import { ReactComponent as pencil_write_edit } from '@src/assets/image/pencil-write-edit.svg';
// import './index.scss';

// function PageHeader(props) {
//   const { t } = useTranslate();
//   const navigate = useNavigate();
  
//   const handleClick = () => {
//     const { navigateTo, state } = props;
//     navigate(navigateTo, state ? { state } : {});
//   };

//   return (
//     <div className="flexBox spaceBetween py3">
//       <h1 className="title-style">{props.title}</h1>
//       <div className="flexBox"> 
//         {props.buttonLabels?.add && (
//           <Button Icon={add_circle_bold} className="button-icon" onClick={handleClick} size={'md'}>
//             {props.buttonLabels.add}
//           </Button>
//         )}
//         {props.buttonLabels?.upload && (
//           <Button Icon={upload_bottom} className="button-icon" size={'md'}>
//             {props.buttonLabels.upload}
//           </Button>
//         )}
//         {props.buttonLabels?.edit && (
//           <Button Icon={pencil_write_edit} variant="secondary" className="button-icon" onClick={handleClick} size={'md'}>
//             {props.buttonLabels.edit}
//           </Button>
//         )}
//          {props.buttonLabels?.secondaryadd && (
//           <Button Icon={add_circle_bold} variant="secondary" className="button-icon" onClick={handleClick} size={'md'}>
//             {props.buttonLabels.secondaryadd}
//           </Button>
//         )}
//         {props.children}
//       </div>
//     </div>
//   );
// }

// export default PageHeader;
