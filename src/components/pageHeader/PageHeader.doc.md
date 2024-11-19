# `ModuleHeader` Component

The `ModuleHeader` component provides a flexible header section for modules or sub-modules, with customizable heading, subheading, and action controls. It supports variants to adjust the layout or styling.

## Props

| Prop         | Type     | Description                                                                                          | Default |
|--------------|----------|------------------------------------------------------------------------------------------------------|---------|
| `heading`    | `string` | The primary heading text displayed in the header.                                                   | `""`    |
| `subheading` | `string` | The secondary heading text displayed below the primary heading (optional).                          | `""`    |
| `variant`    | `string` | Specifies the layout or styling variant for the header. Supported values: `"l1"`, `"l2"`.            | `"l1"`  |
| `children`   | `node`   | Action controls (e.g., buttons, search fields) rendered on the right side of the header.            | `null`  |

## Usage

### Import

```javascript
import ModuleHeader from './ModuleHeader';
import Button from './Button'; // Example button component
```

### Example 1: `l1` Variant

```javascript
<ModuleHeader
    heading={"Primary Heading"}
    subheading={"Secondary Heading"}
    variant={"l1"}
>
    <Button size="md" variant="secondary">Add</Button>
    <Button size="md">Upload</Button>
</ModuleHeader>
```

**Preview**:

- Displays the `Primary Heading` and `Secondary Heading` with the `l1` layout.
- Includes two buttons (`Add` and `Upload`) as controls on the right side.

### Example 2: `l2` Variant

```javascript
<ModuleHeader
    heading={"Primary Heading"}
    subheading={"Secondary Heading"}
    variant={"l2"}
>
    <Button size="md" variant="secondary">Add</Button>
    <Button size="md">Upload</Button>
</ModuleHeader>
```

**Preview**:

- Displays the `Primary Heading` and `Secondary Heading` with the `l2` layout.
- Includes two buttons (`Add` and `Upload`) as controls on the right side.

## Styling

Variants (`l1` and `l2`) allow for layout and style adjustments. Ensure appropriate styles are defined for these variants in your CSS/SCSS.

### Example Styling (SCSS)

```scss
.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;

  &.l1 {
    border-bottom: 1px solid #ddd;

    .heading {
      font-size: 1.5rem;
    }

    .subheading {
      font-size: 1rem;
      color: #666;
    }
  }

  &.l2 {
    background-color: #f9f9f9;

    .heading {
      font-size: 1.25rem;
    }

    .subheading {
      font-size: 0.9rem;
      color: #999;
    }
  }

  .controls {
    > * {
      margin-left: 0.5rem;
    }
  }
}
```

## Notes

- Customize styles for the `l1` and `l2` variants as needed for your application's theme.
- The `children` prop is flexible, allowing you to pass any React components like buttons, inputs, or custom controls.
