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

// src/local/GetDiffsTransformStream.js
var GetDiffs = class {
  constructor(db, { batchSize }) {
    this.db = db;
    this.batchSize = batchSize;
    this.onDiff = null;
    this.onClose = null;
    this.changes = [];
  }
  addChange(change) {
    this.changes.push(change);
    return this.processDiffs();
  }
  close() {
    return this.processDiffs(true);
  }
  async getDiff(changes) {
    return new Promise((resolve, reject) => {
      const store = this.db.getDocStore("readonly");
      const revs = [];
      let cnt = Object.keys(changes).length;
      for (const id in changes) {
        store.get(id).onsuccess = (e) => {
          cnt--;
          const entry = e.target.result;
          for (const rev of changes[id]) {
            const isPresent = entry && rev in entry.revs;
            if (!isPresent) {
              revs.push({ id, rev });
            }
          }
          if (cnt === 0) {
            resolve(revs);
          }
        };
      }
    });
  }
  async processDiffs(flush) {
    if (!flush && this.changes.length < this.batchSize)
      return;
    if (this.changes.length === 0) {
      if (flush)
        this.onClose();
      return;
    }
    let batch = [];
    do {
      batch = this.changes.splice(0, this.batchSize);
      if (batch.length > 0) {
        const revs = {};
        for (const { id, changes } of batch) {
          revs[id] = changes.map(({ rev }) => rev);
        }
        const diff = await this.getDiff(revs);
        for (const rev of diff) {
          this.onDiff(rev);
        }
      }
    } while (batch.length === this.batchSize);
    if (flush)
      this.onClose();
  }
};
var GetDiffsTransformStream = class {
  constructor(db, { batchSize }) {
    const revsDiffsGetter = new GetDiffs(db, { batchSize });
    const queueingStrategy = new CountQueuingStrategy({ highWaterMark: 1 });
    this.readable = new ReadableStream({
      start(controller) {
        revsDiffsGetter.onDiff = (diff) => controller.enqueue(diff);
        revsDiffsGetter.onClose = () => controller.close();
      }
    });
    this.writable = new WritableStream({
      write(change) {
        return revsDiffsGetter.addChange(change);
      },
      close() {
        return revsDiffsGetter.close();
      }
    }, queueingStrategy);
  }
};

// src/local/model.js
var import_spark_md52 = __toESM(require_spark_md5(), 1);

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
        var rev = path.pos + s + "-" + stemmed[s].id;
        stemmedRevs[rev] = true;
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

