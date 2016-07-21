import Layer from "sap/a/map/layer/Layer";

export default class ExampleLayer extends Layer
{

    metadata = {
        properties: {
            startLocation: { type: "any" },
            endLocation: { type: "any" }

        }
    }

    init()
    {
        super.init();
        this.markerGroup = L.featureGroup();
        this.container.addLayer(this.markerGroup);
        this.routeGroup = L.featureGroup();
        this.container.addLayer(this.routeGroup);

    }

    setStartLocation(location)
    {
        const loc = L.latLng(location);
        this.setProperty("startLocation", loc);
        this._updateStartMarker();
    }

    setEndLocation(location)
    {
        const loc = L.latLng(location);
        this.setProperty("endLocation", loc);
        this._updateEndMarker();
    }

    drawRoute()
    {
        this.routeGroup.clearLayers();
        const line = [this.getStartLocation(), this.getEndLocation()];
        this.polyline = L.polyline(line);
        this.routeGroup.addLayer(this.polyline);
    }

    _updateStartMarker()
    {
        if (!this.startMarker)
        {
            this.startMarker = L.circleMarker(this.getStartLocation());
            this.startMarker.setStyle({
                color: "green",
                fillColor: "green",
                opacity: 0.2
            });
            this.startMarker.setRadius(16);
            this.startMarker.setLatLng(this.getStartLocation());
            this.markerGroup.addLayer(this.startMarker);
        }
        else
        {
            this.startMarker.setLatLng(this.getStartLocation());
        }
    }

    _updateEndMarker()
    {
        if (!this.endMarker)
        {
            this.endMarker = L.circleMarker(this.getEndLocation());
            this.endMarker.setStyle({
                color: "red",
                fillColor: "red",
                fillOpacity: 0.8,
                opacity: 0.2
            });
            this.endMarker.setRadius(16);
            this.endMarker.setLatLng(this.getEndLocation());
            this.markerGroup.addLayer(this.endMarker);
        }
        else
        {
            this.endMarker.setLatLng(this.getEndLocation());
        }
    }


}
