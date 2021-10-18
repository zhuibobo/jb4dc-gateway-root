let WFDCT_OpinionInput_Demo_Data={
    opinions:[{
        id:"11111111111111111",
        userId:"1",
        userName:"庄锐波",
        organId:"",
        organName:"",
        inputOpinion:"这只是一个测试客户端，所以不能保证这一改变一定会出现在Steam的正式版本中",
        inputTime:DateUtility.GetCurrentTimeString(),
        indexNum:0,
        status:"",
        formClient:""
    },{
        id:"222222222222222",
        userId:"Shi_Ming_Hua_UID",
        userName:"石明华",
        organId:"",
        organName:"",
        inputOpinion:"这只是一个测试客户端",
        inputTime:DateUtility.GetCurrentTimeString(),
        indexNum:1,
        status:"",
        formClient:""
    }]
}

var WFDCT_OpinionInput= {
    _prop:{
        elemId:"",
        clientInstanceName:"",
        $singleControlElem:null,
        mySession:null,
        $rootElem:null,
        $oldOpinionListWrapElem:null,
        $newOpinionInputWrapElem:null,
        $newOpinionInputElem:null,
        oldOpinionsData: {
            opinions:[]
        }
    },
    InitializeAtInstance:function(initializeParas,clientInstanceName,elemId){
        this._prop.elemId=elemId;
        this._prop.clientInstanceName=clientInstanceName;
    },
    RendererChain: function (_rendererChainParas) {
        //console.log(_rendererChainParas);
        let $singleControlElem = _rendererChainParas.$singleControlElem;
        this._prop.$singleControlElem = $singleControlElem;
        this._prop.mySession = _rendererChainParas.po.mySession;
        let newOpinionId=StringUtility.Timestamp();
        let $rootElem = $(`<div class='wfdct-opinion-input-outer-wrap'>
                                <div class='wfdct-old-opinions-list-wrap'></div>
                                <div class='wfdct-new-opinion-input-wrap'>
                                    <textarea newOpinionId="${newOpinionId}"></textarea>
                                </div>
                          </div>`);
        this._prop.$rootElem = $rootElem;
        this._prop.$singleControlElem.html("").append(this._prop.$rootElem);
        this._prop.$newOpinionInputElem=this._prop.$rootElem.find(".wfdct-new-opinion-input-wrap textarea");
        this._prop.$oldOpinionListWrapElem=this._prop.$rootElem.find(".wfdct-old-opinions-list-wrap");
        //console.log(this._prop.$newOpinionInputElem);
    },
    RendererDataChain: function () {

    },
    GetValue: function ($elem, originalData, paras){
        //return
        let newOpinionId=this._prop.$newOpinionInputElem.attr("newOpinionId");

        if(ArrayUtility.NotExist(this._prop.oldOpinionsData.opinions,item=>item.id==newOpinionId)) {
            let newInputOpinion = this._prop.$newOpinionInputElem.val();
            let newOpinionObj = this.BuildNewOpinion(this._prop.mySession, newOpinionId, newInputOpinion, this._prop.oldOpinionsData.opinions.length + 1);
            this._prop.oldOpinionsData.opinions.push(newOpinionObj);
        }

        //console.log(this._prop.oldOpinionsData);
        //console.log(HTMLControl._InstanceMap);
        originalData.value=JsonUtility.JsonToString(this._prop.oldOpinionsData);
        return originalData;
    },
    SetValue: function ($elem, fieldPO, relationFormRecordComplexPo, _rendererDataChainParas){
        //console.log(fieldPO);
        let value={
            opinions:[]
        };
        let _this=this;
        if(fieldPO&&fieldPO.value){
            value=JsonUtility.StringToJson(fieldPO.value);
        }
        this._prop.oldOpinionsData=value;
        //console.log(value);
        for (let i = 0; i < value.opinions.length; i++) {
            let opinion=value.opinions[i];
            let singleOpinionWrap = $("<div class='wfdct-old-opinions-single-wrap' opinion='"+opinion.id+"'><div class='wfdct-old-opinion-text'></div><div class='wfdct-old-opinion-userinfo'></div></div>");
            let opinionText = opinion.inputOpinion;
            let userInfo = opinion.userName + "【" + opinion.inputTime + "】";
            if (opinion.userId == this._prop.mySession.userId) {
                let deleteButton = $("<div class='wfdct-old-opinion-delete' title='删除'><i class=\"las la-times-circle\"></i></div>");
                deleteButton.click(function () {
                    WFDCT_OpinionInput.DeleteOpinion.call(_this,opinion.id);
                });
                singleOpinionWrap.prepend(deleteButton);
            }
            singleOpinionWrap.find(".wfdct-old-opinion-text").html(opinionText);
            singleOpinionWrap.find(".wfdct-old-opinion-userinfo").html(userInfo);
            this._prop.$oldOpinionListWrapElem.append(singleOpinionWrap);
        }
    },
    BuildNewOpinion:function (session,newOpinionId,newInputOpinion,indexNum){
        return {
            id:newOpinionId,
            userId:session.userId,
            userName:session.userName,
            organId:session.organId,
            organName:session.organName,
            inputOpinion:newInputOpinion,
            inputTime:DateUtility.GetCurrentTimeString(),
            indexNum:indexNum,
            status:"general",
            formClient:"webClient"
        }
    },
    DeleteOpinion:function (opinionId){
        DialogUtility.Confirm(window,"您确认要删除该意见吗?",function (){
            //console.log(opinionId);
            //console.log(this._prop.oldOpinionsData);
            this._prop.$oldOpinionListWrapElem.find("[opinion='"+opinionId+"']").remove();
            if(this._prop.oldOpinionsData&&this._prop.oldOpinionsData.opinions&&this._prop.oldOpinionsData.opinions.length>0) {
                ArrayUtility.DeleteWhere(this._prop.oldOpinionsData.opinions, item => item.id == opinionId);
            }
            //console.log(this._prop.oldOpinionsData);
        },this);
    },
    SetNewValue:function (opinion){
        this._prop.$newOpinionInputElem.val(opinion);
    },
    ToViewStatus:function ($elem,fieldPO,relationFormRecordComplexPo,_rendererDataChainParas){
        this._prop.$newOpinionInputElem.hide();
        $(".wfdct-old-opinion-delete").hide();
    }
}