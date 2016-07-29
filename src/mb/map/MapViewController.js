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

    searchRoute(locations)
    {
        if (locations && locations.length)
        {
            const startLocation = locations[0];
            ServiceClient.getInstance().searchRoute(startLocation, endLocation).then(result => {
                const endLocation = locations[locations.length - 1];
                this.view.NaviLayer.applySettings({
                    startLocation,
                    endLocation
                });

                this.view.NaviLayer.drawRoutes(result);
                this.view.NaviLayer.fitBounds();
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
