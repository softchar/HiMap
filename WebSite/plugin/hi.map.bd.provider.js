/*
	@ 复制opt对象 @
    @ 张诗旭 @
*/
function extendOpts(destination, source) {
	for (var property in source)
		destination[property] = source[property];
	return destination;
}
/*
    @ 对象继承 @
    @ 张诗旭 @
*/
function extend(subClass, superClass) {
	var f = function () { };
	f.prototype = superClass.prototype;
	subClass.prototype = new f();
	subClass.prototype.constructor = subClass;
	/*
        为派生类指定一个superclass对象,指向父类的prototype
        为派生类与父类的构造解耦
    */
	subClass.superclass = superClass.prototype;
	if (superClass.prototype.constructor == Object.prototype.constructor) {
		superClass.prototype.constructor = superClass;
	}
}

/*
	@ HiMapBase基类 @
    @ 张诗旭 @
*/
var HiMapBase = function () { }

HiMapBase.prototype = {
    IsCreated: false,                               //是否已经建立
	Map: null,
	Opts: {
		containerId: "",							//地图初始的容器ID
		point: new BMap.Point(116.404, 39.915),		//初始化地图的中心点
		zoom: 15,									//地图的原始缩放比例
		openzoom: true,								//是否开启鼠标缩放
	},

    /* @ 创建地图 @ */
	Create: function (options) {
		extendOpts(this.Opts, options);

		if (!this.Opts.containerId) {
			console.log("_opts.containerId is null or empty");
			return;
		}
		this.Map = new BMap.Map(this.Opts.containerId);
		this.Map.enableScrollWheelZoom(this.Opts.openzoom);

		return this;
	},

    /*  @ 显示地图 @ */
	Show: function (point) {
	    if (this.Opts && this.Map) {
	        this.Map.centerAndZoom(this.Opts.point, this.Opts.zoom);
	        //this.AddMarker(new HiMarker(point.lng, point.lat));
	        return this;
	    }
		console.log("_create(options) return false");
	},

    /* @ 添加覆盖物到地图上 @ */
	AddMarkers: function (collect) {
		if (this.Map && collect.length > 0) {
			for (var i = 0; i < collect.length; i++) {
				var marker = collect[i].marker;
				//var data = markerCollect.markers[i].data;
				this.Map.addOverlay(marker);
			}
		}
		/*
		var point = new BMap.Point(116.400244, 39.92556);
		this.Map.addOverlay(point);
		*/
		return this;
	},

	/* @ 添加覆盖物到地图上 @ */
	AddMarker: function (himarker) {
	    this.Map.addOverlay(himarker.marker);
	    return this;
	},

	/* @ 清除地图上的所有覆盖物 @ */
	ClearOverlays: function () {
	    this.Map.clearOverlays();
	    return this;
	},

	/* @ 移动地图 @ */
	MoveTo: function (point, zoom) {
		this.Map.clearOverlays();
		this.Map.closeInfoWindow();
		this.Map.setZoom(zoom | this.Opts.zoom);
		this.Map.panTo(point, { noAnimation: false });
		this.AddMarker(new HiMarker(point.lng, point.lat));
		return this;
	},

};

/*
	@ HiMap地图类 @
    @ 张诗旭 @
*/
var HiMap = (function () {
	var _current = null;

	function _init(options) {
		return new HiMapBase().Create(options);
	}

	return {

		getInstance: function (options) {
			if (!_current)
				_current = _init(options);
			return _current;
		}
	}

})();


