var storageGeneral=new AutoStorage("MUNStorageGeneral");
var storageMember=new AutoStorage("MUNStorageMembers");
var storageCountry=new TempStorage({name:"",code:"",motion:"true",paper:"true",voting:"true"});
var storagePresent=new AutoStorage("MUNStoragePresent");

var prevObj=null;
function init(){
	var list=$("[x-component=xList]");
	list.bind('contextmenu',function(event){
		event.stopPropagation();
		var src=event.target;
		if($(src).attr("x-component")!="xListItem")return;
		xMenu.showMenu([currentLang.present,currentLang.absent,currentLang.cancel],function(id){
			switch(id){
				case 0:
					src.data.present="true";
					$(src).attr("present","true");
					src.data.stat.present=parseInt(src.data.stat.present)+1;
					break;
				case 1:
					src.data.present="false";
					$(src).attr("present","false");
					src.data.stat.absent=parseInt(src.data.stat.absent)+1;
			}
		},event.clientX,event.clientY);
	});
	for(var i=0;i<storageMember.data.length;i++){
		var item=$((new xComponent.xListItem()).object);
		item[0].data=storageMember.data[i];
		if(storageMember.data[i].voting!="true")item.attr("right","none");
		item.attr("present",item[0].data.present);
		item.text(storageMember.data[i].name);
		appendItem(item[0]);
	}	
}

function appendItem(item){
	$("[x-component=xList]")[0].object.addItem(item);
	$(item).select(function(){
		if($(item).attr("select")=="true"){
			prevObj=item;
			$("#specificCountry").hide(200);
			setTimeout(function(){storageCountry.refresh(item.data);},200);
			$("#specificCountry").show(200);
			$("#generalInformation").hide(200);
		}else{
			save();
			$("#specificCountry").hide(200);
			$("#generalInformation").show(200);
		}
	});
}

function save(){
	var pst=$("[x-component=xListItem][present=true]").length;
	storagePresent.data.present=pst;
	storagePresent.data.absent=$("[x-component=xListItem][present=false]").length;
	storagePresent.data.sm=Math.ceil(pst/2);
	pst-=$("[x-component=xListItem][present=true][right=none]").length;
	storagePresent.data["23m"]=Math.ceil(pst*2/3);
	storagePresent.flush();
	if(prevObj)prevObj.data=storageCountry.data;
	storageMember.flush();
}

function moveOn(){
	var next=$(prevObj).next("[x-component=xListItem]");
	if(next.length!=0){
		next[0].click();
	}else{
		prevObj.click();
	}
}

function storeHistory(){
	save();
	window.localStorage.MUNStorageHistory+=
			currentLang.rollcall+currentLang.finish+'<br/>'+
			currentLang.present+': '+storagePresent.data.present+'<br/>'+
			currentLang.absent+': '+storagePresent.data.absent+'<br/>'+
			currentLang.simpleMajority+': '+storagePresent.data.sm+'<br/>'+
			currentLang._23Majority+': '+storagePresent.data["23m"]+'<br/>'+'<br/>';
}