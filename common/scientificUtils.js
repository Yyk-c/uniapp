import request from '@/common/scientificRequest.js'
import {baseUrl} from '@/common/scientficUrl.js'



function guid2() {
	function S4() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}
	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time

	return ([hour, minute, second]).map(function (n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}

function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}
var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function (milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function (dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function (number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDate()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function (str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};

/* 获取当前年月日 */
function getCurrentDate() {
	var date = new Date();
	var seperator1 = "-";
	var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
	var strDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
	return currentdate;
}

// 判断空值判断1
function isEmpty(str) {
	if (str == "null" || str == null || str == undefined || str == "undefined") {
		return "";
	} else {
		return str;
	}
}

/* 判断微信环境 */
function wxEnvjudge() {
	// window.navigator.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.9.0 Safari/537.36 Language/zh wxwork/4.0.12 (MicroMessenger/6.2) WindowsWechat  MailPlugin_Electron WeMail embeddisk';
	var testuserAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.9.0 Safari/537.36 Language/zh wxwork/4.0.12 (MicroMessenger/6.2) WindowsWechat  MailPlugin_Electron WeMail embeddisk';
	
	var isMobile = window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i); // 是否手机端
	var isWx = /micromessenger/i.test(navigator.userAgent); // 是否微信
	var isComWx = /wxwork/i.test(navigator.userAgent); // 是否企业微信
	
	var isMobile2 = testuserAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i); // 是否手机端
	var isWx2 = /micromessenger/i.test(testuserAgent); // 是否微信
	var isComWx2 = /wxwork/i.test(testuserAgent); // 是否企业微信
	
	
	if (isComWx && isMobile) { //手机端企业微信
		return 'com-wx-mobile'
	} else if (isComWx && !isMobile) { //PC端企业微信
		return 'com-wx-pc'
	} else if (isWx && isMobile) { // 手机端微信
		return 'wx-mobile';
	} else if (isWx && !isMobile) { // PC端微信
		return 'wx-pc';
	} else {
		return 'other';
	}
}

/* 企业微信鉴权 */
async function wxAuthority(hrpbaseParam, currentUrl) {
	if (wxEnvjudge().indexOf("com-wx") != -1 && !uni.getStorageSync('wxAccessToken')) {
		await getWxAccessToken(hrpbaseParam, currentUrl)
	}
}

// 获取企业微信accessToken
async function getWxAccessToken(hrpbaseParam, currentUrl) {
	initWxBaseInfo(hrpbaseParam)
	let params = {
		wxCorpid: uni.getStorageSync("corpId"),
		wxCorpsecret: uni.getStorageSync("appSecret")
	}
	console.log("获取企业微信accessToken入参：" + JSON.stringify(params));
	let res = await request('/hrp!getWXAccessToken.action', params)
	console.log("获取企业微信accessToken出参：" + JSON.stringify(res));

	if (res.success && res?.data?.access_token) {
		uni.setStorageSync('wxAccessToken', res?.data?.access_token ?? '');
		getWxTicket(currentUrl);
	}
}

/* 初始化企业微信基础信息 */
async function initWxBaseInfo(hrpbaseParam) {
	switch (hrpbaseParam.orgNo) {
		case "fzxhyy_test":
			uni.setStorageSync("corpId", "wwe5e95e210ccd97a7")
			uni.setStorageSync("appSecret", "ZOzFPZsGWaAKqNC82dEGpcSIJKFHyq5LWvjCUK3liw8")
			break
		case "fjxhyy":
			uni.setStorageSync("corpId", "wwa284c44f4e734cbc")
			uni.setStorageSync("appSecret", "Mt2AhrssiilcOYv18uVCaLsE5oxLdnEF29S-3DfeE2w")
			break
	}
}

/* 获取企业微信ticket */
async function getWxTicket(currentUrl) {
	let params = {
		accessToken: uni.getStorageSync("wxAccessToken")
	}
	console.log("获取企业微信ticket入参：" + JSON.stringify(params));
	let res = await request('/hrp!getWxTicket.action', params)
	console.log("获取企业微信ticket出参：" + JSON.stringify(res));

	uni.setStorageSync('wxTicket', res?.data?.ticket ?? '')
	getWxSignature(currentUrl);
}

/* 获取微信jsapi权限 */
async function getWxSignature(currentUrl) {
	let timeStamp = new Date().getTime()
	let wxNonceStr = 'ecan8888'

	let params = {
		jsticket: uni.getStorageSync('wxTicket'),
		nonceStr: wxNonceStr,
		timeStamp: timeStamp,
		url: currentUrl
	}
	console.log("获取企业微信jsapi权限入参：" + JSON.stringify(params));
	let res = await request('/hrp!getWxConfigSign.action', params)
	console.log("获取企业微信jsapi权限出参：" + JSON.stringify(res));

	let wxSignature = res?.data ?? '';

	uni.lzWeixin.config({
		beta: true,
		debug: false,
		appId: uni.getStorageSync('corpId'), //必填，企业ID
		timestamp: timeStamp, // 必填，生成签名的时间戳
		nonceStr: wxNonceStr, // 必填，生成签名的随机串
		signature: wxSignature, // 必填，签名
		jsApiList: [
			'scanQRCode',
			'checkJsApi',
			'onHistoryBack',
			'onMenuShareWechat'
		] // 必填，需要使用的jsapi列表，注意：不要带wx。
	});
}

/* 导出打印封面 */
async function print(id, docId, hrpbaseParam) {
	if (isEmpty(uni.getStorageSync('esbIpPort')) == '') {
		await getESBIpPort(hrpbaseParam.orgNo)
	}
	setTimeout(loadPrintScript, 0);
	console.log("uni.lzWeixin:",uni.lzWeixin);
	console.log("wx:",wx);
	hrpbaseParam.authDate = getCurrentDate()
	hrpbaseParam.codeBlockName = 'srms_app_sqdPrint';
	hrpbaseParam.params = JSON.stringify({
		apply_id:id,    //申请单id
		main_id: docId, //项目id
	});
	let res = await request('hrp!callCodeBlock.action', hrpbaseParam)
	
	if (res.success) {
		if (res.data.flag) {
			var printContent = res.data.img;
			var printWidth = isEmpty(res.data.paper_width) == "" ? "210" : res.data.paper_width;
			var printHeight = isEmpty(res.data.paper_length) == "" ? "297" : res.data.paper_length;
			var printDirection = isEmpty(res.data.print_direction) == "" ? "1" : res.data.print_direction;

			distalPrint(docId, printContent, printWidth, printHeight, printDirection);
			
			let res1 = await new Promise(resolve => {
				setTimeout(() => {
					objectURLToBuffer('http://' + uni.getStorageSync('esbIpPort') + '/api/anonymous/tmpfiles/' + docId + '.pdf', function(buffer) {
						var base64Content = bytesToBase64(buffer);
						if (isEmpty(base64Content) == "") {
							resolve({
								success: false,
								msg: '导出失败，请确认打印模板是否配置'
							});
						} else {
							console.log("flag:",'com-wx-pc'.indexOf('com-wx')!=-1);
							if (wxEnvjudge().indexOf("com-wx") != -1) {
								resolve(exportPrintUrl(docId, base64Content, hrpbaseParam))
							} else {
								resolve({
									success: false,
									msg: '暂不支持该应用程序导出'
								});
							}
						}
					})
				}, 1000);
			});
			if (!res1.success) {
				throw new Error(res1.msg)
			}
		} else {
			throw new Error(res.data.message)
		}
	} else {
		throw new Error(res.msg)
	}
}

/* 获取机构对应前置机IP端口 */
async function getESBIpPort(orgNo) {
	let params = {
		orgNo: orgNo
	}
	let res = await request('/MOP/hrp!getESBIpPort.action', params)

	uni.setStorageSync('esbIpPort', res?.data?.esbIpPort ?? '')
}

/* 加载远端打印js文件 */
function loadPrintScript() {
	var jss = [
		'http://' + uni.getStorageSync('esbIpPort') + '/clodop/CLodopfuncs.js?priority=3'
	];
	for (var i = 0; i < jss.length; i++) {
		var element = document.createElement("script");
		element.src = jss[i];
		document.body.appendChild(element);
	}
}

/* 触发远端打印 */
function distalPrint(fileName, htmlContent, width, height, direction) {
	LODOP.PRINT_INITA('10mm', '2.99mm', width + 'mm', height + 'mm', fileName);
	LODOP.SET_PRINT_PAGESIZE(direction, width + "0", height + "0", "A4");
	LODOP.SET_SHOW_MODE('LANDSCAPE_DEFROTATED', direction == "1" ? "2" : "1");
	LODOP.SET_LICENSES('福建亿能达信息技术股份有限公司', 'B6F7A7593C7BDBFBF9FFCDF605DC8D4F', '', '');
	eval(htmlContent);
	LODOP.SET_PRINTER_INDEXA('PDF24');
	LODOP.PRINT();
}

/* 下载文件流 */
function objectURLToBuffer(url, callback) {
	var http = new XMLHttpRequest();
	http.open("GET", url, true);
	http.responseType = "arraybuffer";
	http.onload = function(e) {
		if (this.status == 200 || this.status === 0) {
			callback(this.response);
		} else {
			callback(null);
		}
	};
	http.send();
}

/* 字节数组转base64字符串 */
function bytesToBase64(buffer) {
	var binary = '';
	var bytes = new Uint8Array(buffer);
	var len = bytes.byteLength;
	for (var i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return window.btoa(binary);
	//return binary;
}

/* 企业微信分享链接 */
async function exportPrintUrl(docId, base64Content, hrpbaseParam) {
	var docId = "print_" + docId + "_" + new Date().getTime();
	var mFile = convertBase64UrlToFileType("," + base64Content, docId + ".pdf", "application/pdf");
	console.log("printFile===", mFile);
	var fileId = await commitPrintFile(docId, mFile, hrpbaseParam);
	console.log("fileId-判断前:",fileId);
	if (fileId == null) {
		return {
			success: false,
			msg: '导出文件失败，文件生成异常'
		};
	}
	console.log("fileId-判断后",fileId);
	var fileArray = await getPrintFile(docId, fileId, hrpbaseParam);
	console.log("fileArray",fileArray)
	if (fileArray == null) {
		return {
			success: false,
			msg: '导出失败，文件获取异常'
		};
	}
	// console.log("uni.lzWeixin-befinvoke:",uni.lzWeixin);
	// uni.lzWeixin.invoke(
	// 	"shareWechatMessage", {
	// 		title: '科研申请单', // 分享标题
	// 		desc: '科研申请单', // 分享描述
	// 		link: fileArray[0].localRelativePath, // 分享链接
	// 		imgUrl: '', // 分享封面
	// 		enableIdTrans: 0, // 是否开启id转译，不填默认为0
	// 	},
	// 	function(res) {
	// 		if (res.err_msg == "shareWechatMessage:ok") {
	// 			//正确处理
	// 		} else {
	// 			//错误处理
	// 		}
	// 	}
	// );
	// console.log("uni.lzWeixin-afterinvoke:",uni.lzWeixin);
	
	uni.lzWeixin.ready(function(){
		wx.updateAppMessageShareData({ 
		    title: '科研申请单', // 分享标题
		    desc: '科研申请单', // 分享描述
		    link: fileArray[0].localRelativePath, // 分享链接
		    imgUrl: '', // 分享封面
		    enableIdTrans: 0, // 是否开启id转译，不填默认为0
		    success: function () {
		      // 设置成功
		    }
		  })
	});

	return {
		success: true,
		msg: '导出成功'
	}
}

/**
 * 将以base64的图片url数据转换为File 可以直接上传文件
 * @param urlData
 *            用url方式表示的base64图片数据
 */
function convertBase64UrlToFileType(urlData, name, type) {
	var bytes = window.atob(urlData.split(',')[1]); //去掉url的头，并转换为byte

	//处理异常,将ascii码小于0的转换为大于0
	var ab = new ArrayBuffer(bytes.length);
	var ia = new Uint8Array(ab);
	for (var i = 0; i < bytes.length; i++) {
		ia[i] = bytes.charCodeAt(i);
	}

	var blob = new Blob([ab], {
		type: type
	});

	const blobFile = new window.File(
		[blob],
		name, {
			type: type
		}
	);

	return blobFile;
}

/* 提交打印封面文件 */
async function commitPrintFile(docId, file, hrpbaseParam) {
	hrpbaseParam.authDate = getCurrentDate()
	hrpbaseParam.employeeId = hrpbaseParam?.appUserId ?? docId
	hrpbaseParam.docId = docId
	hrpbaseParam.mode = "print"
	hrpbaseParam.fileTypes = file.name.substring(file.name.lastIndexOf(".") + 1)
	let dataFileName = [] // 文件名数组
	dataFileName.push(file.name)
	hrpbaseParam.dataFileName = dataFileName
	let res = await uni.uploadFile({
		url: `${baseUrl}hrp!commitFiles.action`,
		file,
		name: 'data',
		timeout: 30000,
		formData: hrpbaseParam,
	});
	res = JSON.parse(res[1].data)
	console.log("文件上传:",JSON.stringify(res));
	if (res.success && res.data) {
		return res.data;
	} else {
		return null
	}
}

/* 获取打印封面文件 */
async function getPrintFile(docId, fileId, hrpbaseParam) {
	console.log("into-getPrintFile");
	console.log("getPrintFile-hrpbaseParam-befinput:",hrpbaseParam);
	hrpbaseParam.authDate = getCurrentDate()
	hrpbaseParam.docId = docId;
	hrpbaseParam.fileType = "";
	hrpbaseParam.fileIds = fileId;
	hrpbaseParam.mode = "print";
	hrpbaseParam.needResultStr = "0";
	console.log("getPrintFile-hrpbaseParam-afterinput:",hrpbaseParam);
	let res = await request('hrp!getFiles.action', hrpbaseParam)
	console.log("文件:",JSON.stringify(res));
	if (res.success && res.data && res.data.length > 0) {
		return res.data;
	} else {
		return null
	}
}

module.exports = {
	formatTime: formatTime,
	formatLocation: formatLocation,
	dateUtils: dateUtils,
	guid2:guid2,
	print:print,
	wxEnvjudge:wxEnvjudge,
	wxAuthority:wxAuthority
}
