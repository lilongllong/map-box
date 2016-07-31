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
        let inputTimer = null
        this.$searchView.children("input").on("input", () => {
            if (inputTimer)
            {
                window.clearTimeout(inputTimer);
                inputTimer = null;
            }
            inputTimer = setTimeout(() => {
                this.fireInputChanged();
            }, 500);
        });

        this.$searchView.children("input").on("focus", () => {
            this.$suggestionListView.show();
        });

        this.$searchView.children("input").on("blur", () => {
            this.$suggestionListView.hide();
        });

        this.$container.append(this.$searchView);
        this.$suggestionListView = new SuggestionListView("suggestion-list-view");
        this.$suggestionListView.attachItemClick(this._onItemClick.bind(this));
        this.addSubview(this.$suggestionListView, this.$(".search-view"));
        this.$suggestionListView.hide();
    }

    setPoi(poi)
    {
        this.setProperty("poi", poi);
        if (poi)
        {
            this.setKeyWord(poi.name);
            this.$suggestionListView.hide();
        }
    }

    getKeyWord()
    {
        return this.$searchView.children("input").val().trim();
    }

    setKeyWord(keyword)
    {
        this.$searchView.children("input").val(keyword);
    }

    _onItemClick(e)
    {
        const item = e.getParameters().item;
        this.fireItemSelected({item});
    }
}
