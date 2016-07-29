import Layer from "sap/a/map/layer/Layer";

export default class SelectedPoiLayer extends Layer
{
    init()
    {
        super.init();
        this.selectedPoiGroup = new L.featureGroup();
        this.container.addLayer(this.selectedPoiGroup);
    }

    afterInit()
    {
        super.afterInit();
    }

    updateSelectedPoi(poi)
    {
        const latlng = L.latLng(poi.location.lat, poi.location.lng);
        if (!this.selectedMarker)
        {
            this.selectedMarker = L.circleMarker(latlng);
            this.selectedMarker.setRadius(8);
            this.selectedMarker.setStyle({
                color: "blue",
                opacity: 0.8,
                fillColor: "blue",
                fillOpacity: 0.8
            });
            this.selectedPoiGroup.addLayer(this.selectedMarker);
        }
        else {
            this.selectedMarker.setLatLng(latlng);
        }
    }
}
