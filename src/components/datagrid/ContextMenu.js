import React, { useState, useRef, useEffect } from "react";
import { _ } from "lodash";
import useUpdateEffect from "./hooks/useUpdateEffect";
import { css } from "@linaria/core";
import clsx from "clsx";
const contextMenuOption = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  min-width: 150px;
  &:hover {
    background-color: #d7e3bc !important;
  }
`;
const contextMenuOptionDisabled = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  min-width: 150px;
  color: red;
`;

const ContextMenu = ({
  items,
  position,
  onClose,
  setSubMenuPosition,
  enableSubMenu,
  setSubMenuItems,
  contextData,
  id,
}) => {
  const contextMenuRef = useRef(null);
  const [localPosition, setLocalPosition] = useState(position);
  const handleItemClick = (item, e) => {
    if (item.action && !item.disabled) {
      item.action({ e, contextData });
      onClose();
    }
  };

  useUpdateEffect(() => {
    if (typeof position === "object" && typeof localPosition === "object") {
      if (
        position.top !== localPosition.top ||
        position.left !== localPosition.left
      ) {
        setLocalPosition({ ...position });
      }
    }
  }, [position]);
  useEffect(() => {
    let post = { left: localPosition.left, top: localPosition.top };
    if (contextMenuRef) {
      const contextMenuWidth =
        contextMenuRef.current?.scrollWidth + localPosition.left;
      let availableWidth = window.innerWidth;
      if (availableWidth < contextMenuWidth) {
        post.left = localPosition.left - contextMenuRef.current?.scrollWidth;
      }
      const contextMenuHeight =
        contextMenuRef.current?.scrollHeight + localPosition.top;
      let availableHeight = window.innerHeight;
      if (availableHeight < contextMenuHeight) {
        post.top = localPosition.top - contextMenuRef.current?.scrollHeight;
      }
      setLocalPosition({ ...post });
    }
  }, [contextMenuRef]);
  function handleClick() {
    onClose();
  }
  useEffect(() => {
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);
  return (
    <div
      id={id}
      style={{
        position: "absolute",
        top: localPosition.top,
        left: localPosition.left,
        zIndex: 1000,
        border: "1px solid #ccc",
        backgroundColor: "white",
        boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
        color:"#000"
      }}
      className="context-menu-container"
      ref={contextMenuRef}
      // onClick={handleContextMenuClick}
    >
      {items?.map((item) => (
        <>
          <div
            key={`context-menu-option-${item.name}`}
            data-testid={`context-menu-option-${item.name}`}
            onClick={(e) => {
              handleItemClick(item, e);
            }}
            style={{
              padding: "8px",
              cursor: item.subMenu ? "pointer" : "default",
              backgroundColor: item.subMenu ? "#f0f0f0" : "transparent",
              ...item.style,
            }}
            className={clsx(
              "context-menu-option",
              { [contextMenuOption]: !item.disabled },
              {
                [contextMenuOptionDisabled]: item.disabled,
              }
            )}
            title={item.tooltip ?? ""}>
            <div className="context-menu-icon" style={{ maxWidth: "10%" }}>
              {item.icon && item.icon()}
            </div>
            <div className="context-menu-title" style={{ textAlign: "center" }}>
              {item.name}
            </div>
            <div
              className="context-menu-expand-icon"
              data-testid={`${item.name}-sub-menu-icon`}
              style={{ width: "10%" }}
              onMouseEnter={(e) => {
                if (item.subMenu) {
                  setSubMenuPosition({
                    top: e.clientY,
                    left: e.clientX,
                  });
                  setSubMenuItems(item.subMenu);
                  enableSubMenu(true);
                }
              }}>
              {item.subMenu && "\u25B6"}
            </div>
          </div>
          {item.divider && (
            <div
              className="context-menu-divider"
              style={{
                height: "1px",
                backgroundColor: "lightgrey",
                width: "100%",
              }}
            />
          )}
        </>
      ))}
    </div>
  );
};

export default ContextMenu;
