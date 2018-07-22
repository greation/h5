//creat by gannicus on 2017/4/22
var iv = {}
// 投资列表
iv.invest = function (obj) {
	var vm = new Vue({
		el: "#invest",
		data: {
			data: '', // 投资列表
			dataList: '', // 分类列表
			isHouseEnd: false,
			isCarEnd: false,
			isMarkEnd: false,
			pwdYb: ''
		},
		created: function () {
			var _this = this;
			$.ajax({
				type: "post",
				url: Helper.basePath + 'borrowInfo/getBorrowlist.htm',
				async: false,
				data: "",
				datatype: "json",
				xhrFields: {
					withCredentials: true
				},
				success: function (data) {
					var data = JSON.parse(data);
					//alert(data.mainBorrow.borrowActivityIcon);
					_this.data = data;
				},
				error: function (data) {

				}
			});
		},
		methods: {
			projectLink: function (borrowId, borrowType) {
				var _this = this;
				$.ajax({
					type: "post",
					url: Helper.basePath + 'member/isLogin.htm',
					async: false,
					datatype: "json",
					xhrFields: {
						withCredentials: true
					},
					success: function (data) {
						data = JSON.parse(data);
						if (data.isLogin == 'N') {
							util.baseLink('/src/base/login.html?bUrl=/src/index/index.html', 1000);
							//window.location.href="/src/base/login.html?bUrl=/src/invest/project_home.html&borrowId=" + borrowId;
						} else {
							//在此判断跳转体验金标和普通标
							if (borrowType === 'MAKE' || borrowType === 'MAKECAR' || borrowType === 'MAKEQIXIN') {
								_this.YborrowId = borrowId;
								$(".modal-bg").show();
								$(".yb-psw").show();
							} else if (borrowType === 'EXPERIENCE') {
								//体验金标
								if (_this.voucherId) {
									window.location.href = "project_detail.html?borrowId=" + borrowId + '&source=coupon&voucherId=' + _this.voucherId;
								} else {
									window.location.href = "project_detail.html?borrowId=" + borrowId + '&source=list';
								}
							} else {
								//普通标
								if (_this.voucherId) {
									window.location.href = "project_home.html?borrowId=" + borrowId + '&source=coupon&voucherId=' + _this.voucherId;
								} else {
									window.location.href = "project_home.html?borrowId=" + borrowId + '&source=list'
								}

							}

						}
					},
					error: function (data) {

					}
				});
			},
			btnLj: function (borrowId) {
				var _this = this;
				$.ajax({
					type: "post",
					url: Helper.basePath + 'member/isLogin.htm',
					async: false,
					datatype: "json",
					xhrFields: {
						withCredentials: true
					},
					success: function (loginData) {
						loginData = JSON.parse(loginData);
						if (loginData.isLogin == 'N') {
							window.location.href = "/src/base/login.html?bUrl=/src/invest/investing.html&borrowId=" + borrowId;
						} else {
							if (_this.voucherId) {
								if (_this.borrowTypeN == 'MAKECAR' || _this.borrowTypeN == 'MAKE' || _this.borrowTypeN === 'MAKEQIXIN') {
									window.location.href = "investing.html?borrowId=" + borrowId + '&voucherId=' + _this.voucherId + '&source=coupon&ybdata=ekeyfundData';
								} else {
									window.location.href = "investing.html?borrowId=" + borrowId + '&voucherId=' + _this.voucherId + '&source=coupon';
								}

							} else {
								window.location.href = "investing.html?borrowId=" + borrowId
							}
						}
					},
					error: function (loginData) {

					}
				});
			},
			yb: function () {
				var _this = this;
				$.ajax({
					type: "post",
					url: Helper.basePath + 'member/isLogin.htm',
					async: false,
					datatype: "json",
					xhrFields: {
						withCredentials: true
					},
					success: function (loginData) {
						loginData = JSON.parse(loginData);
						if (loginData.isLogin == 'N') {
							window.location.href = "/src/base/login.html?bUrl=/src/invest/deal.html";
						} else {
							//在此判断跳转体验金标和普通标
							window.location.href = "deal.html";
						}
					},
					error: function (loginData) {

					}
				});
			},
			linkToList: function (type) {
				window.location.href = "list_all.html?borrowType=" + type;
			},
			//约标密码
			//约标输入
			inputPwd: function () {
				var _this = this;
				var isinp = _this.isinp;
				var curnum = _this.curnum;

			},

			pwdIn: function () {
				var _this = this;
				var isinp = _this.isinp;
				var curnum = _this.curnum;
				curnum = 0;
				$('.ipswbox').click(function () {
					$(this).css('border', '#00a0ea 1px solid');
					$('.pswbtn').focus();
					isinp = true;
				})
				$('.pswbtn').keyup(function (event) {

					if (curnum >= 6 || curnum < 0) {
						isinp = false;
					}
					if (isinp) {
						if (event.keyCode == 8 && curnum > 0) {
							curnum -= 1;
							$('.ipswbox i').eq(curnum).removeClass('active');
						} else {
							if (event.keyCode != 8) {
								$('.ipswbox i').eq(curnum).addClass('active');
								curnum += 1;
							}
						}
					} else {
						if (event.keyCode == 8 && curnum > 0) {
							curnum -= 1;
							$('.ipswbox i').eq(curnum).removeClass('active');
							isinp = true;
						}
					}
				})
				$('.pswbtn').blur(function () {
					isinp = false;
					$('.ipswbox').css('border', '#EAF1F5 1px solid');
				})
			},
			//约标确认和取消
			pswCancle: function () {
				var _this = this;
				_this.curnum = 0;
				$(".modal-bg").hide();
				$(".yb-psw").hide();
				$(".ipswbox i").removeClass('active');
				_this.pwdYb = "";
				$("#message").hide();
			},
			pswSure: function () {
				var _this = this;
				$("#message").hide();
				var pwd = $("#pswbtn").val();
				var id = _this.YborrowId;
				$.ajax({
					type: "post",
					url: Helper.basePath + 'borrowInfo/checkpwd.htm',
					async: true,
					datatype: "json",
					data: {
						id: id,
						pwd: pwd
					},
					xhrFields: {
						withCredentials: true
					},
					success: function (data) {
						var data = JSON.parse(data);
						_this.data = data;
						if (data.code == '001') {
							if (_this.pwdYb == '') {
								util.toast('请输入约标密码', 2000)	
							} else {
								util.toast('您输入的密码错误！', 2000)
							}
							$.ajax({
								type: "post",
								url: Helper.basePath + 'borrowInfo/getBorrowlist.htm',
								async: false,
								data: "",
								datatype: "json",
								xhrFields: {
									withCredentials: true
								},
								success: function (data) {
									var data = JSON.parse(data);
									//alert(data.mainBorrow.borrowActivityIcon);
									_this.data = data;
								},
								error: function (data) {

								}
							});
						}
						if (data.code == '000') {
							$(".ipswbox i").removeClass('active');
							//util.toast(data.message);
							if (_this.voucherId) {
								//判断是否约标
								if (obj.borrowType == 'MAKECAR' || obj.borrowType == 'MAKE' || obj.borrowType === 'MAKEQIXIN') {
									window.location.href = "project_home.html?borrowId=" + id + '&voucherId=' + _this.voucherId + '&source=coupon&ybdata=ekeyfundData';
								} else {
									window.location.href = "project_home.html?borrowId=" + id + '&voucherId=' + _this.voucherId + '&source=coupon';
								}

							} else {
								window.location.href = "project_home.html?borrowId=" + id;
							}
						}

					},
					error: function (data) {

					}
				});

			}
		}
	})
}

