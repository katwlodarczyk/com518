iziToast.settings({
  timeout: 3000, // default timeout
  resetOnHover: true,
  // icon: '', // icon class
  transitionIn: 'fadeIn',
  transitionOut: 'fadeOut',
  position: 'topRight',
});



// AUTOMATIC DATE UPDATE FOR FOOTER

const footerYear = document.getElementById("year");
const date = new Date();
const year = date.getFullYear();

footerYear.innerText = year;



// STAT COUNTER
function animateNumber(id, start, end, duration) {
  if (start === end) return;
  var range = end - start;
  var now = start;
  var increment = end > start? 1 : -1;
  var stepTime = Math.abs(Math.floor(duration / range));
  var obj = document.getElementById(id);
  var counter = setInterval(function() {
      now += increment;
      obj.innerHTML = now;
      if (now == end) {
          clearInterval(counter);
      }
  }, stepTime);
}
if (document.getElementById('stats')) {
  animateNumber("statAll", 0, 332, 5000);
  animateNumber("statRegions", 0, 19, 5000);
  animateNumber("statRestaurants", 0, 99, 5000);

}

//TO TOP BUTTON

toTopbutton = document.getElementById("toTopBtn");

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (
    document.body.scrollTop > 700 ||
    document.documentElement.scrollTop > 700
  ) {

    toTopbutton.style.display = "block";
  } else {
    toTopbutton.style.display = "none";
  }
}

function toTopFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}


// SEARCH 
async function poiSearch(type, field) {
    
  // Send a request to our remote URL
  const response = await  fetch(`/poi/${type}/${field}`);

  // Parse the JSON.
  const result = await response.json();
  // Loop through the array of JSON objects and add the results to a <div>
  let html = "";
  document.getElementById('mapResults').innerHTML = "";
  document.getElementById('results').innerHTML = "";

  let header =
    `
      <div class="flex flex-row justify-between sm:px-6 lg:px-8 py-4 text-md text-brand-navy ">
        <h2 class="text-2xl font-bold">Results for: <span class="pl-1 font-extrabold">${field}, ${type}</span></h2>
        <div>
          <button onclick="mapButtonClicked()" id="mapButton" class="focus:outline-none hover:font-bold">Map</button>
          <span> | </span>
          <button onclick="tableButtonClicked()" id="tableButton" class="focus:outline-none font-bold hover:font-bold">Table</button>
        </div>
      </div>
    `
  let resultsdivsstart =
    `
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8 pb-4 sm:pb-10">
        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
    `

  let resultsdivsend =
    `       </tbody
          </table>
        </div>
      </div>
    `
  let tableHeader = 
    `
    <thead class="bg-brand-light-gray">
      <tr>
        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Name
        </th>
        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Type
        </th>
        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Country
        </th>
        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Region
        </th>
        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Lon
        </th>
        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Lat
        </th>
        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Description
        </th>
        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Recommendations
        </th>
      </tr>
    </thead>
    <tbody>
  `;

  let noResultsNotification = `<h2 class="sm:px-6 lg:px-8 py-4 text-2xl text-brand-navy font-extrabold">Results for: <span class="pl-1 font-extrabold">${field}, ${type}</span></h2><p class="text-brand-navy text-xl font-normal sm:px-6 lg:px-8">Oops... Sorry, no matching results. Plase check your spelling or search for something else!</p>`

  if (result.length === 0){
      document.getElementById('results').innerHTML = noResultsNotification + html;
  } else {
      result.forEach ( result => {
          html += `
            <tr class="bg-white">
              <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${result.name}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                ${result.type}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                ${result.country}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                ${result.region}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                ${result.lon}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                ${result.lat}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                ${result.description}
              </td>
              <td class="pl-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${result.recommendations}
                <a id="recommendButton" onclick='recommend(${result.ID})' class="pl-8 text-sm text-brand-orange hover:underline cursor-pointer">Recommend</a>
              </td>
            </tr>
          `
      });
      document.getElementById('results').innerHTML = header +  resultsdivsstart + tableHeader + html + resultsdivsend;
  }
}

