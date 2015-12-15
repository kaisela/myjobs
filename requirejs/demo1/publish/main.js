require.config({
	paths: {
		jquery: '../js/jquery-1.10.2',
		p:"publish"
	}
});

require(['jquery', "p"], function($, p) {
	var pubsub = p.p;
	var messageLogger = function(topics,data){
		console.log("Logging: "+topics+": "+data);
	};
	var messageLogger2 = function(topics,data){
		console.log("Logging: "+topics+"2: "+data);
	};
	var subscription = pubsub.subscribe("inbox",messageLogger);
	var subscription2 = pubsub.subscribe("inbox",messageLogger2);
	pubsub.publish("inbox","hello word!");
	pubsub.publish("inbox",["test","a","b","c"]);
	pubsub.publish("inbox",{sender:"hello@google.com",body:"Hey again"});
	pubsub.unsubscribe(subscription);
	pubsub.publish("inbox","Hello! are you still there?");
});