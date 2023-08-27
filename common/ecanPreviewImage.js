//用于悠悠办公预览图片的APIurl处理
//因为一般都是内网url，需要转换为前置机地址
import hrUrl from"@/common/hrReqConst.js"
import hrpCodeblock from"@/common/hrpCodeblock.js"
//已废弃，请使用getPreviewImageChuanyi
const getPreviewImage=function(params){
	
	var dataOption=params.dataOption;
	var urls=params.urls;
	var targetIndex=params.targetIndex; 
	if(!targetIndex){
		targetIndex=0;
	}
	var _this=this;
	var nginxKey="youyouNginxUrl";//悠悠前置机url 
	var pobj={
		keys:nginxKey 
	};
	uni.showLoading({
		title: '预览中..',
		mask: true
	});
	hrpCodeblock(_this,dataOption,"hrp_getSysParameter",JSON.stringify(pobj),
	(res)=>{
		if(res) {
			 
			let data = res.data.data; 
			var nginx=""; 
			if(data&&data[nginxKey]&&data[nginxKey]!=''){
				nginx=data[nginxKey]; 
				if(nginx.charAt(nginx.length-1)!='/'){
					nginx+='/';
				}
				var newUrls=[];
				for(var i=0;i<urls.length;i++){
					var tmpUrl=urls[i];
					tmpUrl=tmpUrl.replace("https://","").replace("http://","");
					tmpUrl=tmpUrl.substring(tmpUrl.indexOf("/")+1);
					tmpUrl=nginx+tmpUrl;
					newUrls.push(tmpUrl);
				}
				console.log("newUrl",nginx,newUrls);
				uni.previewImage({
					urls:newUrls,
					current:targetIndex
				})
			}else{
				uni.previewImage({
					urls:urls,
					current:targetIndex
				})
			}
			
		}else{
			uni.previewImage({
				urls:urls,
				current:targetIndex
			})
		}
		
	},
	()=>{
		uni.previewImage({
			urls:urls,
			current:targetIndex
		})
	},
	null);
	 
}
//使用传奕接口的预览模式
const getPreviewImageChuanyi=function(params){
	var dataOption=params.dataOption;
	var urls=params.urls;
	var targetIndex=params.targetIndex;
	var mode=params.mode;
	var fileIds=params.fileIds;
	if(!targetIndex){
		targetIndex=0;
	}
	var _this=this;
	var userInfo={
		loadInfo:dataOption
	}; 
	userInfo=JSON.stringify(userInfo);
	uni.showLoading({
		title: '预览中..',
		mask: true
	}); 
	
	var success=(res)=>{
		if(res) {
			 
			 function getType(name){
			 	var ftype='other'; 
			 	var suffix=name.split(".");
			 	suffix=suffix[suffix.length-1];
			 	if(suffix=='pdf'){ 
			 			 ftype='pdf';
			 	}else if(suffix=='doc'||suffix=='docx' ||suffix=='txt'){
			 			//通过API转换成PDF后展示 
			 			//todo 在后端转成PDF后展示
			 			ftype='doc'
			 	}else if( suffix=='xlsx'||suffix=='xls'){
			 			ftype='xls'; 
			 	}else{
			 					ftype='pic'
			 				}
			 				return ftype;
			 }
			 function solveUrl(urls){
				 for(var k=0;k<urls.length;k++){
					 urls[k]=urls[k];//.replace('http://uu.3dsky.com.cn/','/3dsky/')
					 //.replace('http://uu.3dsky.com.cn:9090/','/3dsky9090/')
				 }
			 }
			let data = res.data.data; 
			 
			if(data ){ 
				var newUrls=[];
				for(var i=0;i<data.length;i++){
					var tmpUrl=data[i].localRelativePath; 
					newUrls.push(tmpUrl);
				}
				if(mode=='goPdf'){
					let ftype=getType(data[0].name);
					uni.navigateTo({
						url: '/pages/common/showPdf?userInfo='+userInfo+'&url='+newUrls[0]+'&file_id='+data[0].opId+'&file_type='+ftype
					});
				}else{
					uni.previewImage({
						urls:newUrls,
						current:targetIndex
					})
				}
				 
				
			}else{
				if(mode=='goPdf'){
					let ftype=getType(urls[0]);
					uni.navigateTo({
						url: '/pages/common/showPdf?userInfo='+userInfo+'&url='+urls[0]+'&file_id='+fileIds[0]+'&file_type='+ftype
					});
				}else{
					uni.previewImage({
						urls:urls,
						current:targetIndex
					})
				}
				
			}
			
		}else{
			uni.previewImage({
				urls:urls,
				current:targetIndex
			})
		}
		
	};
	var fail=()=>{
		uni.previewImage({
			urls:urls,
			current:targetIndex
		})
	};
	var complete=()=>{
			uni.hideLoading()
		};
	uni.request({
		url: hrUrl.replace('callCodeBlock','getFiles'),
		method: 'POST',
		dataType: 'json',
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		data: {
			'hrpId': dataOption.hrpId,
			'hrpPwd': dataOption.hrpPwd,
			'hrpUnitId': dataOption.hrpUnitId,
			'authDate': dataOption.authDate,
			'orgNo': dataOption.orgNo,
			'context': dataOption.context, 
			'docId': params.docId,
			'flag':'',
			'fileType':'',
			'fileIds':params.fileIds,
			'mode':'3mail',
			'needResultStr':'0'
		},
		success: success,
		fail: fail,
		complete: complete
	});
	 
	 
}


module.exports = getPreviewImageChuanyi;