import BpmnModeler from 'bpmn-js/lib/NavigatedViewer';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
import jb4dcModdleDescriptor from './JB4DCModdle.json';
import ModelingModule from 'bpmn-js/lib/features/modeling';

/*import emptyBPMNXML from '../../Resources/emptyFlowModel.bpmn';*/
import emptyBPMNXML from '../../Resources/emptyFlowModelV1.bpmn';
import CustomTranslate from './CustomTranslate';
import propertiesPadEntity from './AdditionalModules/PropertiesPadEntity';
import changeColorPadEntity from './AdditionalModules/ChangeColorPadEntity';
import {BpmnJsUtility} from './BpmnJsUtility';
import {PODefinition} from './PODefinition.js';
import he from 'he';

let modeler = null;
let eventBus = null;
var events = [
    //'element.hover',
    //'element.out',
    'element.click',
    //'element.dblclick',
    //'element.mousedown',
    //'element.mouseup'
];

// Our custom translation module1
// We need to use the array syntax that is used by bpmn-js internally
// 'value' tells bmpn-js to use the function instead of trying to instanciate it
var customTranslateModule = {
    translate: [ 'value', CustomTranslate ]
};


class FlowBpmnJsModelerView {
    defaultSetting = {
        RendererToElemId: "",
        FlowBpmnJsContainer: "",
        SelectedElement: null,
        ChangeSelectedElemCB: null,
        Op: BaseUtility.GetAddOperationName()
    };
    setting = {};
    modeler = null;
    static singleFlowBpmnJsIntegrated = null;

    constructor() {

    }

    Initialize(exConfig, flowInstanceRuntimePO) {
        //debugger;
        exConfig = $.extend(true, {}, this.defaultSetting, exConfig);
        this.setting = exConfig;
        this.modeler = new BpmnModeler({
            "container": $("#" + exConfig.RendererToElemId)[0],
            "additionalModules": [
                customTranslateModule,
                ModelingModule
            ],
            // needed if you'd like to maintain camunda:XXX properties in the properties panel
            moddleExtensions: {
                camunda: camundaModdleDescriptor,
                jb4dc: jb4dcModdleDescriptor
            },
            va: "1"
        });
        //propertiesPadEntity.propertiesPadEntity.f1();
        //console.log(propertiesPadEntity.propertiesPadEntity);
        var bpmnModelXML=decodeURIComponent(flowInstanceRuntimePO.bpmnXmlContent);
        this.modeler.importXML(bpmnModelXML, (err) => {
            if (err) {
                console.log(err);
            } else {
                //console.log(this.modeler);
                //console.log(BpmnJsUtility.GetElement(this.modeler,"P004_001"));
                //console.log(BpmnJsUtility.GetProcessElement(this.modeler));
                //this.setting.ChangeSelectedElemCB(BpmnJsUtility.GetProcessElement(this.modeler));
                //if (BaseUtility.IsAddOperation(this.setting.Op)) {
                    //BpmnJsUtility.BPMN_Attr_SetId(BpmnJsUtility.GetProcessElement(this.modeler), "Model_WD_" + StringUtility.Timestamp());
                //}
                this.modeler.get('canvas').zoom('fit-viewport', 'auto');
                //console.log(this.modeler._definitions);
                var modeling = this.modeler.get('modeling');
                var elementRegistry = this.modeler.get('elementRegistry');
                //debugger;
                this.toDefaultActivityStatus(flowInstanceRuntimePO,elementRegistry,modeling);
                this.toHistoryActivityStatus(flowInstanceRuntimePO,elementRegistry,modeling);
                this.toCurrentActivityStatus(flowInstanceRuntimePO,elementRegistry,modeling);
                /*var elementToColor1 = elementRegistry.get('StartEvent_N1');
                var elementToColor2 = elementRegistry.get('UserTask_Activity_N1');
                modeling.setColor([ elementToColor1,elementToColor2 ], {
                    stroke: 'rgb(0,20,80)',
                    fill: 'rgb(0,80,0)'
                });*/
            }
        });

        //const result = await this.modeler.importXML(bpmnModelXML);
        //const { warnings } = result;

        eventBus = this.modeler.get('eventBus');
        console.log(this.modeler);

        eventBus.on("element.click", event => {
            this.setting.SelectedElement = event.element;
            if (typeof (this.setting.ChangeSelectedElemCB) == "function") {
                this.setting.ChangeSelectedElemCB(event.element);
            }
            var clickEventName = event.element.type.replace("bpmn:", "BPMN_") + "ClickEvent";
            if (this[clickEventName] && typeof (this[clickEventName]) == "function") {
                this[clickEventName](event, event.element);
            } else {
                console.log("未定义:" + clickEventName)
            }
        });
        eventBus.on("element.dblclick", event => {
            var clickEventName = event.element.type.replace("bpmn:", "BPMN_") + "DBClickEvent";
            if (this[clickEventName] && typeof (this[clickEventName]) == "function") {
                this[clickEventName](event, event.element);
            } else {
                console.log("未定义:" + clickEventName)
            }
        });

        events.forEach(function (event) {
            eventBus.on(event, function (e) {
                /*console.log(event, 'on', e.element.id);

                var commentsElement=BpmnJsUtility.GetCommentsElement(e.element,true);
                var str = "hello";
                commentsElement.text = str;
                console.log(commentsElement);*/

                //var extensionElements=BpmnJsUtility.GetExtensionElements(e.element,true);
                //console.log(extensionElements);

                //console.log(event, 'on', e.element);
                //console.log(e.element.businessObject.get("camunda:versionTag"));
                //var bo = e.element.businessObject;
                //var e = bo.$model.create('camunda:ExecutionListener', {"class":"wwwwwwwwwwwwwwwwww"});
                //bo.get("extensionElements").values.push(e);
            });
        });
    }

