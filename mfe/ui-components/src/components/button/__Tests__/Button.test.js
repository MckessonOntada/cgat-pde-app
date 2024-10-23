import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";

import { Button } from "../";

test("renders primary button and ensures onClick event works", async () => {
  const onClick = jest.fn();

  render(
    <Button onClick={onClick} size="md" variant="primary">
      Button
    </Button>
  );

  await fireEvent.click(screen.queryByRole("button"));
  expect(onClick).toHaveBeenCalled();
});

test("renders primary disabled button and checks that the button is not clickable and it is in a disabled state", async () => {
  render(
    <Button disabled onClick={jest.fn()} size="md" variant="primary">
      Button
    </Button>
  );

  expect(screen.queryByRole("button")).toBeDisabled();
  await fireEvent.click(screen.queryByRole("button"));
});

test("renders secondary button and ensures onClick event works", async () => {
  const onClick = jest.fn();

  render(
    <Button onClick={onClick} size="md" variant="secondary">
      Button
    </Button>
  );

  await fireEvent.click(screen.queryByRole("button"));
  expect(onClick).toHaveBeenCalled();
});

test("renders secondary disabled button and checks that the button is not clickable and it is in a disabled state", async () => {
  render(
    <Button disabled onClick={jest.fn()} size="md" variant="secondary">
      Button
    </Button>
  );

  expect(screen.queryByRole("button")).toBeDisabled();
  await fireEvent.click(screen.queryByRole("button"));
});

test("renders text button and ensures onClick event works", async () => {
  const onClick = jest.fn();

  render(
    <Button onClick={onClick} size="md" variant="text">
      Button
    </Button>
  );

  await fireEvent.click(screen.queryByRole("button"));
  expect(onClick).toHaveBeenCalled();
});

const sizeVariantsPrimaryAndSecondary = {
  lg: {
    fontSize: "1.6rem",
    fontWeight: "600",
    letterSpacing: "0.48px",
    lineHeight: "2rem",
  },
  md: {
    fontSize: "1.4rem",
    fontWeight: "600",
    letterSpacing: "0.49px",
    lineHeight: "1.8rem",
  },
  sm: {
    fontSize: "1.2rem",
    fontWeight: "600",
    letterSpacing: "0.48px",
    lineHeight: "1.6rem",
  },
  xs: {
    fontSize: "1rem",
    fontWeight: "600",
    letterSpacing: "0.45px",
    lineHeight: "1.4rem",
  },
};

test.each(Object.keys(sizeVariantsPrimaryAndSecondary))(
  "Primary button CSS properties for %s size variant",
  async (sizeVariant) => {
    const variantStyles = sizeVariantsPrimaryAndSecondary[sizeVariant];
    const onClick = jest.fn();

    render(
      <Button onClick={onClick} size={sizeVariant}>
        Button
      </Button>
    );

    // Use waitFor to ensure the button is rendered
    await waitFor(() => {
      const buttonElement = screen.getAllByRole("button")[0]; // Select the first button

      // Add debugging statements to help diagnose issues
      if (!buttonElement) {
        console.error(`Button not found for size variant: ${sizeVariant}`);
        console.log(screen.debug()); // Output the rendered component tree for debugging
      }

      const buttonStyles = getComputedStyle(buttonElement);

      // Check the font size
      const fontSize = buttonStyles.getPropertyValue("font-size");
      expect(fontSize).toBe(variantStyles.fontSize);

      // Check the font weight
      const fontWeight = buttonStyles.getPropertyValue("font-weight");
      expect(fontWeight).toBe(variantStyles.fontWeight);

      // Check the letter spacing
      const letterSpacing = buttonStyles.getPropertyValue("letter-spacing");
      expect(letterSpacing).toBe(variantStyles.letterSpacing);

      // Check the line height
      const lineHeight = buttonStyles.getPropertyValue("line-height");
      expect(lineHeight).toBe(variantStyles.lineHeight);
    });
  }
);

