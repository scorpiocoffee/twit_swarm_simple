'use strict';

console.log('Hotwords is ready.');

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

exports.removeDuplicate = function removeDuplicate(array) {	
	var unique = array.reduce(function(a,b) {
		if (a.indexOf(b) < 0 ) a.push(b);
		return a;},[]);
	return unique;
};

exports.keywordsMap = function keywordsMap(string, array) {
	
	var m = new Map();	
	for(var i=0;i<array.length; i++){
		var count = string.split(array[i]).length -1;
		m.set(array[i], count);
	}
	
	return m;
};