    static CreateInstance(exConfig, flowInstanceRuntimePO) {
        console.log(flowInstanceRuntimePO);
        var instance = new FlowBpmnJsModelerView();
        instance.Initialize(exConfig,flowInstanceRuntimePO);
        this.singleFlowBpmnJsIntegrated = instance;
        return instance;
    }

    static GetInstance() {
        return this.singleFlowBpmnJsIntegrated;
    }

    toStyle(modeling,element,option){
        modeling.setColor([ element ], option);
    }

    toCurrentActivityStatus(flowInstanceRuntimePO,elementRegistry,modeling) {
        var option = {
            stroke: '#2d3232',
            fill: '#E6B0AA'
        };
        //var currentNodeKey=flowInstanceRuntimePO.currentNodeKey;
        var historyExecutionTaskEntityList = flowInstanceRuntimePO.historyExecutionTaskEntityList;
        //debugger;
        if(historyExecutionTaskEntityList!=null&&historyExecutionTaskEntityList.length>0) {
            var currentTaskList = ArrayUtility.Where(historyExecutionTaskEntityList, function (item) {
                return item.extaskStatus == "Processing";
            });
            if (currentTaskList && currentTaskList.length > 0) {
                for (let i = 0; i < currentTaskList.length; i++) {
                    this.toStyle(modeling, elementRegistry.get(currentTaskList[i].extaskCurNodeKey), option);
                }
            }
        }
        else{
            this.toStyle(modeling, elementRegistry.get("StartEvent_N1"), option);
        }
    }

    toDefaultActivityStatus(flowInstanceRuntimePO,elementRegistry,modeling) {

        var option = {
            stroke: '#2d3232',
            fill: '#EBF5FB'
        };

        var endEventList = flowInstanceRuntimePO.bpmnDefinitions.bpmnProcess.endEventList;
        var serviceTaskList = flowInstanceRuntimePO.bpmnDefinitions.bpmnProcess.serviceTaskList;
        var userTaskList = flowInstanceRuntimePO.bpmnDefinitions.bpmnProcess.userTaskList;
        var startEvent = flowInstanceRuntimePO.bpmnDefinitions.bpmnProcess.startEvent;
        var exclusiveGatewayList = flowInstanceRuntimePO.bpmnDefinitions.bpmnProcess.exclusiveGatewayList;
        var parallelGatewayList = flowInstanceRuntimePO.bpmnDefinitions.bpmnProcess.parallelGatewayList;

        this.toStyle(modeling, elementRegistry.get(startEvent.id), option);

        var _this=this;
        function toStyleWithArray(ary){
            if(ary){
                for (let i = 0; i < ary.length; i++) {
                    _this.toStyle(modeling, elementRegistry.get(ary[i].id), option);
                }
            }
        }

        toStyleWithArray(endEventList);
        toStyleWithArray(serviceTaskList);
        toStyleWithArray(userTaskList);
        toStyleWithArray(exclusiveGatewayList);
        toStyleWithArray(parallelGatewayList);
    }

    toHistoryActivityStatus(flowInstanceRuntimePO,elementRegistry,modeling){
        var option = {
            stroke: '#2d3232',
            fill: '#A3E4D7'
        };
        var historicActivityInstancePOList = flowInstanceRuntimePO.historicActivityInstancePOList;
        if(historicActivityInstancePOList){
            for (let i = 0; i < historicActivityInstancePOList.length; i++) {
                if(historicActivityInstancePOList[i].activityType!="multiInstanceBody") {
                    this.toStyle(modeling, elementRegistry.get(historicActivityInstancePOList[i].activityId), option);
                }
            }
        }
    }

    GetModeler() {
        return this.modeler;
    }

