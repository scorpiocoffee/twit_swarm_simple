'use strict';

/**
 * 
 * All the parse words' methods
 */


/**
 *
 * To show this file has been ready to use.
 */
console.log('Hotwords is ready.');


/**
 * 
 * parse and delete all the non-text parts.
 * 
 * @param string: the text needed to be parsed.
 * @return str: return a string only had characters.
 */

exports.parseWords = function parseWords(string) {
	var str = string.toLowerCase();
	str = str.replace(/http[^\s]+/ig,' ');
	str = str.replace(/(@|#)[^\s]+/ig, ' ');
	str = str.replace(/[^a-z\s]/ig, ' ');
	str = str.replace(/(&|\')[^\s]+/ig, ' ');	
	str = str.replace(/\b(\w\w|\w)\b/g, '');
	str = str.trim();
	return str;
};


/**
 * 
 * delete all the duplicated parts.
 * 
 * @param array: the array contains all the words.
 * @return unique: return an array only appeared once.
 */
exports.removeDuplicate = function removeDuplicate(array) {	
	var unique = array.reduce(function(a,b) {
		if (a.indexOf(b) < 0 ) a.push(b);
		return a;},[]);
	return unique;
};

/**
 * 
 * using the map to calculate the count of each word.
 * 
 * @param string: the text only contained characters.
 * @param array: the array contains the words without duplicated.
 * @return unique: return a map contains every word and its count.
 */
exports.keywordsMap = function keywordsMap(string, array) {
	
	var m = new Map();	
	for(var i=0;i<array.length; i++){
		var count = string.split(array[i]).length -1;
		m.set(array[i], count);
	}
	
	return m;
};

