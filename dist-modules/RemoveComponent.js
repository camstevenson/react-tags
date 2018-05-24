'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var crossStr = String.fromCharCode(215);
var RemoveComponent = function RemoveComponent(props) {
  var readOnly = props.readOnly,
      removeComponent = props.removeComponent,
      onClick = props.onClick,
      className = props.className;

  if (readOnly) {
    return _react2.default.createElement('span', null);
  }

  if (removeComponent) {
    var Component = removeComponent;
    return _react2.default.createElement(Component, props);
  }

  return _react2.default.createElement(
    'a',
    { onClick: onClick, className: className, onKeyDown: onClick },
    _react2.default.createElement(
      'svg',
      { focusable: 'false', viewBox: '0 0 24 24', 'aria-hidden': 'true' },
      _react2.default.createElement('path', { d: 'M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z' })
    )
  );
};

RemoveComponent.propTypes = {
  className: _propTypes2.default.string,
  onClick: _propTypes2.default.func.isRequired,
  readOnly: _propTypes2.default.bool,
  removeComponent: _propTypes2.default.func
};

exports.default = RemoveComponent;