import hrUrl from"@/common/hrReqConst.js"
const hrCodeblockReq=function(_this,dataOption,codeBlockName,params,success,fail,complete){
	if(complete==null||complete==undefined){
		complete=()=>{
			uni.hideLoading()
		}
	}
	if(fail==null||fail==undefined){
		fail=()=>{
			uni.showToast({
				title: '操作失败',
				icon: 'none',
				duration: 2500
			});
		}
	}
	uni.request({
		url: hrUrl,
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
			'codeBlockName': codeBlockName,
			'params': params
		},
		success: success,
		fail: fail,
		complete: complete
	});
}

module.exports = hrCodeblockReq;