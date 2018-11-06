var email = require('../utility/email');

function createSalt() {
	var random = require('random-key');
	return random.generate();
}

function createPassword(salt,password) {
	var crypto = require('crypto');
	var hmac = crypto.createHmac('md5',salt);
	hmac.update(password);
	return hmac.digest('base64');
}

function getBoolean(value){
   switch(value){
        case true:
        case "true":
        case 1:
        case "1":
        case "on":
        case "yes":
            return true;
        default: 
            return false;
    }
}

function hasValue(array, key, value) {
    if (array != undefined && array.length > 0) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key]==value) {
                return true;
            }
        }
    }

    return false;
}

module.exports = {
	getBoolean: getBoolean,
    hasValue: hasValue,
    createSalt: createSalt,
	createPassword: createPassword
};
