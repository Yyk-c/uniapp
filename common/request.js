import { baseUrl } from '@/common/baseUrl.js'

const request = (url = '', data = {}, type = 'POST', header = {
	"Content-Type": "application/x-www-form-urlencoded"
}) => {
	return new Promise((resolve, reject) => {
		uni.request({
			method: type,
			url: baseUrl + url,
			data,		
			header,
		}).then(res => {
			resolve(res[1].data)
		}).catch(err => {
			reject(err)
		})
	})
}

export default request
