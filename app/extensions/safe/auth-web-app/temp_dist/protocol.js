module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _path = __webpack_require__(1);

	var _path2 = _interopRequireDefault(_path);

	var _fs = __webpack_require__(2);

	var _fs2 = _interopRequireDefault(_fs);

	var _url = __webpack_require__(3);

	var _url2 = _interopRequireDefault(_url);

	var _electron = __webpack_require__(4);

	var _sys_uri = __webpack_require__(5);

	var _sys_uri2 = _interopRequireDefault(_sys_uri);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/* eslint-disable import/extensions */
	var safeAuthScheme = 'safe-auth';
	/* eslint-enable import/extensions */


	var isDevMode = process.execPath.match(/[\\/]electron/);

	var appInfo = {
	  id: 'net.maidsafe.safebrowser',
	  exec: isDevMode ? process.execPath + ' ' + _electron.app.getAppPath() : _electron.app.getPath('exe'),
	  vendor: 'maidsafe',
	  name: 'safe-browser',
	  icon: 'iconPath'
	};

	var registerSafeAuthProtocol = function registerSafeAuthProtocol() {
	  _sys_uri2.default.registerUriScheme(appInfo, safeAuthScheme);

	  _electron.protocol.registerBufferProtocol(safeAuthScheme, function (req, cb) {
	    var parsedUrl = _url2.default.parse(req.url);
	    switch (parsedUrl.pathname) {
	      case '/bundle.js':
	        cb({
	          mimeType: 'application/javascript',
	          data: _fs2.default.readFileSync(_path2.default.resolve(__dirname, 'bundle.js'))
	        });
	        break;
	      case '/bundle.js.map':
	        cb({
	          mimeType: 'application/octet-stream',
	          data: _fs2.default.readFileSync(_path2.default.resolve(__dirname, 'bundle.js.map'))
	        });
	        break;
	      case '/favicon.png':
	        cb({
	          mimeType: 'image/png',
	          data: _fs2.default.readFileSync(_path2.default.resolve(__dirname, 'favicon.png'))
	        });
	        break;
	      default:
	        cb({ mimeType: 'text/html', data: _fs2.default.readFileSync(_path2.default.resolve(__dirname, 'app.html')) });
	        break;
	    }
	  }, function (err) {
	    if (err) console.error('Failed to register protocol');
	  });
	};

	var scheme = {
	  scheme: safeAuthScheme,
	  label: 'SAFE Authenticator',
	  isStandardURL: true,
	  isInternal: true,
	  register: registerSafeAuthProtocol
	};

	exports.default = scheme;
	module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = require("path");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = require("fs");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports = require("url");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	module.exports = require("electron");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint-disable no-underscore-dangle */
	/* eslint-disable import/no-unresolved, import/extensions */

	/* eslint-enable import/no-unresolved, import/extensions */


	var _ffi = __webpack_require__(6);

	var _ffi2 = _interopRequireDefault(_ffi);

	var _os = __webpack_require__(7);

	var _os2 = _interopRequireDefault(_os);

	var _path = __webpack_require__(1);

	var _path2 = _interopRequireDefault(_path);

	var _constants = __webpack_require__(8);

	var _constants2 = _interopRequireDefault(_constants);

	var _types = __webpack_require__(15);

	var type = _interopRequireWildcard(_types);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _ffiFunctions = Symbol('ffiFunctions');
	var _libPath = Symbol('libPath');
	var _isLibLoaded = Symbol('isLibLoaded');

	var SystemUriLoader = function () {
	  function SystemUriLoader() {
	    _classCallCheck(this, SystemUriLoader);

	    this[_libPath] = _constants2.default.LIB_PATH.SYSTEM_URI[_os2.default.platform()];
	    this[_ffiFunctions] = {
	      open: [type.Void, ['string', 'pointer', 'pointer']],
	      install: [type.Void, ['string', 'string', 'string', 'string', 'string', 'string', 'pointer', 'pointer']]
	    };
	    this[_isLibLoaded] = false;
	    this.lib = null;
	  }

	  _createClass(SystemUriLoader, [{
	    key: 'load',
	    value: function load() {
	      try {
	        this.lib = _ffi2.default.Library(_path2.default.resolve(__dirname, this[_libPath]), this[_ffiFunctions]);
	        this[_isLibLoaded] = true;
	      } catch (err) {
	        this[_isLibLoaded] = false;
	      }
	    }
	  }, {
	    key: 'registerUriScheme',
	    value: function registerUriScheme(appInfo, schemes) {
	      var _this = this;

	      var bundle = appInfo.bundle || appInfo.id;
	      var exec = appInfo.exec ? appInfo.exec : process.execPath;
	      var vendor = appInfo.vendor;
	      var name = appInfo.name;
	      var icon = appInfo.icon;
	      var joinedSchemes = schemes.join ? schemes.join(',') : schemes;

	      if (!this.lib) {
	        return;
	      }

	      return new Promise(function (resolve, reject) {
	        try {
	          var cb = _this._handleError(resolve, reject);
	          _this.lib.install(bundle, vendor, name, exec, icon, joinedSchemes, type.Null, cb);
	        } catch (err) {
	          return reject(err);
	        }
	      });
	    }
	  }, {
	    key: 'openUri',
	    value: function openUri(str) {
	      var _this2 = this;

	      if (!this.lib) {
	        return;
	      }
	      return new Promise(function (resolve, reject) {
	        try {
	          var cb = _this2._handleError(resolve, reject);
	          _this2.lib.open(str, type.Null, cb);
	        } catch (err) {
	          return reject(err);
	        }
	      });
	    }
	  }, {
	    key: '_handleError',
	    value: function _handleError(resolve, reject) {
	      return _ffi2.default.Callback(type.Void, [type.voidPointer, type.FfiResult], function (userData, result) {
	        if (result.error_code !== 0) {
	          return reject(new Error(result.description));
	        }
	        return resolve();
	      });
	    }
	  }, {
	    key: 'isLibLoaded',
	    get: function get() {
	      return this[_isLibLoaded];
	    }
	  }]);

	  return SystemUriLoader;
	}();

	var loader = new SystemUriLoader();
	loader.load();
	exports.default = loader;
	module.exports = exports['default'];

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	module.exports = require("ffi");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	module.exports = require("os");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _enum = __webpack_require__(9);

	var _enum2 = _interopRequireDefault(_enum);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  NETWORK_STATUS: {
	    CONNECTED: 0,
	    CONNECTING: 1,
	    DISCONNECTED: -1
	  },
	  LIB_PATH: {
	    PTHREAD: './libwinpthread-1.dll',
	    SAFE_AUTH: {
	      win32: './safe_authenticator.dll',
	      darwin: './libsafe_authenticator.dylib',
	      linux: './libsafe_authenticator.so'
	    },
	    SYSTEM_URI: {
	      win32: './system_uri.dll',
	      darwin: './libsystem_uri.dylib',
	      linux: './libsystem_uri.so'
	    }
	  },
	  LISTENER_TYPES: new _enum2.default(['APP_LIST_UPDATE', 'AUTH_REQ', 'CONTAINER_REQ', 'MDATA_REQ', 'NW_STATE_CHANGE', 'REQUEST_ERR']),
	  CLIENT_TYPES: {
	    DESKTOP: 'DESKTOP',
	    WEB: 'WEB'
	  },
	  CREATE_ACC_NAV: {
	    WELCOME: 1,
	    INVITE_CODE: 2,
	    SECRET_FORM: 3,
	    PASSWORD_FORM: 4
	  },
	  PASSPHRASE_STRENGTH: {
	    VERY_WEAK: 4,
	    WEAK: 8,
	    SOMEWHAT_SECURE: 10,
	    SECURE: 10
	  },
	  PASSPHRASE_STRENGTH_MSG: {
	    VERY_WEAK: 'Very weak',
	    WEAK: 'Weak',
	    SOMEWHAT_SECURE: 'Somewhat secure',
	    SECURE: 'Secure'
	  },
	  RE_AUTHORISE: {
	    KEY: 'SAFE_LOCAL_RE_AUTHORISE_STATE',
	    LOCK_MSG: 'Apps cannot re-authenticate automatically',
	    UNLOCK_MSG: 'Apps can re-authenticate automatically',
	    STATE: {
	      LOCK: 0,
	      UNLOCK: 1
	    }
	  }
	};
	module.exports = exports['default'];

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(10);


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var os = _interopRequire(__webpack_require__(7));

	var EnumItem = _interopRequire(__webpack_require__(11));

	var _isType = __webpack_require__(12);

	var isString = _isType.isString;
	var isNumber = _isType.isNumber;

	var indexOf = __webpack_require__(13).indexOf;

	var isBuffer = _interopRequire(__webpack_require__(14));

	var endianness = os.endianness();

	/**
	 * Represents an Enum with enum items.
	 * @param {Array || Object}  map     This are the enum items.
	 * @param {String || Object} options This are options. [optional]
	 */

	var Enum = (function () {
	  function Enum(map, options) {
	    var _this = this;

	    _classCallCheck(this, Enum);

	    /* implement the "ref type interface", so that Enum types can
	     * be used in `node-ffi` function declarations and invokations.
	     * In C, these Enums act as `uint32_t` types.
	     *
	     * https://github.com/TooTallNate/ref#the-type-interface
	     */
	    this.size = 4;
	    this.indirection = 1;

	    if (options && isString(options)) {
	      options = { name: options };
	    }

	    this._options = options || {};
	    this._options.separator = this._options.separator || " | ";
	    this._options.endianness = this._options.endianness || endianness;
	    this._options.ignoreCase = this._options.ignoreCase || false;
	    this._options.freez = this._options.freez || false;

	    this.enums = [];

	    if (map.length) {
	      this._enumLastIndex = map.length;
	      var array = map;
	      map = {};

	      for (var i = 0; i < array.length; i++) {
	        map[array[i]] = Math.pow(2, i);
	      }
	    }

	    for (var member in map) {
	      guardReservedKeys(this._options.name, member);
	      this[member] = new EnumItem(member, map[member], { ignoreCase: this._options.ignoreCase });
	      this.enums.push(this[member]);
	    }
	    this._enumMap = map;

	    if (this._options.ignoreCase) {
	      this.getLowerCaseEnums = function () {
	        var res = {};
	        for (var i = 0, len = this.enums.length; i < len; i++) {
	          res[this.enums[i].key.toLowerCase()] = this.enums[i];
	        }
	        return res;
	      };
	    }

	    if (this._options.name) {
	      this.name = this._options.name;
	    }

	    var isFlaggable = function () {
	      for (var i = 0, len = _this.enums.length; i < len; i++) {
	        var e = _this.enums[i];

	        if (!(e.value !== 0 && !(e.value & e.value - 1))) {
	          return false;
	        }
	      }
	      return true;
	    };

	    this.isFlaggable = isFlaggable();
	    if (this._options.freez) {
	      this.freezeEnums(); //this will make instances of Enum non-extensible
	    }
	  }

	  /**
	   * Returns the appropriate EnumItem key.
	   * @param  {EnumItem || String || Number} key The object to get with.
	   * @return {String}                           The get result.
	   */

	  Enum.prototype.getKey = function getKey(value) {
	    var item = this.get(value);
	    if (item) {
	      return item.key;
	    }
	  };

	  /**
	   * Returns the appropriate EnumItem value.
	   * @param  {EnumItem || String || Number} key The object to get with.
	   * @return {Number}                           The get result.
	   */

	  Enum.prototype.getValue = function getValue(key) {
	    var item = this.get(key);
	    if (item) {
	      return item.value;
	    }
	  };

	  /**
	   * Returns the appropriate EnumItem.
	   * @param  {EnumItem || String || Number} key The object to get with.
	   * @return {EnumItem}                         The get result.
	   */

	  Enum.prototype.get = function get(key, offset) {
	    if (key === null || key === undefined) {
	      return;
	    } // Buffer instance support, part of the ref Type interface
	    if (isBuffer(key)) {
	      key = key["readUInt32" + this._options.endianness](offset || 0);
	    }

	    if (EnumItem.isEnumItem(key)) {
	      var foundIndex = indexOf.call(this.enums, key);
	      if (foundIndex >= 0) {
	        return key;
	      }
	      if (!this.isFlaggable || this.isFlaggable && key.key.indexOf(this._options.separator) < 0) {
	        return;
	      }
	      return this.get(key.key);
	    } else if (isString(key)) {

	      var enums = this;
	      if (this._options.ignoreCase) {
	        enums = this.getLowerCaseEnums();
	        key = key.toLowerCase();
	      }

	      if (key.indexOf(this._options.separator) > 0) {
	        var parts = key.split(this._options.separator);

	        var value = 0;
	        for (var i = 0; i < parts.length; i++) {
	          var part = parts[i];

	          value |= enums[part].value;
	        }

	        return new EnumItem(key, value);
	      } else {
	        return enums[key];
	      }
	    } else {
	      for (var m in this) {
	        if (this.hasOwnProperty(m)) {
	          if (this[m].value === key) {
	            return this[m];
	          }
	        }
	      }

	      var result = null;

	      if (this.isFlaggable) {
	        for (var n in this) {
	          if (this.hasOwnProperty(n)) {
	            if ((key & this[n].value) !== 0) {
	              if (result) {
	                result += this._options.separator;
	              } else {
	                result = "";
	              }
	              result += n;
	            }
	          }
	        }
	      }

	      return this.get(result || null);
	    }
	  };

	  /**
	   * Sets the Enum "value" onto the give `buffer` at the specified `offset`.
	   * Part of the ref "Type interface".
	   *
	   * @param  {Buffer} buffer The Buffer instance to write to.
	   * @param  {Number} offset The offset in the buffer to write to. Default 0.
	   * @param  {EnumItem || String || Number} value The EnumItem to write.
	   */

	  Enum.prototype.set = function set(buffer, offset, value) {
	    var item = this.get(value);
	    if (item) {
	      return buffer["writeUInt32" + this._options.endianness](item.value, offset || 0);
	    }
	  };

	  /**
	   * Define freezeEnums() as a property of the prototype.
	   * make enumerable items nonconfigurable and deep freeze the properties. Throw Error on property setter.
	   */

	  Enum.prototype.freezeEnums = function freezeEnums() {
	    function envSupportsFreezing() {
	      return Object.isFrozen && Object.isSealed && Object.getOwnPropertyNames && Object.getOwnPropertyDescriptor && Object.defineProperties && Object.__defineGetter__ && Object.__defineSetter__;
	    }

	    function freezer(o) {
	      var props = Object.getOwnPropertyNames(o);
	      props.forEach(function (p) {
	        if (!Object.getOwnPropertyDescriptor(o, p).configurable) {
	          return;
	        }

	        Object.defineProperties(o, p, { writable: false, configurable: false });
	      });
	      return o;
	    }

	    function getPropertyValue(value) {
	      return value;
	    }

	    function deepFreezeEnums(o) {
	      if (typeof o !== "object" || o === null || Object.isFrozen(o) || Object.isSealed(o)) {
	        return;
	      }
	      for (var key in o) {
	        if (o.hasOwnProperty(key)) {
	          o.__defineGetter__(key, getPropertyValue.bind(null, o[key]));
	          o.__defineSetter__(key, function throwPropertySetError(value) {
	            throw TypeError("Cannot redefine property; Enum Type is not extensible.");
	          });
	          deepFreezeEnums(o[key]);
	        }
	      }
	      if (Object.freeze) {
	        Object.freeze(o);
	      } else {
	        freezer(o);
	      }
	    }

	    if (envSupportsFreezing()) {
	      deepFreezeEnums(this);
	    }

	    return this;
	  };

	  /**
	   * Return true whether the enumItem parameter passed in is an EnumItem object and 
	   * has been included as constant of this Enum   
	   * @param  {EnumItem} enumItem
	   */

	  Enum.prototype.isDefined = function isDefined(enumItem) {
	    var condition = function (e) {
	      return e === enumItem;
	    };
	    if (isString(enumItem) || isNumber(enumItem)) {
	      condition = function (e) {
	        return e.is(enumItem);
	      };
	    }
	    return this.enums.some(condition);
	  };

	  /**
	   * Returns JSON object representation of this Enum.
	   * @return {String} JSON object representation of this Enum.
	   */

	  Enum.prototype.toJSON = function toJSON() {
	    return this._enumMap;
	  };

	  /**
	   * Extends the existing Enum with a New Map.
	   * @param  {Array}  map  Map to extend from
	   */

	  Enum.prototype.extend = function extend(map) {
	    if (map.length) {
	      var array = map;
	      map = {};

	      for (var i = 0; i < array.length; i++) {
	        var exponent = this._enumLastIndex + i;
	        map[array[i]] = Math.pow(2, exponent);
	      }

	      for (var member in map) {
	        guardReservedKeys(this._options.name, member);
	        this[member] = new EnumItem(member, map[member], { ignoreCase: this._options.ignoreCase });
	        this.enums.push(this[member]);
	      }

	      for (var key in this._enumMap) {
	        map[key] = this._enumMap[key];
	      }

	      this._enumLastIndex += map.length;
	      this._enumMap = map;

	      if (this._options.freez) {
	        this.freezeEnums(); //this will make instances of new Enum non-extensible
	      }
	    }
	  };

	  /**
	   * Registers the Enum Type globally in node.js.
	   * @param  {String} key Global variable. [optional]
	   */

	  Enum.register = function register() {
	    var key = arguments[0] === undefined ? "Enum" : arguments[0];

	    if (!global[key]) {
	      global[key] = Enum;
	    }
	  };

	  return Enum;
	})();

	module.exports = Enum;

	// private

	var reservedKeys = ["_options", "get", "getKey", "getValue", "enums", "isFlaggable", "_enumMap", "toJSON", "_enumLastIndex"];

	function guardReservedKeys(customName, key) {
	  if (customName && key === "name" || indexOf.call(reservedKeys, key) >= 0) {
	    throw new Error("Enum key " + key + " is a reserved word!");
	  }
	}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var _isType = __webpack_require__(12);

	var isObject = _isType.isObject;
	var isString = _isType.isString;

	/**
	 * Represents an Item of an Enum.
	 * @param {String} key   The Enum key.
	 * @param {Number} value The Enum value.
	 */

	var EnumItem = (function () {

	  /*constructor reference so that, this.constructor===EnumItem//=>true */

	  function EnumItem(key, value) {
	    var options = arguments[2] === undefined ? {} : arguments[2];

	    _classCallCheck(this, EnumItem);

	    this.key = key;
	    this.value = value;

	    this._options = options;
	    this._options.ignoreCase = this._options.ignoreCase || false;
	  }

	  /**
	   * Checks if the flagged EnumItem has the passing object.
	   * @param  {EnumItem || String || Number} value The object to check with.
	   * @return {Boolean}                            The check result.
	   */

	  EnumItem.prototype.has = function has(value) {
	    if (EnumItem.isEnumItem(value)) {
	      return (this.value & value.value) !== 0;
	    } else if (isString(value)) {
	      if (this._options.ignoreCase) {
	        return this.key.toLowerCase().indexOf(value.toLowerCase()) >= 0;
	      }
	      return this.key.indexOf(value) >= 0;
	    } else {
	      return (this.value & value) !== 0;
	    }
	  };

	  /**
	   * Checks if the EnumItem is the same as the passing object.
	   * @param  {EnumItem || String || Number} key The object to check with.
	   * @return {Boolean}                          The check result.
	   */

	  EnumItem.prototype.is = function is(key) {
	    if (EnumItem.isEnumItem(key)) {
	      return this.key === key.key;
	    } else if (isString(key)) {
	      if (this._options.ignoreCase) {
	        return this.key.toLowerCase() === key.toLowerCase();
	      }
	      return this.key === key;
	    } else {
	      return this.value === key;
	    }
	  };

	  /**
	   * Returns String representation of this EnumItem.
	   * @return {String} String representation of this EnumItem.
	   */

	  EnumItem.prototype.toString = function toString() {
	    return this.key;
	  };

	  /**
	   * Returns JSON object representation of this EnumItem.
	   * @return {String} JSON object representation of this EnumItem.
	   */

	  EnumItem.prototype.toJSON = function toJSON() {
	    return this.key;
	  };

	  /**
	   * Returns the value to compare with.
	   * @return {String} The value to compare with.
	   */

	  EnumItem.prototype.valueOf = function valueOf() {
	    return this.value;
	  };

	  EnumItem.isEnumItem = function isEnumItem(value) {
	    return value instanceof EnumItem || isObject(value) && value.key !== undefined && value.value !== undefined;
	  };

	  return EnumItem;
	})();

	module.exports = EnumItem;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	"use strict";

	exports.__esModule = true;
	var isType = function (type, value) {
	  return typeof value === type;
	};
	exports.isType = isType;
	var isObject = function (value) {
	  return isType("object", value);
	};
	exports.isObject = isObject;
	var isString = function (value) {
	  return isType("string", value);
	};
	exports.isString = isString;
	var isNumber = function (value) {
	  return isType("number", value);
	};
	exports.isNumber = isNumber;