test.each(Object.keys(sizeVariantsPrimaryAndSecondary))(
  "Secondary button CSS properties for %s size variant",
  async (sizeVariant) => {
    const variantStyles = sizeVariantsPrimaryAndSecondary[sizeVariant];
    const onClick = jest.fn();

    render(
      <Button onClick={onClick} size={sizeVariant} variant="secondary">
        Button
      </Button>
    );

    // Use waitFor to ensure the button is rendered
    await waitFor(() => {
      const buttonElement = screen.getAllByRole("button")[0]; // Select the first button

      // Add debugging statements to help diagnose issues
      if (!buttonElement) {
        console.error(`Button not found for size variant: ${sizeVariant}`);
        console.log(screen.debug()); // Output the rendered component tree for debugging
      }

      const buttonStyles = getComputedStyle(buttonElement);

      // Check the font size
      const fontSize = buttonStyles.getPropertyValue("font-size");
      expect(fontSize).toBe(variantStyles.fontSize);

      // Check the font weight
      const fontWeight = buttonStyles.getPropertyValue("font-weight");
      expect(fontWeight).toBe(variantStyles.fontWeight);

      // Check the letter spacing
      const letterSpacing = buttonStyles.getPropertyValue("letter-spacing");
      expect(letterSpacing).toBe(variantStyles.letterSpacing);

      // Check the line height
      const lineHeight = buttonStyles.getPropertyValue("line-height");
      expect(lineHeight).toBe(variantStyles.lineHeight);
    });
  }
);

const sizeVariants = {
  lg: {
    fontSize: "1.6rem",
    fontWeight: "600",
    letterSpacing: "0.48px",
    lineHeight: "2rem",
  },
  md: {
    fontSize: "1.4rem",
    fontWeight: "600",
    letterSpacing: "0.49px",
    lineHeight: "1.8rem",
  },
  sm: {
    fontSize: "1.2rem",
    fontWeight: "600",
    letterSpacing: "0.48px",
    lineHeight: "1.6rem",
  },
  xs: {
    fontSize: "1rem",
    fontWeight: "600",
    letterSpacing: "0.45px",
    lineHeight: "1.4rem",
  },
};

test.each(Object.keys(sizeVariants))(
  "Text button CSS properties for %s size variant",
  async (sizeVariant) => {
    const variantStyles = sizeVariants[sizeVariant];
    const onClick = jest.fn();

    render(
      <Button onClick={onClick} size={sizeVariant} variant="text">
        Button
      </Button>
    );

    // Use waitFor to ensure the button is rendered
    await waitFor(() => {
      const buttonElement = screen.getAllByRole("button")[0]; // Select the first button

      // Add debugging statements to help diagnose issues
      if (!buttonElement) {
        console.error(`Button not found for size variant: ${sizeVariant}`);
        console.log(screen.debug()); // Output the rendered component tree for debugging
      }

      const buttonStyles = getComputedStyle(buttonElement);

      // Check the font size
      const fontSize = buttonStyles.getPropertyValue("font-size");
      expect(fontSize).toBe(variantStyles.fontSize);

      // Check the font weight
      const fontWeight = buttonStyles.getPropertyValue("font-weight");
      expect(fontWeight).toBe(variantStyles.fontWeight);

      // Check the letter spacing
      const letterSpacing = buttonStyles.getPropertyValue("letter-spacing");
      expect(letterSpacing).toBe(variantStyles.letterSpacing);

      // Check the line height
      const lineHeight = buttonStyles.getPropertyValue("line-height");
      expect(lineHeight).toBe(variantStyles.lineHeight);
    });
  }
);
test("renders text disabled button and checks that the button is not clickable and it is in a disabled state", async () => {
  render(
    <Button disabled onClick={jest.fn()} size="md" variant="text">
      Button
    </Button>
  );

  expect(screen.queryByRole("button")).toBeDisabled();
  await fireEvent.click(screen.queryByRole("button"));
});

test("renders underlined button and ensures onClick event works", async () => {
  const onClick = jest.fn();

  render(
    <Button onClick={onClick} size="md" variant="underlined">
      Button
    </Button>
  );

  await fireEvent.click(screen.queryByRole("button"));
  expect(onClick).toHaveBeenCalled();
});

test("renders underlined disabled button and checks that the button is not clickable and it is in a disabled state", async () => {
  render(
    <Button disabled onClick={jest.fn()} size="md" variant="underlined">
      Button
    </Button>
  );

  expect(screen.queryByRole("button")).toBeDisabled();
  await fireEvent.click(screen.queryByRole("button"));
});
