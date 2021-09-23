"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = usePlacesWidget;

var _react = require("react");

var _utils = require("./utils");

var _constants = require("./constants");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function usePlacesWidget(props) {
  var catalonia = {
    "Espanya": ", Catalunya",
    "España": ", Cataluña",
    "Spain": ", Catalonia"
  };
  var spain = {
    "Espanya": "",
    "España": "",
    "Spain": ""
  };
  var france = {
    "França": "",
    "Francia": "",
    "France": ""
  };
  var italy = {
    "Itàlia": "",
    "Italia": "",
    "Italy": ""
  };
  var ref = props.ref,
      onPlaceSelected = props.onPlaceSelected,
      apiKey = props.apiKey,
      _props$inputAutocompl = props.inputAutocompleteValue,
      inputAutocompleteValue = _props$inputAutocompl === void 0 ? "adreça" : _props$inputAutocompl,
      _props$options = props.options;
  _props$options = _props$options === void 0 ? {} : _props$options;

  var _props$options$types = _props$options.types,
      types = _props$options$types === void 0 ? ["(cities)"] : _props$options$types,
      componentRestrictions = _props$options.componentRestrictions,
      _props$options$fields = _props$options.fields,
      fields = _props$options$fields === void 0 ? ["address_components", "geometry.location", "place_id", "formatted_address"] : _props$options$fields,
      bounds = _props$options.bounds,
      options = _objectWithoutProperties(_props$options, ["types", "componentRestrictions", "fields", "bounds"]),
      _props$googleMapsScri = props.googleMapsScriptBaseUrl,
      googleMapsScriptBaseUrl = _props$googleMapsScri === void 0 ? _constants.GOOGLE_MAP_SCRIPT_BASE_URL : _props$googleMapsScri,
      language = props.language;

  var inputRef = (0, _react.useRef)(null);
  var event = (0, _react.useRef)(null);
  var autocompleteRef = (0, _react.useRef)(null);
  var observerHack = (0, _react.useRef)(null);
  var languageQueryParam = language ? "&language=".concat(language) : "";
  var googleMapsScriptUrl = "".concat(googleMapsScriptBaseUrl, "?libraries=places&key=").concat(apiKey).concat(languageQueryParam);
  var handleLoadScript = (0, _react.useCallback)(function () {
    return (0, _utils.loadGoogleMapScript)(googleMapsScriptBaseUrl, googleMapsScriptUrl);
  }, [googleMapsScriptBaseUrl, googleMapsScriptUrl]);
  (0, _react.useEffect)(function () {
    var config = _objectSpread(_objectSpread({}, options), {}, {
      fields: fields,
      types: types,
      bounds: bounds
    });

    if (componentRestrictions) {
      config.componentRestrictions = componentRestrictions;
    }

    if (autocompleteRef.current || !inputRef.current || !_utils.isBrowser) return;
    if (ref && !ref.current) ref.current = inputRef.current;

    var handleAutoComplete = function handleAutoComplete() {
      if (typeof google === "undefined") return console.error("Google has not been found. Make sure your provide apiKey prop.");
      if (!google.maps.places) return console.error("Google maps places API must be loaded.");
      if (!inputRef.current instanceof HTMLInputElement) return console.error("Input ref must be HTMLInputElement.");
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, config);
      event.current = autocompleteRef.current.addListener("place_changed", function () {
        if (onPlaceSelected && autocompleteRef && autocompleteRef.current) {
          var place = autocompleteRef.current.getPlace();
          var country_code = place.address_components.find(function (x) {
            return x.types[0] == "country";
          });
          var political = place.address_components.find(function (x) {
            return x.types[0] == "administrative_area_level_1";
          });

          if (country_code && country_code.short_name == "ES") {
            if (political.short_name == "CT") {
              for (var _i = 0, _Object$entries = Object.entries(catalonia); _i < _Object$entries.length; _i++) {
                var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
                    key = _Object$entries$_i[0],
                    value = _Object$entries$_i[1];

                place.formatted_address = place.formatted_address.replace(", " + key, value);
              }
            } else {
              for (var _i2 = 0, _Object$entries2 = Object.entries(spain); _i2 < _Object$entries2.length; _i2++) {
                var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
                    _key = _Object$entries2$_i[0],
                    _value = _Object$entries2$_i[1];

                place.formatted_address = place.formatted_address.replace(", " + _key, _value);
              }
            }
          }

          if (country_code && country_code.short_name == "FR") {
            for (var _i3 = 0, _Object$entries3 = Object.entries(france); _i3 < _Object$entries3.length; _i3++) {
              var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i3], 2),
                  _key2 = _Object$entries3$_i[0],
                  _value2 = _Object$entries3$_i[1];

              place.formatted_address = place.formatted_address.replace(", " + _key2, _value2);
            }
          }

          if (country_code && country_code.short_name == "IT") {
            for (var _i4 = 0, _Object$entries4 = Object.entries(italy); _i4 < _Object$entries4.length; _i4++) {
              var _Object$entries4$_i = _slicedToArray(_Object$entries4[_i4], 2),
                  _key3 = _Object$entries4$_i[0],
                  _value3 = _Object$entries4$_i[1];

              place.formatted_address = place.formatted_address.replace(", " + _key3, _value3);
            }
          }

          onPlaceSelected(place, inputRef.current, autocompleteRef.current);
        }
      });
    };

    if (apiKey) {
      handleLoadScript().then(function () {
        return handleAutoComplete();
      });
    } else {
      handleAutoComplete();
    }

    return function () {
      return event.current ? event.current.remove() : undefined;
    };
  }, []); // Autofill workaround adapted from https://stackoverflow.com/questions/29931712/chrome-autofill-covers-autocomplete-for-google-maps-api-v3/49161445#49161445

  (0, _react.useEffect)(function () {
    if (_utils.isBrowser && window.MutationObserver && inputRef.current && inputRef.current instanceof HTMLInputElement) {
      observerHack.current = new MutationObserver(function () {
        observerHack.current.disconnect();
        inputRef.current.autocomplete = inputAutocompleteValue;
      });
      observerHack.current.observe(inputRef.current, {
        attributes: true,
        attributeFilter: ["autocomplete"]
      });
    }
  }, [inputAutocompleteValue]);
  (0, _react.useEffect)(function () {
    if (autocompleteRef.current) {
      autocompleteRef.current.setFields(fields);
    }
  }, [fields]);
  (0, _react.useEffect)(function () {
    if (autocompleteRef.current) {
      autocompleteRef.current.setBounds(bounds);
    }
  }, [bounds]);
  (0, _react.useEffect)(function () {
    if (autocompleteRef.current) {
      autocompleteRef.current.setComponentRestrictions(componentRestrictions);
    }
  }, [componentRestrictions]);
  (0, _react.useEffect)(function () {
    if (autocompleteRef.current) {
      autocompleteRef.current.setOptions(options);
    }
  }, [options]);
  return {
    ref: inputRef,
    autocompleteRef: autocompleteRef
  };
}