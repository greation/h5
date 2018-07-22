$(function () {
	function createBg() {
		$('body').append(
			'<div id="modal-bg" style="position:fixed;width:100%;height:100%;left:0;top:0;background:#000;opacity:0.6;z-index:8"></div>'
		);
	}

	function showGz(num) {
		createBg();
		$('.modal-rule').show();
		$('.modal-rule .txt-gz').eq(num).show();
		$('html,body').addClass('ovfHiden');
	}

	function hideGz() {
		$('.modal-rule').hide();
		$('.modal-rule .txt-gz').hide();
		$('#modal-bg').remove();
		$('html,body').removeClass('ovfHiden');
	}
	$('.btn_rule_one').bind('click', function () {
		showGz(0);
	})
	$('.btn_rule_two').bind('click', function () {
		showGz(1);
	})
	$('.btn_rule_three').bind('click', function () {
		showGz(2);
	})
	$('.btn_rule_four').bind('click', function () {
		showGz(3);
	})
	$('.btn-close').bind('click', function () {
		hideGz();
	})
	$('body').delegate('.invest_tip', 'click', function () {
		$('.tip_img').toggle()
	})
})
var vm = {};
vm.index = function () {
	new Vue({
		el: '#index',
		data: {
			userInfo: {},
			initData: {
				statusOne: ['等待点燃', '立即点燃', '已点燃'],
				statusTwo: ['等待点燃', '立即点燃', '已点燃'],
				statusThree: ['等待点燃', '立即点燃', '已点燃'],
				statusFour: ['等待点燃', '立即点燃', '已点燃'],
				statusIphonex: ['立即抽奖', '立即抽奖', '已抽奖']
			},
			datas: '',
			oneIndex: 0,
			twoIndex: 0,
			threeIndex: 0,
			fourIndex: 0,
			iphonexIndex: 0,
			isLogin: false,
			inSource: util.hrefSplit(window.location.href)

		},
		/*computed: {
			isLogin: function () {
				return this.userInfo.isLogin === 'Y';
			}
		},*/
		created: function () {
			var _self = this;
			var userID = _self.inSource.userId;
			_self.getInitData();
			$.ajax({
					url: Helper.basePath + 'member/getUser.htm',
					type: 'POST',
					dataType: 'json',
					xhrFields: {
						withCredentials: true
					},
					data: {
						'userId': userID
					}
				})
				.done(function (data) {
					var data = JSON.parse(data);
					_self.userInfo = data;
					if (data.isLogin === 'Y' || _self.inSource.userId) {
						_self.isLogin = true;
					}
					console.log(_self.inSource);
				})
		},
		methods: {
			getInitData: function () {
				var _self = this;
				var userID = _self.inSource.userId;
				$.ajax({
						url: Helper.basePath + 'springFestival/loadStatus.htm',
						type: 'POST',
						dataType: 'json',
						xhrFields: {
							withCredentials: true
						},
						data: {
							'userId': userID
						}
					})
					.done(function (data) {
						var data = JSON.parse(data);
						_self.datas = data;
						if (data.code === '000') {
							_self.oneIndex = parseInt(data.LEVELONE_STATUS);
							_self.twoIndex = parseInt(data.LEVELTWO_STATUS);
							_self.threeIndex = parseInt(data.LEVELTHREE_STATUS);
							_self.fourIndex = parseInt(data.LEVELFOUR_STATUS);
							_self.iphonexIndex = parseInt(data.IPHONE_X);
						}
					})
			},
			linkMake: function (type) {
				var _self = this;
				var source = util.hrefSplit(window.location.href).app;
				if (this.isLogin) {
					if (source === 'ANDROID') {
						android.goReserve(type);
					} else if (source === 'IPHONE') {
						window.webkit.messageHandlers.reserveWithType.postMessage(type);
					} else {
						window.location.href = '/src/invest/deal.html?type=' + type
					}
				} else {
					if (source === 'ANDROID') {
						android.login();
					} else if (source === 'IPHONE') {
						window.webkit.messageHandlers.login.postMessage('');
					} else {
						window.location.href = '/src/base/login.html?bUrl=/src/activity/spring_festival/index.html';
					}
				}

			},
			linkInvestList: function () {
				//var source = util.hrefSplit(window.location.href).app;
				if (APP_FLAG === 'APP_ANDROID') {
					android.goInvest();
				} else if (APP_FLAG === 'APP_IOS') {
					window.webkit.messageHandlers.goInvest.postMessage('');
				} else {
					window.location.href = '/src/invest/list.html';
				}
			},
			receivePoint: function (whoIndex, postType) {
				var _self = this;
				var source = util.hrefSplit(window.location.href).app;
				var userID = _self.inSource.userId;
				if (this.isLogin) {
					$.ajax({
							url: Helper.basePath + 'springFestival/lottery.htm',
							type: 'POST',
							dataType: 'json',
							xhrFields: {
								withCredentials: true
							},
							data: {
								'rewardLevelStr': postType,
								'userId': userID

							}
						})
						.done(function (data) {
							var data = JSON.parse(data);
							if (data.result === '3' || data.result === '0') {
								_self[whoIndex] = 2;
							}
							util.toast(data.message);
						})
				} else {
					if (source === 'ANDROID') {
						android.login();
					} else if (source === 'IPHONE') {
						window.webkit.messageHandlers.login.postMessage('');
					} else {
						window.location.href = '/src/base/login.html?bUrl=/src/activity/spring_festival/index.html';
					}
				}
			},
			recivePack: function () {
				var _self = this;
				var source = util.hrefSplit(window.location.href).app;
				var userID = _self.inSource.userId;
				if (this.isLogin) {
					$.ajax({
							url: Helper.basePath + 'springFestival/getAward.htm',
							type: 'POST',
							dataType: 'json',
							xhrFields: {
								withCredentials: true
							},
							data: {
								'userId': userID
							}
						})
						.done(function (data) {
							var data = JSON.parse(data);
							util.toast(data.message);
							if (data.code === '000') {
								if (data.prize !== '-1') {
									setTimeout(function () {
										if (source === 'ANDROID') {
											android.goMyVoucher();
										} else if (source === 'IPHONE') {
											window.webkit.messageHandlers.goMyVoucher.postMessage('');
										} else {
											window.location.href = '/src/account/coupon.html';
										}
									}, 2000)
								}
							}
						})
				} else {
					if (source === 'ANDROID') {
						android.login();
					} else if (source === 'IPHONE') {
						window.webkit.messageHandlers.login.postMessage('');
					} else {
						window.location.href = '/src/base/login.html?bUrl=/src/activity/spring_festival/index.html';
					}
				}
			}
		}
	})
}