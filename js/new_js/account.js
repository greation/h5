var vms = {};
// 个人中心
vms.index = function () {
  new Vue({
    el: '#in',
    data: {
      login: false,
      isHideProperty: false,
      originalData: '',
      data: '',
      wxshare: '',
      userInfo: {
        personSex: ''
      },
      userId: "",
      levelName: '',
      authorizeAsset: '',
      isHighNetWorth: '',
      isBorrower: '',
      isOpenAssetManage: '',
      userData: ''
    },
    created: function () {
      var _self = this;
      $.ajax({
          url: Helper.basePath + 'member/center.htm',
          type: 'POST',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          },
          data: {}
        })
        .done(function (data) {
          _self.originalData = JSON.parse(data);
          var data = JSON.parse(data);
          // console.log(data)
          _self.data = data;
          _self.isOpenAssetManage = data.isOpenAssetManage;
          if (data.isLogin === undefined || data.isLogin === 'Y') {
            _self.isOpenAssetManage = data.isOpenAssetManage;
            _self.login = true;
          } else {
            _self.login = false;
          }
        })
        .fail(function () {})
      $.ajax({
          url: Helper.basePath + 'member/getUser.htm',
          type: 'POST',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {}
        })
        .done(function (data) {
          var data = JSON.parse(data);
          _self.userData = data;
          if (data.isLogin !== 'N') {
            _self.userInfo = data.userInfo;
            _self.userId = data.account.userId;
            _self.levelName = data.levelName;
            _self.authorizeAsset = data.authorizeAsset;
            _self.isHighNetWorth = data.userInfo.isHighNetWorth;
            _self.isBorrower = data.userInfo.isBorrower;

          }
        })
        .fail(function () {})
    },
    methods: {
      myInvest: function () {
        if (this.login) {
          window.location.href = "/src/account/my_invest.html?userId=" + this.data.account.userId;
        } else {
          window.location.href = "/src/base/login.html?bUrl=/src/account/my_invest.html";
        }
      },
      myCoupone: function () {
        if (this.login) {
          window.location.href = "coupon.html"
        } else {
          window.location.href = "/src/base/login.html?bUrl=/src/account/coupon.html";
        }
      },
      myIntegral: function () {
        if (this.login) {
          window.location.href = "/src/article/integral/my_integral.html"
        } else {
          window.location.href = "/src/base/login.html?bUrl=/src/article/integral/my_integral.html";
        }
      },
      hideProperty: function () {
        this.isHideProperty = !this.isHideProperty;
        if (this.isHideProperty) {
          this.data.totalAssets = '****';
          this.data.canuseMoney = '****';
          this.data.totalIncomeMoney = '****';
        } else {
          this.data.totalAssets = this.originalData.totalAssets;
          this.data.canuseMoney = this.originalData.canuseMoney;
          this.data.totalIncomeMoney = this.originalData.totalIncomeMoney;
        }
      },
      /*会员中心 充值链接入口 */
      linkChargeWith: function () {
        /*是否登录 */
        if (this.login) {
          if (this.data.isRealName === 'NO') {
            util.confirm('是否先实名认证!', function () {
              util.baseLink('/src/base/real_name.html', 0);
            });
            return false;
          }
          if (this.data.isSetPayPassword === 'NO') {
            util.toast('设置支付密码，正在跳转');
            $.ajax({
                url: Helper.basePath + 'member/modifySinaPwd.htm',
                type: 'POST',
                dataType: 'json',
                xhrFields: {
                  withCredentials: true
                },
                data: {
                  'pwdTransType': 'set_pay_password',
                  'retUrl': Helper.webPath + 'src/base/loading.html?type=setPayPsw&uid=' + this.data.account.userId
                }
              })
              .done(function (data) {
                var data = JSON.parse(data);
                if (data.code === '000') {
                  window.location.href = data.redirectUrl;
                }
              })
            return false;
          }
          if (this.data.isBindCard === 'NO') {
            util.toast('请先绑定银行卡，正在跳转');
            util.baseLink('/src/account/bind_bank.html', 2000);
            return false;
          }
          window.location.href = '/src/account/charge.html';
        } else {
          window.location.href = '/src/base/login.html?bUrl=/src/account/index.html';
        }
      },

      /*会员中心 提现链接入口 */
      linkWithdraw: function () {
        /*是否登录 */
        if (this.login) {
          if (this.data.isRealName === 'NO') {
            util.confirm('是否先实名认证!', function () {
              util.baseLink('/src/base/real_name.html', 0);
            });
            return false;
          }
          if (this.data.isOpenAccount === 'NO') {
            util.toast('请先开户!');
            util.baseLink('/src/base/real_name.html', 2000);
            return false;
          }
          if (this.data.isSetPayPassword === 'NO') {
            util.toast('设置支付密码，正在跳转');
            $.ajax({
                url: Helper.basePath + 'member/modifySinaPwd.htm',
                type: 'POST',
                dataType: 'json',
                xhrFields: {
                  withCredentials: true
                },
                data: {
                  'pwdTransType': 'set_pay_password',
                  'retUrl': Helper.webPath + 'src/base/loading.html?type=setPayPsw&uid=' + this.data.account.userId
                }
              })
              .done(function (data) {
                var data = JSON.parse(data);
                if (data.code === '000') {
                  window.location.href = data.redirectUrl;
                }
              })
            return false;
          }
          if (this.data.isBindCard === 'NO') {
            util.toast('请先绑定银行卡，正在跳转');
            util.baseLink('/src/account/bind_bank.html', 2000);
            return false;
          }
          window.location.href = '/src/account/withdraw.html';
        } else {
          window.location.href = '/src/base/login.html?bUrl=/src/account/index.html';
        }
      },

      linkEwm: function () {
        if (!this.login) {
          window.location.href = '/src/base/login.html?bUrl=/src/account/my_ewm.html';
        } else {
          window.location.href = '/src/account/my_ewm.html';
        }
      },
      lindFriends: function () {
        if (!this.login) {
          window.location.href = '/src/base/login.html?bUrl=/src/account/friend.html';
        } else {
          window.location.href = '/src/account/friend.html';
        }
      },
      linkUserCenter: function () {
        if (!this.login) {
          window.location.href = '/src/base/login.html?bUrl=/src/account/account_info.html';
        } else {
          window.location.href = '/src/account/account_info.html';
        }
      },
      noLoginLink: function () {
        if (!this.login) {
          window.location.href = '/src/base/login.html?bUrl=/src/account/index.html';
        }
      }
    }
  })
}

/*我的好友*/
vms.infoFriends = function () {
  new Vue({
    el: '#friends',
    data: {
      data: ''
    },
    created: function () {
      var _self = this;
      this.wxShare();
      $.ajax({
          url: Helper.basePath + 'member/myGoodFriends.htm',
          type: 'POST',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          }
        })
        .done(function (data) {
          var data = JSON.parse(data);
          if (data.isLogin === 'N') {
            window.location.href = Helper.webPath + 'src/base/login.html';
          } else {
            _self.data = data;
          }
        })
        .fail(function () {})
    },
    mounted: function () {
      this.wxShare()
    },
    methods: {
      wxShare: function () {

      }
    }
  })
}
/*账户信息*/
vms.infoIndex = function () {
  new Vue({
    el: '#ac',
    data: {
      data: {
        login: false,
        userInfo: {
          personSex: '',
          cardNumber: ''
        },
        isInvestOpenQuestionnaire: '',

      },
      risk_level: {
        surveyLevel: {
          levelName: '未评测'
        }
      }
    },
    created: function () {
      var _self = this;
      $.ajax({
          url: Helper.basePath + 'survey/level.htm',
          type: 'POST',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          }
        })
        .done(function (data) {
          var data = JSON.parse(data);
          if (data.surveyLevel) {
            _self.risk_level = data;
          }
        })
      $.ajax({
          url: Helper.basePath + 'member/getUser.htm',
          type: 'POST',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          }
        })
        .done(function (data) {
          var data = JSON.parse(data);
          _self.data = data;
          _self.cardNumber = util.replaceChars(data.userInfo.cardNumber, 14, true, '*');
          _self.realName = util.replaceChars(data.userInfo.realName, 1, true, '*');
          /*判断是否登录 Y 已登录  */
          if (data.isLogin === undefined || data.isLogin === 'Y') {
            _self.login = true;
          } else {
            _self.login = false;
            window.location.href = '/src/base/login.html';
          }
        })
        .fail(function () {})
    },
    methods: {
      /*退出登录*/
      linkLogot: function () {
        util.confirm('您确定要退出登录吗？', function () {
          $.ajax({
              url: Helper.basePath + 'logout.htm',
              type: 'POST',
              dataType: 'json',
              xhrFields: {
                withCredentials: true
              },
              data: {}
            })
            .done(function (data) {
              var data = JSON.parse(data);
              if (data.code === '000') {
                util.baseLink('/src/index/', 10);
              }
            })
        })
      },
      setPayPsw: function () {
        $.ajax({
            url: Helper.basePath + 'member/modifySinaPwd.htm',
            type: 'POST',
            dataType: 'json',
            xhrFields: {
              withCredentials: true
            },
            data: {
              'pwdTransType': 'set_pay_password',
              'retUrl': Helper.webPath + 'src/base/loading.html?type=setPayPsw&uid=' + this.data.account.userId
            }
          })
          .done(function (data) {
            var data = JSON.parse(data);
            if (data.code === '000') {
              window.location.href = data.redirectUrl;
            } else if (data.code === '1001') {
              util.toast('请先实名');
              util.baseLink('/src/base/real_name.html', 1000);
            }
          })
      },
      bindCard: function () {
        if (this.data.userInfo.isSetPayPwd === 'YES') {
          window.location.href = '/src/account/bind_bank.html';
        } else {
          this.setPayPsw();
        }
      },
      risking: function () {
        var _this = this;
        if (this.login) {
          if (this.data.isRealName === 'NO') {
            util.confirm('是否先实名认证!', function () {
              util.baseLink('/src/base/real_name.html', 0);
            });
            return false;
          }
          if (this.data.isOpenAccount === 'NO') {
            util.toast('请先开户!');
            util.baseLink('/src/base/real_name.html', 2000);
            return false;
          }
          if (this.data.isSetPayPassword === 'NO') {
            util.toast('设置支付密码，正在跳转');
            $.ajax({
                url: Helper.basePath + 'member/modifySinaPwd.htm',
                type: 'POST',
                dataType: 'json',
                xhrFields: {
                  withCredentials: true
                },
                data: {
                  'pwdTransType': 'set_pay_password',
                  'retUrl': Helper.webPath + 'src/base/loading.html?type=setPayPsw&uid=' + this.data.account.userId
                }
              })
              .done(function (data) {
                var data = JSON.parse(data);
                if (data.code === '000') {
                  window.location.href = data.redirectUrl;
                }
              })
            return false;
          }
          if (this.data.isBindCard === 'NO') {
            util.toast('请先绑定银行卡，正在跳转');
            util.baseLink('/src/account/bind_bank.html', 2000);
            return false;
          }
          window.location.href = '/src/account/risk_entry.html';
        } else {
          window.location.href = '/src/base/login.html?bUrl=/src/account/index.html';
        }
      }
    }
  })
}
/*修改用户名*/
vms.changeUserName = function () {
  new Vue({
    el: '#cu',
    data: {
      data: '',
      inpUserName: ''
    },
    created: function () {
      var _self = this;
      $.ajax({
          url: Helper.basePath + 'member/getUser.htm',
          type: 'POST',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          }
        })
        .done(function (data) {
          var data = JSON.parse(data);
          _self.data = data;
          if (data.isLogin === 'N') {
            window.location.href = '/src/base/login.html';
          }
        })
        .fail(function () {})
    },
    methods: {
      changeUserName: function () {
        if (util.isEmpty(this.inpUserName)) {
          util.toast('用户名不能为空');
          return;
        }
        if (this.inpUserName.length < 2) {
          util.toast('用户名长度小于两位');
          return;
        }
        $.ajax({
            url: Helper.basePath + 'member/updateUserName.htm',
            type: 'POST',
            dataType: 'json',
            xhrFields: {
              withCredentials: true
            },
            data: {
              userName: this.inpUserName
            }
          })
          .done(function (data) {
            var data = JSON.parse(data);
            if (data.isLogin === 'N') {
              window.location.href = '/src/base/login.html';
            } else {
              if (data.code === '000') {
                util.toast('用户名修改成功');
                util.baseLink(Helper.webPath + 'src/account/account_info.html', 2000)
              } else {
                util.toast(data.message);
              }
            }
          })
          .fail(function () {})
      }
    }
  })
}

