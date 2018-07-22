var vm = {};
vm.index = function () {
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

	function showExchangeModal() {
		createBg();
		$('.modal-exchange-box').show();
		$('html,body').addClass('ovfHiden');
	}

	function showExchangeRecord() {
		createBg();
		$('.modal-exchange-record').show();
		$('html,body').addClass('ovfHiden');
	}

	function hideGz() {
		$('.modal-rule,.modal-exchange-box,.modal-exchange-record').hide();
		$('.modal-rule .txt-gz').hide();
		$('#modal-bg').remove();
		$('html,body').removeClass('ovfHiden');
	}
	$(function () {
		var current_url = location.href;
		//活动规则 01
		$('#btn-rule').bind('click', function () {
			sa.track('element_click', {
				campaignName: '3月站内迎春活动',
				lpUrl: current_url,
				elementId: $(this).attr('id'),
				elementContent: '活动规则',
				elementName: '活动规则'
			});
		})
		$('#btn-record').bind('click', function () {
			sa.track('element_click', {
				campaignName: '3月站内迎春活动',
				lpUrl: current_url,
				elementId: $(this).attr('id'),
				elementContent: '兑换记录',
				elementName: '兑换记录'
			});
		})
		$('.btn_exchange').bind('click', function () {
			sa.track('element_click', {
				campaignName: '3月站内迎春活动',
				lpUrl: current_url,
				elementId: $(this).attr('id'),
				elementContent: '兑换',
				elementName: '兑换奖品'
			});
		})
		$('#btn-confirm-exchange').bind('click', function () {
			sa.track('element_click', {
				campaignName: '3月站内迎春活动',
				lpUrl: current_url,
				elementId: $(this).attr('id'),
				elementContent: '立即兑换',
				elementName: '确认兑换奖品'
			});
		})
		$('.btn_rule_one').bind('click', function () {
			showGz(0);
		})
		$('.btn-close,.close_exchange_modal').bind('click', function () {
			hideGz();
		})
		$('.btn_exchange_record').bind('click', function () {
			if (!activityVm.isLogin) {
				if (APP_FLAG === 'APP_ANDROID') {
					android.login();
				} else if (APP_FLAG === 'APP_IOS') {
					window.webkit.messageHandlers.login.postMessage('');
				} else {
					window.location.href = '/src/base/login.html?bUrl=/src/activity/march_event/index.html';
				}
				return;
			}
			showExchangeRecord();
			activityVm.getRecord();
		})
	})
	var rewardArr = [{
			rewardName: '宜泉资本5000积分',
			saplingNum: 1,
			rewardType: 'SCORE'
		},
		{
			rewardName: '宜泉资本200元现金红包',
			saplingNum: 2,
			rewardType: 'CASH_VOUCHER'
		},
		{
			rewardName: '腾讯视频会员年卡充值卡(电子卡)',
			saplingNum: 2,
			rewardType: 'TENCENT_MEMBER_RECHARGE_CARD'
		},
		{
			rewardName: '价值500元话费充值卡（电子卡）',
			saplingNum: 6,
			rewardType: 'Bill_RECHARGEABLE_CARD_500'
		},
		{
			rewardName: '价值1000元哟虎商城虎爪充值卡（电子卡）',
			saplingNum: 10,
			rewardType: 'TIGER_CLAW_CARD_1000'
		},
		{
			rewardName: '价值1000元沃尔玛礼品卡(实物卡)',
			saplingNum: 11,
			rewardType: 'WAL_MART_GIFT_CARD_1000'
		},
		{
			rewardName: '价值2000元中石化充值卡(电子卡）',
			saplingNum: 22,
			rewardType: 'SINOPEC_FILLING_CARD_2000'
		},
		{
			rewardName: '价值3000元携程礼品卡(电子卡)',
			saplingNum: 32,
			rewardType: 'CTRIP_GIFT_CARD_3000'
		},
		{
			rewardName: '价值5000元京东E卡(电子卡)',
			saplingNum: 53,
			rewardType: 'JD_5000_ELECTRONIC_CARD'
		}
	]
	//创建vue实例
	activityVm = new Vue({
		el: '#index',
		data: {
			currentItem: 0,
			rewardArr: rewardArr,
			exchangeCount: 1,
			initData: {},
			userInfo: {},
			recordArr: [],
			inSource: util.hrefSplit(window.location.href)
		},
		computed: {
			isLogin: function () {
				return this.userInfo.isLogin === 'Y';
			},
			countSaplingNum: function () {
				var count = this.rewardArr[this.currentItem].saplingNum * this.exchangeCount;
				if (isNaN(count)) {
					this.exchangeCount = 1;
					return this.rewardArr[this.currentItem].saplingNum * this.exchangeCount;
				} else {
					return count;
				}
			}
		},
		created: function () {
			var _self = this;
			this.getInitData();
			this.getRecord();
			$.ajax({
					url: Helper.basePath + 'member/getUser.htm?a='+Math.random(),
					type: 'POST',
					dataType: 'json',
					xhrFields: {
						withCredentials: true
					}
				})
				.done(function (data) {
					var data = JSON.parse(data);
					_self.userInfo = data;
				})
		},
		methods: {
			linkInvestList: function () {
				if (APP_FLAG === 'APP_ANDROID') {
					android.goInvest();
				} else if (APP_FLAG === 'APP_IOS') {
					window.webkit.messageHandlers.goInvest.postMessage('');
				} else {
					window.location.href = '/src/invest/index.html';
				}
			},
			numFilter: function () {
				if (isNaN(this.exchangeCount) && this.exchangeCount !=='') {
					this.exchangeCount = 1;
					return;
				}
			},
			getInitData: function () {
				var _self = this;
				$.ajax({
						url: Helper.basePath + '/marchStation/index.htm',
						type: 'POST',
						dataType: 'json',
						xhrFields: {
							withCredentials: true
						},
						data: {
							activityType: 'MARCH_STATION_ACTIVITY'
						}
					})
					.done(function (data) {
						var data = JSON.parse(data);
						_self.initData = data;
                        if(data.activityTitle===""){
                            document.title = "请后台配置活动名称";
                        }else{
                            document.title = data.activityTitle;
                        }
						if (data.isEnd === 'YES') {
							util.alert('活动已结束或者还未开始！', function () {
								window.location.href = '/src/index/index.html';
							})
						}
					});
			},
			getRecord: function () {
				var _self = this;
				$.ajax({
						url: Helper.basePath + '/marchStation/getRecordList.htm',
						type: 'POST',
						dataType: 'json',
						xhrFields: {
							withCredentials: true
						},
						data: {
							activityType: 'MARCH_STATION_ACTIVITY'
						}
					})
					.done(function (data) {
						var data = JSON.parse(data);
						if (data.code === '000') {
							_self.recordArr = data.recordList;
						}

					})
			},
			countReduce: function () {
				if (this.exchangeCount <= 1) {
					return;
				}
				this.exchangeCount--;
			},
			countAdd: function () {
				this.exchangeCount++;
			},
			openExchangeModal: function (num) {
				if (!this.isLogin) {
					if (APP_FLAG === 'APP_ANDROID') {
						android.login();
					} else if (APP_FLAG === 'APP_IOS') {
						window.webkit.messageHandlers.login.postMessage('');
					} else {
						window.location.href = '/src/base/login.html?bUrl=/src/activity/march_event/index.html';
					}
					return;
				}
				this.currentItem = num;
				this.exchangeCount = 1;
				showExchangeModal();
			},
			exchangeMain: function () {
				var _self = this;
				if (isNaN(this.exchangeCount) || this.exchangeCount < 1) {
					this.exchangeCount = 1;
					util.toast('请输入正确的数量');
					return;
				}
				if (_self.exchangeCount * _self.rewardArr[_self.currentItem].saplingNum > _self.initData.treeCount) {
					util.confirmAct('您的小树苗不够哦，请再接再厉！', '确认', '立即投资', function () {
						if (APP_FLAG === 'APP_ANDROID') {
							android.goInvest();
						} else if (APP_FLAG === 'APP_IOS') {
							window.webkit.messageHandlers.goInvest.postMessage('');
						} else {
							window.location.href = '/src/invest/index.html';
						}
					})
					return;
				}
				$.ajax({
						url: Helper.basePath + '/marchStation/exchange.htm',
						type: 'POST',
						dataType: 'json',
						xhrFields: {
							withCredentials: true
						},
						data: {
							count: _self.exchangeCount,
							activityType: 'MARCH_STATION_ACTIVITY',
							rewardType: _self.rewardArr[_self.currentItem].rewardType,
						}
					})
					.done(function (data) {
						var data = JSON.parse(data);
						if (data.code === '000') {
							util.toast('恭喜您兑换成功');
							_self.getRecord();
							_self.getInitData();
							hideGz();
						}
					})
			}
		}
	})
}