/***/ }),
/* 13 */
/***/ (function(module, exports) {

	"use strict";

	exports.__esModule = true;
	var indexOf = Array.prototype.indexOf || function (find, i /*opt*/) {
	  if (i === undefined) i = 0;
	  if (i < 0) i += this.length;
	  if (i < 0) i = 0;
	  for (var n = this.length; i < n; i++) if (i in this && this[i] === find) return i;
	  return -1;
	};
	exports.indexOf = indexOf;

/***/ }),
/* 14 */
/***/ (function(module, exports) {

	/*!
	 * Determine if an object is a Buffer
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */

	// The _isBuffer check is for Safari 5-7 support, because it's missing
	// Object.prototype.constructor. Remove this eventually
	module.exports = function (obj) {
	  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
	}

	function isBuffer (obj) {
	  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
	}

	// For Node v0.10 support. Remove this eventually.
	function isSlowBuffer (obj) {
	  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
	}


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.allocSharedMdataReq = exports.allocContainerReq = exports.allocAuthReq = exports.allocCString = exports.allocAppHandlePointer = exports.AppAccessPointer = exports.ShareMDataReqPointer = exports.ContainersReqPointer = exports.AccountInfoPointer = exports.AppAccess = exports.UserMetadata = exports.ShareMDataReq = exports.ShareMData = exports.AccountInfo = exports.FfiResult = exports.ContainersReq = exports.AuthReqPointer = exports.AuthReq = exports.RegisteredAppPointer = exports.RegisteredApp = exports.ContainerPermissions = exports.PermissionSet = exports.AppExchangeInfo = exports.ClientHandlePointer = exports.u8Pointer = exports.voidPointer = exports.U8Array = exports.XorName = exports.CString = exports.Null = exports.Void = exports.int32 = exports.bool = exports.usize = exports.u64 = exports.u32 = exports.u8 = undefined;

	var _ref = __webpack_require__(16);

	var _ref2 = _interopRequireDefault(_ref);

	var _refArray = __webpack_require__(17);

	var _refArray2 = _interopRequireDefault(_refArray);

	var _refStruct = __webpack_require__(48);

	var _refStruct2 = _interopRequireDefault(_refStruct);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var u8 = exports.u8 = _ref2.default.types.uint8;
	var u32 = exports.u32 = _ref2.default.types.uint32;
	var u64 = exports.u64 = _ref2.default.types.uint64;
	var usize = exports.usize = _ref2.default.types.size_t;
	var bool = exports.bool = _ref2.default.types.bool;
	var int32 = exports.int32 = _ref2.default.types.int32;
	var Void = exports.Void = _ref2.default.types.void;
	var Null = exports.Null = _ref2.default.NULL;
	var CString = exports.CString = _ref2.default.types.CString;
	var XorName = exports.XorName = (0, _refArray2.default)(u8, 32);
	var U8Array = exports.U8Array = (0, _refArray2.default)(u8, 32);

	// Pointer Types
	var voidPointer = exports.voidPointer = _ref2.default.refType(Void);
	var u8Pointer = exports.u8Pointer = _ref2.default.refType(u8);
	var ClientHandlePointer = exports.ClientHandlePointer = _ref2.default.refType(voidPointer);

	var AppExchangeInfo = exports.AppExchangeInfo = (0, _refStruct2.default)({
	  id: CString,
	  scope: CString,
	  name: CString,
	  vendor: CString
	});

	var PermissionSet = exports.PermissionSet = (0, _refStruct2.default)({
	  read: bool,
	  insert: bool,
	  update: bool,
	  delete: bool,
	  manage_permissions: bool
	});

	var ContainerPermissions = exports.ContainerPermissions = (0, _refStruct2.default)({
	  cont_name: CString,
	  access: PermissionSet
	});

	var RegisteredApp = exports.RegisteredApp = (0, _refStruct2.default)({
	  app_info: AppExchangeInfo,
	  containers: _ref2.default.refType(ContainerPermissions),
	  containers_len: usize,
	  containers_cap: usize
	});

	var RegisteredAppPointer = exports.RegisteredAppPointer = _ref2.default.refType(RegisteredApp);

	var AuthReq = exports.AuthReq = (0, _refStruct2.default)({
	  app: AppExchangeInfo,
	  app_container: bool,
	  containers: _ref2.default.refType(ContainerPermissions),
	  containers_len: usize,
	  containers_cap: usize
	});

	var AuthReqPointer = exports.AuthReqPointer = _ref2.default.refType(AuthReq);

	var ContainersReq = exports.ContainersReq = (0, _refStruct2.default)({
	  app: AppExchangeInfo,
	  containers: _ref2.default.refType(ContainerPermissions),
	  containers_len: usize,
	  containers_cap: usize
	});

	var FfiResult = exports.FfiResult = (0, _refStruct2.default)({
	  error_code: int32,
	  description: CString
	});

	var AccountInfo = exports.AccountInfo = (0, _refStruct2.default)({
	  mutations_done: u64,
	  mutations_available: u64
	});

	var ShareMData = exports.ShareMData = (0, _refStruct2.default)({
	  type_tag: u64,
	  name: XorName,
	  perms: PermissionSet
	});

	var ShareMDataReq = exports.ShareMDataReq = (0, _refStruct2.default)({
	  app: AppExchangeInfo,
	  mdata: _ref2.default.refType(ShareMData),
	  mdata_len: usize
	});

	var UserMetadata = exports.UserMetadata = (0, _refStruct2.default)({
	  name: CString,
	  description: CString
	});

	var AppAccess = exports.AppAccess = (0, _refStruct2.default)({
	  sign_key: U8Array,
	  permissions: PermissionSet,
	  app_name: CString,
	  app_id: u8Pointer,
	  app_id_len: usize
	});

	var AccountInfoPointer = exports.AccountInfoPointer = _ref2.default.refType(AccountInfo);

	var ContainersReqPointer = exports.ContainersReqPointer = _ref2.default.refType(ContainersReq);

	var ShareMDataReqPointer = exports.ShareMDataReqPointer = _ref2.default.refType(ShareMDataReq);

	var AppAccessPointer = exports.AppAccessPointer = _ref2.default.refType(AppAccess);

	var allocAppHandlePointer = exports.allocAppHandlePointer = function allocAppHandlePointer() {
	  return _ref2.default.alloc(ClientHandlePointer);
	};

	var allocCString = exports.allocCString = function allocCString(str) {
	  return _ref2.default.allocCString(str);
	};

	var allocAuthReq = exports.allocAuthReq = function allocAuthReq(req) {
	  return _ref2.default.alloc(AuthReq, req);
	};

	var allocContainerReq = exports.allocContainerReq = function allocContainerReq(req) {
	  return _ref2.default.alloc(ContainersReq, req);
	};

	var allocSharedMdataReq = exports.allocSharedMdataReq = function allocSharedMdataReq(req) {
	  return _ref2.default.alloc(ShareMDataReq, req);
		};

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	module.exports = require("ref");

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */

	var _ref = __webpack_require__(16)
	var assert = __webpack_require__(18)
	var debug = __webpack_require__(19)('ref:array')
	var ArrayIndex = __webpack_require__(27)
	var isArray = Array.isArray

	/**
	 * The Array "type" constructor.
	 * The returned constructor's API is highly influenced by the WebGL
	 * TypedArray API.
	 */

	module.exports = function Array (_type, _length) {
	  debug('defining new array "type"')
	  var type = _ref.coerceType(_type)
	  var fixedLength = _length | 0

	  /**
	   * This is the ArrayType "constructor" that gets returned.
	   */

	  function ArrayType (data, length) {
	    if (!(this instanceof ArrayType)) {
	      return new ArrayType(data, length)
	    }
	    debug('creating new array instance')
	    ArrayIndex.call(this)
	    var item_size = ArrayType.BYTES_PER_ELEMENT
	    if (0 === arguments.length) {
	      // new IntArray()
	      // use the "fixedLength" if provided, otherwise throw an Error
	      if (fixedLength > 0) {
	        this.length = fixedLength
	        this.buffer = new Buffer(this.length * item_size)
	      } else {
	        throw new Error('A "length", "array" or "buffer" must be passed as the first argument')
	      }
	    } else if ('number' == typeof data) {
	      // new IntArray(69)
	      this.length = data
	      this.buffer = new Buffer(this.length * item_size)
	    } else if (isArray(data)) {
	      // new IntArray([ 1, 2, 3, 4, 5 ], {len})
	      // use optional "length" if provided, otherwise use "fixedLength, otherwise
	      // use the Array's .length
	      var len = 0
	      if (null != length) {
	        len = length
	      } else if (fixedLength > 0) {
	        len = fixedLength
	      } else {
	        len = data.length
	      }
	      if (data.length < len) {
	        throw new Error('array length must be at least ' + len + ', got ' + data.length)
	      }
	      this.length = len
	      this.buffer = new Buffer(len * item_size)
	      for (var i = 0; i < len; i++) {
	        this[i] = data[i]
	      }
	    } else if (Buffer.isBuffer(data)) {
	      // new IntArray(Buffer(8))
	      var len = 0
	      if (null != length) {
	        len = length
	      } else if (fixedLength > 0) {
	        len = fixedLength
	      } else {
	        len = data.length / item_size | 0
	      }
	      var expectedLength = item_size * len
	      this.length = len
	      if (data.length != expectedLength) {
	        if (data.length < expectedLength) {
	          throw new Error('buffer length must be at least ' + expectedLength + ', got ' + data.length)
	        } else {
	          debug('resizing buffer from %d to %d', data.length, expectedLength)
	          data = data.slice(0, expectedLength)
	        }
	      }
	      this.buffer = data
	    }
	  }

	  // make array instances inherit from our `ArrayIndex.prototype`
	  ArrayType.prototype = Object.create(ArrayIndex.prototype, {
	    constructor: {
	      value: ArrayType,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    },
	    // "buffer" is the backing buffer instance
	    buffer: {
	      value: _ref.NULL,
	      enumerable: true,
	      writable: true,
	      configurable: true
	    },
	    // "node-ffi" calls this when passed an array instance to an ffi'd function
	    ref: {
	      value: ref,
	      enumerable: true,
	      writable: true,
	      configurable: true
	    },
	    // "slice" implementation
	    slice: {
	      value: slice,
	      enumerable: true,
	      writable: true,
	      configurable: true
	    }
	  })

	  // part of the "array-index" interface
	  ArrayType.prototype[ArrayIndex.get] = getter
	  ArrayType.prototype[ArrayIndex.set] = setter

	  // save down the "fixedLength" if specified. "ref-struct" needs this value
	  if (fixedLength > 0) {
	    ArrayType.fixedLength = fixedLength
	  }

	  // keep a reference to the base "type"
	  ArrayType.type = type
	  ArrayType.BYTES_PER_ELEMENT = type.indirection == 1 ? type.size : _ref.sizeof.pointer
	  assert(ArrayType.BYTES_PER_ELEMENT > 0)

	  // the ref "type" interface
	  if (fixedLength > 0) {
	    // this "type" is probably going in a ref-struct or being used manually
	    ArrayType.size = ArrayType.BYTES_PER_ELEMENT * fixedLength
	    ArrayType.alignment = type.alignment
	    ArrayType.indirection = 1
	    ArrayType.get = get
	    ArrayType.set = set
	  } else {
	    // this "type" is probably an argument/return value for a node-ffi function
	    ArrayType.size = _ref.sizeof.pointer
	    ArrayType.alignment = _ref.alignof.pointer
	    ArrayType.indirection = 1
	    ArrayType.get = getRef
	    ArrayType.set = setRef
	  }

	  // untilZeros() function
	  ArrayType.untilZeros = untilZeros

	  return ArrayType
	}

	/**
	 * The "get" function of the Array "type" interface.
	 * Most likely invoked when accessing within a "ref-struct" type.
	 */

	function get (buffer, offset) {
	  debug('Array "type" getter for buffer at offset', offset)
	  if (offset > 0) {
	    buffer = buffer.slice(offset)
	  }
	  return new this(buffer)
	}

	/**
	 * The "set" function of the Array "type" interface.
	 * Most likely invoked when setting within a "ref-struct" type.
	 */

	function set (buffer, offset, value) {
	  debug('Array "type" setter for buffer at offset', buffer, offset, value)
	  var array = this.get(buffer, offset)
	  var isInstance = value instanceof this
	  if (isInstance || isArray(value)) {
	    for (var i = 0; i < value.length; i++) {
	      array[i] = value[i]
	    }
	  } else {
	    throw new Error('not sure how to set into Array: ' + value)
	  }
	}

	/**
	 * Reads a pointer from the given offset and returns a new "array" instance of
	 * this type.
	 * Most likely invoked when getting an array instance back as a return value from
	 * an FFI'd function.
	 */

	function getRef (buffer, offset) {
	  debug('Array reference "type" getter for buffer at offset', offset)
	  return new this(buffer.readPointer(offset))
	}

	/**
	 * Most likely invoked when passing an array instance as an argument to an FFI'd
	 * function.
	 */

	function setRef (buffer, offset, value) {
	  debug('Array reference "type" setter for buffer at offset', offset)
	  var ptr
	  if (value instanceof this) {
	    ptr = value.buffer
	  } else {
	    ptr = new this(value).buffer
	  }
	  _ref.writePointer(buffer, offset, ptr)
	}

	/**
	 * Returns a reference to the backing buffer of this Array instance.
	 *
	 * i.e. if the array represents `int[]` (a.k.a. `int *`),
	 *      then the returned Buffer represents `int (*)[]` (a.k.a. `int **`)
	 */

	function ref () {
	  debug('ref()')
	  var type = this.constructor
	  var origSize = this.buffer.length
	  var r = _ref.ref(this.buffer)
	  r.type = Object.create(_ref.types.CString)
	  r.type.get = function (buf, offset) {
	    return new type(_ref.readPointer(buf, offset | 0, origSize))
	  }
	  r.type.set = function () {
	    assert(0, 'implement!!!')
	  }
	  return r
	}

	/**
	 * The "getter" implementation for the "array-index" interface.
	 */

	function getter (index) {
	  debug('getting array[%d]', index)
	  var size = this.constructor.BYTES_PER_ELEMENT
	  var baseType = this.constructor.type
	  var offset = size * index
	  var end = offset + size
	  var buffer = this.buffer
	  if (buffer.length < end) {
	    debug('reinterpreting buffer from %d to %d', buffer.length, end)
	    buffer = _ref.reinterpret(buffer, end)
	  }
	  return _ref.get(buffer, offset, baseType)
	}

	/**
	 * The "setter" implementation for  the "array-index" interface.
	 */

	function setter (index, value) {
	  debug('setting array[%d]', index)
	  var size = this.constructor.BYTES_PER_ELEMENT
	  var baseType = this.constructor.type
	  var offset = size * index
	  var end = offset + size
	  var buffer = this.buffer
	  if (buffer.length < end) {
	    debug('reinterpreting buffer from %d to %d', buffer.length, end)
	    buffer = _ref.reinterpret(buffer, end)
	  }
	  // TODO: DRY with getter()

	  _ref.set(buffer, offset, value, baseType)
	  return value
	}

	/**
	 * The "slice" implementation.
	 */

	function slice (start, end) {
	  var data

	  if (end) {
	    debug('slicing array from %d to %d', start, end)
	    data = this.buffer.slice(start*this.constructor.BYTES_PER_ELEMENT, end*this.constructor.BYTES_PER_ELEMENT)
	  } else {
	    debug('slicing array from %d', start)
	    data = this.buffer.slice(start*this.constructor.BYTES_PER_ELEMENT)
	  }

	  return new this.constructor(data)
	}

	/**
	 * Accepts a Buffer instance that should be an already-populated with data for the
	 * ArrayType. The "length" of the Array is determined by searching through the
	 * buffer's contents until an aligned NULL pointer is encountered.
	 *
	 * @param {Buffer} buffer the null-terminated buffer to convert into an Array
	 * @api public
	 */

	function untilZeros (buffer) {
	  return new this(_ref.reinterpretUntilZeros(buffer, this.type.size))
	}


/***/ }),
/* 18 */
/***/ (function(module, exports) {

	module.exports = require("assert");

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Detect Electron renderer process, which is node, but we should
	 * treat as a browser.
	 */

	if (typeof process !== 'undefined' && process.type === 'renderer') {
	  module.exports = __webpack_require__(20);
	} else {
	  module.exports = __webpack_require__(23);
	}


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = __webpack_require__(21);
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = 'undefined' != typeof chrome
	               && 'undefined' != typeof chrome.storage
	                  ? chrome.storage.local
	                  : localstorage();

	/**
	 * Colors.
	 */

	exports.colors = [
	  'lightseagreen',
	  'forestgreen',
	  'goldenrod',
	  'dodgerblue',
	  'darkorchid',
	  'crimson'
	];

	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */

	function useColors() {
	  // NB: In an Electron preload script, document will be defined but not fully
	  // initialized. Since we know we're in Chrome, we'll just detect this case
	  // explicitly
	  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
	    return true;
	  }

	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
	    // is firebug? http://stackoverflow.com/a/398120/376773
	    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
	    // is firefox >= v31?
	    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
	    // double check webkit in userAgent just in case we are in a worker
	    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
	}

	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */

	exports.formatters.j = function(v) {
	  try {
	    return JSON.stringify(v);
	  } catch (err) {
	    return '[UnexpectedJSONParseError]: ' + err.message;
	  }
	};


	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */

	function formatArgs(args) {
	  var useColors = this.useColors;

	  args[0] = (useColors ? '%c' : '')
	    + this.namespace
	    + (useColors ? ' %c' : ' ')
	    + args[0]
	    + (useColors ? '%c ' : ' ')
	    + '+' + exports.humanize(this.diff);

	  if (!useColors) return;

	  var c = 'color: ' + this.color;
	  args.splice(1, 0, c, 'color: inherit')

	  // the final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into
	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-zA-Z%]/g, function(match) {
	    if ('%%' === match) return;
	    index++;
	    if ('%c' === match) {
	      // we only are interested in the *last* %c
	      // (the user may have provided their own)
	      lastC = index;
	    }
	  });

	  args.splice(lastC, 0, c);
	}

	/**
	 * Invokes `console.log()` when available.
	 * No-op when `console.log` is not a "function".
	 *
	 * @api public
	 */

	function log() {
	  // this hackery is required for IE8/9, where
	  // the `console.log` function doesn't have 'apply'
	  return 'object' === typeof console
	    && console.log
	    && Function.prototype.apply.call(console.log, console, arguments);
	}

	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */

	function save(namespaces) {
	  try {
	    if (null == namespaces) {
	      exports.storage.removeItem('debug');
	    } else {
	      exports.storage.debug = namespaces;
	    }
	  } catch(e) {}
	}

	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */

	function load() {
	  var r;
	  try {
	    r = exports.storage.debug;
	  } catch(e) {}

	  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	  if (!r && typeof process !== 'undefined' && 'env' in process) {
	    r = process.env.DEBUG;
	  }

	  return r;
	}

	/**
	 * Enable namespaces listed in `localStorage.debug` initially.
	 */

	exports.enable(load());

	/**
	 * Localstorage attempts to return the localstorage.
	 *
	 * This is necessary because safari throws
	 * when a user disables cookies/localstorage
	 * and you attempt to access it.
	 *
	 * @return {LocalStorage}
	 * @api private
	 */

	function localstorage() {
	  try {
	    return window.localStorage;
	  } catch (e) {}
	}


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = __webpack_require__(22);

	/**
	 * The currently active debug mode names, and names to skip.
	 */

	exports.names = [];
	exports.skips = [];

	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	 */

	exports.formatters = {};

	/**
	 * Previous log timestamp.
	 */

	var prevTime;

	/**
	 * Select a color.
	 * @param {String} namespace
	 * @return {Number}
	 * @api private
	 */

	function selectColor(namespace) {
	  var hash = 0, i;

	  for (i in namespace) {
	    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
	    hash |= 0; // Convert to 32bit integer
	  }

	  return exports.colors[Math.abs(hash) % exports.colors.length];
	}

	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */

	function createDebug(namespace) {

	  function debug() {
	    // disabled?
	    if (!debug.enabled) return;

	    var self = debug;

	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;

	    // turn the `arguments` into a proper Array
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }

	    args[0] = exports.coerce(args[0]);

	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %O
	      args.unshift('%O');
	    }

	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);

	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });

	    // apply env-specific formatting (colors, etc.)
	    exports.formatArgs.call(self, args);

	    var logFn = debug.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }

	  debug.namespace = namespace;
	  debug.enabled = exports.enabled(namespace);
	  debug.useColors = exports.useColors();
	  debug.color = selectColor(namespace);

	  // env-specific initialization logic for debug instances
	  if ('function' === typeof exports.init) {
	    exports.init(debug);
	  }

	  return debug;
	}

	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */

	function enable(namespaces) {
	  exports.save(namespaces);

	  exports.names = [];
	  exports.skips = [];

	  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
	  var len = split.length;

	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}

	/**
	 * Disable debug output.
	 *
	 * @api public
	 */

	function disable() {
	  exports.enable('');
	}

	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */

	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}

	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */

	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}


