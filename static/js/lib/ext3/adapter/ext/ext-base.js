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
Ext.util.TaskRunner = function(interval){
    interval = interval || 10;
    var tasks = [], 
    	removeQueue = [],
    	id = 0,
    	running = false,
    	stopThread = function(){
	        running = false;
	        clearInterval(id);
	        id = 0;
	    },
    	startThread = function(){
	        if(!running){
	            running = true;
	            id = setInterval(runTasks, interval);
	        }
	    },
    	removeTask = function(t){
	        removeQueue.push(t);
	        if(t.onStop){
	            t.onStop.apply(t.scope || t);
	        }
	    },
    	runTasks = function(){
	    	var rqLen = removeQueue.length,
	    		now = new Date().getTime();	    			    		
	        if(rqLen > 0){
	            for(var i = 0; i < rqLen; i++){
	                tasks.remove(removeQueue[i]);
	            }
	            removeQueue = [];
	            if(tasks.length < 1){
	                stopThread();
	                return;
	            }
	        }	        
	        for(var i = 0, t, itime, rt, len = tasks.length; i < len; ++i){
	            t = tasks[i];
	            itime = now - t.taskRunTime;
	            if(t.interval <= itime){
	                rt = t.run.apply(t.scope || t, t.args || [++t.taskRunCount]);
	                t.taskRunTime = now;
	                if(rt === false || t.taskRunCount === t.repeat){
	                    removeTask(t);
	                    return;
	                }
	            }
	            if(t.duration && t.duration <= (now - t.taskStartTime)){
	                removeTask(t);
	            }
	        }
	    };
    this.start = function(task){
        tasks.push(task);
        task.taskStartTime = new Date().getTime();
        task.taskRunTime = 0;
        task.taskRunCount = 0;
        startThread();
        return task;
    };
    this.stop = function(task){
        removeTask(task);
        return task;
    };
    this.stopAll = function(){
        stopThread();
        for(var i = 0, len = tasks.length; i < len; i++){
            if(tasks[i].onStop){
                tasks[i].onStop();
            }
        }
        tasks = [];
        removeQueue = [];
    };
};
Ext.TaskMgr = new Ext.util.TaskRunner();
(function(){
	var libFlyweight;
	function fly(el) {
        if (!libFlyweight) {
            libFlyweight = new Ext.Element.Flyweight();
        }
        libFlyweight.dom = el;
        return libFlyweight;
    }
(function(){
	var doc = document,
		isCSS1 = doc.compatMode == "CSS1Compat",
		MAX = Math.max,		
		PARSEINT = parseInt;
	Ext.lib.Dom = {
	    isAncestor : function(p, c) {
		    var ret = false;
			p = Ext.getDom(p);
			c = Ext.getDom(c);
			if (p && c) {
				if (p.contains) {
					return p.contains(c);
				} else if (p.compareDocumentPosition) {
					return !!(p.compareDocumentPosition(c) & 16);
				} else {
					while (c = c.parentNode) {
						ret = c == p || ret;	        			
					}
				}	            
			}	
			return ret;
		},
        getViewWidth : function(full) {
            return full ? this.getDocumentWidth() : this.getViewportWidth();
        },
        getViewHeight : function(full) {
            return full ? this.getDocumentHeight() : this.getViewportHeight();
        },
        getDocumentHeight: function() {            
            return MAX(!isCSS1 ? doc.body.scrollHeight : doc.documentElement.scrollHeight, this.getViewportHeight());
        },
        getDocumentWidth: function() {            
            return MAX(!isCSS1 ? doc.body.scrollWidth : doc.documentElement.scrollWidth, this.getViewportWidth());
        },
        getViewportHeight: function(){
	        return Ext.isIE ? 
	        	   (Ext.isStrict ? doc.documentElement.clientHeight : doc.body.clientHeight) :
	        	   self.innerHeight;
        },
        getViewportWidth : function() {
	        return !Ext.isStrict && !Ext.isOpera ? doc.body.clientWidth :
	        	   Ext.isIE ? doc.documentElement.clientWidth : self.innerWidth;
        },
        getY : function(el) {
            return this.getXY(el)[1];
        },
        getX : function(el) {
            return this.getXY(el)[0];
        },
        getXY : function(el) {
            var p, 
            	pe, 
            	b,
            	bt, 
            	bl,     
            	dbd,       	
            	x = 0,
            	y = 0, 
            	scroll,
            	hasAbsolute, 
            	bd = (doc.body || doc.documentElement),
            	ret = [0,0];
            el = Ext.getDom(el);
            if(el != bd){
	            if (el.getBoundingClientRect) {
	                b = el.getBoundingClientRect();
	                scroll = fly(document).getScroll();
	                ret = [b.left + scroll.left, b.top + scroll.top];
	            } else {  
		            p = el;		
		            hasAbsolute = fly(el).isStyle("position", "absolute");
		            while (p) {
			            pe = fly(p);		
		                x += p.offsetLeft;
		                y += p.offsetTop;
		                hasAbsolute = hasAbsolute || pe.isStyle("position", "absolute");
		                if (Ext.isGecko) {		                    
		                    y += bt = PARSEINT(pe.getStyle("borderTopWidth"), 10) || 0;
		                    x += bl = PARSEINT(pe.getStyle("borderLeftWidth"), 10) || 0;	
		                    if (p != el && !pe.isStyle('overflow','visible')) {
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
		                dbd = fly(bd);
		                x += PARSEINT(dbd.getStyle("borderLeftWidth"), 10) || 0;
		                y += PARSEINT(dbd.getStyle("borderTopWidth"), 10) || 0;
		            }
		            p = el.parentNode;
		            while (p && p != bd) {
		                if (!Ext.isOpera || (p.tagName != 'TR' && !fly(p).isStyle("display", "inline"))) {
		                    x -= p.scrollLeft;
		                    y -= p.scrollTop;
		                }
		                p = p.parentNode;
		            }
		            ret = [x,y];
	            }
         	}
            return ret
        },
        setXY : function(el, xy) {
            (el = Ext.fly(el, '_setXY')).position();
            var pts = el.translatePoints(xy),
            	style = el.dom.style,
            	pos;            	
            for (pos in pts) {	            
	            if(!isNaN(pts[pos])) style[pos] = pts[pos] + "px"
            }
        },
        setX : function(el, x) {
            this.setXY(el, [x, false]);
        },
        setY : function(el, y) {
            this.setXY(el, [false, y]);
        }
    };
})();
Ext.lib.Dom.getRegion = function(el) {
    return Ext.lib.Region.getRegion(el);
}
Ext.lib.Event = function() {
    var loadComplete = false,
    	listeners = [],
    	unloadListeners = [],
    	retryCount = 0,
    	onAvailStack = [],
    	_interval,
    	locked = false,
    	win = window,
    	doc = document,
    	POLL_RETRYS = 200,
        POLL_INTERVAL = 20,
        EL = 0,
        TYPE = 1,
        FN = 2,
        WFN = 3,
        OBJ = 3,
        ADJ_SCOPE = 4,            
        doAdd = function() {
            var ret;
            if (win.addEventListener) {
                ret = function(el, eventName, fn, capture) {
                    if (eventName == 'mouseenter') {
                        fn = fn.createInterceptor(checkRelatedTarget);
                        el.addEventListener('mouseover', fn, (capture));
                    } else if (eventName == 'mouseleave') {
                        fn = fn.createInterceptor(checkRelatedTarget);
                        el.addEventListener('mouseout', fn, (capture));
                    } else {
                        el.addEventListener(eventName, fn, (capture));
                    }
                    return fn;
                };
            } else if (win.attachEvent) {
                ret = function(el, eventName, fn, capture) {
                    el.attachEvent("on" + eventName, fn);
                    return fn;
                };
            } else {
                ret = function(){};
            }
            return ret;
        }(),	
        doRemove = function(){
            var ret;
            if (win.removeEventListener) {
                ret = function (el, eventName, fn, capture) {
                    if (eventName == 'mouseenter') {
                        eventName = 'mouseover'
                    } else if (eventName == 'mouseleave') {
                        eventName = 'mouseout'
                    }                        
                    el.removeEventListener(eventName, fn, (capture));
                };
            } else if (win.detachEvent) {
                ret = function (el, eventName, fn) {
                    el.detachEvent("on" + eventName, fn);
                };
            } else {
                ret = function(){};
            }
            return ret;
        }();        
    function checkRelatedTarget(e) {
        var related = e.relatedTarget, 
            isXulEl = Object.prototype.toString.apply(related) == '[object XULElement]';
        if (!related) return false;        
        return (!isXulEl && related != this && this.tag != 'document' && !elContains(this, related));
    }
    function elContains(parent, child) {
        while(child) {
            if(child === parent) {
                return true;
            }
            try {
                child = child.parentNode;
            } catch(e) {
                return false;
            }                
            if(child && (child.nodeType != 1)) {
                child = null;
            }
        }
        return false;
    }
    function _getCacheIndex(el, eventName, fn) {
        var index = -1;
        Ext.each(listeners, function (v,i) {
            if(v && v[FN] == fn && v[EL] == el && v[TYPE] == eventName) {
	            index = i;
            }
        });
        return index;
    }
    function _tryPreloadAttach() {
        var ret = false,            	
        	notAvail = [],
            element,
        	tryAgain = !loadComplete || (retryCount > 0);	                	
        if (!locked) {
            locked = true;
            Ext.each(onAvailStack, function (v,i,a){
            	if(v && (element = doc.getElementById(v.id))){
	            	if(!v.checkReady || loadComplete || element.nextSibling || (doc && doc.body)) {
		            	element = v.override ? (v.override === true ? v.obj : v.override) : element;
		            	v.fn.call(element, v.obj);
		            	onAvailStack[i] = null;
	            	} else {
		            	notAvail.push(item);
	            	}
            	}	
            });
            retryCount = (notAvail.length == 0) ? 0 : retryCount - 1;
            if (tryAgain) {	
                startInterval();
            } else {
                clearInterval(_interval);
                _interval = null;
            }
            ret = !(locked = false);
		}
		return ret;
    }
	function startInterval() {            
        if (!_interval) {                    
            var callback = function() {
                _tryPreloadAttach();
            };
            _interval = setInterval(callback, pub.POLL_INTERVAL);
        }
    }
    function getScroll() {
        var scroll = Ext.get(doc).getScroll();
        return [scroll.top, scroll.top];
    }
    function getPageCoord (ev, xy) {
        ev = ev.browserEvent || ev;
        var coord  = ev['page' + xy];
        if (!coord && 0 != coord) {
            coord = ev['client' + xy] || 0;
            if (Ext.isIE) {
                coord += getScroll()[xy == "X" ? 0 : 1];
            }
        }
        return coord;
    }
    var pub =  {
        onAvailable : function(p_id, p_fn, p_obj, p_override) {	            
            onAvailStack.push({ 
                id:         p_id,
                fn:         p_fn,
                obj:        p_obj,
                override:   p_override,
                checkReady: false });
            retryCount = this.POLL_RETRYS;
            startInterval();
        },
        addListener: function(el, eventName, fn) {
			var ret;				
			el = Ext.getDom(el);				
			if (el && fn) {
				if ("unload" == eventName) {
				    ret = !!(unloadListeners[unloadListeners.length] = [el, eventName, fn]);					
				} else {
                    listeners.push([el, eventName, fn, ret = doAdd(el, eventName, fn, false)]);
				}
			}
			return !!ret;
        },
        removeListener: function(el, eventName, fn) {
            var ret = false,
            	index, 
            	cacheItem;
            el = Ext.getDom(el);
            if(!fn) { 	                
                ret = this.purgeElement(el, false, eventName);
            } else if ("unload" == eventName) {	
                Ext.each(unloadListeners, function(v, i, a) {
	                if( v && v[0] == el && v[1] == evantName && v[2] == fn) {
		                unloadListeners.splice(i, 1);
	                	ret = true;
                	}
                });
            } else {	
                index = arguments[3] || _getCacheIndex(el, eventName, fn);
                cacheItem = listeners[index];
                if (el && cacheItem) {
	                doRemove(el, eventName, cacheItem[WFN], false);		
	                cacheItem[WFN] = cacheItem[FN] = null;		                 
	                listeners.splice(index, 1);		
	                ret = true;
                }
            }
            return ret;
        },
        getTarget : function(ev) {
            ev = ev.browserEvent || ev;                
            return this.resolveTextNode(ev.target || ev.srcElement);
        },
        resolveTextNode : function(node) {
            return Ext.isSafari && node && 3 == node.nodeType ? node.parentNode : node;
        },
        getPageX : function(ev) {
            return getPageCoord(ev, "X");
        },
        getPageY : function(ev) {
            return getPageCoord(ev, "Y");
        },
        getXY : function(ev) {	                           
            return [this.getPageX(ev), this.getPageY(ev)];
        },
        getRelatedTarget : function(ev) {
            ev = ev.browserEvent || ev;
            return this.resolveTextNode(ev.relatedTarget || 
				    (ev.type == "mouseout" ? ev.toElement :
				     ev.type == "mouseover" ? ev.fromElement : null));
        },
        stopEvent : function(ev) {		                      
            this.stopPropagation(ev);
            this.preventDefault(ev);
        },
        stopPropagation : function(ev) {
            ev = ev.browserEvent || ev;
            if (ev.stopPropagation) {
                ev.stopPropagation();
            } else {
                ev.cancelBubble = true;
            }
        },
        preventDefault : function(ev) {
            ev = ev.browserEvent || ev;
            if (ev.preventDefault) {
                ev.preventDefault();
            } else {
                ev.returnValue = false;
            }
        },
        getEvent : function(e) {
            e = e || win.event;
            if (!e) {
                var c = this.getEvent.caller;
                while (c) {
                    e = c.arguments[0];
                    if (e && Event == e.constructor) {
                        break;
                    }
                    c = c.caller;
                }
            }
            return e;
        },
        getCharCode : function(ev) {
            ev = ev.browserEvent || ev;
            return ev.charCode || ev.keyCode || 0;
        },
        _load : function(e) {
            loadComplete = true;
            var EU = Ext.lib.Event;    
            if (Ext.isIE && e !== true) {
                doRemove(win, "load", EU._load);
            }
        },            
        purgeElement : function(el, recurse, eventName) {
			var me = this;
			Ext.each( me.getListeners(el, eventName), function(v){
				if(v) me.removeListener(el, v.type, v.fn);
			});
            if (recurse && el && el.childNodes) {
                Ext.each(el.childNodes, function(v){
	                me.purgeElement(v, recurse, eventName);
                });
            }
        },
        getListeners : function(el, eventName) {
            var me = this,
            	results = [], 
            	searchLists = [listeners, unloadListeners];
			if (eventName) {					
				searchLists.splice(eventName == "unload" ? 0 : 1 ,1);
			} else {
				searchLists = searchLists[0].concat(searchLists[1]);	
			}
			Ext.each(searchLists, function(v, i){
				if (v && v[me.EL] == el && (!eventName || eventName == v[me.type])) {
					results.push({
                                type:   v[TYPE],
                                fn:     v[FN],
                                obj:    v[OBJ],
                                adjust: v[ADJ_SCOPE],
                                index:  i
                            });
				}	
			});                
            return results.length ? results : null;
        },
        _unload : function(e) {
             var EU = Ext.lib.Event, 
            	i, 
            	j, 
            	l, 
            	len, 
            	index,
            	scope;
			Ext.each(unloadListeners, function(v) {
				if (v) {
					scope =  v[ADJ_SCOPE] ? (v[ADJ_SCOPE] === true ? v[OBJ] : v[ADJ_SCOPE]) :  win;	
					v[FN].call(scope, EU.getEvent(e), v[OBJ]);	
				}	
			});		
            unloadListeners = null;
            if (listeners && (j = listeners.length)) {                    
                while (j) {                        
                    if (l = listeners[index = --j]) {
                        EU.removeListener(l[EL], l[TYPE], l[FN], index);
                    }                        
                }
            }
            doRemove(win, "unload", EU._unload);
        }            
    };        
    pub.on = pub.addListener;
    pub.un = pub.removeListener;
    if (doc && doc.body) {
        pub._load(true);
    } else {
        doAdd(win, "load", pub._load);
    }
    doAdd(win, "unload", pub._unload);    
    _tryPreloadAttach();
    return pub;
}();
    Ext.lib.Ajax = function() {	    
	    var activeX = ['MSXML2.XMLHTTP.3.0',
			           'MSXML2.XMLHTTP',
			           'Microsoft.XMLHTTP'];
		function setHeader(o) {
	        var conn = o.conn,
	        	prop;
	        function setTheHeaders(conn, headers){
		     	for (prop in headers) {
                    if (headers.hasOwnProperty(prop)) {
                        conn.setRequestHeader(prop, headers[prop]);
                    }
                }   
	        }		
            if (pub.defaultHeaders) {
	            setTheHeaders(conn, pub.defaultHeaders);
            }
            if (pub.headers) {
				setTheHeaders(conn, pub.headers);
                pub.headers = null;                
            }
        }    
        function createExceptionObject(tId, callbackArg, isAbort, isTimeout) {	        
            return {
	            tId : tId,
	            status : isAbort ? -1 : 0,
	            statusText : isAbort ? 'transaction aborted' : 'communication failure',
                    isAbort: true,
                    isTimeout: true,
	            argument : callbackArg
            };
        }  
        function initHeader(label, value) {         
			(pub.headers = pub.headers || {})[label] = value;			            
        }
        function createResponseObject(o, callbackArg) {
            var headerObj = {},
            	headerStr,            	
            	conn = o.conn;            	
            try {
                headerStr = o.conn.getAllResponseHeaders();                
                Ext.each(headerStr.split('\n'), function(v){
	            	var t = v.split(':');
	            	headerObj[t[0]] = t[1]; 
                });
            } catch(e) {}
            return {
		        tId : o.tId,
	            status : conn.status,
	            statusText : conn.statusText,
	            getResponseHeader : headerObj,
	            getAllResponseHeaders : headerStr,
	            responseText : conn.responseText,
	            responseXML : conn.responseXML,
	            argument : callbackArg
        	};
        }
        function releaseObject(o) {
            o.conn = null;
            o = null;
        }        
        function handleTransactionResponse(o, callback, isAbort, isTimeout) {
            if (!callback) {
                releaseObject(o);
                return;
            }
            var httpStatus, responseObject;
            try {
                if (o.conn.status !== undefined && o.conn.status != 0) {
                    httpStatus = o.conn.status;
                }
                else {
                    httpStatus = 13030;
                }
            }
            catch(e) {
                httpStatus = 13030;
            }
            if ((httpStatus >= 200 && httpStatus < 300) || (Ext.isIE && httpStatus == 1223)) {
                responseObject = createResponseObject(o, callback.argument);
                if (callback.success) {
                    if (!callback.scope) {
                        callback.success(responseObject);
                    }
                    else {
                        callback.success.apply(callback.scope, [responseObject]);
                    }
                }
            }
            else {
                switch (httpStatus) {
                    case 12002:
                    case 12029:
                    case 12030:
                    case 12031:
                    case 12152:
                    case 13030:
                        responseObject = createExceptionObject(o.tId, callback.argument, (isAbort ? isAbort : false), isTimeout);
                        if (callback.failure) {
                            if (!callback.scope) {
                                callback.failure(responseObject);
                            }
                            else {
                                callback.failure.apply(callback.scope, [responseObject]);
                            }
                        }
                        break;
                    default:
                        responseObject = createResponseObject(o, callback.argument);
                        if (callback.failure) {
                            if (!callback.scope) {
                                callback.failure(responseObject);
                            }
                            else {
                                callback.failure.apply(callback.scope, [responseObject]);
                            }
                        }
                }
            }
            releaseObject(o);
            responseObject = null;
        }  
        function handleReadyState(o, callback){
	    callback = callback || {};
            var conn = o.conn,
            	tId = o.tId,
            	poll = pub.poll,
		cbTimeout = callback.timeout || null;
            if (cbTimeout) {
                pub.timeout[tId] = setTimeout(function() {
                    pub.abort(o, callback, true);
                }, cbTimeout);
            }
            poll[tId] = setInterval(
                function() {
                    if (conn && conn.readyState == 4) {
                        clearInterval(poll[tId]);
                        poll[tId] = null;
                        if (cbTimeout) {
                            clearTimeout(pub.timeout[tId]);
                            pub.timeout[tId] = null;
                        }
                        handleTransactionResponse(o, callback);
                    }
                },
                pub.pollInterval);
        }
        function asyncRequest(method, uri, callback, postData) {
            var o = getConnectionObject() || null;
            if (o) {
                o.conn.open(method, uri, true);
                if (pub.useDefaultXhrHeader) {                    
                	initHeader('X-Requested-With', pub.defaultXhrHeader);
                }
                if(postData && pub.useDefaultHeader && (!pub.headers || !pub.headers['Content-Type'])){
                    initHeader('Content-Type', pub.defaultPostHeader);
                }
                if (pub.defaultHeaders || pub.headers) {
                    setHeader(o);
                }
                handleReadyState(o, callback);
                o.conn.send(postData || null);
            }
            return o;
        }
        function getConnectionObject() {
            var o;      	
            try {
                if (o = createXhrObject(pub.transactionId)) {
                    pub.transactionId++;
                }
            } catch(e) {
            } finally {
                return o;
            }
        }
        function createXhrObject(transactionId) {
            var http;
            try {
                http = new XMLHttpRequest();                
            } catch(e) {
                for (var i = 0; i < activeX.length; ++i) {	            
                    try {
                        http = new ActiveXObject(activeX[i]);                        
                        break;
                    } catch(e) {}
                }
            } finally {
                return {conn : http, tId : transactionId};
            }
        }
	    var pub = {
	        request : function(method, uri, cb, data, options) {
			    if(options){
			        var me = this,		        
			        	xmlData = options.xmlData,
			        	jsonData = options.jsonData;
			        Ext.applyIf(me, options);	        
		            if(xmlData || jsonData){
			            initHeader('Content-Type', xmlData ? 'text/xml' : 'application/json');
			            data = xmlData || Ext.encode(jsonData);
			        }
			    }		    		    
			    return asyncRequest(method || options.method || "POST", uri, cb, data);
	        },
	        serializeForm : function(form) {
		        var fElements = form.elements || (document.forms[form] || Ext.getDom(form)).elements,
	            	hasSubmit = false,
	            	encoder = encodeURIComponent,
		        	element,
	            	options, 
	            	name, 
	            	val,             	
	            	data = '',
	            	type;
		        Ext.each(fElements, function(element) {		            
	                name = element.name;	             
					type = element.type;
	                if (!element.disabled && name){
		                if(/select-(one|multiple)/i.test(type)){			                
				            Ext.each(element.options, function(opt) {
					            if (opt.selected) {
						            data += String.format("{0}={1}&", 						            					  
						            					 encoder(name),						            					 
						            					  (opt.hasAttribute ? opt.hasAttribute('value') : opt.getAttribute('value') !== null) ? opt.value : opt.text);
                                }								
                            });
		                } else if(!/file|undefined|reset|button/i.test(type)) {
			                if(!(/radio|checkbox/i.test(type) && !element.checked) && !(type == 'submit' && hasSubmit)){
                                data += encoder(name) + '=' + encoder(element.value) + '&';                     
                                hasSubmit = /submit/i.test(type);    
                            } 		                
		                } 
	                }
	            });            
	            return data.substr(0, data.length - 1);
	        },
	        useDefaultHeader : true,
	        defaultPostHeader : 'application/x-www-form-urlencoded; charset=UTF-8',
	        useDefaultXhrHeader : true,
	        defaultXhrHeader : 'XMLHttpRequest',        
	        poll : {},
	        timeout : {},
	        pollInterval : 50,
	        transactionId : 0,
	        abort : function(o, callback, isTimeout) {
		        var me = this,
		        	tId = o.tId,
		        	isAbort = false;
	            if (me.isCallInProgress(o)) {
	                o.conn.abort();
	                clearInterval(me.poll[tId]);
	               	me.poll[tId] = null;
	                if (isTimeout) {
	                    me.timeout[tId] = null;
	                }
	                handleTransactionResponse(o, callback, (isAbort = true), isTimeout);                
	            }
	            return isAbort;
	        },
	        isCallInProgress : function(o) {
	            return o.conn && !{0:true,4:true}[o.conn.readyState];	        
	        }
	    };
	    return pub;
    }();
	Ext.lib.Region = function(t, r, b, l) {
		var me = this;
        me.top = t;
        me[1] = t;
        me.right = r;
        me.bottom = b;
        me.left = l;
        me[0] = l;
    };
    Ext.lib.Region.prototype = {
        contains : function(region) {
	        var me = this;
            return ( region.left >= me.left &&
                     region.right <= me.right &&
                     region.top >= me.top &&
                     region.bottom <= me.bottom );
        },
        getArea : function() {
	        var me = this;
            return ( (me.bottom - me.top) * (me.right - me.left) );
        },
        intersect : function(region) {
            var me = this,
            	t = Math.max(me.top, region.top),
            	r = Math.min(me.right, region.right),
            	b = Math.min(me.bottom, region.bottom),
            	l = Math.max(me.left, region.left);
            if (b >= t && r >= l) {
                return new Ext.lib.Region(t, r, b, l);
            }
        },
        union : function(region) {
	        var me = this,
            	t = Math.min(me.top, region.top),
            	r = Math.max(me.right, region.right),
            	b = Math.max(me.bottom, region.bottom),
            	l = Math.min(me.left, region.left);
            return new Ext.lib.Region(t, r, b, l);
        },
        constrainTo : function(r) {
	        var me = this;
            me.top = me.top.constrain(r.top, r.bottom);
            me.bottom = me.bottom.constrain(r.top, r.bottom);
            me.left = me.left.constrain(r.left, r.right);
            me.right = me.right.constrain(r.left, r.right);
            return me;
        },
        adjust : function(t, l, b, r) {
	        var me = this;
            me.top += t;
            me.left += l;
            me.right += r;
            me.bottom += b;
            return me;
        }
    };
    Ext.lib.Region.getRegion = function(el) {
        var p = Ext.lib.Dom.getXY(el),
        	t = p[1],
        	r = p[0] + el.offsetWidth,
        	b = p[1] + el.offsetHeight,
        	l = p[0];
        return new Ext.lib.Region(t, r, b, l);
    };
	Ext.lib.Point = function(x, y) {
        if (Ext.isArray(x)) {
            y = x[1];
            x = x[0];
        }
        var me = this;
        me.x = me.right = me.left = me[0] = x;
        me.y = me.top = me.bottom = me[1] = y;
    };
    Ext.lib.Point.prototype = new Ext.lib.Region();
(function(){	
	var EXTLIB = Ext.lib,
		noNegativesRE = /width|height|opacity|padding/i,    	
        defaultUnitRE = /width|height|top$|bottom$|left$|right$/i,
        offsetUnitRE =  /\d+(em|%|en|ex|pt|in|cm|mm|pc)$/i;
	EXTLIB.Anim = {
        motion : function(el, args, duration, easing, cb, scope) {	        
            return this.run(el, args, duration, easing, cb, scope, EXTLIB.Motion);
        },        
        run : function(el, args, duration, easing, cb, scope, type) {
            type = type || EXTLIB.AnimBase;                        
            var anim = new type(el, args, duration, EXTLIB.Easing[easing] || easing);
	        anim.animate(function() {
		        	if(cb) cb.call(scope);	               
            });            
            return anim;
        }
    };        
    EXTLIB.AnimBase = function(el, attrs, duration, method) {
        if (el) {
            this.init(el, attrs, duration, method);
        }
    };
    EXTLIB.AnimBase.prototype = {
        doMethod: function(attr, start, end) {
	        var me = this;
            return me.method(me.curFrame, start, end - start, me.totalFrames);
        },
        setAttr: function(attr, val, unit) {
            if (noNegativesRE.test(attr) && val < 0) {
                val = 0;
            }            
            Ext.fly(this.el, '_anim').setStyle(attr, val + unit);
        },
        getAttr: function(attr) {
            var flyEl = fly(this.el),
            	val = flyEl.getStyle(attr),
            	getter;
            if (val !== 'auto' && !offsetUnitRE.test(val)) {
                return parseFloat(val);
            }            
 			getter = flyEl['get' + attr.charAt(0).toUpperCase() + attr.substr(1)];
 			return getter ? getter.call(flyEl) : 0;
        },
        setRunAttr: function(attr) {	        
	        var me = this,
	        	isEmpty = Ext.isEmpty,	        	
            	a = me.attrs[attr],
            	unit = a.unit,
            	by = a.by,
            	from = a.from, 
            	to = a.to,
            	ra = (me.runAttrs[attr] = {}),
            	start,
            	end;
            if (isEmpty(to) && isEmpty(by)) return false;
            start = !isEmpty(from) ? from : me.getAttr(attr);
			end = !isEmpty(to) ? to : [];            
            if (!isEmpty(by)) {
                if (Ext.isArray(start)) { 
	                Ext.each(start, function(v,i,s){ end[i] = v + by[i];});
                } else {
                    end = start + by;
                }
            }
            ra.start = start;
            ra.end = end;
            ra.unit = !isEmpty(unit) ? unit : (defaultUnitRE.test(attr) ? 'px' : '');
        },
        init : function(el, attribute, duration, method) {
            var me = this,
            	actualFrames = 0,            	
            	ease = EXTLIB.Easing,
            	anmgr = EXTLIB.AnimMgr;            	
            me.attrs = attribute || {};  
            me.dur = duration || 1;          
            me.method = method || ease.easeNone;
            me.useSec = true;
            me.curFrame = 0;
            me.totalFrames = anmgr.fps;
            me.el = Ext.getDom(el);
            me.isAnimated = false;
            me.startTime = null;
            me.runAttrs = {};
            me.animate = function(callback, scope) {
	            function f() {
		            var me = this;
                	me.onComplete.removeListener(f);                	
	                if (typeof callback == "function") {
	                    callback.call(scope || me, me);
	                }
	            };
	            var me = this;
	            me.onComplete.addListener(f, me);
                me.curFrame = 0;
                me.totalFrames = ( me.useSec ) ? Math.ceil(anmgr.fps * duration) : duration;
                if (!me.isAnimated) anmgr.registerElement(me);
            };
            me.stop = function(finish) {
                if (finish) {
                    me.curFrame = me.totalFrames;
                    me._onTween.fire();
                }
                anmgr.stop(me);
            };
            function onStart() {	            
                me.onStart.fire();
                me.runAttrs = {};
                for (var attr in me.attrs) {
                	me.setRunAttr(attr);
                }
                me.isAnimated = !!(me.startTime = new Date());                
                actualFrames = 0;                
            };
            function onTween() {
                me.onTween.fire({
                    duration: new Date() - me.startTime,
                    curFrame: me.curFrame
               	});                
                for (var attr in me.runAttrs) {
	                var ra = me.runAttrs[attr];
                    me.setAttr(attr, me.doMethod(attr, ra.start, ra.end), ra.unit);
                }
                actualFrames++;
            };
            function onComplete() {
                me.isAnimated = false;                                
                me.onComplete.fire({
                    duration: (new Date() - me.startTime) / 1000,
                    frames: actualFrames,
                    fps: actualFrames / this.duration
                });
                actualFrames = 0;
            };
            me.onStart = new Ext.util.Event(me);
            me.onTween = new Ext.util.Event(me);            
            me.onComplete = new Ext.util.Event(me);
            (me._onStart = new Ext.util.Event(me)).addListener(onStart);
            (me._onTween = new Ext.util.Event(me)).addListener(onTween);
            (me._onComplete = new Ext.util.Event(me)).addListener(onComplete); 
        }
    };
    EXTLIB.AnimMgr = function() {
        var thread = new Ext.util.TaskRunner(),
        	pub;
        function correctFrame(tween) {
            var frames = tween.totalFrames,
            	frame = tween.curFrame,
            	duration = tween.dur,
            	expected = (frame * duration * 1000 / frames),
            	elapsed = (new Date() - tween.startTime),
            	tweak = 0;            	
            if (elapsed < duration * 1000) {
                tweak = Math.round((elapsed / expected - 1) * frame);
            } else {
                tweak = frames - (frame + 1);
            }
            if (tweak > 0 && isFinite(tweak)) {
                if (frame + tweak >= frames) {
                    tweak = frames - (frame + 1);
                }
                tween.curFrame += tweak;
            }
        };	
        pub = {
        	fps : 1000,
        	delay : 1,
        	registerElement : function(tween) {                        
	            tween.run = function(tween){ 
		        	if (!tween || !tween.isAnimated) {
	            		return;	
		            }	
		            if (tween.curFrame++ < tween.totalFrames) {			            
		                if (tween.useSec) {
		                    correctFrame(tween);
		                }
		                tween._onTween.fire();
		            } else {             
		                pub.stop(tween);
		            }    
	            };
	            tween.args = [tween];
	            tween.scope = pub;
	            tween.onStop = function(){ 
		           tween._onComplete.fire();	           
		        };		               
		        tween.interval = pub.delay;
	            thread.start(tween);
	            tween._onStart.fire();            
	        },
        	stop : function(tween) {	        
	        	thread.stop(tween);
        	}
    	}
    	return pub;
    }();
    EXTLIB.Easing = {
        easeNone: function (t, b, c, d) {
            return c * t / d + b;
        },
        easeIn: function (t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOut: function (t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        }
	};
(function() {	    
	function bezier (points, t) {
        var len = points.length,
        	tmp = points.slice(0),
        	C = (1 - t),
        	i, 
        	j;
        for (j = 1; j < len; ++j) {
            for (i = 0; i < len - j; ++i) {	                
                var ti = tmp[i];
                ti[0] = C * ti[0] + t * tmp[i + 1][0];
                ti[1] = C * ti[1] + t * tmp[i + 1][1];
            }
        }               
        return [tmp[0][0], tmp[0][1]];
    }	    
    EXTLIB.Motion = function(el, attrs, duration, method) {
        if (el) {
            EXTLIB.Motion.superclass.constructor.call(this, el, attrs, duration, method);
        }
    };
    Ext.extend(EXTLIB.Motion, EXTLIB.AnimBase);
    var superclass = EXTLIB.Motion.superclass,        	
    	pointsRE = /^points$/i;	
    Ext.apply(EXTLIB.Motion.prototype, {
        setAttr : function(attr, val, unit) {
	        var setAttr = superclass.setAttr,
	        	me = this;
            if (pointsRE.test(attr)) {
                unit = unit || 'px';
                setAttr.call(me, 'left', val[0], unit);
                setAttr.call(me, 'top', val[1], unit);
            } else {
                setAttr.call(me, attr, val, unit);
            }
        },
        getAttr : function(attr) {	        
	        var getAttr = superclass.getAttr,
	        	me = this;
			return pointsRE.test(attr) ? 
				   [getAttr.call(me,'left'),getAttr.call(me,'top')] :
				   getAttr.call(me,attr);
        },
        doMethod : function(attr, start, end) {
            var me = this;
           	return pointsRE.test(attr) 
           			? bezier(me.runAttrs[attr],
                			   me.method(me.curFrame, 0, 100, me.totalFrames) / 100)
					: superclass.doMethod.call(me, attr, start, end);
        },
        setRunAttr : function(attr) {
	        var me = this;
            if (pointsRE.test(attr)) {
                var el = me.el,
                	attrs = me.attrs,
                	points = attrs.points,
                	control = points.control || [],  
                	runAttrs = me.runAttrs,	                		                		                	
                	getXY = EXTLIB.Dom.getXY,
                	from = attrs.points.from || getXY(el),	                	
                	start;               	                		                	
            	function translateValues(val, start, to) {
		            var pageXY = to ? getXY(me.el) : [0,0];
		            return val ? [(val[0] || 0) - pageXY[0] + start[0], 
		            			  (val[1] || 0) - pageXY[1] + start[1]]
		            		   : null;
		        }                
		        control = typeof control == "string" ? [control] : Ext.toArray(control);
                Ext.fly(el, '_anim').position();
                EXTLIB.Dom.setXY(el, from);
                runAttrs[attr] = [start = me.getAttr('points')].concat(control);
                runAttrs[attr].push( 
                	translateValues( points.to || points.by || null, start, !Ext.isEmpty(points.to)) 
                );
            }
            else {
                superclass.setRunAttr.call(me, attr);
            }
        }
    });
})();
})();
(function(){
	var abs = Math.abs,
	 	pi = Math.PI,
	 	asin = Math.asin,
	 	pow = Math.pow,
	 	sin = Math.sin,
		EXTLIB = Ext.lib;
    Ext.apply(EXTLIB.Easing, {
        easeBoth: function (t, b, c, d) {
	        return ((t /= d / 2) < 1)  ?  c / 2 * t * t + b  :  -c / 2 * ((--t) * (t - 2) - 1) + b;               
        },
        easeInStrong: function (t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },
        easeOutStrong: function (t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        easeBothStrong: function (t, b, c, d) {
            return ((t /= d / 2) < 1)  ?  c / 2 * t * t * t * t + b  :  -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        },
        elasticIn: function (t, b, c, d, a, p) {
	        if (t == 0 || (t /= d) == 1) {
                return t == 0 ? b : b + c;
            }	            
            p = p || (d * .3);	            
			var s;
			if (a >= abs(c)) {
				s = p / (2 * pi) * asin(c / a);
			} else {
				a = c;
				s = p / 4;
			}
            return -(a * pow(2, 10 * (t -= 1)) * sin((t * d - s) * (2 * pi) / p)) + b;
        }, 	
		elasticOut: function (t, b, c, d, a, p) {
	        if (t == 0 || (t /= d) == 1) {
                return t == 0 ? b : b + c;
            }	            
            p = p || (d * .3);	            
			var s;
			if (a >= abs(c)) {
				s = p / (2 * pi) * asin(c / a);
			} else {
				a = c;
				s = p / 4;
			}
            return a * pow(2, -10 * t) * sin((t * d - s) * (2 * pi) / p) + c + b;	 
        }, 	
        elasticBoth: function (t, b, c, d, a, p) {
            if (t == 0 || (t /= d / 2) == 2) {
                return t == 0 ? b : b + c;
            }		         	
            p = p || (d * (.3 * 1.5)); 	            
            var s;
            if (a >= abs(c)) {
	            s = p / (2 * pi) * asin(c / a);
            } else {
	            a = c;
                s = p / 4;
            }
            return t < 1 ?
            	   	-.5 * (a * pow(2, 10 * (t -= 1)) * sin((t * d - s) * (2 * pi) / p)) + b :
                    a * pow(2, -10 * (t -= 1)) * sin((t * d - s) * (2 * pi) / p) * .5 + c + b;
        },
        backIn: function (t, b, c, d, s) {
            s = s ||  1.70158; 	            
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        backOut: function (t, b, c, d, s) {
            if (!s) {
                s = 1.70158;
            }
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        backBoth: function (t, b, c, d, s) {
            s = s || 1.70158; 	            
            return ((t /= d / 2 ) < 1) ?
                    c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b : 	            
            		c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        },
        bounceIn: function (t, b, c, d) {
            return c - EXTLIB.Easing.bounceOut(d - t, 0, c, d) + b;
        },
        bounceOut: function (t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            }
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        },
        bounceBoth: function (t, b, c, d) {
            return (t < d / 2) ?
                   EXTLIB.Easing.bounceIn(t * 2, 0, c, d) * .5 + b : 
            	   EXTLIB.Easing.bounceOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
    });
})();
(function() {
    var EXTLIB = Ext.lib;
	EXTLIB.Anim.color = function(el, args, duration, easing, cb, scope) {
	    return EXTLIB.Anim.run(el, args, duration, easing, cb, scope, EXTLIB.ColorAnim);
	}
    EXTLIB.ColorAnim = function(el, attributes, duration, method) {
        EXTLIB.ColorAnim.superclass.constructor.call(this, el, attributes, duration, method);
    };
    Ext.extend(EXTLIB.ColorAnim, EXTLIB.AnimBase);
    var superclass = EXTLIB.ColorAnim.superclass,
    	colorRE = /color$/i,
    	transparentRE = /^transparent|rgba\(0, 0, 0, 0\)$/;
    function parseColor(s) {	     
	        var pi = parseInt,	        	
        	c;	        
        if (s.length == 3) {
            c = s;
        } else if (s.charAt(0) == "r") {		           
			c = s.replace(/[^0-9,]/g,"").split(',');
			c = [ pi(c[1], 10), pi(c[2], 10), pi(c[3], 10) ];
        } else if (s.length < 6) {
            c = s.replace("#","").match(/./g);	
            c = [ pi(c[0] + c[0], 16), pi(c[1] + c[1], 16), pi(c[2] + c[2], 16) ];
        } else {
            c = s.replace("#","").match(/./g);
            c = [ pi(c[0] + c[1] , 16), pi(c[2] + c[3], 16), pi(c[4] + c[5], 16) ];	            
        }           
        return c;
    }	
    Ext.apply(EXTLIB.ColorAnim.prototype, {
        getAttr : function(attr) {
            var me = this,
            	el = me.el,
            	val;            	
            if (colorRE.test(attr)) {
                while(el && transparentRE.test(val = fly(el).getStyle(attr))) {
	                el = el.parentNode;
	                val = "fff";
                }
            } else {
                val = superclass.getAttr.call(me, attr);
            }
            return val;
        },
        doMethod : function(attr, start, end) {
            var me = this,
            	val,
            	floor = Math.floor;            
            if (colorRE.test(attr)) {
                val = [];
	            Ext.each(start, function(v, i) {
                    val[i] = superclass.doMethod.call(me, attr, v, end[i]);
                });
                val = 'rgb(' + floor(val[0]) + ',' + floor(val[1]) + ',' + floor(val[2]) + ')';
            } else {
                val = superclass.doMethod.call(me, attr, start, end);
            }
            return val;
        },
        setRunAttr : function(attr) {
	        var me = this,
	        	isEmpty = Ext.isEmpty;
            superclass.setRunAttr.call(me, attr);
            if (colorRE.test(attr)) {
                var attribute = me.attrs[attr],
                	ra = me.runAttrs[attr],	                	
                	start = parseColor(ra.start),
               		end = parseColor(ra.end);
                if (isEmpty(attribute.to) && !isEmpty(attribute.by)) {
                    end = parseColor(attribute.by);	
	                Ext.each(start, function(v, i) {
                        end[i] = v + end[i];
                    });
                }
                ra.start = start;
                ra.end = end;
            }
        }
	});
})();	
(function() {
    var EXTLIB = Ext.lib;
	EXTLIB.Anim.scroll = function(el, args, duration, easing, cb, scope) {	        
	    return EXTLIB.Anim.run(el, args, duration, easing, cb, scope, EXTLIB.Scroll);
	}
    EXTLIB.Scroll = function(el, attributes, duration, method) {
        if (el) {
            EXTLIB.Scroll.superclass.constructor.call(this, el, attributes, duration, method);
        }
    };
    Ext.extend(EXTLIB.Scroll, EXTLIB.ColorAnim);
    var Y = Ext.lib,
    	superclass = EXTLIB.Scroll.superclass,
    	SCROLL = 'scroll';
    Ext.apply(EXTLIB.Scroll.prototype, {
        toString : function() {
            var el = this.el;	            
            return ("Scroll " + (el.id || el.tagName));
        },
        doMethod : function(attr, start, end) {
            var val,
            	me = this,
            	curFrame = me.curFrame,
            	totalFrames = me.totalFrames;
            if (attr == SCROLL) {
                val = [me.method(curFrame, start[0], end[0] - start[0], totalFrames),
                       me.method(curFrame, start[1], end[1] - start[1], totalFrames)];
            } else {
                val = superclass.doMethod.call(me, attr, start, end);
            }
            return val;
        },
        getAttr : function(attr) {
            var val = null,
            	me = this;
            if (attr == SCROLL) {
                val = [ me.el.scrollLeft, me.el.scrollTop ];
            } else {
                val = superclass.getAttr.call(me, attr);
            }
            return val;
        },
        setAttr : function(attr, val, unit) {
            var me = this;
            if (attr == SCROLL) {
                me.el.scrollLeft = val[0];
                me.el.scrollTop = val[1];
            } else {
                superclass.setAttr.call(me, attr, val, unit);
            }
        }
    });
})();
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
