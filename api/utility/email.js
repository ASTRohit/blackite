const nodemailer = require('nodemailer');

class Email {
	constructor(){
		this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'noreply.blackite@gmail.com',
                pass: 'Aaryavart@2018'
            }
        });
	}

    send(options){
        return new Promise((resolve, reject)=>{
            this.transporter.sendMail(options, (err,info)=>{
                if (err)
                    return reject(err);
                resolve(info);
            });
        });
    }
}

var email = new Email();

module.exports = email;