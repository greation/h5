var ga={}
/*法律合规 */
ga.messages_list=function(){
    var vm = new Vue({
        el:"#flaw",
        data:{
            data:"",
            pageIndex:1,
            items:[]
        },
        created:function(){
            var _this=this;
            this.getData();
        },
        methods:{
            getData:function(){
                var _this=this;
                $.ajax({
                    type:"post",
                    url:Helper.basePath + 'information/compliance.htm',
                    async:false,
                    data:{
                        page:_this.pageIndex
                    },
                    datatype:"json",
                    xhrFields: {withCredentials: true},
                    success:function(data){
                        var data = JSON.parse(data);
                        _this.data =data;
                        for(var i=0; i<data.data.length;i++){
                            data.data[i].summary=util.removeHTMLTag(data.data[i].summary);
                            _this.items.push(data.data[i]);
                        }
                    }
                });
            },
            messages_detail:function(id){
                var _self=this;
                window.location.href="message.html?id=" + id;
            }
        }
    });
}
//审核信息
ga.skmessage=function () {
    var vm =new Vue({
        el:"#skxx",
        data:{
            skmessage:[],
            cwreport:[],
            lawyerShow:false,
            financeShow:false,
            allShow:false
        },
        created:function () {
            this.getData();
            if(this.skmessage.length == 0 && this.cwreport.length == 0){
                this.allShow = true;
            }
        },
        methods:{
            getData:function () {
                var _this =this;
                $.ajax({
                    url: Helper.basePath + 'information/lawyer.htm',
                    type: 'POST',
                    dataType: 'json',
                    xhrFields: {
                        withCredentials: true
                    },
                    async: false,
                    data: {}
                }).done(function (data) {
                    var dataJson = JSON.parse(data);
                    _this.skmessage=dataJson.data;
                    if(_this.skmessage.length > 0){
                        _this.lawyerShow = true;
                    }else{
                        _this.lawyerShow = false;
                    }
                });
                $.ajax({
                    url: Helper.basePath + '/information/finance.htm',
                    type: 'POST',
                    dataType: 'json',
                    xhrFields: {
                        withCredentials: true
                    },
                    async: false,
                    data: {}
                }).done(function (data2) {
                    var data2Json = JSON.parse(data2);
                    _this.cwreport=data2Json.data;
                    if(_this.cwreport.length > 0){
                        _this.financeShow = true;
                    }else{
                        _this.financeShow = false;
                    }
                });

            }
        }

    })
}
/*法律合规详情   */
ga.messagesTip=function(){
    new Vue({
        el:'#messagesTip',
        data:{
            data:'',
            messageId:util.hrefSplit(window.location.href).id,
            userId:util.hrefSplit(window.location.href).userId
        },
        created:function(){
            var _self=this;
            $.ajax({
                url: Helper.basePath+'information/'+ _self.messageId + '.htm',
                type: 'POST',
                dataType: 'json',
                xhrFields: {withCredentials: true},
                data:{"id":_self.messageId},
            })
                .done(function(data) {
                    var data = JSON.parse(data);
                    _self.data = data;
                })
                .fail(function() {
                })
        },
        methods:{

        }
    })
}
//审核信息详情
ga.skMsg = function(){
    new Vue({
        el:'#skMsg',
        data:{
            images:[],
            id:util.hrefSplit(window.location.href).id
        },
        created:function(){
            var _this=this;
            $.ajax({
                url: Helper.basePath+'information/'+ _this.id + '.htm',
                type: 'POST',
                dataType: 'json',
                ansync:false,
                data:{
                    id:_this.id
                },
                xhrFields: {withCredentials: true},
            })
                .done(function(data){
                    var data = JSON.parse(data);
                    $("#title_label").text(data.title || "审核信息");
                    document.title = data.title || "审核信息";
                    _this.images = data.images;
                })
                .fail(function(){
                    util.toast('网络请求失败');
                })
        }
    })
}




