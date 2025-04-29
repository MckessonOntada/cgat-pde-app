export const customStylesNormal = {
  headRow: {
    style: {
      backgroundColor: 'var(--brand-color-cool-grey-2) !important',
      minHeight: 'unset'
    }
  },
  headCells: {
    style: {
      padding: '12px 0 12px 16px',
      fontWeight: `var(--brand-font-weight-600)`,
      fontSize: `var(--brand-font-size--default)`,
      lineHeight: `var( --brand-line-height--m-large)`,
      letterSpacing: '-0.001em',
      color: `var(--brand-color-text-blue)`,
      height: '44px', // override the row height
      minHeight: '44px'
      // padding: 0
    }
  },
  rows: {
    style: {
      height: '42px', // override the row height
      minHeight: '42px',
      padding: 0
    }
  },
  cells: {
    style: {
      padding: '12px 0 12px 16px',
      fontWeight: `var(--brand-font-weight-400)`,
      fontSize: `var(--brand-font-size--small)`,
      lineHeight: `var(--brand-line-height--large)`,
      color: `var(--brand-color-background-dark-slate)`,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }
};

export const customStylesCompact = {
  headRow: {
    style: {
      height: '34px', // override the row height
      minHeight: '34px',
      borderBottom: `2px solid var(--brand-color-grey-scale-cool-1)`,
      justifyContent: 'space-between',
      backgroundColor: 'var(--brand-color-cool-grey-2) !important'
    }
  },
  headCells: {
    style: {
      padding: '8px 10px',
      fontWeight: `var(--brand-font-weight-600)`,
      fontSize: `var(--brand-font-size--extra-small)`,
      lineHeight: `var( --brand-line-height--m-large)`,
      letterSpacing: '-0.001em',
      color: `var(--brand-color-text-blue)`,
      height: '34px', // override the row height
      minHeight: '34px'
      // padding: 0
    }
  },
  rows: {
    style: {
      height: '30px', // override the row height
      minHeight: '30px',
      padding: 0,
      justifyContent: 'space-between'
    }
  },
  cells: {
    style: {
      padding: '6px 8px',
      fontWeight: `var(--brand-font-weight-400)`,
      fontSize: `var(--brand-font-size--small)`,
      lineHeight: `var(--brand-line-height--large)`,
      color: `var(--brand-color-background-dark-slate)`
      // padding: 0
    }
  }
};

export function isEqual(obj1, obj2) {
  if (obj1 === obj2) return true;

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (!obj2.hasOwnProperty(key)) return false;
    if (!isEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}
