import React from 'react';
import { render, screen } from '@testing-library/react';
import EmptyNotificationView from './EmptyNotificationsView';

// Mock the SVG import
jest.mock('../../assets/svg/noNotifications.svg', () => ({
    ReactComponent: () => <svg data-testid="no-notifications-icon" />,
}));

// Mock styles
jest.mock('./EmptyNotificationsView.module.scss', () => ({
    noNotificationsWrapper: 'noNotificationsWrapper',
    noNotificationsDrawerWrapper: 'noNotificationsDrawerWrapper',
    noNotifications: 'noNotifications',
    noNotificationsText: 'noNotificationsText',
    noNotificationsSubtext: 'noNotificationsSubtext',
}));

describe('EmptyNotificationView', () => {
    const defaultText = 'No notifications';
    const defaultSubtext = 'You have no new notifications.';

    it('renders with main view styles and displays text and subtext', () => {
        render(
            <EmptyNotificationView
                isDrawerView={false}
                text={defaultText}
                subtext={defaultSubtext}
            />
        );
        expect(screen.getByText(defaultText)).toBeInTheDocument();
        expect(screen.getByText(defaultSubtext)).toBeInTheDocument();
        // Find the wrapper by class name
        const wrapper = screen.getByClass('noNotificationsWrapper');
        expect(wrapper).not.toBeNull();
    });

    it('renders with drawer view styles when isDrawerView is true', () => {
        render(
            <EmptyNotificationView
                isDrawerView={true}
                text={defaultText}
                subtext={defaultSubtext}
            />
        );
        // Find the wrapper by class name
        const wrapper = screen.getByClass('noNotificationsDrawerWrapper');
        expect(wrapper).not.toBeNull();
    });

    it('renders the no notifications SVG icon', () => {
        render(
            <EmptyNotificationView
                isDrawerView={false}
                text={defaultText}
                subtext={defaultSubtext}
            />
        );
        expect(screen.getByTestId('no-notifications-icon')).toBeInTheDocument();
    });

    it('renders correctly when text or subtext is missing', () => {
        render(
            <EmptyNotificationView
                isDrawerView={false}
                text=""
                subtext=""
            />
        );
        // Should render empty divs for text and subtext
        const textDiv = screen.getByClass('noNotificationsText');
        const subtextDiv = screen.getByClass('noNotificationsSubtext');
        expect(textDiv).toBeInTheDocument();
        expect(subtextDiv).toBeInTheDocument();
        expect(textDiv.textContent).toBe('');
        expect(subtextDiv.textContent).toBe('');
    });

    it('applies correct class names to text and subtext elements', () => {
        render(
            <EmptyNotificationView
                isDrawerView={false}
                text={defaultText}
                subtext={defaultSubtext}
            />
        );
        const textDiv = screen.getByText(defaultText);
        const subtextDiv = screen.getByText(defaultSubtext);
        expect(textDiv.className).toContain('noNotificationsText');
        expect(subtextDiv.className).toContain('noNotificationsSubtext');
    });

    it('renders only text when subtext is missing', () => {
        render(
            <EmptyNotificationView
                isDrawerView={false}
                text={defaultText}
                subtext=""
            />
        );
        expect(screen.getByText(defaultText)).toBeInTheDocument();
        const subtextDiv = screen.getByClass('noNotificationsSubtext');
        expect(subtextDiv.textContent).toBe('');
    });

    it('renders only subtext when text is missing', () => {
        render(
            <EmptyNotificationView
                isDrawerView={false}
                text=""
                subtext={defaultSubtext}
            />
        );
        expect(screen.getByText(defaultSubtext)).toBeInTheDocument();
        const textDiv = screen.getByClass('noNotificationsText');
        expect(textDiv.textContent).toBe('');
    });
});

// Add getByClass helper for querying by class name
import { configure } from '@testing-library/dom';
configure({
    testIdAttribute: 'data-testid',
});

function getByClass(className) {
    const el = document.querySelector(`.${className}`);
    if (!el) throw new Error(`Unable to find element by class: ${className}`);
    return el;
}
screen.getByClass = getByClass;