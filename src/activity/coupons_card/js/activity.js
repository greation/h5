var vm = {};
vm.activity = function () {
  new Vue({
    el: '#activity',
    data: {
      data: '',
      buttonVal: '立即领取活动卡券',
      isLogin: false,
    },
    created: function () {
      var _this = this
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
          if (data.isLogin === 'Y') {
            _this.isLogin = true;
          }
        })
        .fail(function () {})

    },
    methods: {
      fetch: function () {
        var _this = this
        $.ajax({
            url: Helper.basePath + 'forVoucher.htm',
            type: 'POST',
            dataType: 'json',
            async: false,
            xhrFields: {
              withCredentials: true
            }
          })
          .done(function (data) {
            if (data.isSuccess) {
              /*恭喜，领取成功*/
              util.confirmAct('<div class="tip">恭喜，领取成功！<p>您的卡券已经发到您的账户，<br/>请进入"我的卡券"查看！</p></div>', '', '查看卡券', function () {
                window.location.href = '/src/account/coupon.html'
              })
              $('.confirm_no').hide();
            } else {
              var returnValue = data.returnValue;
              if (returnValue == '0') { //未登录
                this.isLogin()
                return;
              } else if (returnValue == '1') { //没有可领取的卡券
                util.toast("没有可领取卡券", function () {})
              } else if (returnValue == '2') { //卡券已领取
                util.toast("卡券已领取", function () {})
              } else if (returnValue == '3') { //卡券已过期
                util.toast("卡券已过期", function () {})
              } else if (returnValue == '4') { //参数配置不完善
                util.toast("系统错误，请重试", function () {
                  history.go(0)
                })
              } else if (returnValue == '5') { //领取失败
                util.toast("领取失败，请重试", function () {
                  history.go(0)
                })
              }
            }
          }).fail(function () {})
      },
      getCards: function () {
        var _this = this
        if (this.isLogin) {
          this.fetch()
        } else {
          this.toLogin()
        }

      },
      toLogin: function () {
        window.location.href = '/src/base/login.html?bUrl=/src/activity/coupons_card/index.html';
      }
    }
  })
}

$(document).ready(
  function () {
    function onBridgeReady() {
      WeixinJSBridge.call('hideOptionMenu');
    }
    if (typeof WeixinJSBridge == "undefined") {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady',
          onBridgeReady, false);
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady',
          onBridgeReady);
        document.attachEvent('onWeixinJSBridgeReady',
          onBridgeReady);
      }
    } else {
      onBridgeReady();
    }
  });
