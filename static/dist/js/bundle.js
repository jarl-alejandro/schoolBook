(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Tests for browser support.
 */

var innerHTMLBug = false;
var bugTestDiv;
if (typeof document !== 'undefined') {
  bugTestDiv = document.createElement('div');
  // Setup
  bugTestDiv.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
  // Make sure that link elements get serialized correctly by innerHTML
  // This requires a wrapper element in IE
  innerHTMLBug = !bugTestDiv.getElementsByTagName('link').length;
  bugTestDiv = undefined;
}

/**
 * Wrap map from jquery.
 */

var map = {
  legend: [1, '<fieldset>', '</fieldset>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  // for script/link/style tags to work in IE6-8, you have to wrap
  // in a div with a non-whitespace character in front, ha!
  _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
};

map.td =
map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

map.option =
map.optgroup = [1, '<select multiple="multiple">', '</select>'];

map.thead =
map.tbody =
map.colgroup =
map.caption =
map.tfoot = [1, '<table>', '</table>'];

map.polyline =
map.ellipse =
map.polygon =
map.circle =
map.text =
map.line =
map.path =
map.rect =
map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

/**
 * Parse `html` and return a DOM Node instance, which could be a TextNode,
 * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
 * instance, depending on the contents of the `html` string.
 *
 * @param {String} html - HTML string to "domify"
 * @param {Document} doc - The `document` instance to create the Node for
 * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
 * @api private
 */

function parse(html, doc) {
  if ('string' != typeof html) throw new TypeError('String expected');

  // default to the global `document` object
  if (!doc) doc = document;

  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) return doc.createTextNode(html);

  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = doc.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = doc.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  // one element
  if (el.firstChild == el.lastChild) {
    return el.removeChild(el.firstChild);
  }

  // several elements
  var fragment = doc.createDocumentFragment();
  while (el.firstChild) {
    fragment.appendChild(el.removeChild(el.firstChild));
  }

  return fragment;
}

},{}],2:[function(require,module,exports){
'use strict';

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _handlebarsBase = require('./handlebars/base');

var base = _interopRequireWildcard(_handlebarsBase);

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)

var _handlebarsSafeString = require('./handlebars/safe-string');

var _handlebarsSafeString2 = _interopRequireDefault(_handlebarsSafeString);

var _handlebarsException = require('./handlebars/exception');

var _handlebarsException2 = _interopRequireDefault(_handlebarsException);

var _handlebarsUtils = require('./handlebars/utils');

var Utils = _interopRequireWildcard(_handlebarsUtils);

var _handlebarsRuntime = require('./handlebars/runtime');

var runtime = _interopRequireWildcard(_handlebarsRuntime);

var _handlebarsNoConflict = require('./handlebars/no-conflict');

var _handlebarsNoConflict2 = _interopRequireDefault(_handlebarsNoConflict);

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
function create() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = _handlebarsSafeString2['default'];
  hb.Exception = _handlebarsException2['default'];
  hb.Utils = Utils;
  hb.escapeExpression = Utils.escapeExpression;

  hb.VM = runtime;
  hb.template = function (spec) {
    return runtime.template(spec, hb);
  };

  return hb;
}

var inst = create();
inst.create = create;

_handlebarsNoConflict2['default'](inst);

inst['default'] = inst;

exports['default'] = inst;
module.exports = exports['default'];


},{"./handlebars/base":3,"./handlebars/exception":6,"./handlebars/no-conflict":16,"./handlebars/runtime":17,"./handlebars/safe-string":18,"./handlebars/utils":19}],3:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.HandlebarsEnvironment = HandlebarsEnvironment;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utils = require('./utils');

var _exception = require('./exception');

var _exception2 = _interopRequireDefault(_exception);

var _helpers = require('./helpers');

var _decorators = require('./decorators');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var VERSION = '4.0.5';
exports.VERSION = VERSION;
var COMPILER_REVISION = 7;

exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '== 1.x.x',
  5: '== 2.0.0-alpha.x',
  6: '>= 2.0.0-beta.1',
  7: '>= 4.0.0'
};

exports.REVISION_CHANGES = REVISION_CHANGES;
var objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials, decorators) {
  this.helpers = helpers || {};
  this.partials = partials || {};
  this.decorators = decorators || {};

  _helpers.registerDefaultHelpers(this);
  _decorators.registerDefaultDecorators(this);
}

HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: _logger2['default'],
  log: _logger2['default'].log,

  registerHelper: function registerHelper(name, fn) {
    if (_utils.toString.call(name) === objectType) {
      if (fn) {
        throw new _exception2['default']('Arg not supported with multiple helpers');
      }
      _utils.extend(this.helpers, name);
    } else {
      this.helpers[name] = fn;
    }
  },
  unregisterHelper: function unregisterHelper(name) {
    delete this.helpers[name];
  },

  registerPartial: function registerPartial(name, partial) {
    if (_utils.toString.call(name) === objectType) {
      _utils.extend(this.partials, name);
    } else {
      if (typeof partial === 'undefined') {
        throw new _exception2['default']('Attempting to register a partial called "' + name + '" as undefined');
      }
      this.partials[name] = partial;
    }
  },
  unregisterPartial: function unregisterPartial(name) {
    delete this.partials[name];
  },

  registerDecorator: function registerDecorator(name, fn) {
    if (_utils.toString.call(name) === objectType) {
      if (fn) {
        throw new _exception2['default']('Arg not supported with multiple decorators');
      }
      _utils.extend(this.decorators, name);
    } else {
      this.decorators[name] = fn;
    }
  },
  unregisterDecorator: function unregisterDecorator(name) {
    delete this.decorators[name];
  }
};

var log = _logger2['default'].log;

exports.log = log;
exports.createFrame = _utils.createFrame;
exports.logger = _logger2['default'];


},{"./decorators":4,"./exception":6,"./helpers":7,"./logger":15,"./utils":19}],4:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.registerDefaultDecorators = registerDefaultDecorators;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _decoratorsInline = require('./decorators/inline');

var _decoratorsInline2 = _interopRequireDefault(_decoratorsInline);

function registerDefaultDecorators(instance) {
  _decoratorsInline2['default'](instance);
}


},{"./decorators/inline":5}],5:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

exports['default'] = function (instance) {
  instance.registerDecorator('inline', function (fn, props, container, options) {
    var ret = fn;
    if (!props.partials) {
      props.partials = {};
      ret = function (context, options) {
        // Create a new partials stack frame prior to exec.
        var original = container.partials;
        container.partials = _utils.extend({}, original, props.partials);
        var ret = fn(context, options);
        container.partials = original;
        return ret;
      };
    }

    props.partials[options.args[0]] = options.fn;

    return ret;
  });
};

module.exports = exports['default'];


},{"../utils":19}],6:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var loc = node && node.loc,
      line = undefined,
      column = undefined;
  if (loc) {
    line = loc.start.line;
    column = loc.start.column;

    message += ' - ' + line + ':' + column;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  /* istanbul ignore else */
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, Exception);
  }

  try {
    if (loc) {
      this.lineNumber = line;

      // Work around issue under safari where we can't directly set the column value
      /* istanbul ignore next */
      if (Object.defineProperty) {
        Object.defineProperty(this, 'column', { value: column });
      } else {
        this.column = column;
      }
    }
  } catch (nop) {
    /* Ignore if the browser is very particular */
  }
}

Exception.prototype = new Error();

exports['default'] = Exception;
module.exports = exports['default'];


},{}],7:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.registerDefaultHelpers = registerDefaultHelpers;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _helpersBlockHelperMissing = require('./helpers/block-helper-missing');

var _helpersBlockHelperMissing2 = _interopRequireDefault(_helpersBlockHelperMissing);

var _helpersEach = require('./helpers/each');

var _helpersEach2 = _interopRequireDefault(_helpersEach);

var _helpersHelperMissing = require('./helpers/helper-missing');

var _helpersHelperMissing2 = _interopRequireDefault(_helpersHelperMissing);

var _helpersIf = require('./helpers/if');

var _helpersIf2 = _interopRequireDefault(_helpersIf);

var _helpersLog = require('./helpers/log');

var _helpersLog2 = _interopRequireDefault(_helpersLog);

var _helpersLookup = require('./helpers/lookup');

var _helpersLookup2 = _interopRequireDefault(_helpersLookup);

var _helpersWith = require('./helpers/with');

var _helpersWith2 = _interopRequireDefault(_helpersWith);

function registerDefaultHelpers(instance) {
  _helpersBlockHelperMissing2['default'](instance);
  _helpersEach2['default'](instance);
  _helpersHelperMissing2['default'](instance);
  _helpersIf2['default'](instance);
  _helpersLog2['default'](instance);
  _helpersLookup2['default'](instance);
  _helpersWith2['default'](instance);
}


},{"./helpers/block-helper-missing":8,"./helpers/each":9,"./helpers/helper-missing":10,"./helpers/if":11,"./helpers/log":12,"./helpers/lookup":13,"./helpers/with":14}],8:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

exports['default'] = function (instance) {
  instance.registerHelper('blockHelperMissing', function (context, options) {
    var inverse = options.inverse,
        fn = options.fn;

    if (context === true) {
      return fn(this);
    } else if (context === false || context == null) {
      return inverse(this);
    } else if (_utils.isArray(context)) {
      if (context.length > 0) {
        if (options.ids) {
          options.ids = [options.name];
        }

        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      if (options.data && options.ids) {
        var data = _utils.createFrame(options.data);
        data.contextPath = _utils.appendContextPath(options.data.contextPath, options.name);
        options = { data: data };
      }

      return fn(context, options);
    }
  });
};

module.exports = exports['default'];


},{"../utils":19}],9:[function(require,module,exports){
'use strict';

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utils = require('../utils');

var _exception = require('../exception');

var _exception2 = _interopRequireDefault(_exception);

exports['default'] = function (instance) {
  instance.registerHelper('each', function (context, options) {
    if (!options) {
      throw new _exception2['default']('Must pass iterator to #each');
    }

    var fn = options.fn,
        inverse = options.inverse,
        i = 0,
        ret = '',
        data = undefined,
        contextPath = undefined;

    if (options.data && options.ids) {
      contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
    }

    if (_utils.isFunction(context)) {
      context = context.call(this);
    }

    if (options.data) {
      data = _utils.createFrame(options.data);
    }

    function execIteration(field, index, last) {
      if (data) {
        data.key = field;
        data.index = index;
        data.first = index === 0;
        data.last = !!last;

        if (contextPath) {
          data.contextPath = contextPath + field;
        }
      }

      ret = ret + fn(context[field], {
        data: data,
        blockParams: _utils.blockParams([context[field], field], [contextPath + field, null])
      });
    }

    if (context && typeof context === 'object') {
      if (_utils.isArray(context)) {
        for (var j = context.length; i < j; i++) {
          if (i in context) {
            execIteration(i, i, i === context.length - 1);
          }
        }
      } else {
        var priorKey = undefined;

        for (var key in context) {
          if (context.hasOwnProperty(key)) {
            // We're running the iterations one step out of sync so we can detect
            // the last iteration without have to scan the object twice and create
            // an itermediate keys array.
            if (priorKey !== undefined) {
              execIteration(priorKey, i - 1);
            }
            priorKey = key;
            i++;
          }
        }
        if (priorKey !== undefined) {
          execIteration(priorKey, i - 1, true);
        }
      }
    }

    if (i === 0) {
      ret = inverse(this);
    }

    return ret;
  });
};

module.exports = exports['default'];


},{"../exception":6,"../utils":19}],10:[function(require,module,exports){
'use strict';

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _exception = require('../exception');

var _exception2 = _interopRequireDefault(_exception);

exports['default'] = function (instance) {
  instance.registerHelper('helperMissing', function () /* [args, ]options */{
    if (arguments.length === 1) {
      // A missing field in a {{foo}} construct.
      return undefined;
    } else {
      // Someone is actually trying to call something, blow up.
      throw new _exception2['default']('Missing helper: "' + arguments[arguments.length - 1].name + '"');
    }
  });
};

module.exports = exports['default'];


},{"../exception":6}],11:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

exports['default'] = function (instance) {
  instance.registerHelper('if', function (conditional, options) {
    if (_utils.isFunction(conditional)) {
      conditional = conditional.call(this);
    }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if (!options.hash.includeZero && !conditional || _utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function (conditional, options) {
    return instance.helpers['if'].call(this, conditional, { fn: options.inverse, inverse: options.fn, hash: options.hash });
  });
};

module.exports = exports['default'];


},{"../utils":19}],12:[function(require,module,exports){
'use strict';

exports.__esModule = true;

exports['default'] = function (instance) {
  instance.registerHelper('log', function () /* message, options */{
    var args = [undefined],
        options = arguments[arguments.length - 1];
    for (var i = 0; i < arguments.length - 1; i++) {
      args.push(arguments[i]);
    }

    var level = 1;
    if (options.hash.level != null) {
      level = options.hash.level;
    } else if (options.data && options.data.level != null) {
      level = options.data.level;
    }
    args[0] = level;

    instance.log.apply(instance, args);
  });
};

module.exports = exports['default'];


},{}],13:[function(require,module,exports){
'use strict';

exports.__esModule = true;

exports['default'] = function (instance) {
  instance.registerHelper('lookup', function (obj, field) {
    return obj && obj[field];
  });
};

module.exports = exports['default'];


},{}],14:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

exports['default'] = function (instance) {
  instance.registerHelper('with', function (context, options) {
    if (_utils.isFunction(context)) {
      context = context.call(this);
    }

    var fn = options.fn;

    if (!_utils.isEmpty(context)) {
      var data = options.data;
      if (options.data && options.ids) {
        data = _utils.createFrame(options.data);
        data.contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]);
      }

      return fn(context, {
        data: data,
        blockParams: _utils.blockParams([context], [data && data.contextPath])
      });
    } else {
      return options.inverse(this);
    }
  });
};

module.exports = exports['default'];


},{"../utils":19}],15:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('./utils');

var logger = {
  methodMap: ['debug', 'info', 'warn', 'error'],
  level: 'info',

  // Maps a given level value to the `methodMap` indexes above.
  lookupLevel: function lookupLevel(level) {
    if (typeof level === 'string') {
      var levelMap = _utils.indexOf(logger.methodMap, level.toLowerCase());
      if (levelMap >= 0) {
        level = levelMap;
      } else {
        level = parseInt(level, 10);
      }
    }

    return level;
  },

  // Can be overridden in the host environment
  log: function log(level) {
    level = logger.lookupLevel(level);

    if (typeof console !== 'undefined' && logger.lookupLevel(logger.level) <= level) {
      var method = logger.methodMap[level];
      if (!console[method]) {
        // eslint-disable-line no-console
        method = 'log';
      }

      for (var _len = arguments.length, message = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        message[_key - 1] = arguments[_key];
      }

      console[method].apply(console, message); // eslint-disable-line no-console
    }
  }
};

exports['default'] = logger;
module.exports = exports['default'];


},{"./utils":19}],16:[function(require,module,exports){
(function (global){
/* global window */
'use strict';

exports.__esModule = true;

exports['default'] = function (Handlebars) {
  /* istanbul ignore next */
  var root = typeof global !== 'undefined' ? global : window,
      $Handlebars = root.Handlebars;
  /* istanbul ignore next */
  Handlebars.noConflict = function () {
    if (root.Handlebars === Handlebars) {
      root.Handlebars = $Handlebars;
    }
    return Handlebars;
  };
};

module.exports = exports['default'];


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],17:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.checkRevision = checkRevision;
exports.template = template;
exports.wrapProgram = wrapProgram;
exports.resolvePartial = resolvePartial;
exports.invokePartial = invokePartial;
exports.noop = noop;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _utils = require('./utils');

var Utils = _interopRequireWildcard(_utils);

var _exception = require('./exception');

var _exception2 = _interopRequireDefault(_exception);

var _base = require('./base');

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = _base.COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = _base.REVISION_CHANGES[currentRevision],
          compilerVersions = _base.REVISION_CHANGES[compilerRevision];
      throw new _exception2['default']('Template was precompiled with an older version of Handlebars than the current runtime. ' + 'Please update your precompiler to a newer version (' + runtimeVersions + ') or downgrade your runtime to an older version (' + compilerVersions + ').');
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new _exception2['default']('Template was precompiled with a newer version of Handlebars than the current runtime. ' + 'Please update your runtime to a newer version (' + compilerInfo[1] + ').');
    }
  }
}

function template(templateSpec, env) {
  /* istanbul ignore next */
  if (!env) {
    throw new _exception2['default']('No environment passed to template');
  }
  if (!templateSpec || !templateSpec.main) {
    throw new _exception2['default']('Unknown template object: ' + typeof templateSpec);
  }

  templateSpec.main.decorator = templateSpec.main_d;

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as psuedo-supported APIs.
  env.VM.checkRevision(templateSpec.compiler);

  function invokePartialWrapper(partial, context, options) {
    if (options.hash) {
      context = Utils.extend({}, context, options.hash);
      if (options.ids) {
        options.ids[0] = true;
      }
    }

    partial = env.VM.resolvePartial.call(this, partial, context, options);
    var result = env.VM.invokePartial.call(this, partial, context, options);

    if (result == null && env.compile) {
      options.partials[options.name] = env.compile(partial, templateSpec.compilerOptions, env);
      result = options.partials[options.name](context, options);
    }
    if (result != null) {
      if (options.indent) {
        var lines = result.split('\n');
        for (var i = 0, l = lines.length; i < l; i++) {
          if (!lines[i] && i + 1 === l) {
            break;
          }

          lines[i] = options.indent + lines[i];
        }
        result = lines.join('\n');
      }
      return result;
    } else {
      throw new _exception2['default']('The partial ' + options.name + ' could not be compiled when running in runtime-only mode');
    }
  }

  // Just add water
  var container = {
    strict: function strict(obj, name) {
      if (!(name in obj)) {
        throw new _exception2['default']('"' + name + '" not defined in ' + obj);
      }
      return obj[name];
    },
    lookup: function lookup(depths, name) {
      var len = depths.length;
      for (var i = 0; i < len; i++) {
        if (depths[i] && depths[i][name] != null) {
          return depths[i][name];
        }
      }
    },
    lambda: function lambda(current, context) {
      return typeof current === 'function' ? current.call(context) : current;
    },

    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,

    fn: function fn(i) {
      var ret = templateSpec[i];
      ret.decorator = templateSpec[i + '_d'];
      return ret;
    },

    programs: [],
    program: function program(i, data, declaredBlockParams, blockParams, depths) {
      var programWrapper = this.programs[i],
          fn = this.fn(i);
      if (data || depths || blockParams || declaredBlockParams) {
        programWrapper = wrapProgram(this, i, fn, data, declaredBlockParams, blockParams, depths);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = wrapProgram(this, i, fn);
      }
      return programWrapper;
    },

    data: function data(value, depth) {
      while (value && depth--) {
        value = value._parent;
      }
      return value;
    },
    merge: function merge(param, common) {
      var obj = param || common;

      if (param && common && param !== common) {
        obj = Utils.extend({}, common, param);
      }

      return obj;
    },

    noop: env.VM.noop,
    compilerInfo: templateSpec.compiler
  };

  function ret(context) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var data = options.data;

    ret._setup(options);
    if (!options.partial && templateSpec.useData) {
      data = initData(context, data);
    }
    var depths = undefined,
        blockParams = templateSpec.useBlockParams ? [] : undefined;
    if (templateSpec.useDepths) {
      if (options.depths) {
        depths = context != options.depths[0] ? [context].concat(options.depths) : options.depths;
      } else {
        depths = [context];
      }
    }

    function main(context /*, options*/) {
      return '' + templateSpec.main(container, context, container.helpers, container.partials, data, blockParams, depths);
    }
    main = executeDecorators(templateSpec.main, main, container, options.depths || [], data, blockParams);
    return main(context, options);
  }
  ret.isTop = true;

  ret._setup = function (options) {
    if (!options.partial) {
      container.helpers = container.merge(options.helpers, env.helpers);

      if (templateSpec.usePartial) {
        container.partials = container.merge(options.partials, env.partials);
      }
      if (templateSpec.usePartial || templateSpec.useDecorators) {
        container.decorators = container.merge(options.decorators, env.decorators);
      }
    } else {
      container.helpers = options.helpers;
      container.partials = options.partials;
      container.decorators = options.decorators;
    }
  };

  ret._child = function (i, data, blockParams, depths) {
    if (templateSpec.useBlockParams && !blockParams) {
      throw new _exception2['default']('must pass block params');
    }
    if (templateSpec.useDepths && !depths) {
      throw new _exception2['default']('must pass parent depths');
    }

    return wrapProgram(container, i, templateSpec[i], data, 0, blockParams, depths);
  };
  return ret;
}

function wrapProgram(container, i, fn, data, declaredBlockParams, blockParams, depths) {
  function prog(context) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var currentDepths = depths;
    if (depths && context != depths[0]) {
      currentDepths = [context].concat(depths);
    }

    return fn(container, context, container.helpers, container.partials, options.data || data, blockParams && [options.blockParams].concat(blockParams), currentDepths);
  }

  prog = executeDecorators(fn, prog, container, depths, data, blockParams);

  prog.program = i;
  prog.depth = depths ? depths.length : 0;
  prog.blockParams = declaredBlockParams || 0;
  return prog;
}

function resolvePartial(partial, context, options) {
  if (!partial) {
    if (options.name === '@partial-block') {
      var data = options.data;
      while (data['partial-block'] === noop) {
        data = data._parent;
      }
      partial = data['partial-block'];
      data['partial-block'] = noop;
    } else {
      partial = options.partials[options.name];
    }
  } else if (!partial.call && !options.name) {
    // This is a dynamic partial that returned a string
    options.name = partial;
    partial = options.partials[partial];
  }
  return partial;
}

function invokePartial(partial, context, options) {
  options.partial = true;
  if (options.ids) {
    options.data.contextPath = options.ids[0] || options.data.contextPath;
  }

  var partialBlock = undefined;
  if (options.fn && options.fn !== noop) {
    options.data = _base.createFrame(options.data);
    partialBlock = options.data['partial-block'] = options.fn;

    if (partialBlock.partials) {
      options.partials = Utils.extend({}, options.partials, partialBlock.partials);
    }
  }

  if (partial === undefined && partialBlock) {
    partial = partialBlock;
  }

  if (partial === undefined) {
    throw new _exception2['default']('The partial ' + options.name + ' could not be found');
  } else if (partial instanceof Function) {
    return partial(context, options);
  }
}

function noop() {
  return '';
}

function initData(context, data) {
  if (!data || !('root' in data)) {
    data = data ? _base.createFrame(data) : {};
    data.root = context;
  }
  return data;
}

function executeDecorators(fn, prog, container, depths, data, blockParams) {
  if (fn.decorator) {
    var props = {};
    prog = fn.decorator(prog, props, container, depths && depths[0], data, blockParams, depths);
    Utils.extend(prog, props);
  }
  return prog;
}


},{"./base":3,"./exception":6,"./utils":19}],18:[function(require,module,exports){
// Build out our basic SafeString type
'use strict';

exports.__esModule = true;
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = SafeString.prototype.toHTML = function () {
  return '' + this.string;
};

exports['default'] = SafeString;
module.exports = exports['default'];


},{}],19:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.extend = extend;
exports.indexOf = indexOf;
exports.escapeExpression = escapeExpression;
exports.isEmpty = isEmpty;
exports.createFrame = createFrame;
exports.blockParams = blockParams;
exports.appendContextPath = appendContextPath;
var escape = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

