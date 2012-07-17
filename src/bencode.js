/** @const */ var ASCII_D = 'd'.charCodeAt(0);
/** @const */ var ASCII_E = 'e'.charCodeAt(0);
/** @const */ var ASCII_I = 'i'.charCodeAt(0);
/** @const */ var ASCII_L = 'l'.charCodeAt(0);
/** @const */ var ASCII_COLON = ':'.charCodeAt(0);
/** @const */ var ASCII_1 = '1'.charCodeAt(0);
/** @const */ var ASCII_2 = '2'.charCodeAt(0);
/** @const */ var ASCII_3 = '3'.charCodeAt(0);
/** @const */ var ASCII_4 = '4'.charCodeAt(0);
/** @const */ var ASCII_5 = '5'.charCodeAt(0);
/** @const */ var ASCII_6 = '6'.charCodeAt(0);
/** @const */ var ASCII_7 = '7'.charCodeAt(0);
/** @const */ var ASCII_8 = '8'.charCodeAt(0);
/** @const */ var ASCII_9 = '9'.charCodeAt(0);
/** @const */ var ASCII_0 = '0'.charCodeAt(0);


/**
 * Bencode an number, array, arraybuffer or an Object
 * @param {(number|!Uint8Array|!Array|!Object)} input The input to be encoded.
 * @return {!Uint8Array} A bencoded ArrayBuffer.
 */
function bencode(input) {
  if (typeof(input) === 'number') {
    return bencodeInt(input);
  }
  else if (typeof(input) === 'object') {
    if (input instanceof Uint8Array) {
      return bencodeString(input);
    }
    else if (input instanceof Array) {
      return bencodeList(input);
    }
    else {
      return bencodeDir(input);
    }
  }
  throw new Error('Invalid Input type: ' + typeof(input));
}


/**
 * Bencodes a arraybuffer
 * @param {!Uint8Array} view data to be encoded.
 * @return {!Uint8Array} a bencoded arraybuffer.
 * @private
 */
function bencodeString(view) {
  var lengthstr = '' + view.length;
  var length = view.length + 1 + lengthstr.length;
  var buffer = new ArrayBuffer(length);
  var result = new Uint8Array(buffer);

  //length of data
  result.set(str2ab(lengthstr));

  //colon
  result[lengthstr.length] = ASCII_COLON;

  //The data
  result.set(view, lengthstr.length + 1);

  return result;
}


/**
 * Bencodes a number
 * @param {number} number number to be encoded.
 * @return {!Uint8Array} a bencoded arraybuffer.
 * @private
 */
function bencodeInt(number) {
  var intstr = '' + number;
  var length = intstr.length + 2;
  var buffer = new ArrayBuffer(length);
  var result = new Uint8Array(buffer);

  result[0] = ASCII_I;
  result.set(str2ab(intstr), 1);
  result[length - 1] = ASCII_E;

  return result;
}


/**
 * Bencodes a list
 * @param {!Array} array array to be encoded.
 * @return {!Uint8Array} a bencoded arraybuffer.
 * @private
 */
function bencodeList(array) {
  var bufferList = [];
  var bufferLength = 2;

  for (var i = 0; i < array.length; i++) {
    var b = bencode(array[i]);
    bufferList.push(b);
    bufferLength += b.length;
  }

  var buffer = new ArrayBuffer(bufferLength);
  var view = new Uint8Array(buffer);
  view[0] = ASCII_L;

  var offset = 1;
  for (var i = 0; i < bufferList.length; i++) {
    view.set(bufferList[i], offset);
    offset += bufferList[i].length;
  }

  view[bufferLength - 1] = ASCII_E;
  return view;
}


/**
 * Bencodes a dictionary
 * @param {Object} dir Object to be encoded.
 * @return {!Uint8Array} a bencoded arraybuffer.
 * @private
 */
function bencodeDir(dir) {
  var list = [];
  var bufferLength = 2;

  for (var k in dir) {
    var key = bencode(str2ab(k));
    var value = bencode(dir[k]);
    list.push({
      key: key,
      value: value
    });
    bufferLength += key.length + value.length;
  }

  var buffer = new ArrayBuffer(bufferLength);
  var view = new Uint8Array(buffer);
  view[0] = ASCII_D;

  var offset = 1;
  for (var i = 0; i < list.length; i++) {
    view.set(list[i].key, offset);
    offset += list[i].key.length;
    view.set(list[i].value, offset);
    offset += list[i].value.length;
  }

  view[bufferLength - 1] = ASCII_E;
  return view;
}


/**
 * Decodes a Uint8Array in bencode format.
 * @param {!Uint8Array} view bencoded data.
 * @return {(number|!Uint8Array|!Array|!Object)} the parsed Object.
 */
function bdecode(view) {
  var x = bdecodeWithOffset(view, 0);
  if (x.offset != view.length) {
    throw new Error('Offset mistake');
  }
  else {
    return x.value;
  }
}