iv.investing = function () {
	var vm = new Vue({
		el: "#expressId",
		data: {
			data: "",
			isXieYi: false,
			source: util.hrefSplit(window.location.href).source,
			voucherId: util.hrefSplit(window.location.href).voucherId,
			levelName: '',
			userInfo: [],
			investMoney: '10000',
			isInvestDisabled: false
		},
		created: function () {
			var _this = this;
			_this.getData();
			$.ajax({
				url: Helper.basePath + 'member/getUser.htm',
				type: 'POST',
				dataType: 'json',
				async: false,
				xhrFields: {
					withCredentials: true
				}
			}).done(function (data) {
				var data = JSON.parse(data);
				_this.userInfo = data.userInfo;
				_this.levelName = data.levelName;

			})
		},
		methods: {
			getData: function () {
				var _this = this;
				var nowurl = document.URL;
				nowurl = location.href;
				var borrowId = util.getRequest(nowurl, "borrowId");
				var investMoney = util.getRequest(nowurl, "investMoney");
				var voucherId = util.getRequest(nowurl, "voucherId");
				var isSelectCoupon = util.getRequest(window.location.href, "voucherId");
				if (voucherId != '') {
					if (investMoney) {
						$("#expresCa").text(investMoney + "元体验金券");
						$("#voucherId").attr("data-id", voucherId);
					}
					if (_this.source === 'coupon') {
						$("#expresCa").text("10000元体验金券");
						$("#voucherId").attr("data-id", voucherId);
						return;
					}
					if (investMoney) {
						$("#expresCa").text(investMoney + "元体验金券");
						$("#voucherId").attr("data-id", voucherId);
					}
					if (_this.source === 'coupon') {
						$("#expresCa").text("10000元体验金券");
						$("#voucherId").attr("data-id", voucherId);
						return;
					}
					_this.isInvestDisabled = false
				} else {
					_this.isInvestDisabled = true
				}

			},
			getCard: function () {
				var _this = this;
				var nowurl = document.URL;
				nowurl = location.href;
				var borrowId = util.getRequest(nowurl, "borrowId");
				var token = util.getRequest(nowurl, "token");
				$.ajax({
					type: "post",
					url: Helper.basePath + "member/isLogin.htm",
					async: false,
					dataType: "json",
					data: {
						investMoney: '10000',
						borrowInfoId: borrowId,

					},
					xhrFields: {
						withCredentials: true
					},
					success: function (data) {
						data = JSON.parse(data);
						_this.data = data;
						if (data.isLogin == 'N') {
							window.location.href = "/src/base/login.html?bUrl=/src/invest/xz_card.html&borrowId=" + borrowId + "&voucherId=" + _this.voucherId;
						} else {
							window.location.href = "xz_card.html?borrowId=" + borrowId + "&token=" + token + "&voucherId=" + _this.voucherId;
						}

					}
				});
			},
			ljInvesting: function () {
				var _this = this;
				var nowurl = document.URL;
				nowurl = location.href;
				var voucherId = util.getRequest(nowurl, "voucherId");
				if (!voucherId) {
					util.toast('请选择一张体验金券');
					return false;
				}
				if (false) {
					//util.toast('请阅读并同意注册协议');
				} else {

					var _this = this;
					var borrowId = util.getRequest(nowurl, "borrowId");
					var version = navigator.appVersion;
					var token = util.getRequest(nowurl, "token");
					if (_this.levelName == "" || _this.levelName == "null") {
						util.confirmAct('您还未进行风险评测', '暂不评测', '去评测', function () {
							//跳转到测评页面
							window.location.href = Helper.webPath + 'src/account/risk_entry.html';
						});
						return false;
					}
					$.ajax({
						type: "post",
						url: Helper.basePath + 'investInfo/doInvest.htm',
						async: false,
						data: {
							borrowInfoId: borrowId,
							investMoney: _this.investMoney,
							CLIENT_TOKEN_NAME: token,
							voucherId: voucherId,
							userAgent: version,
							retUrl: Helper.webPath + 'src/base/loading.html'
						},
						datatype: "json",
						xhrFields: {
							withCredentials: true
						},
						success: function (data) {
							_this.data = data;

							if (data.code === '325') {
								//重复提交投资信息
								util.toast(data.message);
							}

							if (data.code == '000') {
								window.location.href = Helper.webPath + 'src/invest/result.html';
							}

						},
						error: function (data) {

						}
					});
				}

			}
		}
	});
}

