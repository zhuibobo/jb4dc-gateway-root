//日期时间工具类
var DateUtility={
    //GetCurrentDataString:function (split) {
        //alert("DateUtility.GetCurrentDataString 已停用");
        /*this.SetSplit(split);*/
        /*var myDate = new Date();
        var year = myDate.getFullYear();
        var month = myDate.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        var day = myDate.getDate();
        if (day < 10) {
            day = "0" + day;
        }
        return year + split + month + split + day;*/
    //},
    DateFormat:function (myDate,split) {
        alert("DateUtility.GetCurrentDataString 已停用");
        /*this.SetSplit(split);*/
        /*var year = myDate.getFullYear();
        var month = myDate.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        var day = myDate.getDate();
        if (day < 10) {
            day = "0" + day;
        }
        return year + split + month + split + day;*/
    },
    ConvertFromString:function(dateString){
        var date = new Date(dateString);
        return date;
    },
    Format:function (myDate,formatString) {
        var o = {
            "M+" : myDate.getMonth()+1, //month
            "d+" : myDate.getDate(),    //day
            "h+" : myDate.getHours(),   //hour
            "m+" : myDate.getMinutes(), //minute
            "s+" : myDate.getSeconds(), //second
            "q+" : Math.floor((myDate.getMonth()+3)/3),  //quarter
            "S" : myDate.getMilliseconds() //millisecond
        };
        if(/(y+)/.test(formatString)) formatString=formatString.replace(RegExp.$1,
            (myDate.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)if(new RegExp("("+ k +")").test(formatString))
            formatString = formatString.replace(RegExp.$1,
                RegExp.$1.length==1 ? o[k] :
                    ("00"+ o[k]).substr((""+ o[k]).length));
        return formatString;
    },
    FormatCurrentDate:function (formatString) {
        var myDate = new Date();
        return this.Format(myDate,formatString);
    },
    GetCurrentDate:function () {
        return new Date();
    },
    GetCurrentTimeStamp:function(){
        return new Date().getTime();
    },
    GetCurrentTimeString:function (){
        return this.FormatCurrentDate("yyyy-MM-dd hh:mm:ss");
    },
    GetCurrentDateString:function (){
        return this.FormatCurrentDate("yyyy-MM-dd");
    },
    DateFormatByTimeStamp:function (timeStamp,formatString) {
        var date = new Date(timeStamp);
        return this.Format(date,formatString);
    }
};

export { DateUtility as default};