let countries = ["Poland","Germany","Spain","France"];
let mapCountries = new Map();
mapCountries.set('poland', 'PL');
mapCountries.set('germany', 'DE');
mapCountries.set('spain', 'ES');
mapCountries.set('france', 'FR');
let arrBooleanCountries=[false,false,false,false,false,false,false,false,false,false,];


document.getElementById("myInput").value=sessionStorage.getItem('key1');

function checkPatternInConutries(pattern,arr) {
	for(let i=0; i<arr.length;i++)
	{
		if (arr[i].substr(0, pattern.length).toUpperCase() === pattern.toUpperCase())
			return true;
		
}
return false;
}

function addCities(val, tmp,arr,divToJoin,i) {
	if (val.length!==0&&arr[i].substr(0, val.length).toUpperCase() === val.toUpperCase()){

		tmp.innerHTML=arr[i];
		tmp.style.fontSize="17px";
		tmp.style.backgroundColor="white";
		tmp.style.width="64%";
		tmp.addEventListener('click', function (event) {
			document.getElementById("myInput").value=this.innerHTML;
		});

		divToJoin.appendChild(tmp);
	}
}

function autocomplete(arg, arr) {
	let divToJoin=document.getElementById("divToJoin");
	arg.addEventListener("input", function(e) {
	deleteAutocomplete();
	let val=arg.value;
	let tmp=document.createElement('DIV');
	tmp.className="listOfCountry";
	for(let i=0; i<arr.length;i++)
	{
		addCities(val,tmp,arr,divToJoin,i);
	}
  });
  arg.addEventListener("input", function(e) {
	  if(arg.value.length===0)
		  deleteAutocomplete();
  });
}

function deleteAutocomplete() {
	const NodeForChild=document.getElementById("divToJoin");
	while (NodeForChild.firstChild) {
		NodeForChild.removeChild(NodeForChild.firstChild);
		}
}

function deleteCities() {
	const NodeForChild=document.getElementById("divPollutedCity");
	while (!(NodeForChild.lastChild===NodeForChild.firstChild)) {
		NodeForChild.removeChild(NodeForChild.lastChild);
		}
}


function polluteCitiesApi() {
	const tmpValue=document.getElementById("myInput").value;
	if(tmpValue.length===0){
		alert("Please insert name of Country!");
}
	else {
        let TextIndivPollutedCity=document.getElementById("TextIndivPollutedCity");
        TextIndivPollutedCity.innerHTML="The most pollutest cities:";
        TextIndivPollutedCity.style.fontSize="40px"
        deleteCities();
        let apiUrl="https://api.openaq.org/v1/latest?country=codecountry&order_by=measurements[0].value&sort=desc&parameter=pm25&&limit=50";
        apiUrl= apiUrl.replace("codecountry", mapCountries.get(tmpValue.toLowerCase()));

        let request = new XMLHttpRequest();
        request.open('GET', apiUrl, true);
        request.send();
        request.onload=function (){

        let data = JSON.parse(this.response);
          if (request.status === 200)
          {
              addCityToDiv(data)
              }

        }
	}
}

    function addCityToDiv(data) {
        const divPollutedCity=document.getElementById("divPollutedCity");
        let myArr = [];
        for(let i=0; i<10; i++) {
            myArr[i]=data.results[i].city;
        }

        for(let i=0; i<10; i++)
        {
            let tmp=document.createElement('DIV');
            tmp.innerHTML=myArr[i];
            tmp.className="city";
            tmp.id = i;
            tmp.style.borderRadius="10%";
            tmp.style.border="4px solid black";
            tmp.style.backgroundColor="#5c0099";
            tmp.style.margin="2px";
            tmp.style.textAlign="center";
            tmp.addEventListener("click", function (){
                Wikidescription(this);
            });
            divPollutedCity.appendChild(tmp);
        }
    }

function Wikidescription(arg) {

	 if(!arrBooleanCountries[arg.id]) {
	        let apiUrl="https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=extracts&format=json&formatversion=2&exintro=&titles=cityname";
	        let cityname=arg.innerHTML;
            apiUrl= apiUrl.replace("cityname", cityname);
            let request = new XMLHttpRequest();
            request.open('GET', apiUrl, true);
            request.send();
            request.onload=function (){
            let data = JSON.parse(this.response);
              if (request.status === 200) {
                      arrBooleanCountries[arg.id]=true;
                      let tmp=document.createElement('DIV');
                      if(data.query.pages[0].extract) {
                          tmp.innerHTML=data.query.pages[0].extract;
                  }
                else {
                    tmp.innerHTML="I'm sorry. In our databse this city doesn't exist";
                        }
                    if(!(arg.lastChild===arg.firstChild)) {
                        arg.removeChild(arg.lastChild);
                    }
                     arg.appendChild(tmp);
                }}}
            else {
              arrBooleanCountries[arg.id]=false;
              arg.removeChild(arg.lastChild);
             }
}

function validate(evt) {
    let key = evt.keyCode;
    key = String.fromCharCode(key);
    const myInputValue=document.getElementById("myInput").value;

    if(!checkPatternInConutries(myInputValue+key,countries)) {
    evt.returnValue = false;
  }
}

function saveIt() {
    sessionStorage.clear();
    sessionStorage.setItem('key1',document.getElementById("myInput").value)
}

autocomplete(document.getElementById("myInput"), countries);


$(document).ready(function() {

    $("#btnCity").click(function() {

        if(document.getElementById("myInput").value){
        $("#divOutOfMyInput").animate(
        {
            top:"1px"
        },1000);
        }
    });
});