import HTMLControl from '../../HTMLControl.js'
import RemoteRestInterface from '../../Remote/RemoteRestInterface'
import HTMLControlAttrs from '../../HTMLControlAttrs.js'
import RuntimeGeneralInstance from '../../RuntimeGeneralInstance.js'

var WLDCT_ListTableContainer = {
    GetHTML: function () {
        return "<table id=\"example\" class=\"stripe row-border order-column\" style=\"width:100%\">\n" +
            "        <thead>\n" +
            "            <tr>\n" +
            "                <th colspan='2'>First name</th>\n" +
            "                <th>Position</th>\n" +
            "                <th>Office</th>\n" +
            "                <th colspan='2'>Age</th>\n" +
            "                <th>Salary</th>\n" +
            "                <th>Extn.</th>\n" +
            "                <th>E-mail</th>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <th>First name</th>\n" +
            "                <th>Last name</th>\n" +
            "                <th>Position</th>\n" +
            "                <th>Office</th>\n" +
            "                <th>Age</th>\n" +
            "                <th>Start date</th>\n" +
            "                <th>Salary</th>\n" +
            "                <th>Extn.</th>\n" +
            "                <th>E-mail</th>\n" +
            "            </tr>\n" +
            "        </thead>\n" +
            "        <tbody>\n" +
            "            <tr>\n" +
            "                <td><a onclick='alert(1)'>Tiger</a></td>\n" +
            "                <td>Nixon</td>\n" +
            "                <td>System Architect</td>\n" +
            "                <td>Edinburgh</td>\n" +
            "                <td>61</td>\n" +
            "                <td>2011/04/25</td>\n" +
            "                <td>$320,800</td>\n" +
            "                <td>5421</td>\n" +
            "                <td>t.nixon@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Garrett</td>\n" +
            "                <td>Winters</td>\n" +
            "                <td>Accountant</td>\n" +
            "                <td>Tokyo</td>\n" +
            "                <td>63</td>\n" +
            "                <td>2011/07/25</td>\n" +
            "                <td>$170,750</td>\n" +
            "                <td>8422</td>\n" +
            "                <td>g.winters@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Ashton</td>\n" +
            "                <td>Cox</td>\n" +
            "                <td>Junior Technical Author</td>\n" +
            "                <td>San Francisco</td>\n" +
            "                <td>66</td>\n" +
            "                <td>2009/01/12</td>\n" +
            "                <td>$86,000</td>\n" +
            "                <td>1562</td>\n" +
            "                <td>a.cox@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Cedric</td>\n" +
            "                <td>Kelly</td>\n" +
            "                <td>Senior Javascript Developer</td>\n" +
            "                <td>Edinburgh</td>\n" +
            "                <td>22</td>\n" +
            "                <td>2012/03/29</td>\n" +
            "                <td>$433,060</td>\n" +
            "                <td>6224</td>\n" +
            "                <td>c.kelly@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Airi</td>\n" +
            "                <td>Satou</td>\n" +
            "                <td>Accountant</td>\n" +
            "                <td>Tokyo</td>\n" +
            "                <td>33</td>\n" +
            "                <td>2008/11/28</td>\n" +
            "                <td>$162,700</td>\n" +
            "                <td>5407</td>\n" +
            "                <td>a.satou@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Brielle</td>\n" +
            "                <td>Williamson</td>\n" +
            "                <td>Integration Specialist</td>\n" +
            "                <td>New York</td>\n" +
            "                <td>61</td>\n" +
            "                <td>2012/12/02</td>\n" +
            "                <td>$372,000</td>\n" +
            "                <td>4804</td>\n" +
            "                <td>b.williamson@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Herrod</td>\n" +
            "                <td>Chandler</td>\n" +
            "                <td>Sales Assistant</td>\n" +
            "                <td>San Francisco</td>\n" +
            "                <td>59</td>\n" +
            "                <td>2012/08/06</td>\n" +
            "                <td>$137,500</td>\n" +
            "                <td>9608</td>\n" +
            "                <td>h.chandler@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Rhona</td>\n" +
            "                <td>Davidson</td>\n" +
            "                <td>Integration Specialist</td>\n" +
            "                <td>Tokyo</td>\n" +
            "                <td>55</td>\n" +
            "                <td>2010/10/14</td>\n" +
            "                <td>$327,900</td>\n" +
            "                <td>6200</td>\n" +
            "                <td>r.davidson@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Colleen</td>\n" +
            "                <td>Hurst</td>\n" +
            "                <td>Javascript Developer</td>\n" +
            "                <td>San Francisco</td>\n" +
            "                <td>39</td>\n" +
            "                <td>2009/09/15</td>\n" +
            "                <td>$205,500</td>\n" +
            "                <td>2360</td>\n" +
            "                <td>c.hurst@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Sonya</td>\n" +
            "                <td>Frost</td>\n" +
            "                <td>Software Engineer</td>\n" +
            "                <td>Edinburgh</td>\n" +
            "                <td>23</td>\n" +
            "                <td>2008/12/13</td>\n" +
            "                <td>$103,600</td>\n" +
            "                <td>1667</td>\n" +
            "                <td>s.frost@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Jena</td>\n" +
            "                <td>Gaines</td>\n" +
            "                <td>Office Manager</td>\n" +
            "                <td>London</td>\n" +
            "                <td>30</td>\n" +
            "                <td>2008/12/19</td>\n" +
            "                <td>$90,560</td>\n" +
            "                <td>3814</td>\n" +
            "                <td>j.gaines@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Quinn</td>\n" +
            "                <td>Flynn</td>\n" +
            "                <td>Support Lead</td>\n" +
            "                <td>Edinburgh</td>\n" +
            "                <td>22</td>\n" +
            "                <td>2013/03/03</td>\n" +
            "                <td>$342,000</td>\n" +
            "                <td>9497</td>\n" +
            "                <td>q.flynn@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Charde</td>\n" +
            "                <td>Marshall</td>\n" +
            "                <td>Regional Director</td>\n" +
            "                <td>San Francisco</td>\n" +
            "                <td>36</td>\n" +
            "                <td>2008/10/16</td>\n" +
            "                <td>$470,600</td>\n" +
            "                <td>6741</td>\n" +
            "                <td>c.marshall@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Haley</td>\n" +
            "                <td>Kennedy</td>\n" +
            "                <td>Senior Marketing Designer</td>\n" +
            "                <td>London</td>\n" +
            "                <td>43</td>\n" +
            "                <td>2012/12/18</td>\n" +
            "                <td>$313,500</td>\n" +
            "                <td>3597</td>\n" +
            "                <td>h.kennedy@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Tatyana</td>\n" +
            "                <td>Fitzpatrick</td>\n" +
            "                <td>Regional Director</td>\n" +
            "                <td>London</td>\n" +
            "                <td>19</td>\n" +
            "                <td>2010/03/17</td>\n" +
            "                <td>$385,750</td>\n" +
            "                <td>1965</td>\n" +
            "                <td>t.fitzpatrick@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Michael</td>\n" +
            "                <td>Silva</td>\n" +
            "                <td>Marketing Designer</td>\n" +
            "                <td>London</td>\n" +
            "                <td>66</td>\n" +
            "                <td>2012/11/27</td>\n" +
            "                <td>$198,500</td>\n" +
            "                <td>1581</td>\n" +
            "                <td>m.silva@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Charde</td>\n" +
            "                <td>Marshall</td>\n" +
            "                <td>Regional Director</td>\n" +
            "                <td>San Francisco</td>\n" +
            "                <td>36</td>\n" +
            "                <td>2008/10/16</td>\n" +
            "                <td>$470,600</td>\n" +
            "                <td>6741</td>\n" +
            "                <td>c.marshall@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Haley</td>\n" +
            "                <td>Kennedy</td>\n" +
            "                <td>Senior Marketing Designer</td>\n" +
            "                <td>London</td>\n" +
            "                <td>43</td>\n" +
            "                <td>2012/12/18</td>\n" +
            "                <td>$313,500</td>\n" +
            "                <td>3597</td>\n" +
            "                <td>h.kennedy@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Tatyana</td>\n" +
            "                <td>Fitzpatrick</td>\n" +
            "                <td>Regional Director</td>\n" +
            "                <td>London</td>\n" +
            "                <td>19</td>\n" +
            "                <td>2010/03/17</td>\n" +
            "                <td>$385,750</td>\n" +
            "                <td>1965</td>\n" +
            "                <td>t.fitzpatrick@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Michael</td>\n" +
            "                <td>Silva</td>\n" +
            "                <td>Marketing Designer</td>\n" +
            "                <td>London</td>\n" +
            "                <td>66</td>\n" +
            "                <td>2012/11/27</td>\n" +
            "                <td>$198,500</td>\n" +
            "                <td>1581</td>\n" +
            "                <td>m.silva@datatables.net</td>\n" +
            "            </tr>\n" +
            "        </tbody>\n" +
            "    </table>"
    },
    _objectType:"Instance",//Static;
    _prop:{
        $singleControlElem:null,
        instanceName:null,
        elemId:null
    },
    _InstanceMap: {},
    _CurrentPageNum: 1,
    _DataSet: null,
    _Cache$SingleControlElem: null,
    _CacheRendererDataChainParas: null,
    _SimpleSearchContainerInstance: null,
    _ComplexSearchContainerInstance: null,
    _QueryPOList: [],
    _CheckedRecordArray: [],
    _$Elem: null,
    _ListRuntimeInstance:null,
    //_DataSetRuntimeInstance: null,
    GetInstance: function (name) {
        for (var key in this._InstanceMap) {
            if (key == name) {
                return this._InstanceMap[key];
            }
        }
        var instance = eval(name);
        this._InstanceMap[name] = instance;
        return instance;
    },
    Initialize: function () {
        //this._DataSetRuntimeInstance = Object.create(DataSetRuntime);
    },
    RendererChain: function (_rendererChainParas) {

        //return;
        //$singleControlElem.hide();
        let $singleControlElem = _rendererChainParas.$singleControlElem;
        this._ListRuntimeInstance=_rendererChainParas.runtimeRootHostInstance;
        this._$Elem = $singleControlElem;
        //console.log($singleControlElem);
        //console.log($singleControlElem.prevAll("[client_resolve='WLDCT_ListSimpleSearchContainer']"));
        let $simpleSearchContainerElem = $singleControlElem.prevAll("[client_resolve='WLDCT_ListSimpleSearchContainer']");
        let $complexSearchContainerElem = $singleControlElem.prevAll("[client_resolve='WLDCT_ListComplexSearchContainer']");
        this._SimpleSearchContainerInstance = HTMLControl.GetControlInstanceByElem($simpleSearchContainerElem);
        this._ComplexSearchContainerInstance = HTMLControl.GetControlInstanceByElem($complexSearchContainerElem);

        //HTMLControl.SaveControlNewInstanceToPool($singleControlElem, this);

        this._SimpleSearchContainerInstance._$SimpleSearchButton.bind("click", {"listInstance": this}, this.SimpleSearchClickEvent);
        this._SimpleSearchContainerInstance._$ShowComplexSearchButton.bind("click", {"listInstance": this}, this.ShowComplexSearchClickEvent);
        this._ComplexSearchContainerInstance._$ComplexSearchButton.bind("click", {"listInstance": this}, this.ComplexSearchClickEvent);
        this._ComplexSearchContainerInstance._$ClearButton.bind("click", {"listInstance": this}, this.ComplexSearchClearClickEvent);
        this._ComplexSearchContainerInstance._$CloseButton.bind("click", {"listInstance": this}, this.ComplexSearchCloseClickEvent);

        if (this._SimpleSearchContainerInstance.GetStatus() == "disable") {
            this._SimpleSearchContainerInstance.Hide();
        }
        if (this._ComplexSearchContainerInstance.GetStatus() == "disable") {
            this._SimpleSearchContainerInstance.HideComplexButton();
        }
        //let $buttonDivElemList=$singleControlElem.find("div"+HTMLControlAttrs.SELECTED_JBUILD4DC_CUSTOM);
        //$singleControlElem.find("[is-op-button-wrap-table='true']").hide();
        /*$singleControlElem.find(".wldct-list-table-inner-wrap").html(this.GetHTML());
        $singleControlElem.find(".wldct-list-table-inner-wrap").width("2200px");
        let table = $('#example').DataTable( {
            scrollY:        "400px",
            scrollX:        true,
            paging:         false,
            "ordering": false,
            "searching": false,
            "info": false
        } );*/
        let $templateTable = $singleControlElem.find("table.list-table");
        let $templateTableRow = $singleControlElem.find("table tbody tr:not([is-inner-op-button-wrap-table] tr)");
        let $templateTableHeaderRows = $singleControlElem.find("table thead tr");
        //debugger
        this.AppendCheckBoxColumnTemplate($templateTable, $templateTableHeaderRows, $templateTableRow);

        HTMLControl.RendererChain(_rendererChainParas);
        //console.log("2222222222");
    },
    RendererDataChain: function (_rendererDataChainParas, isReRenderer) {
        //return
        //debugger;
        //console.log(_rendererDataChainParas.$singleControlElem.html());
        //console.log(HTMLControl._InstanceMap["WLDCT_ListTableContainer_856efcb11c8241288367fcc717ec7b5e"]);
        //console.log(HTMLControl._InstanceMap["WLDCT_ListTableContainer_856efcb11c8241288367fcc717ec7b5e"]);
        //????????????
        this._prop._RendererDataChainIsCompleted=false;

        let usedTopDataSet = true;

        let dataSetId;
        let pageSize;
        if (usedTopDataSet) {
            dataSetId = _rendererDataChainParas.topDataSetId;
            pageSize = _rendererDataChainParas.po.listDatasetPageSize;
        }

        /*if(RuntimeGeneralInstance.TryGetUrlParaChangeMainDataSetId()){
            dataSetId = RuntimeGeneralInstance.TryGetUrlParaChangeMainDataSetId();
        }*/

        if (!this._CacheRendererDataChainParas) {
            this._CacheRendererDataChainParas = _rendererDataChainParas;
            this._Cache$SingleControlElem = _rendererDataChainParas.$singleControlElem.clone();
        }
        if (isReRenderer) {
            //??????????????????
            //console.log(this._Cache$SingleControlElem.html());
            let notScriptHTML=StringUtility.RemoveScript(this._Cache$SingleControlElem.html());
            _rendererDataChainParas.$singleControlElem.html(notScriptHTML);
        }
        else{
            //???????????????
            let conditions = this._SimpleSearchContainerInstance.BuilderSearchCondition();
            this._QueryPOList = conditions;
        }

        if (this._ListRuntimeInstance.IsPreview()) {
            //alert("????????????????????????");
            let mockDataSet = {
                "total": 1000,
                "list": [],
                "pageNum": 1,
                "pageSize": 5,
                "size": 5,
                "startRow": 1,
                "endRow": 5,
                "pages": 200,
                "prePage": 0,
                "nextPage": 2,
                "isFirstPage": true,
                "isLastPage": false,
                "hasPreviousPage": false,
                "hasNextPage": true,
                "navigatePages": 8,
                "navigatepageNums": [1, 2, 3, 4, 5, 6, 7, 8],
                "navigateFirstPage": 1,
                "navigateLastPage": 8,
                "firstPage": 1,
                "lastPage": 8
            };
            this._DataSet = mockDataSet;
            this.CreateTable(_rendererDataChainParas.$singleControlElem, mockDataSet,true);
        } else {

            DialogUtility.AlertLoading(window, DialogUtility.DialogLoadingId, {
                title: "????????????",
                hide: {effect: "fade", duration: 500}
            }, "???????????????,?????????....");


            RemoteRestInterface.getWebListRuntimeDataSetData({
                dataSetId: dataSetId,
                pageSize: pageSize,
                pageNum: this._CurrentPageNum,
                listQueryPOList: this._QueryPOList,
                exValue1: "",
                exValue2: "",
                exValue3: ""
            }).then((response) => {
                //console.log(result);
                //console.log(HTMLControl._InstanceMap);
                let result = response.data;
                _rendererDataChainParas.dataSet = result.data;
                this._DataSet = result.data;

                this._CheckedRecordArray = [];
                this.CreateTable(_rendererDataChainParas.$singleControlElem, this._DataSet, false);
                window.setTimeout(function () {
                    DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);
                }, 500);

                this._prop._RendererDataChainIsCompleted = true;
            }, this);
        }
    },
    CreateTable: function ($singleControlElem, dataSet,isPreview) {
        //let $singleControlElem=_rendererDataChainParas.$singleControlElem;
        let $templateTable = $singleControlElem.find("table.list-table");
        let $templateTableRow = $singleControlElem.find("table tbody tr:not([is-inner-op-button-wrap-table] tr)");
        let $templateTableHeaderRows = $singleControlElem.find("table thead tr");
        //let dataSet=_rendererDataChainParas.dataSet;

        if ($templateTableRow.length > 0) {
            let $templateTableBody = $singleControlElem.find("table.list-table").children("tbody");
            //debugger;
            for (let i = 0; i < dataSet.list.length; i++) {
                $templateTableBody.append(this.RendererSingleRow($templateTable, $templateTableRow, dataSet, dataSet.list[i]));
            }
            $templateTableRow.remove();

            if(isPreview){
                $templateTable.find("[singlename='WLDCT_ListTableInnerButtonContainer']").remove();
            }//$templateTable.find("")
        }

        //????????????????????????
        //debugger;
        $singleControlElem.find(".uid-container-inner-wrap").append(this.CreatePaging());
        //alert(PageStyleUtility.GetWindowWidth());
        //$singleControlElem.find(".uid-wldct-list-table-container-inner-wrap").width(PageStyleUtility.GetPageWidth() - 20);
        $templateTable.addClass("stripe row-border order-column");
        $templateTable.width("100%");
        let scrollY = PageStyleUtility.GetPageHeight();

        scrollY = scrollY - 110;

        if($(".uid-wldct-list-button-container-wrap").css("display")!="none"){
            scrollY = scrollY - $(".uid-wldct-list-button-container-wrap").height()-12;
        }
        if($(".uid-wldct-list-simple-search-container-wrap").css("display")!="none") {
            scrollY = scrollY - $(".uid-wldct-list-simple-search-container-wrap").height()-10;
        }

        if(RuntimeGeneralInstance.TryGetUrlParaViewOnly()){
            if($singleControlElem.find("tr").find("th:last").text()=="??????"){
                $singleControlElem.find("tr").find("th:last").hide();
                $singleControlElem.find("tr").find("td:last").hide();
            }
        }

        let table = $templateTable.DataTable({
            scrollY: scrollY,
            scrollX: true,
            paging: false,
            "ordering": false,
            "searching": false,
            "info": false
        });
    },
    AppendCheckBoxColumnTemplate: function ($templateTable, $templateTableHeaderRows, $templateTableRow) {
        let $th = $("<th style='width: 30px'></th>");
        if ($templateTableHeaderRows.length > 1) {
            $th.attr("rowspan", $templateTableHeaderRows.length);
        }
        $templateTable.find("colgroup").prepend("<col style=\"width: 30px\" />")
        let primaryKey=this._ListRuntimeInstance._ListPO.listDatasetPrimaryKey;
        $($templateTableHeaderRows[0]).prepend($th);
        $($templateTableRow.eq(0)).prepend(`<td>
                                    <div 
                                    columnalign="????????????" 
                                    columncaption=`+primaryKey+` 
                                    columndatatypename="?????????" 
                                    columnname=`+primaryKey+` 
                                    columntablename="" 
                                    control_category="InputControl" 
                                    custclientrenderermethod="" 
                                    custclientrenderermethodpara="" 
                                    custserverresolvemethod="" 
                                    custserverresolvemethodpara="" 
                                    defaulttext="" 
                                    defaulttype="" 
                                    defaultvalue="" 
                                    desc="" 
                                    id="check_box_template" 
                                    is_jbuild4dc_data="true" 
                                    jbuild4dc_custom="true" 
                                    name="check_box_template" 
                                    placeholder="" 
                                    serialize="true" 
                                    show_remove_button="true" 
                                    singlename="WLDCT_ListTableCheckBox" 
                                    style="" 
                                    targetbuttonid="" 
                                    client_resolve="WLDCT_ListTableCheckBox">
                                        ID
                                    </div>
                                  </td>`);
    },
    RendererSingleRow: function ($templateTable, $templateTableRow, dataSet, rowData) {
        //console.log(dataSet);
        let $cloneRow = $templateTableRow.clone();
        //console.log($cloneRow);
        //debugger;
        let $tds = $cloneRow.children("td");
        for (let i = 0; i < $tds.length; i++) {
            let $td = $($tds[i]);
            let $divCTElem = $td.find("div" + HTMLControlAttrs.SELECTED_JBUILD4DC_CUSTOM);
            if ($divCTElem.length > 0) {
                let bindToField = $divCTElem.attr("columnname");
                let val = rowData[bindToField]?rowData[bindToField]:"";
                let clientResolveInstanceName = $divCTElem.attr(HTMLControlAttrs.CLIENT_RESOLVE);
                //console.log(clientResolveInstanceName);
                //debugger;
                let instance = WLDCT_ListTableContainer.GetInstance(clientResolveInstanceName);

                try {
                    instance.RendererDataChain({
                        $templateTable: $templateTable,
                        $templateTableRow: $templateTableRow,
                        $singleControlElem: $divCTElem,
                        dataSet: dataSet,
                        rowData: rowData,
                        $cloneRow: $cloneRow,
                        $td: $td,
                        val: val,
                        runtimeRootHostInstance: this._ListRuntimeInstance
                    });
                }
                catch (e){
                    console.log(clientResolveInstanceName);
                    throw e;
                }
            }
            //this.RendererSingleCell($templateTable,$templateTableRow, dataSet, rowData, $cloneRow, $td, val);
        }
        return $cloneRow;
    },
    CreatePaging: function ($templateTable, $templateTableRow, dataSet, rowData, $row, $td, value) {
        //$td.css("textAlign","center");
        //$td.html(value);

        let _self = this;
        let pagingOuterElem = $("<div class='table-paging-outer'><div class='table-paging-inner'></div></div>")
        let pagingInnerElem = pagingOuterElem.find("div");
        let firstPage = $("<div class='table-paging-button'>?????????</div>");
        firstPage.click(function () {
            _self.ChangePageNum(1);
        });
        let prePage = $("<div class='table-paging-button'>?????????</div>");
        prePage.click(function () {
            //console.log(_self._CurrentPageNum);
            if (_self._CurrentPageNum > 1) {
                _self.ChangePageNum(_self._CurrentPageNum - 1);
            } else {
                DialogUtility.AlertText("?????????????????????!");
            }
        });
        let lastPage = $("<div class='table-paging-button'>??????</div>");
        lastPage.click(function () {
            _self.ChangePageNum(_self._DataSet.pages);
        });
        let nextPage = $("<div class='table-paging-button'>?????????</div>");
        nextPage.click(function () {
            if (_self._CurrentPageNum < _self._DataSet.pages) {
                _self.ChangePageNum(_self._CurrentPageNum + 1);
            } else {
                DialogUtility.AlertText("?????????????????????!");
            }
        });
        //console.log(_self._DataSet);
        let info = $("<div class='table-paging-info'>????????????" + _self._DataSet.total + "???&nbsp;&nbsp;?????????" + _self._CurrentPageNum + "/" + _self._DataSet.pages + "???</div>")
        pagingInnerElem.append(firstPage).append(prePage).append(nextPage).append(lastPage).append(info);
        return pagingOuterElem;
    },
    ChangePageNum: function (pageNum) {
        this._CurrentPageNum = pageNum;
        this.RendererDataChain(this._CacheRendererDataChainParas, true);
    },
    TryReloadForListFormButton:function(listFormButtonElemId) {
        //alert(listFormButtonElemId);
        let $listFormButtonElem = $("#" + listFormButtonElemId);
        let $listTemplate=$listFormButtonElem.parentsUntil("[singlename='WLDCT_ListTemplate']").last().parent();
        let $listTableContainer=$listTemplate.find("[singlename='WLDCT_ListTableContainer']");
        let $listTableContainerInstance=HTMLControl.GetControlInstanceByElem($listTableContainer);
        $listTableContainerInstance.RendererDataChain($listTableContainerInstance._CacheRendererDataChainParas, true);
    },
    SimpleSearchClickEvent: function (sender) {
        //console.log(HTMLControl._InstanceMap["WLDCT_ListTableContainer_856efcb11c8241288367fcc717ec7b5e"]);
        let _self = sender.data.listInstance;
        let conditions = _self._SimpleSearchContainerInstance.BuilderSearchCondition();
        _self._QueryPOList = conditions;

        _self.RendererDataChain(_self._CacheRendererDataChainParas, true);
    },
    ShowComplexSearchClickEvent: function (sender) {
        let _self = sender.data.listInstance;
        //console.log(_self._ComplexSearchContainerInstance);
        DialogUtility.DialogElemObj(_self._ComplexSearchContainerInstance._$SingleControlElem, {
            title: "????????????",
            height: 410,
            width: 800,
            modal: true
        })
    },
    ComplexSearchClickEvent: function (sender) {
        console.log("????????????.");
        let _self = sender.data.listInstance;
        let simpleConditions = _self._SimpleSearchContainerInstance.BuilderSearchCondition();
        let complexConditions = _self._ComplexSearchContainerInstance.BuilderSearchCondition();
        _self._QueryPOList = complexConditions.concat(simpleConditions);
        _self.RendererDataChain(_self._CacheRendererDataChainParas, true);
        DialogUtility.CloseDialogElem(_self._ComplexSearchContainerInstance._$SingleControlElem)
    },
    ComplexSearchCloseClickEvent: function (sender) {
        let _self = sender.data.listInstance;
        DialogUtility.CloseDialogElem(_self._ComplexSearchContainerInstance._$SingleControlElem)
    },
    ComplexSearchClearClickEvent: function (sender) {
        let _self = sender.data.listInstance;
        DialogUtility.AlertText("?????????!");
    },

    GetRecordData: function (id) {
        //console.log(this._DataSet);
        //console.log(this._ListRuntimeInstance._ListPO);
        //debugger;
        let primaryKey=this._ListRuntimeInstance.GetPrimaryKey();
        if(!this._ListRuntimeInstance.CheckPrimaryKeyInDataSet(this._DataSet,primaryKey)){
            DialogUtility.AlertText("?????????????????????????????????:[" + primaryKey+"],???????????????????????????!");
            return;
        }
        console.log("?????????:"+primaryKey)
        for (let i = 0; i < this._DataSet.list.length; i++) {
            let recordData = this._DataSet.list[i];
            if (recordData[primaryKey] == id) {
                return recordData;
            }
        }
        DialogUtility.AlertText("?????????????????????:["+primaryKey+"]???:" + id + "?????????!");
        return null;
    },
    SaveCheckedRowData: function (id) {
        let record = this.GetRecordData(id);
        if (record != null) {
            this._CheckedRecordArray.push({
                "Id": id,
                "Record": record
            })
        }
    },
    DeleteCheckedRowData: function (id) {
        for (let i = 0; i < this._CheckedRecordArray.length; i++) {
            if (this._CheckedRecordArray[i].Id == id) {
                ArrayUtility.Delete(this._CheckedRecordArray, i);
            }
        }
    },
    GetCheckedRecord: function () {
        return this._CheckedRecordArray;
    },
    GetLastCheckedRecord: function () {
        if (this._CheckedRecordArray.length > 0) {
            return this._CheckedRecordArray[this._CheckedRecordArray.length - 1];
        }
        return null;
        //alert(1);
    },
    ClearAllCheckBox: function () {
        //debugger;
        this._$Elem.find(":checkbox").prop('checked', false);
        this._CheckedRecordArray = [];
    },
    SetCheckBoxToCheckedStatus: function (id) {
        this._$Elem.find("[row_checkbox_record_id='" + id + "']:checkbox").prop('checked', true);
        this.SaveCheckedRowData(id);
    },
    __InnerElemGetInstance: function ($innerElem) {
        let $WLDCT_ListTableContainer = $innerElem.parents("[singlename='WLDCT_ListTableContainer']");
        let listTableContainerInstance = HTMLControl.GetControlInstanceByElem($WLDCT_ListTableContainer);
        return listTableContainerInstance;
    }
}

export {WLDCT_ListTableContainer as default};