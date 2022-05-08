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
    })(function(undefined) {
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
            if (to !== undefined) {
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
      function SparkMD54() {
        this.reset();
      }
      SparkMD54.prototype.append = function(str) {
        this.appendBinary(toUtf8(str));
        return this;
      };
      SparkMD54.prototype.appendBinary = function(contents) {
        this._buff += contents;
        this._length += contents.length;
        var length = this._buff.length, i;
        for (i = 64; i <= length; i += 64) {
          md5cycle(this._hash, md5blk(this._buff.substring(i - 64, i)));
        }
        this._buff = this._buff.substring(i - 64);
        return this;
      };
      SparkMD54.prototype.end = function(raw) {
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
      SparkMD54.prototype.reset = function() {
        this._buff = "";
        this._length = 0;
        this._hash = [1732584193, -271733879, -1732584194, 271733878];
        return this;
      };
      SparkMD54.prototype.getState = function() {
        return {
          buff: this._buff,
          length: this._length,
          hash: this._hash.slice()
        };
      };
      SparkMD54.prototype.setState = function(state) {
        this._buff = state.buff;
        this._length = state.length;
        this._hash = state.hash;
        return this;
      };
      SparkMD54.prototype.destroy = function() {
        delete this._hash;
        delete this._buff;
        delete this._length;
      };
      SparkMD54.prototype._finish = function(tail, length) {
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
      SparkMD54.hash = function(str, raw) {
        return SparkMD54.hashBinary(toUtf8(str), raw);
      };
      SparkMD54.hashBinary = function(content, raw) {
        var hash = md51(content), ret = hex(hash);
        return raw ? hexToBinaryString(ret) : ret;
      };
      SparkMD54.ArrayBuffer = function() {
        this.reset();
      };
      SparkMD54.ArrayBuffer.prototype.append = function(arr) {
        var buff = concatenateArrayBuffers(this._buff.buffer, arr, true), length = buff.length, i;
        this._length += arr.byteLength;
        for (i = 64; i <= length; i += 64) {
          md5cycle(this._hash, md5blk_array(buff.subarray(i - 64, i)));
        }
        this._buff = i - 64 < length ? new Uint8Array(buff.buffer.slice(i - 64)) : new Uint8Array(0);
        return this;
      };
      SparkMD54.ArrayBuffer.prototype.end = function(raw) {
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
      SparkMD54.ArrayBuffer.prototype.reset = function() {
        this._buff = new Uint8Array(0);
        this._length = 0;
        this._hash = [1732584193, -271733879, -1732584194, 271733878];
        return this;
      };
      SparkMD54.ArrayBuffer.prototype.getState = function() {
        var state = SparkMD54.prototype.getState.call(this);
        state.buff = arrayBuffer2Utf8Str(state.buff);
        return state;
      };
      SparkMD54.ArrayBuffer.prototype.setState = function(state) {
        state.buff = utf8Str2ArrayBuffer(state.buff, true);
        return SparkMD54.prototype.setState.call(this, state);
      };
      SparkMD54.ArrayBuffer.prototype.destroy = SparkMD54.prototype.destroy;
      SparkMD54.ArrayBuffer.prototype._finish = SparkMD54.prototype._finish;
      SparkMD54.ArrayBuffer.hash = function(arr, raw) {
        var hash = md51_array(new Uint8Array(arr)), ret = hex(hash);
        return raw ? hexToBinaryString(ret) : ret;
      };
      return SparkMD54;
    });
  }
});

// src/base/replicate.js
var import_spark_md52 = __toESM(require_spark_md5(), 1);

// src/utils.js
var import_spark_md5 = __toESM(require_spark_md5(), 1);
var MD5_CHUNK_SIZE = 32768;
var calculateMd5 = async (blob) => {
  const chunkSize = Math.min(MD5_CHUNK_SIZE, blob.size);
  const chunks = Math.ceil(blob.size / chunkSize);
  const md5 = new import_spark_md5.default.ArrayBuffer();
  for (let i = 0; i < chunks; i++) {
    const part = blob.slice(i * chunkSize, (i + 1) * chunkSize);
    const arrayBuffer = await part.arrayBuffer();
    md5.append(arrayBuffer);
  }
  return md5.end(true);
};
var makeUuid = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
};

