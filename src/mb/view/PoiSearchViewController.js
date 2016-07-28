import ViewController from "sap/a/view/ViewController";

import ServiceClient from "gd/service/ServiceClient";

import PoiSearchView from "./PoiSearchView";

export default class PoiSearchViewController extends ViewController
{

    createView(options)
    {
        return new PoiSearchView("mb-poi-search-view");
    }

    initView()
    {
        this.view.attachInputChanged(this._input_onchange.bind(this));
        this.view.attachSearchPoi(this._searchPoi.bind(this));
        const queryPoiBinding = sap.ui.getCore().getModel().bindProperty("/queryPoi");
        queryPoiBinding.attachChange(this._queryPoiChange.bind(this));
    }

    _input_onchange(e)
    {

    }

    _searchPoi(e)
    {
        if (this.view.getText() !== "")
        {
            ServiceClient.getInstance().searchPoiAutocomplete(this.view.getText()).then((result) => {
                if (result && result.length > 0)
                {
                    sap.ui.getCore().getModel().setProperty("/selectedPoi", {name: result[0].name, location: result[0].location});
                }
            });
        }
    }

    _queryPoiChange()
    {
        const queryPoi = sap.ui.getCore().getModel().getProperty("/queryPoi");
        this.view.setText(queryPoi.name);
    }
}
