/*左侧菜单*/
window.onload = function(){
	menu("pai-test-box");
	menu("pai-menu-list");
	menu("pai-bpmn-left");
	//表选择
	tab("dms-prop-tab","dms-chart-box");
	//右侧tab
	tab("selected-tab","right_wrap");
	tab("selected-tab","wrap-right-wrap");
	//字段(参数)设置
	tab("dms-field-tab","dms-field-box");
	//字段设置，执行调优
	tab("dms-PerformTuning-tab","dms-PerformTuning-box");
	//参数设置，执行调优
	tab("dms-argumentTune-tab","dms-argumentTune-box");
	//字段设置，参数设置，执行调优
	tab("dms-setTuning-tab","dms-setTuning-box");
	/*首页，组件,数据源，实验切换*/
	navTab("btn-home-page");
	navTab("btn-module");
	navTab("btn-data-origin");
	navTab("btn-experiment");
	/*实验名称切换*/
	designation();
	/*全选*/
	checkAll("createPortGroup-box");
	/*图表*/
	var a =['周一','周二','周三','周四','周五','周六','周日'] ;
	var b =[5, 8, 10, 18, 4, 6, 10] ;
	reportChart(a,b);

	radio("targetListBox");

	fieldSet("field-set-box");
	//实验
	toggleTest("ui-context-menu-layer");

}

