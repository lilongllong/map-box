import ViewController from "sap/a/view/ViewController";

import ODSearchView from "./ODSearchView";
import POISearchViewController from "./POISearchViewController";

export default class ODSearchViewController extends ViewController
{
    afterInit()
    {
        super.afterInit();
        this._initChildControllers();
        this.view.attachExchanged(this._onexchanged.bind(this));
    }

    createView(options)
    {
        /* 绑定Model */
        return new ODSearchView("od-search-view", options);
    }

    _initChildControllers()
    {
        this._initOriginPoiSearchController();
        this._initDestinationPoiSearchController();
    }

    _initOriginPoiSearchController()
    {
        this.originController = new POISearchViewController({
            viewOptions: {
                label: "起点：",
                poi: "{/originPoi}",
                placeholder: "搜索起点"
            }
        });
        const $target = this.view.$(".origin-search");
        this.addChildViewController(this.originController, $target);
    }

    _initDestinationPoiSearchController()
    {
        this.destinationController = new POISearchViewController({
            viewOptions: {
                label: "终点：",
                poi: "{/destinationPoi}",
                placeholder: "搜索终点"
            }
        });
        const $target = this.view.$(".destination-search");
        this.addChildViewController(this.destinationController, $target);
    }

    _onexchanged(e)
    {
        const model = sap.ui.getCore().getModel();
        const oriPoi = model.getProperty("/originPoi");
        const destPoi = model.getProperty("/destinationPoi");

        model.setProperty("/originPoi", oriPoi);
        model.setProperty("/destinationPoi", destPoi);
    }

}
