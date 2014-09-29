var storageGeneral=new AutoStorage("MUNStorageGeneral");
var storageMember=new AutoStorage("MUNStorageMembers");
var storagePresent=new AutoStorage("MUNStoragePresent");

var prevObj=null;
function init(){
	var list=$("[x-component=xList]:first-child");
	for(var i=0;i<storageMember.data.length;i++){
		if(storageMember.data[i].present!="true"||storageMember.data[i].motion!="true")continue;
		var item=$((new xComponent.xListItem()).object);
		item[0].data=storageMember.data[i];
		item.text(storageMember.data[i].name);
		appendItem(item[0]);
	}	
	$("[lang-binding="+(location.search.substr(1)||"modCaucus")+"]").click();
	$("[x-component=xListItem]:first-child").click();
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

function umc(tmr){
	$("[x-component=xListItem]").unbind('click');
	$($(".title")[1]).text(currentLang.unmodCaucus);
	var obj=$("#container>div");
	var timer=setInterval(function(){
		if(--tmr==0){
			clearInterval(timer);
			obj.html('<span style="font-size:50px; color:red;">'+tmr+'</span>');
		}else{
			obj.html('<span style="font-size:50px;">'+tmr+'</span>');
		}
	},1000);
	obj.html('<span style="font-size:50px;">'+tmr+'</span>');
	var dta=$("[x-component=xList]")[0].object.group.selected.data.stat;
	dta.umc=parseInt(dta.umc)+1;
	storageMember.flush();
}

function mc(country,one,all){
	brseq='<br/>'+country+'<br/>';
	$($("[x-component=xList]")[1]).hide(200);
	$("#prst").hide(200);
	$("#timePP")[0].object.setEditable(false);
	$("[x-component=xButton]").hide(200);
	$("#timeTotal")[0].object.setEditable(false);
	var listL=$($("[x-component=xList]")[0]);
	var listR=new xComponent.xList($('<span x-component="xList" style="display:block;margin-left:-20px;padding-top:10px;">')[0]);
	listL.bind('select',function(){
		var src=listL[0].object.group.selected;
		var coun=src.textContent;
		var obj=new xComponent.xListItem($('<div x-component="xListItem">'+coun+'</div>')[0]).object;
		$(obj).hide();
		listR.addItem(obj);
		$(obj).show(200);
		localStorage.MUNStorageHistory+=src.innerHTML+'<br/>';
		var dta=$("[x-component=xList]")[0].object.group.selected.data.stat;
		dta.join=parseInt(dta.join)+1;
		storageMember.flush();
	});
	var tmr,tmr1;
	$(listR.object).bind('contextmenu',function(event){
		event.stopPropagation();
		var src=event.target;
		if($(src).attr("x-component")!="xListItem")return;
		$(src).css('visibility','hidden');
		$(src).hide(200);
		setTimeout(function(){listR.removeItem(src);},200);
		if(tmr){
			clearInterval(tmr);
			clearInterval(tmr1);
		}
	});
	$(listR.object).bind('select',function(event){
		if($(listR.group.selected).attr("select")=="true"){
			if(tmr){
				clearInterval(tmr);
				clearInterval(tmr1);
			}
			tmr=setInterval(function(){
				if(--all==0){
					$("#timeTotal").html('<span style="color:red;">0</span>');
					clearInterval(tmr);
					clearInterval(tmr1);
					tmr=0;
				}else{
					$("#timeTotal").text(all);
				}
			},1000);
			var q=one;
			tmr1=setInterval(function(){
				if(--q==0){
					$("#timePP").html('<span style="color:red;">0</span>');
					clearInterval(tmr);
					clearInterval(tmr1);
				}else{
					$("#timePP").text(q);
				}
			},1000);
		}else{
			if(tmr){
				clearInterval(tmr);
				clearInterval(tmr1);
				tmr=0;
			}
		}
		
	});
	$("#prst").after(listR.object);
	listR.addItem(new xComponent.xListItem($('<span x-component="xListItem">'+country+'</span>')[0]).object);
	window.onunload=function(){localStorage.MUNStorageHistory+='['+currentLang.closed+']<br/><br/>';};
	var dta=$("[x-component=xList]")[0].object.group.selected.data.stat;
	dta.mc=parseInt(dta.mc)+1;
	storageMember.flush();
}
var brseq='<br/><br/>';
function pass(){
	var country=$("[x-component=xList]")[0].object.group.selected.textContent;
	var topic=$("#topic").html();
	var totalTime=$("#timeTotal").text();
	var timePP=$("#timePP").text();
	var close=0;
	var type=$("[x-component=xTabItem][select=true]").attr("lang-binding");
	switch(type){
		case 'modCaucus':mc(country,timePP,totalTime);type="mcTemplete";break;
		case 'unmodCaucus':umc(totalTime);type="umcTemplete";break;
		case 'setTime':storageGeneral.data.dt=totalTime;storageGeneral.flush();type="timeTemplete";close=1;break;
		case 'other':type="otherTemplete";close=1;
	}
	localStorage.MUNStorageHistory+=eval(currentLang[type])+'<br/>['+currentLang.passed+']'+brseq;
	if(close&&window.parent)window.parent.postMessage('close','*');
}

function fail(){
	var country=$("[x-component=xList]")[0].object.group.selected.textContent;
	var topic=$("#topic").html();
	var totalTime=$("#timeTotal").text();
	var timePP=$("#timePP").text();
	var type=$("[x-component=xTabItem][select=true]").attr("lang-binding");
	switch(type){
		case 'modCaucus':type="mcTemplete";break;
		case 'unmodCaucus':type="umcTemplete";break;
		case 'setTime':type="timeTemplete";break;
		case 'other':type="otherTemplete";
	}
	localStorage.MUNStorageHistory+=eval(currentLang[type])+'<br/>['+currentLang.failed+']<br/><br/>';
	if(window.parent)window.parent.postMessage('close','*');
}
