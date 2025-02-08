import mysql from 'mysql';
const connection = mysql.createConnection({ 
    host: 'localhost',
    user: 'root',
    password: 'Joel@2024',
    database: 'subscription_tracker',
    port: 3306,
});

connection.connect((error) => {
    if (error) {
        console.error('Database connection failed: ' + error)
        return;
    }

    console.log('Connected to the MySQL server.')
})

export default connection;