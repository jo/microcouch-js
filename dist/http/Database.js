var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

// node_modules/spark-md5/spark-md5.js
var require_spark_md5 = __commonJS({
  "node_modules/spark-md5/spark-md5.js"(exports, module) {
    (function(factory) {
      if (typeof exports === "object") {
        module.exports = factory();
      } else if (typeof define === "function" && define.amd) {
        define(factory);
      } else {
        var glob;
        try {
          glob = window;
        } catch (e) {
          glob = self;
        }
        glob.SparkMD5 = factory();
      }
    })(function(undefined2) {
      "use strict";
      var add32 = function(a, b) {
        return a + b & 4294967295;
      }, hex_chr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
      function cmn(q, a, b, x, s, t) {
        a = add32(add32(a, q), add32(x, t));
        return add32(a << s | a >>> 32 - s, b);
      }
      function md5cycle(x, k) {
        var a = x[0], b = x[1], c = x[2], d = x[3];
        a += (b & c | ~b & d) + k[0] - 680876936 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[1] - 389564586 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[2] + 606105819 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[3] - 1044525330 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[4] - 176418897 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[5] + 1200080426 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[6] - 1473231341 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[7] - 45705983 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[8] + 1770035416 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[9] - 1958414417 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[10] - 42063 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[11] - 1990404162 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[12] + 1804603682 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[13] - 40341101 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[14] - 1502002290 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[15] + 1236535329 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & d | c & ~d) + k[1] - 165796510 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[6] - 1069501632 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[11] + 643717713 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[0] - 373897302 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[5] - 701558691 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[10] + 38016083 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[15] - 660478335 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[4] - 405537848 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[9] + 568446438 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[14] - 1019803690 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[3] - 187363961 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[8] + 1163531501 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[13] - 1444681467 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[2] - 51403784 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[7] + 1735328473 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[12] - 1926607734 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b ^ c ^ d) + k[5] - 378558 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[8] - 2022574463 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[11] + 1839030562 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[14] - 35309556 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[1] - 1530992060 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[4] + 1272893353 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[7] - 155497632 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[10] - 1094730640 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[13] + 681279174 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[0] - 358537222 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[3] - 722521979 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[6] + 76029189 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[9] - 640364487 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[12] - 421815835 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[15] + 530742520 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[2] - 995338651 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[7] + 1126891415 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[14] - 1416354905 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[5] - 57434055 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[3] - 1894986606 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[10] - 1051523 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[1] - 2054922799 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[15] - 30611744 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[6] - 1560198380 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[13] + 1309151649 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[11] - 1120210379 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[2] + 718787259 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[9] - 343485551 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        x[0] = a + x[0] | 0;
        x[1] = b + x[1] | 0;
        x[2] = c + x[2] | 0;
        x[3] = d + x[3] | 0;
      }
      function md5blk(s) {
        var md5blks = [], i;
        for (i = 0; i < 64; i += 4) {
          md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
        }
        return md5blks;
      }
      function md5blk_array(a) {
        var md5blks = [], i;
        for (i = 0; i < 64; i += 4) {
          md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24);
        }
        return md5blks;
      }
      function md51(s) {
        var n = s.length, state = [1732584193, -271733879, -1732584194, 271733878], i, length, tail, tmp, lo, hi;
        for (i = 64; i <= n; i += 64) {
          md5cycle(state, md5blk(s.substring(i - 64, i)));
        }
        s = s.substring(i - 64);
        length = s.length;
        tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < length; i += 1) {
          tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
        }
        tail[i >> 2] |= 128 << (i % 4 << 3);
        if (i > 55) {
          md5cycle(state, tail);
          for (i = 0; i < 16; i += 1) {
            tail[i] = 0;
          }
        }
        tmp = n * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;
        tail[14] = lo;
        tail[15] = hi;
        md5cycle(state, tail);
        return state;
      }
      function md51_array(a) {
        var n = a.length, state = [1732584193, -271733879, -1732584194, 271733878], i, length, tail, tmp, lo, hi;
        for (i = 64; i <= n; i += 64) {
          md5cycle(state, md5blk_array(a.subarray(i - 64, i)));
        }
        a = i - 64 < n ? a.subarray(i - 64) : new Uint8Array(0);
        length = a.length;
        tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < length; i += 1) {
          tail[i >> 2] |= a[i] << (i % 4 << 3);
        }
        tail[i >> 2] |= 128 << (i % 4 << 3);
        if (i > 55) {
          md5cycle(state, tail);
          for (i = 0; i < 16; i += 1) {
            tail[i] = 0;
          }
        }
        tmp = n * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;
        tail[14] = lo;
        tail[15] = hi;
        md5cycle(state, tail);
        return state;
      }
      function rhex(n) {
        var s = "", j;
        for (j = 0; j < 4; j += 1) {
          s += hex_chr[n >> j * 8 + 4 & 15] + hex_chr[n >> j * 8 & 15];
        }
        return s;
      }
      function hex(x) {
        var i;
        for (i = 0; i < x.length; i += 1) {
          x[i] = rhex(x[i]);
        }
        return x.join("");
      }
      if (hex(md51("hello")) !== "5d41402abc4b2a76b9719d911017c592") {
        add32 = function(x, y) {
          var lsw = (x & 65535) + (y & 65535), msw = (x >> 16) + (y >> 16) + (lsw >> 16);
          return msw << 16 | lsw & 65535;
        };
      }
      if (typeof ArrayBuffer !== "undefined" && !ArrayBuffer.prototype.slice) {
        (function() {
          function clamp(val, length) {
            val = val | 0 || 0;
            if (val < 0) {
              return Math.max(val + length, 0);
            }
            return Math.min(val, length);
          }
          ArrayBuffer.prototype.slice = function(from, to) {
            var length = this.byteLength, begin = clamp(from, length), end = length, num, target, targetArray, sourceArray;
            if (to !== undefined2) {
              end = clamp(to, length);
            }
            if (begin > end) {
              return new ArrayBuffer(0);
            }
            num = end - begin;
            target = new ArrayBuffer(num);
            targetArray = new Uint8Array(target);
            sourceArray = new Uint8Array(this, begin, num);
            targetArray.set(sourceArray);
            return target;
          };
        })();
      }
      function toUtf8(str) {
        if (/[\u0080-\uFFFF]/.test(str)) {
          str = unescape(encodeURIComponent(str));
        }
        return str;
      }
      function utf8Str2ArrayBuffer(str, returnUInt8Array) {
        var length = str.length, buff = new ArrayBuffer(length), arr = new Uint8Array(buff), i;
        for (i = 0; i < length; i += 1) {
          arr[i] = str.charCodeAt(i);
        }
        return returnUInt8Array ? arr : buff;
      }
      function arrayBuffer2Utf8Str(buff) {
        return String.fromCharCode.apply(null, new Uint8Array(buff));
      }
      function concatenateArrayBuffers(first, second, returnUInt8Array) {
        var result = new Uint8Array(first.byteLength + second.byteLength);
        result.set(new Uint8Array(first));
        result.set(new Uint8Array(second), first.byteLength);
        return returnUInt8Array ? result : result.buffer;
      }
      function hexToBinaryString(hex2) {
        var bytes = [], length = hex2.length, x;
        for (x = 0; x < length - 1; x += 2) {
          bytes.push(parseInt(hex2.substr(x, 2), 16));
        }
        return String.fromCharCode.apply(String, bytes);
      }
      function SparkMD52() {
        this.reset();
      }
      SparkMD52.prototype.append = function(str) {
        this.appendBinary(toUtf8(str));
        return this;
      };
      SparkMD52.prototype.appendBinary = function(contents) {
        this._buff += contents;
        this._length += contents.length;
        var length = this._buff.length, i;
        for (i = 64; i <= length; i += 64) {
          md5cycle(this._hash, md5blk(this._buff.substring(i - 64, i)));
        }
        this._buff = this._buff.substring(i - 64);
        return this;
      };
      SparkMD52.prototype.end = function(raw) {
        var buff = this._buff, length = buff.length, i, tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ret;
        for (i = 0; i < length; i += 1) {
          tail[i >> 2] |= buff.charCodeAt(i) << (i % 4 << 3);
        }
        this._finish(tail, length);
        ret = hex(this._hash);
        if (raw) {
          ret = hexToBinaryString(ret);
        }
        this.reset();
        return ret;
      };
      SparkMD52.prototype.reset = function() {
        this._buff = "";
        this._length = 0;
        this._hash = [1732584193, -271733879, -1732584194, 271733878];
        return this;
      };
      SparkMD52.prototype.getState = function() {
        return {
          buff: this._buff,
          length: this._length,
          hash: this._hash.slice()
        };
      };
      SparkMD52.prototype.setState = function(state) {
        this._buff = state.buff;
        this._length = state.length;
        this._hash = state.hash;
        return this;
      };
      SparkMD52.prototype.destroy = function() {
        delete this._hash;
        delete this._buff;
        delete this._length;
      };
      SparkMD52.prototype._finish = function(tail, length) {
        var i = length, tmp, lo, hi;
        tail[i >> 2] |= 128 << (i % 4 << 3);
        if (i > 55) {
          md5cycle(this._hash, tail);
          for (i = 0; i < 16; i += 1) {
            tail[i] = 0;
          }
        }
        tmp = this._length * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;
        tail[14] = lo;
        tail[15] = hi;
        md5cycle(this._hash, tail);
      };
      SparkMD52.hash = function(str, raw) {
        return SparkMD52.hashBinary(toUtf8(str), raw);
      };
      SparkMD52.hashBinary = function(content, raw) {
        var hash = md51(content), ret = hex(hash);
        return raw ? hexToBinaryString(ret) : ret;
      };
      SparkMD52.ArrayBuffer = function() {
        this.reset();
      };
      SparkMD52.ArrayBuffer.prototype.append = function(arr) {
        var buff = concatenateArrayBuffers(this._buff.buffer, arr, true), length = buff.length, i;
        this._length += arr.byteLength;
        for (i = 64; i <= length; i += 64) {
          md5cycle(this._hash, md5blk_array(buff.subarray(i - 64, i)));
        }
        this._buff = i - 64 < length ? new Uint8Array(buff.buffer.slice(i - 64)) : new Uint8Array(0);
        return this;
      };
      SparkMD52.ArrayBuffer.prototype.end = function(raw) {
        var buff = this._buff, length = buff.length, tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], i, ret;
        for (i = 0; i < length; i += 1) {
          tail[i >> 2] |= buff[i] << (i % 4 << 3);
        }
        this._finish(tail, length);
        ret = hex(this._hash);
        if (raw) {
          ret = hexToBinaryString(ret);
        }
        this.reset();
        return ret;
      };
      SparkMD52.ArrayBuffer.prototype.reset = function() {
        this._buff = new Uint8Array(0);
        this._length = 0;
        this._hash = [1732584193, -271733879, -1732584194, 271733878];
        return this;
      };
      SparkMD52.ArrayBuffer.prototype.getState = function() {
        var state = SparkMD52.prototype.getState.call(this);
        state.buff = arrayBuffer2Utf8Str(state.buff);
        return state;
      };
      SparkMD52.ArrayBuffer.prototype.setState = function(state) {
        state.buff = utf8Str2ArrayBuffer(state.buff, true);
        return SparkMD52.prototype.setState.call(this, state);
      };
      SparkMD52.ArrayBuffer.prototype.destroy = SparkMD52.prototype.destroy;
      SparkMD52.ArrayBuffer.prototype._finish = SparkMD52.prototype._finish;
      SparkMD52.ArrayBuffer.hash = function(arr, raw) {
        var hash = md51_array(new Uint8Array(arr)), ret = hex(hash);
        return raw ? hexToBinaryString(ret) : ret;
      };
      return SparkMD52;
    });
  }
});

