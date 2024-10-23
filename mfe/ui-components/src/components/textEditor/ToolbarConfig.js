import { TOOLBAR_ICON } from "./ToolbarIconConstants"

export const toolbarConfig = {
    options: [
      'fontFamily',
      'fontSize',
      'inline',
      'colorPicker',
      'textAlign',
      'list',
      'history',
    ],
    fontSize: {
      options: [8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 30, 36, 48, 60, 72, 96],
    },
    fontFamily: {
      options: ['Arial', 'Georgia', 'Calibri', 'Impact', 'Nunito', 'Open Sans', 'Tahoma', 'Times New Roman', 'Verdana'],
    },
    inline: {
      options: ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript'],
      bold: {
        icon: TOOLBAR_ICON.BOLD,
      },
      italic: {
        icon: TOOLBAR_ICON.ITALIC
      },
      underline: {
        icon: TOOLBAR_ICON.UNDERLINE
      },
      strikethrough: {
        icon: TOOLBAR_ICON.STRIKETHROUGH
      },
      superscript: {
        icon: TOOLBAR_ICON.SUPERSCRIPT,
      },
      subscript: {
        icon: TOOLBAR_ICON.SUBSCRIPT,
      },
    },
    colorPicker: {
      icon: TOOLBAR_ICON.COLORPICKER,
      colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(65,168,95)','rgb(0,168,133)',
              'rgb(84,172,210)', 'rgb(44,130,201)','rgb(147,101,184)', 'rgb(71,85,119)', 
              'rgb(204,204,204)', 'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 
              'rgb(40,50,78)', 'rgb(0,0,0)', 'rgb(247,218,100)', 'rgb(251,160,38)', 
              'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)', 'rgb(239,239,239)', 
              'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
              'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)','rgb(255,105,180)',
              'rgb(255,192,203)', 'rgb(255,20,147)'],
    },
    list: {
      unordered: { icon: TOOLBAR_ICON.UNORDERED_LIST},
      ordered: { icon: TOOLBAR_ICON.ORDERED_LIST},
      indent: { icon: TOOLBAR_ICON.INDENT_LIST },
      outdent: { icon: TOOLBAR_ICON.OUTDENT_LIST },
    },
    textAlign: {
      options: ['left', 'center', 'right', 'justify'],
      left: { icon: TOOLBAR_ICON.LEFT_ALIGN },
      center: { icon: TOOLBAR_ICON.CENTER_ALIGN },
      right: { icon: TOOLBAR_ICON.RIGHT_ALIGN },
      justify: { icon: TOOLBAR_ICON.JUSTIFY },
    },
    history: {
      redo: { icon: TOOLBAR_ICON.REDO },
      undo: { icon: TOOLBAR_ICON.UNDO },
    }
  }