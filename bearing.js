/**
 * Takes a busNo and busLocation , calculates bearing by finding nearest item on route and calculates bearing in between them
 */
const {
    lineString,
    point,
    multiLineString
} = require('@turf/helpers');
const _ = require('underscore');
const nearest = require('@turf/nearest-point-on-line').default;
const bearingPoint = require('@turf/bearing').default;
const bufferSize = 3;
module.exports = (location, stopRoute, index)=>{
    location = [parseFloat(location.lng), parseFloat(location.lat)]
    var checkStopRoute = stopRoute.slice(0,index);
    
    /**
     * Find which route in between bus stops is nearest to given location
     * 1) Calculate nearest distance pairings for given bus and next bus
     * 2) Sort by distance
     */
    var nearestLines = _.map(checkStopRoute, (route, routeIndex)=>{
        if(route.length == 1){
            var previous = checkStopRoute[routeIndex - 1]
            route.unshift(previous[previous.length - 1])
            return {
                index: routeIndex,
                ...nearest(lineString(route), point(location))
            }
        }else{
            return {
                index: routeIndex,
                ...nearest(lineString(route), point(location))
            }
        }
    })
    nearestLines = _.sortBy(nearestLines, (d)=> d.properties.dist);
    var nearestLine = nearestLines[0];
    var nextPointOnLine = checkStopRoute[nearestLine.index][nearestLine.properties.index + bufferSize];
    //if bus is at last point, get next stop's first point
    //console.log('next point set : ', nextPointOnLine)
    if(!nextPointOnLine){
        //if nextpointonline is not avaliable, take first point on next line
        if(!checkStopRoute[nearestLine.index+1] || !checkStopRoute[nearestLine.index+1][0]){
            return 0;
        }else{
            nextPointOnLine = JSON.parse(JSON.stringify(checkStopRoute[nearestLine.index+1][0]))
        }
    }else{
        nextPointOnLine = JSON.parse(JSON.stringify(nextPointOnLine))
    }
    var bearing = bearingPoint(point(location),(nextPointOnLine));
    //for debug
    //console.log(JSON.stringify([nextPointOnLine, location])+',')
    return bearing;
}