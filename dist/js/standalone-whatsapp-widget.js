/*!
  * WhatsApp Widget v1.0.1 (c) 2022 - Guillermo Riojas
  * Licensed under MIT (https://github.com/griojas/standalone-whatsapp-widget.git/blob/main/LICENSE)
  * WhatsApp Widget does not affiliate with WhatsApp Inc. in any way.
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.WhatsAppWidget = factory());
}(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  var CLASS_NAME_WIDGET_TOGGLE = 'wa-widget-toggle';
  var CLASS_NAME_WIDGET_CONTENT = 'wa-widget-content';
  var CLASS_NAME_WIDGET_EXPANDED = 'expanded';
  var CLASS_NAME_WIDGET_FORM_REQUIRED = 'required';
  var SELECTOR_VALUE_TOGGLE_CHAT = 'wa-chat';
  var SELECTOR_VALUE_TOGGLE_SEND = 'wa-send';
  var SELECTOR_CHAT_WIDGET = '[data-chat]';
  var SELECTOR_DATA_TOGGLE_CHAT = "[data-toggle=\"".concat(SELECTOR_VALUE_TOGGLE_CHAT, "\"]");
  var SELECTOR_DATA_TOGGLE_SEND = "[data-toggle=\"".concat(SELECTOR_VALUE_TOGGLE_SEND, "\"]");
  var SELECTOR_DATA_MESSAGE = "[data-message]";
  var DefaultConfig = {
    name: '',
    division: '',
    photo: '',
    introduction: '',
    showHeader: false
  };
  var DefaultConfigType = {
    name: 'string',
    division: 'string',
    photo: 'string',
    introduction: 'string',
    showHeader: 'boolean'
  };
  var DefaultForm = [{
    data: 'name',
    type: 'text',
    required: true
  }, {
    data: 'message',
    type: 'text',
    required: true
  }];
  var DefaultFormType = {
    data: 'string',
    type: 'string',
    required: 'boolean'
  };
  var ChatData = {};
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Chat = /*#__PURE__*/function () {
    function Chat(element, config, input) {
      _classCallCheck(this, Chat);

      if (ChatData[element.id]) return;
      this._element = element;
      this._config = this._getConfig(config);
      this._inputs = this._getInput(input);
      this._phoneNumber = this._element.getAttribute('action');
      this._isShown = false;
      this._showHeader = false;
      this._toggleChat = '';
      this._contentElement = '';
      this._toggleSend = '';

      this._buildHTML();

      this._setEventListener();

      ChatData[element.id] = this;
    } // PUBLIC


    _createClass(Chat, [{
      key: "toggle",
      value: function toggle() {
        var _this = this;

        Object.keys(ChatData).forEach(function (key) {
          if (key !== _this._element.id && ChatData[key]._isShown) ChatData[key].toggle();
        });
        this._isShown ? this._hide() : this._show();
      } // PRIVATE

    }, {
      key: "_sendMessage",
      value: function _sendMessage() {
        if (!/^\d+$/.test(this._phoneNumber)) {
          throw new Error('Phone number (' + this._phoneNumber + ') is invalid.');
        }

        var send_url = 'https://wa.me/';

        var inputs = this._element.querySelectorAll(SELECTOR_DATA_MESSAGE);

        var parameters = send_url + this._phoneNumber + '?text=';
        var valid = true;

        for (var i = 0; i < inputs.length; i++) {
          var item = inputs[i];
          if (!this._formValidation(item)) valid = false;
          var title = item.getAttribute('data-message');
          parameters += title.replace(/^./, title[0].toUpperCase()) + ': ' + item.value + '%0A';
        }

        if (valid) window.open(parameters, '_blank');
      }
    }, {
      key: "_buildHTML",
      value: function _buildHTML() {
        if (this._element.innerHTML) return false;

        this._verifyInput(this._inputs);

        var TOGGLE = document.createElement('a');
        var ids = '#' + this._element.id;
        TOGGLE.href = ids;
        TOGGLE.classList.add(CLASS_NAME_WIDGET_TOGGLE);
        TOGGLE.setAttribute('data-toggle', SELECTOR_VALUE_TOGGLE_CHAT);
        TOGGLE.setAttribute('data-target', ids); // TOGGLE.innerHTML = 
        // `<svg viewBox="0 0 90 90" fill="rgb(79, 206, 93)" width="64" height="64">
        //     <path d="M90,43.841c0,24.213-19.779,43.841-44.182,43.841c-7.747,0-15.025-1.98-21.357-5.455L0,90l7.975-23.522   c-4.023-6.606-6.34-14.354-6.34-22.637C1.635,19.628,21.416,0,45.818,0C70.223,0,90,19.628,90,43.841z M45.818,6.982   c-20.484,0-37.146,16.535-37.146,36.859c0,8.065,2.629,15.534,7.076,21.61L11.107,79.14l14.275-4.537   c5.865,3.851,12.891,6.097,20.437,6.097c20.481,0,37.146-16.533,37.146-36.857S66.301,6.982,45.818,6.982z M68.129,53.938   c-0.273-0.447-0.994-0.717-2.076-1.254c-1.084-0.537-6.41-3.138-7.4-3.495c-0.993-0.358-1.717-0.538-2.438,0.537   c-0.721,1.076-2.797,3.495-3.43,4.212c-0.632,0.719-1.263,0.809-2.347,0.271c-1.082-0.537-4.571-1.673-8.708-5.333   c-3.219-2.848-5.393-6.364-6.025-7.441c-0.631-1.075-0.066-1.656,0.475-2.191c0.488-0.482,1.084-1.255,1.625-1.882   c0.543-0.628,0.723-1.075,1.082-1.793c0.363-0.717,0.182-1.344-0.09-1.883c-0.27-0.537-2.438-5.825-3.34-7.977   c-0.902-2.15-1.803-1.792-2.436-1.792c-0.631,0-1.354-0.09-2.076-0.09c-0.722,0-1.896,0.269-2.889,1.344   c-0.992,1.076-3.789,3.676-3.789,8.963c0,5.288,3.879,10.397,4.422,11.113c0.541,0.716,7.49,11.92,18.5,16.223   C58.2,65.771,58.2,64.336,60.186,64.156c1.984-0.179,6.406-2.599,7.312-5.107C68.398,56.537,68.398,54.386,68.129,53.938z"></path>
        // </svg>`

        TOGGLE.innerHTML = "\n          <svg viewBox=\"0 0 175.216 175.552\" fill=\"rgb(79, 206, 93)\" width=\"32\" height=\"32\">\n            <defs><linearGradient id=\"b\" x1=\"85.915\" x2=\"86.535\" y1=\"32.567\" y2=\"137.092\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#57d163\"/><stop offset=\"1\" stop-color=\"#23b33a\"/></linearGradient><filter id=\"a\" width=\"1.115\" height=\"1.114\" x=\"-.057\" y=\"-.057\" color-interpolation-filters=\"sRGB\"><feGaussianBlur stdDeviation=\"3.531\"/></filter></defs><path fill=\"#b3b3b3\" d=\"m54.532 138.45 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.523h.023c33.707 0 61.139-27.426 61.153-61.135.006-16.335-6.349-31.696-17.895-43.251A60.75 60.75 0 0 0 87.94 25.983c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.558zm-40.811 23.544L24.16 123.88c-6.438-11.154-9.825-23.808-9.821-36.772.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954zm0 0\" filter=\"url(#a)\"/><path fill=\"#fff\" d=\"m12.966 161.238 10.439-38.114a73.42 73.42 0 0 1-9.821-36.772c.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954z\"/><path fill=\"url(#linearGradient1780)\" d=\"M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.559 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.524h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.929z\"/><path fill=\"url(#b)\" d=\"M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.517 31.126 8.523h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.928z\"/><path fill=\"#fff\" fill-rule=\"evenodd\" d=\"M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647\"/>\n          </svg>\n        ";
        var HTML_ELEMENT_WIDGET_MAIN = '';

        if (this._config.showHeader) {
          HTML_ELEMENT_WIDGET_MAIN = "".concat(TOGGLE.outerHTML, "\n            <div class=\"").concat(CLASS_NAME_WIDGET_CONTENT, " chat-tab\">\n                <header class=\"chat-header\">\n                    <div class=\"chat-admin-picture\">\n                        <img src=\"").concat(this._config.photo, "\" alt=\"").concat(this._config.name, "'s Photos\">\n                    </div>\n                    <div class=\"chat-admin-details\">\n                        <h4>").concat(this._config.name, "</h4>\n                        <p><small>").concat(this._config.division, "</small></p>\n                    </div>\n                </header>\n                <div class=\"chat-content\">\n                    <div class=\"chat-item\">\n                        <p>").concat(this._config.introduction, "</p>\n                    </div>\n                </div>\n                ").concat(this._buildInputs(this._inputs).outerHTML, "\n            </div>");
        } else {
          HTML_ELEMENT_WIDGET_MAIN = "".concat(TOGGLE.outerHTML, "\n          <div class=\"").concat(CLASS_NAME_WIDGET_CONTENT, " chat-tab\">\n              <div class=\"chat-content\">\n                  <div class=\"chat-item\">\n                      <p>").concat(this._config.introduction, "</p>\n                  </div>\n              </div>\n              ").concat(this._buildInputs(this._inputs).outerHTML, "\n          </div>");
        }

        this._element.innerHTML = HTML_ELEMENT_WIDGET_MAIN;
      }
    }, {
      key: "_buildInputs",
      value: function _buildInputs(inputs) {
        var form = document.createElement('div');
        form.classList.add('chat-form');
        inputs.forEach(function (input) {
          var newInput = document.createElement('input');
          newInput.type = input.type;
          newInput.setAttribute('data-message', input.data);
          newInput.placeholder = input.data.replace(/^./, input.data[0].toUpperCase());
          newInput.required = input.required;
          form.appendChild(newInput);
        });
        var button = document.createElement('button');
        button.classList.add('chat-send');
        button.type = 'submit';
        button.setAttribute('data-toggle', SELECTOR_VALUE_TOGGLE_SEND);
        button.innerHTML = '<strong>Send</strong>';
        form.appendChild(button);
        return form;
      }
    }, {
      key: "_setEventListener",
      value: function _setEventListener() {
        var _this2 = this;

        this._toggleChat = document.querySelector(SELECTOR_DATA_TOGGLE_CHAT + '[data-target="#' + this._element.id + '"]');
        this._contentElement = this._element.getElementsByClassName(CLASS_NAME_WIDGET_CONTENT).item(0);
        this._toggleSend = this._element.querySelector(SELECTOR_DATA_TOGGLE_SEND);

        if (this._toggleChat) {
          this._toggleChat.addEventListener("click", function (e) {
            e.preventDefault();

            _this2.toggle();
          });
        }

        if (this._toggleSend) {
          this._toggleSend.addEventListener('click', function (e) {
            e.preventDefault();

            _this2._sendMessage();
          });
        }
      }
    }, {
      key: "_show",
      value: function _show() {
        this._element.classList.add(CLASS_NAME_WIDGET_EXPANDED);

        this._toggleChat.classList.add(CLASS_NAME_WIDGET_EXPANDED);

        this._contentElement.classList.add(CLASS_NAME_WIDGET_EXPANDED);

        this._isShown = true;
      }
    }, {
      key: "_hide",
      value: function _hide() {
        this._element.classList.remove(CLASS_NAME_WIDGET_EXPANDED);

        this._toggleChat.classList.remove(CLASS_NAME_WIDGET_EXPANDED);

        this._contentElement.classList.remove(CLASS_NAME_WIDGET_EXPANDED);

        this._isShown = false;
      }
    }, {
      key: "_formValidation",
      value: function _formValidation(formElement) {
        if (!formElement.required) return true;
        formElement.classList.remove(CLASS_NAME_WIDGET_FORM_REQUIRED);

        switch (formElement.type) {
          case 'email':
            if (!/^\S+@\S+$/.test(formElement.value)) {
              formElement.classList.add(CLASS_NAME_WIDGET_FORM_REQUIRED);
              return false;
            }

            break;

          default:
            if (formElement.value == '' || formElement.value == null) {
              formElement.classList.add(CLASS_NAME_WIDGET_FORM_REQUIRED);
              return false;
            }

            break;
        }

        return true;
      }
    }, {
      key: "_getConfig",
      value: function _getConfig(config) {
        config = _objectSpread2(_objectSpread2({}, DefaultConfig), config);

        this._typeCheck(config, DefaultConfigType);

        return config;
      }
    }, {
      key: "_getInput",
      value: function _getInput(inputs) {
        if (typeof inputs === 'undefined' || inputs.length === 0) return DefaultForm;
        return inputs;
      }
    }, {
      key: "_verifyInput",
      value: function _verifyInput(inputs) {
        var _this3 = this;

        inputs.forEach(function (input) {
          _this3._typeCheck(input, DefaultFormType);
        });
      }
    }, {
      key: "_typeCheck",
      value: function _typeCheck(config, configTypes) {
        var _this4 = this;

        Object.keys(configTypes).forEach(function (property) {
          var expectedTypes = configTypes[property];
          var value = config[property];
          var valueType = value && _this4._isElement(value) ? 'element' : _this4._toType(value);

          if (!new RegExp(expectedTypes).test(valueType)) {
            throw new Error("WhatsApp Widget: " + "Option \"".concat(property, "\" provided type \"").concat(valueType, "\" ") + "but expected type \"".concat(expectedTypes, "\"."));
          }
        });
      }
    }, {
      key: "_isElement",
      value: function _isElement(obj) {
        (obj[0] || obj).nodeType;
      } // AngusCroll (https://goo.gl/pxwQGp)

    }, {
      key: "_toType",
      value: function _toType(obj) {
        if (obj === null || obj === undefined) {
          return "".concat(obj);
        }

        return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
      }
    }]);

    return Chat;
  }();

  document.body.onload = function () {
    var chatSelector = document.querySelectorAll(SELECTOR_CHAT_WIDGET);

    for (var i = 0; i < chatSelector.length; i++) {
      var element = chatSelector[i];
      var data = new Chat(element, {}, []); // eslint-disable-line no-unused-vars
    }
  };

  return Chat;

})));
