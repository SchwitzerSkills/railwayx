const scottyAdapter = require("scotty-api-adapter");
const scotty = new scottyAdapter.ScottyAPI("https://fahrplan.vmobil.at/bin/mgate.exe")

class oebbClass {

    fromLocation = "";
    toLocation = "";

    constructor(fromLocation, toLocation){
        this.fromLocation = fromLocation;
        this.toLocation = toLocation;
    }

    async getTrainWay(date, time){
        const startLocationQuery = await scotty.getLocations(this.fromLocation);
        const endLocationQuery = await scotty.getLocations(this.toLocation);

        const startLocation = startLocationQuery[0].name;
        const endLocation = endLocationQuery[0].name;

        const selectedDate = new Date(date + " " + time);

        const journeys = await scotty.getTransportOptions(startLocation, endLocation, selectedDate)

        return await journeys;
    }

    addHoursToDate(hours){
        return new Date(new Date().setHours(new Date().getHours() + hours));
    }
    wayHoursToDate(hours){
        return new Date(new Date().setHours(new Date().getHours() - hours));
    }
}

module.exports = oebbClass;