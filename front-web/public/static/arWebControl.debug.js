(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('core-js/modules/es.array.concat'), require('core-js/modules/es.array.for-each'), require('core-js/modules/es.array.index-of'), require('core-js/modules/es.array.iterator'), require('core-js/modules/es.map'), require('core-js/modules/es.object.to-string'), require('core-js/modules/es.regexp.exec'), require('core-js/modules/es.string.iterator'), require('core-js/modules/es.string.split'), require('core-js/modules/web.dom-collections.for-each'), require('core-js/modules/web.dom-collections.iterator')) :
	typeof define === 'function' && define.amd ? define(['core-js/modules/es.array.concat', 'core-js/modules/es.array.for-each', 'core-js/modules/es.array.index-of', 'core-js/modules/es.array.iterator', 'core-js/modules/es.map', 'core-js/modules/es.object.to-string', 'core-js/modules/es.regexp.exec', 'core-js/modules/es.string.iterator', 'core-js/modules/es.string.split', 'core-js/modules/web.dom-collections.for-each', 'core-js/modules/web.dom-collections.iterator'], factory) :
	(global = global || self, global.ARWebControl = factory());
}(this, (function () { 'use strict';

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var _global = createCommonjsModule(function (module) {
	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self
	  // eslint-disable-next-line no-new-func
	  : Function('return this')();
	if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
	});

	var _global$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': _global,
		__moduleExports: _global
	});

	var _core = createCommonjsModule(function (module) {
	var core = module.exports = { version: '2.6.11' };
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
	});
	var _core_1 = _core.version;

	var _core$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': _core,
		__moduleExports: _core,
		version: _core_1
	});

	var _isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	var _isObject$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': _isObject,
		__moduleExports: _isObject
	});

	var isObject = ( _isObject$1 && _isObject ) || _isObject$1;

	var _anObject = function (it) {
	  if (!isObject(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};

	var _anObject$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': _anObject,
		__moduleExports: _anObject
	});

	var _fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (e) {
	    return true;
	  }
	};

	var _fails$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': _fails,
		__moduleExports: _fails
	});

	var require$$1 = ( _fails$1 && _fails ) || _fails$1;

	// Thank's IE8 for his funny defineProperty
	var _descriptors = !require$$1(function () {
	  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
	});

	var _descriptors$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': _descriptors,
		__moduleExports: _descriptors
	});

	var global = ( _global$1 && _global ) || _global$1;

	var document$1 = global.document;
	// typeof document.createElement is 'object' in old IE
	var is = isObject(document$1) && isObject(document$1.createElement);
	var _domCreate = function (it) {
	  return is ? document$1.createElement(it) : {};
	};

	var _domCreate$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': _domCreate,
		__moduleExports: _domCreate
	});

	var require$$0 = ( _descriptors$1 && _descriptors ) || _descriptors$1;

	var require$$2 = ( _domCreate$1 && _domCreate ) || _domCreate$1;

	var _ie8DomDefine = !require$$0 && !require$$1(function () {
	  return Object.defineProperty(require$$2('div'), 'a', { get: function () { return 7; } }).a != 7;
	});

	var _ie8DomDefine$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': _ie8DomDefine,
		__moduleExports: _ie8DomDefine
	});

	// 7.1.1 ToPrimitive(input [, PreferredType])

	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var _toPrimitive = function (it, S) {
	  if (!isObject(it)) return it;
	  var fn, val;
	  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var _toPrimitive$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': _toPrimitive,
		__moduleExports: _toPrimitive
	});

	var anObject = ( _anObject$1 && _anObject ) || _anObject$1;

	var IE8_DOM_DEFINE = ( _ie8DomDefine$1 && _ie8DomDefine ) || _ie8DomDefine$1;

	var toPrimitive = ( _toPrimitive$1 && _toPrimitive ) || _toPrimitive$1;

	var dP = Object.defineProperty;

	var f = require$$0 ? Object.defineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (IE8_DOM_DEFINE) try {
	    return dP(O, P, Attributes);
	  } catch (e) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var _objectDp = {
		f: f
	};

	var _objectDp$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': _objectDp,
		__moduleExports: _objectDp,
		f: f
	});

	var _propertyDesc = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var _propertyDesc$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': _propertyDesc,
		__moduleExports: _propertyDesc
	});

	var dP$1 = ( _objectDp$1 && _objectDp ) || _objectDp$1;

	var createDesc = ( _propertyDesc$1 && _propertyDesc ) || _propertyDesc$1;

	var _hide = require$$0 ? function (object, key, value) {
	  return dP$1.f(object, key, createDesc(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var _hide$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': _hide,
		__moduleExports: _hide
	});

	var hasOwnProperty = {}.hasOwnProperty;
	var _has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var _has$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': _has,
		__moduleExports: _has
	});

	var id = 0;
	var px = Math.random();
	var _uid = function (key) {
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

	var _uid$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': _uid,
		__moduleExports: _uid
	});

	var _library = false;

	var _library$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': _library,
		__moduleExports: _library
	});

	var core = ( _core$1 && _core ) || _core$1;

	var require$$0$1 = ( _library$1 && _library ) || _library$1;

	var _shared = createCommonjsModule(function (module) {
	var SHARED = '__core-js_shared__';
	var store = global[SHARED] || (global[SHARED] = {});

	(module.exports = function (key, value) {
	  return store[key] || (store[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: core.version,
	  mode: require$$0$1 ? 'pure' : 'global',
	  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
	});
	});

	var _shared$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': _shared,
		__moduleExports: _shared
	});

	var require$$0$2 = ( _shared$1 && _shared ) || _shared$1;

	var _functionToString = require$$0$2('native-function-to-string', Function.toString);

	var _functionToString$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': _functionToString,
		__moduleExports: _functionToString
	});

	var hide = ( _hide$1 && _hide ) || _hide$1;

	var has = ( _has$1 && _has ) || _has$1;

	var require$$0$3 = ( _uid$1 && _uid ) || _uid$1;

	var $toString = ( _functionToString$1 && _functionToString ) || _functionToString$1;

	var _redefine = createCommonjsModule(function (module) {
	var SRC = require$$0$3('src');

	var TO_STRING = 'toString';
	var TPL = ('' + $toString).split(TO_STRING);

	core.inspectSource = function (it) {
	  return $toString.call(it);
	};

	(module.exports = function (O, key, val, safe) {
	  var isFunction = typeof val == 'function';
	  if (isFunction) has(val, 'name') || hide(val, 'name', key);
	  if (O[key] === val) return;
	  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
	  if (O === global) {
	    O[key] = val;
	  } else if (!safe) {
	    delete O[key];
	    hide(O, key, val);
	  } else if (O[key]) {
	    O[key] = val;
	  } else {
	    hide(O, key, val);
	  }
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, TO_STRING, function toString() {
	  return typeof this == 'function' && this[SRC] || $toString.call(this);
	});
	});

	var _redefine$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': _redefine,
		__moduleExports: _redefine
	});

	var _aFunction = function (it) {
	  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
	  return it;
	};

	var _aFunction$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': _aFunction,
		__moduleExports: _aFunction
	});

	var aFunction = ( _aFunction$1 && _aFunction ) || _aFunction$1;

	// optional / simple context binding

	var _ctx = function (fn, that, length) {
	  aFunction(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	var _ctx$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': _ctx,
		__moduleExports: _ctx
	});

	var redefine = ( _redefine$1 && _redefine ) || _redefine$1;

	var ctx = ( _ctx$1 && _ctx ) || _ctx$1;

	var PROTOTYPE = 'prototype';

	var $export = function (type, name, source) {
	  var IS_FORCED = type & $export.F;
	  var IS_GLOBAL = type & $export.G;
	  var IS_STATIC = type & $export.S;
	  var IS_PROTO = type & $export.P;
	  var IS_BIND = type & $export.B;
	  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
	  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
	  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
	  var key, own, out, exp;
	  if (IS_GLOBAL) source = name;
	  for (key in source) {
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    // export native or passed
	    out = (own ? target : source)[key];
	    // bind timers to global for call from export context
	    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // extend global
	    if (target) redefine(target, key, out, type & $export.U);
	    // export
	    if (exports[key] != out) hide(exports, key, exp);
	    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
	  }
	};
	global.core = core;
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library`
	var _export = $export;

	var _export$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': _export,
		__moduleExports: _export
	});

	var navigator = global.navigator;

	var _userAgent = navigator && navigator.userAgent || '';

	var _userAgent$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': _userAgent,
		__moduleExports: _userAgent
	});

	var $export$1 = ( _export$1 && _export ) || _export$1;

	var userAgent = ( _userAgent$1 && _userAgent ) || _userAgent$1;

	// ie9- setTimeout & setInterval additional parameters fix



	var slice = [].slice;
	var MSIE = /MSIE .\./.test(userAgent); // <- dirty ie9- check
	var wrap = function (set) {
	  return function (fn, time /* , ...args */) {
	    var boundArgs = arguments.length > 2;
	    var args = boundArgs ? slice.call(arguments, 2) : false;
	    return set(boundArgs ? function () {
	      // eslint-disable-next-line no-new-func
	      (typeof fn == 'function' ? fn : Function(fn)).apply(this, args);
	    } : fn, time);
	  };
	};
	$export$1($export$1.G + $export$1.B + $export$1.F * MSIE, {
	  setTimeout: wrap(global.setTimeout),
	  setInterval: wrap(global.setInterval)
	});

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

	/*
	 * @Descripttion:
	 * @version:
	 * @Author: yintianli
	 * @Date: 2020-06-01 10:36:27
	 * @LastEditors: yintianli
	 * @LastEditTime: 2020-09-29 17:39:13
	 */
	var ConstantConfig = {
	  WEBSOCKET_URL: 'ws://127.0.0.1'
	};

	var ARWebControl =
	/*#__PURE__*/
	function () {
	  /**
	   * @description:
	   * @param domId{String} 控件绑定dom元素Id
	   * @param loginType{Number} 0-密码登录 1-sg登录 2-tgc登录
	   * @param ip{String} 平台ip
	   * @param port{String} 平台端口
	   * @param userName{String} 用户名
	   * @param credentials{String} 登录凭据（密码/SG/TGT）
	   * @param arIndexCode{String} 默认显示场景IndexCode
	   * @return:
	   */
	  function ARWebControl(domId, loginType, ip, port, userName, credentials) {
	    var arIndexCode = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : '';
	    var webSocketPort = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : '8888';

	    _classCallCheck(this, ARWebControl);

	    this.dom = document.getElementById(domId);

	    if (this.dom) {
	      this.dom.innerHTML = '';
	      this.arStartedFlag = false;
	      this.arControlVisibility = false;
	      this.arDivVisibility = true;

	      var _this$_getDomPosition = this._getDomPosition(),
	          left = _this$_getDomPosition.left,
	          top = _this$_getDomPosition.top,
	          width = _this$_getDomPosition.width,
	          height = _this$_getDomPosition.height;

	      this.controlSetupDom = document.createElement('a');
	      var title = window.top.document.title;

	      if (loginType == 0 || loginType == 1) {
	        this.controlSetupDom.href = "PCCLoud://UP ".concat(ip, ":").concat(port, " ").concat(userName, " ").concat(credentials, " *2 ").concat(arIndexCode, " ").concat(left, " ").concat(top, " ").concat(width, " ").concat(height, " ").concat(title);
	      } else if (loginType == 2) {
	        this.controlSetupDom.href = "PCCLoud://UP ".concat(ip, ":").concat(port, " ").concat(userName, " ").concat(credentials, " *2 ").concat(arIndexCode, " ").concat(left, " ").concat(top, " ").concat(width, " ").concat(height, " sg 0 ").concat(title);
	      } else if (loginType == 3) {
	        this.controlSetupDom.href = "PCCLoud://UP ".concat(ip, ":").concat(port, " ").concat(userName, " ").concat(credentials, " *2 ").concat(arIndexCode, " ").concat(left, " ").concat(top, " ").concat(width, " ").concat(height, " tgc 0 ").concat(title);
	      }

	      this.webSocketPort = webSocketPort;
	      this.lastPosition = {
	        x: left,
	        y: top,
	        w: width,
	        h: height
	      };
	      this.dom.appendChild(this.controlSetupDom);
	      this.limitConnect = 10;
	      this.timeConnect = 0;
	      this.resolution = {
	        w: window.screen.width,
	        h: window.screen.height
	      };
	      this.openedVideoIndexCodes = new Map();
	    }

	    this._initEvent();
	  }

	  _createClass(ARWebControl, [{
	    key: "_initEvent",
	    value: function _initEvent() {
	      var _this = this;

	      var that = this;
	      var canRun = true;

	      window.onresize = function () {
	        if (!canRun) {
	          return;
	        }

	        canRun = false;
	        setTimeout(function () {
	          var _this$_getDomPosition2 = _this._getDomPosition(),
	              left = _this$_getDomPosition2.left,
	              top = _this$_getDomPosition2.top,
	              width = _this$_getDomPosition2.width,
	              height = _this$_getDomPosition2.height;

	          _this.setPosition(left, top, width, height);

	          canRun = true;
	        }, 1000);
	      };

	      window.onbeforeunload = function (evt) {
	        if (_this.arStartedFlag) {
	          _this.arStartedFlag = false;

	          if (_this.timer) {
	            clearInterval(_this.timer);
	            _this.timer = null;
	          }

	          if (_this.ws) {
	            _this.setWindowStatus(ARWebControl.WindowStatus.CLOSE);

	            _this.ws.onclose = function () {};

	            _this.ws.close();
	          }
	        } // window.onresize=null;
	        // window.onload=null;
	        // document.onvisibilitychange=null;
	        // document.onkeydown=null;
	        // window.onmessage=null;
	        // window.showTabCallback=null;
	        // window.hideTabCallback=null;
	        // window.onbeforeunload=null;

	      }; //页面标签切换


	      document.onvisibilitychange = function () {
	        if (_this.arStartedFlag) {
	          if (document.visibilityState == 'hidden') {
	            that.setWindowStatus(ARWebControl.WindowStatus.HIDDEN);
	            that.openedVideoIndexCodes.forEach(function (value, key) {
	              that.setVideoWindow(2, key);
	            });
	            that.openedVideoIndexCodes.clear();
	          } else {
	            that._setWebPageHandle();

	            that.setWindowStatus(ARWebControl.WindowStatus.VISIBLE);
	          }
	        }
	      };

	      document.onkeydown = function (e) {
	        if (e && e.keyCode == 122) {
	          //F11
	          e.preventDefault();

	          if (document.fullscreen) {
	            document.documentElement.exitFullscreen();
	          } else {
	            document.documentElement.requestFullscreen();
	          }
	        }
	      }; //页面移动


	      this.timer = setInterval(function () {
	        var _this$_getDomPosition3 = _this._getDomPosition(),
	            left = _this$_getDomPosition3.left,
	            top = _this$_getDomPosition3.top,
	            width = _this$_getDomPosition3.width,
	            height = _this$_getDomPosition3.height;

	        if (_this.lastPosition.x != left || _this.lastPosition.y != top || _this.lastPosition.w != width || _this.lastPosition.h != height) {
	          _this.setPosition(left, top, width, height);

	          _this.lastPosition.x = left;
	          _this.lastPosition.y = top;
	          _this.lastPosition.w = width;
	          _this.lastPosition.h = height;
	        }
	      }, 10);

	      window.onmessage = function (e) {
	        that.dealMessage(e);
	      };

	      window.showTabCallback = function () {
	        _this.setWindowStatus(ARWebControl.WindowStatus.VISIBLE);
	      };

	      window.hideTabCallback = function () {
	        _this.setWindowStatus(ARWebControl.WindowStatus.HIDDEN);
	      };
	    }
	  }, {
	    key: "dealMessage",
	    value: function dealMessage(e) {
	      var data = e.data || '{}';

	      if (typeof data == 'string') {
	        data = JSON.parse(data);
	      }

	      if (data.hasOwnProperty('method')) {
	        try {
	          // 获取回调函数方法名
	          var callFunction = window[data.method];

	          if (typeof callFunction == 'function') {
	            var param = null;

	            if (data.hasOwnProperty('argument')) {
	              param = data.argument;
	            }

	            if (param) {
	              callFunction(param);
	            } else {
	              callFunction();
	            }
	          }
	        } catch (e) {}
	      }
	    }
	  }, {
	    key: "setupControl",
	    value: function setupControl() {
	      if (this.arStartedFlag) {
	        console.warn('已启动AR实例，请勿重复启动实例');
	      } else {
	        this.controlSetupDom.click();

	        this._initWebSocket();
	      }
	    }
	  }, {
	    key: "_setWebPageHandle",
	    value: function _setWebPageHandle() {
	      var param = {
	        topic: 'setARParentWebPage',
	        content: window.top.document.title
	      };
	      this.ws.send(JSON.stringify(param));
	    }
	  }, {
	    key: "_getDomPosition",
	    value: function _getDomPosition() {
	      if (this.dom) {
	        var _this$dom$getBounding = this.dom.getBoundingClientRect(),
	            x = _this$dom$getBounding.x,
	            y = _this$dom$getBounding.y,
	            width = _this$dom$getBounding.width,
	            height = _this$dom$getBounding.height;

	        if (width == 0 || height == 0) {
	          this.setWindowStatus(ARWebControl.WindowStatus.HIDDEN);
	          this.arDivVisibility = false;
	        } else {
	          if (!this.arDivVisibility) {
	            this.arDivVisibility = true;
	            this.setWindowStatus(ARWebControl.WindowStatus.VISIBLE);
	          } else if (this.arControlVisibility && document.visibilityState == 'visible') {
	            this.setWindowStatus(ARWebControl.WindowStatus.VISIBLE);
	          }
	        }

	        return {
	          left: window.top.screenX + (window.outerWidth - window.innerWidth) / 2 + x,
	          top: window.top.screenY + window.outerHeight - window.innerHeight + y - (window.outerWidth - window.innerWidth) / 2,
	          width: this.dom.clientWidth,
	          height: this.dom.clientHeight
	        };
	      } else {
	        return {
	          left: 0,
	          top: 0,
	          width: 0,
	          height: 0
	        };
	      }
	    }
	  }, {
	    key: "_initWebSocket",
	    value: function _initWebSocket() {
	      var _this2 = this;

	      this.ws = new WebSocket(ConstantConfig.WEBSOCKET_URL + ':' + this.webSocketPort);

	      this.ws.onopen = function () {
	        console.log('已连接AR Websocket');
	      };

	      this.ws.onmessage = function (msg) {
	        var messageString = msg.data;

	        if (messageString.indexOf('ARStarted') != -1) {
	          _this2.arStartedFlag = true;
	          _this2.arControlVisibility = true;
	        }

	        var msgObejct = JSON.parse(messageString);

	        if (msgObejct && msgObejct.topic) {
	          if (msgObejct.topic == 'ARToWebKeys') {
	            if (msgObejct.content == 'F11') {
	              if (document.exitFullscreen) {
	                document.exitFullscreen();
	              }
	            }

	            window.dispatchEvent(new CustomEvent('ar_keydown', {
	              detail: {
	                data: msgObejct.content
	              }
	            }));
	          } else if (msgObejct.topic == 'ARWebLoaded' && msgObejct.content == '1') {
	            window.dispatchEvent(new CustomEvent('ar_loaded', {
	              detail: {
	                loadingStatus: true
	              }
	            }));
	          } else if (msgObejct.topic == 'ARToWebCustomMessage') {
	            window.dispatchEvent(new CustomEvent('ar_custom_message', {
	              detail: {
	                data: msgObejct.content
	              }
	            }));
	          } else if (msgObejct.topic == 'ARControlSceneChanged') {
	            var contentArray = msgObejct.content.split(',');
	            window.dispatchEvent(new CustomEvent('ar_scene_change', {
	              detail: {
	                data: {
	                  sceneIndex: contentArray[0],
	                  sceneCode: contentArray[1],
	                  sceneName: contentArray[2]
	                }
	              }
	            }));
	          }
	        }
	      };

	      this.ws.onclose = function () {
	        _this2.arStartedFlag = false;
	        console.log('AR Websocket已经断开');

	        _this2._reconnect();
	      };
	    }
	  }, {
	    key: "_reconnect",
	    value: function _reconnect() {
	      var _this3 = this;

	      if (this.limitConnect > 0) {
	        this.limitConnect--;
	        this.timeConnect++;
	        console.log('第' + this.timeConnect + '次重连'); // 进行重连

	        setTimeout(function () {
	          _this3._initWebSocket();
	        }, 1000);
	      } else {
	        console.log('AR Websocket连接已超时');
	      }
	    }
	  }, {
	    key: "setPosition",
	    value: function setPosition(left, top, width, height) {
	      var contentJsonObject = {
	        left: left,
	        top: top,
	        ctrl_width: width,
	        ctrl_height: height
	      };
	      var position = {
	        topic: 'position',
	        content: JSON.stringify(contentJsonObject)
	      };
	      this.ws.send(JSON.stringify(position));
	    }
	  }, {
	    key: "setWindowStatus",
	    value: function setWindowStatus(status) {
	      if (this.ws && this.ws.readyState == 1) {
	        if (this.arControlVisibility && status == ARWebControl.WindowStatus.VISIBLE || !this.arControlVisibility && status == ARWebControl.WindowStatus.HIDDEN) {
	          return;
	        }

	        if (status == ARWebControl.WindowStatus.VISIBLE) {
	          this.arControlVisibility = true;
	        }

	        if (status == ARWebControl.WindowStatus.HIDDEN) {
	          this.arControlVisibility = false;
	        }

	        var windowStatus = {
	          topic: 'windowStatus',
	          content: status
	        };
	        this.ws.send(JSON.stringify(windowStatus));
	      }
	    }
	  }, {
	    key: "setVideoWindow",
	    value: function setVideoWindow(status, indexCode) {
	      var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
	      var left = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
	      var top = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

	      if (status == 0) {
	        this.openedVideoIndexCodes.set(indexCode, {
	          left: left,
	          top: top
	        });
	      }

	      var contentJsonObject = {
	        left: (window.outerWidth - window.innerWidth) / 2 + left,
	        top: window.outerHeight - window.innerHeight - (window.outerWidth - window.innerWidth) / 2 + top,
	        index: indexCode,
	        name: name,
	        status: status
	      };
	      var videoWindowParam = {
	        topic: 'smallVideoPlay',
	        content: JSON.stringify(contentJsonObject)
	      };
	      this.ws.send(JSON.stringify(videoWindowParam));
	    }
	  }, {
	    key: "setVideoWindowList",
	    value: function setVideoWindowList(windowList) {
	      var contentJsonObject = [];
	      windowList.forEach(function (item) {
	        contentJsonObject.push({
	          left: (window.outerWidth - window.innerWidth) / 2 + item.left,
	          top: window.outerHeight - window.innerHeight - (window.outerWidth - window.innerWidth) / 2 + item.top,
	          index: item.indexCode
	        });
	      });
	      var videoWindowListParam = {
	        topic: 'smallVideoMoveList',
	        content: JSON.stringify(contentJsonObject)
	      };
	      this.ws.send(JSON.stringify(videoWindowListParam));
	    }
	  }, {
	    key: "changeArScene",
	    value: function changeArScene(arIndexCode) {
	      var changeARParam = {
	        topic: 'changeScene',
	        content: arIndexCode
	      };
	      this.ws.send(JSON.stringify(changeARParam));
	    }
	  }, {
	    key: "setControlsVisibility",
	    value: function setControlsVisibility(hiddenControls) {
	      var ct = [];

	      for (var ctrl in ARWebControl.ARControls) {
	        if (hiddenControls.indexOf(ARWebControl.ARControls[ctrl]) != -1) {
	          ct.push({
	            Key: ARWebControl.ARControls[ctrl],
	            Status: ARWebControl.ControlStatus.HIDDEN
	          });
	        } else {
	          ct.push({
	            Key: ARWebControl.ARControls[ctrl],
	            Status: ARWebControl.ControlStatus.VISIBLE
	          });
	        }
	      }

	      var param = {
	        topic: 'setARMainControlsVisible',
	        content: JSON.stringify(ct)
	      };
	      this.ws.send(JSON.stringify(param));
	    }
	  }, {
	    key: "sendBussinessInfo",
	    value: function sendBussinessInfo(message) {
	      var param = {
	        topic: 'sendCustomInfo',
	        content: message
	      };
	      this.ws.send(JSON.stringify(param));
	    }
	  }]);

	  return ARWebControl;
	}();
	ARWebControl.ARControls = {
	  SCENE_TREE: '1',
	  MAP: '2',
	  BUTTONS_BOTTOM: '3',
	  BUTTONS_EXIT_MIN: '4',
	  SEARCH_BAR: '5',
	  BUTTON_ALARM: '6',
	  TOOLBOX_RIGHT: '7'
	};
	ARWebControl.WindowStatus = {
	  VISIBLE: '0',
	  HIDDEN: '1',
	  CLOSE: '2'
	};
	ARWebControl.ControlStatus = {
	  VISIBLE: 0,
	  HIDDEN: 1
	};

	return ARWebControl;

})));
//# sourceMappingURL=arWebControl.js.map
