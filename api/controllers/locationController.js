var util = require('../utility/util');
var db = require('../utility/dbConnections');

function insert(location){	
	var insertQuery='INSERT INTO location_master(address, city, state, zipcode, parent_id, require_auth) '+
	'VALUES (?, ?, ?, ?, ?, ?);';
	return db.query(insertQuery,[location.address, location.city, location.state, location.zipcode, location.parent_id, location.require_auth]);	
}

function fetch(ids) {
	var fetchQuery = 'SELECT * FROM location_master WHERE id IN ' + ids;
	
	console.log("Query : "+fetchQuery);
	return db.query(fetchQuery);
}

function fetchByParentId(id) {
	var fetchQuery = 'SELECT * FROM location_master WHERE parent_id=? AND require_auth=true';
	
	console.log("Query : "+fetchQuery);
	return db.query(fetchQuery,[id]);
}

function authRequired(id) {
	var fetchQuery = 'SELECT require_auth FROM location_master WHERE id=' + id;
	
	console.log("Query : "+fetchQuery);
	return db.query(fetchQuery);
}

function update(location) {
	var updateQuery='UPDATE location_master SET address=?, city=?, state=?, zipcode=?, parent_id=?, require_auth=? WHERE id =?';
	
	console.log("Query : "+updateQuery);
	return db.query(updateQuery,[location.address, location.city, location.state, location.zipcode, location.parent_id, location.require_auth, location.id]);		
}

function remove(id) {
	var removeQuery = 'DELETE FROM location_master WHERE id = '+id;
	console.log("Query : "+removeQuery);
	return db.query(removeQuery);
}

module.exports = {
	insertLocation: insert,
	fetchLocation: fetch,
	fetchByParentIdLocation: fetchByParentId,
	isAuthLocation: authRequired,
	updateLocation: update,
	deleteLocation: remove
};
