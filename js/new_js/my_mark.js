//creat by gannicus on 2017/4/22
var iv = {}
// 投资列表
iv.myMark = function (obj) {
	var vm = new Vue({
		el: "#myMark",
		data: {
			pwdYb: '',
			data: ''
		},
		created: function () {
			this.fetchMyMarkList()
		},
		methods: {
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
						_this.data = data;
					},
					error: function (data) {

					}
				});
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
							_this.fetchMyMarkList()
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