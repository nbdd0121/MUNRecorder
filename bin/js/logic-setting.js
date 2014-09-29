var storageGeneral=new AutoStorage("MUNStorageGeneral");
var storageMember=new AutoStorage("MUNStorageMembers");
var storageCountry=new TempStorage({name:"",code:"",motion:"true",paper:"true",voting:"true"});
var dictionary=[];
if(!storageGeneral.data)clearSession();
function save(){
	$("[x-component=xTextBox]")[0].focus();
	$("[x-component=xTextBox]")[0].blur();
	var obj=$("[x-component=xListItem]");
	if(prevObj)prevObj.data=storageCountry.data;
	storageMember.data=[];
	for(var i=0;i<obj.length-1;i++){
		storageMember.data[i]=obj[i].data;
	}
	saveStorage();
}
function saveStorage(){
	storageMember.flush();
	storageGeneral.flush();
}
function clearSession(){
	storageGeneral.data={"name":"MUN","dt":120,"dms":60,"dma":600,"dumc":300,"voice":"false","speech":"false","language":"english"};
	storageMember.data=[];
	window.localStorage.MUNStoragePresent=JSON.stringify({present:0,absent:0,sm:0,"23m":0});
	window.localStorage.MUNStorageSpeakers="[]";
	window.localStorage.MUNStorageHistory="";
	window.onunload=saveStorage;
	window.location=window.location;
}
function init(){
	var list=$("[x-component=xList]");
	list.bind('contextmenu',function(event){
		event.stopPropagation();
		var src=event.target;
		if($(src).attr("x-component")!="xListItem")return;
		xMenu.showMenu([currentLang.modify,currentLang.del,currentLang.cancel],function(id){
			switch(id){
				case 0:{
					src.object.setEditable(true);
					src.object.enabled=false;				
					src.focus();
					dictionary[src.textContent]=null;
					$(src).blur(function(){
						src.object.setEditable(false);$(src).unbind('blur').unbind('keypress');src.object.enabled=true;
						if(dictionary[src.textContent])src.textContent=currentLang.duplicate;
						dictionary[src.textContent]=1;
						src.data.name=src.textContent;
					});
					$(src).keypress(function(event){if(event.which==13){src.blur();return false;}});
					break;
				}
				case 1:{
					$(src).attr("select","false");
					if(src==prevObj)$(src).select();
					$(src).hide(100);
					dictionary[src.textContent]=null;
					dictionary[src.data.code]=null;
					setTimeout(function(){list[0].object.removeItem(src);},100);
				}
			}
		},event.clientX,event.clientY);
	});
	var add=$("#listAdd");
	add[0].object.enabled=false;
	add[0].object.setEditable(true);
	for(var i=0;i<storageMember.data.length;i++){
		var item=$((new xComponent.xListItem()).object);
		item[0].data=storageMember.data[i];
		item.text(storageMember.data[i].name);
		appendItem(item[0]);
		dictionary[storageMember.data[i].name]=1;
		dictionary[storageMember.data[i].code]=1;
	}
}
var prevObj=null;
function appendItem(item){
	$("[x-component=xList]")[0].object.insertItem(item,$("[x-component=xListItem]").length-1);
	$(item).select(function(){
		if($(item).attr("select")=="true"){
			if(prevObj)prevObj.data=storageCountry.data;
			prevObj=item;
			storageCountry.refresh(item.data);
			$("#specificSetting").show(200);
			$("#generalSetting").hide(200);
		}else{
			$("#specificSetting").hide(200);
			$("#generalSetting").show(200);
		}
	});
}
function addItem(val){
	if(val==''||val=='+')return;
	var item=$((new xComponent.xListItem()).object);
	if(dictionary[val])val=currentLang.duplicate;
	dictionary[val]=1;
	item.text(val);
	item[0].data={name:val,code:val+" "+currentLang.countryCode,motion:"true",paper:"true",voting:"true",present:"false",stat:{
		abstain:0,
		present:0,
		absent:0,
		pass:0,
		veto:0,
		mc:0,
		umc:0,
		speak:0,
		join:0,
		wp:0,
		dr:0,
		dd:0,
		amd:0,
	}};
	item.hide();
	appendItem(item[0]);
	item.show(200);
}
function Export(){
	save();		
	var str=Compress(escape(JSON.stringify({
		general:localStorage.MUNStorageGeneral,
		history:localStorage.MUNStorageHistory,
		members:localStorage.MUNStorageMembers,
		present:localStorage.MUNStoragePresent,
		speaker:localStorage.MUNStorageSpeakers
	})));
	if(window.Blob&&!window.BlobBuilder){	
		var b=new Blob([str],{type:"application/zip"});
		alert(currentLang.saveDown);
		window.open(URL.createObjectURL(b));
	}else{
		window.open('about:blank').document.write(str);
		alert(currentLang.saveNew);
	}
}
function Import(){
	if (window.File&&window.FileReader&&window.FileList) {
  		$('<input type="file"/>').click().change(function(event){
  			var f=event.target.files[0];
  			var reader=new FileReader();
  			reader.onload=function(event){
  				loadData(event.target.result);
  			}
  			reader.readAsText(f);
  		});
	} else {
  		loadData(prompt(currentLang.pasteHere));
	}
}
function loadData(res){
	try{
  		var result=eval('('+unescape(Decompress(res))+')');
  		localStorage.MUNStorageGeneral=result.general;
		localStorage.MUNStorageHistory=result.history;
		localStorage.MUNStorageMembers=result.members;
		localStorage.MUNStoragePresent=result.present;
		localStorage.MUNStorageSpeakers=result.speaker;
		save=function(){};
		alert(currentLang.loadSuccess);
		window.location=window.location;
  	}catch(err){
  		alert(currentLang.loadError);
  	}
}