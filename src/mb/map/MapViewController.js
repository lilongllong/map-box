import MapView from "./MapView";

import AdaptiveMapViewController from "sap/a/map/MapViewController";

import ServiceClient from "gd/service/ServiceClient";

export default class MapViewController extends AdaptiveMapViewController
{

    createView(options)
    {
        return new MapView("map-view", options);
    }

    initView()
    {

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
}
