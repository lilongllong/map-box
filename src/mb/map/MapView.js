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

    searchRoute()
    {
        this.NaviLayer.applySettings({
            startLocation: [31.9790247, 118.754884],
            endLocation: [32.04389, 118.77881]
        });
        this.NaviLayer.drawRoute();
        this.NaviLayer.fitBounds();

    }
}