// SEARCH WITH MAP
async function poiSearchMap(type, field) {
  // Send a request to our remote URL
  const response = await  fetch(`/poi/${type}/${field}`);

  // Parse the JSON.
  const result = await response.json();
  // Loop through the array of JSON objects and add the results to a <div>
  let html = "";
  document.getElementById('mapResults').innerHTML = "";
      
  var resultHeaderDiv = document.createElement("div");
  resultHeaderDiv.className = "flex flex-row justify-between items-center sm:px-6 lg:px-8 py-4 text-md text-brand-navy" ;

  var resultHeader = document.createElement("h2");
  resultHeader.className= "sm:px-6 lg:px-8 py-4 text-brand-navy text-2xl font-bold";
  var resultHeaderText = document.createTextNode(`Results for: ${field}, ${type}`);

  var resultButtons = document.createElement("div");
  resultButtons.className="";
  var mapButton = document.createElement("button");
  mapButton.className = "font-bold hover:font-bold focus:outline-none";
  mapButton.id="mapButton";
  var divider = document.createElement("span");
  var dividerText = document.createTextNode(" | ");
  divider.className = "";
  var tableButton = document.createElement("button");
  tableButton.className= "hover:font-bold focus:outline-none";
  tableButton.id= "tableButton";
  tableButton.addEventListener('click', ()=> {
    document.getElementById("mapResults").innerHTML= "";
    const type = document.getElementById('poiType').value;
    const field = document.getElementById('poiField').value;
    poiSearch(type, field);
  });

  var mapButtonText = document.createTextNode("Map");
  var tableButtonText = document.createTextNode("Table");
  
  resultHeader.appendChild(resultHeaderText);
  mapButton.appendChild(mapButtonText);
  divider.appendChild(dividerText);
  tableButton.appendChild(tableButtonText);
  resultButtons.appendChild(mapButton);
  resultButtons.appendChild(divider);
  resultButtons.appendChild(tableButton);
  resultHeaderDiv.appendChild(resultHeader);
  resultHeaderDiv.appendChild(resultButtons);
  document.getElementById('mapResults').appendChild(resultHeaderDiv);
 

  var div = document.createElement("div");
  div.id = "map1";
  div.className = "sm:mx-6 lg:mx-16 lg:mr-8 w-auto h-43.75 z-10";
  document.getElementById('mapResults').appendChild(div);

  const map = L.map ("map1");
  const attrib="Map data copyright OpenStreetMap contributors, Open Database Licence";
  L.tileLayer
          ("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
              { attribution: attrib } ).addTo(map);

       
  let noResultsNotification = `<h2 class="sm:px-6 lg:px-8 py-4 text-2xl text-brand-navy font-extrabold">Results for: <span class="pl-1 font-extrabold">${field}, ${type}</span></h2><p class="text-brand-navy text-xl font-normal sm:px-6 lg:px-8">Oops... Sorry, no matching results. Plase check your spelling or search for something else!</p>`

  if (result.length === 0){
      document.getElementById('mapResults').innerHTML = noResultsNotification;
  } else {
      result.forEach ( result => {
           
        const pos = [`${result.lat}`, `${result.lon}`];            
        map.setView(pos, 8);

        const marker = L.marker(pos).addTo(map);
        marker.bindPopup(`<b>Name:</b> ${result.name} <br> <b>Description:</b> ${result.description}`);
      });
     
  }
}

function mapButtonClicked() {
  document.getElementById("results").innerHTML= "";
  const type = document.getElementById('poiType').value;
  const field = document.getElementById('poiField').value;
  poiSearchMap(type, field);
}

// Make the AJAX run when we click a search button
document.getElementById('searchButton').addEventListener('click', ()=> {
  const type = document.getElementById('poiType').value;
  const field = document.getElementById('poiField').value;
  poiSearch(type, field);
});


// Make the AJAX run when we click a map button
if (document.getElementById('mapButton')){
  document.getElementById('mapButton').addEventListener('click', ()=> {
    const type = document.getElementById('poiType').value;
    const field = document.getElementById('poiField').value;
    poiSearchMap(type, field);
  });
}

// Make the AJAX run when we click a table button
if (document.getElementById('tableButton')){
  document.getElementById('tableButton').addEventListener('click', ()=> {
    const type = document.getElementById('poiType').value;
    const field = document.getElementById('poiField').value;
    poiSearch(type, field);
  });
}



//  recommend a poi
async function recommend(id) {
  const poi = {
     recommendations : 1 
  }

  const response = await fetch(`/poi/${id}/recommend`, {
      method: 'POST',
      headers: {
          'Content-Type' : 'application/json'
      },
      body: JSON.stringify(poi)
  });

  if(response.status == 404) {
    iziToast.error({
      title: 'Error',
      message: 'Could not recommend. Please try again.',
  });
  } else {
      const data = await response.json();
      iziToast.success({
        title: 'Success',
        message: 'You have recommended a point of interest.',
    });
  } 
}

// Make the AJAX run when user clicks recommend button
if (document.getElementById('recommendButton')){
  document.getElementById('recommendButton').addEventListener('click', ()=> {
    const id = `${result.id}`;
    recommend(id);
  });
}


//  add a poi
async function ajaxAddNewPoi(name,region,country,type,lon,lat,description) {
  const newPoi = {
     'name': name,
     'region': region,
     'country': country,
     'type': type,
     'lon': lon,
     'lat': lat,
     'description' : description
  }

  const response = await fetch(`/addNew/poi`, {
      method: 'POST',
      headers: {
          'Content-Type' : 'application/json'
      },
      body: JSON.stringify(newPoi)
  });

  if(response.status == 404) {
    iziToast.error({
      title: 'Error',
      message: 'Could not add a point of interest. Please try again.',
  });
  } else if(response.status == 500){
    iziToast.error({
      title: 'Error',
      message: 'All fields must be filled with correct data.',
  });
  } else {
      const data = await response.json();
      document.getElementById('name').value='';
      document.getElementById('region').value='';
      document.getElementById('country').value='';
      document.getElementById('type').value='';
      document.getElementById('lon').value='';
      document.getElementById('lat').value='';
      document.getElementById('description').value='';
      iziToast.success({
        title: 'Success',
        message: 'You have added a new point of interest.',
    });

  } 
}

// Make the AJAX run when user clicks add button
if (document.getElementById('addNewButton')){
  document.getElementById('addNewButton').addEventListener('click', ()=> {
      const name = document.getElementById('name').value;
      const region = document.getElementById('region').value;
      const country = document.getElementById('country').value;
      const type = document.getElementById('type').value;
      const lon = document.getElementById('lon').value;
      const lat = document.getElementById('lat').value;
      const description = document.getElementById('description').value;


    if (!name.length || !region.length || !country.length || !type.length || !lon.length || !lat.length || !description.length) {
      document.getElementById('error-msg').classList.remove('hidden');
    } else {
      document.getElementById('error-msg').classList.add('hidden');
      ajaxAddNewPoi(name,region,country,type,lon,lat,description);
    };
  });
}