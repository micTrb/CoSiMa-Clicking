const sqlite3 = require('sqlite3').verbose();


//SQL Statements
const createSessionsTableSTMT = `
	CREATE TABLE IF NOT EXISTS sessions(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT,
    mod TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP
);`;

const createUserRecordsTableSTMT = `
	CREATE TABLE IF NOT EXISTS user_records(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER,
    uuid TEXT,
    timestamp INTEGER,
    FOREIGN KEY(session_id) REFERENCES sessions(id),
	FOREIGN KEY(session_label) REFERENCES sessions(label)
);`;



const databaseService = {
	init(databaseFilePath) {
		this.db = new sqlite3.Database(databaseFilePath);

		const that = this;

		this.db.run(createSessionsTableSTMT, function(err) {
			if (err) {
				throw Error('Problem creating the database, please restart the server');
				process.exit();
			}
		});

		this.db.run(createUserRecordsTableSTMT, function(err) {
			if (err) {
				console.log(err);
				throw Error('Problem creating the database, please restart the server');
				process.exit();
			}
		});
	},

	insertSessionsRecords(label, modality, callback) {
		// Sql operations
		// create one record in the 'sessions' table
		// returns the ID of the created session
		// could return a Promise

		const insertIntoSessionsSTMT = `
			INSERT INTO sessions(
	    	label,
	    	mod
			) VALUES('`+ label + `', '`+ modality + `');`;

		this.db.run(insertIntoSessionsSTMT, function(err) {
			callback(err, this.lastID);
		});
	},

	insertUserRecords(sessionId, uuid, timestamp) {
		const insertIntoUserSTMT = `
			INSERT INTO user_records(
				session_id,
	    	uuid,
	    	timestamp
			) VALUES('`+ sessionId + `', '` + uuid + `', '`+ timestamp + `');`;

		this.db.run(insertIntoUserSTMT, function(err) {
			console.log('ERROR', err);
		});
	},
};

export default databaseService;

