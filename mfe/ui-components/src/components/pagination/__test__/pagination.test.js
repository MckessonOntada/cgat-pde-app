import { render, screen, prettyDOM, fireEvent } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { Paginate } from "../Pagination";

describe("Pagination", () => {
  it("renders Pagination component", async () => {
    render(<Paginate />);
    const element = screen.getByLabelText("pagination navigation"); // aria-label for pagination bar is `pagination navigation`
    expect(element).toBeTruthy();
  });

  it("renders Next page arrow", async () => {
    render(<Paginate />);
    const element = screen.getByLabelText("Go to next page"); // aria-label for current page is `Go to next page`
    expect(element).toBeTruthy();
    fireEvent.click(element);
  });

  it("renders Previous page arrow", async () => {
    render(<Paginate />);
    const element = screen.getByLabelText("Go to previous page"); // aria-label for current page is `Go to previous page`
    expect(element).toBeTruthy();
    fireEvent.click(element);
  });

  it("renders specified no of pages", async () => {
    const { container } = render(<Paginate totalCount={5} />);
    const elements = container.querySelectorAll(`button`);
    console.log(prettyDOM(container));
    expect(elements.length).toBe(7); // 5 page elements + 2 arrows for prevoius/next pages
  });

  it("current active page is marked", async () => {
    render(<Paginate totalCount={5} currentPage={2} />);
    const element = screen.getByLabelText("page 2"); // aria-label for current page is of format `page <pageNo>`
    expect(element).toBeInTheDocument();
    fireEvent.click(element);
  });
});
