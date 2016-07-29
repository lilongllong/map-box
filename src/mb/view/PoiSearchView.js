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
        /*
        这里做的不好，应该四部分各做成一个view, 这样可以单独添加监听和操控
        */
        this.poiSearchView = $(`<div class="iconfont icon-logo"></div><input class="searchInput" type="search" placeholder="搜索" /><div class="iconfont icon-search"></div> <div class="iconfont icon-dir"></div> `);
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
        this.$(".icon-search").on("click", () => {
            this.fireSearchPoi();
        });

        this.suggestionListView = new SuggestionListView("suggestion-list-view");
        this.suggestionListView.hideSuggestion();
        this.addSubview(this.suggestionListView);
    }

    getText()
    {
        return this.$(".searchInput").val().trim();
    }

    setText(keyword)
    {
        this.$(".searchInput").val(keyword);
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
            this.view.suggestionListView.showSuggestion();
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