    /*BPMN_ProcessClickEvent(event, element) {
        return;
        console.log(element);
        console.log(element.businessObject);
        //let element=event.element;
        var value = BpmnJsUtility.BPMN_GetElementDocumentationText(element);
        console.log(value);
        BpmnJsUtility.BPMN_SetElementDocumentationText(element, "SetElementDocumentationText-" + value);
        value = BpmnJsUtility.BPMN_GetElementDocumentationText(element);
        console.log(value);

        var id = BpmnJsUtility.BPMN_Attr_GetName(element);
        console.log(id);
        BpmnJsUtility.BPMN_Attr_SetName(element, "SetElementName-" + id);
        id = BpmnJsUtility.BPMN_Attr_GetName(element);
        console.log(id);

        var code = BpmnJsUtility.JB4DC_Attr_GetJb4dcCode(element);
        console.log(code);
        BpmnJsUtility.JB4DC_Attr_SetJb4dcCode(element, "SetElementCode-" + code);
        code = BpmnJsUtility.JB4DC_Attr_GetJb4dcCode(element);
        console.log(code);

        var versionTag = BpmnJsUtility.CAMUNDA_Attr_GetVersionTag(element);
        BpmnJsUtility.CAMUNDA_Attr_SetVersionTag(element, "SetElementCode-" + versionTag);
        versionTag = BpmnJsUtility.CAMUNDA_Attr_GetVersionTag(element);
        console.log(versionTag);

        var extensionElements = BpmnJsUtility.BPMN_GetExtensionElements(element);
        console.log(extensionElements);
        BpmnJsUtility.BPMN_CreateExtensionElements(element);

        BpmnJsUtility.CAMUNDA_SetExecutionListenerArray(element, [
                {listenerType: "class", value: "a", eventName: "start"},
                {listenerType: "class", value: "b", eventName: "start"},
                {listenerType: "expression", value: "expression1111", eventName: "start"},
                {listenerType: "expression", value: "expression2222", eventName: "start"},
                {listenerType: "delegateExpression", value: "delegateExpression1111", eventName: "start"},
                {listenerType: "delegateExpression", value: "delegateExpression2222", eventName: "start"}
            ]
        );
        var executionListener = BpmnJsUtility.CAMUNDA_GetExecutionListenerArray(element);
        console.log(executionListener);
        console.log(BpmnJsUtility.CAMUNDA_GetExecutionListenerJson(element));

        BpmnJsUtility.CAMUNDA_SetPropertiesArray(element, [{name: "a", value: "11111"}, {name: "b", value: "22222"}])
        var propertyList = BpmnJsUtility.CAMUNDA_GetPropertiesArray(element);
        console.log(propertyList);
    }

    BPMN_ProcessDBClickEvent(event, element) {
        this.ShowPropertiesWindow(event, element);
    }

    BPMN_UserTaskClickEvent(event, element) {
        BpmnJsUtility.BPMN_GetIncomingSequenceFlowArray(element);
        BpmnJsUtility.BPMN_GetOutgoingSequenceFlowArray(element);
    }

    ShowPropertiesWindow(event, element) {
        var elementType = element.type;
        console.log(element);
        var componentName = "";
        var title = "";
        if (BpmnJsUtility.Is_SequenceFlow(element)) {
            componentName = "sequenceFlowProperties";
            title = "连线设置";
        } else if (BpmnJsUtility.Is_UserTask(element)) {
            componentName = "userTaskProperties";
            title = "用户环节设置";
        } else if (BpmnJsUtility.Is_Process(element)) {
            componentName = "processProperties";
            title = "流程设置";
        } else if (BpmnJsUtility.Is_ServiceTask(element)) {
            componentName = "serviceTaskProperties";
            title = "服务环节设置";
        } else if (BpmnJsUtility.Is_BoundaryEvent(element)) {
            componentName = "boundaryEventProperties";
            title = "边界事件设置";
        } else if (BpmnJsUtility.Is_IntermediateThrowEvent(element)) {
            componentName = "intermediateThrowEventProperties";
            title = "中间抛出事件设置";
        } else if (BpmnJsUtility.Is_IntermediateCatchEvent(element)) {
            componentName = "intermediateCatchEventProperties";
            title = "中间捕获事件设置";
        } else if(BpmnJsUtility.Is_StartEvent_For_Message(element)||BpmnJsUtility.Is_StartEvent_For_Signal(element)||BpmnJsUtility.Is_StartEvent_For_Timer(element)) {
            componentName = "startEventForDefinitionProperties";
            title = "事件开始事件设置";
        } else if(BpmnJsUtility.Is_StartEvent(element)) {
            componentName = "startEventForEmptyProperties";
            title = "空白开始事件设置";
        } else if(BpmnJsUtility.Is_EndEvent_For_Signal(element)){
            componentName = "endEventForDefinitionProperties";
            title = "结束事件设置";
        }
        //console.log(event);
        //console.log(element);
        title=title+"--["+(element.businessObject.name?element.businessObject.name:"未设置名称")+"]";
        var elemToDialogProps = this.SerializationElemToDialogProps(element);
        this.setting.FlowBpmnJsContainer.showProperties(componentName, title, element, elemToDialogProps);
        //alert("1");
    }

    SerializationElemToDialogProps(elem) {
        var result = PODefinition.GetDialogPropertiesPO();
        //debugger;
        //bpmn
        result.bpmn.elem= {
            type: elem.type
        };
        result.bpmn.id = BpmnJsUtility.BPMN_Attr_GetId(elem);
        result.bpmn.name = BpmnJsUtility.BPMN_Attr_GetName(elem);
        result.bpmn.isExecutable = BpmnJsUtility.BPMN_Attr_Process_GetIsExecutable(elem);
        result.bpmn.documentation = BpmnJsUtility.BPMN_GetElementDocumentationText(elem);
        result.bpmn.conditionExpression = BpmnJsUtility.BPMN_GetConditionExpression(elem);
        result.bpmn.multiInstanceLoopCharacteristics = BpmnJsUtility.BPMN_GetMultiInstanceLoopCharacteristics(elem);
        result.bpmn.messages = BpmnJsUtility.BPMN_GetMessages(elem);
        result.bpmn.signals = BpmnJsUtility.BPMN_GetSignals(elem);
        result.bpmn.messageEventDefinition = BpmnJsUtility.BPMN_GetMessageEventDefinition(elem);
        result.bpmn.signalEventDefinition = BpmnJsUtility.BPMN_GetSignalEventDefinition(elem);
        result.bpmn.timerEventDefinition = BpmnJsUtility.BPMN_GetTimerEventDefinition(elem);
        result.bpmn.cancelActivity = BpmnJsUtility.BPMN_Attr_GetCancelActivity(elem);
        //camunda
        result.camunda.versionTag = BpmnJsUtility.CAMUNDA_Attr_GetVersionTag(elem);
        result.camunda.taskPriority = BpmnJsUtility.CAMUNDA_Attr_GetTaskPriority(elem);
        result.camunda.jobPriority = BpmnJsUtility.CAMUNDA_Attr_GetJobPriority(elem);
        result.camunda.candidateStarterGroups = BpmnJsUtility.CAMUNDA_Attr_GetCandidateStarterGroups(elem);
        result.camunda.candidateStarterUsers = BpmnJsUtility.CAMUNDA_Attr_GetCandidateStarterUsers(elem);
        result.camunda.historyTimeToLive = BpmnJsUtility.CAMUNDA_Attr_GetHistoryTimeToLive(elem);

        result.camunda.assignee = BpmnJsUtility.CAMUNDA_Attr_GetAssignee(elem);
        result.camunda.priority = BpmnJsUtility.CAMUNDA_Attr_GetPriority(elem);

        result.camunda.candidateUsers = BpmnJsUtility.CAMUNDA_Attr_GetCandidateUsers(elem);
        result.camunda.candidateGroups = BpmnJsUtility.CAMUNDA_Attr_GetCandidateGroups(elem);

        result.camunda.class = BpmnJsUtility.CAMUNDA_Attr_GetClass(elem);
        result.camunda.type = BpmnJsUtility.CAMUNDA_Attr_GetType(elem);
        result.camunda.topic = BpmnJsUtility.CAMUNDA_Attr_GetTopic(elem);

        result.jb4dc.jb4dcCandidateUsersDesc = BpmnJsUtility.JB4DC_Attr_GetJb4dcCandidateUsersDesc(elem);
        result.jb4dc.jb4dcCandidateGroupsDesc = BpmnJsUtility.JB4DC_Attr_GetJb4dcCandidateGroupsDesc(elem);

        result.camunda.dueDate = BpmnJsUtility.CAMUNDA_Attr_GetDueDate(elem);
        result.camunda.followUpDate = BpmnJsUtility.CAMUNDA_Attr_GetFollowUpDate(elem);

        result.camunda.executionListener = BpmnJsUtility.CAMUNDA_GetExecutionListenerJson(elem);
        if (!result.camunda.executionListener) {
            result.camunda.executionListener = [];
        }
        result.camunda.extensionProperties = BpmnJsUtility.CAMUNDA_GetPropertiesJson(elem);
        if (!result.camunda.extensionProperties) {
            result.camunda.extensionProperties = [];
        }
        result.camunda.taskListener = BpmnJsUtility.CAMUNDA_GetTaskListenerArrayJson(elem);
        if (!result.camunda.taskListener) {
            result.camunda.taskListener = [];
        }

        //jb4dc
        result.jb4dc.jb4dcFlowCategory = BpmnJsUtility.JB4DC_Attr_GetJb4dcFlowCategory(elem);
        result.jb4dc.jb4dcCode = BpmnJsUtility.JB4DC_Attr_GetJb4dcCode(elem);
        result.jb4dc.jb4dcFormId = BpmnJsUtility.JB4DC_Attr_GetJb4dcFormId(elem);
        result.jb4dc.jb4dcAppFormId = BpmnJsUtility.JB4DC_Attr_GetJb4dcAppFormId(elem);
        result.jb4dc.jb4dcFormEx1Id = BpmnJsUtility.JB4DC_Attr_GetJb4dcFormEx1Id(elem);
        result.jb4dc.jb4dcOuterFormUrl = BpmnJsUtility.JB4DC_Attr_GetJb4dcOuterFormUrl(elem);
        result.jb4dc.jb4dcOuterFormEx1Url = BpmnJsUtility.JB4DC_Attr_GetJb4dcOuterFormEx1Url(elem);
        result.jb4dc.jb4dcTenantId = BpmnJsUtility.JB4DC_Attr_GetJb4dcTenantId(elem);
        result.jb4dc.jb4dcProcessTitleEditText = BpmnJsUtility.JB4DC_Attr_GetJb4dcProcessTitleEditText(elem);
        result.jb4dc.jb4dcProcessTitleEditValue = BpmnJsUtility.JB4DC_Attr_GetJb4dcProcessTitleEditValue(elem);
        result.jb4dc.jb4dcProcessDescriptionEditText = BpmnJsUtility.JB4DC_Attr_GetJb4dcProcessDescriptionEditText(elem);
        result.jb4dc.jb4dcProcessDescriptionEditValue = BpmnJsUtility.JB4DC_Attr_GetJb4dcProcessDescriptionEditValue(elem);
        result.jb4dc.jb4dcActions = BpmnJsUtility.JB4DC_GetActions(elem);
        result.jb4dc.jb4dcMainReceiveObjects = BpmnJsUtility.JB4DC_GetMainReceiveObjectsArray(elem);
        result.jb4dc.jb4dcCCReceiveObjects = BpmnJsUtility.JB4DC_GetCCReceiveObjectsArray(elem);
        result.jb4dc.jb4dcSequenceFlowConditionEditText = BpmnJsUtility.JB4DC_Attr_GetJb4dcSequenceFlowConditionEditText(elem);

        result.jb4dc.jb4dcFormPlugin=BpmnJsUtility.JB4DC_Attr_GetJb4dcFormPlugin(elem);
        result.jb4dc.jb4dcFormParas=BpmnJsUtility.JB4DC_Attr_GetJb4dcFormParas(elem);
        result.jb4dc.jb4dcAppFormParas=BpmnJsUtility.JB4DC_Attr_GetJb4dcAppFormParas(elem);
        result.jb4dc.jb4dcFormEx1Plugin=BpmnJsUtility.JB4DC_Attr_GetJb4dcFormEx1Plugin(elem);
        result.jb4dc.jb4dcFormEx1Paras=BpmnJsUtility.JB4DC_Attr_GetJb4dcFormEx1Paras(elem);

        result.jb4dc.jb4dcUseContentDocument = BpmnJsUtility.JB4DC_Attr_GetJb4dcUseContentDocument(elem);
        result.jb4dc.jb4dcContentDocumentPlugin = BpmnJsUtility.JB4DC_Attr_GetJb4dcContentDocumentPlugin(elem);
        result.jb4dc.jb4dcContentDocumentRedHeadTemplate = BpmnJsUtility.JB4DC_Attr_GetJb4dcContentDocumentRedHeadTemplate(elem);

        result.jb4dc.jb4dcProcessCandidateStarterGroups = BpmnJsUtility.JB4DC_Attr_GetJb4dcProcessCandidateStarterGroups(elem);
        result.jb4dc.jb4dcProcessCandidateStarterUsers = BpmnJsUtility.JB4DC_Attr_GetJb4dcProcessCandidateStarterUsers(elem);
        result.jb4dc.jb4dcProcessModelManagerGroups = BpmnJsUtility.JB4DC_Attr_GetJb4dcProcessModelManagerGroups(elem);
        result.jb4dc.jb4dcProcessModelManagerUsers = BpmnJsUtility.JB4DC_Attr_GetJb4dcProcessModelManagerUsers(elem);

        //result.jb4dc.jb4dcActionsOpinionBindToField = BpmnJsUtility.JB4DC_Attr_GetJb4dcActionsOpinionBindToField(elem);
        //result.jb4dc.jb4dcActionsOpinionBindToElemId = BpmnJsUtility.JB4DC_Attr_GetJb4dcActionsOpinionBindToElemId(elem);
        result.jb4dc.jb4dcProcessActionConfirm = BpmnJsUtility.JB4DC_Attr_GetJb4dcProcessActionConfirm(elem);
        result.jb4dc.jb4dcProcessModelGroups = BpmnJsUtility.JB4DC_Attr_GetJb4dcProcessModelGroups(elem);
        result.jb4dc.jb4dcProcessModelImageClass = BpmnJsUtility.JB4DC_Attr_GetJb4dcProcessModelImageClass(elem);
        result.jb4dc.jb4dcProcessRestartEnable = BpmnJsUtility.JB4DC_Attr_GetJb4dcProcessRestartEnable(elem);
        result.jb4dc.jb4dcProcessAnyJumpEnable = BpmnJsUtility.JB4DC_Attr_GetJb4dcProcessAnyJumpEnable(elem);
        result.jb4dc.jb4dcAuthorities = BpmnJsUtility.JB4DC_GetAuthorities(elem);

        if (!result.jb4dc.jb4dcActions) {
            result.jb4dc.jb4dcActions = [];
        }
        if (!result.jb4dc.jb4dcMainReceiveObjects) {
            result.jb4dc.jb4dcMainReceiveObjects = [];
        }
        if (!result.jb4dc.jb4dcCCReceiveObjects) {
            result.jb4dc.jb4dcCCReceiveObjects = [];
        }
        //console.log(PODefinition.GetDialogPropertiesPO().bpmn.id);
        //console.log(result.bpmn.id);
        //console.log(result);
        return result;
    }

    DeSerializationDialogPropsToElem(props, elem) {
        console.log(props);
        BpmnJsUtility.BPMN_Attr_SetName(elem, props.bpmn.name);
        BpmnJsUtility.BPMN_SetElementDocumentationText(elem, props.bpmn.documentation);

        BpmnJsUtility.JB4DC_Attr_SetJb4dcCode(elem, props.jb4dc.jb4dcCode);
        BpmnJsUtility.JB4DC_Attr_SetJb4dcFormId(elem, props.jb4dc.jb4dcFormId);
        BpmnJsUtility.JB4DC_Attr_SetJb4dcAppFormId(elem, props.jb4dc.jb4dcAppFormId);
        BpmnJsUtility.JB4DC_Attr_SetJb4dcFormEx1Id(elem, props.jb4dc.jb4dcFormEx1Id);
        BpmnJsUtility.JB4DC_Attr_SetJb4dcFormPlugin(elem,props.jb4dc.jb4dcFormPlugin);
        BpmnJsUtility.JB4DC_Attr_SetJb4dcFormParas(elem,props.jb4dc.jb4dcFormParas);
        BpmnJsUtility.JB4DC_Attr_SetJb4dcAppFormParas(elem,props.jb4dc.jb4dcAppFormParas);
        BpmnJsUtility.JB4DC_Attr_SetJb4dcFormEx1Plugin(elem,props.jb4dc.jb4dcFormEx1Plugin);
        BpmnJsUtility.JB4DC_Attr_GetJb4dcFormEx1Paras(elem,props.jb4dc.jb4dcFormEx1Paras);

        BpmnJsUtility.JB4DC_Attr_SetJb4dcOuterFormUrl(elem, props.jb4dc.jb4dcOuterFormUrl);
        BpmnJsUtility.JB4DC_Attr_SetJb4dcOuterFormEx1Url(elem, props.jb4dc.jb4dcOuterFormEx1Url);
        BpmnJsUtility.JB4DC_Attr_SetJb4dcTenantId(elem, props.jb4dc.jb4dcTenantId);
        BpmnJsUtility.JB4DC_Attr_SetJb4dcProcessTitleEditText(elem, props.jb4dc.jb4dcProcessTitleEditText);
        BpmnJsUtility.JB4DC_Attr_SetJb4dcProcessTitleEditValue(elem, props.jb4dc.jb4dcProcessTitleEditValue);
        BpmnJsUtility.JB4DC_Attr_SetJb4dcProcessDescriptionEditText(elem, props.jb4dc.jb4dcProcessDescriptionEditText);
        BpmnJsUtility.JB4DC_Attr_SetJb4dcProcessDescriptionEditValue(elem, props.jb4dc.jb4dcProcessDescriptionEditValue);

        BpmnJsUtility.JB4DC_Attr_SetJb4dcUseContentDocument(elem, props.jb4dc.jb4dcUseContentDocument);
        BpmnJsUtility.JB4DC_Attr_SetJb4dcContentDocumentPlugin(elem, props.jb4dc.jb4dcContentDocumentPlugin);
        BpmnJsUtility.JB4DC_Attr_SetJb4dcContentDocumentRedHeadTemplate(elem, props.jb4dc.jb4dcContentDocumentRedHeadTemplate);

        if (props.camunda.executionListener && props.camunda.executionListener.length > 0) {
            BpmnJsUtility.CAMUNDA_SetExecutionListenerArray(elem, props.camunda.executionListener, true);
        } else {
            BpmnJsUtility.CAMUNDA_ClearExecutionListenerArray(elem);
        }
        if (props.camunda.extensionProperties && props.camunda.extensionProperties.length > 0) {
            BpmnJsUtility.CAMUNDA_SetPropertiesArray(elem, props.camunda.extensionProperties, true);
        } else {
            BpmnJsUtility.CAMUNDA_ClearPropertiesArray(elem);
        }

        //console.log(elem);
        if (BpmnJsUtility.Is_Process(elem)) {
            BpmnJsUtility.BPMN_Attr_Process_SetIsExecutable(elem, props.bpmn.isExecutable);
            BpmnJsUtility.BPMN_SetMessages(elem, props.bpmn.messages);
            BpmnJsUtility.BPMN_SetSignals(elem, props.bpmn.signals);

            BpmnJsUtility.CAMUNDA_Attr_SetVersionTag(elem, props.camunda.versionTag);
            BpmnJsUtility.CAMUNDA_Attr_SetTaskPriority(elem, props.camunda.taskPriority);
            BpmnJsUtility.CAMUNDA_Attr_SetJobPriority(elem, props.camunda.jobPriority);
            BpmnJsUtility.CAMUNDA_Attr_SetCandidateStarterGroups(elem, props.camunda.candidateStarterGroups);
            BpmnJsUtility.CAMUNDA_Attr_SetCandidateStarterUsers(elem, props.camunda.candidateStarterUsers);
            BpmnJsUtility.CAMUNDA_Attr_SetHistoryTimeToLive(elem, props.camunda.historyTimeToLive);

            BpmnJsUtility.JB4DC_Attr_SetJb4dcFlowCategory(elem, props.jb4dc.jb4dcFlowCategory);

            BpmnJsUtility.JB4DC_Attr_SetJb4dcProcessCandidateStarterGroups(elem, props.jb4dc.jb4dcProcessCandidateStarterGroups);
            BpmnJsUtility.JB4DC_Attr_SetJb4dcProcessCandidateStarterUsers(elem, props.jb4dc.jb4dcProcessCandidateStarterUsers);
            BpmnJsUtility.JB4DC_Attr_SetJb4dcProcessModelManagerGroups(elem, props.jb4dc.jb4dcProcessModelManagerGroups);
            BpmnJsUtility.JB4DC_Attr_SetJb4dcProcessModelManagerUsers(elem, props.jb4dc.jb4dcProcessModelManagerUsers);

            BpmnJsUtility.JB4DC_Attr_SetJb4dcProcessActionConfirm(elem, props.jb4dc.jb4dcProcessActionConfirm);
            BpmnJsUtility.JB4DC_Attr_SetJb4dcProcessModelGroups(elem, props.jb4dc.jb4dcProcessModelGroups);
            BpmnJsUtility.JB4DC_Attr_SetJb4dcProcessModelImageClass(elem, props.jb4dc.jb4dcProcessModelImageClass);
            BpmnJsUtility.JB4DC_Attr_SetJb4dcProcessRestartEnable(elem, props.jb4dc.jb4dcProcessRestartEnable);
            BpmnJsUtility.JB4DC_Attr_SetJb4dcProcessAnyJumpEnable(elem, props.jb4dc.jb4dcProcessAnyJumpEnable);


            //console.log(props.jb4dc1);
        } else if (BpmnJsUtility.Is_UserTask(elem)) {
            //console.log(props.jb4dc.jb4dcActions);
            BpmnJsUtility.JB4DC_SetActions(elem, props.jb4dc.jb4dcActions, true);
            BpmnJsUtility.JB4DC_SetMainReceiveObjectsArray(elem, props.jb4dc.jb4dcMainReceiveObjects, true);
            BpmnJsUtility.JB4DC_SetCCReceiveObjectsArray(elem, props.jb4dc.jb4dcCCReceiveObjects, true);
            //BpmnJsUtility.JB4DC_Attr_SetJb4dcActionsOpinionBindToField(elem, props.jb4dc.jb4dcActionsOpinionBindToField);
            //BpmnJsUtility.JB4DC_Attr_SetJb4dcActionsOpinionBindToElemId(elem, props.jb4dc.jb4dcActionsOpinionBindToElemId);

            BpmnJsUtility.CAMUNDA_Attr_SetAssignee(elem, props.camunda.assignee);
            BpmnJsUtility.CAMUNDA_Attr_SetPriority(elem, props.camunda.priority);

            BpmnJsUtility.CAMUNDA_Attr_SetCandidateUsers(elem, props.camunda.candidateUsers);
            BpmnJsUtility.CAMUNDA_Attr_SetCandidateGroups(elem, props.camunda.candidateGroups);

            BpmnJsUtility.JB4DC_Attr_SetJb4dcCandidateUsersDesc(elem, props.jb4dc.jb4dcCandidateUsersDesc);
            BpmnJsUtility.JB4DC_Attr_SetJb4dcCandidateGroupsDesc(elem, props.jb4dc.jb4dcCandidateGroupsDesc);

            BpmnJsUtility.CAMUNDA_Attr_SetDueDate(elem, props.camunda.dueDate);
            BpmnJsUtility.CAMUNDA_Attr_SetFollowUpDate(elem, props.camunda.followUpDate);

            //console.log(props.bpmn.multiInstanceLoopCharacteristics);
            BpmnJsUtility.BPMN_SetMultiInstanceLoopCharacteristics(elem, props.bpmn.multiInstanceLoopCharacteristics);

            BpmnJsUtility.JB4DC_SetAuthorities(elem, props.jb4dc.jb4dcAuthorities, true);

            if (props.camunda.taskListener && props.camunda.taskListener.length > 0) {
                BpmnJsUtility.CAMUNDA_SetTaskListenerArray(elem, props.camunda.taskListener, true);
            } else {
                BpmnJsUtility.CAMUNDA_ClearTaskListenerArray(elem);
            }
        } else if (BpmnJsUtility.Is_SequenceFlow(elem)) {
            BpmnJsUtility.JB4DC_Attr_SetJb4dcSequenceFlowConditionEditText(elem, props.jb4dc.jb4dcSequenceFlowConditionEditText, true);
            BpmnJsUtility.BPMN_SetConditionExpression(elem, props.bpmn.conditionExpression, true);
        } else if (BpmnJsUtility.Is_ServiceTask(elem)) {
            BpmnJsUtility.CAMUNDA_Attr_SetClass(elem, props.camunda.class);
            BpmnJsUtility.CAMUNDA_Attr_SetType(elem, props.camunda.type);
            BpmnJsUtility.CAMUNDA_Attr_SetTopic(elem, props.camunda.topic);
        } else if (BpmnJsUtility.Is_BoundaryEvent(elem)) {
            //console.log(props.bpmn);
            //切换到xml时cancelActivity属性未设置正确.
            //BpmnJsUtility.BPMN_Attr_SetCancelActivity(elem,props.bpmn.cancelActivity);
            BpmnJsUtility.BPMN_SetMessageEventDefinition(elem, props.bpmn.messageEventDefinition);
            BpmnJsUtility.BPMN_SetSignalEventDefinition(elem, props.bpmn.signalEventDefinition);
            BpmnJsUtility.BPMN_SetTimerEventDefinition(elem, props.bpmn.timerEventDefinition);
        } else if (BpmnJsUtility.Is_IntermediateThrowEvent(elem)) {
            BpmnJsUtility.BPMN_SetMessageEventDefinition(elem, props.bpmn.messageEventDefinition);
            BpmnJsUtility.BPMN_SetSignalEventDefinition(elem, props.bpmn.signalEventDefinition);
            BpmnJsUtility.BPMN_SetTimerEventDefinition(elem, props.bpmn.timerEventDefinition);
        } else if (BpmnJsUtility.Is_IntermediateCatchEvent(elem)) {
            BpmnJsUtility.BPMN_SetMessageEventDefinition(elem, props.bpmn.messageEventDefinition);
            BpmnJsUtility.BPMN_SetSignalEventDefinition(elem, props.bpmn.signalEventDefinition);
            BpmnJsUtility.BPMN_SetTimerEventDefinition(elem, props.bpmn.timerEventDefinition);
        } else if (BpmnJsUtility.Is_StartEvent_For_Message(elem) || BpmnJsUtility.Is_StartEvent_For_Signal(elem) || BpmnJsUtility.Is_StartEvent_For_Timer(elem)) {
            BpmnJsUtility.BPMN_SetMessageEventDefinition(elem, props.bpmn.messageEventDefinition);
            BpmnJsUtility.BPMN_SetSignalEventDefinition(elem, props.bpmn.signalEventDefinition);
            BpmnJsUtility.BPMN_SetTimerEventDefinition(elem, props.bpmn.timerEventDefinition);
        } else if(BpmnJsUtility.Is_StartEvent(elem)) {
            BpmnJsUtility.JB4DC_SetActions(elem, props.jb4dc.jb4dcActions, true);
        }
        else if (BpmnJsUtility.Is_EndEvent(elem)) {
            BpmnJsUtility.BPMN_SetMessageEventDefinition(elem, props.bpmn.messageEventDefinition);
            BpmnJsUtility.BPMN_SetSignalEventDefinition(elem, props.bpmn.signalEventDefinition);
            BpmnJsUtility.BPMN_SetTimerEventDefinition(elem, props.bpmn.timerEventDefinition);
        }

        var modeling = this.modeler.get('modeling');

        modeling.updateProperties(elem, {});
    }*/

