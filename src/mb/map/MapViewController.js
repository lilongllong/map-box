import MapView from "./MapView";

import AdaptiveMapViewController from "sap/a/map/MapViewController";

import ServiceClient from "gd/service/ServiceClient";

export default class MapViewController extends AdaptiveMapViewController
{

    createView(options)
    {
        const opts = $.extend({
            selectedPoi: "{/selectedPoi}",
            queryPoi: "{/queryPoi}"
        }, options);
        return new MapView("map-view", opts);
    }

    initView()
    {
        this.view.attachEvent("queryClickChanged", this._queryClickChanged_onchange.bind(this));
    }

    searchRoute(startPoi, endPoi)
    {
        if (startPoi && endPoi)
        {
            ServiceClient.getInstance().searchRoute(startPoi.location, endPoi.location).then(result => {
                this.view.naviLayer.applySettings({
                    startLocation: startPoi.location,
                    endLocation: endPoi.location
                });
                this.view.naviLayer.drawRoute(result);
                this.view.naviLayer.fitBounds();
            });
        }
        else
        {
            return false;
        }
    }

    searchPoi(keyword)
    {
        if (keyword && keyword !== "")
        {
            ServiceClient.getInstance().searchPoiAutocomplete(keyword).then(result => {
            });
        }
        else
        {
            console.log("输入为空");
        }
    }

    _queryClickChanged_onchange(e)
    {
        const location = e.getParameters("location");
        ServiceClient.getInstance().geoCoderFromGaode(e.getParameters("location")).then((result) => {
            if (result !== null)
            {
                sap.ui.getCore().getModel().setProperty("/queryPoi", {name: result.formattedAddress, location});
            }
        });
    }
}
