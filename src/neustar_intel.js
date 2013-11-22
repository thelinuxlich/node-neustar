var crypto = require('crypto'),
    request = require("request");
 
var NeustarIntel = function(apikey,secret) {
	var self = this;
	this.apikey = apikey;
	this.secret = secret;
	this.cached_queries = {};

	this.ipinfo = function(ip,cb) {
		if(!!this.cached_queries[ip]) {
			var expires_at = new Date();
			expires_at.setHours(expires_at.getHours() + 1);
			this.cached_queries[ip]["expires_at"] = expires_at.getTime();
			cb(this.cached_queries[ip]);
		} else {
			currTimeStamp = Math.round((new Date().getTime()) / 1000);
			sig = crypto.createHash('md5').update(this.apikey + this.secret + currTimeStamp).digest("hex");
			uri = "http://api.neustar.biz/ipi/gpp/v1/ipinfo/" + ip + '?apikey=' + this.apikey + '&sig=' + sig + "&format=json";
			request.get(uri, function(err,res,body) {
			    if(!err) {
			       var data = JSON.parse(body);	
			       var expires_at = new Date();
			       expires_at.setHours(expires_at.getHours() + 1);
				   var result = {
				   		country: data["ipinfo"]["Location"]["continent"],
				   		state: data["ipinfo"]["Location"]["StateData"]["state"],
				   		city: data["ipinfo"]["Location"]["CityData"]["city"],
				   		ll: data["ipinfo"]["Location"]["latitude"]+","+data["ipinfo"]["Location"]["longitude"],
				   		expires_at: expires_at.getTime()
				   }
				   self.cached_queries[ip] = result;
				   cb(result);
				} else {
				   cb(null);
				}
			});
		}
	};

	// do cache invalidation here
	setTimeout(function(){
		var now = new Date().getTime();
		for(var k in self.cached_queries) {
			var item = self.cached_queries[k.toString()];
			if(item["expires_at"] < now) {
				delete self.cached_queries[k.toString()];
			}
		}
	},60000);
};

module.exports = NeustarIntel;