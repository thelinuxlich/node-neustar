var http = require('http'),
    crypto = require('crypto'),
    request = require("request");
 
var NeustarIntel = function(apikey,secret) {
	this.apikey = apikey;
	this.secret = secret;
	this.options = {
	   host: 'api.neustar.biz',
	   path: '/ipi/gpp/v1/ipinfo/',
	   port: 80,
	};
	this.cached_queries = {};

	this.ipinfo = function(ip,cb) {
		if(!!this.cached_queries[ip]) {
			this.cached_queries[ip]["expires_at"] = new Date().getTime();
			cb(ip);
		} else {
			var self = this;
			var currTimeStamp = Math.round((new Date().getTime()) / 1000);
			var sig = crypto.createHash('md5').update(this.apikey + this.secret + currTimeStamp).digest("hex");
			this.options.path += ip +'?apikey=' + this.apikey + '&sig=' + sig;

			request.get(options, function(err,res,body) {
			    if(!err) {
				   var data = JSON.parse(body);	
				   var result = {
				   		country: data["ipinfo"]["Location"]["continent"],
				   		state: data["ipinfo"]["Location"]["StateData"]["state"],
				   		city: data["ipinfo"]["Location"]["CityData"]["city"],
				   		ll: data["ipinfo"]["Location"]["latitude"]+","+data["ipinfo"]["Location"]["longitude"],
				   		expires_at: new Date().getTime()
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
		Object.keys(cached_queries).forEach(function(key){
			if(cached_queries[ḱey]["expires_at"] > now) {
				delete cached_queries[key];
			}
		});
	},60000);
} 

exports = NeustarIntel;