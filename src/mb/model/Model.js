import JSONModel from "sap/ui/model/json/JSONModel";

export default class Model extends JSONModel
{
    constructor(...args)
    {
        super({
            originPoi: {name: null, location: null},
            destinationPoi: {name: null, location: null}
        });
    }

    forceSetProperty(sPath, oValue, oContent, bAsyncUpdate)
    {
        const result = this.setProperty(sPath, oValue, oContent, bAsyncUpdate);
        this.checkUpdate(true, false);
        return result;
    }

}