/*充值 */
vms.infoCharge = function () {
  new Vue({
    el: '#charge',
    data: {
      data: {
        cardInfo: {
          bankId: 'null'
        }
      },
      resource: '',
      inpMoney: '',
      retUrl: '',
      userAgent: ''
    },
    created: function () {
      var _self = this;
      $.ajax({
          url: Helper.basePath + 'pay/toimprest.htm',
          type: 'POST',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          }
        })
        .done(function (data) {
          var data = JSON.parse(data);
          _self.data = data;
          if (data.isLogin === 'N') {
            window.location.href = '/src/base/login.html';
          } else {
            if (data.code === '1002') {
              util.toast('请先设置支付密码');
              util.baseLink('/src/account/index.html', 2000);
            } else if (data.code === '1003') {
              util.toast('请先绑定银行卡');
              util.baseLink('/src/account/index.html', 2000);
            }
          }
        })
        .fail(function () {})
    },
    methods: {
      contFilter: function (key) {
        util.balanceForce.call(this, key);
      },
      /*充值 */
      linkChargeBt: function () {
        var _self = this;
        var version = navigator.appVersion; //浏览器信息
        if (this.inpMoney == null || this.inpMoney.trim() == "") {
          util.toast("请输入充值金额");
          return;
        } else if (!util.isTwoFloat(this.inpMoney)) {
          util.toast("金额格式错误(须为数字并且精确到分)!");
          return false;
        } else {
          $.ajax({
              url: Helper.basePath + 'pay/imprest.htm',
              type: 'POST',
              dataType: 'json',
              xhrFields: {
                withCredentials: true
              },
              data: {
                'money': this.inpMoney,
                'userAgent': version,
                'resoure': 'H5',
                'retUrl': Helper.webPath + 'src/base/loading.html'
              }
            })
            .done(function (data) {
              var data = JSON.parse(data);
              _self.data = data;
              if (data.code === '000') {
                window.document.write(data.orderFormContent);
              }
            })
            .fail(function () {})
        }
      }
    }
  })
}

/*提现 */
vms.withdrwa = function () {
  new Vue({
    el: '#wi',
    data: {
      data: {
        cardInfo: {
          bankId: 'null'
        }
      },
      resource: '',
      inpMoney: null,
      retUrl: '',
      userAgent: ''
    },
    created: function () {
      var _self = this;
      $.ajax({
          url: Helper.basePath + 'pay/toimprest.htm',
          type: 'POST',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          }
        })
        .done(function (data) {
          var data = JSON.parse(data);
          _self.data = data;
          if (data.isLogin === 'N') {
            window.location.href = '/src/base/login.html';
          } else {
            if (data.code === '1002') {
              util.toast('请先设置支付密码');
              util.baseLink('/src/account/index.html', 1000);
            } else if (data.code === '1003') {
              util.toast('请先绑定银行卡');
              util.baseLink('/src/account/index.html', 1000);
            }
          }
        })
        .fail(function () {})
    },
    methods: {
      /*提现 */
      contFilter: function (key) {
        util.balanceForce.call(this, key);
      },
      withAll: function () {
        if (this.data.canusMoney <= 2) {
          util.toast('账户余额不能小于2元手续费');
        } else {
          this.inpMoney = (this.data.canusMoney - 2).toFixed(2);
        }
      },
      linkWithdrawBt: function () {
        var _self = this;
        //console.log(parseFloat(this.inpMoney) + 2,parseFloat(this.data.canusMoney))
        var version = navigator.appVersion; //浏览器信息
        //if (util.isEmpty((this.inpMoney).toString())) {
        if (this.inpMoney == null || this.inpMoney.toString().trim() == "") {
          util.toast("请输入提现金额");
          return;
        } else if (!(Number(this.inpMoney) > 0)) {
          util.toast("提现金额必须大于0");
          return;
        } else if (!util.isTwoFloat(this.inpMoney)) {
          util.toast("金额格式错误(须为数字并且精确到分)!");
          return false;
        } else if ((parseFloat(this.inpMoney) + 2).toFixed(2) > parseFloat(this.data.canusMoney)) {
          util.toast("提现金额大于可用余额");
          return false;
        } else {
          $.ajax({
              url: Helper.basePath + 'draw/draw.htm',
              type: 'POST',
              dataType: 'json',
              xhrFields: {
                withCredentials: true
              },
              data: {
                'money': this.inpMoney,
                'userAgent': version,
                'resoure': 'H5',
                'retUrl': Helper.webPath + 'src/base/loading.html',
                'token_id': tokenId
              }
            })
            .done(function (data) {
              var data = JSON.parse(data);
              _self.data = data;
              if (data.code === '000') {
                window.document.write(data.orderFormContent);
              } else if (data.code === '7008') {
                util.alert('您的账户当前存在投资风险，平台为了营造安全的投资环境，暂时限制您的操作，建议您咨询客服。');
              } else {
                util.toast('操作失败');
              }
            })
            .fail(function () {})
        }
      }
    }
  })
}


/*收货地址*/
vms.address = function () {
  new Vue({
    el: '#ad',
    data: {
      data: '',
      isAddress: '',
      isChooseAddress: util.hrefSplit(window.location.href).type
    },
    created: function () {
      var _self = this;
      $.ajax({
          url: Helper.basePath + 'member/manageAddress.htm',
          type: 'POST',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          }
        })
        .done(function (data) {
          var data = JSON.parse(data);
          if (data.isLogin === 'N') {
            window.location.href = Helper.webPath + 'src/base/login.html';
          } else {
            _self.data = data.addressList;
            if (_self.data.length < 1) {
              _self.isAddress = 'block';
            }
          }
        })
        .fail(function () {})
    },
    methods: {
      chooseAddress: function (id) {
        if (this.isChooseAddress === 'integralEd') {
          window.location.href = Helper.webPath + 'src/article/integral/order.html?' + window.location.href.split('?')[1] + '&addressId=' + id;
        }
      }
    }
  })
}
/*编辑收货地址-删除收货地址*/
vms.editAddress = function () {
  new Vue({
    el: '#ae',
    data: {
      citylist: $.rawCitiesData,
      receiver: '',
      mobile: '',
      provinceName: '',
      cityName: '',
      areaName: '', //区县地址
      cityData: '',
      areaData: '',
      zipCode: '', //邮政编码
      detailAddress: '', //详细地址
      status: false //是否为默认地址
    },
    computed: {
      addressId: function () {
        return util.hrefSplit(window.location.href).addressId;
      },
      allAddress: function () {
        //return this.provinceName+this.cityName+this.areaName;
      },
      statusCode: function () {
        if (this.status === true) {
          return '1';
        } else {
          return '0';
        }
      }
    },
    created: function () {
      var _self = this;
      $('header .operation').bind('click', function () {
        util.confirm('确认删除吗？', function () {
          $.ajax({
              url: Helper.basePath + 'member/delAddress.htm',
              type: 'POST',
              dataType: 'json',
              xhrFields: {
                withCredentials: true
              },
              data: {
                id: _self.addressId
              }
            })
            .done(function (data) {
              var data = JSON.parse(data);
              if (data.code === '000') {
                util.toast('删除成功');
                util.baseLink('address.html', 2000);
              }
            })
        })
      })
      $.ajax({
          url: Helper.basePath + 'member/editAddress.htm',
          type: 'POST',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          },
          data: {
            id: this.addressId
          }
        })
        .done(function (data) {
          var data = JSON.parse(data).receiptAddress;
          _self.receiver = data.receiver;
          _self.mobile = data.mobile;
          _self.provinceName = data.provinceName;
          _self.getCity();
          _self.cityName = data.cityName;
          _self.getArea();
          _self.areaName = data.areaName;
          _self.zipCode = data.zipCode;
          _self.detailAddress = data.detailAddress;
          if (data.status === 1) {
            _self.status = true;
          }

        })
        .fail(function () {});
    },
    methods: {
      subAddress: function () {
        var _self = this;
        if (util.isEmpty(this.receiver)) {
          util.toast('收货人不能为空');
        } else if (util.checkPhone(this.mobile) !== true) {
          util.toast(util.checkPhone(this.mobile));
        } else if (util.isEmpty(this.provinceName) || util.isEmpty(this.cityName) || util.isEmpty(this.areaName)) {
          util.toast('请选择完整省市区地址');
        } else if (util.isEmpty(this.detailAddress)) {
          util.toast('请填写详细地址');
        } else {
          $.ajax({
              url: Helper.basePath + 'member/modifyDelivery.htm',
              type: 'POST',
              dataType: 'json',
              xhrFields: {
                withCredentials: true
              },
              data: {
                id: this.addressId,
                receiver: _self.receiver,
                mobile: _self.mobile,
                provinceName: _self.provinceName,
                cityName: _self.cityName,
                areaName: _self.areaName,
                zipCode: _self.zipCode,
                detailAddress: _self.detailAddress,
                status: _self.statusCode
              }
            })
            .done(function (data) {
              var data = JSON.parse(data);
              if (true) {
                util.toast('修改成功');
                util.baseLink('./address.html', 2000);
              }
            })
        }
      },
      getCity: function () {
        for (var i = 0; i < this.citylist.length; i++) {
          if (this.provinceName == this.citylist[i].name) {
            this.cityData = this.citylist[i].sub;
          }
        }
        this.cityName = this.cityData[0].name;
        this.getArea();
        this.areaName = this.areaData[0].name;
      },
      getArea: function () {
        for (var i = 0; i < this.cityData.length; i++) {
          if (this.cityName == this.cityData[i].name) {
            this.areaData = this.cityData[i].sub;
          }
        }
        this.areaName = this.areaData[0].name;
      }
    }
  })
}
/*添加收货地址*/
vms.addAddress = function () {
  new Vue({
    el: '#add_ad',
    data: {
      citylist: $.rawCitiesData,
      receiver: '',
      mobile: '',
      provinceName: '',
      cityName: '',
      areaName: '', //区县地址
      cityData: '',
      areaData: '',
      zipCode: '', //邮政编码
      detailAddress: '', //详细地址
      status: false //是否为默认地址
    },
    computed: {
      addressId: function () {
        return util.hrefSplit(window.location.href).addressId;
      },
      statusCode: function () {
        if (this.status === true) {
          return '1';
        } else {
          return '0';
        }
      }
    },
    created: function () {

    },
    methods: {
      subAddress: function () {
        var _self = this;
        if (util.isEmpty(this.receiver)) {
          util.toast('收货人不能为空');
        } else if (util.checkPhone(this.mobile) !== true) {
          util.toast(util.checkPhone(this.mobile));
        } else if (util.isEmpty(this.provinceName) || util.isEmpty(this.cityName) || util.isEmpty(this.areaName)) {
          util.toast('请选择完整省市区地址');
        } else if (util.isEmpty(this.detailAddress)) {
          util.toast('请填写详细地址');
        } else {
          $.ajax({
              url: Helper.basePath + 'member/modifyDelivery.htm',
              type: 'POST',
              dataType: 'json',
              xhrFields: {
                withCredentials: true
              },
              data: {
                receiver: _self.receiver,
                mobile: _self.mobile,
                provinceName: _self.provinceName,
                cityName: _self.cityName,
                areaName: _self.areaName,
                zipCode: _self.zipCode,
                detailAddress: _self.detailAddress,
                status: _self.statusCode
              }
            })
            .done(function (data) {
              var data = JSON.parse(data);
              if (data.code === '000') {
                util.toast('添加成功');
                util.baseLink('address.html', 2000);
              } else {
                util.toast(data.message);
              }
            })
        }
      },
      getCity: function () {
        for (var i = 0; i < this.citylist.length; i++) {
          if (this.provinceName == this.citylist[i].name) {
            this.cityData = this.citylist[i].sub;
          }
        }
        this.cityName = this.cityData[0].name;
        this.getArea();
        this.areaName = this.areaData[0].name;
      },
      getArea: function () {
        for (var i = 0; i < this.cityData.length; i++) {
          if (this.cityName == this.cityData[i].name) {
            this.areaData = this.cityData[i].sub;
          }
        }
        this.areaName = this.areaData[0].name;
      }
    }
  })
}
/*意见反馈*/
vms.opinion = function () {
  new Vue({
    el: '#op',
    data: {
      inpCont: '',
      inpPhone: ''
    },
    methods: {

      /*add s*/
      add: function () {
        if (util.isEmpty(this.inpCont)) {
          util.toast('内容不能为空');
          $('#inpCont').focus();
        } else if (util.checkPhone(this.inpPhone) !== true) {
          util.toast(util.checkPhone(this.inpPhone));
        } else {
          $.ajax({
              url: Helper.basePath + 'member/feedback.htm',
              type: 'POST',
              dataType: 'json',
              xhrFields: {
                withCredentials: true
              },
              data: {
                'content': this.inpCont,
                'mobile': this.inpPhone
              }
            })
            .done(function (data) {
              var data = JSON.parse(data);
              if (data.code === '000') {
                util.toast(data.message);
                util.baseLink('../account/index.html', 2000);
              } else {
                util.toast('留言失败');
              }
            })
        }
      }
    }
  })
}



