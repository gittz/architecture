/**
 * 水平和垂直方向都居中容器, 非自适应，用于宽度高度固定的面板
 * @class BI.CenterLayout
 * @extends BI.Layout
 */
BI.CenterLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.CenterLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-center-layout",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    _init: function () {
        BI.CenterLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        console.log("center布局不需要resize");
    },

    addItem: function (item) {
        //do nothing
        throw new Error("不能添加元素");
    },

    populate: function (items) {
        BI.CenterLayout.superclass.populate.apply(this, arguments);
        var self = this, o = this.options;
        this.clear();
        var list = [];
        BI.each(items, function (i) {
            list.push({
                column: i,
                row: 0,
                el: BI.createWidget({
                    type: "bi.layout",
                    cls: "center-element " + (i === 0 ? "first-element " : "") + (i === items.length - 1 ? "last-element" : "")
                })
            });
        });
        BI.each(items, function (i, item) {
            if (!!item) {
                var w = BI.createWidget(item);
                w.element.css({
                    position: "absolute",
                    left: o.hgap + o.lgap,
                    right: o.hgap + o.rgap,
                    top: o.vgap + o.tgap,
                    bottom: o.vgap + o.bgap,
                    width: "auto",
                    height: "auto"
                }).appendTo(list[i].el.element);
                self.addWidget(w);
            }
        });
        BI.createWidget({
            type: "bi.grid",
            element: this.element,
            columns: list.length,
            rows: 1,
            items: list
        });
    }
});
$.shortcut('bi.center', BI.CenterLayout);