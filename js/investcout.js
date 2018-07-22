var vms = {};
vms.investing = function () {
	new Vue({
		el: "#investh",
		data: {
			money: '',
			isXieYi: false,
			yuqiGet: '',
			integralGet: '',
			incMoney: '',
			userInfo: '',
			raiseMoney: '',
			remayMoney: '',
			minInvest: '',
			maxInvest: '',
			durType: '',
			borrowDuration: '',
			baseMoney: '',
			borrowId: util.hrefSplit(window.location.href).borrowId,
			borrowType: '',
			voucherId: util.hrefSplit(window.location.href).voucherId,
			borrowName:'',
			source:util.hrefSplit(window.location.href).source,
            voucherMoney:'',
            levelName:'',
            freezeMoney:'',
            ybdata:util.hrefSplit(window.location.href).ybdata
		},
		mounted: function () {
			var _this = this;
			var nowurl = window.location.href;
			nowurl = encodeURI(nowurl);
			var cardMo = util.getRequest(nowurl, "cardMo");
			this.integralCout();
		},
		created: function () {
			var _this = this;
			this.getData();
			var isSelectCoupon = util.getRequest(window.location.href, "voucherId");
			var nowurl = window.location.href;
			nowurl = encodeURI(nowurl);
			var cardMo = util.getRequest(nowurl, "cardMo");
			var investMoney = util.getRequest(nowurl, "investMoney");
            _this.getcardData();
            $.ajax({
                url: Helper.basePath + 'member/getUser.htm',
                type: 'POST',
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                }
            }).done(function (data) {
                var data = JSON.parse(data);
                _this.userInfo = data.userInfo;
                _this.levelName =data.levelName;
                _this.baseMoney =data.account.baseMoney;
                _this.freezeMoney=data.account.freezeMoney;
            })
			if(_this.source === 'coupon'){
				$.ajax({
					url: Helper.basePath + '/member/getCardById.htm',
					type: 'POST',
					dataType: 'json',
					xhrFields: {
						withCredentials: true
					},
					async:false,
					data:{
						voucherId:isSelectCoupon
					}
				}).done(function (data) {
					var data = JSON.parse(data);
					var rewardType = data.voucherList[0].rewardType;
					var rewardVal = data.voucherList[0].val;
                    _this.voucherMoney = data.voucherList[0].voucherMoney;
					this.voucherMoney = data.voucherList[0].voucherMoney;
                    if(_this.ybdata!='ekeyfundData'){
                        _this.money = parseInt(data.voucherList[0].minInvest);
                    }else {
                        _this.money=_this.minInvest;
					}
					if (rewardType === 'CASH_VOUCHER') {
						rewardVal = rewardVal / 100 + '元 现金券';
					} else if (rewardType === 'RATE_VOUCHER') {
						rewardVal = rewardVal * 100 + '% 加息券';
					} 
					$("#voucherId").text(rewardVal);
				})
                $.ajax({
                    type: "post",
                    url: Helper.basePath + "borrowInfo/incomeMoney.htm",
                    async: false,
                    dataType: "json",
                    xhrFields: {
                        withCredentials: true
                    },
                    data: {
                        money: _this.money,
                        borrowId: _this.borrowId,
                        voucherId: _this.voucherId
                    },
                    success: function (data) {
                        //var yuqiGet1=(parseFloat(data)-_this.money);
                        //截取两位小数
                        //var yuqiGet1=parseInt(yuqiGet1*Math.pow(10,2)+0,10)/Math.pow(10,2);
                        $("#yuqiGet").html(data + '元');
                        _this.integralCout();
                    }

                });
				return ;
			}

			if (!isSelectCoupon) {
				this.money = this.minInvest;
			} else {
				this.money = parseFloat(investMoney);
				if (cardMo.indexOf("%") > -1) {
					$("#voucherId").text(cardMo + " 加息券");
				} else {
					cardMo = parseFloat(cardMo);
					$("#voucherId").text(cardMo + " 元现金券");
				}
				$("#voucherId").attr("data-id", voucherId);
			}
			_this.cout();

		},
		methods: {
			integralCout: function () {
				var _this = this;
				if (_this.durType == "MONTH") {
					this.integralGet = parseInt(_this.money * this.borrowDuration / 12) + '个';
					$("#integralGet").html(this.integralGet);
				} else if (_this.durType == "DAY") {
					this.integralGet = parseInt(_this.money * this.borrowDuration / 365) + '个';
					$("#integralGet").html(this.integralGet);
				} else if (_this.durType == "YEAR") {
					this.integralGet = parseInt(_this.money * this.borrowDuration / 1) + '个';
					$("#integralGet").html(this.integralGet);
				}
			},
			contFilter:function(key){
				util.forceNum.call(this,key);
			},
			getData: function () {
				var _this = this;
				$.ajax({
					type: "post",
					url: Helper.basePath + 'borrowInfo/detail.htm',
					async: false,
					dataType: "json",
					data: {
						borrowId: _this.borrowId
					},
					xhrFields: {
						withCredentials: true
					},
					success: function (data) {
						var data = JSON.parse(data);
						_this.data = data;
						_this.incMoney = data.borrow.incMoney / 100;
						_this.raiseMoney = (data.account.baseMoney - data.account.freezeMoney) / 100;
						_this.remayMoney = (data.borrow.borrowMoney - data.borrow.raiseMoney) / 100;
						_this.minInvest = data.borrow.minInvest / 100;
						_this.maxInvest = data.borrow.maxInvest / 100;
						_this.durType = data.borrow.durType;
						_this.borrowDuration = data.borrow.borrowDuration;
						_this.baseMoney = data.borrow.baseMoney;
						_this.borrowType = data.borrow.borrowType;
						_this.borrowName = data.borrow.borrowName;
						if (_this.borrowType === 'GYHOUSE' || _this.borrowType === 'MAKE' || _this.borrowType === 'GYLEASE') {
							document.title = '房月盈'
							$('header .title').text('房月盈');
						} else if (_this.borrowType === 'GYCAR' || _this.borrowType === 'MAKECAR') {
							document.title = '车满盈';
							$('header .title').text('车满盈');
						} else {
							document.title = '新手标';
							$('header .title').text('新手标');
						}
					}
				});
			},
			allIn: function () {
				var _this = this;
				if (_this.borrowType == 'MAKECAR' || _this.borrowType == 'MAKE') { //预约标的 限制选择金额
					util.toast('预约专享标金额已确定，不能更改');
					return false;
				}
				if (this.userInfo.realName === null) {
					util.confirm('是否先实名认证!', function () {
						util.baseLink('/src/base/real_name.html', 0);
					});
					return false;
				}
				//可用余额
				var raiseMoney = _this.raiseMoney;
				//剩余可投
				var remayMoney = _this.remayMoney;
				//标的最大限额
				var maxInvest = _this.maxInvest;
				//标的最小限额
				var minInvest = _this.minInvest;
				var money = this.money * 1;
				var incMoney = _this.incMoney * 1; //增量
				var x = parseInt((raiseMoney - minInvest) / incMoney); //减去起投金额，除以增量
				var y = parseInt((maxInvest - minInvest) / incMoney);
				var z = parseInt((remayMoney - minInvest) / incMoney);
				var a = Math.min(x, y, z);
				//			_this.money=a*incMoney +minInvest;
				_this.money = (a * incMoney + minInvest);
				//			this.money=a*incMoney +minInvest;
                _this.choiceVoucher(0);
				this.cout();
			},
			moneyadd: function () {
				var _this = this;
				var minInvest = _this.minInvest; //最小投资金额
				var maxInvest = _this.maxInvest; //最大投资金额
				var incMoney = _this.incMoney * 1; //投资增量
				var money = _this.money;
				if (_this.borrowType == 'MAKECAR' || _this.borrowType == 'MAKE') { //预约标的 限制选择金额
					util.toast('预约专享标金额已确定，不能更改');
					return false;
				}
				if (minInvest && _this.money < minInvest) {
					_this.money = _this.minInvest;

					//$("#money").val(parseInt(minInvest));
				} else {
					//此处调用时money的数据类型会改变，需要转换下
					_this.money = parseInt(incMoney) + parseInt(money);
					//				_this.money =_this.money+ _this.incMoney;
				}
				_this.choiceVoucher(0);
			},
			moneyminus: function () {
				var _this = this;
				var minInvest = _this.minInvest; //最小投资金额
				var maxInvest = _this.maxInvest; //最大投资金额
				var incMoney = _this.incMoney * 1; //投资增量
               //获取卡券的最小投资金额
				if (_this.borrowType == 'MAKECAR' || _this.borrowType == 'MAKE') { //预约标的 限制选择金额
					util.toast('预约专享标金额已确定，不能更改');
					return false;
				}
				if(_this.voucherId){
					_this.money = _this.money - _this.incMoney;
				}else {
                    if (_this.money - _this.incMoney <= 0) {
                        util.toast('投资金额必须为正整数!');
                        return;
                    } else {
                        //$("#money").val(parseInt(money)-parseInt(incMoney));
                        _this.money = _this.money - _this.incMoney;
                    }
				}
				var re = /^[1-9]\d*$/;
				if (!re.test(_this.money)) {
					_this.money = minInvest;
					return;
				}
                _this.choiceVoucher(0);
			},
			getcardData:function () {
                var _this = this;
                if(_this.source === 'coupon'){
                    $.ajax({
                        url: Helper.basePath + '/member/getCardById.htm',
                        type: 'POST',
                        dataType: 'json',
                        xhrFields: {
                            withCredentials: true
                        },
                        async: false,
                        data: {
                            voucherId: _this.voucherId
                        }
                    }).done(function (data) {
                        var data = JSON.parse(data);
                        // var rewardType = data.voucherList[0].rewardType;
                        // var rewardVal = data.voucherList[0].val;
                        _this.voucherMoney = parseInt(data.voucherList[0].minInvest);

                    }).fail(function () {
                    });

                 }
            },
			inputMony: function () {
				var _this = this;
				$("#money").focus(_this.cout());
			},
			//计算
			cout: function () {
				var _this = this;
				if (_this.borrowType === "MAKE" || _this.borrowType === "MAKECAR") {
					var money = _this.minInvest;
					$.ajax({
						type: "post",
						url: Helper.basePath + "borrowInfo/incomeMoney.htm",
						async: false,
						dataType: "json",
						xhrFields: {
							withCredentials: true
						},
						data: {
							money: money,
							borrowId: _this.borrowId,
							voucherId: _this.voucherId
						},
						success: function (data) {
							//var yuqiGet1=data-money;
							//截取两位小数
							//var yuqiGet=parseInt(yuqiGet1*Math.pow(10,2)+0,10)/Math.pow(10,2);
							$("#yuqiGet").html(data + '元');
							_this.integralCout();
						}

					});

				} else {
					//可用余额
					var raiseMoney = _this.raiseMoney;
					//剩余可投
					var remayMoney = _this.remayMoney;
					//标的最大限额
					var maxInvest = _this.maxInvest;
					//标的最小限额
					var minInvest = _this.minInvest;

					var incMoney = _this.incMoney * 1;
					//判断
					if (this.money === null || this.money == "") {
						this.money = minInvest;
						return;
					}

					if (isNaN(this.money)) {
						util.toast('投资金额必须为数字!');
						return;
					}
					var re = /^[1-9]\d*$/;
					if (!re.test(this.money)) {
						this.money = minInvest;
						util.toast('投资金额必须为正整数!');
						return;
					}
					if (raiseMoney) {
						raiseMoney = raiseMoney;
					} else {
						raiseMoney = 0;
					}

					if (raiseMoney != null && parseFloat(raiseMoney) < this.money) {
						util.toast('账户余额不足，请充值');
					}
					if (this.money > remayMoney) {
						util.toast('投资金额不得大于剩余可投金额');
					}
					if (this.money < minInvest) {
						util.toast("投资金额不能小于最小起投金额" + parseInt(minInvest) + "元");
					}
					if (maxInvest < this.money) {
						util.toast("投资金额不能大于最大可投金额" + parseInt(maxInvest) + "元");
					}
					if ((this.money - minInvest) % incMoney != 0) {
						util.toast("增量金额必须为:" + incMoney + "的整数倍");
					}
					$.ajax({
						type: "post",
						url: Helper.basePath + "borrowInfo/incomeMoney.htm",
						async: false,
						dataType: "json",
						xhrFields: {
							withCredentials: true
						},
						data: {
							money: _this.money,
							borrowId: _this.borrowId,
							voucherId: _this.voucherId
						},
						success: function (data) {
							//var yuqiGet1=(parseFloat(data)-_this.money);
							//截取两位小数
							//var yuqiGet1=parseInt(yuqiGet1*Math.pow(10,2)+0,10)/Math.pow(10,2);
							$("#yuqiGet").html(data + '元');
							_this.integralCout();
						}

					});


				}
			},
			carDto: function () {
				var _this = this;
                if(_this.money>_this.raiseMoney){
                    util.toast('账户余额不足，请充值');
                    return;
                }
                var investMoney = '';
				if (_this.borrowType === "MAKE" || _this.borrowType === "MAKECAR") {
                    investMoney = $("#moneyyb").html();
				} else {
					investMoney = $("#money").val();
				}
				$.ajax({
					type: "post",
					url: Helper.basePath + 'member/isLogin.htm',
					async: false,
					dataType: "json",
					xhrFields: {
						withCredentials: true
					},
					success: function (loginData) {
						loginData = JSON.parse(loginData);
						if (loginData.isLogin == 'N') {
							//判断体验金券
							window.location.href = "/src/base/login.html?bUrl=/src/invest/xz_card.html&borrowId=" + _this.borrowId + "&investMoney=" + investMoney;
						} else {
							//判断体验金券
							window.location.href = "xz_card.html?borrowId=" + _this.borrowId + "&investMoney=" + investMoney;
						}
					},
					error: function (loginData) {

					}
				});

			},
			rightInvest: function () {
				var _this = this;
				// 神策
				sa.track('invest_click',{
					invest_click_name:_this.borrowName
				})
				//可用余额
				var raiseMoney = (_this.baseMoney - _this.freezeMoney) / 100;
				if (_this.borrowType === "MAKE" || _this.borrowType === "MAKECAR") {
					var investMoney = $("#moneyyb").html();
				} else {
					var investMoney = $("#money").val();
				}
				if (raiseMoney <= 0) {
					util.toast('账户余额不足，请充值');
					return;
				}
				if (investMoney === "") {
					util.toast('请输入投资金额');
				}
				if (!this.isXieYi) {
					util.toast('请阅读并同意投资协议');
					return;
				}
				_this.choiceVoucher(1);

			},
			choiceVoucher:function(isNeedInvest){
                var _this = this;
                _this.cout();
                if(_this.voucherId){
                    $.ajax({
                        url: Helper.basePath + '/member/getCardById.htm',
                        type: 'POST',
                        dataType: 'json',
                        xhrFields: {
                            withCredentials: true
                        },
                        async: false,
                        data: {
                            voucherId: _this.voucherId
                        }
                    }).done(function (data) {
                        var data = JSON.parse(data);
                        _this.voucherMoney = parseInt(data.voucherList[0].minInvest);
						this.voucherMoney = _this.voucherMoney;
                        if(_this.money<_this.voucherMoney){
                            util.confirmAct('投资金额小于卡券起投金额，请重新选择优惠券!','', '知道了', function () {
                                $("#voucherId").text('>');
                                _this.voucherId = '';
                                _this.cout();
                            });
                            $('.confirm_no').hide();//去除取消 btn
							return;
                        }
                        if(isNeedInvest == 1){
                            _this.getRight();
                        }

                    }).fail(function () {
                    });
                }else if(isNeedInvest == 1){
					_this.getRight();
				}
			},
			getRight:function () {
				var _this=this;
                var investMoney = '';
                if (_this.borrowType === "MAKE" || _this.borrowType === "MAKECAR") {
                    investMoney = $("#moneyyb").html();
                } else {
                    investMoney = $("#money").val();
                }
                // var voucherId= $("#voucherId").data("id");
                var token = $("#token").val();
                var version = navigator.appVersion;
                if (this.userInfo.realName === null) {
                    util.confirm('是否先实名认证!', function () {
                        util.baseLink('/src/base/real_name.html', 0);
                    });
                    return false;
                }
                if (this.userInfo.isSetPayPwd === 'NO') {
                    util.confirmAct('您还未设置支付密码','暂不设置','立即设置',function(){
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
                                'retUrl': Helper.webPath + 'src/base/loading.html?type=setPayPsw&uid=' + _this.data.userId
                            }
                        })
                            .done(function (data) {
                                var data = JSON.parse(data);
                                if (data.code === '000') {
                                    window.location.href = data.redirectUrl;
                                }
                            })
                    })
                    return false;
                }
                if (this.userInfo.isBindCard === 'NO') {
                    util.confirmAct('您还未绑定银行卡','暂不设置','立即设置',function(){
                        window.location.href = Helper.webPath + '/src/account/bind_bank.html';
                    })
                    return false;
//          util.toast('请先绑定银行卡，正在跳转');
//          			util.baseLink('/src/account/bind_bank.html', 2000);
                }
                //风险测评
                if(_this.levelName==""||_this.levelName=="null"){
                    util.confirmAct('您还未进行风险评测','暂不评测','去评测',function(){
                        //跳转到测评页面
                        window.location.href = Helper.webPath + 'src/account/risk_entry.html';
                    });
                    return;
                }
                $.ajax({
                    type: "post",
                    url: Helper.basePath + 'investInfo/doInvest.htm',
                    async: false,
                    data: {
                        borrowInfoId: _this.borrowId,
                        investMoney: investMoney,
                        voucherId: _this.voucherId,
                        CLIENT_TOKEN_NAME: token,
                        retUrl: Helper.webPath + '/src/base/loading.html',
                        userAgent: version,
                        'token_id': tokenId
                    },
                    datatype: "json",
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (data) {
                        //_this.data=data;
                        if (data.code === '325') {
                            //重复提交投资信息
                            util.toast(data.message);
                        } else if (data.code === '7008') {
                            util.alert('您的账户当前存在投资风险，平台为了营造安全的投资环境，暂时限制您的操作，建议您咨询客服。');
                        }
                        if (data.code == '000') {
                            if (data.returnObject) { //托管模式
                                window.document.write(data.returnValue.orderFormContent);
                            } else { //非托管模式
                                if (data.displayMode) {
                                    $('.order-cart-realname div span').html(data.returnValue.orderFormContent);
                                    $('.order-cart-realname').show(200);
                                }
                            }
                        }else {
                            util.toast(data.message);
						}

                    },
                    error: function (data) {}
                });
            },
			linkChargeWith: function () {
			    var _this =this;
				if (this.userInfo.realName === null) {
					util.confirm('是否先实名认证!', function () {
						util.baseLink('/src/base/real_name.html', 0);
					});
					return false;
				}
				if (this.userInfo.isSetPayPwd === 'NO') {
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
								'retUrl': Helper.webPath + '/src/base/loading.html?type=setPayPsw&uid=' + this.data.account.userId
							}
						})
						.done(function (data) {
							var data = JSON.parse(data);
							if (data.code === '000') {
								window.location.href = data.redirectUrl;
							}
						})
					return false;
				}
				if (this.userInfo.isBindCard === 'NO') {
					util.toast('请先绑定银行卡，正在跳转');
					util.baseLink('/src/account/bind_bank.html', 2000);
					return false;
				}
				window.location.href = '/src/account/charge.html';
			}


		}


	})
}