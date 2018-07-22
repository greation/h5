var vm = {};
vm.re = function () {
    new Vue({
        el: '#re',
        data: {
            inSource: util.hrefSplit(window.location.href),
            isLogin: false,
            current_url: Helper.webPath + '/src/activity/april/index.html',
            ruleData: '',
            overActivity: false,
            message: ''
        },
        created: function () {
            var _this = this;
            this.activeStatus();
            $.ajax({
                url: Helper.basePath + 'member/getUser.htm?a='+Math.random(),
                type: 'POST',
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                }
            })
                .done(function (data) {
                    var data = JSON.parse(data);
                    if (data.isLogin === 'Y' || _this.inSource.userId || android.getUserId()) {
                        _this.isLogin = true;
                    }
                })
                .fail(function () {
                })
        },
        methods: {

            //当前活动状态
            activeStatus: function () {
                var _this = this;
                var source = util.hrefSplit(window.location.href);
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
                        'activityTypeStr': "APRIL_MAKE_ACTIVITY"
                    }
                })
                    .done(function (data) {
                        var data = JSON.parse(data);
                        _this.ruleData = data.rule;
                        _this.message = data.message;
                        if (data.activityTitle === "") {
                            document.title = "请后台配置活动名称";
                        } else {
                            document.title = data.activityTitle;
                        }
                        if (data.code === '999') {
                            _this.overActivity = true;
                            util.alert(data.message, function () {
                                window.location.href = '/src/index/index.html';
                            })
                        }
                    })
            },
            ybLink0: function () {
                var _this = this;
                var type = 6;
                sa.track('int_click', {
                    campaignName: '4月站内活动',
                    lpUrl: this.current_url,
                    elementId: $(".yblinkbg0").attr('id'),
                    elementContent: '约标解锁',
                    elementName: '约标解锁'
                });
                if (_this.overActivity) {
                    util.toast(_this.message);
                } else {
                    this.comMethosd(type);
                }
            },
            ybLink1: function () {
                var _this = this;
                var type = 12;
                sa.track('int_click', {
                    campaignName: '4月站内活动',
                    lpUrl: this.current_url,
                    elementId: $(".yblinkbg1").attr('id'),
                    elementContent: '约标解锁',
                    elementName: '约标解锁'
                });
                if (_this.overActivity) {
                    util.toast(_this.message);
                } else {
                    this.comMethosd(type);
                }
            },
            ybLink2: function () {
                var _this = this;
                var type = 7;
                sa.track('int_click', {
                    campaignName: '4月站内活动',
                    lpUrl: this.current_url,
                    elementId: $(".yblinkbg2").attr('id'),
                    elementContent: '约标解锁',
                    elementName: '约标解锁'
                });
                if (_this.overActivity) {
                    util.toast(_this.message);
                } else {
                    this.comMethosd(type);
                }
            },
            ybLink3: function () {
                var _this = this;
                var type = 8;
                sa.track('int_click', {
                    campaignName: '4月站内活动',
                    lpUrl: this.current_url,
                    elementId: $(".yblinkbg3").attr('id'),
                    elementContent: '约标解锁',
                    elementName: '约标解锁'
                });
                if (_this.overActivity) {
                    util.toast(_this.message);
                } else {
                    this.comMethosd(type);
                }
            },
            ybLink4: function () {
                var _this = this;
                var type = 9;
                sa.track('int_click', {
                    campaignName: '4月站内活动',
                    lpUrl: this.current_url,
                    elementId: $(".yblinkbg4").attr('id'),
                    elementContent: '约标解锁',
                    elementName: '约标解锁'
                });
                if (_this.overActivity) {
                    util.toast(_this.message);
                } else {
                    this.comMethosd(type);
                }
            },
            ybLink5: function () {
                var _this = this;
                var type = 10;
                sa.track('int_click', {
                    campaignName: '4月站内活动',
                    lpUrl: this.current_url,
                    elementId: $(".yblinkbg5").attr('id'),
                    elementContent: '约标解锁',
                    elementName: '约标解锁'
                });
                if (_this.overActivity) {
                    util.toast(_this.message);
                } else {
                    this.comMethosd(type);
                }
            },
            ybLink6: function () {
                var _this = this;
                var type = 11;
                sa.track('int_click', {
                    campaignName: '4月站内活动',
                    lpUrl: this.current_url,
                    elementId: $(".yblinkbg6").attr('id'),
                    elementContent: '约标解锁',
                    elementName: '约标解锁'
                });
                if (_this.overActivity) {
                    util.toast(_this.message);
                } else {
                    this.comMethosd(type);
                }
            },
            goinvesting: function () {
                //var source = util.hrefSplit(window.location.href).app;
                sa.track('int_click', {
                    campaignName: '4月站内活动',
                    lpUrl: this.current_url,
                    elementId: $("#goinvesting").attr('id'),
                    elementContent: '立即投资',
                    elementName: '立即投资'
                });
                if (APP_FLAG === 'APP_IOS') {
                    window.webkit.messageHandlers.goInvest.postMessage('');
                } else if (APP_FLAG === 'APP_ANDROID') {
                    android.goInvest();
                } else {
                    util.baseLink('/src/invest/index.html', 0);
                }
            },
            comMethosd: function (type) {
                var _this = this;
                //var source = util.hrefSplit(window.location.href).app;
                if (_this.isLogin) {
                    if (APP_FLAG === 'APP_IOS') {
                        window.webkit.messageHandlers.reserveWithType.postMessage(type);
                    } else if (APP_FLAG === 'APP_ANDROID') {
                        android.goReserve(type);
                    } else {
                        window.location.href = '/src/invest/deal.html?type=' + type;
                    }
                } else {
                    util.confirmAct('请登录后进行约标', '取消', '去登录', function () {
                        if (APP_FLAG === 'APP_IOS') {
                            window.webkit.messageHandlers.login.postMessage('');
                        } else if (APP_FLAG === 'APP_ANDROID') {
                            android.login();
                        } else {
                            window.location.href = '/src/base/login.html?bUrl=/src/activity/april/index.html';
                        }
                    })
                }
            }
        }

    })
}