/***/ }),
/* 22 */
/***/ (function(module, exports) {

	/**
	 * Helpers.
	 */

	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var y = d * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} [options]
	 * @throws {Error} throw an error if val is not a non-empty string or a number
	 * @return {String|Number}
	 * @api public
	 */

	module.exports = function(val, options) {
	  options = options || {};
	  var type = typeof val;
	  if (type === 'string' && val.length > 0) {
	    return parse(val);
	  } else if (type === 'number' && isNaN(val) === false) {
	    return options.long ? fmtLong(val) : fmtShort(val);
	  }
	  throw new Error(
	    'val is not a non-empty string or a valid number. val=' +
	      JSON.stringify(val)
	  );
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  str = String(str);
	  if (str.length > 100) {
	    return;
	  }
	  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
	    str
	  );
	  if (!match) {
	    return;
	  }
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	    default:
	      return undefined;
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtShort(ms) {
	  if (ms >= d) {
	    return Math.round(ms / d) + 'd';
	  }
	  if (ms >= h) {
	    return Math.round(ms / h) + 'h';
	  }
	  if (ms >= m) {
	    return Math.round(ms / m) + 'm';
	  }
	  if (ms >= s) {
	    return Math.round(ms / s) + 's';
	  }
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtLong(ms) {
	  return plural(ms, d, 'day') ||
	    plural(ms, h, 'hour') ||
	    plural(ms, m, 'minute') ||
	    plural(ms, s, 'second') ||
	    ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, n, name) {
	  if (ms < n) {
	    return;
	  }
	  if (ms < n * 1.5) {
	    return Math.floor(ms / n) + ' ' + name;
	  }
	  return Math.ceil(ms / n) + ' ' + name + 's';
	}


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var tty = __webpack_require__(24);
	var util = __webpack_require__(25);

	/**
	 * This is the Node.js implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = __webpack_require__(21);
	exports.init = init;
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;

	/**
	 * Colors.
	 */

	exports.colors = [6, 2, 3, 4, 5, 1];

	/**
	 * Build up the default `inspectOpts` object from the environment variables.
	 *
	 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
	 */

	exports.inspectOpts = Object.keys(process.env).filter(function (key) {
	  return /^debug_/i.test(key);
	}).reduce(function (obj, key) {
	  // camel-case
	  var prop = key
	    .substring(6)
	    .toLowerCase()
	    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });

	  // coerce string value into JS value
	  var val = process.env[key];
	  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
	  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
	  else if (val === 'null') val = null;
	  else val = Number(val);

	  obj[prop] = val;
	  return obj;
	}, {});

	/**
	 * The file descriptor to write the `debug()` calls to.
	 * Set the `DEBUG_FD` env variable to override with another value. i.e.:
	 *
	 *   $ DEBUG_FD=3 node script.js 3>debug.log
	 */

	var fd = parseInt(process.env.DEBUG_FD, 10) || 2;

	if (1 !== fd && 2 !== fd) {
	  util.deprecate(function(){}, 'except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)')()
	}

	var stream = 1 === fd ? process.stdout :
	             2 === fd ? process.stderr :
	             createWritableStdioStream(fd);

	/**
	 * Is stdout a TTY? Colored output is enabled when `true`.
	 */

	function useColors() {
	  return 'colors' in exports.inspectOpts
	    ? Boolean(exports.inspectOpts.colors)
	    : tty.isatty(fd);
	}

	/**
	 * Map %o to `util.inspect()`, all on a single line.
	 */

	exports.formatters.o = function(v) {
	  this.inspectOpts.colors = this.useColors;
	  return util.inspect(v, this.inspectOpts)
	    .split('\n').map(function(str) {
	      return str.trim()
	    }).join(' ');
	};

	/**
	 * Map %o to `util.inspect()`, allowing multiple lines if needed.
	 */

	exports.formatters.O = function(v) {
	  this.inspectOpts.colors = this.useColors;
	  return util.inspect(v, this.inspectOpts);
	};

	/**
	 * Adds ANSI color escape codes if enabled.
	 *
	 * @api public
	 */

	function formatArgs(args) {
	  var name = this.namespace;
	  var useColors = this.useColors;

	  if (useColors) {
	    var c = this.color;
	    var prefix = '  \u001b[3' + c + ';1m' + name + ' ' + '\u001b[0m';

	    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
	    args.push('\u001b[3' + c + 'm+' + exports.humanize(this.diff) + '\u001b[0m');
	  } else {
	    args[0] = new Date().toUTCString()
	      + ' ' + name + ' ' + args[0];
	  }
	}

	/**
	 * Invokes `util.format()` with the specified arguments and writes to `stream`.
	 */

	function log() {
	  return stream.write(util.format.apply(util, arguments) + '\n');
	}

	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */

	function save(namespaces) {
	  if (null == namespaces) {
	    // If you set a process.env field to null or undefined, it gets cast to the
	    // string 'null' or 'undefined'. Just delete instead.
	    delete process.env.DEBUG;
	  } else {
	    process.env.DEBUG = namespaces;
	  }
	}

	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */

	function load() {
	  return process.env.DEBUG;
	}

	/**
	 * Copied from `node/src/node.js`.
	 *
	 * XXX: It's lame that node doesn't expose this API out-of-the-box. It also
	 * relies on the undocumented `tty_wrap.guessHandleType()` which is also lame.
	 */

	function createWritableStdioStream (fd) {
	  var stream;
	  var tty_wrap = process.binding('tty_wrap');

	  // Note stream._type is used for test-module-load-list.js

	  switch (tty_wrap.guessHandleType(fd)) {
	    case 'TTY':
	      stream = new tty.WriteStream(fd);
	      stream._type = 'tty';

	      // Hack to have stream not keep the event loop alive.
	      // See https://github.com/joyent/node/issues/1726
	      if (stream._handle && stream._handle.unref) {
	        stream._handle.unref();
	      }
	      break;

	    case 'FILE':
	      var fs = __webpack_require__(2);
	      stream = new fs.SyncWriteStream(fd, { autoClose: false });
	      stream._type = 'fs';
	      break;

	    case 'PIPE':
	    case 'TCP':
	      var net = __webpack_require__(26);
	      stream = new net.Socket({
	        fd: fd,
	        readable: false,
	        writable: true
	      });

	      // FIXME Should probably have an option in net.Socket to create a
	      // stream from an existing fd which is writable only. But for now
	      // we'll just add this hack and set the `readable` member to false.
	      // Test: ./node test/fixtures/echo.js < /etc/passwd
	      stream.readable = false;
	      stream.read = null;
	      stream._type = 'pipe';

	      // FIXME Hack to have stream not keep the event loop alive.
	      // See https://github.com/joyent/node/issues/1726
	      if (stream._handle && stream._handle.unref) {
	        stream._handle.unref();
	      }
	      break;

	    default:
	      // Probably an error on in uv_guess_handle()
	      throw new Error('Implement me. Unknown stream file type!');
	  }

	  // For supporting legacy API we put the FD here.
	  stream.fd = fd;

	  stream._isStdio = true;

	  return stream;
	}

	/**
	 * Init logic for `debug` instances.
	 *
	 * Create a new `inspectOpts` object in case `useColors` is set
	 * differently for a particular `debug` instance.
	 */

	function init (debug) {
	  debug.inspectOpts = {};

	  var keys = Object.keys(exports.inspectOpts);
	  for (var i = 0; i < keys.length; i++) {
	    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	  }
	}

	/**
	 * Enable namespaces listed in `process.env.DEBUG` initially.
	 */

	exports.enable(load());