    ZoomAuto() {
        //debugger;
        this.modeler.get('canvas').zoom('fit-viewport', 'auto');
    }

    ZoomP100() {
        this.modeler.get('canvas').zoom(1, 'auto');
    }

    ZoomP50() {
        this.modeler.get('canvas').zoom(0.5, 'auto');
        //var type="horizontal";
        //this.modeler.get('editorActions').trigger("distributeElements",{type});
    }

    Align(type) {
        const modeler = this.modeler;
        const selection = modeler.get('selection').get();
        modeler.get('alignElements').trigger(selection, type);
    }

    Distribute(type) {
        //var type="horizontal";
        //alert(type);
        this.modeler.get('editorActions').trigger("distributeElements", {type});

        /*var fill="rgb(187, 222, 251)";
        var stroke="rgb(30, 136, 229)";
        this.modeler.get('editorActions').trigger('setColor', {
            fill,
            stroke
        });*/
    }

    LogXML() {
        console.log(this.GetXML());
    }

    GetXML(func) {
        //const result = await this.modeler.saveXML(options);
        //debugger;
        var xml;
        this.modeler.saveXML(null, function (error, _xml) {
            xml = _xml;
            console.log(_xml);
            func(xml);
        })
        //console.log(xml);
        return xml;
    }

    SetXML(xml) {
        this.modeler.importXML(xml, function (err) {
            //console.log(err);
        });
    }

