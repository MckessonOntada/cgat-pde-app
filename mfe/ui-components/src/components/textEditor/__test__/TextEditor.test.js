import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React, { useState } from "react";
import { TextEditor } from "../TextEditor";
import { EditorState } from 'draft-js';

const MockTextEditor = (props) => {
    return (
        <TextEditor
            isRequired={true}
            {...props}
        />
    );
};


/*   jest.mock('draft-js', () => ({
    ...jest.requireActual('draft-js'),
    EditorState: {
      createEmpty: jest.fn(() => ({
        getCurrentContent: jest.fn(() => ({
          getPlainText: jest.fn(() => ({
            length: 0 // Mock the length
          }))
        }))
      }))
    }
  })); */

describe("TextEditor", () => {
    it("should render text editor toolbar", async () => {
        const setTemplate = jest.fn()
        const { container } = render(<TextEditor setTemplate={setTemplate} />);
        const editorElement = container.querySelector('.rdw-editor-toolbar');
        expect(editorElement).toBeInTheDocument();
        expect(editorElement).toHaveClass('rdw-editor-toolbar');
    });
    it("should render text editor", async () => {
        const setTemplate = jest.fn()
        const { container } = render(<TextEditor setTemplate={setTemplate} />);
        const editorElement = container.querySelector('.rdw-editor-main');
        expect(editorElement).toBeInTheDocument();
        expect(editorElement).toHaveClass('rdw-editor-main');
    });
    it("should render required text and icon", async () => {
        const setTemplate = jest.fn()
        render(<MockTextEditor id={'tedit'} setTemplate={setTemplate} />);
        const element = screen.getByTestId("reqCompo-tedit");
        expect(element).toBeTruthy();
    });
    it("should render maximum character limit counter", async () => {
        const setTemplate = jest.fn()
        render(<MockTextEditor setTemplate={setTemplate} />);
        const element = screen.getByTestId("max-char-counter");
        expect(element).toBeTruthy();
    });
    test('should display char-limit-reached warning in text counter when limit reached', () => {
        const setTemplate = jest.fn()
        render(
            <MockTextEditor 
                jestTestData={{ setWarning: true }} 
                setTemplate={setTemplate} 
                maxCharLimit={10} />
        );
        const element = screen.getByTestId('char-limit-reached')
        expect(element).toBeTruthy();
    });
    test('should render the template passed to editor', () => {
        const setTemplate = jest.fn()
        render(
            <MockTextEditor
                template={'<p>Test text</p>'}
                setTemplate={setTemplate}
                maxCharLimit={10} />
        );
        const element = screen.getByText('Test text')
        expect(element).toBeTruthy();
    });
});
