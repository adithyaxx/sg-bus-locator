const fs = require('fs');
const _ = require('underscore');
const files = [
    '_179aRoute.json',
    '_199Route.json',
    '_179Route.json'
]
const polyline = require('@mapbox/polyline')
_.forEach(files, (file)=>{
    var contents = fs.readFileSync('../route_data/'+file).toString();
    contents = JSON.parse(contents);

    var coordinates = [];
    _.forEach(contents.routes, (route)=>{
        _.forEach(route.legs, (leg, i)=>{
            var coordinatesStep = [];
            _.forEach(leg.steps, (step)=>{
                var encoded = step.polyline.points
                var decoded = polyline.decode(encoded);
                decoded = _.map(decoded, (p) => p.reverse());
                coordinatesStep = coordinatesStep.concat(decoded)
            })
            coordinates.push(coordinatesStep);
        })
    })
    fs.writeFileSync('../route_data/'+file.replace('Route', 'Coord'), JSON.stringify(coordinates));
    console.log('Generated coordinates for ' , file);
})