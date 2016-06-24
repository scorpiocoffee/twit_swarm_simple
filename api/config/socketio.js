'use strict';

var twitter = require('twit');
var hotwords = require('../methods/words_parse');
var client = new twitter({
	consumer_key        : '0UyNUGhptJgezvEBL6JG7ZW9v',
	consumer_secret     : 'U3BhoWnGtp5LPzDZabdmuKEKPkfE7a1vFej4tVtKYN1HAeVb2N',
	access_token        : '731213551197687808-jfhNALqo4ALXK2MBgEyifdLZCa7r3EB',
	access_token_secret : 's3uP57Amo6OerHmhuKcqXUOXxlHXf7AMVVqECYBx5VMmR'
});

module.exports = function (io) {

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
					console.log(all_results.length);
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

	});
}