/***/ }),
/* 24 */
/***/ (function(module, exports) {

	module.exports = require("tty");

/***/ }),
/* 25 */
/***/ (function(module, exports) {

	module.exports = require("util");

/***/ }),
/* 26 */
/***/ (function(module, exports) {

	module.exports = require("net");

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */

	var Symbol = __webpack_require__(28);
	var debug = __webpack_require__(19)('array-index');

	var get = Symbol('get');
	var set = Symbol('set');
	var length = Symbol('length');

	/**
	 * JavaScript Array "length" is bound to an unsigned 32-bit int.
	 * See: http://stackoverflow.com/a/6155063/376773
	 */

	var MAX_LENGTH = Math.pow(2, 32);

	/**
	 * Module exports.
	 */

	module.exports = ArrayIndex;
	ArrayIndex.get = get;
	ArrayIndex.set = set;

	/**
	 * Subclass this.
	 */

	function ArrayIndex (_length) {
	  Object.defineProperty(this, 'length', {
	    get: getLength,
	    set: setLength,
	    enumerable: false,
	    configurable: true
	  });

	  this[length] = 0;

	  if (arguments.length > 0) {
	    setLength.call(this, _length);
	  }
	}

	/**
	 * You overwrite the "get" Symbol in your subclass.
	 */

	ArrayIndex.prototype[ArrayIndex.get] = function () {
	  throw new Error('you must implement the `ArrayIndex.get` Symbol');
	};

	/**
	 * You overwrite the "set" Symbol in your subclass.
	 */

	ArrayIndex.prototype[ArrayIndex.set] = function () {
	  throw new Error('you must implement the `ArrayIndex.set` Symbol');
	};

	/**
	 * Converts this array class into a real JavaScript Array. Note that this
	 * is a "flattened" array and your defined getters and setters won't be invoked
	 * when you interact with the returned Array. This function will call the
	 * getter on every array index of the object.
	 *
	 * @return {Array} The flattened array
	 * @api public
	 */

	ArrayIndex.prototype.toArray = function toArray () {
	  var i = 0;
	  var l = this.length;
	  var array = new Array(l);
	  for (; i < l; i++) {
	    array[i] = this[i];
	  }
	  return array;
	};

	/**
	 * Basic support for `JSON.stringify()`.
	 */

	ArrayIndex.prototype.toJSON = function toJSON () {
	  return this.toArray();
	};

	/**
	 * toString() override. Use Array.prototype.toString().
	 */

	ArrayIndex.prototype.toString = function toString () {
	  var a = this.toArray();
	  return a.toString.apply(a, arguments);
	};

	/**
	 * inspect() override. For the REPL.
	 */

	ArrayIndex.prototype.inspect = function inspect () {
	  var a = this.toArray();
	  Object.keys(this).forEach(function (k) {
	    a[k] = this[k];
	  }, this);
	  return a;
	};

	/**
	 * Getter for the "length" property.
	 * Returns the value of the "length" Symbol.
	 */

	function getLength () {
	  debug('getting "length": %o', this[length]);
	  return this[length];
	};

	/**
	 * Setter for the "length" property.
	 * Calls "ensureLength()", then sets the "length" Symbol.
	 */

	function setLength (v) {
	  debug('setting "length": %o', v);
	  return this[length] = ensureLength(this, v);
	};

	/**
	 * Ensures that getters/setters from 0 up to "_newLength" have been defined
	 * on `Object.getPrototypeOf(this)`.
	 *
	 * @api private
	 */

	function ensureLength (self, _newLength) {
	  var newLength;
	  if (_newLength > MAX_LENGTH) {
	    newLength = MAX_LENGTH;
	  } else {
	    newLength = _newLength | 0;
	  }
	  var proto = Object.getPrototypeOf(self);
	  var cur = proto[length] | 0;
	  var num = newLength - cur;
	  if (num > 0) {
	    var desc = {};
	    debug('creating a descriptor object with %o entries', num);
	    for (var i = cur; i < newLength; i++) {
	      desc[i] = setup(i);
	    }
	    debug('calling `Object.defineProperties()` with %o entries', num);
	    Object.defineProperties(proto, desc);
	    proto[length] = newLength;
	  }
	  return newLength;
	}

	/**
	 * Returns a property descriptor for the given "index", with "get" and "set"
	 * functions created within the closure.
	 *
	 * @api private
	 */

	function setup (index) {
	  function get () {
	    return this[ArrayIndex.get](index);
	  }
	  function set (v) {
	    return this[ArrayIndex.set](index, v);
	  }
	  return {
	    enumerable: true,
	    configurable: true,
	    get: get,
	    set: set
	  };
	}


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(29)() ? Symbol : __webpack_require__(30);


/***/ }),
/* 29 */
/***/ (function(module, exports) {

	'use strict';

	var validTypes = { object: true, symbol: true };

	module.exports = function () {
		var symbol;
		if (typeof Symbol !== 'function') return false;
		symbol = Symbol('test symbol');
		try { String(symbol); } catch (e) { return false; }

		// Return 'true' also for polyfills
		if (!validTypes[typeof Symbol.iterator]) return false;
		if (!validTypes[typeof Symbol.toPrimitive]) return false;
		if (!validTypes[typeof Symbol.toStringTag]) return false;

		return true;
	};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	// ES2015 Symbol polyfill for environments that do not (or partially) support it

	'use strict';

	var d              = __webpack_require__(31)
	  , validateSymbol = __webpack_require__(46)

	  , create = Object.create, defineProperties = Object.defineProperties
	  , defineProperty = Object.defineProperty, objPrototype = Object.prototype
	  , NativeSymbol, SymbolPolyfill, HiddenSymbol, globalSymbols = create(null)
	  , isNativeSafe;

	if (typeof Symbol === 'function') {
		NativeSymbol = Symbol;
		try {
			String(NativeSymbol());
			isNativeSafe = true;
		} catch (ignore) {}
	}

	var generateName = (function () {
		var created = create(null);
		return function (desc) {
			var postfix = 0, name, ie11BugWorkaround;
			while (created[desc + (postfix || '')]) ++postfix;
			desc += (postfix || '');
			created[desc] = true;
			name = '@@' + desc;
			defineProperty(objPrototype, name, d.gs(null, function (value) {
				// For IE11 issue see:
				// https://connect.microsoft.com/IE/feedbackdetail/view/1928508/
				//    ie11-broken-getters-on-dom-objects
				// https://github.com/medikoo/es6-symbol/issues/12
				if (ie11BugWorkaround) return;
				ie11BugWorkaround = true;
				defineProperty(this, name, d(value));
				ie11BugWorkaround = false;
			}));
			return name;
		};
	}());

	// Internal constructor (not one exposed) for creating Symbol instances.
	// This one is used to ensure that `someSymbol instanceof Symbol` always return false
	HiddenSymbol = function Symbol(description) {
		if (this instanceof HiddenSymbol) throw new TypeError('Symbol is not a constructor');
		return SymbolPolyfill(description);
	};

	// Exposed `Symbol` constructor
	// (returns instances of HiddenSymbol)
	module.exports = SymbolPolyfill = function Symbol(description) {
		var symbol;
		if (this instanceof Symbol) throw new TypeError('Symbol is not a constructor');
		if (isNativeSafe) return NativeSymbol(description);
		symbol = create(HiddenSymbol.prototype);
		description = (description === undefined ? '' : String(description));
		return defineProperties(symbol, {
			__description__: d('', description),
			__name__: d('', generateName(description))
		});
	};
	defineProperties(SymbolPolyfill, {
		for: d(function (key) {
			if (globalSymbols[key]) return globalSymbols[key];
			return (globalSymbols[key] = SymbolPolyfill(String(key)));
		}),
		keyFor: d(function (s) {
			var key;
			validateSymbol(s);
			for (key in globalSymbols) if (globalSymbols[key] === s) return key;
		}),

		// To ensure proper interoperability with other native functions (e.g. Array.from)
		// fallback to eventual native implementation of given symbol
		hasInstance: d('', (NativeSymbol && NativeSymbol.hasInstance) || SymbolPolyfill('hasInstance')),
		isConcatSpreadable: d('', (NativeSymbol && NativeSymbol.isConcatSpreadable) ||
			SymbolPolyfill('isConcatSpreadable')),
		iterator: d('', (NativeSymbol && NativeSymbol.iterator) || SymbolPolyfill('iterator')),
		match: d('', (NativeSymbol && NativeSymbol.match) || SymbolPolyfill('match')),
		replace: d('', (NativeSymbol && NativeSymbol.replace) || SymbolPolyfill('replace')),
		search: d('', (NativeSymbol && NativeSymbol.search) || SymbolPolyfill('search')),
		species: d('', (NativeSymbol && NativeSymbol.species) || SymbolPolyfill('species')),
		split: d('', (NativeSymbol && NativeSymbol.split) || SymbolPolyfill('split')),
		toPrimitive: d('', (NativeSymbol && NativeSymbol.toPrimitive) || SymbolPolyfill('toPrimitive')),
		toStringTag: d('', (NativeSymbol && NativeSymbol.toStringTag) || SymbolPolyfill('toStringTag')),
		unscopables: d('', (NativeSymbol && NativeSymbol.unscopables) || SymbolPolyfill('unscopables'))
	});

	// Internal tweaks for real symbol producer
	defineProperties(HiddenSymbol.prototype, {
		constructor: d(SymbolPolyfill),
		toString: d('', function () { return this.__name__; })
	});

	// Proper implementation of methods exposed on Symbol.prototype
	// They won't be accessible on produced symbol instances as they derive from HiddenSymbol.prototype
	defineProperties(SymbolPolyfill.prototype, {
		toString: d(function () { return 'Symbol (' + validateSymbol(this).__description__ + ')'; }),
		valueOf: d(function () { return validateSymbol(this); })
	});
	defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toPrimitive, d('', function () {
		var symbol = validateSymbol(this);
		if (typeof symbol === 'symbol') return symbol;
		return symbol.toString();
	}));
	defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toStringTag, d('c', 'Symbol'));

	// Proper implementaton of toPrimitive and toStringTag for returned symbol instances
	defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toStringTag,
		d('c', SymbolPolyfill.prototype[SymbolPolyfill.toStringTag]));

	// Note: It's important to define `toPrimitive` as last one, as some implementations
	// implement `toPrimitive` natively without implementing `toStringTag` (or other specified symbols)
	// And that may invoke error in definition flow:
	// See: https://github.com/medikoo/es6-symbol/issues/13#issuecomment-164146149
	defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toPrimitive,
		d('c', SymbolPolyfill.prototype[SymbolPolyfill.toPrimitive]));


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var assign        = __webpack_require__(32)
	  , normalizeOpts = __webpack_require__(41)
	  , isCallable    = __webpack_require__(42)
	  , contains      = __webpack_require__(43)

	  , d;

	d = module.exports = function (dscr, value/*, options*/) {
		var c, e, w, options, desc;
		if ((arguments.length < 2) || (typeof dscr !== 'string')) {
			options = value;
			value = dscr;
			dscr = null;
		} else {
			options = arguments[2];
		}
		if (dscr == null) {
			c = w = true;
			e = false;
		} else {
			c = contains.call(dscr, 'c');
			e = contains.call(dscr, 'e');
			w = contains.call(dscr, 'w');
		}

		desc = { value: value, configurable: c, enumerable: e, writable: w };
		return !options ? desc : assign(normalizeOpts(options), desc);
	};

	d.gs = function (dscr, get, set/*, options*/) {
		var c, e, options, desc;
		if (typeof dscr !== 'string') {
			options = set;
			set = get;
			get = dscr;
			dscr = null;
		} else {
			options = arguments[3];
		}
		if (get == null) {
			get = undefined;
		} else if (!isCallable(get)) {
			options = get;
			get = set = undefined;
		} else if (set == null) {
			set = undefined;
		} else if (!isCallable(set)) {
			options = set;
			set = undefined;
		}
		if (dscr == null) {
			c = true;
			e = false;
		} else {
			c = contains.call(dscr, 'c');
			e = contains.call(dscr, 'e');
		}

		desc = { get: get, set: set, configurable: c, enumerable: e };
		return !options ? desc : assign(normalizeOpts(options), desc);
	};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = __webpack_require__(33)()
		? Object.assign
		: __webpack_require__(34);


