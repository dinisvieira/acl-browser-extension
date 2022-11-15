/* generic error handler */
function onError(error) {
    console.log(error);
}

function initCalendar(dataJson) {
    
    if (typeof dataJson === 'undefined')
    {
        console.log("No data to display");
        return;
    }

    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        height: "auto",
        //aspectRatio: 1.8,
        headerToolbar: { center: 'dayGridMonth,timeGridWeek' }, // buttons for switching between views
        initialView: 'timeGridWeek',
        locale: 'pt',
        themeSystem: 'standard',
        nowIndicator: true,
        slotMinTime: '06:00:00',
        slotMaxTime: '22:00:00',
        businessHours: {
            daysOfWeek: [ 1, 2, 3, 4, 5 ], // Monday - Friday          
            startTime: '08:00',
            endTime: '18:00',
        },
        eventContent: function(info)
        {
            var content = [];
            var description = info.event.extendedProps["description"];

            var titleDiv = document.createElement('div');
            titleDiv.innerText = info.event.title;
            content[0] = titleDiv;

            if(info.view.type == 'timeGridWeek')
            {
                var subtitleDiv = document.createElement('small');
                subtitleDiv.innerText = description;
                content[1] = subtitleDiv;    
            }

            return  { domNodes: content };
        },
        events: function(info, successCallback, failureCallback) 
        {
            var dates = []
            datesArr = dataJson.data;       
            
            if (typeof datesArr !== 'undefined')
            {
                datesArr.forEach(element => 
                {
                    if(element.lixo == false)
                    {
                        var title = element.piloto

                        var dateTest = 
                        {
                            title: title,
                            start: element.data_inicio,
                            end: element.data_fim,
                            description: element.obs,
                            editable: false
                        }

                        var selAero = document.getElementById("aeronavePicker");
                        var selAeroId = selAero.value;

                        if(selAeroId == 1 && element.aeronave === "D-EAYV"){
                            dates.push(dateTest);
                        }
                        else if(selAeroId == 2 && element.aeronave === "D-EAYS"){
                            dates.push(dateTest);
                        }
                        else if(selAeroId == 3 && element.aeronave === "G-OBEN"){
                            dates.push(dateTest);
                        }
                        else if(selAeroId == 4 && element.aeronave === "CS-AQN"){
                            dates.push(dateTest);
                        }
                        else if (selAeroId == 0 && (element.aeronave === "D-EAYS" || element.aeronave === "D-EAYV" || element.aeronave === "G-OBEN" || element.aeronave === "CS-AQN")){
                            dates.push(dateTest);
                        }
                    }
                });
    
                successCallback(dates);
            }
            else{
                console.log("No data to display");
            }
        },
    });

    document.getElementById('aeronavePicker').addEventListener('change', function() {
        calendar.refetchEvents();
    });

    calendar.render();
}

document.addEventListener('DOMContentLoaded', function() 
{
    var getData = browser.storage.local.get("reservas-data-json");
    getData.then((results) => {
        
        var jsonStr = results["reservas-data-json"];

        var jsonData = JSON.parse(jsonStr);

        initCalendar(jsonData);
    }, onError);
});