//creat by gannicus on 2017/4/22
var iv = {}
// 投资列表
iv.invest = function (obj) {
	var vm = new Vue({
		el: "#invest",
		data: {
			data: '',
			dataJilu: '',
			jilus: [],
			pageIndex: 1,
			pageSize: 10,
			loadTxt: '加载更多...',
			auditIndexActive: false,
			source: util.hrefSplit(window.location.href).source,
			voucherId: util.hrefSplit(window.location.href).voucherId,
			newVoucherId: '',
			voucherMoney: ''
		},
		computed: {
			carIntroList() {
				const ret = []
				if (this.data.userFor && this.data.borrow.isShowUserFor == 'YES') {
					ret.push({
						title: '融资详情',
						content: [
							{
								content: this.data.userFor
							}
						]
					})
				}
				if (this.data.borrow.borrowerDesc) {
					ret.push({
						title: '融资方介绍',
						content: [
							{
								content: this.data.borrow.borrowerDesc
							}
						]
					})
				}
				if (this.data.borrowUserType == 'PERSON' && (this.data.borrow.borrowType == 'GYCAR' || this.data.borrow.borrowType == 'MAKECAR')) {
					ret.push({
						title: '融资方信息',
						content: [
							{
								title: '姓名：',
								content: this.data.borrowUserName
							},
							{
								title: '性别：',
								content: this.data.borrowUserSex
							},
							{
								title: '年龄：',
								content: this.data.borrowUserAge
							},
							{
								title: '婚姻状况：',
								content: this.data.borrowUserMaritalStatus
							},
							{
								title: '身份证：',
								content: this.data.borrowUserCardNumber
							},
							{
								title: '年收入：',
								content: this.data.borrowUserIncome
							}
						]
					})
				}
				if (this.data.borrow.borrowType == 'GYCAR' || this.data.borrow.borrowType == 'MAKECAR') {
					ret.push({
						title: '车辆信息',
						content: [
							{
								title: '车辆型号：',
								content: this.data.carModel
							},
							{
								title: '车辆牌照：',
								content: this.data.carLicence
							},
							{
								title: '首次上牌时间：',
								content: this.data.carFirstTime
							},
							{
								title: '车辆购买价：',
								content: this.data.carBuyPrices
							},
							{
								title: '车辆评估价：',
								content: this.data.carFuturePrices
							},
							{
								title: '已行驶里程数：',
								content: this.data.carODO
							}
						]
					})
				}
				if (this.data.otherInfoList.length > 0) {
					ret.push({
						title: '其他资料',
						content: this.data.otherInfoList
					})
				}

				return ret
			}
		},
		methods: {
			fetch: function () {
				var _this = this;
				var nowurl = window.location.href;
				var borrowId = util.getRequest(nowurl, "borrowId");
				$.ajax({
					type: "post",
					url: Helper.basePath + 'borrowInfo/getBorrowDetail.htm',
					async: false,
					data: {
						borrowId: borrowId
					},
					datatype: "json",
					xhrFields: {
						withCredentials: true
					},
					success: function (data) {
						var data = JSON.parse(data);
						_this.data = data;
						if (data.borrow.borrowType === "EXPERIENCE") {
							_this.newVoucherId = data.voucher.id;
							_this.voucherMoney = data.voucher.val / 100;
						}
						document.title = data.borrow.borrowName ? data.borrow.borrowName : '标的详情'
						Vue.nextTick(function () {
							var swiper = new Swiper('.swiper-fengxian', {
								slidesPerView: 3.5,
								spaceBetween: 0,
								freeMode: true
							});
							var tabsSwiper = new Swiper('.swiper-container', {
								speed: 500,
								autoHeight: true,
								onSlideChangeStart: function () {
									$('.tabs').each(function () {
										$(this).children('.active').removeClass('active')
										$(this).children('a').eq(tabsSwiper.activeIndex).addClass('active')
									})

								}
							});
							window.tabsSwiper = tabsSwiper
							if (!window.$tabHeader) {
								window.$tabHeader = $('.tabs').clone()
								$tabHeader.addClass('tabs-header')

								$tabHeader.appendTo('.swiper-tabs')
								$tabHeader.hide()
								$(window).scroll(function () {
									if (window.scrollY >= $('.tabs').offset().top) {
										$tabHeader.show()
									} else {
										$tabHeader.hide()
									}
								})
							}

							$(".tabs a").on('touchstart mousedown', function (e) {
								e.preventDefault()
								var index = $(this).index()
								window.index = index
								$('.tabs').each(function () {
									$(this).children('.active').removeClass('active')
									$(this).children('a').eq(index).addClass('active')
								})

								tabsSwiper.slideTo(index, 500, false);

							});
							$('.content-slide').each(function () {
								var first = $('.content-slide:first-child')
								$('em', first).removeClass('down')
								$('.slide-td', first).removeClass('hide')
								$('.slide-th', $(this)).click(function () {
									var swiperIndex = window.index | 0


									var $this = $(this)
									var $td = $this.siblings()
									if (!$('em', $this).hasClass('down')) {
										$td.hide()
										$('em', $this).addClass('down')
									} else {
										$td.show()
										$('em', $this).removeClass('down')
									}
									if (window.tabsSwiper) {
										window.tabsSwiper.slideTo(swiperIndex, 1000, false)
									}
									return
								})
							});

							var AuditSwiper = new Swiper('.swiper-audit', {
								prevButton: '.swiper-button-prev',
								nextButton: '.swiper-button-next'
							})
							window.AuditSwiper = AuditSwiper

						})
					},
					error: function (data) {

					}
				});
			},
			setAuditSwiper: function (index) {
				if (window.AuditSwiper) {
					window.AuditSwiper.slideTo(index, 0, false)
				}
			},
			getList: function () {
				var _this = this;
				var nowurl = window.location.href;
				var borrowId = util.getRequest(nowurl, "borrowId");
				$.ajax({
					type: "post",
					url: Helper.basePath + 'borrowInfo/getBorrowInvestRecord.htm',
					async: false,
					data: {
						borrowId: borrowId,
						pageIndex: this.pageIndex,
						pageSize: this.pageSize
					},
					datatype: "json",
					xhrFields: {
						withCredentials: true
					},
					success: function (data) {
						var data = JSON.parse(data);
						_this.dataJilu = data;
						if (data.isLogin === 'N') {
							util.toast('请登录');
							window.location.href = '/src/base/login.html';
						} else {
							for (var i = 0; i < data.list.length; i++) {
								_this.jilus.push(data.list[i]);
							}
						}
						if (window.tabsSwiper) {
							window.tabsSwiper.container.children('.swiper-wrapper').height('auto')
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
								if (_this.borrowTypeN == 'MAKECAR' || _this.borrowTypeN == 'MAKE') {
									window.location.href = "investing.html?borrowId=" + borrowId + '&voucherId=' + _this.voucherId + '&source=coupon&ybdata=ekeyfundData';
								} else {
									window.location.href = "investing.html?borrowId=" + borrowId + '&voucherId=' + _this.voucherId + '&source=coupon';
								}
							} else {
								window.location.href = "investing.html?borrowId=" + borrowId + '&voucherId='
							}
						}
					},
					error: function (loginData) {

					}
				});
			},
			expresInvest: function () {
				var _this = this;
				var nowurl = window.location.href;
				var borrowId = util.getRequest(nowurl, "borrowId");
				_this.token = _this.data.token;
				var token = _this.data.token;

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
							util.baseLink('/src/base/login.html?bUrl=/src/index/index.html&token=+ token', 1000);
						} else {
							if (_this.voucherId) {
								window.location.href = "pro_investing.html?borrowId=" + borrowId + "&token=" + token + '&voucherId=' + _this.voucherId + '&source=coupon';
							} else {
								window.location.href = "pro_investing.html?borrowId=" + borrowId + "&token=" + token + '&voucherId=' + _this.newVoucherId + '&investMoney=' + _this.voucherMoney;
							}

						}
					},
					error: function (data) {

					}
				});


			}
		},
		mounted() {
			this.fetch()
			this.getList()
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