function menu(a){
	//获取外层元素
	var $menuItem = $("."+a);
	//判断当前元素
	switch (a){
		//最外层div，一级菜单
		case "pai-test-box":
			$($menuItem).on("click",function(){
				$(this).nextAll(".pai-menu-list").is(":hidden")?$(this).nextAll(".pai-menu-list").show():$(this).nextAll(".pai-menu-list").hide();
				$(this).nextAll(".pai-menu-list").is(":hidden")?$(this).find("i").addClass("active"):$(this).find("i").removeClass("active");
			})
			break;
		//工作区名称切换
		case "pai-bpmn-left":
			var $d = $($menuItem).find(".box");
			$d.on("click",function(){
				$(this).nextAll("ul").is(":hidden")?$(this).nextAll("ul").show():$(this).nextAll("ul").hide();
				$(this).nextAll("ul").is(":hidden")?$(this).removeClass("is-opened"):$(this).addClass("is-opened");
			})
			break;
		default:
			break;
	}
}
/*全选，已选*/
function checkAll(a){
	var $trs = $("."+a+" .right_wrap .table-body tr");
	var $input = $("."+a+" .left_wrap .ui-checkbox input.checkBox");
	var $right = $("."+a+" .right_wrap tbody");
	$trs.hide();
	var isCheckAll = function ()
	{
		for (var i = 1, n = 0; i < $input.length; i++)
		{
			$input[i].checked && n++
		}
		$input[0].checked = n == $input.length - 1;
	};
	//全选/全不选
	$input[0].onclick = function ()
	{
		for (var i = 1; i < $input.length; i++)
		{
			$input[i].checked = this.checked;
		}
		arr("createPortGroup-box")
		isCheckAll()
	};
	//根据复选个数更新全选框状态
	for (var i = 1; i < $input.length; i++)
	{
		$input[i].onclick = function ()
		{
			isCheckAll()
		}
	}
	//初始化
	var fieldArr = [];
	var dataArr = [];
	var $fieldVal =$(".zero-accordion").find(".zero-accordion-item").find("span.checkBox");
	var $dataVal = $(".zero-accordion").find(".zero-accordion-item").find("span.data-val i");
	var $currentInput = $("."+a+" .left_wrap .zero-accordion-item input.checkBox");
	$fieldVal.each(function(){
		fieldArr.push($(this).text())
	})
	$dataVal.each(function(){
		dataArr.push($(this).text())
	})
	for(var i=0;i<fieldArr.length;i++){
		$($input[i+1]).addClass(fieldArr[i]+"_"+dataArr[i]);
	}
	//多选框单选
	$currentInput.on("click",function(){
		//获取当前多选框字段
		var $currentField = $(this).siblings("span.checkBox").text();
		//获取当前多选框数据类型
		var $currentData = $(this).parents(".zero-accordion-item").find(".data-val i").text()
		//获取右侧tbody
		var $right = $("."+a+" .right_wrap tbody");
		//设置class
		var $class = $currentField+"_"+$currentData;
		var html = "";
		//设置右侧子项
		html+='<tr class="'+$class+'">'
			+ '<td><span class="icon icon-delete btn-delete" onclick="del(this)"></span></td>'
			+ '<td class="abc">'+$currentField+'</td>'
			+ '<td>'+$currentData+'</td>'
			+ '</tr>'
		if($(this).is(":checked")){
			$right.append(html);
			$(this).addClass($class);
		}else{
			$right.find("."+$class).remove();
		}
	})
	//已选删除
	$("."+a+" .right_wrap .table-header .icon-delete").on("click",function(){
		$(this).parents(".table-header").next(".table-body").find('tbody tr').remove()
		for (var i = 0; i < $input.length; i++)
		{
			$input[i].checked = false;
		}
	})
	$("."+a+" .right_wrap .table-body .icon-delete").on("click",function(){
		var $currentClass = $(this).parents("tr").attr("class");
		$(".left_wrap .zero-accordion-item").find("."+$currentClass).prop("checked",false);
		isCheckAll()
	})
}
/*全选已选左右效果*/
function arr(a){
	/*全选，反选*/
	var fieldArr = [];       //字段
	var dataArr = [];        //类型
	var $fieldVal = $("."+a+" .left_wrap  .zero-accordion-item span.checkBox");
	var $dataVal = $("."+a+" .left_wrap  .zero-accordion-item .data-val i");
	var $input = $("."+a+" .left_wrap .ui-checkbox input.checkBox");
	var $right = $("."+a+" .right_wrap tbody");
	var html = "";
	//字段存入数组
	$fieldVal.each(function(){
		fieldArr.push($(this).text())
	})
	//类型存入数组
	$dataVal.each(function () {
		dataArr.push($(this).text())
	})
	//右侧数据初始化
	$right.find("tr").remove();
	if($input[0].checked){
		for(var i=0;i<fieldArr.length;i++){
			html+='<tr class="'+fieldArr[i]+"_"+dataArr[i]+'">'
				+ '<td><span class="icon icon-delete btn-delete" onclick="del(this)"></span></td>'
				+ '<td>'+fieldArr[i]+'</td>'
				+ '<td>'+dataArr[i]+'</td>'
				+ '</tr>'
		}
		$right.append(html);
	}else{
		/*反选 */
		$right.find("tr").remove();
	}
}
/*删除已选*/
function del(a){
	//获取当前tr以及class
	var $this = $(a);
	var $currentClass = $this.parents("tr").attr("class");
	//删除当前tr
	$this.parents("tr").remove();
	//取消对应左侧多选框
	$(".left_wrap .zero-accordion-item").find("."+$currentClass).prop("checked",false);
	return;
}

/*右侧tab切换*/
function tab(a,b){
	//获取右侧tab项
	var $tabBtn = $("."+a+" li");
	//获取右侧tab项内容
	var $page = $("."+b+ " .dms-prop-page");
	$tabBtn.on("click",function(){
		//获取当前索引
		var $index = $(this).index();
		//添加切换样式
		$(this).hasClass("selected")?$(this).attr("class","selected"):$(this).addClass("selected").siblings("li").removeClass("selected");
		$page.eq($index).show().siblings(".dms-prop-page").hide();
	})
}

