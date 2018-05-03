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
	/*首页，组件切换*/
	navTab("btn-home-page");
	navTab("btn-module");
	/*实验名称切换*/
	designation();
	/*创建表*/

}
function menu(a){
	//获取外层元素
	var $menuItem = $("."+a);
	//判断当前元素
	switch (a){
		//最外层div，一级菜单
		case "pai-test-box":
			$($menuItem).on("click",function(){
				$(this).nextAll("dl").is(":hidden")?$(this).nextAll("dl").show():$(this).nextAll("dl").hide();
				$(this).nextAll("dl").is(":hidden")?$(this).find("i").addClass("active"):$(this).find("i").removeClass("active");
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
/*右侧tab切换*/
function tab(a,b){
	var $tabBtn = $("."+a+" li");
	var $page = $("."+b+ " .dms-prop-page");
	$tabBtn.on("click",function(){
		var $index = $(this).index();
		$(this).hasClass("selected")?$(this).attr("class","selected"):$(this).addClass("selected").siblings("li").removeClass("selected");
		$page.eq($index).show().siblings(".dms-prop-page").hide();
	})
}

/*工作区右键菜单*/
function workArea(b){
	var $itemName = $("#container .model"),
		style = $("."+b)[0].style;
	var $remove = $(".removeElement");
	var $executeBtn = $(".btn-execute-begin");
		style.display = "none";
	$itemName.on("contextmenu",function(event){
		var event = event || window.event;
		var $this = $(this);
		style.display = "block";
		style.top = event.clientY+"px";
		style.left = event.clientX + "px";
		$remove.unbind("click").on("click",function () {
			removeElement($this);
			style.display = "none";
		})
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
			})
			break;
	}
}
/*实验名称切换*/
function designation(){
	var $desiName = $(".pai-bpmn-left .text");
	var $textItem = $(".pai-bpmn-left .pai-dropdown li");
	$textItem.on("click",function(){
		if($(this).hasClass("selected")){
			return;
		}else{
			$(this).addClass("selected").siblings("li").removeClass("selected");
		}
		var $text = $(this).find(".text-item").text();
		$desiName.html($text);
	})
}

/*拖拽*/
//模型计数器
/**模型计数器*/
var modelCounter = 0;
/**
 * 初始化一个jsPlumb实例
 */
var instance = jsPlumb.getInstance({
	DragOptions: { cursor: "pointer", zIndex: 2000 },      //可通过jsPlumb.draggable配置
	PaintStyle:{strokeStyle:'#666'},
	EndpointStyle:{width:20,height:16,strokeStyle:"#666"},
	Endpoint:"Rectangle",
	Anchors:["TopCenter"],
	ConnectionOverlays: [                                   //默认Connection的遮罩
		[ "Arrow", {
			location: 1,
			visible:true,
			width:11,
			length:11,
			direction:1,
			id:"arrow_forwards"
		} ],
		[ "Arrow", {
			location: 1,
			visible:false,
			width:11,
			length:11,
			direction:-1,
			id:"arrow_backwards"
		} ],
		[ "Label", {
			location: 0.5,
			id: "label",
			cssClass: "aLabel"
		}]
	],
	Container: "container"
});
instance.importDefaults({
	ConnectionsDetachable:true,
	ReattachConnections:true
});

/**
 * 设置左边菜单
 * @param Data
 */

function setLeftMenu()
{
	//拖拽设置
	$("#leftMenu dd").draggable({
		helper: "clone",//clone只是拖出这个window的副本
		scope: "plant"
	});
	$("#container").droppable({
		scope: "plant",
		drop: function(event, ui){
			CreateModel(ui, $(this));
		}
	});
}

/**
 * 添加模型
 * @param ui
 * @param selector
 */

var elementSign=0;//标志元素唯一性
function CreateModel(ui, selector)
{
	elementSign++;
	var modelId = $(ui.draggable).attr("id");
	var id =  "model_" + modelCounter++;
	var type = $(ui.draggable).find(".element-default span:last-child").text();
	$(selector).append('<div  class="item model pane-node-content" id="' + id+'"><span class="icon icon-doc"></span><span class="name">' + $(ui.helper).html() + '</span><span  class="status icon-success"></span></div>');
	var left = parseInt(ui.offset.left - $(selector).offset().left);
	var top = parseInt(ui.offset.top - $(selector).offset().top);
	$("#"+id).css("position","absolute").css("left",left).css("top",top);
	//添加连接点
	instance.addEndpoint(id, { anchors: "RightMiddle" }, hollowCircle);
	instance.addEndpoint(id, { anchors: "LeftMiddle" }, hollowCircle);
	instance.addEndpoint(id, { anchors: "TopCenter" }, hollowCircle);
	instance.addEndpoint(id, { anchors: "BottomCenter" }, hollowCircle);
	//注册实体可draggable
	$("#" + id).draggable({
		containment: "parent",
		drag: function (event, ui) {
			instance.repaintEverything();
		},
		stop: function () {
			instance.repaintEverything();
		}
	});
	workArea("ui-workarea-menu-layer");


	/*右侧基本切换*/
	var $model_0 = $("#model_0"),
		$model_1=$("#model_1"),
		$model_2=$("#model_2"),
		$model_3=$("#model_3"),
		$model_4=$("#model_4"),
		$model_5=$("#model_5"),
		$model_6=$("#model_6");
	$model_0.on("click",function(){
		$(".dms-prop-wrap").hide()
		$(".model_0_box").show()
	})
	$model_1.on("click",function(){
		$(".dms-prop-wrap").hide()
		$(".model_1_box").show()
	})
	$model_2.on("click",function(){
		$(".dms-prop-wrap").hide()
		$(".model_2_box").show()
	})
	$model_3.on("click",function(){
		$(".dms-prop-wrap").hide()
		$(".model_3_box").show()
	})
	$model_4.on("click",function(){
		$(".dms-prop-wrap").hide()
		$(".model_4_box").show()
	})
	$model_5.on("click",function(){
		$(".dms-prop-wrap").hide()
		$(".model_5_box").show()
	})
	$model_6.on("click",function(){
		$(".dms-prop-wrap").hide()
		$(".model_6_box").show()
	})
}
//端点样式设置
var hollowCircle = {
	endpoint: ["Dot",{ cssClass: "endpointcssClass",radius:8}], //端点形状
	paintStyle: {                                                    //端点的颜色样式
		/*fill: "#f8fafb",*/
		radius:5,
		stroke:"#666666"
	},
	isSource: true, //是否可拖动（作为连接线起点）
	connector: ["Bezier", { curviness:63 } ],//设置连线为贝塞尔曲线
	isTarget: true,                            //是否可以放置（连接终点）
	maxConnections:-1,                         //设置连接点最多可以连接几条线
	connectorStyle:connectorPaintStyle      //连接线的颜色，大小样式
};
var connectorPaintStyle = {                   //基本连接线样式
	lineWidth:4,                                //连线宽度
	strokeStyle:"#61B7CF",                    //连线颜色
	joinstyle:"round",                         //连线样式
	outlineColor:"white",
	outlineWidth:0
};
/**
 * 创建模型内部元素
 * @param type
 * @returns {String}
 */

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
//删除节点
function removeElement(obj)
{
	var element = $(obj);
	if(confirm("确定删除该模型？"))
		instance.remove(element);
}