$(function () {
	//神策==================
	var current_url = location.href;
	//活动规则 01
	$('#btn-rule').bind('click', function () {
		sa.track('element_click', {
			campaignName: '12月小米成长体系3',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '活动规则',
			elementName: '活动规则'
		});
	})
	//开始抽奖 02
	$('#btn_lucking').bind('click', function () {
		sa.track('element_click', {
			campaignName: '12月小米成长体系3',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '开始抽奖',
			elementName: '开始抽奖'
		});
	})
	//立即注册 03
	$('#checkPhone').bind('click', function () {
		sa.track('element_click', {
			campaignName: '12月小米成长体系3',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '立即抽奖',
			elementName: '验证手机号'
		});
	})
	//点击图形验证码 04
	$('#checkcode_img').bind('click', function () {
		sa.track('element_click', {
			campaignName: '12月小米成长体系3',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '点击图形验证码',
			elementName: '刷新图形验证码'
		});
	})
	//获取验证码 05
	$('#sms_validCode_btn_id').bind('click', function () {
		sa.track('element_click', {
			campaignName: '12月小米成长体系3',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '获取验证码',
			elementName: '获取短信验证码'
		});
	})
	//确认抽奖 06
	$('#register_btn_id').bind('click', function () {
		sa.track('element_click', {
			campaignName: '12月小米成长体系3',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '确认抽奖',
			elementName: '注册'
		});
	})
	//退出 07
	$('#outsign').bind('click', function () {
		sa.track('element_click', {
			campaignName: '12月小米成长体系3',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '退出',
			elementName: '着陆页面退出'
		});
	})
	//进入个人中心 08
	$('#link_account').bind('click', function () {
		sa.track('element_click', {
			campaignName: '12月小米成长体系3',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '进入个人中心',
			elementName: '个人中心'
		});
	})
	//下载App 09
	$('#download').bind('click', function () {
		sa.track('element_click', {
			campaignName: '12月小米成长体系3',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '下载App',
			elementName: '下载'
		});
	})
	//立即投资 10
	$('#link_invest_list').bind('click', function () {
		sa.track('element_click', {
			campaignName: '12月小米成长体系3',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '立即投资',
			elementName: '投资'
		});
	})
	//关闭错误提示
	$('.error_tip').click(function(){
		$(this).hide();
	})
	//清除表单数据事件
	$('.inp_phone,.inp_pictrue_code,.inp_phone_code,.inp_psw').focus(function(){
		$('.clearData').hide();
		$(this).siblings('.clearData').show();
	})
	$('.changeType').click(function(){
		if($(this).hasClass('eye_open')){
			$(this).removeClass('eye_open');
			$('.inp_psw').prop('type','password');
		}else{
			$(this).addClass('eye_open');
			$('.inp_psw').prop('type','text');
		}
	})
})
	//初始化奖品图片高度
