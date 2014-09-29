var lang={
	english:{
		setting:"Setting",
		speakers:"Speakers",
		members:"Members",
		setInfo:"Set Information",
		lang:"Language: ",
		confName:"Conference Name:",
		defTime:"Default Time Setting(Seconds)",
		spkList:"Speakers' List: ",
		modCaucus:"Moderated Caucus",
		unmodCaucus:"Unmoderated Caucus",
		voiceInRC:"Voice in Roll Call: ",
		speechDet:"Speech Detector",
		clear:"Clear Session",
		modify:"Modify",
		del:"Delete",
		cancel:"Cancel",
		countryCode:"Country Code",
		setRight:"Set Rights",
		motion:"Motion ",
		submitPaper:"Submit Paper",
		voting:"Voting",
		duplicate:"Duplicate",
		rollcall:"Roll Call ",
		present:"Present",
		absent:"Absent",
		simpleMajority:"Simple Majority",
		_23Majority:"2/3 Majority",
		_20Majority:"20% Majority",
		index:"Index",
		stat:"Statistic",
		attendance:"Attendance Rate",
		oneStat:"'s Statistic",
		conf:"Conference",
		join:"Join ",
		paper:"Paper",
		submit:"Submit",
		sponser:"Sponser",
		workingPaper:"Working Paper",
		draftRes:"Draft Resolution",
		draftDir:"Draft Directive",
		agree:"Affirm",
		veto:"Veto",
		abstain:"Abstain",
		pass:"Pass",
		finish:"Finished",
		setTime:"Set Time",
		other:"Others",
		time:"Time",
		topic:"Topic",
		mPass:"Pass",
		fail:"Fail",
		passed:"Passed",
		failed:"Failed",
		closed:"Closed",
		amendment:"Amendment",
		mcTemplete:"country+' motions for a moderated caucus about '+topic+'.<br/>The total time is '+totalTime+' seconds.<br/>'+timePP+' seconds for each delegate.'",
		umcTemplete:"country+' motions for an unmoderated caucus for '+totalTime+' seconds.'",
		timeTemplete:"country+' motions to set the speaking time to '+totalTime+' seconds.'",
		otherTemplete:"country+' motions for '+topic",
		wpTemplete:"'Working Paper'+index",
		drTemplete:"'Draft Resolution'+index",
		ddTemplete:"'Draft Directive'+index",
		amdTemplete:"'Amendment'+index",
		Export:"Export Data",
		Import:"Import Data",
		saveNew:'Session information was written into the page just opened. Please copy the whole content and save carefully.',
		saveDown:'Please save the session file. You can load it at any time.',
		pasteHere:'Please paste your save session data here to reload these data.',
		loadError:'Cannot load session data. Please check if you choose wrong file or the file is broken.',
		loadSuccess:'Session data is loaded into software successfully.',
	},
	chinese:{
		setting:"设置",
		speakers:"发言列表",
		members:"成员国",
		setInfo:"设置信息",
		lang:"语言: ",
		confName:"会议名称: ",
		defTime:"默认时间设定(秒)",
		spkList:"主发言名单: ",
		modCaucus:"有组织核心磋商",
		unmodCaucus:"非正式辩论",
		voiceInRC:"自动语音点名: ",
		speechDet:"语音识别",
		clear:"清除会话",
		modify:"修改",
		del:"删除",
		cancel:"取消",
		countryCode:"国家代码",
		setRight:"设置权利",
		motion:"动议",
		submitPaper:"提交文件",
		voting:"表决",
		duplicate:"重复项",
		rollcall:"点名",
		present:"到场",
		absent:"缺席",
		simpleMajority:"简单多数",
		_23Majority:"2/3多数",
		stat:"统计",
		attendance:"出勤率",
		oneStat:"的数据统计",
		conf:"会议",
		join:"加入",
		paper:"文件",
		index:"编号",
		sponser:"起草国",
		workingPaper:"工作文件",
		draftRes:"决议草案",
		draftDir:"指令草案",
		agree:"赞成",
		veto:"否决",
		abstain:"弃权",
		pass:"过",
		finish:"完成",
		submit:"提交",
		_20Majority:"20%多数",
		setTime:"设置时间",
		other:"其他",
		time:"时间",
		topic:"主题",
		mPass:"通过",
		fail:"未通过",
		passed:"通过",
		failed:"未通过",
		closed:"关闭",
		amendment:"修正案",
		mcTemplete:"country+'动议一个有组织核心磋商。议题是'+topic+'。<br/>总时间为'+totalTime+'秒。<br/>每个代表有'+timePP+'秒的时间。'",
		umcTemplete:"country+'动议一个'+totalTime+'秒的非正式辩论。'",
		timeTemplete:"country+'动议将主发言时间改为'+totalTime+'秒。'",
		otherTemplete:"country+'动议'+topic+'。'",
		wpTemplete:"'工作文件'+index",
		drTemplete:"'决议草案'+index",
		ddTemplete:"'指令草案'+index",
		amdTemplete:"'修正案'+index",
		Export:"导出数据",
		Import:"导入数据",
		saveNew:'会话信息已经写入新打开的页面。请复制全部内容并妥善保存。',
		saveDown:'请保存会话文件。你可以在任意时间加载它。',
		pasteHere:'将你保存的会话信息数据粘贴在此。会话会通过会话数据被还原。',
		loadError:'加载会话失败。可能是文件的损坏或者选择了错误的文件。请检查选择的文件是否正确。',
		loadSuccess:'会话信息已经成功加载。',
	}
};
var currentLang=lang[storageGeneral.data["language"]];
(function(window,lang){
	$(window).load(function(){
		var lb=$("[lang-binding]");
		for(var i=0;i<lb.length;i++)
			$(lb[i]).text(lang[$(lb[i]).attr("lang-binding")]);
	});
})(window,currentLang);
