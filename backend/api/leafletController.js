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
  LIMIT 5
  `,
  totalWeight: (plz) => `
    SELECT 
        plz.PLZ AS Postleitzahl, 
        plz.Name AS Region, 
        SUM(shipments.Weight) AS Gesamtgewicht,
        COUNT(shipments.ID) AS Anzahl_der_Sendungen,
        ST_X(plz.Coord) AS Longitude,
        ST_Y(plz.Coord) AS Latitude,
        plz.Residents AS Einwohner,
        plz.Area AS Flaeche,
        plz.Shape AS Geometrie
    FROM plz
    LEFT JOIN shipments ON plz.PLZ = shipments.PLZ_From
    WHERE plz.PLZ = '${plz}' AND shipments.Weight > 0 AND shipments.Weight <= 31.5
    GROUP BY plz.PLZ
  LIMIT 5
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
  LIMIT 5
  `,
  distance: (maxDistance) => `
  SELECT 
    ST_Distance_Sphere(plz1.Coord, plz2.Coord) AS Distance,
    plz1.PLZ AS PLZ_From,
    plz2.PLZ AS PLZ_To,
    ST_X(plz1.Coord) AS Longitude_From,
    ST_Y(plz1.Coord) AS Latitude_From,
    ST_X(plz2.Coord) AS Longitude_To,
    ST_Y(plz2.Coord) AS Latitude_To
  FROM plz AS plz1
  CROSS JOIN plz AS plz2
  WHERE ST_Distance_Sphere(plz1.Coord, plz2.Coord) < ${maxDistance}
    AND plz1.PLZ != plz2.PLZ
  ORDER BY Distance ASC
  LIMIT 5
`,
};

const queryDatabase = (query, res) => {
  connection.query(query, (error, results) => {
    if (error) {
      // console.log(query, error, results);
      res.status(500).json({ error: "Error querying the database" });
      return;
    }
    console.log(results);
    res.status(200).json(results);
  });
};

module.exports = {
  averageWeight: (req, res) => queryDatabase(weightQueries.averageWeight, res),
  totalWeight: (req, res) => {
    const { plz } = req.query;
    if (!plz) {
      res.status(400).json({ error: "Missing 'plz' parameter" });
      return;
    }
    queryDatabase(weightQueries.totalWeight(plz), res);
  },
  distance: (req, res) => {
    const { distance } = req.query;
    if (!distance || isNaN(distance)) {
      res
        .status(400)
        .json({ error: "Invalid or missing 'distance' parameter" });
      return;
    }
    const maxDistance = parseInt(distance);
    queryDatabase(weightQueries.distance(maxDistance), res);
  },
  shipments: (req, res) => {
    const { plz } = req.query;
    if (!plz) {
      res.status(400).json({ error: "Missing 'plz' parameter" });
      return;
    }
    queryDatabase(weightQueries.shipments(plz), res);
  },
};
