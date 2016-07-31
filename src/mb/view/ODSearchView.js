import View from "sap/a/view/View";


export default class ODSearchView extends View
{
    metadata = {
        properties: {
            originPoi: { type: "object", bindable: true },
            destinationPoi: { type: "object", bindable: true }
        },
        events: {
            searchRoute: { parameters: { } },
            exchanged: { parameters: { } }
        }
    };

    afterInit()
    {
        super.afterInit();
        this.addStyleClass("OD-search-view");
        this.$ODSearchView = $(`<div class="iconfont icon-exchange"></div>
                                <div class="OD-search-Input-view">
                                    <div class="origin-search">
                                    </div>
                                    <div class="destination-search">
                                    </div>
                                </div>
                                <button class="search-route-button">搜索路线</button>`);
        this.$container.append(this.$ODSearchView);
        this.$container.children(".icon-exchange").on("click", this._onexchanged.bind(this));
        this.$container.children("button").on("click", this._onsearchRoute.bind(this));
    }

    setOriginPoi(poi)
    {
        this.setProperty("originPoi", poi);

    }

    _onexchanged(e)
    {
        console.log("交换");
        this.fireExchanged();
    }

    _onsearchRoute(e)
    {
        this.fireSearchRoute();
    }
}
