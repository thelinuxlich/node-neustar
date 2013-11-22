var NeustarIntel = require('../src/neustar_intel'),
	apikey = "", // your API key
	secret = "", // your API secret
	ip = "177.34.194.26", // a sample IP
	n = new NeustarIntel(apikey,secret);

n.ipinfo(ip,function(response){
	if(!!response) {
		console.log("Data received from Neustar: "+JSON.stringify(response));
		console.log("Items on cache: "+Object.keys(n.cached_queries).length);
		console.log("Now doing it again to test the cache...");
		var current_expiration = response.expires_at;
		n.ipinfo(ip,function(second_response){
			if(!!second_response) {
				if(second_response["expires_at"] !== current_expiration) {
					console.log("This response came from the cache, old expiration timestamp was "+current_expiration+" and now is "+second_response["expires_at"]);
				} else {
					console.log("The response did not use the cache.");
				}
			} else {
				console.log("An error occurred during the second request.");
			}
		});
	} else {
		console.log("No data received for this IP");
	}
});