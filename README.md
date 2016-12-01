# 说明
	
- jquery的穿梭框插件，依赖bizui

# Usage

下载最新版本或者：

    npm install @bizfe/jquery-transfer

在页面中引入jquery还有bizui的css文件还有js文件,记得把dist中的img文件夹也拷出来放在对应路径上

    <link rel="stylesheet" type="text/css" href="jquery.bizui.css" />
	<link rel="stylesheet" type="text/css" href="jquery.transfer.css" />

	<script type="text/javascript" src="jquery.js"></script>
	<script type="text/javascript" src="jquery.bizui.js"></script>
	<script type="text/javascript" src="jquery.transfer.js"></script>


使用

	$('#test').bizTransfer(options);
	//options 为bizTransfer的配置
	options = {
		dataSource: data, //传入穿梭框的数据
		onChange: function () {}, //传入穿梭框回调的change事件
		titles: ['title1', 'title2']， //左右两个穿梭框的标题
		keyMap: {
	        id: 'groupId',
	        title: 'groupTitle',
	        chosen: 'selected'
	    },//提供需要传入穿梭框的数据与默认key值的映射关系, 默认key值为id, title(显示的文字)，chosen（是否选中，true为选中，显示于右侧）
		styles: [{width:'', height: ''}, {width:'', height: ''}], //样式列表,分别为左框和右框
		noContent: '', //传入穿梭框数据为空时显示内容
	}


Api 

- add: 增加一个选项
	
	`$('#test').bizTransfer('add', [{id:1,title:'', chosen: false}])`

- value: 获取被选项对应的数据

	`$('#test').bizTransfer('value')`

- select: 选中一些选项

	`$('#test').bizTransfer('select', [1,2,3]) //列表中为需要被选中数据的id值`

-update: 更新穿梭框的数据
	
	`$('#test').bizTransfer('update', newData) //key值

# 参考 

见demo