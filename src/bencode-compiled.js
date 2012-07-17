window.e=bencode;window.d=bdecode;var ASCII_D=100,ASCII_E=101,ASCII_I=105,ASCII_L=108,ASCII_COLON=58,ASCII_1=49,ASCII_2=50,ASCII_3=51,ASCII_4=52,ASCII_5=53,ASCII_6=54,ASCII_7=55,ASCII_8=56,ASCII_9=57,ASCII_0=48;function bencode(a){if("number"===typeof a)return bencodeInt(a);if("object"===typeof a)return a instanceof Uint8Array?bencodeString(a):a instanceof Array?bencodeList(a):bencodeDir(a);throw Error("Invalid Input: "+typeof a);}
function bencodeString(a){var c=""+a.length,b=new ArrayBuffer(a.length+1+c.length),b=new Uint8Array(b);b.set(str2ab(c));b[c.length]=ASCII_COLON;b.set(a,c.length+1);return b}function bencodeInt(a){var a=""+a,c=a.length+2,b=new ArrayBuffer(c),b=new Uint8Array(b);b[0]=ASCII_I;b.set(str2ab(a),1);b[c-1]=ASCII_E;return b}
function bencodeList(a){for(var c=[],b=2,d=0;d<a.length;d++){var e=bencode(a[d]);c.push(e);b+=e.length}d=new ArrayBuffer(b);a=new Uint8Array(d);a[0]=ASCII_L;e=1;for(d=0;d<c.length;d++)a.set(c[d],e),e+=c[d].length;a[b-1]=ASCII_E;return a}
function bencodeDir(a){var c=[],b=2,d;for(d in a){var e=bencode(str2ab(d)),f=bencode(a[d]);c.push({key:e,value:f});b+=e.length+f.length}a=new ArrayBuffer(b);a=new Uint8Array(a);a[0]=ASCII_D;d=1;for(e=0;e<c.length;e++)a.set(c[e].key,d),d+=c[e].key.length,a.set(c[e].value,d),d+=c[e].value.length;a[b-1]=ASCII_E;return a}function bdecode(a){var c=bdecodeWithOffset(a,0);if(c.offset!=a.length)throw Error("Offset mistake");return c.value}
function bdecodeWithOffset(a,c){switch(a[c]){case ASCII_L:return bdecodeList(a,c);case ASCII_D:return bdecodeDir(a,c);case ASCII_I:return bdecodeNumber(a,c);case ASCII_1:return bdecodeString(a,c);case ASCII_2:return bdecodeString(a,c);case ASCII_3:return bdecodeString(a,c);case ASCII_4:return bdecodeString(a,c);case ASCII_5:return bdecodeString(a,c);case ASCII_6:return bdecodeString(a,c);case ASCII_7:return bdecodeString(a,c);case ASCII_8:return bdecodeString(a,c);case ASCII_9:return bdecodeString(a,
c);default:throw Error("Input is not valid bencoded");}}function bdecodeNumber(a,c){var b=c+1,d=findchar(ASCII_E,b,a),b=ab2str(a.subarray(b,d));return{value:parseInt(b,10),offset:d+1}}function bdecodeString(a,c){var b=findchar(ASCII_COLON,c,a),d=ab2str(a.subarray(c,b)),d=parseInt(d,10),e=new ArrayBuffer(d),e=new Uint8Array(e);e.set(a.subarray(b+1,b+1+d));return{value:e,offset:b+d+1}}
function bdecodeList(a,c){for(var b=c+1,d=[];a[b]!=ASCII_E;)b=bdecodeWithOffset(a,b),d.push(b.value),b=b.offset;return{value:d,offset:b+1}}function bdecodeDir(a,c){for(var b=c+1,d={};a[b]!=ASCII_E;){var e=bdecodeString(a,b),b=bdecodeWithOffset(a,e.offset),e=ab2str(e.value);d[e]=b.value;b=b.offset}return{value:d,offset:b+1}}function findchar(a,c,b){for(;c<b.length;c++)if(b[c]==a)return c;return-1}function ab2str(a){return String.fromCharCode.apply(null,a)}
function str2ab(a){for(var c=new ArrayBuffer(a.length),c=new Uint8Array(c),b=0;b<a.length;b++)c[b]=a.charCodeAt(b);return c};
