import AdaptiveApplicationController from "sap/a/app/ApplicationController";
import MapViewController from "../map/MapViewController";
import PoiSearchViewController from "../view/PoiSearchViewController";

import ServiceClient from "gd/service/ServiceClient";

import Application from "./Application";
import Model from "../model/Model";

export default class ApplicationController extends AdaptiveApplicationController
{
    init()
    {
        super.init();
        this._initModel();
    }

    createView(options)
    {
        return new Application(options);
    }

    run()
    {
        this._initMapViewController();
        this._initPoiSearchViewController();
    }

    _initModel()
    {
        const model = new Model();
        sap.ui.getCore().setModel(model);
    }
    _initMapViewController()
    {
        this.mapViewController = new MapViewController("map-view-controller", {
            defaultZoom: 10
        });
        this.addChildViewController(this.mapViewController);
    }

    _initPoiSearchViewController()
    {
        this.poiSearchViewController = new PoiSearchViewController("mb-poi-search-view-controller");
        this.addChildViewController(this.poiSearchViewController);
    }
}
