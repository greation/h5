var vm = {};
vm.index = function () {
	$(function () {
		var current_url = location.href;
		//活动规则 01
		$('#getCard').bind('click', function () {
			sa.track('element_click', {
				campaignName: '公司乔迁庆祝活动',
				lpUrl: current_url,
				elementId: $(this).attr('id'),
				elementContent: '领取乔迁红包',
				elementName: '领取乔迁红包'
			});
		})
	})

	//创建vue实例
	activityVm = new Vue({
		el: '#index',
		data: {
            isActive:false,
			inSource: util.hrefSplit(window.location.href)
		},
		computed: {

		},
		created: function () {
			var _this=this;
			this.activeStatus();
                $.ajax({
                    url: Helper.basePath + 'activityTurntable/isReceive.htm',
                    type: 'POST',
                    dataType: 'json',
                    async: false,
                    xhrFields: {
                        withCredentials: true
                    },
                    data: {
                        activityTypeStr: 'HOUSEMOVEJOY'
                    }
                }).done(function (data) {
                    var data = JSON.parse(data);
                    if(data.code==='0003'){
                        _this.isActive =true;
                    }
                })

		},
		methods: {
			btn:function () {
				var _this=this;
				if(!_this.isActive){
                    $.ajax({
                        url: Helper.basePath + 'activityTurntable/getHouseMoveReward.htm',
                        type: 'POST',
                        dataType: 'json',
                        async: false,
                        xhrFields: {
                            withCredentials: true
                        },
                        data: {
                            activityTypeStr: 'HOUSEMOVEJOY'
                        }
                    }).done(function (data) {
                        var data = JSON.parse(data);
                        if(data.isLogin==='N'){
                            if (APP_FLAG === 'APP_ANDROID') {
                                android.login();
                            } else if (APP_FLAG === 'APP_IOS') {
                                window.webkit.messageHandlers.login.postMessage('');
                            } else {
                                window.location.href = '/src/base/login.html?bUrl=/src/activity/newoffice/index.html';
                            }
                        }else {
                            if(data.code==='000'){
                                util.toast('领取成功，稍后请至“我的卡券”查看');
                                _this.isActive =true;
                            }
                            if(data.code==='0003'){
                                _this.isActive =true;
                            }
                        }
                    })
                }
            },
            activeStatus: function () {
                var _self = this;
                $.ajax({
                    url: Helper.basePath + 'activityTurntable/activity.htm',
                    type: 'POST',
                    dataType: 'json',
                    async: false,
                    xhrFields: {
                        withCredentials: true
                    },
                    data: {
                        activityTypeStr: 'HOUSEMOVEJOY',
                        useCommonTemplate:'NO'
                    }
                }).done(function (data) {
                    var data = JSON.parse(data);
                    _self.ruleData = data.rule;
                    _self.activityUrl = data.relationUrl;
                    if(data.activityTitle===""){
                        document.title = "请后台配置活动名称";
                    }else{
                        document.title = data.activityTitle;
                    }
                    if (data.code !== '000') {
                        util.alert(data.message, function () {
                            window.location.href = '/src/index/index.html';
                        })
                    }
                })
            }
		}
	})
}