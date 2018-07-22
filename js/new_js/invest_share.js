//creat by gannicus on 2017/4/22
var iv = {}
// 投资列表
iv.invest = function (obj) {
	var vm = new Vue({
		el: "#invest",
		data: {
			data: '', // 投资列表
			isMarkEnd: false,
			isCarEnd: false,
			isHouseEnd: false,
			borrowType: null,
			sortType: 0,
			sortRule: 0,
			pwdYb: ''
		},
		created: function () {
			var _this = this;
			var nowurl = window.location.href;
			nowurl = encodeURI(nowurl);
			var borrowType = util.getRequest(nowurl, "borrowType");
			_this.borrowType = borrowType
			if (_this.borrowType == '0') {
				document.title = "房月盈"
			}
			if (_this.borrowType == '1') {
				document.title = "车满盈"
			}
			if (_this.borrowType == '2') {
				document.title = "预约专享"
			}
			if (_this.borrowType == '3') {
				document.title = "企信盈"
			}
			$.ajax({
				type: "post",
				url: Helper.basePath + 'borrowInfo/getBorrowInfoListByType.htm',
				async: false,
				data: {
					borrowType: _this.borrowType,
					sortType: _this.sortType,
					sortRule: _this.sortRule
				},
				datatype: "json",
				xhrFields: {
					withCredentials: true
				},
				success: function (data) {
					var data = JSON.parse(data);
					_this.data = data;

					if (_this.data.investListBorrow.length < 1) {
						_this.isCarEnd = true
						_this.isMarkEnd = true
						_this.isHouseEnd = true
					}
				},
				error: function (data) {

				}
			})
		},
		methods: {
			commenRank: function () {
				var _this = this;
				this.sortType = 0
				this.sortRule = 0
				$.ajax({
						url: Helper.basePath + 'borrowInfo/getBorrowInfoListByType.htm',
						type: 'POST',
						dataType: 'json',
						xhrFields: {
							withCredentials: true
						},
						data: {
							borrowType: _this.borrowType,
							sortType: _this.sortType,
							sortRule: _this.sortRule
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
					})


			},
			rateRank: function () {
				var _this = this;
				var rank = "";
				this.isinp = !this.isinp;
				if (!this.isinp) {
					rank = -1;
					this.sortRule = rank;
					this.sortType = 1;
					this.pageIndex = 1;
					$.ajax({
						url: Helper.basePath + 'borrowInfo/getBorrowInfoListByType.htm',
						type: 'POST',
						dataType: 'json',
						xhrFields: {
							withCredentials: true
						},
						data: {
							borrowType: _this.borrowType,
							sortType: _this.sortType,
							sortRule: _this.sortRule
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
						if (_this.voucherId == "") {
							_this.loadTxt = '没有更多的数据！';
						}
						_this.list = [];
						$(".ly").removeClass("c9").addClass("cblue").find("i").removeClass("px_icon").addClass("px_ic").toggleClass("px_iconz");
						$(".zh").removeClass("cblue").addClass("c9");
						$(".qx").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
						$(".jd").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
					})
				} else {
					rank = 1;
					this.sortRule = rank;
					this.sortType = 1;
					this.pageIndex = 1;
					$.ajax({
						url: Helper.basePath + 'borrowInfo/getBorrowInfoListByType.htm',
						type: 'POST',
						dataType: 'json',
						xhrFields: {
							withCredentials: true
						},
						data: {
							borrowType: _this.borrowType,
							sortType: _this.sortType,
							sortRule: _this.sortRule
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
						if (_this.voucherId == "") {
							_this.loadTxt = '没有更多的数据！';
						}
						_this.list = [];
						$(".ly").removeClass("c9").addClass("cblue").find("i").removeClass("px_icon").addClass("px_ic").toggleClass("px_iconz");
						$(".zh").removeClass("cblue").addClass("c9");
						$(".qx").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
						$(".jd").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
					})
				}

			},
			dateRank: function () {
				var _this = this;
				var rank = "";
				this.isinp1 = !this.isinp1;
				if (!this.isinp1) {
					rank = -1;
					this.sortRule = rank;
					this.sortType = 2;
					this.pageIndex = 1;

					$.ajax({
						url: Helper.basePath + 'borrowInfo/getBorrowInfoListByType.htm',
						type: 'POST',
						dataType: 'json',
						xhrFields: {
							withCredentials: true
						},
						data: {
							borrowType: _this.borrowType,
							sortType: _this.sortType,
							sortRule: _this.sortRule
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
						if (_this.voucherId == "") {
							_this.loadTxt = '没有更多的数据！';
						}
						_this.list = [];
						$(".qx").removeClass("c9").addClass("cblue").find("i").removeClass("px_icon").addClass("px_ic").toggleClass("px_iconz");
						$(".zh").removeClass("cblue").addClass("c9");
						$(".ly").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
						$(".jd").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
					})
				} else {
					rank = 1;

					this.sortRule = rank;
					this.sortType = 2;

					this.pageIndex = 1;
					$.ajax({
						url: Helper.basePath + 'borrowInfo/getBorrowInfoListByType.htm',
						type: 'POST',
						dataType: 'json',
						xhrFields: {
							withCredentials: true
						},
						data: {
							borrowType: _this.borrowType,
							sortType: _this.sortType,
							sortRule: _this.sortRule
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
						if (_this.voucherId == "") {
							_this.loadTxt = '没有更多的数据！';
						}
						_this.list = [];
						$(".qx").removeClass("c9").addClass("cblue").find("i").removeClass("px_icon").addClass("px_ic").toggleClass("px_iconz");
						$(".zh").removeClass("cblue").addClass("c9");
						$(".ly").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
						$(".jd").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
					})
				}

			},
			progressRank: function () {
				var _this = this;
				var rank = "";
				this.isinp2 = !this.isinp2;
				if (!this.isinp2) {
					rank = -1;
					this.sortRule = rank;
					this.sortType = 3;
					this.pageIndex = 1;
					$.ajax({
							url: Helper.basePath + 'borrowInfo/getBorrowInfoListByType.htm',
							type: 'POST',
							dataType: 'json',
							xhrFields: {
								withCredentials: true
							},
							data: {
								borrowType: _this.borrowType,
								sortType: _this.sortType,
								sortRule: _this.sortRule
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
							if (_this.voucherId == "") {
								_this.loadTxt = '没有更多的数据！';
							}
							_this.list = [];
							$(".jd").removeClass("c9").addClass("cblue").find("i").removeClass("px_icon").addClass("px_ic").toggleClass("px_iconz");
							$(".zh").removeClass("cblue").addClass("c9");
							$(".ly").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
							$(".qx").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
						})
				} else {
					rank = 1;

					this.sortRule = rank;
					this.sortType = 3;
					this.pageIndex = 1;
					$.ajax({
							url: Helper.basePath + 'borrowInfo/getBorrowInfoListByType.htm',
							type: 'POST',
							dataType: 'json',
							xhrFields: {
								withCredentials: true
							},
							data: {
								borrowType: _this.borrowType,
								sortType: _this.sortType,
								sortRule: _this.sortRule
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
							if (_this.voucherId == "") {
								_this.loadTxt = '没有更多的数据！';
							}
							_this.list = [];
							$(".jd").removeClass("c9").addClass("cblue").find("i").removeClass("px_icon").addClass("px_ic").toggleClass("px_iconz");
							$(".zh").removeClass("cblue").addClass("c9");
							$(".ly").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
							$(".qx").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
						})
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
			fetchDataList: function () {
				var _this = this;
				var nowurl = window.location.href;
				nowurl = encodeURI(nowurl);
				var borrowType = util.getRequest(nowurl, "borrowType");
				$.ajax({
					type: "post",
					url: Helper.basePath + 'borrowInfo/getBorrowInfoListByType.html',
					async: false,
					data: {
						borrowType: borrowType
					},
					datatype: "json",
					xhrFields: {
						withCredentials: true
					},
					success: function (data) {
						var data = JSON.parse(data);
						_this.data = data;
					},
					error: function (data) {

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
							
							var nowurl = window.location.href;
							nowurl = encodeURI(nowurl);
							var borrowType = util.getRequest(nowurl, "borrowType");
							_this.borrowType = borrowType
							$.ajax({
								type: "post",
								url: Helper.basePath + 'borrowInfo/getBorrowInfoListByType.htm',
								async: false,
								data: {
									borrowType: _this.borrowType,
									sortType: _this.sortType,
									sortRule: _this.sortRule
								},
								datatype: "json",
								xhrFields: {
									withCredentials: true
								},
								success: function (data) {
									var data = JSON.parse(data);
									_this.data = data;

									if (_this.data.investListBorrow.length < 1) {
										_this.isCarEnd = true
										_this.isMarkEnd = true
										_this.isHouseEnd = true
									}
								},
								error: function (data) {

								}
							})
						}
						if (data.code == '000') {
							$(".ipswbox i").removeClass('active');
							//util.toast(data.message);
							if (_this.voucherId) {
								//判断是否约标
								if (obj.borrowType == 'MAKECAR' || obj.borrowType == 'MAKE' || obj.borrowType == 'MAKEQIXIN') {
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

			},
			toMyMark: function() {
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
							util.baseLink('/src/base/login.html?bUrl=/src/invest/list_all.html?borrowType=2', 1000);
						} else {
							util.baseLink('/src/invest/my_mark.html', 0)
							
						}
					},
					error: function (data) {
						
					}
				});
				
			},
			fetchMyMarkList: function () {
				var _this = this;
				$.ajax({
					type: "post",
					url: Helper.basePath + 'member/getMyMakeBorrowlist.htm',
					async: false,
					data: "",
					datatype: "json",
					xhrFields: {
						withCredentials: true
					},
					success: function (data) {
						var data = JSON.parse(data);
						_this.myMarkList = data;
					},
					error: function (data) {

					}
				});
			}
		}
	})
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