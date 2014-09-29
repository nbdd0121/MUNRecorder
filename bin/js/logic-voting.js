var storageGeneral=new AutoStorage("MUNStorageGeneral");
var storageMember=new AutoStorage("MUNStorageMembers");
var storageCountry=new TempStorage({name:"",code:"",motion:"true",paper:"true",voting:"true"});
var storageVoting=new TempStorage({agree:0,veto:0,abstain:0});
var storagePresent=new AutoStorage("MUNStoragePresent");

var prevObj=null;
function init(){
	var list=$("[x-component=xList]");
	list.bind('contextmenu',function(event){
		event.stopPropagation();
		var src=event.target;
		if($(src).attr("x-component")!="xListItem")return;
		xMenu.showMenu([currentLang.agree,currentLang.veto,currentLang.abstain,currentLang.cancel],function(id){
			switch(id){
				case 0:
					src.data.stat.pass=parseInt(src.data.stat.pass)+1;
					src.className="votingAgree";
					break;
				case 1:
					src.data.stat.veto=parseInt(src.data.stat.veto)+1;
					src.className="votingVeto";
					break;
				case 2:
					src.data.stat.abstain=parseInt(src.data.stat.abstain)+1;
					src.className="votingAbstain";
					break;
			}
		},event.clientX,event.clientY);
	});
	for(var i=0;i<storageMember.data.length;i++){
		if(storageMember.data[i].present!="true"||storageMember.data[i].voting!="true")continue;
		var item=$((new xComponent.xListItem()).object);
		item[0].data=storageMember.data[i];
		item.text(storageMember.data[i].name);
		appendItem(item[0]);
	}	
}

function appendItem(item){
	$("[x-component=xList]")[0].object.addItem(item);
	$(item).select(function(){
		$("#generalInformation").hide(200);
		if($(item).attr("select")=="true"){
			prevObj=item;
			$("#specificCountry").hide(200);
			setTimeout(function(){storageCountry.refresh(item.data);},200);
			$("#specificCountry").show(200);
			$("#resultPanel").hide(200);
		}else{
			save();
			$("#specificCountry").hide(200);
			$("#resultPanel").show(200);
		}
	});
}

function save(){
	storageVoting.data.agree=$(".votingAgree").length;
	storageVoting.data.veto=$(".votingVeto").length;
	storageVoting.data.abstain=$(".votingAbstain").length;
	storageVoting.flush();
	storageMember.flush();
	$("#specificCountry").hide(200);
	$("#resultPanel").show(200);
}

var passed=null;
var passedIndex=0;
function moveOn(){
	if(passed){
		if(++passedIndex==passed.length){
			save();
			moveOn=function(){};
		}else passed[passedIndex].click();
	}else{
		var next=$(prevObj).next("[x-component=xListItem]");
		if(next.length!=0){
			next[0].click();
		}else{
			passed=$("[x-component=xListItem]").not(".votingAgree,.votingVeto,.votingAbstain");
			if(passed.length){
				//prevObj.click();
				if(passed[0]!=prevObj)passed[0].click();
				$("#pass").hide();
				$("#abstain").hide();
			}else{
				save();
				moveOn=function(){};
			}
		}
	}

}