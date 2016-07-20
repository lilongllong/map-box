import AdaptiveApplication from "sap/a/app/ApplicationController";

import Application from "./Application";

export default class ApplicationController extends AdaptiveApplication
{
    createView(options)
    {
        return new Application;
    }

    run()
    {
        console.log("that is ok!");
    }
}
