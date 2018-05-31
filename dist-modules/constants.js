'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var KEYS = exports.KEYS = {
  ENTER: 13,
  TAB: 9,
  BACKSPACE: 8,
  UP_ARROW: 38,
  DOWN_ARROW: 40,
  ESCAPE: 27
};

var DEFAULT_PLACEHOLDER = exports.DEFAULT_PLACEHOLDER = 'Add new tag';

var DEFAULT_CLASSNAMES = exports.DEFAULT_CLASSNAMES = {
  tags: 'ReactTags__tags',
  tagInput: 'ReactTags__tagInput',
  tagInputField: 'ReactTags__tagInputField',
  selected: 'ReactTags__selected',
  tag: 'ReactTags__tag',
  remove: 'ReactTags__remove',
  suggestions: 'ReactTags__suggestions',
  activeSuggestion: 'ReactTags__activeSuggestion'
};

var _height = 32;
var _backgroundColor = '#fff';
var _tagBackgroundColor = '#eee';
var _deleteIconColor = 'rgba(0, 0, 0, 0.25)';
var _deleteIconHoverColor = 'rgba(0, 0, 0, 0.40)';

var DEFAULT_STYLES = exports.DEFAULT_STYLES = {
  tags: {
    position: 'relative',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    width: '100%',
    border: '1px solid #ddd',
    minHeight: '48px',
    maxHeight: '96px',
    overflowX: 'hidden',
    overflowY: 'auto',
    padding: '5px'
  },
  tagInput: {
    width: '200px',
    borderRadius: '0',
    fontSize: '13px',
    display: 'inline-block',
    marginLeft: '4px'
  },
  tagInputField: {
    height: '31px',
    fontSize: '13px',
    width: '100%',
    border: 'none !important',
    margin: '5px',
    outline: 'none'
  },
  selected: {
    fontSize: '13px',
    display: 'inline-block',
    cursor: 'move',
    borderRadius: '0'
  },
  tag: {
    border: 'none',
    alignItems: 'center',
    background: _tagBackgroundColor,
    fontSize: '13px',
    display: 'inline-flex',
    height: _height,
    padding: '0',
    margin: '5px',
    cursor: 'move',
    borderRadius: _height / 2
  },
  tagLabel: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12,
    userSelect: 'none',
    whiteSpace: 'nowrap',
    cursor: 'inherit'
  },
  remove: {
    margin: '0 4px 0 -8px',
    cursor: 'pointer',
    width: '22px',
    height: '22px',
    alignItems: 'center',
    '& svg': {
      fill: _deleteIconColor
    },
    '& :hover *': {
      fill: _deleteIconHoverColor
    }
  },
  suggestions: {
    position: 'absolute',
    zIndex: '65535',
    marginTop: '-4px',
    minHeight: '16px',
    maxHeight: 'calc(100vh - 300px)',
    background: 'white',
    width: '200px',
    overflow: 'auto',
    boxShadow: '.05em .01em .5em rgba(0,0,0,.2)',
    '& ul': {
      listStyleType: 'none',
      padding: '0',
      margin: '0'
    },
    '& li': {
      color: 'rgba(0, 0, 0, 0.87)',
      fontWeight: '400',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      lineHeight: '24px',
      fontSize: '14px',
      paddingLeft: '16px',
      paddingRight: '16px',
      paddingTop: '12px',
      paddingBottom: '12px',
      verticalAlign: 'middle',
      margin: '0',
      '& mark': {
        textDecoration: 'underline',
        background: 'none',
        fontWeight: '600'
      },
      '@media (min-width: 600px)': {
        paddingLeft: '24px',
        paddingRight: '24px'
      }
    }
  },
  activeSuggestion: {
    transition: 'background 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    transitionProperty: 'background',
    transitionDuration: '150ms',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    transitionDelay: '0ms',
    background: 'rgba(0, 0, 0, 0.08)',
    cursor: 'pointer'
  }
};