iv.investList = function (obj) {
	//投资列表
	var vm = new Vue({
		el: "#appList",
		data: {
			data: "",
			list: [],
			pageIndex: 1,
			pageSize: 10,
			curStatus: null,
			blockArr: [true, false, false],
			loadTxt: '加载更多...',
			isinp: false,
			curnum: '',
			pwdYb: '',
			YborrowId: '',
			sortType: 0,
			sortRule: 1, //约标的id
			voucherId: ''
		},
		filters: {
			capitalize: function (value) {
				if (!value) return ''
				value = value / 100
				value = value.toFixed() + '元'
				return value
			},
			capitalizeb: function (value) {
				if (!value) return ''
				value = value + '%'
				return value
			},
			capitalizeg: function (value) {
				if (!value) return ''
				value = value.toFixed(1)
				return value
			},
			capitalizeq: function (value) {
				var value = (value || 0).toString(),
					value2 = "",
					result = '';
				if (value.indexOf(".") != -1) {
					nums = value.split(".");
					value = nums[0];
					value2 = "." + nums[1];
				}
				while (value.length > 3) {
					result = ',' + value.slice(-3) + result;
					value = value.slice(0, value.length - 3);
				}
				if (value) {
					result = value + result + value2;
				}
				return result;
			}
		},
		created: function () {
			var _this = this;
			this.getInvestData();
		},
		methods: {
			durTypeMap: util.durTypeMap,
			getInvestData: function () {
				var _this = this;
				var nowurl = document.URL;
				nowurl = location.href;
				var voucherId = util.getRequest(nowurl, "voucherId");
				_this.voucherId = voucherId;
				if (!util.isEmpty(voucherId)) {
					$('header .title').text('投资列表').next().text('');
					$('.nav_list').hide();
				}
				if (_this.voucherId) {
					$.ajax({
							url: Helper.basePath + 'borrowInfo/getBorrowInfoListByVoucher.htm',
							type: 'POST',
							dataType: 'json',
							xhrFields: {
								withCredentials: true
							},
							data: {
								pageIndex: this.pageIndex,
								// pageSize: this.pageSize,
								voucherId: voucherId
							}
						})
						.done(function (data) {
							var data = JSON.parse(data);
							_this.data = data;
							if (data.isLogin === 'N') {
								util.toast('请登录');
								window.location.href = '/src/base/login.html';
							} else {
								for (var i = 0; i < data.listBorrow.length; i++) {
									_this.list.push(data.listBorrow[i]);
								}
								if (_this.pageIndex >= 10) {
									$(".look_more").show();
									$(".btn_load_more").hide();
								}
								if (_this.pageIndex < 10) {
									$(".look_more").hide();
								}
								if (_this.pageIndex >= _this.data.page.pageCount) {
									_this.loadTxt = '没有更多的数据！';
								}
								if (_this.voucherId == "") {
									_this.loadTxt = '没有更多的数据！';
								}
							}

							//					//标的类型为尊享约标MAKE
							//					if(data.listBorrow.borrowType==='MAKE'){
							//						this.ybPwd();
							//					}

						})
						.fail(function () {})
				} else {
					$.ajax({
							url: Helper.basePath + 'borrowInfo/list.htm',
							type: 'POST',
							dataType: 'json',
							xhrFields: {
								withCredentials: true
							},
							data: {
								pageIndex: this.pageIndex,
								pageSize: this.pageSize,
								sortType: this.sortType,
								sortRule: this.sortRule,
								voucherId: voucherId,
								borrowType: obj.borrowType
							}
						})
						.done(function (data) {
							var data = JSON.parse(data);
							_this.data = data;
							if (data.isLogin === 'N') {
								util.toast('请登录');
								window.location.href = '/src/base/login.html';
							} else {
								for (var i = 0; i < data.listBorrow.length; i++) {
									_this.list.push(data.listBorrow[i]);
								}
								if (_this.pageIndex >= 10) {
									$(".look_more").show();
									$(".btn_load_more").hide();
								}
								if (_this.pageIndex < 10) {
									$(".look_more").hide();
								}
								if (_this.pageIndex >= _this.data.page.pageCount) {
									_this.loadTxt = '没有更多的数据！';
								}
								if (_this.voucherId == "") {
									_this.loadTxt = '没有更多的数据！';
								}
							}

							//					//标的类型为尊享约标MAKE
							//					if(data.listBorrow.borrowType==='MAKE'){
							//						this.ybPwd();
							//					}

						})
						.fail(function () {})
				}

			},
			loadMore: function () {
				var _this = this;
				if (this.pageIndex++ < this.data.page.totalCount) {
					this.getInvestData();
				}
			},
			projectLink: function (borrowId, borrowType) {
				var _this = this;
				$.ajax({
					type: "post",
					url: Helper.basePath + 'member/isLogin.htm',
					async: false,
					datatype: "json",
					xhrFields: {
						withCredentials: true
					},
					success: function (data) {
						data = JSON.parse(data);
						if (data.isLogin == 'N') {
							util.baseLink('/src/base/login.html?bUrl=/src/index/index.html', 1000);
							//							window.location.href="/src/base/login.html?bUrl=/src/invest/project_home.html&borrowId=" + borrowId;
						} else {
							//在此判断跳转体验金标和普通标
							if (borrowType === 'MAKE' || borrowType === 'MAKECAR' || borrowType === 'MAKEQIXIN') {
								_this.YborrowId = borrowId;
								$(".modal-bg").show();
								$(".yb-psw").show();
							} else if (borrowType === 'EXPERIENCE') {
								//体验金标
								if (_this.voucherId) {
									window.location.href = "project_detail.html?borrowId=" + borrowId + '&source=coupon&voucherId=' + _this.voucherId;
								} else {
									window.location.href = "project_detail.html?borrowId=" + borrowId + '&source=list';
								}

							} else {
								//普通标
								if (_this.voucherId) {
									window.location.href = "project_home.html?borrowId=" + borrowId + '&source=coupon&voucherId=' + _this.voucherId;
								} else {
									window.location.href = "project_home.html?borrowId=" + borrowId + '&source=list'
								}

							}

						}
					},
					error: function (data) {

					}
				});
			},
			//0,1,2,3依次排列的四种状态，综合排序，利率，期限，进度
			//排序的，升序1，不排序0，降序-1
			commenRank: function () {
				var _this = this;
				$.ajax({
						url: Helper.basePath + 'borrowInfo/list.htm',
						type: 'POST',
						dataType: 'json',
						xhrFields: {
							withCredentials: true
						},
						data: {
							pageIndex: this.pageIndex,
							pageSize: this.pageSize,
							sortType: 0,
							sortRule: 1,
							borrowType: obj.borrowType
						}
					})
					.done(function (data) {
						var data = JSON.parse(data);
						_this.data = data;
						_this.list = [];
						$(".zh").removeClass("c9").addClass("cblue");
						$(".ly").removeClass("cblue").addClass("c9").find("i").removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
						$(".qx").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
						$(".jd").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
						for (var i = 0; i < data.listBorrow.length; i++) {
							_this.list.push(data.listBorrow[i]);
						}
					})


			},
			rateRank: function () {
				var _this = this;
				var rank = "";
				this.isinp = !this.isinp;
				if (!this.isinp) {
					rank = 1;
					_this.sortRule = 1;
					this.sortRule = rank;
					this.sortType = 1;
					this.pageIndex = 1;
					$.ajax({
							url: Helper.basePath + 'borrowInfo/list.htm',
							type: 'POST',
							dataType: 'json',
							xhrFields: {
								withCredentials: true
							},
							data: {
								pageIndex: this.pageIndex,
								pageSize: this.pageSize,
								sortType: this.sortType,
								sortRule: this.sortRule,
								borrowType: obj.borrowType
							}
						})
						.done(function (data) {
							var data = JSON.parse(data);
							_this.data = data;
							if (_this.pageIndex >= 10) {
								$(".look_more").show();
								$(".btn_load_more").hide();
							}
							if (_this.pageIndex < 10) {
								$(".look_more").hide();
								$(".btn_load_more").show();
							}
							if (_this.pageIndex >= _this.data.page.totalCount) {
								_this.loadTxt = '没有更多的数据！';
							}
							if (_this.voucherId == "") {
								_this.loadTxt = '没有更多的数据！';
							}
							_this.list = [];
							$(".ly").removeClass("c9").addClass("cblue").find("i").removeClass("px_icon").addClass("px_ic").toggleClass("px_iconz");
							$(".zh").removeClass("cblue").addClass("c9");
							$(".qx").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
							$(".jd").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
							for (var i = 0; i < data.listBorrow.length; i++) {
								_this.list.push(data.listBorrow[i]);
							}

						})
				} else {
					rank = -1;
					_this.sortRule = -1;
					this.sortRule = rank;
					this.sortType = 1;
					this.pageIndex = 1;
					$.ajax({
							url: Helper.basePath + 'borrowInfo/list.htm',
							type: 'POST',
							dataType: 'json',
							xhrFields: {
								withCredentials: true
							},
							data: {
								pageIndex: this.pageIndex,
								pageSize: this.pageSize,
								sortType: this.sortType,
								sortRule: this.sortRule,
								borrowType: obj.borrowType
							}
						})
						.done(function (data) {
							var data = JSON.parse(data);
							_this.data = data;
							if (_this.pageIndex >= 10) {
								$(".look_more").show();
								$(".btn_load_more").hide();
							}
							if (_this.pageIndex < 10) {
								$(".look_more").hide();
								$(".btn_load_more").show();
							}
							if (_this.pageIndex >= _this.data.page.totalCount) {
								_this.loadTxt = '没有更多的数据！';
							}
							if (_this.voucherId == "") {
								_this.loadTxt = '没有更多的数据！';
							}
							_this.list = [];
							$(".ly").removeClass("c9").addClass("cblue").find("i").removeClass("px_icon").addClass("px_ic").toggleClass("px_iconz");
							$(".zh").removeClass("cblue").addClass("c9");
							$(".qx").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
							$(".jd").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
							for (var i = 0; i < data.listBorrow.length; i++) {
								sortRule = rank;
								_this.list.push(data.listBorrow[i]);
							}

						})
				}

			},
			dateRank: function () {
				var _this = this;
				var rank = "";
				this.isinp = !this.isinp;
				if (!this.isinp) {
					rank = 1;
					_this.sortRule = 1;
					this.sortRule = rank;
					this.sortType = 2;
					this.pageIndex = 1;

					$.ajax({
							url: Helper.basePath + 'borrowInfo/list.htm',
							type: 'POST',
							dataType: 'json',
							xhrFields: {
								withCredentials: true
							},
							data: {
								pageIndex: this.pageIndex,
								pageSize: this.pageSize,
								sortType: 2,
								sortRule: rank,
								borrowType: obj.borrowType
							}
						})
						.done(function (data) {
							var data = JSON.parse(data);
							_this.data = data;
							if (_this.pageIndex >= 10) {
								$(".look_more").show();
								$(".btn_load_more").hide();
							}
							if (_this.pageIndex < 10) {
								$(".look_more").hide();
								$(".btn_load_more").show();
							}
							if (_this.pageIndex >= _this.data.page.totalCount) {
								_this.loadTxt = '没有更多的数据！';
							}
							if (_this.voucherId == "") {
								_this.loadTxt = '没有更多的数据！';
							}
							_this.list = [];
							$(".qx").removeClass("c9").addClass("cblue").find("i").removeClass("px_icon").addClass("px_ic").toggleClass("px_iconz");
							$(".zh").removeClass("cblue").addClass("c9");
							$(".ly").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
							$(".jd").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
							for (var i = 0; i < data.listBorrow.length; i++) {
								sortRule = rank;
								_this.list.push(data.listBorrow[i]);
							}
						})
				} else {
					rank = -1;
					_this.sortRule = -1;
					this.sortRule = rank;
					this.sortType = 2;

					this.pageIndex = 1;
					$.ajax({
							url: Helper.basePath + 'borrowInfo/list.htm',
							type: 'POST',
							dataType: 'json',
							xhrFields: {
								withCredentials: true
							},
							data: {
								pageIndex: this.pageIndex,
								pageSize: this.pageSize,
								sortType: this.sortType,
								sortRule: this.sortRule,
								borrowType: obj.borrowType
							}
						})
						.done(function (data) {
							var data = JSON.parse(data);
							_this.data = data;
							if (_this.pageIndex >= 10) {
								$(".look_more").show();
								$(".btn_load_more").hide();
							}
							if (_this.pageIndex < 10) {
								$(".look_more").hide();
								$(".btn_load_more").show();
							}
							if (_this.pageIndex >= _this.data.page.totalCount) {
								_this.loadTxt = '没有更多的数据！';
							}
							if (_this.voucherId == "") {
								_this.loadTxt = '没有更多的数据！';
							}
							_this.list = [];
							$(".qx").removeClass("c9").addClass("cblue").find("i").removeClass("px_icon").addClass("px_ic").toggleClass("px_iconz");
							$(".zh").removeClass("cblue").addClass("c9");
							$(".ly").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
							$(".jd").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
							for (var i = 0; i < data.listBorrow.length; i++) {
								sortRule = rank;
								_this.list.push(data.listBorrow[i]);
							}
						})
				}

			},
			progressRank: function () {
				var _this = this;
				var rank = "";
				this.isinp = !this.isinp;
				if (!this.isinp) {
					rank = 1;
					_this.sortRule = 1;
					this.sortRule = rank;
					this.sortType = 3;
					this.pageIndex = 1;
					$.ajax({
							url: Helper.basePath + 'borrowInfo/list.htm',
							type: 'POST',
							dataType: 'json',
							xhrFields: {
								withCredentials: true
							},
							data: {
								pageIndex: this.pageIndex,
								pageSize: this.pageSize,
								sortType: this.sortType,
								sortRule: rank,
								borrowType: obj.borrowType
							}
						})
						.done(function (data) {
							var data = JSON.parse(data);
							_this.data = data;
							if (_this.pageIndex >= 10) {
								$(".look_more").show();
								$(".btn_load_more").hide();
							}
							if (_this.pageIndex < 10) {
								$(".look_more").hide();
								$(".btn_load_more").show();
							}
							if (_this.pageIndex >= _this.data.page.totalCount) {
								_this.loadTxt = '没有更多的数据！';
							}
							if (_this.voucherId == "") {
								_this.loadTxt = '没有更多的数据！';
							}
							_this.list = [];
							$(".jd").removeClass("c9").addClass("cblue").find("i").removeClass("px_icon").addClass("px_ic").toggleClass("px_iconz");
							$(".zh").removeClass("cblue").addClass("c9");
							$(".ly").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
							$(".qx").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
							for (var i = 0; i < data.listBorrow.length; i++) {
								sortRule = rank;
								_this.list.push(data.listBorrow[i]);
							}
						})
				} else {
					rank = -1;
					_this.sortRule = -1;
					this.sortRule = rank;
					this.sortType = 3;
					this.pageIndex = 1;
					$.ajax({
							url: Helper.basePath + 'borrowInfo/list.htm',
							type: 'POST',
							dataType: 'json',
							xhrFields: {
								withCredentials: true
							},
							data: {
								pageIndex: this.pageIndex,
								pageSize: this.pageSize,
								sortType: this.sortType,
								sortRule: this.sortRule,
								borrowType: obj.borrowType
							}
						})
						.done(function (data) {
							var data = JSON.parse(data);
							_this.data = data;
							if (_this.pageIndex >= 10) {
								$(".look_more").show();
								$(".btn_load_more").hide();
							}
							if (_this.pageIndex < 10) {
								$(".look_more").hide();
								$(".btn_load_more").show();
							}
							if (_this.pageIndex >= _this.data.page.totalCount) {
								_this.loadTxt = '没有更多的数据！';
							}
							if (_this.voucherId == "") {
								_this.loadTxt = '没有更多的数据！';
							}
							_this.list = [];
							$(".jd").removeClass("c9").addClass("cblue").find("i").removeClass("px_icon").addClass("px_ic").toggleClass("px_iconz");
							$(".zh").removeClass("cblue").addClass("c9");
							$(".ly").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
							$(".qx").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
							for (var i = 0; i < data.listBorrow.length; i++) {
								_this.list.push(data.listBorrow[i]);
							}
						})
				}

			},
			yb: function () {
				var _this = this;
				$.ajax({
					type: "post",
					url: Helper.basePath + 'member/isLogin.htm',
					async: false,
					datatype: "json",
					xhrFields: {
						withCredentials: true
					},
					success: function (loginData) {
						loginData = JSON.parse(loginData);
						if (loginData.isLogin == 'N') {
							window.location.href = "/src/base/login.html?bUrl=/src/invest/deal.html";
						} else {
							//在此判断跳转体验金标和普通标
							window.location.href = "deal.html";
						}
					},
					error: function (loginData) {

					}
				});
			},
			//约标密码
			//约标输入
			inputPwd: function () {
				var _this = this;
				var isinp = _this.isinp;
				var curnum = _this.curnum;

			},

			pwdIn: function () {
				var _this = this;
				var isinp = _this.isinp;
				var curnum = _this.curnum;
				curnum = 0;
				$('.ipswbox').click(function () {
					$(this).css('border', '#00a0ea 1px solid');
					$('.pswbtn').focus();
					isinp = true;
				})
				$('.pswbtn').keyup(function (event) {

					if (curnum >= 6 || curnum < 0) {
						isinp = false;
					}
					if (isinp) {
						if (event.keyCode == 8 && curnum > 0) {
							curnum -= 1;
							$('.ipswbox i').eq(curnum).removeClass('active');
						} else {
							if (event.keyCode != 8) {
								$('.ipswbox i').eq(curnum).addClass('active');
								curnum += 1;
							}
						}
					} else {
						if (event.keyCode == 8 && curnum > 0) {
							curnum -= 1;
							$('.ipswbox i').eq(curnum).removeClass('active');
							isinp = true;
						}
					}
				})
				$('.pswbtn').blur(function () {
					isinp = false;
					$('.ipswbox').css('border', '#EAF1F5 1px solid');
				})
			},
			//约标确认和取消
			pswCancle: function () {
				var _this = this;
				_this.curnum = 0;
				$(".modal-bg").hide();
				$(".yb-psw").hide();
				$(".ipswbox i").removeClass('active');
				_this.pwdYb = "";
				$("#message").hide();
			},
			pswSure: function () {
				var _this = this;
				$("#message").hide();
				var pwd = $("#pswbtn").val();
				var id = _this.YborrowId;
				$.ajax({
					type: "post",
					url: Helper.basePath + 'borrowInfo/checkpwd.htm',
					async: true,
					datatype: "json",
					data: {
						id: id,
						pwd: pwd
					},
					xhrFields: {
						withCredentials: true
					},
					success: function (data) {
						var data = JSON.parse(data);
						_this.data = data;
						if (data.code == '001') {
							if (_this.pwdYb == '') {
								util.toast('请输入约标密码', 2000)	
							} else {
								util.toast('您输入的密码错误！', 2000)
							}
						}
						if (data.code == '000') {
							$(".ipswbox i").removeClass('active');
							//util.toast(data.message);
							if (_this.voucherId) {
								//判断是否约标
								if (obj.borrowType == 'MAKECAR' || obj.borrowType == 'MAKE') {
									window.location.href = "project_home.html?borrowId=" + id + '&voucherId=' + _this.voucherId + '&source=coupon&ybdata=ekeyfundData';
								} else {
									window.location.href = "project_home.html?borrowId=" + id + '&voucherId=' + _this.voucherId + '&source=coupon';
								}

							} else {
								window.location.href = "project_home.html?borrowId=" + id;
							}
						}

					},
					error: function (data) {

					}
				});

			}
		}
	});
}

