var util = require('../utility/util');
var db = require('../utility/dbConnections');

function insert(user) {
	user.salt = util.createSalt();
	user.password = util.createPassword(user.salt, user.password);

	var insertQuery='INSERT INTO user_master(name, email, mobile, parent_id, is_admin, salt, password, status) '+
	'VALUES (?, ?, ?, ?, ?, ?, ?, ?);';
	// console.log(insertQuery);
	return db.query(insertQuery,[user.name, user.email, user.mobile, user.parent_id, user.is_admin, user.salt, user.password, user.status]);
}

function fetch(username) {
	var isMobile = /^\d{10}$/.test(username);
	var fetchQuery = '';
	if (isMobile) {
		fetchQuery = "SELECT um.id, um.name, um.email, um.mobile, um.parent_id, um.is_admin, " + 
					 "um.salt, um.password, um.dt_created, um.dt_modified, um.dt_login, sm.status " + 
					 "FROM user_master AS um " + 
					 "JOIN status_master AS sm ON um.status = sm.id " + 
					 "WHERE um.mobile = ?";
	} else {
		fetchQuery = "SELECT um.id, um.name, um.email, um.mobile, um.parent_id, um.is_admin, " + 
					 "um.salt, um.password, um.dt_created, um.dt_modified, um.dt_login, sm.status " + 
					 "FROM user_master AS um " + 
					 "JOIN status_master AS sm ON um.status = sm.id " + 
					 "WHERE um.email = ?";
	}

	// console.log("Query : "+fetchQuery);
	return db.query(fetchQuery, [username]);
}

function fetchAll() {
	var fetchQuery = "SELECT um.id, um.name, um.email, um.mobile, um.parent_id, um.is_admin, " + 
					 "um.salt, um.password, um.dt_created, um.dt_modified, um.dt_login, sm.status " + 
					 "FROM user_master AS um " + 
					 "JOIN status_master AS sm ON um.status = sm.id;";	

	// console.log("Query : "+fetchQuery);
	
	return db.query(fetchQuery);
}

function fetchList(ids) {
	var fetchQuery = "SELECT um.id, um.name, um.email, um.mobile, sm.status " + 
					 "FROM user_master AS um " + 
					 "JOIN status_master AS sm ON um.status = sm.id " +
					 "WHERE um.id IN " + ids;	

	// console.log("Query : "+fetchQuery);
	
	return db.query(fetchQuery);
}

function update(user) {
	var updateQuery='';
	var args = [];
	if (user.password != undefined && user.password != '') {
		user.salt = util.createSalt();
		user.password  = util.createPassword(user.salt, user.password);
		updateQuery='UPDATE user_master SET name=?, email=?, mobile=?, parent_id=?, is_admin=?, salt=?, password=?, status=? WHERE id =?';
		args = [user.name, user.email, user.mobile, user.parent_id, user.is_admin, user.salt, user.password, user.status, user.id];
	} else {
		updateQuery='UPDATE user_master SET name=?, email=?, mobile=?, parent_id=?, is_admin=?, status=? WHERE id =?';	
		args = [user.name, user.email, user.mobile, user.parent_id, user.is_admin, user.status, user.id];	
	}

	// console.log("Query : "+updateQuery);
	return db.query(updateQuery,args);		
}

function remove(id) {
	var removeQuery = "DELETE FROM user_master WHERE id = "+id;
	// console.log("Query : "+removeQuery);
	return db.query(removeQuery);
}

module.exports = {
	insertUser: insert,
	fetchUser: fetch,
	fetchAllUser: fetchAll,
	fetchUserList: fetchList,
	updateUser: update,
	deleteUser: remove
};
