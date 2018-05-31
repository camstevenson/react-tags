'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _number = require('core-js/library/fn/number');

var _number2 = _interopRequireDefault(_number);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Polyfills


var maybeScrollSuggestionIntoView = function maybeScrollSuggestionIntoView(suggestionEl, suggestionsContainer) {
  var containerHeight = suggestionsContainer.offsetHeight;
  var suggestionHeight = suggestionEl.offsetHeight;
  var relativeSuggestionTop = suggestionEl.offsetTop - suggestionsContainer.scrollTop;

  if (relativeSuggestionTop + suggestionHeight >= containerHeight) {
    suggestionsContainer.scrollTop += relativeSuggestionTop - containerHeight + suggestionHeight;
  } else if (relativeSuggestionTop < 0) {
    suggestionsContainer.scrollTop += relativeSuggestionTop;
  }
};

var Suggestions = function (_Component) {
  _inherits(Suggestions, _Component);

  function Suggestions(props) {
    _classCallCheck(this, Suggestions);

    var _this = _possibleConstructorReturn(this, (Suggestions.__proto__ || Object.getPrototypeOf(Suggestions)).call(this, props));

    _this.markIt = function (input, query) {
      var escapedRegex = query.trim().replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
      return {
        __html: input.text.replace(RegExp(escapedRegex, 'gi'), '<mark>$&</mark>')
      };
    };

    _this.shouldRenderSuggestions = function (query) {
      var _this$props = _this.props,
          minQueryLength = _this$props.minQueryLength,
          isFocused = _this$props.isFocused;

      return query.length >= minQueryLength && isFocused;
    };

    _this.scrollerEventTrap = _this.scrollerEventTrap.bind(_this);
    return _this;
  }

  _createClass(Suggestions, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      var props = this.props;

      var shouldRenderSuggestions = props.shouldRenderSuggestions || this.shouldRenderSuggestions;
      var shouldUpdatePos = (shouldRenderSuggestions(props.query) || shouldRenderSuggestions(nextProps.query)) && props.leftStart !== nextProps.leftStart;

      return props.isFocused !== nextProps.isFocused || !(0, _isEqual2.default)(props.suggestions, nextProps.suggestions) || shouldRenderSuggestions(nextProps.query) || shouldRenderSuggestions(nextProps.query) !== shouldRenderSuggestions(props.query) || shouldUpdatePos;
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var _props = this.props,
          selectedIndex = _props.selectedIndex,
          classNames = _props.classNames;


      if (this.suggestionsContainer && prevProps.selectedIndex !== selectedIndex) {
        var activeSuggestion = this.suggestionsContainer.querySelector(classNames.activeSuggestion);

        if (activeSuggestion) {
          maybeScrollSuggestionIntoView(activeSuggestion, this.suggestionsContainer);
        }
      }
    }
  }, {
    key: 'scrollerEventTrap',
    value: function scrollerEventTrap(e) {
      // Prevent upwards propagation which can trigger a blur.
      e.preventDefault();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var props = this.props;

      var suggestions = props.suggestions.map(function (item, i) {
        return _react2.default.createElement(
          'li',
          {
            key: i,
            onMouseDown: props.handleClick.bind(null, i),
            onMouseOver: props.handleHover.bind(null, i),
            className: i === props.selectedIndex ? props.classNames.activeSuggestion : '' },
          _react2.default.createElement('span', { dangerouslySetInnerHTML: this.markIt(item, props.query) })
        );
      }.bind(this));

      // use the override, if provided
      var shouldRenderSuggestions = props.shouldRenderSuggestions || this.shouldRenderSuggestions;
      if (suggestions.length === 0 || !shouldRenderSuggestions(props.query)) {
        return null;
      }

      return _react2.default.createElement(
        'div',
        {
          ref: function ref(elem) {
            _this2.suggestionsContainer = elem;
          },
          className: this.props.classNames.suggestions,
          style: { left: this.props.leftStart },
          onMouseDown: this.scrollerEventTrap
        },
        _react2.default.createElement(
          'ul',
          null,
          ' ',
          suggestions,
          ' '
        )
      );
    }
  }]);

  return Suggestions;
}(_react.Component);

Suggestions.propTypes = {
  query: _propTypes2.default.string.isRequired,
  selectedIndex: _propTypes2.default.number.isRequired,
  suggestions: _propTypes2.default.array.isRequired,
  handleClick: _propTypes2.default.func.isRequired,
  handleHover: _propTypes2.default.func.isRequired,
  minQueryLength: _propTypes2.default.number,
  shouldRenderSuggestions: _propTypes2.default.func,
  isFocused: _propTypes2.default.bool.isRequired,
  leftStart: _propTypes2.default.string,
  classNames: _propTypes2.default.object
};
Suggestions.defaultProps = {
  minQueryLength: 2,
  leftStart: '0'
};
exports.default = Suggestions;