// node_modules/web-streams-polyfill/dist/ponyfill.mjs
var SymbolPolyfill = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol : function(description) {
  return "Symbol(" + description + ")";
};
function noop() {
  return void 0;
}
function getGlobals() {
  if (typeof self !== "undefined") {
    return self;
  } else if (typeof window !== "undefined") {
    return window;
  } else if (typeof global !== "undefined") {
    return global;
  }
  return void 0;
}
var globals = getGlobals();
function typeIsObject(x) {
  return typeof x === "object" && x !== null || typeof x === "function";
}
var rethrowAssertionErrorRejection = noop;
var originalPromise = Promise;
var originalPromiseThen = Promise.prototype.then;
var originalPromiseResolve = Promise.resolve.bind(originalPromise);
var originalPromiseReject = Promise.reject.bind(originalPromise);
function newPromise(executor) {
  return new originalPromise(executor);
}
function promiseResolvedWith(value) {
  return originalPromiseResolve(value);
}
function promiseRejectedWith(reason) {
  return originalPromiseReject(reason);
}
function PerformPromiseThen(promise, onFulfilled, onRejected) {
  return originalPromiseThen.call(promise, onFulfilled, onRejected);
}
function uponPromise(promise, onFulfilled, onRejected) {
  PerformPromiseThen(PerformPromiseThen(promise, onFulfilled, onRejected), void 0, rethrowAssertionErrorRejection);
}
function uponFulfillment(promise, onFulfilled) {
  uponPromise(promise, onFulfilled);
}
function uponRejection(promise, onRejected) {
  uponPromise(promise, void 0, onRejected);
}
function transformPromiseWith(promise, fulfillmentHandler, rejectionHandler) {
  return PerformPromiseThen(promise, fulfillmentHandler, rejectionHandler);
}
function setPromiseIsHandledToTrue(promise) {
  PerformPromiseThen(promise, void 0, rethrowAssertionErrorRejection);
}
var queueMicrotask = function() {
  var globalQueueMicrotask = globals && globals.queueMicrotask;
  if (typeof globalQueueMicrotask === "function") {
    return globalQueueMicrotask;
  }
  var resolvedPromise = promiseResolvedWith(void 0);
  return function(fn) {
    return PerformPromiseThen(resolvedPromise, fn);
  };
}();
function reflectCall(F, V, args) {
  if (typeof F !== "function") {
    throw new TypeError("Argument is not a function");
  }
  return Function.prototype.apply.call(F, V, args);
}
function promiseCall(F, V, args) {
  try {
    return promiseResolvedWith(reflectCall(F, V, args));
  } catch (value) {
    return promiseRejectedWith(value);
  }
}
var QUEUE_MAX_ARRAY_SIZE = 16384;
var SimpleQueue = function() {
  function SimpleQueue2() {
    this._cursor = 0;
    this._size = 0;
    this._front = {
      _elements: [],
      _next: void 0
    };
    this._back = this._front;
    this._cursor = 0;
    this._size = 0;
  }
  Object.defineProperty(SimpleQueue2.prototype, "length", {
    get: function() {
      return this._size;
    },
    enumerable: false,
    configurable: true
  });
  SimpleQueue2.prototype.push = function(element) {
    var oldBack = this._back;
    var newBack = oldBack;
    if (oldBack._elements.length === QUEUE_MAX_ARRAY_SIZE - 1) {
      newBack = {
        _elements: [],
        _next: void 0
      };
    }
    oldBack._elements.push(element);
    if (newBack !== oldBack) {
      this._back = newBack;
      oldBack._next = newBack;
    }
    ++this._size;
  };
  SimpleQueue2.prototype.shift = function() {
    var oldFront = this._front;
    var newFront = oldFront;
    var oldCursor = this._cursor;
    var newCursor = oldCursor + 1;
    var elements = oldFront._elements;
    var element = elements[oldCursor];
    if (newCursor === QUEUE_MAX_ARRAY_SIZE) {
      newFront = oldFront._next;
      newCursor = 0;
    }
    --this._size;
    this._cursor = newCursor;
    if (oldFront !== newFront) {
      this._front = newFront;
    }
    elements[oldCursor] = void 0;
    return element;
  };
  SimpleQueue2.prototype.forEach = function(callback) {
    var i = this._cursor;
    var node = this._front;
    var elements = node._elements;
    while (i !== elements.length || node._next !== void 0) {
      if (i === elements.length) {
        node = node._next;
        elements = node._elements;
        i = 0;
        if (elements.length === 0) {
          break;
        }
      }
      callback(elements[i]);
      ++i;
    }
  };
  SimpleQueue2.prototype.peek = function() {
    var front = this._front;
    var cursor = this._cursor;
    return front._elements[cursor];
  };
  return SimpleQueue2;
}();
function ReadableStreamReaderGenericInitialize(reader, stream) {
  reader._ownerReadableStream = stream;
  stream._reader = reader;
  if (stream._state === "readable") {
    defaultReaderClosedPromiseInitialize(reader);
  } else if (stream._state === "closed") {
    defaultReaderClosedPromiseInitializeAsResolved(reader);
  } else {
    defaultReaderClosedPromiseInitializeAsRejected(reader, stream._storedError);
  }
}
function ReadableStreamReaderGenericCancel(reader, reason) {
  var stream = reader._ownerReadableStream;
  return ReadableStreamCancel(stream, reason);
}
function ReadableStreamReaderGenericRelease(reader) {
  if (reader._ownerReadableStream._state === "readable") {
    defaultReaderClosedPromiseReject(reader, new TypeError("Reader was released and can no longer be used to monitor the stream's closedness"));
  } else {
    defaultReaderClosedPromiseResetToRejected(reader, new TypeError("Reader was released and can no longer be used to monitor the stream's closedness"));
  }
  reader._ownerReadableStream._reader = void 0;
  reader._ownerReadableStream = void 0;
}
function readerLockException(name) {
  return new TypeError("Cannot " + name + " a stream using a released reader");
}
function defaultReaderClosedPromiseInitialize(reader) {
  reader._closedPromise = newPromise(function(resolve, reject) {
    reader._closedPromise_resolve = resolve;
    reader._closedPromise_reject = reject;
  });
}
function defaultReaderClosedPromiseInitializeAsRejected(reader, reason) {
  defaultReaderClosedPromiseInitialize(reader);
  defaultReaderClosedPromiseReject(reader, reason);
}
function defaultReaderClosedPromiseInitializeAsResolved(reader) {
  defaultReaderClosedPromiseInitialize(reader);
  defaultReaderClosedPromiseResolve(reader);
}
function defaultReaderClosedPromiseReject(reader, reason) {
  if (reader._closedPromise_reject === void 0) {
    return;
  }
  setPromiseIsHandledToTrue(reader._closedPromise);
  reader._closedPromise_reject(reason);
  reader._closedPromise_resolve = void 0;
  reader._closedPromise_reject = void 0;
}
function defaultReaderClosedPromiseResetToRejected(reader, reason) {
  defaultReaderClosedPromiseInitializeAsRejected(reader, reason);
}
function defaultReaderClosedPromiseResolve(reader) {
  if (reader._closedPromise_resolve === void 0) {
    return;
  }
  reader._closedPromise_resolve(void 0);
  reader._closedPromise_resolve = void 0;
  reader._closedPromise_reject = void 0;
}
var AbortSteps = SymbolPolyfill("[[AbortSteps]]");
var ErrorSteps = SymbolPolyfill("[[ErrorSteps]]");
var CancelSteps = SymbolPolyfill("[[CancelSteps]]");
var PullSteps = SymbolPolyfill("[[PullSteps]]");
var NumberIsFinite = Number.isFinite || function(x) {
  return typeof x === "number" && isFinite(x);
};
var MathTrunc = Math.trunc || function(v) {
  return v < 0 ? Math.ceil(v) : Math.floor(v);
};
function isDictionary(x) {
  return typeof x === "object" || typeof x === "function";
}
function assertDictionary(obj, context) {
  if (obj !== void 0 && !isDictionary(obj)) {
    throw new TypeError(context + " is not an object.");
  }
}
function assertFunction(x, context) {
  if (typeof x !== "function") {
    throw new TypeError(context + " is not a function.");
  }
}
function isObject(x) {
  return typeof x === "object" && x !== null || typeof x === "function";
}
function assertObject(x, context) {
  if (!isObject(x)) {
    throw new TypeError(context + " is not an object.");
  }
}
function assertRequiredArgument(x, position, context) {
  if (x === void 0) {
    throw new TypeError("Parameter " + position + " is required in '" + context + "'.");
  }
}
function assertRequiredField(x, field, context) {
  if (x === void 0) {
    throw new TypeError(field + " is required in '" + context + "'.");
  }
}
function convertUnrestrictedDouble(value) {
  return Number(value);
}
function censorNegativeZero(x) {
  return x === 0 ? 0 : x;
}
function integerPart(x) {
  return censorNegativeZero(MathTrunc(x));
}
function convertUnsignedLongLongWithEnforceRange(value, context) {
  var lowerBound = 0;
  var upperBound = Number.MAX_SAFE_INTEGER;
  var x = Number(value);
  x = censorNegativeZero(x);
  if (!NumberIsFinite(x)) {
    throw new TypeError(context + " is not a finite number");
  }
  x = integerPart(x);
  if (x < lowerBound || x > upperBound) {
    throw new TypeError(context + " is outside the accepted range of " + lowerBound + " to " + upperBound + ", inclusive");
  }
  if (!NumberIsFinite(x) || x === 0) {
    return 0;
  }
  return x;
}
function assertReadableStream(x, context) {
  if (!IsReadableStream(x)) {
    throw new TypeError(context + " is not a ReadableStream.");
  }
}
function AcquireReadableStreamDefaultReader(stream) {
  return new ReadableStreamDefaultReader(stream);
}
function ReadableStreamAddReadRequest(stream, readRequest) {
  stream._reader._readRequests.push(readRequest);
}
function ReadableStreamFulfillReadRequest(stream, chunk, done) {
  var reader = stream._reader;
  var readRequest = reader._readRequests.shift();
  if (done) {
    readRequest._closeSteps();
  } else {
    readRequest._chunkSteps(chunk);
  }
}
function ReadableStreamGetNumReadRequests(stream) {
  return stream._reader._readRequests.length;
}
function ReadableStreamHasDefaultReader(stream) {
  var reader = stream._reader;
  if (reader === void 0) {
    return false;
  }
  if (!IsReadableStreamDefaultReader(reader)) {
    return false;
  }
  return true;
}
var ReadableStreamDefaultReader = function() {
  function ReadableStreamDefaultReader2(stream) {
    assertRequiredArgument(stream, 1, "ReadableStreamDefaultReader");
    assertReadableStream(stream, "First parameter");
    if (IsReadableStreamLocked(stream)) {
      throw new TypeError("This stream has already been locked for exclusive reading by another reader");
    }
    ReadableStreamReaderGenericInitialize(this, stream);
    this._readRequests = new SimpleQueue();
  }
  Object.defineProperty(ReadableStreamDefaultReader2.prototype, "closed", {
    get: function() {
      if (!IsReadableStreamDefaultReader(this)) {
        return promiseRejectedWith(defaultReaderBrandCheckException("closed"));
      }
      return this._closedPromise;
    },
    enumerable: false,
    configurable: true
  });
  ReadableStreamDefaultReader2.prototype.cancel = function(reason) {
    if (reason === void 0) {
      reason = void 0;
    }
    if (!IsReadableStreamDefaultReader(this)) {
      return promiseRejectedWith(defaultReaderBrandCheckException("cancel"));
    }
    if (this._ownerReadableStream === void 0) {
      return promiseRejectedWith(readerLockException("cancel"));
    }
    return ReadableStreamReaderGenericCancel(this, reason);
  };
  ReadableStreamDefaultReader2.prototype.read = function() {
    if (!IsReadableStreamDefaultReader(this)) {
      return promiseRejectedWith(defaultReaderBrandCheckException("read"));
    }
    if (this._ownerReadableStream === void 0) {
      return promiseRejectedWith(readerLockException("read from"));
    }
    var resolvePromise;
    var rejectPromise;
    var promise = newPromise(function(resolve, reject) {
      resolvePromise = resolve;
      rejectPromise = reject;
    });
    var readRequest = {
      _chunkSteps: function(chunk) {
        return resolvePromise({ value: chunk, done: false });
      },
      _closeSteps: function() {
        return resolvePromise({ value: void 0, done: true });
      },
      _errorSteps: function(e) {
        return rejectPromise(e);
      }
    };
    ReadableStreamDefaultReaderRead(this, readRequest);
    return promise;
  };
  ReadableStreamDefaultReader2.prototype.releaseLock = function() {
    if (!IsReadableStreamDefaultReader(this)) {
      throw defaultReaderBrandCheckException("releaseLock");
    }
    if (this._ownerReadableStream === void 0) {
      return;
    }
    if (this._readRequests.length > 0) {
      throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
    }
    ReadableStreamReaderGenericRelease(this);
  };
  return ReadableStreamDefaultReader2;
}();
Object.defineProperties(ReadableStreamDefaultReader.prototype, {
  cancel: { enumerable: true },
  read: { enumerable: true },
  releaseLock: { enumerable: true },
  closed: { enumerable: true }
});
if (typeof SymbolPolyfill.toStringTag === "symbol") {
  Object.defineProperty(ReadableStreamDefaultReader.prototype, SymbolPolyfill.toStringTag, {
    value: "ReadableStreamDefaultReader",
    configurable: true
  });
}
function IsReadableStreamDefaultReader(x) {
  if (!typeIsObject(x)) {
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(x, "_readRequests")) {
    return false;
  }
  return x instanceof ReadableStreamDefaultReader;
}
function ReadableStreamDefaultReaderRead(reader, readRequest) {
  var stream = reader._ownerReadableStream;
  stream._disturbed = true;
  if (stream._state === "closed") {
    readRequest._closeSteps();
  } else if (stream._state === "errored") {
    readRequest._errorSteps(stream._storedError);
  } else {
    stream._readableStreamController[PullSteps](readRequest);
  }
}
function defaultReaderBrandCheckException(name) {
  return new TypeError("ReadableStreamDefaultReader.prototype." + name + " can only be used on a ReadableStreamDefaultReader");
}
var _a;
var AsyncIteratorPrototype;
if (typeof SymbolPolyfill.asyncIterator === "symbol") {
  AsyncIteratorPrototype = (_a = {}, _a[SymbolPolyfill.asyncIterator] = function() {
    return this;
  }, _a);
  Object.defineProperty(AsyncIteratorPrototype, SymbolPolyfill.asyncIterator, { enumerable: false });
}
var ReadableStreamAsyncIteratorImpl = function() {
  function ReadableStreamAsyncIteratorImpl2(reader, preventCancel) {
    this._ongoingPromise = void 0;
    this._isFinished = false;
    this._reader = reader;
    this._preventCancel = preventCancel;
  }
  ReadableStreamAsyncIteratorImpl2.prototype.next = function() {
    var _this = this;
    var nextSteps = function() {
      return _this._nextSteps();
    };
    this._ongoingPromise = this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, nextSteps, nextSteps) : nextSteps();
    return this._ongoingPromise;
  };
  ReadableStreamAsyncIteratorImpl2.prototype.return = function(value) {
    var _this = this;
    var returnSteps = function() {
      return _this._returnSteps(value);
    };
    return this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, returnSteps, returnSteps) : returnSteps();
  };
  ReadableStreamAsyncIteratorImpl2.prototype._nextSteps = function() {
    var _this = this;
    if (this._isFinished) {
      return Promise.resolve({ value: void 0, done: true });
    }
    var reader = this._reader;
    if (reader._ownerReadableStream === void 0) {
      return promiseRejectedWith(readerLockException("iterate"));
    }
    var resolvePromise;
    var rejectPromise;
    var promise = newPromise(function(resolve, reject) {
      resolvePromise = resolve;
      rejectPromise = reject;
    });
    var readRequest = {
      _chunkSteps: function(chunk) {
        _this._ongoingPromise = void 0;
        queueMicrotask(function() {
          return resolvePromise({ value: chunk, done: false });
        });
      },
      _closeSteps: function() {
        _this._ongoingPromise = void 0;
        _this._isFinished = true;
        ReadableStreamReaderGenericRelease(reader);
        resolvePromise({ value: void 0, done: true });
      },
      _errorSteps: function(reason) {
        _this._ongoingPromise = void 0;
        _this._isFinished = true;
        ReadableStreamReaderGenericRelease(reader);
        rejectPromise(reason);
      }
    };
    ReadableStreamDefaultReaderRead(reader, readRequest);
    return promise;
  };
  ReadableStreamAsyncIteratorImpl2.prototype._returnSteps = function(value) {
    if (this._isFinished) {
      return Promise.resolve({ value, done: true });
    }
    this._isFinished = true;
    var reader = this._reader;
    if (reader._ownerReadableStream === void 0) {
      return promiseRejectedWith(readerLockException("finish iterating"));
    }
    if (!this._preventCancel) {
      var result = ReadableStreamReaderGenericCancel(reader, value);
      ReadableStreamReaderGenericRelease(reader);
      return transformPromiseWith(result, function() {
        return { value, done: true };
      });
    }
    ReadableStreamReaderGenericRelease(reader);
    return promiseResolvedWith({ value, done: true });
  };
  return ReadableStreamAsyncIteratorImpl2;
}();
var ReadableStreamAsyncIteratorPrototype = {
  next: function() {
    if (!IsReadableStreamAsyncIterator(this)) {
      return promiseRejectedWith(streamAsyncIteratorBrandCheckException("next"));
    }
    return this._asyncIteratorImpl.next();
  },
  return: function(value) {
    if (!IsReadableStreamAsyncIterator(this)) {
      return promiseRejectedWith(streamAsyncIteratorBrandCheckException("return"));
    }
    return this._asyncIteratorImpl.return(value);
  }
};
if (AsyncIteratorPrototype !== void 0) {
  Object.setPrototypeOf(ReadableStreamAsyncIteratorPrototype, AsyncIteratorPrototype);
}
function AcquireReadableStreamAsyncIterator(stream, preventCancel) {
  var reader = AcquireReadableStreamDefaultReader(stream);
  var impl = new ReadableStreamAsyncIteratorImpl(reader, preventCancel);
  var iterator = Object.create(ReadableStreamAsyncIteratorPrototype);
  iterator._asyncIteratorImpl = impl;
  return iterator;
}
function IsReadableStreamAsyncIterator(x) {
  if (!typeIsObject(x)) {
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(x, "_asyncIteratorImpl")) {
    return false;
  }
  try {
    return x._asyncIteratorImpl instanceof ReadableStreamAsyncIteratorImpl;
  } catch (_a2) {
    return false;
  }
}
function streamAsyncIteratorBrandCheckException(name) {
  return new TypeError("ReadableStreamAsyncIterator." + name + " can only be used on a ReadableSteamAsyncIterator");
}
var NumberIsNaN = Number.isNaN || function(x) {
  return x !== x;
};
function CreateArrayFromList(elements) {
  return elements.slice();
}
function CopyDataBlockBytes(dest, destOffset, src, srcOffset, n) {
  new Uint8Array(dest).set(new Uint8Array(src, srcOffset, n), destOffset);
}
function TransferArrayBuffer(O) {
  return O;
}
function IsDetachedBuffer(O) {
  return false;
}
function ArrayBufferSlice(buffer, begin, end) {
  if (buffer.slice) {
    return buffer.slice(begin, end);
  }
  var length = end - begin;
  var slice = new ArrayBuffer(length);
  CopyDataBlockBytes(slice, 0, buffer, begin, length);
  return slice;
}
function IsNonNegativeNumber(v) {
  if (typeof v !== "number") {
    return false;
  }
  if (NumberIsNaN(v)) {
    return false;
  }
  if (v < 0) {
    return false;
  }
  return true;
}
function CloneAsUint8Array(O) {
  var buffer = ArrayBufferSlice(O.buffer, O.byteOffset, O.byteOffset + O.byteLength);
  return new Uint8Array(buffer);
}
function DequeueValue(container) {
  var pair = container._queue.shift();
  container._queueTotalSize -= pair.size;
  if (container._queueTotalSize < 0) {
    container._queueTotalSize = 0;
  }
  return pair.value;
}
function EnqueueValueWithSize(container, value, size) {
  if (!IsNonNegativeNumber(size) || size === Infinity) {
    throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
  }
  container._queue.push({ value, size });
  container._queueTotalSize += size;
}
function PeekQueueValue(container) {
  var pair = container._queue.peek();
  return pair.value;
}
function ResetQueue(container) {
  container._queue = new SimpleQueue();
  container._queueTotalSize = 0;
}
var ReadableStreamBYOBRequest = function() {
  function ReadableStreamBYOBRequest2() {
    throw new TypeError("Illegal constructor");
  }
  Object.defineProperty(ReadableStreamBYOBRequest2.prototype, "view", {
    get: function() {
      if (!IsReadableStreamBYOBRequest(this)) {
        throw byobRequestBrandCheckException("view");
      }
      return this._view;
    },
    enumerable: false,
    configurable: true
  });
  ReadableStreamBYOBRequest2.prototype.respond = function(bytesWritten) {
    if (!IsReadableStreamBYOBRequest(this)) {
      throw byobRequestBrandCheckException("respond");
    }
    assertRequiredArgument(bytesWritten, 1, "respond");
    bytesWritten = convertUnsignedLongLongWithEnforceRange(bytesWritten, "First parameter");
    if (this._associatedReadableByteStreamController === void 0) {
      throw new TypeError("This BYOB request has been invalidated");
    }
    if (IsDetachedBuffer(this._view.buffer))
      ;
    ReadableByteStreamControllerRespond(this._associatedReadableByteStreamController, bytesWritten);
  };
  ReadableStreamBYOBRequest2.prototype.respondWithNewView = function(view) {
    if (!IsReadableStreamBYOBRequest(this)) {
      throw byobRequestBrandCheckException("respondWithNewView");
    }
    assertRequiredArgument(view, 1, "respondWithNewView");
    if (!ArrayBuffer.isView(view)) {
      throw new TypeError("You can only respond with array buffer views");
    }
    if (this._associatedReadableByteStreamController === void 0) {
      throw new TypeError("This BYOB request has been invalidated");
    }
    if (IsDetachedBuffer(view.buffer))
      ;
    ReadableByteStreamControllerRespondWithNewView(this._associatedReadableByteStreamController, view);
  };
  return ReadableStreamBYOBRequest2;
}();
Object.defineProperties(ReadableStreamBYOBRequest.prototype, {
  respond: { enumerable: true },
  respondWithNewView: { enumerable: true },
  view: { enumerable: true }
});
if (typeof SymbolPolyfill.toStringTag === "symbol") {
  Object.defineProperty(ReadableStreamBYOBRequest.prototype, SymbolPolyfill.toStringTag, {
    value: "ReadableStreamBYOBRequest",
    configurable: true
  });
}
var ReadableByteStreamController = function() {
  function ReadableByteStreamController2() {
    throw new TypeError("Illegal constructor");
  }
  Object.defineProperty(ReadableByteStreamController2.prototype, "byobRequest", {
    get: function() {
      if (!IsReadableByteStreamController(this)) {
        throw byteStreamControllerBrandCheckException("byobRequest");
      }
      return ReadableByteStreamControllerGetBYOBRequest(this);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ReadableByteStreamController2.prototype, "desiredSize", {
    get: function() {
      if (!IsReadableByteStreamController(this)) {
        throw byteStreamControllerBrandCheckException("desiredSize");
      }
      return ReadableByteStreamControllerGetDesiredSize(this);
    },
    enumerable: false,
    configurable: true
  });
  ReadableByteStreamController2.prototype.close = function() {
    if (!IsReadableByteStreamController(this)) {
      throw byteStreamControllerBrandCheckException("close");
    }
    if (this._closeRequested) {
      throw new TypeError("The stream has already been closed; do not close it again!");
    }
    var state = this._controlledReadableByteStream._state;
    if (state !== "readable") {
      throw new TypeError("The stream (in " + state + " state) is not in the readable state and cannot be closed");
    }
    ReadableByteStreamControllerClose(this);
  };
  ReadableByteStreamController2.prototype.enqueue = function(chunk) {
    if (!IsReadableByteStreamController(this)) {
      throw byteStreamControllerBrandCheckException("enqueue");
    }
    assertRequiredArgument(chunk, 1, "enqueue");
    if (!ArrayBuffer.isView(chunk)) {
      throw new TypeError("chunk must be an array buffer view");
    }
    if (chunk.byteLength === 0) {
      throw new TypeError("chunk must have non-zero byteLength");
    }
    if (chunk.buffer.byteLength === 0) {
      throw new TypeError("chunk's buffer must have non-zero byteLength");
    }
    if (this._closeRequested) {
      throw new TypeError("stream is closed or draining");
    }
    var state = this._controlledReadableByteStream._state;
    if (state !== "readable") {
      throw new TypeError("The stream (in " + state + " state) is not in the readable state and cannot be enqueued to");
    }
    ReadableByteStreamControllerEnqueue(this, chunk);
  };
  ReadableByteStreamController2.prototype.error = function(e) {
    if (e === void 0) {
      e = void 0;
    }
    if (!IsReadableByteStreamController(this)) {
      throw byteStreamControllerBrandCheckException("error");
    }
    ReadableByteStreamControllerError(this, e);
  };
  ReadableByteStreamController2.prototype[CancelSteps] = function(reason) {
    ReadableByteStreamControllerClearPendingPullIntos(this);
    ResetQueue(this);
    var result = this._cancelAlgorithm(reason);
    ReadableByteStreamControllerClearAlgorithms(this);
    return result;
  };
  ReadableByteStreamController2.prototype[PullSteps] = function(readRequest) {
    var stream = this._controlledReadableByteStream;
    if (this._queueTotalSize > 0) {
      var entry = this._queue.shift();
      this._queueTotalSize -= entry.byteLength;
      ReadableByteStreamControllerHandleQueueDrain(this);
      var view = new Uint8Array(entry.buffer, entry.byteOffset, entry.byteLength);
      readRequest._chunkSteps(view);
      return;
    }
    var autoAllocateChunkSize = this._autoAllocateChunkSize;
    if (autoAllocateChunkSize !== void 0) {
      var buffer = void 0;
      try {
        buffer = new ArrayBuffer(autoAllocateChunkSize);
      } catch (bufferE) {
        readRequest._errorSteps(bufferE);
        return;
      }
      var pullIntoDescriptor = {
        buffer,
        bufferByteLength: autoAllocateChunkSize,
        byteOffset: 0,
        byteLength: autoAllocateChunkSize,
        bytesFilled: 0,
        elementSize: 1,
        viewConstructor: Uint8Array,
        readerType: "default"
      };
      this._pendingPullIntos.push(pullIntoDescriptor);
    }
    ReadableStreamAddReadRequest(stream, readRequest);
    ReadableByteStreamControllerCallPullIfNeeded(this);
  };
  return ReadableByteStreamController2;
}();
Object.defineProperties(ReadableByteStreamController.prototype, {
  close: { enumerable: true },
  enqueue: { enumerable: true },
  error: { enumerable: true },
  byobRequest: { enumerable: true },
  desiredSize: { enumerable: true }
});
if (typeof SymbolPolyfill.toStringTag === "symbol") {
  Object.defineProperty(ReadableByteStreamController.prototype, SymbolPolyfill.toStringTag, {
    value: "ReadableByteStreamController",
    configurable: true
  });
}
function IsReadableByteStreamController(x) {
  if (!typeIsObject(x)) {
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(x, "_controlledReadableByteStream")) {
    return false;
  }
  return x instanceof ReadableByteStreamController;
}
function IsReadableStreamBYOBRequest(x) {
  if (!typeIsObject(x)) {
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(x, "_associatedReadableByteStreamController")) {
    return false;
  }
  return x instanceof ReadableStreamBYOBRequest;
}
function ReadableByteStreamControllerCallPullIfNeeded(controller) {
  var shouldPull = ReadableByteStreamControllerShouldCallPull(controller);
  if (!shouldPull) {
    return;
  }
  if (controller._pulling) {
    controller._pullAgain = true;
    return;
  }
  controller._pulling = true;
  var pullPromise = controller._pullAlgorithm();
  uponPromise(pullPromise, function() {
    controller._pulling = false;
    if (controller._pullAgain) {
      controller._pullAgain = false;
      ReadableByteStreamControllerCallPullIfNeeded(controller);
    }
  }, function(e) {
    ReadableByteStreamControllerError(controller, e);
  });
}
function ReadableByteStreamControllerClearPendingPullIntos(controller) {
  ReadableByteStreamControllerInvalidateBYOBRequest(controller);
  controller._pendingPullIntos = new SimpleQueue();
}
function ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor) {
  var done = false;
  if (stream._state === "closed") {
    done = true;
  }
  var filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
  if (pullIntoDescriptor.readerType === "default") {
    ReadableStreamFulfillReadRequest(stream, filledView, done);
  } else {
    ReadableStreamFulfillReadIntoRequest(stream, filledView, done);
  }
}
function ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor) {
  var bytesFilled = pullIntoDescriptor.bytesFilled;
  var elementSize = pullIntoDescriptor.elementSize;
  return new pullIntoDescriptor.viewConstructor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, bytesFilled / elementSize);
}
function ReadableByteStreamControllerEnqueueChunkToQueue(controller, buffer, byteOffset, byteLength) {
  controller._queue.push({ buffer, byteOffset, byteLength });
  controller._queueTotalSize += byteLength;
}
function ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor) {
  var elementSize = pullIntoDescriptor.elementSize;
  var currentAlignedBytes = pullIntoDescriptor.bytesFilled - pullIntoDescriptor.bytesFilled % elementSize;
  var maxBytesToCopy = Math.min(controller._queueTotalSize, pullIntoDescriptor.byteLength - pullIntoDescriptor.bytesFilled);
  var maxBytesFilled = pullIntoDescriptor.bytesFilled + maxBytesToCopy;
  var maxAlignedBytes = maxBytesFilled - maxBytesFilled % elementSize;
  var totalBytesToCopyRemaining = maxBytesToCopy;
  var ready = false;
  if (maxAlignedBytes > currentAlignedBytes) {
    totalBytesToCopyRemaining = maxAlignedBytes - pullIntoDescriptor.bytesFilled;
    ready = true;
  }
  var queue = controller._queue;
  while (totalBytesToCopyRemaining > 0) {
    var headOfQueue = queue.peek();
    var bytesToCopy = Math.min(totalBytesToCopyRemaining, headOfQueue.byteLength);
    var destStart = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
    CopyDataBlockBytes(pullIntoDescriptor.buffer, destStart, headOfQueue.buffer, headOfQueue.byteOffset, bytesToCopy);
    if (headOfQueue.byteLength === bytesToCopy) {
      queue.shift();
    } else {
      headOfQueue.byteOffset += bytesToCopy;
      headOfQueue.byteLength -= bytesToCopy;
    }
    controller._queueTotalSize -= bytesToCopy;
    ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesToCopy, pullIntoDescriptor);
    totalBytesToCopyRemaining -= bytesToCopy;
  }
  return ready;
}
function ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, size, pullIntoDescriptor) {
  pullIntoDescriptor.bytesFilled += size;
}
function ReadableByteStreamControllerHandleQueueDrain(controller) {
  if (controller._queueTotalSize === 0 && controller._closeRequested) {
    ReadableByteStreamControllerClearAlgorithms(controller);
    ReadableStreamClose(controller._controlledReadableByteStream);
  } else {
    ReadableByteStreamControllerCallPullIfNeeded(controller);
  }
}
function ReadableByteStreamControllerInvalidateBYOBRequest(controller) {
  if (controller._byobRequest === null) {
    return;
  }
  controller._byobRequest._associatedReadableByteStreamController = void 0;
  controller._byobRequest._view = null;
  controller._byobRequest = null;
}
function ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller) {
  while (controller._pendingPullIntos.length > 0) {
    if (controller._queueTotalSize === 0) {
      return;
    }
    var pullIntoDescriptor = controller._pendingPullIntos.peek();
    if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
      ReadableByteStreamControllerShiftPendingPullInto(controller);
      ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
    }
  }
}
function ReadableByteStreamControllerPullInto(controller, view, readIntoRequest) {
  var stream = controller._controlledReadableByteStream;
  var elementSize = 1;
  if (view.constructor !== DataView) {
    elementSize = view.constructor.BYTES_PER_ELEMENT;
  }
  var ctor = view.constructor;
  var buffer = TransferArrayBuffer(view.buffer);
  var pullIntoDescriptor = {
    buffer,
    bufferByteLength: buffer.byteLength,
    byteOffset: view.byteOffset,
    byteLength: view.byteLength,
    bytesFilled: 0,
    elementSize,
    viewConstructor: ctor,
    readerType: "byob"
  };
  if (controller._pendingPullIntos.length > 0) {
    controller._pendingPullIntos.push(pullIntoDescriptor);
    ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
    return;
  }
  if (stream._state === "closed") {
    var emptyView = new ctor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, 0);
    readIntoRequest._closeSteps(emptyView);
    return;
  }
  if (controller._queueTotalSize > 0) {
    if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
      var filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
      ReadableByteStreamControllerHandleQueueDrain(controller);
      readIntoRequest._chunkSteps(filledView);
      return;
    }
    if (controller._closeRequested) {
      var e = new TypeError("Insufficient bytes to fill elements in the given buffer");
      ReadableByteStreamControllerError(controller, e);
      readIntoRequest._errorSteps(e);
      return;
    }
  }
  controller._pendingPullIntos.push(pullIntoDescriptor);
  ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
  ReadableByteStreamControllerCallPullIfNeeded(controller);
}
function ReadableByteStreamControllerRespondInClosedState(controller, firstDescriptor) {
  var stream = controller._controlledReadableByteStream;
  if (ReadableStreamHasBYOBReader(stream)) {
    while (ReadableStreamGetNumReadIntoRequests(stream) > 0) {
      var pullIntoDescriptor = ReadableByteStreamControllerShiftPendingPullInto(controller);
      ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor);
    }
  }
}
function ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, pullIntoDescriptor) {
  ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesWritten, pullIntoDescriptor);
  if (pullIntoDescriptor.bytesFilled < pullIntoDescriptor.elementSize) {
    return;
  }
  ReadableByteStreamControllerShiftPendingPullInto(controller);
  var remainderSize = pullIntoDescriptor.bytesFilled % pullIntoDescriptor.elementSize;
  if (remainderSize > 0) {
    var end = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
    var remainder = ArrayBufferSlice(pullIntoDescriptor.buffer, end - remainderSize, end);
    ReadableByteStreamControllerEnqueueChunkToQueue(controller, remainder, 0, remainder.byteLength);
  }
  pullIntoDescriptor.bytesFilled -= remainderSize;
  ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
  ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
}
function ReadableByteStreamControllerRespondInternal(controller, bytesWritten) {
  var firstDescriptor = controller._pendingPullIntos.peek();
  ReadableByteStreamControllerInvalidateBYOBRequest(controller);
  var state = controller._controlledReadableByteStream._state;
  if (state === "closed") {
    ReadableByteStreamControllerRespondInClosedState(controller);
  } else {
    ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, firstDescriptor);
  }
  ReadableByteStreamControllerCallPullIfNeeded(controller);
}
function ReadableByteStreamControllerShiftPendingPullInto(controller) {
  var descriptor = controller._pendingPullIntos.shift();
  return descriptor;
}
function ReadableByteStreamControllerShouldCallPull(controller) {
  var stream = controller._controlledReadableByteStream;
  if (stream._state !== "readable") {
    return false;
  }
  if (controller._closeRequested) {
    return false;
  }
  if (!controller._started) {
    return false;
  }
  if (ReadableStreamHasDefaultReader(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
    return true;
  }
  if (ReadableStreamHasBYOBReader(stream) && ReadableStreamGetNumReadIntoRequests(stream) > 0) {
    return true;
  }
  var desiredSize = ReadableByteStreamControllerGetDesiredSize(controller);
  if (desiredSize > 0) {
    return true;
  }
  return false;
}
function ReadableByteStreamControllerClearAlgorithms(controller) {
  controller._pullAlgorithm = void 0;
  controller._cancelAlgorithm = void 0;
}
function ReadableByteStreamControllerClose(controller) {
  var stream = controller._controlledReadableByteStream;
  if (controller._closeRequested || stream._state !== "readable") {
    return;
  }
  if (controller._queueTotalSize > 0) {
    controller._closeRequested = true;
    return;
  }
  if (controller._pendingPullIntos.length > 0) {
    var firstPendingPullInto = controller._pendingPullIntos.peek();
    if (firstPendingPullInto.bytesFilled > 0) {
      var e = new TypeError("Insufficient bytes to fill elements in the given buffer");
      ReadableByteStreamControllerError(controller, e);
      throw e;
    }
  }
  ReadableByteStreamControllerClearAlgorithms(controller);
  ReadableStreamClose(stream);
}
function ReadableByteStreamControllerEnqueue(controller, chunk) {
  var stream = controller._controlledReadableByteStream;
  if (controller._closeRequested || stream._state !== "readable") {
    return;
  }
  var buffer = chunk.buffer;
  var byteOffset = chunk.byteOffset;
  var byteLength = chunk.byteLength;
  var transferredBuffer = TransferArrayBuffer(buffer);
  if (controller._pendingPullIntos.length > 0) {
    var firstPendingPullInto = controller._pendingPullIntos.peek();
    if (IsDetachedBuffer(firstPendingPullInto.buffer))
      ;
    firstPendingPullInto.buffer = TransferArrayBuffer(firstPendingPullInto.buffer);
  }
  ReadableByteStreamControllerInvalidateBYOBRequest(controller);
  if (ReadableStreamHasDefaultReader(stream)) {
    if (ReadableStreamGetNumReadRequests(stream) === 0) {
      ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
    } else {
      if (controller._pendingPullIntos.length > 0) {
        ReadableByteStreamControllerShiftPendingPullInto(controller);
      }
      var transferredView = new Uint8Array(transferredBuffer, byteOffset, byteLength);
      ReadableStreamFulfillReadRequest(stream, transferredView, false);
    }
  } else if (ReadableStreamHasBYOBReader(stream)) {
    ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
    ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
  } else {
    ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
  }
  ReadableByteStreamControllerCallPullIfNeeded(controller);
}
function ReadableByteStreamControllerError(controller, e) {
  var stream = controller._controlledReadableByteStream;
  if (stream._state !== "readable") {
    return;
  }
  ReadableByteStreamControllerClearPendingPullIntos(controller);
  ResetQueue(controller);
  ReadableByteStreamControllerClearAlgorithms(controller);
  ReadableStreamError(stream, e);
}
function ReadableByteStreamControllerGetBYOBRequest(controller) {
  if (controller._byobRequest === null && controller._pendingPullIntos.length > 0) {
    var firstDescriptor = controller._pendingPullIntos.peek();
    var view = new Uint8Array(firstDescriptor.buffer, firstDescriptor.byteOffset + firstDescriptor.bytesFilled, firstDescriptor.byteLength - firstDescriptor.bytesFilled);
    var byobRequest = Object.create(ReadableStreamBYOBRequest.prototype);
    SetUpReadableStreamBYOBRequest(byobRequest, controller, view);
    controller._byobRequest = byobRequest;
  }
  return controller._byobRequest;
}
function ReadableByteStreamControllerGetDesiredSize(controller) {
  var state = controller._controlledReadableByteStream._state;
  if (state === "errored") {
    return null;
  }
  if (state === "closed") {
    return 0;
  }
  return controller._strategyHWM - controller._queueTotalSize;
}
function ReadableByteStreamControllerRespond(controller, bytesWritten) {
  var firstDescriptor = controller._pendingPullIntos.peek();
  var state = controller._controlledReadableByteStream._state;
  if (state === "closed") {
    if (bytesWritten !== 0) {
      throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");
    }
  } else {
    if (bytesWritten === 0) {
      throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");
    }
    if (firstDescriptor.bytesFilled + bytesWritten > firstDescriptor.byteLength) {
      throw new RangeError("bytesWritten out of range");
    }
  }
  firstDescriptor.buffer = TransferArrayBuffer(firstDescriptor.buffer);
  ReadableByteStreamControllerRespondInternal(controller, bytesWritten);
}
function ReadableByteStreamControllerRespondWithNewView(controller, view) {
  var firstDescriptor = controller._pendingPullIntos.peek();
  var state = controller._controlledReadableByteStream._state;
  if (state === "closed") {
    if (view.byteLength !== 0) {
      throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream");
    }
  } else {
    if (view.byteLength === 0) {
      throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");
    }
  }
  if (firstDescriptor.byteOffset + firstDescriptor.bytesFilled !== view.byteOffset) {
    throw new RangeError("The region specified by view does not match byobRequest");
  }
  if (firstDescriptor.bufferByteLength !== view.buffer.byteLength) {
    throw new RangeError("The buffer of view has different capacity than byobRequest");
  }
  if (firstDescriptor.bytesFilled + view.byteLength > firstDescriptor.byteLength) {
    throw new RangeError("The region specified by view is larger than byobRequest");
  }
  var viewByteLength = view.byteLength;
  firstDescriptor.buffer = TransferArrayBuffer(view.buffer);
  ReadableByteStreamControllerRespondInternal(controller, viewByteLength);
}
function SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize) {
  controller._controlledReadableByteStream = stream;
  controller._pullAgain = false;
  controller._pulling = false;
  controller._byobRequest = null;
  controller._queue = controller._queueTotalSize = void 0;
  ResetQueue(controller);
  controller._closeRequested = false;
  controller._started = false;
  controller._strategyHWM = highWaterMark;
  controller._pullAlgorithm = pullAlgorithm;
  controller._cancelAlgorithm = cancelAlgorithm;
  controller._autoAllocateChunkSize = autoAllocateChunkSize;
  controller._pendingPullIntos = new SimpleQueue();
  stream._readableStreamController = controller;
  var startResult = startAlgorithm();
  uponPromise(promiseResolvedWith(startResult), function() {
    controller._started = true;
    ReadableByteStreamControllerCallPullIfNeeded(controller);
  }, function(r) {
    ReadableByteStreamControllerError(controller, r);
  });
}
function SetUpReadableByteStreamControllerFromUnderlyingSource(stream, underlyingByteSource, highWaterMark) {
  var controller = Object.create(ReadableByteStreamController.prototype);
  var startAlgorithm = function() {
    return void 0;
  };
  var pullAlgorithm = function() {
    return promiseResolvedWith(void 0);
  };
  var cancelAlgorithm = function() {
    return promiseResolvedWith(void 0);
  };
  if (underlyingByteSource.start !== void 0) {
    startAlgorithm = function() {
      return underlyingByteSource.start(controller);
    };
  }
  if (underlyingByteSource.pull !== void 0) {
    pullAlgorithm = function() {
      return underlyingByteSource.pull(controller);
    };
  }
  if (underlyingByteSource.cancel !== void 0) {
    cancelAlgorithm = function(reason) {
      return underlyingByteSource.cancel(reason);
    };
  }
  var autoAllocateChunkSize = underlyingByteSource.autoAllocateChunkSize;
  if (autoAllocateChunkSize === 0) {
    throw new TypeError("autoAllocateChunkSize must be greater than 0");
  }
  SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize);
}
function SetUpReadableStreamBYOBRequest(request, controller, view) {
  request._associatedReadableByteStreamController = controller;
  request._view = view;
}
function byobRequestBrandCheckException(name) {
  return new TypeError("ReadableStreamBYOBRequest.prototype." + name + " can only be used on a ReadableStreamBYOBRequest");
}
function byteStreamControllerBrandCheckException(name) {
  return new TypeError("ReadableByteStreamController.prototype." + name + " can only be used on a ReadableByteStreamController");
}
function AcquireReadableStreamBYOBReader(stream) {
  return new ReadableStreamBYOBReader(stream);
}
function ReadableStreamAddReadIntoRequest(stream, readIntoRequest) {
  stream._reader._readIntoRequests.push(readIntoRequest);
}
function ReadableStreamFulfillReadIntoRequest(stream, chunk, done) {
  var reader = stream._reader;
  var readIntoRequest = reader._readIntoRequests.shift();
  if (done) {
    readIntoRequest._closeSteps(chunk);
  } else {
    readIntoRequest._chunkSteps(chunk);
  }
}
function ReadableStreamGetNumReadIntoRequests(stream) {
  return stream._reader._readIntoRequests.length;
}
function ReadableStreamHasBYOBReader(stream) {
  var reader = stream._reader;
  if (reader === void 0) {
    return false;
  }
  if (!IsReadableStreamBYOBReader(reader)) {
    return false;
  }
  return true;
}
var ReadableStreamBYOBReader = function() {
  function ReadableStreamBYOBReader2(stream) {
    assertRequiredArgument(stream, 1, "ReadableStreamBYOBReader");
    assertReadableStream(stream, "First parameter");
    if (IsReadableStreamLocked(stream)) {
      throw new TypeError("This stream has already been locked for exclusive reading by another reader");
    }
    if (!IsReadableByteStreamController(stream._readableStreamController)) {
      throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
    }
    ReadableStreamReaderGenericInitialize(this, stream);
    this._readIntoRequests = new SimpleQueue();
  }
  Object.defineProperty(ReadableStreamBYOBReader2.prototype, "closed", {
    get: function() {
      if (!IsReadableStreamBYOBReader(this)) {
        return promiseRejectedWith(byobReaderBrandCheckException("closed"));
      }
      return this._closedPromise;
    },
    enumerable: false,
    configurable: true
  });
  ReadableStreamBYOBReader2.prototype.cancel = function(reason) {
    if (reason === void 0) {
      reason = void 0;
    }
    if (!IsReadableStreamBYOBReader(this)) {
      return promiseRejectedWith(byobReaderBrandCheckException("cancel"));
    }
    if (this._ownerReadableStream === void 0) {
      return promiseRejectedWith(readerLockException("cancel"));
    }
    return ReadableStreamReaderGenericCancel(this, reason);
  };
  ReadableStreamBYOBReader2.prototype.read = function(view) {
    if (!IsReadableStreamBYOBReader(this)) {
      return promiseRejectedWith(byobReaderBrandCheckException("read"));
    }
    if (!ArrayBuffer.isView(view)) {
      return promiseRejectedWith(new TypeError("view must be an array buffer view"));
    }
    if (view.byteLength === 0) {
      return promiseRejectedWith(new TypeError("view must have non-zero byteLength"));
    }
    if (view.buffer.byteLength === 0) {
      return promiseRejectedWith(new TypeError("view's buffer must have non-zero byteLength"));
    }
    if (IsDetachedBuffer(view.buffer))
      ;
    if (this._ownerReadableStream === void 0) {
      return promiseRejectedWith(readerLockException("read from"));
    }
    var resolvePromise;
    var rejectPromise;
    var promise = newPromise(function(resolve, reject) {
      resolvePromise = resolve;
      rejectPromise = reject;
    });
    var readIntoRequest = {
      _chunkSteps: function(chunk) {
        return resolvePromise({ value: chunk, done: false });
      },
      _closeSteps: function(chunk) {
        return resolvePromise({ value: chunk, done: true });
      },
      _errorSteps: function(e) {
        return rejectPromise(e);
      }
    };
    ReadableStreamBYOBReaderRead(this, view, readIntoRequest);
    return promise;
  };
  ReadableStreamBYOBReader2.prototype.releaseLock = function() {
    if (!IsReadableStreamBYOBReader(this)) {
      throw byobReaderBrandCheckException("releaseLock");
    }
    if (this._ownerReadableStream === void 0) {
      return;
    }
    if (this._readIntoRequests.length > 0) {
      throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
    }
    ReadableStreamReaderGenericRelease(this);
  };
  return ReadableStreamBYOBReader2;
}();
Object.defineProperties(ReadableStreamBYOBReader.prototype, {
  cancel: { enumerable: true },
  read: { enumerable: true },
  releaseLock: { enumerable: true },
  closed: { enumerable: true }
});
if (typeof SymbolPolyfill.toStringTag === "symbol") {
  Object.defineProperty(ReadableStreamBYOBReader.prototype, SymbolPolyfill.toStringTag, {
    value: "ReadableStreamBYOBReader",
    configurable: true
  });
}
function IsReadableStreamBYOBReader(x) {
  if (!typeIsObject(x)) {
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(x, "_readIntoRequests")) {
    return false;
  }
  return x instanceof ReadableStreamBYOBReader;
}
function ReadableStreamBYOBReaderRead(reader, view, readIntoRequest) {
  var stream = reader._ownerReadableStream;
  stream._disturbed = true;
  if (stream._state === "errored") {
    readIntoRequest._errorSteps(stream._storedError);
  } else {
    ReadableByteStreamControllerPullInto(stream._readableStreamController, view, readIntoRequest);
  }
}
function byobReaderBrandCheckException(name) {
  return new TypeError("ReadableStreamBYOBReader.prototype." + name + " can only be used on a ReadableStreamBYOBReader");
}
function ExtractHighWaterMark(strategy, defaultHWM) {
  var highWaterMark = strategy.highWaterMark;
  if (highWaterMark === void 0) {
    return defaultHWM;
  }
  if (NumberIsNaN(highWaterMark) || highWaterMark < 0) {
    throw new RangeError("Invalid highWaterMark");
  }
  return highWaterMark;
}
function ExtractSizeAlgorithm(strategy) {
  var size = strategy.size;
  if (!size) {
    return function() {
      return 1;
    };
  }
  return size;
}
function convertQueuingStrategy(init, context) {
  assertDictionary(init, context);
  var highWaterMark = init === null || init === void 0 ? void 0 : init.highWaterMark;
  var size = init === null || init === void 0 ? void 0 : init.size;
  return {
    highWaterMark: highWaterMark === void 0 ? void 0 : convertUnrestrictedDouble(highWaterMark),
    size: size === void 0 ? void 0 : convertQueuingStrategySize(size, context + " has member 'size' that")
  };
}
function convertQueuingStrategySize(fn, context) {
  assertFunction(fn, context);
  return function(chunk) {
    return convertUnrestrictedDouble(fn(chunk));
  };
}
function convertUnderlyingSink(original, context) {
  assertDictionary(original, context);
  var abort = original === null || original === void 0 ? void 0 : original.abort;
  var close = original === null || original === void 0 ? void 0 : original.close;
  var start = original === null || original === void 0 ? void 0 : original.start;
  var type = original === null || original === void 0 ? void 0 : original.type;
  var write = original === null || original === void 0 ? void 0 : original.write;
  return {
    abort: abort === void 0 ? void 0 : convertUnderlyingSinkAbortCallback(abort, original, context + " has member 'abort' that"),
    close: close === void 0 ? void 0 : convertUnderlyingSinkCloseCallback(close, original, context + " has member 'close' that"),
    start: start === void 0 ? void 0 : convertUnderlyingSinkStartCallback(start, original, context + " has member 'start' that"),
    write: write === void 0 ? void 0 : convertUnderlyingSinkWriteCallback(write, original, context + " has member 'write' that"),
    type
  };
}
function convertUnderlyingSinkAbortCallback(fn, original, context) {
  assertFunction(fn, context);
  return function(reason) {
    return promiseCall(fn, original, [reason]);
  };
}
function convertUnderlyingSinkCloseCallback(fn, original, context) {
  assertFunction(fn, context);
  return function() {
    return promiseCall(fn, original, []);
  };
}
function convertUnderlyingSinkStartCallback(fn, original, context) {
  assertFunction(fn, context);
  return function(controller) {
    return reflectCall(fn, original, [controller]);
  };
}
function convertUnderlyingSinkWriteCallback(fn, original, context) {
  assertFunction(fn, context);
  return function(chunk, controller) {
    return promiseCall(fn, original, [chunk, controller]);
  };
}
function assertWritableStream(x, context) {
  if (!IsWritableStream(x)) {
    throw new TypeError(context + " is not a WritableStream.");
  }
}
function isAbortSignal(value) {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  try {
    return typeof value.aborted === "boolean";
  } catch (_a2) {
    return false;
  }
}
var supportsAbortController = typeof AbortController === "function";
function createAbortController() {
  if (supportsAbortController) {
    return new AbortController();
  }
  return void 0;
}
var WritableStream = function() {
  function WritableStream2(rawUnderlyingSink, rawStrategy) {
    if (rawUnderlyingSink === void 0) {
      rawUnderlyingSink = {};
    }
    if (rawStrategy === void 0) {
      rawStrategy = {};
    }
    if (rawUnderlyingSink === void 0) {
      rawUnderlyingSink = null;
    } else {
      assertObject(rawUnderlyingSink, "First parameter");
    }
    var strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
    var underlyingSink = convertUnderlyingSink(rawUnderlyingSink, "First parameter");
    InitializeWritableStream(this);
    var type = underlyingSink.type;
    if (type !== void 0) {
      throw new RangeError("Invalid type is specified");
    }
    var sizeAlgorithm = ExtractSizeAlgorithm(strategy);
    var highWaterMark = ExtractHighWaterMark(strategy, 1);
    SetUpWritableStreamDefaultControllerFromUnderlyingSink(this, underlyingSink, highWaterMark, sizeAlgorithm);
  }
  Object.defineProperty(WritableStream2.prototype, "locked", {
    get: function() {
      if (!IsWritableStream(this)) {
        throw streamBrandCheckException$2("locked");
      }
      return IsWritableStreamLocked(this);
    },
    enumerable: false,
    configurable: true
  });
  WritableStream2.prototype.abort = function(reason) {
    if (reason === void 0) {
      reason = void 0;
    }
    if (!IsWritableStream(this)) {
      return promiseRejectedWith(streamBrandCheckException$2("abort"));
    }
    if (IsWritableStreamLocked(this)) {
      return promiseRejectedWith(new TypeError("Cannot abort a stream that already has a writer"));
    }
    return WritableStreamAbort(this, reason);
  };
  WritableStream2.prototype.close = function() {
    if (!IsWritableStream(this)) {
      return promiseRejectedWith(streamBrandCheckException$2("close"));
    }
    if (IsWritableStreamLocked(this)) {
      return promiseRejectedWith(new TypeError("Cannot close a stream that already has a writer"));
    }
    if (WritableStreamCloseQueuedOrInFlight(this)) {
      return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
    }
    return WritableStreamClose(this);
  };
  WritableStream2.prototype.getWriter = function() {
    if (!IsWritableStream(this)) {
      throw streamBrandCheckException$2("getWriter");
    }
    return AcquireWritableStreamDefaultWriter(this);
  };
  return WritableStream2;
}();
Object.defineProperties(WritableStream.prototype, {
  abort: { enumerable: true },
  close: { enumerable: true },
  getWriter: { enumerable: true },
  locked: { enumerable: true }
});
if (typeof SymbolPolyfill.toStringTag === "symbol") {
  Object.defineProperty(WritableStream.prototype, SymbolPolyfill.toStringTag, {
    value: "WritableStream",
    configurable: true
  });
}
function AcquireWritableStreamDefaultWriter(stream) {
  return new WritableStreamDefaultWriter(stream);
}
function CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm) {
  if (highWaterMark === void 0) {
    highWaterMark = 1;
  }
  if (sizeAlgorithm === void 0) {
    sizeAlgorithm = function() {
      return 1;
    };
  }
  var stream = Object.create(WritableStream.prototype);
  InitializeWritableStream(stream);
  var controller = Object.create(WritableStreamDefaultController.prototype);
  SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
  return stream;
}
function InitializeWritableStream(stream) {
  stream._state = "writable";
  stream._storedError = void 0;
  stream._writer = void 0;
  stream._writableStreamController = void 0;
  stream._writeRequests = new SimpleQueue();
  stream._inFlightWriteRequest = void 0;
  stream._closeRequest = void 0;
  stream._inFlightCloseRequest = void 0;
  stream._pendingAbortRequest = void 0;
  stream._backpressure = false;
}
function IsWritableStream(x) {
  if (!typeIsObject(x)) {
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(x, "_writableStreamController")) {
    return false;
  }
  return x instanceof WritableStream;
}
function IsWritableStreamLocked(stream) {
  if (stream._writer === void 0) {
    return false;
  }
  return true;
}
function WritableStreamAbort(stream, reason) {
  var _a2;
  if (stream._state === "closed" || stream._state === "errored") {
    return promiseResolvedWith(void 0);
  }
  stream._writableStreamController._abortReason = reason;
  (_a2 = stream._writableStreamController._abortController) === null || _a2 === void 0 ? void 0 : _a2.abort();
  var state = stream._state;
  if (state === "closed" || state === "errored") {
    return promiseResolvedWith(void 0);
  }
  if (stream._pendingAbortRequest !== void 0) {
    return stream._pendingAbortRequest._promise;
  }
  var wasAlreadyErroring = false;
  if (state === "erroring") {
    wasAlreadyErroring = true;
    reason = void 0;
  }
  var promise = newPromise(function(resolve, reject) {
    stream._pendingAbortRequest = {
      _promise: void 0,
      _resolve: resolve,
      _reject: reject,
      _reason: reason,
      _wasAlreadyErroring: wasAlreadyErroring
    };
  });
  stream._pendingAbortRequest._promise = promise;
  if (!wasAlreadyErroring) {
    WritableStreamStartErroring(stream, reason);
  }
  return promise;
}
function WritableStreamClose(stream) {
  var state = stream._state;
  if (state === "closed" || state === "errored") {
    return promiseRejectedWith(new TypeError("The stream (in " + state + " state) is not in the writable state and cannot be closed"));
  }
  var promise = newPromise(function(resolve, reject) {
    var closeRequest = {
      _resolve: resolve,
      _reject: reject
    };
    stream._closeRequest = closeRequest;
  });
  var writer = stream._writer;
  if (writer !== void 0 && stream._backpressure && state === "writable") {
    defaultWriterReadyPromiseResolve(writer);
  }
  WritableStreamDefaultControllerClose(stream._writableStreamController);
  return promise;
}
function WritableStreamAddWriteRequest(stream) {
  var promise = newPromise(function(resolve, reject) {
    var writeRequest = {
      _resolve: resolve,
      _reject: reject
    };
    stream._writeRequests.push(writeRequest);
  });
  return promise;
}
function WritableStreamDealWithRejection(stream, error) {
  var state = stream._state;
  if (state === "writable") {
    WritableStreamStartErroring(stream, error);
    return;
  }
  WritableStreamFinishErroring(stream);
}
function WritableStreamStartErroring(stream, reason) {
  var controller = stream._writableStreamController;
  stream._state = "erroring";
  stream._storedError = reason;
  var writer = stream._writer;
  if (writer !== void 0) {
    WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, reason);
  }
  if (!WritableStreamHasOperationMarkedInFlight(stream) && controller._started) {
    WritableStreamFinishErroring(stream);
  }
}
function WritableStreamFinishErroring(stream) {
  stream._state = "errored";
  stream._writableStreamController[ErrorSteps]();
  var storedError = stream._storedError;
  stream._writeRequests.forEach(function(writeRequest) {
    writeRequest._reject(storedError);
  });
  stream._writeRequests = new SimpleQueue();
  if (stream._pendingAbortRequest === void 0) {
    WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
    return;
  }
  var abortRequest = stream._pendingAbortRequest;
  stream._pendingAbortRequest = void 0;
  if (abortRequest._wasAlreadyErroring) {
    abortRequest._reject(storedError);
    WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
    return;
  }
  var promise = stream._writableStreamController[AbortSteps](abortRequest._reason);
  uponPromise(promise, function() {
    abortRequest._resolve();
    WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
  }, function(reason) {
    abortRequest._reject(reason);
    WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
  });
}
function WritableStreamFinishInFlightWrite(stream) {
  stream._inFlightWriteRequest._resolve(void 0);
  stream._inFlightWriteRequest = void 0;
}
function WritableStreamFinishInFlightWriteWithError(stream, error) {
  stream._inFlightWriteRequest._reject(error);
  stream._inFlightWriteRequest = void 0;
  WritableStreamDealWithRejection(stream, error);
}
function WritableStreamFinishInFlightClose(stream) {
  stream._inFlightCloseRequest._resolve(void 0);
  stream._inFlightCloseRequest = void 0;
  var state = stream._state;
  if (state === "erroring") {
    stream._storedError = void 0;
    if (stream._pendingAbortRequest !== void 0) {
      stream._pendingAbortRequest._resolve();
      stream._pendingAbortRequest = void 0;
    }
  }
  stream._state = "closed";
  var writer = stream._writer;
  if (writer !== void 0) {
    defaultWriterClosedPromiseResolve(writer);
  }
}
function WritableStreamFinishInFlightCloseWithError(stream, error) {
  stream._inFlightCloseRequest._reject(error);
  stream._inFlightCloseRequest = void 0;
  if (stream._pendingAbortRequest !== void 0) {
    stream._pendingAbortRequest._reject(error);
    stream._pendingAbortRequest = void 0;
  }
  WritableStreamDealWithRejection(stream, error);
}
function WritableStreamCloseQueuedOrInFlight(stream) {
  if (stream._closeRequest === void 0 && stream._inFlightCloseRequest === void 0) {
    return false;
  }
  return true;
}
function WritableStreamHasOperationMarkedInFlight(stream) {
  if (stream._inFlightWriteRequest === void 0 && stream._inFlightCloseRequest === void 0) {
    return false;
  }
  return true;
}
function WritableStreamMarkCloseRequestInFlight(stream) {
  stream._inFlightCloseRequest = stream._closeRequest;
  stream._closeRequest = void 0;
}
function WritableStreamMarkFirstWriteRequestInFlight(stream) {
  stream._inFlightWriteRequest = stream._writeRequests.shift();
}
function WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream) {
  if (stream._closeRequest !== void 0) {
    stream._closeRequest._reject(stream._storedError);
    stream._closeRequest = void 0;
  }
  var writer = stream._writer;
  if (writer !== void 0) {
    defaultWriterClosedPromiseReject(writer, stream._storedError);
  }
}
function WritableStreamUpdateBackpressure(stream, backpressure) {
  var writer = stream._writer;
  if (writer !== void 0 && backpressure !== stream._backpressure) {
    if (backpressure) {
      defaultWriterReadyPromiseReset(writer);
    } else {
      defaultWriterReadyPromiseResolve(writer);
    }
  }
  stream._backpressure = backpressure;
}
var WritableStreamDefaultWriter = function() {
  function WritableStreamDefaultWriter2(stream) {
    assertRequiredArgument(stream, 1, "WritableStreamDefaultWriter");
    assertWritableStream(stream, "First parameter");
    if (IsWritableStreamLocked(stream)) {
      throw new TypeError("This stream has already been locked for exclusive writing by another writer");
    }
    this._ownerWritableStream = stream;
    stream._writer = this;
    var state = stream._state;
    if (state === "writable") {
      if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._backpressure) {
        defaultWriterReadyPromiseInitialize(this);
      } else {
        defaultWriterReadyPromiseInitializeAsResolved(this);
      }
      defaultWriterClosedPromiseInitialize(this);
    } else if (state === "erroring") {
      defaultWriterReadyPromiseInitializeAsRejected(this, stream._storedError);
      defaultWriterClosedPromiseInitialize(this);
    } else if (state === "closed") {
      defaultWriterReadyPromiseInitializeAsResolved(this);
      defaultWriterClosedPromiseInitializeAsResolved(this);
    } else {
      var storedError = stream._storedError;
      defaultWriterReadyPromiseInitializeAsRejected(this, storedError);
      defaultWriterClosedPromiseInitializeAsRejected(this, storedError);
    }
  }
  Object.defineProperty(WritableStreamDefaultWriter2.prototype, "closed", {
    get: function() {
      if (!IsWritableStreamDefaultWriter(this)) {
        return promiseRejectedWith(defaultWriterBrandCheckException("closed"));
      }
      return this._closedPromise;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(WritableStreamDefaultWriter2.prototype, "desiredSize", {
    get: function() {
      if (!IsWritableStreamDefaultWriter(this)) {
        throw defaultWriterBrandCheckException("desiredSize");
      }
      if (this._ownerWritableStream === void 0) {
        throw defaultWriterLockException("desiredSize");
      }
      return WritableStreamDefaultWriterGetDesiredSize(this);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(WritableStreamDefaultWriter2.prototype, "ready", {
    get: function() {
      if (!IsWritableStreamDefaultWriter(this)) {
        return promiseRejectedWith(defaultWriterBrandCheckException("ready"));
      }
      return this._readyPromise;
    },
    enumerable: false,
    configurable: true
  });
  WritableStreamDefaultWriter2.prototype.abort = function(reason) {
    if (reason === void 0) {
      reason = void 0;
    }
    if (!IsWritableStreamDefaultWriter(this)) {
      return promiseRejectedWith(defaultWriterBrandCheckException("abort"));
    }
    if (this._ownerWritableStream === void 0) {
      return promiseRejectedWith(defaultWriterLockException("abort"));
    }
    return WritableStreamDefaultWriterAbort(this, reason);
  };
  WritableStreamDefaultWriter2.prototype.close = function() {
    if (!IsWritableStreamDefaultWriter(this)) {
      return promiseRejectedWith(defaultWriterBrandCheckException("close"));
    }
    var stream = this._ownerWritableStream;
    if (stream === void 0) {
      return promiseRejectedWith(defaultWriterLockException("close"));
    }
    if (WritableStreamCloseQueuedOrInFlight(stream)) {
      return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
    }
    return WritableStreamDefaultWriterClose(this);
  };
  WritableStreamDefaultWriter2.prototype.releaseLock = function() {
    if (!IsWritableStreamDefaultWriter(this)) {
      throw defaultWriterBrandCheckException("releaseLock");
    }
    var stream = this._ownerWritableStream;
    if (stream === void 0) {
      return;
    }
    WritableStreamDefaultWriterRelease(this);
  };
  WritableStreamDefaultWriter2.prototype.write = function(chunk) {
    if (chunk === void 0) {
      chunk = void 0;
    }
    if (!IsWritableStreamDefaultWriter(this)) {
      return promiseRejectedWith(defaultWriterBrandCheckException("write"));
    }
    if (this._ownerWritableStream === void 0) {
      return promiseRejectedWith(defaultWriterLockException("write to"));
    }
    return WritableStreamDefaultWriterWrite(this, chunk);
  };
  return WritableStreamDefaultWriter2;
}();
Object.defineProperties(WritableStreamDefaultWriter.prototype, {
  abort: { enumerable: true },
  close: { enumerable: true },
  releaseLock: { enumerable: true },
  write: { enumerable: true },
  closed: { enumerable: true },
  desiredSize: { enumerable: true },
  ready: { enumerable: true }
});
if (typeof SymbolPolyfill.toStringTag === "symbol") {
  Object.defineProperty(WritableStreamDefaultWriter.prototype, SymbolPolyfill.toStringTag, {
    value: "WritableStreamDefaultWriter",
    configurable: true
  });
}
function IsWritableStreamDefaultWriter(x) {
  if (!typeIsObject(x)) {
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(x, "_ownerWritableStream")) {
    return false;
  }
  return x instanceof WritableStreamDefaultWriter;
}
function WritableStreamDefaultWriterAbort(writer, reason) {
  var stream = writer._ownerWritableStream;
  return WritableStreamAbort(stream, reason);
}
function WritableStreamDefaultWriterClose(writer) {
  var stream = writer._ownerWritableStream;
  return WritableStreamClose(stream);
}
function WritableStreamDefaultWriterCloseWithErrorPropagation(writer) {
  var stream = writer._ownerWritableStream;
  var state = stream._state;
  if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
    return promiseResolvedWith(void 0);
  }
  if (state === "errored") {
    return promiseRejectedWith(stream._storedError);
  }
  return WritableStreamDefaultWriterClose(writer);
}
function WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, error) {
  if (writer._closedPromiseState === "pending") {
    defaultWriterClosedPromiseReject(writer, error);
  } else {
    defaultWriterClosedPromiseResetToRejected(writer, error);
  }
}
function WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, error) {
  if (writer._readyPromiseState === "pending") {
    defaultWriterReadyPromiseReject(writer, error);
  } else {
    defaultWriterReadyPromiseResetToRejected(writer, error);
  }
}
function WritableStreamDefaultWriterGetDesiredSize(writer) {
  var stream = writer._ownerWritableStream;
  var state = stream._state;
  if (state === "errored" || state === "erroring") {
    return null;
  }
  if (state === "closed") {
    return 0;
  }
  return WritableStreamDefaultControllerGetDesiredSize(stream._writableStreamController);
}
function WritableStreamDefaultWriterRelease(writer) {
  var stream = writer._ownerWritableStream;
  var releasedError = new TypeError("Writer was released and can no longer be used to monitor the stream's closedness");
  WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, releasedError);
  WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, releasedError);
  stream._writer = void 0;
  writer._ownerWritableStream = void 0;
}
function WritableStreamDefaultWriterWrite(writer, chunk) {
  var stream = writer._ownerWritableStream;
  var controller = stream._writableStreamController;
  var chunkSize = WritableStreamDefaultControllerGetChunkSize(controller, chunk);
  if (stream !== writer._ownerWritableStream) {
    return promiseRejectedWith(defaultWriterLockException("write to"));
  }
  var state = stream._state;
  if (state === "errored") {
    return promiseRejectedWith(stream._storedError);
  }
  if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
    return promiseRejectedWith(new TypeError("The stream is closing or closed and cannot be written to"));
  }
  if (state === "erroring") {
    return promiseRejectedWith(stream._storedError);
  }
  var promise = WritableStreamAddWriteRequest(stream);
  WritableStreamDefaultControllerWrite(controller, chunk, chunkSize);
  return promise;
}
var closeSentinel = {};
var WritableStreamDefaultController = function() {
  function WritableStreamDefaultController2() {
    throw new TypeError("Illegal constructor");
  }
  Object.defineProperty(WritableStreamDefaultController2.prototype, "abortReason", {
    get: function() {
      if (!IsWritableStreamDefaultController(this)) {
        throw defaultControllerBrandCheckException$2("abortReason");
      }
      return this._abortReason;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(WritableStreamDefaultController2.prototype, "signal", {
    get: function() {
      if (!IsWritableStreamDefaultController(this)) {
        throw defaultControllerBrandCheckException$2("signal");
      }
      if (this._abortController === void 0) {
        throw new TypeError("WritableStreamDefaultController.prototype.signal is not supported");
      }
      return this._abortController.signal;
    },
    enumerable: false,
    configurable: true
  });
  WritableStreamDefaultController2.prototype.error = function(e) {
    if (e === void 0) {
      e = void 0;
    }
    if (!IsWritableStreamDefaultController(this)) {
      throw defaultControllerBrandCheckException$2("error");
    }
    var state = this._controlledWritableStream._state;
    if (state !== "writable") {
      return;
    }
    WritableStreamDefaultControllerError(this, e);
  };
  WritableStreamDefaultController2.prototype[AbortSteps] = function(reason) {
    var result = this._abortAlgorithm(reason);
    WritableStreamDefaultControllerClearAlgorithms(this);
    return result;
  };
  WritableStreamDefaultController2.prototype[ErrorSteps] = function() {
    ResetQueue(this);
  };
  return WritableStreamDefaultController2;
}();
Object.defineProperties(WritableStreamDefaultController.prototype, {
  abortReason: { enumerable: true },
  signal: { enumerable: true },
  error: { enumerable: true }
});
if (typeof SymbolPolyfill.toStringTag === "symbol") {
  Object.defineProperty(WritableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
    value: "WritableStreamDefaultController",
    configurable: true
  });
}
function IsWritableStreamDefaultController(x) {
  if (!typeIsObject(x)) {
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(x, "_controlledWritableStream")) {
    return false;
  }
  return x instanceof WritableStreamDefaultController;
}
function SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm) {
  controller._controlledWritableStream = stream;
  stream._writableStreamController = controller;
  controller._queue = void 0;
  controller._queueTotalSize = void 0;
  ResetQueue(controller);
  controller._abortReason = void 0;
  controller._abortController = createAbortController();
  controller._started = false;
  controller._strategySizeAlgorithm = sizeAlgorithm;
  controller._strategyHWM = highWaterMark;
  controller._writeAlgorithm = writeAlgorithm;
  controller._closeAlgorithm = closeAlgorithm;
  controller._abortAlgorithm = abortAlgorithm;
  var backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
  WritableStreamUpdateBackpressure(stream, backpressure);
  var startResult = startAlgorithm();
  var startPromise = promiseResolvedWith(startResult);
  uponPromise(startPromise, function() {
    controller._started = true;
    WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
  }, function(r) {
    controller._started = true;
    WritableStreamDealWithRejection(stream, r);
  });
}
function SetUpWritableStreamDefaultControllerFromUnderlyingSink(stream, underlyingSink, highWaterMark, sizeAlgorithm) {
  var controller = Object.create(WritableStreamDefaultController.prototype);
  var startAlgorithm = function() {
    return void 0;
  };
  var writeAlgorithm = function() {
    return promiseResolvedWith(void 0);
  };
  var closeAlgorithm = function() {
    return promiseResolvedWith(void 0);
  };
  var abortAlgorithm = function() {
    return promiseResolvedWith(void 0);
  };
  if (underlyingSink.start !== void 0) {
    startAlgorithm = function() {
      return underlyingSink.start(controller);
    };
  }
  if (underlyingSink.write !== void 0) {
    writeAlgorithm = function(chunk) {
      return underlyingSink.write(chunk, controller);
    };
  }
  if (underlyingSink.close !== void 0) {
    closeAlgorithm = function() {
      return underlyingSink.close();
    };
  }
  if (underlyingSink.abort !== void 0) {
    abortAlgorithm = function(reason) {
      return underlyingSink.abort(reason);
    };
  }
  SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
}
function WritableStreamDefaultControllerClearAlgorithms(controller) {
  controller._writeAlgorithm = void 0;
  controller._closeAlgorithm = void 0;
  controller._abortAlgorithm = void 0;
  controller._strategySizeAlgorithm = void 0;
}
function WritableStreamDefaultControllerClose(controller) {
  EnqueueValueWithSize(controller, closeSentinel, 0);
  WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
}
function WritableStreamDefaultControllerGetChunkSize(controller, chunk) {
  try {
    return controller._strategySizeAlgorithm(chunk);
  } catch (chunkSizeE) {
    WritableStreamDefaultControllerErrorIfNeeded(controller, chunkSizeE);
    return 1;
  }
}
function WritableStreamDefaultControllerGetDesiredSize(controller) {
  return controller._strategyHWM - controller._queueTotalSize;
}
function WritableStreamDefaultControllerWrite(controller, chunk, chunkSize) {
  try {
    EnqueueValueWithSize(controller, chunk, chunkSize);
  } catch (enqueueE) {
    WritableStreamDefaultControllerErrorIfNeeded(controller, enqueueE);
    return;
  }
  var stream = controller._controlledWritableStream;
  if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._state === "writable") {
    var backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
    WritableStreamUpdateBackpressure(stream, backpressure);
  }
  WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
}
function WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller) {
  var stream = controller._controlledWritableStream;
  if (!controller._started) {
    return;
  }
  if (stream._inFlightWriteRequest !== void 0) {
    return;
  }
  var state = stream._state;
  if (state === "erroring") {
    WritableStreamFinishErroring(stream);
    return;
  }
  if (controller._queue.length === 0) {
    return;
  }
  var value = PeekQueueValue(controller);
  if (value === closeSentinel) {
    WritableStreamDefaultControllerProcessClose(controller);
  } else {
    WritableStreamDefaultControllerProcessWrite(controller, value);
  }
}
function WritableStreamDefaultControllerErrorIfNeeded(controller, error) {
  if (controller._controlledWritableStream._state === "writable") {
    WritableStreamDefaultControllerError(controller, error);
  }
}
function WritableStreamDefaultControllerProcessClose(controller) {
  var stream = controller._controlledWritableStream;
  WritableStreamMarkCloseRequestInFlight(stream);
  DequeueValue(controller);
  var sinkClosePromise = controller._closeAlgorithm();
  WritableStreamDefaultControllerClearAlgorithms(controller);
  uponPromise(sinkClosePromise, function() {
    WritableStreamFinishInFlightClose(stream);
  }, function(reason) {
    WritableStreamFinishInFlightCloseWithError(stream, reason);
  });
}
function WritableStreamDefaultControllerProcessWrite(controller, chunk) {
  var stream = controller._controlledWritableStream;
  WritableStreamMarkFirstWriteRequestInFlight(stream);
  var sinkWritePromise = controller._writeAlgorithm(chunk);
  uponPromise(sinkWritePromise, function() {
    WritableStreamFinishInFlightWrite(stream);
    var state = stream._state;
    DequeueValue(controller);
    if (!WritableStreamCloseQueuedOrInFlight(stream) && state === "writable") {
      var backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
      WritableStreamUpdateBackpressure(stream, backpressure);
    }
    WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
  }, function(reason) {
    if (stream._state === "writable") {
      WritableStreamDefaultControllerClearAlgorithms(controller);
    }
    WritableStreamFinishInFlightWriteWithError(stream, reason);
  });
}
function WritableStreamDefaultControllerGetBackpressure(controller) {
  var desiredSize = WritableStreamDefaultControllerGetDesiredSize(controller);
  return desiredSize <= 0;
}
function WritableStreamDefaultControllerError(controller, error) {
  var stream = controller._controlledWritableStream;
  WritableStreamDefaultControllerClearAlgorithms(controller);
  WritableStreamStartErroring(stream, error);
}
function streamBrandCheckException$2(name) {
  return new TypeError("WritableStream.prototype." + name + " can only be used on a WritableStream");
}
function defaultControllerBrandCheckException$2(name) {
  return new TypeError("WritableStreamDefaultController.prototype." + name + " can only be used on a WritableStreamDefaultController");
}
function defaultWriterBrandCheckException(name) {
  return new TypeError("WritableStreamDefaultWriter.prototype." + name + " can only be used on a WritableStreamDefaultWriter");
}
function defaultWriterLockException(name) {
  return new TypeError("Cannot " + name + " a stream using a released writer");
}
function defaultWriterClosedPromiseInitialize(writer) {
  writer._closedPromise = newPromise(function(resolve, reject) {
    writer._closedPromise_resolve = resolve;
    writer._closedPromise_reject = reject;
    writer._closedPromiseState = "pending";
  });
}
function defaultWriterClosedPromiseInitializeAsRejected(writer, reason) {
  defaultWriterClosedPromiseInitialize(writer);
  defaultWriterClosedPromiseReject(writer, reason);
}
function defaultWriterClosedPromiseInitializeAsResolved(writer) {
  defaultWriterClosedPromiseInitialize(writer);
  defaultWriterClosedPromiseResolve(writer);
}
function defaultWriterClosedPromiseReject(writer, reason) {
  if (writer._closedPromise_reject === void 0) {
    return;
  }
  setPromiseIsHandledToTrue(writer._closedPromise);
  writer._closedPromise_reject(reason);
  writer._closedPromise_resolve = void 0;
  writer._closedPromise_reject = void 0;
  writer._closedPromiseState = "rejected";
}
function defaultWriterClosedPromiseResetToRejected(writer, reason) {
  defaultWriterClosedPromiseInitializeAsRejected(writer, reason);
}
function defaultWriterClosedPromiseResolve(writer) {
  if (writer._closedPromise_resolve === void 0) {
    return;
  }
  writer._closedPromise_resolve(void 0);
  writer._closedPromise_resolve = void 0;
  writer._closedPromise_reject = void 0;
  writer._closedPromiseState = "resolved";
}
function defaultWriterReadyPromiseInitialize(writer) {
  writer._readyPromise = newPromise(function(resolve, reject) {
    writer._readyPromise_resolve = resolve;
    writer._readyPromise_reject = reject;
  });
  writer._readyPromiseState = "pending";
}
function defaultWriterReadyPromiseInitializeAsRejected(writer, reason) {
  defaultWriterReadyPromiseInitialize(writer);
  defaultWriterReadyPromiseReject(writer, reason);
}
function defaultWriterReadyPromiseInitializeAsResolved(writer) {
  defaultWriterReadyPromiseInitialize(writer);
  defaultWriterReadyPromiseResolve(writer);
}
function defaultWriterReadyPromiseReject(writer, reason) {
  if (writer._readyPromise_reject === void 0) {
    return;
  }
  setPromiseIsHandledToTrue(writer._readyPromise);
  writer._readyPromise_reject(reason);
  writer._readyPromise_resolve = void 0;
  writer._readyPromise_reject = void 0;
  writer._readyPromiseState = "rejected";
}
function defaultWriterReadyPromiseReset(writer) {
  defaultWriterReadyPromiseInitialize(writer);
}
function defaultWriterReadyPromiseResetToRejected(writer, reason) {
  defaultWriterReadyPromiseInitializeAsRejected(writer, reason);
}
function defaultWriterReadyPromiseResolve(writer) {
  if (writer._readyPromise_resolve === void 0) {
    return;
  }
  writer._readyPromise_resolve(void 0);
  writer._readyPromise_resolve = void 0;
  writer._readyPromise_reject = void 0;
  writer._readyPromiseState = "fulfilled";
}
var NativeDOMException = typeof DOMException !== "undefined" ? DOMException : void 0;
function isDOMExceptionConstructor(ctor) {
  if (!(typeof ctor === "function" || typeof ctor === "object")) {
    return false;
  }
  try {
    new ctor();
    return true;
  } catch (_a2) {
    return false;
  }
}
function createDOMExceptionPolyfill() {
  var ctor = function DOMException2(message, name) {
    this.message = message || "";
    this.name = name || "Error";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  };
  ctor.prototype = Object.create(Error.prototype);
  Object.defineProperty(ctor.prototype, "constructor", { value: ctor, writable: true, configurable: true });
  return ctor;
}
var DOMException$1 = isDOMExceptionConstructor(NativeDOMException) ? NativeDOMException : createDOMExceptionPolyfill();
function ReadableStreamPipeTo(source, dest, preventClose, preventAbort, preventCancel, signal) {
  var reader = AcquireReadableStreamDefaultReader(source);
  var writer = AcquireWritableStreamDefaultWriter(dest);
  source._disturbed = true;
  var shuttingDown = false;
  var currentWrite = promiseResolvedWith(void 0);
  return newPromise(function(resolve, reject) {
    var abortAlgorithm;
    if (signal !== void 0) {
      abortAlgorithm = function() {
        var error = new DOMException$1("Aborted", "AbortError");
        var actions = [];
        if (!preventAbort) {
          actions.push(function() {
            if (dest._state === "writable") {
              return WritableStreamAbort(dest, error);
            }
            return promiseResolvedWith(void 0);
          });
        }
        if (!preventCancel) {
          actions.push(function() {
            if (source._state === "readable") {
              return ReadableStreamCancel(source, error);
            }
            return promiseResolvedWith(void 0);
          });
        }
        shutdownWithAction(function() {
          return Promise.all(actions.map(function(action) {
            return action();
          }));
        }, true, error);
      };
      if (signal.aborted) {
        abortAlgorithm();
        return;
      }
      signal.addEventListener("abort", abortAlgorithm);
    }
    function pipeLoop() {
      return newPromise(function(resolveLoop, rejectLoop) {
        function next(done) {
          if (done) {
            resolveLoop();
          } else {
            PerformPromiseThen(pipeStep(), next, rejectLoop);
          }
        }
        next(false);
      });
    }
    function pipeStep() {
      if (shuttingDown) {
        return promiseResolvedWith(true);
      }
      return PerformPromiseThen(writer._readyPromise, function() {
        return newPromise(function(resolveRead, rejectRead) {
          ReadableStreamDefaultReaderRead(reader, {
            _chunkSteps: function(chunk) {
              currentWrite = PerformPromiseThen(WritableStreamDefaultWriterWrite(writer, chunk), void 0, noop);
              resolveRead(false);
            },
            _closeSteps: function() {
              return resolveRead(true);
            },
            _errorSteps: rejectRead
          });
        });
      });
    }
    isOrBecomesErrored(source, reader._closedPromise, function(storedError) {
      if (!preventAbort) {
        shutdownWithAction(function() {
          return WritableStreamAbort(dest, storedError);
        }, true, storedError);
      } else {
        shutdown(true, storedError);
      }
    });
    isOrBecomesErrored(dest, writer._closedPromise, function(storedError) {
      if (!preventCancel) {
        shutdownWithAction(function() {
          return ReadableStreamCancel(source, storedError);
        }, true, storedError);
      } else {
        shutdown(true, storedError);
      }
    });
    isOrBecomesClosed(source, reader._closedPromise, function() {
      if (!preventClose) {
        shutdownWithAction(function() {
          return WritableStreamDefaultWriterCloseWithErrorPropagation(writer);
        });
      } else {
        shutdown();
      }
    });
    if (WritableStreamCloseQueuedOrInFlight(dest) || dest._state === "closed") {
      var destClosed_1 = new TypeError("the destination writable stream closed before all data could be piped to it");
      if (!preventCancel) {
        shutdownWithAction(function() {
          return ReadableStreamCancel(source, destClosed_1);
        }, true, destClosed_1);
      } else {
        shutdown(true, destClosed_1);
      }
    }
    setPromiseIsHandledToTrue(pipeLoop());
    function waitForWritesToFinish() {
      var oldCurrentWrite = currentWrite;
      return PerformPromiseThen(currentWrite, function() {
        return oldCurrentWrite !== currentWrite ? waitForWritesToFinish() : void 0;
      });
    }
    function isOrBecomesErrored(stream, promise, action) {
      if (stream._state === "errored") {
        action(stream._storedError);
      } else {
        uponRejection(promise, action);
      }
    }
    function isOrBecomesClosed(stream, promise, action) {
      if (stream._state === "closed") {
        action();
      } else {
        uponFulfillment(promise, action);
      }
    }
    function shutdownWithAction(action, originalIsError, originalError) {
      if (shuttingDown) {
        return;
      }
      shuttingDown = true;
      if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
        uponFulfillment(waitForWritesToFinish(), doTheRest);
      } else {
        doTheRest();
      }
      function doTheRest() {
        uponPromise(action(), function() {
          return finalize(originalIsError, originalError);
        }, function(newError) {
          return finalize(true, newError);
        });
      }
    }
    function shutdown(isError, error) {
      if (shuttingDown) {
        return;
      }
      shuttingDown = true;
      if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
        uponFulfillment(waitForWritesToFinish(), function() {
          return finalize(isError, error);
        });
      } else {
        finalize(isError, error);
      }
    }
    function finalize(isError, error) {
      WritableStreamDefaultWriterRelease(writer);
      ReadableStreamReaderGenericRelease(reader);
      if (signal !== void 0) {
        signal.removeEventListener("abort", abortAlgorithm);
      }
      if (isError) {
        reject(error);
      } else {
        resolve(void 0);
      }
    }
  });
}
var ReadableStreamDefaultController = function() {
  function ReadableStreamDefaultController2() {
    throw new TypeError("Illegal constructor");
  }
  Object.defineProperty(ReadableStreamDefaultController2.prototype, "desiredSize", {
    get: function() {
      if (!IsReadableStreamDefaultController(this)) {
        throw defaultControllerBrandCheckException$1("desiredSize");
      }
      return ReadableStreamDefaultControllerGetDesiredSize(this);
    },
    enumerable: false,
    configurable: true
  });
  ReadableStreamDefaultController2.prototype.close = function() {
    if (!IsReadableStreamDefaultController(this)) {
      throw defaultControllerBrandCheckException$1("close");
    }
    if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
      throw new TypeError("The stream is not in a state that permits close");
    }
    ReadableStreamDefaultControllerClose(this);
  };
  ReadableStreamDefaultController2.prototype.enqueue = function(chunk) {
    if (chunk === void 0) {
      chunk = void 0;
    }
    if (!IsReadableStreamDefaultController(this)) {
      throw defaultControllerBrandCheckException$1("enqueue");
    }
    if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
      throw new TypeError("The stream is not in a state that permits enqueue");
    }
    return ReadableStreamDefaultControllerEnqueue(this, chunk);
  };
  ReadableStreamDefaultController2.prototype.error = function(e) {
    if (e === void 0) {
      e = void 0;
    }
    if (!IsReadableStreamDefaultController(this)) {
      throw defaultControllerBrandCheckException$1("error");
    }
    ReadableStreamDefaultControllerError(this, e);
  };
  ReadableStreamDefaultController2.prototype[CancelSteps] = function(reason) {
    ResetQueue(this);
    var result = this._cancelAlgorithm(reason);
    ReadableStreamDefaultControllerClearAlgorithms(this);
    return result;
  };
  ReadableStreamDefaultController2.prototype[PullSteps] = function(readRequest) {
    var stream = this._controlledReadableStream;
    if (this._queue.length > 0) {
      var chunk = DequeueValue(this);
      if (this._closeRequested && this._queue.length === 0) {
        ReadableStreamDefaultControllerClearAlgorithms(this);
        ReadableStreamClose(stream);
      } else {
        ReadableStreamDefaultControllerCallPullIfNeeded(this);
      }
      readRequest._chunkSteps(chunk);
    } else {
      ReadableStreamAddReadRequest(stream, readRequest);
      ReadableStreamDefaultControllerCallPullIfNeeded(this);
    }
  };
  return ReadableStreamDefaultController2;
}();
Object.defineProperties(ReadableStreamDefaultController.prototype, {
  close: { enumerable: true },
  enqueue: { enumerable: true },
  error: { enumerable: true },
  desiredSize: { enumerable: true }
});
if (typeof SymbolPolyfill.toStringTag === "symbol") {
  Object.defineProperty(ReadableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
    value: "ReadableStreamDefaultController",
    configurable: true
  });
}
function IsReadableStreamDefaultController(x) {
  if (!typeIsObject(x)) {
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(x, "_controlledReadableStream")) {
    return false;
  }
  return x instanceof ReadableStreamDefaultController;
}
function ReadableStreamDefaultControllerCallPullIfNeeded(controller) {
  var shouldPull = ReadableStreamDefaultControllerShouldCallPull(controller);
  if (!shouldPull) {
    return;
  }
  if (controller._pulling) {
    controller._pullAgain = true;
    return;
  }
  controller._pulling = true;
  var pullPromise = controller._pullAlgorithm();
  uponPromise(pullPromise, function() {
    controller._pulling = false;
    if (controller._pullAgain) {
      controller._pullAgain = false;
      ReadableStreamDefaultControllerCallPullIfNeeded(controller);
    }
  }, function(e) {
    ReadableStreamDefaultControllerError(controller, e);
  });
}
function ReadableStreamDefaultControllerShouldCallPull(controller) {
  var stream = controller._controlledReadableStream;
  if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
    return false;
  }
  if (!controller._started) {
    return false;
  }
  if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
    return true;
  }
  var desiredSize = ReadableStreamDefaultControllerGetDesiredSize(controller);
  if (desiredSize > 0) {
    return true;
  }
  return false;
}
function ReadableStreamDefaultControllerClearAlgorithms(controller) {
  controller._pullAlgorithm = void 0;
  controller._cancelAlgorithm = void 0;
  controller._strategySizeAlgorithm = void 0;
}
function ReadableStreamDefaultControllerClose(controller) {
  if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
    return;
  }
  var stream = controller._controlledReadableStream;
  controller._closeRequested = true;
  if (controller._queue.length === 0) {
    ReadableStreamDefaultControllerClearAlgorithms(controller);
    ReadableStreamClose(stream);
  }
}
function ReadableStreamDefaultControllerEnqueue(controller, chunk) {
  if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
    return;
  }
  var stream = controller._controlledReadableStream;
  if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
    ReadableStreamFulfillReadRequest(stream, chunk, false);
  } else {
    var chunkSize = void 0;
    try {
      chunkSize = controller._strategySizeAlgorithm(chunk);
    } catch (chunkSizeE) {
      ReadableStreamDefaultControllerError(controller, chunkSizeE);
      throw chunkSizeE;
    }
    try {
      EnqueueValueWithSize(controller, chunk, chunkSize);
    } catch (enqueueE) {
      ReadableStreamDefaultControllerError(controller, enqueueE);
      throw enqueueE;
    }
  }
  ReadableStreamDefaultControllerCallPullIfNeeded(controller);
}
function ReadableStreamDefaultControllerError(controller, e) {
  var stream = controller._controlledReadableStream;
  if (stream._state !== "readable") {
    return;
  }
  ResetQueue(controller);
  ReadableStreamDefaultControllerClearAlgorithms(controller);
  ReadableStreamError(stream, e);
}
function ReadableStreamDefaultControllerGetDesiredSize(controller) {
  var state = controller._controlledReadableStream._state;
  if (state === "errored") {
    return null;
  }
  if (state === "closed") {
    return 0;
  }
  return controller._strategyHWM - controller._queueTotalSize;
}
function ReadableStreamDefaultControllerHasBackpressure(controller) {
  if (ReadableStreamDefaultControllerShouldCallPull(controller)) {
    return false;
  }
  return true;
}
function ReadableStreamDefaultControllerCanCloseOrEnqueue(controller) {
  var state = controller._controlledReadableStream._state;
  if (!controller._closeRequested && state === "readable") {
    return true;
  }
  return false;
}
function SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm) {
  controller._controlledReadableStream = stream;
  controller._queue = void 0;
  controller._queueTotalSize = void 0;
  ResetQueue(controller);
  controller._started = false;
  controller._closeRequested = false;
  controller._pullAgain = false;
  controller._pulling = false;
  controller._strategySizeAlgorithm = sizeAlgorithm;
  controller._strategyHWM = highWaterMark;
  controller._pullAlgorithm = pullAlgorithm;
  controller._cancelAlgorithm = cancelAlgorithm;
  stream._readableStreamController = controller;
  var startResult = startAlgorithm();
  uponPromise(promiseResolvedWith(startResult), function() {
    controller._started = true;
    ReadableStreamDefaultControllerCallPullIfNeeded(controller);
  }, function(r) {
    ReadableStreamDefaultControllerError(controller, r);
  });
}
function SetUpReadableStreamDefaultControllerFromUnderlyingSource(stream, underlyingSource, highWaterMark, sizeAlgorithm) {
  var controller = Object.create(ReadableStreamDefaultController.prototype);
  var startAlgorithm = function() {
    return void 0;
  };
  var pullAlgorithm = function() {
    return promiseResolvedWith(void 0);
  };
  var cancelAlgorithm = function() {
    return promiseResolvedWith(void 0);
  };
  if (underlyingSource.start !== void 0) {
    startAlgorithm = function() {
      return underlyingSource.start(controller);
    };
  }
  if (underlyingSource.pull !== void 0) {
    pullAlgorithm = function() {
      return underlyingSource.pull(controller);
    };
  }
  if (underlyingSource.cancel !== void 0) {
    cancelAlgorithm = function(reason) {
      return underlyingSource.cancel(reason);
    };
  }
  SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
}
function defaultControllerBrandCheckException$1(name) {
  return new TypeError("ReadableStreamDefaultController.prototype." + name + " can only be used on a ReadableStreamDefaultController");
}
function ReadableStreamTee(stream, cloneForBranch2) {
  if (IsReadableByteStreamController(stream._readableStreamController)) {
    return ReadableByteStreamTee(stream);
  }
  return ReadableStreamDefaultTee(stream);
}
function ReadableStreamDefaultTee(stream, cloneForBranch2) {
  var reader = AcquireReadableStreamDefaultReader(stream);
  var reading = false;
  var readAgain = false;
  var canceled1 = false;
  var canceled2 = false;
  var reason1;
  var reason2;
  var branch1;
  var branch2;
  var resolveCancelPromise;
  var cancelPromise = newPromise(function(resolve) {
    resolveCancelPromise = resolve;
  });
  function pullAlgorithm() {
    if (reading) {
      readAgain = true;
      return promiseResolvedWith(void 0);
    }
    reading = true;
    var readRequest = {
      _chunkSteps: function(chunk) {
        queueMicrotask(function() {
          readAgain = false;
          var chunk1 = chunk;
          var chunk2 = chunk;
          if (!canceled1) {
            ReadableStreamDefaultControllerEnqueue(branch1._readableStreamController, chunk1);
          }
          if (!canceled2) {
            ReadableStreamDefaultControllerEnqueue(branch2._readableStreamController, chunk2);
          }
          reading = false;
          if (readAgain) {
            pullAlgorithm();
          }
        });
      },
      _closeSteps: function() {
        reading = false;
        if (!canceled1) {
          ReadableStreamDefaultControllerClose(branch1._readableStreamController);
        }
        if (!canceled2) {
          ReadableStreamDefaultControllerClose(branch2._readableStreamController);
        }
        if (!canceled1 || !canceled2) {
          resolveCancelPromise(void 0);
        }
      },
      _errorSteps: function() {
        reading = false;
      }
    };
    ReadableStreamDefaultReaderRead(reader, readRequest);
    return promiseResolvedWith(void 0);
  }
  function cancel1Algorithm(reason) {
    canceled1 = true;
    reason1 = reason;
    if (canceled2) {
      var compositeReason = CreateArrayFromList([reason1, reason2]);
      var cancelResult = ReadableStreamCancel(stream, compositeReason);
      resolveCancelPromise(cancelResult);
    }
    return cancelPromise;
  }
  function cancel2Algorithm(reason) {
    canceled2 = true;
    reason2 = reason;
    if (canceled1) {
      var compositeReason = CreateArrayFromList([reason1, reason2]);
      var cancelResult = ReadableStreamCancel(stream, compositeReason);
      resolveCancelPromise(cancelResult);
    }
    return cancelPromise;
  }
  function startAlgorithm() {
  }
  branch1 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel1Algorithm);
  branch2 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel2Algorithm);
  uponRejection(reader._closedPromise, function(r) {
    ReadableStreamDefaultControllerError(branch1._readableStreamController, r);
    ReadableStreamDefaultControllerError(branch2._readableStreamController, r);
    if (!canceled1 || !canceled2) {
      resolveCancelPromise(void 0);
    }
  });
  return [branch1, branch2];
}
function ReadableByteStreamTee(stream) {
  var reader = AcquireReadableStreamDefaultReader(stream);
  var reading = false;
  var readAgainForBranch1 = false;
  var readAgainForBranch2 = false;
  var canceled1 = false;
  var canceled2 = false;
  var reason1;
  var reason2;
  var branch1;
  var branch2;
  var resolveCancelPromise;
  var cancelPromise = newPromise(function(resolve) {
    resolveCancelPromise = resolve;
  });
  function forwardReaderError(thisReader) {
    uponRejection(thisReader._closedPromise, function(r) {
      if (thisReader !== reader) {
        return;
      }
      ReadableByteStreamControllerError(branch1._readableStreamController, r);
      ReadableByteStreamControllerError(branch2._readableStreamController, r);
      if (!canceled1 || !canceled2) {
        resolveCancelPromise(void 0);
      }
    });
  }
  function pullWithDefaultReader() {
    if (IsReadableStreamBYOBReader(reader)) {
      ReadableStreamReaderGenericRelease(reader);
      reader = AcquireReadableStreamDefaultReader(stream);
      forwardReaderError(reader);
    }
    var readRequest = {
      _chunkSteps: function(chunk) {
        queueMicrotask(function() {
          readAgainForBranch1 = false;
          readAgainForBranch2 = false;
          var chunk1 = chunk;
          var chunk2 = chunk;
          if (!canceled1 && !canceled2) {
            try {
              chunk2 = CloneAsUint8Array(chunk);
            } catch (cloneE) {
              ReadableByteStreamControllerError(branch1._readableStreamController, cloneE);
              ReadableByteStreamControllerError(branch2._readableStreamController, cloneE);
              resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
              return;
            }
          }
          if (!canceled1) {
            ReadableByteStreamControllerEnqueue(branch1._readableStreamController, chunk1);
          }
          if (!canceled2) {
            ReadableByteStreamControllerEnqueue(branch2._readableStreamController, chunk2);
          }
          reading = false;
          if (readAgainForBranch1) {
            pull1Algorithm();
          } else if (readAgainForBranch2) {
            pull2Algorithm();
          }
        });
      },
      _closeSteps: function() {
        reading = false;
        if (!canceled1) {
          ReadableByteStreamControllerClose(branch1._readableStreamController);
        }
        if (!canceled2) {
          ReadableByteStreamControllerClose(branch2._readableStreamController);
        }
        if (branch1._readableStreamController._pendingPullIntos.length > 0) {
          ReadableByteStreamControllerRespond(branch1._readableStreamController, 0);
        }
        if (branch2._readableStreamController._pendingPullIntos.length > 0) {
          ReadableByteStreamControllerRespond(branch2._readableStreamController, 0);
        }
        if (!canceled1 || !canceled2) {
          resolveCancelPromise(void 0);
        }
      },
      _errorSteps: function() {
        reading = false;
      }
    };
    ReadableStreamDefaultReaderRead(reader, readRequest);
  }
  function pullWithBYOBReader(view, forBranch2) {
    if (IsReadableStreamDefaultReader(reader)) {
      ReadableStreamReaderGenericRelease(reader);
      reader = AcquireReadableStreamBYOBReader(stream);
      forwardReaderError(reader);
    }
    var byobBranch = forBranch2 ? branch2 : branch1;
    var otherBranch = forBranch2 ? branch1 : branch2;
    var readIntoRequest = {
      _chunkSteps: function(chunk) {
        queueMicrotask(function() {
          readAgainForBranch1 = false;
          readAgainForBranch2 = false;
          var byobCanceled = forBranch2 ? canceled2 : canceled1;
          var otherCanceled = forBranch2 ? canceled1 : canceled2;
          if (!otherCanceled) {
            var clonedChunk = void 0;
            try {
              clonedChunk = CloneAsUint8Array(chunk);
            } catch (cloneE) {
              ReadableByteStreamControllerError(byobBranch._readableStreamController, cloneE);
              ReadableByteStreamControllerError(otherBranch._readableStreamController, cloneE);
              resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
              return;
            }
            if (!byobCanceled) {
              ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
            }
            ReadableByteStreamControllerEnqueue(otherBranch._readableStreamController, clonedChunk);
          } else if (!byobCanceled) {
            ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
          }
          reading = false;
          if (readAgainForBranch1) {
            pull1Algorithm();
          } else if (readAgainForBranch2) {
            pull2Algorithm();
          }
        });
      },
      _closeSteps: function(chunk) {
        reading = false;
        var byobCanceled = forBranch2 ? canceled2 : canceled1;
        var otherCanceled = forBranch2 ? canceled1 : canceled2;
        if (!byobCanceled) {
          ReadableByteStreamControllerClose(byobBranch._readableStreamController);
        }
        if (!otherCanceled) {
          ReadableByteStreamControllerClose(otherBranch._readableStreamController);
        }
        if (chunk !== void 0) {
          if (!byobCanceled) {
            ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
          }
          if (!otherCanceled && otherBranch._readableStreamController._pendingPullIntos.length > 0) {
            ReadableByteStreamControllerRespond(otherBranch._readableStreamController, 0);
          }
        }
        if (!byobCanceled || !otherCanceled) {
          resolveCancelPromise(void 0);
        }
      },
      _errorSteps: function() {
        reading = false;
      }
    };
    ReadableStreamBYOBReaderRead(reader, view, readIntoRequest);
  }
  function pull1Algorithm() {
    if (reading) {
      readAgainForBranch1 = true;
      return promiseResolvedWith(void 0);
    }
    reading = true;
    var byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch1._readableStreamController);
    if (byobRequest === null) {
      pullWithDefaultReader();
    } else {
      pullWithBYOBReader(byobRequest._view, false);
    }
    return promiseResolvedWith(void 0);
  }
  function pull2Algorithm() {
    if (reading) {
      readAgainForBranch2 = true;
      return promiseResolvedWith(void 0);
    }
    reading = true;
    var byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch2._readableStreamController);
    if (byobRequest === null) {
      pullWithDefaultReader();
    } else {
      pullWithBYOBReader(byobRequest._view, true);
    }
    return promiseResolvedWith(void 0);
  }
  function cancel1Algorithm(reason) {
    canceled1 = true;
    reason1 = reason;
    if (canceled2) {
      var compositeReason = CreateArrayFromList([reason1, reason2]);
      var cancelResult = ReadableStreamCancel(stream, compositeReason);
      resolveCancelPromise(cancelResult);
    }
    return cancelPromise;
  }
  function cancel2Algorithm(reason) {
    canceled2 = true;
    reason2 = reason;
    if (canceled1) {
      var compositeReason = CreateArrayFromList([reason1, reason2]);
      var cancelResult = ReadableStreamCancel(stream, compositeReason);
      resolveCancelPromise(cancelResult);
    }
    return cancelPromise;
  }
  function startAlgorithm() {
    return;
  }
  branch1 = CreateReadableByteStream(startAlgorithm, pull1Algorithm, cancel1Algorithm);
  branch2 = CreateReadableByteStream(startAlgorithm, pull2Algorithm, cancel2Algorithm);
  forwardReaderError(reader);
  return [branch1, branch2];
}
function convertUnderlyingDefaultOrByteSource(source, context) {
  assertDictionary(source, context);
  var original = source;
  var autoAllocateChunkSize = original === null || original === void 0 ? void 0 : original.autoAllocateChunkSize;
  var cancel = original === null || original === void 0 ? void 0 : original.cancel;
  var pull = original === null || original === void 0 ? void 0 : original.pull;
  var start = original === null || original === void 0 ? void 0 : original.start;
  var type = original === null || original === void 0 ? void 0 : original.type;
  return {
    autoAllocateChunkSize: autoAllocateChunkSize === void 0 ? void 0 : convertUnsignedLongLongWithEnforceRange(autoAllocateChunkSize, context + " has member 'autoAllocateChunkSize' that"),
    cancel: cancel === void 0 ? void 0 : convertUnderlyingSourceCancelCallback(cancel, original, context + " has member 'cancel' that"),
    pull: pull === void 0 ? void 0 : convertUnderlyingSourcePullCallback(pull, original, context + " has member 'pull' that"),
    start: start === void 0 ? void 0 : convertUnderlyingSourceStartCallback(start, original, context + " has member 'start' that"),
    type: type === void 0 ? void 0 : convertReadableStreamType(type, context + " has member 'type' that")
  };
}
function convertUnderlyingSourceCancelCallback(fn, original, context) {
  assertFunction(fn, context);
  return function(reason) {
    return promiseCall(fn, original, [reason]);
  };
}
function convertUnderlyingSourcePullCallback(fn, original, context) {
  assertFunction(fn, context);
  return function(controller) {
    return promiseCall(fn, original, [controller]);
  };
}
function convertUnderlyingSourceStartCallback(fn, original, context) {
  assertFunction(fn, context);
  return function(controller) {
    return reflectCall(fn, original, [controller]);
  };
}
function convertReadableStreamType(type, context) {
  type = "" + type;
  if (type !== "bytes") {
    throw new TypeError(context + " '" + type + "' is not a valid enumeration value for ReadableStreamType");
  }
  return type;
}
function convertReaderOptions(options, context) {
  assertDictionary(options, context);
  var mode = options === null || options === void 0 ? void 0 : options.mode;
  return {
    mode: mode === void 0 ? void 0 : convertReadableStreamReaderMode(mode, context + " has member 'mode' that")
  };
}
function convertReadableStreamReaderMode(mode, context) {
  mode = "" + mode;
  if (mode !== "byob") {
    throw new TypeError(context + " '" + mode + "' is not a valid enumeration value for ReadableStreamReaderMode");
  }
  return mode;
}
function convertIteratorOptions(options, context) {
  assertDictionary(options, context);
  var preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
  return { preventCancel: Boolean(preventCancel) };
}
function convertPipeOptions(options, context) {
  assertDictionary(options, context);
  var preventAbort = options === null || options === void 0 ? void 0 : options.preventAbort;
  var preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
  var preventClose = options === null || options === void 0 ? void 0 : options.preventClose;
  var signal = options === null || options === void 0 ? void 0 : options.signal;
  if (signal !== void 0) {
    assertAbortSignal(signal, context + " has member 'signal' that");
  }
  return {
    preventAbort: Boolean(preventAbort),
    preventCancel: Boolean(preventCancel),
    preventClose: Boolean(preventClose),
    signal
  };
}
function assertAbortSignal(signal, context) {
  if (!isAbortSignal(signal)) {
    throw new TypeError(context + " is not an AbortSignal.");
  }
}
function convertReadableWritablePair(pair, context) {
  assertDictionary(pair, context);
  var readable = pair === null || pair === void 0 ? void 0 : pair.readable;
  assertRequiredField(readable, "readable", "ReadableWritablePair");
  assertReadableStream(readable, context + " has member 'readable' that");
  var writable = pair === null || pair === void 0 ? void 0 : pair.writable;
  assertRequiredField(writable, "writable", "ReadableWritablePair");
  assertWritableStream(writable, context + " has member 'writable' that");
  return { readable, writable };
}
var ReadableStream = function() {
  function ReadableStream2(rawUnderlyingSource, rawStrategy) {
    if (rawUnderlyingSource === void 0) {
      rawUnderlyingSource = {};
    }
    if (rawStrategy === void 0) {
      rawStrategy = {};
    }
    if (rawUnderlyingSource === void 0) {
      rawUnderlyingSource = null;
    } else {
      assertObject(rawUnderlyingSource, "First parameter");
    }
    var strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
    var underlyingSource = convertUnderlyingDefaultOrByteSource(rawUnderlyingSource, "First parameter");
    InitializeReadableStream(this);
    if (underlyingSource.type === "bytes") {
      if (strategy.size !== void 0) {
        throw new RangeError("The strategy for a byte stream cannot have a size function");
      }
      var highWaterMark = ExtractHighWaterMark(strategy, 0);
      SetUpReadableByteStreamControllerFromUnderlyingSource(this, underlyingSource, highWaterMark);
    } else {
      var sizeAlgorithm = ExtractSizeAlgorithm(strategy);
      var highWaterMark = ExtractHighWaterMark(strategy, 1);
      SetUpReadableStreamDefaultControllerFromUnderlyingSource(this, underlyingSource, highWaterMark, sizeAlgorithm);
    }
  }
  Object.defineProperty(ReadableStream2.prototype, "locked", {
    get: function() {
      if (!IsReadableStream(this)) {
        throw streamBrandCheckException$1("locked");
      }
      return IsReadableStreamLocked(this);
    },
    enumerable: false,
    configurable: true
  });
  ReadableStream2.prototype.cancel = function(reason) {
    if (reason === void 0) {
      reason = void 0;
    }
    if (!IsReadableStream(this)) {
      return promiseRejectedWith(streamBrandCheckException$1("cancel"));
    }
    if (IsReadableStreamLocked(this)) {
      return promiseRejectedWith(new TypeError("Cannot cancel a stream that already has a reader"));
    }
    return ReadableStreamCancel(this, reason);
  };
  ReadableStream2.prototype.getReader = function(rawOptions) {
    if (rawOptions === void 0) {
      rawOptions = void 0;
    }
    if (!IsReadableStream(this)) {
      throw streamBrandCheckException$1("getReader");
    }
    var options = convertReaderOptions(rawOptions, "First parameter");
    if (options.mode === void 0) {
      return AcquireReadableStreamDefaultReader(this);
    }
    return AcquireReadableStreamBYOBReader(this);
  };
  ReadableStream2.prototype.pipeThrough = function(rawTransform, rawOptions) {
    if (rawOptions === void 0) {
      rawOptions = {};
    }
    if (!IsReadableStream(this)) {
      throw streamBrandCheckException$1("pipeThrough");
    }
    assertRequiredArgument(rawTransform, 1, "pipeThrough");
    var transform = convertReadableWritablePair(rawTransform, "First parameter");
    var options = convertPipeOptions(rawOptions, "Second parameter");
    if (IsReadableStreamLocked(this)) {
      throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
    }
    if (IsWritableStreamLocked(transform.writable)) {
      throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
    }
    var promise = ReadableStreamPipeTo(this, transform.writable, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
    setPromiseIsHandledToTrue(promise);
    return transform.readable;
  };
  ReadableStream2.prototype.pipeTo = function(destination, rawOptions) {
    if (rawOptions === void 0) {
      rawOptions = {};
    }
    if (!IsReadableStream(this)) {
      return promiseRejectedWith(streamBrandCheckException$1("pipeTo"));
    }
    if (destination === void 0) {
      return promiseRejectedWith("Parameter 1 is required in 'pipeTo'.");
    }
    if (!IsWritableStream(destination)) {
      return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo's first argument must be a WritableStream"));
    }
    var options;
    try {
      options = convertPipeOptions(rawOptions, "Second parameter");
    } catch (e) {
      return promiseRejectedWith(e);
    }
    if (IsReadableStreamLocked(this)) {
      return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream"));
    }
    if (IsWritableStreamLocked(destination)) {
      return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream"));
    }
    return ReadableStreamPipeTo(this, destination, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
  };
  ReadableStream2.prototype.tee = function() {
    if (!IsReadableStream(this)) {
      throw streamBrandCheckException$1("tee");
    }
    var branches = ReadableStreamTee(this);
    return CreateArrayFromList(branches);
  };
  ReadableStream2.prototype.values = function(rawOptions) {
    if (rawOptions === void 0) {
      rawOptions = void 0;
    }
    if (!IsReadableStream(this)) {
      throw streamBrandCheckException$1("values");
    }
    var options = convertIteratorOptions(rawOptions, "First parameter");
    return AcquireReadableStreamAsyncIterator(this, options.preventCancel);
  };
  return ReadableStream2;
}();
Object.defineProperties(ReadableStream.prototype, {
  cancel: { enumerable: true },
  getReader: { enumerable: true },
  pipeThrough: { enumerable: true },
  pipeTo: { enumerable: true },
  tee: { enumerable: true },
  values: { enumerable: true },
  locked: { enumerable: true }
});
if (typeof SymbolPolyfill.toStringTag === "symbol") {
  Object.defineProperty(ReadableStream.prototype, SymbolPolyfill.toStringTag, {
    value: "ReadableStream",
    configurable: true
  });
}
if (typeof SymbolPolyfill.asyncIterator === "symbol") {
  Object.defineProperty(ReadableStream.prototype, SymbolPolyfill.asyncIterator, {
    value: ReadableStream.prototype.values,
    writable: true,
    configurable: true
  });
}
function CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm) {
  if (highWaterMark === void 0) {
    highWaterMark = 1;
  }
  if (sizeAlgorithm === void 0) {
    sizeAlgorithm = function() {
      return 1;
    };
  }
  var stream = Object.create(ReadableStream.prototype);
  InitializeReadableStream(stream);
  var controller = Object.create(ReadableStreamDefaultController.prototype);
  SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
  return stream;
}
function CreateReadableByteStream(startAlgorithm, pullAlgorithm, cancelAlgorithm) {
  var stream = Object.create(ReadableStream.prototype);
  InitializeReadableStream(stream);
  var controller = Object.create(ReadableByteStreamController.prototype);
  SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, 0, void 0);
  return stream;
}
function InitializeReadableStream(stream) {
  stream._state = "readable";
  stream._reader = void 0;
  stream._storedError = void 0;
  stream._disturbed = false;
}
function IsReadableStream(x) {
  if (!typeIsObject(x)) {
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(x, "_readableStreamController")) {
    return false;
  }
  return x instanceof ReadableStream;
}
function IsReadableStreamLocked(stream) {
  if (stream._reader === void 0) {
    return false;
  }
  return true;
}
function ReadableStreamCancel(stream, reason) {
  stream._disturbed = true;
  if (stream._state === "closed") {
    return promiseResolvedWith(void 0);
  }
  if (stream._state === "errored") {
    return promiseRejectedWith(stream._storedError);
  }
  ReadableStreamClose(stream);
  var reader = stream._reader;
  if (reader !== void 0 && IsReadableStreamBYOBReader(reader)) {
    reader._readIntoRequests.forEach(function(readIntoRequest) {
      readIntoRequest._closeSteps(void 0);
    });
    reader._readIntoRequests = new SimpleQueue();
  }
  var sourceCancelPromise = stream._readableStreamController[CancelSteps](reason);
  return transformPromiseWith(sourceCancelPromise, noop);
}
function ReadableStreamClose(stream) {
  stream._state = "closed";
  var reader = stream._reader;
  if (reader === void 0) {
    return;
  }
  defaultReaderClosedPromiseResolve(reader);
  if (IsReadableStreamDefaultReader(reader)) {
    reader._readRequests.forEach(function(readRequest) {
      readRequest._closeSteps();
    });
    reader._readRequests = new SimpleQueue();
  }
}
function ReadableStreamError(stream, e) {
  stream._state = "errored";
  stream._storedError = e;
  var reader = stream._reader;
  if (reader === void 0) {
    return;
  }
  defaultReaderClosedPromiseReject(reader, e);
  if (IsReadableStreamDefaultReader(reader)) {
    reader._readRequests.forEach(function(readRequest) {
      readRequest._errorSteps(e);
    });
    reader._readRequests = new SimpleQueue();
  } else {
    reader._readIntoRequests.forEach(function(readIntoRequest) {
      readIntoRequest._errorSteps(e);
    });
    reader._readIntoRequests = new SimpleQueue();
  }
}
function streamBrandCheckException$1(name) {
  return new TypeError("ReadableStream.prototype." + name + " can only be used on a ReadableStream");
}
function convertQueuingStrategyInit(init, context) {
  assertDictionary(init, context);
  var highWaterMark = init === null || init === void 0 ? void 0 : init.highWaterMark;
  assertRequiredField(highWaterMark, "highWaterMark", "QueuingStrategyInit");
  return {
    highWaterMark: convertUnrestrictedDouble(highWaterMark)
  };
}
var byteLengthSizeFunction = function(chunk) {
  return chunk.byteLength;
};
try {
  Object.defineProperty(byteLengthSizeFunction, "name", {
    value: "size",
    configurable: true
  });
} catch (_a2) {
}
var ByteLengthQueuingStrategy = function() {
  function ByteLengthQueuingStrategy2(options) {
    assertRequiredArgument(options, 1, "ByteLengthQueuingStrategy");
    options = convertQueuingStrategyInit(options, "First parameter");
    this._byteLengthQueuingStrategyHighWaterMark = options.highWaterMark;
  }
  Object.defineProperty(ByteLengthQueuingStrategy2.prototype, "highWaterMark", {
    get: function() {
      if (!IsByteLengthQueuingStrategy(this)) {
        throw byteLengthBrandCheckException("highWaterMark");
      }
      return this._byteLengthQueuingStrategyHighWaterMark;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ByteLengthQueuingStrategy2.prototype, "size", {
    get: function() {
      if (!IsByteLengthQueuingStrategy(this)) {
        throw byteLengthBrandCheckException("size");
      }
      return byteLengthSizeFunction;
    },
    enumerable: false,
    configurable: true
  });
  return ByteLengthQueuingStrategy2;
}();
Object.defineProperties(ByteLengthQueuingStrategy.prototype, {
  highWaterMark: { enumerable: true },
  size: { enumerable: true }
});
if (typeof SymbolPolyfill.toStringTag === "symbol") {
  Object.defineProperty(ByteLengthQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
    value: "ByteLengthQueuingStrategy",
    configurable: true
  });
}
function byteLengthBrandCheckException(name) {
  return new TypeError("ByteLengthQueuingStrategy.prototype." + name + " can only be used on a ByteLengthQueuingStrategy");
}
function IsByteLengthQueuingStrategy(x) {
  if (!typeIsObject(x)) {
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(x, "_byteLengthQueuingStrategyHighWaterMark")) {
    return false;
  }
  return x instanceof ByteLengthQueuingStrategy;
}
var countSizeFunction = function() {
  return 1;
};
try {
  Object.defineProperty(countSizeFunction, "name", {
    value: "size",
    configurable: true
  });
} catch (_a2) {
}
var CountQueuingStrategy = function() {
  function CountQueuingStrategy2(options) {
    assertRequiredArgument(options, 1, "CountQueuingStrategy");
    options = convertQueuingStrategyInit(options, "First parameter");
    this._countQueuingStrategyHighWaterMark = options.highWaterMark;
  }
  Object.defineProperty(CountQueuingStrategy2.prototype, "highWaterMark", {
    get: function() {
      if (!IsCountQueuingStrategy(this)) {
        throw countBrandCheckException("highWaterMark");
      }
      return this._countQueuingStrategyHighWaterMark;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(CountQueuingStrategy2.prototype, "size", {
    get: function() {
      if (!IsCountQueuingStrategy(this)) {
        throw countBrandCheckException("size");
      }
      return countSizeFunction;
    },
    enumerable: false,
    configurable: true
  });
  return CountQueuingStrategy2;
}();
Object.defineProperties(CountQueuingStrategy.prototype, {
  highWaterMark: { enumerable: true },
  size: { enumerable: true }
});
if (typeof SymbolPolyfill.toStringTag === "symbol") {
  Object.defineProperty(CountQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
    value: "CountQueuingStrategy",
    configurable: true
  });
}
function countBrandCheckException(name) {
  return new TypeError("CountQueuingStrategy.prototype." + name + " can only be used on a CountQueuingStrategy");
}
function IsCountQueuingStrategy(x) {
  if (!typeIsObject(x)) {
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(x, "_countQueuingStrategyHighWaterMark")) {
    return false;
  }
  return x instanceof CountQueuingStrategy;
}
function convertTransformer(original, context) {
  assertDictionary(original, context);
  var flush = original === null || original === void 0 ? void 0 : original.flush;
  var readableType = original === null || original === void 0 ? void 0 : original.readableType;
  var start = original === null || original === void 0 ? void 0 : original.start;
  var transform = original === null || original === void 0 ? void 0 : original.transform;
  var writableType = original === null || original === void 0 ? void 0 : original.writableType;
  return {
    flush: flush === void 0 ? void 0 : convertTransformerFlushCallback(flush, original, context + " has member 'flush' that"),
    readableType,
    start: start === void 0 ? void 0 : convertTransformerStartCallback(start, original, context + " has member 'start' that"),
    transform: transform === void 0 ? void 0 : convertTransformerTransformCallback(transform, original, context + " has member 'transform' that"),
    writableType
  };
}
function convertTransformerFlushCallback(fn, original, context) {
  assertFunction(fn, context);
  return function(controller) {
    return promiseCall(fn, original, [controller]);
  };
}
function convertTransformerStartCallback(fn, original, context) {
  assertFunction(fn, context);
  return function(controller) {
    return reflectCall(fn, original, [controller]);
  };
}
function convertTransformerTransformCallback(fn, original, context) {
  assertFunction(fn, context);
  return function(chunk, controller) {
    return promiseCall(fn, original, [chunk, controller]);
  };
}
var TransformStream = function() {
  function TransformStream2(rawTransformer, rawWritableStrategy, rawReadableStrategy) {
    if (rawTransformer === void 0) {
      rawTransformer = {};
    }
    if (rawWritableStrategy === void 0) {
      rawWritableStrategy = {};
    }
    if (rawReadableStrategy === void 0) {
      rawReadableStrategy = {};
    }
    if (rawTransformer === void 0) {
      rawTransformer = null;
    }
    var writableStrategy = convertQueuingStrategy(rawWritableStrategy, "Second parameter");
    var readableStrategy = convertQueuingStrategy(rawReadableStrategy, "Third parameter");
    var transformer = convertTransformer(rawTransformer, "First parameter");
    if (transformer.readableType !== void 0) {
      throw new RangeError("Invalid readableType specified");
    }
    if (transformer.writableType !== void 0) {
      throw new RangeError("Invalid writableType specified");
    }
    var readableHighWaterMark = ExtractHighWaterMark(readableStrategy, 0);
    var readableSizeAlgorithm = ExtractSizeAlgorithm(readableStrategy);
    var writableHighWaterMark = ExtractHighWaterMark(writableStrategy, 1);
    var writableSizeAlgorithm = ExtractSizeAlgorithm(writableStrategy);
    var startPromise_resolve;
    var startPromise = newPromise(function(resolve) {
      startPromise_resolve = resolve;
    });
    InitializeTransformStream(this, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
    SetUpTransformStreamDefaultControllerFromTransformer(this, transformer);
    if (transformer.start !== void 0) {
      startPromise_resolve(transformer.start(this._transformStreamController));
    } else {
      startPromise_resolve(void 0);
    }
  }
  Object.defineProperty(TransformStream2.prototype, "readable", {
    get: function() {
      if (!IsTransformStream(this)) {
        throw streamBrandCheckException("readable");
      }
      return this._readable;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(TransformStream2.prototype, "writable", {
    get: function() {
      if (!IsTransformStream(this)) {
        throw streamBrandCheckException("writable");
      }
      return this._writable;
    },
    enumerable: false,
    configurable: true
  });
  return TransformStream2;
}();
Object.defineProperties(TransformStream.prototype, {
  readable: { enumerable: true },
  writable: { enumerable: true }
});
if (typeof SymbolPolyfill.toStringTag === "symbol") {
  Object.defineProperty(TransformStream.prototype, SymbolPolyfill.toStringTag, {
    value: "TransformStream",
    configurable: true
  });
}
function InitializeTransformStream(stream, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm) {
  function startAlgorithm() {
    return startPromise;
  }
  function writeAlgorithm(chunk) {
    return TransformStreamDefaultSinkWriteAlgorithm(stream, chunk);
  }
  function abortAlgorithm(reason) {
    return TransformStreamDefaultSinkAbortAlgorithm(stream, reason);
  }
  function closeAlgorithm() {
    return TransformStreamDefaultSinkCloseAlgorithm(stream);
  }
  stream._writable = CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, writableHighWaterMark, writableSizeAlgorithm);
  function pullAlgorithm() {
    return TransformStreamDefaultSourcePullAlgorithm(stream);
  }
  function cancelAlgorithm(reason) {
    TransformStreamErrorWritableAndUnblockWrite(stream, reason);
    return promiseResolvedWith(void 0);
  }
  stream._readable = CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
  stream._backpressure = void 0;
  stream._backpressureChangePromise = void 0;
  stream._backpressureChangePromise_resolve = void 0;
  TransformStreamSetBackpressure(stream, true);
  stream._transformStreamController = void 0;
}
function IsTransformStream(x) {
  if (!typeIsObject(x)) {
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(x, "_transformStreamController")) {
    return false;
  }
  return x instanceof TransformStream;
}
function TransformStreamError(stream, e) {
  ReadableStreamDefaultControllerError(stream._readable._readableStreamController, e);
  TransformStreamErrorWritableAndUnblockWrite(stream, e);
}
function TransformStreamErrorWritableAndUnblockWrite(stream, e) {
  TransformStreamDefaultControllerClearAlgorithms(stream._transformStreamController);
  WritableStreamDefaultControllerErrorIfNeeded(stream._writable._writableStreamController, e);
  if (stream._backpressure) {
    TransformStreamSetBackpressure(stream, false);
  }
}
function TransformStreamSetBackpressure(stream, backpressure) {
  if (stream._backpressureChangePromise !== void 0) {
    stream._backpressureChangePromise_resolve();
  }
  stream._backpressureChangePromise = newPromise(function(resolve) {
    stream._backpressureChangePromise_resolve = resolve;
  });
  stream._backpressure = backpressure;
}
var TransformStreamDefaultController = function() {
  function TransformStreamDefaultController2() {
    throw new TypeError("Illegal constructor");
  }
  Object.defineProperty(TransformStreamDefaultController2.prototype, "desiredSize", {
    get: function() {
      if (!IsTransformStreamDefaultController(this)) {
        throw defaultControllerBrandCheckException("desiredSize");
      }
      var readableController = this._controlledTransformStream._readable._readableStreamController;
      return ReadableStreamDefaultControllerGetDesiredSize(readableController);
    },
    enumerable: false,
    configurable: true
  });
  TransformStreamDefaultController2.prototype.enqueue = function(chunk) {
    if (chunk === void 0) {
      chunk = void 0;
    }
    if (!IsTransformStreamDefaultController(this)) {
      throw defaultControllerBrandCheckException("enqueue");
    }
    TransformStreamDefaultControllerEnqueue(this, chunk);
  };
  TransformStreamDefaultController2.prototype.error = function(reason) {
    if (reason === void 0) {
      reason = void 0;
    }
    if (!IsTransformStreamDefaultController(this)) {
      throw defaultControllerBrandCheckException("error");
    }
    TransformStreamDefaultControllerError(this, reason);
  };
  TransformStreamDefaultController2.prototype.terminate = function() {
    if (!IsTransformStreamDefaultController(this)) {
      throw defaultControllerBrandCheckException("terminate");
    }
    TransformStreamDefaultControllerTerminate(this);
  };
  return TransformStreamDefaultController2;
}();
Object.defineProperties(TransformStreamDefaultController.prototype, {
  enqueue: { enumerable: true },
  error: { enumerable: true },
  terminate: { enumerable: true },
  desiredSize: { enumerable: true }
});
if (typeof SymbolPolyfill.toStringTag === "symbol") {
  Object.defineProperty(TransformStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
    value: "TransformStreamDefaultController",
    configurable: true
  });
}
function IsTransformStreamDefaultController(x) {
  if (!typeIsObject(x)) {
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(x, "_controlledTransformStream")) {
    return false;
  }
  return x instanceof TransformStreamDefaultController;
}
function SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm) {
  controller._controlledTransformStream = stream;
  stream._transformStreamController = controller;
  controller._transformAlgorithm = transformAlgorithm;
  controller._flushAlgorithm = flushAlgorithm;
}
function SetUpTransformStreamDefaultControllerFromTransformer(stream, transformer) {
  var controller = Object.create(TransformStreamDefaultController.prototype);
  var transformAlgorithm = function(chunk) {
    try {
      TransformStreamDefaultControllerEnqueue(controller, chunk);
      return promiseResolvedWith(void 0);
    } catch (transformResultE) {
      return promiseRejectedWith(transformResultE);
    }
  };
  var flushAlgorithm = function() {
    return promiseResolvedWith(void 0);
  };
  if (transformer.transform !== void 0) {
    transformAlgorithm = function(chunk) {
      return transformer.transform(chunk, controller);
    };
  }
  if (transformer.flush !== void 0) {
    flushAlgorithm = function() {
      return transformer.flush(controller);
    };
  }
  SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm);
}
function TransformStreamDefaultControllerClearAlgorithms(controller) {
  controller._transformAlgorithm = void 0;
  controller._flushAlgorithm = void 0;
}
function TransformStreamDefaultControllerEnqueue(controller, chunk) {
  var stream = controller._controlledTransformStream;
  var readableController = stream._readable._readableStreamController;
  if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(readableController)) {
    throw new TypeError("Readable side is not in a state that permits enqueue");
  }
  try {
    ReadableStreamDefaultControllerEnqueue(readableController, chunk);
  } catch (e) {
    TransformStreamErrorWritableAndUnblockWrite(stream, e);
    throw stream._readable._storedError;
  }
  var backpressure = ReadableStreamDefaultControllerHasBackpressure(readableController);
  if (backpressure !== stream._backpressure) {
    TransformStreamSetBackpressure(stream, true);
  }
}
function TransformStreamDefaultControllerError(controller, e) {
  TransformStreamError(controller._controlledTransformStream, e);
}
function TransformStreamDefaultControllerPerformTransform(controller, chunk) {
  var transformPromise = controller._transformAlgorithm(chunk);
  return transformPromiseWith(transformPromise, void 0, function(r) {
    TransformStreamError(controller._controlledTransformStream, r);
    throw r;
  });
}
function TransformStreamDefaultControllerTerminate(controller) {
  var stream = controller._controlledTransformStream;
  var readableController = stream._readable._readableStreamController;
  ReadableStreamDefaultControllerClose(readableController);
  var error = new TypeError("TransformStream terminated");
  TransformStreamErrorWritableAndUnblockWrite(stream, error);
}
function TransformStreamDefaultSinkWriteAlgorithm(stream, chunk) {
  var controller = stream._transformStreamController;
  if (stream._backpressure) {
    var backpressureChangePromise = stream._backpressureChangePromise;
    return transformPromiseWith(backpressureChangePromise, function() {
      var writable = stream._writable;
      var state = writable._state;
      if (state === "erroring") {
        throw writable._storedError;
      }
      return TransformStreamDefaultControllerPerformTransform(controller, chunk);
    });
  }
  return TransformStreamDefaultControllerPerformTransform(controller, chunk);
}
function TransformStreamDefaultSinkAbortAlgorithm(stream, reason) {
  TransformStreamError(stream, reason);
  return promiseResolvedWith(void 0);
}
function TransformStreamDefaultSinkCloseAlgorithm(stream) {
  var readable = stream._readable;
  var controller = stream._transformStreamController;
  var flushPromise = controller._flushAlgorithm();
  TransformStreamDefaultControllerClearAlgorithms(controller);
  return transformPromiseWith(flushPromise, function() {
    if (readable._state === "errored") {
      throw readable._storedError;
    }
    ReadableStreamDefaultControllerClose(readable._readableStreamController);
  }, function(r) {
    TransformStreamError(stream, r);
    throw readable._storedError;
  });
}
function TransformStreamDefaultSourcePullAlgorithm(stream) {
  TransformStreamSetBackpressure(stream, false);
  return stream._backpressureChangePromise;
}
function defaultControllerBrandCheckException(name) {
  return new TypeError("TransformStreamDefaultController.prototype." + name + " can only be used on a TransformStreamDefaultController");
}
function streamBrandCheckException(name) {
  return new TypeError("TransformStream.prototype." + name + " can only be used on a TransformStream");
}

// src/md5.js
var import_spark_md5 = __toESM(require_spark_md5(), 1);
var md5FromString = (string2, raw) => import_spark_md5.default.hash(string2, raw);

// src/Database.js
var generateReplicationLogId = async (targetId, sourceId) => {
  return md5FromString(`${targetId}${sourceId}`);
};
var findCommonAncestor = (targetLog, sourceLog) => {
  return targetLog.sessionId && targetLog.sessionId === sourceLog.sessionId && targetLog.sourceLastSeq && targetLog.sourceLastSeq === sourceLog.sourceLastSeq ? targetLog.sourceLastSeq : null;
};
var compareSeqs = (a, b) => {
  if (!a)
    return -1;
  if (!b)
    return 1;
  if (a === b)
    return 0;
  const aInt = parseInt(a, 10);
  const bInt = parseInt(b, 10);
  return aInt - bInt;
};
var BatchingTransformStream = class extends TransformStream {
  constructor({ batchSize }) {
    super({
      transform(entry, controller) {
        this.entries.push(entry);
        if (this.entries.length >= batchSize) {
          const batch = this.entries.splice(0, batchSize);
          controller.enqueue(batch);
        }
      },
      flush(controller) {
        if (this.entries.length > 0)
          controller.enqueue(this.entries);
      },
      entries: []
    }, { highWaterMark: 1024 * 4 }, { highWaterMark: 1024 * 4 });
  }
};
var replicate = async (source, target, {
  batchSize = {
    source: 1024,
    target: 256
  }
} = {}) => {
  const sessionId = crypto.randomUUID();
  const stats = {
    docsRead: 0,
    docsWritten: 0
  };
  const [
    { uuid: targetUuid },
    { uuid: sourceUuid, updateSeq: sourceSeq }
  ] = await Promise.all([
    target.replicator.getInfo(),
    source.replicator.getInfo()
  ]);
  const replicationLogId = await generateReplicationLogId(targetUuid, sourceUuid);
  const [
    targetLog,
    sourceLog
  ] = await Promise.all([
    target.replicator.getLog(replicationLogId),
    source.replicator.getLog(replicationLogId)
  ]);
  let startSeq = findCommonAncestor(targetLog, sourceLog);
  if (compareSeqs(startSeq, sourceSeq) === 0) {
    return stats;
  }
  let changesComplete = false;
  while (!changesComplete) {
    const batchStats = {};
    await source.replicator.getChanges(startSeq, { limit: batchSize.source }, batchStats).pipeThrough(new BatchingTransformStream({ batchSize: batchSize.target })).pipeThrough(target.replicator.getDiff()).pipeThrough(new BatchingTransformStream({ batchSize: batchSize.source })).pipeThrough(source.replicator.getRevs(batchStats)).pipeThrough(new BatchingTransformStream({ batchSize: batchSize.target })).pipeTo(target.replicator.saveRevs(batchStats));
    stats.lastSeq = batchStats.lastSeq;
    stats.docsRead += batchStats.docsRead;
    stats.docsWritten += batchStats.docsWritten;
    if (batchStats.lastSeq !== startSeq) {
      sourceLog.sessionId = sessionId;
      sourceLog.sourceLastSeq = batchStats.lastSeq;
      targetLog.sessionId = sessionId;
      targetLog.sourceLastSeq = batchStats.lastSeq;
      const [
        { rev: targetLogRev },
        { rev: sourceLogRev }
      ] = await Promise.all([
        target.replicator.saveLog(targetLog),
        source.replicator.saveLog(sourceLog)
      ]);
      targetLog._rev = targetLogRev;
      sourceLog._rev = sourceLogRev;
    }
    startSeq = batchStats.lastSeq;
    changesComplete = batchStats.numberOfChanges < batchSize.source || compareSeqs(batchStats.lastSeq, sourceSeq) >= 0;
  }
  return stats;
};
var Database = class extends EventTarget {
  constructor() {
    super();
    this.replicator = null;
  }
  async init() {
    throw new Error(`init is not implemented for ${this.constructor.name}`);
  }
  async destroy() {
    throw new Error(`destroy is not implemented for ${this.constructor.name}`);
  }
  async getChanges() {
    throw new Error(`getChanges is not implemented for ${this.constructor.name}`);
  }
  async getDoc(id) {
    throw new Error(`getDoc is not implemented for ${this.constructor.name}`);
  }
  async saveDoc(doc) {
    throw new Error(`saveDoc is not implemented for ${this.constructor.name}`);
  }
  async deleteDoc(doc) {
    throw new Error(`deleteDoc is not implemented for ${this.constructor.name}`);
  }
  async getDocs(range) {
    throw new Error(`getDocs is not implemented for ${this.constructor.name}`);
  }
  async pull(other, options) {
    const result = await replicate(other, this, options);
    if (result.docsWritten > 0) {
      this.dispatchEvent(new Event("change"));
    }
    return result;
  }
  push(other, options) {
    return replicate(this, other, options);
  }
  sync(other) {
    return Promise.all([
      this.pull(other),
      this.push(other)
    ]);
  }
};

// src/http/Adapter.js
var HttpAdapter = class {
  constructor({ url, headers }) {
    this.url = url;
    this.root = url.pathname;
    this.headers = headers;
  }
  async getServerInfo() {
    const url = new URL(this.url);
    url.pathname = "/";
    const response = await fetch(url, {
      headers: this.headers
    });
    if (response.status !== 200) {
      throw new Error("Remote server not reachable");
    }
    return response.json();
  }
  async getInfo() {
    const url = new URL(this.url);
    const response = await fetch(url, {
      headers: this.headers
    });
    if (response.status !== 200) {
      throw new Error("Remote database not reachable");
    }
    return response.json();
  }
  async getDoc(id) {
    const url = new URL(`${this.root}/${id}`, this.url);
    const response = await fetch(url, {
      headers: this.headers
    });
    if (response.status !== 200) {
      throw new Error("Could not get doc");
    }
    return response;
  }
  async saveDoc(doc) {
    const url = new URL(`${this.root}/${doc._id}`, this.url);
    const body = JSON.stringify(doc);
    const response = await fetch(url, {
      headers: {
        ...this.headers,
        "Content-Type": "application/json"
      },
      method: "put",
      body
    });
    if (response.status !== 201) {
      throw new Error("Could not save doc");
    }
    return response;
  }
  async deleteDoc(doc) {
    const url = new URL(`${this.root}/${doc._id}`, this.url);
    url.searchParams.set("rev", doc._rev);
    const response = await fetch(url, {
      headers: {
        ...this.headers
      },
      method: "delete"
    });
    if (response.status !== 200) {
      throw new Error("Could not delete doc");
    }
    return response;
  }
  async getChanges(since, { limit } = {}) {
    const url = new URL(`${this.root}/_changes`, this.url);
    url.searchParams.set("feed", "continuous");
    url.searchParams.set("timeout", "0");
    url.searchParams.set("style", "all_docs");
    if (since) {
      url.searchParams.set("since", since);
    }
    if (limit) {
      url.searchParams.set("limit", limit);
      url.searchParams.set("seq_interval", limit);
    }
    const response = await fetch(url, {
      headers: this.headers
    });
    if (response.status !== 200) {
      throw new Error("Could not get changes");
    }
    return response;
  }
  async revsDiff(payload) {
    const url = new URL(`${this.root}/_revs_diff`, this.url);
    const body = JSON.stringify(payload);
    const response = await fetch(url, {
      headers: {
        ...this.headers,
        "Content-Type": "application/json"
      },
      method: "post",
      body
    });
    if (response.status !== 200) {
      throw new Error("Could not get revs diff");
    }
    return response;
  }
  async bulkGet(docs) {
    const url = new URL(`${this.root}/_bulk_get`, this.url);
    url.searchParams.set("revs", "true");
    url.searchParams.set("attachments", "true");
    const body = JSON.stringify({ docs });
    const response = await fetch(url, {
      headers: {
        ...this.headers,
        "Content-Type": "application/json"
      },
      method: "post",
      body
    });
    if (response.status !== 200) {
      throw new Error("Could not get docs multipart");
    }
    return response;
  }
  async bulkDocs(docs) {
    const url = new URL(`${this.root}/_bulk_docs`, this.url);
    const body = JSON.stringify({ docs, new_edits: false });
    const response = await fetch(url, {
      headers: {
        ...this.headers,
        "Content-Type": "application/json"
      },
      method: "post",
      body
    });
    if (response.status !== 201) {
      throw new Error("Could not save bulk docs");
    }
    return response;
  }
};

// src/Replicator.js
var Replicator = class {
  async getInfo() {
    throw new Error(`getInfo is not implemented for ${this.constructor.name}`);
  }
  async getLog(id) {
    throw new Error(`getLog is not implemented for ${this.constructor.name}`);
  }
  async saveLog(doc) {
    throw new Error(`saveLog is not implemented for ${this.constructor.name}`);
  }
  getChanges(since, { limit } = {}, stats = {}) {
    throw new Error(`getChanges is not implemented for ${this.constructor.name}`);
  }
  getDiff() {
    throw new Error(`getDiff is not implemented for ${this.constructor.name}`);
  }
  getRevs(stats = {}) {
    throw new Error(`getRevs is not implemented for ${this.constructor.name}`);
  }
  saveRevs(stats = {}) {
    throw new Error(`saveRevs is not implemented for ${this.constructor.name}`);
  }
};

// src/http/BulkGetParser.js
var objectOpen = 123;
var objectClose = 125;
var string = 34;
var backslash = 92;
var BulkGetParser = class {
  constructor() {
    this.decoder = new TextDecoder();
    this.data = new Uint8Array(0);
    this.objectLevel = 0;
    this.onDoc = void 0;
  }
  async write(chunk) {
    if (chunk) {
      const newData = new Uint8Array(this.data.length + chunk.length);
      newData.set(this.data, 0);
      newData.set(chunk, this.data.length);
      this.data = newData;
    }
    let objectLevel = 0 + this.objectLevel;
    let objectStart = -1;
    let objectEnd = -1;
    let innerString = false;
    let escaping = false;
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i] === string && !escaping) {
        innerString = !innerString;
      }
      escaping = innerString && this.data[i] === backslash;
      if (innerString)
        continue;
      if (this.data[i] === objectOpen) {
        objectLevel++;
        if (objectLevel === 2) {
          objectStart = i;
        }
      }
      if (this.data[i] === objectClose) {
        if (objectLevel === 2) {
          const json = this.decoder.decode(this.data.slice(objectStart, i + 1));
          const doc = JSON.parse(json);
          await this.onDoc(doc);
          objectStart = -1;
          objectEnd = i + 1;
        }
        objectLevel--;
      }
    }
    if (objectEnd > -1) {
      this.data = this.data.slice(objectEnd);
      this.objectLevel = 1;
    } else if (objectStart > -1) {
      this.data = this.data.slice(objectStart);
      this.objectLevel = 1;
    }
  }
};

