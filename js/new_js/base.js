var vms = {}
/*注册*/
vms.regis = function () {
	var re_vm = new Vue({
		el: '#re',
		data: {
			isStep: true,
			inPsActive: [false, false, false, false],
			isOpenEye: true,
			isXieYi: true,
			isPhoneCode: false,
			countTime: '获取验证码',
			countTimeSpan: 90,
			inpPhone: '',
			inpPsw: '',
			phoneCode: '',
			inviteCode: '',
			bannerList: '',
			pictureCode: '',
			pictureUrl: Helper.basePath + 'getvcode.htm',
			passType:'',
			passTypeMap:{}
		},
		created: function () {
			this.passType = util.getPassType();
			this.passTypeMap = passTypeMap;
			var _self = this;
			$.ajax({
					url: Helper.basePath + 'article/getBanner.htm',
					type: 'POST',
					dataType: 'json',
					xhrFields: {
						withCredentials: true
					},
					data: {
						articleTypeCode: 'NATLPM'
					}
				})
				.done(function (data) {
					var data = JSON.parse(data);
					_self.bannerList = data.bannerList;
				})
				.fail(function () {})
		},
		methods: {
			contFilter:function(key){
				util.forceNum.call(this,key);
			},
			regisNext: function () {
				var _self = this;
				var phoneState = util.checkPhone(this.inpPhone);
				var pswState = util.forcePwd.call(_self,'inpPsw',_self.passType);
				var stateArr = [];
				if (phoneState === true && pswState === true && this.isXieYi) {
					$.ajax({
							url: Helper.basePath + 'checkRegistParam.htm',
							type: 'POST',
							dataType: 'json',
							data: {
								'username': this.inpPhone,
								'password': this.inpPsw
							}
						})
						.done(function (data) {
							var data = JSON.parse(data);
							if (data.code === '000') {
								$('.two').removeClass('hide');
								_self.isStep = !_self.isStep;
							} else if (data.code === '1002') {
								util.toast('该手机号码已注册，请立即登录');
							} else if (data.code === '1001') {
								util.toast('请输入正确的手机号');
							} else if (data.code === '2001') {
								util.toast('密码格式不正确');
							}
						})
				} else {
					if (phoneState !== true) {
						stateArr.push(phoneState);
					}
					if (pswState !== true) {
						stateArr.push(pswState);
					}
					if (!this.isXieYi) {
						stateArr.push('请阅读并同意注册协议');
					}
					util.toast(stateArr[0]);
					stateArr = [];
				}
			},
			refreshPicture: function () {
				this.pictureUrl = Helper.basePath + 'getvcode.htm?h=' + Math.random();
			},
			inpFocus: function (num) {
				this.inPsActive = [false, false, false, false, false];
				this.inPsActive[num] = true;
			},
			eyePsw: function () {
				this.isOpenEye = !this.isOpenEye;
			},
			getPhoneCode: function () {
				var _self = this;
				if (!this.isPhoneCode) {
					if (util.checkPictureCode(this.pictureCode) !== true) {
						util.toast(util.checkPictureCode(this.pictureCode))
						return;
					}
					var saveTimeSpan = this.countTimeSpan;
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
					// 发验证码请求
					$.ajax({
							url: Helper.basePath + 'sendSmsByType.htm',
							type: 'POST',
							dataType: 'json',
							data: {
								'username': this.inpPhone,
								'smsType': 'REGISTER',
								'checkcode': _self.pictureCode
							},
							xhrFields:{
								withCredentials:true
							}
						})
						.done(function (data) {
							var data = JSON.parse(data);
							if (data.code === '000') {
								util.toast('验证码已发送');
								timeFun();
								_self.isPhoneCode = true;
							} else if (data.code === '1001') {
								util.toast('手机号码格式不正确');
							} else if (data.code === '1002') {
								util.toast('该手机号已注册');
							} else if (data.code === '2001') {
								util.toast('请求频繁，' + data.time + '秒后重试');
							} else if (data.code === '2002') {
								util.toast('当天短信发送超过10次');
							} else if (data.code === '999') {
								util.toast('未知错误，请联系客服');
							} else if (data.code === '2003') {
								util.toast('发送失败');
							} else if (data.code === '1006') {
								util.toast('图形验证码错误');
							} else if (data.code === '1005') {
								util.toast('图形验证码已过期');
							} else if (data.code === '1004') {
								util.toast('图形验证码不能为空');
							}
						})
				} else {

				}
			},
			regisMain: function () {
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
							'recommendCode': this.inviteCode,
							'mobilecode': this.phoneCode,
							'registerSource': 'HTML5',
							'token_id': tokenId
						}
					})
					.done(function (data) {
						var data = JSON.parse(data);
						if (data.code === '000') {
							util.toast('注册成功');
							// 神策
							$.ajax({
									url: Helper.basePath + 'member/getUser.htm',
									type: 'POST',
									dataType: 'json',
									xhrFields: {
										withCredentials: true
									}
								})
								.done(function (data) {
									var data = JSON.parse(data);
									if (data.isLogin !== 'N') {
										sa.login(data.userInfo.id);
										util.baseLink(Helper.webPath + 'src/base/real_name.html', 2000);
									}
								})
								.fail(function () {})
						} else if (data.code === '1001') {
							util.toast('手机号码格式不正确');
						} else if (data.code === '6018') {
							util.toast('短信验证码错误');
						} else if (data.code === '6011') {
							util.toast('短信验证码已过期');
						} else if (data.code === '1002') {
							util.toast('该手机号已注册');
						} else if (data.code === '2001') {
							util.toast('密码格式不正确');
						} else if (data.code === '3001') {
							util.toast('邀请码不存在');
						} else if (data.code === '4001') {
							util.toast('手机验证码不能为空');
						} else if (data.code === '5001') {
							util.toast('您的网络ip地址存在异常，请更换ip后重试或致电客服咨询。');
						} else if (data.code === '9999') {
							util.toast('系统异常');
						} else if (data.code === '7008') {
							util.alert('您的账户当前存在投资风险，平台为了营造安全的投资环境，暂时限制您的操作，建议您咨询客服。');
						}

					})
			}
		}
	})
}
//分享注册
vms.shareRegister = function () {
	var re_vm = new Vue({
		el: '#re',
		data: {
			inPsActive: [false, false, false, false],
			isOpenEye: true,
			isXieYi: false,
			isPhoneCode: false,
			countTime: '获取验证码',
			countTimeSpan: 90,
			inpPhone: '',
			inpPsw: '',
			phoneCode: '',
			pictureCode: '',
			inviteCode: util.hrefSplit(window.location.href).un,
			pictureUrl: Helper.basePath + 'getvcode.htm',
			passType:'',
			passTypeMap:{}
		},
		created: function () {
			this.passType = util.getPassType();
			this.passTypeMap = passTypeMap;
			//this.getPicture();
		},
		methods: {
			contFilter:function(key){
				util.forceNum.call(this,key);
			},
			inpFocus: function (num) {
				this.inPsActive = [false, false, false, false];
				this.inPsActive[num] = true;
			},
			eyePsw: function () {
				this.isOpenEye = !this.isOpenEye;
			},
			refreshPicture: function () {
				this.pictureUrl = Helper.basePath + 'getvcode.htm?h=' + Math.random();
			},
			getPhoneCode: function () {
				var _self = this;
				if (util.checkPhone(this.inpPhone) !== true) {
					util.toast(util.checkPhone(this.inpPhone));
				} else if (util.checkPsw(this.inpPsw) !== true) {
					util.toast(util.checkPsw(this.inpPsw));
				} else if (util.checkPictureCode(this.pictureCode) !== true) {
					util.toast(util.checkPictureCode(this.pictureCode));
				} else {
					if (!this.isPhoneCode) {
						// 发验证码请求
						$.ajax({
								url: Helper.basePath + 'sendSmsByType.htm',
								type: 'POST',
								dataType: 'json',
								data: {
									'username': this.inpPhone,
									'smsType': 'REGISTER',
									checkcode: _self.pictureCode
								}
							})
							.done(function (data) {
								var data = JSON.parse(data);
								if (data.code === '000') {
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
								} else if (data.code === '1001') {
									util.toast('手机号码格式不正确');
								} else if (data.code === '1002') {
									util.toast('该手机号已注册');
								} else if (data.code === '2001') {
									util.toast('请求频繁，' + data.time + '秒后重试');
								} else if (data.code === '2002') {
									util.toast('当天短信发送超过10次');
								} else if (data.code === '999') {
									util.toast('未知错误，请联系客服');
								} else if (data.code === '2003') {
									util.toast('发送失败');
								} else if (data.code === '1006') {
									util.toast('图形验证码错误');
								} else if (data.code === '1005') {
									util.toast('图形验证码已过期');
								} else if (data.code === '1004') {
									util.toast('图形验证码不能为空');
								}
							})
					}
				}
			},
			regisMain: function () {
				var _self = this;
				var pswState = util.forcePwd.call(_self,'inpPsw',_self.passType);
				if (util.checkPhone(_self.inpPhone) !== true) {
					util.toast(util.checkPhone(_self.inpPhone));
					return;
				}
				if(pswState!==true){
					util.toast(pswState);
					return ;
				}
				// if (util.checkPsw(_self.inpPsw) !== true) {
				// 	util.toast(util.checkPsw(_self.inpPsw));
				// 	return;
				// }
				if (util.checkPictureCode(_self.pictureCode) !== true) {
					util.toast(util.checkPictureCode(_self.pictureCode));
					return;
				}
				if (util.checkPhoneCode(_self.phoneCode) !== true) {
					util.toast(util.checkPhoneCode(_self.phoneCode));
					return;
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
								'recommendCode': this.inviteCode,
								'mobilecode': this.phoneCode,
								'registerSource': 'HTML5',
								'token_id': tokenId
							}
						})
						.done(function (data) {
							var data = JSON.parse(data);
							if (data.code === '000') {
								util.toast('注册成功');
								util.baseLink(Helper.webPath + 'src/base/real_name.html', 2000);
							} else if (data.code === '1001') {
								util.toast('手机号码格式不正确');
							} else if (data.code === '6018') {
								util.toast('短信验证码错误');
							} else if (data.code === '6011') {
								util.toast('短信验证码已过期');
							} else if (data.code === '1002') {
								util.toast('该手机号已注册');
							} else if (data.code === '2001') {
								util.toast('密码格式不正确');
							} else if (data.code === '3001') {
								util.toast('邀请码不存在');
							} else if (data.code === '4001') {
								util.toast('手机验证码不能为空');
							} else if (data.code === '9999') {
								util.toast('系统异常');
							} else if (data.code === '7008') {
								util.alert('您的账户当前存在投资风险，平台为了营造安全的投资环境，暂时限制您的操作，建议您咨询客服。');
							}
						})
				}
			}
		}
	})
}
//登录逻辑
vms.login = function () {
	var lo_vm = new Vue({
		el: '#lo',
		data: {
			inpPhone: '',
			inpPsw: '',
			pictureCode:'',
			pictureValue:'',
			inPsActive: [false, false],
			isOpenEye: true,
			showClearPsw: false,
			showClearPhone: false
		},
		created: function () {
			this.newPicImg();
		},
		methods: {
			loginMain: function () {
				var _self = this;
				var phoneState = util.checkPhone(this.inpPhone);
				var pswState = util.checkPsw_login(this.inpPsw); 
				var codeState = _self.pictureValue.toUpperCase() === _self.pictureCode;
				var stateArr = [];
				if (phoneState !== true) {
					stateArr.push(phoneState);
				}
				if (pswState !== true) {
					stateArr.push(pswState);
				}
				if(codeState!==true){
					stateArr.push('图形码不正确');
                    this.newPicImg();
				}
				if (phoneState === true && pswState === true && codeState===true) {
					$.ajax({
							url: Helper.basePath + 'login.htm',
							type: 'POST',
							dataType: 'json',
							xhrFields: {
								withCredentials: true
							},
							data: {
								'username': this.inpPhone,
								'password': this.inpPsw,
								'token_id': tokenId
							}
						})
						.done(function (data) {
							var data = JSON.parse(data);
							if (data.code === '000') {
								util.toast('登录成功');
								$.ajax({
										url: Helper.basePath + 'member/getUser.htm',
										type: 'POST',
										dataType: 'json',
										xhrFields: {
											withCredentials: true
										}
									})
									.done(function (data) {
										var data = JSON.parse(data);
										if (data.isLogin !== 'N') {
											sa.login(data.userInfo.id);
											util.loginLink(1000, data.account.userId, data.account.userName);
										}
									})
									.fail(function () {})
							} else if (data.code === '6008') {
								util.toast('密码错误');
							} else if (data.code === '2001') {
								util.toast('密码不能为空');
							} else if (data.code === '2002') {
								util.toast('密码格式不正确');
							} else if (data.code === '1002') {
								util.toast('手机号不存在');
							} else if (data.code === '1001') {
								util.toast('手机号码格式错误');
							} else if (data.code === '6001') {
								util.toast('您的手机号还未注册！');
							} else if (data.code === '999') {
								util.toast('系统异常');
							} else if (data.code === '7008') {
								util.alert('您的账户当前存在投资风险，平台为了营造安全的投资环境，暂时限制您的操作，建议您咨询客服');
							}
						})
				} else {
					util.toast(stateArr[0]);
					stateArr = [];
				}
			},
			/*回车事件*/
            enterKey:function(ev){
                if(ev.keyCode == 13){
                    this.loginMain();
                }
            },
            contFilter:function(key){
				util.forceNum.call(this,key);
			},
			inpFocus: function (num) {
				this.inPsActive = [false, false];
				this.inPsActive[num] = true;
				this.showClearPhone = false;
				this.showClearPsw = false;
				if (num === 0) {
					if (this.inpPhone.length > 0) {
						this.showClearPhone = true;
					} else {
						this.showClearPhone = false;
					}
				} else if (num === 1) {
					if (this.inpPsw.length > 0) {
						this.showClearPsw = true;
					} else {
						this.showClearPsw = false;
					}
				}
			},
			refreshPicture:function(){
				this.newPicImg();
			},
			clearText: function (num) {
				if (num === 0) {
					this.inpPhone = '';
					this.showClearPhone = false;
				} else if (num === 1) {
					this.inpPsw = '';
					this.showClearPsw = false;
				}
			},
			eyePsw: function () {
				this.isOpenEye = !this.isOpenEye;
			},
			newPicImg:function(){
				var code ; //在全局 定义验证码  
				code = new Array();  
				var codeLength = 4;//验证码的长度  
				var selectChar = new Array(2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z');  
				for(var i=0;i<codeLength;i++) {  
					var charIndex = Math.floor(Math.random()*32);
					code +=selectChar[charIndex];  
				}
				this.pictureCode = code;
			},
			keyUpInp: function (num,key) {
				if (num === 0) {
					util.forceNum.call(this,key);
					if (this.inpPhone.length > 0) {
						this.showClearPhone = true;
					} else {
						this.showClearPhone = false;
					}
				} else if (num === 1) {
					if (this.inpPsw.length > 0) {
						this.showClearPsw = true;
					} else {
						this.showClearPsw = false;
					}
				}

			}
		},
	})
}

//授权带呢了古
vms.ekeyfundLogin = function () {
	var lo_vm = new Vue({
		el: '#lo',
		data: {
			inpPhone: '',
			inpPsw: '',
			inPsActive: [false, false],
			isOpenEye: true,
			showClearPsw: false,
			showClearPhone: false
		},
		created: function () {

		},
		methods: {
			loginMain: function () {
				var _self = this;
				var phoneState = util.checkPhone(this.inpPhone);
				var pswState = util.checkPsw(this.inpPsw);
				var stateArr = [];
				if (phoneState !== true) {
					stateArr.push(phoneState);
				}
				if (pswState !== true) {
					stateArr.push(pswState);
				}
				if (phoneState === true && pswState === true) {
					$.ajax({
							url: Helper.basePath + 'login.htm',
							type: 'POST',
							dataType: 'json',
							xhrFields: {
								withCredentials: true
							},
							data: {
								'username': this.inpPhone,
								'password': this.inpPsw,
								'token_id': tokenId
							}
						})
						.done(function (data) {
							var data = JSON.parse(data);
							if (data.code === '000') {
								util.toast('登录成功');
								$.ajax({
										url: Helper.basePath + 'member/getUser.htm',
										type: 'POST',
										dataType: 'json',
										xhrFields: {
											withCredentials: true
										}
									})
									.done(function (data) {
										var data = JSON.parse(data);
										if (data.isLogin !== 'N') {
											var token = {
												"userId": data.userInfo.id,
												"mobile": data.userInfo.mobile,
												"state": util.hrefSplit(window.location.href).state
											};
											token = JSON.stringify(token);
											if (!window.yohuApi) {
												return alert('window.yohuApi未定义');
											}
											if (!window.yohuApi.YQLoginSuccess) {
												return alert('window.yohuApi.YQLoginSuccess未定义');
											}
											var u = navigator.userAgent, app = navigator.appVersion;
											var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
											var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
											if(isAndroid==true){
												window.yohuApi.YQLoginSuccess(token);
											}else if(isiOS==true){
												_self.connectWebViewJavascriptBridge(function(bridge){
														bridge.callHandler('YQLoginSuccess', token, function(response) {
																// console.log('JS got response', response)
														})
												});
											}
										}
									})
									.fail(function () {})
							} else if (data.code === '6008') {
								util.toast('密码错误');
							} else if (data.code === '2001') {
								util.toast('密码不能为空');
							} else if (data.code === '2002') {
								util.toast('密码格式不正确');
							} else if (data.code === '1002') {
								util.toast('手机号不存在');
							} else if (data.code === '1001') {
								util.toast('手机号码格式错误');
							} else if (data.code === '6001') {
								util.toast('您的手机号还未注册！');
							} else if (data.code === '999') {
								util.toast('系统异常');
							} else if (data.code === '7008') {
								util.alert('您的账户当前存在投资风险，平台为了营造安全的投资环境，暂时限制您的操作，建议您咨询客服');
							}
						})
				} else {
					util.toast(stateArr[0]);
					stateArr = [];
				}
			},
			connectWebViewJavascriptBridge:function(callback) {
					if (window.WebViewJavascriptBridge) {
							callback(WebViewJavascriptBridge)
					} else {
							document.addEventListener('WebViewJavascriptBridgeReady', function() {
									callback(WebViewJavascriptBridge)
							}, false)
					}
			},
			inpFocus: function (num) {
				this.inPsActive = [false, false];
				this.inPsActive[num] = true;
				this.showClearPhone = false;
				this.showClearPsw = false;
				if (num === 0) {
					if (this.inpPhone.length > 0) {
						this.showClearPhone = true;
					} else {
						this.showClearPhone = false;
					}
				} else if (num === 1) {
					if (this.inpPsw.length > 0) {
						this.showClearPsw = true;
					} else {
						this.showClearPsw = false;
					}
				}
			},
			clearText: function (num) {
				if (num === 0) {
					this.inpPhone = '';
					this.showClearPhone = false;
				} else if (num === 1) {
					this.inpPsw = '';
					this.showClearPsw = false;
				}
			},
			eyePsw: function () {
				this.isOpenEye = !this.isOpenEye;
			},
			keyUpInp: function (num) {
				if (num === 0) {
					if (this.inpPhone.length > 0) {
						this.showClearPhone = true;
					} else {
						this.showClearPhone = false;
					}
				} else if (num === 1) {
					if (this.inpPsw.length > 0) {
						this.showClearPsw = true;
					} else {
						this.showClearPsw = false;
					}
				}

			}
		}
	})
}

vms.findPsw = function () {
	new Vue({
		el: '#fp',
		data: {
			isStep: true,
			inPsActive: [false, false, false, false],
			isPhoneCode: false,
			countTime: '获取验证码',
			countTimeSpan: 90,
			inpPhone: '',
			inpPsw01: '',
			inpPsw02: '',
			phoneCode: '',
			pictureCode: '',
			pictureUrl: Helper.basePath + 'getvcode.htm',
			passType:'',
			passTypeMap:{}
		},
		created:function(){
			this.passType = util.getPassType();
			this.passTypeMap = passTypeMap;
		},
		methods: {
			inpFocus: function (num) {
				this.inPsActive = [false, false, false, false];
				this.inPsActive[num] = true;
			},
			contFilter:function(key){
				util.forceNum.call(this,key);
			},
			refreshPicture: function () {
				this.pictureUrl = Helper.basePath + 'getvcode.htm?h=' + Math.random();
			},
			getPhoneCode: function () {
				var _self = this;
				if (util.checkPictureCode(this.pictureCode) !== true) {
					util.toast(util.checkPictureCode(this.pictureCode));
					return;
				}
				if (util.checkPhone(this.inpPhone) !== true) {
					util.toast(util.checkPhone(this.inpPhone));
					return;
				}
				if (!this.isPhoneCode) {
					$.ajax({
							url: Helper.basePath + 'sendSmsByType.htm',
							type: 'POST',
							dataType: 'json',
							xhrFields: {
								withCredentials: true
							},
							data: {
								'username': this.inpPhone,
								'smsType': 'FOUNDLOGINPWD',
								'checkcode': _self.pictureCode
							}
						})
						.done(function (data) {
							var data = JSON.parse(data);
							if (data.code === '000') {
								util.toast('验证码已发送');
								_self.isPhoneCode = !_self.isPhoneCode;
								_self.countTime = '' + _self.countTimeSpan + 's';
								var saveTimeSpan = _self.countTimeSpan;
								var timeFun = function () {
									_self.countTime = '' + (_self.countTimeSpan--) + 's后获取';
									if (_self.countTimeSpan < 0) {
										_self.isPhoneCode = !_self.isPhoneCode;
										_self.countTime = '重新获取';
										_self.countTimeSpan = saveTimeSpan;
									} else {
										setTimeout(function () {
											timeFun();
										}, 1000);
									}
								}
								timeFun();
							} else if (data.code === '1003') {
								util.toast('用户未注册');
							} else if (data.code === '1001') {
								util.toast('用户名不合法');
							} else if (data.code === '2003') {
								util.toast('发送失败');
							} else if (data.code === '2001') {
								util.toast('请求频繁，' + data.time + '秒后重试');
							} else if (data.code === '2002') {
								util.toast('当天短信发送超过10次');
							} else if (data.code === '999') {
								util.toast('未知错误，请联系客服');
							} else if (data.code === '1006') {
								util.toast('图形验证码错误');
							} else if (data.code === '1005') {
								util.toast('图形验证码已过期');
							} else if (data.code === '1004') {
								util.toast('图形验证码不能为空');
							}
						})
				} else {

				}
			},
			nextStep: function () {
				var _self = this;
				$.ajax({
						url: Helper.basePath + 'checkMobileCode.htm',
						type: 'POST',
						dataType: 'json',
						xhrFields: {
							withCredentials: true
						},
						data: {
							'mobile': this.inpPhone,
							'mobileCode': this.phoneCode
						}
					})
					.done(function (data) {
						var data = JSON.parse(data);
						if (data.code === '000') {
							_self.isStep = !_self.isStep;
						} else {
							util.toast('验证码有误');
						}
					})
			},
			findPswMain: function () {
				var _self = this;
				var pswState = util.forcePwd.call(_self,'inpPsw01',_self.passType);
				if(pswState!==true){
					util.toast(pswState);
					return ;
				}
				if (this.inpPsw01 !== this.inpPsw02) {
					util.toast('两次密码输入不一致');
				} else {
					$.ajax({
							url: Helper.basePath + 'getBackPassword.htm',
							type: 'POST',
							dataType: 'json',
							xhrFields: {
								withCredentials: true
							},
							data: {
								'mobile': this.inpPhone,
								'mobileCode': this.phoneCode,
								password: this.inpPsw01
							}
						})
						.done(function (data) {
							var data = JSON.parse(data);
							if (data.code === '000') {
								util.toast('密码修改成功,正在跳转登录');
								setTimeout(function () {
									window.location.href = "/src/base/login.html";
								}, 1000);
							} else {
								util.toast('密码修改失败');
							}
						})
				}
			}
		}
	})
}

vms.realName = function () {
	new Vue({
		el: '#rn',
		data: {
			inpName: '',
			inpId: '',
			data: '',
			bannerList: ''
		},
		created: function () {
			var _self = this;
			$.ajax({
					url: Helper.basePath + 'article/getBanner.htm',
					type: 'POST',
					dataType: 'json',
					xhrFields: {
						withCredentials: true
					},
					data: {
						articleTypeCode: 'ESLUYB'
					}
				})
				.done(function (data) {
					var data = JSON.parse(data);
					_self.data = data;
					if (data.isLogin === 'N') {
						window.location.href = Helper.webPath + 'src/base/login.html';
					} else {
						_self.bannerList = data.bannerList;
					}
				})
				.fail(function () {})
		},
		methods: {
			realNameMain: function () {
				var _self = this;
				var val = String(this.inpId);
				if(!peopleIdReg.test(val)){
					util.toast('身份证格式不正确'); 
					return ;
				}
				if (util.isEmpty(this.inpName) || util.isEmpty(this.inpId)) {
					util.toast('请填写完整信息');
				} else {
					$.ajax({
							url: Helper.basePath + 'member/sinaOpenRequest.htm',
							type: 'POST',
							dataType: 'json',
							xhrFields: {
								withCredentials: true
							},
							data: {
								'realName': this.inpName,
								'cardNumber': this.inpId
							}
						})
						.done(function (data) {
							var data = JSON.parse(data);
							if (data.code === '000' || data.code === 'APPLY_SUCCESS') {
								util.toast('实名认证成功');
								util.baseLink('/src/account/index.html', 1000);
								/*$.ajax({
									url: Helper.basePath+'member/modifySinaPwd.htm?type=setPayPsw&uid='+_self.data.userInfo.id,
									type: 'POST',
									dataType: 'json',
									xhrFields: {
										withCredentials: true
									},
									data: {
										'pwdTransType':'set_pay_password',
										'retUrl':Helper.webPath+'src/base/loading.html'
									}
								})
								.done(function(data){
									var data = JSON.parse(data);
									if(data.code==='000'){
										window.location.href=data.redirectUrl;
									}
								})*/
							} else if (data.code === '5555') {
								util.toast('身份证已被使用');
							} else if (data.code === '4444') {
								util.toast('该账户已实名');
								util.baseLink('/src/account/index.html', 2000);
							} else if (data.code === '1111') {
								util.toast('未满18周岁不能进行实名认证！');
							} else if (data.code === 'DUPLICATE_VERIFY') {
								util.toast('身份证已被使用');
							} else {
								util.toast(data.message);
							}
						})
				}

			}
		}
	})
}

//授权登录
vms.authorize =function(){
	new Vue({
		el: '#sqlogin',
		data: {
			yqUserId:"",
			mobile:"",
			userName:"",
			type:"",
			department:"",
			riskAssessmentResult:"",
            registerFrom:"HTML5",
			status:"",
			realName:"",
			cardNumber:"",
			birthday:"",
			constellation:"",
			password:"",
			pwdAttach:"",
			personSex:"",
			userId:"",
			yqRegisteTime:""
		},
		created: function () {
			var _this=this;
			$.ajax({
					url: Helper.basePath + 'member/getUser.htm',
					type: 'POST',
					dataType: 'json',
					xhrFields: {withCredentials: true}
			}).done(function (data) {
				var data = JSON.parse(data);
				_this.yqUserId=data.userInfo.id;
				_this.mobile=data.userInfo.mobile;
				_this.userName=data.userInfo.userName;
				_this.type=data.userInfo.type;
				_this.department=data.userInfo.department;
				_this.riskAssessmentResult=data.levelName;
                _this.registerFrom='HTML5';
				_this.status=data.userInfo.status;
				_this.realName=data.userInfo.realName;
				_this.cardNumber=data.userInfo.cardNumber;
				_this.birthday=data.userInfo.birthday;
				_this.constellation=data.userInfo.constellation;
				_this.password=data.userInfo.password;
				_this.pwdAttach=data.userInfo.pwdAttach;
				_this.personSex=data.userInfo.personSex;
				_this.yqRegisteTime=data.userInfo.registerTime;
				_this.userId=data.account.userId;
			}).fail(function () {})
		},
		methods: {
			sqLogin: function(){
				var _this=this;
				$.ajax({
					url:Helper.assetPath + 'login/authorize.htm',
					type: 'POST',
					dataType: 'json',
					xhrFields: {
						withCredentials: true
					},
					data: {
						yqUserId: this.yqUserId,
						mobile:this.mobile,
						userName:this.userName,
						type:this.type,
						department:this.department,
						riskAssessmentResult:this.riskAssessmentResult, 
						registerFrom:this.registerFrom,
						status:this.status,
						realName:this.realName,
						cardNumber:this.cardNumber,
						birthday:this.birthday,
						constellation:this.constellation,
						password:this.password,
						pwdAttach:this.pwdAttach,
						personSex:this.personSex,
						yqRegisteTime:this.yqRegisteTime
					}
				})
				.done(function (data) {
					var data = JSON.parse(data);
					_this.data = data;
					if(data.code==='001'){
						//更新状态
						$.ajax({
							type:"post",
							url: Helper.basePath + "member/updateAuthorizeAsset.htm",
							async:false,
							dataType: 'json',
							xhrFields: {
								withCredentials: true
							}
						})
						.done(function(data){
							var data = JSON.parse(data);
							_this.data = data;
							if(data.code==='000'){
								//跳到资管平台页面
		//						util.baseLink(Helper.webPath + '', 2000);
								util.baseLink(Helper.assetPath + 'ekeyfund/index.html?isFirst=1&userId='+ _this.userId,2000);
							}else{
								util.toast("更新状态失败");return false;
							}
						})
					}
					if(data.code==='002'){
						util.toast('授权登录失败');
						
						util.baseLink(Helper.webPath + '/src/account/index.html', 2000);
					}
				})
				.fail(function () {})
			}
		}
		
	})
}


















