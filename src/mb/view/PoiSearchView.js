import View from "sap/a/view/View";

import SuggestionListView from "./SuggestionListView";

export default class POISearchView extends View
{
    metadata = {
        properties: {
            poi: { type: "object", bindable: true },
            label: { type: "string" },
            placeholder: { type: "string"}
        },
        events: {
            inputChanged: { parameters: {  } },
            itemSelected: { parameters: { item: "object" } }
        }
    };

    afterInit()
    {
        super.afterInit();
        this.addStyleClass("poi-search-view");
        this.$searchView = $(`<div class="search-view">
                                <div class="text">${this.getProperty("label")}</div>
                                <input type="text" placeholder=${this.getProperty("placeholder")} />
                                </div>`);
        this.$container.append(this.$searchView);
        this.$SuggestionListView = new SuggestionListView("suggestion-list-view");
        this.$SuggestionListView.attachItemClick(this._onItemClick.bind(this));
        this.addSubview(this.$SuggestionListView, this.$(".search-view"));
    }

    _onItemClick(e)
    {
        const item = e.getParameters().item;
        this.fireItemSelected({item});
    }
}
