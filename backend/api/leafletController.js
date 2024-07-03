const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "KEP_1M",
  port: 3306,
});

const weightQueries = {
  averageWeight: `
    SELECT 
        plz.PLZ AS Postleitzahl, 
        plz.Name AS Region, 
        plz.Residents AS Einwohner, 
        AVG(shipments.Weight) AS Durchschnittsgewicht,
        ST_X(plz.Coord) AS Longitude,
        ST_Y(plz.Coord) AS Latitude,
        plz.Area AS Flaeche,
        plz.Shape AS Geometrie
    FROM plz
    LEFT JOIN shipments ON plz.PLZ = shipments.PLZ_From
    WHERE shipments.Weight > 0 AND shipments.Weight <= 31.5
    GROUP BY plz.PLZ
    ORDER BY AVG(shipments.Weight) DESC
    LIMIT 1
  `,
  sendingWeight: `
    SELECT 
        plz.PLZ AS Postleitzahl, 
        plz.Name AS Region, 
        plz.Residents AS Einwohner, 
        AVG(shipments.Weight) AS Durchschnittsgewicht,
        ST_X(plz.Coord) AS Longitude,
        ST_Y(plz.Coord) AS Latitude,
        plz.Area AS Flaeche,
        plz.Shape AS Geometrie
    FROM plz
    LEFT JOIN shipments ON plz.PLZ = shipments.PLZ_From
    WHERE shipments.Weight > 0 AND shipments.Weight <= 31.5
    GROUP BY plz.PLZ
    ORDER BY AVG(shipments.Weight) DESC
    LIMIT 1
  `,
  weight: `
    SELECT 
        plz.PLZ AS Postleitzahl, 
        plz.Name AS Region, 
        plz.Residents AS Einwohner, 
        AVG(shipments.Weight) AS Durchschnittsgewicht,
        ST_X(plz.Coord) AS Longitude,
        ST_Y(plz.Coord) AS Latitude,
        plz.Area AS Flaeche,
        plz.Shape AS Geometrie
    FROM plz
    LEFT JOIN shipments ON plz.PLZ = shipments.PLZ_From
    WHERE shipments.Weight > 0 AND shipments.Weight <= 31.5
    GROUP BY plz.PLZ
    ORDER BY AVG(shipments.Weight) DESC
    LIMIT 1
  `,
  distanceWeight: `
    SELECT 
        plz.PLZ AS Postleitzahl, 
        plz.Name AS Region, 
        plz.Residents AS Einwohner, 
        AVG(shipments.Weight) AS Durchschnittsgewicht,
        ST_X(plz.Coord) AS Longitude,
        ST_Y(plz.Coord) AS Latitude,
        plz.Area AS Flaeche,
        plz.Shape AS Geometrie
    FROM plz
    LEFT JOIN shipments ON plz.PLZ = shipments.PLZ_From
    WHERE shipments.Weight > 0 AND shipments.Weight <= 31.5
    GROUP BY plz.PLZ
    ORDER BY AVG(shipments.Weight) DESC
    LIMIT 1
  `,
  shipments: (plz) => `
    SELECT 
      plz.Name AS Region, 
      plz.PLZ AS Postleitzahl, 
      COUNT(shipments.ID) AS Anzahl_der_Sendungen,
      ST_X(plz.Coord) AS Longitude,
      ST_Y(plz.Coord) AS Latitude
    FROM shipments 
    INNER JOIN plz ON shipments.PLZ_From = plz.PLZ 
    WHERE shipments.PLZ_From = '${plz}'
    GROUP BY plz.Name, plz.PLZ, plz.Coord
  `,
  region: `
    SELECT 
        plz.PLZ AS Postleitzahl, 
        plz.Name AS Region, 
        plz.Residents AS Einwohner, 
        AVG(shipments.Weight) AS Durchschnittsgewicht,
        ST_X(plz.Coord) AS Longitude,
        ST_Y(plz.Coord) AS Latitude,
        plz.Area AS Flaeche,
        plz.Shape AS Geometrie
    FROM plz
    LEFT JOIN shipments ON plz.PLZ = shipments.PLZ_From
    WHERE shipments.Weight > 0 AND shipments.Weight <= 31.5
    GROUP BY plz.PLZ
    ORDER BY AVG(shipments.Weight) DESC
    LIMIT 1
  `,
};

const queryDatabase = (query, res) => {
  connection.query(query, (error, results) => {
    if (error) {
      console.log(query, error, results);
      res.status(500).json({ error: "Error querying the database" });
      return;
    }
    console.log(results);
    res.status(200).json(results);
  });
};

module.exports = {
  averageWeight: (req, res) => queryDatabase(weightQueries.averageWeight, res),
  sendingWeight: (req, res) => queryDatabase(weightQueries.sendingWeight, res),
  weight: (req, res) => queryDatabase(weightQueries.weight, res),
  distanceWeight: (req, res) =>
    queryDatabase(weightQueries.distanceWeight, res),
  region: (req, res) => queryDatabase(weightQueries.region, res),
  shipments: (req, res) => {
    const { plz } = req.query;
    if (!plz) {
      res.status(400).json({ error: "Missing 'plz' parameter" });
      return;
    }
    queryDatabase(weightQueries.shipments(plz), res);
  },
};
