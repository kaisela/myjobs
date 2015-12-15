define(function() {
	var pubsub = {};
	(function(q) {
		var topics = {},
			subUid = -1;
		//发布或广播事件，包含特定的topic名称和参数（比如传递的数据）
		q.publish = function(topic, args) {
			if (!topics[topic]) {
				return false;
			}

			var subscribers = topics[topic],
				len = subscribers ? subscribers.length : 0;

			while (len--) {
				subscribers[len].func(topic, args);
			}

			return this;
		};

		//通过特定的名称和回调函数订阅事件，topic/event触发时执行事件
		q.subscribe = function(topic, func) {
			if (!topics[topic]) {
				topics[topic] = [];
			}

			var token = (++subUid).toString();
			topics[topic].push({
				token: token,
				func: func
			});
			return token;
		};

		//基于订阅上 的标记引用，通过特定topic取消订阅
		q.unsubscribe = function(token) {
			for (var m in topics) {
				if (topics[m]) {
					for (var i = 0, j = topics[m].length; i < j; i++) {
						if (topics[m][i].token === token) {
							topics[m].splice(i, 1);
							return token;
						}
					}
				}
			}
			return this;
		};

	})(pubsub);
	return {
		p:pubsub
	}
});