/***/ }),
/* 33 */
/***/ (function(module, exports) {

	"use strict";

	module.exports = function () {
		var assign = Object.assign, obj;
		if (typeof assign !== "function") return false;
		obj = { foo: "raz" };
		assign(obj, { bar: "dwa" }, { trzy: "trzy" });
		return (obj.foo + obj.bar + obj.trzy) === "razdwatrzy";
	};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var keys  = __webpack_require__(35)
	  , value = __webpack_require__(40)
	  , max   = Math.max;

	module.exports = function (dest, src /*, …srcn*/) {
		var error, i, length = max(arguments.length, 2), assign;
		dest = Object(value(dest));
		assign = function (key) {
			try {
				dest[key] = src[key];
			} catch (e) {
				if (!error) error = e;
			}
		};
		for (i = 1; i < length; ++i) {
			src = arguments[i];
			keys(src).forEach(assign);
		}
		if (error !== undefined) throw error;
		return dest;
	};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = __webpack_require__(36)()
		? Object.keys
		: __webpack_require__(37);


/***/ }),
/* 36 */
/***/ (function(module, exports) {

	"use strict";

	module.exports = function () {
		try {
			Object.keys("primitive");
			return true;
		} catch (e) {
	 return false;
	}
	};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var isValue = __webpack_require__(38);

	var keys = Object.keys;

	module.exports = function (object) {
		return keys(isValue(object) ? Object(object) : object);
	};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var _undefined = __webpack_require__(39)(); // Support ES3 engines

	module.exports = function (val) {
	 return (val !== _undefined) && (val !== null);
	};


/***/ }),
/* 39 */
/***/ (function(module, exports) {

	"use strict";

	// eslint-disable-next-line no-empty-function
	module.exports = function () {};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var isValue = __webpack_require__(38);

	module.exports = function (value) {
		if (!isValue(value)) throw new TypeError("Cannot use null or undefined");
		return value;
	};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var isValue = __webpack_require__(38);

	var forEach = Array.prototype.forEach, create = Object.create;

	var process = function (src, obj) {
		var key;
		for (key in src) obj[key] = src[key];
	};

	// eslint-disable-next-line no-unused-vars
	module.exports = function (opts1 /*, …options*/) {
		var result = create(null);
		forEach.call(arguments, function (options) {
			if (!isValue(options)) return;
			process(Object(options), result);
		});
		return result;
	};


/***/ }),
/* 42 */
/***/ (function(module, exports) {

	// Deprecated

	"use strict";

	module.exports = function (obj) {
	 return typeof obj === "function";
	};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = __webpack_require__(44)()
		? String.prototype.contains
		: __webpack_require__(45);


/***/ }),
/* 44 */
/***/ (function(module, exports) {

	"use strict";

	var str = "razdwatrzy";

	module.exports = function () {
		if (typeof str.contains !== "function") return false;
		return (str.contains("dwa") === true) && (str.contains("foo") === false);
	};


/***/ }),
/* 45 */
/***/ (function(module, exports) {

	"use strict";

	var indexOf = String.prototype.indexOf;

	module.exports = function (searchString/*, position*/) {
		return indexOf.call(this, searchString, arguments[1]) > -1;
	};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var isSymbol = __webpack_require__(47);

	module.exports = function (value) {
		if (!isSymbol(value)) throw new TypeError(value + " is not a symbol");
		return value;
	};


/***/ }),
/* 47 */
/***/ (function(module, exports) {

	'use strict';

	module.exports = function (x) {
		if (!x) return false;
		if (typeof x === 'symbol') return true;
		if (!x.constructor) return false;
		if (x.constructor.name !== 'Symbol') return false;
		return (x[x.constructor.toStringTag] === 'Symbol');
	};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	
	/**
	 * An interface for modeling and instantiating C-style data structures. This is
	 * not a constructor per-say, but a constructor generator. It takes an array of
	 * tuples, the left side being the type, and the right side being a field name.
	 * The order should be the same order it would appear in the C-style struct
	 * definition. It returns a function that can be used to construct an object that
	 * reads and writes to the data structure using properties specified by the
	 * initial field list.
	 *
	 * The only verboten field names are "ref", which is used used on struct
	 * instances as a function to retrieve the backing Buffer instance of the
	 * struct, and "ref.buffer" which contains the backing Buffer instance.
	 *
	 *
	 * Example:
	 *
	 * ``` javascript
	 * var ref = require('ref')
	 * var Struct = require('ref-struct')
	 *
	 * // create the `char *` type
	 * var charPtr = ref.refType(ref.types.char)
	 * var int = ref.types.int
	 *
	 * // create the struct "type" / constructor
	 * var PasswordEntry = Struct({
	 *     'username': 'string'
	 *   , 'password': 'string'
	 *   , 'salt':     int
	 * })
	 *
	 * // create an instance of the struct, backed a Buffer instance
	 * var pwd = new PasswordEntry()
	 * pwd.username = 'ricky'
	 * pwd.password = 'rbransonlovesnode.js'
	 * pwd.salt = (Math.random() * 1000000) | 0
	 *
	 * pwd.username // → 'ricky'
	 * pwd.password // → 'rbransonlovesnode.js'
	 * pwd.salt     // → 820088
	 * ```
	 */

	/**
	 * Module dependencies.
	 */

	var ref = __webpack_require__(16)
	var util = __webpack_require__(25)
	var assert = __webpack_require__(18)
	var debug = __webpack_require__(19)('ref:struct')

	/**
	 * Module exports.
	 */

	module.exports = Struct

	/**
	 * The Struct "type" meta-constructor.
	 */

	function Struct () {
	  debug('defining new struct "type"')

	  /**
	   * This is the "constructor" of the Struct type that gets returned.
	   *
	   * Invoke it with `new` to create a new Buffer instance backing the struct.
	   * Pass it an existing Buffer instance to use that as the backing buffer.
	   * Pass in an Object containing the struct fields to auto-populate the
	   * struct with the data.
	   */

	  function StructType (arg, data) {
	    if (!(this instanceof StructType)) {
	      return new StructType(arg, data)
	    }
	    debug('creating new struct instance')
	    var store
	    if (Buffer.isBuffer(arg)) {
	      debug('using passed-in Buffer instance to back the struct', arg)
	      assert(arg.length >= StructType.size, 'Buffer instance must be at least ' +
	          StructType.size + ' bytes to back this struct type')
	      store = arg
	      arg = data
	    } else {
	      debug('creating new Buffer instance to back the struct (size: %d)', StructType.size)
	      store = new Buffer(StructType.size)
	    }

	    // set the backing Buffer store
	    store.type = StructType
	    this['ref.buffer'] = store

	    if (arg) {
	      for (var key in arg) {
	        // hopefully hit the struct setters
	        this[key] = arg[key]
	      }
	    }
	    StructType._instanceCreated = true
	  }

	  // make instances inherit from the `proto`
	  StructType.prototype = Object.create(proto, {
	    constructor: {
	        value: StructType
	      , enumerable: false
	      , writable: true
	      , configurable: true
	    }
	  })

	  StructType.defineProperty = defineProperty
	  StructType.toString = toString
	  StructType.fields = {}

	  var opt = (arguments.length > 0 && arguments[1]) ? arguments[1] : {};
	  // Setup the ref "type" interface. The constructor doubles as the "type" object
	  StructType.size = 0
	  StructType.alignment = 0
	  StructType.indirection = 1
	  StructType.isPacked = opt.packed ? Boolean(opt.packed) : false
	  StructType.get = get
	  StructType.set = set

	  // Read the fields list and apply all the fields to the struct
	  // TODO: Better arg handling... (maybe look at ES6 binary data API?)
	  var arg = arguments[0]
	  if (Array.isArray(arg)) {
	    // legacy API
	    arg.forEach(function (a) {
	      var type = a[0]
	      var name = a[1]
	      StructType.defineProperty(name, type)
	    })
	  } else if (typeof arg === 'object') {
	    Object.keys(arg).forEach(function (name) {
	      var type = arg[name]
	      StructType.defineProperty(name, type)
	    })
	  }

	  return StructType
	}

	/**
	 * The "get" function of the Struct "type" interface
	 */

	function get (buffer, offset) {
	  debug('Struct "type" getter for buffer at offset', buffer, offset)
	  if (offset > 0) {
	    buffer = buffer.slice(offset)
	  }
	  return new this(buffer)
	}

	/**
	 * The "set" function of the Struct "type" interface
	 */

	function set (buffer, offset, value) {
	  debug('Struct "type" setter for buffer at offset', buffer, offset, value)
	  var isStruct = value instanceof this
	  if (isStruct) {
	    // optimization: copy the buffer contents directly rather
	    // than going through the ref-struct constructor
	    value['ref.buffer'].copy(buffer, offset, 0, this.size)
	  } else {
	    if (offset > 0) {
	      buffer = buffer.slice(offset)
	    }
	    new this(buffer, value)
	  }
	}

	/**
	 * Custom `toString()` override for struct type instances.
	 */

	function toString () {
	  return '[StructType]'
	}

	/**
	 * Adds a new field to the struct instance with the given name and type.
	 * Note that this function will throw an Error if any instances of the struct
	 * type have already been created, therefore this function must be called at the
	 * beginning, before any instances are created.
	 */

	function defineProperty (name, type) {
	  debug('defining new struct type field', name)

	  // allow string types for convenience
	  type = ref.coerceType(type)

	  assert(!this._instanceCreated, 'an instance of this Struct type has already ' +
	      'been created, cannot add new "fields" anymore')
	  assert.equal('string', typeof name, 'expected a "string" field name')
	  assert(type && /object|function/i.test(typeof type) && 'size' in type &&
	      'indirection' in type
	      , 'expected a "type" object describing the field type: "' + type + '"')
	  assert(type.indirection > 1 || type.size > 0,
	      '"type" object must have a size greater than 0')
	  assert(!(name in this.prototype), 'the field "' + name +
	      '" already exists in this Struct type')

	  var field = {
	    type: type
	  }
	  this.fields[name] = field

	  // define the getter/setter property
	  var desc = { enumerable: true , configurable: true }
	  desc.get = function () {
	    debug('getting "%s" struct field (offset: %d)', name, field.offset)
	    return ref.get(this['ref.buffer'], field.offset, type)
	  }
	  desc.set = function (value) {
	    debug('setting "%s" struct field (offset: %d)', name, field.offset, value)
	    return ref.set(this['ref.buffer'], field.offset, value, type)
	  }

	  // calculate the new size and field offsets
	  recalc(this)

	  Object.defineProperty(this.prototype, name, desc)
	}

	function recalc (struct) {

	  // reset size and alignment
	  struct.size = 0
	  struct.alignment = 0

	  var fieldNames = Object.keys(struct.fields)

	  // first loop through is to determine the `alignment` of this struct
	  fieldNames.forEach(function (name) {
	    var field = struct.fields[name]
	    var type = field.type
	    var alignment = type.alignment || ref.alignof.pointer
	    if (type.indirection > 1) {
	      alignment = ref.alignof.pointer
	    }
	    if (struct.isPacked) {
	      struct.alignment = Math.min(struct.alignment || alignment, alignment)
	    } else {
	      struct.alignment = Math.max(struct.alignment, alignment)
	    }
	  })

	  // second loop through sets the `offset` property on each "field"
	  // object, and sets the `struct.size` as we go along
	  fieldNames.forEach(function (name) {
	    var field = struct.fields[name]
	    var type = field.type

	    if (null != type.fixedLength) {
	      // "ref-array" types set the "fixedLength" prop. don't treat arrays like one
	      // contiguous entity. instead, treat them like individual elements in the
	      // struct. doing this makes the padding end up being calculated correctly.
	      field.offset = addType(type.type)
	      for (var i = 1; i < type.fixedLength; i++) {
	        addType(type.type)
	      }
	    } else {
	      field.offset = addType(type)
	    }
	  })

	  function addType (type) {
	    var offset = struct.size
	    var align = type.indirection === 1 ? type.alignment : ref.alignof.pointer
	    var padding = struct.isPacked ? 0 : (align - (offset % align)) % align
	    var size = type.indirection === 1 ? type.size : ref.sizeof.pointer

	    offset += padding

	    if (!struct.isPacked) {
	      assert.equal(offset % align, 0, "offset should align")
	    }

	    // adjust the "size" of the struct type
	    struct.size = offset + size

	    // return the calulated offset
	    return offset
	  }

	  // any final padding?
	  var left = struct.size % struct.alignment
	  if (left > 0) {
	    debug('additional padding to the end of struct:', struct.alignment - left)
	    struct.size += struct.alignment - left
	  }
	}

	/**
	 * this is the custom prototype of Struct type instances.
	 */

	var proto = {}

	/**
	 * set a placeholder variable on the prototype so that defineProperty() will
	 * throw an error if you try to define a struct field with the name "buffer".
	 */

	proto['ref.buffer'] = ref.NULL

	/**
	 * Flattens the Struct instance into a regular JavaScript Object. This function
	 * "gets" all the defined properties.
	 *
	 * @api public
	 */

	proto.toObject = function toObject () {
	  var obj = {}
	  Object.keys(this.constructor.fields).forEach(function (k) {
	    obj[k] = this[k]
	  }, this)
	  return obj
	}

	/**
	 * Basic `JSON.stringify(struct)` support.
	 */

	proto.toJSON = function toJSON () {
	  return this.toObject()
	}

	/**
	 * `.inspect()` override. For the REPL.
	 *
	 * @api public
	 */

	proto.inspect = function inspect () {
	  var obj = this.toObject()
	  // add instance's "own properties"
	  Object.keys(this).forEach(function (k) {
	    obj[k] = this[k]
	  }, this)
	  return util.inspect(obj)
	}

	/**
	 * returns a Buffer pointing to this struct data structure.
	 */

	proto.ref = function ref () {
	  return this['ref.buffer']
	}


/***/ })
/******/ ]);
//# sourceMappingURL=protocol.js.map