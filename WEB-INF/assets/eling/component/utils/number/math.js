define(function(require,exports,module){
	
	var NumberFormatter = require('./NumberFormatter');
	
	var math = {
			/**
			 * 判断是否是number
			 */
			isNumber : function(value) {
				return typeof value === 'number';
			},
			/**
			 * 判断是否是integer类型
			 */
			isInteger : function(value) {
				return isFinite(value)
					? (value == Math.round(value))
					: false;
			  // Note: we use ==, not ===, as we can have Booleans as well
			},
			/**
			 * 判断number的正负
			 */
			sign : function(x) {
				if (x > 0) {
					return 1;
				}
				else if (x < 0) {
					return -1;
				}
				else {
					return 0;
				}
			},
			/**
			 * 将数字格式化为指定字符串
			 *
			 * 语法:
			 *
			 *    format(value)
			 *    format(value, options)
			 *    format(value, precision)
			 *    format(value, fn)
			 *
			 * Where:
			 *
			 *    {number} value   要格式化的值
			 *    {Object} 传入参数. 说明:
			 *                     {string} notation
			 *                         Number符号. 选项:
			 *                         'fixed'          总是使用正则符号.
			 *                                          例如 '123.40' and '14000000'
			 *                         'exponential'    总是使用指数符号.
			 *                                          例如 '1.234e+2' and '1.4e+7'
			 *                                          
			 *                     {number} precision   精确小数位数，范围（0-16），默认为0
			 *                     
			 *    {Function} fn    自定义格式化函数. 可以用来重写内置符号. 该方法必须返回string
			 *
			 * Examples:
			 *
			 *    format(6.4);                                        // '6.4'
			 *    format(1240000);                                    // '1.24e6'
			 *    format(1/3);                                        // '0.3333333333333333'
			 *    format(1/3, 3);                                     // '0.333'
			 *    format(21385, 2);                                   // '21000'
			 *    format(12.071, {notation: 'fixed'});                // '12'
			 *    format(2.3,    {notation: 'fixed', precision: 2});  // '2.30'
			 *    format(52.8,   {notation: 'exponential'});          // '5.28e+1'
			 *
			 * @param {number} value
			 * @param {Object | Function | number} [options]
			 * @return {string} str The formatted value
			 */
			format : function(value, options) {
			  if (typeof options === 'function') {
			    // handle format(value, fn)
			    return options(value);
			  }

			  // handle special cases
			  if (value === Infinity) {
			    return 'Infinity';
			  }
			  else if (value === -Infinity) {
			    return '-Infinity';
			  }
			  else if (isNaN(value)) {
			    return 'NaN';
			  }

			  // default values for options
			  var notation = 'auto';
			  var precision = undefined;

			  if (options) {
			    // determine notation from options
			    if (options.notation) {
			      notation = options.notation;
			    }

			    // determine precision from options
			    if (this.isNumber(options)) {
			      precision = options;
			    }
			    else if (options.precision) {
			      precision = options.precision;
			    }
			  }

			  // handle the various notations
			  switch (notation) {
			    case 'fixed':
			      return this.toFixed(value, precision);

			    case 'exponential':
			      return this.toExponential(value, precision);

			    case 'auto':
			      return this.toPrecision(value, precision, options && options.exponential)

			          // remove trailing zeros after the decimal point
			          .replace(/((\.\d*?)(0+))($|e)/, function () {
			            var digits = arguments[2];
			            var e = arguments[4];
			            return (digits !== '.') ? digits + e : e;
			          });

			    default:
			      throw new Error('Unknown notation "' + notation + '". ' +
			          'Choose "auto", "exponential", or "fixed".');
			  }
			},
			/**
			 * 在指数符号上格式化. Like '1.23e+5', '2.3e+0', '3.500e-3'
			 * @param {number} value
			 * @param {number} [precision]  格式化要输出的位数
			 * @returns {string} str
			 */
			toExponential : function(value, precision) {
			  return new NumberFormatter(value).toExponential(precision);
			},
			/**
			 * 格式化一个具有一定精度的数字
			 * @param {number} value
			 * @param {number} [precision=undefined] Optional number of digits.
			 * @param {{lower: number, upper: number}} [options]  By default:
			 *                                                    lower = 1e-3 (excl)
			 *                                                    upper = 1e+5 (incl)
			 * @return {string}
			 */
			toPrecision : function(value, precision, options) {
			  return new NumberFormatter(value).toPrecision(precision, options);
			},
			/**
			 * 计算数的有效位数
			 *
			 * For example:
			 *   2.34 returns 3
			 *   0.0034 returns 2
			 *   120.5e+30 returns 4
			 *
			 * @param {number} value
			 * @return {number} digits   Number of significant digits
			 */
			digits : function(value) {
			  return value
			      .toExponential()
			      .replace(/e.*$/, '')          // remove exponential notation
			      .replace( /^0\.?0*|\./, '')   // remove decimal point and leading zeros
			      .length;
			},
			DBL_EPSILON : Number.EPSILON || 2.2204460492503130808472633361816E-16,
			/**
			 * 比较浮点数
			 * @param {number} x          First value to compare
			 * @param {number} y          Second value to compare
			 * @param {number} [epsilon]  The maximum relative difference between x and y
			 *                            If epsilon is undefined or null, the function will
			 *                            test whether x and y are exactly equal.
			 * @return {boolean} 两者是否相等
			*/
			nearlyEqual : function(x, y, epsilon) {
			  // if epsilon is null or undefined, test whether x and y are exactly equal
			  if (epsilon == null) return x == y;

			  // use "==" operator, handles infinities
			  if (x == y) return true;

			  // NaN
			  if (isNaN(x) || isNaN(y)) return false;

			  // at this point x and y should be finite
			  if(isFinite(x) && isFinite(y)) {
			    // check numbers are very close, needed when comparing numbers near zero
			    var diff = Math.abs(x - y);
			    if (diff < this.DBL_EPSILON) {
			      return true;
			    }
			    else {
			      // use relative error
			      return diff <= Math.max(Math.abs(x), Math.abs(y)) * epsilon;
			    }
			  }

			  // Infinite and Number or negative Infinite and positive Infinite cases
			  return false;
			},
			/**
			 * 四舍五入number
			 */
			toFixed : function(value, precision) {
				  return new NumberFormatter(value).toFixed(precision);
			},
			/**
			 * 生成一定范围的随机数
			 * @param min 最小数
			 * @param max 最大数
			 * @return number
			 */
			random : function(min,max){
				return Math.floor(min+Math.random()*(max-min));
			}
			/**
			 * TODO 四舍五入，保留n位小数，代码暂留
			 */
			/*toFixed : function(value,d){
				var s = value + "";
			    if (!d) d = 0;
			    if (s.indexOf(".") == -1) s += ".";
			    s += new Array(d + 1).join("0");
			    if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (d + 1) + "})?)\\d*$").test(s)) {
			        var s = "0" + RegExp.$2,
			        pm = RegExp.$1,
			        a = RegExp.$3.length,
			        b = true;
			        if (a == d + 2) {
			            a = s.match(/\d/g);
			            if (parseInt(a[a.length - 1]) > 4) {
			                for (var i = a.length - 2; i >= 0; i--) {
			                    a[i] = parseInt(a[i]) + 1;
			                    if (a[i] == 10) {
			                        a[i] = 0;
			                        b = i != 1;
			                    } else break;
			                }
			            }
			            s = a.join("").replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"), "$1.$2");
			        }
			        if (b) s = s.substr(1);
			        return (pm + s).replace(/\.$/, "");
			    }
			    return value + "";
			}*/
			
	};
	
	module.exports = math;
});