var awardImgHeight = $('.award_show_box').height();
var redPackage = [
	[0, 1, 2], //红包
	[1, 0, 1], //喜点
	[2, 2, 3] //京东卡
];
function rollTransform(severalNum) {
	//初始化抽奖界面
	$('.line').css({
		'transform': 'translate(0px,0px)'
	});
	//添加动画
	$('.line img').css({
		'webkit-filter': 'blur(10px)',
		'filter': 'blur(2px);'
	});
	$('.line').css({
		'-webkit-animation': 'fx-roll 0.5s 0s 6 linear',
		'animation': 'fx-roll 0.5s 0s 6 linear'
	});
	//动画执行完毕参数移动到指定位置
	$('.line').eq(0).get(0).addEventListener('webkitAnimationEnd', function () {
		//去除动画 去掉毛玻璃效果
		$('.line').css({
			'-webkit-animation': '',
			'animation': ''
		});
		$('.line img').css({
			'webkit-filter': '',
			'filter': ''
		});
		for (var i = 0; i < 3; i++) {
			$('.line').eq(i).css({
				'-webkit-transform': 'translate(0px,' + (-redPackage[severalNum][i] * (awardImgHeight + 20)) + 'px)',
				'transform': 'translate(0px,' + (-redPackage[severalNum][i] * (awardImgHeight + 20)) + 'px)'
			});
		}
	})
}
//vue 实例
var vm = {};
vm.index = function () {
	new Vue({
		el: '#index',
		data: {
			isTwo: false,
			angleNum: 0,
			interval01: '',
			interval02: '',
			pictureUrl: Helper.basePath + 'getvcode.htm',
			isXieYi: false,
			isPhoneCode: false,
			countTime: '获取验证码',
			countTimeSpan: 90,
			inpPhone: '',
			inpPsw: '',
			ruleData:'',
			phoneCode: '',
			pictureCode: '',
			rewardName:'',
			checkPhoneYes: false,
			isLogin: false,
			userData: {
				userInfo: {
					mobile: '13000000000'
				}
			}
		},
		created: function () {
			var _slef = this;
			//this.userData = this.userInfo();
			//判断是否为活动用户
			if (this.userData.isLogin !== 'N') {
				if (this.userData.activityType !== 'XIAOMIGROUP_DEC_1') {
					//window.location.href = '/src/index/index.html';
				}
			}
			this.isLogin = this.userData.isLogin === 'N' ? false : false;
			this.animateSlow();
			this.activeStatus();
		},
		methods: {
			userInfo: function () {
				var userJson;
				$.ajax({
					url: Helper.basePath + 'member/getUser.htm',
					type: 'POST',
					dataType: 'json',
					async: false,
					xhrFields: {
						withCredentials: true
					}
				}).done(function (data) {
					userJson = JSON.parse(data);
				})
				return userJson
			},
			drawGo: (function () {
				var isAllowGo = true;
				return function () {
					var _self = this;
					if (isAllowGo) {
						var luckResult = this.luckyPost();
						luckResult ={
							code:'000',
							prize:2
						}
						if (luckResult.code === '000') {
							this.animateFast();
							$('.pint_box').addClass('pint_box_down');
							$('.hand_box').addClass('hand_box_two');
							//动画执行函数
							rollTransform(luckResult.prize);
							setTimeout(function () {
								util.toast(luckResult.message);
								$('.pint_box').removeClass('pint_box_down');
								$('.hand_box').removeClass('hand_box_two');
								//$('.line').css('transform','translateY(0px)');
								isAllowGo = true;
								_self.animateSlow();
							}, 3300);
							isAllowGo = false;
						} else {
							util.toast(luckResult.message);
						}
					}
				}
			}()),
			//当前活动状态&获取奖品名字
			activeStatus: function () {
				var _self = this;
				$.ajax({
					url: Helper.basePath + 'activityTurntable/activity.htm',
					type: 'POST',
					dataType: 'json',
					async: false,
					xhrFields: {
						withCredentials: true
					},
					data: {
						activityTypeStr: 'XIAOMIGROUP_DEC_1'
					}
				}).done(function (data) {
					var data = JSON.parse(data);
					_self.ruleData = data.rule;
					if (data.code !== '000') {
						util.alert(data.message, function () {
							window.location.href = '/src/index/index.html';
						})
					}
				})
				$.ajax({
					url: Helper.basePath + '/activityTurntable/getCommonRewardName.htm',
					type: 'POST',
					dataType: 'json',
					async: false,
					xhrFields: {
						withCredentials: true
					},
					data: {
						activityTypeStr: 'XIAOMIGROUP_DEC_1'
					}
				}).done(function (data) {
					var data = JSON.parse(data);
					_self.rewardName = data.rewardName;
				})
			},
			luckyPost: function () {
				// var randomNum = ~~(Math.random() * 3); //模拟抽奖数据
				// console.log(randomNum);
				// return {
				// 	code: '000',
				// 	prize: randomNum
				// };
				var luckdata;
				$.ajax({
						url: Helper.basePath + 'activityTurntable/doCommonLottery.htm',
						type: 'POST',
						dataType: 'json',
						async: false,
						xhrFields: {
							withCredentials: true
						},
						data: {
							activityTypeStr: 'XIAOMIGROUP_DEC_1'
						}
					})
					.done(function (data) {
						luckdata = JSON.parse(data);
					})
					.fail(function () {
						util.toast('网络异常');
						return;
					})
				return luckdata;
			},
			//退出登录
			linkLogot: function () {
				$.ajax({
						url: Helper.basePath + 'logout.htm',
						type: 'POST',
						dataType: 'json',
						xhrFields: {
							withCredentials: true
						},
						data: {}
					})
					.done(function (data) {
						var data = JSON.parse(data);
						if (data.code === '000') {
							window.location.href = '/src/activity/xiaomi_dec_growth3/index.html?random=' + parseInt(Math.random() * 100000);
						}
					})
			},
			animateSlow: function () {
				var _self = this;
				clearInterval(this.interval02);
				this.interval01 = setInterval(function () {
					_self.isTwo = !_self.isTwo;
				}, 760);
			},
			phoneRepalceMask: util.phoneRepalceMask, //手机号处理函数
			animateFast: function () {
				var _self = this;
				clearInterval(this.interval01);
				this.interval02 = setInterval(function () {
					_self.isTwo = !_self.isTwo;
				}, 60);
			},
			isWxBorrow: function () {
				var ua = navigator.userAgent.toLowerCase();
				if (ua.match(/MicroMessenger/i) == "micromessenger") {
					return true;
				} else {
					return false;
				}
			},
			refreshPicture: function () {
				this.pictureUrl = Helper.basePath + 'getvcode.htm?h=' + Math.random();
			},
			closeRegisBox: function () {
				this.checkPhoneYes = false;
				window.location.href = '/src/activity/xiaomi_dec_growth3/index.html?random=' + parseInt(Math.random() * 100000);
				//$('html,body').removeClass('ovfHiden');
			},
			openXieyi: function () {
				$('.xieyi_box').css('left', '0px');
				$('.close_xieyi').show();
			},
			getPhoneCode: function () {
				var _self = this;
				if (util.checkPhone(this.inpPhone) !== true) {
					util.toast(util.checkPhone(this.inpPhone));
				} else if (util.checkPictureCode(this.pictureCode) !== true) {
					util.toast(util.checkPictureCode(this.pictureCode));
				} else {
					if (!this.isPhoneCode) {
						// 发验证码请求
						$.ajax({
								url: Helper.basePath + 'commonActivity/sendValidSms.htm',
								type: 'POST',
								dataType: 'json',
								xhrFields: {
							withCredentials: true
						},
								data: {
									'mobile': this.inpPhone,
									'checkcode': this.pictureCode,
									'isBack': false
								}
							})
							.done(function (data) {
								if (data.code === '0000') {
									_self.isPhoneCode = true;
									_self.countTime = '' + _self.countTimeSpan + 's';
									var saveTimeSpan = _self.countTimeSpan;
									var timeFun = function () {
										_self.countTime = '' + (_self.countTimeSpan--) + 's后获取';
										if (_self.countTimeSpan < 0) {
											_self.isPhoneCode = false;
											_self.countTime = '重新获取';
											_self.countTimeSpan = saveTimeSpan;
										} else {
											setTimeout(function () {
												timeFun();
											}, 1000);
										}
									}
									util.toast('验证码已发送');
									timeFun();
								} else {
									_self.refreshPicture();
									if (data.code == '00004') {
										util.toast('操作频繁，稍后再试');
									} else {
										util.toast(data.message);
									}
								}
							})
					}
				}
			},
			regisMain: function () {
				var _self = this;
				if(util.checkPictureCode(_self.pictureCode)!==true){
					util.toast(util.checkPictureCode(_self.pictureCode));
					return ;
				}
				if(util.checkPhoneCode(_self.phoneCode)!==true){
					util.toast(util.checkPhoneCode(_self.phoneCode));
					return ;
				}
				if(util.checkPsw(_self.inpPsw)!==true){
					util.toast(util.checkPsw(_self.inpPsw));
					return ;
				}
				if (!this.isXieYi) {
					util.toast('请阅读并同意注册协议');
				} else {
					$.ajax({
							url: Helper.basePath + 'commonActivity/register.htm',
							type: 'POST',
							dataType: 'json',
							xhrFields: {
								withCredentials: true
							},
							data: {
								'mobile': this.inpPhone,
								'password': this.inpPsw,
								'mobilecode': this.phoneCode,
								'checkcode': this.pictureCode,
								'registerSource': 'HTML5',
								'token_id': tokenId,
								'activityType': 'XIAOMIGROUP_DEC_1'
							}
						})
						.done(function (data) {
							if (data.isSuccess) {
								util.toast('可以开始抽奖啦~');
								setTimeout(function () {
									window.location.href = '/src/activity/xiaomi_dec_growth3/index.html?random=' + parseInt(Math.random() * 100000);
								}, 2000)
							} else {
								util.toast(data.message);
								_self.refreshPicture();
							}
						})
				}
			},
			check_phone: function () {
				if (util.checkPhone(this.inpPhone) !== true) {
					$('.error_tip').show().text(util.checkPhone(this.inpPhone))
				} else {
					$('.reg_two').removeClass('hide');
					this.checkPhoneYes = true;
				}
			},
			//清除表单数据
			clearInpData:function(sel){
				this[sel] = '';
			}
		}
	})
}