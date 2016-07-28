import AdaptiveMapView from "sap/a/map/MapView";
import TileLayer from "sap/a/map/layer/TileLayer";

import ServiceClient from "../../gd/service/ServiceClient";

import NaviLayer from "./layer/NaviLayer";

export default class MapView extends AdaptiveMapView
{
    metadata = {
        events: {
            queryClickChanged: { parameters: { location: "object"} }
        }
    };

    initLayers()
    {
        this.tileLayer = new TileLayer({
            url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        });
        this.addLayer(this.tileLayer);
        this.naviLayer = new NaviLayer();
        this.addLayer(this.naviLayer);
        this.poiMarker = null;
        this.selectedPoiMarker = null; 
    }

    afterInit()
    {
        super.afterInit();
        this.addStyleClass("mb-map-view");
        this.map.on("click", this._map_onclick.bind(this));
    }


    _map_onclick(e)
    {
        if (e.originalEvent.ctrlKey === true)
        {
            this.fireQueryClickChanged([e.latlng.lat, e.latlng.lng]);
        }
    }
}
