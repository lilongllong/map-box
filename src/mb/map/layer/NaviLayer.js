import Layer from "sap/a/map/layer/Layer";

import ServiceClient from "gd/service/ServiceClient";

export default class UntitledView extends Layer
{
    metadata = {
        properties: {
            startLocation: { type: "any"},
            endLocation: { type: "any" }
        }
    };

    init()
    {
        super.init();
        this.routeGroup = L.featureGroup();
        this.container.addLayer(this.routeGroup);
        this.markerGroup = L.featureGroup();
        this.container.addLayer(this.markerGroup);
    }

    setStartLocation(location)
    {
        const locs = L.latLng(location);
        this.setProperty("startLocation", locs);
        this._updateStartMarker();
    }

    setEndLocation(location)
    {
        const locs = L.latLng(location);
        this.setProperty("endLocation", locs);
        this._updateEndMarker();
    }

    drawRoute(locations)
    {
        ServiceClient.getInstance().searchRoute(locations).then(result => {
            const multiPolyline = L.multiPolyline(result);
            this.routeGroup.addLayer(multiPolyline);
            
            const polylines = [];
            result.reduce((prev, cur, index) => {
                if (index !== 0)
                {
                    polylines.push([prev[prev.length - 1], cur[0]]);
                }
                return cur;
            }, []);

            polylines.map(loc => {
                L.polyline(loc).addTo(this.routeGroup);
            });
        });
    }

    _updateStartMarker()
    {
        if (!this.startMarker)
        {
            this.startMarker = L.circleMarker(this.getStartLocation(), 8);
            this.startMarker.setStyle({
                color: "green",
                opacity: 0.8,
                fill: "green",
                fillOpacity: 0.8
            });
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
            this.endMarker = L.circleMarker(this.getEndLocation(), 8);
            this.endMarker.setStyle({
                color: "red",
                opacity: 0.8,
                fill: "red",
                fillOpacity: 0.8
            });
            this.markerGroup.addLayer(this.endMarker);
        }
        else
        {
            this.endMarker.setLatLng(this.getEndLocation());
        }
    }
}