// src/local/model.js
var REVS_LIMIT = 1e3;
var STATUS_AVAILABLE = { status: "available" };
var STATUS_MISSING = { status: "missing" };
var parseRev = (rev) => {
  const [prefix, id] = rev.split("-");
  return [
    parseInt(prefix, 10),
    id
  ];
};
var revisionsToRevTree = (revisions) => {
  const pos = revisions.start - revisions.ids.length + 1;
  const revisionIds = revisions.ids;
  let ids = [
    revisionIds[0],
    STATUS_AVAILABLE,
    []
  ];
  for (let i = 1, len = revisionIds.length; i < len; i++) {
    ids = [
      revisionIds[i],
      STATUS_MISSING,
      [ids]
    ];
  }
  return [{
    pos,
    ids
  }];
};
var calculateDigest = async (blob) => {
  const hash = await calculateMd5(blob);
  const md5 = btoa(hash);
  return `md5-${md5}`;
};
var makeRev = (doc) => {
  const data = {};
  for (const key in doc) {
    if (key === "_revisions")
      continue;
    data[key] = doc[key];
  }
  const string = JSON.stringify(data);
  return import_spark_md52.default.hash(string);
};
var updateAttachmentsEntry = async (newAttachments, attachments, rev) => {
  if (!newAttachments)
    return attachments;
  for (const name in newAttachments) {
    const attachment = newAttachments[name];
    const { stub } = attachment;
    if (stub) {
      const { digest: stubDigest } = attachment;
      attachments[stubDigest].revs[rev] = true;
    } else {
      const {
        content_type,
        data
      } = attachment;
      if (typeof data === "string") {
        throw new Error("Base64 attachments are not supported");
      }
      const digest = attachment.digest || await calculateDigest(data);
      attachment.digest = digest;
      attachment.revpos = parseInt(rev, 10);
      attachments[digest] = {
        data,
        revs: {
          [rev]: true
        }
      };
    }
  }
  return attachments;
};
var docToData = (doc) => {
  const data = {};
  for (const key in doc) {
    if (key.startsWith("_"))
      continue;
    data[key] = doc[key];
  }
  if (doc._attachments) {
    data._attachments = {};
    for (const name in doc._attachments) {
      const {
        digest,
        revpos
      } = doc._attachments[name];
      data._attachments[name] = {
        digest,
        revpos
      };
    }
  }
  return data;
};
var docToEntry = async (seq, doc, existingEntry, { newEdits } = { newEdits: true }) => {
  let newRevTree;
  if (newEdits) {
    const newRevId = await makeRev(doc);
    let newRevNum;
    if (doc._rev) {
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
    doc._rev = `${newRevNum}-${newRevId}`;
  } else {
    newRevTree = revisionsToRevTree(doc._revisions);
  }
  const { _id, _rev, _deleted, _attachments } = doc;
  const existingAttachments = existingEntry ? existingEntry.attachments : {};
  const attachments = await updateAttachmentsEntry(_attachments, existingAttachments, _rev);
  const data = docToData(doc);
  const existingRevTree = existingEntry ? existingEntry.rev_tree : [];
  const { tree: revTree, stemmedRevs } = merge(existingRevTree, newRevTree[0], REVS_LIMIT);
  const winningRev2 = winningRev({ rev_tree: revTree });
  const existingRevs = existingEntry ? existingEntry.revs : null;
  const revs = {
    ...existingRevs,
    [_rev]: {
      data,
      deleted: !!_deleted
    }
  };
  const deleted = revs[winningRev2].deleted;
  const revsToCompact = compactTree({ rev_tree: revTree });
  const revsToDelete = revsToCompact.concat(stemmedRevs);
  for (const rev of revsToDelete) {
    delete revs[rev];
  }
  return {
    attachments,
    deleted,
    id: _id,
    rev: winningRev2,
    rev_tree: revTree,
    revs,
    seq
  };
};

// src/local/SaveDocsWritableStream.js
var DocsWriter = class {
  constructor(db, { batchSize }) {
    this.db = db;
    this.batchSize = batchSize;
    this.docs = [];
    this.docsWritten = 0;
  }
  add(doc) {
    this.docs.push(doc);
    return this.processBatch();
  }
  close() {
    return this.processBatch(true);
  }
  async getExistingEntries(docs) {
    return new Promise((resolve, reject) => {
      const readDocStore = this.db.getDocStore("readonly");
      let cnt = docs.length;
      const items = [];
      for (const doc of docs) {
        const item = { doc };
        readDocStore.get(doc._id).onsuccess = async (e) => {
          cnt--;
          item.existingEntry = e.target.result;
          items.push(item);
          if (cnt === 0) {
            resolve(items);
          }
        };
      }
    });
  }
  async buildEntries(docsWithEntries, metadata) {
    const entries = [];
    for (const { doc, existingEntry } of docsWithEntries) {
      const seq = ++metadata.seq;
      const entry = await docToEntry(seq, doc, existingEntry, { newEdits: false });
      let delta;
      const { deleted } = entry;
      if (existingEntry) {
        if (existingEntry.deleted) {
          delta = deleted ? 0 : 1;
        } else {
          delta = deleted ? -1 : 0;
        }
      } else {
        delta = deleted ? 0 : 1;
      }
      metadata.doc_count += delta;
      entries.push(entry);
    }
    return {
      entries,
      metadata
    };
  }
  async saveEntries(entries, { seq, doc_count }) {
    return new Promise((resolve, reject) => {
      const { docStore, metaStore } = this.db.getStores("readwrite");
      let cnt = entries.length;
      for (const entry of entries) {
        docStore.put(entry).onsuccess = () => {
          this.docsWritten++;
          cnt--;
          if (cnt === 0) {
            this.db.metadata.seq = seq;
            this.db.metadata.doc_count = doc_count;
            metaStore.put(this.db.metadata).onsuccess = () => resolve();
          }
        };
      }
    });
  }
  async saveDocs(docs) {
    const stats = {
      docsWritten: 0
    };
    const docsWithEntries = await this.getExistingEntries(docs);
    const { seq, doc_count } = this.db.metadata;
    const { entries, metadata } = await this.buildEntries(docsWithEntries, { seq, doc_count });
    return this.saveEntries(entries, metadata);
  }
  async processBatch(flush) {
    if (!flush && this.docs.length < this.batchSize)
      return;
    if (this.docs.length === 0) {
      return;
    }
    let batch = [];
    do {
      batch = this.docs.splice(0, this.batchSize);
      if (batch.length > 0) {
        await this.saveDocs(batch);
      }
    } while (batch.length === this.batchSize);
  }
};
var SaveDocsWritableStream = class {
  constructor(db, { batchSize }) {
    this.docsWriter = new DocsWriter(db, { batchSize });
  }
  get docsWritten() {
    return this.docsWriter.docsWritten;
  }
  write(doc) {
    return this.docsWriter.add(doc);
  }
  close() {
    return this.docsWriter.close();
  }
};

// src/local/Local.js
var DOC_STORE = "docs";
var META_STORE = "meta";
var Local = class {
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
  getDocStore(mode) {
    return this.db.transaction(DOC_STORE, mode).objectStore(DOC_STORE);
  }
  getStores(mode) {
    const transaction = this.db.transaction([DOC_STORE, META_STORE], mode);
    return {
      docStore: transaction.objectStore(DOC_STORE),
      metaStore: transaction.objectStore(META_STORE)
    };
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
  getUuid() {
    const { db_uuid } = this.metadata;
    return db_uuid;
  }
  getUpdateSeq() {
    const { seq } = this.metadata;
    return seq;
  }
  async getReplicationLog(id) {
    const _id = `_local/${id}`;
    return new Promise((resolve, reject) => {
      this.getDocStore("readonly").get(_id).onsuccess = (e) => {
        const entry = e.target.result;
        const doc = entry ? entry.data : { _id };
        resolve(doc);
      };
    });
  }
  async saveReplicationLog(doc) {
    doc._rev = doc._rev ? doc._rev + 1 : 1;
    return new Promise((resolve, reject) => {
      const entry = {
        id: doc._id,
        data: doc
      };
      this.getDocStore("readwrite").put(entry).onsuccess = () => resolve({ rev: doc._rev });
    });
  }
  async getChangesStream(since, { limit } = {}) {
    throw new Error("Not supported for Local yet");
  }
  get lastSeq() {
    throw new Error("Not supported for Local yet");
  }
  getDiffsStream({ batchSize } = { batchSize: 128 }) {
    return new GetDiffsTransformStream(this, { batchSize });
  }
  getDocsStream({ batchSize } = { batchSize: 512 }) {
    throw new Error("Not supported for Local yet");
  }
  get docsRead() {
    throw new Error("Not supported for Local yet");
  }
  writeDocsStream({ batchSize } = { batchSize: 128 }) {
    this.saveStream = new SaveDocsWritableStream(this, { batchSize });
    const queueingStrategy = new CountQueuingStrategy({ highWaterMark: 1 });
    return new WritableStream(this.saveStream, queueingStrategy);
  }
  get docsWritten() {
    return this.saveStream && this.saveStream.docsWritten;
  }
};

// src/remote/ChangesParserTransformStream.js
var nextSplitPosition = (data, offset = 0) => {
  if (offset > data.length + 4)
    return [-1];
  for (let i = offset; i < data.length; i++) {
    if (data[i] === 125 && data[i + 1] === 44 && data[i + 2] === 13 && data[i + 3] === 10 && data[i + 4] === 123)
      return [i];
    if (data[i] === 10 && data[i + 1] === 93 && data[i + 2] === 44)
      return [i, true];
  }
  return [-1];
};
var ChangesUnpacker = class {
  constructor() {
    this.data = new Uint8Array(0);
    this.onChange = null;
    this.onClose = null;
    this.decoder = new TextDecoder();
    this.startParsed = false;
    this.lastSeq = null;
    this.numberOfChanges = 0;
  }
  addBinaryData(uint8Array) {
    const newData = new Uint8Array(this.data.length + uint8Array.length);
    newData.set(this.data, 0);
    newData.set(uint8Array, this.data.length);
    this.data = newData;
    this.checkforChanges();
  }
  checkforChanges() {
    if (!this.startParsed) {
      this.data = this.data.slice(13);
      this.startParsed = true;
    }
    let change;
    do {
      change = null;
      const [endPosition, endReached] = nextSplitPosition(this.data);
      if (endPosition === -1)
        continue;
      if (endPosition > 0) {
        const json = this.decoder.decode(this.data.slice(0, endPosition + 1));
        change = JSON.parse(json);
        this.onChange(change);
        this.numberOfChanges++;
      }
      if (endReached) {
        const rest = this.decoder.decode(this.data.slice(endPosition + 4));
        const { last_seq } = JSON.parse(`{${rest}`);
        this.lastSeq = last_seq;
        return this.onClose();
      }
      this.data = this.data.slice(endPosition + 4);
    } while (change);
  }
};
var ChangesParserTransformStream = class {
  constructor() {
    const unpacker = new ChangesUnpacker();
    const queueingStrategy = new CountQueuingStrategy({ highWaterMark: 1 });
    this.readable = new ReadableStream({
      start(controller) {
        unpacker.onChange = (change) => controller.enqueue(change);
        unpacker.onClose = () => controller.close();
      }
    });
    this.writable = new WritableStream({
      write(uint8Array) {
        unpacker.addBinaryData(uint8Array);
      }
    }, queueingStrategy);
    this.unpacker = unpacker;
  }
  get lastSeq() {
    return this.unpacker.lastSeq;
  }
  get numberOfChanges() {
    return this.unpacker.numberOfChanges;
  }
};

// node_modules/multipart-related/src/first-boundary-position.js
function firstBoundaryPosition(data, boundary, offset = 0) {
  if (offset > data.length + boundary.length + 2) {
    return -1;
  }
  for (let i = offset; i < data.length; i++) {
    if (data[i] === 45 && data[i + 1] === 45) {
      let fullMatch, k;
      for (k = 0; k < boundary.length; k++) {
        fullMatch = true;
        if (data[k + i + 2] !== boundary[k]) {
          fullMatch = false;
          break;
        }
      }
      if (fullMatch)
        return i;
    }
  }
  return -1;
}

// node_modules/multipart-related/src/first-header-separator-position.js
function firstHeaderSeparatorPosition(data, offset = 0) {
  if (offset > data.length + 4) {
    return -1;
  }
  for (let i = offset; i < data.length; i++) {
    if (data[i] === 13 && data[i + 1] === 10 && data[i + 2] === 13 && data[i + 3] === 10) {
      return i;
    }
  }
  return -1;
}

// node_modules/multipart-related/src/starts-with-boundary-end.js
function startsWithBoundaryEnd(data, boundary, offset = 0) {
  if (offset > data.length + boundary.length + 4) {
    return false;
  }
  if (data[offset] !== 45)
    return false;
  if (data[offset + 1] !== 45)
    return false;
  if (data[offset + boundary.length + 2] !== 45)
    return false;
  if (data[offset + boundary.length + 3] !== 45)
    return false;
  for (let i = 0; i < boundary.length; i++) {
    if (data[i + offset + 2] !== boundary[i]) {
      return false;
    }
  }
  return true;
}

// node_modules/multipart-related/src/multipart-related-parser.js
var MultipartRelatedParser = class {
  constructor(contentType) {
    this.encoder = new TextEncoder();
    this.decoder = new TextDecoder();
    const boundary = this.parseContentType(contentType);
    this.id = boundary.id;
    this.boundaries = [
      boundary
    ];
  }
  parseContentType(contentType) {
    const [_, type, id] = contentType.match(/^([^;]+);\s*boundary="?([^="]+)"?/) || [];
    if (type !== "multipart/related")
      return;
    const boundary = this.encoder.encode(id);
    return {
      id,
      boundary
    };
  }
  parsePart(data) {
    if (this.boundaries.length === 0)
      return null;
    const { id, boundary } = this.boundaries[this.boundaries.length - 1];
    const startPosition = firstBoundaryPosition(data, boundary);
    if (startPosition === -1)
      return null;
    const contentPosition = firstHeaderSeparatorPosition(data, startPosition);
    if (contentPosition === -1)
      return null;
    const headerData = data.slice(boundary.length + 4, contentPosition);
    const header = this.decoder.decode(headerData);
    const headers = header.split("\r\n").reduce((memo, line) => {
      const [name, value] = line.split(/:\s*/);
      memo[name] = name === "Content-Length" ? parseInt(value, 10) : value;
      return memo;
    }, {});
    const { "Content-Type": contentType } = headers;
    if (!contentType)
      return null;
    const { "Content-Length": contentLength } = headers;
    const contentEndPosition = contentLength ? firstBoundaryPosition(data, boundary, contentLength + contentPosition + 6) : firstBoundaryPosition(data, boundary, contentPosition + 4);
    if (contentEndPosition === -1)
      return null;
    if (data.length < contentEndPosition)
      return null;
    const childBoundary = this.parseContentType(contentType);
    if (childBoundary) {
      this.boundaries.push(childBoundary);
      return this.parsePart(data.slice(contentPosition + 4));
    }
    const isBoundaryEnd = startsWithBoundaryEnd(data, boundary, contentEndPosition);
    const endPosition = isBoundaryEnd ? contentEndPosition + boundary.length + 6 : contentEndPosition;
    if (isBoundaryEnd)
      this.boundaries.pop();
    const partData = data.slice(contentPosition + 4, contentEndPosition - 2);
    const rest = data.slice(endPosition);
    return {
      boundary: this.id === id ? null : id,
      headers,
      data: partData,
      rest
    };
  }
};

// node_modules/multipart-related/src/index.js
var MultipartRelated = class {
  constructor(contentType) {
    this.parser = new MultipartRelatedParser(contentType);
    this.data = new Uint8Array(0);
  }
  read(chunk) {
    if (chunk) {
      const newData = new Uint8Array(this.data.length + chunk.length);
      newData.set(this.data, 0);
      newData.set(chunk, this.data.length);
      this.data = newData;
    }
    const parts = [];
    let part;
    do {
      part = this.parser.parsePart(this.data);
      if (part) {
        const { boundary, headers, data, rest } = part;
        this.data = rest;
        parts.push({
          boundary,
          headers,
          data
        });
      }
    } while (part);
    return parts;
  }
};

// src/remote/GetDocsTransformStream.js
var gunzip = (blob, type) => {
  const ds = new DecompressionStream("gzip");
  const decompressedStream = blob.stream().pipeThrough(ds);
  const responseOptions = {
    headers: {
      "Content-Type": type
    }
  };
  return new Response(decompressedStream, responseOptions).blob();
};
var DocsGetter = class {
  constructor(db, { batchSize }) {
    this.db = db;
    this.batchSize = batchSize;
    this.decoder = new TextDecoder();
    this.onDoc = null;
    this.onClose = null;
    this.revs = [];
    this.docsRead = 0;
  }
  addRev(rev) {
    this.revs.push(rev);
    return this.getDocs();
  }
  close() {
    return this.getDocs(true);
  }
  async getDocs(flush) {
    if (!flush && this.revs.length < this.batchSize)
      return;
    if (this.revs.length === 0) {
      if (flush)
        this.onClose();
      return;
    }
    let batch = [];
    do {
      batch = this.revs.splice(0, this.batchSize);
      if (batch.length > 0) {
        await this.processBatch(batch);
      }
    } while (batch.length === this.batchSize);
    if (flush)
      this.onClose();
  }
  async processBatch(batch) {
    const response = await this.getDocsMultipart(batch);
    const contentType = response.headers.get("Content-Type");
    const parser = new MultipartRelated(contentType);
    const reader = response.body.getReader();
    let batchComplete = false;
    let currentParts = [];
    let currentBoundary = null;
    do {
      const { done, value } = await reader.read();
      const parts = parser.read(value);
      for (const part of parts) {
        if (!part.boundary) {
          await this.emitDoc(currentParts);
          currentParts = [];
          currentBoundary = null;
          await this.emitDoc([part]);
        } else if (currentBoundary && currentBoundary !== part.boundary) {
          await this.emitDoc(currentParts);
          currentParts = [part];
          currentBoundary = null;
        } else {
          currentParts.push(part);
          currentBoundary = part.boundary;
        }
      }
      batchComplete = done;
    } while (!batchComplete);
    await this.emitDoc(currentParts);
  }
  async getDocsMultipart(revs) {
    const url = new URL(`${this.db.root}/_bulk_get`, this.db.url);
    url.searchParams.set("revs", "true");
    url.searchParams.set("attachments", "true");
    const payload = { docs: revs };
    const response = await fetch(url, {
      headers: {
        ...this.db.headers,
        "Content-Type": "application/json",
        "Accept": "multipart/related"
      },
      method: "post",
      body: JSON.stringify(payload)
    });
    if (response.status !== 200) {
      throw new Error("Could not get docs multipart");
    }
    return response;
  }
  async emitDoc(parts) {
    if (parts.length === 0)
      return;
    const { headers, data } = parts.shift();
    const json = this.decoder.decode(data);
    const doc = JSON.parse(json);
    for (const { headers: headers2, data: data2 } of parts) {
      const contentDisposition = headers2["Content-Disposition"];
      if (!contentDisposition) {
        console.warn("skipping attachment with missing Content-Disposition header", headers2, doc, parts);
        continue;
      }
      const [_, filename] = contentDisposition.match(/filename="([^"]+)"/);
      if (!(filename in doc._attachments)) {
        console.warn("skipping attachment due to missing filename in docs attachments stub", headers2, doc, parts);
        continue;
      }
      const type = headers2["Content-Type"];
      if (!type) {
        console.warn("skipping attachment due to missing Content-Type header", headers2, doc, parts);
        continue;
      }
      const blob = new Blob([data2], { type });
      const contentEncoding = headers2["Content-Encoding"];
      if (contentEncoding === "gzip") {
        doc._attachments[filename].data = await gunzip(blob, type);
        delete doc._attachments[filename].follows;
        delete doc._attachments[filename].encoding;
        delete doc._attachments[filename].encoded_length;
      } else if (contentEncoding) {
        console.warn("skipping attachment with unsupported Content-Encoding header", headers2, doc, parts);
        continue;
      } else {
        doc._attachments[filename].data = blob;
        delete doc._attachments[filename].follows;
      }
    }
    this.docsRead++;
    this.onDoc(doc);
  }
};
var GetDocsTransformStream = class {
  constructor(db, { batchSize }) {
    const docsGetter = new DocsGetter(db, { batchSize });
    const queueingStrategy = new CountQueuingStrategy({ highWaterMark: 1 });
    this.docsGetter = docsGetter;
    this.readable = new ReadableStream({
      start(controller) {
        docsGetter.onDoc = (diff) => controller.enqueue(diff);
        docsGetter.onClose = () => controller.close();
      }
    });
    this.writable = new WritableStream({
      write(rev) {
        return docsGetter.addRev(rev);
      },
      close() {
        return docsGetter.close();
      }
    }, queueingStrategy);
  }
  get docsRead() {
    return this.docsGetter.docsRead;
  }
};

