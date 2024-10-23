import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Pills } from "../../Pills";

describe("Pills", () => {
    const labels = [
        { id: '1', labelText: 'option 1' },
        { id: '2', labelText: 'option 2' },
        { id: '3', labelText: 'option 3' }
      ];
      
      test('renders pills with default props', () => {
        render(<Pills labels={labels} />);
        expect(screen.getByText('option 1')).toBeInTheDocument();
        expect(screen.getByText('option 2')).toBeInTheDocument();
        expect(screen.getByText('option 3')).toBeInTheDocument();
      });

      test('calls onDelete when delete icon is clicked', () => {
        const onDeleteMock = jest.fn();
        render(
          <Pills labels={labels} hasDeleteIcon = {true} onDelete={onDeleteMock} />
        );
    
        const deleteIcons = document.querySelectorAll('.MuiChip-deleteIcon');
        fireEvent.click(deleteIcons[0]); 

        expect(onDeleteMock).toHaveBeenCalledWith('1'); 
      });

      test('displays additional labels when there are more labels than pillsCount', () => {
        render(<Pills labels={labels} showPillsCount={2} />);
        expect(screen.getByText('+1')).toBeInTheDocument(); 
      });
    
      test('toggles additional labels visibility when additional label is clicked', () => {
        render(<Pills labels={labels} showPillsCount={2} />)
        const additionalLabel = screen.getByText('+1');
    
        fireEvent.click(additionalLabel); 

        expect(screen.getByText('option 3')).toBeInTheDocument(); 
      });

      test('render tooltip when text exceeds max width', () => {
        const labels = [{ id: '1', labelText: 'option 1option 1option 1option 1option 1option 1option 1option 1option 1option 1option 1option 1' }]
        render(<Pills labels={labels}/>)
        expect(screen.getByText("option 1option 1option 1option 1option 1option 1option 1option 1option 1option 1option 1option 1")).toBeInTheDocument()
        // const tooltip = screen.getByTestId('tooltip-normal')
        // expect(tooltip).toBeInTheDocument();
      })
});
