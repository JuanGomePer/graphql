const { runAsync } = require('./db');


async function seed(){
await runAsync(`CREATE TABLE IF NOT EXISTS breeds (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,
origin TEXT,
lifeSpan TEXT,
temperament TEXT
);`);


await runAsync(`CREATE TABLE IF NOT EXISTS students (
id INTEGER PRIMARY KEY AUTOINCREMENT,
firstName TEXT,
lastName TEXT,
email TEXT,
age INTEGER,
major TEXT
);`);


// Limpiar tablas para desarrollo
await runAsync('DELETE FROM breeds');
await runAsync('DELETE FROM students');


const breeds = [
['Siamese', 'Thailand', '10-12 years', 'Social, Vocal'],
['Maine Coon', 'USA', '12-15 years', 'Gentle, Intelligent'],
['Persian', 'Iran', '12-17 years', 'Quiet, Affectionate']
];


for(const b of breeds){
await runAsync('INSERT INTO breeds (name, origin, lifeSpan, temperament) VALUES (?, ?, ?, ?)', b);
}


const students = [
['Ana', 'Gomez', 'ana@example.com', 21, 'Computer Science'],
['Carlos', 'Perez', 'carlos@example.com', 23, 'Mathematics'],
['Luisa', 'Martinez', 'luisa@example.com', 20, 'Physics']
];


for(const s of students){
await runAsync('INSERT INTO students (firstName, lastName, email, age, major) VALUES (?, ?, ?, ?, ?)', s);
}


console.log('Seed completo');
process.exit(0);
}


seed().catch(err=>{ console.error(err); process.exit(1); });