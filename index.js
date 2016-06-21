'use strict';

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var errorhandler = require('errorhandler');
var server = require('http').createServer(app);
var io = require('socket.io')(http);
var socket = io.listen(server);
var twitter = require('twit');
var hotwords = require('./api/words_parse');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(path.normalize(__dirname + '/'), 'client')));
app.get('/*', function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

var client = new twitter({
	consumer_key        : '0UyNUGhptJgezvEBL6JG7ZW9v',
	consumer_secret     : 'U3BhoWnGtp5LPzDZabdmuKEKPkfE7a1vFej4tVtKYN1HAeVb2N',
	access_token        : '731213551197687808-jfhNALqo4ALXK2MBgEyifdLZCa7r3EB',
	access_token_secret : 's3uP57Amo6OerHmhuKcqXUOXxlHXf7AMVVqECYBx5VMmR'
});

function intersection(array1, array2) {
	var rs = [], x = array1.length;
	while (x--) array2.indexOf(array1[x]) != -1 && rs.push(array1[x]);
	return rs;
}

function gethottweets(hot_words, allnames, times, t, all_results, functio) {
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

io.on('connection', function(socket) {

	socket.on('search_query', function(data) {

		var content = data;
		var single_results = [];
		var all_results = [];
						
		client.get('search/tweets', { q: content, count: 100 }, function(err, data1, response) {
			var tt = data1.statuses;

			for(var i in tt) {
				tt[i].user.screen_name = '@' + tt[i].user.screen_name;
				tt[i].created_at = tt[i].created_at.replace('+0000', '');
				single_results.push(tt[i].user.screen_name);
				single_results.push(tt[i].created_at);
				single_results.push(tt[i].text);
				single_results.push(tt[i].user.profile_image_url);
				single_results.push(tt[i].id_str);
				all_results.push(single_results);
				single_results = [];
			}
			var max_id1;
			if(all_results.length != 0) {

				max_id1 = all_results[0].id;
				client.get('search/tweets', { q: content, count: 100, max_id: (max_id1-100) }, function(err, data2, response) {
							
					var max_id2;
					if(all_results.length<100) {
						max_id2 = max_id1;
					}
					else {

						var tt = data2.statuses;
						for(var i in tt) {

							tt[i].user.screen_name = '@' + tt[i].user.screen_name;
							tt[i].created_at = tt[i].created_at.replace('+0000', '');
							single_results.push(tt[i].user.screen_name);
							single_results.push(tt[i].created_at);
							single_results.push(tt[i].text);
							single_results.push(tt[i].user.profile_image_url);
							single_results.push(tt[i].id_str);

							all_results.push(single_results);
							single_results = [];
						}
						max_id2 = all_results[99].id;
					}
					client.get('search/tweets', { q: content, count: 100, max_id: (max_id2-100)}, function(err, data3, response) {
								
						var max_id3;
						if(all_results.length< 100) {
							max_id3 = max_id2;
						}
						else {
							var tt = data3.statuses;
							for(var i in tt) {

								tt[i].user.screen_name = '@' + tt[i].user.screen_name;
								tt[i].created_at = tt[i].created_at.replace('+0000', '');
								single_results.push(tt[i].user.screen_name);
								single_results.push(tt[i].created_at);
								single_results.push(tt[i].text);
								single_results.push(tt[i].user.profile_image_url);
								single_results.push(tt[i].id_str);
										
								all_results.push(single_results);
								single_results = [];
							}						
						}
						socket.emit('results', all_results);
					});

				});
			}
			else {
				socket.emit('results', all_results);
			}				
		});		
	});

	socket.on('profile', function(data) {
		var name = data.name;
		var content = 'from:' + name;
		var single = [];
		var all_results = [];
		var person = [];
		var hot_words = [];
		var allwords = [];

		client.get('statuses/user_timeline', { screen_name: name, count: 100 }, function(err, data, response) {
			var tw = data;

			tw[0].user.screen_name = '@' + tw[0].user.screen_name;
				
			person.push(tw[0].user.name);
			person.push(tw[0].user.screen_name);
			person.push(tw[0].user.profile_image_url.replace('normal', '400x400'));
			person.push(tw[0].user.location);
			person.push(tw[0].user.description);
			person.push(tw[0].user.friends_count);
			person.push(tw[0].user.followers_count);
			person.push(tw[0].user.favourites_count);
			
			var n = '';
			for(var i in tw) {
				tw[i].created_at = tw[i].created_at.replace('+0000','');
				single.push(tw[i].created_at);
				single.push(tw[i].text.replace(/http[^\s]+/ig, ''));
				single.push(tw[i].id_str);

				if(tw[i].retweeted_status === undefined) {
					single.push(tw[i].retweet_count);
					single.push(tw[i].favorite_count);
					single.push(tw[i].user.profile_image_url.replace('normal', '400x400'));
				}
				else {
					single.push(tw[i].retweeted_status.retweet_count);
					single.push(tw[i].retweeted_status.favorite_count);
					single.push(tw[i].retweeted_status.user.profile_image_url.replace('normal', '400x400'));
				}
				if(tw[i].entities.media === undefined) {
					single.push(null);
				}
				else {
					single.push(tw[i].entities.media[0].media_url);
				}
				
				var w = hotwords.parseWords(tw[i].text);
				n = n + ' ' + w;
				all_results.push(single);
				single = [];
			}
			n = n.trim();
			var m = n.split(/\s+/);
			m = hotwords.removeDuplicate(m);
			m = hotwords.keywordsMap(n, m);
			for(var [key, value] of m) {
				hot_words.push(key);
				hot_words.push(value);
				allwords.push(hot_words);
				hot_words = [];
			}
			var allhots = [];
			if(allwords.length > 11) {
				for(var i=0; i<10; i++) {
					allhots[i] = allwords[i];
				}
			}
			else {
				allhots = allwords;
			}
			socket.emit('hotwords', allhots);
			socket.emit('profileinfo', person);
			socket.emit('twinfo', all_results);
	
		});		
	});

	socket.on('find_hot_words', function(data) {
		var allnames = data.name.replace(/\s/,'').split(/\;/);
		var num = data.num;
		var days = data.days;
		var hot_words = [];

		var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        if(month < 10) {
            month = '0' + month;
        }
        var day = date.getDate()-days;
        if(day < 10) {
            day = '0' + day;
        }
        var t = ' since:' + year + '-' + month + '-' + day;
        var one = allnames[0];
        var two = allnames[1];
        var times = 0;
        var all_results = [];
        var allre = [];
        var sall = [];
        gethottweets(hot_words,allnames,times,t,all_results,function(final_result) {
        	for(var i = 0;i <= final_result.length - 1;i++) {
        		if(i == 0 && i !== (final_result.length - 1)) {
        			allre = intersection(final_result[i], final_result[i + 1]);
        		}
        		else {
        			allre = intersection(final_result[i], allre);
        		}
		        sall = [];
		        if(allre.length > num) {
		        	for(var m=0; m<num; m++) {
		        		sall.push(allre[i]);
		        	}
		        }
		        else {
		        	sall = allre;
		        }
        	}
        	var values = [];
        	for(var j = 0;j <= allre.length - 1;j++) {
        		var value = ((Math.random() + 1) * 3) * ((Math.random() + 1) * 1);
        		value = '' + value;
        		value = parseInt(value);
        		values.push(value);
        	}
        	socket.emit('find_same', {words: allre,counts: values});
        });
    });

	socket.on('post', function(data) {
    	var content = data.text;
    	client.post('statuses/update', { status: content }, function(err, data, response) {
			// console.log(data);
		});
    });

});


server.listen(3000, function() {
   console.log('Express server listening on %d, in %s mode', 3000, app.get('env'));
});

