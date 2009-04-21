/*
 * Ext JS Library 3.0 Pre-alpha
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext = {version: '3.0'};
window.undefined = window.undefined;
Ext.apply = function(o, c, defaults){
    if (defaults) Ext.apply(o, defaults)
    if(o && c && typeof c == 'object'){
        for(var p in c){
            o[p] = c[p];
        }
    }
    return o;
};
(function(){
    var idSeed = 0,
        ua = navigator.userAgent.toLowerCase(),
        check = function(r){
            return r.test(ua);
        },
        isStrict = document.compatMode == "CSS1Compat",
        isOpera = check(/opera/),
        isChrome = check(/chrome/),
        isWebKit = check(/webkit/),
        isSafari = !isChrome && check(/safari/),
        isSafari3 = isSafari && check(/version\/3/),
        isSafari4 = isSafari && check(/version\/4/),
        isIE = !isOpera && check(/msie/),
        isIE7 = isIE && check(/msie 7/),
        isIE8 = isIE && check(/msie 8/),
        isGecko = !isWebKit && check(/gecko/),
        isGecko3 = isGecko && check(/rv:1\.9/),
        isBorderBox = isIE && !isStrict,
        isWindows = check(/windows|win32/),
        isMac = check(/macintosh|mac os x/),
        isAir = check(/adobeair/),
        isLinux = check(/linux/),
        isSecure = /^https/i.test(window.location.protocol);
    if(isIE && !(isIE7 || isIE8)){
        try{
            document.execCommand("BackgroundImageCache", false, true);
        }catch(e){}
    }
    Ext.apply(Ext, {
        isStrict : isStrict,
        isSecure : isSecure,
        isReady : false,
        enableGarbageCollector : true,
        enableListenerCollection : false,
        USE_NATIVE_JSON : false,
        applyIf : function(o, c){
            if(o){
                for(var p in c){
                    if(Ext.isEmpty(o[p])){ o[p] = c[p]; }
                }
            }
            return o;
        },
        id : function(el, prefix){
            return (el = Ext.getDom(el) || {}).id = el.id || (prefix || "ext-gen") + (++idSeed);
        },
        extend : function(){
            var io = function(o){
                for(var m in o){
                    this[m] = o[m];
                }
            };
            var oc = Object.prototype.constructor;
            return function(sb, sp, overrides){
                if(Ext.isObject(sp)){
                    overrides = sp;
                    sp = sb;
                    sb = overrides.constructor != oc ? overrides.constructor : function(){sp.apply(this, arguments);};
                }
                var F = function(){},
                    sbp,
                    spp = sp.prototype;
                F.prototype = spp;
                sbp = sb.prototype = new F();
                sbp.constructor=sb;
                sb.superclass=spp;
                if(spp.constructor == oc){
                    spp.constructor=sp;
                }
                sb.override = function(o){
                    Ext.override(sb, o);
                };
                sbp.superclass = sbp.supr = (function(){
                    return spp;
                });
                sbp.override = io;
                Ext.override(sb, overrides);
                sb.extend = function(o){Ext.extend(sb, o);};
                return sb;
            };
        }(),
        override : function(origclass, overrides){
            if(overrides){
                var p = origclass.prototype;
                Ext.apply(p, overrides);
                if(Ext.isIE && overrides.toString != origclass.toString){
                    p.toString = overrides.toString;
                }
            }
        },
        namespace : function(){
            var o, d;
            Ext.each(arguments, function(v) {
                d = v.split(".");
                o = window[d[0]] = window[d[0]] || {};
                Ext.each(d.slice(1), function(v2){
                    o = o[v2] = o[v2] || {};
                });
            });
            return o;
        },
        urlEncode : function(o, pre){
            var buf = [],
                key,
                e = encodeURIComponent;
            for(key in o) {
                Ext.each(o[key] || key, function(val, i) {
                    buf.push("&", e(key), "=", val != key ? e(val) : "");
                });
            }
            if(!pre) {
                buf.shift();
                pre = "";
            }
            return pre + buf.join('');
        },
        urlDecode : function(string, overwrite){
            var obj = {},
                pairs = string.split('&'),
                d = decodeURIComponent,
                name,
                value;
            Ext.each(pairs, function(pair) {
                pair = pair.split('=');
                name = d(pair[0]);
                value = d(pair[1]);
                obj[name] = overwrite || !obj[name] ? value :
                            [].concat(obj[name]).concat(value);
            });
            return obj;
        },
        toArray : function(){
            return isIE ?
                function(a, i, j, res){
                    res = [];
                    Ext.each(a, function(v) {
                        res.push(v);
                    });
                    return res.slice(i || 0, j || res.length);
                } :
                function(a, i, j){
                    return Array.prototype.slice.call(a, i || 0, j || a.length);
                }
        }(),
        each : function(array, fn, scope){
            if(Ext.isEmpty(array, true)) return;
            if (typeof array.length == "undefined" || typeof array == "string"){
                array = [array];
            }
            for(var i = 0, len = array.length; i < len; i++){
                if(fn.call(scope || array[i], array[i], i, array) === false){ return i; };
            }
        },
        getDom : function(el){
            if(!el || !document){
                return null;
            }
            return el.dom ? el.dom : (typeof el == 'string' ? document.getElementById(el) : el);
        },
        getBody : function(){
            return Ext.get(document.body || document.documentElement);
        },        
        removeNode : isIE ? function(){
            var d;
            return function(n){
                if(n && n.tagName != 'BODY'){
                    d = d || document.createElement('div');
                    d.appendChild(n);
                    d.innerHTML = '';
                }
            }
        }() : function(n){
            if(n && n.parentNode && n.tagName != 'BODY'){
                n.parentNode.removeChild(n);
            }
        },
        isEmpty : function(v, allowBlank){
            return v === null || v === undefined || ((Ext.isArray(v) && !v.length)) || (!allowBlank ? v === '' : false);
        },
        isArray : function(v){
            return Object.prototype.toString.apply(v) === '[object Array]';
        },
        isObject : function(v){
            return v && typeof v == "object";
        },
        isPrimitive : function(v){
            var t = typeof v;
            return t == 'string' || t == 'number' || t == 'boolean';
        },
        isFunction : function(v){
            return typeof v == "function";
        },
        isOpera : isOpera,
        isWebKit: isWebKit,
        isChrome : isChrome,
        isSafari : isSafari,
        isSafari3 : isSafari3,
        isSafari4 : isSafari4,
        isSafari2 : isSafari && !isSafari3,
        isIE : isIE,
        isIE6 : isIE && !isIE7 && !isIE8,
        isIE7 : isIE7,
        isIE8 : isIE8,
        isGecko : isGecko,
        isGecko2 : isGecko && !isGecko3,
        isGecko3 : isGecko3,
        isBorderBox : isBorderBox,
        isLinux : isLinux,
        isWindows : isWindows,
        isMac : isMac,
        isAir : isAir
    });
    Ext.ns = Ext.namespace;
})();
Ext.ns("Ext", "Ext.util", "Ext.lib", "Ext.data");
Ext.apply(Function.prototype, {
    createInterceptor : function(fcn, scope){
        var method = this;
        return !Ext.isFunction(fcn) ?
                this :
                function() {
                    var me = this,
                        args = arguments;
                    fcn.target = me;
                    fcn.method = method;
                    return (fcn.apply(scope || me || window, args) !== false) ?
                            method.apply(me || window, args) :
                            null;
                };
    },
    createCallback : function( ){
        var args = arguments,
            method = this;
        return function() {
            return method.apply(window, args);
        };
    },
    createDelegate : function(obj, args, appendArgs){
        var method = this;
        return function() {
            var callArgs = args || arguments;
            if (appendArgs === true){
                callArgs = Array.prototype.slice.call(arguments, 0);
                callArgs = callArgs.concat(args);
            }else if (typeof appendArgs == "number"){
                callArgs = Array.prototype.slice.call(arguments, 0); 
                var applyArgs = [appendArgs, 0].concat(args); 
                Array.prototype.splice.apply(callArgs, applyArgs); 
            }
            return method.apply(obj || window, callArgs);
        };
    },
    defer : function(millis, obj, args, appendArgs){
        var fn = this.createDelegate(obj, args, appendArgs);
        if(millis){
            return setTimeout(fn, millis);
        }
        fn();
        return 0;
    }
});
Ext.applyIf(String, {
    format : function(format){
        var args = Ext.toArray(arguments, 1);
        return format.replace(/\{(\d+)\}/g, function(m, i){
            return args[i];
        });
    }
});
Ext.applyIf(Array.prototype, {
    indexOf : function(o){
       for (var i = 0, len = this.length; i < len; i++){
           if(this[i] == o) return i;
       }
       return -1;
    },
    remove : function(o){
       var index = this.indexOf(o);
       if(index != -1){
           this.splice(index, 1);
       }
       return this;
    }
});
Ext.ns("Ext.grid", "Ext.dd", "Ext.tree", "Ext.form", "Ext.menu",
       "Ext.state", "Ext.layout", "Ext.app", "Ext.ux", "Ext.chart", "Ext.direct");
Ext.apply(Ext, function(){
    var E = Ext, idSeed = 0;
    return {
        SSL_SECURE_URL : "javascript:false",
        emptyFn : function(){},
        BLANK_IMAGE_URL : "http:/"+"/extjs.com/s.gif",
        extendX : function(supr, fn){
            return Ext.extend(supr, fn(supr.prototype));
        },
        getDoc : function(){
            return Ext.get(document);
        },
        isDate : function(v){
            return Object.prototype.toString.apply(v) === '[object Date]';
        },
        num : function(v, defaultValue){
            v = Number(v == null? NaN : v);
            return isNaN(v)? defaultValue : v;
        },
        value : function(v, defaultValue, allowBlank){
            return Ext.isEmpty(v, allowBlank) ? defaultValue : v;
        },
        escapeRe : function(s) {
            return s.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1");
        },
        sequence : function(o, name, fn, scope){
            o[name] = o[name].createSequence(fn, scope);
        },
        addBehaviors : function(o){
            if(!Ext.isReady){
                Ext.onReady(function(){
                    Ext.addBehaviors(o);
                });
            } else {
                var cache = {}, 
                    parts,
                    b,
                    s;
                for (b in o) {
                    if ((parts = b.split('@'))[1]) { 
                        s = parts[0];
                        if(!cache[s]){
                            cache[s] = Ext.select(s);
                        }
                        cache[s].on(parts[1], o[b]);
                    }
                }
                cache = null;
            }
        },
        combine : function(){
            var as = arguments, l = as.length, r = [];
            for(var i = 0; i < l; i++){
                var a = as[i];
                if(Ext.isArray(a)){
                    r = r.concat(a);
                }else if(a.length !== undefined && !a.substr){
                    r = r.concat(Array.prototype.slice.call(a, 0));
                }else{
                    r.push(a);
                }
            }
            return r;
        },
        copyTo : function(dest, source, names){
            if(typeof names == 'string'){
                names = names.split(/[,;\s]/);
            }
            for(var i = 0, len = names.length; i< len; i++){
                var n = names[i];
                if(source.hasOwnProperty(n)){
                    dest[n] = source[n];
                }
            }
            return dest;
        },
        destroy : function(){
            for(var i = 0, a = arguments, len = a.length; i < len; i++) {
                var as = a[i];
                if(as){
                    if(typeof as.destroy == 'function'){
                        as.destroy();
                    }
                    else if(as.dom){
                        as.removeAllListeners();
                        as.remove();
                    }
                }
            }
        },
        destroyMembers : function(o, arg1, arg2, etc){
            for(var i = 1, a = arguments, len = a.length; i < len; i++) {
                Ext.destroy(o[a[i]]);
                delete o[a[i]];
            }
        },
        clean : function(arr){
            var ret = [];
            Ext.each(arr, function(v){
                if(!!v) ret.push(v);
            });
            return ret;
        },
        unique : function(arr){
            var ret = [],
                collect = {};
            Ext.each(arr, function(v) {
                if(!collect[v]){
                    ret.push(v);
                }
                collect[v] = true;
            });
            return ret;
        },
        flatten : function(arr){
            var worker = [];
            function rFlatten(a) {
                Ext.each(a, function(v) {
                    Ext.isArray(v) ? rFlatten(v) : worker.push(v);
                });
                return worker;
            };
            return rFlatten(arr);
        },
        min : function(arr, comp){
            var ret = arr[0];
            comp = comp || function(a,b){ return a < b ? -1 : 1 };
            Ext.each(arr, function(v) {
                ret = comp(ret, v) == -1 ? ret : v;
            });
            return ret;
        },
        max : function(arr, comp){
            var ret = arr[0];
            comp = comp || function(a,b){ return a > b ? 1 : -1 };
            Ext.each(arr, function(v) {
                ret = comp(ret, v) == 1 ? ret : v;
            });
            return ret;
        },
        median : function(arr, sorter, medCalc){
            var ret,
                middle,
                remainder;
            if (arr.length) {
                if (arr.length == 1) {
                    ret = arr[0];
                } else {
                    arr = Ext.toArray(arr);
                    sorter ? arr.sort(sorter) : arr.sort();
                    remainder = (middle = (arr.length / 2) - 1) % 1;
                    if( remainder == 0 ){
                        ret = medCalc ? medCalc(arr[middle], arr[middle + 1]) : ((arr[middle] + arr[middle + 1]) / 2);
                    }else{
                        ret = arr[middle + remainder];
                    }
                }
            }
            return ret;
        },
        mean : function(arr){
           return Ext.sum(arr) / arr.length;
        },
        mode : function(arr){
            var collect = {},
                mode = arr[0];
            Ext.each(arr, function(v) {
                collect[v] == undefined ? collect[v] = 0 : collect[v]++;
                mode = collect[mode] < collect[v] ? v : mode;
            });
            return mode;
        },
        sum : function(arr){
           var ret = 0;
           Ext.each(arr, function(v) {
               ret += v;
           });
           return ret;
        },
        partition : function(arr, truth){
            var ret = [[],[]];
            Ext.each(arr, function(v, i, a) {
                ret[ (truth && truth(v, i, a)) || (!truth && v) ? 0 : 1].push(v);
            });
            return ret;
        },
        invoke : function(arr, methodName){
            var ret = [],
                args = Array.prototype.slice.call(arguments, 2);
            Ext.each(arr, function(v,i) {
                if (v && typeof v[methodName] == "function") {
                    ret.push(v[methodName].apply(v, args));
                } else {
                    ret.push(undefined);
                }
            });
            return ret;
        },
        pluck : function(arr, prop){
            var ret = [];
            Ext.each(arr, function(v) {
                ret.push( v[prop] );
            });
            return ret;
        },
        zip : function(){
            var parts = Ext.partition(arguments, function( val ){ return typeof val != "function" }),
                arrs = parts[0],
                fn = parts[1][0],
                len = Ext.max(Ext.pluck(arrs, "length")),
                ret = [];
            for (var i = 0; i < len; i++) {
                ret[i] = [];
                if(fn){
                    ret[i] = fn.apply(fn, Ext.pluck(arrs, i));
                }else{
                    for (var j = 0, aLen = arrs.length; j < aLen; j++){
                        ret[i].push( arrs[j][i] );
                    }
                }
            }
            return ret;
        },
        getCmp : function(id){
            return Ext.ComponentMgr.get(id);
        },
        useShims : ((E.isIE && E.isIE6) || (E.isMac && E.isGecko && !E.isGecko3)),
        type : function(o){
            if(o === undefined || o === null){
                return false;
            }
            if(o.htmlElement){
                return 'element';
            }
            var t = typeof o;
            if(t == 'object' && o.nodeName) {
                switch(o.nodeType) {
                    case 1: return 'element';
                    case 3: return (/\S/).test(o.nodeValue) ? 'textnode' : 'whitespace';
                }
            }
            if(t == 'object' || t == 'function') {
                switch(o.constructor) {
                    case Array: return 'array';
                    case RegExp: return 'regexp';
                    case Date: return 'date';
                }
                if(typeof o.length == 'number' && typeof o.item == 'function') {
                    return 'nodelist';
                }
            }
            return t;
        },
        intercept : function(o, name, fn, scope){
            o[name] = o[name].createInterceptor(fn, scope);
        },
        callback : function(cb, scope, args, delay){
            if(Ext.isFunction(cb)){
                if(delay){
                    cb.defer(delay, scope, args || []);
                }else{
                    cb.apply(scope, args || []);
                }
            }
        }
    }
}());
Ext.apply(Function.prototype, {
    createSequence : function(fcn, scope){
        var method = this;
        return !Ext.isFunction(fcn) ?
                this :
                function(){
                    var retval = method.apply(this || window, arguments);
                    fcn.apply(scope || this || window, arguments);
                    return retval;
                };
    }
});
Ext.applyIf(String, {
    escape : function(string) {
        return string.replace(/('|\\)/g, "\\$1");
    },
    leftPad : function (val, size, ch) {
        var result = String(val);
        if(!ch) {
            ch = " ";
        }
        while (result.length < size) {
            result = ch + result;
        }
        return result;
    }
});
String.prototype.toggle = function(value, other){
    return this == value ? other : value;
};
String.prototype.trim = function(){
    var re = /^\s+|\s+$/g;
    return function(){ return this.replace(re, ""); };
}();
Date.prototype.getElapsed = function(date) {
    return Math.abs((date || new Date()).getTime()-this.getTime());
};
Ext.applyIf(Number.prototype, {
    constrain : function(min, max){
        return Math.min(Math.max(this, min), max);
    }
});
if(typeof jQuery == "undefined"){
    throw "Unable to load Ext, jQuery not found.";
}
(function(){
var libFlyweight;
Ext.lib.Dom = {
    getViewWidth : function(full){
        return full ? Math.max(jQuery(document).width(),jQuery(window).width()) : jQuery(window).width();
    },
    getViewHeight : function(full){
        return full ? Math.max(jQuery(document).height(),jQuery(window).height()) : jQuery(window).height();
    },
    isAncestor : function(p, c){
        p = Ext.getDom(p);
        c = Ext.getDom(c);
        if (!p || !c) {return false;}
        if(p.contains && !Ext.isSafari) {
            return p.contains(c);
        }else if(p.compareDocumentPosition) {
            return !!(p.compareDocumentPosition(c) & 16);
        }else{
            var parent = c.parentNode;
            while (parent) {
                if (parent == p) {
                    return true;
                }
                else if (!parent.tagName || parent.tagName.toUpperCase() == "HTML") {
                    return false;
                }
                parent = parent.parentNode;
            }
            return false;
        }
    },
    getRegion : function(el){
        return Ext.lib.Region.getRegion(el);
    },
    getY : function(el){
        return this.getXY(el)[1];
    },
    getX : function(el){
        return this.getXY(el)[0];
    },
    getXY : function(el) {
        var p, pe, b, scroll, bd = (document.body || document.documentElement);
        el = Ext.getDom(el);
        if(el == bd){
            return [0, 0];
        }
        if (el.getBoundingClientRect) {
            b = el.getBoundingClientRect();
            scroll = fly(document).getScroll();
            return [Math.round(b.left + scroll.left), Math.round(b.top + scroll.top)];
        }
        var x = 0, y = 0;
        p = el;
        var hasAbsolute = fly(el).getStyle("position") == "absolute";
        while (p) {
            x += p.offsetLeft;
            y += p.offsetTop;
            if (!hasAbsolute && fly(p).getStyle("position") == "absolute") {
                hasAbsolute = true;
            }
            if (Ext.isGecko) {
                pe = fly(p);
                var bt = parseInt(pe.getStyle("borderTopWidth"), 10) || 0;
                var bl = parseInt(pe.getStyle("borderLeftWidth"), 10) || 0;
                x += bl;
                y += bt;
                if (p != el && pe.getStyle('overflow') != 'visible') {
                    x += bl;
                    y += bt;
                }
            }
            p = p.offsetParent;
        }
        if (Ext.isSafari && hasAbsolute) {
            x -= bd.offsetLeft;
            y -= bd.offsetTop;
        }
        if (Ext.isGecko && !hasAbsolute) {
            var dbd = fly(bd);
            x += parseInt(dbd.getStyle("borderLeftWidth"), 10) || 0;
            y += parseInt(dbd.getStyle("borderTopWidth"), 10) || 0;
        }
        p = el.parentNode;
        while (p && p != bd) {
            if (!Ext.isOpera || (p.tagName != 'TR' && fly(p).getStyle("display") != "inline")) {
                x -= p.scrollLeft;
                y -= p.scrollTop;
            }
            p = p.parentNode;
        }
        return [x, y];
    },
    setXY : function(el, xy){
        el = Ext.fly(el, '_setXY');
        el.position();
        var pts = el.translatePoints(xy);
        if(xy[0] !== false){
            el.dom.style.left = pts.left + "px";
        }
        if(xy[1] !== false){
            el.dom.style.top = pts.top + "px";
        }
    },
    setX : function(el, x){
        this.setXY(el, [x, false]);
    },
    setY : function(el, y){
        this.setXY(el, [false, y]);
    }
};
function fly(el){
    if(!libFlyweight){
        libFlyweight = new Ext.Element.Flyweight();
    }
    libFlyweight.dom = el;
    return libFlyweight;
}
Ext.lib.Event = {
    getPageX : function(e){
        e = e.browserEvent || e;
        return e.pageX;
    },
    getPageY : function(e){
        e = e.browserEvent || e;
        return e.pageY;
    },
    getXY : function(e){
        e = e.browserEvent || e;
        return [e.pageX, e.pageY];
    },
    getTarget : function(e){
        return e.target;
    },
    on : function(el, eventName, fn, scope, override){
        jQuery(el).bind(eventName, fn);
    },
    un : function(el, eventName, fn){
        jQuery(el).unbind(eventName, fn);
    },
    purgeElement : function(el){
        jQuery(el).unbind();
    },
    preventDefault : function(e){
        e = e.browserEvent || e;
        if(e.preventDefault){
            e.preventDefault();
        }else{
            e.returnValue = false;
        }
    },
    stopPropagation : function(e){
        e = e.browserEvent || e;
        if(e.stopPropagation){
            e.stopPropagation();
        }else{
            e.cancelBubble = true;
        }
    },
    stopEvent : function(e){
        this.preventDefault(e);
        this.stopPropagation(e);
    },
    onAvailable : function(id, fn, scope){
        var start = new Date();
        var f = function(){
            if(start.getElapsed() > 10000){
                clearInterval(iid);
            }
            var el = document.getElementById(id);
            if(el){
                clearInterval(iid);
                fn.call(scope||window, el);
            }
        };
        var iid = setInterval(f, 50);
    },
    resolveTextNode: function(node) {
        if (node && 3 == node.nodeType) {
            return node.parentNode;
        } else {
            return node;
        }
    },
    getRelatedTarget: function(ev) {
        ev = ev.browserEvent || ev;
        var t = ev.relatedTarget;
        if (!t) {
            if (ev.type == "mouseout") {
                t = ev.toElement;
            } else if (ev.type == "mouseover") {
                t = ev.fromElement;
            }
        }
        return this.resolveTextNode(t);
    }
};
Ext.lib.Ajax = function(){
    var createComplete = function(cb){
         return function(xhr, status){
            if((status == 'error' || status == 'timeout') && cb.failure){
                cb.failure.call(cb.scope||window, {
                    responseText: xhr.responseText,
                    responseXML : xhr.responseXML,
                    argument: cb.argument
                });
            }else if(cb.success){
                cb.success.call(cb.scope||window, {
                    responseText: xhr.responseText,
                    responseXML : xhr.responseXML,
                    argument: cb.argument
                });
            }
         };
    };
    return {
        request : function(method, uri, cb, data, options){
            var o = {
                type: method,
                url: uri,
                data: data,
                timeout: cb.timeout,
                complete: createComplete(cb)
            };
            if(options){
                var hs = options.headers;
                if(options.xmlData){
                    o.data = options.xmlData;
                    o.processData = false;
                    o.type = (method ? method : (options.method ? options.method : 'POST'));
                    if (!hs || !hs['Content-Type']){
                        o.contentType = 'text/xml';
                    }
                }else if(options.jsonData){
                    o.data = typeof options.jsonData == 'object' ? Ext.encode(options.jsonData) : options.jsonData;
                    o.processData = false;
                    o.type = (method ? method : (options.method ? options.method : 'POST'));
                    if (!hs || !hs['Content-Type']){
                        o.contentType = 'application/json';
                    }
                }
                if(hs){
                    o.beforeSend = function(xhr){
                        for(var h in hs){
                            if(hs.hasOwnProperty(h)){
                                xhr.setRequestHeader(h, hs[h]);
                            }
                        }
                    }
                }
            }
            jQuery.ajax(o);
        },
        formRequest : function(form, uri, cb, data, isUpload, sslUri){
            jQuery.ajax({
                type: Ext.getDom(form).method ||'POST',
                url: uri,
                data: jQuery(form).serialize()+(data?'&'+data:''),
                timeout: cb.timeout,
                complete: createComplete(cb)
            });
        },
        isCallInProgress : function(trans){
            return false;
        },
        abort : function(trans){
            return false;
        },
        serializeForm : function(form){
            return jQuery(form.dom||form).serialize();
        }
    };
}();
Ext.lib.Anim = function(){
    var createAnim = function(cb, scope){
        var animated = true;
        return {
            stop : function(skipToLast){
            },
            isAnimated : function(){
                return animated;
            },
            proxyCallback : function(){
                animated = false;
                Ext.callback(cb, scope);
            }
        };
    };
    return {
        scroll : function(el, args, duration, easing, cb, scope){
            var anim = createAnim(cb, scope);
            el = Ext.getDom(el);
            if(typeof args.scroll.to[0] == 'number'){
                el.scrollLeft = args.scroll.to[0];
            }
            if(typeof args.scroll.to[1] == 'number'){
                el.scrollTop = args.scroll.to[1];
            }
            anim.proxyCallback();
            return anim;
        },
        motion : function(el, args, duration, easing, cb, scope){
            return this.run(el, args, duration, easing, cb, scope);
        },
        color : function(el, args, duration, easing, cb, scope){
            var anim = createAnim(cb, scope);
            anim.proxyCallback();
            return anim;
        },
        run : function(el, args, duration, easing, cb, scope, type){
            var anim = createAnim(cb, scope), e = Ext.fly(el, '_animrun');
            var o = {};
            for(var k in args){
                switch(k){   
                    case 'points':
                        var by, pts;
                        e.position();
                        if(by = args.points.by){
                            var xy = e.getXY();
                            pts = e.translatePoints([xy[0]+by[0], xy[1]+by[1]]);
                        }else{
                            pts = e.translatePoints(args.points.to);
                        }
                        o.left = pts.left;
                        o.top = pts.top;
                        if(!parseInt(e.getStyle('left'), 10)){ 
                            e.setLeft(0);
                        }
                        if(!parseInt(e.getStyle('top'), 10)){
                            e.setTop(0);
                        }
                        if(args.points.from){
                            e.setXY(args.points.from);
                        }
                    break;
                    case 'width':
                        o.width = args.width.to;
                        if (args.width.from)
                            e.setWidth(args.width.from);
                    break;
                    case 'height':
                        o.height = args.height.to;
                        if (args.height.from)
                            e.setHeight(args.height.from);
                    break;
                    case 'opacity':
                        o.opacity = args.opacity.to;
                        if (args.opacity.from)
                            e.setOpacity(args.opacity.from);
                    break;
                    case 'left':
                        o.left = args.left.to;
                        if (args.left.from)
                            e.setLeft(args.left.from);
                    break;
                    case 'top':
                        o.top = args.top.to;
                        if (args.top.from)
                            e.setTop(args.top.from);
                    break;
                    default:
                        o[k] = args[k].to;
                        if (args[k].from)
                            e.setStyle(k, args[k].from);
                    break;
                }
            }
            jQuery(el).animate(o, duration*1000, undefined, anim.proxyCallback);
            return anim;
        }
    };
}();
Ext.lib.Region = function(t, r, b, l) {
    this.top = t;
    this[1] = t;
    this.right = r;
    this.bottom = b;
    this.left = l;
    this[0] = l;
};
Ext.lib.Region.prototype = {
    contains : function(region) {
        return ( region.left   >= this.left   &&
                 region.right  <= this.right  &&
                 region.top    >= this.top    &&
                 region.bottom <= this.bottom    );
    },
    getArea : function() {
        return ( (this.bottom - this.top) * (this.right - this.left) );
    },
    intersect : function(region) {
        var t = Math.max( this.top,    region.top    );
        var r = Math.min( this.right,  region.right  );
        var b = Math.min( this.bottom, region.bottom );
        var l = Math.max( this.left,   region.left   );
        if (b >= t && r >= l) {
            return new Ext.lib.Region(t, r, b, l);
        } else {
            return null;
        }
    },
    union : function(region) {
        var t = Math.min( this.top,    region.top    );
        var r = Math.max( this.right,  region.right  );
        var b = Math.max( this.bottom, region.bottom );
        var l = Math.min( this.left,   region.left   );
        return new Ext.lib.Region(t, r, b, l);
    },
    constrainTo : function(r) {
            this.top = this.top.constrain(r.top, r.bottom);
            this.bottom = this.bottom.constrain(r.top, r.bottom);
            this.left = this.left.constrain(r.left, r.right);
            this.right = this.right.constrain(r.left, r.right);
            return this;
    },
    adjust : function(t, l, b, r){
        this.top += t;
        this.left += l;
        this.right += r;
        this.bottom += b;
        return this;
    }
};
Ext.lib.Region.getRegion = function(el) {
    var p = Ext.lib.Dom.getXY(el);
    var t = p[1];
    var r = p[0] + el.offsetWidth;
    var b = p[1] + el.offsetHeight;
    var l = p[0];
    return new Ext.lib.Region(t, r, b, l);
};
Ext.lib.Point = function(x, y) {
   if (Ext.isArray(x)) {
      y = x[1];
      x = x[0];
   }
    this.x = this.right = this.left = this[0] = x;
    this.y = this.top = this.bottom = this[1] = y;
};
Ext.lib.Point.prototype = new Ext.lib.Region();
if(Ext.isIE) {
    function fnCleanUp() {
        var p = Function.prototype;
        delete p.createSequence;
        delete p.defer;
        delete p.createDelegate;
        delete p.createCallback;
        delete p.createInterceptor;
        window.detachEvent("onunload", fnCleanUp);
    }
    window.attachEvent("onunload", fnCleanUp);
}
})();
