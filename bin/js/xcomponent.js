(function(window,$){
	function falseRet(){return false;}
	function trueRet(event){event.stopPropagation();return true;}
	function setEditable(editable){		
		if(editable){
			this.object.contentEditable=true;
			$(this.object).css("cursor","text");
			this.object.onselectstart=this.object.oncontextmenu=trueRet;
		}else{
			this.object.contentEditable=false;
			$(this.object).css("cursor","default");
			this.object.onselectstart=this.object.oncontextmenu=falseRet;
		}
	};
	
	function xComponent(obj){
		if(!obj)obj=$("<span>")[0];
		this.object=obj;
		obj.object=this;
		this.setEditable=setEditable;
	}
	
	xComponent.xLabel=function(object){
		if(!object)object=$('<span x-component="xLabel">')[0];
		xComponent.call(this,object);
		this.setEditable(false);
	}

	xComponent.xTextArea=function(object){
		if(!object)object=$('<span x-component="xTextArea">')[0];
		xComponent.call(this,object);
		this.setEditable(true);
	}

	xComponent.xSelect=function(object){
		if(!object)object=$('<select x-component="xSelect">')[0];
		xComponent.call(this,object);
		this.setEditable(false);
	}

	xComponent.xButton=function(object){
		if(!object)object=$('<span x-component="xButton">')[0];
		xComponent.call(this,object);
		this.setEditable(false);
	}

	xComponent.xTextBox=function(object){
		if(!object)object=$('<span x-component="xTextBox">')[0];
		xComponent.call(this,object);
		this.setEditable(true);
		object=$(object);
		object.blur(function(){
			var attr=object.attr("x-attr");
			if(!attr){object.change();return;}
			if(attr.substr(0,6)=="number"){
				var min=0,max=0;
				var range=attr.substr(6);
				range=range.split(",");
				switch(range[0][0]){
					case '(':min++;
					case '[':min+=parseInt(range[0].substr(1));break;
				}
				switch(range[1][range[1].length-1]){
					case ')':max--;
					case ']':max+=parseInt(range[1].substr(0,range[1].length-1));break;
				}
				var value=parseInt(object.text());
				if(value<min)value=min;
				if(value>max)value=max;
				object.text(value);
			}
			object.change();
		});
		object.keypress(function(obj){
			if(obj.which==13)obj.preventDefault();
		});
		object.change(function(){
			object.attr("value",object.text());
		});
		object.attr("value",object.text());
	}

	xComponent.xListItem=function(object){
		if(!object)object=$('<span x-component="xListItem">')[0];
		xComponent.call(this,object);
		this.setEditable(false);
		object=$(object);
		var that=this;
		object.click(function(){
			if(that.enabled){
				object.attr("select",object.attr("select")=="false");
				object.select();
			}
		});
		this.enabled=true;
		object.attr("select","false");
	}

	xComponent.xTabItem=function(object){
		if(!object)object=$('<span x-component="xTabItem">')[0];
		xComponent.call(this,object);
		this.setEditable(false);
		object=$(object);
		var that=this;
		object.click(function(){
			if(that.enabled){
				object.attr("select",object.attr("select")=="false");
				object.select();
			}
		});
		this.enabled=true;
		object.attr("select","false");
	}

	xComponent.xGroup=function(type){
		this.type=type;
		this.members=[];
	}

	xComponent.xGroup.prototype.addItem=function(obj){
		this.members.push(obj);
		var that=this;
		if(this.type=="multi")return;
		$(obj).select(function(){
			for(var i=0;i<that.members.length;i++){
				if(that.members[i]!=obj)$(that.members[i]).attr("select","false");
			}
			if(that.type){
				$(obj).attr("select","true");
				that.selected=obj;
			}else{
				if($(obj).attr("select")=="true")that.selected=obj;
				else that.selected=null;
			}
		});
	}

	xComponent.xGroup.prototype.removeItem=function(obj){this.members.splice(this.members.indexOf(obj),1);}


	xComponent.xList=function(object){
		if(!object)object=$('<span x-component="xList">')[0];
		xComponent.call(this,object);
		this.setEditable(false);
		var attr=$(object).attr("x-attr");
		this.group=new xComponent.xGroup(attr);
		var nodes=$(object).find(">[x-component]");
		for(var i=0;i<nodes.length;i++){
			this.group.addItem(nodes[i]);
			$(nodes[i]).select(function(){$(object).select();});
		}
	}

	xComponent.xList.prototype.addItem=function(listitem){
		$(this.object).append(listitem);
		this.group.addItem(listitem);
		$(listitem).select(function(){$(this.object).select();});
	}

	xComponent.xList.prototype.getItem=function(index){
		return $(this.object).find(">[x-component]")[index];
	}

	xComponent.xList.prototype.removeItem=function(object){
		this.group.removeItem(object);
		return object.remove();
	}

	xComponent.xList.prototype.insertItem=function(listitem, index){
		$($(this.object).find("[x-component=xListItem]")[index]).before(listitem);
		this.group.addItem(listitem);
		$(listitem).select(function(){$(this.object).select();});
	}

	xComponent.xList.prototype.getCount=function(){
		return $(this.object).find("[x-component=xListItem]").length;
	}

	xComponent.xSwitch=function(object){
		if(!object)object=$('<span x-component="xSwitch">')[0];
		xComponent.call(this,object);
		this.setEditable(false);
		object=$(object);
		object.html("&nbsp;");
		object.click(function(){
			object.attr("value",object.attr("value")=="false");
			object.change();
		});
		if(object.attr("value")==null)object.attr("value","true");
	}

	xComponent.xPanel=function(object){
		if(!object)object=$('<span x-component="xPanel">')[0];
		object=$(object);
		var l=object.attr("x-layout");
		if(l){
			switch(l){
				case "border":{
					var s,n,e,w,c;
					var nodes=object[0].childNodes;
					for(var i=0;i<nodes.length;i++){
						var node=$(nodes[i]);
						if(!node.attr("x-component"))continue;
						switch(node.attr("x-pos")){
							case "east":e=node;break;
							case "west":w=node;break;
							case "north":n=node;break;
							case "south":s=node;break;
							default:node.attr("x-pos","center");c=node;break;
						}
					}
					object.html('');
					o1=$('<div class=xBorderContainer>');
					object.append(o1);
					n&&o1.append(n);
					if(w||c||e){
						var tbl=$('<div class="xBorderLayout"></div>');
						var tbl2=$('<div class="xBorderLayoutPanel"></div>')
						o1.append(tbl);
						tbl.append(tbl2);
						w&&tbl2.append(w);
						c&&tbl2.append(c);
						e&&tbl2.append(e);
					}
					s&&o1.append(s);
					break;
				}				
			default:
					break;
			}
		}
		xComponent.call(this,object[0]);
		this.setEditable(false);
	}


	window.xComponent=xComponent;
	$(window).load(function(){
		var objs=$("[x-component]");
		for(var i=0;i<objs.length;i++){
			var cls=$(objs[i]).attr("x-component");
			if(xComponent[cls])new xComponent[cls](objs[i]); 
		}
	});
})(window,jQuery);
