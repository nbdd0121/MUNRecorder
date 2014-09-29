var storageGeneral=new AutoStorage("MUNStorageGeneral");
var storageMember=new AutoStorage("MUNStorageMembers");
var storagePresent=new AutoStorage("MUNStoragePresent");

var prevObj=null;
function init(){
	var list=$("[x-component=xList]:first-child");
	for(var i=0;i<storageMember.data.length;i++){
		if(storageMember.data[i].present!="true"||storageMember.data[i].paper!="true")continue;
		var item=$((new xComponent.xListItem()).object);
		item[0].data=storageMember.data[i];
		item.text(storageMember.data[i].name);
		appendItem(item[0]);
	}	
	$("[lang-binding="+(location.search.substr(1)||"workingPaper")+"]").click();
	if(!$("[x-component=xListItem]:first-child").length){
		alert("No country present. Do roll call or add country first.");
		if(close&&window.parent)window.parent.postMessage('close','*');
	}
}

function appendItem(item){
	$("[x-component=xList]")[0].object.addItem(item);
}

function save(){
	storageMember.flush();
}

function submit(){
	var countries=$("[x-component=xListItem][select=true]");
	var cList="";
	var type=$("[x-component=xTabItem][select=true]").attr('lang-binding');
	var l1,l2;
	var index=$("#index").html();
	switch(type){
		case 'workingPaper':l1='wpTemplete';w2='wp';break;
		case 'draftRes':l1='drTemplete';w2='dr';break;
		case 'draftDir':l1='ddTemplete';w2='dd';break;
		default:l1='amdTemplete';w2='amd';
	}
	for(var i=0;i<countries.length;i++){
		cList+=", "+countries[i].textContent;
		countries[i].data.stat[w2]=parseInt(countries[i].data.stat[w2])+1;
	}
	storageMember.flush();
	cList=cList.substr(2);
	localStorage.MUNStorageHistory+=eval(currentLang[l1])+'<br/>'+currentLang.sponser+": "+cList+'<br/><br/>';
	if(window.parent)window.parent.postMessage('close','*');
}