/*帮助中心*/
vms.help = function () {

  var helpVm = new Vue({
    el: '#he',
    data: {
      data: ''

    },
    created: function () {
      var _self = this;
      $.ajax({
          url: Helper.basePath + 'article/helpData.htm',
          type: 'POST',
          data: {
            pageIndex: 1,
            pageSize: 10,
          },
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          }
        })
        .done(function (data) {
          var data = JSON.parse(data).list;
          for (var i = 0; i < data.length; i++) {
            data[i].show = false;
          }
          _self.data = data;
        })
        .fail(function () {})
    },
    methods: {
      toggle: function (item) {
        Vue.set(item, 'show', !item.show);
      }
    }
  })
}
// 我的二维码
vms.myewm = function () {
  new Vue({
    el: '#me',
    data: {
      data: ''
    },
    created: function () {
      var _self = this;
      $.ajax({
          url: Helper.basePath + 'member/share.htm',
          type: 'POST',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          }
        })
        .done(function (data) {
          var data = JSON.parse(data);
          if (data.isLogin === 'N') {
            window.location.href = '/src/base/login.html?bUrl=/src/account/my_ewm.html';
          } else {
            _self.data = data;
          }

        })
        .fail(function () {})
    },
    methods: {

    }
  })
}
// 我的投资
vms.myinvest = function () {
  new Vue({
    el: '#mi',
    data: {
      data: '',
      investSucDate: [],
      loadDate: [],
      endDate: [],
      pageIndex: 1,
      pageSize: 5,
      curStatus: null,
      blockArr: 0,
      loadTxt: '加载更多...'
    },
    created: function () {
      this.getInvestData();
    },
    methods: {
      durTypeMap: util.durTypeMap,
      pageActive: function (num) {
        var _self = this;
        this.blockArr = num;
        this.pageIndex = 1;
        this.loadTxt = '加载更多...';
        this.investSucDate = [];
        this.loadDate = [];
        this.endDate = [];
        var lsStatus = '';
        if (num === 1) {
          this.curStatus = 'LOANED';
        } else if (num === 2) {
          this.curStatus = 'RETURNED';
        } else {
          this.curStatus = null;
        }
        this.getInvestData();
      },
      getInvestData: function () {
        var _self = this;
        $.ajax({
            url: Helper.basePath + 'member/myInvest.htm',
            type: 'POST',
            dataType: 'json',
            xhrFields: {
              withCredentials: true
            },
            data: {
              status: this.curStatus,
              pageIndex: this.pageIndex,
              pageSize: this.pageSize
            }
          })
          .done(function (data) {
            var data = JSON.parse(data);
            _self.data = data;
            if (data.isLogin === 'N') {
              util.toast('请登录');
              window.location.href = '/src/base/login.html';
            } else {
              if (_self.curStatus === 'LOANED') {
                for (var i = 0; i < data.list.length; i++) {
                  _self.loadDate.push(data.list[i]);
                }
              } else if (_self.curStatus === 'RETURNED') {
                for (var i = 0; i < data.list.length; i++) {
                  _self.endDate.push(data.list[i]);
                }
              } else {
                for (var i = 0; i < data.list.length; i++) {
                  _self.investSucDate.push(data.list[i]);
                }
              }
              if (_self.pageIndex >= _self.data.page.pageCount) {
                _self.loadTxt = '没有更多的数据！';
              }
            }
          })
          .fail(function () {})
      },
      linkProject: function (id) {
        window.location.href = '/src/invest/project_home.html?borrowId=' + id;
      },
      linkInvestDetail: function (id) {
        window.location.href = '/src/account/invest_detail.html?investId=' + id;
      },
      loadMore: function () {
        if (this.pageIndex++ < this.data.page.pageCount) {
          this.getInvestData();
        }
      }
    }
  })
}
// 资产总额
vms.myprototal = function () {
  new Vue({
    el: '#pt',
    data: {
      data: '',
      isHideProperty: false,
      originalData: ''
    },
    created: function () {
      var _self = this;
      $.ajax({
          url: Helper.basePath + 'member/myAssetDetail.htm',
          type: 'POST',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          },
          data: {}
        })
        .done(function (data) {
          _self.originalData = JSON.parse(data);
          var data = JSON.parse(data);
          if (data.isLogin === 'N') {
            window.location.href = '/src/base/login.html?bUrl=/src/account/index.html';
          } else {
            _self.data = data;
            var myChart = echarts.init(document.getElementById('propertyCharts'));
            var option;
            if (parseInt(data.recMoney) + parseInt(data.incomeMoneyCollect) + parseInt(data.redwardRebatesAmount) + parseInt(data.baseMoney) === 0) {
              option = {
                tooltip: {
                  trigger: 'item'
                },
                legend: {
                  orient: 'vertical'
                },
                color: ['#cccccc'],
                series: [{
                  type: 'pie',
                  radius: ['50%', '70%'],
                  avoidLabelOverlap: false,
                  label: {
                    normal: {
                      show: false,
                      position: 'center'
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  labelLine: {
                    normal: {
                      show: false
                    }
                  },
                  data: [{
                    value: 0,
                    name: '无资金'
                  }]
                }]
              }
            } else {
              option = {
                tooltip: {
                  trigger: 'item'
                },
                legend: {
                  orient: 'vertical'
                },
                color: ['#508cf0', '#72a1f0', '#94b6ee', '#c1dbfc'],
                series: [{
                  type: 'pie',
                  radius: ['50%', '70%'],
                  avoidLabelOverlap: false,
                  label: {
                    normal: {
                      show: false,
                      position: 'center'
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  labelLine: {
                    normal: {
                      show: false
                    }
                  },
                  data: [{
                    value: (data.recMoney).replace(/,/g, ''),
                    name: '待收本金'
                  }, {
                    value: (data.incomeMoneyCollect).replace(/,/g, ''),
                    name: '待收利息'
                  }, {
                    value: (data.redwardRebatesAmount).replace(/,/g, ''),
                    name: '待收返利'
                  }, {
                    value: (data.baseMoney).replace(/,/g, ''),
                    name: '存钱罐'
                  }]
                }]
              }
            }
            myChart.setOption(option);
          }
        })
        .fail(function () {})
    },
    methods: {
      hideProperty: function () {
        this.isHideProperty = !this.isHideProperty;
        if (this.isHideProperty) {
          this.data.totalAssets = '****';
          this.data.recMoney = '****';
          this.data.incomeMoneyCollect = '****';
          this.data.redwardRebatesAmount = '****';
          this.data.baseMoney = '****';
          this.data.integral = '****';
          this.data.voucherCount = '****';
          this.data.freezeMoney = '****';
          this.data.canuseMoney = '****';
        } else {
          this.data.totalAssets = this.originalData.totalAssets;
          this.data.recMoney = this.originalData.recMoney;
          this.data.incomeMoneyCollect = this.originalData.incomeMoneyCollect;
          this.data.redwardRebatesAmount = this.originalData.redwardRebatesAmount;
          this.data.baseMoney = this.originalData.baseMoney;
          this.data.integral = this.originalData.integral;
          this.data.voucherCount = this.originalData.voucherCount;
          this.data.freezeMoney = this.originalData.freezeMoney;
          this.data.canuseMoney = this.originalData.canuseMoney;
        }
      }
    }
  })
}
// 可用余额-资金明细
vms.myfund = function () {
  new Vue({
    el: '#fd',
    data: {
      data: '',
      fundList: [],
      blockArr: [true, false, false],
      curPage: 0,
      pageIndex: 1,
      pageSize: 10,
      loadTxt: '加载更多...'
    },
    created: function () {
      this.getDate();
    },
    methods: {
      pageActive: function (index) {
        var _self = this;
        this.fundList = [];
        this.blockArr = [false, false, false];
        this.blockArr[index] = true;
        this.curPage = index;
        this.pageIndex = 1;
        this.loadTxt = '加载更多...';
        this.getDate();
      },
      loadMore: function () {
        if (this.pageIndex < this.data.page.pageCount) {
          this.pageIndex += 1;
          this.getDate();
        }
      },
      getDate: function () {
        var _self = this;
        var nowurl = document.URL;
        nowurl = location.href;
        var userId = util.getRequest(nowurl, "userId");

        $.ajax({
            url: Helper.basePath + 'member/myCapitalFlow.htm',
            type: 'POST',
            dataType: 'json',
            xhrFields: {
              withCredentials: true
            },
            data: {
              type: this.curPage,
              pageIndex: this.pageIndex,
              pageSize: this.pageSize,
              userId: userId
            }
          })
          .done(function (data) {
            var data = JSON.parse(data);
            _self.data = data;
            for (var i = 0; i < data.list.length; i++) {
              _self.fundList.push(data.list[i]);
            }
            if (_self.pageIndex >= _self.data.page.pageCount) {
              _self.loadTxt = '没有更多的数据！';
            }
          })
          .fail(function () {})
      }
    }
  })
}
// 我的卡券
vms.mycoupon = function () {
  new Vue({
    el: '#co',
    data: {
      rewardType: 0,
      status: 0,
      prescription: 0,
      pageIndex: 1,
      pageSize: 10,
      data: '',
      exchangeCode: null,
      couponList: [],
      loadTxt: '加载更多...',
      isDisabledExchangeCoupon: true,
      isShowExchangeClear: false,
      couponeSort1: false,
      couponeSort2: false,
      couponeSort3: false,
      couponSortActive: 0,
      sortSub1: ['全部类型', '现金券', '加息券', '体验金券'],
      sortSub2: ['可用的券', '已使用', '已过期'],
      sortSub3: ['领取时间', '到期时间'],
      curDetailIndex: []
    },
    watch: {
      exchangeCode: function () {
        if (this.exchangeCode != '') {
          this.isDisabledExchangeCoupon = false
          this.isShowExchangeClear = true
        } else {
          this.isDisabledExchangeCoupon = true
          this.isShowExchangeClear = false
        }
      }
    },
    created: function () {
      var _self = this;
      this.getCoupon();
    },
    methods: {
      durTypeMap: util.durTypeMap,
      getCoupon: function () {
        var _self = this;
        $.ajax({
            url: Helper.basePath + 'member/searchMyCard.htm',
            type: 'POST',
            dataType: 'json',
            async: false,
            xhrFields: {
              withCredentials: true
            },
            data: {
              rewardType: this.rewardType,
              status: this.status,
              prescription: this.prescription,
              pageIndex: this.pageIndex,
              pageSize: this.pageSize
            }
          })
          .done(function (data) {
            var data = JSON.parse(data);
            _self.data = data;
            if (data.isLogin === 'N') {
              window.location.href = '/src/base/login.html?bUrl=/src/account/coupon.html';
            } else {
              for (var i = 0; i < data.voucherList.length; i++) {
                var curCouponObj = data.voucherList[i];

                if (curCouponObj.rewardType === 'CASH_VOUCHER') {
                  curCouponObj.rewardType = 'xian';
                  curCouponObj.rewardName = '现金券';
                  curCouponObj.val = util.fenToYuan(curCouponObj.val);
                } else if (curCouponObj.rewardType === 'RATE_VOUCHER') {
                  curCouponObj.rewardType = 'jia';
                  curCouponObj.rewardName = '加息券';
                } else if (curCouponObj.rewardType === 'EXPERIENCE_VOUCHER') {
                  curCouponObj.rewardType = 'ti';
                  curCouponObj.rewardName = '体验金券';
                  curCouponObj.val = util.fenToYuan(curCouponObj.val);
                }
                if (_self.pageIndex == 1) {
                  _self.couponList = data.voucherList
                } else {
                  _self.couponList.push(curCouponObj)
                }
              }
              if (_self.pageIndex >= _self.data.page.pageCount) {
                _self.loadTxt = '没有更多的数据！';
              }
            }
          })
          .fail(function () {})
      },
      loadMore: function () {
        if (this.pageIndex < this.data.page.pageCount && this.data.page.pageCount != 1) {
          this.pageIndex += 1
          this.getCoupon();
        }
      },
      initPage: function () {
        this.couponList = []
        this.loadTxt = '加载更多...'
        if (this.pageIndex != 1) {
          this.pageIndex = 1;
          this.getCoupon();
        }
      },
      defaultSortActive: function () {
        this.couponeSort1 = false
        this.couponeSort2 = false
        this.couponeSort3 = false
        this.initPage()
        this.curDetailIndex = []
      },
      sort1: function () {
        this.couponeSort1 = !this.couponeSort1
        this.couponSortActive = 1
        this.couponeSort2 = false
        this.couponeSort3 = false
      },
      sort2: function () {
        this.couponeSort2 = !this.couponeSort2
        this.couponSortActive = 2
        this.couponeSort1 = false
        this.couponeSort3 = false
      },
      sort3: function () {
        this.couponeSort3 = !this.couponeSort3
        this.couponSortActive = 3
        this.couponeSort1 = false
        this.couponeSort2 = false
      },
      exchangeClear: function () {
        this.exchangeCode = ''
      },
      showItemDetail: function (index) {
        const i = this.curDetailIndex.indexOf(index)
        if (i > -1) {
          this.curDetailIndex.splice(i, 1)
        } else {
          this.curDetailIndex.push(index)
        }
      },
      exchangeCoupon: function () {
        var _self = this;
        var code = this.exchangeCode

        if (!!code.match(/^[a-zA-Z0-9]+$/) == false) {
          util.toast('兑换码格式不正确')
        }
        if (!Card_exchangeCode.test(this.exchangeCode)) {
          // util.toast('请输入11-20位数字字母组合兑换码');
          util.toast('兑换码不正确')
        } else {
          $.ajax({
              url: Helper.basePath + 'member/exchangeRedemptionCode.htm',
              type: 'POST',
              dataType: 'json',
              async: false,
              xhrFields: {
                withCredentials: true
              },
              data: {
                swapCode: this.exchangeCode
              }
            })
            .done(function (data) {
              var data = JSON.parse(data);
              if (data.code === '000') {
                util.toast('兑换成功！');
                window.location.href = '/src/account/coupon.html'
                setTimeout(function () {
                  window.location.reload();
                }, 2000)
              } else {
                util.toast(data.message);
                // _self.exchangeCode = '';
              }
            })

        }
      },
      userCard: function (voucherId, voucherType) {
        // console.log(voucherId, voucherType)
        sa.track('coupon_select', {
          coupon_select_id: voucherId,
          coupon_select_name: '优惠券',
          coupon_select_type: voucherType
        })
        window.location.href = '/src/invest/list.html?voucherId=' + voucherId;
      }
    },
    mounted: function () {

    }
  })
}

//绑定银行卡
vms.bindbank = function () {
  new Vue({
    el: '#bb',
    data: {
      citylist: $.rawCitiesData,
      provinceName: '北京',
      data: {
        userInfo: {}
      },
      bankValue: '',
      cityName: '',
      cityData: '',
      isStep: false,
      bankName: '',
      phoneNum: '',
      isPhoneCode: false,
      countTime: '获取验证码',
      countTimeSpan: 90,
      ticket: '',
      phoneCode: '',
      isXieyi: false,
      bannerList: ''
    },
    created: function () {
      var _self = this;
      this.getCity();
      $.ajax({
          url: Helper.basePath + 'article/getBanner.htm',
          type: 'POST',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          },
          data: {
            articleTypeCode: 'RZUSIG'
          }
        })
        .done(function (data) {
          var data = JSON.parse(data);
          if (data.isLogin === 'N') {
            window.location.href = Helper.webPath + 'src/base/login.html';
          } else {
            _self.bannerList = data.bannerList;
          }
        })
        .fail(function () {})
      $.ajax({
          url: Helper.basePath + 'member/getUser.htm',
          type: 'POST',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          }
        })
        .done(function (data) {
          var data = JSON.parse(data);
          _self.data = data;
          _self.data.realName = util.replaceChars(data.userInfo.realName, 1, true, '*');

        })
        .fail(function () {})
    },
    methods: {
      contFilter: function (key) {
        util.forceNum.call(this, key);
      },
      getCity: function () {
        for (var i = 0; i < this.citylist.length; i++) {
          if (this.provinceName == this.citylist[i].name) {
            this.cityData = this.citylist[i].sub;
          }
        }
        this.cityName = this.cityData[0].name;
      },
      bindBankNext: function () {
        if (this.bankName === '') {
          util.toast('请选择银行');
        } else if (util.isEmpty(this.provinceName) || util.isEmpty(this.provinceName)) {
          util.toast('请选择完整的省市信息');
        } else if (util.isEmpty(this.bankValue) || isNaN(this.bankValue)) {
          util.toast('请填写正确的银行卡号');
        } else if (util.isEmpty(this.phoneNum)) {
          util.toast('请填写预留手机号');
        } else {
          this.getPhoneCode();
        }
      },
      getPhoneCode: function () {
        var _self = this;
        if (!this.isPhoneCode) {
          // 发验证码请求
          _self.isPhoneCode = true;
          $.ajax({
              url: Helper.basePath + 'member/addCard.htm',
              type: 'POST',
              dataType: 'json',
              xhrFields: {
                withCredentials: true
              },
              data: {
                bankCardNumber: this.bankValue,
                bankcard: this.bankName,
                bankCardUserMobile: this.phoneNum,
                city: this.cityName,
                province: this.provinceName
              }
            })
            .done(function (data) {
              var data = JSON.parse(data);
              if (data.code === '000') {
                _self.ticket = data.ticket;
                _self.isStep = true;
                _self.isPhoneCode = true;
                _self.countTime = _self.countTimeSpan + 's';
                var saveTimeSpan = _self.countTimeSpan;
                var timeFun = function () {
                  _self.countTime = (_self.countTimeSpan--) + 's后获取';
                  if (_self.countTimeSpan < 0) {
                    _self.isPhoneCode = false;
                    _self.countTime = '重新获取';
                    _self.countTimeSpan = saveTimeSpan;
                  } else {
                    setTimeout(function () {
                      timeFun();
                    }, 1000);
                  }
                }
                timeFun()
              } else {
                util.toast(data.message);
                _self.isPhoneCode = false;
              }
            })
            .fail(function () {})
        } else {

        }
      },
      bindBankMain: function () {
        if (!this.isXieyi) {
          util.toast('请同意相关协议');
        } else if (util.isEmpty(this.phoneCode)) {
          util.toast('请输入短信验证码');
        } else {
          var _self = this;
          $.ajax({
              url: Helper.basePath + 'member/addCardAdvance.htm',
              type: 'POST',
              dataType: 'json',
              xhrFields: {
                withCredentials: true
              },
              data: {
                ticket: this.ticket,
                valid_code: this.phoneCode
              }
            })
            .done(function (data) {
              var data = JSON.parse(data);
              if (data.code === '000') {
                util.toast('绑卡成功');
                util.baseLink('/src/account/index.html', 2000);
              } else if (data.code === '999') {
                util.toast('绑卡失败');
              } else {
                util.toast(data.message);
              }
            })
            .fail(function () {})
        }
      }
    }
  })
}
//银行卡列表
vms.bankList = function () {
  new Vue({
    el: '#bc',
    data: {
      data: ''
    },
    created: function () {
      var _self = this;
      $.ajax({
          url: Helper.basePath + 'member/cardListManage.htm',
          type: 'POST',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          },
          data: {}
        })
        .done(function (data) {
          _self.data = JSON.parse(data)
          if (_self.data.cardList[0].isSafetyCard === "Y" && _self.data.cardList[0].isSafetyCard === "N") {
            $('header .operation').text('添加');
            $('header .operation').bind('click', function () {
              window.location.href = Helper.webPath + 'src/account/bind_bank.html';
            })
          }

        })
        .fail(function () {})
    },
    mounted: function () {
      /*$('header .operation').text('添加');
      $('header .operation').bind('click', function() {
          window.location.href = Helper.webPath + 'src/account/bind_bank.html';
      })*/
    }
  })
}
//删除银行卡
vms.removeBank = function () {
  new Vue({
    el: '#bd',
    data: {
      data: {
        cardInfo: {}
      },
      isStep: false,
      isPhoneCode: false,
      countTime: '获取验证码',
      countTimeSpan: 90,
      hrefData: util.hrefSplit(window.location.href),
      ticket: '',
      phoneCode: ''
    },
    created: function () {
      var _self = this;
      $.ajax({
          url: Helper.basePath + 'member/cardDetail.htm',
          type: 'POST',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          },
          data: {
            card_id: this.hrefData.id
          }
        })
        .done(function (data) {
          var data = JSON.parse(data);
          if (data.isLogin === 'N') {
            window.location.href = Helper.webPath + 'src/base/login.html?bUrl=/src/account/index.html';
          } else {
            _self.data = data;
          }
        })
        .fail(function () {})
    },
    methods: {
      removeCard: function () {
        this.getPhoneCode();
      },
      unBindCard: function () {
        if (!util.isEmpty(this.phoneCode)) {
          $.ajax({
              url: Helper.basePath + 'member/unbindCardAdvance.htm',
              type: 'POST',
              dataType: 'json',
              xhrFields: {
                withCredentials: true
              },
              data: {
                ticket: this.ticket,
                valid_code: this.phoneCode
              }
            })
            .done(function (data) {
              var data = JSON.parse(data);
              if (data.code === '000') {
                util.toast('解绑成功');
                util.baseLink(Helper.webPath + 'src/account/bank_card.html', 2000);
              } else {
                util.toast(data.message);
              }
            })
            .fail(function () {})
        } else {
          util.toast('验证码不能为空');
        }
      },
      getPhoneCode: function () {
        var _self = this;
        if (!this.isPhoneCode) {
          $.ajax({
              url: Helper.basePath + 'member/unbindCard.htm',
              type: 'POST',
              dataType: 'json',
              xhrFields: {
                withCredentials: true
              },
              data: {
                card_id: this.hrefData.id
              }
            })
            .done(function (data) {
              var data = JSON.parse(data);
              if (data.code === '000') {
                if (data.ticket === null) {
                  util.toast(data.message);
                } else {
                  _self.ticket = data.ticket;
                  _self.isStep = true;
                  util.toast('验证码已发送');
                  _self.isPhoneCode = !_self.isPhoneCode;
                  _self.countTime = _self.countTimeSpan + 's';
                  var saveTimeSpan = _self.countTimeSpan;
                  var timeFun = function () {
                    _self.countTime = '' + (_self.countTimeSpan--) + 's后获取';
                    if (_self.countTimeSpan < 0) {
                      _self.isPhoneCode = !_self.isPhoneCode;
                      _self.countTime = '重新获取';
                      _self.countTimeSpan = saveTimeSpan;
                    } else {
                      setTimeout(function () {
                        timeFun();
                      }, 1000);
                    }
                  }
                  timeFun();
                }
              } else {
                util.toast(data.message);
              }
            })
        }

      }
    }
  })
}