// src/base/replicate.js
var generateReplicationLogId = async (localId, remoteId) => {
  return import_spark_md52.default.hash(`${localId}${remoteId}`);
};
var findCommonAncestor = (localLog, remoteLog) => {
  return localLog.sessionId && localLog.sessionId === remoteLog.sessionId && localLog.sourceLastSeq && localLog.sourceLastSeq === remoteLog.sourceLastSeq ? localLog.sourceLastSeq : null;
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
        console.debug(scope, data);
        controller.enqueue(data);
      }
    }, { highWaterMark: 1024 * 4 }, { highWaterMark: 1024 * 4 });
  }
};
async function replicate(source, target, {
  batchSize = {
    getChanges: 1024,
    getDiff: 512,
    getRevs: 1024,
    saveRevs: 128
  }
} = {}) {
  const sessionId = makeUuid();
  const stats = {
    docsRead: 0,
    docsWritten: 0
  };
  const [
    { uuid: localUuid },
    { uuid: remoteUuid, updateSeq: remoteSeq }
  ] = await Promise.all([
    target.replicator.getInfo(),
    source.replicator.getInfo()
  ]);
  const replicationLogId = await generateReplicationLogId(localUuid, remoteUuid);
  const [
    targetLog,
    sourceLog
  ] = await Promise.all([
    target.replicator.getLog(replicationLogId),
    source.replicator.getLog(replicationLogId)
  ]);
  let startSeq = findCommonAncestor(targetLog, sourceLog);
  if (compareSeqs(startSeq, remoteSeq) === 0) {
    return stats;
  }
  let changesComplete = false;
  while (!changesComplete) {
    const batchStats = {};
    await source.replicator.getChanges(startSeq, { limit: batchSize.getChanges }, batchStats).pipeThrough(new Logger("getChanges")).pipeThrough(new BatchingTransformStream({ batchSize: batchSize.getDiff })).pipeThrough(target.replicator.getDiff()).pipeThrough(new Logger("getDiff")).pipeThrough(new BatchingTransformStream({ batchSize: batchSize.getRevs })).pipeThrough(source.replicator.getRevs(batchStats)).pipeThrough(new Logger("getRevs")).pipeThrough(new BatchingTransformStream({ batchSize: batchSize.saveRevs })).pipeTo(target.replicator.saveRevs(batchStats));
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
    changesComplete = batchStats.numberOfChanges < batchSize.getChanges || compareSeqs(batchStats.lastSeq, remoteSeq) >= 0;
  }
  return stats;
}

// src/base/Database.js
var Database = class extends EventTarget {
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
  async pull(other) {
    const result = await replicate(other, this);
    if (result.docsWritten > 0) {
      this.dispatchEvent(new Event("change"));
    }
    return result;
  }
  push(other) {
    return replicate(this, other);
  }
  sync(other) {
    return Promise.all([
      this.pull(other),
      this.push(other)
    ]);
  }
};

