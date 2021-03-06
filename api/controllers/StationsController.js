/**
 * StationsController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom stationss (`config/stationss.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var googleapis = require('googleapis');
var jwt = new googleapis.auth.JWT('424930963222-s59k4k5usekp20guokt0e605i06psh0d@developer.gserviceaccount.com', 'availwim.pem', '3d161a58ac3237c1a1f24fbdf6323385213f6afc', ['https://www.googleapis.com/auth/bigquery']);

module.exports = {
    
  	
	stationsGeo:function(req,res){

		var stationsCollection = {};
		stationsCollection.type = "FeatureCollection";
		stationsCollection.features = [];

		var sql = 'SELECT  station_id,state_code,ST_AsGeoJSON(the_geom) station_location FROM tmas where num_lane_1 > 0 group by station_id,state_code,ST_AsGeoJSON(the_geom);'
		Stations.query(sql,{},function(err,data){
			if (err) {res.send('{status:"error",message:"'+err+'"}',500);return console.log(err);}
				data.rows.forEach(function(stations){
					var stationsFeature = {};
					stationsFeature.type="Feature";
					stationsFeature.geometry = JSON.parse(stations.station_location);
					stationsFeature.properties = {};
					stationsFeature.properties.station_id = stations.station_id;
					stationsFeature.properties.state_code = stations.state_code;
					stationsCollection.features.push(stationsFeature);

					});

			res.send(stationsCollection);
		});
 	}
, 	ClassStationsGeo:function(req,res){

		var stationsCollection = {};
		stationsCollection.type = "FeatureCollection";
		stationsCollection.features = [];

		var sql = 'SELECT  station_id,state_code,ST_AsGeoJSON(the_geom) station_location FROM tmas where num_lanes1 > 0 group by station_id,state_code,ST_AsGeoJSON(the_geom);'
		Stations.query(sql,{},function(err,data){
			if (err) {res.send('{status:"error",message:"'+err+'"}',500);return console.log(err);}
				data.rows.forEach(function(stations){
					var stationsFeature = {};
					stationsFeature.type="Feature";
					stationsFeature.geometry = JSON.parse(stations.station_location);
					stationsFeature.properties = {};
					stationsFeature.properties.station_id = stations.station_id;
					stationsFeature.properties.state_code = stations.state_code;
					stationsCollection.features.push(stationsFeature);

					});

			res.send(stationsCollection);
		});
 	},
 	getAllStations:function(req,res){
 		googleapis.discover('bigquery', 'v2').execute(function(err, client) {
		    jwt.authorize(function(err, result) {
		    	if (err) console.log(err);
		    	console.log()
			    var request = client.bigquery.jobs.query({
			    	kind: "bigquery#queryRequest",
			    	projectId: 'avail-wim',
			    	timeoutMs: '30000'
			    });
			    request.body = {};
			    request.body.query = 'select state_fips,station_id,count(1) as num_trucks FROM [tmasWIM12.wim2012] where  state_fips is not null group by state_fips,station_id order by state_fips,num_trucks desc;';
			    request.body.projectId = 'avail-wim';
			    console.log(request);
		      	request
	        	.withAuthClient(jwt)
	        	.execute(function(err, response) {
	          		if (err) console.log(err);
	          		console.log(response);
	          		res.json(response);
	        	});
		    });
		});
 	},

 	getStateStations:function(req,res){
 		var state_fips = req.param('stateFips');
 		googleapis.discover('bigquery', 'v2').execute(function(err, client) {
		    jwt.authorize(function(err, result) {
		    	if (err) console.log(err);
		    	console.log()
			    var request = client.bigquery.jobs.query({
			    	kind: "bigquery#queryRequest",
			    	projectId: 'avail-wim',
			    	timeoutMs: '30000'
			    });
			    request.body = {};
			    request.body.query = 'select state_fips,station_id,year,month,count(1) as num_trucks FROM [tmasWIM12.wim2012] where state_fips= "'+state_fips+'" and state_fips is not null group by state_fips,station_id,year,month order by state_fips,num_trucks,year,month desc;';
			    request.body.projectId = 'avail-wim';
			    console.log(request);
		      	request
	        	.withAuthClient(jwt)
	        	.execute(function(err, response) {
	          		if (err) console.log(err);
	          		console.log(response);
	          		res.json(response);
	        	});
		    });
		});
 	},

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to StationsController)
   */
  _config: {}

  
};
