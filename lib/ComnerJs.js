(function(){
/**
 * ComnerJs namespace.
 *
 * @namespace
 */
var ComnerJs = {};
/**
 * Dispatches input messages, according to regular expression test.
 *   This is heavily based on Grape2D's MessageDispatcher.
 * {@link https://github.com/ruipgil/grape2d/blob/68848f08405165fe5f4b1ab9ef41eaea6f781906/src/utils/MessageDispatcher.js}
 * 
 * @param {!Object} options Setup options.
 * @param {?} options.in Readable stream.
 * @param {!function(!string):!string=} options.processor Message
 *   pre-processor. It can be used to trim the message, removing the
 *   <code>\n</code> character.
 * @param {!function(!ComnerJs.ConsoleDispatcher)=} inline Function to execute
 *   at the end of the constructor. It allows to add functionality,
 *   at the declaration level, with needing to declare a variable.
 * @constructor
 */
ComnerJs.ConsoleDispatcher = function(options) {
	options = options || {};
	/**
	 * Stack of object with the regular expressions and callbacks.
	 * 
	 * @type {!Array.<!Object.<!string, !(function(!string, !RegExp=)|RegExp)>>}
	 * @private
	 */
	this.stack = [];
	/**
	 * Input stream.
	 *
	 * @type {?}
	 * @private
	 */
	this.in = options.in;
	/**
	 * Message pre-processor.
	 * 
	 * @type {!function(!string):!string}
	 * @private
	 */
	this.processor = options.processor || function(str){ return str; };
	/**
	 * Indicates if the current dispatch cycle is to be skipped.
	 *
	 * @type {!Boolean}
	 * @private
	 */
	this.toSkip = false;

	var that = this;
	this.in.on("data", function(data){
		that.dispatch(that.processor(data.toString()));
	});
	this.in.resume();

	if(options.inline){
		options.inline(this);
	}
};

ComnerJs.ConsoleDispatcher.prototype = {
	constructor: ComnerJs.ConsoleDispatcher,
	/**
	 * Adds callback for a message that returns <code>true</code>
	 *   in the test of the regular expression.
	 *
	 * @param {!RegExp} regex Regular expression to match.
	 * @param {function(!string, !RegExp=)} callback Function to be
	 *   called when the message matches the regular expression.
	 * @public
	 */
	add: function(regex, callback) {
		this.stack.push({
			regex: regex,
			callback: callback
		});
	},
	/**
	 * Removes a callback.
	 *
	 * @param  {!RegExp} regex Regular expression associated with the
	 *   callback to remove.
	 * @public
	 */
	remove: function(regex) {
		var rs = regex.toString();
		for (var i = 0; i < this.stack.length; i++) {
			if (this.stack[i].regex.toString() == rs) {
				this.stack.splice(i, 1);
			}
		}
	},
	/**
	 * Dispatches the callbacks associated with the regular expressions
	 *   matching the message.
	 *
	 * @param  {!string} message Message to be dispatched.
	 *   through.
	 * @public
	 */
	dispatch: function(message) {
		var current;
		for (var i = 0; i < this.stack.length; i++) {
			current = this.stack[i];
			if (current.regex.test(message)) {
				this.stack[i].callback(message, current.regex);
				if(this.toSkip){
					this.toSkip = false;
					return;
				}
			}
		}
	},
	/**
	 * Skips the current dispatching cycle.
	 *
	 * @public
	 */
	skip: function(){
		this.toSkip = true;
	}
};

module.exports = ComnerJs;
})();