//累计收益
vms.addfund = function () {
  new Vue({
    el: '#af',
    data: {
      data: '',
      receiveList: [],
      pageIndex: 1,
      pageSize: 10,
      loadTxt: '加载更多...'
    },
    created: function () {
      this.getDate();
    },
    methods: {
      loadMore: function () {
        if (this.pageIndex++ < this.data.page.pageCount) {
          this.getDate();
        }
      },
      getDate: function () {
        var _self = this;
        var nowurl = document.URL;
        nowurl = location.href;
        var userId = util.getRequest(nowurl, "userId");

        $.ajax({
            url: Helper.basePath + 'member/myRevenueDetail.htm',
            type: 'POST',
            dataType: 'json',
            xhrFields: {
              withCredentials: true
            },
            data: {
              pageIndex: this.pageIndex,
              pageSize: this.pageSize,
              userId: userId
            }
          })
          .done(function (data) {
            var data = JSON.parse(data);
            _self.data = data;
            for (var i = 0; i < data.list.length; i++) {
              _self.receiveList.push(data.list[i])
            }
            if (_self.pageIndex >= data.page.pageCount) {
              _self.loadTxt = '没有更多的数据！';
            }
          })
          .fail(function () {})
      }
    }
  })
}
//邀请详情
vms.firenddetail = function () {
  var urlData = util.hrefSplit(window.location.href);
  if (urlData.grade === '1') {
    $('header .title').text('一级邀请');
  } else if (urlData.grade === '2') {
    $('header .title').text('二级邀请');
  } else if (urlData.grade === '3') {
    $('header .title').text('三级邀请');
  }
  new Vue({
    el: '#fd01',
    data: {
      data: {
        list: ''
      },
      grade: urlData.grade,
      pageIndex: 1,
      pageSize: 10,
      friendList: [],
      loadTxt: '加载更多...'
    },
    created: function () {
      var _self = this;
      this.getFriend();
    },
    methods: {
      getFriend: function () {
        var _self = this;
        $.ajax({
            url: Helper.basePath + 'member/rebateDetail.htm',
            type: 'POST',
            dataType: 'json',
            xhrFields: {
              withCredentials: true
            },
            data: {
              type: this.grade,
              pageIndex: this.pageIndex,
              pageSize: this.pageSize
            }
          })
          .done(function (data) {
            var data = JSON.parse(data);
            _self.data = data;
            if (data.isLogin === 'N') {
              window.location.href = '/src/base/login.html';
            } else {
              for (var i = 0; i < data.list.length; i++) {
                var myphone = data.list[i].mobile.substr(3, 4);
                data.list[i].mobile = data.list[i].mobile.replace(myphone, "****");
                _self.friendList.push(data.list[i]);
              }
              if (_self.pageIndex >= _self.data.page.pageCount) {
                _self.loadTxt = '没有更多的数据！';
              }
            }
          })
          .fail(function () {
            //
          })
      },
      loadMore: function () {
        if (this.pageIndex++ < this.data.page.pageCount) {
          this.getFriend();
        }
      }
    }
  })
}
//账户安全
vms.acsafe = function () {
  new Vue({
    el: '#as',
    data: {
      data: {
        userInfo: {}
      }
    },
    created: function () {
      var _self = this;
      $.ajax({
          url: Helper.basePath + 'member/getUser.htm',
          type: 'POST',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          },
          data: {}
        })
        .done(function (data) {
          _self.data = JSON.parse(data);
        })
        .fail(function () {})
    },
    methods: {
      upPayPsw: function (type) {
        var _self = this;
        var upPayPswText = '',
          returnUrl = '';
        if (type === 'set') {
          upPayPswText = 'set_pay_password';
          returnUrl = Helper.webPath + 'src/base/loading.html?type=setPayPsw&uid=' + _self.data.account.userId;
          if (this.data.userInfo.isSetPayPwd !== 'YES') {
            sendPayPsw();
          }
        } else if (type === 'change') {
          upPayPswText = 'modify_pay_password';
          returnUrl = Helper.webPath + 'src/account/index.html';
          sendPayPsw();
        } else if (type === 'find') {
          upPayPswText = 'find_pay_password';
          returnUrl = Helper.webPath + 'src/account/index.html';
          sendPayPsw();
        }

        function sendPayPsw() {
          $.ajax({
              url: Helper.basePath + 'member/modifySinaPwd.htm',
              type: 'POST',
              dataType: 'json',
              xhrFields: {
                withCredentials: true
              },
              data: {
                'pwdTransType': upPayPswText,
                'retUrl': returnUrl
              }
            })
            .done(function (data) {
              var data = JSON.parse(data);
              if (data.code === '000') {
                window.location.href = data.redirectUrl;
              } else if (data.code === '1001') {
                util.toast('请先实名');
                util.baseLink('/src/base/real_name.html', 1000);
              }
            })
        }
      }
    }
  })
}


