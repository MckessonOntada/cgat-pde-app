import React, { useState } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Modal } from "../Modal";
import { Desktop, Mobile } from "../../../stories/Modal.stories";

describe("Modal from stories", () => {
  test("Desktop type renders correctly", async () => {
    render(<Desktop />);
    const elem = screen.getByTestId("desktop-modal-modal");
    expect(elem).toBeInTheDocument();
  });

  test("Mobile type renders correctly", async () => {
    render(<Mobile />);
    const elem = screen.getByTestId("mobile-modal-modal");
    expect(elem).toBeInTheDocument();
  });
});

const modalCommonProps = {
  title: "Modal title",
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut",
  footer: "Modal footer",
};
const MockModal = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(!isOpen);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div onClick={openModal} data-testid="modal-trigger">
        Open Modal
      </div>
      <Modal
        id="mock"
        isOpen={isOpen}
        onClose={closeModal}
        isMobileView={props.isMobileView}
        modalTitle={modalCommonProps.title}
        modalBody={modalCommonProps.body}
        modalFooter={modalCommonProps.footer}
        modalSize={props.modalSize}
      />
    </>
  );
};

describe("Modal Component", () => {
  test("modal should open on event trigger", async () => {
    render(<MockModal isMobileView={false} />);
    const btnElem = screen.getByTestId("modal-trigger");
    fireEvent.click(btnElem);

    const modal = screen.getByTestId("desktop-modal-mock");
    expect(modal).toBeInTheDocument();
  });

  test("modal should close on close button click", async () => {
    render(<MockModal isMobileView={false} />);
    const btnElem = screen.getByTestId("modal-trigger");
    fireEvent.click(btnElem);

    const modal = screen.getByTestId("desktop-modal-mock");
    expect(modal).toBeInTheDocument();

    const closeBtnElem = screen.getByTestId("modal-close-mock");
    fireEvent.click(closeBtnElem);
    await waitFor(() => {
      expect(modal).not.toBeInTheDocument();
    });
  });

  test("modal should render header", async () => {
    render(<MockModal isMobileView={false} />);
    const btnElem = screen.getByTestId("modal-trigger");
    fireEvent.click(btnElem);

    const modal = screen.getByTestId("desktop-modal-mock");
    expect(modal).toBeInTheDocument();

    const dialogElem = screen.getByRole("dialog");
    const headerElem = dialogElem.firstChild;
    expect(headerElem.textContent).toBe(modalCommonProps.title);
  });

  test("modal should render content", async () => {
    render(<MockModal isMobileView={false} />);
    const btnElem = screen.getByTestId("modal-trigger");
    fireEvent.click(btnElem);

    const modal = screen.getByTestId("desktop-modal-mock");
    expect(modal).toBeInTheDocument();

    const dialogElem = screen.getByRole("dialog");
    const contentElem = dialogElem.children[1];
    expect(contentElem.textContent).toBe(modalCommonProps.body);
  });

  test("modal should render footer", async () => {
    render(<MockModal isMobileView={false} />);
    const btnElem = screen.getByTestId("modal-trigger");
    fireEvent.click(btnElem);

    const modal = screen.getByTestId("desktop-modal-mock");
    expect(modal).toBeInTheDocument();

    const dialogElem = screen.getByRole("dialog");
    const footerElem = dialogElem.lastChild;
    expect(footerElem.textContent).toBe(modalCommonProps.footer);
  });

  let sizes = [
    {
      size: "xxxxs",
      width: "272px",
    },
    {
      size: "xxxs",
      width: "452px",
    },
    {
      size: "xxs",
      width: "608px",
    },
    {
      size: "xs",
      width: "764px",
    },
    {
      size: "sm",
      width: "920px",
    },
    {
      size: "md",
      width: "1076px",
    },
    {
      size: "lg",
      width: "1232px",
    },
    {
      size: "xl",
      width: "1388px",
    },
    {
      size: "xxl",
      width: "1544px",
    },
    {
      size: "xxxl",
      width: "1700px",
    },
    {
      size: "4xl",
      width: "1800px",
    },
  ];

  for (const props of sizes) {
    test("modal should respect each variant size " + props.size, () => {
      window.innerWidth = 1890; // Set it to the desired width.
      render(<MockModal modalSize={props.size} isMobileView={false} />);
      const btnElem = screen.getByTestId("modal-trigger");
      fireEvent.click(btnElem);
      const modal = screen.getByTestId("desktop-modal-mock");
      expect(modal).toBeInTheDocument();
      const dialogElem = screen.getByRole("dialog");
      const modalStyle = window.getComputedStyle(dialogElem);
      let width = modalStyle.maxWidth;
      expect(width).toBe(props.width);
    });
  }
});
