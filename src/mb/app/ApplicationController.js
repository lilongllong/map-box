import AdaptiveApplicationController from "sap/a/app/ApplicationController";

import ServiceClient from "gd/service/ServiceClient";

import Application from "./Application";

export default class ApplicationController extends AdaptiveApplicationController
{
    createView(options)
    {
        return new Application(options);
    }

    run()
    {
        ServiceClient.getInstance().attachReady(() => {
            const routeLocations = [ [31.9790247, 118.754884], [32.04389, 118.77881]];
            this.view.mapView.searchRoute(routeLocations);
        });
    }
}
