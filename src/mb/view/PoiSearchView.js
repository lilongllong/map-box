import View from "sap/a/view/View";

import SuggestionListView from "./SuggestionListView";

export default class PoiSearchView extends View
{
    metadata = {
        properties: {
            poi: {type: "object", bindable: true},
            queryPoi: {type: "object", bindable: true}
        },
        events: {
            inputChanged: { parameters: { param1: "string" } },
            searchPoi: { parameters: {}}
        }
    };
    afterInit()
    {
        this.poiSearchView = $(`<input class="searchInput" type="search" placeholder="搜索" />`);
        let inputTimer = null;
        this.poiSearchView.on("input", () => {
            if (inputTimer)
            {
                window.clearTimeout(inputTimer);
                inputTimer = null;
            }
            inputTimer = setTimeout(() => {
                this.fireInputChanged();
            }, 300);

        });

        this.poiSearchView.on("keydown", this._keydown.bind(this));
        this.$container.append(this.poiSearchView);

        this.suggestionListView = new SuggestionListView("suggestion-list-view");
        this.suggestionListView.hideSuggestion();
        this.addSubview(this.suggestionListView);
    }

    getText()
    {
        return this.poiSearchView.val().trim();
    }

    setText(keyword)
    {
        this.poiSearchView.val(keyword);
    }

    setPoi(value)
    {
        this.setProperty("poi", value);
        if (value !== null)
        {
            this.setText(value.name);
        }
    }

    setQueryPoi(value)
    {
        this.setProperty("queryPoi", value);
        if (value !== null)
        {
            this.setText(value.name);
        }
    }

    _keydown(e)
    {
        if (e.keyCode === 13)
        {
            this.fireSearchPoi();
        }
    }
}