//红包福利送不停
vms.newUser = function () {
  new Vue({
    el: '#newUser',
    data: {
      data: {
        userInfo: {

        }
      }
    },
    created: function () {
      var _self = this;
      $.ajax({
          url: Helper.basePath + 'member/getUser.htm',
          type: 'POST',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          },
          data: {

          }
        })
        .done(function (data) {
          _self.data = JSON.parse(data);
        })
        .fail(function () {})
    },
    methods: {
      goloin: function () {
        /*app 调用参数 */
        var _this = this;
        if (util.getUrlParam('app') == 'IPHONE') {
          window.webkit.messageHandlers.goRegister.postMessage('');
        } else if (util.getUrlParam('app') == 'ANDROID') {
          //alert(_this.data.borrow.borrowId);
          android.goRegister();
        } else {
          if (_this.data.isLogin === 'N') {
            window.location.href = '/src/base/register.html'
          } else {
            util.toast('您已登录，请充值投资吧');
          }

          //window.location.href='/src/base/register.html'
        }
      },
      gocharge: function () {
        /*app 调用参数 */
        if (util.getUrlParam('app') == 'IPHONE') {
          window.webkit.messageHandlers.goRecharge.postMessage('');
        } else if (util.getUrlParam('app') == 'ANDROID') {
          //alert(_this.data.borrow.borrowId);
          android.goRecharge();
        } else {
          window.location.href = '/src/account/charge.html'
        }
      },
      gorealname: function () {
        var _this = this;
        /*app 调用参数 */
        if (util.getUrlParam('app') == 'IPHONE') {
          window.webkit.messageHandlers.goAuthentication.postMessage('');
        } else if (util.getUrlParam('app') == 'ANDROID') {
          //alert(_this.data.borrow.borrowId);
          android.goAuthentication();
        } else {
          if (_this.data.isLogin === 'N') {
            window.location.href = '/src/base/login.html?bUrl=/src/account/new_user.html'
          }
          if (_this.data.userInfo.realName === null) {
            window.location.href = '/src/base/real_name.html'
          }
          if (_this.data.userInfo.realName != '') {
            util.toast('您已成功开户，请充值投资吧');
          }
        }
      }

    }
  })
}



