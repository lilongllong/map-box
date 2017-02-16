import ViewController from "sap/a/view/ViewController";

import ServiceClient from "gd/service/ServiceClient";

import POISearchView from "./POISearchView";

export default class POISearchViewController extends ViewController
{
    metadata = {
    events: {
        selected: { parameters: { selectedPoi: "object" } }
    }
};
    createView(options)
    {
        return new POISearchView("poi-search-view", options);
    }

    afterInit()
    {
        super.afterInit();
        this.view.attachInputChanged(this._oninputChanged.bind(this));
        this.view.attachItemSelected(this._onitemSelected.bind(this));
    }

    _oninputChanged(e)
    {
        const keyword = this.view.getKeyWord();
        if (keyword && keyword !== "")
        {
            ServiceClient.getInstance().searchPoiAutocomplete(keyword).then((result) => {
                this.view.$suggestionListView.setItems(result);
                this.view.$suggestionListView.show();
            });
        }
        else
        {
            console.log("input can not be empty");
        }
    }

    _onitemSelected(e)
    {
        const item =  e.getParameters().item;
        const selectedPoi = {
            name: item.name,
            location: item.location
        }
        this.fireSelected({selectedPoi});
    }
}
