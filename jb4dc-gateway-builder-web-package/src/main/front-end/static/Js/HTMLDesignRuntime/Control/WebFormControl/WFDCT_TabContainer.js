var WFDCT_TabContainer={
    RendererChain:function(_rendererChainParas){
        try {
            var $tabber = _rendererChainParas.$singleControlElem;
            //console.log("1");
            //var $tabbers = $("[renderer_type='Form_Container_Tabber']");
            //if ($tabbers.length == 0) {
            //return;
            //}
            $tabber.hide();
            //debugger;
            //for (var i = 0; i < $tabbers.length; i++) {
            //var $tabber = $($tabbers[i]);
            //debugger;
            var $labers = $tabber.children("[tab_id]");
            var $ul = $("<ul></ul>");
            for (var j = 0; j < $labers.length; j++) {
                var $laber = $($labers[j])
                $ul.append("<li><a href='#" + $laber.attr("tab_id") + "'>" + $laber.text() + "</a><li>")
            }
            $labers.remove();
            $tabber.prepend($ul);
            $("#" + $tabber.attr("id")).tabs({
                activate: function (event, ui) {
                    var newTabOnActivity = ui.newPanel.attr("onActivity");
                    if (newTabOnActivity) {
                        eval(newTabOnActivity + "(event,ui)");
                    }
                    console.log(ui);
                    console.log(event);
                }
            });
            //}
            $tabber.show();
        }
        catch (e){
            throw "WFDCT_TabContainer.RendererChain:"+e;
        }
        HTMLControl.RendererChain(_rendererChainParas);
    },
    RendererDataChain:HTMLControl.RendererDataChain,
    GetValue:HTMLControl.GetValue,
    SetValue:HTMLControl.SetValue
}