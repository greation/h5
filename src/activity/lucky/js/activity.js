$(function () {
    //神策==================
    var current_url = location.href;

    //活动规则
    $('#btn-rule').bind('click', function () {
        sa.track('element_click', {
            campaignName: '5月站外广告投放活动',
            lpUrl: current_url,
            elementId: $(this).attr('id'),
            elementContent: '活动规则',
            elementName: '活动规则'
        });
    })
    //开始抽奖
    $('#btn_lucking').bind('click', function () {
        sa.track('element_click', {
            campaignName: '5月站外广告投放活动',
            lpUrl: current_url,
            elementId: $(this).attr('id'),
            elementContent: '开始抽奖',
            elementName: '开始抽奖'
        });
    })
    //立即注册
    $('#checkPhone').bind('click', function () {
        sa.track('element_click', {
            campaignName: '5月站外广告投放活动',
            lpUrl: current_url,
            elementId: $(this).attr('id'),
            elementContent: '立即抽奖',
            elementName: '验证手机号'
        });
    })
    //点击图形验证码
    $('#checkcode_img').bind('click', function () {
        sa.track('element_click', {
            campaignName: '5月站外广告投放活动',
            lpUrl: current_url,
            elementId: $(this).attr('id'),
            elementContent: '点击图形验证码',
            elementName: '刷新图形验证码'
        });
    })
    //获取验证码
    $('#sms_validCode_btn_id').bind('click', function () {
        sa.track('element_click', {
            campaignName: '5月站外广告投放活动',
            lpUrl: current_url,
            elementId: $(this).attr('id'),
            elementContent: '获取验证码',
            elementName: '获取短信验证码'
        });
    })
    //确认抽奖
    $('#register_btn_id').bind('click', function () {
        sa.track('element_click', {
            campaignName: '5月站外广告投放活动',
            lpUrl: current_url,
            elementId: $(this).attr('id'),
            elementContent: '确认抽奖',
            elementName: '确认抽奖'
        });
    })
    //退出
    $('#outsign').bind('click', function () {
        sa.track('element_click', {
            campaignName: '5月站外广告投放活动',
            lpUrl: current_url,
            elementId: $(this).attr('id'),
            elementContent: '退出',
            elementName: '退出'
        });
    })
    //进入个人中心
    $('#link_account').bind('click', function () {
        sa.track('element_click', {
            campaignName: '5月站外广告投放活动',
            lpUrl: current_url,
            elementId: $(this).attr('id'),
            elementContent: '解锁更多好礼',
            elementName: '解锁更多好礼'
        });
    })
    //下载App
    $('#download').bind('click', function () {
        sa.track('element_click', {
            campaignName: '5月站外广告投放活动',
            lpUrl: current_url,
            elementId: $(this).attr('id'),
            elementContent: '下载App',
            elementName: '下载App'
        });
    })
    //立即投资
    $('#link_invest_list').bind('click', function () {
        sa.track('element_click', {
            campaignName: '5月站外广告投放活动',
            lpUrl: current_url,
            elementId: $(this).attr('id'),
            elementContent: '立即投资',
            elementName: '立即投资'
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
var addNumRoll = 0;
var redPackage = [
    [2, 2, 0], //红包
    [2, 2, 0], //笔记本
    [2, 2, 0] //爱奇艺
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
        for (var i = 0; i <3; i++) {
            $('.line').eq(i).css({
                '-webkit-transform': 'translate(0px,' + (-redPackage[severalNum][i] * awardImgHeight ) + 'px)',
                'transform': 'translate(0px,' + (-redPackage[severalNum][i] * awardImgHeight) + 'px)'
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
            activityUrl:'',
            userData: {
                userInfo: {
                    mobile: '13000000000'
                }
            },
            iSfrequently:false
        },
        created: function () {
            var _slef = this;
            this.userData = this.userInfo();
            //判断是否为活动用户
            if (this.userData.isLogin !== 'N') {
                if (this.userData.activityType !== 'MAY_ADVERTDELIVERY_ACTIVITY') {
                    window.location.href = '/src/index/index.html';
                }
            }
            this.isLogin = this.userData.isLogin === 'N' ? false : true;
            this.animateSlow();
            this.activeStatus();
        },
        methods: {
            linkActivity:function(){
                window.location.href=this.activityUrl;
            },
            userInfo: function () {
                var userJson;
                $.ajax({
                    url: Helper.basePath + 'member/getUser.htm?a='+Math.random(),
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
                    var _this = this;
                    if (isAllowGo) {
                        var luckResult = this.luckyPost();
                        if (luckResult.code === '000') {
                            _this.iSfrequently =true;
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
                                _this.rewardName = '恭喜您，获得'+ luckResult.message.substring(10);
                                isAllowGo = true;
                                _this.animateSlow();
                                _this.iSfrequently =false;
                            }, 3300);
                            isAllowGo = false;
                        } else {
                       
                            util.toast(luckResult.message);
                        }
                    }
                }
            }()),
            //当前活动状态
            activeStatus: function () {
                var _this = this;
                var num = 0;
                $.ajax({
                    url: Helper.basePath + 'activityTurntable/activity.htm',
                    type: 'POST',
                    dataType: 'json',
                    async: false,
                    xhrFields: {
                        withCredentials: true
                    },
                    data: {
                        activityTypeStr: 'MAY_ADVERTDELIVERY_ACTIVITY'
                    }
                }).done(function (data) {
                    var data = JSON.parse(data);
                    _this.ruleData = data.rule;
                    _this.message = data.message;
                    _this.activityUrl = data.relationUrl;
                    if (data.activityTitle === "") {
                        document.title = "请后台配置活动名称";
                    } else {
                        document.title = data.activityTitle;
                    }
                    if (data.code !== '000') {
                        util.alert(data.message, function () {
                            window.location.href = '/src/index/index.html';
                        })
                    }
                   
                })

                $.ajax({
                    url: Helper.basePath + '/activityTurntable/getMayRewardName.htm',
                    type: 'POST',
                    dataType: 'json',
                    async: false,
                    xhrFields: {
                        withCredentials: true
                    },
                    data: {
                        activityTypeStr: 'MAY_ADVERTDELIVERY_ACTIVITY'
                    }
                }).done(function (data) {
                    var data = JSON.parse(data);
                    _this.rewardName = data.rewardName;
                })
            },
            luckyPost: function () {
                // var randomNum = ~~(Math.random() * 3); //模拟抽奖数据
                // console.log(randomNum);
                // return {code:'000',prize:2};
                var _this =this;
                if(!_this.iSfrequently){
                    var luckdata;
                    $.ajax({
                        url: Helper.basePath + '/activityTurntable/doMayLottery.htm',
                        type: 'POST',
                        dataType: 'json',
                        async: false,
                        xhrFields: {
                            withCredentials: true
                        },
                        data: {
                            activityTypeStr: 'MAY_ADVERTDELIVERY_ACTIVITY'
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
                }
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
                            window.location.href = '/src/activity/lucky/index.html?random=' + parseInt(Math.random() * 100000);
                        }
                    })
            },
            animateSlow: function () {
                var _this = this;
                clearInterval(this.interval02);
                this.interval01 = setInterval(function () {
                    _this.isTwo = !_this.isTwo;
                }, 760);
            },
            phoneRepalceMask: util.phoneRepalceMask, //手机号处理函数
            animateFast: function () {
                var _this = this;
                clearInterval(this.interval01);
                this.interval02 = setInterval(function () {
                    _this.isTwo = !_this.isTwo;
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
                window.location.href = '/src/activity/lucky/index.html?random=' + parseInt(Math.random() * 100000);
                //$('html,body').removeClass('ovfHiden');
            },
            openXieyi: function () {
                $('.xieyi_box').show();
            },
            getPhoneCode: function () {
				var _this = this;
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
									_this.isPhoneCode = true;
									_this.countTime = '' + _this.countTimeSpan + 's';
									var saveTimeSpan = _this.countTimeSpan;
									var timeFun = function () {
										_this.countTime = '' + (_this.countTimeSpan--) + 's后获取';
										if (_this.countTimeSpan < 0) {
											_this.isPhoneCode = false;
											_this.countTime = '重新获取';
											_this.countTimeSpan = saveTimeSpan;
										} else {
											setTimeout(function () {
												timeFun();
											}, 1000);
										}
									}
									util.toast('验证码已发送');
									timeFun();
								} else {
									_this.refreshPicture();
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
				var _this = this;
				if(util.checkPictureCode(_this.pictureCode)!==true){
					util.toast(util.checkPictureCode(_this.pictureCode));
					return ;
				}
				if(util.checkPhoneCode(_this.phoneCode)!==true){
					util.toast(util.checkPhoneCode(_this.phoneCode));
					return ;
				}
				if(util.checkPsw(_this.inpPsw)!==true){
					util.toast(util.checkPsw(_this.inpPsw));
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
								'activityType': 'MAY_ADVERTDELIVERY_ACTIVITY'
							}
						})
						.done(function (data) {
							if (data.isSuccess) {
								util.toast('可以开始抽奖啦~');
								setTimeout(function () {
									window.location.href = '/src/activity/lucky/index.html?random=' + parseInt(Math.random() * 100000);
								}, 2000)
							} else {
								util.toast(data.message);
								_this.refreshPicture();
							}
						})
                        .fail(function (data) {
                            console.log(data);
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