    GetSelectedElement() {
        return this.setting.SelectedElement;
    }

    GetProcessElement() {
        return BpmnJsUtility.GetProcessElement(this.modeler);
    }

    GetProcessName(){
        var processElement=this.GetProcessElement();
        return BpmnJsUtility.GetElementName(processElement);
    }

    GetProcessBindFormId() {
        return BpmnJsUtility.GetProcessFormId(this.GetProcessElement());
    }

    TryGetFormId(defaultFormId) {
        var formId = defaultFormId;
        if (!formId) {
            formId = this.GetProcessBindFormId();
        }
        return formId;
    }

    ConvertElemToHTMLDisplay(elem) {
        var elemToDialogProps = this.SerializationElemToDialogProps(elem);
        var type = elem.type;
        var name = elemToDialogProps.bpmn.name;
        var result = [];

        result.push(`<div class="fbse-inner-title">【${type}】${name}</div>`);

        function build(propGroupName, props) {
            for (var key in props) {
                var value = props[key];
                var keyCN = PODefinition.TranslatePropertiesToCN(propGroupName, key);
                if (keyCN) {
                    if (ArrayUtility.IsArray(value)) {
                        if (value.length > 0) {
                            value = "<pre style='min-width: 300px'>" + JsonUtility.JsonToStringFormat(value) + "</pre>";
                        }
                    }
                    else if(typeof(value)=="string"){
                        value = "<pre>" + he.encode(value) + "</pre>";
                    }
                    else if(typeof(value)=="object"){
                        value = "<pre style='min-width: 300px'>" + JsonUtility.JsonToStringFormat(value) + "</pre>";
                    }
                    result.push(`<div class="fbse-inner-single-attr">${keyCN}：</div>
                                 <div class="fbse-inner-single-value">${value}</div>`);
                }
            }
        };
        //debugger;
        build("jb4dc", elemToDialogProps.jb4dc);
        build("bpmn", elemToDialogProps.bpmn);
        build("camunda", elemToDialogProps.camunda);

        return result.join("");
    }
}

//console.log(diagramXML);



export { FlowBpmnJsModelerView };