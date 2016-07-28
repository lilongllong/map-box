import View from "sap/a/view/View";

export default class PoiSearchView extends View
{
    metadata = {
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

    }

    getText()
    {
        return this.poiSearchView.val().trim();
    }

    setText(keyword)
    {
        this.poiSearchView.val(keyword);
    }

    _keydown(e)
    {
        if (e.keyCode === 13)
        {
            this.fireSearchPoi();
        }
    }
}
