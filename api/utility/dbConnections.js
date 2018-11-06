const mysql = require( 'mysql' );

class Database {
	constructor(){
		this.connection= mysql.createConnection({
            host:'localhost',
            user:'root',
            password:'Moiria!007',
            database:'blackite',
            multipleStatements: true
        });
	}

	query( sql, args ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }

    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
}

var db = new Database();

module.exports = db;