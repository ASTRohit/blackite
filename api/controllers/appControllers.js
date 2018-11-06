var userCtrl = require('./userController');
var locationCtrl = require('./locationController');
var streamCtrl = require('./streamController');
var mappingCtrl = require('./mappingController');

var util = require('../utility/util');

async function registerUser(req, res, next) {
	let request = req.body;
	console.log('Insert User Request: '+JSON.stringify(request));
	
	try {		
		let user = request;		
		let data = await userCtrl.insertUser(user);		
		console.log('Return on Async/Await : '+JSON.stringify(data));	
		user['id'] = parseInt(data['insertId']);
		delete user['salt'];
		delete user['password'];
		res .status(200)
			.json({
				status: 'success',
				result: user,
			    message: ''
			});
	} catch(err) {
		console.error(err);
	}
}

async function addLocation(req, res, next) {
	let request = req.body;
	console.log('Insert Location Request: '+JSON.stringify(request));
	
	try {		
		let location = request.location;

		let data = await locationCtrl.insertLocation(location);		
		console.log('Return on Async/Await : '+JSON.stringify(data));	
		location['id'] = parseInt(data['insertId']);

		let ulm = {
			user_id: location['parent_id'],
			location_id: location['id'],
			is_authorize: true
		}

		request.location = location;

		await mappingCtrl.insertMapULM(ulm);

		res .status(200)
			.json({
				status: 'success',
				result: request,
			    message: ''
			});
	} catch(err) {
		console.error(err);
	}
}

async function addStream(req, res, next) {
	let request = req.body;
	console.log('Insert Stream Request: '+JSON.stringify(request));
	
	try {		
		let userId = request.user_id;
		let stream = request.stream;

		let data = await streamCtrl.insertStream(stream);		
		console.log('Return on Async/Await : '+JSON.stringify(data));	
		stream['id'] = parseInt(data['insertId']);

		let usm = {
			user_id: stream['parent_id'],
			stream_id: stream['id'],
			is_authorize: true
		}

		request.stream = stream;

		await mappingCtrl.insertMapUSM(usm);

		res .status(200)
			.json({
				status: 'success',
				result: request,
			    message: ''
			});
	} catch(err) {
		console.error(err);
	}
}

async function mapLocation(req, res, next) {
	let request = req.body;
	console.log('Location Mapping Request: '+JSON.stringify(request));
	
	try {
		var locationData = await locationCtrl.isAuthLocation(request['location_id']);
		let ulm = {};
		if (locationData[0]['require_auth']) {
			ulm = {
				user_id: request['user_id'],
				location_id: request['location_id'],
				is_authorize: false
			};
		} else {
			ulm = {
				user_id: request['user_id'],
				location_id: request['location_id'],
				is_authorize: true
			};
		}	

		await mappingCtrl.insertMapULM(ulm);

		res .status(200)
			.json({
				status: 'success',
				result: null,
			    message: 'Mapping success'
			});
	} catch(err) {
		console.error(err);
	}
}

async function mapStream(req, res, next) {
	let request = req.body;
	console.log('Stram Mapping Request: '+JSON.stringify(request));
	
	try {		
		var streamData = await streamCtrl.isAuthStream(request['stream_id']);
		let usm = {};
		if (streamData[0]['require_auth']) {
			usm = {
				user_id: request['user_id'],
				stream_id: request['stream_id'],
				is_authorize: false
			};
		} else {
			usm = {
				user_id: request['user_id'],
				stream_id: request['stream_id'],
				is_authorize: true
			};
		}

		await mappingCtrl.insertMapUSM(usm);

		res .status(200)
			.json({
				status: 'success',
				result: null,
			    message: 'Mapping success'
			});
	} catch(err) {
		console.error(err);
	}
}

async function authLocation(req, res, next) {
	let request = req.body;
	console.log('Auth Location Mapping Request: '+JSON.stringify(request));
	
	try {	
		var msg = "";
		if (request['is_authorize']) {
			let ulm = {
				user_id: request['user_id'],
				location_id: request['location_id']
			}

			await mappingCtrl.authMapULM(ulm);
			msg = "Location mapping autherized";
		} else {
			await mappingCtrl.deleteMapULM(ulm);
			msg = "Location mapping rejected";
		}
		

		res .status(200)
			.json({
				status: 'success',
				result: null,
			    message: msg
			});
	} catch(err) {
		console.error(err);
	}
}

