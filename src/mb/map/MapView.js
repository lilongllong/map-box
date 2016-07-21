import AdaptiveMapView from "sap/a/map/MapView";
import TileLayer from "sap/a/map/layer/TileLayer";

import ServiceClient from "gd/service/ServiceClient";

import NaviLayer from "./layer/NaviLayer";

export default class MapView extends AdaptiveMapView
{
    afterInit()
    {
        super.afterInit();
        this.addStyleClass("mb-map-view");
    }

    initLayers()
    {
        this.tileLayer = new TileLayer({
            url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        });
        this.addLayer(this.tileLayer);
        this.NaviLayer = new NaviLayer();
        this.addLayer(this.NaviLayer);
    }

    searchRoute(locations)
    {
        if (locations && locations.length)
        {
            const startLocation = locations[0];
            const endLocation = locations[locations.length - 1];
            this.NaviLayer.applySettings({
                startLocation,
                endLocation
            });
            this.NaviLayer.drawRoute(locations);
            this.NaviLayer.fitBounds();
        }
        else
        {
            return false;
        }
    }
}
