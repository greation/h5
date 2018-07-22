//creat by gannicus on 2017/4/22
var iv = {}
iv.home = function (obj) {
  var vm = new Vue({
    el: "#app",
    data: {
      data: {
        bannerList: [],
        activityBannerList: [],
        platformDataBannerList: []
      }
    },
    created: function () {      
      var _this = this;
      $.ajax({
        type: "post",
        url: Helper.basePath + 'index.htm',
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
          var sumTransMoney = _this.data.sumTransMoney;
          data.sumTransMoney = (sumTransMoney / 1000000).toFixed(2);
          _this.sumRegistNumber = util.toThousands(data.sumRegistNumber);
        },
        error: function (data) {

        }
      });
    },

    methods: {
      /*首页消息 小喇叭  */
      messageLink: function () {
        window.location.href = "/src/index/message.html";
      },
      investRight: function (borrowId) {
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
              util.baseLink('/src/base/login.html?bUrl=/src/index', 2000);
            } else {
              window.location.href = "/src/invest/project_detail.html?borrowId=" + borrowId + '&source=index';
            }
          },
          error: function (loginData) {

          }
        });

      },
      projectLink: function (borrowId) {
        $('.item-list > li').each(function () {
          $(this).click(function () {
            $(this).css({
              'background': '#f9f9fb',
              'margin-left': '-1rem',
              'width': '110%',
              'padding-left': '1rem'
            })
          })
        })
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
              util.baseLink('/src/base/login.html?bUrl=/src/index', 1000);
            } else {
              window.location.href = "/src/invest/project_home.html?borrowId=" + borrowId + '&source=index';
            }
          },
          error: function (loginData) {

          }
        });
      }
    }
  });
}

// 活动
iv.homeActivity = function (obj) {
  var vm = new Vue({
    el: '#activty_pop',
    data: {
      isActive: true,
      data: ''
    },
    created: function () {
      var _this = this;
      $.ajax({
          url: Helper.basePath + 'getHomeImage.htm',
          type: 'POST',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          },
          data: {},
        })
        .done(function (data) {
          var data = JSON.parse(data);
          _this.data = data;
          if (data.dialogType == 'EVERY_TIME') {
            _this.isActive = false;
          } else if (data.dialogType == 'ONLY') {
            if (!localStorage.hidePop) {
              localStorage.hidePop = 1;
              _this.isActive = false;
            }
          } else {
            _this.isActive = true;
          }
        })
        .fail(function (data) {

        })
    },
    methods: {
      close_activity: function () {
        var _this = this;
        _this.isActive = true;
      }
    }
  })
}