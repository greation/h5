var vm = {};
vm.re = function () {
    new Vue({
        el: '#re',
        data: {
            inSource: util.hrefSplit(window.location.href),
            isLogin: false,
            current_url: Helper.webPath + '/src/activity/redgift/index.html',
            ruleData: '',
            message: '',
            isActive:true,
            isActive1:true,
            isActive2:true,
            isGray: false,
            isGray1: false,
            isGray2: false,
            firstRedNum:"50",
            secondRedNum:"20",
            thirdRedNum:"10"
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
        },
        methods: {

            //当前活动状态
            activeStatus: function () {
                var _this = this;
                var source = util.hrefSplit(window.location.href);
                var num = 0;
                $.ajax({
                    url: Helper.basePath + '/twoYears/index.htm',
                    type: 'POST',
                    dataType: 'json',
                    async: false,
                    xhrFields: {
                        withCredentials: true
                    },
                })
                    .done(function (data) {
                        var data = JSON.parse(data);
                        _this.ruleData = data.rule;
                        _this.message = data.message;
                        _this.firstRedNum =data.firstRedNum;
                        _this.secondRedNum =data.secondRedNum;
                        _this.thirdRedNum =data.thirdRedNum;
                        if (data.activityTitle === "") {
                            document.title = "请后台配置活动名称";
                        } else {
                            document.title = data.activityTitle;
                        }
                        if(_this.firstRedNum =="0"||_this.firstRedNum <0){
                            _this.isActive =false;
                            _this.isGray =true;
                        }
                        if(_this.secondRedNum =="0"||_this.secondRedNum <0){
                            _this.isActive1 =false;
                            _this.isGray1 =true;
                        }
                        if(_this.thirdRedNum =="0"||_this.thirdRedNum <0){
                            _this.isActive2 =false;
                            _this.isGray2 =true;
                        }
                        if (data.code != '000') {
                            util.alert(data.message, function () {
                                window.location.href = '/src/index/index.html';
                            })
                        }
                    })
            },

            goinvesting: function () {
                //var source = util.hrefSplit(window.location.href).app;
                sa.track('int_click', {
                    campaignName: '周年庆限量抢红包活动',
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
            redgift: function (type) {
                var _this = this;
                if(type==1){
                    sa.track('int_click', {
                        campaignName: '周年庆限量抢红包活动',
                        lpUrl: this.current_url,
                        elementId: $("#redgift1").attr('id'),
                        elementContent: '领取红包',
                        elementName: '领取红包'
                    });
                    if(!_this.isActive){
                        return false;
                    }
                }
                if(type==2){
                    sa.track('int_click', {
                        campaignName: '周年庆限量抢红包活动',
                        lpUrl: this.current_url,
                        elementId: $("#redgift2").attr('id'),
                        elementContent: '领取红包',
                        elementName: '领取红包'
                    });
                    if(!_this.isActive1){
                        return false;
                    }
                }
                if(type==3){
                    sa.track('int_click', {
                        campaignName: '周年庆限量抢红包活动',
                        lpUrl: this.current_url,
                        elementId: $("#redgift3").attr('id'),
                        elementContent: '领取红包',
                        elementName: '领取红包'
                    });
                    if(!_this.isActive2){
                        return false;
                    }
                }

                if (_this.isLogin) {
                    $.ajax({
                        url: Helper.basePath + '/twoYears/receiveRed.htm',
                        type: 'POST',
                        dataType: 'json',
                        async: false,
                        xhrFields: {
                            withCredentials: true
                        },
                        data:{
                            type:type
                        },
                    })
                        .done(function (data) {
                            var data = JSON.parse(data);
                            if(data.message=="该红包已领完"){
                                util.alert(data.message, function () {
                                    util.baseLink("/src/activity/redgift/index.html",0);
                                })
                            }else if(data.code==="000"){
                               util.toast("领取成功");
                                util.baseLink("/src/account/coupon.html",0);
                            }else {
                                util.toast(data.message);
                            }
                        })
                } else {
                    util.confirmAct('请登录后领取', '取消', '去登录', function () {
                        if (APP_FLAG === 'APP_IOS') {
                            window.webkit.messageHandlers.login.postMessage('');
                        } else if (APP_FLAG === 'APP_ANDROID') {
                            android.login();
                        } else {
                            window.location.href = '/src/base/login.html?bUrl=/src/activity/redgift/index.html';
                        }
                    })
                }
            }
        }

    })
}