// src/http/Replicator.js
var base64ToBlob = (data, type) => {
  const raw = atob(data);
  const length = raw.length;
  const uInt8Array = new Uint8Array(length);
  for (let i = 0; i < length; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type });
};
var blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dec = `data:${blob.type};base64,`;
      const data = reader.result.slice(dec.length);
      resolve(data);
    };
    reader.readAsDataURL(blob);
  });
};
var GetChangesReadableStream = class extends ReadableStream {
  constructor(adapter, { since, limit }) {
    let reader;
    super({
      async start(controller) {
        const response = await adapter.getChanges(since, { limit });
        reader = response.body.getReader();
      },
      async pull(controller) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          reader.releaseLock();
        } else {
          controller.enqueue(value);
        }
      }
    }, { highWaterMark: 1024 * 1024 });
  }
};
var nextSplitPosition = (data) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i] === 10)
      return i;
  }
  return -1;
};
var ChangesParserTransformStream = class extends TransformStream {
  constructor(stats = {}) {
    stats.numberOfChanges = 0;
    stats.lastSeq = null;
    const decoder = new TextDecoder();
    super({
      transform(chunk, controller) {
        const newData = new Uint8Array(this.data.length + chunk.length);
        newData.set(this.data, 0);
        newData.set(chunk, this.data.length);
        this.data = newData;
        while (true) {
          const endPosition = nextSplitPosition(this.data);
          if (endPosition === -1)
            return;
          if (endPosition > 0) {
            const line = decoder.decode(this.data.slice(0, endPosition));
            let change;
            try {
              change = JSON.parse(line);
            } catch (e) {
              throw new Error("could not parse change JSON");
            }
            const { last_seq, id, changes: revs } = change;
            if (last_seq) {
              stats.lastSeq = last_seq;
            } else {
              stats.numberOfChanges++;
              controller.enqueue({ id, revs });
            }
          }
          this.data = this.data.slice(endPosition + 1);
        }
      },
      data: new Uint8Array(0),
      startParsed: false
    }, { highWaterMark: 1024 * 1024 * 8 }, { highWaterMark: 1024 });
  }
};
var FilterMissingRevsTransformStream = class extends TransformStream {
  constructor(adapter) {
    super({
      async transform(batch, controller) {
        const payload = {};
        for (const { id, revs } of batch) {
          payload[id] = revs.map(({ rev }) => rev);
        }
        const response = await adapter.revsDiff(payload);
        const diff = await response.json();
        for (const id in diff) {
          if (!("missing" in diff[id])) {
            throw new Error("missing `missing` property in revsDiff response");
          }
          const { missing } = diff[id];
          const revs = missing.map((rev) => ({ rev }));
          if (revs.length > 0) {
            controller.enqueue({ id, revs });
          }
        }
      }
    });
  }
};
var GetRevsTransformStream = class extends TransformStream {
  constructor(adapter, stats) {
    stats.docsRead = 0;
    super({
      async transform(batch, controller) {
        if (batch.length === 0)
          return;
        const docs = [];
        const batchById = {};
        for (const row of batch) {
          const { id, revs } = row;
          batchById[id] = row;
          for (const { rev } of revs) {
            docs.push({ id, rev });
          }
        }
        if (docs.length === 0) {
          throw new Error("received messages with empty revs");
        }
        const response = await adapter.bulkGet(docs);
        const reader = response.body.getReader();
        const bulkDocsParser = new BulkGetParser();
        bulkDocsParser.onDoc = async (r) => {
          const { id, docs: docs2 } = r;
          if (!(id in batchById)) {
            console.log(r);
            throw new Error("recived doc which we did not ask for");
          }
          const byRev = {};
          for (const { ok: doc } of docs2) {
            byRev[doc._rev] = doc;
            if (doc._attachments) {
              for (const name in doc._attachments) {
                const attachment = doc._attachments[name];
                const { data, content_type } = attachment;
                attachment.data = await base64ToBlob(data, content_type);
              }
            }
          }
          const row = batchById[id];
          for (const rev of row.revs) {
            if (rev.rev in byRev) {
              rev.doc = byRev[rev.rev];
            }
          }
          controller.enqueue(row);
          stats.docsRead++;
        };
        while (true) {
          const { done, value } = await reader.read();
          if (done)
            break;
          await bulkDocsParser.write(value);
        }
      }
    }, { highWaterMark: 8 }, { highWaterMark: 1024 * 4 });
  }
};
var SaveDocsWritableStream = class extends WritableStream {
  constructor(adapter, stats = {}) {
    stats.docsWritten = 0;
    super({
      async write(batch) {
        const revs = batch.reduce((memo, { revs: revs2 }) => memo.concat(revs2.map(({ doc }) => doc)), []);
        if (revs.length > 0) {
          for (const doc of revs) {
            if (doc._attachments) {
              for (const name in doc._attachments) {
                const attachment = doc._attachments[name];
                const { data } = attachment;
                attachment.data = await blobToBase64(data);
              }
            }
          }
          const response = await adapter.bulkDocs(revs);
        }
        stats.docsWritten += batch.length;
      }
    });
  }
};
var HttpReplicator = class extends Replicator {
  constructor(adapter) {
    super();
    this.adapter = adapter;
  }
  async getInfo() {
    const [
      { uuid },
      { update_seq: updateSeq }
    ] = await Promise.all([
      this.adapter.getServerInfo(),
      this.adapter.getInfo()
    ]);
    return { uuid, updateSeq };
  }
  async getLog(id) {
    const _id = `_local/${id}`;
    let doc;
    try {
      const response = await this.adapter.getDoc(_id);
      doc = await response.json();
    } catch (e) {
      doc = { _id };
    }
    return doc;
  }
  async saveLog(doc) {
    const response = await this.adapter.saveDoc(doc);
    return response.json();
  }
  getChanges(since, { limit } = {}, stats = {}) {
    const getChangesReadableStream = new GetChangesReadableStream(this.adapter, { since, limit });
    const changesParserTransformStream = new ChangesParserTransformStream(stats);
    return getChangesReadableStream.pipeThrough(changesParserTransformStream);
  }
  getDiff() {
    return new FilterMissingRevsTransformStream(this.adapter);
  }
  getRevs(stats = {}) {
    return new GetRevsTransformStream(this.adapter, stats);
  }
  saveRevs(stats = {}) {
    return new SaveDocsWritableStream(this.adapter, stats);
  }
};

// src/http/Database.js
var HttpDatabase = class extends Database {
  constructor({ url, headers }) {
    super();
    this.adapter = new HttpAdapter({ url, headers });
    this.replicator = new HttpReplicator(this.adapter);
  }
  async getDoc(id) {
    const response = await this.adapter.getDoc(id);
    return response.json();
  }
  async saveDoc(doc) {
    const response = await this.adapter.saveDoc(doc);
    this.dispatchEvent(new Event("change"));
    return response.json();
  }
  async deleteDoc(doc) {
    const response = await this.adapter.deleteDoc(doc);
    this.dispatchEvent(new Event("change"));
    return response.json();
  }
};
export {
  HttpDatabase as default
};
