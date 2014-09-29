(function(window){
	function AutoStorage(name){
		this.listener=null;
		this.name=name;
		this.data=window.localStorage[name];
		if(this.data!=null)
			this.data=eval("("+this.data+")");
		var that=this;
		/*window.addEventListener("storage", function(){
			if(event.key==name){
				that.refresh(event.newValue);
			}
		}, false);*/
	}
	AutoStorage.prototype.refresh=function(value){
		this.data=value;
		if(this.data!=null)
			this.data=eval("("+this.data+")");
		this.listener&&this.listener(this);
	}
	AutoStorage.prototype.flush=function(){
		window.localStorage[this.name]=JSON.stringify(this.data);
		this.listener&&this.listener(this);
	}
	AutoStorage.prototype.listen=function(listener){
		var oldL=this.listener;
		this.listener=function(as){
			oldL&&oldL(as);
			listener(as);
		}
	}
	window.AutoStorage=AutoStorage;
})(window);

(function(window){
	function TempStorage(data){
		this.listener=null;
		this.data=data;
	}
	TempStorage.prototype.refresh=function(value){
		this.data=value;
		this.listener&&this.listener(this);
	}
	TempStorage.prototype.flush=function(){
		this.listener&&this.listener(this);
	}
	TempStorage.prototype.listen=function(listener){
		var oldL=this.listener;
		this.listener=function(as){
			oldL&&oldL(as);
			listener(as);
		}
	}
	window.TempStorage=TempStorage;
})(window);

(function(window){
	function DataBinder(obj, src, key, dest){
		obj=$(obj);
		with(window)src=eval(src);
		var value;
		with(src.data)value=eval(key);
		if(obj[0][dest]!==undefined)obj[0][dest]=value;
		else obj.attr(dest,value);
		src.listen(function(){
			with(src.data)value=eval(key);
			if(obj[0][dest]!==undefined)obj[0][dest]=value;
			else obj.attr(dest,value);
		});
		obj.change();
		switch(dest){
			case "value":obj.change(function(){
				var newValue=obj[0].value||obj.attr("value");
				src.data[key]=newValue;
			});break;
			case "textContent":obj.change(function(){
				var newValue=obj.text();
				src.data[key]=newValue;
			});
		}
	}
	$(window).load(function(){
		var objs=$("[data-binding-key]");
		for(var i=0;i<objs.length;i++){
			var obj=$(objs[i]);
			DataBinder(obj,obj.attr("data-source"),obj.attr("data-binding-key"),obj.attr("data-binding"));
		}
	});
})(window);