var vms = {};
vms.login = function () {
  //jQuery操作
  $(function () {
    $('.text_error').click(function () {
      $(this).hide();
    })
  })
  new Vue({
    el: '#loginPage',
    data: {
      inpPhone: null,
      inpPsw: null
    },
    created: function () {},
    methods: {
      loginMain: function () {
        var _self = this;
        var phoneState = util.checkPhone(_self.inpPhone);
        var pswState = util.checkPsw_login(_self.inpPsw);
        if (phoneState !== true) {
          $('.inp_phone').siblings('.text_error').show().text(phoneState);
          return;
        }
        if (pswState !== true) {
          $('.inp_pwd').siblings('.text_error').show().text(pswState);
          return;
        }
        $.ajax({
            url: Helper.basePath + 'login.htm',
            type: 'POST',
            dataType: 'json',
            xhrFields: {
              withCredentials: true
            },
            data: {
              'username': _self.inpPhone,
              'password': _self.inpPsw,
            }
          })
          .done(function (data) {
            var data = JSON.parse(data);
            console.log(data);
            if (data.code === '000') {
              util.toast('登录成功');
              util.baseLink('/src/activity/reward_receive/index.html', 2000)
            } else if (data.code === '6008') {
              util.toast(data.message);
            }
          })
      }
    }
  })
}
// 领取页面
vms.receive = function () {
  $(function () {
    $('.btn_submit').click(function () {
      receivePost($('.cur_reward_id').val(), $('.cur_address_id').val());
    })
    $('.container').delegate('.util_alert_bg','click',function(){
      closeModal();
      closeModalCopy();
    })
    
  })
  function openModal(rewardId) {
    $('.container').append('<div class="util_alert_bg"></div>');
    $('.select_address_modal').show();
    $('.cur_reward_id').val(rewardId);
  }

  function closeModal() {
    $('.util_alert_bg').remove();
    $('.select_address_modal').hide();
  }
  function openModalCopy(rewardId) {
    $('.container').append('<div class="util_alert_bg"></div>');
    $('.show_code_modal').show();
  }
  
  function closeModalCopy() {
    $('.util_alert_bg').remove();
    $('.show_code_modal').hide();
  }
  function receivePost(rewardId, addressId) {
    $.ajax({
        url: Helper.basePath + 'common/award/saveOrder.htm',
        type: 'POST',
        data: {
          'addressId': addressId,
          'sendId': rewardId
        },
        xhrFields: {
          withCredentials: true
        }
      })
      .done(function (data) {
        var data = JSON.parse(data);
        util.toast(data.message);
        if (data.code === '0000') {
          window.location.href = '/src/activity/reward_receive/receive_success.html?random='+ parseInt(Math.random() *100000);
        }
      })
  }
  new Vue({
    el: '#indexPage',
    data: {
      rewardList: [],
      orderUser: null,
      orderPhone: null,
      orderDetailAddress: null,
      curStatus: '2',
      curAddressId:null,
      hrefJson:util.hrefSplit(window.location.href)
    },
    created: function () {
      var _self = this;
      _self.getData(_self.curStatus);
      if (util.isEmpty(util.hrefSplit(window.location.href).addressId)) {
        _self.getFristAddress();
      } else {
        _self.getIdToAddress(_self.hrefJson.addressId);
      }
    },
    methods: {
      getData: function (status) {
        var _self = this;
        $.ajax({
            url: Helper.basePath + 'common/award/list.htm',
            type: 'POST',
            data: {
              'status': status
            },
            xhrFields: {
              withCredentials: true
            }
          })
          .done(function (data) {
            var data = JSON.parse(data);
            if (data.code === '0000') {
              console.log(data)
              _self.rewardList = data.list;
            }
            if (data.code === '0001') {
              window.location.href = '/src/activity/reward_receive/login.html';
            }
          })
      },
      getFristAddress: function () {
        var _self = this;
        $.ajax({
            url: Helper.basePath + 'common/award/getFirstAddress.htm',
            type: 'POST',
            xhrFields: {
              withCredentials: true
            }
          })
          .done(function (data) {
            var data = JSON.parse(data);
            if (data.code === '0000') {
              _self.orderUser = data.address.receiver;
              _self.orderPhone = data.address.mobile;
              _self.orderDetailAddress = data.address.provinceName + data.address.cityName + data.address.areaName + data.address.detailAddress;
              $('.cur_address_id').val(data.address.id);
            }
          })
      },
      getIdToAddress: function (addressId) {
        var _self = this;
        $.ajax({
            url: Helper.basePath + 'common/award/getAddressById.htm',
            type: 'POST',
            data: {
              'id': addressId
            },
            xhrFields: {
              withCredentials: true
            }
          })
          .done(function (data) {
            var data = JSON.parse(data);
            if (data.code === '0000') {
              _self.orderUser = data.address.receiver;
              _self.orderPhone = data.address.mobile;
              _self.orderDetailAddress = data.address.provinceName + data.address.cityName + data.address.areaName + data.address.detailAddress;
              $('.cur_address_id').val(data.address.id);
            }
          })
      },
      selectOtherAddress:function(){
        window.location.href = '/src/activity/reward_receive/select_address.html?addressId='+$('.cur_address_id').val();
      },
      navSwitch: function (status, index) {
        var _self = this;
        _self.curStatus = status;
        $('.nav .item').removeClass('active').eq(index).addClass('active');
        _self.getData(status);
      },
      submitReward: function (rewardId, rewardType) {
        if (rewardType === 'SWAP') {
          receivePost(rewardId, '')
        } else {
          if(!this.orderUser){
            window.location.href = '/src/activity/reward_receive/add_updata_address.html';
            return ;
          }
          openModal(rewardId);
        }
      },
      showRewardCode: function (rewardId) {
        var _self = this;
        $.ajax({
            url: Helper.basePath + 'common/award/getCode.htm',
            type: 'POST',
            data: {
              'sendId': rewardId
            },
            xhrFields: {
              withCredentials: true
            }
          })
          .done(function (data) {
            var data = JSON.parse(data);
            if (data.code === '000') {
              openModalCopy();
              $('.text_reward_code').text(data.swapCode);
              $('.text_timeend').text(data.outTime);
            } else {
              util.toast(data.message);
            }
          })
      },
      copyCode:function(){
        if(Clipboard.isSupported()){
          try{
            new Clipboard('.btn_copy_code', {
              text: function(trigger) {
                return $('.text_reward_code').text();
              }
            });
            util.toast('已复制');
          }catch(e){
            alert('浏览器不支持,请手动复制！')
          }
        }else{
          alert('浏览器不支持,请手动复制！')
        }
      }
    }
  })
}
vms.address = function () {
  new Vue({
    el: '#address_list',
    data: {
      data: '',
      isAddress: '',
      hrefJson: util.hrefSplit(window.location.href)
    },
    created: function () {
      var _self = this;
      $.ajax({
          url: Helper.basePath + 'common/award/getAddressList.htm',
          type: 'POST',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          }
        })
        .done(function (data) {
          var data = JSON.parse(data);
          if(data.code === '0000'){
            _self.data = data.addressList;
          }
        })
        .fail(function () {})
    },
    methods: {
      deleteAddress: function (addressId) {
        util.confirmAct('确定要删除此领奖地址', '取消', '删除', function () {
          $.ajax({
              url: Helper.basePath + 'common/award/deleteAddrees.htm',
              type: 'POST',
              dataType: 'json',
              data:{
                'addressId':addressId
              },
              xhrFields: {
                withCredentials: true
              }
            })
            .done(function (data) {
              var data = JSON.parse(data);
              if(data.code === '0000'){
                util.baseLink('/src/activity/reward_receive/address.html', 2000);
              }else{
                util.toast(data.message);
              }
            })
            .fail(function () {})
        })
      },
      setDefautAddress:function(addressId){
        $.ajax({
          url: Helper.basePath + 'common/award/defaultAddrees.htm',
          type: 'POST',
          dataType: 'json',
          data:{
            'addressId':addressId,
            'status':'1'
          },
          xhrFields: {
            withCredentials: true
          }
        })
        .done(function (data) {
          var data = JSON.parse(data);
          util.toast(data.message);
          if(data.code === '0000'){
            window.location.reload();
          }
        })
        .fail(function () {})
      },
      editAddress:function(){

      },
      chooseAddress:function(addressId){
        window.location.href = '/src/activity/reward_receive/index.html?addressId=' + addressId;
      }
    }
  })
}
// 添加收货地址
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
      detailAddress: '', //详细地址
      hrefJson:util.hrefSplit(window.location.href)
    },
    computed: {
      addressId: function () {
        return this.hrefJson.addressId;
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
      if(!util.isEmpty(_self.hrefJson.addressId)){
        $('#title_label').text('修改地址');
        document.title = '修改地址';
        this.getAddressData();
      }else{
        $('#title_label').text('添加地址');
        _self.provinceName = '北京';
        _self.getCity();
      }
    },
    methods: {
      getAddressData:function(){
        var _self = this;
        $.ajax({
          url: Helper.basePath + 'common/award/getAddressById.htm',
          type: 'POST',
          dataType: 'json',
          async:false,
          data:{
            'id':_self.addressId
          },
          xhrFields: {
            withCredentials: true
          }
        })
        .done(function (data) {
          var data = JSON.parse(data);
          console.log(data);
          console.log(data.address.provinceName);
          if(data.code === '0000'){
            _self.receiver = data.address.receiver;
            _self.mobile = data.address.mobile;
            _self.provinceName = data.address.provinceName;
            _self.getCity();
            _self.cityName = data.address.cityName;
            _self.getArea();
            _self.areaName = data.address.areaName;
            _self.detailAddress = data.address.detailAddress;
          }
        })
        .fail(function () {})
      },
      subAddress: function () {
        var _self = this;
        var postData;
        if(!util.isEmpty(_self.hrefJson.addressId)){
          postData={
            addressId:_self.addressId,
            receiver: _self.receiver,
            mobile: _self.mobile,
            provinceName: _self.provinceName,
            cityName: _self.cityName,
            areaName: _self.areaName,
            detailAddress: _self.detailAddress
          }
        }else{
          postData={
            receiver: _self.receiver,
            mobile: _self.mobile,
            provinceName: _self.provinceName,
            cityName: _self.cityName,
            areaName: _self.areaName,
            detailAddress: _self.detailAddress
          }
        }
        var data = {}
        if (util.isEmpty(this.receiver)) {
          util.toast('收货人不能为空');
        } else if (util.checkPhone(this.mobile) !== true) {
          util.toast(util.checkPhone(this.mobile));
        } else if (util.isEmpty(this.provinceName) || util.isEmpty(this.cityName) || util.isEmpty(this.areaName)) {
          util.toast('请选择完整省市区地址');
        } else if (util.isEmpty(this.detailAddress)) {
          util.toast('请填写详细地址');
        } else if(util.checkLength(this.detailAddress,10,255) !== true){
            var results = "详细地址" + util.checkLength(this.detailAddress,11,255);
            util.toast(results);
        } else {
          $.ajax({
              url: Helper.basePath + 'common/award/saveOrUpdateAddrees.htm',
              type: 'POST',
              dataType: 'json',
              xhrFields: {
                withCredentials: true
              },
              data: postData
            })
            .done(function (data) {
              var data = JSON.parse(data);
              util.toast(data.message);
              if (data.code === '0000') {
                util.baseLink('/src/activity/reward_receive/address.html', 2000);
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