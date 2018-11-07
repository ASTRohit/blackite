const fs = require('fs');

class File {

	read (path, encoding){
		return new Promise((resolve, reject)=>{
			fs.readFile(path, encoding, (err, buff)=>{
				if (err)
                    return reject(err);
                resolve(buff);
			});
		});
	}

	write (path, data){
		return new Promise((resolve, reject)=>{
			fs.writeFile(path, data, (err, data)=>{
				if (err)
                    return reject(err);
                resolve(data);
			});
		});
	}
}

module.exports = new File();