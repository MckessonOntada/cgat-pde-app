import PropTypes from "prop-types";
import React, { useMemo, memo } from "react";
import { IconButton } from "../iconButton";
import { Badge } from "../badge";
import CARD_TYPE from "./constants/CardConstants";
import cardStyles from "./assets/Card.module.scss";
import useWindowSize from "../../common/hook/UseWindowSize";
import { ReactComponent as ChevronUp } from "../../../src/assets/svg/chevronUp.svg";
import { ReactComponent as ChevronDown } from "../../../src/assets/svg/chevronDown.svg";

const CardHeader = memo(
  ({ badge, title, showArrow, isExpand, headerToolbar, handleClick, uId }) => {
    const memoizedBadge = useMemo(() => badge, [badge]);
    let windowSize = useWindowSize();
    const isMobileView = () => {
      return windowSize.width < 576;
    };

    return (
      <div className={cardStyles.card_header} data-testid="cardHeaderComp">
        <div className={cardStyles.title_wrap}>
          {title}
          {memoizedBadge &&
            memoizedBadge.length > 0 &&
            memoizedBadge.map(
              (e, idx) =>
                e && (
                  <div
                    key={idx}
                    className={cardStyles.pl_16 + " d-none d-md-block"}
                  >
                    <Badge text={e} />
                  </div>
                )
            )}
        </div>
        {showArrow && (
          <div className={cardStyles.d_flex}>
            <div className={cardStyles.icon_wrap}>
              <div className={cardStyles.flexContainer}>
                {memoizedBadge &&
                  memoizedBadge.length > 0 &&
                  memoizedBadge.map(
                    (e, idx) =>
                      e && (
                        <div key={idx} className="d-sm-block d-md-none pl-6">
                          <Badge text={e} />
                        </div>
                      )
                  )}
              </div>
              <div className={cardStyles.flexContainer}>
                {headerToolbar &&
                  !isExpand &&
                  headerToolbar.length > 0 &&
                  headerToolbar.map(
                    (item, index) =>
                      item.display && (
                        <div
                          key={index}
                          className={`${cardStyles.icon_color} ${cardStyles.button_wrap}`}
                          onClick={(e) => {
                            item.iconFn && item.iconFn(e);
                            e.stopPropagation();
                          }}
                        >
                          {item.icon}
                        </div>
                      )
                  )}
              </div>
            </div>
            <div data-testid="expandBtn">
              <IconButton
                className={cardStyles.arrow_style}
                onClick={handleClick}
                variant="tertiary"
                iconButton={true}
                textButton={false}
                size={isMobileView() ? "md" : "lg"}
                Icon={isExpand ? ChevronUp : ChevronDown}
                aria-expanded={isExpand ? "true" : "false"}
                aria-describedby={uId}
                aria-controls={uId}
                ariaLabel="card button"
              />
            </div>
          </div>
        )}
      </div>
    );
  }
);

const CardBody = memo(({ bodyContent }) => {
  return (
    <div data-testid="cardBody" className={cardStyles.body_wrap}>
      {bodyContent}
    </div>
  );
});

const CardFooter = memo(({ footerContent }) => {
  return (
    <div data-testid="cardFooter" className={cardStyles.body_wrap}>
      {footerContent}
    </div>
  );
});

export const Card = memo(
  ({
    header,
    footerContent,
    bodyContent,
    type,
    headerToolbar,
    badge,
    padding,
    width,
    uniqueId,
    currentExpandedCard,
    onExpandCard,
  }) => {
    const uId = Date.now();


    const handleClick = () => {
      onExpandCard(uniqueId);
    };

    const isCardExpanded = () => {
      if (type === CARD_TYPE.ACCORDION) {
        return currentExpandedCard === uniqueId;
      } else {
        return true;
      }
    };

    return (
      <div
        className={`${cardStyles.card_wrap} ${width} ${
          isCardExpanded() && type === CARD_TYPE.ACCORDION
            ? cardStyles.card_expand
            : type !== CARD_TYPE.ACCORDION && cardStyles.h_auto + " " + padding
        }`}
        id={uId}
        data-testid="cardcomp"
      >
        <CardHeader
          badge={badge}
          title={header}
          showArrow={type === CARD_TYPE.ACCORDION}
          isExpand={isCardExpanded()}
          headerToolbar={headerToolbar}
          handleClick={handleClick}
          uId={uId}
        />
        {isCardExpanded() && (
          <div className={cardStyles.cardContainer} data-testid="checkcard">
            <div className={cardStyles.container}>
              <CardBody bodyContent={bodyContent} />
            </div>
            <div className={cardStyles.footer_container}>
              <CardFooter footerContent={footerContent} />
            </div>
          </div>
        )}
      </div>
    );
  }
);

Card.propTypes = {
  header: PropTypes.any,
  footerContent: PropTypes.any,
  bodyContent: PropTypes.any,
  type: PropTypes.string,
  headerToolbar: PropTypes.any,
  badge: PropTypes.any,
  uniqueId: PropTypes.any,
  currentExpandedCard: PropTypes.any,
  onExpandCard: PropTypes.any,
  padding: PropTypes.string,
  width: PropTypes.string,
};