/*工作区右键菜单*/
function workArea(b){
	//获取右键点击的box
	var $itemName = $("#container .model"),
		//获取右键菜单
		style = $("."+b)[0].style;
	//获取右键菜单内删除
	var $remove = $(".removeElement");
	//获取右键菜单从此处开始执行
	var $executeBtn = $(".btn-execute-begin");
	//初始化右键菜单
	style.display = "none";
	//当前元素下右键菜单
	$itemName.on("contextmenu",function(event){
		var event = event || window.event;
		var $this = $(this);
		var aDoc = [document.documentElement.offsetWidth, document.documentElement.offsetHeight];
		//显示右键菜单
		style.display = "block";
		//设置右键菜单的坐标
		style.top = event.clientY+"px";
		style.left = event.clientX + "px";
		//最大显示范围
		maxWidth = aDoc[0] - $("."+b+" ul")[0].offsetWidth;
		maxHeight = aDoc[1] - $("."+b+" ul")[0].offsetHeight;
		//防止菜单溢出
		$("."+b)[0].offsetTop > maxHeight && (style.top = maxHeight + "px");
		$("."+b)[0].offsetLeft > maxWidth && (style.left = maxWidth + "px");

		//删除菜单对应的元素
		$remove.unbind("click").on("click",function () {
			var element = $($this);
			if(confirm("确定删除该模型？")){
				save()
				jsPlumb.remove(element);
			}
			style.display = "none";
		})
		//显示数据
		$(".btn-view-data").unbind("click").click(function(){
			//显示数据页面
			$(".view-data-box").modal('show');
			//数据页面属性设置
			$(".view-data-box").css({
				"display": "table",
				"height": "100%",
				"width": "1100px",
				"left": "50%",
				"margin-left": "-550px"
			})
			$(".view-data-box .modal-w").width("1100px");

		})
		//从此处执行时，状态变化
		$executeBtn.unbind("click").on("click",function () {
			$this.find(".status").attr("class","status icon-loading");
			style.display = "none";
		})
		return false;
	});
	$("."+b+" .ui-context-menu-item").on("click",function(){
		style.display = "none";
	})
	$("body").on("click",function(){
		style.display = "none";
	})
}

/*选择字段(列表跟编辑)*/
/*--左侧切换--*/
function navTab(a){
	switch (a){
		case "btn-home-page":
			$("."+a).on("click",function(event){
				event.stopPropagation();
				$(".pai-home").animate({"bottom":0},0);
			})
			break;
		case "btn-module":
			$("."+a).on("click",function(event){
				event.stopPropagation();
				$(".pai-home").animate({"bottom":"100%"},0);
				$("#leftMenu .pai-toolbox-sec").hide();
				$("#leftMenu .pai-toolbox-sec").eq(0).show();
			})
			break;
		case "btn-data-origin":
			$("."+a).on("click",function(event){
				event.stopPropagation();
				$(".pai-home").animate({"bottom":"100%"},0);
				$("#leftMenu .pai-toolbox-sec").hide();
				$("#leftMenu .pai-toolbox-sec").eq(1).show();
			})
			break;
		case "btn-experiment": //实验
			$("."+a).on("click",function(event){
				event.stopPropagation();
				$(".pai-home").animate({"bottom":"100%"},0);
				$("#leftMenu .pai-toolbox-sec").hide();
				$("#leftMenu .pai-toolbox-sec").eq(2).show();
			})
			break;
	}
}
/*实验名称切换*/
function designation(){
	//获取当前实验
	var $desiName = $(".pai-bpmn-left .text");
	//获取实验列表项
	var $textItem = $(".pai-bpmn-left .pai-dropdown li");
	//获取删除按钮
	var $textDel = $(".pai-bpmn-left  .pai-dropdown li .btn-close");
	//切换实验
	$textItem.on("click",function(){
		if($(this).hasClass("selected")){
			return;
		}else{
			$(this).addClass("selected").siblings("li").removeClass("selected");
		}
		var $text = $(this).find(".text-item").text();
		$desiName.html($text);
	})
	//删除实验
	$textDel.on("click",function(e){
		//阻止冒泡
		e.stopPropagation()
		$(this).parents("li").remove();
	})
}


/*拖拽*/
//模型计数器
/**模型计数器*/
var modelCounter = 0;
/**
 * 克隆对象
 */
