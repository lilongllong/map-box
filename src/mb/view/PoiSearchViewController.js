import ViewController from "sap/a/view/ViewController";

import POISearchView from "./POISearchView";

export default class POISearchViewController extends ViewController
{

    createView(options)
    {
        return new POISearchView("poi-search-view", options);
    }

    afterInit()
    {
        super.afterInit();
    }
}
