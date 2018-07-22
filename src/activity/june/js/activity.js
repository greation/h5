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
				campaignName: '6月站内活动',
				lpUrl: current_url,
				elementId: $(this).attr('id'),
				elementContent: '活动规则',
				elementName: '活动规则'
			});
		})
		$('#btn-record').bind('click', function () {
			sa.track('element_click', {
				campaignName: '6月站内活动',
				lpUrl: current_url,
				elementId: $(this).attr('id'),
				elementContent: '兑换记录',
				elementName: '兑换记录'
			});
		})
		$('.btn_exchange').bind('click', function () {
			sa.track('element_click', {
				campaignName: '6月站内活动',
				lpUrl: current_url,
				elementId: $(this).attr('id'),
				elementContent: '兑换',
				elementName: '兑换奖品'
			});
		})
		$('#btn-confirm-exchange').bind('click', function () {
			sa.track('element_click', {
				campaignName: '6月站内活动',
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
					window.location.href = '/src/base/login.html?bUrl=/src/activity/june/index.html';
				}
				return;
			}
			showExchangeRecord();
			activityVm.getRecord();
		})
	})
	var rewardArr = [{
			rewardName: '格瓦拉黄券4张（电子卡）',
			saplingNum: 3,
			rewardType: 'JUNE_REWARD_01'
		},
		{
			rewardName: '价值300元哈根达斯礼品卡（实物卡）',
			saplingNum: 4,
			rewardType: 'JUNE_REWARD_02'
		},
		{
			rewardName: '价值500元玩具反斗城礼品卡（实物卡）',
			saplingNum: 6,
			rewardType: 'JUNE_REWARD_03'
		},
		{
			rewardName: '价值500元网易严选礼品卡（电子卡）',
			saplingNum: 6,
			rewardType: 'JUNE_REWARD_04'
		},
		{
			rewardName: '价值1000元话费充值卡（电子卡）',
			saplingNum: 12,
			rewardType: 'JUNE_REWARD_05'
		},
		{
			rewardName: '价值1000元中石化充值卡 （电子卡）',
			saplingNum: 12,
			rewardType: 'JUNE_REWARD_06'
		},
		{
			rewardName: '价值2000元沃尔玛礼品卡（实物卡）',
			saplingNum: 22,
			rewardType: 'JUNE_REWARD_07'
		},
		{
			rewardName: '价值2000元京东E卡（电子卡）',
			saplingNum: 22,
			rewardType: 'JUNE_REWARD_08'
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
			inSource: util.hrefSplit(window.location.href),
			isFlag1:false,
            isFlag2:false,
            isFlag3:false,
            isFlag4:false,
			isFlag5:false,
			isFlag6:false,
            isFlag7:false,
			isFlag8:false,
			getReward:false
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
			var _this = this;
			this.getInitData();
			this.getRecord();
			$.ajax({
					url: Helper.basePath + 'member/getUser.htm?a='+Math.random(),
					type: 'POST',
					dataType: 'json',
                	async:false,
					xhrFields: {
						withCredentials: true
					}
				})
				.done(function (data) {
					var data = JSON.parse(data);
					_this.userInfo = data;
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
				var _this = this;
				$.ajax({
						url: Helper.basePath + '/juneStation/index.htm',
						type: 'POST',
						dataType: 'json',
						xhrFields: {
							withCredentials: true
						},
						async:false,
						data: {
							activityType: 'JUNE_STATION_ACTIVITY'
						}
					})
					.done(function (data) {
						var data = JSON.parse(data);
						_this.initData = data;
                        if(data.activityTitle===""){
                            document.title = "请后台配置活动名称";
                        }else{
                            document.title = data.activityTitle;
                        }
						if (data.isEnd === 'YES') {
							util.alert(data.activityErrorMsg, function () {
								window.location.href = '/src/index/index.html';
							})
						}
                        if (data.isEnd2 === 'YES') {
                            _this.getReward=true;
                        }else {
                            _this.getReward=false;
						}
						if(data.JUNE_REWARD_01){
                            _this.isFlag1 =true;
						}
                        if(data.JUNE_REWARD_02){
                            _this.isFlag2 =true;
                        }
                        if(data.JUNE_REWARD_03){
                            _this.isFlag3 =true;
                        }
                        if(data.JUNE_REWARD_04){
                            _this.isFlag4 =true;
                        }
                        if(data.JUNE_REWARD_05){
                            _this.isFlag5 =true;
                        }
                        if(data.JUNE_REWARD_06){
                            _this.isFlag6 =true;
                        }
                        if(data.JUNE_REWARD_07){
                            _this.isFlag7 =true;
                        }
                        if(data.JUNE_REWARD_08){
                            _this.isFlag8 =true;
                        }
					});
			},
			getRecord: function () {
				var _this = this;
				$.ajax({
						url: Helper.basePath + '/juneStation/getRecordList.htm',
						type: 'POST',
						dataType: 'json',
						xhrFields: {
							withCredentials: true
						},
						data: {
							activityType: 'JUNE_STATION_ACTIVITY'
						}
					})
					.done(function (data) {
						var data = JSON.parse(data);
						if (data.code === '000') {
							_this.recordArr = data.recordList;
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
                var _this =this;
				if (!_this.isLogin) {
					if (APP_FLAG === 'APP_ANDROID') {
						android.login();
					} else if (APP_FLAG === 'APP_IOS') {
						window.webkit.messageHandlers.login.postMessage('');
					} else {
						window.location.href = '/src/base/login.html?bUrl=/src/activity/june/index.html';
					}
					return;
				}

                if(num=="0"){
					if(!_this.isFlag1){
						return false;
					}
                }
                if(num=="1"){
                    if(!_this.isFlag2){
                        return false;
                    }
                }
                if(num=="2"){
                    if(!_this.isFlag3){
                        return false;
                    }
                }
                if(num=="3"){
                    if(!_this.isFlag4){
                        return false;
                    }
                }
                if(num=="4"){
                    if(!_this.isFlag5){
                        return false;
                    }
                }
                if(num=="5"){
                    if(!_this.isFlag6){
                        return false;
                    }
                }
                if(num=="6"){
                    if(!_this.isFlag7){
                        return false;
                    }
                }
                if(num=="7"){
                    if(!_this.isFlag8){
                        return false;
                    }
                }

				this.currentItem = num;
				this.exchangeCount = 1;
				showExchangeModal();
			},
			exchangeMain: function () {
				var _this = this;
				if (isNaN(this.exchangeCount) || this.exchangeCount < 1) {
					this.exchangeCount = 1;
					util.toast('请输入正确的数量');
					return;
				}
				_this.getInitData();
				if (_this.exchangeCount * _this.rewardArr[_this.currentItem].saplingNum > _this.initData.treeCount) {
                    if(_this.getReward){
                        util.toast('您的小铲子不够哦，请再接再厉！');
                        return;
                    }
					util.confirmAct('您的小铲子不够哦，请再接再厉！', '确认', '立即投资', function () {
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
						url: Helper.basePath + '/juneStation/exchange.htm',
						type: 'POST',
						dataType: 'json',
						xhrFields: {
							withCredentials: true
						},
						data: {
							count: _this.exchangeCount,
							activityType: 'JUNE_STATION_ACTIVITY',
							rewardType: _this.rewardArr[_this.currentItem].rewardType,
						}
					})
					.done(function (data) {
						var data = JSON.parse(data);
						if (data.code === '000') {
							util.toast('恭喜您兑换成功!');
							_this.getRecord();
							_this.getInitData();
							hideGz();
						}else {
                            util.toast(data.message);
						}
					})
			}
		}
	})
}