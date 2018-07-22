var vm = {};
vm.activity = function () {
  new Vue({
    el: '#activity',
    data: {
      isShowRule: false,
      isShowShare: false,
      footerIndex: 1,
      inSource: util.hrefSplit(window.location.href),
      isLogin: false,
      current_url: Helper.webPath + '/src/activity/april/index.html',
      indexRuleData: '',
      happyRuleData: '',
      wishRuleData: '',
      shimingStatus: 0,
      chongzhiStatus: 0,
      touziStatus: 0,
      fenxiangStatus: 0,
      dayIndex: 0,
      isShowWishList: false,
      wishList: '',
      wishVal: window.localStorage.getItem('wishVal')
    },
    created: function () {
      var url = window.location.href,
        v = url.match(/anniversary\/([\w\.]*)/)[1]
      if (v == 'index.html') {
        this.footerIndex = 1
      } else if (v == 'happy.html') {
        this.footerIndex = 2
      } else if (v == 'wish.html') {
        this.footerIndex = 3
      }

      var _this = this
      this.indexActiveStatus()
      this.happyActiveStatus()
      this.wishActiveStatus()
      $.ajax({
          url: Helper.basePath + 'member/getUser.htm?a=' + Math.random(),
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
        .fail(function () {})

    },
    methods: {
      indexActiveStatus: function () {
        var _this = this;
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
            _this.indexRuleData = data.rule;
            if (data.activityTitle === "") {
              document.title = "请后台配置活动名称";
            } else {
              document.title = data.activityTitle;
            }
            // if (data.code === '999') {
            //   _this.overActivity = true;
            //   util.alert(data.message, function () {
            //     window.location.href = '/src/index/index.html';
            //   })
            // }
          })
      },
      happyActiveStatus: function () {
        var _this = this;
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
            // _this.happyRuleData = data.rule;
            _this.happyRuleData = '积分happy翻'
            if (data.activityTitle === "") {
              document.title = "请后台配置活动名称";
            } else {
              document.title = data.activityTitle;
            }
            // if (data.code === '999') {
            //   _this.overActivity = true;
            //   util.alert(data.message, function () {
            //     window.location.href = '/src/index/index.html';
            //   })
            // }
          })
      },
      wishActiveStatus: function () {
        var _this = this;
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
            _this.wishRuleData = data.rule;
            if (data.activityTitle === "") {
              document.title = "请后台配置活动名称";
            } else {
              document.title = data.activityTitle;
            }
            // if (data.code === '999') {
            //   _this.overActivity = true;
            //   util.alert(data.message, function () {
            //     window.location.href = '/src/index/index.html';
            //   })
            // }
          })
      },
      punch: function () {
        if (this.isLogin) {
          this.dayIndex += 1
        } else {
          this.toLogin('index.html')
        }
      },
      getWishList: function () {
        if (this.isLogin) {
          this.isShowWishList = true
        } else {
          this.toLogin('wish.html')
        }
      },
      toWish: function (e) {
        if (this.isLogin) {
          util.confirmAct('<div class="alert-header">确认许愿</div>阿萨德饭店', '取消', '确定', function () {
            util.toast('许愿成功', 2000)
          })
        } else {
          this.toLogin('wish.html')
        }
      },
      toShiming: function () {
        if (this.isLogin) {
          if (this.shimingStatus == 0) {
            window.location.href = '/src/base/real_name.html'
          } else if (this.shimingStatus == 1) {
            alert('领取积分')
          }
        } else {
          this.toLogin('index.html')
        }
      },
      toChongzhi: function () {
        if (this.isLogin) {
          if (APP_FLAG === 'APP_IOS') {
            window.webkit.messageHandlers.goRecharge.postMessage('');
          } else if (APP_FLAG === 'APP_ANDROID') {
            android.goRecharge();
          } else {
            window.location.href = '/src/account/charge.html'
          }
        } else {
          this.toLogin('index.html')
        }
      },
      toTouzi: function () {
        if (this.isLogin) {
          this.toInvest()
        } else {
          this.toLogin('index.html')
        }
      },
      toFenxiang: function () {
        if (this.isLogin) {
          this.isShowShare = true
        } else {
          this.toLogin('index.html')
        }
      },
      projectLink: function (url, activeUrl) {
        if (this.isLogin) {
          window.location.href = url
        } else {
          this.toLogin(activeUrl)
        }
      },
      toInvest: function () {
        if (APP_FLAG === 'APP_IOS') {
          window.webkit.messageHandlers.goInvest.postMessage('');
        } else if (APP_FLAG === 'APP_ANDROID') {
          android.goInvest();
        } else {
          window.location.href = '/src/invest/index.html'
        }
      },
      setWish: function () {
        window.localStorage.setItem('wishVal', this.wishVal)
        if (this.isLogin) {
          if (this.wishVal == '') {
            util.toast('请输入您的心愿')
            return
          }
          util.alert('<div class="alert-header">提交成功</div>您的心愿已收集~', function () {
            window.localStorage.setItem('wishVal', '')
            this.wishVal = ''
            location.reload()
          })
        } else {
          this.toLogin('wish.html')
        }
      },
      toLogin: function (url) {
        util.confirmAct('请先登录', '取消', '去登录', function () {
          if (APP_FLAG === 'APP_IOS') {
            window.webkit.messageHandlers.login.postMessage('');
          } else if (APP_FLAG === 'APP_ANDROID') {
            android.login();
          } else {
            window.location.href = '/src/base/login.html?bUrl=/src/activity/anniversary/' + url;
          }
        })
      },
      sensorsClick: function (url, id, content, name) {
        sa.track('int_click', {
          campaignName: '2周年庆活动',
          lpUrl: url,
          elementId: id,
          elementContent: content,
          elementName: name
        })
      }
    }
  })
}