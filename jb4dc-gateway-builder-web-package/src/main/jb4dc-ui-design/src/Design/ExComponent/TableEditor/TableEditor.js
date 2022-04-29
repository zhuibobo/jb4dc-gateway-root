let TableEditor = {
    getTableEditorContextMenu(sender, $elem) {
        return {
            "AddRowAfter": {
                name: "Row-Add-After",
                icon: function (opt, $itemElement, itemKey, item) {
                    return 'context-menu-icon context-menu-icon-edit';
                },
                callback: (key, opt) => {
                    this.addNewRow(sender, $elem, key, opt, "after");
                }
            },
            "RemoveRow": {
                name: "Row-Remove",
                icon: function (opt, $itemElement, itemKey, item) {
                    return 'context-menu-icon context-menu-icon-edit';
                },
                callback: (key, opt) => {
                    this.removeRow(sender, $elem, key, opt);
                }
            },
            "AddColumnAfter": {
                name: "Column-Add-After",
                icon: function (opt, $itemElement, itemKey, item) {
                    return 'context-menu-icon context-menu-icon-edit';
                },
                callback: (key, opt) => {
                    this.addColumn(sender, $elem, key, opt, "after");
                }
            },
            "RemoveColumn": {
                name: "Column-Remove",
                icon: function (opt, $itemElement, itemKey, item) {
                    return 'context-menu-icon context-menu-icon-edit';
                },
                callback: (key, opt) => {
                    this.removeColumn(sender, $elem, key, opt);
                }
            },
            "Cell":{
                name:"Cell",
                icon: function (opt, $itemElement, itemKey, item) {
                    return 'context-menu-icon context-menu-icon-edit';
                },
                items: {
                    "Merge":{
                        name:"Cell-Merge",
                        icon: function (opt, $itemElement, itemKey, item) {
                            return 'context-menu-icon context-menu-icon-edit';
                        },
                        callback: (key, opt) => {
                            // first merge cells horizontally and leave cells marked
                            REDIPS.table.merge('h', false);
                            // and then merge cells vertically and clear cells (second parameter is true by default)
                            REDIPS.table.merge('v');
                        }
                    },
                    "SplitH":{
                        name:"Cell-Split-H",
                        icon: function (opt, $itemElement, itemKey, item) {
                            return 'context-menu-icon context-menu-icon-edit';
                        },
                        callback: (key, opt) => {
                            REDIPS.table.split('h');
                        }
                    },
                    "SplitV":{
                        name:"Cell-Split-V",
                        icon: function (opt, $itemElement, itemKey, item) {
                            return 'context-menu-icon context-menu-icon-edit';
                        },
                        callback: (key, opt) => {
                            REDIPS.table.split('v');
                        }
                    }
                }
            },
            "sepTableEditorL1": "---------"
        }
    },
    _getTableByCell($tdOrTh) {
        let $table = $($tdOrTh.parents("table")[0]);
        return $table;
    },
    _getTBodyByCell($tdOrTh) {
        let $table = this._getTableByCell($tdOrTh);
        return $table.children("tbody");
    },
    _getTHeadByCell($tdOrTh) {
        let $table = this._getTableByCell($tdOrTh);
        return $table.children("thead");
    },
    addNewRow(sender, $elem, itemKey, opt, insertAt) {
        //debugger;
        let $tdOrTh = opt.$trigger;
        let $tbody = this._getTBodyByCell($tdOrTh);
        let $bodyTr = $tdOrTh.parent().clone().find("td").html("").end();
        let $newTr = $("<tr>" + $bodyTr.html() + "</tr>");
        $newTr.find("td").removeClass("context-menu-active").html("");

        if ($tdOrTh.prop("tagName") == "TD") {
            if (insertAt == "after") {
                let $tr = $tdOrTh.parent().after($newTr);
            }
        } else if ($tdOrTh.prop("tagName") == "TH") {
            $tbody.prepend($newTr);
        }
        console.log(opt);
    },
    removeRow(sender, $elem, itemKey, opt) {
        let $tdOrTh = opt.$trigger;
        if ($tdOrTh.prop("tagName") == "TD") {
            $tdOrTh.parent().remove();
        }
    },
    addColumn(sender, $elem, itemKey, opt) {
        let $tdOrTh = opt.$trigger;
        let cellIndex = opt.$trigger.prop("cellIndex");
        let $table = this._getTableByCell($tdOrTh);
        let $tbody = this._getTBodyByCell($tdOrTh);
        let $thead = this._getTHeadByCell($tdOrTh);
        console.log($tdOrTh);
        console.log(cellIndex);
        //debugger;
        if ($table.find("colgroup col").length > 0) {
            $table.find('colgroup col').eq(cellIndex).after('<col style="width: 8%" />');
        }
        $tbody.find('tr').each(function () {
            $(this).find('td').eq(cellIndex).after('<td></td>');
        });
        $thead.find('tr').each(function () {
            $(this).find('th').eq(cellIndex).after('<th></th>');
        });
    },
    removeColumn(sender, $elem, itemKey, opt) {
        let $tdOrTh = opt.$trigger;
        let cellIndex = opt.$trigger.prop("cellIndex");
        let $table = this._getTableByCell($tdOrTh);
        let $tbody = this._getTBodyByCell($tdOrTh);
        let $thead = this._getTHeadByCell($tdOrTh);

        if ($table.find("colgroup col").length > 0) {
            $table.find('colgroup col').eq(cellIndex).remove();
        }

        $tbody.find('tr').each(function () {
            $(this).find('td').eq(cellIndex).remove()
        });
        $thead.find('tr').each(function () {
            $(this).find('th').eq(cellIndex).remove();
        });
    }
}

export {TableEditor as default};