//邀请好友
vms.inviteFirend = function () {
  new Vue({
    el: '#inviteFirend',
    data: {
      data: {
        userInfo: {

        }
      }
    },
    created: function () {
      var _self = this;

      var nowurl = document.URL;
      nowurl = location.href;
      //var messageId=util.getRequest(nowurl,"id");
      var userId = util.getRequest(nowurl, "userId");

      $.ajax({
          url: Helper.basePath + 'member/share.htm',
          type: 'POST',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          },
          data: {
            "userId": userId
          },
        })
        .done(function (data) {
          _self.data = JSON.parse(data);

        })
        .fail(function () {})
    },
    methods: {
      goshare: function () {
        /*app 调用参数 */
        var _this = this;
        var nowurl = document.URL;
        nowurl = location.href;
        //var app=;
        var title = '喊上你的好友一起赚钱吧';
        var linkUrl = Helper.webPath + 'src/base/share_register.html?un=' + util.getRequest(nowurl, "un");
        var imageUrl = Helper.webPath + 'images/share_200.jpg';
        var content = '邀请好友入驻享千分之五返利，快快行动吧！';
        if (util.getUrlParam('app') == 'IPHONE') {
          window.webkit.messageHandlers.share.postMessage([imageUrl, linkUrl, title, content]);
          //share();
        } else if (util.getUrlParam('app') == 'ANDROID') {
          android.share(imageUrl, linkUrl, title, content);
        } else {

          if (_this.data.isLogin === 'N') {
            window.location.href = '/src/base/login.html?bUrl=/src/account/my_share1.html'
          }
          //alert(linkUrl);
          $('.mask').show();

        }
      },
      mask: function () {

        $('.mask').hide();
      }

    }
  })
}
vms.yqhyznq = function () {
  new Vue({
    el: '#yqhyznq',
    data: {
      data: {
        userInfo: {

        }
      }
    },
    created: function () {
      var _self = this;

      var nowurl = document.URL;
      nowurl = location.href;
      //var messageId=util.getRequest(nowurl,"id");
      var userId = util.getRequest(nowurl, "userId");

      $.ajax({
          url: Helper.basePath + 'member/share.htm',
          type: 'POST',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          },
          data: {
            "userId": userId
          },
        })
        .done(function (data) {
          _self.data = JSON.parse(data);

        })
        .fail(function () {})
    },
    methods: {
      goshare: function () {
        /*app 调用参数 */
        var _this = this;
        var nowurl = document.URL;
        nowurl = location.href;
        //var app=;
        var title = '邀请好友，双重福利等你来领';
        var linkUrl = Helper.webPath + 'src/base/share_register.html?un=' + util.getRequest(nowurl, "un");
        var imageUrl = Helper.webPath + 'Website/activity/one_year_invite_user/images/share_invite.jpg';
        var content = '投资返利，还有更多好礼等你来拿，快叫上你的好友吧！';
        if (util.getUrlParam('app') == 'IPHONE') {
          window.webkit.messageHandlers.share.postMessage([imageUrl, linkUrl, title, content]);
          //share();
        } else if (util.getUrlParam('app') == 'ANDROID') {
          android.share(imageUrl, linkUrl, title, content);
        } else {

          if (_this.data.isLogin === 'N') {
            window.location.href = '/src/base/login.html?bUrl=/src/account/my_share.html'
          }
          //alert(linkUrl);
          $('.mask').show();

        }

      },
      mask: function () {

        $('.mask').hide();
      },
      gorule: function () {
        this.createBg();
        $('.modal-rule').show();
      },
      hideGz: function () {
        $('.modal-rule').hide();
        $('#modal-bg').remove();
      },
      createBg: function () {
        $('body').append('<div id="modal-bg" style="position:fixed;width:100%;height:100%;left:0;top:0;background:#000;opacity:0.6;z-index:2"></div>');
      }

    }
  })
}


