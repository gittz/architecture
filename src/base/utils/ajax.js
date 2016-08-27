/**
 * BI工具类
 * @class BI
 */
$.extend(BI, {
    /**
     * 返回对中日韩问做了特殊转换的字符串
     *
     * @static
     * @param text 需要做编码的字符串
     * @return {String} 编码后的字符串
     */
    cjkEncode: function (text) {
        // alex:如果非字符串,返回其本身(cjkEncode(234) 返回 ""是不对的)
        if (typeof text !== 'string') {
            return text;
        }

        var newText = "";
        for (var i = 0; i < text.length; i++) {
            var code = text.charCodeAt(i);
            if (code >= 128 || code === 91 || code === 93) {//91 is "[", 93 is "]".
                newText += "[" + code.toString(16) + "]";
            } else {
                newText += text.charAt(i);
            }
        }

        return newText
    },
    /**
     * 将cjkEncode处理过的字符串转化为原始字符串
     *
     * @static
     * @param text 需要做解码的字符串
     * @return {String} 解码后的字符串
     */
    cjkDecode: function (text) {
        if (text == null) {
            return "";
        }
        //查找没有 "[", 直接返回.  kunsnat:数字的时候, 不支持indexOf方法, 也是直接返回.
        if (!isNaN(text) || text.indexOf('[') == -1) {
            return text;
        }

        var newText = "";
        for (var i = 0; i < text.length; i++) {
            var ch = text.charAt(i);
            if (ch == '[') {
                var rightIdx = text.indexOf(']', i + 1);
                if (rightIdx > i + 1) {
                    var subText = text.substring(i + 1, rightIdx);
                    //james：主要是考虑[CDATA[]]这样的值的出现
                    if (subText.length > 0) {
                        ch = String.fromCharCode(eval("0x" + subText));
                    }

                    i = rightIdx;
                }
            }

            newText += ch;
        }

        return newText;
    },

    //replace the space(&nbsp;) of html with " "
    //Only "&nbsp;" need to be decoded, because "&amp;", "&lt;", "&gt;", "&apos;" and "&quot;"
    //can be paresed correctly by the org.w3c.dom to the eaxctly values '&', "<", ">", "'", """
    htmlSpaceDecode: function (text) {
        return (text == null) ? '' : String(text).replace(/&nbsp;/, ' ');
    },
    //replace the html special tags
    htmlEncode: function (text) {
        return (text == null) ? '' : String(text).replace(/&/g, '&amp;').replace(/\"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    },
    //html decode
    htmlDecode: function (text) {
        return (text == null) ? '' : String(text).replace(/&amp;/g, '&').replace(/&quot;/g, '\"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
    },
    //json encode
    jsonEncode: function (o) {
        //james:这个Encode是抄的EXT的
        var useHasOwn = {}.hasOwnProperty ? true : false;

        // crashes Safari in some instances
        //var validRE = /^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/;

        var m = {
            "\b": '\\b',
            "\t": '\\t',
            "\n": '\\n',
            "\f": '\\f',
            "\r": '\\r',
            '"': '\\"',
            "\\": '\\\\'
        };

        var encodeString = function (s) {
            if (/["\\\x00-\x1f]/.test(s)) {
                return '"' + s.replace(/([\x00-\x1f\\"])/g, function (a, b) {
                        var c = m[b];
                        if (c) {
                            return c;
                        }
                        c = b.charCodeAt();
                        return "\\u00" +
                            Math.floor(c / 16).toString(16) +
                            (c % 16).toString(16);
                    }) + '"';
            }
            return '"' + s + '"';
        };

        var encodeArray = function (o) {
            var a = ["["], b, i, l = o.length, v;
            for (i = 0; i < l; i += 1) {
                v = o[i];
                switch (typeof v) {
                    case "undefined":
                    case "function":
                    case "unknown":
                        break;
                    default:
                        if (b) {
                            a.push(',');
                        }
                        a.push(v === null ? "null" : BI.jsonEncode(v));
                        b = true;
                }
            }
            a.push("]");
            return a.join("");
        };

        if (typeof o == "undefined" || o === null) {
            return "null";
        } else if ($.isArray(o)) {
            return encodeArray(o);
        } else if (o instanceof Date) {
            /*
             * alex:原来只是把年月日时分秒简单地拼成一个String,无法decode
             * 现在这么处理就可以decode了,但是JS.jsonDecode和Java.JSONObject也要跟着改一下
             */
            return BI.jsonEncode({
                __time__: o.getTime()
            })
        } else if (typeof o == "string") {
            return encodeString(o);
        } else if (typeof o == "number") {
            return isFinite(o) ? String(o) : "null";
        } else if (typeof o == "boolean") {
            return String(o);
        } else if ($.isFunction(o)) {
            return String(o);
        } else {
            var a = ["{"], b, i, v;
            for (i in o) {
                if (!useHasOwn || o.hasOwnProperty(i)) {
                    v = o[i];
                    switch (typeof v) {
                        case "undefined":
                        case "unknown":
                            break;
                        default:
                            if (b) {
                                a.push(',');
                            }
                            a.push(BI.jsonEncode(i), ":",
                                v === null ? "null" : BI.jsonEncode(v));
                            b = true;
                    }
                }
            }
            a.push("}");
            return a.join("");
        }
    },
    /**
     * hiram 优化了一下，但仅为了找o.__time__还是多耗了点时间
     * richie:为了找__time__，需要把整个JSON树都遍历一遍，耗时不少，应该要想办法优化
     */
    jsonDecode: function (text) {

        try {
            // 注意0啊
            //var jo = $.parseJSON(text) || {};
            var jo = $.parseJSON(text);
            if (jo == null) {
                jo = {};
            }
        } catch (e) {
            /*
             * richie:浏览器只支持标准的JSON字符串转换，而jQuery会默认调用浏览器的window.JSON.parse()函数进行解析
             * 比如：var str = "{'a':'b'}",这种形式的字符串转换为JSON就会抛异常
             */
            try {
                jo = new Function("return " + text)() || {};
            } catch (e) {
                //do nothing
            }
            if (jo == null) {
                jo = [];
            }
        }
        if (!BI._hasDateInJson(text)) {
            return jo;
        }
        return (function (o) {
            if (typeof o === "string") {
                return o;
            }
            if (o && o.__time__ != null) {
                return new Date(o.__time__);
            }
            for (var a in o) {
                if (o[a] == o || typeof o[a] == 'object' || $.isFunction(o[a])) {
                    break;
                }
                o[a] = arguments.callee(o[a]);
            }

            return o;
        })(jo);
    },

    _hasDateInJson: function (json) {
        if (!json || typeof json !== "string") {
            return false;
        }
        return json.indexOf("__time__") != -1;
    },
    /**
     * 对指定的键值对对象做中日韩文编码处理
     *
     * @static
     * @param {Object} o 键值对对象
     * @return {Object} 经过了中日韩文编码处理的键值对
     */
    cjkEncodeDO: function (o) {
        if ($.isPlainObject(o)) {
            var result = {};
            $.each(o, function (k, v) {
                if (!(typeof v == "string")) {
                    v = BI.jsonEncode(v);
                }
                //wei:bug 43338，如果key是中文，cjkencode后o的长度就加了1，ie9以下版本死循环，所以新建对象result。
                k = BI.cjkEncode(k);
                result[k] = BI.cjkEncode(v);
            });
            return result;
        }
        return o;
    },

    /**
     * 封装过的jQuery.ajax()函数，对data参数做了中日韩文编码处理
     *
     * @static
     * @param {Object} options ajax参数
     */
    ajax: function (options) {
        if (options) {
            options.data = BI.cjkEncodeDO(options.data);
        }

        $.ajax(options);
    },

    /**
     * 封装过的jQuery.get()函数，对data参数做了中日航文编码处理
     *
     * @static
     * @param url 异步请求的地址
     * @param data 异步请求的参数
     * @param callback 异步请求的回调函数
     * @param type 返回值的类型
     */
    get: function (url, data, callback, type) {
        // shift arguments if data argument was omitted
        if ($.isFunction(data)) {
            type = type || callback;
            callback = data;
            data = undefined;
        }

        if (data) {
            data = BI.cjkEncodeDO(data);
        }

        $.get(url, data, callback, type);
    },
    /**
     * 封装过的jQuery.post()函数，对data参数做了中日韩文编码处理
     *
     * @static
     * @param url 异步请求的地址
     * @param data 异步请求的参数
     * @param callback 异步请求的回调函数
     * @param type 返回值的类型
     */
    post: function (url, data, callback, type) {
        // shift arguments if data argument was omitted
        if ($.isFunction(data)) {
            type = type || callback;
            callback = data;
            data = undefined;
        }

        if (data) {
            data = BI.cjkEncodeDO(data);
        }

        $.post(url, data, callback, type);
    },

    /**
     * 封装过的jQuery.param()函数，其中的值做了中日韩文编码处理
     * @static
     * @param a  参数集合
     * @return 编码后的参数集合
     */
    param: function (a) {
        a = BI.cjkEncodeDO(a);

        return $.param(a);
    },

    /**
     * 对url做参数添加和编码处理
     * @static
     * @param url 原始地址
     * @param data  要添加的参数键值对对象
     * @return {String} 经过了编码处理和参数添加的地址
     */
    url: function (url, data) {
        if ($.isPlainObject(data)) {
            return url + "?" + BI.param(data);
        }

        return BI.cjkEncode(url);
    }
});