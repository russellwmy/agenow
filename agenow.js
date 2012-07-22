(function($) {
    // Add format function to String object
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/\{\{|\}\}|\{(\d+)\}/g, function(curlyBrack, index) {
            return ((curlyBrack == "{{") ? "{" : ((curlyBrack == "}}") ? "}" : args[index]));
        });
    };
    // Add ISOString output function
    if (!Date.prototype.toISOString) {
        Date.prototype.toISOString = function() {
            function pad(n) {
                return n < 10 ? '0' + n : n
            }
            return this.getUTCFullYear() + '-' + pad(this.getUTCMonth() + 1) + '-' + pad(this.getUTCDate()) + 'T' + pad(this.getUTCHours()) + ':' + pad(this.getUTCMinutes()) + ':' + pad(this.getUTCSeconds()) + 'Z';
        };
    };
    // Add ISOString parsing function 
    Date.prototype.setISOString = function(string) {
        var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" + "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" + "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
        var d = string.match(new RegExp(regexp));
        var offset = 0;
        var date = new Date(d[1], 0, 1);
        if (d[3]) {
            date.setMonth(d[3] - 1);
        }
        if (d[5]) {
            date.setDate(d[5]);
        }
        if (d[7]) {
            date.setHours(d[7]);
        }
        if (d[8]) {
            date.setMinutes(d[8]);
        }
        if (d[10]) {
            date.setSeconds(d[10]);
        }
        if (d[12]) {
            date.setMilliseconds(Number("0." + d[12]) * 1000);
        }
        if (d[14]) {
            offset = (Number(d[16]) * 60) + Number(d[17]);
            offset *= ((d[15] == '-') ? 1 : -1);
        }
        offset -= date.getTimezoneOffset();
        time = (Number(date) + (offset * 60 * 1000));
        this.setTime(Number(time));
    }
    // Output dictionary for different languages
    var locales = {
        'en' : {
            'second' : 'right now',
            'seconds' : '{0} seconds ago',
            'minute' : 'about a minute ago',
            'minutes' : '{0} minutes ago',
            'hour' : 'about a hour ago',
            'hours' : '{0} hours ago',
            'day' : 'yesterday',
            'days' : '{0} days ago',
            'month' : 'about a month ago',
            'months' : '{0} months ago',
            'year' : 'about a year ago',
            'years' : '{0} years ago'
        },
        'yue' : {
            'second' : '啱啱',
            'seconds' : '{0} 秒鐘前',
            'minute' : '1 分鐘前',
            'minutes' : '{0} 分鐘前',
            'hour' : '1 個鐘前',
            'hours' : '{0} 個鐘前',
            'day' : '噚日',
            'days' : '{0} 日前',
            'month' : '1 個月前',
            'months' : '{0} 個月前',
            'year' : '1 年前',
            'years' : '{0} 年前'
        }
    }
    // Calcuate age text
    var toText = function(a, lang) {
        var b = new Date();
        var c = typeof a == 'date ' ? a : new Date(a);
        var d = b - c;
        var e = 1000, minute = e * 60, hour = minute * 60, day = hour * 24, week = day * 7, year=day * 365;
        if (isNaN(d) || d < 0) {
            return ' ';
        }
        if (d < e * 7) {
            return locales[lang]['second'];
        }
        if (d < minute) {
            return locales[lang]['seconds'].format(Math.floor(d / e));
        }
        if (d < minute * 2) {
            return locales[lang]['minute'];
        }
        if (d < hour) {
            return locales[lang]['minutes'].format(Math.floor(d / minute));
        }
        if (d < hour * 2) {
            return locales[lang]['hour'];
        }
        if (d < day) {
            return locales[lang]['hours'].format(Math.floor(d / hour));
        }
        if (d > day && d < day * 2) {
            return locales[lang]['day'];
        }
        if (d < year) {
            return locales[lang]['days'].format(Math.floor(d / day));
        }
        if (d > year && d < year*2 ){
            return locales[lang]['year'];
        }else{
            return locales[lang]['years'].format(Math.floor(d / year));
        }
    };
    // jQuery interface
    $.fn.agenow = function(options) {
        var opts = $.extend({}, $.fn.agenow.defaults, options);
        return this.each(function() {
            var o = opts;
            var lang = o.lang;
            var timeStr = $(this).attr('time');
            var time = new Date();
            time.setISOString(timeStr);
            var text = toText(time, lang);
            $(this).text(text);
        });
    };
    // Default parameters
    $.fn.agenow.defaults = {
        lang : 'yue'
    };
})(jQuery);