iv.xzcard = function () {
	//卡券选择
	var vm = new Vue({
		el: "#xzCard",
		data: {
			data: '',
			expresscard: [],
			curDetailIndex: [],
			cardId: null,
			pageIndex: 1,
			pageSize: 10,
			loadTxt: '加载更多...'
		},
		created: function () {
			this.fetch()
		},
		methods: {
			fetch: function () {
				var _this = this;
				var nowurl = document.URL;
				nowurl = location.href;
				var borrowId = util.getRequest(nowurl, "borrowId");
				var investMoney = util.getRequest(nowurl, "investMoney");
				var voucherId = util.getRequest(nowurl, "voucherId")

				$.ajax({
					type: "post",
					url: Helper.basePath + 'borrowInfo/card.htm',
					async: false,
					data: {
						borrowId: borrowId,
						investMoney: investMoney,
						pageSize: _this.pageSize,
						pageIndex: _this.pageIndex
					},
					datatype: "json",
					xhrFields: {
						withCredentials: true
					},
					success: function (data) {
						var data = JSON.parse(data);
						_this.data = data;

						for (var i = 0; i < _this.data.voucherList.length; i++) {
							var carDlist = _this.data.voucherList[i];
							if (carDlist.id == voucherId) {
								_this.cardId = carDlist.id
							}
							if (carDlist.rewardType === 'CASH_VOUCHER') {
								carDlist.rewardType = 'xian';
								carDlist.rewardName = '现金券';
								carDlist.val = util.fenToYuan(carDlist.val);
							} else if (carDlist.rewardType === 'RATE_VOUCHER') {
								carDlist.rewardType = 'jia';
								carDlist.rewardName = '加息券';
								carDlist.val = carDlist.val + '%';
							} else if (carDlist.rewardType === 'EXPERIENCE_VOUCHER') {
								carDlist.rewardType = 'ti';
								carDlist.rewardName = '体验金券';
								carDlist.val = util.fenToYuan(carDlist.val);
							}
							_this.expresscard.push(carDlist);
						}
						if (_this.pageIndex >= _this.data.page.pageCount) {
							_this.loadTxt = '没有更多的数据！';
						}
					},
					error: function (data) {

					}
				});
			},
			loadMore: function () {
				if (this.pageIndex < this.data.page.pageCount && this.data.page.pageCount != 1) {
					this.pageIndex += 1
					this.fetch();
				}
			},
			cardGoBack: function () {
				history.go(-1)
			},
			showItemDetail: function (index) {
				const i = this.curDetailIndex.indexOf(index)
				if (i > -1) {
					this.curDetailIndex.splice(i, 1)
				} else {
					this.curDetailIndex.push(index)
				}
			},
			choosCard: function (voucherId, cardMo, rewardType) {
				// 神策
				sa.track('coupon_usable', {
					coupon_select_id: voucherId,
					coupon_select_name: '优惠券',
					coupon_select_type: rewardType
				})
				var _this = this;
				var nowurl = window.location.href;
				var borrowId = util.getRequest(nowurl, "borrowId");
				var investMoney = util.getRequest(nowurl, "investMoney");
				var income = util.getRequest(nowurl, "income");
				var integral = util.getRequest(nowurl, "integral");
				var token = util.getRequest(nowurl, "token");
				if (voucherId == this.cardId) {
					this.cardId = ''
				} else {
					this.cardId = voucherId
				}
				$.ajax({
					type: "post",
					url: Helper.basePath + 'member/isLogin.htm',
					async: false,
					data: {},
					datatype: "json",
					xhrFields: {
						withCredentials: true
					},
					success: function (loginData) {
						loginData = JSON.parse(loginData);

						if (loginData.isLogin == 'N') {

							if (rewardType === 'ti') {

								window.location.href = "/src/base/login.html?bUrl=/src/invest/pro_investing.html&borrowId=" + borrowId + "&investMoney=" + '10000' + "&income=1&integral=20&voucherId=" + _this.cardId + "&token=" + token;
							} else {
								window.location.href = "/src/base/login.html?bUrl=/src/invest/investing.html&borrowId=" + borrowId + "&investMoney=" + investMoney + "&income=1&integral=20&voucherId=" + _this.cardId + "&cardMo=" + cardMo;
							}

						} else {
							if (rewardType === 'ti') {
								window.location.href = "pro_investing.html?borrowId=" + borrowId + "&investMoney=" + '10000' + "&income=1&integral=20&voucherId=" + _this.cardId + "&token=" + token;
							} else {
								window.location.href = "investing.html?borrowId=" + borrowId + "&investMoney=" + investMoney + "&income=1&integral=20&voucherId=" + _this.cardId + "&cardMo=" + cardMo;
							}

						}
					},
					error: function (loginData) {

					}
				});
			}
		}
	});
}
// 微信浏览器隐藏标题
is_weixn()
// 回到顶部
// window.onload = function () {
// 	var oTop = document.getElementById( "toTop" );
// 	var screenw = document.documentElement.clientWidth || document.body.clientWidth;
// 	var screenh = document.documentElement.clientHeight || document.body.clientHeight;
// 	window.onscroll = function () {
// 		var scrolltop = document.documentElement.scrollTop || document.body.scrollTop;
// 		if ( scrolltop > 100 ) {
// 			oTop.style.display = "block";
// 		} else {
// 			oTop.style.display = "none";
// 		}
// 	}
// 	oTop.onclick = function () {
// 		document.documentElement.scrollTop = document.body.scrollTop = 0;
// 	}
// }