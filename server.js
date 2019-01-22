let _und = require("underscore");
const Koa = require('koa');
const cors = require('kcors');
const got = require('got');
const cache = require('lru-cache')({
    maxAge: 1000 * 15 // 15 seconds
});

setInterval(() => cache.prune(), 1000 * 60); // Prune every minute

const app = new Koa();
app.use(cors());

app.use(async (ctx) => {
    const {busNo} = ctx.request.query;

    if (!busNo || !["179", "179A", "199"].includes(busNo)) {
        ctx.body = "Usage: '/?busNo=179'\n\nProject is available at https://github.com/adithyaxx/SG-Bus-Locator";
        return;
    }

    let locations = cache.get(busNo);
    console.log('🚌  ' + busNo);

    if (!locations) {
        let _179BusStopCodes, _179aBusStopCodes, _199BusStopCodes, busStopCodes, url, i;
        const base_url = 'http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=';
        locations = [];

        _179BusStopCodes = [
            {stopId: "22009", lon: 103.705050, lat: 1.339557},
            {stopId: "22501", lon: 103.702996, lat: 1.337709},
            {stopId: "22511", lon: 103.700302, lat: 1.337503},
            {stopId: "22521", lon: 103.697766, lat: 1.337440},
            {stopId: "22451", lon: 103.695428, lat: 1.338737},
            {stopId: "27301", lon: 103.694394, lat: 1.340499},
            {stopId: "27321", lon: 103.691467, lat: 1.344103},
            {stopId: "27281", lon: 103.687793, lat: 1.345591},
            {stopId: "27291", lon: 103.686510, lat: 1.347721},
            {stopId: "27311", lon: 103.685582, lat: 1.348792},
            {stopId: "27061", lon: 103.683727, lat: 1.349764},
            {stopId: "27211", lon: 103.680714869, lat: 1.34802721765},
            {stopId: "27221", lon: 103.678502, lat: 1.346137},
            {stopId: "27231", lon: 103.679253949, lat: 1.34212700586},
            {stopId: "27241", lon: 103.681879379, lat: 1.34008629722},
            {stopId: "27251", lon: 103.683699, lat: 1.342280},
            {stopId: "27261", lon: 103.686859, lat: 1.343761},
            {stopId: "27329", lon: 103.691838, lat: 1.344013},
            {stopId: "27309", lon: 103.694256, lat: 1.341063},
            {stopId: "22459", lon: 103.695446, lat: 1.339190},
            {stopId: "22529", lon: 103.697290, lat: 1.337739},
            {stopId: "22519", lon: 103.700004, lat: 1.337768},
            {stopId: "22509", lon: 103.703223, lat: 1.338014},
            {stopId: "22009", lon: 103.705050, lat: 1.339557}
        ];

        _179aBusStopCodes = [
            {stopId: "22009", lon: 103.705050, lat: 1.339557},
            {stopId: "27281", lon: 103.687793, lat: 1.345591},
            {stopId: "27291", lon: 103.686510, lat: 1.347721},
            {stopId: "27311", lon: 103.685582, lat: 1.348792},
            {stopId: "27061", lon: 103.683727, lat: 1.349764},
            {stopId: "27211", lon: 103.680714869, lat: 1.34802721765},
            {stopId: "27221", lon: 103.678502, lat: 1.346137},
            {stopId: "27231", lon: 103.679253949, lat: 1.34212700586},
            {stopId: "27241", lon: 103.681879379, lat: 1.34008629722},
            {stopId: "27251", lon: 103.683699, lat: 1.342280},
            {stopId: "27261", lon: 103.686859, lat: 1.343761},
            {stopId: "22009", lon: 103.705050, lat: 1.339557}
        ];

        _199BusStopCodes = [
            {stopId: "22009", lon: 103.705050, lat: 1.339557},
            {stopId: "22489", lon: 103.705385, lat: 1.342664},
            {stopId: "21371", lon: 103.706176, lat: 1.345246},
            {stopId: "27091", lon: 103.703887, lat: 1.349081},
            {stopId: "27101", lon: 103.701123, lat: 1.352538},
            {stopId: "27121", lon: 103.695858, lat: 1.356212},
            {stopId: "27171", lon: 103.691578, lat: 1.356125},
            {stopId: "27181", lon: 103.689020, lat: 1.355900},
            {stopId: "27011", lon: 103.68708726, lat: 1.35578737701},
            {stopId: "27071", lon: 103.684416, lat: 1.355024},
            {stopId: "27021", lon: 103.681946, lat: 1.353285},
            {stopId: "27031", lon: 103.680597916, lat: 1.35188837271},
            {stopId: "27041", lon: 103.678639, lat: 1.350756},
            {stopId: "27051", lon: 103.676605, lat: 1.348447},
            {stopId: "27219", lon: 103.680283228, lat: 1.34804764383},
            {stopId: "27069", lon: 103.684148, lat: 1.350096},
            {stopId: "27209", lon: 103.68567441, lat: 1.35149988736},
            {stopId: "27199", lon: 103.686869, lat: 1.354315},
            {stopId: "27189", lon: 103.684148, lat: 1.350096},
            {stopId: "27179", lon: 103.691696, lat: 1.356243},
            {stopId: "27169", lon: 103.693826, lat: 1.356863},
            {stopId: "27129", lon: 103.696061, lat: 1.356449},
            {stopId: "27109", lon: 103.700786, lat: 1.353112},
            {stopId: "27099", lon: 103.703583, lat: 1.350216},
            {stopId: "21379", lon: 103.706519, lat: 1.345301},
            {stopId: "22481", lon: 103.705591, lat: 1.342578},
            {stopId: "22009", lon: 103.705050, lat: 1.339557}
        ];

        if (busNo === "179")
            busStopCodes = _179BusStopCodes;
        else if (busNo === "179A")
            busStopCodes = _179aBusStopCodes;
        else if (busNo === "199")
            busStopCodes = _199BusStopCodes;

        for (i = 0; i < busStopCodes.length; i++) {
            if (i % 3 === 0) {
                url = base_url + busStopCodes[i].stopId;

                const {body, statusCode} = await got(url, {
                    json: true,
                    timeout: 1000 * 10, // 10 seconds
                    retry: 3,
                    headers: {
                        AccountKey: process.env.API_KEY
                    },
                });

                if (statusCode !== 200 || !body) {
                    ctx.body = {
                        error: 'Invalid bus number provided'
                    };
                    return;
                }

                // Converts from degrees to radians.
                Math.radians = function (degrees) {
                    return degrees * Math.PI / 180;
                };

                // Converts from radians to degrees.
                Math.degrees = function (radians) {
                    return parseInt(radians * 180 / Math.PI);
                };

                body.Services.map((service) => {
                    const {NextBus} = service;

                    if (service.ServiceNo === busNo && NextBus.Latitude !== "0" && _und.findWhere(locations, {lat: NextBus.Latitude}) === undefined) {
                        let startLat, startLong, endLat, endLong;

                        if (i > 0) {
                            startLat = Math.radians(busStopCodes[i - 1].lat);
                            startLong = Math.radians(busStopCodes[i - 1].lon);
                            endLat = Math.radians(busStopCodes[i].lat);
                            endLong = Math.radians(busStopCodes[i].lon);

                            let bearing, dLong = endLong - startLong,
                                dPhi = Math.log(Math.tan(endLat / 2.0 + Math.PI / 4.0) / Math.tan(startLat / 2.0 + Math.PI / 4.0));

                            if (Math.abs(dLong) > Math.PI) {
                                if (dLong > 0.0)
                                    dLong = -(2.0 * Math.PI - dLong);
                                else
                                    dLong = (2.0 * Math.PI + dLong);
                            }

                            bearing = (Math.degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;

                            locations.push({lat: NextBus.Latitude, lng: NextBus.Longitude, bearing: bearing});
                        } else
                            locations.push({lat: NextBus.Latitude, lng: NextBus.Longitude, bearing: 0});
                    }
                });
            }
        }

        cache.set(busNo, locations);
    }

    ctx.set('cache-control', 'max-age=10');
    ctx.body = {
        locations
    };
});

const port = process.env.PORT || 8081;
app.listen(port);
console.log('Server started at port ' + port);
