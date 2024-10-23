import React, { useState, useMemo } from "react";
import { useRef } from "react";
import styles from "./assets/TruncateCell.module.scss";
import useOverflow from "../../common/hook/UseOverflow";
import { Tooltip } from "../tooltip";

export const TruncateCell = (props) => {
  const { className, tooltipText, tooltipTextWidth } = props;
  const textRef = useRef();

  const isOverflow = useOverflow(textRef);

  const [hovered, eventHandlers] = useHover();

  return (
    <div
      className={`${styles.textTruncate} ${className}`}
      ref={textRef}
      {...eventHandlers}
      data-tag="allowRowEvents"
    >
      <TextWrap
        isOverflow={isOverflow}
        tooltipText={tooltipText}
        className={className}
        content={props.children}
        hovered={hovered}
        data-tag="allowRowEvents"
        tooltipTextWidth={tooltipTextWidth}
      >
        {props.children}
      </TextWrap>
    </div>
  );
};

const TextWrap = (props) => {
  if (props.isOverflow && props.hovered) {
    return (
      <Tooltip
        body={props.tooltipText}
        key={"column-tooltip"}
        isDisabled={false}
        data-tag="allowRowEvents"
        maxW={props?.tooltipTextWidth ? props.tooltipTextWidth : "fit-content"}
      >
        <div
          className={`${styles.textTruncate} ${props.className}`}
          data-tag="allowRowEvents"
        >
          {" "}
          {props.children}{" "}
        </div>
      </Tooltip>
    );
  }

  return props.children;
};

const useHover = () => {
  const [hovered, setHovered] = useState();

  const eventHandlers = useMemo(
    () => ({
      onMouseOver() {
        setHovered(true);
      },
      onMouseOut() {
        setHovered(false);
      },
    }),
    []
  );

  return [hovered, eventHandlers];
};
