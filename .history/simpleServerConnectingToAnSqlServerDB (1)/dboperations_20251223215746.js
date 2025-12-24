let config = require('./dbconfig');
var sql = require("mssql");


async function getAllFish() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query(`
            SELECT 
                fs.FishID,
                fs.CommonName,
                fs.ScientificName,
                fs.MinTankSizeGal,
                fs.FishSize,
                sc.Name AS Category,
                t.Type AS Temperament,
                t.Compatibility,
                bp.Schooling,
                cl.Name AS CareLevel,
                cl.Description AS CareDescription,
                wp.MinPH,
                wp.MaxPH,
                wp.MinGH,
                wp.MaxGH,
                wp.MinTemperature,
                wp.MaxTemperature,
                fp.DietDescription,
                fp.FeedingFrequency,
                fp.FeedingVolume
            FROM FishSpecies fs
            LEFT JOIN SpeciesCategory sc ON fs.SpeciesCategoryID = sc.SpeciesCategoryID
            LEFT JOIN Temperment t ON fs.TempermentID = t.TempermentID
            LEFT JOIN BehaviourProfile bp ON fs.BehaviourID = bp.BehaviourID
            LEFT JOIN CareLevel cl ON fs.CareLevelID = cl.CareLevelID
            LEFT JOIN WaterProfile wp ON fs.WaterProfileID = wp.WaterProfileID
            LEFT JOIN FeedingProfile fp ON fs.FeedingProfileID = fp.FeedingProfileID
            ORDER BY fs.CommonName
        `);
        return result.recordsets[0];
    }
    catch(error) {
        console.log('Error in getAllFish:', error);
        throw error;
    }
}


async function getFishById(fishId) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('fishId', sql.BigInt, fishId)
            .query(`
                SELECT 
                    fs.FishID,
                    fs.CommonName,
                    fs.ScientificName,
                    fs.MinTankSizeGal,
                    fs.FishSize,
                    sc.Name AS Category,
                    t.Type AS Temperament,
                    t.Compatibility,
                    bp.Schooling,
                    cl.Name AS CareLevel,
                    cl.Description AS CareDescription,
                    wp.MinPH,
                    wp.MaxPH,
                    wp.MinGH,
                    wp.MaxGH,
                    wp.MinTemperature,
                    wp.MaxTemperature,
                    fp.DietDescription,
                    fp.FeedingFrequency,
                    fp.FeedingVolume
                FROM FishSpecies fs
                LEFT JOIN SpeciesCategory sc ON fs.SpeciesCategoryID = sc.SpeciesCategoryID
                LEFT JOIN Temperment t ON fs.TempermentID = t.TempermentID
                LEFT JOIN BehaviourProfile bp ON fs.BehaviourID = bp.BehaviourID
                LEFT JOIN CareLevel cl ON fs.CareLevelID = cl.CareLevelID
                LEFT JOIN WaterProfile wp ON fs.WaterProfileID = wp.WaterProfileID
                LEFT JOIN FeedingProfile fp ON fs.FeedingProfileID = fp.FeedingProfileID
                WHERE fs.FishID = @fishId
            `);
        return result.recordsets[0];
    }
    catch(error) {
        console.log('Error in getFishById:', error);
        throw error;
    }
}


async function searchFish(searchQuery) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('searchQuery', sql.VarChar(200), '%' + searchQuery + '%')
            .query(`
                SELECT 
                    fs.FishID,
                    fs.CommonName,
                    fs.ScientificName,
                    fs.MinTankSizeGal,
                    fs.FishSize,
                    sc.Name AS Category,
                    cl.Name AS CareLevel
                FROM FishSpecies fs
                LEFT JOIN SpeciesCategory sc ON fs.SpeciesCategoryID = sc.SpeciesCategoryID
                LEFT JOIN CareLevel cl ON fs.CareLevelID = cl.CareLevelID
                WHERE fs.CommonName LIKE @searchQuery 
                   OR fs.ScientificName LIKE @searchQuery
                ORDER BY fs.CommonName
            `);
        return result.recordsets[0];
    }
    catch(error) {
        console.log('Error in searchFish:', error);
        throw error;
    }
}

module.exports = {
    getAllFish: getAllFish,
    getFishById: getFishById,
    searchFish: searchFish,
};