var badChars = /[&<>"'`=]/g,
    possible = /[&<>"'`=]/;

function escapeChar(chr) {
  return escape[chr];
}

function extend(obj /* , ...source */) {
  for (var i = 1; i < arguments.length; i++) {
    for (var key in arguments[i]) {
      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
        obj[key] = arguments[i][key];
      }
    }
  }

  return obj;
}

var toString = Object.prototype.toString;

exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
/* eslint-disable func-style */
var isFunction = function isFunction(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
/* istanbul ignore next */
if (isFunction(/x/)) {
  exports.isFunction = isFunction = function (value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
exports.isFunction = isFunction;

/* eslint-enable func-style */

/* istanbul ignore next */
var isArray = Array.isArray || function (value) {
  return value && typeof value === 'object' ? toString.call(value) === '[object Array]' : false;
};

exports.isArray = isArray;
// Older IE versions do not directly support indexOf so we must implement our own, sadly.

function indexOf(array, value) {
  for (var i = 0, len = array.length; i < len; i++) {
    if (array[i] === value) {
      return i;
    }
  }
  return -1;
}

function escapeExpression(string) {
  if (typeof string !== 'string') {
    // don't escape SafeStrings, since they're already safe
    if (string && string.toHTML) {
      return string.toHTML();
    } else if (string == null) {
      return '';
    } else if (!string) {
      return string + '';
    }

    // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.
    string = '' + string;
  }

  if (!possible.test(string)) {
    return string;
  }
  return string.replace(badChars, escapeChar);
}

function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

function createFrame(object) {
  var frame = extend({}, object);
  frame._parent = object;
  return frame;
}

function blockParams(params, ids) {
  params.path = ids;
  return params;
}

function appendContextPath(contextPath, id) {
  return (contextPath ? contextPath + '.' : '') + id;
}


},{}],20:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime')['default'];

},{"./dist/cjs/handlebars.runtime":2}],21:[function(require,module,exports){
/*!
 * jQuery JavaScript Library v2.2.4
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-05-20T17:23Z
 */

(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Support: Firefox 18+
// Can't be in strict mode, several libs including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
//"use strict";
var arr = [];

var document = window.document;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};



var
	version = "2.2.4",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return all the elements in a clean array
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = jQuery.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {

		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		// adding 1 corrects loss of precision from parseFloat (#15100)
		var realStringObj = obj && obj.toString();
		return !jQuery.isArray( obj ) && ( realStringObj - parseFloat( realStringObj ) + 1 ) >= 0;
	},

	isPlainObject: function( obj ) {
		var key;

		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		// Not own constructor property must be Object
		if ( obj.constructor &&
				!hasOwn.call( obj, "constructor" ) &&
				!hasOwn.call( obj.constructor.prototype || {}, "isPrototypeOf" ) ) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}

		// Support: Android<4.0, iOS<6 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		var script,
			indirect = eval;

		code = jQuery.trim( code );

		if ( code ) {

			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
			if ( code.indexOf( "use strict" ) === 1 ) {
				script = document.createElement( "script" );
				script.text = code;
				document.head.appendChild( script ).parentNode.removeChild( script );
			} else {

				// Otherwise, avoid the DOM node creation, insertion
				// and removal by using an indirect global eval

				indirect( code );
			}
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE9-11+
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

// JSHint would error on this code due to the Symbol not being defined in ES5.
// Defining this global in .jshintrc would create a danger of using the global
// unguarded in another place, it seems safer to just disable JSHint for these
// three lines.
/* jshint ignore: start */
if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}
/* jshint ignore: end */

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: iOS 8.2 (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.2.1
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-10-17
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// http://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, nidselect, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					nidselect = ridentifier.test( nid ) ? "#" + nid : "[id='" + nid + "']";
					while ( i-- ) {
						groups[i] = nidselect + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, parent,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( (parent = document.defaultView) && parent.top !== parent ) {
		// Support: IE 11
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( document.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var m = context.getElementById( id );
				return m ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibing-combinator selector` fails
			if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( (oldCache = uniqueCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = ( /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/ );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		} );

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i,
			len = this.length,
			ret = [],
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					// Support: Blackberry 4.6
					// gEBID returns nodes no longer in the document (#6963)
					if ( elem && elem.parentNode ) {

						// Inject the element directly into the jQuery object
						this.length = 1;
						this[ 0 ] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

				// Always skip document fragments
				if ( cur.nodeType < 11 && ( pos ?
					pos.index( cur ) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector( cur, selectors ) ) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnotwhite = ( /\S+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks( "once memory" ), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks( "memory" ) ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];

							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this === promise ? newDefer.promise() : this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add( function() {

					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 ||
				( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred.
			// If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// Add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.progress( updateFunc( i, progressContexts, progressValues ) )
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject );
				} else {
					--remaining;
				}
			}
		}

		// If we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
} );


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {

	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
} );

/**
 * The ready event handler and self cleanup method
 */
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called
		// after the browser event has already occurred.
		// Support: IE9-10 only
		// Older IE sometimes signals "interactive" too soon
		if ( document.readyState === "complete" ||
			( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

			// Handle it asynchronously to allow scripts the opportunity to delay ready
			window.setTimeout( jQuery.ready );

		} else {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed );
		}
	}
	return readyList.promise( obj );
};

// Kick off the DOM ready check even if the user does not
jQuery.ready.promise();




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			len ? fn( elems[ 0 ], key ) : emptyGet;
};
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	/* jshint -W018 */
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	register: function( owner, initial ) {
		var value = initial || {};

		// If it is a node unlikely to be stringify-ed or looped over
		// use plain assignment
		if ( owner.nodeType ) {
			owner[ this.expando ] = value;

		// Otherwise secure it in a non-enumerable, non-writable property
		// configurability must be true to allow the property to be
		// deleted with the delete operator
		} else {
			Object.defineProperty( owner, this.expando, {
				value: value,
				writable: true,
				configurable: true
			} );
		}
		return owner[ this.expando ];
	},
	cache: function( owner ) {

		// We can accept data for non-element nodes in modern browsers,
		// but we should not, see #8335.
		// Always return an empty object.
		if ( !acceptData( owner ) ) {
			return {};
		}

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		if ( typeof data === "string" ) {
			cache[ data ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ prop ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :
			owner[ this.expando ] && owner[ this.expando ][ key ];
	},
	access: function( owner, key, value ) {
		var stored;

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			stored = this.get( owner, key );

			return stored !== undefined ?
				stored : this.get( owner, jQuery.camelCase( key ) );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i, name, camel,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key === undefined ) {
			this.register( owner );

		} else {

			// Support array or space separated string of keys
			if ( jQuery.isArray( key ) ) {

				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = key.concat( key.map( jQuery.camelCase ) );
			} else {
				camel = jQuery.camelCase( key );

				// Try the string as a key before any manipulation
				if ( key in cache ) {
					name = [ key, camel ];
				} else {

					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					name = camel;
					name = name in cache ?
						[ name ] : ( name.match( rnotwhite ) || [] );
				}
			}

			i = name.length;

			while ( i-- ) {
				delete cache[ name[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <= 35-45+
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://code.google.com/p/chromium/issues/detail?id=378607
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :

					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data, camelKey;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// with the key as-is
				data = dataUser.get( elem, key ) ||

					// Try to find dashed key if it exists (gh-2779)
					// This is for 2.2.x only
					dataUser.get( elem, key.replace( rmultiDash, "-$&" ).toLowerCase() );

				if ( data !== undefined ) {
					return data;
				}

				camelKey = jQuery.camelCase( key );

				// Attempt to get data from the cache
				// with the key camelized
				data = dataUser.get( elem, camelKey );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, camelKey, undefined );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			camelKey = jQuery.camelCase( key );
			this.each( function() {

				// First, attempt to store a copy or reference of any
				// data that might've been store with a camelCased key.
				var data = dataUser.get( this, camelKey );

				// For HTML5 data-* attribute interop, we have to
				// store property names with dashes in a camelCase form.
				// This might not apply to all properties...*
				dataUser.set( this, camelKey, value );

				// *... In the case of properties that might _actually_
				// have dashes, we need to also store a copy of that
				// unchanged property.
				if ( key.indexOf( "-" ) > -1 && data !== undefined ) {
					dataUser.set( this, key, value );
				}
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {

		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" ||
			!jQuery.contains( elem.ownerDocument, elem );
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() { return tween.cur(); } :
			function() { return jQuery.css( elem, prop, "" ); },
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([\w:-]+)/ );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE9
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

	// Support: IE9-11+
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== "undefined" ?
				context.querySelectorAll( tag || "*" ) :
			[];

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {

				// Support: Android<4.1, PhantomJS<2
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android<4.1, PhantomJS<2
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0-4.3, Safari<=5.1
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Safari<=5.1, Android<4.2
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<=11+
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();


var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE9
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Support (at least): Chrome, IE9
		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		//
		// Support: Firefox<=42+
		// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
		if ( delegateCount && cur.nodeType &&
			( event.type !== "click" || isNaN( event.button ) || event.button < 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && ( cur.disabled !== true || event.type !== "click" ) ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push( { elem: cur, handlers: matches } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: this, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: ( "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " +
		"metaKey relatedTarget shiftKey target timeStamp view which" ).split( " " ),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split( " " ),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: ( "button buttons clientX clientY offsetX offsetY pageX pageY " +
			"screenX screenY toElement" ).split( " " ),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX +
					( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
					( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY +
					( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
					( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: Cordova 2.5 (WebKit) (#13255)
		// All events should have a target; Cordova deviceready doesn't
		if ( !event.target ) {
			event.target = document;
		}

		// Support: Safari 6.0+, Chrome<28
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android<4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://code.google.com/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {
	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,

	// Support: IE 10-11, Edge 10240+
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName( "tbody" )[ 0 ] ||
			elem.appendChild( elem.ownerDocument.createElement( "tbody" ) ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android<4.1, PhantomJS<2
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <= 35-45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <= 35-45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {

	// Keep domManip exposed until 3.0 (gh-2225)
	domManip: domManip,

	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: QtWebKit
			// .get() because push.apply(_, arraylike) throws
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );


var iframe,
	elemdisplay = {

		// Support: Firefox
		// We have to pre-define these values for FF (#10227)
		HTML: "block",
		BODY: "block"
	};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */

// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		display = jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = ( iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" ) )
				.appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = iframe[ 0 ].contentDocument;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var documentElement = document.documentElement;



( function() {
	var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE9-11+
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	container.appendChild( div );

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {
		div.style.cssText =

			// Support: Firefox<29, Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";
		div.innerHTML = "";
		documentElement.appendChild( container );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";
		reliableMarginLeftVal = divStyle.marginLeft === "2px";
		boxSizingReliableVal = divStyle.width === "4px";

		// Support: Android 4.0 - 4.3 only
		// Some styles come back with percentage values, even though they shouldn't
		div.style.marginRight = "50%";
		pixelMarginRightVal = divStyle.marginRight === "4px";

		documentElement.removeChild( container );
	}

	jQuery.extend( support, {
		pixelPosition: function() {

			// This test is executed only once but we still do memoizing
			// since we can use the boxSizingReliable pre-computing.
			// No need to check if the test was already performed, though.
			computeStyleTests();
			return pixelPositionVal;
		},
		boxSizingReliable: function() {
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return boxSizingReliableVal;
		},
		pixelMarginRight: function() {

			// Support: Android 4.0-4.3
			// We're checking for boxSizingReliableVal here instead of pixelMarginRightVal
			// since that compresses better and they're computed together anyway.
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return pixelMarginRightVal;
		},
		reliableMarginLeft: function() {

			// Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return reliableMarginLeftVal;
		},
		reliableMarginRight: function() {

			// Support: Android 2.3
			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			// This support function is only executed once so no memoizing is needed.
			var ret,
				marginDiv = div.appendChild( document.createElement( "div" ) );

			// Reset CSS: box-sizing; display; margin; border; padding
			marginDiv.style.cssText = div.style.cssText =

				// Support: Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;box-sizing:content-box;" +
				"display:block;margin:0;border:0;padding:0";
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";
			documentElement.appendChild( container );

			ret = !parseFloat( window.getComputedStyle( marginDiv ).marginRight );

			documentElement.removeChild( container );
			div.removeChild( marginDiv );

			return ret;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		style = elem.style;

	computed = computed || getStyles( elem );
	ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;

	// Support: Opera 12.1x only
	// Fall back to style even without computed
	// computed is undefined for elems on document fragments
	if ( ( ret === "" || ret === undefined ) && !jQuery.contains( elem.ownerDocument, elem ) ) {
		ret = jQuery.style( elem, name );
	}

	// Support: IE9
	// getPropertyValue is only needed for .css('filter') (#12537)
	if ( computed ) {

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// http://dev.w3.org/csswg/cssom/#resolved-values
		if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE9-11+
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?

		// If we already have the right measurement, avoid augmentation
		4 :

		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// At this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// At this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// At this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// Some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {

		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test( val ) ) {
			return val;
		}

		// Check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// Use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = dataPriv.get( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {

			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = dataPriv.access(
					elem,
					"olddisplay",
					defaultDisplay( elem.nodeName )
				);
			}
		} else {
			hidden = isHidden( elem );

			if ( display !== "none" || !hidden ) {
				dataPriv.set(
					elem,
					"olddisplay",
					hidden ? display : jQuery.css( elem, "display" )
				);
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// Support: IE9-11+
			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				style[ name ] = value;
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}
		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&
					elem.offsetWidth === 0 ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = extra && getStyles( elem ),
				subtract = extra && augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				);

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ name ] = value;
				value = jQuery.css( elem, name );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// Support: Android 2.3
jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			return swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE9
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {

		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE9-10 do not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );

		// Test default display if display is currently "none"
		checkDisplay = display === "none" ?
			dataPriv.get( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {
			style.display = "inline-block";
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show
				// and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

		// Any non-fx value stops us from restoring the original display value
		} else {
			display = undefined;
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = dataPriv.access( elem, "fxshow", {} );
		}

		// Store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done( function() {
				jQuery( elem ).hide();
			} );
		}
		anim.done( function() {
			var prop;

			dataPriv.remove( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		} );
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}

	// If this is a noop like .hide().hide(), restore an overwritten display value
	} else if ( ( display === "none" ? defaultDisplay( elem.nodeName ) : display ) === "inline" ) {
		style.display = display;
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {
	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnotwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ?
		opt.duration : opt.duration in jQuery.fx.speeds ?
			jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	window.clearInterval( timerId );

	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: iOS<=5.1, Android<=4.2+
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE<=11+
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: Android<=2.3
	// Options inside disabled selects are incorrectly marked as disabled
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<=11+
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					jQuery.nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {

					// Set corresponding property to false
					elem[ propName ] = false;
				}

				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle;
		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ name ];
			attrHandle[ name ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				name.toLowerCase() :
				null;
			attrHandle[ name ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) ||
						rclickable.test( elem.nodeName ) && elem.href ?
							0 :
							-1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {
			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




var rclass = /[\t\r\n\f]/g;

function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnotwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + getClass( elem ) + " " ).replace( rclass, " " )
					.indexOf( className ) > -1
			) {
				return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g,
	rspaces = /[\x20\t\r\n\f]+/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?

					// Handle most common string cases
					ret.replace( rreturn, "" ) :

					// Handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					jQuery.trim( jQuery.text( elem ) ).replace( rspaces, " " );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ?
								!option.disabled : option.getAttribute( "disabled" ) === null ) &&
							( !option.parentNode.disabled ||
								!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


jQuery.each( ( "blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




support.focusin = "onfocusin" in window;


// Support: Firefox
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome, Safari
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



// Support: Android 2.3
// Workaround failure to string-cast null input
jQuery.parseJSON = function( data ) {
	return JSON.parse( data + "" );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE9
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

		// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// The jqXHR state
			state = 0,

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {

								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" ).replace( rhash, "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE8-11+
			// IE throws exception if url is malformed, e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE8-11+
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( state === 2 ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );

				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapAll( html.call( this, i ) );
			} );
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function() {
		return this.parent().each( function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		} ).end();
	}
} );


jQuery.expr.filters.hidden = function( elem ) {
	return !jQuery.expr.filters.visible( elem );
};
jQuery.expr.filters.visible = function( elem ) {

	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	// Use OR instead of AND as the element is not visible if either is true
	// See tickets #10406 and #13132
	return elem.offsetWidth > 0 || elem.offsetHeight > 0 || elem.getClientRects().length > 0;
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {

			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					} ) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE9
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE9
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = callback( "error" );

				// Support: IE9
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				} ).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = jQuery.trim( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var docElem, win,
			elem = this[ 0 ],
			box = { top: 0, left: 0 },
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		box = elem.getBoundingClientRect();
		win = getWindow( doc );
		return {
			top: box.top + win.pageYOffset - docElem.clientTop,
			left: box.left + win.pageXOffset - docElem.clientLeft
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume getBoundingClientRect is there when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari<7-8+, Chrome<37-44+
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://code.google.com/p/chromium/issues/detail?id=229280
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	},
	size: function() {
		return this.length;
	}
} );

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}



var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}

return jQuery;
}));

},{}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _domify = require('domify');

var _domify2 = _interopRequireDefault(_domify);

var _templatesGamesAhorcadoHbs = require('./templates/games/ahorcado.hbs');

var _templatesGamesAhorcadoHbs2 = _interopRequireDefault(_templatesGamesAhorcadoHbs);

// JavaScript Document
var palabras = new Array('carro', 'pez', 'gato', 'silla', 'rosa', 'caballo', 'caja', 'vaso', 'bolsa', 'juego');
var numeroAzar = Math.floor(Math.random() * 10);
var divClassLetra = '<div class="letra alinearHorizontal centrarDiv">';
var respuesta = [];
var palabra = '';
var letra = "";
var errores = 0;
var intentos = 4;
var letras = document.getElementsByClassName('botonLetra');

function iniciar() {
	var noIntentos = document.getElementById('noIntentos');
	for (var i = 65; i < 91; i++) {
		var contenedorLetras = document.getElementById('contenedorLetras');
		var letra_p = '<div class="botonLetra alinearHorizontal cursorPointer centrarTexto borderBox" id="letra' + String.fromCharCode(i) + '">' + String.fromCharCode(i) + '</div>';
		contenedorLetras.innerHTML += letra_p;
	}

	for (var i = 0; i < letras.length; i++) {
		agregarEvento(letras[i], 'click', jugar, false);
	}

	for (var i = 0; i < palabras[numeroAzar].length; i++) {
		respuesta[i] = divClassLetra + '_</div> ';
		palabra = palabra + respuesta[i];
		// contenedorPalabra.innerHTML=respuesta[i];
	}

	var palabraSecreta = document.getElementById('palabraSecreta');
	palabraSecreta.innerHTML = palabra;
	var botonJugar = document.getElementById('botonJugar');

	llenar_palabras(palabraSecreta);

	agregarEvento(botonJugar, 'click', function () {

		var wrap = document.querySelector(".wrap-juego");
		(0, _jquery2['default'])(".wrap-juego").empty();

		var tpl = (0, _templatesGamesAhorcadoHbs2['default'])();
		wrap.appendChild((0, _domify2['default'])(tpl));

		numeroAzar = Math.floor(Math.random() * 10);
		respuesta = [];
		palabra = '';
		letra = '';
		errores = 0;
		intentos = 4;
		iniciar();
	}, false);
}

function jugar(e) {
	if (e) {
		var id = e.target.id;
	} else {
		if (window.event) {
			var id = window.event.srcElement.id;
		}
	}
	var letraCorrecta = false;
	var palabra = '';
	var letraPulsada = id.charAt(5);

	for (var i = 0; i < palabras[numeroAzar].length; i++) {

		if (palabras[numeroAzar].toUpperCase().charAt(i) == letraPulsada) {
			respuesta[i] = divClassLetra + letraPulsada + '</div>';
			letraCorrecta = true;
		}
		palabra = palabra + respuesta[i];
		// contenedorPalabra.innerHTML=respuesta[i];
	}

	var imagen = document.getElementById('imagen');
	palabraSecreta.innerHTML = palabra;

	if (letraCorrecta == false) {
		var colorLetra = '';
		errores++;
		intentos = intentos - 1;
		noIntentos.innerHTML = intentos;
		var img = errores + 1;
		imagen.src = '../dist/img/a' + img + '.jpg';
		if (errores == 4) {
			alert('Perdiste :c\nPulsa jugar de nuevo para continuar');
			for (var i = 0; i < letras.length; i++) {
				removerEvento(letras[i], 'click', jugar);
			}
			palabra = '';
			for (var i = 0; i < palabras[numeroAzar].length; i++) {
				if (divClassLetra + palabras[numeroAzar].toUpperCase().charAt(i) + '</div>' == respuesta[i]) {
					colorLetra = '<div style="color:blue;" class="letra alinearHorizontal">' + respuesta[i] + '</div>';
					respuesta[i] = colorLetra;
				} else {
					respuesta[i] = divClassLetra + palabras[numeroAzar].toUpperCase().charAt(i) + '</div>';
				}
				palabra = palabra + respuesta[i];
			}
			palabraSecreta.innerHTML = palabra;
		}
	} else {
		var palabraCompleta = true;
		for (var i = 0; i < palabras[numeroAzar].length; i++) {
			if (respuesta[i] == divClassLetra + '_</div> ') {
				palabraCompleta = false;
			}
		}
		if (palabraCompleta) {
			alert('Ganaste :D\nPulsa jugar de nuevo para continuar');
			for (var i = 0; i < letras.length; i++) {
				removerEvento(letras[i], 'click', jugar);
			}
		}
	}
}

function agregarEvento(elemento, evento, funcion, captura) {
	if (window.addEventListener) {
		elemento.addEventListener(evento, funcion, captura);
	} else if (window.attachEvent) {
		elemento.attachEvent('on' + evento, captura);
	} else {
		alert('Error al agregar el evento');
	}
}

function removerEvento(elemento, evento, funcion) {
	if (window.removeEventListener) {
		elemento.removeEventListener(evento, funcion);
	} else if (window.detachEvent) {
		elemento.detachEvent(evento, funcion);
	} else {
		alert('Error al remover el evento');
	}
}

function llenar_palabras(palabraSecreta) {
	var letra_palabra = document.querySelectorAll(".letra");
	var palabra_select = palabras[numeroAzar];
	var len_palabra = palabra_select.length;
	var array_palabra = palabra_select.split("");
	var first_letter = array_palabra[0].toUpperCase();
	var last_letter = array_palabra[len_palabra - 1].toUpperCase();
	var palabra = '';

	for (var i = 0; i < palabras[numeroAzar].length; i++) {
		if (palabras[numeroAzar].toUpperCase().charAt(i) == first_letter) {
			respuesta[i] = divClassLetra + first_letter + '</div>';
		}
		if (palabras[numeroAzar].toUpperCase().charAt(i) == last_letter) {
			respuesta[i] = divClassLetra + last_letter + '</div>';
		}
		palabra = palabra + respuesta[i];
	}
	console.log(palabra_select);
	palabraSecreta.innerHTML = palabra;
}

exports['default'] = iniciar;
module.exports = exports['default'];

},{"./templates/games/ahorcado.hbs":42,"domify":1,"jquery":21}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function principal() {
    crearEscenario();
    crearMatriz();

    (0, _jquery2['default'])('#lblcontador').text('0');

    document.onkeyup = function (e) {
        if (e.which == 90 || e.which == 122) {
            controlPress = false;
        }
    };

    document.onkeydown = function (e) {
        if (e.which == 90 || e.which == 122) {
            controlPress = true;
        }
    };

    document.oncontextmenu = function () {
        return false;
    };

    document.querySelector("#facil").addEventListener("click", function () {
        reiniciarJuego(1);
    }, false);
    document.querySelector("#medio").addEventListener("click", function () {
        reiniciarJuego(2);
    }, false);
    document.querySelector("#dificil").addEventListener("click", function () {
        reiniciarJuego(3);
    }, false);

    document.querySelector("#newgame").addEventListener("click", function () {
        reiniciarJuego(nivel);
    }, false);

    (0, _jquery2['default'])('.bloque').mousedown(function () {
        //antes de validar el click derecho hay q validar q no se este utilizando mozilla
        if (!_jquery2['default'].browser.mozilla) {
            if (event.button == 2) {
                //click derecho
                var id = (0, _jquery2['default'])(this).attr('id').split('p');
                var i = id[0];
                var j = id[1];

                if (perder) {
                    perdiste();
                } else if (ganar) {
                    ganaste();
                }
                if (minas[i][j] == 0) {
                    minas[i][j] = 10;
                    asignarBandera(this);
                } else if (minas[i][j] == -1) {
                    minas[i][j] = -100;
                    asignarBandera(this);
                } else if (minas[i][j] == 1 || minas[i][j] == 2 || minas[i][j] == 3 || minas[i][j] == 4 || minas[i][j] == 5 || minas[i][j] == 6 || minas[i][j] == 7 || minas[i][j] == 8) {
                    minas[i][j] = minas[i][j] * 1000;
                    asignarBandera(this);
                } else if (minas[i][j] == 10) {
                    minas[i][j] = 0;
                    quitarBandera(this);
                } else if (minas[i][j] == -100) {
                    minas[i][j] = -1;
                    quitarBandera(this);
                } else if (minas[i][j] == 1000 || minas[i][j] == 2000 || minas[i][j] == 3000 || minas[i][j] == 4000 || minas[i][j] == 5000 || minas[i][j] == 6000 || minas[i][j] == 7000 || minas[i][j] == 8000) {
                    minas[i][j] = minas[i][j] / 1000;
                    quitarBandera(this);
                }

                if (minasTapadas()) {
                    if (!existenEspaciosCubiertos()) {
                        clearInterval(timer);
                        ganaste();
                    }
                }
            }
        }
    });

    (0, _jquery2['default'])('.bloque').click(function () {
        var id = (0, _jquery2['default'])(this).attr('id').split('p');
        var i = id[0];
        var j = id[1];

        if (!inicio) {
            timer = setInterval(sumarSegundos, 1000);
            inicio = true;
        }

        if (perder) {
            perdiste();
        } else if (ganar) {
            ganaste();
        } else if (controlPress) {
            //poner bandera

            if (minas[i][j] == 0) {
                minas[i][j] = 10;
                asignarBandera(this);
            } else if (minas[i][j] == -1) {
                minas[i][j] = -100;
                asignarBandera(this);
            } else if (minas[i][j] == 1 || minas[i][j] == 2 || minas[i][j] == 3 || minas[i][j] == 4 || minas[i][j] == 5 || minas[i][j] == 6 || minas[i][j] == 7 || minas[i][j] == 8) {
                minas[i][j] = minas[i][j] * 1000;
                asignarBandera(this);
            } else if (minas[i][j] == 10) {
                minas[i][j] = 0;
                quitarBandera(this);
            } else if (minas[i][j] == -100) {
                minas[i][j] = -1;
                quitarBandera(this);
            } else if (minas[i][j] == 1000 || minas[i][j] == 2000 || minas[i][j] == 3000 || minas[i][j] == 4000 || minas[i][j] == 5000 || minas[i][j] == 6000 || minas[i][j] == 7000 || minas[i][j] == 8000) {
                minas[i][j] = minas[i][j] / 1000;
                quitarBandera(this);
            }
        } else if (minas[i][j] == 0) {
            (0, _jquery2['default'])('#' + i + 'p' + j).attr('class', 'bloque_mina');
            descubrirMinas();
            clearInterval(timer);
            perder = true;
            perdiste();
        } else if (minas[i][j] >= 1 && minas[i][j] <= 8) {
            //si es un numero a descubrir
            (0, _jquery2['default'])(this).attr('class', 'bloque' + minas[i][j]);
            minas[i][j] = minas[i][j] * 100;
        } else if (minas[i][j] == -1) {
            descubrirEspacios(i, j);
        }

        //validar si gano, no se hacen las dos sentencias en un if por rendimiento
        if (minasTapadas()) {
            if (!existenEspaciosCubiertos()) {
                clearInterval(timer);
                ganar = true;
                ganaste();
            }
        }
    });
}

function crearEscenario() {

    for (var i = 0; i < espacioNivel; i++) {
        for (var j = 0; j < espacioNivel; j++) {
            (0, _jquery2['default'])('#canvas').append('<div id="' + i + 'p' + j + '" class="bloque" ></div>');
        }
    }

    //asignar los estilos al fondo y al canvas
    (0, _jquery2['default'])('#precontenedor').attr('class', 'precontenedor' + nivel);
    (0, _jquery2['default'])('#contenedor').attr('class', 'contenedor' + nivel);
    (0, _jquery2['default'])('#canvas').attr('class', 'canvas' + nivel);
}

//crear matriz con la informacion de las minas
function crearMatriz() {
    for (var i = 0; i < espacioNivel; i++) {
        minas[i] = new Array(espacioNivel);
    }

    for (var i = 0; i < espacioNivel; i++) {
        for (var j = 0; j < espacioNivel; j++) {
            minas[i][j] = -1; //-1 significa que esta vacio
        }
    }

    //ubicar minas
    while (cantMinas < minasNivel) {
        var i = aleatorio(0, espacioNivel);
        var j = aleatorio(0, espacioNivel);

        if (minas[i][j] == -1) {
            minas[i][j] = 0;
            cantMinas++;
        }
    }
    (0, _jquery2['default'])('#lblcontadorMinas').text(cantMinas); //asignar la cantidad de minas en el label
    minasCubiertas = new Array(cantMinas);

    //ubicar numeros, recorremos toda la matriz de las minas y analizamos la parte externa de cada punto,
    //para ubicar los numeros que representan las minas cercanas
    for (var i = 0; i < espacioNivel; i++) {
        for (var j = 0; j < espacioNivel; j++) {
            if (minas[i][j] != 0) {
                var minasCercanas = 0; //aqui llevamos el acumulado de las minas cercanas

                //hay que verificar las 8 posiciones adyacentes de cada punto de la matriz
                //ademas hay que validar que no se vaya a ingresar una posicion inexistente
                if (i != 0 && j != 0) {
                    if (minas[i - 1][j - 1] == 0) {
                        minasCercanas++;
                    }
                }

                if (i != 0) {
                    if (minas[i - 1][j] == 0) {
                        minasCercanas++;
                    }
                }

                if (i != 0 && j != espacioNivel - 1) {
                    if (minas[i - 1][j + 1] == 0) {
                        minasCercanas++;
                    }
                }

                if (j != 0) {
                    if (minas[i][j - 1] == 0) {
                        minasCercanas++;
                    }
                }

                if (j != espacioNivel - 1) {
                    if (minas[i][j + 1] == 0) {
                        minasCercanas++;
                    }
                }

                if (i != espacioNivel - 1 && j != 0) {
                    if (minas[i + 1][j - 1] == 0) {
                        minasCercanas++;
                    }
                }

                if (i != espacioNivel - 1) {
                    if (minas[i + 1][j] == 0) {
                        minasCercanas++;
                    }
                }

                if (i != espacioNivel - 1 && j != espacioNivel - 1) {
                    if (minas[i + 1][j + 1] == 0) {
                        minasCercanas++;
                    }
                }

                //asignamos la cantidad de minas cercanas
                if (minasCercanas > 0) {
                    minas[i][j] = minasCercanas;
                }
            }
        }
    }
}

function descubrirMinas() {
    for (var i = 0; i < espacioNivel; i++) {
        for (var j = 0; j < espacioNivel; j++) {
            if (minas[i][j] == 0) {
                //$('#' + i + 'p' + j).attr('class', 'bloque_mina');
                minasCubiertas[cantMinasCubiertas] = i + 'p' + j;
                cantMinasCubiertas++;
            }
        }
    }

    explosion = document.getElementById('explosion');
    explosion.play();
    var velocidad = 1000; //velocidad para descubrir las minas

    if (cantMinasCubiertas <= 10) {
        velocidad = 250;
    } else if (cantMinasCubiertas >= 11 && cantMinasCubiertas <= 30) {
        velocidad = 150;
    } else {
        velocidad = 100;
    }
    timerMinas = setInterval(animacionDescubrirMinas, velocidad);
}

//descubre las minas paso a paso   
function animacionDescubrirMinas() {
    if (cantMinasCubiertas == posMinasCubiertas) {
        //cantMinasCubiertas comienza en 0 por lo tanto se pude comparar con igual
        clearInterval(timerMinas);
    } else {
        (0, _jquery2['default'])('#' + minasCubiertas[posMinasCubiertas].split('p')[0] + 'p' + minasCubiertas[posMinasCubiertas].split('p')[1]).attr('class', 'bloque_mina');
        posMinasCubiertas++;
    }
}

function descubrirEspacios(i, j) {
    var termino = false;
    var pendientes = new Array(); //aqui se guardan todos los puntos donde se volvera revisar       
    var posPendientes = 0;
    var pendienteIzq = false;
    var pendienteDer = false;
    var pendienteAba = false;
    var pendienteArri = false;

    while (!termino) {

        minas[i][j] = -10; //la posicion que se pasa a la funcion se puede descubrir (ya se valido que fuera vacio)
        (0, _jquery2['default'])('#' + i + 'p' + j).attr('class', 'bloque_vacio');

        if (j != 0) {
            j--;
            if (minas[i][j] == -10 || minas[i][j] == 10 || minas[i][j] == -100 || minas[i][j] >= 100) {
                pendienteIzq = true;
            } else if (minas[i][j] == -1) {
                //verificamos si la posicion izquierda esta vacia, sino lo esta, verificamos si hay un numero cubierto para descubrirlo
                pendientes.push(i + 'p' + j); //guardamos la posicion como pendiente para revisarla despues                           
            } else if (minas[i][j] >= 1 && minas[i][j] <= 8) {
                    (0, _jquery2['default'])('#' + i + 'p' + j).attr('class', 'bloque' + minas[i][j]);
                    minas[i][j] = minas[i][j] * 100;
                    pendienteIzq = true;

                    validarDiagonales(i, parseInt(j) + 1);
                } else if (minas[i][j] == -10) {
                    pendienteIzq = true;
                }
            j++;
        } else {
            pendienteIzq = true;
        }

        if (i != espacioNivel - 1) {
            i++;
            if (minas[i][j] == -10 || minas[i][j] == 10 || minas[i][j] == -100 || minas[i][j] >= 100) {
                pendienteAba = true;
            } else if (minas[i][j] == -1) {
                pendientes.push(i + 'p' + j);
            } else if (minas[i][j] >= 1 && minas[i][j] <= 8) {
                (0, _jquery2['default'])('#' + i + 'p' + j).attr('class', 'bloque' + minas[i][j]);
                minas[i][j] = minas[i][j] * 100;
                pendienteAba = true;

                validarDiagonales(i - 1, j);
            } else if (minas[i][j] == -10) {
                pendienteAba = true;
            }
            i--;
        } else {
            pendienteAba = true;
        }

        if (j != espacioNivel - 1) {
            j++;
            if (minas[i][j] == -10 || minas[i][j] == 10 || minas[i][j] == -100 || minas[i][j] >= 100) {
                pendienteDer = true;
            } else if (minas[i][j] == -1) {
                pendientes.push(i + 'p' + j);
            } else if (minas[i][j] >= 1 && minas[i][j] <= 8) {
                (0, _jquery2['default'])('#' + i + 'p' + j).attr('class', 'bloque' + minas[i][j]);
                minas[i][j] = minas[i][j] * 100;
                pendienteDer = true;

                validarDiagonales(i, j - 1);
            } else if (minas[i][j] == -10) {
                pendienteDer = true;
            }
            j--;
        } else {
            pendienteDer = true;
        }

        if (i != 0) {
            i--;
            //no es necesario añadir un pendiente al vector, porq el algoritmo siempre continuara hacia arriba
            if (minas[i][j] == -10 || minas[i][j] == 10 || minas[i][j] == -100 || minas[i][j] >= 100) {
                pendienteArri = true;
            } else if (minas[i][j] == -1) {
                pendientes.push(i + 'p' + j);
            } else if (minas[i][j] >= 1 && minas[i][j] <= 8) {
                (0, _jquery2['default'])('#' + i + 'p' + j).attr('class', 'bloque' + minas[i][j]);
                minas[i][j] = minas[i][j] * 100;
                pendienteArri = true;

                validarDiagonales(parseInt(i + 1), j);
            } else if (minas[i][j] == -10) {
                pendienteArri = true;
            }
            i++;
        } else {
            pendienteArri = true;
        }

        if (pendientes.length == posPendientes && pendienteIzq && pendienteAba && pendienteDer && pendienteArri) {
            //en caso que estemos en el ultimo pendiente y las posiciones adyacentes del punto actual esten solucionadas, significa que terminamos
            termino = true;
        } else {
            var spplitedPendientes = pendientes[posPendientes].split('p');
            i = spplitedPendientes[0];
            j = spplitedPendientes[1];
            posPendientes++;
        }

        pendienteIzq = false;
        pendienteAba = false;
        pendienteDer = false;
        pendienteArri = false;
    }
}

//valida si las banderas puestas coinciden con las minas
function minasTapadas() {
    for (var i = 0; i < espacioNivel; i++) {
        for (var j = 0; j < espacioNivel; j++) {
            if (minas[i][j] == 0) {
                return false;
            }
        }
    }
    return true;
}

//recibe una posicion i,j de la matriz minas y valida sus diagonales, sirve para completar el metodo que descubre los espacios
function validarDiagonales(i, j) {

    if (i != 0 && j != 0) {
        i--;
        j--;
        if (minas[i][j] >= 1 && minas[i][j] <= 8) {
            (0, _jquery2['default'])('#' + i + 'p' + j).attr('class', 'bloque' + minas[i][j]);
            minas[i][j] = minas[i][j] * 100;
        }
        i++;
        j++;
    }

    if (i != espacioNivel - 1 && j != espacioNivel - 1) {
        i++;
        j++;
        if (minas[i][j] >= 1 && minas[i][j] <= 8) {
            (0, _jquery2['default'])('#' + i + 'p' + j).attr('class', 'bloque' + minas[i][j]);
            minas[i][j] = minas[i][j] * 100;
        }
        i--;
        j--;
    }

    if (i != espacioNivel - 1 && j != 0) {
        i++;
        j--;
        if (minas[i][j] >= 1 && minas[i][j] <= 8) {
            (0, _jquery2['default'])('#' + i + 'p' + j).attr('class', 'bloque' + minas[i][j]);
            minas[i][j] = minas[i][j] * 100;
        }
        i--;
        j++;
    }

    if (i != 0 && j != espacioNivel - 1) {
        i--;
        j++;
        if (minas[i][j] >= 1 && minas[i][j] <= 8) {
            (0, _jquery2['default'])('#' + i + 'p' + j).attr('class', 'bloque' + minas[i][j]);
            minas[i][j] = minas[i][j] * 100;
        }
        i++;
        j--;
    }
}

//valida si en el escenario existen espacios sin descubrir
function existenEspaciosCubiertos() {
    for (var i = 0; i < espacioNivel; i++) {
        for (var j = 0; j < espacioNivel; j++) {
            if (minas[i][j] == -1 || minas[i][j] == 1 || minas[i][j] == 2 || minas[i][j] == 3 || minas[i][j] == 4 || minas[i][j] == 5 || minas[i][j] == 6 || minas[i][j] == 7 || minas[i][j] == 8) {
                return true;
            }
        }
    }
    return false;
}

function perdiste() {
    (0, _jquery2['default'])('#modaltitulo').empty().append('PERDISTE');
    (0, _jquery2['default'])('#modalnuevojuego').empty().append('<a id="nuevo_juego">Nuevo juego</a>');

    document.querySelector("#nuevo_juego").addEventListener("click", function () {
        reiniciarJuego(nivel);
    }, false);
    //modal();     
}

//suma un segundo al cronometro
function sumarSegundos() {
    segundos++;
    (0, _jquery2['default'])('#lblcontador').text(segundos);
}

function asignarBandera(div) {
    (0, _jquery2['default'])(div).attr('class', 'bloque_bandera');
    cantBanderas++;
    (0, _jquery2['default'])('#lblcontadorMinas').text(cantMinas - cantBanderas);
}

function quitarBandera(div) {
    (0, _jquery2['default'])(div).attr('class', 'bloque');
    cantBanderas--;
    (0, _jquery2['default'])('#lblcontadorMinas').text(cantMinas - cantBanderas);
}

function aleatorio(inferior, superior) {
    var numPosibilidades = superior - inferior;
    var aleat = Math.random() * numPosibilidades;
    aleat = Math.floor(aleat);
    return parseInt(inferior) + aleat;
}

//abre la ventana modal
function modal() {
    (0, _jquery2['default'])('.modal').css('visibility', 'visible');
    (0, _jquery2['default'])('.modaltransparencia').css('visibility', 'visible');
    (0, _jquery2['default'])('.modal').css('display', 'block');
    (0, _jquery2['default'])('.modaltransparencia').css('display', 'block');
}

function modalCerrar() {
    (0, _jquery2['default'])('.modal').css('visibility', 'collapse');
    (0, _jquery2['default'])('.modaltransparencia').css('visibility', 'collapse');
    (0, _jquery2['default'])('.modal').css('display', 'none');
    (0, _jquery2['default'])('.modaltransparencia').css('display', 'none');
}

var nivel = 1; //el nivel actual
var espacioNivel = new Number(9); //la cantidad de espacios segun el nivel (cuadros en el tablero) , para el nivel 1  9 espacios, para el 2  14 espacios, para el nivel 3  19 espacios
var minasNivel = 10; //la cantidad de minas segun el nivel

var minas = new Array(espacioNivel);
var cantMinas = 0;
var inicio = false; //permite saber si el usuario inicio el juego
var timer;
var segundos = new Number(0);
var controlPress = false; //saber si tiene presionada la tecla que permite poner la bandera
var cantBanderas = 0; //permite saber la cantidad de banderas que ha puesto el usuario
var puntaje = 0;
var perder = false;
var ganar = false;

//animacion minas
var minasCubiertas; //array que guardara las posiciones de las minas, en caso que el jugador pierda 
var posMinasCubiertas = 0; //lleva la posicion del vector para poder descubrir las minas paso a paso
var cantMinasCubiertas = 0; //la cantidad de minas cubiertas en un momento dado, sirve para saber cuando termina la animacion
var timerMinas;
var explosion; //sonideo de la explosion

//variables facebook
var idusuario;
var nombreJuego = 'buscaminas';
var idJuego = 1;
var host = 'http://localhost:90/conexion/conexionmulti.php';

//animacion loading
var vecesLoading = 0; //se utiliza para ejecutar cierta cantidad de veces la animacion del fondo del loading
var vecesLoading2 = 0; //para el loading2
var timerLoading;
var timerLoading2;

//obtiene la informacion de un atributo que esta varias veces, recibe la cadena el atributo y el array donde se almacenara
function obtenerAtributos(cadenaJson, atributoJson, arrayJson) {
    for (var i = 0; i < 5; i++) {
        arrayJson[i] = obtenerAtributo(cadenaJson, atributoJson);

        //quitar el atributo para no repetir el dato
        var indexJson = new Number(cadenaJson.indexOf(atributoJson));
        cadenaJson = cadenaJson.substring(indexJson + atributoJson.length);
    }
}

//obtiene el atributo de un estructura json, recibe la cadena y el atributo que se va a consultar
function obtenerAtributo(cadena, atributo) {
    var index = new Number(cadena.indexOf(atributo));
    var sub = cadena.substring(index + 4 + atributo.length);

    var index2 = new Number(sub.indexOf(','));
    var resultado = sub.substring(0, index2 - 1); //el dato a consultar lo obtenemos con la segunda cadena, la cual en su posicion 0 tiene el inicio del dato
    return resultado;
}

function ganaste() {
    if (nivel == 1) {
        if (segundos > 300) {
            puntaje = 100;
        } else {
            puntaje = segundos * -1 + 400;
        }
    } else if (nivel == 2) {
        if (segundos > 600) {
            puntaje = 200;
        } else {
            puntaje = segundos * -1 + 800;
        }
    } else if (nivel == 3) {
        if (segundos > 1000) {
            puntaje = 300;
        } else {
            puntaje = segundos * -1 + 1300;
        }
    }

    if (idusuario != undefined) {
        (0, _jquery2['default'])('#load').load(host + '?metodo=ingresarPuntuacion&idfacebook=' + idusuario + '&idjuego=' + idJuego + '&tiempo=' + segundos + '&nivel=' + nivel + '&puntaje=' + puntaje, function (resul) {});
    }

    //hay que quitar todo el texto primero antes de agregar alguno nuevo
    (0, _jquery2['default'])('#modaltitulo').empty().append('GANASTE');
    (0, _jquery2['default'])('#modaltiempo').empty().append('Tu tiempo fue de: ' + segundos + ' segundos');
    (0, _jquery2['default'])('#modalpuntaje').empty().append('Tu puntaje fue de: ' + puntaje);
    (0, _jquery2['default'])('#modalnuevojuego').empty().append("<a id='ganastes'>Nuevo Juego</a>");

    document.querySelector("#ganastes").addEventListener("click", function () {
        reiniciarJuego(nivel);
    }, false);
    modal();
}

function reiniciarJuego(nivelUsuario) {
    //se envia el nivel que el usuario desea jugar
    //
    //reiniciar todas las variables del juego
    cantMinas = 0;
    inicio = false;
    segundos = 0;
    controlPress = false;
    cantBanderas = 0;
    puntaje = 0;
    perder = false;
    ganar = false;
    posMinasCubiertas = 0;
    cantMinasCubiertas = 0;
    clearInterval(timer);

    //asignar variables de nivel
    nivel = nivelUsuario;

    if (nivel == 1) {
        espacioNivel = 9;
        minasNivel = 10;
    } else if (nivel == 2) {
        espacioNivel = 14;
        minasNivel = 30;
    } else {
        espacioNivel = 19;
        minasNivel = 70;
    }

    (0, _jquery2['default'])("#canvas").empty();

    principal();

    modalCerrar();
    (0, _jquery2['default'])('#lblcontador').text('0');
    (0, _jquery2['default'])('#canvas div').attr('class', 'bloque'); //asignar estilo a todos los bloques           
}

exports['default'] = principal;
module.exports = exports['default'];

},{"jquery":21}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function calificar(socket) {

	var aic_card = document.querySelector(".calificar-aic");
	var agc_ver = document.querySelector(".agc-ver");
	var tai_ver = document.querySelector(".tai-ver");
	var close_note = document.getElementById("close_note");
	var close_tai = document.querySelector("#cerrar-deber");

	// Eventos
	aic_card.addEventListener("click", showListAic, false);
	agc_ver.addEventListener("click", showListAgc, false);
	close_note.addEventListener("click", closeNote, false);
	tai_ver.addEventListener("click", showListTai, false);
	close_tai.addEventListener("click", closeTai, false);

	function showListAic() {
		var clase = document.querySelector("#clase_id").value;
		listadoAic(clase);
		(0, _jquery2['default'])("#aic_listado").fadeIn();
	}

	function showListAgc() {
		var clase = document.querySelector("#clase_id").value;
		listadoAgc(clase);
		(0, _jquery2['default'])("#aic_listado").fadeIn();
		(0, _jquery2['default'])(".list_type").html("AGC");
	}

	function showListTai() {
		var clase = document.querySelector("#clase_id").value;
		listadoTai(clase);
		(0, _jquery2['default'])("#deber_listado").fadeIn();
	}

	function closeNote(e) {
		e.preventDefault();
		(0, _jquery2['default'])("#aic_listado").fadeOut();
		(0, _jquery2['default'])(".lrem").remove();
		(0, _jquery2['default'])(".list_type").html("AIC");
	}

	function closeTai() {
		(0, _jquery2['default'])("#deber_listado").fadeOut();
		(0, _jquery2['default'])(".listado_tai_students").remove();
	}

	function onAicNota() {
		if (this.value > 10) alert("No puede ser mayor la calificacion que 10");else if (this.value <= 0) alert("No puede ser menor la calificacion que 0");else {
			var data = { nota: this.value, id: this.name, clase: (0, _jquery2['default'])("#clase_id").val() };
			socket.emit("cal::nota", data);
		}
	}

	function onAgcNota() {
		if (this.value > 10) alert("No puede ser mayor la calificacion que 10");else if (this.value <= 0) alert("No puede ser menor la calificacion que 0");else {
			var data = { nota: this.value, id: this.name, clase: (0, _jquery2['default'])("#clase_id").val() };
			socket.emit("cal::nota::agc", data);
		}
	}

	function onTaiNota() {
		if (this.value > 10) alert("No puede ser mayor la calificacion que 10");else if (this.value <= 0) alert("No puede ser menor la calificacion que 0");else {
			var data = { nota: this.value, id: this.name, clase: (0, _jquery2['default'])("#clase_id").val() };
			socket.emit("cal::nota::tai", data);
		}
	}

	function listadoAic(clase) {
		var listado = document.querySelector("#content-listas");

		_jquery2['default'].get('/listado/aic/' + clase, function (data) {
			console.log(data);
			for (var i = 0; data.length > i; i++) {

				var tpl = '<ul class="estud_califi lrem">\n\t\t\t\t\t\t<li class="lrem-name">' + data[i].rel_alumno.name + '</li>\n\t\t\t\t\t\t<li class="lrem-time">' + data[i].tiempo + '</li>\n\t\t\t\t\t\t<li class="lrem-nota"><input id="nota_aic_cal" name="' + data[i].rel_alumno._id + '" value="' + data[i].nota + '" /><li>\n\t\t\t\t</ul>';

				listado.innerHTML += tpl;
			}
			loadEvent();
		});
	}

	function listadoAgc(clase) {
		var listado = document.querySelector("#content-listas");

		_jquery2['default'].get('/listado/agc/' + clase, function (data) {
			for (var i = 0; data.length > i; i++) {
				// <li class="lrem-time">${ data[i].tiempo }</li>

				var tpl = '<ul class="estud_califi lrem">\n\t\t\t\t\t\t<li class="lrem-name">' + data[i].rel_alumno.name + '</li>\n\t\t\t\t\t\t<li class="lrem-nota"><input id="nota_agc_cal" name="' + data[i].rel_alumno._id + '" value="' + data[i].nota + '" /><li>\n\t\t\t\t</ul>';

				listado.innerHTML += tpl;
			}
			loadEventAgc();
		});
	}

	function listadoTai(clase) {
		var listado = document.querySelector("#listado_est_tai");

		_jquery2['default'].get('/listado/tai/' + clase, function (data) {
			console.log(data);

			for (var i = 0; data.length > i; i++) {
				var tpl = '<ul class="listado_tai_students">\n\t\t\t\t\t<li class="listado_tai_students-name">' + data[i].rel_alumno.name + '</li>\n\t\t\t\t\t<li class="listado_tai_students-file">\n\t\t\t\t\t\t<i class="icon-download2"></i>\n\t\t\t\t\t\t<a href="/descargar/' + data[i].file + '" >Descargar</a>\n\t\t\t\t\t</li>\n\t\t\t\t\t<li class="listado_tai_students-nota">\n\t\t\t\t\t\t<input id="nota_tai_cal" name="' + data[i].rel_alumno._id + '" value="' + data[i].nota + '" />\n\t\t\t\t\t</li>\n\t\t\t\t</ul>';
				listado.innerHTML += tpl;
			}

			loadEventTai();
		});
	}

	function loadEventTai() {
		var tai_nota_input = document.querySelectorAll("#nota_tai_cal");

		for (var i = 0; i < tai_nota_input.length; i++) {
			console.log(tai_nota_input[i]);
			tai_nota_input[i].addEventListener("keyup", onTaiNota, false);
		}
	}

	function loadEventAgc() {
		var agc_nota_input = document.querySelectorAll("#nota_agc_cal");

		for (var i = 0; i < agc_nota_input.length; i++) {
			agc_nota_input[i].addEventListener("keyup", onAgcNota, false);
		}
	}

	function loadEvent() {
		var aic_nota_input = document.querySelectorAll("#nota_aic_cal");

		for (var i = 0; i < aic_nota_input.length; i++) {
			aic_nota_input[i].addEventListener("keyup", onAicNota, false);
		}
	}
}

exports['default'] = calificar;
module.exports = exports['default'];

},{"jquery":21}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function CalificarLeccion(socket) {

    // Variables Globales
    var see_leccion = document.querySelector(".see_leccion");
    var calificar_btn = document.querySelector("#action-calificar");
    var cerrar_btn = document.querySelector("#action-cerrar");
    var cerrar_btn_listado = document.querySelector(".ListaEstudiantesLeccion-cerrar");
    // Eventos
    see_leccion.addEventListener("click", seeLeccion, false);
    calificar_btn.addEventListener("click", onCalificar, false);
    cerrar_btn.addEventListener("click", onCerrar, false);
    cerrar_btn_listado.addEventListener("click", onCerrarListado, false);

    function onCerrarListado() {
        (0, _jquery2['default'])(".ListaEstudiantesLeccionBody-list").empty();
        (0, _jquery2['default'])("#ListaEstudiantesLeccion").fadeOut();
    }

    function onCalificar(e) {
        var leccion = e.target.dataset.id;
        var nota = (0, _jquery2['default'])("#LeccionCalificarHeader-nota").val();
        var recomendacion = (0, _jquery2['default'])(".leccion_recomendacion").val();
        var id_estudiante = (0, _jquery2['default'])(".id_estudiante_leccion").val();

        if (nota > 10) alert("No puede sar mayor que 10");
        if (nota <= 0) alert("No puede sar menor que 0");
        if (recomendacion == "") alert("Debe ingresar una recomendacion");else {
            socket.emit("calificar::leccion:nota", { nota: nota, leccion: leccion, recomendacion: recomendacion });
            var btn = document.querySelector('input[data-id_alumno="' + id_estudiante + '"]');
            btn.dataset.nota = nota;
            btn.dataset.recomendacion = recomendacion;
            console.log(btn);
            onCerrar();
        }
    }
}

//Functions Events
function onCerrar() {
    (0, _jquery2['default'])(".LeccionCalificar").fadeOut();
    (0, _jquery2['default'])(".LeccionCalificarBody").empty();
    (0, _jquery2['default'])("#LeccionCalificarHeader-alumno").val("");
    (0, _jquery2['default'])("#LeccionCalificarHeader-nota").val("");
    document.querySelector("#action-calificar").dataset.id = "";
}

function seeLeccion() {
    (0, _jquery2['default'])("#ListaEstudiantesLeccion").fadeIn();
    var clase = (0, _jquery2['default'])("#clase_id_us").val();

    _jquery2['default'].get('/listado/estudiantes/leccion/' + clase).done(function (estudiantes) {
        estudiantes.map(function (e, i) {
            var tpl = TemplateItemEstudiante(e);
            (0, _jquery2['default'])(".ListaEstudiantesLeccionBody-list").append(tpl);
            (0, _jquery2['default'])(".md-lesson").on("click", calificarLesson);
        });
    });
    setTimeout(function () {
        var testls = document.querySelector(".ListaEstudiantesLeccionBody-list");
        if (testls.childElementCount == 0) {
            (0, _jquery2['default'])(".ListaEstudiantesLeccionBody-list").html("<h3>No Hay lecciones para calificar.<h3>");
        }
    }, 2000);
}

function TemplateItemEstudiante(estudiante) {
    var item = '<li>\n        <figure><img  src="' + estudiante.rel_alumno.avatar + '" width="30" height="30" /></figure>\n        <span>' + estudiante.rel_alumno.name + '</span>\n        <input type="button" value="Ver" data-id="' + estudiante.rel_leccion + '"  class="md-lesson"\n            data-alumno="' + estudiante.rel_alumno.name + '" data-leccion="' + estudiante._id + '" \n            data-id_alumno="' + estudiante.rel_alumno._id + '" data-nota="' + estudiante.nota + '" \n            data-recomendacion="' + estudiante.recomendacion + '" />\n    </li>';
    return item;
}
function selectType(data) {
    var type = "";

    if (data.type == "C") type = "DE COMPLETAR";else if (data.type == "S") type = "DE SELECCION SIMPLE";else if (data.type == "M") type = "DE SELECCION MULTIPLE";

    return type;
}

function calificarLesson(e) {
    var prueba = e.target.dataset.id;
    var alumno = e.target.dataset.alumno;
    var leccion = e.target.dataset.leccion;
    var id_alumno = e.target.dataset.id_alumno;
    var nota = e.target.dataset.nota;
    var recomendacion = e.target.dataset.recomendacion;
    document.querySelector("#action-calificar").dataset.id = leccion;
    (0, _jquery2['default'])("#LeccionCalificarHeader-nota").val(nota);
    (0, _jquery2['default'])(".leccion_recomendacion").val(recomendacion);
    (0, _jquery2['default'])(".id_estudiante_leccion").val(id_alumno);

    _jquery2['default'].get('/prueba/' + prueba).done(function (prueba) {
        console.log(prueba);
        for (var i = 0; i < prueba.length; i++) {
            var type = selectType(prueba[i]);
            var tpl = TemplatePrueba(prueba[i], type);
            (0, _jquery2['default'])(".LeccionCalificarBody").append(tpl);
            if (prueba[i].type == "C") completar(prueba[i]._id, prueba[i].numero, id_alumno);
            if (prueba[i].type != "C") selecionar(prueba[i]._id, prueba[i].numero, id_alumno);

            (0, _jquery2['default'])(".LeccionCalificar").fadeIn();
            (0, _jquery2['default'])("#LeccionCalificarHeader-alumno").val(alumno);
        }
    });
}

function TemplatePrueba(data, type) {
    var tpl = '<div>\n        <p class="de_completar">' + type + '</p>\n        <p>\n            <span class="count__leccion">' + data.numero + '</span>\n            <span class="pregunta_leccion_text">' + data.descripcion + '</span>\n            <input type="hidden" value="' + data._id + '" />\n        </p>\n        <div class="respuesta-container-' + data.numero + ' form-checks"></div>\n    </div>';
    return tpl;
}
function selecionar(id, count, alumno) {
    _jquery2['default'].get('/posibilidades/' + id).done(function (posibilidades) {
        (0, _jquery2['default'])('.respuesta-container-' + count).append('<ul class="lista-posibi-' + count + '"></ul>');

        for (var i = 0; i < posibilidades.length; i++) {
            if (posibilidades[i].type == "S") templateCheckType(posibilidades[i], count, "radio", alumno);
            if (posibilidades[i].type == "M") templateCheckType(posibilidades[i], count, "checkbox", alumno);
        }
    });
}

function templateCheckType(data, count, type, alumno) {
    var item = '<li style="margin-bottom:.1em;list-style:none">\n        <input type=' + type + ' name="simple' + count + '" value="' + data.descripcion + '"\n            disabled="true"  style="float:none" id="' + data._id + '" />\n        <label for="' + data._id + '">' + data.descripcion + '</label>\n    </li>';
    (0, _jquery2['default'])('.lista-posibi-' + count).append(item);
    selectRespuestas(data.rel_pregunta, data._id, alumno);
}

function selectRespuestas(id, idItem, alumno) {
    _jquery2['default'].get('/respuesta/' + id + '/' + alumno).done(function (respuestas) {

        for (var i = 0; i < respuestas.length; i++) {
            if (idItem == respuestas[i].descripcion) {
                console.log("cuantos");
                document.getElementById('' + idItem).checked = true;
            }
        }
    });
}

function completar(id, count, alumno) {
    _jquery2['default'].get('/respuesta/' + id + '/' + alumno).done(function (respuesta) {

        for (var i = 0; i < respuesta.length; i++) {
            var tpl = '<p class="md-respuesta">' + respuesta[i].descripcion + '</p>';
            (0, _jquery2['default'])('.respuesta-container-' + count).append(tpl);
        }
    });
}

exports['default'] = CalificarLeccion;
module.exports = exports['default'];

},{"jquery":21}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
   value: true
});
var validarDocumento = function validarDocumento(numero) {

   //  numero = document.querySelector('.cedula').value;
   /* alert(numero); */

   var suma = 0;
   var residuo = 0;
   var pri = false;
   var pub = false;
   var nat = false;
   var numeroProvincias = 22;
   var modulo = 11;

   /* Verifico que el campo no contenga letras */
   var ok = 1;
   for (var i = 0; i < numero.length && ok == 1; i++) {
      var n = parseInt(numero.charAt(i));
      if (isNaN(n)) ok = 0;
   }
   if (ok == 0) {
      alert("No puede ingresar caracteres en el número");
      return false;
   }

   if (numero.length < 10) {
      alert("El número ingresado no es válido");
      return false;
   }

   /* Los primeros dos digitos corresponden al codigo de la provincia */
   var provincia = numero.substr(0, 2);
   if (provincia < 1 || provincia > numeroProvincias) {
      alert("El código de la provincia (dos primeros dígitos) es inválido");
      return false;
   }

   /* Aqui almacenamos los digitos de la cedula en variables. */
   var d1 = numero.substr(0, 1);
   var d2 = numero.substr(1, 1);
   var d3 = numero.substr(2, 1);
   var d4 = numero.substr(3, 1);
   var d5 = numero.substr(4, 1);
   var d6 = numero.substr(5, 1);
   var d7 = numero.substr(6, 1);
   var d8 = numero.substr(7, 1);
   var d9 = numero.substr(8, 1);
   var d10 = numero.substr(9, 1);

   /* El tercer digito es: */
   /* 9 para sociedades privadas y extranjeros   */
   /* 6 para sociedades publicas */
   /* menor que 6 (0,1,2,3,4,5) para personas naturales */

   if (d3 == 7 || d3 == 8) {
      alert("El tercer dígito ingresado es inválido!");
      return false;
   }

   /* Solo para personas naturales (modulo 10) */
   if (d3 < 6) {
      var nat = true;
      var p1 = d1 * 2;if (p1 >= 10) p1 -= 9;
      var p2 = d2 * 1;if (p2 >= 10) p2 -= 9;
      var p3 = d3 * 2;if (p3 >= 10) p3 -= 9;
      var p4 = d4 * 1;if (p4 >= 10) p4 -= 9;
      var p5 = d5 * 2;if (p5 >= 10) p5 -= 9;
      var p6 = d6 * 1;if (p6 >= 10) p6 -= 9;
      var p7 = d7 * 2;if (p7 >= 10) p7 -= 9;
      var p8 = d8 * 1;if (p8 >= 10) p8 -= 9;
      var p9 = d9 * 2;if (p9 >= 10) p9 -= 9;
      var modulo = 10;
   }

   /* Solo para sociedades publicas (modulo 11) */
   /* Aqui el digito verficador esta en la posicion 9, en las otras 2 en la pos. 10 */
   else if (d3 == 6) {
         var pub = true;
         p1 = d1 * 3;
         p2 = d2 * 2;
         p3 = d3 * 7;
         p4 = d4 * 6;
         p5 = d5 * 5;
         p6 = d6 * 4;
         p7 = d7 * 3;
         p8 = d8 * 2;
         p9 = 0;
      }

      /* Solo para entidades privadas (modulo 11) */
      else if (d3 == 9) {
            pri = true;
            p1 = d1 * 4;
            p2 = d2 * 3;
            p3 = d3 * 2;
            p4 = d4 * 7;
            p5 = d5 * 6;
            p6 = d6 * 5;
            p7 = d7 * 4;
            p8 = d8 * 3;
            p9 = d9 * 2;
         }

   suma = p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;
   residuo = suma % modulo;

   /* Si residuo=0, dig.ver.=0, caso contrario 10 - residuo*/
   var digitoVerificador = residuo == 0 ? 0 : modulo - residuo;

   /* ahora comparamos el elemento de la posicion 10 con el dig. ver.*/
   if (pub == true) {
      if (digitoVerificador != d9) {
         alert("El ruc de la empresa del sector público es incorrecto.");

         return false;
      }
      /* El ruc de las empresas del sector publico terminan con 0001*/
      if (numero.substr(9, 4) != '0001') {
         alert("El ruc de la empresa del sector público debe terminar con 0001");
         return false;
      }
   } else if (pri == true) {
      if (digitoVerificador != d10) {
         alert("El ruc de la empresa del sector privado es incorrecto.");
         return false;
      }
      if (numero.substr(10, 3) != '001') {
         alert("El ruc de la empresa del sector privado debe terminar con 001");
         return false;
      }
   } else if (nat == true) {
      if (digitoVerificador != d10) {
         alert("El número de cédula de la persona natural es incorrecto");
         return false;
      }
      if (numero.length > 10 && numero.substr(10, 3) != '001') {
         alert("El ruc de la persona natural debe terminar con 001");
         return false;
      }
   }
   return true;
};

function validar(e) {
   // 1
   tecla = document.all ? e.keyCode : e.which; // 2
   if (tecla == 8) return true; // 3
   patron = /[A-Za-z\s]/; // 4
   te = String.fromCharCode(tecla); // 5
   return patron.test(te); // 6
}

function validarNumeros(e) {
   // 1

   tecla = document.all ? e.keyCode : e.which; // 2
   if (tecla == 9) return true; // backspace

   if (tecla == 8) return true; // backspace
   if (tecla == 109) return true; // menos
   if (tecla == 110) return true; // punto
   if (tecla == 190) return true; // guion
   if (e.ctrlKey && tecla == 86) {
      return true;
   }; //Ctrl v
   if (e.ctrlKey && tecla == 67) {
      return true;
   }; //Ctrl c
   if (e.ctrlKey && tecla == 88) {
      return true;
   }; //Ctrl x
   if (tecla >= 96 && tecla <= 105) {
      return true;
   } //numpad

   patron = /[0-9]/; // patron

   te = String.fromCharCode(tecla);
   return patron.test(te); // prueba
}

exports["default"] = validarDocumento;
module.exports = exports["default"];

},{}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
function cronometro() {
	carga();
	var cronometro;

	function detenerse() {
		clearInterval(cronometro);
	}

	function carga() {
		var contador_s = 0;
		var contador_m = 0;
		var s = document.getElementById("segundos");
		var m = document.getElementById("minutos");

		cronometro = setInterval(function () {
			if (contador_s == 60) {
				contador_s = 0;
				contador_m++;
				m.innerHTML = contador_m;

				if (contador_m == 60) {
					contador_m = 0;
				}
			}

			s.innerHTML = contador_s;
			contador_s++;
		}, 1000);
	}
}

exports["default"] = cronometro;
module.exports = exports["default"];

},{}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _calificar_leccion = require('./calificar_leccion');

var _calificar_leccion2 = _interopRequireDefault(_calificar_leccion);

var CursoAdmin = function CursoAdmin() {

    var $listaEstudiantes = (0, _jquery2['default'])("#lista__estudinate-btn");
    var $misNotas = (0, _jquery2['default'])("#mis__notas-btn");
    var $cerrarNotas = (0, _jquery2['default'])(".cerrar-notas");
    var $cerrarListado = (0, _jquery2['default'])(".cerrar_listado");
    var $boletin_grid = (0, _jquery2['default'])(".boletin-grid");

    $listaEstudiantes.on("click", listaEstudiantes);
    $misNotas.on("click", misNotas);
    $cerrarNotas.on("click", cerrarNotas);
    $cerrarListado.on("click", cerrarListado);
    $boletin_grid.on("click", boletinGrid);
};

function boletinGrid(e) {
    var type = e.target.dataset.type;
    var id = e.target.dataset.id;

    _jquery2['default'].get('/listado/trabajos/' + type + '/' + id).done(function (data) {
        console.log(data);
        var template = '<article class="BoletinDescriptionTask">\n        <h2>' + type + '</h2>\n        <button class="BoletinDescriptionTask-close">\n            <i class="">X</i>\n        </button>\n        <table class="bolentin-listable">\n            <thead class="table-thead-bole">\n                <tr>\n                    <th>Clase</th>\n                    <th>Materia</th>\n                    <th>Tiempo</th>\n                    <th>Nota</th>\n                </tr>\n            </thead>\n            <tbody class="tbody-list"></tbody>\n        </table>\n    </article>';
        (0, _jquery2['default'])("body").append(template);

        (0, _jquery2['default'])(".BoletinDescriptionTask-close").on("click", function () {
            (0, _jquery2['default'])(".BoletinDescriptionTask").remove();
        });

        if (type == "tai") {
            var theadl = '<tr>\n            <th>Clase</th><th>Materia</th><th>Deber</th><th>Nota</th><th>Accion</th>\n        </tr>';
            (0, _jquery2['default'])('.table-thead-bole').html(theadl);
            (0, _jquery2['default'])(".tbody-list").append(templateDeber(data));
        } else if (type == "lecciones") {
            var theadl = '<tr>\n            <th>Clase</th><th>Recomendacion</th><th>Nota</th><th>Accion</th>\n        </tr>';
            (0, _jquery2['default'])('.table-thead-bole').html(theadl);
            (0, _jquery2['default'])(".tbody-list").append(templateLecciones(data));
        } else {
            (0, _jquery2['default'])(".tbody-list").append(templateTask(data));
        }

        (0, _jquery2['default'])(".ver-leccion-course").on("click", onSeeLeccion);
    });
}

function onCloseLecc() {
    (0, _jquery2['default'])(".LeccionLayoutCourse").fadeOut();
    setTimeout(function () {
        (0, _jquery2['default'])(".LeccionLayoutCourse").remove();
    }, 1000);
}

function onSeeLeccion(ev) {
    var leccion = ev.currentTarget.dataset;
    (0, _jquery2['default'])("body").append(templateLeccionHTML(leccion));
    (0, _jquery2['default'])(".LeccionLayoutCourse-cerrar").on("click", onCloseLecc);
    console.log(leccion);

    _jquery2['default'].get('/prueba/' + leccion.prueba).done(function (prueba) {

        console.log(prueba);
        for (var i = 0; i < prueba.length; i++) {
            var type = selectTypeCour(prueba[i]);
            var tpl = TemplatePruebaCour(prueba[i], type);
            (0, _jquery2['default'])(".LeccionBodyQuestions").append(tpl);
            if (prueba[i].type == "C") completarCur(prueba[i]._id, prueba[i].numero, leccion.id_alumno);
            if (prueba[i].type != "C") selecionarCour(prueba[i]._id, prueba[i].numero, leccion.id_alumno);
        }

        (0, _jquery2['default'])(".LeccionLayoutCourse").fadeIn();
    });
}

// Leccion Preguntas
function selectTypeCour(data) {
    var type = "";

    if (data.type == "C") type = "DE COMPLETAR";else if (data.type == "S") type = "DE SELECCION SIMPLE";else if (data.type == "M") type = "DE SELECCION MULTIPLE";

    return type;
}
function TemplatePruebaCour(data, type) {
    var tpl = '<div>\n        <p class="de_completar">' + type + '</p>\n        <p>\n            <span class="count__leccion">' + data.numero + '</span>\n            <span class="pregunta_leccion_text">' + data.descripcion + '</span>\n            <input type="hidden" value="' + data._id + '" />\n        </p>\n        <div class="respuesta-container-' + data.numero + ' form-checks"></div>\n    </div>';
    return tpl;
}
function completarCur(id, count, alumno) {
    _jquery2['default'].get('/respuesta/' + id + '/' + alumno).done(function (respuesta) {

        for (var i = 0; i < respuesta.length; i++) {
            var tpl = '<p class="md-respuesta">' + respuesta[i].descripcion + '</p>';
            (0, _jquery2['default'])('.respuesta-container-' + count).append(tpl);
        }
    });
}
function selecionarCour(id, count, alumno) {
    _jquery2['default'].get('/posibilidades/' + id).done(function (posibilidades) {
        (0, _jquery2['default'])('.respuesta-container-' + count).append('<ul class="lista-posibi-' + count + '"></ul>');

        for (var i = 0; i < posibilidades.length; i++) {
            if (posibilidades[i].type == "S") templateCheckTypeCour(posibilidades[i], count, "radio", alumno);
            if (posibilidades[i].type == "M") templateCheckTypeCour(posibilidades[i], count, "checkbox", alumno);
        }
    });
}
function templateCheckTypeCour(data, count, type, alumno) {
    var item = '<li style="margin-bottom:.1em;list-style:none">\n        <input type=' + type + ' name="simple' + count + '" value="' + data.descripcion + '"\n            disabled="true"  style="float:none" id="' + data._id + '" />\n        <label for="' + data._id + '">' + data.descripcion + '</label>\n    </li>';
    (0, _jquery2['default'])('.lista-posibi-' + count).append(item);
    selectRespuestasCour(data.rel_pregunta, data._id, alumno);
}

function selectRespuestasCour(id, idItem, alumno) {
    _jquery2['default'].get('/respuesta/' + id + '/' + alumno).done(function (respuestas) {

        for (var i = 0; i < respuestas.length; i++) {
            if (idItem == respuestas[i].descripcion) {
                console.log("cuantos");
                document.getElementById('' + idItem).checked = true;
            }
        }
    });
}
// Fin Leccion Preguntas

function templateLeccionHTML(leccion) {
    return '<section class=\'LeccionLayoutCourse\'>\n        <header>\n            <div class="header-info">\n                <h3>Leccion de ' + leccion.mate + '</h3>\n                <h4>Clase de ' + leccion.clase + '</h4>\n            </div>\n            <div class="header-estud">\n                <p class="header-estud--label">Estudiante:</p>\n                <p class="header-estud--name">' + leccion.alum + '</p>\n            </div>\n             <div class="header-nota">\n                <p class="header-nota--label">Nota:</p>\n                <p class="header-nota--name">' + leccion.nota + '</p>\n            </div>\n            <div class="header-recome">\n                <p class="header-recome--label">Recomendacion:</p>\n                <p class="header-recome--name">' + leccion.recom + '</p>\n            </div>\n        </header>\n        <article class="LeccionBodyQuestions"></article>\n        <div class="center-flex">\n            <button class="LeccionLayoutCourse-cerrar">Cerrar</button>\n        </div>\n    </section>';
}

function templateTask(data) {
    var li = "";
    for (var i in data) {
        var item = data[i];
        li += '<tr class="item-boletin-task">\n            <td>' + item.rel_clase.nameClass + '</td>\n            <td>' + item.rel_materia.subject + '</td>\n            <td>' + item.tiempo + '</td>\n            <td>' + item.nota + '</td>\n        </tr>';
    }
    return li;
}

function templateDeber(data) {
    var li = "";
    for (var i in data) {
        var item = data[i];
        li += '<tr class="item-boletin-task">\n            <td>' + item.rel_clase.nameClass + '</td>\n            <td>' + item.rel_materia.subject + '</td>\n            <td>' + item.name_task + '</td>\n            <td>' + item.nota + '</td>\n            <td><a class="descragar-item" href="/descargar/' + item.file + '">Descagar</a></td>\n        </tr>';
    }
    return li;
}

function templateLecciones(data) {
    var li = "";
    for (var i in data) {
        var item = data[i];
        li += '<tr class="item-boletin-task">\n            <td>' + item.rel_leccion.rel_clase.nameClass + '</td>\n            <td>' + item.recomendacion + '</td>\n            <td>' + item.nota + '</td>\n            <td>\n                <button class="ver-leccion-course" data-nota="' + item.nota + '" data-prueba="' + item.rel_leccion._id + '"\n                 data-recom="' + item.recomendacion + '" data-alum="' + item.rel_alumno.name + '" data-id_alumno="' + item.rel_alumno._id + '"\n                 data-clase="' + item.rel_leccion.rel_clase.nameClass + '" data-mate="' + item.rel_leccion.rel_materia.subject + '">\n                Ver</button>\n            </td>\n        </tr>';
    }
    return li;
}

function listaEstudiantes(e) {
    var id = e.target.dataset.id;

    _jquery2['default'].get('/listado/alumnos/' + id).done(function (estudiantes) {
        for (var i = 0; i < estudiantes.length; i++) {
            var template = TemplateEstudiante(estudiantes[i]);
            (0, _jquery2['default'])(".ListadoEstudiantesLayout").append(template);
        }
    });
    (0, _jquery2['default'])("#lista-estudiantes").fadeIn();
}

function misNotas(e) {
    var id = e.target.dataset.id;
    (0, _jquery2['default'])("#notas-paper").fadeIn();

    _jquery2['default'].get('/bolentin/count/' + id).done(function (data) {
        console.log(data);
        for (var j in data) {
            (0, _jquery2['default'])('.' + j + '-boletin').html(data[j]);
        }
    });
}

function cerrarNotas() {
    (0, _jquery2['default'])("#notas-paper").fadeOut();
    // $(".BoletinLayout").empty()
}

function cerrarListado() {
    (0, _jquery2['default'])("#lista-estudiantes").fadeOut();
    (0, _jquery2['default'])(".ListadoEstudiantesLayout").empty();
}

function TemplateEstudiante(estudiante) {
    var tpl = '<div class="ListadoEstudiante">\n        <img src="' + estudiante.avatar + '" width="40" height="40" class="ListadoEstudiantes-avatar" />\n        <p class="ListadoEstudiantes-name">' + estudiante.name + '</p>\n        <p class="ListadoEstudiantes-cedula">' + estudiante.cedula + '</p>\n        <div>\n            <a href="/estudiante/editar/' + estudiante._id + '" class="edit-estudiante">Editar</a>\n            <button data-id="' + estudiante._id + '" class="eliminar-estudiante">Eliminar</button>\n        </div>\n    </div>';
    return tpl;
}

exports['default'] = CursoAdmin;
module.exports = exports['default'];

},{"./calificar_leccion":25,"jquery":21}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var socket = io();

var DeleteAdmin = function DeleteAdmin() {

    var $DeleteSubject = (0, _jquery2['default'])(".eliminar-subject");
    var $eliminarProfesor = (0, _jquery2['default'])(".eliminar-profesor");
    var $eliminarCurso = (0, _jquery2['default'])(".eliminar-curso");

    $DeleteSubject.on("click", onDeleteSubject);
    $eliminarCurso.on("click", onDeleteCurso);
    $eliminarProfesor.on("click", onDeleteProfesor);
};

function onDeleteSubject(e) {
    var id = e.target.dataset.id;
    (0, _jquery2['default'])('#' + id).remove();
    socket.emit("delete::materia", id);
    alert("Se ha eliminado con exito....");
}

function onDeleteCurso(e) {
    var id = e.target.dataset.id;
    (0, _jquery2['default'])('#' + id).remove();
    socket.emit("delete::curso", id);
    alert("Se ha eliminado con exito....");
}

function onDeleteProfesor(e) {
    var id = e.target.dataset.id;
    (0, _jquery2['default'])('#' + id).remove();
    socket.emit("delete::profesor", id);
    alert("Se ha eliminado con exito....");
}

exports['default'] = DeleteAdmin;
module.exports = exports['default'];

},{"jquery":21}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var socket = io();

var Grupos = function Grupos() {
    var $delete_curso = (0, _jquery2['default'])(".delete-curso");
    var $delete_paralelo = (0, _jquery2['default'])(".delete-paralelo");

    $delete_curso.on("click", delete_curso);
    $delete_paralelo.on("click", delete_paralelo);
};

var delete_curso = function delete_curso(e) {
    var id = e.target.dataset.id;
    (0, _jquery2['default'])('#' + id).remove();
    socket.emit("delete::curso::grupo", id);
    alert("Se ha eliminado con exito....");
};

var delete_paralelo = function delete_paralelo(e) {
    var id = e.target.dataset.id;
    (0, _jquery2['default'])('#' + id).remove();
    socket.emit("delete::paralelo::grupo", id);
    alert("Se ha eliminado con exito....");
};

exports['default'] = Grupos;
module.exports = exports['default'];

},{"jquery":21}],31:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _domify = require('domify');

var _domify2 = _interopRequireDefault(_domify);

var _streaming = require('./streaming');

var _streaming2 = _interopRequireDefault(_streaming);

var _ahorcado = require('./ahorcado');

var _ahorcado2 = _interopRequireDefault(_ahorcado);

var _buscamina = require('./buscamina');

var _buscamina2 = _interopRequireDefault(_buscamina);

var _trestis = require('./trestis');

var _trestis2 = _interopRequireDefault(_trestis);

var _cronometro = require('./cronometro');

var _cronometro2 = _interopRequireDefault(_cronometro);

var _pizarra = require('./pizarra');

var _pizarra2 = _interopRequireDefault(_pizarra);

var _tarea = require('./tarea');

var _tarea2 = _interopRequireDefault(_tarea);

var _calificar = require('./calificar');

var _calificar2 = _interopRequireDefault(_calificar);

var _leccion = require('./leccion');

var _leccion2 = _interopRequireDefault(_leccion);

var _validate = require('./validate');

var _validate2 = _interopRequireDefault(_validate);

var _calificar_leccion = require('./calificar_leccion');

var _calificar_leccion2 = _interopRequireDefault(_calificar_leccion);

var _deletAdmin = require('./delet-admin');

var _deletAdmin2 = _interopRequireDefault(_deletAdmin);

var _cursosAdmin = require('./cursos-admin');

var _cursosAdmin2 = _interopRequireDefault(_cursosAdmin);

var _opciones = require('./opciones');

var _opciones2 = _interopRequireDefault(_opciones);

var _grupos = require('./grupos');

var _grupos2 = _interopRequireDefault(_grupos);

var _reportes = require('./reportes');

var _reportes2 = _interopRequireDefault(_reportes);

var _templatesBoxHbs = require('./templates/box.hbs');

var _templatesBoxHbs2 = _interopRequireDefault(_templatesBoxHbs);

var _templatesRespuestasHbs = require('./templates/respuestas.hbs');

var _templatesRespuestasHbs2 = _interopRequireDefault(_templatesRespuestasHbs);

var _templatesFormHbs = require('./templates/form.hbs');

var _templatesFormHbs2 = _interopRequireDefault(_templatesFormHbs);

var _templatesItemHbs = require('./templates/item.hbs');

var _templatesItemHbs2 = _interopRequireDefault(_templatesItemHbs);

var _templatesListHbs = require('./templates/list.hbs');

var _templatesListHbs2 = _interopRequireDefault(_templatesListHbs);

var _templatesFlagClassHbs = require('./templates/flagClass.hbs');

var _templatesFlagClassHbs2 = _interopRequireDefault(_templatesFlagClassHbs);

var _templatesPizarraHbs = require('./templates/pizarra.hbs');

var _templatesPizarraHbs2 = _interopRequireDefault(_templatesPizarraHbs);

var _templatesDeberHbs = require('./templates/deber.hbs');

var _templatesDeberHbs2 = _interopRequireDefault(_templatesDeberHbs);

var _templatesGamesAhorcadoHbs = require('./templates/games/ahorcado.hbs');

var _templatesGamesAhorcadoHbs2 = _interopRequireDefault(_templatesGamesAhorcadoHbs);

var _templatesGamesBuscaminaHbs = require('./templates/games/buscamina.hbs');

var _templatesGamesBuscaminaHbs2 = _interopRequireDefault(_templatesGamesBuscaminaHbs);

var _templatesGamesTrestisHbs = require('./templates/games/trestis.hbs');

var _templatesGamesTrestisHbs2 = _interopRequireDefault(_templatesGamesTrestisHbs);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

// import ahorcado  from './games/ahorcado/juego.hbs'

(0, _reportes2['default'])();
var socket = io();
(0, _cursosAdmin2['default'])();
(0, _deletAdmin2['default'])();
(0, _validate2['default'])();
(0, _grupos2['default'])();

var chat = document.getElementById('chat');
addEventListener('load', initialize);

function initialize() {
  var loc = window.location;
  var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1).length;
  var room = window.location.pathname.substring(pathName);
  socket.emit("join::rom", room);
  (0, _calificar2['default'])(socket);
  (0, _leccion2['default'])(socket);
  (0, _calificar_leccion2['default'])(socket);
  (0, _opciones2['default'])(socket);

  socket.on("show::deber", function (data) {
    (0, _jquery2['default'])(".card_deber_card_name").html(data);
    (0, _jquery2['default'])(".card_deber_card").fadeIn();
  });

  (0, _jquery2['default'])(".card_deber_card_button").on("click", loadTask);

  function loadTask() {
    (0, _jquery2['default'])(".card_upload_task").fadeIn();
  }
  (0, _tarea2['default'])(socket);

  var opc = document.querySelector(".Opciones");

  document.querySelector("#aic").addEventListener("click", function () {
    alert("Se ha guardo con exito");
    if ((0, _jquery2['default'])("#task").val() == "tetris") {
      // var sonidoBorrar = document.getElementById("sonidoBorrar");
      // var sonidoLlego = document.getElementById("sonidoLlego");
      // console.log(sonidoLlego);
      // sonidoLlego.pause()
      // sonidoBorrar.pause()
    }

    var data = {
      tiempo: (0, _jquery2['default'])("#minutos").html() + ":" + (0, _jquery2['default'])("#segundos").html(),
      materia: (0, _jquery2['default'])("#materia").val(),
      profesor: (0, _jquery2['default'])("#profesor").val(),
      clase: (0, _jquery2['default'])("#clase_id").val(),
      task: (0, _jquery2['default'])("#task").val(),
      data: "AIC"
    };

    socket.emit("aic", data);
    (0, _jquery2['default'])(".wrap-juego").empty();
    (0, _jquery2['default'])("#minutos").html("0");
    (0, _jquery2['default'])("#segundos").html("0");
    (0, _jquery2['default'])(".card-play").fadeOut();
  }, false);

  if (opc != null) {
    opc.addEventListener("click", function (event) {
      document.querySelector(".card--opciones").style = "display:flex";
    });

    eventos();
  }

  socket.on("jugar::play", playToEst);

  socket.on("term::pizarra", function (data) {
    document.querySelector(".card-play").style = "display:none";
    (0, _jquery2['default'])(".wrap-juego").empty();
    (0, _jquery2['default'])("#PizarraLayout").fadeOut();
  });

  socket.on("pizarra", function (data) {
    (0, _pizarra2['default'])(socket);
    (0, _jquery2['default'])("#task").val("pizarra");
  });

  document.querySelector("#agc").addEventListener("click", function (e) {
    alert("Se ha guardodo con exito.");

    var data = {
      tiempo: (0, _jquery2['default'])(".cronometro-pizarra--minutos").html() + ":" + (0, _jquery2['default'])(".cronometro-pizarra--segundo").html(),
      curso: (0, _jquery2['default'])("#curso").val(),
      materia: (0, _jquery2['default'])("#materia").val(),
      profesor: (0, _jquery2['default'])("#profesor").val(),
      clase: (0, _jquery2['default'])("#clase_id").val(),
      task: "pizarra"
    };
    socket.emit("agc", data);
  }, false);

  boxTmpl();
  streamingCameraTeacher();
}

function playToEst(data) {
  console.log(data);
  document.querySelector(".title-play").innerHTML = data.play;
  document.querySelector(".card-play").style = "display:block";
  document.querySelector("#aic").style = "display:block";
  document.querySelector("#agc").style = "display:none";
  var wrap = document.querySelector(".wrap-juego");

  if (data.play == "ahorcado") {
    var tpl = (0, _templatesGamesAhorcadoHbs2['default'])();
    wrap.appendChild((0, _domify2['default'])(tpl));
    (0, _ahorcado2['default'])();
    (0, _jquery2['default'])("#task").val("ahorcado");
    (0, _jquery2['default'])("#minutos").html("0");
    (0, _jquery2['default'])("#segundos").html("0");
    (0, _jquery2['default'])(".card-play").css("height", "94.1vh");
    (0, _jquery2['default'])(".card-play").css("width", "54.1em");
    (0, _cronometro2['default'])();
  }
  if (data.play == "buscamina") {
    var tpl = (0, _templatesGamesBuscaminaHbs2['default'])();
    wrap.appendChild((0, _domify2['default'])(tpl));
    (0, _buscamina2['default'])();
    (0, _jquery2['default'])("#task").val("buscamina");
    (0, _jquery2['default'])("#minutos").html("0");
    (0, _jquery2['default'])("#segundos").html("0");
    (0, _cronometro2['default'])();
  }
  if (data.play == "tretis") {
    var tpl = (0, _templatesGamesTrestisHbs2['default'])();
    wrap.appendChild((0, _domify2['default'])(tpl));
    (0, _trestis2['default'])();
    (0, _jquery2['default'])("#task").val("tetris");
    (0, _jquery2['default'])("#minutos").html("0");
    (0, _jquery2['default'])("#segundos").html("0");
    (0, _cronometro2['default'])();
  }
}

function streamingCameraTeacher() {
  var loc = window.location;
  var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
  console.log("pathName", pathName);

  if (pathName === '/lessons/') {
    console.log("pathName cumplio", pathName);
    (0, _streaming2['default'])(socket);
    chatPreguntasLoad();
    var deber = (0, _jquery2['default'])(".deber_enviado").val();

    if (deber.length > 0 && deber !== "undefined") {
      var id_user = (0, _jquery2['default'])("#estudiante_id").val();
      var id_clase = (0, _jquery2['default'])("#clase_id_us").val();

      _jquery2['default'].get('/envie/deber/' + id_user + '/' + id_clase).done(function (data) {
        if (data == 0) {
          (0, _jquery2['default'])(".card_deber_card_name").html(deber);
          (0, _jquery2['default'])(".card_deber_card").fadeIn();
        }
      });
    }
  }
  if (pathName.startsWith('/lessons/')) {
    (function () {

      var rs = new window.webkitSpeechRecognition();
      var question = document.getElementById("question");

      rs.continuous = true;
      rs.interimResults = true;
      rs.lang = "es";
      rs.start();

      rs.onresult = function (event) {

        for (var i = event.resultIndex; i < event.results.length; i++) {
          console.log("ok");

          if (event.results[i].isFinal) {
            var valor = event.results[i][0].transcript;
            console.log("esperando", valor);

            if (valor == "mensaje" || valor == " mensaje") {
              console.log("voz", valor);
              question.textContent += event.results[i][0].transcript;
            }
            if (valor == "enviar" || valor == " enviar") {
              socket.emit("send::question", question.textContent);
              question.textContent = "";
            }
          }
        }
      }; //onresult
    })();
  }
}

function boxTmpl() {
  var box = (0, _templatesBoxHbs2['default'])();
  var respuesta = (0, _templatesRespuestasHbs2['default'])();
  chat.appendChild((0, _domify2['default'])(box));
  chat.appendChild((0, _domify2['default'])(respuesta));
  formularioTmpl();
  listTmpl();
  var atras = document.querySelector(".atras");
  atras.addEventListener("click", onAtras);
}

function formularioTmpl() {
  var boxId = document.getElementById("box");
  var form = (0, _templatesFormHbs2['default'])();
  boxId.appendChild((0, _domify2['default'])(form));
  var btnQuestion = document.getElementById("btnQuestion");

  btnQuestion.addEventListener('click', sendQuestion);
}

var listTmpl = function listTmpl() {
  var boxId = document.getElementById("box");
  var list = (0, _templatesListHbs2['default'])();
  boxId.appendChild((0, _domify2['default'])(list));
  var listQuestion = document.getElementById("listQuestion");
};

var sendQuestion = function sendQuestion(e) {
  e.preventDefault();
  var question = document.getElementById("question").value;
  var bitacora = document.getElementById("clase_id").value;
  if (question == "") alert("Debe ingresar un preguta");else {
    socket.emit("send::question", { "question": question, "bitacora": bitacora });
    document.getElementById("question").value = "";
  }
};

socket.on("question::recieve", addQuestion);

//< menor que || > mayor que
function addQuestion(question) {
  console.log(question);
  var q = (0, _templatesItemHbs2['default'])({ question: question, count: 0 });
  listQuestion.appendChild((0, _domify2['default'])(q));

  var like = document.querySelectorAll(".like");
  var noLike = document.querySelectorAll('.no-like');
  var respues = document.querySelectorAll(".responder-pregunta");

  for (var i = 0; i < like.length; i++) {
    like[i].addEventListener("click", plus);
  }for (var i = 0; i < noLike.length; i++) {
    noLike[i].addEventListener("click", minus);
  }for (var i = 0; i < respues.length; i++) {
    respues[i].addEventListener("click", responder);
  }
}

function plus(e) {
  e.preventDefault();
  var p = this.textContent;
  ++p;
  this.textContent = p;
}

function minus(e) {
  e.preventDefault();
  var m = this.textContent;
  ++m;
  this.textContent = m;
}

function countdown(date_class, id) {
  var fecha = date_class;
  var hoy = new Date();
  var dias = 0;
  var horas = 0;
  var minutos = 0;
  var segundos = 0;

  if (fecha > hoy) {
    var diferencia = (fecha.getTime() - hoy.getTime()) / 1000;
    dias = Math.floor(diferencia / 86400);
    diferencia = diferencia - 86400 * dias;
    horas = Math.floor(diferencia / 3600);
    diferencia = diferencia - 3600 * horas;
    minutos = Math.floor(diferencia / 60);
    diferencia = diferencia - 60 * minutos;
    segundos = Math.floor(diferencia);

    if (dias < 10) dias = "0" + dias;
    if (horas < 10) horas = "0" + horas;
    if (minutos < 10) minutos = "0" + minutos;
    if (segundos < 10) segundos = "0" + segundos;

    document.querySelector('.dia-' + id + '-reloj').innerHTML = dias;
    document.querySelector('.hora-' + id + '-reloj').innerHTML = horas;
    document.querySelector('.minuto-' + id + '-reloj').innerHTML = minutos;
    document.querySelector('.segundo-' + id + '-reloj').innerHTML = segundos;

    if (dias > 0 || horas > 0 || minutos > 0 || segundos > 0) {
      setTimeout(function () {
        countdown(date_class, id);
      }, 1000);
    } else {
      (0, _jquery2['default'])(".aviso-ingresar").fadeIn();
    }
  } else {
    (0, _jquery2['default'])(".aviso-ingresar").fadeIn();
    document.querySelector('.dia-' + id + '-reloj').innerHTML = "00";
    document.querySelector('.hora-' + id + '-reloj').innerHTML = "00";
    document.querySelector('.minuto-' + id + '-reloj').innerHTML = "00";
    document.querySelector('.segundo-' + id + '-reloj').innerHTML = "00";
  }
}

var loc = window.location;
var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
var lenPathName = pathName.length;

if (pathName == '/course/') {
  (function () {
    var aviso = document.getElementById("aviso");

    var nameRoom = window.location.pathname.substring(lenPathName);
    socket.emit("class::flag", nameRoom);

    socket.on("flag", function (lessons) {
      var datetime = lessons.dateStart;
      var id_leccion = lessons._id;
      var fecha_clase = new Date(datetime);
      var dias = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
      var meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

      var dia = fecha_clase.getDate();
      var dia_number = fecha_clase.getDay();
      var dia_text = dias[dia_number];
      var mes_number = fecha_clase.getMonth();
      var mes = meses[mes_number];

      if (dia < 10) dia = "0" + dia;

      var fecha = { dia: dia, semana: dia_text, mes: mes };
      var flagClassTpl = (0, _templatesFlagClassHbs2['default'])({ lessons: lessons, fecha: fecha, id_leccion: id_leccion });
      aviso.appendChild((0, _domify2['default'])(flagClassTpl));

      countdown(fecha_clase, id_leccion);
    });
  })();
}

if (location.pathname == "/teacher" || location.pathname == "/teacher/") {
  var aviso_teacher = document.getElementById("aviso_teacher");
  _jquery2['default'].get("/api/clases/teacher").done(function (clases) {
    for (var clase in clases) {
      var lessons = clases[clase];
      var id_leccion = lessons._id;
      var datetime = lessons.dateStart;
      var fecha_clase = new Date(datetime);
      var dias = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
      var meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

      var dia = fecha_clase.getDate();
      var dia_number = fecha_clase.getDay();
      var dia_text = dias[dia_number];
      var mes_number = fecha_clase.getMonth();
      var mes = meses[mes_number];

      if (dia < 10) dia = "0" + dia;

      var fecha = { dia: dia, semana: dia_text, mes: mes };
      var flagClassTpl = (0, _templatesFlagClassHbs2['default'])({ lessons: lessons, fecha: fecha, id_leccion: id_leccion });
      aviso_teacher.appendChild((0, _domify2['default'])(flagClassTpl));
      countdown(fecha_clase, id_leccion);
    }
  });
}

function bloquear() {
  var aho = document.querySelector(".ahorcado");
  var tret = document.querySelector(".tretis");
  var busa = document.querySelector(".buscamina");
  aho.disabled = true;
  aho.style = "cursor:no-drop";
  tret.disabled = true;
  tret.style = "cursor:no-drop";
  busa.disabled = true;
  busa.style = "cursor:no-drop";
}

function eventos() {
  document.querySelector(".ahorcado").addEventListener("click", function (event) {
    bloquear();
    alert("El estudiante a empezado a jugar ahorcado");
    socket.emit("play", { "play": "ahorcado" });
  });

  document.querySelector(".tretis").addEventListener("click", function (event) {
    bloquear();
    alert("El estudiante a empezado a jugar tretis");
    socket.emit("play", { "play": "tretis" });
  });

  document.querySelector(".pizarra").addEventListener("click", function (event) {
    var piza = document.querySelector(".pizarra");
    piza.style = "cursor:no-drop";
    piza.disabled = true;
    alert("El estudiante a empezado a jugar la pizarra");
    socket.emit("play", { "play": "pizarra" });
  });

  document.querySelector(".buscamina").addEventListener("click", function (event) {
    bloquear();
    alert("El estudiante a empezado a jugar buscamina");
    socket.emit("play", { "play": "buscamina" });
  });
}

function chatPreguntasLoad() {
  var bitacora = document.getElementById("clase_id").value;
  _jquery2['default'].get('/preguntas/chat/' + bitacora).done(function (preguntas) {
    for (var i = 0; i < preguntas.length; i++) {
      var preg = preguntas[i];
      var q = (0, _templatesItemHbs2['default'])({ question: preg });
      listQuestion.appendChild((0, _domify2['default'])(q));
      count__questions(preg._id);
      var respuesta = document.querySelectorAll(".responder-pregunta");
      respuesta[i].addEventListener("click", responder);
    }
  });
}

function count__questions(id) {
  console.log(id);
  _jquery2['default'].get('/respuestas/count/' + id).done(function (respuestas) {
    (0, _jquery2['default'])('.count_repuesta span[data-id="' + id + '"]').html(respuestas.count);
  });
}

function responder(event) {
  var id = event.target.dataset.id;
  var pregunta = (0, _jquery2['default'])('.discussion-text p[data-id="' + id + '"]').html();
  document.querySelector("#form-responder").dataset.id = id;
  (0, _jquery2['default'])(".question__respuesta").html(pregunta);
  (0, _jquery2['default'])("#box").addClass("removeChat");
  (0, _jquery2['default'])("#respuestas").removeClass("none");
  var responder_pregunta = document.querySelector("#form-responder");
  responder_pregunta.addEventListener("click", onResponderPregunta, false);
  respuestasTemplate(id);
}

function onAtras() {
  (0, _jquery2['default'])("#box").removeClass("removeChat");
  (0, _jquery2['default'])("#respuestas").addClass("none");
  (0, _jquery2['default'])(".lista_respuesta").html("");
}

function onResponderPregunta(e) {
  var id = e.target.dataset.id;
  var respuesta = (0, _jquery2['default'])("#form-respuesta");
  var data = { "respuesta": respuesta.val(), "id_pregunta": id };
  socket.emit("responder::pregunta", data);
  onAtras();
  respuesta.val("");
}

socket.on("count::respuesta", onCount);

function onCount(data) {
  (0, _jquery2['default'])('.count_repuesta span[data-id="' + data.id + '"]').html(data.count);
}

function respuestasTemplate(id) {
  _jquery2['default'].get('/respuestas/preguntas/' + id).done(function (respuestas) {
    for (var i = 0; i < respuestas.length; i++) {
      var item = template_respuesta(respuestas[i]);
      (0, _jquery2['default'])(".lista_respuesta").prepend(item);
    }
  });
}

function template_respuesta(respuesta) {
  var item = '<div class="item" id="item-question" style="width: 86.1% !important;">\n    <div class="top-details">\n      <div class="user">\n        <span class="avatar-discussion">\n          <img src="' + respuesta.avatar + '" alt="' + respuesta.name + '" height="20" width="20">\n        </span>\n        <a class="author-discussion">' + respuesta.name + '</a>\n      </div>\n    </div>\n    <div class="discussion-text">\n      <p class="btn-q" data-id="' + respuesta._id + '">' + respuesta.respuesta + '</p>\n    </div>\n  </div>';
  return item;
}

// Terminar Clase
var terminar_clase = document.getElementById("terminar-clase");
terminar_clase.addEventListener("click", onTerminarClase);

function onTerminarClase(e) {
  e.preventDefault();
  var id = e.target.dataset.id;
  var curso = document.getElementById("curso").value;
  socket.emit("terminar::clase", { "id_clase": id, "curso": curso });
}

},{"./ahorcado":22,"./buscamina":23,"./calificar":24,"./calificar_leccion":25,"./cronometro":27,"./cursos-admin":28,"./delet-admin":29,"./grupos":30,"./leccion":32,"./opciones":33,"./pizarra":34,"./reportes":35,"./streaming":36,"./tarea":37,"./templates/box.hbs":38,"./templates/deber.hbs":39,"./templates/flagClass.hbs":40,"./templates/form.hbs":41,"./templates/games/ahorcado.hbs":42,"./templates/games/buscamina.hbs":43,"./templates/games/trestis.hbs":44,"./templates/item.hbs":45,"./templates/list.hbs":46,"./templates/pizarra.hbs":47,"./templates/respuestas.hbs":48,"./trestis":49,"./validate":50,"domify":1,"jquery":21}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function Leccion(socket) {

    var leccion = document.querySelector(".new-leccion");
    var new_preg = document.querySelector("#crear__pregunta");
    var add_leccion = document.querySelector("#add__leccion");
    var completar_new = document.querySelector("#LeccionPregunta-completar-add");
    var simple_new = document.querySelector("#LeccionPregunta-simple-add");
    var add_opc_simple = document.querySelector("#add__respuestas-simples");
    var boton_add_multi = document.querySelector("#LeccionBotonAdd-multiple");
    var add_compuestas_opt = document.querySelector("#add__respuestas-compuestas");
    var enviar_leccion = document.querySelector("#BotonEnviar-leccion");
    var terminar_leccion = document.querySelector("#TerminarLeccionBoton");
    var close_leccion = document.querySelector("#closeLeccion");
    onEvent();

    socket.on("emit::leccion", EmitLeccion);
    socket.on("term::class", onTermClass);

    function onTermClass(data) {
        var type = document.getElementById("type_user").value;
        if (type === "Teacher") location.pathname = "/teacher";else location.pathname = '/course/' + data.curso;
    }

    function onEvent() {
        leccion.addEventListener("click", newLeccion, false);
        new_preg.addEventListener("click", newQuestion, false);
        add_leccion.addEventListener("click", selectTypeQuestion, false);
        completar_new.addEventListener("click", completarNew, false);
        simple_new.addEventListener("click", simpleNew, false);
        add_opc_simple.addEventListener("click", opcionSimpleAdd, false);
        boton_add_multi.addEventListener("click", botonAddMultiple, false);
        add_compuestas_opt.addEventListener("click", addCompuetasOpt, false);
        enviar_leccion.addEventListener("click", enviarLeccion, false);
        terminar_leccion.addEventListener("click", TerminarLeccion, false);
        close_leccion.addEventListener("click", closeLeccion, false);
    }

    function closeLeccion() {
        (0, _jquery2['default'])("#card__leccion").fadeOut();
        (0, _jquery2['default'])(".container__pregunta-leccion").empty();
        (0, _jquery2['default'])("#crear__pregunta").attr("disabled", false);
        (0, _jquery2['default'])(".poppu-message").fadeOut();
    }

    function TemplateLeccion(data) {
        // let data = JSON.parse(data_leccion)
        (0, _jquery2['default'])("#leccion_id").val(data._id);
        for (var i = 0; i < data.num_question; i++) {
            var tests = data['test' + (i + 1)];
            var type = "";
            if (tests.type == "C") type = "DE COMPLETAR";
            if (tests.type == "S") type = "DE SELECCION SIMPLE";
            if (tests.type == "M") type = "DE SELECCION MULTIPLE";

            var tpl = '<div>\n        <p class="de_completar">' + type + '</p>\n        <p>\n          <span class="count__leccion">' + tests.count + '</span>\n          <span class="pregunta_leccion_text">' + tests.pregunta + '</span>\n          <input type="hidden" value="' + tests._id + '" />\n        </p>\n        <div id="resp_preg' + tests.count + '" class="form-checks"></div>\n        <input type="hidden" value="' + tests.type + '" />\n      </div>';
            document.querySelector(".LeccionPapperBody").innerHTML += tpl;
            var content_resp = document.querySelector('#resp_preg' + tests.count);

            if (tests.opciones != null) {
                for (var a = 0; a < tests.opciones.count_opciones; a++) {
                    var opciones = tests.opciones['posibilidad' + (a + 1)];
                    var con_resp = "";
                    if (tests.type == "S") {
                        con_resp = '<p>\n              <input type="radio" value="' + opciones._id + '" name="simple' + tests.count + '"\n                id="simple' + a + tests.count + '" />\n              <label for="simple' + a + tests.count + '">' + opciones.pregunta + '</label>\n            </p>';
                    }
                    if (tests.type == "M") {
                        con_resp = '<p>\n              <input type="checkbox" value="' + opciones._id + '" style="float:none" name="multiple' + tests.count + '" id="multiple' + a + tests.count + '"/>\n              <label for="multiple' + a + tests.count + '">' + opciones.pregunta + '</label>\n            </p>';
                    }
                    content_resp.innerHTML += con_resp;
                }
            } else content_resp.innerHTML = '<input type="text" class="input__leccion respuesta_leccion" placeholder="Ingres la respuesta"/>';
        }
    }

    function enviarLeccion() {
        var count = document.querySelector(".container__pregunta-leccion").childElementCount;
        if (count == 0) alert("No tiene preguntas");else {
            var data = getData();
            socket.emit("create::leccion", data);
            var lec = document.querySelector(".new-leccion");
            lec.disabled = true;
            lec.style = "cursor:no-drop";
            closeLeccion();
        }
    }

    function TerminarLeccion() {
        var questions = document.querySelector(".LeccionPapperBody");
        var estudainte = (0, _jquery2['default'])("#estudiante_id").val();
        var leccion = (0, _jquery2['default'])("#leccion_id").val();
        var count_pregu = document.querySelector(".LeccionPapperBody").childElementCount;
        var json = { "estudiante": estudainte, "leccion": leccion, "count": count_pregu };

        for (var i = 0; i < questions.childElementCount; i++) {
            var pregunta = questions.children[i].children[1].children[2].value;
            var type = questions.children[i].children[3].value;
            json['test' + i] = { "pregunta": pregunta };

            if (type == "C") {
                var respuesta = questions.children[i].children[2].children[0].value;
                json['test' + i]["respuesta"] = respuesta;
            }

            if (type == "S") {
                var _name = questions.children[i].children[2].children[0].children[0].name;
                var a = document.getElementsByName(_name);

                for (var j = 0; j < a.length; j++) {
                    if (a[j].checked == true) json['test' + i]["respuesta"] = a[j].value;
                }
            }
            if (type == "M") {
                var name_m = questions.children[i].children[2].children[0].children[0].name;
                var a_m = document.getElementsByName(name_m);
                json['test' + i]["respuesta"] = null;
                var opcion = [];

                for (var e = 0; e < a_m.length; e++) {
                    if (a_m[e].checked == true) opcion.push(a_m[e].value);
                }
                json['test' + i]["opcion"] = opcion;
            }
        }

        console.log(json);
        socket.emit("presentar::leccion", json);
        (0, _jquery2['default'])(".LeccionPapperBody").empty();
        (0, _jquery2['default'])(".LeccionPaper").fadeOut();
        alert("La leccion ha sido presentada..");
    }

    function EmitLeccion(data) {
        (0, _jquery2['default'])(".LeccionPaper").fadeIn();
        alert("La lección  a empezado");
        console.log(data);
        TemplateLeccion(data);
    }

    function newLeccion() {
        (0, _jquery2['default'])("#card__leccion").fadeIn();
    }

    function newQuestion() {
        (0, _jquery2['default'])(".card__preguntas-create").fadeIn();
        (0, _jquery2['default'])(".type_question-container").fadeIn();
        (0, _jquery2['default'])(".question__lecccion").val("");
        (0, _jquery2['default'])(".leccion__completar").fadeOut();
        (0, _jquery2['default'])(".leccion__simple").fadeOut();
        (0, _jquery2['default'])(".leccion__compuesta").fadeOut();
    }

    function selectTypeQuestion() {
        var select = (0, _jquery2['default'])(".question__lecccion").val();
        (0, _jquery2['default'])(".type_question-container").fadeOut();
        if (select == 1) (0, _jquery2['default'])(".leccion__completar").fadeIn();
        if (select == 2) (0, _jquery2['default'])(".leccion__simple").fadeIn();
        if (select == 3) (0, _jquery2['default'])(".leccion__compuesta").fadeIn();
    }

    function completarNew() {
        if ((0, _jquery2['default'])("#pregunta__completar").val() == "") {
            alert("Debes  Ingresar un pregunta.");
        } else {
            var pregunta = (0, _jquery2['default'])("#pregunta__completar");
            var content = (0, _jquery2['default'])(".container__pregunta-leccion");
            var count = document.querySelector(".container__pregunta-leccion").childElementCount;

            var tpl = '<div>\n        <p class="de_completar">De completar</p>\n        <span class="count__leccion">' + ++count + '</span>\n        <input data-type="C"  value="' + pregunta.val() + '" class="input__leccion" />\n        <a class="eliminar__completo">\n            <i class="icon-cross"></i>\n            <span>Eliminar</span>\n        </a>\n        </div>';
            content.append(tpl);
            (0, _jquery2['default'])(".card__preguntas-create").fadeOut();
            pregunta.val("");
            var elim = document.querySelectorAll(".eliminar__completo");

            for (var i = 0; i < elim.length; i++) {
                elim[i].addEventListener("click", onEliminarCompleto);
            }
        }
    }

    function onEliminarCompleto(e) {
        var el = e.path[2];
        el.remove();
        (0, _jquery2['default'])("#crear__pregunta").attr("disabled", false);
        (0, _jquery2['default'])(".poppu-message").fadeIn();

        var count = document.querySelectorAll(".count__leccion");
        for (var a = 0; a < count.length; a++) {
            count[a].innerHTML = a + 1;
        }
    }

    function simpleNew() {
        var pregunta = (0, _jquery2['default'])("#pregunta__simple");
        if (pregunta.val() == "") {
            alert("Debes Ingresar una pregunta valida.");
        } else {
            var content = (0, _jquery2['default'])(".container__pregunta-leccion");
            var count = document.querySelector(".container__pregunta-leccion").childElementCount;
            ++count;

            var tpl = '<div>\n        <p class="seleccion__simple">De seleccion simple.</p>\n        <span class="count__leccion">' + count + '</span>\n        <input data-type="S" value="' + pregunta.val() + '" class="input__leccion" />\n        <a class="eliminar__simple">\n            <i class="icon-cross"></i>\n            <span>Eliminar</span>\n        </a>\n        <button class="add_option_simple">\n            <i class="icon-plus"></i>\n            <span class="agregar__simple-span">Agregar</span>\n        </button>\n        <ul class="lista_opciones" id="lista_opt_simple_' + count + '"></ul>\n        </div>';
            content.append(tpl);
            var count_opt = document.querySelector('#lista_opt_simple_' + count).childElementCount;

            if (count_opt < 3) {
                (0, _jquery2['default'])("#crear__pregunta").attr("disabled", true);
                (0, _jquery2['default'])(".poppu-message").fadeIn();
            }
            (0, _jquery2['default'])(".card__preguntas-create").fadeOut();
            pregunta.val("");

            var addopt = (0, _jquery2['default'])(".add_option_simple");
            addopt.on("click", function () {
                return (0, _jquery2['default'])(".grupo__new-simples").fadeIn();
            });
        }
        var elim = document.querySelectorAll(".eliminar__simple");

        for (var i = 0; i < elim.length; i++) {
            elim[i].addEventListener("click", onEliminarCompleto);
        }
    }

    function opcionSimpleAdd() {
        var option = (0, _jquery2['default'])("#posibles_respues");
        var count = document.querySelector(".container__pregunta-leccion").childElementCount;
        if (option.val() == "") {
            alert("Debes ingresar una opcion.");
        } else {
            var tpl = '<li>\n        <input  type="radio"  name="simple" />\n        <input  type="text" value="' + option.val() + '" class="input__leccion" />\n        <a class="eliminar__opcion-simple">\n            <i class="icon-cross"></i>\n            <span>Eliminar</span>\n        </a>\n        </li>';

            (0, _jquery2['default'])('#lista_opt_simple_' + count).append(tpl);
            (0, _jquery2['default'])(".grupo__new-simples").fadeOut();
            option.val("");

            var count_opt = document.querySelector('#lista_opt_simple_' + count).childElementCount;
            if (count_opt >= 3) {
                (0, _jquery2['default'])("#crear__pregunta").attr("disabled", false);
                (0, _jquery2['default'])(".poppu-message").fadeOut();
            }
            var elimsimple = document.querySelectorAll(".eliminar__opcion-simple");

            for (var i = 0; i < elimsimple.length; i++) elimsimple[i].addEventListener("click", eliminarSimple);
        }
    }

    function eliminarSimple(e) {
        var el = e.path[2];
        el.remove();
    }

    function botonAddMultiple() {
        var pregunta = (0, _jquery2['default'])("#pregunta__compuesta");

        if (pregunta.val() == "") {
            alert("Debes ingresar una pregunta valida");
        } else {
            var content = (0, _jquery2['default'])(".container__pregunta-leccion");
            var count = document.querySelector(".container__pregunta-leccion").childElementCount;
            ++count;

            var tpl = '<div>\n        <p class="Seleccion__multimple">De Selecion Multiple.</p>\n        <span class="count__leccion">' + count + '</span>\n        <input data-type="M" value="' + pregunta.val() + '" class="input__leccion" />\n        <a class="eliminar_multiple">\n            <i class="icon-cross"></i>\n            <span>Eliminar</span>\n        </a>\n        <button class="add_option_multiple">\n            <i class="icon-plus"></i>\n            <span class="add_multiple_opt">Agregar</span>\n        </button>\n        <ul class="lista_opcion_multiple"  id="lista_opt_multiple_' + count + '"></ul>\n        </div>';
            content.append(tpl);
            var count_opt = document.querySelector('#lista_opt_multiple_' + count).childElementCount;

            if (count_opt < 3) {
                (0, _jquery2['default'])("#crear__pregunta").attr("disabled", true);
                (0, _jquery2['default'])(".poppu-message").fadeIn();
            }
            (0, _jquery2['default'])(".card__preguntas-create").fadeOut();
            pregunta.val("");

            var addopt = (0, _jquery2['default'])(".add_option_multiple");
            addopt.on("click", function () {
                return (0, _jquery2['default'])(".grupo__new-compuestas").fadeIn();
            });
        }
        var elim = document.querySelectorAll(".eliminar_multiple");

        for (var i = 0; i < elim.length; i++) {
            elim[i].addEventListener("click", onEliminarMultiple);
        }
    }

    function onEliminarMultiple(e) {
        var el = e.path[2];
        el.remove();
        (0, _jquery2['default'])(".poppu-message").fadeIn();
        (0, _jquery2['default'])("#crear__pregunta").attr("disabled", false);
        var count = document.querySelectorAll(".count__leccion");

        for (var a = 0; a < count.length; a++) {
            count[a].innerHTML = a + 1;
        }
    }

    function addCompuetasOpt() {
        var option = (0, _jquery2['default'])("#posibles__respuesta-compuesta");
        var count = document.querySelector(".container__pregunta-leccion").childElementCount;
        // ++count

        if (option.val() == "") {
            alert("Debes ingresar una pregunta.");
        } else {
            var tpl = '<li>\n        <input  type="checkbox" value="' + option.val() + '" name="mutiple"  style="float:none;" />\n        <input  type="text" value="' + option.val() + '" class="input__leccion" />\n        <a class="eliminar_multiple_opcion">\n            <i class="icon-cross"></i>\n            <span>Eliminar</span>\n        </a>\n        </li>';

            (0, _jquery2['default'])('#lista_opt_multiple_' + count).append(tpl);
            (0, _jquery2['default'])(".grupo__new-compuestas").fadeOut();
            option.val("");

            var count_opt = document.querySelector('#lista_opt_multiple_' + count).childElementCount;
            if (count_opt >= 3) {
                (0, _jquery2['default'])("#crear__pregunta").attr("disabled", false);
                (0, _jquery2['default'])(".poppu-message").fadeOut();
            }
            var elimcompusto = document.querySelectorAll(".eliminar_multiple_opcion");
            for (var i = 0; i < elimcompusto.length; i++) elimcompusto[i].addEventListener("click", eliminarSimple);
        }
    }
}
function getData() {
    var count = document.querySelector(".container__pregunta-leccion").childElementCount;
    var clase = (0, _jquery2['default'])("#clase_id").val();
    var materia = (0, _jquery2['default'])("#materia").val();
    var json = { "clase": clase, "materia": materia, "num_question": count };
    var preguntas = document.querySelector(".container__pregunta-leccion").children;

    for (var i = 0; i < preguntas.length; i++) {
        var _count = preguntas[i].children[1].innerHTML;
        var test = preguntas[i].children[2].value;
        var opt = preguntas[i].children[5];
        var type = preguntas[i].children[2].dataset.type;
        var opcion = {};

        if (opt != undefined) {
            for (var a = 0; a < opt.children.length; a++) {
                var list = opt.children[a];
                var posibles = list.children[1].value;
                var _count2 = list.childElementCount;
                var posib = {};
                opcion["count_opciones"] = _count2;
                opcion['posibilidad' + (a + 1)] = { "pregunta": posibles };
            }
        } else opcion = null;

        json['test' + (i + 1)] = { "pregunta": test, "count": _count, "opciones": opcion, "type": type };
    }

    return json;
}

exports['default'] = Leccion;
module.exports = exports['default'];

},{"jquery":21}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var Opciones = function Opciones(socket) {

    var $CerrarOpciones = (0, _jquery2['default'])(".cerrar-opciones");
    var $OpcionesActividades = (0, _jquery2['default'])("#OpcionesActividades");
    var $OpcionesDeberes = (0, _jquery2['default'])("#OpcionesDeberes");
    var $OpcionesLecciones = (0, _jquery2['default'])("#OpcionesLecciones");
    var $button_deber = (0, _jquery2['default'])(".card_tarea_button");
    var $tai = document.querySelector(".tai-cal");

    $CerrarOpciones.on("click", cerrar_opciones);
    $OpcionesActividades.on("click", opciones_actividades);
    $OpcionesDeberes.on("click", opciones_deberes);
    $OpcionesLecciones.on("click", opciones_lecciones);
    $button_deber.on("click", onSendTask);
    $tai.addEventListener("click", show_card_tarea, false);

    function onSendTask(e) {
        var deber = (0, _jquery2['default'])(".card_tarea_input");
        var materia = (0, _jquery2['default'])("#materia").val();
        var clase = (0, _jquery2['default'])("#clase_id").val();

        if (deber.val() == "" || deber.val().length == 0) alert("Debe ingresar la tarea");else {
            (0, _jquery2['default'])(".card_tarea").fadeOut();
            socket.emit("show::tarea", { deber: deber.val(), materia: materia, clase: clase });
            deber.val("");
        }
    }
};

function show_card_tarea(e) {
    (0, _jquery2['default'])(".card_tarea").fadeIn();
}

function opciones_actividades() {
    (0, _jquery2['default'])(".ActividadesOpcion").addClass("active-opcion");
    (0, _jquery2['default'])(".DeberesOpcion").removeClass("active-opcion");
    (0, _jquery2['default'])(".LeccionesOpcion").removeClass("active-opcion");
}
function opciones_deberes() {
    (0, _jquery2['default'])(".DeberesOpcion").addClass("active-opcion");
    (0, _jquery2['default'])(".ActividadesOpcion").removeClass("active-opcion");
    (0, _jquery2['default'])(".LeccionesOpcion").removeClass("active-opcion");
}
function opciones_lecciones() {
    (0, _jquery2['default'])(".LeccionesOpcion").addClass("active-opcion");
    (0, _jquery2['default'])(".ActividadesOpcion").removeClass("active-opcion");
    (0, _jquery2['default'])(".DeberesOpcion").removeClass("active-opcion");
}

function cerrar_opciones() {
    (0, _jquery2['default'])(".card--opciones").fadeOut();
    setTimeout(function () {
        opciones_actividades();
    }, 1000);
}

exports['default'] = Opciones;
module.exports = exports['default'];

},{"jquery":21}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function pizarra(socket) {
	if (!('getContext' in document.createElement('canvas'))) {
		alert('Lo sentimos, tu navegador no soporta canvas!');
		return false;
	}

	(0, _jquery2['default'])("#PizarraLayout").fadeIn();
	var type_user = (0, _jquery2['default'])("#type_user").val();
	if (type_user == "Teacher") (0, _jquery2['default'])("#agc").fadeIn();

	// cache de objetos de jQuery
	var doc = (0, _jquery2['default'])(".PizarraLayoutCanvas");
	var win = (0, _jquery2['default'])(window);
	var canvas = (0, _jquery2['default'])('#PizarraCanvas');
	var instructions = (0, _jquery2['default'])('#instructions');
	var connections = (0, _jquery2['default'])('#connections');
	var ctx = canvas[0].getContext('2d');

	//cronometro
	cronometroPizarra();
	// id único para la session
	var id = Math.round(_jquery2['default'].now() * Math.random());

	// inicializamos el estado
	var drawing = false;
	var clients = {};
	var cursors = {};
	var prev = {};
	var lastEmit = _jquery2['default'].now();
	var cursorColor = randomColor();

	/*
   Administradores de eventos
  */

	function moveHandler(data) {
		if (!(data.id in clients)) {
			// le damos un cursor a cada usuario nuestro
			cursors[data.id] = (0, _jquery2['default'])('<div class="cursor">').appendTo('#cursors');
		}

		// movemos el cursor a su posicion
		cursors[data.id].css({
			'left': data.x,
			'top': data.y
		});

		if (data.drawing && clients[data.id]) {
			drawLine(clients[data.id].x, clients[data.id].y, data.x, data.y, data.color);
		}

		// actualizamos el estado
		clients[data.id] = data;
		clients[data.id].updated = _jquery2['default'].now();
	}

	function mousedownHandler(e) {
		console.log("estoy en el mousedownHandler");
		e.preventDefault();
		drawing = true;
		prev.x = e.pageX;
		prev.y = e.pageY;

		// escondemos las instrucciones
		instructions.fadeOut();
	}

	function mousemoveHandler(e) {
		console.log("estoy en el mousemoveHandler");

		if (_jquery2['default'].now() - lastEmit > 30) {
			var movement = {
				'x': e.pageX,
				'y': e.pageY,
				'drawing': drawing,
				'color': cursorColor,
				'id': id
			};
			socket.emit('mousemove', movement);
			lastEmit = _jquery2['default'].now();
		}

		if (drawing) {

			drawLine(prev.x, prev.y, e.pageX, e.pageY, cursorColor);

			prev.x = e.pageX;
			prev.y = e.pageY;
		}
	}

	function drawLine(fromx, fromy, tox, toy, color) {
		ctx.beginPath(); // create a new empty path (no subpaths!)
		ctx.strokeStyle = color;
		ctx.lineWidth = 3;
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(tox, toy);
		ctx.stroke();
	}

	function connectionHandler(data) {
		console.log('connections', connections);
		connections.text(data.connections + ' conectados');
	}

	function randomColor() {
		// from http://www.paulirish.com/2009/random-hex-color-code-snippets/
		return '#' + (function lol(m, s, c) {
			return s[m.floor(m.random() * s.length)] + (c && lol(m, s, c - 1));
		})(Math, '0123456789ABCDEF', 4);
	}

	/**
  * Adjuntamos los eventos
  */
	socket.on('move', moveHandler);
	socket.on('connections', connectionHandler);

	canvas.on('mousedown', mousedownHandler);
	doc.on('mousemove', mousemoveHandler);

	doc.bind('mouseup mouseleave', function () {
		drawing = false;
	});

	/**
  * Borramos sessiones viejas
  */
	setInterval(function () {
		for (var ident in clients) {
			if (_jquery2['default'].now() - clients[ident].updated > 10000) {
				cursors[ident].remove();
				delete clients[ident];
				delete cursors[ident];
			}
		}
	}, 10000);
}

function cronometroPizarra() {
	carga();
	var cronometro;

	function detenerse() {
		clearInterval(cronometro);
	}

	function carga() {
		var contador_s_pizarra = 0;
		var contador_m_pizarra = 0;
		var m = document.querySelector(".cronometro-pizarra--minutos");
		var s = document.querySelector(".cronometro-pizarra--segundo");

		cronometro = setInterval(function () {
			if (contador_s_pizarra == 60) {
				contador_s_pizarra = 0;
				contador_m_pizarra++;
				m.innerHTML = contador_m_pizarra;

				if (contador_m_pizarra == 60) {
					contador_m_pizarra = 0;
				}
			}

			s.innerHTML = contador_s_pizarra;
			contador_s_pizarra++;
		}, 1000);
	}
}

exports['default'] = pizarra;
module.exports = exports['default'];

},{"jquery":21}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var Reporte = function Reporte() {};

exports['default'] = Reporte;
module.exports = exports['default'];

},{}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function streamingTeacher(socket) {
    // const configuration = {'iceServers':[{'url': 'stun:stun.l.google.com:19302'}]}
    var pc_config = { "rtcpMuxPolicy": "require", "bundlePolicy": "max-bundle", "iceServers": [{ "urls": ["turn:64.233.177.127:19305?transport=udp", "turn:64.233.177.127:19305?transport=tcp", "turn:74.125.134.127:19305?transport=udp"], "username": "1466084271:CAAeb7CH", "credential": "nXD4TYUK4+p9WN6o4Dkmr97JH/Y=" }, { "urls": ["stun:stun.l.google.com:19302"] }] };

    var type_user = document.querySelector("#type_user").value;
    var tipo_usuario = "";

    socket.emit("type::user", { "type_user": type_user });
    socket.emit("join::video::chat", { "channel": getChannel(), "type_user": type_user });
    socket.on("addPeer", start);

    socket.on("user::typo", function (data) {
        tipo_usuario = "";
        tipo_usuario = data.type_user;
    });

    var local_media_stream = null;
    var peer_connection = null;
    var peer_media_elements = {};
    var peers = {};

    navigator.getUserMedia({ "audio": true, "video": true }, function (stream) {
        local_media_stream = stream;
        var local_media = (0, _jquery2['default'])("<video>");
        local_media.attr("autoplay", "autoplay");
        local_media.attr("controls", "");
        local_media.attr("muted", "true");

        if (type_user == "Student") {
            local_media.addClass("estudianteLocalView");
            (0, _jquery2['default'])('.LayoutRemoteEstudiante').append(local_media);
        } else {
            local_media.addClass("profesorLocalView");
            (0, _jquery2['default'])('.LayoutRemoteProfesor').append(local_media);
        }
        attachMediaStream(local_media[0], local_media_stream);
    }, function (err) {
        console.log(err);
        alert("No Funciona!!");
    });

    function start(config) {
        var peer_id = config.peer_id;
        var type_usuario = config.type_user;

        if (peer_id in peers) {
            console.log("Already connected to peer ", peer_id);
            return;
        }

        peer_connection = new RTCPeerConnection(pc_config);
        // , {"optional": [{"DtlsSrtpKeyAgreement": true}]}
        peers[peer_id] = peer_connection;

        peer_connection.onicecandidate = function (event) {
            if (event.candidate) {
                console.log("ice candidate");
                socket.emit("relayICECandidate", {
                    'peer_id': peer_id,
                    'ice_candidate': {
                        'sdpMLineIndex': event.candidate.sdpMLineIndex,
                        'candidate': event.candidate.candidate
                    }
                });
            }
        };
        peer_connection.onaddstream = function (event) {
            var remote_media = (0, _jquery2['default'])("<video>");
            remote_media.attr("autoplay", "autoplay");
            remote_media.attr("controls", "");

            peer_media_elements[peer_id] = remote_media;
            // if()
            if (tipo_usuario == "Student") {
                remote_media.addClass("estudianteRemoteView");
                (0, _jquery2['default'])('.LayoutRemoteEstudiante').append(remote_media);
                attachMediaStream(remote_media[0], event.stream);
            } else {
                var foo = document.querySelector(".LayoutRemoteProfesor").childElementCount;
                if (foo == 0) {
                    remote_media.addClass("profesorRemoteView");
                    (0, _jquery2['default'])('.LayoutRemoteProfesor').append(remote_media);
                    attachMediaStream(remote_media[0], event.stream);
                } else {
                    remote_media.addClass("estudianteRemoteView");
                    (0, _jquery2['default'])('.LayoutRemoteEstudiante').append(remote_media);
                    attachMediaStream(remote_media[0], event.stream);
                }
            }
        };

        peer_connection.addStream(local_media_stream);

        if (config.should_offer) {

            peer_connection.createOffer(function (local_description) {
                peer_connection.setLocalDescription(local_description, function () {
                    socket.emit("relaySessionDescription", { 'peer_id': peer_id, 'session_description': local_description });
                }, function () {
                    Alert("Offer setLocalDescription failed!");
                });
            }, function (err) {
                console.log(err);
            });
        } // dein del if que valida el should_offer
    }

    socket.on("sessionDescription", function (config) {
        console.log('Remote description received: ', config);
        var peer_id = config.peer_id;
        var peer = peers[peer_id];
        var remote_description = config.session_description;
        console.log(config.session_description);

        var desc = new RTCSessionDescription(remote_description);
        var stuff = peer.setRemoteDescription(desc, function () {
            console.log("setRemoteDescription succeeded");

            if (remote_description.type == "offer") {
                console.log("Creating answer");
                peer.createAnswer(function (local_description) {
                    console.log("Answer description is: ", local_description);
                    peer.setLocalDescription(local_description, function () {
                        socket.emit('relaySessionDescription', { 'peer_id': peer_id, 'session_description': local_description });

                        console.log("Answer setLocalDescription succeeded");
                    }, function () {
                        Alert("Answer setLocalDescription failed!");
                    });
                }, function (err) {
                    console.log("Error creating answer: ", err);
                    console.log(peer);
                });
            }
        }, function (err) {
            console.log(err);
        });

        console.log("Description Object: ", desc);
    });

    socket.on("iceCandidate", function (config) {
        var peer = peers[config.peer_id];
        var ice_candidate = config.ice_candidate;
        peer.addIceCandidate(new RTCIceCandidate(ice_candidate));
    });

    socket.on('disconnect', function () {
        for (peer_id in peer_media_elements) peer_media_elements[peer_id].remove();
        for (peer_id in peers) peers[peer_id].close();

        peers = {};
        peer_media_elements = {};
    });

    socket.on("removePeer", function (config) {
        var peer_id = config.peer_id;
        if (peer_id in peer_media_elements) peer_media_elements[peer_id].remove();

        if (peer_id in peers) peers[peer_id].close();

        delete peers[peer_id];
        delete peer_media_elements[config.peer_id];
    });
}

function getChannel() {
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1).length;
    var channel = window.location.pathname.substring(pathName);
    return channel;
}

exports['default'] = streamingTeacher;
module.exports = exports['default'];

},{"jquery":21}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function tarea(socket) {
	var button = document.querySelector(".card_upload_task_button");

	button.addEventListener("click", function (e) {
		e.preventDefault();
		if (validar_deber()) {
			var archivo = document.querySelector("#task_form_file").files[0];
			var name_task = (0, _jquery2["default"])(".card_deber_card_name").html();
			console.log(name_task);
			var formData = new FormData();

			formData.append("tarea", archivo);
			formData.append("profesor", (0, _jquery2["default"])("#profesor").val());
			formData.append("alumno", (0, _jquery2["default"])("#curso").val());
			formData.append("materia", (0, _jquery2["default"])("#materia").val());
			formData.append("clase", (0, _jquery2["default"])("#clase_id").val());
			formData.append("task_name", name_task);

			_jquery2["default"].ajax({
				type: "POST",
				url: "/subir/tarea",
				dataType: "html",
				data: formData,
				cache: false,
				contentType: false,
				processData: false
			}).done(function (data) {
				console.log(data);
				(0, _jquery2["default"])(".card_upload_task").fadeOut();
				(0, _jquery2["default"])(".card_deber_card").fadeOut();
				document.querySelector("#task_form_file").value = "";
			});
		}
	});
}

function validar_deber() {
	var archivo = document.querySelector("#task_form_file");
	var flag = null;

	if (archivo.value == "") {
		flag = false;
		alert("Porfavor ingrese la tarea");
	} else flag = true;
	return flag;
}

exports["default"] = tarea;
module.exports = exports["default"];

},{"jquery":21}],38:[function(require,module,exports){
var templater = require("handlebars/runtime")["default"].template;module.exports = templater({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<section id=\"box\">\n</section>\n";
},"useData":true});
},{"handlebars/runtime":20}],39:[function(require,module,exports){
var templater = require("handlebars/runtime")["default"].template;module.exports = templater({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<form id=\"form_tarea\" method=\"POST\" enctype=\"multipart/form-data\">\r\n	<p>\r\n		<input type=\"file\" id=\"tarea\" />\r\n	</p>\r\n	<p>\r\n		<input type=\"submit\" value=\"Subir\" id=\"guardar_tarea\">\r\n	</p>\r\n</form>";
},"useData":true});
},{"handlebars/runtime":20}],40:[function(require,module,exports){
var templater = require("handlebars/runtime")["default"].template;module.exports = templater({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {}, alias4=helpers.helperMissing, alias5="function";

  return "<div class=\"card aviso\">\n    <article class=\"aviso-falta--clase\">\n        <div class=\"aviso-title\">\n            <h3>Clase de  "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.lessons : depth0)) != null ? stack1.nameClass : stack1), depth0))
    + "</h3>\n        </div>\n        <div class=\"aviso-calendar\">\n            <div class=\"calendar-spiral\">\n                <span class=\"espiral-circle\"></span>\n                <span class=\"espiral-circle\"></span>\n            </div>\n            <div class=\"calendar-mes\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.fecha : depth0)) != null ? stack1.mes : stack1), depth0))
    + "</div>\n            <div class=\"calendar-day\">\n                <span class=\"day-numer\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.fecha : depth0)) != null ? stack1.dia : stack1), depth0))
    + "</span>\n                <span class=\"day-text\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.fecha : depth0)) != null ? stack1.semana : stack1), depth0))
    + "</span>\n            </div>\n        </div>\n        <div class=\"aviso-reloj\">\n            <div class=\"reloj-count-day\">\n                <span class=\"count-day-number dia-"
    + alias2(((helper = (helper = helpers.id_leccion || (depth0 != null ? depth0.id_leccion : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"id_leccion","hash":{},"data":data}) : helper)))
    + "-reloj\"></span>\n                <span class=\"count-day-text\">días</span>\n            </div>\n            <div class=\"reloj-count-hora\">\n                <span class=\"count-hora-number hora-"
    + alias2(((helper = (helper = helpers.id_leccion || (depth0 != null ? depth0.id_leccion : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"id_leccion","hash":{},"data":data}) : helper)))
    + "-reloj\"></span>\n                <span class=\"count-hora-text\">horas</span>\n            </div>\n            <div class=\"reloj-count-minuto\">\n                <span class=\"count-minuto-number minuto-"
    + alias2(((helper = (helper = helpers.id_leccion || (depth0 != null ? depth0.id_leccion : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"id_leccion","hash":{},"data":data}) : helper)))
    + "-reloj\"></span>\n                <span class=\"count-minuto-text\">min</span>\n            </div>\n            <div class=\"reloj-count-segundo\">\n                <span class=\"count-segundo-number segundo-"
    + alias2(((helper = (helper = helpers.id_leccion || (depth0 != null ? depth0.id_leccion : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"id_leccion","hash":{},"data":data}) : helper)))
    + "-reloj\"></span>\n                <span class=\"count-segundo-text\">seg</span>\n            </div>\n        </div>\n        <div class=\"aviso-ingresar none\">\n            <a href=\"/lessons/"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.lessons : depth0)) != null ? stack1._id : stack1), depth0))
    + "\">Ingresar a clase</a>\n        </div>\n    </article>\n</div>\n\n";
},"useData":true});
},{"handlebars/runtime":20}],41:[function(require,module,exports){
var templater = require("handlebars/runtime")["default"].template;module.exports = templater({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<form id=\"questionForm\" class=\"questionForm\">\n  <textarea id=\"question\" class=\"questionForm-textarea\" placeholder=\"Ingresar Pregunta\"></textarea>\n  <input type=\"submit\" value=\"ENVIAR\" id=\"btnQuestion\" class=\"btnQuestion\">\n  <a class=\"icon-mic mic\" id=\"messageVoice\"></a>\n</form>\n";
},"useData":true});
},{"handlebars/runtime":20}],42:[function(require,module,exports){
var templater = require("handlebars/runtime")["default"].template;module.exports = templater({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<section id=\"ahorcado\">\r\n<link rel=\"stylesheet\" href=\"../dist/css/ahorcado.css\">\r\n	<div class=\"contenedorImagen alinearHorizontal\">\r\n    	<img src=\"../dist/img/a1.jpg\" id='imagen'>\r\n  </div>\r\n  <div class=\"contenedorPalabra alinearHorizontal\" id=\"contenedorPalabra\">\r\n  	<div id=\"palabraSecreta\" class=\"palabraSecreta centrarDiv\"></div>\r\n      <div id=\"botonJugar\" class=\"botonJugar centrarDiv borderBox letraNegrita centrarTexto borderRadius-5 cursorPointer\">Jugar de Nuevo</div>\r\n      <div class=\"contenedorNoIntentos centrarTexto\">\r\n  		<div class=\"tituloNoIntentos\">\r\n      		Numero de Intentos\r\n      	</div>\r\n      	<div class=\"noIntentos centrarDiv borderBox\" id='noIntentos'>\r\n      		4\r\n      	</div>\r\n  	</div>\r\n  </div>\r\n  <div class=\"contenedorLetras centrarDiv borderBox letraNegrita\" id=\"contenedorLetras\">\r\n  </div>\r\n</section>";
},"useData":true});
},{"handlebars/runtime":20}],43:[function(require,module,exports){
var templater = require("handlebars/runtime")["default"].template;module.exports = templater({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "    <form id=\"form1\" runat=\"server\">\r\n    <link rel=\"stylesheet\" href=\"../dist/css/buscamina.css\">\r\n        <div id=\"precontenedor\" class=\"precontenedor\">\r\n            <div id=\"contenedor\" class=\"contenedor\">\r\n                <div class=\"superiorjuego\">\r\n                    <div class=\"superiorjuego_interno\">                    \r\n                        <p id=\"facil\">Facil</p>\r\n                    </div>\r\n                    <div class=\"superiorjuego_interno\">                    \r\n                        <p id=\"medio\">Medio</p>\r\n                    </div>\r\n                    <div class=\"superiorjuego_interno\">\r\n                        <p id=\"dificil\">Dificil</p>\r\n                    </div>                \r\n                </div>\r\n                \r\n                <div class=\"fondo\">\r\n                    <div id=\"canvas\"></div>              \r\n                    <div id=\"bordeinferior\" class=\"bordeinferior\">\r\n                        <div id=\"panelIzquierdo\" class=\"panelizquierdo\">\r\n                        <div id=\"reloj\" class=\"reloj\"></div>                   \r\n                        <label id=\"lblcontador\" class=\"contador\"></label>\r\n                        </div>\r\n                        <div id=\"panelDerecho\" class=\"panelderecho\">\r\n                            <label id=\"lblcontadorMinas\" class=\"contador\"></label>\r\n                            <div id=\"logomina\" class=\"logomina\"></div>\r\n                        </div>\r\n                    </div>\r\n                    <div id=\"textoInferior\" class=\"textoinferior\">\r\n                        <div class=\"texto\">Tecla Z + click para poner</div>\r\n                        <div class=\"imagenbandera\"></div>                \r\n                    </div>\r\n\r\n                    <div class=\"nuevojuego\">\r\n                        <p id=\"newgame\">Nuevo Juego</p>\r\n                    </div>\r\n                </div>               \r\n            </div>                                    \r\n        </div>      \r\n        \r\n        <div class=\"modal\">\r\n            <div class=\"bordesuperior\"></div>\r\n            <div class=\"bordeizquierdo\"></div>\r\n            <div class=\"superior\" id=\"superior\"></div>\r\n            <input type=\"button\" onclick=\"modalCerrar()\" class=\"cerrarmodal\" />            \r\n            <div class=\"bordederecho\"></div>\r\n            <div class=\"contenido\">                \r\n                <div id=\"modaltitulo\" class=\"titulo\"></div>\r\n                <div id=\"modaltiempo\" class=\"texto\"></div>\r\n                <div id=\"modalpuntaje\" class=\"texto\"></div>\r\n                <div id=\"modalnuevojuego\" class=\"texto\"></div>\r\n            </div>\r\n            <div class=\"bordeinferiormodal\"></div>            \r\n        </div>\r\n        <div class=\"modaltransparencia\"></div>\r\n\r\n        \r\n        <div>\r\n            <audio id=\"explosion\" preload=\"load\">\r\n               <source src=\"../dist/Sounds/explosionlarga.mp3\"></source> \r\n               <source src=\"../dist/Sounds/explosionlarga.wav\"></source>\r\n            </audio>\r\n        </div>        \r\n        <div id=\"load\" class=\"load\"></div>        \r\n        <div id=\"texto\"></div>\r\n    </form>\r\n";
},"useData":true});
},{"handlebars/runtime":20}],44:[function(require,module,exports){
var templater = require("handlebars/runtime")["default"].template;module.exports = templater({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return " <div class=\"contenedor\">\r\n <link rel=\"stylesheet\" href=\"../dist/css/trestis.css\">\r\n            <div class=\"contenedorcanvas\">\r\n                <canvas id=\"canvas\" width=\"200\" height=\"420\"></canvas>\r\n            </div>\r\n            <div class=\"contenedorderecha\">\r\n                <div class=\"figura\">\r\n                    <canvas id=\"canvasFigura\" width=\"160\" height=\"40\" class=\"canvas\"></canvas>\r\n                </div>\r\n                <div class=\"score\">\r\n                    <div class=\"izq\">SCORE</div>\r\n                    <div id=\"score\"  class=\"der\"></div>\r\n                </div>\r\n                <div class=\"lines\">\r\n                    <div class=\"izq\">LINES</div>\r\n                    <div id=\"lineas\" class=\"der\"></div>\r\n                </div>\r\n                <div class=\"level\">\r\n                    <div class=\"izq\">LEVEL</div>\r\n                    <div id=\"nivel\" class=\"der\"></div>\r\n                </div>\r\n                <div class=\"sonido\">\r\n                    <div class=\"izq\"><img id=\"bafle\" src=\"../dist/css/Images/bafle.png\"></img></div>\r\n                    <div class=\"der\"></div>\r\n                </div>\r\n                <div class=\"jugar\"><a id=\"playAgain\" >PLAY AGAIN</a></div>\r\n            </div>\r\n            <div id=\"texto\"></div>\r\n            <audio id=\"sonidoBorrar\" preload=\"load\">\r\n                <source src=\"../dist/Sounds/borrar.mp3\"></source>\r\n                <source src=\"../dist/Sounds/borrar.wav\"></source>\r\n            </audio>\r\n            <audio id=\"sonidoLlego\" preload=\"load\">\r\n                <source src=\"../dist/Sounds/llego.mp3\"></source>\r\n                <source src=\"../dist/Sounds/llego.wav\"></source>\r\n            </audio>\r\n        </div>\r\n        ";
},"useData":true});
},{"handlebars/runtime":20}],45:[function(require,module,exports){
var templater = require("handlebars/runtime")["default"].template;module.exports = templater({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression;

  return "<div class=\"item\" id=\"item-question\">\n<input type=\"hidden\", value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.question : depth0)) != null ? stack1._id : stack1), depth0))
    + "\" class=\"ids_preguntas\">\n  <div class=\"top-details\">\n    <div class=\"user\">\n      <span class=\"avatar-discussion\">\n        <img src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.question : depth0)) != null ? stack1.avatar : stack1), depth0))
    + "\" alt=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.question : depth0)) != null ? stack1.name : stack1), depth0))
    + "\" height=\"20\" width=\"20\">\n      </span>\n      <a class=\"author-discussion\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.question : depth0)) != null ? stack1.name : stack1), depth0))
    + "</a>\n    </div>\n    <span class=\"date none\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.question : depth0)) != null ? stack1.date : stack1), depth0))
    + "</span>\n  </div>\n  <div class=\"discussion-text\">\n    <p class=\"btn-q\" data-id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.question : depth0)) != null ? stack1._id : stack1), depth0))
    + "\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.question : depth0)) != null ? stack1.question : stack1), depth0))
    + "</p>\n  </div>\n  <div class=\"bottom-details\">\n    <div class=\"action\">\n      <a class=\"icon-smile2 like none\">0</a>\n      <a class=\"icon-crying2 no-like none\">0</a>\n      <a class=\"count_repuesta\">\n        <span data-id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.question : depth0)) != null ? stack1._id : stack1), depth0))
    + "\">"
    + alias2(((helper = (helper = helpers.count || (depth0 != null ? depth0.count : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"count","hash":{},"data":data}) : helper)))
    + "</span>\n        Respuestas\n      </a>\n      <a class=\"responder-pregunta\" data-id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.question : depth0)) != null ? stack1._id : stack1), depth0))
    + "\">Responder</a>\n    </div>\n  </div>\n</div>\n\n";
},"useData":true});
},{"handlebars/runtime":20}],46:[function(require,module,exports){
var templater = require("handlebars/runtime")["default"].template;module.exports = templater({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"listQuestion\"></div>\n";
},"useData":true});
},{"handlebars/runtime":20}],47:[function(require,module,exports){
var templater = require("handlebars/runtime")["default"].template;module.exports = templater({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "\r\n<section id=\"contentPizarra\">\r\n	\r\n  <div id=\"cursors\">\r\n    <!-- Aqui pondremos los cursores de nuestros amigos -->\r\n  </div>\r\n\r\n  <canvas id=\"paper\" width=\"1900\" height=\"1000\">\r\n      Tu navegador debe soportar canvas\r\n  </canvas>\r\n\r\n  <hgroup id=\"instructions\">\r\n      <h1>¡Dibujemos!</h1>\r\n      <h2>Dibuja en cualquier lugar con tu cursor</h2>\r\n  </hgroup>\r\n\r\n </section>\r\n";
},"useData":true});
},{"handlebars/runtime":20}],48:[function(require,module,exports){
var templater = require("handlebars/runtime")["default"].template;module.exports = templater({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<section id=\"respuestas\" class=\"none\">\r\n	<a class=\"atras\">Atras</a>\r\n	<p class=\"question__respuesta\"></p>\r\n	<article class=\"box-form\">\r\n		<textarea id=\"form-respuesta\" placeholder=\"Escribe tu respuesta\"></textarea>\r\n		<button id=\"form-responder\" data-id=\"\">Responder</button>\r\n	</article>\r\n	<ul class=\"lista_respuesta\"></ul>\r\n</section>\r\n";
},"useData":true});
},{"handlebars/runtime":20}],49:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var canvas;
var ctx;
var canvasFigura; //el canvas donde se mostrara la siguiente figura q viene
var ctx2;

var cuadro; //calcular que figura iniciara; ; //guarda el numero del cuadro que se esta utilizando, de 1 hasta 8
var cuadroSig = aleatorio(1, 8); //contiene el cuadro q siguiente
var cuadroW = 20;
var cuadro1;
var cuadro2;
var cuadro3;
var cuadro4;
var cuadro5;
var cuadro6;
var cuadro7;
var cuadro8;
var posicion = 2; //permite saber la posicion de la figura, esto es para administrar el giro, inicialmente la posicion de giro sera 2
var posDerecha = true; //completo para validar el giro de la figura
var downPress = false; //permite saber si flecha abajo esta presionado
var posCuadroColision; //permite saber cual es la posicion mas baja de la figura, esto para validar el borrado de linea

var timerLoop;
var figura = new Array(5); //array que contiene la informacion de la figura actual, la posicion de todos sus cuadros y el tipo de cuadro
var tamFigura = 4; //tamaño de figura, por defecto es 4
var matriz = new Array(21); //la matriz es de 21 filas por 10 columnas
var figura2 = new Array(5); //el vector para dibujar la figura en el segundo canvas

var timerBorrar; //el timer para la animacion de borrar
var lineasBorrar; //permite saber la cantidad de lineas q se borraran, es variable global por la animacion
var infoLineas = new Array(4); //almacena la ubicacion de cada linea q se borrara, es variable global por la animacion
var anchoBorrar; //almacena el ancho q permite hace la animacion de borrar
var single; //imagen con el texto single
var gameover; //imagen de juego terminado

var listo = false; //permite saber si el juego ya inicio
var nivel = 1;
var lineas = 0;
var score = 0;
var velocidad = 800; //velocidad con las q bajan las figuras

var sonidoActivo = true; //permite saber si el sonido esta activado o desactivado
var sonidoBorrar;
var sonidoLlego; //el sonido cuando alguna figura queda estatica

function startTretis() {
    principal();

    (0, _jquery2['default'])('#bafle').click(function () {
        if (sonidoActivo) {
            (0, _jquery2['default'])(this).attr('src', '../dist/css/Images/bafle2.png');
            sonidoActivo = false;
        } else {
            (0, _jquery2['default'])(this).attr('src', '../dist/css/Images/bafle.png');
            sonidoActivo = true;
        }
    });

    (0, _jquery2['default'])('#playAgain').click(function () {
        reiniciar();
    });

    document.onkeydown = function (e) {
        if (listo) {
            if (e.which == 37) {
                //izquierda

                if (!colisionoIzquierda()) {
                    limpiarFigura();
                    moverFigura("izq");
                }

                //colisionAbajo();
            } else if (e.which == 39) {
                    //derecha

                    if (!colisionoDerecha()) {
                        limpiarFigura();
                        moverFigura("der");
                    }

                    //colisionAbajo();
                } else if (e.which == 40 || e.which == 88) {
                        //abajo

                        downPress = true;

                        if (!colisionoAbajo()) {
                            limpiarFigura();
                            moverFigura("aba");
                        } else {
                            //en caso q haya colisionado se guarda la figura en el vector y luego se borran las lineas que se hayan completado

                            for (var x = 0; x < tamFigura; x++) {
                                var i = parseInt(figura[x].split('p')[0]) / 20;
                                var j = parseInt(figura[x].split('p')[1]) / 20;

                                //se guarda el cuadro q corresponde a la figura
                                matriz[j][i] = figura[4]; //para guardar la figura, j hace referencia al valor de Y del cuadro por lo tanto debe ser guardado en las filas
                                //ctx.drawImage(cuadro8,i*20,j*20,cuadroW,cuadroW); //poner de nuevo la figura pero con el color q indica q ya en estatica
                            }

                            if (perdio()) {
                                clearInterval(timerLoop);
                                //poner imagen de game over
                                ctx.drawImage(gameover, 40, 80, 120, 80);
                            } else {

                                ObtenerCuadroMasBajo(); //obtener punto mas bajo de la figura, se utiliza para borrar linea
                                sumarScore();
                                borrarLineas();

                                //validar si hay aumento de nivel
                                if (lineas == 20 || lineas == 40 || lineas == 60 || lineas == 80 || lineas == 100 || lineas == 120 || lineas == 140 || lineas == 160 || lineas == 180 || lineas == 200) {
                                    nivel++;
                                    (0, _jquery2['default'])('#nivel').empty().append(nivel);

                                    //aumentar velocidad con la q bajan las figuras
                                    if (velocidad >= 300) {
                                        velocidad -= 100;
                                    } else {
                                        velocidad -= 50;
                                    }

                                    clearInterval(timerLoop);
                                    timerLoop = setInterval(loop, velocidad);
                                }
                                obtenerFigura();
                                cuadroSig = aleatorio(1, 8); //calcular la figura
                                obtenerFigura2();
                            }

                            posicion = 2;
                            posDerecha = true;
                        }
                    } else if (e.which == 90) {
                        //z para girar figura
                        girarFigura();
                    }
        }
    };

    document.onkeyup = function (e) {
        if (downPress) {
            downPress = false;
        }
    };
}

function principal() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    canvasFigura = document.getElementById("canvasFigura");
    ctx2 = canvasFigura.getContext("2d");

    for (var i = 0; i < matriz.length; i++) {
        matriz[i] = new Array(10);
    }

    //inicializar matriz
    for (var i = 0; i < 21; i++) {
        for (var j = 0; j < 10; j++) {
            matriz[i][j] = 0;
        }
    }

    //poner nivel
    (0, _jquery2['default'])('#nivel').append(nivel);
    (0, _jquery2['default'])('#lineas').append(lineas);
    (0, _jquery2['default'])('#score').append(score);

    cuadro1 = new Image();
    cuadro1.src = "../dist/Images/cuadro1.png";

    cuadro2 = new Image();
    cuadro2.src = "../dist/Images/cuadro2.png";

    cuadro3 = new Image();
    cuadro3.src = "../dist/Images/cuadro3.png";

    cuadro4 = new Image();
    cuadro4.src = "../dist/Images/cuadro4.png";

    cuadro5 = new Image();
    cuadro5.src = "../dist/Images/cuadro5.png";

    cuadro6 = new Image();
    cuadro6.src = "../dist/Images/cuadro6.png";

    //single = new Image();
    //single.src = "Images/single.png";

    gameover = new Image();
    gameover.src = "../dist/Images/gameover.png";

    cuadro7 = new Image();
    cuadro7.src = "../dist/Images/cuadro7.png";
    cuadro7.onload = function () {
        listo = true;

        obtenerFigura();
        cuadroSig = aleatorio(1, 8); //calcular la figura
        obtenerFigura2();
        timerLoop = setInterval(loop, velocidad);
    };

    //sonidos
    sonidoBorrar = document.getElementById("sonidoBorrar");
    sonidoLlego = document.getElementById("sonidoLlego");
}

function loop() {

    if (!colisionoAbajo()) {
        if (!downPress) {
            //solo mover la figura en caso q no se tenga presionada la flecha abajo
            limpiarFigura();
            moverFigura("aba");
        }
    } else {
        //en caso que haya llegado al limite inferior, guardar la figura en la matriz

        for (var x = 0; x < tamFigura; x++) {
            var i = parseInt(figura[x].split('p')[0]) / 20;
            var j = parseInt(figura[x].split('p')[1]) / 20;

            matriz[j][i] = figura[4];
            //ctx.drawImage(cuadro8,i*20,j*20,cuadroW,cuadroW);
        }

        if (perdio()) {
            clearInterval(timerLoop);
            ctx.drawImage(gameover, 40, 80, 120, 80);
        } else {

            ObtenerCuadroMasBajo();
            sumarScore();
            borrarLineas();

            //validar si hay aumento de nivel
            if (lineas == 20 || lineas == 40 || lineas == 60 || lineas == 80 || lineas == 100 || lineas == 120 || lineas == 140 || lineas == 160 || lineas == 180 || lineas == 200) {
                nivel++;
                (0, _jquery2['default'])('#nivel').empty().append(nivel);

                //aumentar velocidad con la q bajan las figuras
                if (velocidad >= 300) {
                    velocidad -= 100;
                } else {
                    velocidad -= 50;
                }

                clearInterval(timerLoop);
                timerLoop = setInterval(loop, velocidad);
            }
            obtenerFigura();
            cuadroSig = aleatorio(1, 8); //calcular la figura
            obtenerFigura2();
        }
        posicion = 2;
        posDerecha = true;
    }
}

function moverFigura(direccion) {

    switch (cuadro) {
        case 1:
            //pintar los cuadros en la nueva posicion
            for (var i = 0; i < tamFigura; i++) {
                var x = parseInt(figura[i].split('p')[0]);
                var y = parseInt(figura[i].split('p')[1]);

                if (direccion == "izq") {
                    ctx.drawImage(cuadro1, x -= cuadroW, y, cuadroW, cuadroW);
                } else if (direccion == "der") {
                    ctx.drawImage(cuadro1, x += cuadroW, y, cuadroW, cuadroW);
                } else if (direccion == "aba") {
                    ctx.drawImage(cuadro1, x, y += cuadroW, cuadroW, cuadroW);
                } else if (direccion == "n") {
                    ctx.drawImage(cuadro1, x, y, cuadroW, cuadroW);
                }

                figura[i] = x + "p" + y;
            }
            break;
        case 2:
            for (var i = 0; i < tamFigura; i++) {
                var x = parseInt(figura[i].split('p')[0]);
                var y = parseInt(figura[i].split('p')[1]);

                if (direccion == "izq") {
                    ctx.drawImage(cuadro2, x -= cuadroW, y, cuadroW, cuadroW);
                } else if (direccion == "der") {
                    ctx.drawImage(cuadro2, x += cuadroW, y, cuadroW, cuadroW);
                } else if (direccion == "aba") {
                    ctx.drawImage(cuadro2, x, y += cuadroW, cuadroW, cuadroW);
                } else if (direccion == "n") {
                    ctx.drawImage(cuadro2, x, y, cuadroW, cuadroW);
                }

                figura[i] = x + "p" + y;
            }
            break;
        case 3:
            for (var i = 0; i < tamFigura; i++) {
                var x = parseInt(figura[i].split('p')[0]);
                var y = parseInt(figura[i].split('p')[1]);

                if (direccion == "izq") {
                    ctx.drawImage(cuadro3, x -= cuadroW, y, cuadroW, cuadroW);
                } else if (direccion == "der") {
                    ctx.drawImage(cuadro3, x += cuadroW, y, cuadroW, cuadroW);
                } else if (direccion == "aba") {
                    ctx.drawImage(cuadro3, x, y += cuadroW, cuadroW, cuadroW);
                } else if (direccion == "n") {
                    ctx.drawImage(cuadro3, x, y, cuadroW, cuadroW);
                }

                figura[i] = x + "p" + y;
            }
            break;
        case 4:
            for (var i = 0; i < tamFigura; i++) {
                var x = parseInt(figura[i].split('p')[0]);
                var y = parseInt(figura[i].split('p')[1]);

                if (direccion == "izq") {
                    ctx.drawImage(cuadro4, x -= cuadroW, y, cuadroW, cuadroW);
                } else if (direccion == "der") {
                    ctx.drawImage(cuadro4, x += cuadroW, y, cuadroW, cuadroW);
                } else if (direccion == "aba") {
                    ctx.drawImage(cuadro4, x, y += cuadroW, cuadroW, cuadroW);
                } else if (direccion == "n") {
                    ctx.drawImage(cuadro4, x, y, cuadroW, cuadroW);
                }

                figura[i] = x + "p" + y;
            }
            break;
        case 5:
            for (var i = 0; i < tamFigura; i++) {
                var x = parseInt(figura[i].split('p')[0]);
                var y = parseInt(figura[i].split('p')[1]);

                if (direccion == "izq") {
                    ctx.drawImage(cuadro5, x -= cuadroW, y, cuadroW, cuadroW);
                } else if (direccion == "der") {
                    ctx.drawImage(cuadro5, x += cuadroW, y, cuadroW, cuadroW);
                } else if (direccion == "aba") {
                    ctx.drawImage(cuadro5, x, y += cuadroW, cuadroW, cuadroW);
                } else if (direccion == "n") {
                    ctx.drawImage(cuadro5, x, y, cuadroW, cuadroW);
                }

                figura[i] = x + "p" + y;
            }
            break;
        case 6:
            for (var i = 0; i < tamFigura; i++) {
                var x = parseInt(figura[i].split('p')[0]);
                var y = parseInt(figura[i].split('p')[1]);

                if (direccion == "izq") {
                    ctx.drawImage(cuadro6, x -= cuadroW, y, cuadroW, cuadroW);
                } else if (direccion == "der") {
                    ctx.drawImage(cuadro6, x += cuadroW, y, cuadroW, cuadroW);
                } else if (direccion == "aba") {
                    ctx.drawImage(cuadro6, x, y += cuadroW, cuadroW, cuadroW);
                } else if (direccion == "n") {
                    ctx.drawImage(cuadro6, x, y, cuadroW, cuadroW);
                }

                figura[i] = x + "p" + y;
            }
            break;
        case 7:
            for (var i = 0; i < tamFigura; i++) {
                var x = parseInt(figura[i].split('p')[0]);
                var y = parseInt(figura[i].split('p')[1]);

                if (direccion == "izq") {
                    ctx.drawImage(cuadro7, x -= cuadroW, y, cuadroW, cuadroW);
                } else if (direccion == "der") {
                    ctx.drawImage(cuadro7, x += cuadroW, y, cuadroW, cuadroW);
                } else if (direccion == "aba") {
                    ctx.drawImage(cuadro7, x, y += cuadroW, cuadroW, cuadroW);
                } else if (direccion == "n") {
                    ctx.drawImage(cuadro7, x, y, cuadroW, cuadroW);
                }

                figura[i] = x + "p" + y;
            }
            break;
    }
}

//Obtiene una nueva figura y la dibuja en la parte superior
function obtenerFigura() {
    cuadro = cuadroSig;
    switch (cuadro) {
        case 1:
            figura[0] = "80p" + "0"; //el primer dato es X el segundo Y
            figura[1] = "100p" + "0";
            figura[2] = "80p" + "20";
            figura[3] = "100p" + "20";
            figura[4] = 1; // el cuadro que corresponde a la figura

            for (var i = 0; i < tamFigura; i++) {
                ctx.drawImage(cuadro1, figura[i].split('p')[0], figura[i].split('p')[1], cuadroW, cuadroW);
            }
            break;
        case 2:
            figura[0] = "80p" + "0"; //el primer dato es X el segundo Y y el tercero el tipo de cuadro
            figura[1] = "100p" + "0";
            figura[2] = "100p" + "20";
            figura[3] = "120p" + "20";
            figura[4] = 2;

            for (var i = 0; i < tamFigura; i++) {
                ctx.drawImage(cuadro2, figura[i].split('p')[0], figura[i].split('p')[1], cuadroW, cuadroW);
            }
            break;
        case 3:
            figura[0] = "100p" + "0";
            figura[1] = "80p" + "0";
            figura[2] = "80p" + "20";
            figura[3] = "60p" + "20";
            figura[4] = 3;

            for (var i = 0; i < tamFigura; i++) {
                ctx.drawImage(cuadro3, figura[i].split('p')[0], figura[i].split('p')[1], cuadroW, cuadroW);
            }
            break;
        case 4:
            figura[0] = "80p" + "0";
            figura[1] = "100p" + "0";
            figura[2] = "120p" + "0";
            figura[3] = "100p" + "20";
            figura[4] = 4;

            for (var i = 0; i < tamFigura; i++) {
                ctx.drawImage(cuadro4, figura[i].split('p')[0], figura[i].split('p')[1], cuadroW, cuadroW);
            }
            break;
        case 5:
            figura[0] = "60p" + "0"; //el primer dato es X el segundo Y y el tercero el tipo de cuadro
            figura[1] = "80p" + "0";
            figura[2] = "100p" + "0";
            figura[3] = "120p" + "0";
            figura[4] = 5;

            for (var i = 0; i < tamFigura; i++) {
                ctx.drawImage(cuadro5, figura[i].split('p')[0], figura[i].split('p')[1], cuadroW, cuadroW);
            }
            break;
        case 6:
            figura[0] = "80p" + "0";
            figura[1] = "100p" + "0";
            figura[2] = "120p" + "0";
            figura[3] = "120p" + "20";
            figura[4] = 6;

            for (var i = 0; i < tamFigura; i++) {
                ctx.drawImage(cuadro6, figura[i].split('p')[0], figura[i].split('p')[1], cuadroW, cuadroW);
            }
            break;
        case 7:
            figura[0] = "80p" + "0"; //el primer dato es X el segundo Y y el tercero el tipo de cuadro
            figura[1] = "100p" + "0";
            figura[2] = "120p" + "0";
            figura[3] = "80p" + "20";
            figura[4] = 7;

            for (var i = 0; i < tamFigura; i++) {
                ctx.drawImage(cuadro7, figura[i].split('p')[0], figura[i].split('p')[1], cuadroW, cuadroW);
            }
            break;
    }
}

//gira la figura actual
function girarFigura() {
    limpiarFigura();

    switch (cuadro) {
        case 2:

            //esta posicion es cuando z esta inclinada
            if (posicion == 2) {
                var xsum = 60; //la variable q se sumara a la posicio en x de cada cuadro, esta variable se reducira en 20 cada vez q se utilice

                for (var i = 0; i < tamFigura; i++) {
                    var x = parseInt(figura[i].split('p')[0]);
                    var y = parseInt(figura[i].split('p')[1]);

                    var x2 = x + xsum - 20; //se resta 20 para desplazar de una vez cada cuadro a la izquierda
                    var y2;

                    if (i % 2 == 0) {
                        //en caso q sea par la posicion se resta 20, sino se deja tal cual
                        y2 = y - 20;
                    } else {
                        y2 = y;
                    }
                    xsum -= 20;

                    figura[i] = x2 + "p" + y2;
                }
                posicion = 1;
            } else if (posicion == 1) {
                var xsum = -60;
                var mover = true;

                //hay q validar si la figura colisiono a la izquierda, porq en ese caso hay q desplazarse mas hacia la derecha
                var derecha = 20;
                if (colisionoIzquierda()) {
                    derecha = 40;
                }

                //validar si la figura tiene espacio para volver a su posicion inicial, se valida la posicion 3 de figura

                if (derecha == 20) {
                    var i = parseInt(figura[3].split('p')[0]) / 20;
                    var j = parseInt(figura[3].split('p')[1]) / 20;

                    if (matriz[j][i + 1] != 0) {
                        mover = false;
                    }
                } else if (derecha == 40) {
                    var i = parseInt(figura[3].split('p')[0]) / 20;
                    var j = parseInt(figura[3].split('p')[1]) / 20;

                    if (matriz[j][i + 1] != 0 || matriz[j][i + 2] != 0) {
                        mover = false;
                    }
                }

                //validar si colisiono a la derecha y se puede desplazar hacia la izquierda
                if (colisionoDerecha()) {
                    var i = parseInt(figura[0].split('p')[0]) / 20;
                    var j = parseInt(figura[0].split('p')[1]) / 20;

                    if (matriz[j][i - 1] != 0) {
                        mover = false;
                    }
                }

                if (mover) {
                    for (var i = 0; i < tamFigura; i++) {
                        var x = parseInt(figura[i].split('p')[0]);
                        var y = parseInt(figura[i].split('p')[1]);

                        var x2 = x + xsum + derecha;
                        var y2;

                        if (i % 2 == 0) {
                            y2 = y + 20;
                        } else {
                            y2 = y;
                        }
                        xsum += 20;

                        figura[i] = x2 + "p" + y2;
                    }
                    posicion = 2;
                }
            }

            //poner figura
            for (var i = 0; i < tamFigura; i++) {
                var x = figura[i].split('p')[0];
                var y = figura[i].split('p')[1];

                ctx.drawImage(cuadro2, x, y, cuadroW, cuadroW);
            }

            break;
        case 3:
            if (posicion == 2) {
                //poner la ese parada
                var xsum = -60;

                for (var i = 0; i < tamFigura; i++) {
                    var x = parseInt(figura[i].split('p')[0]);
                    var y = parseInt(figura[i].split('p')[1]);

                    var x2 = x + xsum + 20;
                    var y2;

                    if (i % 2 == 0) {
                        y2 = y + 20;
                    } else {
                        y2 = y;
                    }
                    xsum += 20;

                    figura[i] = x2 + "p" + y2;
                }
                posicion = 1;
            } else if (posicion == 1) {
                var xsum = 60;
                var mover = true;

                //hay q validar si la figura colisiono a la izquierda, porq en ese caso hay q desplazarse mas hacia la derecha
                var derecha = 20;
                if (colisionoDerecha()) {
                    derecha = 40;
                }

                //validar si la figura tiene espacio para volver a su posicion inicial, se valida la posicion 1 y 3 de figura
                if (derecha == 20) {
                    var i = parseInt(figura[3].split('p')[0]) / 20;
                    var j = parseInt(figura[3].split('p')[1]) / 20;

                    if (matriz[j][i - 1] != 0) {
                        mover = false;
                    }
                } else if (derecha == 40) {
                    var i = parseInt(figura[3].split('p')[0]) / 20;
                    var j = parseInt(figura[3].split('p')[1]) / 20;

                    if (matriz[j][i - 1] != 0 || matriz[j][i - 2] != 0) {
                        mover = false;
                    }
                }

                //validar si colisiono a la izquierda y se puede desplazar hacia la derecha
                if (colisionoIzquierda()) {
                    var i = parseInt(figura[0].split('p')[0]) / 20;
                    var j = parseInt(figura[0].split('p')[1]) / 20;

                    if (matriz[j][i + 1] != 0) {
                        mover = false;
                    }
                }

                if (mover) {
                    for (var i = 0; i < tamFigura; i++) {
                        var x = parseInt(figura[i].split('p')[0]);
                        var y = parseInt(figura[i].split('p')[1]);

                        var x2 = x + xsum - derecha;
                        var y2;

                        if (i % 2 == 0) {
                            y2 = y - 20;
                        } else {
                            y2 = y;
                        }
                        xsum -= 20;

                        figura[i] = x2 + "p" + y2;
                    }
                    posicion = 2;
                }
            }

            //poner figura
            for (var i = 0; i < tamFigura; i++) {
                var x = figura[i].split('p')[0];
                var y = figura[i].split('p')[1];

                ctx.drawImage(cuadro3, x, y, cuadroW, cuadroW);
            }
            break;
        case 4:
            if (posicion == 2) {
                //sucede cuando la t gira hacia la derecha
                var sum = 0;

                for (var i = 0; i < tamFigura; i++) {
                    var x = parseInt(figura[i].split('p')[0]);
                    var y = parseInt(figura[i].split('p')[1]);
                    var x2;
                    var y2;

                    if (i == 0) {
                        x2 = x + 20;
                        y2 = y + 20;
                    } else if (i == 1) {
                        x2 = x;
                        y2 = y;
                    } else if (i == 2) {
                        x2 = x - 20;
                        y2 = y - 20;
                    } else if (i == 3) {
                        x2 = x + 20;
                        y2 = y - 20;
                    }
                    figura[i] = x2 + "p" + y2;
                }
                posicion = 3;
            } else if (posicion == 3) {
                //cuando la t gira hacia arriba
                var mover = true;
                var derecha = 0;

                var i = parseInt(figura[3].split('p')[0]) / 20;
                var j = parseInt(figura[3].split('p')[1]) / 20;

                if (colisionoIzquierda() && matriz[j][i + 1] == 0) {
                    derecha = 20;
                } else if (colisionoIzquierda() && matriz[j][i + 1] != 0) {
                    mover = false;
                }

                if (mover) {
                    for (var i = 0; i < tamFigura; i++) {
                        var x = parseInt(figura[i].split('p')[0]);
                        var y = parseInt(figura[i].split('p')[1]);
                        var x2;
                        var y2;

                        if (i == 0) {
                            x2 = x + 20 + derecha;
                            y2 = y - 20;
                        } else if (i == 1) {
                            x2 = x + derecha;
                            y2 = y;
                        } else if (i == 2) {
                            x2 = x - 20 + derecha;
                            y2 = y + 20;
                        } else if (i == 3) {
                            x2 = x - 20 + derecha;
                            y2 = y - 20;
                        }
                        figura[i] = x2 + "p" + y2;
                    }
                    posicion = 4;
                }
            } else if (posicion == 4) {
                //cuando la t gira hacia la izquierda

                for (var i = 0; i < tamFigura; i++) {
                    var x = parseInt(figura[i].split('p')[0]);
                    var y = parseInt(figura[i].split('p')[1]);
                    var x2;
                    var y2;

                    if (i == 0) {
                        x2 = x - 20;
                        y2 = y - 20;
                    } else if (i == 1) {
                        x2 = x;
                        y2 = y;
                    } else if (i == 2) {
                        x2 = x + 20;
                        y2 = y + 20;
                    } else if (i == 3) {
                        x2 = x - 20;
                        y2 = y + 20;
                    }
                    figura[i] = x2 + "p" + y2;
                }
                posicion = 1;
            } else if (posicion == 1) {
                //cuando la t vuelve a su posicion original
                var mover = true;
                var derecha = 0;

                var i = parseInt(figura[3].split('p')[0]) / 20;
                var j = parseInt(figura[3].split('p')[1]) / 20;

                if (colisionoDerecha() && matriz[j][i - 1] == 0) {
                    derecha = -20;
                } else if (colisionoDerecha() && matriz[j][i - 1] != 0) {
                    mover = false;
                }

                if (mover) {
                    for (var i = 0; i < tamFigura; i++) {
                        var x = parseInt(figura[i].split('p')[0]);
                        var y = parseInt(figura[i].split('p')[1]);
                        var x2;
                        var y2;

                        if (i == 0) {
                            x2 = x - 20 + derecha;
                            y2 = y + 20;
                        } else if (i == 1) {
                            x2 = x + derecha;
                            y2 = y;
                        } else if (i == 2) {
                            x2 = x + 20 + derecha;
                            y2 = y - 20;
                        } else if (i == 3) {
                            x2 = x + 20 + derecha;
                            y2 = y + 20;
                        }
                        figura[i] = x2 + "p" + y2;
                    }
                    posicion = 2;
                }
            }

            for (var i = 0; i < tamFigura; i++) {
                var x = figura[i].split('p')[0];
                var y = figura[i].split('p')[1];

                ctx.drawImage(cuadro4, x, y, cuadroW, cuadroW);
            }

            break;
        case 5:
            if (posicion == 2) {
                //inclinar palo
                var sum = 0; // este valor se resta al X actual y se suma al Y actual (aumenta en 20)
                var mover = true;
                var i = parseInt(figura[1].split('p')[0]) / 20;
                var j = parseInt(figura[1].split('p')[1]) / 20;

                if (matriz[j + 1][i] != 0 || matriz[j + 2][i] != 0 || matriz[j + 3][i] != 0) {
                    mover = false;
                }

                if (mover && posDerecha) {
                    //hay q validar si sobre el palo se ha aplicado un giro hacia la izquierda
                    for (var i = 0; i < tamFigura; i++) {
                        var x = parseInt(figura[i].split('p')[0]);
                        var y = parseInt(figura[i].split('p')[1]);

                        var x2 = 0;
                        var y2 = 0;

                        if (i == 0) {
                            x2 = x + 20;
                            y2 = y - 20;
                        } else {
                            x2 = x - sum;
                            y2 = y + sum;
                            sum += 20;
                        }

                        figura[i] = x2 + "p" + y2;
                    }
                    posicion = 1;
                } else if (mover && !posDerecha) {
                    for (var i = 0; i < tamFigura; i++) {
                        var x = parseInt(figura[i].split('p')[0]);
                        var y = parseInt(figura[i].split('p')[1]);

                        var x2 = 0;
                        var y2 = 0;

                        if (i == 0) {
                            x2 = x - 20;
                            y2 = y - 20;
                        } else {
                            x2 = x + sum;
                            y2 = y + sum;
                            sum += 20;
                        }

                        figura[i] = x2 + "p" + y2;
                    }
                    posicion = 1;
                }
            } else if (posicion == 1) {
                var sum = 0;
                var mover = true;

                if (colisionoIzquierda()) {
                    mover = false;
                }
                if (colisionoDerecha()) {
                    mover = false;
                }

                var i = parseInt(figura[1].split('p')[0]) / 20;
                var j = parseInt(figura[1].split('p')[1]) / 20;

                //validar si hay espacio hacia la derecha
                if (matriz[j][i + 1] == 0 && matriz[j][i + 2] == 0 && matriz[j][i + 3] == 0 && mover) {
                    for (var i = 0; i < tamFigura; i++) {
                        var x = parseInt(figura[i].split('p')[0]);
                        var y = parseInt(figura[i].split('p')[1]);

                        var x2 = 0;
                        var y2 = 0;

                        if (i == 0) {
                            x2 = x - 20;
                            y2 = y + 20;
                        } else {
                            x2 = x + sum;
                            y2 = y - sum;
                            sum += 20;
                        }
                        figura[i] = x2 + "p" + y2;
                    }
                    posicion = 2;
                    posDerecha = true;
                } else if (matriz[j][i - 1] == 0 && matriz[j][i - 2] == 0 && matriz[j][i - 3] == 0 && mover) {
                    for (var i = 0; i < tamFigura; i++) {
                        var x = parseInt(figura[i].split('p')[0]);
                        var y = parseInt(figura[i].split('p')[1]);

                        var x2 = 0;
                        var y2 = 0;

                        if (i == 0) {
                            x2 = x + 20;
                            y2 = y + 20;
                        } else {
                            x2 = x - sum;
                            y2 = y - sum;
                            sum += 20;
                        }
                        figura[i] = x2 + "p" + y2;
                    }
                    posicion = 2;
                    posDerecha = false;
                }
            }

            for (var i = 0; i < tamFigura; i++) {
                var x = figura[i].split('p')[0];
                var y = figura[i].split('p')[1];

                ctx.drawImage(cuadro5, x, y, cuadroW, cuadroW);
            }
            break;
        case 6:
            if (posicion == 2) {
                //cuando la l queda parada
                var mover = true;
                var i = parseInt(figura[1].split('p')[0]) / 20;
                var j = parseInt(figura[1].split('p')[1]) / 20;

                if (matriz[j + 1][i] != 0 || matriz[j - 1][i] != 0 || matriz[j - 1][i + 1] != 0) {
                    mover = false;
                }

                if (mover) {
                    for (var i = 0; i < tamFigura; i++) {
                        var x = parseInt(figura[i].split('p')[0]);
                        var y = parseInt(figura[i].split('p')[1]);
                        var x2;
                        var y2;

                        if (i == 0) {
                            x2 = x + 20;
                            y2 = y + 20;
                        } else if (i == 1) {
                            x2 = x;
                            y2 = y;
                        } else if (i == 2) {
                            x2 = x - 20;
                            y2 = y - 20;
                        } else if (i == 3) {
                            x2 = x;
                            y2 = y - 40;
                        }

                        figura[i] = x2 + "p" + y2;
                    }
                    posicion = 3;
                }
            } else if (posicion == 3) {
                var mover = true;
                var i = parseInt(figura[1].split('p')[0]) / 20;
                var j = parseInt(figura[1].split('p')[1]) / 20;

                if (matriz[j][i - 1] != 0 || matriz[j][i + 1] != 0 || matriz[j - 1][i - 1] != 0) {
                    mover = false;
                }

                if (mover) {
                    for (var i = 0; i < tamFigura; i++) {
                        var x = parseInt(figura[i].split('p')[0]);
                        var y = parseInt(figura[i].split('p')[1]);
                        var x2;
                        var y2;

                        if (i == 0) {
                            //el ultimo cuadro de la l se comporta diferente
                            x2 = x + 20;
                            y2 = y - 20;
                        } else if (i == 1) {
                            x2 = x;
                            y2 = y;
                        } else if (i == 2) {
                            x2 = x - 20;
                            y2 = y + 20;
                        } else if (i == 3) {
                            x2 = x - 40;
                            y2 = y;
                        }

                        figura[i] = x2 + "p" + y2;
                    }
                    posicion = 4;
                }
            } else if (posicion == 4) {
                var mover = true;
                var i = parseInt(figura[1].split('p')[0]) / 20;
                var j = parseInt(figura[1].split('p')[1]) / 20;

                if (matriz[j - 1][i] != 0 || matriz[j + 1][i] != 0 || matriz[j - 1][i - 1] != 0) {
                    mover = false;
                }

                if (mover) {
                    for (var i = 0; i < tamFigura; i++) {
                        var x = parseInt(figura[i].split('p')[0]);
                        var y = parseInt(figura[i].split('p')[1]);
                        var x2;
                        var y2;

                        if (i == 0) {
                            //el ultimo cuadro de la l se comporta diferente
                            x2 = x - 20;
                            y2 = y - 20;
                        } else if (i == 1) {
                            x2 = x;
                            y2 = y;
                        } else if (i == 2) {
                            x2 = x + 20;
                            y2 = y + 20;
                        } else if (i == 3) {
                            x2 = x;
                            y2 = y + 40;
                        }
                        figura[i] = x2 + "p" + y2;
                    }
                    posicion = 1;
                }
            } else if (posicion == 1) {
                var mover = true;
                var i = parseInt(figura[1].split('p')[0]) / 20;
                var j = parseInt(figura[1].split('p')[1]) / 20;

                if (matriz[j][i - 1] != 0 || matriz[j][i + 1] != 0 || matriz[j + 1][i + 1] != 0) {
                    mover = false;
                }

                if (mover) {
                    for (var i = 0; i < tamFigura; i++) {
                        var x = parseInt(figura[i].split('p')[0]);
                        var y = parseInt(figura[i].split('p')[1]);
                        var x2;
                        var y2;

                        if (i == 0) {
                            //el ultimo cuadro de la l se comporta diferente
                            x2 = x - 20;
                            y2 = y + 20;
                        } else if (i == 1) {
                            x2 = x;
                            y2 = y;
                        } else if (i == 2) {
                            x2 = x + 20;
                            y2 = y - 20;
                        } else if (i == 3) {
                            x2 = x + 40;
                            y2 = y;
                        }
                        figura[i] = x2 + "p" + y2;
                    }
                    posicion = 2;
                }
            }

            for (var i = 0; i < tamFigura; i++) {
                var x = figura[i].split('p')[0];
                var y = figura[i].split('p')[1];

                ctx.drawImage(cuadro6, x, y, cuadroW, cuadroW);
            }
            break;
        case 7:
            if (posicion == 2) {
                //cuando la l queda en forma de l (gira hacia la izquierda)
                var mover = true;
                var i = parseInt(figura[1].split('p')[0]) / 20;
                var j = parseInt(figura[1].split('p')[1]) / 20;

                if (matriz[j - 1][i] != 0 || matriz[j + 1][i] != 0 || matriz[j + 1][i + 1] != 0) {
                    mover = false;
                }

                if (mover) {
                    for (var i = 0; i < tamFigura; i++) {
                        var x = parseInt(figura[i].split('p')[0]);
                        var y = parseInt(figura[i].split('p')[1]);
                        var x2;
                        var y2;

                        if (i == 0) {
                            x2 = x + 20;
                            y2 = y + 20;
                        } else if (i == 1) {
                            x2 = x;
                            y2 = y;
                        } else if (i == 2) {
                            x2 = x - 20;
                            y2 = y - 20;
                        } else if (i == 3) {
                            x2 = x + 40;
                            y2 = y;
                        }
                        figura[i] = x2 + "p" + y2;
                    }
                    posicion = 3;
                }
            } else if (posicion == 3) {
                //cuando la l queda acostada
                var mover = true;
                var i = parseInt(figura[1].split('p')[0]) / 20;
                var j = parseInt(figura[1].split('p')[1]) / 20;

                if (matriz[j][i - 1] != 0 || matriz[j][i + 1] != 0 || matriz[j - 1][i + 1] != 0) {
                    mover = false;
                }

                if (mover) {
                    for (var i = 0; i < tamFigura; i++) {
                        var x = parseInt(figura[i].split('p')[0]);
                        var y = parseInt(figura[i].split('p')[1]);
                        var x2;
                        var y2;

                        if (i == 0) {
                            x2 = x + 20;
                            y2 = y - 20;
                        } else if (i == 1) {
                            x2 = x;
                            y2 = y;
                        } else if (i == 2) {
                            x2 = x - 20;
                            y2 = y + 20;
                        } else if (i == 3) {
                            x2 = x;
                            y2 = y - 40;
                        }
                        figura[i] = x2 + "p" + y2;
                    }
                    posicion = 4;
                }
            } else if (posicion == 4) {
                //cuando la l queda parada
                var mover = true;
                var i = parseInt(figura[1].split('p')[0]) / 20;
                var j = parseInt(figura[1].split('p')[1]) / 20;

                if (matriz[j - 1][i] != 0 || matriz[j + 1][i] != 0 || matriz[j - 1][i - 1] != 0) {
                    mover = false;
                }

                if (mover) {
                    for (var i = 0; i < tamFigura; i++) {
                        var x = parseInt(figura[i].split('p')[0]);
                        var y = parseInt(figura[i].split('p')[1]);
                        var x2;
                        var y2;

                        if (i == 0) {
                            x2 = x - 20;
                            y2 = y - 20;
                        } else if (i == 1) {
                            x2 = x;
                            y2 = y;
                        } else if (i == 2) {
                            x2 = x + 20;
                            y2 = y + 20;
                        } else if (i == 3) {
                            x2 = x - 40;
                            y2 = y;
                        }
                        figura[i] = x2 + "p" + y2;
                    }
                    posicion = 1;
                }
            } else if (posicion == 1) {
                var mover = true;
                var i = parseInt(figura[1].split('p')[0]) / 20;
                var j = parseInt(figura[1].split('p')[1]) / 20;

                if (matriz[j][i - 1] != 0 || matriz[j][i + 1] != 0 || matriz[j + 1][i - 1] != 0) {
                    mover = false;
                }

                if (mover) {
                    for (var i = 0; i < tamFigura; i++) {
                        var x = parseInt(figura[i].split('p')[0]);
                        var y = parseInt(figura[i].split('p')[1]);
                        var x2;
                        var y2;

                        if (i == 0) {
                            x2 = x - 20;
                            y2 = y + 20;
                        } else if (i == 1) {
                            x2 = x;
                            y2 = y;
                        } else if (i == 2) {
                            x2 = x + 20;
                            y2 = y - 20;
                        } else if (i == 3) {
                            x2 = x;
                            y2 = y + 40;
                        }
                        figura[i] = x2 + "p" + y2;
                    }
                    posicion = 2;
                }
            }

            for (var i = 0; i < tamFigura; i++) {
                var x = figura[i].split('p')[0];
                var y = figura[i].split('p')[1];

                ctx.drawImage(cuadro7, x, y, cuadroW, cuadroW);
            }
            break;
    }
}

//pone la figura q corresponde en el segundo canvas
function obtenerFigura2() {
    //primero borrar todo el canvas
    ctx2.clearRect(0, 0, canvasFigura.width, canvasFigura.height);

    //Poner la figura en el canvas de la figura
    if (cuadroSig == 1) {
        figura2[0] = "60p" + "0"; //el primer dato es X el segundo Y
        figura2[1] = "80p" + "0";
        figura2[2] = "60p" + "20";
        figura2[3] = "80p" + "20";

        for (var i = 0; i < tamFigura; i++) {
            ctx2.drawImage(cuadro1, figura2[i].split('p')[0], figura2[i].split('p')[1], cuadroW, cuadroW);
        }
    } else if (cuadroSig == 2) {
        figura2[0] = "40p" + "0"; //el primer dato es X el segundo Y y el tercero el tipo de cuadro
        figura2[1] = "60p" + "0";
        figura2[2] = "60p" + "20";
        figura2[3] = "80p" + "20";

        for (var i = 0; i < tamFigura; i++) {
            ctx2.drawImage(cuadro2, figura2[i].split('p')[0], figura2[i].split('p')[1], cuadroW, cuadroW);
        }
    } else if (cuadroSig == 3) {
        figura2[0] = "80p" + "0";
        figura2[1] = "60p" + "0";
        figura2[2] = "60p" + "20";
        figura2[3] = "40p" + "20";

        for (var i = 0; i < tamFigura; i++) {
            ctx2.drawImage(cuadro3, figura2[i].split('p')[0], figura2[i].split('p')[1], cuadroW, cuadroW);
        }
    } else if (cuadroSig == 4) {
        figura2[0] = "40p" + "0";
        figura2[1] = "60p" + "0";
        figura2[2] = "80p" + "0";
        figura2[3] = "60p" + "20";

        for (var i = 0; i < tamFigura; i++) {
            ctx2.drawImage(cuadro4, figura2[i].split('p')[0], figura2[i].split('p')[1], cuadroW, cuadroW);
        }
    } else if (cuadroSig == 5) {
        figura2[0] = "40p" + "0"; //el primer dato es X el segundo Y y el tercero el tipo de cuadro
        figura2[1] = "60p" + "0";
        figura2[2] = "80p" + "0";
        figura2[3] = "100p" + "0";

        for (var i = 0; i < tamFigura; i++) {
            ctx2.drawImage(cuadro5, figura2[i].split('p')[0], figura2[i].split('p')[1], cuadroW, cuadroW);
        }
    } else if (cuadroSig == 6) {
        figura2[0] = "40p" + "0";
        figura2[1] = "60p" + "0";
        figura2[2] = "80p" + "0";
        figura2[3] = "80p" + "20";

        for (var i = 0; i < tamFigura; i++) {
            ctx2.drawImage(cuadro6, figura2[i].split('p')[0], figura2[i].split('p')[1], cuadroW, cuadroW);
        }
    } else if (cuadroSig == 7) {
        figura2[0] = "40p" + "0"; //el primer dato es X el segundo Y y el tercero el tipo de cuadro
        figura2[1] = "60p" + "0";
        figura2[2] = "80p" + "0";
        figura2[3] = "40p" + "20";

        for (var i = 0; i < tamFigura; i++) {
            ctx2.drawImage(cuadro7, figura2[i].split('p')[0], figura2[i].split('p')[1], cuadroW, cuadroW);
        }
    }
}

//develve true en caso q el juego haya terminado en caso contrario false
function perdio() {
    for (var i = 0; i < tamFigura; i++) {
        var j = parseInt(figura[i].split('p')[1]) / 20;

        if (j == 1) {
            return true;
        }
    }
    return false;
}

//valida si la figura colisiono con otra figura debajo
function colisionoAbajo() {

    for (var i = 0; i < tamFigura; i++) {
        var y = parseInt(figura[i].split('p')[1]);

        if (y == canvas.height - cuadroW) {
            //posCuadroColision = y/20; //posicion en y del cuadro q colisono
            return true;
        }
    }

    //validar colision con otras figuras, es necesario validar si alguno de los cuadros tiene otro cuadro debajo
    for (var x = 0; x < tamFigura; x++) {
        var i = parseInt(figura[x].split('p')[0]) / 20;
        var j = parseInt(figura[x].split('p')[1]) / 20;

        //si existe un numero mayor a 0 en columna siguiente significa q la figura ya llego al limite
        if (matriz[j + 1][i] > 0) {
            //posCuadroColision = j; //posicion en y del cuadro q colisiono
            return true;
        }
    }
}

//devuelve true en caso q la figura no pueda ser desplazada hacia la izquierda
function colisionoIzquierda() {

    for (var i = 0; i < tamFigura; i++) {
        var x = parseInt(figura[i].split('p')[0]);

        if (x == 0) {
            return true;
        }
    }

    //validar colision con alguna figura
    for (var x = 0; x < tamFigura; x++) {
        var i = parseInt(figura[x].split('p')[0]) / 20;
        var j = parseInt(figura[x].split('p')[1]) / 20;

        if (matriz[j][i - 1] > 0) {
            return true;
        }
    }
    return false;
}

//devuelve true en caso q la figura no pueda ser desplazada hacia la derecha
function colisionoDerecha() {

    for (var i = 0; i < tamFigura; i++) {
        var x = parseInt(figura[i].split('p')[0]);

        if (x == canvas.width - cuadroW) {
            return true;
        }
    }

    //validar colision con alguna figura
    for (var x = 0; x < tamFigura; x++) {
        var i = parseInt(figura[x].split('p')[0]) / 20;
        var j = parseInt(figura[x].split('p')[1]) / 20;

        if (matriz[j][i + 1] > 0) {
            return true;
        }
    }
    return false;
}

//borra la cantidad de lineas q hizo el usuario, en caso q existan
function borrarLineas() {
    lineasBorrar = 0; //permite saber la cantidad de lineas q se borraran
    var cont = 0; //permite contar la cantidad de bloques en una fila

    for (var k = 0; k < 4; k++) {
        for (var x = 0; x < 10; x++) {
            //10 es la cantidad de cuadros a lo ancho
            if (matriz[posCuadroColision - k][x] > 0) {
                //desplazar la validacion hacia arriba
                cont++;
            }
        }

        if (cont == 10) {
            infoLineas[lineasBorrar] = posCuadroColision - k;
            lineasBorrar++;
        }
        cont = 0;
    }
    //$('#texto').empty().append(lineas);
    if (lineasBorrar == 0) {
        if (sonidoActivo) {
            // sonidoLlego.play();
        }
        return;
    } else {
        //sumar las lineas
        lineas += lineasBorrar;
        (0, _jquery2['default'])('#lineas').empty().append(lineas);
        if (sonidoActivo) {
            // sonidoBorrar.play();
        }
    }

    anchoBorrar = 0;
    timerBorrar = setInterval(animacionBorrar, 50);

    for (var x = lineasBorrar - 1; x >= 0; x--) {
        //por cada linea borrada hay q bajar los datos del vector
        for (var i = infoLineas[x]; i >= 1; i--) {
            for (var j = 0; j < 10; j++) {
                matriz[i][j] = matriz[i - 1][j];
            }
        }
    }
}

function animacionBorrar() {

    anchoBorrar += 20;

    for (var i = 0; i < lineasBorrar; i++) {
        ctx.clearRect(0, infoLineas[i] * 20, anchoBorrar, cuadroW);
        //ctx.drawImage(single,60,infoLineas[i] * 20,80,cuadroW); //Poner el texto de single para acompañar la animacion
    }

    if (anchoBorrar == 200) {
        //borrar el escenario y pintarlo de nuevo
        ctx.clearRect(0, 0, canvas.width, canvas.height); //eliminar todo lo dibujado y volverlo a dibujar
        //poner inmediatamente la figura actual

        moverFigura("n"); //n sigfinica q la figura se pinta en el mismo punto

        for (var i = 0; i < 21; i++) {
            for (var j = 0; j < 10; j++) {
                var c = matriz[i][j]; //en la matriz se guarda el numero del cuadro q corresponde a esa posicion
                switch (c) {
                    case 1:
                        ctx.drawImage(cuadro1, j * 20, i * 20, cuadroW, cuadroW);
                        break;
                    case 2:
                        ctx.drawImage(cuadro2, j * 20, i * 20, cuadroW, cuadroW);
                        break;
                    case 3:
                        ctx.drawImage(cuadro3, j * 20, i * 20, cuadroW, cuadroW);
                        break;
                    case 4:
                        ctx.drawImage(cuadro4, j * 20, i * 20, cuadroW, cuadroW);
                        break;
                    case 5:
                        ctx.drawImage(cuadro5, j * 20, i * 20, cuadroW, cuadroW);
                        break;
                    case 6:
                        ctx.drawImage(cuadro6, j * 20, i * 20, cuadroW, cuadroW);
                        break;
                    case 7:
                        ctx.drawImage(cuadro7, j * 20, i * 20, cuadroW, cuadroW);
                        break;
                }
            }
        }

        clearInterval(timerBorrar);
    }
}

function reiniciar() {

    for (var i = 0; i < 21; i++) {
        for (var j = 0; j < 10; j++) {
            matriz[i][j] = 0;
        }
    }

    nivel = 1;
    lineas = 0;
    score = 0;
    velocidad = 800;
    posicion = 2;
    posDerecha = true;

    (0, _jquery2['default'])('#nivel').empty().append(nivel);
    (0, _jquery2['default'])('#lineas').empty().append(lineas);
    (0, _jquery2['default'])('#score').empty().append(score);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cuadroSig = aleatorio(1, 8);
    obtenerFigura();
    cuadroSig = aleatorio(1, 8);
    obtenerFigura2();

    clearInterval(timerLoop);
    timerLoop = setInterval(loop, velocidad);
}

//guarda en posCuadroColision, el cuadro mas bajo q corresponde a la figura
function ObtenerCuadroMasBajo() {
    var bajo = -1;

    for (var x = 0; x < tamFigura; x++) {
        var j = parseInt(figura[x].split('p')[1]) / 20;

        if (j > bajo) {
            bajo = j;
        }
    }
    posCuadroColision = bajo;
}

function sumarScore() {
    //sumar score, dependiendo del tipo de figura
    if (cuadro == 1) {
        score += 3 * nivel; //si el nivel es masl alto se suma mas puntos
    } else if (cuadro == 2) {
            score += 5 * nivel;
        } else if (cuadro == 3) {
            score += 5 * nivel;
        } else if (cuadro == 4) {
            score += 4 * nivel;
        } else if (cuadro == 5) {
            score += 2 * nivel;
        } else if (cuadro == 6) {
            score += 4 * nivel;
        } else if (cuadro == 7) {
            score += 4 * nivel;
        }
    (0, _jquery2['default'])('#score').empty().append(score);
}

//limpia de la pantalla la figura actual
function limpiarFigura() {
    for (var i = 0; i < tamFigura; i++) {
        var x = figura[i].split('p')[0];
        var y = figura[i].split('p')[1];

        ctx.clearRect(x, y, cuadroW, cuadroW);
    }
}

//obtiene la informacion de un atributo que esta varias veces, recibe la cadena el atributo y el array donde se almacenara
function obtenerAtributos(cadenaJson, atributoJson, arrayJson) {
    for (var i = 0; i < 5; i++) {
        arrayJson[i] = obtenerAtributo(cadenaJson, atributoJson);

        //quitar el atributo para no repetir el dato
        var indexJson = new Number(cadenaJson.indexOf(atributoJson));
        cadenaJson = cadenaJson.substring(indexJson + atributoJson.length);
    }
}

//obtiene todos los valores de un atributo, se diferencia de la otra funcion que no necesita conocer cuantas veces esta el valor
function obtenerAtributos2(cadenaJson, atributoJson, array) {
    var termino = false;
    var i = 0;

    while (!termino) {
        if (obtenerAtributo(cadenaJson, atributoJson) != '') {
            array[i] = obtenerAtributo(cadenaJson, atributoJson);
            i++;
            var indexJson = new Number(cadenaJson.indexOf(atributoJson));
            cadenaJson = cadenaJson.substring(indexJson + atributoJson.length);
        } else {
            termino = true;
        }
    }
}

//obtiene el atributo de un estructura json, recibe la cadena y el atributo que se va a consultar
function obtenerAtributo(cadena, atributo) {
    var index = new Number(cadena.indexOf(atributo));

    if (index == -1) {
        return '';
    }
    var sub = cadena.substring(index + 4 + atributo.length);

    var index2 = new Number(sub.indexOf(','));
    var resultado = sub.substring(0, index2 - 1); //el dato a consultar lo obtenemos con la segunda cadena, la cual en su posicion 0 tiene el inicio del dato
    return resultado;
}

function limpiarVector(vector) {
    for (var i = 0; i < vector.length; i++) {
        vector[i] = -1;
    }
}

function aleatorio(inferior, superior) {
    var numPosibilidades = superior - inferior;
    var aleat = Math.random() * numPosibilidades;
    aleat = Math.floor(aleat);
    return parseInt(inferior) + aleat;
}

exports['default'] = startTretis;
module.exports = exports['default'];

},{"jquery":21}],50:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _cedula = require('./cedula');

var _cedula2 = _interopRequireDefault(_cedula);

function Validate() {
    (0, _jquery2['default'])(".file-image").on("change", onChangeImageInput);
    (0, _jquery2['default'])(".cedula").keypress(onCedula);
    (0, _jquery2['default'])("#LeccionCalificarHeader-nota").keypress(onNota);
    (0, _jquery2['default'])(".cedula").blur(onValidarDocumento);
    (0, _jquery2['default'])("#passworduser").blur(validarPass);
}

function validarPass() {
    // var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,15}/;
    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,}$/;

    var pass = (0, _jquery2['default'])("#passworduser").val();

    if (regex.test(pass)) {
        (0, _jquery2['default'])(".msg-register").fadeOut();
        (0, _jquery2['default'])("#registerUser").attr("disabled", false);
        (0, _jquery2['default'])("#registerUser").css("cursor", "pointer");
    } else {
        (0, _jquery2['default'])("#registerUser").attr("disabled", true);
        (0, _jquery2['default'])("#registerUser").css("cursor", "no-drop");
        (0, _jquery2['default'])(".msg-register").fadeIn();
        (0, _jquery2['default'])(".msg-register").html("Debes ingresar una contraseña minimo 8 digitos debe contener un letra miniscula, una mayuscula, un numero, no espacios y un carateter especial");
    }
}

function onChangeImageInput(e) {
    var file = e.target.files[0];
    if (file.type == "image/jpeg" || file.type == "image/png") (0, _jquery2['default'])(".name-file").html(file.name);else {
        alert("Debe subir una foto.");
        (0, _jquery2['default'])(".file-image").val("");
    }
}

function onCedula(e) {
    if (e.which < 48 || e.which > 57) e.preventDefault();
    if (e.which == 13) onCedulaValidate();
}

function onNota(e) {
    if (e.which < 48 || e.which > 57) e.preventDefault();
}
function onValidarDocumento() {
    if (!(0, _cedula2['default'])(this.value)) {
        (0, _jquery2['default'])(".botonValidate").attr("disabled", true);
        (0, _jquery2['default'])(".botonValidate").css("cursor", "no-drop");
    } else {
        (0, _jquery2['default'])(".botonValidate").attr("disabled", false);
        (0, _jquery2['default'])(".botonValidate").css("cursor", "pointer");
    }
}

function onCedulaValidate() {
    var cedu = (0, _jquery2['default'])(".cedula");

    if (!(0, _cedula2['default'])(cedu.val())) {
        (0, _jquery2['default'])(".botonValidate").attr("disabled", true);
        (0, _jquery2['default'])(".botonValidate").css("cursor", "no-drop");
    } else {
        (0, _jquery2['default'])(".file-image").focus();
        (0, _jquery2['default'])(".botonValidate").attr("disabled", false);
        (0, _jquery2['default'])(".botonValidate").css("cursor", "pointer");
    }
}

exports['default'] = Validate;
module.exports = exports['default'];

},{"./cedula":26,"jquery":21}]},{},[31]);