function deepCopy(p,c){
	var c = c || {};
	for(var i in p){
		if(! p.hasOwnProperty(i)){
			continue;
		}
		if(typeof p[i]==="object"){
			c[i] = (p[i].constructor === Array)?[]:{};
			deepCopy(p[i],c[i]);
		}else{
			c[i]=p[i];
		}
	}
	return  c;
}
/*右侧基本切换*/
function  toggleModel(a){
	//获取模块ID
	var $toggleBtn = $("#"+a);
	$toggleBtn.on("click",function(){
		$(".dms-prop-wrap").hide();
		$("."+a+"_box").show();
	})
}
/*
*保存
* */
function play(a,b){
	var mainHTML = "";
	jsPlumb.ready(function(){
		var connects  = a;
		var mainArr = b;
		var connectorPaintStyle = {     //基本连接线样式
			lineWidth:2,               //连线宽度
			strokeStyle:"#61B7CF",   //连线颜色
			joinstyle:"round",        //连线样式
			outlineColor:"white",
			outlineWidth:0
		};
		var connectorHoverStyle = {      //鼠标悬浮在连线上的样式
			lineWidth:3,                //鼠标悬浮连线宽度
			strokeStyle:"#216477",     //鼠标悬浮颜色
			outlineColor:"white",
			outlineWidth:0
		};
		var origin = {
			//起点
			endpoint:["Dot",{radius:8}],            //端点的半径
			connectorStyle:connectorPaintStyle,      //连接线的颜色，大小样式
			connectorHoverStyle:connectorHoverStyle,//鼠标放到连线上显示的效果
			paintStyle:{
				strokeStyle:"#1e8151",
				fillStyle:"transparent",
				radius:4,
				lineWidth:2
			},              //端点的颜色样式
			auchor:"AutoDefault",
			isSource:true,     //是否可以拖动(作为连线起点)
			connector:["Bezier",{stub:[40,60],gap:10,cornerRadius:5,alwaysRespectStubs:true}], //连接线样式种类
			isTarget:false,      //是否可以放置(连接终点)
			maxConnections:-1,    //设置连接点最多可以连接几条线，-1表示无限大
			connectorOverlays:[["Arrow",{width:10,length:10,location:1 }],//控制箭头形状
				[ "Label", {//鼠标拉出来的线的属性
					location: 0.4,
					id: "label"
				}]]
		};
		var destination = { //终点
			endpoint:["Dot",{radius:5}], //端点的形状
			connectorStyle:connectorPaintStyle, //连接线的颜色，大小样式
			connectorHoverStyle:connectorHoverStyle,
			paintStyle:{fillStyle:"#1e8151"},   //端点的颜色样式
			isSource:false,                     //是否可以拖动(作为连接起点)
			connector:["Bezier",{stub:[40,60],gap:10,cornerRadius:5,alwaysRespectStubs:true}],//连接线的样式种类
			isTarget:true,   //是否可以放置(连接终点)
			maxConnections:-1, //设置连接点最多可以连接几条线，-1表示无限大
			connectorOverlays:[["Arrow",{width:10,length:10,location:1 }]]
		}
		$("#leftMenu dd").draggable({
			helper:"clone",          //复制
			scope:"ss"               //标识为了判断是否可以放置
		})
		var elementSign = 0;          //标志元素唯一性
		$("#container").droppable({
			scope:"ss",
			drop:function(event,ui){  //在目标容器上释放鼠标，ui.draggable[0]为开始拖拽的元素
				elementSign++;
				var id =  "model_" + modelCounter++;
				var left = parseInt(ui.offset.left-$(this).offset().left);
				var top = parseInt(ui.offset.top-$(this).offset().top);
				var ele = $('<div class="item model pane-node-content" data-sign="'+elementSign+'" data-id="'+id+'" data-index="'+$(ui.draggable[0]).attr("data-index")+'"  id="' + id+'"><span class="icon icon-doc"></span><span class="name">' + $(ui.helper).html() + '</span><span  class="status icon-success"></span></div>');
				ele.css({"left":left,"top":top,position:"absolute",margin:0});
				$(this).append(ele);
				jsPlumb.addEndpoint(ele,{anchors:"BottomCenter"},origin);  //起点
				jsPlumb.addEndpoint(ele,{anchors:"TopCenter"},destination); //终点
				jsPlumb.draggable(ele,{containment:"parent"});      //端点可以拖动设置，并且将端点限制在父级内
				$(ele).draggable({     //设置拖动到main区域中的元素还可以拖拽
					containment:"parent" //限制拖动不超过父级边框
				});
				workArea("ui-workarea-menu-layer");

				toggleModel("model_0");
				toggleModel("model_1");
				toggleModel("model_2");
				toggleModel("model_3");
				toggleModel("model_4");
				toggleModel("model_5");
				toggleModel("model_6");
			}
		})
		//删除节点
		function removeElement(obj)
		{
			var element = $(obj);
			if(confirm("确定删除该模型？"))
				jsPlumb.remove(element);
		}
		//监听新的连接
		jsPlumb.bind("click",function(conn,originalEvent){   //点击线段删除
			if(confirm("确定删除？"))
				jsPlumb.detach(conn);
		})
		//自己连自己管控
		jsPlumb.bind("connection",function(connInfo,originalEvent){
			init(connInfo.connection);
			alert(4);
			if(connInfo.connection.sourceId == connInfo.connection.targetId){
				jsPlumb.detach(connInfo);
				alert("不能连接自己！")
			}
		})
		//当连接成功后，将箭头上的label改为连接ID
		jsPlumb.bind("connection", function (info) {
			info.connection.getOverlay("label").setLabel(info.connection.id);
		});
		sessionStorage.setItem("flowsheet",JSON.stringify({"connects":connects,"mainArr":mainArr}));
		if (!sessionStorage.getItem("flowsheet")) {
		} else {      //判断是否有保存过
			elementSign++;
			var id = "model_" + modelCounter++;
			var flowsheet = JSON.parse(sessionStorage.getItem("flowsheet"));
			var mainHTML = "";
			for (var i = 0; i < flowsheet.mainArr.length; i++) {
				if (elementSign < flowsheet.mainArr[i].sign) {     //如果已经保存过，即将标记更新
					elementSign = flowsheet.mainArr[i].sign;
				}
				mainHTML += '<div class="model pane-node-content item"   data-sign="' + flowsheet.mainArr[i].sign + '" data-id="' + flowsheet.mainArr[i].sid + '" data-index="' + flowsheet.mainArr[i].index + '" id="' + flowsheet.mainArr[i].id + '" style="left:' + flowsheet.mainArr[i].offset.left + 'px;top:' + flowsheet.mainArr[i].offset.top + 'px;position:absolute;margin:0"  ><span class="icon icon-doc"></span><span class="name">' + flowsheet.mainArr[i].text + '</span><span  class="status icon-success"></span></div>'
			}
			;
			$("#container").append(mainHTML);
			$("#container .item").each(function () {
				jsPlumb.addEndpoint(this, {anchors: "BottomCenter"}, deepCopy(origin, {uuid: $(this).attr("data-sign") + "origin"}));//起点
				jsPlumb.addEndpoint(this, {anchors: "TopCenter"}, deepCopy(destination, {uuid: $(this).attr("data-sign") + "destination"}));//终点
				jsPlumb.draggable(this, {containment: "parent"});//端点可以拖动设置，并且将端点限制在父级内
				$(this).draggable({        //设置拖动到main区域中的元素还可以拖拽
					containment: "parent" //限制拖动不超过父级边框
				})
			});
			//固定连线
			for (var i = 0; i < flowsheet.connects.length; i++) {
				jsPlumb.connect({uuids: [flowsheet.connects[i].originSign + "origin", flowsheet.connects[i].destinationSign + "destination"]})
			}
			workArea("ui-workarea-menu-layer");
			linePlay();

			toggleModel("model_0");
			toggleModel("model_1");
			toggleModel("model_2");
			toggleModel("model_3");
			toggleModel("model_4");
			toggleModel("model_5");
			toggleModel("model_6");
		}
		//设置连接Label的label
		function init(conn)
		{
			var label_text;
			$("#select_sourceList").empty();
			$("#select_targetList").empty();
			var sourceName = $("#" + conn.sourceId).attr("id");
			var targetName = $("#" + conn.targetId).attr("id");
			$("#submit_label").unbind("click");
			$("#submit_label").on("click",function(){
				setlabel(conn);
			});

			//线条设置id
			$("#" + targetName).siblings("svg._jsPlumb_connector").last().attr("id",sourceName+"_"+targetName);
		}

	//setlabel
		function setlabel(conn)
		{
			conn.getOverlay("label").setLabel($("#select_sourceList").val()
				+ ' '
				+ $("#select_comparison").val()
				+ ' '
				+ $("#select_targetList").val());
			if($("#twoWay").val()=="true"){
				conn.setParameter("twoWay",true);
			}else{
				conn.setParameter("twoWay",false);
				conn.hideOverlay("arrow_backwards");
			}
		}
	})
}
function save(){
	var connects = [];    //存储连线的数组
	var mainArr = [];     //存储元素的数组
	$.each(jsPlumb.getAllConnections(),function(idx,connection){
		connects.push({
			ConnectionId:connection.id,
			start:$(connection.source).attr("data-index"),
			end:$(connection.target).attr("data-index"),
			originSign:$(connection.source).attr("data-sign"),
			destinationSign:$(connection.target).attr("data-sign")
		})
	})
	$("#container .item").each(function(){
		mainArr.push({
			offset:$(this).position(),
			text:$(this).text(),
			index:$(this).attr("data-index"),
			sign:$(this).attr("data-sign"),
			sid:$(this).attr("data-id"),
			id:$(this).attr("id")
		})
	})
	sessionStorage.setItem("flowsheet",JSON.stringify({"connects":connects,"mainArr":mainArr}));
}
//将值存入数组
function val(){
	var conn = [];
	var $tds = $(".right_wrap .table-body tr:visible .abc");
	$tds.each(function(){
		conn.push($(this).text())
	})
}
//线条动效
function linePlay(){
	$("#model_0_model_1").attr("class","_jsPlumb_connector active");
}

