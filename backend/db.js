const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'data.db');
const db = new sqlite3.Database(dbPath);


function runAsync(sql, params = []){
return new Promise((resolve, reject) => {
db.run(sql, params, function(err){
if(err) reject(err); else resolve(this);
});
});
}


function allAsync(sql, params = []){
return new Promise((resolve, reject) => {
db.all(sql, params, (err, rows) => {
if(err) reject(err); else resolve(rows);
});
});
}


function getAsync(sql, params = []){
return new Promise((resolve, reject) => {
db.get(sql, params, (err, row) => {
if(err) reject(err); else resolve(row);
});
});
}


module.exports = { db, runAsync, allAsync, getAsync };