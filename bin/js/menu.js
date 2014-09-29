var xMenu={
	oPopup:null,
	oPopupHandle:null,
	initMenu:function(args){  
		if(this.oPopup==null){
			$("body").append(this.oPopup=$('<table class="xMenuPanel" oncontextmenu="return false;" onselectstart="return false;"></table>'));
		}
		this.oPopup.empty();
		for(var i=0;i<args.length;i++){
			this.oPopup.append('<tr onclick="xMenu.hide('+i+');"><td class="xMenuItem">'+args[i]+'</td></tr>');
		}
	},showMenu:function(args,handle,x,y){
		if(this.oPopupHandle)this.oPopupHandle(-1);
		this.oPopupHandle=handle;
		this.initMenu(args);
		this.oPopup.show(100);
		this.oPopup.css("left",(x||0)+"px");
		this.oPopup.css("top",(y||0)+"px");
		$("body").click(this.hide);
		$("body").bind('contextmenu',this.hide);
	},hide:function(src){
		xMenu.oPopup.hide(100);
		$("body").unbind("click",this.hide);
		$("body").unbind('contextmenu',this.hide);
		if(src==null)src=-1;
		if(this.oPopupHandle)xMenu.oPopupHandle(src);
		xMenu.oPopupHandle=null;
	}
}
window.onerror=function(msg,url,line){alert("Some Error Occurs In This Program. Please Contact the Provider and Provide Essential Information about How the Error Occurs.");};