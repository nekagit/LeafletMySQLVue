const mysql = require("mysql2");

function populateDatabase(callback) {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "KEP_1M",
        port: 3306,
    });

    const createPlzTable = `
        CREATE TABLE IF NOT EXISTS plz (
            PLZ VARCHAR(10) PRIMARY KEY,
            Name VARCHAR(100),
            Residents INT,
            Coord POINT,
            Area FLOAT,
            Shape JSON
        );
    `;

    const createShipmentsTable = `
        CREATE TABLE IF NOT EXISTS shipments (
            ID INT AUTO_INCREMENT PRIMARY KEY,
            Date DATE,
            PLZ_From VARCHAR(10),
            PLZ_To VARCHAR(10),
            Weight FLOAT,
            FOREIGN KEY (PLZ_From) REFERENCES plz(PLZ),
            FOREIGN KEY (PLZ_To) REFERENCES plz(PLZ)
        );
    `;

    const insertDataPlz = `
        INSERT IGNORE INTO plz (PLZ, Name, Residents, Coord, Area, Shape) VALUES
        ('97618', '97618 Hohenroth', 13591, ST_GeomFromText('POINT(10.0628673 50.3456519)'), 136.704, '{"type":"MultiPolygon","coordinates":[[[[10.0628673,50.3456519],[10.0902412,50.3421824],[10.1135247,50.3339858],[10.115657200000001,50.3373301],[10.193543300000002,50.3624727],[10.1899485,50.3778567]]]]}');
    `;

    connection.query(createPlzTable, (err) => {
        if (err) {
            callback(err);
            return;
        }
        connection.query(createShipmentsTable, (err) => {
            if (err) {
                callback(err);
                return;
            }
            connection.query(insertDataPlz, (err) => {
                connection.end();
                callback(err);
            });
        });
    });
}

module.exports = populateDatabase;
