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
    Date DATE,  -- Ensure 'Date' column is defined
    PLZ_From VARCHAR(10),
    PLZ_To VARCHAR(10),
    Weight FLOAT,
    FOREIGN KEY (PLZ_From) REFERENCES plz(PLZ),
    FOREIGN KEY (PLZ_To) REFERENCES plz(PLZ)
);
  `;

  const insertDataPlz = `
    INSERT IGNORE INTO plz (PLZ, Name, Residents, Coord, Area, Shape) VALUES
    ('44135', 'Dortmund Mitte-Nordost', 15909, ST_GeomFromText('POINT(7.465911 51.513788)'), 2.5, '{"type":"Polygon","coordinates":[[[7.465911,51.513788],[7.469945,51.512503],[7.468599,51.513983],[7.465911,51.513788]]]}'),
    ('44136', 'Dortmund Mitte-Ost', 26798, ST_GeomFromText('POINT(7.475602 51.514252)'), 3.1, '{"type":"Polygon","coordinates":[[[7.475602,51.514252],[7.477093,51.512516],[7.475837,51.513979],[7.475602,51.514252]]]}'),
    ('01067', 'Dresden Altstadt', 18619, ST_GeomFromText('POINT(13.7386723 51.0493286)'), 2.6, '{"type":"Polygon","coordinates":[[[13.7386723,51.0493286],[13.7408885,51.0493211],[13.7408692,51.0485141],[13.7386792,51.0485218],[13.7386723,51.0493286]]]}'),
    ('04109', 'Leipzig Zentrum', 53918, ST_GeomFromText('POINT(12.3747329 51.3406321)'), 1.5, '{"type":"Polygon","coordinates":[[[12.3747329,51.3406321],[12.3777329,51.3406321],[12.3777329,51.3386321],[12.3747329,51.3386321],[12.3747329,51.3406321]]]}'),
    ('10115', 'Berlin Mitte', 101936, ST_GeomFromText('POINT(13.3849184 52.5316038)'), 10.4, '{"type":"Polygon","coordinates":[[[13.3849184,52.5316038],[13.3896139,52.5316042],[13.3896135,52.5272854],[13.3849181,52.527285],[13.3849184,52.5316038]],[[13.3883106,52.5292514],[13.3863083,52.5306966],[13.3879246,52.5313832],[13.389927,52.529938],[13.3883106,52.5292514]]]}'),
    ('20095', 'Hamburg Altstadt', 70921, ST_GeomFromText('POINT(10.0009025 53.5496315)'), 1.6, '{"type":"Polygon","coordinates":[[[10.0009025,53.5496315],[10.004742,53.5494261],[10.0035127,53.5483916],[10.0009776,53.5485629],[10.0009025,53.5496315]]]}'),
    ('24103', 'Kiel Altstadt', 12000, ST_GeomFromText('POINT(10.1414806 54.3232927)'), 0.8, '{"type":"Polygon","coordinates":[[[10.1414806,54.3232927],[10.1444806,54.3232927],[10.1444806,54.3212927],[10.1414806,54.3212927],[10.1414806,54.3232927]]]}'),
    ('28195', 'Bremen Mitte', 16429, ST_GeomFromText('POINT(8.8071646 53.0758196)'), 1.2, '{"type":"Polygon","coordinates":[[[8.8071646,53.0758196],[8.8101646,53.0758196],[8.8101646,53.0738196],[8.8071646,53.0738196],[8.8071646,53.0758196]]]}'),
    ('30159', 'Hannover Mitte', 276088, ST_GeomFromText('POINT(9.7310458 52.3731266)'), 10.5, '{"type":"Polygon","coordinates":[[[9.7310458,52.3731266],[9.7369612,52.3731457],[9.7369108,52.3696157],[9.7310538,52.3695774],[9.7310458,52.3731266]]]}'),
    ('40210', 'Düsseldorf Stadtmitte', 63130, ST_GeomFromText('POINT(6.7798831 51.2220086)'), 5.3, '{"type":"Polygon","coordinates":[[[6.7798831,51.2220086],[6.7840954,51.2220115],[6.784072,51.2198565],[6.7798695,51.2198738],[6.7798831,51.2220086]]]}'),
    ('45127', 'Essen Stadtmitte', 12618, ST_GeomFromText('POINT(7.0085774 51.4566338)'), 3.0, '{"type":"Polygon","coordinates":[[[7.0085774,51.4566338],[7.0112224,51.4566341],[7.0112073,51.4554882],[7.0085624,51.4554821],[7.0085774,51.4566338]]]}'),
    ('48143', 'Münster Mitte', 16259, ST_GeomFromText('POINT(7.6194163 51.9627398)'), 2.9, '{"type":"Polygon","coordinates":[[[7.6194163,51.9627398],[7.6241163,51.9627398],[7.6241163,51.9589398],[7.6194163,51.9589398],[7.6194163,51.9627398]]]}'),
    ('49074', 'Osnabrück Weststadt', 16787, ST_GeomFromText('POINT(8.0430993 52.2786991)'), 3.5, '{"type":"Polygon","coordinates":[[[8.0430993,52.2786991],[8.0475783,52.2787349],[8.0475987,52.2770998],[8.0431197,52.2770639],[8.0430993,52.2786991]]]}'),
    ('50667', 'Köln Altstadt-Süd', 17518, ST_GeomFromText('POINT(6.9531019 50.9338654)'), 5.4, '{"type":"Polygon","coordinates":[[[6.9531019,50.9338654],[6.9565354,50.9338603],[6.9564654,50.9319955],[6.9531032,50.9319996],[6.9531019,50.9338654]]]}'),
    ('60311', 'Frankfurt am Main Innenstadt', 68617, ST_GeomFromText('POINT(8.6746497 50.1109165)'), 3.7, '{"type":"Polygon","coordinates":[[[8.6746497,50.1109165],[8.6766503,50.1109113],[8.676584,50.1091994],[8.6746514,50.1092052],[8.6746497,50.1109165]]]}'),
    ('68161', 'Mannheim Quadrate', 23999, ST_GeomFromText('POINT(8.467971 49.4890294)'), 2.1, '{"type":"Polygon","coordinates":[[[8.467971,49.4890294],[8.4712455,49.4889214],[8.4712198,49.4872598],[8.4679463,49.4873678],[8.467971,49.4890294]]]}'),
    ('70173', 'Stuttgart Mitte', 16003, ST_GeomFromText('POINT(9.1796962 48.7761503)'), 4.3, '{"type":"Polygon","coordinates":[[[9.1796962,48.7761503],[9.1811948,48.7761366],[9.1811664,48.7745636],[9.1797056,48.7745751],[9.1796962,48.7761503]]]}');
    `;

  const insertDataShipments = `
    INSERT INTO shipments (Date, PLZ_From, PLZ_To, Weight) VALUES
    ('2024-07-03', '44135', '97618', 20.5),   
    ('2024-07-03', '10115', '20095', 12.3),   
    ('2024-07-03', '30159', '40210', 15.7),   
    ('2024-07-03', '50667', '60311', 8.4),    
    ('2024-07-03', '70173', '80331', 7.1),    
    ('2024-07-03', '90402', '01067', 11.2),   
    ('2024-07-03', '45127', '04109', 5.8),    
    ('2024-07-03', '28195', '99084', 3.9),    
    ('2024-07-03', '24103', '49074', 2.4),    
    ('2024-07-03', '68161', '44135', 5.2),    
    ('2024-07-03', '44136', '48143', 7.5);    
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
        if (err) {
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
