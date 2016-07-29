import AdaptiveMapView from "sap/a/map/MapView";
import SelectedPoiLayer from "./layer/SelectedPoiLayer";
import TileLayer from "sap/a/map/layer/TileLayer";

import ServiceClient from "../../gd/service/ServiceClient";

import NaviLayer from "./layer/NaviLayer";

export default class MapView extends AdaptiveMapView
{
    metadata = {
        properties: {
            selectedPoi: { type: "object", bindable: true },
            queryPoi: { type: "object", bindable: true }
        },
        events: {
            queryClickChanged: { parameters: { location: "object"} }
        }
    };

    setSelectedPoi(poi)
    {
        if (poi)
        {
            this.setProperty("selectedPoi", poi);
            this.updateSelectedPoi(poi);
            this.setCenterLocation(L.latLng(poi.location.lat, poi.location.lng), 16);
        }
    }

    setQueryPoi(poi)
    {
        if (poi)
        {
            this.setProperty("queryPoi", poi);
            this.updateQueryPoi(poi);
        }
        else
        {
            this.updateQueryPoi(poi);
        }
    }

    initLayers()
    {
        this.tileLayer = new TileLayer({
            url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        });
        this.addLayer(this.tileLayer);
        this.naviLayer = new NaviLayer();
        this.addLayer(this.naviLayer);
        this.selectedPoiLayer = new SelectedPoiLayer();
        this.addLayer(this.selectedPoiLayer);
        this.poiMarker = null;
    }

    afterInit()
    {
        super.afterInit();
        this.addStyleClass("mb-map-view");
        this.map.on("click", this._map_onclick.bind(this));
    }

    updateSelectedPoi(poi)
    {
        this.selectedPoiLayer.updateSelectedPoi(poi);
    }

    updateQueryPoi(poi)
    {
        if (poi)
        {
            if (this.poiMarker === null)
            {
                this.poiMarker = L.popup().setLatLng(L.latLng(poi.location.lat, poi.location.lng))
                .setContent(poi.name).openOn(this.map);
            }
            this.poiMarker.setLatLng(L.latLng(poi.location.lat, poi.location.lng)).setContent(poi.name).openOn(this.map);
        }
        else
        {
            if (this.poiMarker !== null)
            {
                 this.poiMarker.closePopup();
            }
        }
    }

    _map_onclick(e)
    {
        if (e.originalEvent.ctrlKey === true)
        {
            this.fireQueryClickChanged({lat: e.latlng.lat, lng: e.latlng.lng});
        }
    }
}