/**
 * Decodes a Uint8Array in bencode format with an offset.
 * @param {!Uint8Array} view bencoded data.
 * @param {number} offset offset in the view.
 * @return {({value:number,offset:number}|
 *           {value:!Uint8Array,offset:number}|
 *           {value:!Array,offset:number}|
 *           {value:!Object,offset:number})}
 *           {value:the parsed Object, offset: the offset}.
 * @private
 */
function bdecodeWithOffset(view, offset) {
  switch (view[offset]) {
    case ASCII_L: return bdecodeList(view, offset);
    case ASCII_D: return bdecodeDir(view, offset);
    case ASCII_I: return bdecodeNumber(view, offset);
    case ASCII_1: return bdecodeString(view, offset);
    case ASCII_2: return bdecodeString(view, offset);
    case ASCII_3: return bdecodeString(view, offset);
    case ASCII_4: return bdecodeString(view, offset);
    case ASCII_5: return bdecodeString(view, offset);
    case ASCII_6: return bdecodeString(view, offset);
    case ASCII_7: return bdecodeString(view, offset);
    case ASCII_8: return bdecodeString(view, offset);
    case ASCII_9: return bdecodeString(view, offset);
    default: throw new Error('Input is not valid bencoded');
  }
}


/**
 * Decodes a number in bencode format.
 * @param {!Uint8Array} view a bencoded arraybuffer.
 * @param {number} offset offset in the view.
 * @return {{value:number,offset:number}}
 *   {value:the parsed Object,offset: the offset}.
 * @private
 */
function bdecodeNumber(view, offset) {
  var i = offset + 1;
  var e = findchar(ASCII_E, i, view);
  var str = ab2str(view.subarray(i, e));
  return {
    value: parseInt(str, 10),
    offset: e + 1
  };
}


/**
 * Decodes a string in bencode format.
 * @param {!Uint8Array} view a bencoded arraybuffer.
 * @param {number} offset in the view offset.
 * @return {{value:!Uint8Array,offset:number}}
 *   {value:the parsed Object,offset: the offset}.
 * @private
 */
function bdecodeString(view, offset) {
  var colon = findchar(ASCII_COLON, offset, view);
  var lenstr = ab2str(view.subarray(offset, colon));
  var len = parseInt(lenstr, 10);
  var buffer = new ArrayBuffer(len);
  var result = new Uint8Array(buffer);
  result.set(view.subarray(colon + 1, colon + 1 + len));
  return {
    value: result,
    offset: colon + len + 1
  };
}


/**
 * Decodes a list  in bencode format.
 * @param {!Uint8Array} view a bencoded arraybuffer.
 * @param {number} offset in the view offset.
 * @return {{value:!Array,offset:number}}
 *   {value:the parsed Object,offset: the offset}.
 * @private
 */
function bdecodeList(view, offset) {
  var i = offset + 1;
  var list = new Array();
  while (view[i] != ASCII_E) {
    var x = bdecodeWithOffset(view, i);
    list.push(x.value);
    i = x.offset;
  }

  return {
    value: list,
    offset: i + 1
  };
}


/**
 * Decodes a directory  in bencode format.
 * @param {!Uint8Array} view a bencoded ArrayBuffer.
 * @param {number} offset in the view offset.
 * @return {{value:!Object,offset:number}}
 *   {value:the parsed Object,offset: the offset}.
 * @private
 */
function bdecodeDir(view, offset) {
  var i = offset + 1;
  var dir = {};
  while (view[i] != ASCII_E) {
    var k = bdecodeString(view, i);
    var v = bdecodeWithOffset(view, k.offset);
    var s = ab2str(k.value);
    dir[s] = v.value;
    i = v.offset;
  }
  return {
    value: dir,
    offset: i + 1
  };
}


/**
 * Finds position of a charator in a UintArray.
 * @param {number} c charator to look for ind the view.
 * @param {number} offset in the view offset.
 * @param {!Uint8Array} view bencoded Arraybuffer.
 * @return {number} the position of the charator or -1 if i was not found.
 */
function findchar(c, offset, view) {
  for (var i = offset; i < view.length; i++) {
    if (view[i] == c) {
      return i;
    }
  }
  return -1;
}


/**
 * Convert a Uint8Array to a string.
 * @param {!Uint8Array} buf an ArraybufferView.
 * @return {string} the String.
 */
function ab2str(buf) {
  return String.fromCharCode.apply(null, buf);
}


/**
 * Convert a string to an Uint8Array.
 * @param {string} str a string.
 * @return {!Uint8Array} an Uint8Array.
 */
function str2ab(str) {
  var buffer = new ArrayBuffer(str.length);
  var view = new Uint8Array(buffer);
  for (var i = 0; i < str.length; i++) {
    view[i] = str.charCodeAt(i);
  }
  return view;
}

