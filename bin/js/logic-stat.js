var storageGeneral=new AutoStorage("MUNStorageGeneral");
var storageMember=new AutoStorage("MUNStorageMembers");
var defaultData={name:"",code:"",motion:"true",paper:"true",voting:"true",stat:{}};
var storageCountry=new TempStorage(defaultData);

var prevObj=null;
function init(){
	var list=$("[x-component=xList]");
	for(var i=0;i<storageMember.data.length;i++){
		var item=$((new xComponent.xListItem()).object);
		item[0].data=storageMember.data[i];
		item.text(storageMember.data[i].name);
		appendItem(item[0]);
	}
	defaultData.name=currentLang.conf;
	storageCountry.flush();
}

function appendItem(item){
	$("[x-component=xList]")[0].object.addItem(item);
	$(item).select(function(){
		if($(item).attr("select")=="true"){
			prevObj=item;
			storageCountry.refresh(item.data);
			$("#specificCountry").show(200);
			$("#generalInformation").hide(200);
		}else{
			setTimeout(function(){storageCountry.refresh(defaultData);},200);
			$("#specificCountry").hide(200);
			$("#generalInformation").show(200);
		}
	});
}
