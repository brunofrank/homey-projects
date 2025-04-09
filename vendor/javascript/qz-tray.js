var t={DEBUG: false};
var o={};
/**
 * @version 2.2.4
 * @overview QZ Tray Connector
 * @license LGPL-2.1-only
 * <p/>
 * Connects a web client to the QZ Tray software.
 * Enables printing and device communication from javascript.
 */var r=function(){Array.isArray||(Array.isArray=function(e){return Object.prototype.toString.call(e)==="[object Array]"});Number.isInteger||(Number.isInteger=function(e){return typeof e==="number"&&isFinite(e)&&Math.floor(e)===e});var e={VERSION:"2.2.4",DEBUG:false,log:{trace:function(){e.DEBUG&&console.log.apply(console,arguments)},info:function(){console.info.apply(console,arguments)},warn:function(){console.warn.apply(console,arguments)},allay:function(){e.DEBUG&&console.warn.apply(console,arguments)},error:function(){console.error.apply(console,arguments)}},streams:{serial:"SERIAL",usb:"USB",hid:"HID",printer:"PRINTER",file:"FILE",socket:"SOCKET"},websocket:{connection:null,shutdown:false,connectConfig:{host:["localhost","localhost.qz.io"],hostIndex:0,usingSecure:true,protocol:{secure:"wss://",insecure:"ws://"},port:{secure:[8181,8282,8383,8484],insecure:[8182,8283,8384,8485],portIndex:0},keepAlive:60,retries:0,delay:0},setup:{findConnection:function(t,o,r){if(e.websocket.shutdown)r(new Error("Connection attempt cancelled by user"));else{if(t.port.secure.length){if(!t.port.insecure.length&&!t.usingSecure){e.log.trace("No insecure ports specified - forcing secure connection");t.usingSecure=true}}else{if(!t.port.insecure.length){r(new Error("No ports have been specified to connect over"));return}if(t.usingSecure){e.log.error("No secure ports specified - forcing insecure connection");t.usingSecure=false}}var deeper=function(){if(e.websocket.shutdown)r(new Error("Connection attempt cancelled by user"));else{t.port.portIndex++;if(t.usingSecure&&t.port.portIndex>=t.port.secure.length||!t.usingSecure&&t.port.portIndex>=t.port.insecure.length){if(t.hostIndex>=t.host.length-1){r(new Error("Unable to establish connection with QZ"));return}t.hostIndex++;t.port.portIndex=0}e.websocket.setup.findConnection(t,o,r)}};var n;n=t.usingSecure?t.protocol.secure+t.host[t.hostIndex]+":"+t.port.secure[t.port.portIndex]:t.protocol.insecure+t.host[t.hostIndex]+":"+t.port.insecure[t.port.portIndex];try{e.log.trace("Attempting connection",n);e.websocket.connection=new e.tools.ws(n)}catch(t){e.log.error(t);deeper();return}if(e.websocket.connection!=null){e.websocket.connection.established=false;e.websocket.connection.onopen=function(i){if(!e.websocket.connection.established){e.log.trace(i);e.log.info("Established connection with QZ Tray on "+n);e.websocket.setup.openConnection({resolve:o,reject:r});if(t.keepAlive>0){var s=setInterval((function(){e.tools.isActive()&&e.websocket.connection.interval===s?e.websocket.connection.send("ping"):clearInterval(s)}),t.keepAlive*1e3);e.websocket.connection.interval=s}}};e.websocket.connection.onclose=function(){e.websocket.connection&&typeof navigator!=="undefined"&&navigator.userAgent.indexOf("Safari")!=-1&&navigator.userAgent.indexOf("Chrome")==-1&&e.websocket.connection.onerror()};e.websocket.connection.onerror=function(t){e.log.trace(t);e.websocket.connection=null;deeper()}}else r(new Error("Unable to create a websocket connection"))}},openConnection:function(t){e.websocket.connection.established=true;e.websocket.connection.onclose=function(t){e.log.trace(t);e.websocket.connection=null;e.websocket.callClose(t);e.log.info("Closed connection with QZ Tray");for(var o in e.websocket.pendingCalls)e.websocket.pendingCalls.hasOwnProperty(o)&&e.websocket.pendingCalls[o].reject(new Error("Connection closed before response received"));this.promise!=void 0&&this.promise.resolve()};e.websocket.connection.onerror=function(t){e.websocket.callError(t)};e.websocket.connection.sendData=function(t){e.log.trace("Preparing object for websocket",t);if(t.timestamp==void 0){t.timestamp=Date.now();typeof t.timestamp!=="number"&&(t.timestamp=(new Date).getTime())}if(t.promise!=void 0){t.uid=e.websocket.setup.newUID();e.websocket.pendingCalls[t.uid]=t.promise}t.position={x:typeof screen!=="undefined"?(screen.availWidth||screen.width)/2+(screen.left||screen.availLeft||0):0,y:typeof screen!=="undefined"?(screen.availHeight||screen.height)/2+(screen.top||screen.availTop||0):0};try{if(t.call!=void 0&&t.signature==void 0&&e.security.needsSigned(t.call)){var o={call:t.call,params:t.params,timestamp:t.timestamp};var r=e.tools.hash(e.tools.stringify(o));r.then||(r=e.tools.promise((function(e){e(r)})));r.then((function(t){return e.security.callSign(t)})).then((function(o){e.log.trace("Signature for call",o);t.signature=o||"";t.signAlgorithm=e.security.signAlgorithm;e.signContent=void 0;e.websocket.connection.send(e.tools.stringify(t))})).catch((function(o){e.log.error("Signing failed",o);if(t.promise!=void 0){t.promise.reject(new Error("Failed to sign request"));delete e.websocket.pendingCalls[t.uid]}}))}else{e.log.trace("Signature for call",t.signature);e.websocket.connection.send(e.tools.stringify(t))}}catch(o){e.log.error(o);if(t.promise!=void 0){t.promise.reject(o);delete e.websocket.pendingCalls[t.uid]}}};e.websocket.connection.onmessage=function(t){var o=JSON.parse(t.data);if(o.uid!=null){e.log.trace("Received response from websocket",o);var r=e.websocket.pendingCalls[o.uid];r==void 0?e.log.allay("No promise found for returned response"):o.error!=void 0?r.reject(new Error(o.error)):r.resolve(o.result);delete e.websocket.pendingCalls[o.uid]}else if(o.type==null)e.websocket.connection.close(4003,"Connected to incompatible QZ Tray version");else switch(o.type){case e.streams.serial:o.event||(o.event=JSON.stringify({portName:o.key,output:o.data}));e.serial.callSerial(JSON.parse(o.event));break;case e.streams.socket:e.socket.callSocket(JSON.parse(o.event));break;case e.streams.usb:o.event||(o.event=JSON.stringify({vendorId:o.key[0],productId:o.key[1],output:o.data}));e.usb.callUsb(JSON.parse(o.event));break;case e.streams.hid:e.hid.callHid(JSON.parse(o.event));break;case e.streams.printer:e.printers.callPrinter(JSON.parse(o.event));break;case e.streams.file:e.file.callFile(JSON.parse(o.event));break;default:e.log.allay("Cannot determine stream type for callback",o);break}};function sendCert(r){r===void 0&&(r=null);o.api.getVersion().then((function(t){e.websocket.connection.version=t;e.websocket.connection.semver=t.toLowerCase().replace(/-rc\./g,"-rc").split(/[\\+\\.-]/g);for(var o=0;o<e.websocket.connection.semver.length;o++){try{if(o==3&&e.websocket.connection.semver[o].toLowerCase().indexOf("rc")==0){e.websocket.connection.semver[o]=-e.websocket.connection.semver[o].replace(/\D/g,"");continue}e.websocket.connection.semver[o]=parseInt(e.websocket.connection.semver[o])}catch(e){}e.websocket.connection.semver.length<4&&(e.websocket.connection.semver[3]=0)}e.compatible.algorithm(true)})).then((function(){e.websocket.connection.sendData({certificate:r,promise:t})}))}e.security.callCert().then(sendCert).catch((function(o){e.log.warn("Failed to get certificate:",o);e.security.rejectOnCertFailure?t.reject(o):sendCert(null)}))},newUID:function(){var e=6;return(new Array(e+1).join("0")+(Math.random()*Math.pow(36,e)|0).toString(36)).slice(-e)}},dataPromise:function(t,o,r,n){return e.tools.promise((function(i,s){var a={call:t,promise:{resolve:i,reject:s},params:o,signature:r,timestamp:n};e.websocket.connection.sendData(a)}))},pendingCalls:{},errorCallbacks:[],callError:function(t){if(Array.isArray(e.websocket.errorCallbacks))for(var o=0;o<e.websocket.errorCallbacks.length;o++)e.websocket.errorCallbacks[o](t);else e.websocket.errorCallbacks(t)},closedCallbacks:[],callClose:function(t){if(Array.isArray(e.websocket.closedCallbacks))for(var o=0;o<e.websocket.closedCallbacks.length;o++)e.websocket.closedCallbacks[o](t);else e.websocket.closedCallbacks(t)}},printing:{defaultConfig:{bounds:null,colorType:"color",copies:1,density:0,duplex:false,fallbackDensity:null,interpolation:"bicubic",jobName:null,legacy:false,margins:0,orientation:null,paperThickness:null,printerTray:null,rasterize:false,rotation:0,scaleContent:true,size:null,units:"in",forceRaw:false,encoding:null,spool:null}},serial:{serialCallbacks:[],callSerial:function(t){if(Array.isArray(e.serial.serialCallbacks))for(var o=0;o<e.serial.serialCallbacks.length;o++)e.serial.serialCallbacks[o](t);else e.serial.serialCallbacks(t)}},socket:{socketCallbacks:[],callSocket:function(t){if(Array.isArray(e.socket.socketCallbacks))for(var o=0;o<e.socket.socketCallbacks.length;o++)e.socket.socketCallbacks[o](t);else e.socket.socketCallbacks(t)}},usb:{usbCallbacks:[],callUsb:function(t){if(Array.isArray(e.usb.usbCallbacks))for(var o=0;o<e.usb.usbCallbacks.length;o++)e.usb.usbCallbacks[o](t);else e.usb.usbCallbacks(t)}},hid:{hidCallbacks:[],callHid:function(t){if(Array.isArray(e.hid.hidCallbacks))for(var o=0;o<e.hid.hidCallbacks.length;o++)e.hid.hidCallbacks[o](t);else e.hid.hidCallbacks(t)}},printers:{printerCallbacks:[],callPrinter:function(t){if(Array.isArray(e.printers.printerCallbacks))for(var o=0;o<e.printers.printerCallbacks.length;o++)e.printers.printerCallbacks[o](t);else e.printers.printerCallbacks(t)}},file:{fileCallbacks:[],callFile:function(t){if(Array.isArray(e.file.fileCallbacks))for(var o=0;o<e.file.fileCallbacks.length;o++)e.file.fileCallbacks[o](t);else e.file.fileCallbacks(t)}},security:{certHandler:function(e,t){t()},callCert:function(){return typeof e.security.certHandler.then==="function"?e.security.certHandler:e.security.certHandler.constructor.name==="AsyncFunction"?e.security.certHandler():e.tools.promise(e.security.certHandler)},signatureFactory:function(){return function(e){e()}},callSign:function(t){return e.security.signatureFactory.constructor.name==="AsyncFunction"?e.security.signatureFactory(t):e.tools.promise(e.security.signatureFactory(t))},signAlgorithm:"SHA1",rejectOnCertFailure:false,needsSigned:function(e){const t=["printers.getStatus","printers.stopListening","usb.isClaimed","usb.closeStream","usb.releaseDevice","hid.stopListening","hid.isClaimed","hid.closeStream","hid.releaseDevice","file.stopListening","getVersion"];return e!=null&&t.indexOf(e)===-1}},tools:{promise:function(t){if(typeof RSVP!=="undefined")return new RSVP.Promise(t);if(typeof Promise!=="undefined")return new Promise(t);e.log.error("Promise/A+ support is required.  See qz.api.setPromiseType(...)")},reject:function(t){return e.tools.promise((function(e,o){o(t)}))},stringify:function(e){var t=Array.prototype.toJSON;delete Array.prototype.toJSON;function skipKeys(e,t){if(e!=="promise")return t}var o=JSON.stringify(e,skipKeys);t&&(Array.prototype.toJSON=t);return o},hash:function(t){return typeof Sha256!=="undefined"?Sha256.hash(t):e.SHA.hash(t)},ws:typeof WebSocket!=="undefined"?WebSocket:null,absolute:function(e){if(typeof window!=="undefined"&&typeof document.createElement==="function"){var o=document.createElement("a");o.href=e;return o.href}t.resolve(e);return e},relative:function(t){for(var o=0;o<t.length;o++)if(t[o].constructor===Object){var r=false;if(t[o].data&&t[o].data.search&&t[o].data.search(/data:image\/\w+;base64,/)===0){t[o].flavor="base64";t[o].data=t[o].data.replace(/^data:image\/\w+;base64,/,"")}else t[o].flavor?["FILE","XML"].indexOf(t[o].flavor.toUpperCase())>-1&&(r=true):(t[o].format&&["HTML","IMAGE","PDF","FILE","XML"].indexOf(t[o].format.toUpperCase())>-1||t[o].type&&(["PIXEL","IMAGE","PDF"].indexOf(t[o].type.toUpperCase())>-1&&!t[o].format||["HTML","PDF"].indexOf(t[o].type.toUpperCase())>-1&&(!t[o].format||t[o].format.toUpperCase()==="FILE")))&&(r=true);r&&(t[o].data=e.tools.absolute(t[o].data));t[o].options&&typeof t[o].options.overlay==="string"&&(t[o].options.overlay=e.tools.absolute(t[o].options.overlay))}},extend:function(t){typeof t!=="object"&&(t={});for(var o=1;o<arguments.length;o++){var r=arguments[o];if(r)for(var n in r)if(r.hasOwnProperty(n)){if(t===r[n])continue;if(r[n]&&r[n].constructor&&r[n].constructor===Object){var i;i=Array.isArray(r[n])?t[n]||[]:t[n]||{};t[n]=e.tools.extend(i,r[n])}else r[n]!==void 0&&(t[n]=r[n])}}return t},versionCompare:function(t,o,r,n){if(e.tools.assertActive()){var i=e.websocket.connection.semver;return i[0]!=t?i[0]-t:o!=void 0&&i[1]!=o?i[1]-o:r!=void 0&&i[2]!=r?i[2]-r:n!=void 0&&i.length>3&&i[3]!=n?Number.isInteger(i[3])&&Number.isInteger(n)?i[3]-n:i[3].toString().localeCompare(n.toString()):0}},isVersion:function(t,o,r,n){return e.tools.versionCompare(t,o,r,n)==0},isActive:function(){return!e.websocket.shutdown&&e.websocket.connection!=null&&(e.websocket.connection.readyState===e.tools.ws.OPEN||e.websocket.connection.readyState===e.tools.ws.CONNECTING)},assertActive:function(){if(e.tools.isActive())return true;throw new Error("A connection to QZ has not been established yet")},uint8ArrayToHex:function(e){return Array.from(e).map((function(e){return e.toString(16).padStart(2,"0")})).join("")},uint8ArrayToBase64:function(e){var t=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","+","/"];var o,r="",n=e.length;for(o=2;o<n;o+=3){r+=t[e[o-2]>>2];r+=t[(e[o-2]&3)<<4|e[o-1]>>4];r+=t[(e[o-1]&15)<<2|e[o]>>6];r+=t[e[o]&63]}if(o===n+1){r+=t[e[o-2]>>2];r+=t[(e[o-2]&3)<<4];r+="=="}if(o===n){r+=t[e[o-2]>>2];r+=t[(e[o-2]&3)<<4|e[o-1]>>4];r+=t[(e[o-1]&15)<<2];r+="="}return r}},compatible:{data:function(t){for(var o=0;o<t.length;o++)if(t[o].constructor===Object&&t[o].data instanceof Uint8Array&&t[o].flavor){var r=t[o].flavor.toString().toUpperCase();switch(r){case"BASE64":t[o].data=e.tools.uint8ArrayToBase64(t[o].data);break;case"HEX":t[o].data=e.tools.uint8ArrayToHex(t[o].data);break;default:throw new Error("Uint8Array conversion to '"+r+"' is not supported.")}}if(e.tools.versionCompare(2,2,4)<0)for(o=0;o<t.length;o++)t[o].constructor===Object&&t[o].options&&typeof t[o].options.dotDensity==="string"&&(t[o].options.dotDensity=t[o].options.dotDensity.toLowerCase().replace("-legacy",""));if(e.tools.isVersion(2,0)){e.log.trace("Converting print data to v2.0 for "+e.websocket.connection.version);for(o=0;o<t.length;o++)if(t[o].constructor===Object){if(t[o].type&&t[o].type.toUpperCase()==="RAW"&&t[o].format&&t[o].format.toUpperCase()==="IMAGE"){t[o].flavor&&t[o].flavor.toUpperCase()==="BASE64"&&(t[o].data="data:image/compat;base64,"+t[o].data);t[o].flavor="IMAGE"}(t[o].type&&t[o].type.toUpperCase()==="RAW"||t[o].format&&t[o].format.toUpperCase()==="COMMAND")&&(t[o].format="RAW");t[o].type=t[o].format;t[o].format=t[o].flavor;delete t[o].flavor}}},config:function(t,o){e.tools.isVersion(2,0)&&(o.rasterize||(t.rasterize=true));if(e.tools.versionCompare(2,2)<0&&t.forceRaw!=="undefined"){t.altPrinting=t.forceRaw;delete t.forceRaw}if(e.tools.versionCompare(2,1,2,11)<0&&t.spool){if(t.spool.size){t.perSpool=t.spool.size;delete t.spool.size}if(t.spool.end){t.endOfDoc=t.spool.end;delete t.spool.end}delete t.spool}return t},networking:function(t,o,r,n,i){return e.tools.isVersion(2,0)?e.tools.promise((function(s,a){e.websocket.dataPromise("websocket.getNetworkInfo",{hostname:t,port:o},r,n).then((function(e){s(typeof i!=="undefined"?i(e):e)}),a)})):e.tools.promise((function(i,s){e.websocket.dataPromise("networking.device",{hostname:t,port:o},r,n).then((function(e){i({ipAddress:e.ip,macAddress:e.mac})}),s)}))},algorithm:function(t){if(e.tools.isActive()&&e.tools.isVersion(2,0)){t||e.log.warn("Connected to an older version of QZ, alternate signature algorithms are not supported");return false}return true}},SHA:{hash:function(t){t=e.SHA._utf8Encode(t)+String.fromCharCode(128);var o=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298];var r=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225];var n=t.length/4+2;var i=Math.ceil(n/16);var s=new Array(i);for(var a=0;a<i;a++){s[a]=new Array(16);for(var c=0;c<16;c++)s[a][c]=t.charCodeAt(a*64+c*4)<<24|t.charCodeAt(a*64+c*4+1)<<16|t.charCodeAt(a*64+c*4+2)<<8|t.charCodeAt(a*64+c*4+3)}s[i-1][14]=8*(t.length-1)/Math.pow(2,32);s[i-1][14]=Math.floor(s[i-1][14]);s[i-1][15]=8*(t.length-1)&4294967295;var l=new Array(64);var u,f,d,p,b,g,m,k;for(a=0;a<i;a++){for(var v=0;v<16;v++)l[v]=s[a][v];for(v=16;v<64;v++)l[v]=e.SHA._dev1(l[v-2])+l[v-7]+e.SHA._dev0(l[v-15])+l[v-16]&4294967295;u=r[0];f=r[1];d=r[2];p=r[3];b=r[4];g=r[5];m=r[6];k=r[7];for(v=0;v<64;v++){var h=k+e.SHA._sig1(b)+e.SHA._ch(b,g,m)+o[v]+l[v];var w=e.SHA._sig0(u)+e.SHA._maj(u,f,d);k=m;m=g;g=b;b=p+h&4294967295;p=d;d=f;f=u;u=h+w&4294967295}r[0]=r[0]+u&4294967295;r[1]=r[1]+f&4294967295;r[2]=r[2]+d&4294967295;r[3]=r[3]+p&4294967295;r[4]=r[4]+b&4294967295;r[5]=r[5]+g&4294967295;r[6]=r[6]+m&4294967295;r[7]=r[7]+k&4294967295}return e.SHA._hexStr(r[0])+e.SHA._hexStr(r[1])+e.SHA._hexStr(r[2])+e.SHA._hexStr(r[3])+e.SHA._hexStr(r[4])+e.SHA._hexStr(r[5])+e.SHA._hexStr(r[6])+e.SHA._hexStr(r[7])},_rotr:function(e,t){return t>>>e|t<<32-e},_sig0:function(t){return e.SHA._rotr(2,t)^e.SHA._rotr(13,t)^e.SHA._rotr(22,t)},_sig1:function(t){return e.SHA._rotr(6,t)^e.SHA._rotr(11,t)^e.SHA._rotr(25,t)},_dev0:function(t){return e.SHA._rotr(7,t)^e.SHA._rotr(18,t)^t>>>3},_dev1:function(t){return e.SHA._rotr(17,t)^e.SHA._rotr(19,t)^t>>>10},_ch:function(e,t,o){return e&t^~e&o},_maj:function(e,t,o){return e&t^e&o^t&o},_hexStr:function(e){var t,o="";for(var r=7;r>=0;r--){t=e>>>r*4&15;o+=t.toString(16)}return o},_unescape:function(e){return e.replace(/%(u[\da-f]{4}|[\da-f]{2})/gi,(function(e){if(e.length-1)return String.fromCharCode(parseInt(e.substring(e.length-3?2:1),16));var t=e.charCodeAt(0);return t<256?"%"+(0+t.toString(16)).slice(-2).toUpperCase():"%u"+("000"+t.toString(16)).slice(-4).toUpperCase()}))},_utf8Encode:function(t){return e.SHA._unescape(encodeURIComponent(t))}}};function Config(t,o){this.config=e.tools.extend({},e.printing.defaultConfig);this._dirtyOpts={};
/**
     * Set the printer assigned to this config.
     * @param {string|Object} newPrinter Name of printer. Use object type to specify printing to file or host.
     *  @param {string} [newPrinter.name] Name of printer to send printing.
     *  @param {string} [newPrinter.file] DEPRECATED: Name of file to send printing.
     *  @param {string} [newPrinter.host] IP address or host name to send printing.
     *  @param {string} [newPrinter.port] Port used by &lt;printer.host>.
     */this.setPrinter=function(e){typeof e==="string"&&(e={name:e});this.printer=e};
/**
     *  @returns {Object} The printer currently assigned to this config.
     */this.getPrinter=function(){return this.printer};
/**
     * Alter any of the printer options currently applied to this config.
     * @param newOpts {Object} The options to change. See <code>qz.configs.setDefaults</code> docs for available values.
     *
     * @see qz.configs.setDefaults
     */this.reconfigure=function(t){for(var o in t)t[o]!==void 0&&(this._dirtyOpts[o]=true);e.tools.extend(this.config,t)};
/**
     * @returns {Object} The currently applied options on this config.
     */this.getOptions=function(){return e.compatible.config(this.config,this._dirtyOpts)};this.setPrinter(t);this.reconfigure(o)}
/**
   * Shortcut method for calling <code>qz.print</code> with a particular config.
   * @param {Array<Object|string>} data Array of data being sent to the printer. See <code>qz.print</code> docs for available values.
   * @param {boolean} [signature] Pre-signed signature of JSON string containing <code>call</code>, <code>params</code>, and <code>timestamp</code>.
   * @param {number} [signingTimestamp] Required with <code>signature</code>. Timestamp used with pre-signed content.
   *
   * @example
   * qz.print(myConfig, ...); // OR
   * myConfig.print(...);
   *
   * @see qz.print
   */Config.prototype.print=function(e,t,r){o.print(this,e,t,r)};var o={websocket:{
/**
       * Check connection status. Active connection is necessary for other calls to run.
       *
       * @returns {boolean} If there is an active connection with QZ Tray.
       *
       * @see connect
       *
       * @memberof  qz.websocket
       */
isActive:function(){return e.tools.isActive()},
/**
       * Call to setup connection with QZ Tray on user's system.
       *
       * @param {Object} [options] Configuration options for the web socket connection.
       *  @param {string|Array<string>} [options.host=['localhost', 'localhost.qz.io']] Host running the QZ Tray software.
       *  @param {Object} [options.port] Config options for ports to cycle.
       *   @param {Array<number>} [options.port.secure=[8181, 8282, 8383, 8484]] Array of secure (WSS) ports to try
       *   @param {Array<number>} [options.port.insecure=[8182, 8283, 8384, 8485]] Array of insecure (WS) ports to try
       *  @param {boolean} [options.usingSecure=true] If the web socket should try to use secure ports for connecting.
       *  @param {number} [options.keepAlive=60] Seconds between keep-alive pings to keep connection open. Set to 0 to disable.
       *  @param {number} [options.retries=0] Number of times to reconnect before failing.
       *  @param {number} [options.delay=0] Seconds before firing a connection.  Ignored if <code>options.retries</code> is 0.
       *
       * @returns {Promise<null|Error>}
       *
       * @memberof qz.websocket
       */
connect:function(t){return e.tools.promise((function(o,r){if(e.websocket.connection){const t=e.websocket.connection.readyState;if(t===e.tools.ws.OPEN){r(new Error("An open connection with QZ Tray already exists"));return}if(t===e.tools.ws.CONNECTING){r(new Error("The current connection attempt has not returned yet"));return}if(t===e.tools.ws.CLOSING){r(new Error("Waiting for previous disconnect request to complete"));return}}if(e.tools.ws)if(e.tools.ws.CLOSED&&e.tools.ws.CLOSED!=2){t==void 0&&(t={});if((typeof location==="undefined"||location.protocol!=="https:")&&typeof t.usingSecure==="undefined"){e.log.trace("Disabling secure ports due to insecure page");t.usingSecure=false}typeof t.host==="undefined"||Array.isArray(t.host)||(t.host=[t.host]);e.websocket.shutdown=false;var attempt=function(n){var i=false;var nextAttempt=function(){if(!i){i=true;if(t&&n<t.retries)attempt(n+1);else{e.websocket.connection=null;r.apply(null,arguments)}}};var delayed=function(){var r=e.tools.extend({},e.websocket.connectConfig,t);e.websocket.setup.findConnection(r,o,nextAttempt)};n==0?delayed():setTimeout(delayed,t.delay*1e3)};attempt(0)}else r(new Error("Unsupported WebSocket version detected: HyBi-00/Hixie-76"));else r(new Error("WebSocket not supported by this browser"))}))},
/**
       * Stop any active connection with QZ Tray.
       *
       * @returns {Promise<null|Error>}
       *
       * @memberof qz.websocket
       */
disconnect:function(){return e.tools.promise((function(t,o){if(e.websocket.connection!=null)if(e.tools.isActive()){e.websocket.shutdown=true;e.websocket.connection.promise={resolve:t,reject:o};e.websocket.connection.close()}else o(new Error("Current connection is still closing"));else o(new Error("No open connection with QZ Tray"))}))},
/**
       * List of functions called for any connections errors outside of an API call.<p/>
       * Also called if {@link websocket#connect} fails to connect.
       *
       * @param {Function|Array<Function>} calls Single or array of <code>Function({Event} event)</code> calls.
       *
       * @memberof qz.websocket
       */
setErrorCallbacks:function(t){e.websocket.errorCallbacks=t},
/**
       * List of functions called for any connection closing event outside of an API call.<p/>
       * Also called when {@link websocket#disconnect} is called.
       *
       * @param {Function|Array<Function>} calls Single or array of <code>Function({Event} event)</code> calls.
       *
       * @memberof qz.websocket
       */
setClosedCallbacks:function(t){e.websocket.closedCallbacks=t},
/**
       * @deprecated Since 2.1.0.  Please use qz.networking.device() instead
       *
       * @param {string} [hostname] Hostname to try to connect to when determining network interfaces, defaults to "google.com"
       * @param {number} [port] Port to use with custom hostname, defaults to 443
       * @param {string} [signature] Pre-signed signature of hashed JSON string containing <code>call='websocket.getNetworkInfo'</code>, <code>params</code> object, and <code>timestamp</code>.
       * @param {number} [signingTimestamp] Required with <code>signature</code>. Timestamp used with pre-signed content.
       *
       * @returns {Promise<Object<{ipAddress: string, macAddress: string}>|Error>} Connected system's network information.
       *
       * @memberof qz.websocket
       */
getNetworkInfo:e.compatible.networking,
/**
       * @returns {Object<{socket: String, host: String, port: Number}>} Details of active websocket connection
       *
       * @memberof qz.websocket
       */
getConnectionInfo:function(){if(e.tools.assertActive()){var t=e.websocket.connection.url.split(/[:\/]+/g);return{socket:t[0],host:t[1],port:+t[2]}}}},printers:{
/**
       * @param {string} [signature] Pre-signed signature of hashed JSON string containing <code>call='printers.getDefault</code>, <code>params</code>, and <code>timestamp</code>.
       * @param {number} [signingTimestamp] Required with <code>signature</code>. Timestamp used with pre-signed content.
       *
       * @returns {Promise<string|Error>} Name of the connected system's default printer.
       *
       * @memberof qz.printers
       */
getDefault:function(t,o){return e.websocket.dataPromise("printers.getDefault",null,t,o)},
/**
       * @param {string} [query] Search for a specific printer. All printers are returned if not provided.
       * @param {string} [signature] Pre-signed signature of hashed JSON string containing <code>call='printers.find'</code>, <code>params</code>, and <code>timestamp</code>.
       * @param {number} [signingTimestamp] Required with <code>signature</code>. Timestamp used with pre-signed content.
       *
       * @returns {Promise<Array<string>|string|Error>} The matched printer name if <code>query</code> is provided.
       *                                                Otherwise an array of printer names found on the connected system.
       *
       * @memberof qz.printers
       */
find:function(t,o,r){return e.websocket.dataPromise("printers.find",{query:t},o,r)},
/**
       * Provides a list, with additional information, for each printer available to QZ.
       *
       * @returns {Promise<Array<Object>|Object|Error>}
       *
       * @memberof qz.printers
       */
details:function(){return e.websocket.dataPromise("printers.detail")},
/**
       * Start listening for printer status events, such as paper_jam events.
       * Reported under the ACTION type in the streamEvent on callbacks.
       *
       * @returns {Promise<null|Error>}
       * @since 2.1.0
       *
       * @see qz.printers.setPrinterCallbacks
       *
       * @param {null|string|Array<string>} printers Printer or list of printers to listen to, null listens to all.
       * @param {Object|null} [options] Printer listener options
       *  @param {null|boolean} [options.jobData=false] Flag indicating if raw spool file content should be return as well as status information (Windows only)
       *  @param {null|number} [options.maxJobData=-1] Maximum number of bytes to returns for raw spooled file content (Windows only)
       *  @param {null|string} [options.flavor="plain"] Flavor of data format returned. Valid flavors are <code>[base64 | hex | plain*]</code> (Windows only)
       *
       * @memberof qz.printers
       */
startListening:function(t,o){Array.isArray(t)||(t=[t]);var r={printerNames:t};o&&o.jobData==true&&(r.jobData=true);o&&o.maxJobData&&(r.maxJobData=o.maxJobData);o&&o.flavor&&(r.flavor=o.flavor);return e.websocket.dataPromise("printers.startListening",r)},
/**
       * Clear the queue of a specified printer or printers. Does not delete retained jobs.
       *
       * @param {string|Object} [options] Name of printer to clear
       *  @param {string} [options.printerName] Name of printer to clear
       *  @param {number} [options.jobId] Cancel a job of a specific JobId instead of canceling all. Must include a printerName.
       *
       * @returns {Promise<null|Error>}
       * @since 2.2.4
       *
       * @memberof qz.printers
       */
clearQueue:function(t){typeof t!=="object"&&(t={printerName:t});return e.websocket.dataPromise("printers.clearQueue",t)},
/**
       * Stop listening for printer status actions.
       *
       * @returns {Promise<null|Error>}
       * @since 2.1.0
       *
       * @see qz.printers.setPrinterCallbacks
       *
       * @memberof qz.printers
       */
stopListening:function(){return e.websocket.dataPromise("printers.stopListening")},
/**
       * Retrieve current printer status from any active listeners.
       *
       * @returns {Promise<null|Error>}
       * @since 2.1.0
       *
       * @see qz.printers.startListening
       *
       * @memberof qz.printers
       */
getStatus:function(){return e.websocket.dataPromise("printers.getStatus")},
/**
       * List of functions called for any printer status change.
       * Event data will contain <code>{string} printerName</code> and <code>{string} status</code> for all types.
       *  For RECEIVE types, <code>{Array} output</code> (in hexadecimal format).
       *  For ERROR types, <code>{string} exception</code>.
       *  For ACTION types, <code>{string} actionType</code>.
       *
       * @param {Function|Array<Function>} calls Single or array of <code>Function({Object} eventData)</code> calls.
       * @since 2.1.0
       *
       * @memberof qz.printers
       */
setPrinterCallbacks:function(t){e.printers.printerCallbacks=t}},configs:{
/**
       * Default options used by new configs if not overridden.
       * Setting a value to NULL will use the printer's default options.
       * Updating these will not update the options on any created config.
       *
       * @param {Object} options Default options used by printer configs if not overridden.
       *
       *  @param {Object} [options.bounds=null] Bounding box rectangle.
       *   @param {number} [options.bounds.x=0] Distance from left for bounding box starting corner
       *   @param {number} [options.bounds.y=0] Distance from top for bounding box starting corner
       *   @param {number} [options.bounds.width=0] Width of bounding box
       *   @param {number} [options.bounds.height=0] Height of bounding box
       *  @param {string} [options.colorType='color'] Valid values <code>[color | grayscale | blackwhite | default]</code>
       *  @param {number} [options.copies=1] Number of copies to be printed.
       *  @param {number|Array<number>|Object|Array<Object>|string} [options.density=0] Pixel density (DPI, DPMM, or DPCM depending on <code>[options.units]</code>).
       *      If provided as an array, uses the first supported density found (or the first entry if none found).
       *      If provided as a string, valid values are <code>[best | draft]</code>, corresponding to highest or lowest reported density respectively.
       *  @param {number} [options.density.cross=0] Asymmetric pixel density for the cross feed direction.
       *  @param {number} [options.density.feed=0] Asymmetric pixel density for the feed direction.
       *  @param {boolean|string} [options.duplex=false] Double sided printing, Can specify duplex style by passing a string value: <code>[one-sided | duplex | long-edge | tumble | short-edge]</code>
       *  @param {number} [options.fallbackDensity=null] Value used when default density value cannot be read, or in cases where reported as "Normal" by the driver, (in DPI, DPMM, or DPCM depending on <code>[options.units]</code>).
       *  @param {string} [options.interpolation='bicubic'] Valid values <code>[bicubic | bilinear | nearest-neighbor]</code>. Controls how images are handled when resized.
       *  @param {string} [options.jobName=null] Name to display in print queue.
       *  @param {boolean} [options.legacy=false] If legacy style printing should be used.
       *  @param {Object|number} [options.margins=0] If just a number is provided, it is used as the margin for all sides.
       *   @param {number} [options.margins.top=0]
       *   @param {number} [options.margins.right=0]
       *   @param {number} [options.margins.bottom=0]
       *   @param {number} [options.margins.left=0]
       *  @param {string} [options.orientation=null] Valid values <code>[portrait | landscape | reverse-landscape | null]</code>.
       *                                             If set to <code>null</code>, orientation will be determined automatically.
       *  @param {number} [options.paperThickness=null]
       *  @param {string|number} [options.printerTray=null] Printer tray to pull from. The number N assumes string equivalent of 'Tray N'. Uses printer default if NULL.
       *  @param {boolean} [options.rasterize=false] Whether documents should be rasterized before printing.
       *                                             Specifying <code>[options.density]</code> for PDF print formats will set this to <code>true</code>.
       *  @param {number} [options.rotation=0] Image rotation in degrees.
       *  @param {boolean} [options.scaleContent=true] Scales print content to page size, keeping ratio.
       *  @param {Object} [options.size=null] Paper size.
       *   @param {number} [options.size.width=null] Page width.
       *   @param {number} [options.size.height=null] Page height.
       *  @param {string} [options.units='in'] Page units, applies to paper size, margins, and density. Valid value <code>[in | cm | mm]</code>
       *
       *  @param {boolean} [options.forceRaw=false] Print the specified raw data using direct method, skipping the driver.  Not yet supported on Windows.
       *  @param {string|Object} [options.encoding=null] Character set for commands. Can be provided as an object for converting encoding types for RAW types.
       *   @param {string} [options.encoding.from] If this encoding type is provided, RAW type commands will be parsed from this for the purpose of being converted to the <code>encoding.to</code> value.
       *   @param {string} [options.encoding.to] Encoding RAW type commands will be converted into. If <Code>encoding.from</code> is not provided, this will be treated as if a string was passed for encoding.
       *  @param {string} [options.endOfDoc=null] DEPRECATED Raw only: Character(s) denoting end of a page to control spooling.
       *  @param {number} [options.perSpool=1] DEPRECATED: Raw only: Number of pages per spool.
       *  @param {boolean} [options.retainTemp=false] Retain any temporary files used.  Ignored unless <code>forceRaw</code> <code>true</code>.
       *  @param {Object} [options.spool=null] Advanced spooling options.
       *   @param {number} [options.spool.size=null] Number of pages per spool.  Default is no limit.  If <code>spool.end</code> is provided, defaults to <code>1</code>
       *   @param {string} [options.spool.end=null] Raw only: Character(s) denoting end of a page to control spooling.
       *
       * @memberof qz.configs
       */
setDefaults:function(t){e.tools.extend(e.printing.defaultConfig,t)},
/**
       * Creates new printer config to be used in printing.
       *
       * @param {string|object} printer Name of printer. Use object type to specify printing to file or host.
       *  @param {string} [printer.name] Name of printer to send printing.
       *  @param {string} [printer.file] Name of file to send printing.
       *  @param {string} [printer.host] IP address or host name to send printing.
       *  @param {string} [printer.port] Port used by &lt;printer.host>.
       * @param {Object} [options] Override any of the default options for this config only.
       *
       * @returns {Config} The new config.
       *
       * @see configs.setDefaults
       *
       * @memberof qz.configs
       */
create:function(e,t){return new Config(e,t)}},
/**
     * Send data to selected config for printing.
     * The promise for this method will resolve when the document has been sent to the printer. Actual printing may not be complete.
     * <p/>
     * Optionally, print requests can be pre-signed:
     * Signed content consists of a JSON object string containing no spacing,
     * following the format of the "call" and "params" keys in the API call, with the addition of a "timestamp" key in milliseconds
     * ex. <code>'{"call":"<callName>","params":{...},"timestamp":1450000000}'</code>
     *
     * @param {Object<Config>|Array<Object<Config>>} configs Previously created config object or objects.
     * @param {Array<Object|string>|Array<Array<Object|string>>} data Array of data being sent to the printer.<br/>
     *      String values are interpreted as <code>{type: 'raw', format: 'command', flavor: 'plain', data: &lt;string>}</code>.
     *  @param {string} data.data
     *  @param {string} data.type Printing type. Valid types are <code>[pixel | raw*]</code>. *Default
     *  @param {string} data.format Format of data type used. *Default per type<p/>
     *      For <code>[pixel]</code> types, valid formats are <code>[html | image* | pdf]</code>.<p/>
     *      For <code>[raw]</code> types, valid formats are <code>[command* | html | image | pdf]</code>.
     *  @param {string} data.flavor Flavor of data format used. *Default per format<p/>
     *      For <code>[command]</code> formats, valid flavors are <code>[base64 | file | hex | plain* | xml]</code>.<p/>
     *      For <code>[html]</code> formats, valid flavors are <code>[file* | plain]</code>.<p/>
     *      For <code>[image]</code> formats, valid flavors are <code>[base64 | file*]</code>.<p/>
     *      For <code>[pdf]</code> formats, valid flavors are <code>[base64 | file*]</code>.
     *  @param {Object} [data.options]
     *   @param {string} [data.options.language] Required with <code>[raw]</code> type + <code>[image]</code> format. Printer language.
     *   @param {number} [data.options.x] Optional with <code>[raw]</code> type + <code>[image]</code> format. The X position of the image.
     *   @param {number} [data.options.y] Optional with <code>[raw]</code> type + <code>[image]</code> format. The Y position of the image.
     *   @param {string|number} [data.options.dotDensity] Optional with <code>[raw]</code> type + <code>[image]</code> format.
     *   @param {number} [data.precision=128] Optional with <code>[raw]</code> type <code>[image]</code> format. Bit precision of the ribbons.
     *   @param {boolean|string|Array<Array<number>>} [data.options.overlay=false] Optional with <code>[raw]</code> type <code>[image]</code> format.
     *       Boolean sets entire layer, string sets mask image, Array sets array of rectangles in format <code>[x1,y1,x2,y2]</code>.
     *   @param {string} [data.options.xmlTag] Required with <code>[xml]</code> flavor. Tag name containing base64 formatted data.
     *   @param {number} [data.options.pageWidth] Optional with <code>[html | pdf]</code> formats. Width of the rendering.
     *       Defaults to paper width.
     *   @param {number} [data.options.pageHeight] Optional with <code>[html | pdf]</code> formats. Height of the rendering.
     *       Defaults to paper height for <code>[pdf]</code>, or auto sized for <code>[html]</code>.
     *   @param {string} [data.options.pageRanges] Optional with <code>[pdf]</code> formats. Comma-separated list of page ranges to include.
     *   @param {boolean} [data.options.ignoreTransparency=false] Optional with <code>[pdf]</code> formats. Instructs transparent PDF elements to be ignored.
     *       Transparent PDF elements are known to degrade performance and quality when printing.
     *   @param {boolean} [data.options.altFontRendering=false] Optional with <code>[pdf]</code> formats. Instructs PDF to be rendered using PDFBOX 1.8 techniques.
     *       Drastically improves low-DPI PDF print quality on Windows.
     * @param {...*} [arguments] Additionally three more parameters can be specified:<p/>
     *     <code>{boolean} [resumeOnError=false]</code> Whether the chain should continue printing if it hits an error on one the the prints.<p/>
     *     <code>{string|Array<string>} [signature]</code> Pre-signed signature(s) of the JSON string for containing <code>call</code>, <code>params</code>, and <code>timestamp</code>.<p/>
     *     <code>{number|Array<number>} [signingTimestamps]</code> Required to match with <code>signature</code>. Timestamps for each of the passed pre-signed content.
     *
     * @returns {Promise<null|Error>}
     *
     * @see qz.configs.create
     *
     * @memberof qz
     */
print:function(t,o){var r=false,n=[],i=[];if(arguments.length>=3){if(typeof arguments[2]==="boolean"){r=arguments[2];if(arguments.length>=5){n=arguments[3];i=arguments[4]}}else if(arguments.length>=4){n=arguments[2];i=arguments[3]}n&&!Array.isArray(n)&&(n=[n]);i&&!Array.isArray(i)&&(i=[i])}Array.isArray(t)||(t=[t]);Array.isArray(o[0])||(o=[o]);for(var s=0;s<o.length;s++){e.tools.relative(o[s]);e.compatible.data(o[s])}var sendToPrint=function(t){var o={printer:t.config.getPrinter(),options:t.config.getOptions(),data:t.data};return e.websocket.dataPromise("print",o,t.signature,t.timestamp)};var a=[];for(var c=0;c<t.length||c<o.length;c++)(function(e){var r={config:t[Math.min(e,t.length-1)],data:o[Math.min(e,o.length-1)],signature:n[e],timestamp:i[e]};a.push((function(){return sendToPrint(r)}))})(c);var l=null;if(r){var u=[];l=function(e){u.push(e)};a.push((function(){return e.tools.promise((function(e,t){u.length?t(u):e()}))}))}var f=null;a.reduce((function(e,t){f=e.catch(l).then(t);return f}),e.tools.promise((function(e){e()})));return f},serial:{
/**
       * @returns {Promise<Array<string>|Error>} Communication (RS232, COM, TTY) ports available on connected system.
       *
       * @memberof qz.serial
       */
findPorts:function(){return e.websocket.dataPromise("serial.findPorts")},
/**
       * List of functions called for any response from open serial ports.
       * Event data will contain <code>{string} portName</code> for all types.
       *  For RECEIVE types, <code>{string} output</code>.
       *  For ERROR types, <code>{string} exception</code>.
       *
       * @param {Function|Array<Function>} calls Single or array of <code>Function({object} streamEvent)</code> calls.
       *
       * @memberof qz.serial
       */
setSerialCallbacks:function(t){e.serial.serialCallbacks=t},
/**
       * Opens a serial port for sending and receiving data
       *
       * @param {string} port Name of serial port to open.
       * @param {Object} [options] Serial port configurations.
       *  @param {number} [options.baudRate=9600] Serial port speed. Set to 0 for auto negotiation.
       *  @param {number} [options.dataBits=8] Serial port data bits. Set to 0 for auto negotiation.
       *  @param {number} [options.stopBits=1] Serial port stop bits. Set to 0 for auto negotiation.
       *  @param {string} [options.parity='NONE'] Serial port parity. Set to AUTO for auto negotiation. Valid values <code>[NONE | EVEN | ODD | MARK | SPACE | AUTO]</code>
       *  @param {string} [options.flowControl='NONE'] Serial port flow control. Set to AUTO for auto negotiation. Valid values <code>[NONE | XONXOFF | XONXOFF_OUT | XONXOFF_IN | RTSCTS | RTSCTS_OUT | RTSCTS_IN | AUTO]</code>
       *  @param {string} [options.encoding='UTF-8'] Character set for communications.
       *  @param {string} [options.start=0x0002] DEPRECATED: Legacy character denoting start of serial response. Use <code>options.rx.start</code> instead.
       *  @param {string} [options.end=0x000D] DEPRECATED: Legacy character denoting end of serial response. Use <code>options.rx.end</code> instead.
       *  @param {number} [options.width] DEPRECATED: Legacy use for fixed-width response serial communication. Use <code>options.rx.width</code> instead.
       *  @param {Object} [options.rx] Serial communications response definitions. If an object is passed but no options are defined, all response data will be sent back as it is received unprocessed.
       *   @param {string|Array<string>} [options.rx.start] Character(s) denoting start of response bytes. Used in conjunction with `end`, `width`, or `lengthbit` property.
       *   @param {string} [options.rx.end] Character denoting end of response bytes. Used in conjunction with `start` property.
       *   @param {number} [options.rx.width] Fixed width size of response bytes (not including header if `start` is set). Used alone or in conjunction with `start` property.
       *   @param {boolean} [options.rx.untilNewline] Returns data between newline characters (`\n` or `\r`) Truncates empty responses.  Overrides `start`, `end`, `width`.
       *   @param {number|Object} [options.rx.lengthBytes] If a number is passed it is treated as the length index. Other values are left as their defaults.
       *    @param {number} [options.rx.lengthBytes.index=0] Position of the response byte (not including response `start` bytes) used to denote the length of the remaining response data.
       *    @param {number} [options.rx.lengthBytes.length=1] Length of response length bytes after response header.
       *    @param {string} [options.rx.lengthBytes.endian='BIG'] Byte endian for multi-byte length values. Valid values <code>[BIG | LITTLE]</code>
       *   @param {number|Object} [options.rx.crcBytes] If a number is passed it is treated as the crc length. Other values are left as their defaults.
       *    @param {number} [options.rx.crcBytes.index=0] Position after the response data (not including length or data bytes) used to denote the crc.
       *    @param {number} [options.rx.crcBytes.length=1] Length of response crc bytes after the response data length.
       *   @param {boolean} [options.rx.includeHeader=false] Whether any of the header bytes (`start` bytes and any length bytes) should be included in the processed response.
       *   @param {string} [options.rx.encoding] Override the encoding used for response data. Uses the same value as <code>options.encoding</code> otherwise.
       *
       * @returns {Promise<null|Error>}
       *
       * @memberof qz.serial
       */
openPort:function(t,o){var r={port:t,options:o};return e.websocket.dataPromise("serial.openPort",r)},
/**
       * Send commands over a serial port.
       * Any responses from the device will be sent to serial callback functions.
       *
       * @param {string} port An open serial port to send data.
       * @param {string|Array<string>|Object} data Data to be sent to the serial device.
       *  @param {string} [data.type='PLAIN'] Valid values <code>[FILE | PLAIN | HEX | BASE64]</code>
       *  @param {string|Array<string>} data.data Data to be sent to the serial device.
       * @param {Object} options Serial port configuration updates. See <code>qz.serial.openPort</code> `options` docs for available values.
       *     For best performance, it is recommended to only set these values on the port open call.
       *
       * @returns {Promise<null|Error>}
       *
       * @see qz.serial.setSerialCallbacks
       *
       * @memberof qz.serial
       */
sendData:function(t,o,r){if(e.tools.versionCompare(2,1,0,12)>=0){typeof o!=="object"&&(o={data:o,type:"PLAIN"});o.type&&o.type.toUpperCase()=="FILE"&&(o.data=e.tools.absolute(o.data))}var n={port:t,data:o,options:r};return e.websocket.dataPromise("serial.sendData",n)},
/**
       * @param {string} port Name of port to close.
       *
       * @returns {Promise<null|Error>}
       *
       * @memberof qz.serial
       */
closePort:function(t){return e.websocket.dataPromise("serial.closePort",{port:t})}},socket:{
/**
       * Opens a network port for sending and receiving data.
       *
       * @param {string} host The connection hostname.
       * @param {number} port The connection port number.
       * @param {Object} [options] Network socket configuration.
       *  @param {string} [options.encoding='UTF-8'] Character set for communications.
       *
       * @memberof qz.socket
       */
open:function(t,o,r){var n={host:t,port:o,options:r};return e.websocket.dataPromise("socket.open",n)},
/**
       * @param {string} host The connection hostname.
       * @param {number} port The connection port number.
       *
       * @memberof qz.socket
       */
close:function(t,o){var r={host:t,port:o};return e.websocket.dataPromise("socket.close",r)},
/**
       * Send data over an open socket.
       *
       * @param {string} host The connection hostname.
       * @param {number} port The connection port number.
       * @param {string|Object} data Data to be sent over the port.
       *  @param {string} [data.type='PLAIN'] Valid values <code>[PLAIN]</code>
       *  @param {string} data.data Data to be sent over the port.
       *
       * @memberof qz.socket
       */
sendData:function(t,o,r){typeof r!=="object"&&(r={data:r,type:"PLAIN"});var n={host:t,port:o,data:r};return e.websocket.dataPromise("socket.sendData",n)},
/**
       * List of functions called for any response from open network sockets.
       * Event data will contain <code>{string} host</code> and <code>{number} port</code> for all types.
       *  For RECEIVE types, <code>{string} response</code>.
       *  For ERROR types, <code>{string} exception</code>.
       *
       * @param {Function|Array<Function>} calls Single or array of <code>Function({Object} eventData)</code> calls.
       *
       * @memberof qz.socket
       */
setSocketCallbacks:function(t){e.socket.socketCallbacks=t}},usb:{
/**
       * List of available USB devices. Includes (hexadecimal) vendor ID, (hexadecimal) product ID, and hub status.
       * If supported, also returns manufacturer and product descriptions.
       *
       * @param includeHubs Whether to include USB hubs.
       * @returns {Promise<Array<Object>|Error>} Array of JSON objects containing information on connected USB devices.
       *
       * @memberof qz.usb
       */
listDevices:function(t){return e.websocket.dataPromise("usb.listDevices",{includeHubs:t})},
/**
       * @param {object} deviceInfo Config details of the HID device.
       *  @param deviceInfo.vendorId Hex string of USB device's vendor ID.
       *  @param deviceInfo.productId Hex string of USB device's product ID.
       * @returns {Promise<Array<string>|Error>} List of available (hexadecimal) interfaces on a USB device.
       *
       * @memberof qz.usb
       */
listInterfaces:function(t){typeof t!=="object"&&(t={vendorId:arguments[0],productId:arguments[1]});return e.websocket.dataPromise("usb.listInterfaces",t)},
/**
       * @param {object} deviceInfo Config details of the HID device.
       *  @param deviceInfo.vendorId Hex string of USB device's vendor ID.
       *  @param deviceInfo.productId Hex string of USB device's product ID.
       *  @param deviceInfo.iface Hex string of interface on the USB device to search.
       * @returns {Promise<Array<string>|Error>} List of available (hexadecimal) endpoints on a USB device's interface.
       *
       * @memberof qz.usb
       */
listEndpoints:function(t){typeof t!=="object"&&(t={vendorId:arguments[0],productId:arguments[1],interface:arguments[2]});return e.websocket.dataPromise("usb.listEndpoints",t)},
/**
       * List of functions called for any response from open usb devices.
       * Event data will contain <code>{string} vendorId</code> and <code>{string} productId</code> for all types.
       *  For RECEIVE types, <code>{Array} output</code> (in hexadecimal format).
       *  For ERROR types, <code>{string} exception</code>.
       *
       * @param {Function|Array<Function>} calls Single or array of <code>Function({Object} eventData)</code> calls.
       *
       * @memberof qz.usb
       */
setUsbCallbacks:function(t){e.usb.usbCallbacks=t},
/**
       * Claim a USB device's interface to enable sending/reading data across an endpoint.
       *
       * @param {object} deviceInfo Config details of the HID device.
       *  @param deviceInfo.vendorId Hex string of USB device's vendor ID.
       *  @param deviceInfo.productId Hex string of USB device's product ID.
       *  @param deviceInfo.interface Hex string of interface on the USB device to claim.
       * @returns {Promise<null|Error>}
       *
       * @memberof qz.usb
       */
claimDevice:function(t){typeof t!=="object"&&(t={vendorId:arguments[0],productId:arguments[1],interface:arguments[2]});return e.websocket.dataPromise("usb.claimDevice",t)},
/**
       * Check the current claim state of a USB device.
       *
       * @param {object} deviceInfo Config details of the HID device.
       *  @param deviceInfo.vendorId Hex string of USB device's vendor ID.
       *  @param deviceInfo.productId Hex string of USB device's product ID.
       * @returns {Promise<boolean|Error>}
       *
       * @since 2.0.2
       * @memberOf qz.usb
       */
isClaimed:function(t){typeof t!=="object"&&(t={vendorId:arguments[0],productId:arguments[1]});return e.websocket.dataPromise("usb.isClaimed",t)},
/**
       * Send data to a claimed USB device.
       *
       * @param {object} deviceInfo Config details of the HID device.
       *  @param deviceInfo.vendorId Hex string of USB device's vendor ID.
       *  @param deviceInfo.productId Hex string of USB device's product ID.
       *  @param deviceInfo.endpoint Hex string of endpoint on the claimed interface for the USB device.
       *  @param deviceInfo.data Bytes to send over specified endpoint.
       *  @param {string} [deviceInfo.type='PLAIN'] Valid values <code>[FILE | PLAIN | HEX | BASE64]</code>
       * @returns {Promise<null|Error>}
       *
       * @memberof qz.usb
       */
sendData:function(t){typeof t!=="object"&&(t={vendorId:arguments[0],productId:arguments[1],endpoint:arguments[2],data:arguments[3]});if(e.tools.versionCompare(2,1,0,12)>=0){typeof t.data!=="object"&&(t.data={data:t.data,type:"PLAIN"});t.data.type&&t.data.type.toUpperCase()=="FILE"&&(t.data.data=e.tools.absolute(t.data.data))}return e.websocket.dataPromise("usb.sendData",t)},
/**
       * Read data from a claimed USB device.
       *
       * @param {object} deviceInfo Config details of the HID device.
       *  @param deviceInfo.vendorId Hex string of USB device's vendor ID.
       *  @param deviceInfo.productId Hex string of USB device's product ID.
       *  @param deviceInfo.endpoint Hex string of endpoint on the claimed interface for the USB device.
       *  @param deviceInfo.responseSize Size of the byte array to receive a response in.
       * @returns {Promise<Array<string>|Error>} List of (hexadecimal) bytes received from the USB device.
       *
       * @memberof qz.usb
       */
readData:function(t){typeof t!=="object"&&(t={vendorId:arguments[0],productId:arguments[1],endpoint:arguments[2],responseSize:arguments[3]});return e.websocket.dataPromise("usb.readData",t)},
/**
       * Provides a continuous stream of read data from a claimed USB device.
       *
       * @param {object} deviceInfo Config details of the HID device.
       *  @param deviceInfo.vendorId Hex string of USB device's vendor ID.
       *  @param deviceInfo.productId Hex string of USB device's product ID.
       *  @param deviceInfo.endpoint Hex string of endpoint on the claimed interface for the USB device.
       *  @param deviceInfo.responseSize Size of the byte array to receive a response in.
       *  @param deviceInfo.interval=100 Frequency to send read data back, in milliseconds.
       * @returns {Promise<null|Error>}
       *
       * @see qz.usb.setUsbCallbacks
       *
       * @memberof qz.usb
       */
openStream:function(t){typeof t!=="object"&&(t={vendorId:arguments[0],productId:arguments[1],endpoint:arguments[2],responseSize:arguments[3],interval:arguments[4]});return e.websocket.dataPromise("usb.openStream",t)},
/**
       * Stops the stream of read data from a claimed USB device.
       *
       * @param {object} deviceInfo Config details of the HID device.
       *  @param deviceInfo.vendorId Hex string of USB device's vendor ID.
       *  @param deviceInfo.productId Hex string of USB device's product ID.
       *  @param deviceInfo.endpoint Hex string of endpoint on the claimed interface for the USB device.
       * @returns {Promise<null|Error>}
       *
       * @memberof qz.usb
       */
closeStream:function(t){typeof t!=="object"&&(t={vendorId:arguments[0],productId:arguments[1],endpoint:arguments[2]});return e.websocket.dataPromise("usb.closeStream",t)},
/**
       * Release a claimed USB device to free resources after sending/reading data.
       *
       * @param {object} deviceInfo Config details of the HID device.
       *  @param deviceInfo.vendorId Hex string of USB device's vendor ID.
       *  @param deviceInfo.productId Hex string of USB device's product ID.
       * @returns {Promise<null|Error>}
       *
       * @memberof qz.usb
       */
releaseDevice:function(t){typeof t!=="object"&&(t={vendorId:arguments[0],productId:arguments[1]});return e.websocket.dataPromise("usb.releaseDevice",t)}},hid:{
/**
       * List of available HID devices. Includes (hexadecimal) vendor ID and (hexadecimal) product ID.
       * If available, also returns manufacturer and product descriptions.
       *
       * @returns {Promise<Array<Object>|Error>} Array of JSON objects containing information on connected HID devices.
       * @since 2.0.1
       *
       * @memberof qz.hid
       */
listDevices:function(){return e.websocket.dataPromise("hid.listDevices")},
/**
       * Start listening for HID device actions, such as attach / detach events.
       * Reported under the ACTION type in the streamEvent on callbacks.
       *
       * @returns {Promise<null|Error>}
       * @since 2.0.1
       *
       * @see qz.hid.setHidCallbacks
       *
       * @memberof qz.hid
       */
startListening:function(){return e.websocket.dataPromise("hid.startListening")},
/**
       * Stop listening for HID device actions.
       *
       * @returns {Promise<null|Error>}
       * @since 2.0.1
       *
       * @see qz.hid.setHidCallbacks
       *
       * @memberof qz.hid
       */
stopListening:function(){return e.websocket.dataPromise("hid.stopListening")},
/**
       * List of functions called for any response from open usb devices.
       * Event data will contain <code>{string} vendorId</code> and <code>{string} productId</code> for all types.
       *  For RECEIVE types, <code>{Array} output</code> (in hexadecimal format).
       *  For ERROR types, <code>{string} exception</code>.
       *  For ACTION types, <code>{string} actionType</code>.
       *
       * @param {Function|Array<Function>} calls Single or array of <code>Function({Object} eventData)</code> calls.
       * @since 2.0.1
       *
       * @memberof qz.hid
       */
setHidCallbacks:function(t){e.hid.hidCallbacks=t},
/**
       * Claim a HID device to enable sending/reading data across.
       *
       * @param {object} deviceInfo Config details of the HID device.
       *  @param deviceInfo.vendorId Hex string of HID device's vendor ID.
       *  @param deviceInfo.productId Hex string of HID device's product ID.
       *  @param deviceInfo.usagePage Hex string of HID device's usage page when multiple are present.
       *  @param deviceInfo.serial Serial ID of HID device.
       * @returns {Promise<null|Error>}
       * @since 2.0.1
       *
       * @memberof qz.hid
       */
claimDevice:function(t){typeof t!=="object"&&(t={vendorId:arguments[0],productId:arguments[1]});return e.websocket.dataPromise("hid.claimDevice",t)},
/**
       * Check the current claim state of a HID device.
       *
       * @param {object} deviceInfo Config details of the HID device.
       *  @param deviceInfo.vendorId Hex string of HID device's vendor ID.
       *  @param deviceInfo.productId Hex string of HID device's product ID.
       *  @param deviceInfo.usagePage Hex string of HID device's usage page when multiple are present.
       *  @param deviceInfo.serial Serial ID of HID device.
       * @returns {Promise<boolean|Error>}
       *
       * @since 2.0.2
       * @memberOf qz.hid
       */
isClaimed:function(t){typeof t!=="object"&&(t={vendorId:arguments[0],productId:arguments[1]});return e.websocket.dataPromise("hid.isClaimed",t)},
/**
       * Send data to a claimed HID device.
       *
       * @param {object} deviceInfo Config details of the HID device.
       *  @param deviceInfo.vendorId Hex string of HID device's vendor ID.
       *  @param deviceInfo.productId Hex string of HID device's product ID.
       *  @param deviceInfo.usagePage Hex string of HID device's usage page when multiple are present.
       *  @param deviceInfo.serial Serial ID of HID device.
       *  @param deviceInfo.data Bytes to send over specified endpoint.
       *  @param deviceInfo.endpoint=0x00 First byte of the data packet signifying the HID report ID.
       *                             Must be 0x00 for devices only supporting a single report.
       *  @param deviceInfo.reportId=0x00 Alias for <code>deviceInfo.endpoint</code>. Not used if endpoint is provided.
       *  @param {string} [deviceInfo.type='PLAIN'] Valid values <code>[FILE | PLAIN | HEX | BASE64]</code>
       * @returns {Promise<null|Error>}
       * @since 2.0.1
       *
       * @memberof qz.hid
       */
sendData:function(t){typeof t!=="object"&&(t={vendorId:arguments[0],productId:arguments[1],data:arguments[2],endpoint:arguments[3]});if(e.tools.versionCompare(2,1,0,12)>=0){typeof t.data!=="object"&&(t.data={data:t.data,type:"PLAIN"});t.data.type&&t.data.type.toUpperCase()=="FILE"&&(t.data.data=e.tools.absolute(t.data.data))}else if(typeof t.data==="object"){if(t.data.type.toUpperCase()!=="PLAIN"||typeof t.data.data!=="string")return e.tools.reject(new Error("Data format is not supported with connected QZ Tray version "+e.websocket.connection.version));t.data=t.data.data}return e.websocket.dataPromise("hid.sendData",t)},
/**
       * Read data from a claimed HID device.
       *
       * @param {object} deviceInfo Config details of the HID device.
       *  @param deviceInfo.vendorId Hex string of HID device's vendor ID.
       *  @param deviceInfo.productId Hex string of HID device's product ID.
       *  @param deviceInfo.usagePage Hex string of HID device's usage page when multiple are present.
       *  @param deviceInfo.serial Serial ID of HID device.
       *  @param deviceInfo.responseSize Size of the byte array to receive a response in.
       * @returns {Promise<Array<string>|Error>} List of (hexadecimal) bytes received from the HID device.
       * @since 2.0.1
       *
       * @memberof qz.hid
       */
readData:function(t){typeof t!=="object"&&(t={vendorId:arguments[0],productId:arguments[1],responseSize:arguments[2]});return e.websocket.dataPromise("hid.readData",t)},
/**
       * Send a feature report to a claimed HID device.
       *
       * @param {object} deviceInfo Config details of the HID device.
       *  @param deviceInfo.vendorId Hex string of HID device's vendor ID.
       *  @param deviceInfo.productId Hex string of HID device's product ID.
       *  @param deviceInfo.usagePage Hex string of HID device's usage page when multiple are present.
       *  @param deviceInfo.serial Serial ID of HID device.
       *  @param deviceInfo.data Bytes to send over specified endpoint.
       *  @param deviceInfo.endpoint=0x00 First byte of the data packet signifying the HID report ID.
       *                             Must be 0x00 for devices only supporting a single report.
       *  @param deviceInfo.reportId=0x00 Alias for <code>deviceInfo.endpoint</code>. Not used if endpoint is provided.
       *  @param {string} [deviceInfo.type='PLAIN'] Valid values <code>[FILE | PLAIN | HEX | BASE64]</code>
       * @returns {Promise<null|Error>}
       *
       * @memberof qz.hid
       */
sendFeatureReport:function(t){return e.websocket.dataPromise("hid.sendFeatureReport",t)},
/**
       * Get a feature report from a claimed HID device.
       *
       * @param {object} deviceInfo Config details of the HID device.
       *  @param deviceInfo.vendorId Hex string of HID device's vendor ID.
       *  @param deviceInfo.productId Hex string of HID device's product ID.
       *  @param deviceInfo.usagePage Hex string of HID device's usage page when multiple are present.
       *  @param deviceInfo.serial Serial ID of HID device.
       *  @param deviceInfo.responseSize Size of the byte array to receive a response in.
       * @returns {Promise<Array<string>|Error>} List of (hexadecimal) bytes received from the HID device.
       *
       * @memberof qz.hid
       */
getFeatureReport:function(t){return e.websocket.dataPromise("hid.getFeatureReport",t)},
/**
       * Provides a continuous stream of read data from a claimed HID device.
       *
       * @param {object} deviceInfo Config details of the HID device.
       *  @param deviceInfo.vendorId Hex string of HID device's vendor ID.
       *  @param deviceInfo.productId Hex string of HID device's product ID.
       *  @param deviceInfo.usagePage Hex string of HID device's usage page when multiple are present.
       *  @param deviceInfo.serial Serial ID of HID device.
       *  @param deviceInfo.responseSize Size of the byte array to receive a response in.
       *  @param deviceInfo.interval=100 Frequency to send read data back, in milliseconds.
       * @returns {Promise<null|Error>}
       * @since 2.0.1
       *
       * @see qz.hid.setHidCallbacks
       *
       * @memberof qz.hid
       */
openStream:function(t){typeof t!=="object"&&(t={vendorId:arguments[0],productId:arguments[1],responseSize:arguments[2],interval:arguments[3]});return e.websocket.dataPromise("hid.openStream",t)},
/**
       * Stops the stream of read data from a claimed HID device.
       *
       * @param {object} deviceInfo Config details of the HID device.
       *  @param deviceInfo.vendorId Hex string of HID device's vendor ID.
       *  @param deviceInfo.productId Hex string of HID device's product ID.
       *  @param deviceInfo.usagePage Hex string of HID device's usage page when multiple are present.
       *  @param deviceInfo.serial Serial ID of HID device.
       * @returns {Promise<null|Error>}
       * @since 2.0.1
       *
       * @memberof qz.hid
       */
closeStream:function(t){typeof t!=="object"&&(t={vendorId:arguments[0],productId:arguments[1]});return e.websocket.dataPromise("hid.closeStream",t)},
/**
       * Release a claimed HID device to free resources after sending/reading data.
       *
       * @param {object} deviceInfo Config details of the HID device.
       *  @param deviceInfo.vendorId Hex string of HID device's vendor ID.
       *  @param deviceInfo.productId Hex string of HID device's product ID.
       *  @param deviceInfo.usagePage Hex string of HID device's usage page when multiple are present.
       *  @param deviceInfo.serial Serial ID of HID device.
       * @returns {Promise<null|Error>}
       * @since 2.0.1
       *
       * @memberof qz.hid
       */
releaseDevice:function(t){typeof t!=="object"&&(t={vendorId:arguments[0],productId:arguments[1]});return e.websocket.dataPromise("hid.releaseDevice",t)}},file:{
/**
       * List of files available at the given directory.<br/>
       * Due to security reasons, paths are limited to the qz data directory unless overridden via properties file.
       *
       * @param {string} path Relative or absolute directory path. Must reside in qz data directory or a white-listed location.
       * @param {Object} [params] Object containing file access parameters
       *  @param {boolean} [params.sandbox=true] If relative location from root is only available to the certificate's connection, otherwise all connections
       *  @param {boolean} [params.shared=true] If relative location from root is accessible to all users on the system, otherwise just the current user
       * @returns {Promise<Array<String>|Error>} Array of files at the given path
       *
       * @memberof qz.file
       */
list:function(t,o){var r=e.tools.extend({path:t},o);return e.websocket.dataPromise("file.list",r)},
/**
       * Reads contents of file at the given path.<br/>
       * Due to security reasons, paths are limited to the qz data directory unless overridden via properties file.
       *
       * @param {string} path Relative or absolute file path. Must reside in qz data directory or a white-listed location.
       * @param {Object} [params] Object containing file access parameters
       *  @param {boolean} [params.sandbox=true] If relative location from root is only available to the certificate's connection, otherwise all connections
       *  @param {boolean} [params.shared=true] If relative location from root is accessible to all users on the system, otherwise just the current user
       *  @param {string} [params.flavor='plain'] Flavor of data format used, valid flavors are <code>[base64 | hex | plain]</code>.
       * @returns {Promise<String|Error>} String containing the file contents
       *
       * @memberof qz.file
       */
read:function(t,o){var r=e.tools.extend({path:t},o);return e.websocket.dataPromise("file.read",r)},
/**
       * Writes data to the file at the given path.<br/>
       * Due to security reasons, paths are limited to the qz data directory unless overridden via properties file.
       *
       * @param {string} path Relative or absolute file path. Must reside in qz data directory or a white-listed location.
       * @param {Object} params Object containing file access parameters
       *  @param {string} params.data File data to be written
       *  @param {boolean} [params.sandbox=true] If relative location from root is only available to the certificate's connection, otherwise all connections
       *  @param {boolean} [params.shared=true] If relative location from root is accessible to all users on the system, otherwise just the current user
       *  @param {boolean} [params.append=false] Appends to the end of the file if set, otherwise overwrites existing contents
       *  @param {string} [params.flavor='plain'] Flavor of data format used, valid flavors are <code>[base64 | file | hex | plain]</code>.
       * @returns {Promise<null|Error>}
       *
       * @memberof qz.file
       */
write:function(t,o){var r=e.tools.extend({path:t},o);return e.websocket.dataPromise("file.write",r)},
/**
       * Deletes a file at given path.<br/>
       * Due to security reasons, paths are limited to the qz data directory unless overridden via properties file.
       *
       * @param {string} path Relative or absolute file path. Must reside in qz data directory or a white-listed location.
       * @param {Object} [params] Object containing file access parameters
       *  @param {boolean} [params.sandbox=true] If relative location from root is only available to the certificate's connection, otherwise all connections
       *  @param {boolean} [params.shared=true] If relative location from root is accessible to all users on the system, otherwise just the current user
       * @returns {Promise<null|Error>}
       *
       * @memberof qz.file
       */
remove:function(t,o){var r=e.tools.extend({path:t},o);return e.websocket.dataPromise("file.remove",r)},
/**
       * Provides a continuous stream of events (and optionally data) from a local file.
       *
       * @param {string} path Relative or absolute directory path. Must reside in qz data directory or a white-listed location.
       * @param {Object} [params] Object containing file access parameters
       *  @param {boolean} [params.sandbox=true] If relative location from root is only available to the certificate's connection, otherwise all connections
       *  @param {boolean} [params.shared=true] If relative location from root is accessible to all users on the system, otherwise just the current user
       *  @param {Object} [params.listener] If defined, file data will be returned on events
       *   @param {number} [params.listener.bytes=-1] Number of bytes to return or -1 for all
       *   @param {number} [params.listener.lines=-1] Number of lines to return or -1 for all
       *   @param {boolean} [params.listener.reverse] Controls whether data should be returned from the bottom of the file.  Default value is true for line mode and false for byte mode.
       *   @param {string|Array<string>} [params.include] File patterns to match.  Blank values will be ignored.
       *   @param {string|Array<string>} [params.exclude] File patterns to exclude.  Blank values will be ignored.  Takes priority over <code>params.include</code>.
       *   @param {boolean} [params.ignoreCase=true] Whether <code>params.include</code> or <code>params.exclude</code> are case-sensitive.
       * @returns {Promise<null|Error>}
       * @since 2.1.0
       *
       * @see qz.file.setFileCallbacks
       *
       * @memberof qz.file
       */
startListening:function(t,o){o&&typeof o.include!=="undefined"&&!Array.isArray(o.include)&&(o.include=[o.include]);o&&typeof o.exclude!=="undefined"&&!Array.isArray(o.exclude)&&(o.exclude=[o.exclude]);var r=e.tools.extend({path:t},o);return e.websocket.dataPromise("file.startListening",r)},
/**
       * Closes listeners with the provided settings. Omitting the path parameter will result in all listeners closing.
       *
       * @param {string} [path] Previously opened directory path of listener to close, or omit to close all.
       * @param {Object} [params] Object containing file access parameters
       *  @param {boolean} [params.sandbox=true] If relative location from root is only available to the certificate's connection, otherwise all connections
       *  @param {boolean} [params.shared=true] If relative location from root is accessible to all users on the system, otherwise just the current user
       * @returns {Promise<null|Error>}
       *
       * @memberof qz.file
       */
stopListening:function(t,o){var r=e.tools.extend({path:t},o);return e.websocket.dataPromise("file.stopListening",r)},
/**
       * List of functions called for any response from a file listener.
       *  For ERROR types event data will contain, <code>{string} message</code>.
       *  For ACTION types event data will contain, <code>{string} file {string} eventType {string} [data]</code>.
       *
       * @param {Function|Array<Function>} calls Single or array of <code>Function({Object} eventData)</code> calls.
       * @since 2.1.0
       *
       * @memberof qz.file
       */
setFileCallbacks:function(t){e.file.fileCallbacks=t}},networking:{
/**
       * @param {string} [hostname] Hostname to try to connect to when determining network interfaces, defaults to "google.com"
       * @param {number} [port] Port to use with custom hostname, defaults to 443
       * @returns {Promise<Object|Error>} Connected system's network information.
       *
       * @memberof qz.networking
       * @since 2.1.0
       */
device:function(t,o){return e.tools.isVersion(2,0)?e.compatible.networking(t,o,null,null,(function(e){return{ip:e.ipAddress,mac:e.macAddress}})):e.websocket.dataPromise("networking.device",{hostname:t,port:o})},
/**
       * Get computer hostname
       *
       * @param {string} [hostname] DEPRECATED Hostname to try to connect to when determining network interfaces, defaults to "google.com"
       * @param {number} [port] DEPRECATED Port to use with custom hostname, defaults to 443
       * @returns {Promise<string|Error>} Connected system's hostname.
       *
       * @memberof qz.networking
       * @since 2.2.2
       */
hostname:function(t,o){return e.tools.versionCompare(2,2,2)<0?e.tools.promise((function(r,n){e.websocket.dataPromise("networking.device",{hostname:t,port:o}).then((function(e){console.log(e);r(e.hostname)}))})):e.websocket.dataPromise("networking.hostname")},
/**
       * @param {string} [hostname] Hostname to try to connect to when determining network interfaces, defaults to "google.com"
       * @param {number} [port] Port to use with custom hostname, defaults to 443
       * @returns {Promise<Array<Object>|Error>} Connected system's network information.
       *
       * @memberof qz.networking
       * @since 2.1.0
       */
devices:function(t,o){return e.tools.isVersion(2,0)?e.compatible.networking(t,o,null,null,(function(e){return[{ip:e.ipAddress,mac:e.macAddress}]})):e.websocket.dataPromise("networking.devices",{hostname:t,port:o})}},security:{
/**
       * Set promise resolver for calls to acquire the site's certificate.
       *
       * @param {Function|AsyncFunction|Promise<string>} promiseHandler Either a function that will be used as a promise resolver (of format <code>Function({function} resolve, {function}reject)</code>),
       *     an async function, or a promise. Any of which should return the public certificate via their respective <code>resolve</code> call.
       * @param {Object} [options] Configuration options for the certificate resolver
       *  @param {boolean} [options.rejectOnFailure=[false]] Overrides default behavior to call resolve with a blank certificate on failure.
       * @memberof qz.security
       */
setCertificatePromise:function(t,o){e.security.certHandler=t;e.security.rejectOnCertFailure=!!(o&&o.rejectOnFailure)},
/**
       * Set promise factory for calls to sign API calls.
       *
       * @param {Function|AsyncFunction} promiseFactory Either a function that accepts a string parameter of the data to be signed
       *     and returns a function to be used as a promise resolver (of format <code>Function({function} resolve, {function}reject)</code>),
       *     or an async function that can take a string parameter of the data to be signed. Either of which should return the signed contents of
       *     the passed string parameter via their respective <code>resolve</code> call.
       *
       * @example
       *  qz.security.setSignaturePromise(function(dataToSign) {
       *    return function(resolve, reject) {
       *      $.ajax("/signing-url?data=" + dataToSign).then(resolve, reject);
       *    }
       *  })
       *
       * @memberof qz.security
       */
setSignaturePromise:function(t){e.security.signatureFactory=t},
/**
       * Set which signing algorithm QZ will check signatures against.
       *
       * @param {string} algorithm The algorithm used in signing. Valid values: <code>[SHA1 | SHA256 | SHA512]</code>
       * @since 2.1.0
       *
       * @memberof qz.security
       */
setSignatureAlgorithm:function(t){e.compatible.algorithm()&&(["SHA1","SHA256","SHA512"].indexOf(t.toUpperCase())<0?e.log.error("Signing algorithm '"+t+"' is not supported."):e.security.signAlgorithm=t)},
/**
       * Get the signing algorithm QZ will be checking signatures against.
       *
       * @returns {string} The algorithm used in signing.
       * @since 2.1.0
       *
       * @memberof qz.security
       */
getSignatureAlgorithm:function(){return e.security.signAlgorithm}},api:{
/**
       * Show or hide QZ api debugging statements in the browser console.
       *
       * @param {boolean} show Whether the debugging logs for QZ should be shown. Hidden by default.
       * @returns {boolean} Value of debugging flag
       * @memberof qz.api
       */
showDebug:function(t){return e.DEBUG=t},
/**
       * Get version of connected QZ Tray application.
       *
       * @returns {Promise<string|Error>} Version number of QZ Tray.
       *
       * @memberof qz.api
       */
getVersion:function(){return e.websocket.dataPromise("getVersion")},
/**
       * Checks for the specified version of connected QZ Tray application.
       *
       * @param {string|number} [major] Major version to check
       * @param {string|number} [minor] Minor version to check
       * @param {string|number} [patch] Patch version to check
       *
       * @memberof qz.api
       */
isVersion:e.tools.isVersion,
/**
       * Checks if the connected QZ Tray application is greater than the specified version.
       *
       * @param {string|number} major Major version to check
       * @param {string|number} [minor] Minor version to check
       * @param {string|number} [patch] Patch version to check
       * @param {string|number} [build] Build version to check
       * @returns {boolean} True if connected version is greater than the version specified.
       *
       * @memberof qz.api
       * @since 2.1.0-4
       */
isVersionGreater:function(t,o,r,n){return e.tools.versionCompare(t,o,r,n)>0},
/**
       * Checks if the connected QZ Tray application is less than the specified version.
       *
       * @param {string|number} major Major version to check
       * @param {string|number} [minor] Minor version to check
       * @param {string|number} [patch] Patch version to check
       * @param {string|number} [build] Build version to check
       * @returns {boolean} True if connected version is less than the version specified.
       *
       * @memberof qz.api
       * @since 2.1.0-4
       */
isVersionLess:function(t,o,r,n){return e.tools.versionCompare(t,o,r,n)<0},
/**
       * Change the promise library used by QZ API.
       * Should be called before any initialization to avoid possible errors.
       *
       * @param {Function} promiser <code>Function({function} resolver)</code> called to create new promises.
       *
       * @memberof qz.api
       */
setPromiseType:function(t){e.tools.promise=t},
/**
       * Change the SHA-256 hashing function used by QZ API.
       * Should be called before any initialization to avoid possible errors.
       *
       * @param {Function} hasher <code>Function({function} message)</code> called to create hash of passed string.
       *
       * @memberof qz.api
       */
setSha256Type:function(t){e.tools.hash=t},
/**
       * Change the WebSocket handler.
       * Should be called before any initialization to avoid possible errors.
       *
       * @param {Function} ws <code>Function({function} WebSocket)</code> called to override the internal WebSocket handler.
       *
       * @memberof qz.api
       */
setWebSocketType:function(t){e.tools.ws=t}},version:e.VERSION};return o}();(function(){true;o=r})();var n=o;export{n as default};
