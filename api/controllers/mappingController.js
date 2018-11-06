var util = require('../utility/util');
var db = require('../utility/dbConnections');

function insertULM(ulm){	
	var insertQuery='INSERT INTO user_location_map(user_id, location_id, is_authorize) '+
	'VALUES (?, ?, ?);';
	return db.query(insertQuery,[ulm.user_id, ulm.location_id, ulm.is_authorize]);	
}

function authorizeULM(ulm){	
	var updateQuery='UPDATE user_location_map SET is_authorize = true WHERE user_id=? AND location_id=?;';
	return db.query(updateQuery,[ulm.user_id, ulm.location_id]);	
}

function isAuthorizeULM(ulm){	
	var updateQuery='SELECT is_authorize FROM user_location_map WHERE user_id=? AND location_id=?;';
	return db.query(updateQuery,[ulm.user_id, ulm.location_id]);	
}

function fetchULM(key, id) {
	var fetchQuery = 'SELECT * FROM user_location_map WHERE '+ key +' = ' + id;
	
	console.log("Query : "+fetchQuery);
	return db.query(fetchQuery);
}

function fetchULMForParents(location_id) {
	var fetchQuery = 'SELECT * FROM user_location_map WHERE location_id=? AND is_authorize=false';
	
	console.log("Query : "+fetchQuery);
	return db.query(fetchQuery,[location_id]);
}

function removeULM(ulm) {
	var removeQuery = 'DELETE FROM user_location_map WHERE user_id=? AND location_id=? AND is_authorize=false;';
	console.log("Query : "+removeQuery);
	return db.query(removeQuery,[ulm.user_id, ulm.location_id]);
}

function insertUSM(usm){	
	var insertQuery='INSERT INTO user_stream_map(user_id, stream_id, is_authorize) '+
	'VALUES (?, ?, ?);';
	return db.query(insertQuery,[usm.user_id, usm.stream_id, usm.is_authorize]);	
}

function authorizeUSM(usm){	
	var updateQuery='UPDATE user_stream_map SET is_authorize = true WHERE user_id=? AND stream_id=?;';
	return db.query(updateQuery,[usm.user_id, usm.stream_id]);	
}

function isAuthorizeUSM(usm){	
	var updateQuery='SELECT is_authorize FROM user_stream_map WHERE user_id=? AND stream_id=?;';
	return db.query(updateQuery,[usm.user_id, usm.stream_id]);	
}

function fetchUSM(key, id) {
	var fetchQuery = 'SELECT * FROM user_stream_map  WHERE '+ key +' = ' + id;
	
	console.log("Query : "+fetchQuery);
	return db.query(fetchQuery);
}

function fetchUSMForParents(stream_id) {
	var fetchQuery = 'SELECT * FROM user_stream_map WHERE stream_id=? AND is_authorize=false';
	
	console.log("Query : "+fetchQuery);
	return db.query(fetchQuery,[stream_id]);
}

function removeUSM(usm) {
	var removeQuery = 'DELETE FROM user_stream_map WHERE user_id=? AND stream_id=? AND is_authorize=false;';
	console.log("Query : "+removeQuery);
	return db.query(removeQuery,[usm.user_id, usm.stream_id]);
}

module.exports = {
	insertMapULM: insertULM,
	authMapULM: authorizeULM,
	isAuthMapULM: isAuthorizeULM,
	fetchMapULM: fetchULM,
	fetchMapULMForParents: fetchULMForParents,
	deleteMapULM: removeULM,
	insertMapUSM: insertUSM,
	authMapUSM: authorizeUSM,
	isAuthMapUSM: isAuthorizeUSM,
	fetchMapUSM: fetchUSM,
	fetchMapUSMForParents: fetchUSMForParents,
	deleteMapUSM: removeUSM
};
