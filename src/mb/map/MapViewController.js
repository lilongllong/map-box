import MapView from "./MapView";

import AdaptiveMapViewController from "sap/a/map/MapViewController";

import ServiceClient from "gd/service/ServiceClient";

export default class MapViewController extends AdaptiveMapViewController
{

    createView(options)
    {
        return new MapView("map-view");
    }

    initView()
    {
        this.view.attachEvent("queryClickChanged", this._queryClickChanged_onchange.bind(this));
        const queryPoiBinding = sap.ui.getCore().getModel().bindProperty("/queryPoi");
        queryPoiBinding.attachChange(this._queryPoiChange.bind(this));

        const selectedPoiBinding = sap.ui.getCore().getModel().bindProperty("/selectedPoi");
        selectedPoiBinding.attachChange(this._selectedPoiChange.bind(this));
    }

    searchRoute(locations)
    {
        if (locations && locations.length)
        {
            const startLocation = locations[0];
            const endLocation = locations[locations.length - 1];
            this.view.NaviLayer.applySettings({
                startLocation,
                endLocation
            });
            this.view.NaviLayer.drawRoutes(locations);
            this.view.NaviLayer.fitBounds();
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
                console.log(result);
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
        ServiceClient.getInstance().geoCoderFromGaode([e.getParameters("location")]).then((result) => {
            if (result !== null)
            {
                sap.ui.getCore().getModel().setProperty("/queryPoi", {name: result.formattedAddress, location});
            }
        });
    }

    _queryPoiChange(e)
    {
        const queryPoi = sap.ui.getCore().getModel().getProperty("/queryPoi");
        console.log("queryPoi", queryPoi);
        if (queryPoi)
        {
            if (this.view.poiMarker === null)
            {
                this.view.poiMarker = L.popup().setLatLng(L.latLng(queryPoi.location[0], queryPoi.location[1]))
                .setContent(queryPoi.name).openOn(this.view.map);
            }
            this.view.poiMarker.setLatLng(L.latLng(queryPoi.location)).setContent(queryPoi.name).openOn(this.view.map);
        }
        else
        {
            this.view.poiMarker.closePopup();
        }
    }

    _selectedPoiChange(e)
    {
        const selectedPoi = sap.ui.getCore().getModel().getProperty("/selectedPoi");
        if (selectedPoi && selectedPoi.location)
        {
            // this.view.map.removeLayer(this.poiMarker);
            // this.view.poiMarker = null;
            if (this.view.selectedPoiMarker === null)
            {

                this.view.selectedPoiMarker = L.circleMarker(L.latLng(selectedPoi.location[0], selectedPoi.location[0]), 200).addTo(this.view.map);
            }
            else
            {
                this.view.selectedPoiMarker.setLatLng(L.latLng(selectedPoi.location[0], selectedPoi.location[0]));
            }
            this.view.setCenterLocation(L.latLng(selectedPoi.location[0], selectedPoi.location[0]), 15, null);
        }
        else
        {
            if (this.view.selectedPoiMarker !== null)
            {
                this.view.selectedPoiMarker.closePopup();
            }
        }

    }
}