// node_modules/pouchdb-merge/lib/index.es.js
function winningRev(metadata) {
  var winningId;
  var winningPos;
  var winningDeleted;
  var toVisit = metadata.rev_tree.slice();
  var node;
  while (node = toVisit.pop()) {
    var tree = node.ids;
    var branches = tree[2];
    var pos = node.pos;
    if (branches.length) {
      for (var i = 0, len = branches.length; i < len; i++) {
        toVisit.push({ pos: pos + 1, ids: branches[i] });
      }
      continue;
    }
    var deleted = !!tree[1].deleted;
    var id = tree[0];
    if (!winningId || (winningDeleted !== deleted ? winningDeleted : winningPos !== pos ? winningPos < pos : winningId < id)) {
      winningId = id;
      winningPos = pos;
      winningDeleted = deleted;
    }
  }
  return winningPos + "-" + winningId;
}
function traverseRevTree(revs, callback) {
  var toVisit = revs.slice();
  var node;
  while (node = toVisit.pop()) {
    var pos = node.pos;
    var tree = node.ids;
    var branches = tree[2];
    var newCtx = callback(branches.length === 0, pos, tree[0], node.ctx, tree[1]);
    for (var i = 0, len = branches.length; i < len; i++) {
      toVisit.push({ pos: pos + 1, ids: branches[i], ctx: newCtx });
    }
  }
}
function compactTree(metadata) {
  var revs = [];
  traverseRevTree(metadata.rev_tree, function(isLeaf, pos, revHash, ctx, opts) {
    if (opts.status === "available" && !isLeaf) {
      revs.push(pos + "-" + revHash);
      opts.status = "missing";
    }
  });
  return revs;
}
function rootToLeaf(revs) {
  var paths = [];
  var toVisit = revs.slice();
  var node;
  while (node = toVisit.pop()) {
    var pos = node.pos;
    var tree = node.ids;
    var id = tree[0];
    var opts = tree[1];
    var branches = tree[2];
    var isLeaf = branches.length === 0;
    var history = node.history ? node.history.slice() : [];
    history.push({ id, opts });
    if (isLeaf) {
      paths.push({ pos: pos + 1 - history.length, ids: history });
    }
    for (var i = 0, len = branches.length; i < len; i++) {
      toVisit.push({ pos: pos + 1, ids: branches[i], history });
    }
  }
  return paths.reverse();
}
function sortByPos$1(a, b) {
  return a.pos - b.pos;
}
function binarySearch(arr, item, comparator) {
  var low = 0;
  var high = arr.length;
  var mid;
  while (low < high) {
    mid = low + high >>> 1;
    if (comparator(arr[mid], item) < 0) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
}
function insertSorted(arr, item, comparator) {
  var idx = binarySearch(arr, item, comparator);
  arr.splice(idx, 0, item);
}
function pathToTree(path, numStemmed) {
  var root;
  var leaf;
  for (var i = numStemmed, len = path.length; i < len; i++) {
    var node = path[i];
    var currentLeaf = [node.id, node.opts, []];
    if (leaf) {
      leaf[2].push(currentLeaf);
      leaf = currentLeaf;
    } else {
      root = leaf = currentLeaf;
    }
  }
  return root;
}
function compareTree(a, b) {
  return a[0] < b[0] ? -1 : 1;
}
function mergeTree(in_tree1, in_tree2) {
  var queue = [{ tree1: in_tree1, tree2: in_tree2 }];
  var conflicts = false;
  while (queue.length > 0) {
    var item = queue.pop();
    var tree1 = item.tree1;
    var tree2 = item.tree2;
    if (tree1[1].status || tree2[1].status) {
      tree1[1].status = tree1[1].status === "available" || tree2[1].status === "available" ? "available" : "missing";
    }
    for (var i = 0; i < tree2[2].length; i++) {
      if (!tree1[2][0]) {
        conflicts = "new_leaf";
        tree1[2][0] = tree2[2][i];
        continue;
      }
      var merged = false;
      for (var j = 0; j < tree1[2].length; j++) {
        if (tree1[2][j][0] === tree2[2][i][0]) {
          queue.push({ tree1: tree1[2][j], tree2: tree2[2][i] });
          merged = true;
        }
      }
      if (!merged) {
        conflicts = "new_branch";
        insertSorted(tree1[2], tree2[2][i], compareTree);
      }
    }
  }
  return { conflicts, tree: in_tree1 };
}
function doMerge(tree, path, dontExpand) {
  var restree = [];
  var conflicts = false;
  var merged = false;
  var res;
  if (!tree.length) {
    return { tree: [path], conflicts: "new_leaf" };
  }
  for (var i = 0, len = tree.length; i < len; i++) {
    var branch = tree[i];
    if (branch.pos === path.pos && branch.ids[0] === path.ids[0]) {
      res = mergeTree(branch.ids, path.ids);
      restree.push({ pos: branch.pos, ids: res.tree });
      conflicts = conflicts || res.conflicts;
      merged = true;
    } else if (dontExpand !== true) {
      var t1 = branch.pos < path.pos ? branch : path;
      var t2 = branch.pos < path.pos ? path : branch;
      var diff = t2.pos - t1.pos;
      var candidateParents = [];
      var trees = [];
      trees.push({ ids: t1.ids, diff, parent: null, parentIdx: null });
      while (trees.length > 0) {
        var item = trees.pop();
        if (item.diff === 0) {
          if (item.ids[0] === t2.ids[0]) {
            candidateParents.push(item);
          }
          continue;
        }
        var elements = item.ids[2];
        for (var j = 0, elementsLen = elements.length; j < elementsLen; j++) {
          trees.push({
            ids: elements[j],
            diff: item.diff - 1,
            parent: item.ids,
            parentIdx: j
          });
        }
      }
      var el = candidateParents[0];
      if (!el) {
        restree.push(branch);
      } else {
        res = mergeTree(el.ids, t2.ids);
        el.parent[2][el.parentIdx] = res.tree;
        restree.push({ pos: t1.pos, ids: t1.ids });
        conflicts = conflicts || res.conflicts;
        merged = true;
      }
    } else {
      restree.push(branch);
    }
  }
  if (!merged) {
    restree.push(path);
  }
  restree.sort(sortByPos$1);
  return {
    tree: restree,
    conflicts: conflicts || "internal_node"
  };
}
function stem(tree, depth) {
  var paths = rootToLeaf(tree);
  var stemmedRevs;
  var result;
  for (var i = 0, len = paths.length; i < len; i++) {
    var path = paths[i];
    var stemmed = path.ids;
    var node;
    if (stemmed.length > depth) {
      if (!stemmedRevs) {
        stemmedRevs = {};
      }
      var numStemmed = stemmed.length - depth;
      node = {
        pos: path.pos + numStemmed,
        ids: pathToTree(stemmed, numStemmed)
      };
      for (var s = 0; s < numStemmed; s++) {
        var rev2 = path.pos + s + "-" + stemmed[s].id;
        stemmedRevs[rev2] = true;
      }
    } else {
      node = {
        pos: path.pos,
        ids: pathToTree(stemmed, 0)
      };
    }
    if (result) {
      result = doMerge(result, node, true).tree;
    } else {
      result = [node];
    }
  }
  if (stemmedRevs) {
    traverseRevTree(result, function(isLeaf, pos, revHash) {
      delete stemmedRevs[pos + "-" + revHash];
    });
  }
  return {
    tree: result,
    revs: stemmedRevs ? Object.keys(stemmedRevs) : []
  };
}
function merge(tree, path, depth) {
  var newTree = doMerge(tree, path);
  var stemmed = stem(newTree.tree, depth);
  return {
    tree: stemmed.tree,
    stemmedRevs: stemmed.revs,
    conflicts: newTree.conflicts
  };
}

// src/indexeddb/flat/Adapter.js
var import_spark_md53 = __toESM(require_spark_md5(), 1);
var DOC_STORE = "docs";
var META_STORE = "meta";
var REVS_LIMIT = 1e3;
var STATUS_AVAILABLE = { status: "available" };
var STATUS_MISSING = { status: "missing" };
var makeRev = (data) => import_spark_md53.default.hash(JSON.stringify(data));
var parseRev = (rev2) => {
  const [prefix, id] = rev2.split("-");
  return [
    parseInt(prefix, 10),
    id
  ];
};
var calculateDigest = async (blob) => {
  const md5 = await calculateMd5(blob);
  return `md5-${md5}`;
};
var Adapter = class {
  constructor({ name }) {
    this.name = name;
    this.db = null;
    this.metadata = null;
  }
  async init() {
    if (this.db)
      return;
    return new Promise((resolve, reject) => {
      const openReq = indexedDB.open(this.name);
      openReq.onupgradeneeded = (e) => {
        const db = e.target.result;
        const keyPath = "id";
        const docStore = db.createObjectStore(DOC_STORE, { keyPath });
        docStore.createIndex("seq", "seq", { unique: true });
        db.createObjectStore(META_STORE, { keyPath });
      };
      openReq.onsuccess = (e) => {
        this.db = e.target.result;
        this.db.onabort = () => this.db.close();
        this.db.onversionchange = () => this.db.close();
        const transaction = this.db.transaction(META_STORE, "readwrite");
        transaction.oncomplete = () => resolve();
        const metaStore = transaction.objectStore(META_STORE);
        metaStore.get(META_STORE).onsuccess = (e2) => {
          this.metadata = e2.target.result || { id: META_STORE };
          let changed = false;
          if (!("doc_count" in this.metadata)) {
            changed = true;
            this.metadata.doc_count = 0;
          }
          if (!("seq" in this.metadata)) {
            changed = true;
            this.metadata.seq = 0;
          }
          if (!("db_uuid" in this.metadata)) {
            changed = true;
            this.metadata.db_uuid = makeUuid();
          }
          if (changed) {
            metaStore.put(this.metadata);
          }
        };
      };
      openReq.onerror = (e) => reject(e.target.error);
      openReq.onblocked = (e) => reject(e);
    });
  }
  destroy() {
    return new Promise((resolve, reject) => {
      this.db.close();
      const req = indexedDB.deleteDatabase(this.name);
      req.onsuccess = () => {
        this.db = null;
        this.metadata = null;
        resolve();
      };
    });
  }
  getLocalDoc(id) {
    const _id = `_local/${id}`;
    return new Promise((resolve, reject) => {
      this.db.transaction(DOC_STORE, "readonly").objectStore(DOC_STORE).get(_id).onsuccess = (e) => {
        const entry = e.target.result;
        const doc = entry ? entry.data : { _id };
        resolve(doc);
      };
    });
  }
  saveLocalDoc(doc) {
    doc._rev = doc._rev ? doc._rev + 1 : 1;
    return new Promise((resolve, reject) => {
      const entry = {
        id: doc._id,
        data: doc
      };
      this.db.transaction(DOC_STORE, "readwrite").objectStore(DOC_STORE).put(entry).onsuccess = () => resolve({ rev: doc._rev });
    });
  }
  getEntries(ids) {
    return new Promise((resolve, reject) => {
      const store = this.db.transaction(DOC_STORE, "readonly").objectStore(DOC_STORE);
      const entries = {};
      let cnt = ids.length;
      for (const id of ids) {
        store.get(id).onsuccess = (e) => {
          entries[id] = e.target.result;
          cnt--;
          if (cnt === 0) {
            resolve(entries);
          }
        };
      }
    });
  }
  async getRevs(docs) {
    const ids = docs.map(({ id }) => id);
    const entries = await this.getEntries(ids);
    for (const { id, revs } of docs) {
      const entry = entries[id];
      if (!entry) {
        continue;
      }
      rev.entry = entry;
      for (const rev2 of revs) {
        const e = entry.revs[rev2.rev];
        if (!e) {
          continue;
        }
        const { rev_tree: [{ pos, ids: ids2 }] } = entry;
        const _revisions = { start: pos - 1, ids: [] };
        let [revId, status, childs] = ids2;
        while (childs) {
          _revisions.start += 1;
          _revisions.ids.unshift(revId);
          const child = childs[0] || [];
          revId = child[0];
          status = child[1];
          childs = child[2];
        }
        const { data, deleted } = e;
        rev2.doc = {
          ...data,
          _id: id,
          _rev: rev2.rev,
          _deleted: deleted,
          _revisions
        };
      }
    }
    return docs;
  }
  async buildEntriesWithNewEdits(docsWithEntries) {
    const entries = [];
    for (const { id, revs, entry: existingEntry } of docsWithEntries) {
      const seq = ++this.metadata.seq;
      const entry = {
        id,
        seq
      };
      for (const { doc } of revs) {
        const { _id, _rev, _deleted, _attachments, _revisions } = doc;
        const pos = _revisions.start - _revisions.ids.length + 1;
        let ids = [
          _revisions.ids[0],
          STATUS_AVAILABLE,
          []
        ];
        for (let i = 1, len = _revisions.ids.length; i < len; i++) {
          ids = [
            _revisions.ids[i],
            STATUS_MISSING,
            [ids]
          ];
        }
        const newRevTree = [{
          pos,
          ids
        }];
        const existingRevTree = existingEntry ? existingEntry.rev_tree : [];
        const { tree: revTree, stemmedRevs } = merge(existingRevTree, newRevTree[0], REVS_LIMIT);
        const winningRev2 = winningRev({ rev_tree: revTree });
        const winningRevPos = parseInt(winningRev2, 10);
        const attachments = existingEntry ? existingEntry.attachments : {};
        if (_attachments) {
          for (const name in _attachments) {
            const attachment = _attachments[name];
            const {
              content_type,
              data: data2
            } = attachment;
            const digest = attachment.digest;
            attachment.digest = digest;
            attachment.revpos = winningRevPos;
            attachments[digest] = {
              data: data2,
              revs: {
                [winningRev2]: true
              }
            };
          }
        }
        const data = {};
        for (const key in doc) {
          if (key.startsWith("_"))
            continue;
          data[key] = doc[key];
        }
        if (doc._attachments) {
          data._attachments = {};
          for (const name in doc._attachments) {
            const { digest, revpos } = doc._attachments[name];
            data._attachments[name] = {
              digest,
              revpos
            };
          }
        }
        const existingRevs = existingEntry ? existingEntry.revs : null;
        const revs2 = {
          ...existingRevs,
          [_rev]: {
            data,
            deleted: !!_deleted
          }
        };
        const revsToCompact = compactTree({ rev_tree: revTree });
        const revsToDelete = revsToCompact.concat(stemmedRevs);
        for (const rev2 of revsToDelete) {
          delete revs2[rev2];
        }
        const deleted = revs2[winningRev2].deleted;
        entry.attachments = attachments;
        entry.deleted = deleted;
        entry.rev = winningRev2;
        entry.rev_tree = revTree;
        entry.revs = revs2;
      }
      let delta;
      if (existingEntry) {
        if (existingEntry.deleted) {
          delta = entry.deleted ? 0 : 1;
        } else {
          delta = entry.deleted ? -1 : 0;
        }
      } else {
        delta = entry.deleted ? 0 : 1;
      }
      this.metadata.doc_count += delta;
      entries.push(entry);
    }
    return entries;
  }
  async buildEntries(docsWithEntries) {
    const entries = [];
    for (const { doc, existingEntry } of docsWithEntries) {
      const seq = ++this.metadata.seq;
      const { _id, _rev, _deleted, _attachments } = doc;
      const data = {};
      for (const key in doc) {
        if (key.startsWith("_"))
          continue;
        data[key] = doc[key];
      }
      if (doc._attachments) {
        data._attachments = {};
        for (const name in doc._attachments) {
          const { digest, revpos } = doc._attachments[name];
          data._attachments[name] = {
            digest,
            revpos
          };
        }
      }
      const newRevId = await makeRev({ ...data, _id, _rev, _deleted });
      let newRevTree;
      let newRevNum;
      if (_rev) {
        const [currentRevPos, currentRevId] = parseRev(doc._rev);
        newRevNum = currentRevPos + 1;
        newRevTree = [{
          pos: currentRevPos,
          ids: [
            currentRevId,
            STATUS_MISSING,
            [
              [
                newRevId,
                STATUS_AVAILABLE,
                []
              ]
            ]
          ]
        }];
      } else {
        newRevNum = 1;
        newRevTree = [{
          pos: 1,
          ids: [
            newRevId,
            STATUS_AVAILABLE,
            []
          ]
        }];
      }
      const existingRevTree = existingEntry ? existingEntry.rev_tree : [];
      const { tree: revTree, stemmedRevs } = merge(existingRevTree, newRevTree[0], REVS_LIMIT);
      const winningRev2 = winningRev({ rev_tree: revTree });
      const winningRevPos = parseInt(winningRev2, 10);
      const attachments = existingEntry ? existingEntry.attachments : {};
      if (_attachments) {
        for (const name in _attachments) {
          const attachment = _attachments[name];
          const {
            content_type,
            data: data2,
            stub
          } = attachment;
          if (stub) {
            attachments[digest].revs[winningRev2] = true;
            continue;
          }
          const digest = await calculateDigest(data2);
          attachment.digest = digest;
          attachment.revpos = winningRevPos;
          attachments[digest] = {
            data: data2,
            revs: {
              [winningRev2]: true
            }
          };
        }
      }
      doc._rev = `${newRevNum}-${newRevId}`;
      const existingRevs = existingEntry ? existingEntry.revs : null;
      const revs = {
        ...existingRevs,
        [doc._rev]: {
          data,
          deleted: !!_deleted
        }
      };
      const deleted = revs[winningRev2].deleted;
      const entry = {
        attachments,
        deleted,
        id: _id,
        rev: winningRev2,
        rev_tree: revTree,
        revs,
        seq
      };
      const revsToCompact = compactTree({ rev_tree: revTree });
      const revsToDelete = revsToCompact.concat(stemmedRevs);
      for (const rev2 of revsToDelete) {
        delete entry.revs[rev2];
      }
      let delta;
      if (existingEntry) {
        if (existingEntry.deleted) {
          delta = deleted ? 0 : 1;
        } else {
          delta = deleted ? -1 : 0;
        }
      } else {
        delta = deleted ? 0 : 1;
      }
      this.metadata.doc_count += delta;
      entries.push(entry);
    }
    return entries;
  }
  async saveEntries(entries) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([DOC_STORE, META_STORE], "readwrite");
      const docStore = transaction.objectStore(DOC_STORE);
      const metaStore = transaction.objectStore(META_STORE);
      let docsWritten = 0;
      let cnt = entries.length;
      for (const entry of entries) {
        docStore.put(entry).onsuccess = () => {
          docsWritten++;
          cnt--;
          if (cnt === 0) {
            metaStore.put(this.metadata).onsuccess = () => resolve(docsWritten);
          }
        };
      }
    });
  }
  async saveRevsWithEntries(docsWithEntries) {
    const entries = await this.buildEntriesWithNewEdits(docsWithEntries);
    return this.saveEntries(entries);
  }
  async saveDocs(docs) {
    const ids = docs.map(({ _id }) => _id);
    const entries = await this.getEntries(ids);
    const docsWithEntries = docs.map((doc) => ({ doc, entry: entries[doc._id] }));
    const newEntries = await this.buildEntries(docsWithEntries);
    await this.saveEntries(newEntries);
    return newEntries.map(({ id, rev: rev2 }) => ({ ok: true, id, rev: rev2 }));
  }
  async getChanges({ since, limit } = {}) {
    since = since || -1;
    limit = limit || -1;
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(DOC_STORE, "readonly");
      const store = transaction.objectStore(DOC_STORE).index("seq");
      const req = store.openCursor(IDBKeyRange.lowerBound(since, true));
      const changes = [];
      let lastSeq = -1;
      let received = 0;
      req.onsuccess = (e) => {
        if (!e.target.result) {
          return;
        }
        const cursor = e.target.result;
        const doc = cursor.value;
        const { id, rev: rev2, seq, deleted } = doc;
        const change = { seq, id, changes: [{ rev: rev2 }], deleted };
        changes.push(change);
        lastSeq = seq;
        received++;
        if (received !== limit) {
          cursor.continue();
        }
      };
      transaction.oncomplete = () => resolve({ changes, lastSeq });
    });
  }
};

