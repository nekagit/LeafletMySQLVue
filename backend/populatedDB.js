const mysql = require("mysql2");

function populateDatabase(callback) {
    const port = 3306;

    const connection = mysql.createConnection({
        host: "localhost",
        user: "admin",
        password: "root",
        database: "KEP_1M",
        port: port,
    });

    const createPlzTable = `
        CREATE TABLE IF NOT EXISTS plz (
            PLZ INT PRIMARY KEY,
            Name VARCHAR(100),
            Residents INT,
            Latitude DOUBLE,
            Longitude DOUBLE
        );
    `;

    const createShipmentsTable = `
        CREATE TABLE IF NOT EXISTS shipments (
            ID INT AUTO_INCREMENT PRIMARY KEY,
            PLZ_From INT,
            Weight DOUBLE,
            FOREIGN KEY (PLZ_From) REFERENCES plz(PLZ)
        );
    `;

    const insertDataPlz = `
        INSERT IGNORE INTO plz (PLZ, Name, Residents, Latitude, Longitude) VALUES
        (20095, 'Hamburg-Mitte', 8000, 53.5527, 9.9936),
        (10115, 'Berlin-Mitte', 5000, 52.5321, 13.3849),
        (80331, 'München', 7000, 48.1374, 11.5755),
        (50667, 'Köln', 3000, 50.9407, 6.9599),
        (60311, 'Frankfurt am Main', 6000, 50.1114, 8.6806),
        (70173, 'Stuttgart', 4000, 48.7787, 9.179),
        (28195, 'Bremen', 3500, 53.0736, 8.8064),
        (40213, 'Düsseldorf', 4500, 51.2254, 6.7763),
        (68159, 'Mannheim', 2500, 49.4875, 8.466),
        (39104, 'Magdeburg', 2000, 52.1306, 11.6244);
    `;

    const insertDataShipments = `
        INSERT INTO shipments (PLZ_From, Weight) VALUES
        (20095, 5.0), (10115, 10.0), (80331, 15.0), (50667, 20.0),
        (60311, 25.0), (70173, 7.5), (28195, 12.5), (40213, 17.5),
        (68159, 22.5), (39104, 27.5);
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
                if (err && err.code !== 'ER_DUP_ENTRY') { // Ignore duplicate entry errors
                    callback(err);
                    return;
                }

                connection.query(insertDataShipments, (err) => {
                    connection.end();
                    callback(err);
                });
            });
        });
    });
}

module.exports = populateDatabase;
