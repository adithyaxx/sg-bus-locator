const fs = require('fs');
module.exports = (busNo)=>{
    return JSON.parse(fs.readFileSync('./route_data/_'+busNo.toLowerCase()+'Coord.json').toString());
} 