async function authStream(req, res, next) {
	let request = req.body;
	console.log('Auth Stram Mapping Request: '+JSON.stringify(request));
	
	try {	
		var msg = "";
		if (request['is_authorize']) {
			let usm = {
				user_id: request['user_id'],
				stream_id: request['stream_id']
			}

			await mappingCtrl.authMapUSM(usm);
			msg = "Stream mapping autherized";
		} else {
			await mappingCtrl.deleteMapUSM(usm);
			msg = "Stream mapping rejected";
		}
		

		res .status(200)
			.json({
				status: 'success',
				result: null,
			    message: msg
			});
	} catch(err) {
		console.error(err);
	}
}

async function getLocationsAsParent(req,res, next) {
	let request = req.body;

	try {	
		let locationByParentData = await locationCtrl.fetchByParentIdLocation(request['user_id']);			

		res .status(200)
			.json({
				status: 'success',
				result: locationByParentData,
			    message: ''
			});
	} catch(err) {
		console.error(err);
	}
}

async function getStreamsAsParent(req,res, next) {
	let request = req.body;

	try {	
		let streamByParentData = await streamCtrl.fetchByParentIdStream(request['user_id']);			

		res .status(200)
			.json({
				status: 'success',
				result: streamByParentData,
			    message: ''
			});
	} catch(err) {
		console.error(err);
	}
}

async function getLocationRequest(req,res, next) {
	let request = req.body;

	try {	
		let locationByParentData = await mappingCtrl.fetchMapULMForParents(request['location_id']);			

		if (locationByParentData!=undefined && locationByParentData.length > 0) {
			var idList = '';
			for (var i = 0; i < locationByParentData.length; i++) {
				if (idList == '') {
					idList = '('+locationByParentData[i].user_id;
				} else {
					idList = idList + ', ' + locationByParentData[i].user_id;
				}
			}

			idList = idList + ')';

			let requestUsers = await userCtrl.fetchUserList(idList);

			res .status(200)
				.json({
					status: 'success',
					result: requestUsers,
				    message: ''
				});
		} else {
			res .status(200)
				.json({
					status: 'success',
					result: null,
				    message: 'No pending requests'
				});
		}
	} catch(err) {
		console.error(err);
	}
}

async function getStreamRequest(req,res, next) {
	let request = req.body;

	try {	
		let streamByParentData = await mappingCtrl.fetchMapUSMForParents(request['stream_id']);			

		if (streamByParentData!=undefined && streamByParentData.length > 0) {
			var idList = '';
			for (var i = 0; i < streamByParentData.length; i++) {
				if (idList == '') {
					idList = '('+streamByParentData[i].user_id;
				} else {
					idList = idList + ', ' + streamByParentData[i].user_id;
				}
			}

			idList = idList + ')';

			let requestUsers = await userCtrl.fetchUserList(idList);

			res .status(200)
				.json({
					status: 'success',
					result: requestUsers,
				    message: ''
				});
		} else {
			res .status(200)
				.json({
					status: 'success',
					result: null,
				    message: 'No pending requests'
				});
		}
	} catch(err) {
		console.error(err);
	}
}

async function getAll(req,res, next) {
	try {
		let data = await userCtrl.fetchAllUser();
		console.log('Return on Async/Await : '+JSON.stringify(data))
		res .status(200)
			.json({
				status: 'success',
				result: data,
			    message: ''
			});
	} catch(err) {
		console.error(err);
	}
}

