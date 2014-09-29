var storageGeneral=new AutoStorage("MUNStorageGeneral");
var storageMember=new AutoStorage("MUNStorageMembers");
var storageSpeakers=new AutoStorage("MUNStorageSpeakers");
var dictionary=[];
if(!storageGeneral.data)window.location="setting.html";
function save(){
	var obj=$("[x-component=xListItem]");
	storageSpeakers.data=[];
	for(var i=0;i<obj.length-1;i++){
		storageSpeakers.data[i]=obj[i].textContent;
	}
	window.localStorage.MUNStorageHistory=$("#history").html();
	saveStorage();
}
function saveStorage(){
	storageMember.flush();
	storageSpeakers.flush();
}
function init(){
	var list=$("[x-component=xList]");
	$("#history").html(window.localStorage.MUNStorageHistory);
	$("#history")[0].scrollTop=$("#history")[0].scrollHeight;
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
					});
					$(src).keypress(function(event){if(event.which==13){src.blur();return false;}});
					break;
				}
				case 1:{
					$(src).attr("select","false");
					if(src==prevObj)$(src).select();
					$(src).hide(100);
					setTimeout(function(){list[0].object.removeItem(src);},100);
				}
			}
		},event.clientX,event.clientY);
	});
	var add=$("#listAdd");
	add[0].object.enabled=false;
	add[0].object.setEditable(true);
	for(var i=0;i<storageSpeakers.data.length;i++){
		var item=$((new xComponent.xListItem()).object);
		item.text(storageSpeakers.data[i]);
		appendItem(item[0]);
	}
	for(var i=0;i<storageMember.data.length;i++){
		dictionary[storageMember.data[i].code]=storageMember.data[i].name;
	}
	$("body").append('<table style="display:none;" id="mainCover"><td><div onclick="closeFrame();">Close</div>'+
			'<iframe src=""></iframe>'
			+'</td></table>');
}
var prevObj;
var timer=0;
function appendItem(item){
	$("[x-component=xList]")[0].object.insertItem(item,$("[x-component=xListItem]").length-1);
	$(item).select(function(){
		if(timer){
			clearInterval(timer);
			timer=0;
		}
		if($(item).attr("select")=="true"){
			prevObj=item;
			var i=storageGeneral.data.dt;
			timer=setInterval(function(){
				$("[lang-binding=speakers]").text(--i);
				if(i==0){
					clearInterval(timer);
					timer=0;
					$("[lang-binding=speakers]").html('<span style="color:red;">0</span>');
				}
			},1000);
			$("[lang-binding=speakers]").text(i);
		}else{
			prevObj=null;
			$("[lang-binding=speakers]").text(currentLang.speakers);
		}		
	})
}
function addItem(val){
	if(val==''||val=='+')return;
	var item=$((new xComponent.xListItem()).object);
	val=dictionary[val]||val;
	for(var i=0;i<storageMember.data.length;i++){
		if(val==storageMember.data[i].name)storageMember.data[i].stat.speak=parseInt(storageMember.data[i].stat.speak)+1;
	}
	item.text(val);
	item.hide();
	appendItem(item[0]);
	item.show(200);
}
function closeFrame(){
	$("#mainCover").hide(200);	
	setTimeout('window.location=window.location;',200);
}
function showFrame(src){
	save();
	save=function(){};
	$("iframe").attr("src",src);
	$("#mainCover").show(200);
}
function mainMenu(x,y){
	xMenu.showMenu([
		currentLang.modCaucus,
		currentLang.unmodCaucus,
		currentLang.motion,
		currentLang.submitPaper,
		currentLang.voting,
		currentLang.rollcall,
		currentLang.stat,
		currentLang.setting],function(id){
			switch(id){
				case 0:showFrame("motion.html");break;
				case 1:showFrame("motion.html?unmodCaucus");break;
				case 2:showFrame("motion.html?other");break;
				case 3:showFrame("file.html");break;
				case 4:showFrame("voting.html");break;
				case 5:showFrame("rollcall.html");break;
				case 6:showFrame("stat.html");break;
				case 7:showFrame("setting.html");break; 
			}
	},x,y);
}
window.onmessage=function(msg){
	if(msg.data=='close')closeFrame();
}