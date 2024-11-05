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
      fontSize: `var(--brand-font-size--small)`,
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
      color: `var(--brand-color-background-dark-slate)`
      // padding: 0
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

export const customStylesModal = {
  ...customStylesNormal,
  headRow: {
    style: {
      minHeight: 'unset'
    }
  },
  headCells: {
    style: {
      ...customStylesNormal.headCells.style,
      color: `var(--brand-color-black-1)`
    }
  },
  rows: {
    style: {
      minHeight: '42px',
      padding: 0
    }
  }
};

export const customStylesBorderless = {
  ...customStylesNormal,
  headRow: {
    style: {
      minHeight: 'unset'
    }
  }
};