async function login(req, res, next) {
	console.log('Login Request: '+JSON.stringify(req.body));
	var username = req.body.username;
	var password = req.body.password;

	try {
		let userData = await userCtrl.fetchUser(username);
		if (userData != undefined && userData.length>0) {
			userData = userData[0];
			var reqPassword = util.createPassword(userData.salt, password);

			if (reqPassword == userData.password) {
				delete userData['salt'];
				delete userData['password']; 
				let locationData;
				let streamData;

				let ulmData = await mappingCtrl.fetchMapULM('user_id', userData['id']);
				if (ulmData != undefined && ulmData.length > 0) {
					var idList = '';
					for (var i = 0; i < ulmData.length; i++) {
						if (idList == '') {
							idList = '('+ulmData[i].location_id;
						} else {
							idList = idList + ', ' + ulmData[i].location_id;
						}
					}

					idList = idList + ')';

					locationData = await locationCtrl.fetchLocation(idList);
					let usmData = await mappingCtrl.fetchMapUSM('user_id', userData['id']);
					for (var i = 0; i < locationData.length; i++) {
						let authULM = {
							user_id: userData['id'],
							location_id: locationData[i]['id']
						};
						let authULMData = await mappingCtrl.isAuthMapULM(authULM);
						console.log(JSON.stringify(authULMData));
						locationData[i]['is_authorize'] = authULMData[0]['is_authorize'];
						
						let streamLocationData = await streamCtrl.fetchForLocationStream(locationData[i]['id']);
						if (streamLocationData != undefined && streamLocationData.length > 0 && locationData[i]['is_authorize']) {
							let streamArray = [];
							for (var j = 0; j < streamLocationData.length; j++) {
								let slData = streamLocationData[j];
								if (usmData != undefined  && usmData.length > 0 && util.hasValue(usmData,'stream_id',slData.id)) {
									let authUSM = {
										user_id: userData['id'],
										stream_id: slData['id']
									};
									let authUSMData = await mappingCtrl.isAuthMapUSM(authUSM);
									slData['is_authorize'] = authUSMData[0]['is_authorize'];
									slData['is_requested'] = 1;
									if (slData['is_authorize']) {
										streamArray.push(slData);
									} else {
										slData['stream']="";
										streamArray.push(slData);
									}
									
								} else {
									slData['stream']="";
									slData['is_requested'] = 0;
									slData['is_authorize'] = 0;
									streamArray.push(slData);
								}
							}
							locationData[i]['streams'] = streamArray;
						}
					}
				}			

				response = {
					user: userData,
					location: locationData
				};

				res .status(200)
					.json({
						status: 'success',
						result: response,
		          		message: ''
					});
			} else {
				res .status(401)
					.json({
						status: 'fail',
						result: null,
		          		message: 'Unable to login with provided credentials'
					});
			}
		} else {
			res .status(401)
				.json({
					status: 'fail',
					result: null,
		       		message: 'Unable to login with provided credentials'
				});
		}	
	} catch (err) {
		console.error(err);
		return next(err);
	}
}

// async function login(req, res, next) {
// 	console.log('Login Request: '+JSON.stringify(req.body));
// 	var username = req.body.username;
// 	var password = req.body.password;

// 	try {
// 		let userData = await userCtrl.fetchUser(username);
// 		if (userData != undefined && userData.length>0) {
// 			userData = userData[0];
// 			var reqPassword = util.createPassword(userData.salt, password);

// 			if (reqPassword == userData.password) {
// 				delete userData['salt'];
// 				delete userData['password']; 								

// 				res .status(200)
// 					.json({
// 						status: 'success',
// 						result: userData,
// 		          		message: ''
// 					});
// 			} else {
// 				res .status(401)
// 					.json({
// 						status: 'fail',
// 						result: null,
// 		          		message: 'Unable to login with provided credentials'
// 					});
// 			}
// 		} else {
// 			res .status(401)
// 				.json({
// 					status: 'fail',
// 					result: null,
// 		       		message: 'Unable to login with provided credentials'
// 				});
// 		}	
// 	} catch (err) {
// 		console.error(err);
// 		return next(err);
// 	}
// }

function updateProfile(req, res, next){
	var user = req.body;
	console.log('Update Profile Request: '+JSON.stringify(user));
	userCtrl.updateUser(user)
		.then(function() {
			userCtrl.fetchUser(username)
				.then(function(data) {
					if (data != undefined && data.length>0) {
						data = data[0];
						console.log('Fetched data: '+JSON.stringify(data));
						delete data['salt'];
						delete data['password'];
						res .status(200)
							.json({
								status: 'success',
								result: data,
				          		message: ''
							});
					} else {
						res .status(403)
							.json({
								status: 'fail',
								result: null,
				          		message: 'User does not found'
							});
					}			
				})
				.catch(function(err){
					return next(err);
				});
		})
		.catch(function(err){
			return next(err);
		});
}

module.exports = {
	authRegisterUser: registerUser,	
	newLocation: addLocation,
	newStream: addStream,
	mapUserLocation: mapLocation,
	mapUserStream: mapStream,
	authUserLocation: authLocation,
	authUserStream: authStream,
	locationAsParent: getLocationsAsParent,
	streamsAsParent: getStreamsAsParent,
	locationRequest: getLocationRequest,
	streamRequest: getStreamRequest,
	authLogin: login,
	getUsers: getAll
};
