import ManagedObject from "sap/ui/base/ManagedObject";

export default class ServiceClient extends ManagedObject
{
    metadata = {
        events: {
            ready: { parameters: { } }
        }
    };

    init()
    {
        AMap.service([ "AMap.Driving", "AMap.Autocomplete", "AMap.Geocoder"], () => {
            this.driving = new AMap.Driving({
                city: "南京市"
            });
            const options = {
                city: "南京"
            };

            this.autocomplete = new AMap.Autocomplete(options);
            this.geoCoder = new AMap.Geocoder({
                radius: 10,
                extensions: ""
            });
            window.setTimeout(() => {
                this.fireReady();
            });
        });
    }

    static _instance = null;

    static getInstance()
    {
        if (gd.service.ServiceClient._instance === null)
        {
            gd.service.ServiceClient._instance = new gd.service.ServiceClient();
        }
        return gd.service.ServiceClient._instance;
    }

    searchPoiAutocomplete(keyword)
    {
        return new Promise((resolve, reject) => {
            this.autocomplete.search(keyword, (status, result) => {
                    if (status === "complete" && result.info === "OK")
                    {
                        const tips = result.tips.map(tip => {
                            tip.location = this.convertToWgs84(tip.location);
                            return tip;
                        });

                        resolve(tips);
                    }
                    else
                    {
                        resolve([]);
                    }
            });
        });
    }

    searchRoute(startLocation, endLocation)
    {
        return new Promise((resolve, reject) => {
            let locs = [];
            this.convertToGcj02([startLocation, endLocation]).then((result) => {
                locs = result.map(loc => [loc.lng, loc.lat]);

                this.driving.search(locs[0], locs[locs.length - 1], (status, result) => {
                    if (status === "complete" && result.info === "OK")
                    {
                        const route = result.routes[0].steps.map(step => {
                            return step.path.map(loc => this._gcj02towgs84(loc.lng, loc.lat));
                        });
                    //    console.log(result.routes[0]);
                        resolve(route);
                    }
                    else
                    {
                        reject("searchRoute() failed and code:", result);
                    }
                });
            });
        });
    }

    geoCoderFromGaode(location)
    {
        return new Promise((resolve, reject) => {
            this.convertToGcj02(location).then((result) => {
                let loc = new AMap.LngLat(result[0].lng, result[0].lat);

                this.geoCoder.getAddress(loc, (status, result) => {
                    if (status === "complete" && result.info === "OK")
                    {
                        resolve(result.regeocode);
                    }
                    else
                    {
                        resolve(null);
                    }
                });
            });
        });
    }

    convertToGcj02(locations)
    {
        return new Promise((resolve, reject) => {
            let locs = null;
            if (!Array.isArray(locations))
            {
                locs = [locations];
            }
            else
            {
                locs = locations;
            }

            const newLocs = locs.map(loc => [L.latLng(loc).lng, L.latLng(loc).lat]);

            AMap.convertFrom(newLocs, "gps",(status, result) => {
                if (status === "complete" && result.info === "ok")
                {
                    resolve(result.locations);
                }
                else
                {
                    reject("convertToGcj02() failed", status);
                }
            });
        });
    }

    convertToWgs84(locations)
    {
        if (!Array.isArray(locations))
        {
            locations = [locations]
        }
        return locations.map(loc => this._gcj02towgs84(loc.lng, loc.lat));
    }

    /**
     * GCJ02 转换为 WGS84
     * @param lng
     * @param lat
     * @returns {*[]}
     */
     _gcj02towgs84(lng, lat) {
         const PI = 3.1415926535897932384626;
         const a = 6378245.0;
         const ee = 0.00669342162296594323;

        if (this._out_of_china(lng, lat)) {
            return [lng, lat]
        }
        else
        {
            let dlat = this._transformlat(lng - 105.0, lat - 35.0);
            let dlng = this._transformlng(lng - 105.0, lat - 35.0);
            const radlat = lat / 180.0 * PI;
            let magic = Math.sin(radlat);
            magic = 1 - ee * magic * magic;
            const sqrtmagic = Math.sqrt(magic);
            dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
            dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
            let mglat = lat + dlat;
            let mglng = lng + dlng;
            return [ lat * 2 - mglat, lng * 2 - mglng ];
        }
    }

    _transformlat(lng, lat) {
        const PI = 3.1415926535897932384626;
        const a = 6378245.0;
        const ee = 0.00669342162296594323;

        let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
        return ret;
    }

    _transformlng(lng, lat) {
        const PI = 3.1415926535897932384626;
        const a = 6378245.0;
        const ee = 0.00669342162296594323;

        let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
        return ret;
    }

    /**
     * 判断是否在国内，不在国内则不做偏移
     * @param lng
     * @param lat
     * @returns {boolean}
     */
    _out_of_china(lng, lat) {
        return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
    }
}
