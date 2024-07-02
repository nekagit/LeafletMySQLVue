-- Create the 'plz' table
CREATE TABLE IF NOT EXISTS `plz` (
    `PLZ` INT PRIMARY KEY,
    `Name` VARCHAR(100),
    `Residents` INT,
    `Latitude` DOUBLE,
    `Longitude` DOUBLE
);

-- Create the 'shipments' table
CREATE TABLE IF NOT EXISTS `shipments` (
    `ID` INT AUTO_INCREMENT PRIMARY KEY,
    `PLZ_From` INT,
    `Weight` DOUBLE,
    FOREIGN KEY (`PLZ_From`) REFERENCES `plz`(`PLZ`)
);

-- Insert sample data into 'plz' table
INSERT INTO `plz` (`PLZ`, `Name`, `Residents`, `Latitude`, `Longitude`) VALUES
(1001, 'Region A', 5000, 52.5200, 13.4050),
(2002, 'Region B', 3000, 48.8566, 2.3522),
(3003, 'Region C', 7000, 40.7128, -74.0060),
(4004, 'Region D', 1500, 51.5074, -0.1278),
(5005, 'Region E', 4500, 35.6895, 139.6917),
(6006, 'Region F', 3200, 55.7558, 37.6176),
(7007, 'Region G', 2800, 34.0522, -118.2437),
(8008, 'Region H', 6700, 41.8781, -87.6298),
(9009, 'Region I', 1200, 34.6937, 135.5023),
(1010, 'Region J', 2300, 59.9343, 30.3351);

-- Insert sample data into 'shipments' table
INSERT INTO `shipments` (`PLZ_From`, `Weight`) VALUES
(1001, 10.5),
(2002, 12.3),
(3003, 5.8),
(4004, 7.2),
(5005, 9.1),
(6006, 11.4),
(7007, 6.6),
(8008, 13.5),
(9009, 8.0),
(1010, 10.0);