//修改登录密码
vms.changePsw = function () {
  new Vue({
    el: '#cp',
    data: {
      isStep: true,
      inPsActive: [false, false, false, false],
      isPhoneCode: false,
      countTime: '获取验证码',
      countTimeSpan: 90,
      inpPhone: '',
      inpPsw01: '',
      phoneCode: '',
      pictureCode: '',
      pictureUrl: Helper.basePath + 'getvcode.htm',
      passType: '',
      passTypeMap: {}
    },
    created: function () {
      var _self = this;
      this.passType = util.getPassType();
      this.passTypeMap = passTypeMap;
      $.ajax({
          url: Helper.basePath + 'member/getUser.htm',
          type: 'POST',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          }
        })
        .done(function (data) {
          var data = JSON.parse(data);
          if (data.isLogin === 'N') {
            window.location.href = Helper.webPath + 'src/base/login.html?bUrl=/src/account/index.html';
          }
          _self.inpPhone = data.userInfo.mobile;
        })
    },
    methods: {
      contFilter: function (key) {
        util.forceNum.call(this, key);
      },
      inpFocus: function (num) {
        this.inPsActive = [false, false, false, false];
        this.inPsActive[num] = true;
      },
      refreshPicture: function () {
        this.pictureUrl = Helper.basePath + 'getvcode.htm?h=' + Math.random();
      },
      getPhoneCode: function () {
        var _self = this;
        if (!this.isPhoneCode) {
          if (util.checkPictureCode(this.pictureCode) !== true) {
            util.toast(util.checkPictureCode(this.pictureCode))
            return;
          }
          $.ajax({
              url: Helper.basePath + 'sendSmsByType.htm',
              type: 'POST',
              dataType: 'json',
              xhrFields: {
                withCredentials: true
              },
              data: {
                'username': this.inpPhone,
                'smsType': 'FOUNDLOGINPWD',
                'checkcode': _self.pictureCode
              }
            })
            .done(function (data) {
              var data = JSON.parse(data);
              if (data.code === '000') {
                util.toast('验证码已发送');
                _self.isPhoneCode = !_self.isPhoneCode;
                _self.countTime = '' + _self.countTimeSpan + 's';
                var saveTimeSpan = _self.countTimeSpan;
                var timeFun = function () {
                  _self.countTime = '' + (_self.countTimeSpan--) + 's后获取';
                  if (_self.countTimeSpan < 0) {
                    _self.isPhoneCode = !_self.isPhoneCode;
                    _self.countTime = '重新获取';
                    _self.countTimeSpan = saveTimeSpan;
                  } else {
                    setTimeout(function () {
                      timeFun();
                    }, 1000);
                  }
                }
                timeFun();
              } else if (data.code === '1003') {
                util.toast('用户未注册');
              } else if (data.code === '1001') {
                util.toast('用户名不合法');
              } else if (data.code === '2003') {
                util.toast('发送失败');
              } else if (data.code === '2001') {
                util.toast('请求频繁，' + data.time + '秒后重试');
              } else if (data.code === '2002') {
                util.toast('当天短信发送超过10次');
              } else if (data.code === '999') {
                util.toast('未知错误，请联系客服');
              } else if (data.code === '1006') {
                util.toast('图形验证码错误');
              } else if (data.code === '1005') {
                util.toast('图形验证码已过期');
              } else if (data.code === '1004') {
                util.toast('图形验证码不能为空');
              }
            })
        }
      },
      nextStep: function () {
        var _self = this;
        $.ajax({
            url: Helper.basePath + 'checkMobileCode.htm',
            type: 'POST',
            dataType: 'json',
            xhrFields: {
              withCredentials: true
            },
            data: {
              'mobile': this.inpPhone,
              'mobileCode': this.phoneCode
            }
          })
          .done(function (data) {
            var data = JSON.parse(data);
            if (data.code === '000') {
              _self.isStep = !_self.isStep;
            } else {
              util.toast('验证码有误');
            }
          })
      },
      findPswMain: function () {
        var _self = this;
        var pswState = util.forcePwd.call(_self, 'inpPsw01', _self.passType);
        if (pswState !== true) {
          util.toast(pswState);
          return;
        }
        $.ajax({
            url: Helper.basePath + 'getBackPassword.htm',
            type: 'POST',
            dataType: 'json',
            xhrFields: {
              withCredentials: true
            },
            data: {
              'mobile': this.inpPhone,
              'mobileCode': this.phoneCode,
              password: this.inpPsw01
            }
          })
          .done(function (data) {
            var data = JSON.parse(data);
            if (data.code === '000') {
              util.toast('密码修改成功,正在跳转登录');
              setTimeout(function () {
                window.location.href = "/src/base/login.html";
              }, 1000);
            } else {
              util.toast('密码修改失败');
            }
          })
      }
    }
  })
}
//个人资料
vms.userInfo = function () {
  new Vue({
    el: '#ui',
    data: {
      citylist: $.rawCitiesData,
      hProvinceName: '', //户籍地址
      hCityName: '',
      hAreaName: '',
      hProvinceData: '', //户籍地址数据
      hCityData: '',
      hAreaData: '',
      cProvinceName: '', //常驻地址
      cCityName: '',
      cAreaName: '',
      cProvinceData: '', //常驻地址数据
      cCityData: '',
      cAreaData: '',
      isEditH: false,
      isEditC: false,
      userData: {
        userInfo: {}
      }
    },
    computed: {
      hAddress: function () {
        return this.hProvinceName + this.hCityName + this.hAreaName;
      },
      hAddress: function () {
        return this.cProvinceName + this.cCityName + this.cAreaName;
      }
    },
    created: function () {
      var _self = this;
      $.ajax({
          url: Helper.basePath + 'member/getUser.htm',
          type: 'POST',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          }
        })
        .done(function (data) {
          var data = JSON.parse(data);
          if (data.isLogin === 'N') {
            window.location.href = Helper.webPath + 'src/base/login.html?bUrl=/src/account/index.html';
          } else {
            _self.userData = data;
            if (util.isEmpty(data.userInfo.permanentAddress)) {
              _self.isEditH = true;
            }
            if (util.isEmpty(data.userInfo.consigneeAddress)) {
              _self.isEditC = true;
            }
          }
        })
        .fail(function () {});
      this.hProvinceData = this.citylist;
      this.hProvinceName = this.hProvinceData[0].name;
      this.cProvinceData = this.citylist;
      this.cProvinceName = this.cProvinceData[0].name;
      this.getCity01();
      this.getCity02();
    },
    methods: {
      getCity01: function () {
        for (var i = 0; i < this.citylist.length; i++) {
          if (this.hProvinceName == this.citylist[i].name) {
            this.hCityData = this.citylist[i].sub;
            this.hCityName = this.hCityData[0].name;
          }
        }
        this.getArea01();
      },
      getCity02: function () {
        for (var i = 0; i < this.citylist.length; i++) {
          if (this.cProvinceName == this.citylist[i].name) {
            this.cCityData = this.citylist[i].sub;
            this.cCityName = this.cCityData[0].name;
          }
        }
        this.getArea02();
      },
      getArea01: function () {
        for (var i = 0; i < this.hCityData.length; i++) {
          if (this.hCityName == this.hCityData[i].name) {
            this.hAreaData = this.hCityData[i].sub;
            this.hAreaName = this.hAreaData[0].name;
          }
        }
      },
      getArea02: function () {
        for (var i = 0; i < this.cCityData.length; i++) {
          if (this.cCityName == this.cCityData[i].name) {
            this.cAreaData = this.cCityData[i].sub;
            this.cAreaName = this.cAreaData[0].name;
          }
        }
      },
      updateUserInfo: function () {
        if (this.isEditH && this.isEditC) {
          $.ajax({
              url: Helper.basePath + 'member/updateUserInfo.htm',
              type: 'POST',
              dataType: 'json',
              xhrFields: {
                withCredentials: true
              },
              data: {
                permanentAddress: this.hProvinceName + this.hCityName + this.hAreaName,
                consigneeAddress: this.cProvinceName + this.cCityName + this.cAreaName,
                educational: this.userData.userInfo.educational,
                income: this.userData.userInfo.income,
                profession: this.userData.userInfo.profession
              }
            })
            .done(function (data) {
              var data = JSON.parse(data);
              if (data.isLogin === 'N') {
                window.location.href = Helper.webPath + 'src/base/login.html?bUrl=/src/account/index.html';
              } else {
                if (data.code === '000') {
                  util.toast('修改成功');
                  util.baseLink(Helper.webPath + 'src/account/user_info.html', 2000)
                  //window.location.reload();
                }
              }
            })
            .fail(function () {});
        } else if (this.isEditH && !this.isEditC) {
          $.ajax({
              url: Helper.basePath + 'member/updateUserInfo.htm',
              type: 'POST',
              dataType: 'json',
              xhrFields: {
                withCredentials: true
              },
              data: {
                permanentAddress: this.hProvinceName + this.hCityName + this.hAreaName,
                //consigneeAddress:this.cProvinceName+this.cCityName+this.cAreaName,
                educational: this.userData.userInfo.educational,
                income: this.userData.userInfo.income,
                profession: this.userData.userInfo.profession
              }
            })
            .done(function (data) {
              var data = JSON.parse(data);
              if (data.isLogin === 'N') {
                window.location.href = Helper.webPath + 'src/base/login.html?bUrl=/src/account/index.html';
              } else {
                if (data.code === '000') {
                  util.toast('修改成功');
                  util.baseLink(Helper.webPath + 'src/account/user_info.html', 2000)
                  //window.location.reload();
                }
              }
            })
            .fail(function () {});
        } else if (!this.isEditH && this.isEditC) {
          $.ajax({
              url: Helper.basePath + 'member/updateUserInfo.htm',
              type: 'POST',
              dataType: 'json',
              xhrFields: {
                withCredentials: true
              },
              data: {
                //permanentAddress:this.hProvinceName+this.hCityName+this.hAreaName,
                consigneeAddress: this.cProvinceName + this.cCityName + this.cAreaName,
                educational: this.userData.userInfo.educational,
                income: this.userData.userInfo.income,
                profession: this.userData.userInfo.profession
              }
            })
            .done(function (data) {
              var data = JSON.parse(data);
              if (data.isLogin === 'N') {
                window.location.href = Helper.webPath + 'src/base/login.html?bUrl=/src/account/index.html';
              } else {
                if (data.code === '000') {
                  util.toast('修改成功');
                  util.baseLink(Helper.webPath + 'src/account/user_info.html', 2000)
                  //window.location.reload();
                }
              }
            })
            .fail(function () {});
        } else if (!this.isEditH && !this.isEditC) {
          $.ajax({
              url: Helper.basePath + 'member/updateUserInfo.htm',
              type: 'POST',
              dataType: 'json',
              xhrFields: {
                withCredentials: true
              },
              data: {
                //permanentAddress:this.hProvinceName+this.hCityName+this.hAreaName,
                //consigneeAddress:this.cProvinceName+this.cCityName+this.cAreaName,
                educational: this.userData.userInfo.educational,
                income: this.userData.userInfo.income,
                profession: this.userData.userInfo.profession
              }
            })
            .done(function (data) {
              var data = JSON.parse(data);
              if (data.isLogin === 'N') {
                window.location.href = Helper.webPath + 'src/base/login.html?bUrl=/src/account/index.html';
              } else {
                if (data.code === '000') {
                  util.toast('修改成功');
                  util.baseLink(Helper.webPath + 'src/account/user_info.html', 2000)
                  //window.location.reload();
                }
              }
            })
            .fail(function () {});
        }

      },
      editH: function () {
        this.isEditH = true;
      },
      editC: function () {
        this.isEditC = true;
      }
    }
  })
}
// 回款日历
vms.calendar = function () {
  new Vue({
    el: '#ca',
    data: {
      userData: {
        userInfo: {}
      },
      calendarData: '',
      receivePlanList: [],
      curYear: util.getCurYear(), //当前年份
      curMonth: util.getCurMonth(), //当前月份0-11,
      curDate: util.getCurDate(),
      curYearText: util.getCurYear(), //当前年份
      curMonthText: util.getCurMonth(), //当前月份0-11
      calendarView: []
    },
    created: function () {
      var _self = this;
      $.ajax({
          url: Helper.basePath + 'member/getUser.htm',
          type: 'POST',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          }
        })
        .done(function (data) {
          _self.data = data;
          if (data.isLogin === 'N') {
            window.location.href = Helper.webPath + 'src/base/login.html?bUrl=/src/account/index.html';
          }
        })
        .fail(function () {})
      for (var i = 0; i < 6; i++) {
        this.getMonthView();
        if (++this.curMonth > 11) {
          this.curYear++;
          this.curMonth = 0;
        }
      }
    },
    filters: {
      monthToTwo: util.MonthToTwoLength
    },
    mounted: function () {
      $('.calendar_num .box').click(function (event) {
        $('.calendarItem').removeClass('select_day');
        $(this).find('.calendarItem').addClass('select_day')
      });
      var lsMonthText = this.curMonthText + 1;
      var lsYearText = this.curYearText;
      var _self = this;
      var mySwiperCalendar = new Swiper('.calendar .swiper-container', {
        pagination: '.calendar .swiper-pagination',
        speed: 400,
        loop: true,
        spaceBetween: 0,
        //autoHeight:true,
        onSlideNextEnd: function (swiper) {
          _self.curMonthText++
            if (_self.curMonthText > 12) {
              _self.curMonthText = 1;
              _self.curYearText++;
            }
          if (swiper.realIndex === 0) {
            //window.location.reload();
            _self.curYearText = lsYearText;
            _self.curMonthText = lsMonthText;
          }
          _self.getCalendarData(swiper.realIndex);

        },
        onSlidePrevEnd: function (swiper) {
          _self.curMonthText--;
          if (_self.curMonthText < 1) {
            _self.curMonthText = 12;
            _self.curYearText--;
          }
          if (swiper.realIndex === 5) {
            //window.location.reload();
            if (lsMonthText + 6 <= 12) {
              _self.curMonthText = lsMonthText + 5;
              _self.curYearText = lsYearText;
            } else {
              _self.curMonthText = lsMonthText + 5 - 12;
              _self.curYearText = lsYearText + 1;
            }
          }
          _self.getCalendarData(swiper.realIndex);
        }
      })
      _self.showCurDay(_self.curYearText, _self.curMonthText, util.getCurDate());
    },
    methods: {
      getMonthView: function () {
        var curMonthNum = util.getMonthNum(this.curYear, this.curMonth + 1); //当前月多少天
        var curWeenNum = util.getWeenDay(this.curYear, this.curMonth); //当前月第一天周几
        var lsData = [];
        if (curWeenNum != 0) {
          for (var i = 0; i < curWeenNum; i++) {
            lsData.push({
              year: '',
              month: '',
              date: '',
              curDate: false,
              isChoose: false,
              isreceive: false
            });
          }
        }
        for (var i = 1; i <= curMonthNum; i++) {
          if (i === this.curDate & this.curMonthText === this.curMonth) {
            lsData.push({
              year: this.curYear,
              month: this.curMonth + 1,
              date: i,
              curDate: true,
              isChoose: false,
              isreceive: false
            });
          } else {
            lsData.push({
              year: this.curYear,
              month: this.curMonth + 1,
              date: i,
              curDate: false,
              isChoose: false,
              isreceive: false
            });
          }
        }
        this.calendarView.push(lsData);
      },
      getCalendarData: function (calendarIndex) {
        this.receivePlanList = [];
        var _self = this;
        $.ajax({
            url: Helper.basePath + 'member/returnCalendar.htm',
            type: 'POST',
            dataType: 'json',
            xhrFields: {
              withCredentials: true
            },
            async: false,
            data: {
              date: this.curYearText + "-" + util.MonthToTwoLength(this.curMonthText)
            }
          })
          .done(function (data) {
            var data = JSON.parse(data);
            _self.calendarData = data;
            if (data.isLogin === 'N') {
              window.location.href = Helper.webPath + 'src/base/login.html?bUrl=/src/account/index.html';
            } else {
              // for (var i = 0; i < data.list.length; i++) {
              //   if (data.list[i].categoryName === 'GYHOUSE' || data.list[i].categoryName === 'GYLEASE') {
              //     data.list[i].categoryName = '房月盈';
              //   } else if (data.list[i].categoryName === 'NORMAL') {
              //     data.list[i].categoryName = '普通模式';
              //   } else if (data.list[i].categoryName === 'NEWUSER') {
              //     data.list[i].categoryName = '新手模式';
              //   } else if (data.list[i].categoryName === 'EXPERIENCE') {
              //     data.list[i].categoryName = '体验金模式';
              //   } else if (data.list[i].categoryName === 'CONSUM') {
              //     data.list[i].categoryName = '实物奖励模式';
              //   } else if (data.list[i].categoryName === 'MAKE') {
              //     data.list[i].categoryName = '预约专享-房月盈';
              //   } else if (data.list[i].categoryName === 'GYCAR') {
              //     data.list[i].categoryName = '车满盈';
              //   } else if (data.list[i].categoryName === 'MAKECAR') {
              //     data.list[i].categoryName = '预约专享-车满盈';
              //   }
              // }
              for (var m = 0; m < data.dates.length; m++) {
                for (var j = 0; j < _self.calendarView[calendarIndex].length; j++) {
                  var lsdate = _self.calendarView[calendarIndex][j].year + '-' + util.MonthToTwoLength(_self.calendarView[calendarIndex][j].month) + '-' + util.MonthToTwoLength(_self.calendarView[calendarIndex][j].date);
                  if (data.dates[m] === lsdate) {
                    _self.calendarView[calendarIndex][j].isreceive = true;
                  }
                }
              }
              //_self.receivePlanList = data.list;
              var myChart = echarts.init(document.getElementById('calendarChart'));
              myChart.setOption({
                tooltip: {
                  trigger: 'item'
                },
                legend: {
                  orient: 'vertical'
                },
                color: ['#4680fe', '#a3bfff'],
                series: [{
                  type: 'pie',
                  radius: ['50%', '70%'],
                  avoidLabelOverlap: false,
                  label: {
                    normal: {
                      show: false,
                      position: 'center'
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  labelLine: {
                    normal: {
                      show: false
                    }
                  },
                  data: [{
                    value: _self.calendarData.recBaseMoney,
                    name: '本月待收'
                  }, {
                    value: _self.calendarData.receivedMoney,
                    name: '本月已收'
                  }]
                }]
              })
            }
          })
          .fail(function () {})
      },
      chooseDate: function (item) {
        this.showCurDay(item.year, item.month, item.date);
      },
      showCurDay: function (year, month, date) {
        // this.receivePlanList = [];
        // for (var m = 0; m < this.calendarData.list.length; m++) {
        //   if (this.calendarData.list[m].arrivalTime === year + '-' + util.MonthToTwoLength(month) + '-' + util.MonthToTwoLength(date)) {
        //     this.receivePlanList.push(this.calendarData.list[m]);
        //   }
        // }
        var _self = this;
        $.ajax({
            url: Helper.basePath + 'member/onedayPayment.htm',
            type: 'POST',
            dataType: 'json',
            xhrFields: {
              withCredentials: true
            },
            async: false,
            data: {
              date: year + '-' + util.MonthToTwoLength(month) + '-' + util.MonthToTwoLength(date)
            }
          })
          .done(function (data) {
            var data = JSON.parse(data);
            // console.log(data.list)
            _self.receivePlanList = data.list;
          })
      },
      linkDetail: function (id) {
        window.location.href = "/src/account/invest_detail.html?investId=" + id;
      }
    }
  })
}
//回款详情
vms.investDetail = function () {
  new Vue({
    el: '#hd',
    data: {
      data: '',
      investInfo: [],
      isActive: 'block',
      contractUrl: '',
      isApp: false,
      userId: '',
      blockArr: util.hrefSplit(window.location.href).blockArr
    },
    created: function () {
      var _this = this;
      var nowurl = document.URL;
      nowurl = location.href;
      this.userId = util.getRequest(nowurl, "userId");
      // console.log(this.userId);
      if (!util.isEmpty(this.userId)) {
        this.isApp = true;
      }
      $.ajax({
          url: Helper.basePath + 'member/investDetail.htm',
          type: 'POST',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          },
          data: {
            investId: util.hrefSplit(window.location.href).investId,
            userId: this.userId
          }
        })
        .done(function (data) {
          var data = JSON.parse(data);
          _this.data = data;
          if (data.isLogin === 'N') {
            window.location.href = Helper.webPath + 'src/base/login.html?bUrl=/src/account/index.html';
          } else {
            _this.investInfo = data.investInfo;
            var contractUrl = data.investInfo.contractUrl;
            this.contractUrl = contractUrl;
            $('header .title').text(_this.investInfo.borrowName);
            document.title = _this.investInfo.borrowName
            if (_this.investInfo.borrowActivityIcon !== '') {
              _this.isActive = 'block';
            }
          }
        })
        .fail(function () {})
    },
    methods: {
      durTypeMap: util.durTypeMap,
      linkContract: function () {
        util.toast('请到pc电脑端查看相关合同');
      },
      linkCont: function () {
        util.toast('请到pc电脑端查看相关合同');
      },
      goback: function() {
        history.back(-1)
      }
    }
  })
}
//回款计划
vms.receivePlan = function () {
  new Vue({
    el: '#hd',
    data: {
      data: '',
      investPlan: [],
      curStatue: 'WAITREC',
      activeArr: [true, false],
    },
    created: function () {
      //var _self=this;
      this.getReceivePlan();
    },
    methods: {
      getReceivePlan: function () {
        var _self = this;
        var nowurl = document.URL;
        nowurl = location.href;
        var userId = util.getRequest(nowurl, "userId");
        $.ajax({
            url: Helper.basePath + 'member/receivePlan.htm',
            type: 'POST',
            dataType: 'json',
            xhrFields: {
              withCredentials: true
            },
            data: {
              investId: util.hrefSplit(window.location.href).investId,
              status: this.curStatue,
              userId: userId
            }
          })
          .done(function (data) {
            var data = JSON.parse(data);
            _self.data = data;
            // document.title = data.borrowName 
            if (data.isLogin === 'N' && util.isEmpty(userId)) {
              window.location.href = Helper.webPath + 'src/base/login.html?bUrl=/src/account/index.html';
            } else {
              _self.activePage(0);
            }
          })
          .fail(function () {})
      },
      activePage: function (num) {
        this.activeArr = [false, false];
        this.activeArr[num] = true;
        this.investPlan = [];
        var data = this.data;
        var typeSrt = ''
        if (num === 0) {
          typeSrt = "待收款";
          //					typeSrt = "收款中";
        } else {
          typeSrt = "已收款";
        }
        for (var i = 0; i < data.result.length; i++) {
          if (data.result[i].status === typeSrt) {
            this.investPlan.push(data.result[i]);
          }
        }
      },
      remark: function () {
        var data = this.data;
        for (var i = 0; i < data.result.length; i++) {
          var remarkObj = data.result[i];
        }
        util.confirmAct(remarkObj.remark, '', '知道了', function () {})
        $('.confirm_no').hide(); //去除弹出 取消 btn
      }
    }
  })
}

