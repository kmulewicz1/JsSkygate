let countries = ["Poland","Germany","Spain","France"];
let map1 = new Map();
map1.set('poland', 'PL');
map1.set('germany', 'DE');
map1.set('spain', 'ES');
map1.set('france', 'FR');

document.getElementById("myInput").value=sessionStorage.getItem('key1');

let divOutOfMyInput=document.getElementById("divOutOfMyInput");

function checkPatternInConutries(pattern,arr)
{
	for(let i=0; i<arr.length;i++)
	{
		if (arr[i].substr(0, pattern.length).toUpperCase() == pattern.toUpperCase())
			return true;
		
}//for
return false;
}//checkPatternInConutries

let arrTrueFalse=[false,false,false,false,false,false,false,false,false,false,];
function autocomplete(arg, arr) 
{

	let divToJoin=document.getElementById("divToJoin");
	arg.addEventListener("input", function(e) {
	deleteAutocomplete();
	let val=arg.value;
	let tmp=document.createElement('DIV');
	tmp.className="listOfCountry";
	for(let i=0; i<arr.length;i++)
	{
		
			if (val.length!=0&&arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()){
				
				tmp.innerHTML=arr[i];
				tmp.style.fontSize="17px";
				tmp.style.backgroundColor="white";
				tmp.style.width="64%";
				tmp.addEventListener('click', function (event) {
				document.getElementById("myInput").value=this.innerHTML;
				
				});	//function click		
				divToJoin.appendChild(tmp);
				
		}//if
	}//for
  });
  arg.addEventListener("input", function(e) {
	  if(arg.value.length==0)
		  deleteAutocomplete();
  });
}//autocomplete


function deleteAutocomplete()
{
	
	const NodeForChild=document.getElementById("divToJoin");
	while (NodeForChild.firstChild) {
		NodeForChild.removeChild(NodeForChild.firstChild);
		}//while
}//deleteAutocomplete


function deleteCities()
{
	const NodeForChild=document.getElementById("divPollutedCity");
	while (!(NodeForChild.lastChild===NodeForChild.firstChild)) {
		NodeForChild.removeChild(NodeForChild.lastChild);
		}//while
}//deleteCities




function polluteCities()
{
	let mySet = new Set();
	const tmpValue=document.getElementById("myInput").value;
	if(tmpValue.length==0){
		alert("Please Insert name of Country!");
}//if
else
	{ 	let TextIndivPollutedCity=document.getElementById("TextIndivPollutedCity");
		TextIndivPollutedCity.innerHTML="The most pollutest cities:";
		TextIndivPollutedCity.style.fontSize="40px"
		
		deleteCities();
	let apiUrl="https://api.openaq.org/v1/latest?country=codecountry&order_by=measurements[0].value&sort=desc&parameter=pm25&&limit=50";
//	let apiUrl="https://api.openaq.org/v1/measurements";
	apiUrl= apiUrl.replace("codecountry", map1.get(tmpValue.toLowerCase()));
	const divPollutedCity=document.getElementById("divPollutedCity");
	let request = new XMLHttpRequest();
	request.open('GET', apiUrl, true);
	request.send();
	request.onload=function (){
		
		let data = JSON.parse(this.response);
		
		  if (request.status == 200)
		  {
			   for(let i=0; i<50; i++)
			   {
				   mySet.add(data.results[i].city);
			   }
			   let getEntriesArry = mySet.entries();
				let myArr = Array.from(mySet);
			  
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
		  }//if
		  
	}//function
	}
}//polluteCities


function Wikidescription(arg)
{	
	console.log(arrTrueFalse);
	 if(!arrTrueFalse[arg.id])
			  {
	let apiUrl="https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=extracts&format=json&formatversion=2&exintro=&titles=cityname";
	
	let cityname=arg.innerHTML;	
	apiUrl= apiUrl.replace("cityname", cityname);	
	let request = new XMLHttpRequest();	
	request.open('GET', apiUrl, true);
	request.send();
	request.onload=function (){
		let data = JSON.parse(this.response);
	
		  if (request.status == 200)
		  {
			 
				  arrTrueFalse[arg.id]=true;

			  let tmp=document.createElement('DIV');
			  if(data.query.pages[0].extract)
			  {
				  
				tmp.innerHTML=data.query.pages[0].extract;
				
			  }
			else
			{
				tmp.innerHTML="I'm sorry. In our databse this city doesn't exist";
			}
				if(!(arg.lastChild===arg.firstChild)) 
					arg.removeChild(arg.lastChild);
				
				 arg.appendChild(tmp);
				
				
		  
		
		   
		  }//request==200	
		  
	}
	}//argTrueFalse	
		    else
		  {
			 
			  arrTrueFalse[arg.id]=false;
			  arg.removeChild(arg.lastChild);
		  }
}



function validate(evt) {	
	let key = evt.keyCode;
	key = String.fromCharCode(key);  
	const myInputValue=document.getElementById("myInput").value;
	
	if( !checkPatternInConutries(myInputValue+key,countries)) {
    evt.returnValue = false;
  }//if
}//validate 


function saveIt()
{
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
		}//if      
    });
}); 