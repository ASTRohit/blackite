var util = require('../utility/util');
var db = require('../utility/dbConnections');

function insert(stream){	
	var insertQuery='INSERT INTO stream_master(location_id, stream, label, parent_id, require_auth) VALUES (?, ?, ?, ?, ?);';
	return db.query(insertQuery,[stream.location_id, stream.stream, stream.label, stream.parent_id, stream.require_auth]);	
}

function fetch(ids) {	
	var fetchQuery = 'SELECT * FROM stream_master WHERE id IN ' + ids;
	
	console.log("Query : "+fetchQuery);
	return db.query(fetchQuery);
}

function fetchByParentId(id) {	
	var fetchQuery = 'SELECT * FROM stream_master WHERE parent_id=? AND require_auth=true';
	
	console.log("Query : "+fetchQuery);
	return db.query(fetchQuery,[id]);
}

function fetchForLocation(location_id) {	
	var fetchQuery = 'SELECT * FROM stream_master WHERE location_id = ' + location_id;
	
	console.log("Query : "+fetchQuery);
	return db.query(fetchQuery);
}

function authRequired(id) {	
	var fetchQuery = 'SELECT require_auth FROM stream_master WHERE id=' + id;
	
	console.log("Query : "+fetchQuery);
	return db.query(fetchQuery);
}

function update(stream) {
	var updateQuery='UPDATE stream_master SET location_id=?, stream=?, label=?, parent_id=?, require_auth=? WHERE id =?';
	
	console.log("Query : "+updateQuery);
	return db.query(updateQuery,[stream.location_id, stream.stream, stream.label, stream.parent_id, stream.require_auth, stream.id]);		
}

function remove(id) {
	var removeQuery = 'DELETE FROM stream_master WHERE id = '+id;
	console.log("Query : "+removeQuery);
	return db.query(removeQuery);
}

module.exports = {
	insertStream: insert,
	fetchStream: fetch,
	fetchByParentIdStream: fetchByParentId,
	fetchForLocationStream: fetchForLocation,
	isAuthStream: authRequired,
	updateStream: update,
	deleteStream: remove
};