// src/remote/Remote.js
var Remote = class {
  constructor({ url, headers }) {
    this.url = url;
    this.root = url.pathname;
    this.headers = headers;
    this.changesParser = null;
  }
  async getUuid() {
    const url = new URL(this.url);
    url.pathname = "/";
    const response = await fetch(url, {
      headers: this.headers
    });
    if (response.status !== 200) {
      throw new Error("Remote server not reachable");
    }
    const { uuid } = await response.json();
    return uuid;
  }
  async getUpdateSeq() {
    const url = new URL(this.url);
    const response = await fetch(url, {
      headers: this.headers
    });
    if (response.status !== 200) {
      throw new Error("Remote database not reachable");
    }
    const { update_seq } = await response.json();
    return update_seq;
  }
  async getReplicationLog(id) {
    const _id = `_local/${id}`;
    const url = new URL(`${this.root}/${_id}`, this.url);
    const response = await fetch(url, {
      headers: this.headers
    });
    if (response.status === 200) {
      return response.json();
    }
    return { _id };
  }
  async saveReplicationLog(doc) {
    const url = new URL(`${this.root}/${doc._id}`, this.url);
    const response = await fetch(url, {
      headers: {
        ...this.headers,
        "Content-Type": "application/json"
      },
      method: "put",
      body: JSON.stringify(doc)
    });
    if (response.status !== 201) {
      throw new Error("Could not save replication log");
    }
    return response.json();
  }
  async getChangesStream(since, { limit } = {}) {
    const url = new URL(`${this.root}/_changes`, this.url);
    url.searchParams.set("feed", "normal");
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
    this.changesParserTransformStream = new ChangesParserTransformStream();
    const reader = response.body.getReader();
    const readableStream = new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          controller.enqueue(value);
        }
        controller.close();
        reader.releaseLock();
      }
    });
    return readableStream.pipeThrough(this.changesParserTransformStream);
  }
  get lastSeq() {
    return this.changesParserTransformStream && this.changesParserTransformStream.lastSeq;
  }
  get numberOfChanges() {
    return this.changesParserTransformStream && this.changesParserTransformStream.numberOfChanges;
  }
  getDiffsStream({ batchSize } = { batchSize: 128 }) {
    throw new Error("Not supported for Remote yet");
  }
  getDocsStream({ batchSize } = { batchSize: 512 }) {
    this.getDocsTransformSteam = new GetDocsTransformStream(this, { batchSize });
    return this.getDocsTransformSteam;
  }
  get docsRead() {
    return this.getDocsTransformSteam ? this.getDocsTransformSteam.docsRead : 0;
  }
  writeDocsStream({ batchSize } = { batchSize: 128 }) {
    throw new Error("Not supported for Remote yet");
  }
  get docsWritten() {
    throw new Error("Not supported for Remote yet");
  }
};