vms.cFriend = function () {
  new Vue({
    el: "#myFriends",
    data: {

    },
    created: function () {
      var _this = this;
      var nowurl = window.location.href;
      var winUserPercentage = util.getRequest(nowurl, "winUserPercentage");
      var totalPersons = util.getRequest(nowurl, "inviteUsers");
      var totalRebate = util.getRequest(nowurl, "totalRebate");
      $("#winUserPercentage").text(winUserPercentage + '%');
      $("#totalPersons").text(totalPersons);
      $("#totalRebate").text(totalRebate);
    }
  })
}
// 风险评测
vms.riskAssessment = function () {
  var questionArr = [{
      subject: '你所处的年龄阶段？',
      options: ['25岁及以下', '26-35岁', '36-45岁', '46-60岁', '60岁以上']
    },
    {
      subject: '您的家庭就业状况？',
      options: ['您与配偶均有稳定收入的工作', '您与配偶其中一人有稳定收入的工作', '您与配偶均没有稳定收入的工作或者已退休', '未婚，但有稳定收入的工作', '未婚，目前暂无稳定收入的工作']
    },
    {
      subject: '您进行金融投资（储蓄存款除外）的资金占您可支配收入的比例是？',
      options: ['70% 以上', '50% -70%', '30% －50%', '10% －30%', '10%及 以下']
    },
    {
      subject: '您的年收入状况？',
      options: ['5万及以下', '5-10万', '10-15万', '15-50万', '50万以上']
    },
    {
      subject: '您的投资经验可描述为？',
      options: [
        '有限：除银行活期账户和定期存款、余额宝等货币基金外，我基本没有其他投资经验',
        '一般：除银行活期账户和定期存款外，我购买过P2P、基金、保险、信托等理财产品，但还需要进一步的指导',
        '丰富：我是一位有经验的投资者，参与过股票、期货、基金等产品的交易，并倾向于自己做出投资决策',
        '非常丰富：我是一位非常有经验的投资者，参与过权证、期货或创业板、ST股、等高风险产品的交易',
        '异常丰富：我除证券类高风险投资外，还参与过比特币、莱特币、贵金属交易市场、艺术品投资等极端风险投资。'
      ]
    },
    {
      subject: '您具有多少年投资股票、基金、P2P、外汇、金融衍生品等风险投资品的经验？',
      options: ['无', '1年及以内', '1-3年', '3-5年', '5年以上']
    },
    {
      subject: '您计划的投资期限是多久？',
      options: ['6个月及以下', '0.5-1年', '1-2年', '2-5年', '5年以上']
    },
    {
      subject: '您投资的主要目的是？',
      options: [
        '资产保值，不愿意承担任何投资风险',
        '尽可能保证本金，不在乎收益率比较低',
        '产生较大的收益，可以承担一定的风险',
        '产生较大的收益，可以承担较大的风险',
        '实现资产大幅增长，不在乎风险大小'
      ]
    },
    {
      subject: '在考虑到投资风险的情况下，您认为什么样的年收益率是自己比较满意的?',
      options: ['4-8%', '8-15%', '15-20%', '20-25%', '25%以上']
    },
    {
      subject: '您认为自己能承受的最大投资损失是多少?',
      options: ['我不能承受任何亏损', '10%及以下', '10% -30%', '30% -50%', '超过50%']
    },
  ]

  function initSwiper() {
    window.mySwiperRisk = new Swiper('.option_box .swiper-container', {
      pagination: '.banner .swiper-pagination',
      speed: 0,
      spaceBetween: 100,
      onSlideChangeStart: function (swiper) {
        raVM.curIndex = swiper.realIndex;
      },
      //autoplayDisableOnInteraction : false
      observer: true, //修改swiper自己或子元素时，自动初始化swiper
      observeParents: false //修改swiper的父元素时，自动初始化swiper
    })
  }
  var raVM = new Vue({
    el: '#ra',
    data: {
      questions: [],
      curIndex: 0,
      resultArr: []
    },
    created: function () {
      this.getInitData();
    },
    computed: {
      subjects: function () {
        var subjects = [];
        for (var i = 0; i < this.questions.length; i++) {
          subjects.push(this.questions[i].questionName);
        }
        return subjects;
      },
      subjectsId: function () {
        var subjectsId = [];
        for (var i = 0; i < this.questions.length; i++) {
          subjectsId.push(this.questions[i].id);
        }
        return subjectsId;
      }
    },
    methods: {
      getInitData: function () {
        var _self = this;
        $.ajax({
            url: Helper.basePath + 'survey/list.htm',
            type: 'POST',
            dataType: 'json',
            xhrFields: {
              withCredentials: true
            }
          })
          .done(function (data) {
            var data = JSON.parse(data);
            _self.questions = data.list;
            if (data.isLogin === 'N') { // && util.isEmpty(userId)
              window.location.href = '/src/base/login.html?bUrl=/src/account/risk_assessment.html';
            } else {
              initSwiper();
            }
          })
      },
      selected: function (index) {
        var event = window.event || arguments.callee.caller.arguments[0];
        this.resultArr.splice([this.curIndex], 1, index);
        $(event.target).addClass('active').siblings('.option_item').removeClass('active');
        if (this.curIndex < this.questions.length - 1) {
          mySwiperRisk.slideNext();
        } else {
          this.submitOption();
        }
      },
      prevQue: function () {
        mySwiperRisk.slidePrev();
      },
      submitOption: function () {
        var _self = this;
        if (this.resultArr.length < 10) {
          util.toast('答案不完整！')
          return;
        }
        var dataStr = '';
        for (var i = 0; i < this.subjectsId.length; i++) {
          dataStr += this.subjectsId[i] + ':' + this.resultArr[i] + ';';
        }
        $.ajax({
            url: Helper.basePath + 'survey/answer.htm',
            type: 'POST',
            dataType: 'json',
            xhrFields: {
              withCredentials: true
            },
            data: {
              answers: dataStr
            }
          })
          .done(function (data) {
            var data = JSON.parse(data);
            if (data.code === '000') {
              window.location.href = '/src/account/risk_result.html';
            } else {
              util.toast(data.message);
            }
          })
      }
    }
  })
}
// 微信浏览器隐藏标题
is_weixn()