const searchParams = new URLSearchParams(window.location.search);


document.addEventListener("DOMContentLoaded", (event) => {
    const fromTrainStation = document.getElementById("origin");
    const toTrainStation = document.getElementById("destination");
    const time = document.getElementById("time");
    const date = document.getElementById("date");
    const stationPoints = document.getElementById("stationPoints");
    const points = document.getElementById("points");
    const paramFrom = searchParams.get("von");
    const paramTo = searchParams.get("nach");

    time.value = new Date().toLocaleTimeString().substring(0, 5);
    date.valueAsDate = new Date();

    if(paramFrom != null || paramTo != null){

        fromTrainStation.value = paramFrom;
        toTrainStation.value = paramTo;

        searchTrain(fromTrainStation.value, toTrainStation.value);
        return;
    }
    
    document.getElementById("searchTrainWay").addEventListener("click", function(){
        searchTrain(fromTrainStation.value, toTrainStation.value);
    })

    function searchTrain(from, to){

        stationPoints.innerText = "";
        points.innerText = "";
        
        if(from == "" || to == ""){
            stationPoints.innerText = "Text ausfüllen!";
            return;
        }

        document.getElementById("trainway").innerText = from + " - " + to;

        fetch('https://oebb.phillips-network.work:3000/getTrainWays?fromLocation=' + from + '&toLocation=' + to + "&date=" + date.value + "&time=" + time.value) // api for the get request
            .then(async response => response.json())
            .then(async dataObject => {
                console.log(dataObject);
                let data = dataObject.timeline;
                console.log(data);

                for (let i = 0; i < data.length; i += 2) {
                const departure = data[i].dep;
                const arrival = data[i].arr;
                if(data[i].hasOwnProperty("mode")){
                    stationPoints.innerHTML += `
                    <div class="md:w-1/2 md:pr-4 mb-4">
                        <h3 class="text-lg font-semibold text-gray-800">${departure.stopName} (${data[i].mode.type != "Regional bus" ? (departure.platform != null ? "Bgst. " + departure.platform : "-") : "Regional bus"})</h3>
                        <p class="text-sm text-gray-600">${i === 0 ? 'Startstation' : 'Zwischenstation'}</p>
                        <p class="text-sm">${departure.scheduled.hours}:${departure.scheduled.minutes}:${departure.scheduled.seconds}</p>
                    </div>
                    <div class="md:w-1/2 md:pl-4 mb-4">
                        <h3 class="text-lg font-semibold text-gray-800">${arrival.stopName} (${data[i].mode.type != "Regional bus" ? (departure.platform != null ? "Bgst. " + departure.platform : "-") : "Regional bus"})</h3>
                        <p class="text-sm text-gray-600">${i === data.length - 1 ? 'Endstation' : 'Zwischenstation'}</p>
                        <p class="text-sm">${arrival.scheduled.hours}:${arrival.scheduled.minutes}:${arrival.scheduled.seconds}</p>
                    </div>
                    `;
                } else {
                    stationPoints.innerHTML += `
                    <div class="md:w-1/2 md:pr-4 mb-4">
                        <h3 class="text-lg font-semibold text-gray-800">${departure.stopName} (Bgst. ${departure.platform != null ? departure.platform : "-"})</h3>
                        <p class="text-sm text-gray-600">${i === 0 ? 'Startstation' : 'Zwischenstation'}</p>
                        <p class="text-sm">${departure.scheduled.hours}:${departure.scheduled.minutes}:${departure.scheduled.seconds}</p>
                    </div>
                    <div class="md:w-1/2 md:pl-4 mb-4">
                        <h3 class="text-lg font-semibold text-gray-800">${arrival.stopName} (Bgst. ${arrival.platform != null ? arrival.platform : "-"})</h3>
                        <p class="text-sm text-gray-600">${i === data.length - 1 ? 'Endstation' : 'Zwischenstation'}</p>
                        <p class="text-sm">${arrival.scheduled.hours}:${arrival.scheduled.minutes}:${arrival.scheduled.seconds}</p>
                    </div>
                    `;
                }

                if (i !== data.length - 1) {
                    if (data[i + 1].id) {
                        points.innerHTML += `
                            <div class="bg-blue-500 rounded-full h-8 w-24 flex items-center justify-center flex-wrap">
                                <span class="text-white text-sm font-semibold">${data[i].id}</span>
                            </div>
                            <div class="bg-blue-500 rounded-full h-8 w-24 flex items-center justify-center flex-wrap">
                                <span class="text-white text-sm font-semibold">${data[i + 1].id}</span>
                            </div>`;
                    } else {
                        points.innerHTML += `
                            <div class="bg-blue-500 rounded-full h-8 w-24 flex items-center justify-center flex-wrap">
                                <span class="text-white text-sm font-semibold">${data[i].id}</span>
                            </div>
                            <div class="bg-blue-500 rounded-full h-8 w-24 flex items-center justify-center flex-wrap">
                                <span class="text-white text-sm font-semibold">${data[i].id}</span>
                            </div>`;
                    }
                    } else {
                        points.innerHTML += `
                            <div class="bg-blue-500 rounded-full h-8 w-24 flex items-center justify-center flex-wrap">
                                <span class="text-white text-sm font-semibold">${data[i].id}</span>
                            </div>
                            <div class="bg-blue-500 rounded-full h-8 w-24 flex items-center justify-center flex-wrap">
                                <span class="text-white text-sm font-semibold">${data[i].id}</span>
                            </div>`;
                    }
                }

            });
    }
});