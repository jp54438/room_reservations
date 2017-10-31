
  let apikey = ''
  let searchStr
  let rooms = []
  let buildingsArray = []
  let room1Data = {}
  let room2Data = {}


  var init1 = {
    method: 'post',
    body: '{"building": ["A-talo"],"startDate": "2016-09-27T08:00", "endDate": "2016-10-27T18:00"}'
  }
  var init2 = {
    method: 'post',
    body: '{"building": ["A-talo"],"startDate": "2016-09-27T08:00", "endDate": "2016-10-27T18:00"}'
  }
  

  function getBuildings() {
    fetch('https://opendata.tamk.fi/r1/reservation/building?apiKey='+apikey).then((response) => 
       response.json()).then(initBuildings).catch(error)

  }

  function initBuildings(jsonObject) {
    buildingsArray = jsonObject.resources
    building1 = document.getElementById('building1')
    building2 = document.getElementById('building2')
    
    for (let item of buildingsArray) {
      if(!(item.code.includes('i käytössä', 0))) {
        option1 = document.createElement('option')
        option1.text = item.code
        option1.value = item.id
        building1.add(option1)
        option2 = document.createElement('option')
        option2.text = item.code
        option2.value = item.id
        building2.add(option2)
      }
    }
    document.getElementById('room1').disabled = true
    document.getElementById('room2').disabled = true
    
  }
  function resetForm(event){
    document.getElementById('room1').length = 0
    document.getElementById('room2').length = 0
    room1Data.reservations.length = 0
    room2Data.reservations.length = 0
    updateCharts()
  }

  function getRooms(event) {
    if(event.target === building1) {
      fetch('https://opendata.tamk.fi/r1/reservation/building/' + document.getElementById('building1').value + '?apiKey='+apikey).then((response) => 
       response.json()).then(initRoom1).catch(error)
    }
    else if (event.target === building2) {
      fetch('https://opendata.tamk.fi/r1/reservation/building/' + document.getElementById('building2').value + '?apiKey='+apikey).then((response) => 
       response.json()).then(initRoom2).catch(error)
    }
  }

  function initRoom1(jsonObject) {
    resourcesArray = jsonObject.resources
    room = document.getElementById('room1')
    room.length = 0
    for (let item of resourcesArray) {
      option = document.createElement('option')
      option.text = item.code
      option.value = item.code
      room.add(option)
    }
    document.getElementById('room1').disabled = false
  }

  function initRoom2(jsonObject) {
    resourcesArray = jsonObject.resources
    room = document.getElementById('room2')
    room.length = 0
    for (let item of resourcesArray) {
      option = document.createElement('option')
      option.text = item.code
      option.value = item.code
      room.add(option)
    }

    document.getElementById('room2').disabled = false
  }

    function tulosta(jsonObject) {
      console.log(jsonObject)
      drawChart()
    }

    function decimalRound (number, precision) {
      console.log('number: ' +number)
      var factor = Math.pow(10, precision);
      console.log('factor: ' + factor)
      var tempNumber = number * factor;
      var roundedTempNumber = Math.round(tempNumber);
      console.log('number uudestaan: ' +number)
      return roundedTempNumber / factor;
    }

  function drawBarChart(val1, val2, canvas, multiplier) {
      var ctx = canvas.getContext("2d");
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0,0, canvas.clientWidth, canvas.clientHeight)
      ctx.shadowBlur = 4;
      ctx.shadowColor="black";
      
      valMax = 0
      isVal1 = true

      if(val1 >  val2) {
        valMax = val1 
        isVal1 = true
      }
      else {
        valMax = val2
        isVal1 = false
      }
      if(valMax > canvas.clientHeight - 40) {
        valMax = canvas.clientHeight - 40
      }
    
      if(isVal1) {
        value1 = valMax
        if(val1 > 0) {
          value2 = (val2/val1)*valMax
        } else {
          value2 = 0
        }
      }
      else {
        value2 = valMax
        if(val2 > 0) {
          value1 = (val1/val2)*valMax
        } else {
          value1 = 0
        }
      }
      
      value1 = decimalRound(value1, 1)
      value2 = decimalRound(value2, 1)
      val1 = decimalRound(val1, 1)
      val2 = decimalRound(val2, 1)

      ctx.fillStyle = "#FF0000";
      ctx.fillRect(15,canvas.clientHeight,(canvas.clientWidth/2)-20, (0-value1) * multiplier)
      
      ctx.fillStyle = "#0000FF";
      ctx.fillRect(15+(canvas.clientWidth/2)-5,canvas.clientHeight,(canvas.clientWidth/2)-20, (0-value2) * multiplier)

      ctx.font = ctx.font.replace(/\d+px/, "12px")
      ctx.shadowBlur = 0
      ctx.fillStyle = "#FF0000";
      ctx.fillText( document.getElementById('room1').value + ': ', 5, 15)
      ctx.fillText(val1, 5, 30)
      ctx.fillStyle = "#0000FF";
      ctx.fillText(document.getElementById('room2').value + ': ', 105 , 15)
      ctx.fillText(val2, 105, 30)
      ctx.stroke();
  }  

  function recreateRoomsArray(jsonObject) {
    buildings.length = 0
    buildingArray = jsonObject.resources
    console.log(buildingArray)
    
    for (let building of buildingArray) {
      buildings.push(building.room)
    }
  }

    function error(err){
      console.log('Error!!!' + err)
    }

    
    function ready() {
      if(apikey.length === 0) {
        apikey = prompt('Please give Api key for TAMK Open Data', '');
      }
      document.getElementById('compare_btn').addEventListener('click',compareRooms)
      document.getElementById('reset_btn').addEventListener('click',resetForm)

      document.getElementById('building1').addEventListener('change',getRooms)
      document.getElementById('building2').addEventListener('change',getRooms)
      getBuildings()

      }

    window.addEventListener('load', ready)

    function compareRooms(){
      
      let error = ''

      if(!document.getElementById('building1').value) {
        error += 'Building 1 not selected!\n'
      }
      if(!document.getElementById('building2').value) {
        error += 'Building 2 not selected!\n'
      }

      if(!document.getElementById('room1').value) {
        error += 'Room for Building 1 not selected!\n'
      }
      if(!document.getElementById('room2').value) {
        error += 'Room for Building 2 not selected!\n'
      }
      if(!document.getElementById('start_date').value) {
        error += '\'From\' value not defined!\n'
      }
      if(!document.getElementById('end_date').value) {
        error += '\'To\' value not defined!\n'
      }

      if(new Date(document.getElementById('end_date').value).getTime() < new Date(document.getElementById('start_date').value).getTime() ) {
        error += '\'From\' date is later than \'To\' date!'
      }

      if(error.length > 0) {
        window.alert('Missing or incorrect input in seach form. Please find details below.\n\n' + error)
        return
      }

      let room1search = '{"room": ["' + document.getElementById('room1').value + '"],"startDate": "'+ document.getElementById('start_date').value+'T00:00", "endDate": "'+document.getElementById('end_date').value+'T23:59"}'
      let room2search = '{"room": ["' + document.getElementById('room2').value + '"],"startDate": "'+ document.getElementById('start_date').value+'T00:00", "endDate": "'+document.getElementById('end_date').value+'T23:59"}'
      init1.body = room1search
      init2.body = room2search
      fetch('https://opendata.tamk.fi/r1/reservation/search?apiKey='+apikey, init1).then((response) => 
      response.json()).then(room1Reservations).then( () => {fetch('https://opendata.tamk.fi/r1/reservation/search?apiKey='+apikey, init2).then((response2) => response2.json()).then(room2Reservations).then(updateCharts)}).catch(error)
    }

    function room1Reservations(jsonObject) {
      room1Data = jsonObject
      console.log('room1Data: '+ room1Data.reservations)
    }

    function room2Reservations(jsonObject) {
      room2Data = jsonObject
    }

    function updateCharts() {
      // Amount of reservations
      drawBarChart(room1Data.reservations.length, room2Data.reservations.length, document.getElementById('reservations'), 1 )
      
      // Total amount of hours
      let hours1 = 0
      for(let item of room1Data.reservations)
      {
        hours1 += (new Date(item.endDate).getHours() - new Date(item.startDate).getHours())
      }
      let hours2 = 0
      for(let item of room2Data.reservations)
      {
        hours2 += (new Date(item.endDate).getHours() - new Date(item.startDate).getHours())
      }

      drawBarChart(hours1, hours2, document.getElementById('hours'), 1)

      // Average hours / day
      let days = days_between(new Date(document.getElementById('start_date').value) , new Date(document.getElementById('end_date').value))
      console.log(hours1/days)
      console.log(hours2/days)
      drawBarChart(hours1/days, hours2/days, document.getElementById('hours_perday'), 30)
    }

    function days_between(date1, date2) {
      
      // The number of milliseconds in one day
      let ONE_DAY = 1000 * 60 * 60 * 24
  
      // Convert both dates to milliseconds
      let date1_ms = date1.getTime()
      let date2_ms = date2.getTime()
  
      // Calculate the difference in milliseconds
      let difference_ms = Math.abs(date1_ms - date2_ms)
  
      // Convert back to days and return
      return Math.round(difference_ms/ONE_DAY)
  
      }