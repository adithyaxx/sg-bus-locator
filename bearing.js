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
const bufferSize = 2;
module.exports = (location, stopRoute, index)=>{
    location = [parseFloat(location.lng), parseFloat(location.lat)]
    var checkStopRoute = stopRoute.slice(0,index);
    
    /**
     * Compares given location to all N routes given
     * Sorts by distance and the first line is the point "snapped" to route's line
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
    if(!nextPointOnLine){
        /*
            if nextPoint is not avaliable, which happens if datamall gives a location close to a bus stop,
            get first point on next stop.
         */
        if(!checkStopRoute[nearestLine.index+1] || !checkStopRoute[nearestLine.index+1][0]){
            return 0;
        }else{
            nextPointOnLine = JSON.parse(JSON.stringify(checkStopRoute[nearestLine.index+1][0]))
        }
    }else{
        nextPointOnLine = JSON.parse(JSON.stringify(nextPointOnLine))
    }
    /**
     * Changes: As Datamall API does not always return location of points on the route, 
     * use nearestpoint on the line to next point on the line instead of the given location
     */
    
    var bearing = bearingPoint(nearestLine.geometry,(nextPointOnLine));
    if(bearing < 0){
        bearing = 360 + bearing;
    }
    bearing = Math.floor(bearing);
    //for debug
    //console.log(JSON.stringify([nextPointOnLine, nearestLine.geometry.coordinates])+',')
    //console.log(bearing);
    return bearing;
}