// src/replicate.js
var import_spark_md53 = __toESM(require_spark_md5(), 1);
var generateReplicationLogId = async (localId, remoteId) => {
  return import_spark_md53.default.hash(`${localId}${remoteId}`);
};
var findCommonAncestor = (localLog, remoteLog) => {
  return localLog.session_id && localLog.session_id === remoteLog.session_id && localLog.source_last_seq && localLog.source_last_seq === remoteLog.source_last_seq ? localLog.source_last_seq : null;
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
async function replicate(source, target) {
  const sessionId = makeUuid();
  const stats = {
    docsRead: 0,
    docsWritten: 0
  };
  const [
    localUuid,
    remoteUuid,
    remoteSeq
  ] = await Promise.all([
    target.getUuid(),
    source.getUuid(),
    source.getUpdateSeq()
  ]);
  const replicationLogId = await generateReplicationLogId(localUuid, remoteUuid);
  const [
    targetLog,
    sourceLog
  ] = await Promise.all([
    target.getReplicationLog(replicationLogId),
    source.getReplicationLog(replicationLogId)
  ]);
  let startSeq = findCommonAncestor(targetLog, sourceLog);
  let changesComplete = false;
  while (!changesComplete && compareSeqs(startSeq, remoteSeq) < 0) {
    await source.getChangesStream(startSeq, { limit: 1024 }).then((rs) => rs.pipeThrough(target.getDiffsStream({ batchSize: 128 }))).then((rs) => rs.pipeThrough(source.getDocsStream({ batchSize: 512 }))).then((rs) => rs.pipeTo(target.writeDocsStream({ batchSize: 128 })));
    const { lastSeq, numberOfChanges, docsRead } = source;
    const { docsWritten } = target;
    stats.lastSeq = lastSeq;
    stats.docsRead += docsRead;
    stats.docsWritten += docsWritten;
    changesComplete = numberOfChanges < 1024;
    if (lastSeq !== startSeq) {
      sourceLog.session_id = sessionId;
      sourceLog.source_last_seq = lastSeq;
      targetLog.session_id = sessionId;
      targetLog.source_last_seq = lastSeq;
      const [
        { rev: targetLogRev },
        { rev: sourceLogRev }
      ] = await Promise.all([
        target.saveReplicationLog(targetLog),
        source.saveReplicationLog(sourceLog)
      ]);
      targetLog._rev = targetLogRev;
      sourceLog._rev = sourceLogRev;
    }
    startSeq = lastSeq;
  }
  return stats;
}

// src/Microcouch.js
var CHANGE_EVENT = new Event("change");
var Microcouch = class extends EventTarget {
  constructor({ name, url, headers }) {
    super();
    this.local = new Local({ name });
    this.remote = new Remote({ url, headers });
  }
  init() {
    return this.local.init();
  }
  async pull() {
    console.time("pull");
    const result = await replicate(this.remote, this.local);
    console.timeEnd("pull");
    if (result.docsWritten > 0) {
      this.dispatchEvent(CHANGE_EVENT);
    }
    return result;
  }
  push() {
    return replicate(this.local, this.remote);
  }
  sync() {
    return Promise.all([
      this.pull(),
      this.push()
    ]);
  }
};
export {
  Microcouch as default
};