/*
	@ 覆盖物 @
    @ 张诗旭 @
*/
function HiMarker(lo, la, data) {
	var point = new BMap.Point(lo, la);
	this.marker = new BMap.Marker(point);
	if (data) {
	    var label = new BMap.Label(data);
	    label.setStyle({ color: "white", fontSize: "12px", border: "blue", background: "none", fontAlign: "center",width:"30px",height:"30px" });
	    label.setOffset(new BMap.Size(0, 3));
	    this.marker.setLabel(label);
	}
	

    /* @ 绑定mouseover事件 @ */
    /*
	this.marker.addEventListener("mouseover", function () {
		var postWindow = new CompanyPostInfoWindow();
		postWindow.InitWindow(this);
		postWindow.ShowWindow();
        
	});
    */
    /* @ 绑定mouseout事件 @ */
    /*
	this.marker.addEventListener("mouseout", function () {
		//this.marker.
	});
    */
	/* @ 用户数据 @ */
	this.data = data;
}

HiMarker.prototype.Remove = function (map) {
	map.removeOverlay(this.marker);
}


/*
	@ HiMarkerProvider @
        覆盖物控制
*/
function HiMarkerProvider() {

}

/*
	@ 覆盖物窗口 @
        说明:用户显示覆盖物表示的内容
*/
function HiOverlayWindow() {
	this._opts = {
		width: 0,
		height: 0,
		//maxWidth: 0,
		//offset
		title: '',
		enableAutoPan: true,
		enableCloseOnClick: true,
		//enableMessage: false,           //是否在信息窗里显示短信发送按钮
		//message: false,
		htmlElement: '',
	};

	this._infoWindow = null;
	this._marker = null;

	/* @ 初始化覆盖物窗口 @ */
	this._initWindow = function (marker) {
		this._infoWindow = new BMap.InfoWindow(this._opts.htmlElement, this._opts);
		this._marker = marker;
		//this._opts = extendOpts(_opts, this.options);
	}
	/* @ 创建覆盖物窗口 @ */
	this._createWindow = function (marker) {

	}
	/* @ 显示覆盖物窗口 @ */
	this._showWindow = function (marker) {
		this._marker.openInfoWindow(this._infoWindow);
	}
	/* @ 摧毁窗口 @ */
	this._destoryWindow = function () {

	}
	/* @ 重绘窗口 @ */
	this._redrawWindow = function () {

	}
}
HiOverlayWindow.prototype = {
	/*
        @ 初始化窗口 @
            说明:原材料的准备工作;(买菜/摘菜)
            职责:初始化
    */
	InitWindow: function (marker) {
		this._initWindow(marker);
	},
	/*
        @ 创建窗口 @
            说明:创建窗口内部元素的过程;(炒菜)
            职责:创建
    */
	CreatWindow: function (marker) {
		this._createWindow(map);
	},
	/*
        @ 显示窗口 @
            说明:根据需求绘制窗口;(上菜)
            职责:显示
    */
	ShowWindow: function () {
		this._showWindow();
	},
	/*
        @ 摧毁窗口 @
            说明:摧毁窗口,回收资源(洗盘子)
            职责:收尾/回收
    */
	DestroyWindow: function () {

	},
	/*
        @ 窗口重绘 @
            说明:根据需求重新绘制窗口;(回锅)
            职责:再加工
    */
	ReDraw: function () {

	}
};

/* 
    @ 企业职位信息窗口 @ 
        关系:继承至CompanyPostInfoWindow
*/
function CompanyPostInfoWindow() {

	/* @ superClass指向父类的原型;在子类的内部弱化对父类的依赖 @ */
	CompanyPostInfoWindow.superclass.constructor.call(this);

	this._opts = {
		width: 400,
		height: 300,
		//maxWidth: 200,
		title: '这是一个测试信息框',
		htmlElement: "<p>职位名称：销售人员</p><p>职位月薪：3500 - 100000</p><p>职位名称：销售人员</p><p>公司名称：美联物业代理（深圳）有限公司澳城分公司</p><img src='http://Res.kupin.co/upload/201507/21/27c7d9e6-7bcb-4f74-a3bc-46a4a3682b21.jpg' style='width:120px;height:80px'/>"
	};
}

/* @ 设置原型链 @ */
extend(CompanyPostInfoWindow, HiOverlayWindow);