/*评估报告-绘制图表*/
function reportChart(a,b){
	//初始化charts实例
	var myChart = echarts.init(document.getElementById("charts-report"));
	var dataX = a;
	var dataY = b;
	//指定图表配置项和数据
	option = {
		title: {
			text: 'Gain',
			subtext: 'Gain值'
		},
		tooltip: {
			trigger: 'axis'
		},
		toolbox: {
			show: true,
			feature: {
				dataView: {readOnly: false},
				magicType: {type: ['line', 'bar']},
				saveAsImage: {}
			}
		},
		xAxis:  {
			type: 'category',
			boundaryGap: false,
			data:dataX
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				formatter: '{value} °C'
			}
		},
		dataZoom: [
			{   // 这个dataZoom组件，默认控制x轴。
				type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
				start: 0,      // 左边在 0% 的位置。
				end: 100         // 右边在 100% 的位置。
			}
		],
		series: [
			{
				name:'最高气温',
				type:'line',
				data:dataY,
				markPoint: {
					data: [
						{type: 'max', name: '最大值'}
					]
				}
			}
		]
	};
	//使用刚指定的配置项和数据显示图表
	myChart.setOption(option);
}
/*选择目标列选择*/
function radio(a){
	//获取radio以及右侧表项
	var $radio = $("."+a+" input.radioBox");
	var $rightFieldVal = $("."+a+" .right_wrap .table-body tbody td").eq(1);
	var $rightDataVal = $("."+a+" .right_wrap .table-body tbody td").eq(2);
	var $rightDel = $("."+a+" .right_wrap .btn-delete");
	var html = "";
	$radio.on("click",function(){
		$("."+a+" .right_wrap .table-body tbody tr").show();
		//获取当前类型以及数据
		var $fieldVal = $(this).siblings("span.radioBox").text();
		var $dataVal = $(this).parents("ul.zero-accordion").find(".zero-accordion-title span").text();
		//设置右侧数据类型
		$rightFieldVal.text($fieldVal);
		$rightDataVal.text($dataVal);
	})
	//删除已选
	$rightDel.on("click",function(){
		$(this).parents(".selected-list").find(".table-body tr").hide();
		$("."+a+" input.radioBox").prop("checked",false);
	})
}
/*字段设置*/
function fieldSet(a){
	//获取添加
	var $btnAdd = $('.'+a+" .btn-add");
	//获取item
	var $dmsItem = $("."+a+" .dms-prop-item");
	var $dmsInput = $("."+a+" .dms-prop-input");
	//获取删除
	var $btnDel = $("."+a+" .btn-delete");
	var html = "";
	html+='<div class="dms-prop-input"> '
		+'<div class="dms-prop-col-join">'
		+ '<div class="select-group">'
		+ '<div class="left-select">'
		+ '<input value=""  class="form-control" type="text">'
		+ '</div>'
		+ '<div class="middle-sign">=</div>'
		+ '<div class="right-select">'
		+ '<input value=""  class="form-control" type="text">'
		+ '</div>'
		+ '</div>'
		+ '<div class="btn-delete icon-close-o" onclick="btndel(this)"></div>'
		+ '</div>'
		+ '</div>'
	$btnAdd.on("click",function(){
		$btnDel.show()
		$dmsItem.append(html);
		console.log($dmsInput.length)
	})
	$btnDel.on("click",function () {
		console.log($dmsInput.length)
	})
}
/*--------实验---------*/
//我的实验--右键效果
function toggleTest(a){
	//获取我的实验
	var $btnTest = $(".pai-btn-test"),
		//获取右键菜单
		style = $("."+a)[0].style,
		//新建实验按钮
		$newTest = $(".copy-test-btn");
	//添加右击事件
	$btnTest.on("contextmenu",function(event){
		var event = event || window.event;
		//显示右键菜单
		style.display = "block";
		//设置右键菜单的坐标
		style.top = event.clientY+"px";
		style.left = event.clientX + "px";
		//新建模板实验
		$(".new-template-btn,.new-et-btn").on("click",function(event){
			event.stopPropagation();
			$(".pai-home").animate({"bottom":0},0);
			style.display = "none";
		})
		return false;
	})
	$(".new-et-btn").on("click",function(event){
		event.stopPropagation();
		$(".pai-home").animate({"bottom":0},0);
		style.display = "none";
	})
	$("body").on("click",function(){
		style.display = "none";
	})
}
//我的实验
$(function(){
	$(".pai-et-box").on("click",function(){
		var $index = $(this).index();
		switch ($index){
			case 0:
				var data1 =[{"ConnectionId":"con_12","start":"1","end":"2","originSign":"2","destinationSign":"3"},{"ConnectionId":"con_12","start":"1","end":"2","originSign":"2","destinationSign":"3"}];
				var data2 = [{"offset":{"top":67,"left":216},"text":"\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\tTensorflow图片分类1\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t","index":"1","sign":"2","sid":"model_1","id":"model_1"},{"offset":{"top":205,"left":344},"text":"\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\tTensorflow图片分类2\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t","index":"2","sign":"3","sid":"model_2","id":"model_2"}]
				test(data1,data2);
				break;
			case 1:
				var data3 =[{"ConnectionId":"con_12","start":"1","end":"3","originSign":"1","destinationSign":"2"}];
				var data4 =[{"offset":{"top":60,"left":122},"text":"\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\tTensorflow图片分类1\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t","index":"1","sign":"1","sid":"model_0","id":"model_0"},{"offset":{"top":59,"left":434},"text":"\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\tTensorflow图片分类3\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t","index":"3","sign":"2","sid":"model_1","id":"model_1"}]
				test(data3,data4);
				break;
		}
	})
})
function test(a,b){
	$("#container").html("");
	sessionStorage.clear();
	play(a,b);
}