// src/base/Replicator.js
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

// src/indexeddb/flat/Replicator.js
var GetChangesReadableStream = class extends ReadableStream {
  constructor(adapter, { since, limit }, stats = {}) {
    let changes;
    super({
      async start(controller) {
        const response = await adapter.getChanges({ since, limit });
        changes = response.changes;
        stats.numberOfChanges = changes.length;
        stats.lastSeq = response.lastSeq;
      },
      pull(controller) {
        if (changes.length === 0) {
          controller.close();
          return;
        }
        const { id, changes: revs, deleted } = changes.shift();
        controller.enqueue({ id, revs, deleted });
      }
    });
  }
};
var FilterMissingRevsTransformStream = class extends TransformStream {
  constructor(adapter) {
    super({
      async transform(batchOfChanges, controller) {
        const ids = batchOfChanges.map(({ id }) => id);
        const entries = await adapter.getEntries(ids);
        for (const { id, revs } of batchOfChanges) {
          const entry = entries[id];
          if (entry) {
            const filteredRevs = revs.filter(({ rev: rev2 }) => !(rev2 in entry.revs));
            if (filteredRevs.length > 0) {
              controller.enqueue({
                id,
                revs: filteredRevs,
                entry
              });
            }
          } else {
            controller.enqueue({
              id,
              revs
            });
          }
        }
      }
    }, { highWaterMark: 8 }, { highWaterMark: 1024 });
  }
};
var GetDocsTransformStream = class extends TransformStream {
  constructor(adapter, stats) {
    stats.docsRead = 0;
    super({
      async transform(batchOfMissingDocs, controller) {
        if (batchOfMissingDocs.length === 0)
          return;
        const response = await adapter.getRevs(batchOfMissingDocs);
        for (const row of response) {
          stats.docsRead++;
          controller.enqueue(row);
        }
      }
    }, { highWaterMark: 8 });
  }
};
var SaveDocsWritableStream = class extends WritableStream {
  constructor(adapter, stats = {}) {
    stats.docsWritten = 0;
    super({
      async write(revs) {
        stats.docsWritten += await adapter.saveRevsWithEntries(revs);
      }
    }, { highWaterMark: 1024 * 4 });
  }
};
var Replicator2 = class extends Replicator {
  constructor(adapter) {
    super();
    this.adapter = adapter;
  }
  getInfo() {
    const { db_uuid, seq } = this.adapter.metadata;
    return {
      uuid: db_uuid,
      updateSeq: seq
    };
  }
  getLog(id) {
    return this.adapter.getLocalDoc(id);
  }
  saveLog(doc) {
    return this.adapter.saveLocalDoc(doc);
  }
  getChanges(since, { limit } = {}, stats = {}) {
    return new GetChangesReadableStream(this.adapter, { since, limit }, stats);
  }
  getDiff() {
    return new FilterMissingRevsTransformStream(this.adapter);
  }
  getRevs(stats = {}) {
    return new GetDocsTransformStream(this.adapter, stats);
  }
  saveRevs(stats = {}) {
    return new SaveDocsWritableStream(this.adapter, stats);
  }
};

// src/indexeddb/flat/Database.js
var IndexedDBFlatDatabase = class extends Database {
  constructor({ name }) {
    super();
    this.name = name;
    this.adapter = new Adapter({ name });
    this.replicator = new Replicator2(this.adapter);
  }
  init() {
    return this.adapter.init();
  }
  destroy() {
    return this.adapter.destroy();
  }
  async saveDoc(doc) {
    const [response] = await this.adapter.saveDocs([doc]);
    this.dispatchEvent(new Event("change"));
    return response;
  }
};
export {
  IndexedDBFlatDatabase as default
};
