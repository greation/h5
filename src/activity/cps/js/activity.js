$(function () {
	//神策==================
	var current_url = location.href;

	//活动规则 01
	$('#btn-rule').bind('click', function () {
		sa.track('element_click', {
			campaignName: 'cps',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '活动规则',
			elementName: '活动规则'
		});
	})
	
	//开始抽奖 02
	$('#register').bind('click', function () {
		sa.track('element_click', {
			campaignName: 'cps',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '点击注册领红包',
			elementName: '点击注册领红包'
		});
	})
	
	//点击图形验证码 03
	$('#checkcode_img').bind('click', function () {
		sa.track('element_click', {
			campaignName: 'cps',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '点击图形验证码',
			elementName: '刷新图形验证码'
		});
	})
	//获取验证码 04
	$('#sms_validCode_btn_id').bind('click', function () {
		sa.track('element_click', {
			campaignName: 'cps',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '获取验证码',
			elementName: '获取短信验证码'
		});
	})
	//确认抽奖 05
	$('#register_btn_id').bind('click', function () {
		sa.track('element_click', {
			campaignName: 'cps',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '立即注册',
			elementName: '立即注册'
		});
	})
	//初始化指定位置
	var PINTH = $('.pint_box').height();
	var PINTW = $('.pint_box').width();
	$('.pint_box').css({
		'transform-origin': PINTW/2+'px '+(PINTW/0.931*0.5684)+'px',
		'-webkit-transform-origin':PINTW/2+'px '+(PINTW/0.931*0.5684)+'px'
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
//vue 实例
var vm = {};
vm.index = function () {
	new Vue({
		el: '#index',
		data: {
			inPsActive:[false,false,false,false],
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
			showClearPsw:false,
		  	showClearPhone:false,
		  	showphoneCode:false,
		  	showpictureCode:false,
		  	errorphone:false,
		  	errorpictureCode:false,
		  	errorphoneCode:false,
		  	errorinpPsw:false
		},
		created: function () {
			var _this = this;
			this.animateSlow();
		},
		methods: {
			goreister:function(){
				var _this=this;
					this.checkPhoneYes = true;
					$(".reg_two").removeClass("hide");
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
			},
			openXieyi: function () {
				$('.xieyi_box').css('left', '0px');
				$('.close_xieyi').show();
			},
			getPhoneCode: function () {
				var _this = this;
				if(this.inpPhone==''){
					util.toast(util.checkPhone(this.inpPhone));
				}else if (util.checkPhone(this.inpPhone) !== true) {
						_this.errorphone = true;					
				} else if (util.checkPictureCode(this.pictureCode) !== true) {
					util.toast(util.checkPictureCode(this.pictureCode));
				} else {
					if (!this.isPhoneCode) {
						// 发验证码请求
						$.ajax({
								url: Helper.basePath + 'sendSmsByType.htm',
								type: 'POST',
								dataType: 'json',
								xhrFields: {
							withCredentials: true
						},
								data: {
									'username': this.inpPhone,
									'checkcode': this.pictureCode,
									'flag':1,
									'smsType':'REGISTER'
								}
							})
							.done(function (data) {
								var data=JSON.parse(data);
								if (data.code === '000') {
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
								}else if(data.code === '1002'){
									util.toast('该手机号已注册');
								}else if(data.code === '1006'){
									_this.errorpictureCode = true;
									_this.refreshPicture();
									
								}else {
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
				var nowurl = window.location.href;
				nowurl=encodeURI(nowurl);
  				var pid=util.getRequest(nowurl,"pid");
  				var userid=util.getRequest(nowurl,"userid");
  				var templet=util.getRequest(nowurl,"templet");
				if(this.inpPhone==''){
					util.toast(util.checkPhone(this.inpPhone));
				}else if (util.checkPhone(this.inpPhone) !== true) {
						_this.errorphone = true;					
				}
				if(util.checkPictureCode(_this.pictureCode)!==true){
					util.toast(util.checkPictureCode(_this.pictureCode));
					return ;
				}
				if(util.checkPhoneCode(_this.phoneCode)!==true){
					util.toast(util.checkPhoneCode(_this.phoneCode));
					return ;
				}
				if(util.checkPsw(_this.inpPsw)!==true){
					if (util.isEmpty(_this.inpPsw)) {
    					util.toast('密码不能为空');
  						}else{
  							_this.errorinpPsw = true;
  						}
					return ;
				}
				if (!this.isXieYi) {
					util.toast('请阅读并同意注册协议');
				} else {
					$.ajax({
							url: Helper.basePath + 'register.htm',
							type: 'POST',
							dataType: 'json',
							xhrFields: {
								withCredentials: true
							},
							data: {
								'username': this.inpPhone,
								'password': this.inpPsw,
								'mobilecode': this.phoneCode,
								'checkcode': this.pictureCode,
								'registerSource': 'HTML5',
								'pid':pid,
	  							'userid':userid,
	  							recommendCode:''
	  							
							}
						})
						.done(function (data) {
							var data=JSON.parse(data);
							if(data.code==='000'){
	  				util.toast('注册成功');
	          		util.baseLink(Helper.webPath+'src/index/index.html',1000);
	  			}else if(data.code==='4001'){
	  				util.toast('手机验证码不能为空');
	  			}else if(data.code==='1002'){
	  				util.toast('该手机号已注册');
	  			}else if(data.code==='1001'){
	  				_this.inpPhone ='';
	  				_this.errorphone = true;
//	  				util.toast('手机号码格式不正确');
	  			}else if(data.code==='1003'){
	  				util.toast('图形验证码不能为空');
	  			}
	  			else if(data.code==='1004'){
	  				util.toast('图形验证码已过期');
	  				_this.refreshPicture();
	  			}
	  			else if(data.code==='1005'){
	  				_this.errorpictureCode = true;
//	  				util.toast('图形验证码错误');
					_this.refreshPicture();
	  			}else if(data.code==='6018'){
	  				_this.errorphoneCode = true;
	  				
//	  				util.toast('短信验证码错误');
	  			}else if(data.code==='6011'){
	  				
	  				util.toast('短信验证码已过期');
	  			}else if(data.code==='2001'){
	  				_this.errorinpPsw ='';
	  				_this.errorinpPsw = true;
//	  				util.toast('密码格式不正确');
	  			}else if(data.code==='9999'){
	  				util.toast('系统异常');
	  			}else if(data.code==='3001'){
	  				util.toast('邀请码不存在');
	  			}else {
								util.toast(data.message);
								_this.refreshPicture();
							}
							
						})
				}
			},
			inpFocus:function(num){
  		this.inPsActive=[false,false,false,false];
  		this.inPsActive[num] = true;
  		this.showClearPhone = false;
  		this.showClearPsw = false;
  		this.showphoneCode = false;
  		this.showpictureCode = false;
  		if(num===0){
  			this.showClearPhone = true;
  		}else if(num===1){
			this.showClearPsw = true;
  		}
  		else if(num===2){
			this.showpictureCode = true;
  		}
  		else if(num===3){
			this.showphoneCode = true;
  		}
  	},
  	hideError:function(num){
  		if(num===0){
  			this.inpPhone = '';
  			this.errorphone = false;
  		}
  		if(num===1){
  			this.errorpictureCode = '';
  			this.errorpictureCode = false;
  		}
  		if(num===2){
  			this.errorphoneCode = '';
  			this.errorphoneCode = false;
  		}
  		if(num===3){
  			this.errorinpPsw = '';
  			this.errorinpPsw = false;
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