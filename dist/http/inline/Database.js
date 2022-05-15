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

// src/utils.js
var import_spark_md5 = __toESM(require_spark_md5(), 1);
var md5FromString = (string2, raw) => import_spark_md5.default.hash(string2, raw);
var makeUuid = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
};

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
var Logger = class extends TransformStream {
  constructor(scope) {
    super({
      transform(data, controller) {
        console.debug(scope, data.length, data);
        controller.enqueue(data);
      }
    }, { highWaterMark: 1024 * 4 }, { highWaterMark: 1024 * 4 });
  }
};
var replicate = async (source, target, {
  batchSize = {
    source: 1024,
    target: 256
  }
} = {}) => {
  const sessionId = makeUuid();
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
    await source.replicator.getChanges(startSeq, { limit: batchSize.source }, batchStats).pipeThrough(new BatchingTransformStream({ batchSize: batchSize.target })).pipeThrough(target.replicator.getDiff()).pipeThrough(new BatchingTransformStream({ batchSize: batchSize.source })).pipeThrough(new Logger("got diffs now getRevs")).pipeThrough(source.replicator.getRevs(batchStats)).pipeThrough(new BatchingTransformStream({ batchSize: batchSize.target })).pipeTo(target.replicator.saveRevs(batchStats));
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
  async getChanges(id) {
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

// src/http/Database.js
var HttpDatabase = class extends Database {
  constructor() {
    super();
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

// src/http/inline/Adapter.js
var HttpInlineAdapter = class extends HttpAdapter {
  constructor({ url, headers }) {
    super({ url, headers });
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

// src/http/Replicator.js
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
};

// src/http/inline/BulkGetParser.js
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

// src/http/inline/Replicator.js
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
var HttpInlineReplicator = class extends HttpReplicator {
  constructor(adapter) {
    super();
    this.adapter = adapter;
  }
  getRevs(stats = {}) {
    return new GetRevsTransformStream(this.adapter, stats);
  }
  saveRevs(stats = {}) {
    return new SaveDocsWritableStream(this.adapter, stats);
  }
};

// src/http/inline/Database.js
var HttpInlineDatabase = class extends HttpDatabase {
  constructor({ url, headers }) {
    super();
    this.adapter = new HttpInlineAdapter({ url, headers });
    this.replicator = new HttpInlineReplicator(this.adapter);
  }
};
export {
  HttpInlineDatabase as default
};
