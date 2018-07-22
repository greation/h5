//约标
var iv = {}
iv.car = function () {
	var vm = new Vue({
		el: "#deal",
		data: {
			data: '',
			items: [],
			deList: [],
			moneyList: [],
			typeB: '',
			typeQ: '',
			typeM: '',
			isShowCz: false,
			login: false,
			userData: '',
			ybData: ''
		},
		created: function () {			
			this.getUser()
			this.ybType();
			this.getType();
		},
		mounted: function () {
			var _this = this;
			this.typeB = _this.items[0].makeTypeIdStr;
			this.typeQ = _this.deList[0].idStr;
			this.typeM = _this.moneyList[0].idStr;
		},
		methods: {
			getUser: function () {
				var _self = this;
				$.ajax({
						url: Helper.basePath + 'member/center.htm',
						type: 'POST',
						dataType: 'json',
						xhrFields: {
							withCredentials: true
						},
						data: {}
					})
					.done(function (data) {
						_self.originalData = JSON.parse(data);
						var data = JSON.parse(data);
						_self.data = data;
						_self.isOpenAssetManage = data.isOpenAssetManage;
						if (data.isLogin === undefined || data.isLogin === 'Y') {
							_self.isOpenAssetManage = data.isOpenAssetManage;
							_self.login = true;
						} else {
							_self.login = false;
						}
					})
					.fail(function () {})
				$.ajax({
						url: Helper.basePath + 'member/getUser.htm',
						type: 'POST',
						dataType: 'json',
						xhrFields: {
							withCredentials: true
						},
						crossDomain: true,
						data: {}
					})
					.done(function (data) {
						var data = JSON.parse(data);
						_self.userData = data;
						if (data.isLogin !== 'N') {
							_self.userInfo = data.userInfo;
							_self.userId = data.account.userId;
							_self.levelName = data.levelName;
							_self.authorizeAsset = data.authorizeAsset;
							_self.isHighNetWorth = data.userInfo.isHighNetWorth;
							_self.isBorrower = data.userInfo.isBorrower;

						}
					})
					.fail(function () {})
			},
			//约标类型
			ybType: function () {
				var _this = this;
				$.ajax({
					type: "post",
					url: Helper.basePath + "borrowInfo/findTypeList.htm",
					async: false,
					dataType: "json",
					xhrFields: {
						withCredentials: true
					},
					data: {
						type: util.hrefSplit(window.location.href).type
					},
					success: function (data) {
						var data = JSON.parse(data);
						_this.data = data;
						_this.items = _this.data.makeBorrowTypeList;
						_this.typeB = _this.items[0].makeTypeIdStr;
					},
					error: function (data) {

					}
				});
			},
			//收益期限
			getType: function () {
				var _this = this;
				$.ajax({
					type: "post",
					url: Helper.basePath + "borrowInfo/findList.htm",
					async: false,
					dataType: "json",
					data: {
						typeId: this.typeB
					},
					xhrFields: {
						withCredentials: true
					},
					success: function (data) {
						var data = JSON.parse(data);
						_this.data = data;
						_this.deList = _this.data.deList;
						_this.moneyList = _this.data.moneyList;
						_this.typeQ = _this.deList[0].idStr;
						_this.typeM = _this.moneyList[0].idStr;
					},
					error: function (data) {

					}
				});
			},
			//计算
			caculate: function () {
				var _this = this;
				$.ajax({
					type: "post",
					url: Helper.basePath + "borrowInfo/calculate.htm",
					async: false,
					dataType: "json",
					data: {
						deId: _this.typeQ,
						moneyId: _this.typeM
					},
					xhrFields: {
						withCredentials: true
					},
					success: function (data) {
						var data = JSON.parse(data);
						_this.data = data;
						if (data.code === '001') {
							util.toast(data.message);

							//							window.location.href="/src/account/charge.html" ;
						}
						util.toast(data.message);
					},
					error: function (data) {
						util.toast(data.message);
					}
				});
			},
			TypeC: function () {
				var _this = this;
				$.ajax({
					type: "post",
					url: Helper.basePath + "borrowInfo/findList.htm",
					async: false,
					dataType: "json",
					xhrFields: {
						withCredentials: true
					},
					data: {
						typeId: _this.typeB
					},
					success: function (data) {
						var data = JSON.parse(data);
						_this.data = data;
						_this.deList = _this.data.deList;
						_this.moneyList = _this.data.moneyList;
						_this.typeQ = _this.deList[0].idStr;
						_this.typeM = _this.moneyList[0].idStr;
					},
					error: function (data) {

					}
				});
			},
			creatYb: function () {

				var _this = this;
				var timetext = $("#timetext").val();
				var remark = $("#remark").val();
				$.ajax({
					type: "post",
					url: Helper.basePath + "borrowInfo/create.htm",
					async: false,
					dataType: "json",
					xhrFields: {
						withCredentials: true
					},
					data: {
						typeId: _this.typeB,
						deId: _this.typeQ,
						moneyId: _this.typeM,
						timetext: timetext,
						remark: remark
					},
					success: function (data) {
						var data = JSON.parse(data);
						_this.ybData = data;
						if (data.code === '002') {
							util.toast('约标成功！');
							util.baseLink('/src/invest/index.html', 1000);
							_this.isShowCz = false
						}
						if (data.code === '001') {
							util.toast(data.message);
							_this.isShowCz = true
						}

					},
					error: function (data) {

					}
				});
			},
			rechargeBtn: function () {
				/*是否登录 */
				if (this.login) {
					if (this.data.isRealName === 'NO') {
						// util.confirm('是否先实名认证!', function () {
						// 	util.baseLink('/src/base/real_name.html', 0);
						// });
						util.confirmAct('您还未实名认证','暂不认证','立即认证', function () {
							util.baseLink('/src/base/real_name.html', 0);
						});
						return false;
					}
					if (this.data.isSetPayPassword === 'NO') {
						// util.toast('设置支付密码，正在跳转');
						var _this = this
						util.confirmAct('您还未设置支付密码','暂不设置','立即设置', function () {
							util.toast('设置支付密码，正在跳转');
              $.ajax({
                  url: Helper.basePath + 'member/modifySinaPwd.htm',
                  type: 'POST',
                  dataType: 'json',
                  xhrFields: {
                    withCredentials: true
                  },
                  data: {
                    'pwdTransType': 'set_pay_password',
                    'retUrl': Helper.webPath + 'src/base/loading.html?type=setPayPsw&uid=' + _this.data.account.userId
                  }
                })
                .done(function (data) {
                  var data = JSON.parse(data);
                  if (data.code === '000') {
                    window.location.href = data.redirectUrl;
                  }
                })
						});
						
						return false;
					}
					if (this.data.isBindCard === 'NO') {
						// util.toast('请先绑定银行卡，正在跳转');
						util.confirmAct('您还未绑定银行卡','暂不设置','立即绑定', function () {
							util.baseLink('/src/account/bind_bank.html', 0);
						});
						// util.baseLink('/src/account/bind_bank.html', 2000);
						return false;
					}
					window.location.href = '/src/account/charge.html';
				} else {
					window.location.href = '/src/invest/deal.html';
				}
			}

		}
	});
}
// 微信浏览器隐藏标题
is_weixn()