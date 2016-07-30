import AdaptiveApplicationController from "sap/a/app/ApplicationController";
import MapViewController from "../map/MapViewController";
import ODSearchViewController from "../view/ODSearchViewController";

import ServiceClient from "gd/service/ServiceClient";

import Application from "./Application";
import Model from "../model/Model";

export default class ApplicationController extends AdaptiveApplicationController
{
    init()
    {
        super.init();
    }

    afterInit()
    {
        super.afterInit();
        this._initModel();
        this._initMapViewController();
        this._initODSearchViewController();
    }

    createView(options)
    {
        return new Application("application",options);
    }

    run()
    {

    }

    _initModel()
    {
        const model = new Model();
        sap.ui.getCore().setModel(model);
        this.setModel(model);
    }

    _initMapViewController()
    {
        this.mapViewController = new MapViewController("map-view-controller", {
            defaultZoom: 10
        });
        this.addChildViewController(this.mapViewController);
    }

    _initODSearchViewController()
    {
        this.ODSearchViewController = new ODSearchViewController("mb-OD-search-view-controller");
        this.addChildViewController(this.ODSearchViewController);
        this.ODSearchViewController.view.attachSearchRoute(this._searchRoute.bind(this));
    }

    _searchRoute(e)
    {
        const model = sap.ui.getCore().getModel();
        const startPoi = model.getProperty("/originPoi");
        const endPoi = model.getProperty("/destinationPoi");

        this.mapViewController.searchRoute(startPoi, endPoi);
    }
}
