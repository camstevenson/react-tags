import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { noop, uniq } from 'lodash';
import Suggestions from './Suggestions';
import PropTypes from 'prop-types';
import Tag from './Tag';
import { buildRegExpFromDelimiters } from './utils';
import injectSheet, {ThemeProvider} from 'react-jss';

//Constants
import { KEYS, DEFAULT_PLACEHOLDER, DEFAULT_STYLES } from './constants';

class ReactTags extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    placeholder: PropTypes.string,
    labelField: PropTypes.string,
    suggestions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })),
    delimiters: PropTypes.arrayOf(PropTypes.number),
    autofocus: PropTypes.bool,
    inline: PropTypes.bool,
    handleDelete: PropTypes.func,
    handleAddition: PropTypes.func,
    handleDrag: PropTypes.func,
    handleFilterSuggestions: PropTypes.func,
    handleTagClick: PropTypes.func,
    allowDeleteFromEmptyInput: PropTypes.bool,
    allowAdditionFromPaste: PropTypes.bool,
    //  If true, free-form tags can be typed in
    allowWriteIns: PropTypes.bool,
    handleInputChange: PropTypes.func,
    handleInputFocus: PropTypes.func,
    handleInputBlur: PropTypes.func,
    minQueryLength: PropTypes.number,
    shouldRenderSuggestions: PropTypes.func,
    removeComponent: PropTypes.func,
    autocomplete: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    readOnly: PropTypes.bool,
    classNames: PropTypes.object,
    name: PropTypes.string,
    id: PropTypes.string,
    maxLength: PropTypes.string,
    inputValue: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.any.isRequired,
    })),
  };

  static defaultProps = {
    placeholder: DEFAULT_PLACEHOLDER,
    suggestions: [],
    delimiters: [KEYS.ENTER, KEYS.TAB],
    autofocus: true,
    inline: true,
    handleDelete: noop,
    handleAddition: noop,
    allowDeleteFromEmptyInput: true,
    allowAdditionFromPaste: true,
    allowWriteIns: true,
    autocomplete: false,
    readOnly: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      suggestions: this.props.suggestions,
      query: '',
      isFocused: false,
      selectedIndex: -1,
      selectionMode: false,
    };

    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.moveTag = this.moveTag.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
    this.resetAndFocusInput = this.resetAndFocusInput.bind(this);
    this.handleSuggestionHover = this.handleSuggestionHover.bind(this);
    this.handleSuggestionClick = this.handleSuggestionClick.bind(this);
  }

  componentWillMount() {
    this.setState({
      classNames: { ...this.props.classes, ...this.props.classNames },
    });
  }

  componentDidMount() {
    const { autofocus, readOnly } = this.props;
    if (autofocus && !readOnly) {
      this.resetAndFocusInput();
    }
  }

  componentWillReceiveProps(props) {
    const suggestions = this.filteredSuggestions(
      this.state.query,
      props.suggestions,
      props.tags
    );
    this.setState({
      suggestions,
      classNames: { ...this.props.classes, ...props.classNames },
    });
  }

  resetAndFocusInput() {
    this.setState({ query: '' });
    if (this.textInput) {
      this.textInput.value = '';
      this.textInput.focus();
    }
  }

  filteredSuggestions(query, suggestions, tags) {
    if (this.props.handleFilterSuggestions) {
      return this.props.handleFilterSuggestions(query, suggestions);
    }

    return suggestions.filter(function(item) {
      if (item.text.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        let existingMatches = tags.filter(existingMatch => {
          return item.id === existingMatch.id;
        });
        return existingMatches.length === 0;
      } else {
        return false;
      }
    });
  }

  handleDelete(i, e) {
    this.props.handleDelete(i, e);
    this.textInput = null;
    this.setState({ query: '' });

    e.stopPropagation();
  }

  handleTagClick(i, e) {
    if (this.props.handleTagClick) {
      this.props.handleTagClick(i, e);
    }
    this.textInput = null;
    this.setState({ query: '' });
  }

  handleChange(e) {
    if (this.props.handleInputChange) {
      this.props.handleInputChange(e.target.value.trim());
    }

    const query = e.target.value.trim();
    const suggestions = this.filteredSuggestions(
      query,
      this.props.suggestions,
      this.props.tags
    );

    const { selectedIndex } = this.state;

    this.setState({
      query: query,
      suggestions: suggestions,
      selectedIndex:
        selectedIndex >= suggestions.length
          ? suggestions.length - 1
          : selectedIndex,
    });
  }

  handleFocus(e) {
    const value = e.target.value.trim();
    if (this.props.handleInputFocus) {
      this.props.handleInputFocus(value);
    }
    this.setState({ isFocused: true });
  }

  handleBlur(e) {
    const value = e.target.value.trim();
    if (this.props.handleInputBlur) {
      this.props.handleInputBlur(value);
      if (this.textInput) {
        this.textInput.value = '';
      }
    }
    //this.setState({ isFocused: false });
  }

  handleKeyDown(e) {
    const { query, selectedIndex, suggestions, selectionMode } = this.state;

    // hide suggestions menu on escape
    if (e.keyCode === KEYS.ESCAPE) {
      e.preventDefault();
      e.stopPropagation();
      this.setState({
        selectedIndex: -1,
        selectionMode: false,
        suggestions: [],
      });
    }

    // When one of the terminating keys is pressed, add current query to the tags.
    // If no text is typed in so far, or if write-ins are not allowed, ignore the action - so we don't end
    // up with a terminating character typed in.
    if (this.props.delimiters.indexOf(e.keyCode) !== -1 && !e.shiftKey) {
      if (e.keyCode !== KEYS.TAB || query !== '') {
        e.preventDefault();
      }

      const selectedSuggestion =
        selectionMode && selectedIndex !== -1
          ? suggestions[selectedIndex]
          : '';

      const selectedQuery =
        selectedSuggestion === '' && this.props.allowWriteIns
          ? { id: query, text: query }
          : selectedSuggestion;

      if (selectedQuery !== '') {
        this.addTag(selectedQuery);
      }
    }

    // when backspace key is pressed and query is blank, delete tag
    if (
      e.keyCode === KEYS.BACKSPACE &&
      query === '' &&
      this.props.allowDeleteFromEmptyInput
    ) {
      this.handleDelete(this.props.tags.length - 1, e);
    }

    // up arrow
    if (e.keyCode === KEYS.UP_ARROW) {
      e.preventDefault();
      this.setState({
        selectedIndex:
          selectedIndex <= 0 ? suggestions.length - 1 : selectedIndex - 1,
        selectionMode: true,
      });
    }

    // down arrow
    if (e.keyCode === KEYS.DOWN_ARROW) {
      e.preventDefault();
      this.setState({
        selectedIndex:
          suggestions.length === 0
            ? -1
            : (selectedIndex + 1) % suggestions.length,
        selectionMode: true,
      });
    }
  }

  handlePaste(e) {
    if (!this.props.allowAdditionFromPaste || !this.props.allowWriteIns) {
      return;
    }

    e.preventDefault();

    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedText = clipboardData.getData('text');

    // Used to determine how the pasted content is split.
    const delimiterRegExp = buildRegExpFromDelimiters(this.props.delimiters);
    const tags = pastedText.split(delimiterRegExp);

    // Only add unique tags
    uniq(tags).forEach((tag) => this.addTag({ id: tag, text: tag }));
  }

  addTag(tag) {
    if (!tag.id && !tag.text) {
      return;
    }
    const { tags } = this.props;
    const existingKeys = tags.map((tag) => tag.id.toLowerCase());
    // Return if tag has been already added
    if (existingKeys.indexOf(tag.id.toLowerCase()) >= 0) {
      return;
    }
    if (this.props.autocomplete) {
      const possibleMatches = this.filteredSuggestions(
        tag,
        this.props.suggestions,
        this.props.tags
      );

      if (
        (this.props.autocomplete === 1 && possibleMatches.length === 1) ||
        (this.props.autocomplete === true && possibleMatches.length)
      ) {
        tag = possibleMatches[0];
      }
    }

    // call method to add
    this.props.handleAddition(tag);

    // reset the state
    this.setState({
      query: '',
      selectionMode: false,
      selectedIndex: -1,
    });

    this.resetAndFocusInput();
  }

  handleSuggestionClick(i) {
    this.addTag(this.state.suggestions[i]);
  }

  handleSuggestionHover(i) {
    this.setState({
      selectedIndex: i,
      selectionMode: true,
    });
  }

  moveTag(dragIndex, hoverIndex) {
    const tags = this.props.tags;

    // locate tags
    const dragTag = tags[dragIndex];

    // call handler with the index of the dragged tag
    // and the tag that is hovered
    this.props.handleDrag(dragTag, dragIndex, hoverIndex);
  }

  getTagItems = () => {
    const {
      tags,
      labelField,
      removeComponent,
      readOnly,
      handleDrag,
    } = this.props;
    const { classNames } = this.state;
    const moveTag = handleDrag ? this.moveTag : null;
    return tags.map((tag, index) => {
      return (
        <Tag
          key={tag.id}
          index={index}
          tag={tag}
          labelField={labelField}
          onDelete={this.handleDelete.bind(this, index)}
          moveTag={moveTag}
          removeComponent={removeComponent}
          onTagClicked={this.handleTagClick.bind(this, index)}
          readOnly={readOnly}
          classNames={classNames}
        />
      );
    });
  };

  getSuggestionPickerX = () => {
    if (this.textInput && this.state.isFocused) {
      return (this.textInput.offsetLeft + this.textInput.offsetParent.offsetLeft) + 'px';
    } else {
      return '0';
    }
  }

  render() {
    const tagItems = this.getTagItems();

    // get the suggestions for the given query
    const query = this.state.query.trim(),
      selectedIndex = this.state.selectedIndex,
      suggestions = this.state.suggestions,
      placeholder = this.props.placeholder,
      inputName = this.props.name,
      inputId = this.props.id,
      maxLength = this.props.maxLength;

    const tagInput = !this.props.readOnly ? (
      <div className={this.state.classNames.tagInput}>
        <input
          ref={(input) => {
            this.textInput = input;
          }}
          className={this.state.classNames.tagInputField}
          type="text"
          placeholder={placeholder}
          aria-label={placeholder}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          onPaste={this.handlePaste}
          name={inputName}
          id={inputId}
          maxLength={maxLength}
          value={this.props.inputValue}
        />
      </div>
    ) : null;

    return (
      <React.Fragment>
        <div className={this.state.classNames.tags}>
          <div className={this.state.classNames.selected}>
            {tagItems}
            {this.props.inline && tagInput}
          </div>
          {!this.props.inline && tagInput}
        </div>

        <Suggestions
          query={query}
          suggestions={suggestions}
          selectedIndex={selectedIndex}
          handleClick={this.handleSuggestionClick}
          handleHover={this.handleSuggestionHover}
          minQueryLength={this.props.minQueryLength}
          shouldRenderSuggestions={this.props.shouldRenderSuggestions}
          isFocused={this.state.isFocused}
          classNames={this.state.classNames}
          leftStart={this.getSuggestionPickerX()}
        />
      </React.Fragment>
    );
  }
}

module.exports = {
  WithContext: DragDropContext(HTML5Backend)(injectSheet(DEFAULT_STYLES)(ReactTags)),
  WithOutContext: ReactTags,
  KEYS: KEYS,
};
