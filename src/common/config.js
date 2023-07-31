const 
	// 成功的状态码
	ERR_OK = 0,
	// 推荐页面常量
	RECOMMEND = {
		// 推荐页面导航栏 后期优化可以调接口 走配置
		TABS: [
			{
			  text: '下饭必备',
			  type: 'custom'
			},
			{
			  text: '京东',
			  type: 'jd'
			},
			// {
			//   text: '拼多多',
			//   type: 'pdd'
			// }
		],
	},
	CONTANTS  = {
		ERR_OK,
		RECOMMEND
	}
export {
	CONTANTS as default,
	ERR_OK,
	RECOMMEND
}