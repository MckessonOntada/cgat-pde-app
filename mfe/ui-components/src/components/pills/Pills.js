import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./assets/styles/Pills.module.scss";
import Chip from "@mui/material/Chip";
import { ReactComponent as DeletePrimaryIcon } from "./assets/svg/remove-circle-bold.svg";
import { ReactComponent as DeleteSecondaryIcon } from "./assets/svg/remove-circle-blue.svg";
import { ReactComponent as RightArrowButton } from "./assets/svg/arrow-button-right.svg";
import { ReactComponent as LeftArrowButton } from "./assets/svg/arrow-button-left.svg";
import { Tooltip } from "../tooltip";
import { TruncateCell } from "../truncateCell";

export const Pills = ({
  id,
  labels,
  variant,
  size,
  hasDeleteIcon,
  onDelete,
  showPillsCount,
  maxWidth,
  tooltipTextWidth,
  ...rest
}) => {
  const [showMoreLabels, setShowMoreLabels] = useState(false);

  const handleDelete = (id) => {
    onDelete(id);
  };

  const deleteIcon = (variant) => {
    return variant === "primary" ? (
      <DeletePrimaryIcon className={`${styles.deleteIcon} ${styles[size]}`} />
    ) : (
      <DeleteSecondaryIcon className={`${styles.deleteIcon} ${styles[size]}`} />
    );
  };

  const renderLabel = (label, index) => {
    const labelText = label.labelText;

    return (
      <div
        className={`${styles.customLabel} ${styles[size]} ${styles[variant]}`}
      >
        <TruncateCell key={`pills-tooltip-${id}-${index}`} tooltipTextWidth={tooltipTextWidth} tooltipText={labelText}>
          {labelText}
        </TruncateCell>
      </div>
    );
  };

  const remainingCount = labels && labels.length - showPillsCount;
  const renderAdditionalLabels = () => {
    return (
      <div
        className={`${styles.additionalLabel} ${styles[size]}`}
        role={"button"}
        data-testid={"show-more-" + id}
        onClick={() => setShowMoreLabels(!showMoreLabels)}
      >
        <div className={styles.countText}>
          {showMoreLabels ? "Hide" : `+${remainingCount}`}
        </div>
        {!showMoreLabels ? (
          <RightArrowButton className={styles.arrowIcon} />
        ) : (
          <LeftArrowButton className={styles.arrowIcon} />
        )}
      </div>
    );
  };

  return (
    <div className={styles.pillsContainer}>
      {Array.isArray(labels) &&
        labels.map(
          (label, index) =>
            (index < showPillsCount || showMoreLabels) && (
              <Chip
                key={`chip-${label.id}`}
                className={`${styles.pill} ${styles[size]} ${styles[variant]}`}
                label={renderLabel(label)}
                onDelete={hasDeleteIcon ? () => handleDelete(label.id) : null}
                deleteIcon={deleteIcon(variant)}
                style={{
                  maxWidth: maxWidth === "none" ? "unset" : maxWidth,
                }}
                {...rest}
              />
            )
        )}
      {labels?.length > showPillsCount && renderAdditionalLabels()}
    </div>
  );
};

Pills.propTypes = {
  id: PropTypes.string,
  labels: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ),
  size: PropTypes.string,
  variant: PropTypes.string,
  hasDeleteIcon: PropTypes.bool,
  onDelete: PropTypes.func,
  showPillsCount: PropTypes.number,
  maxWidth: PropTypes.string, //pass maxWidth as "none" if you want to remove truncation
  tooltipTextWidth: PropTypes.string
};
Pills.defaultProps = {
  size: "sm",
  variant: "primary",
  labels: [],
  hasDeleteIcon: false,
  showPillsCount: 3,
  maxWidth: "280px",
  tooltipTextWidth: "200px"
};
