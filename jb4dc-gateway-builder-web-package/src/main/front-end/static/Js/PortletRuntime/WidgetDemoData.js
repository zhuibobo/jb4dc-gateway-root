let WidgetDemoData={
    getDemoBody: function () {
        return "winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。";
    },
    getQuickEntryDemoProps: function () {
        return {
            QuickEntries: [{
                name: "事务发起",
                caption: "事务发起",
                openType: "innerIframe",
                url: "/QCSystem/JB4DCBuilderClient/HTML/WorkFlow/Runtime/MyBootableMyModels.html?menuId=QCSystem-WorkFlow-Client-Bootable",
                image: "0265.png"
            }, {
                name: "发文发起",
                caption: "发文发起",
                openType: "menu",
                image: "0223.png"
            }, {
                name: "收文发起",
                caption: "收文发起",
                openType: "menu",
                image: "0255.png"
            }, {
                name: "文件传递",
                caption: "文件传递",
                openType: "menu",
                image: "0247.png"
            }]
        }
    },
    getToDoListWidgetProps: function () {
        //DialogUtility.Confirm()
        return {
            list:{
                getListDateRest:"/%(appContextPath)s/Rest/Extension/Portlet/WorkflowTransform/GetMyProcessTaskList",
                getListDateRestParas:{
                    modelCategory:"GeneralProcess",
                    pageSize:12
                },
                openType:"frameIframe",
                dialogConfig:{
                    height: 0,
                    width: 0,
                    title: "JB4DC",
                    modal: true
                },
                fieldParsing:{
                    timeFormat:"%(instanceEntity.instCreateTime)s",
                    titleFormat:"[标题]%(instanceEntity.instTitle)s-%(extaskCurNodeName)s"
                },
                openUrl:"/%(appContextPath)s/JB4DCBuilderClient/HTML/WorkFlow/Runtime/MyEndProcessInstanceMainTask.html?op=edit&extaskId=%(extaskId)s",
                printRowData:false
            },
            more:{
                openType:"frameIframe",
                dialogConfig:{
                    height: 0,
                    width: 0,
                    title: "JB4DC",
                    modal: true
                },
                openUrl:"/%(appContextPath)s/JB4DCBuilderClient/HTML/WorkFlow/Runtime/MyProcessInstanceMainTaskList.html"
            }
        }
    },
    getDemoToDoListData:function (){
        return [{
            prefix:"正常",
            title:"winsw的使用比较简单。",
            date:"2021-05-06 12:55:12"
        },{
            prefix:"加急",
            title:"winsw的使用比较简单。要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；",
            date:"2021-05-05 12:55:12"
        },{
            prefix:"重要",
            title:"winsw的使用比较简单。",
            date:"2021-05-05 12:55:12"
        },{
            prefix:"重要",
            title:"winsw的使用比较简单。要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；",
            date:"2021-05-05 12:55:12"
        },{
            prefix:"正常",
            title:"winsw的使用比较简单。",
            date:"2021-05-05 12:55:12"
        },{
            prefix:"正常",
            title:"winsw的使用比较简单。sw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。w",
            date:"2021-05-05 12:55:12"
        },{
            prefix:"正常",
            title:"winsw的使用比较简单。.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置",
            date:"2021-05-05 12:55:12"
        },{
            prefix:"正常",
            title:"winsw的使用比较简单。sw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。w",
            date:"2021-05-05 12:55:12"
        },{
            prefix:"正常",
            title:"winsw的使用比较简单。.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置",
            date:"2021-05-05 12:55:12"
        },{
            prefix:"正常",
            title:"winsw的使用比较简单。.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置",
            date:"2021-05-05 12:55:12"
        },{
            prefix:"正常",
            title:"winsw的使用比较简单。",
            date:"2021-05-05 12:55:12"
        },{
            prefix:"正常",
            title:"winsw的使用比较简单。sw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。w",
            date:"2021-05-05 12:55:12"
        },{
            prefix:"正常",
            title:"winsw的使用比较简单。",
            date:"2021-05-05 12:55:12"
        }];
    }
}