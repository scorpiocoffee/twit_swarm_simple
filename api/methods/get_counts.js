'use strict';

var twitter = require('twit');

var client = new twitter({
	consumer_key        : '0UyNUGhptJgezvEBL6JG7ZW9v',
	consumer_secret     : 'U3BhoWnGtp5LPzDZabdmuKEKPkfE7a1vFej4tVtKYN1HAeVb2N',
	access_token        : '731213551197687808-jfhNALqo4ALXK2MBgEyifdLZCa7r3EB',
	access_token_secret : 's3uP57Amo6OerHmhuKcqXUOXxlHXf7AMVVqECYBx5VMmR'
});


module.exports.intersection = function intersection(array1, array2) {
	var rs = [], x = array1.length;
	while (x--) array2.indexOf(array1[x]) != -1 && rs.push(array1[x]);
	return rs;
}

module.exports.gethottweets = function gethottweets(hot_words, allnames, times, t, all_results, functio) {
	client.get('search/tweets', {q: 'from:@' + allnames[times] + t, count: 100}, function(err, data, response) {
    	var n = '';
    	var tw = data.statuses;
    	var oall = [];
		for(var i in tw) {			
			var w = hotwords.parseWords(tw[i].text);
			n = n + ' ' + w;
		}
		n = n.trim();
		var m = n.split(/\s+/);
		m = hotwords.removeDuplicate(m);
		m = hotwords.keywordsMap(n, m);
		for(var [key, value] of m) {
			hot_words.push(key);
			hot_words.push(value);
			oall.push(key);
			hot_words = [];
		}
		if(times === allnames.length - 1) {
			all_results.push(oall);
			functio(all_results);
		}
		else {
			times++;
			all_results.push(oall);
			gethottweets(hot_words,allnames,times,t,all_results,functio);
		}
	});
}
