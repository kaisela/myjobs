var mySingleton = (function(){
	var instance;
	function init(){
		function privateMethod(){
			console.log("I am private");
		}
		var privateVariable = "I am also private";
		var privateRandomNumber = Math.random();
		return {
			publicMethod: function(){
				console.log("The public cab see me!");
			},
			publicProperty:"I am also public",
			getRandomNumber: function(){
				renturn privateRandomNumber;
			}
		};
	};
	
	return {
		getInstance: function(){
			if(!instance){
				instance = init();
			}
			return instance;
		}
	}
})();