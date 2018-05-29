export const KEYS = {
  ENTER: 13,
  TAB: 9,
  BACKSPACE: 8,
  UP_ARROW: 38,
  DOWN_ARROW: 40,
  ESCAPE: 27,
};

export const DEFAULT_PLACEHOLDER = 'Add new tag';

export const DEFAULT_CLASSNAMES = {
  tags: 'ReactTags__tags',
  tagInput: 'ReactTags__tagInput',
  tagInputField: 'ReactTags__tagInputField',
  selected: 'ReactTags__selected',
  tag: 'ReactTags__tag',
  remove: 'ReactTags__remove',
  suggestions: 'ReactTags__suggestions',
  activeSuggestion: 'ReactTags__activeSuggestion',
};

const _height = 32;
const _backgroundColor = '#fff';
const _tagBackgroundColor = '#eee';
const _deleteIconColor = 'rgba(0, 0, 0, 0.25)';
const _deleteIconHoverColor = 'rgba(0, 0, 0, 0.40)';

export const DEFAULT_STYLES = {
  tags: {
    position: 'relative',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    width: '100%',
    border: '1px solid #ddd',
    minHeight: '48px',
    maxHeight: '96px',
    overflowX: 'hidden',
    overflowY: 'auto',
    padding: '5px',
  },
  tagInput: {
    width: '200px',
    borderRadius: '0',
    fontSize: '13px',
    display: 'inline-block',
    marginLeft: '4px',
  },
  tagInputField: {
    height: '31px',
    fontSize: '13px',
    width: '100%',
    border: 'none !important',
    margin: '5px',
    outline: 'none',
  },
  selected: {
    fontSize: '13px',
    display: 'inline-block',
    cursor: 'move',
    borderRadius: '0',
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
    borderRadius: _height / 2,
  },
  tagLabel: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12,
    userSelect: 'none',
    whiteSpace: 'nowrap',
    cursor: 'inherit',
  },
  remove: {
    margin: '0 4px 0 -8px',
    cursor: 'pointer',
    width: '22px',
    height: '22px',
    alignItems: 'center',
    '& svg': {
      fill: _deleteIconColor,
    },
    '& :hover *': {
      fill: _deleteIconHoverColor,
    },
  },
  suggestions: {
    position: 'absolute',
    zIndex: '65535',
    marginTop: '-4px',
    maxHeight: '300px',
    background: 'white',
    width: '200px',
    overflow: 'auto',
    boxShadow: '.05em .01em .5em rgba(0,0,0,.2)',  
    '& ul': {
      listStyleType: 'none',
      padding: '0',
      margin: '0',
    },
    '& li': {
      borderBottom: '1px solid #ddd',
      fontSize: '14px',
      lineHeight: '24px',
      padding: '5px 10px',
      margin: '0',
      '& mark': {
        textDecoration: 'underline',
        background: 'none',
        fontWeight: '600',
      },
    },
  },
  activeSuggestion: {
    background: '#b7cfe0',
    cursor: 'pointer',
  },
};
