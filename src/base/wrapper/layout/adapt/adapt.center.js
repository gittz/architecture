/**
 * 自适应水平和垂直方向都居中容器
 * @class BI.CenterAdaptLayout
 * @extends BI.Layout
 */
BI.CenterAdaptLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.CenterAdaptLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-center-adapt-layout",
            columnSize: [],
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    _init: function () {
        BI.CenterAdaptLayout.superclass._init.apply(this, arguments);
        var table = BI.createWidget({
            type: "bi.layout",
            tagName: "table",
            attribute: {"cellspacing": 0, "cellpadding": 0}
        });
        table.element.css({
            "position": "relative",
            "width": "100%",
            "height": "100%",
            "white-space": "nowrap",
            "border-spacing": "0px",
            "border": "none",
            "border-collapse": "separate"
        }).appendTo(this.element);
        this.tr = BI.createWidget({
            type: "bi.layout",
            tagName: "tr"
        });
        this.tr.element.appendTo(table.element);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options, w = BI.createWidget(item);
        w.element.css({"position": "relative", "top": "0", "left": "0", "margin": "0px auto"});
        var width = o.columnSize[i] <= 1 ? (o.columnSize[i] * 100 + "%") : o.columnSize[i];
        var td = BI.createWidget({
            type: "bi.default",
            tagName: "td",
            attributes: {
                width: width
            },
            items: [w]
        });
        td.element.css({"max-width": o.columnSize[i]});
        if (i === 0) {
            td.element.addClass("first-element");
        }
        td.element.css({
            "position": "relative",
            "height": "100%",
            "vertical-align": "middle",
            "margin": "0",
            "padding": "0",
            "border": "none"
        });
        if (o.hgap + o.lgap + (item.lgap || 0) !== 0) {
            w.element.css({
                "margin-left": o.hgap + o.lgap + (item.lgap || 0) + "px"
            })
        }
        if (o.hgap + o.rgap + (item.rgap || 0) !== 0) {
            w.element.css({
                "margin-right": o.hgap + o.rgap + (item.rgap || 0) + "px"
            })
        }
        if (o.vgap + o.tgap + (item.tgap || 0) !== 0) {
            w.element.css({
                "margin-top": o.vgap + o.tgap + (item.tgap || 0) + "px"
            })
        }
        if (o.vgap + o.bgap + (item.bgap || 0) !== 0) {
            w.element.css({
                "margin-bottom": o.vgap + o.bgap + (item.bgap || 0) + "px"
            })
        }
        this.addWidget(td);
        return td;
    },

    render: function () {
        if (!BI.isEmpty(this.widgets)) {
            this.tr.element.append(this.hang());
        }
        return this;
    },

    clear: function () {
        this.hang();
        this.widgets = {};
        this.tr.empty();
    },

    empty: function () {
        BI.each(this.widgets, function (i, wi) {
            wi.destroy();
        })
        this.widgets = {};
        this.tr.empty();
    },

    resize: function () {
        console.log("center_adapt布局不需要resize");
    },

    addItem: function (item) {
        BI.CenterAdaptLayout.superclass.addItem.apply(this, arguments);
        var w = this._addElement(this.options.items.length, item);
        this.options.items.push(item);
        w.element.appendTo(this.tr.element);
        return w;
    },

    populate: function (items) {
        BI.CenterAdaptLayout.superclass.populate.apply(this, arguments);
        var self = this;
        BI.each(items, function (i, item) {
            if (!!item) {
                self._addElement(i, item);
            }
        })
        this.render();
    }
});
$.shortcut('bi.center_adapt', BI.CenterAdaptLayout);