import BaseListView from "sap/a/view/BaseListView";

export default class SuggestionListView extends BaseListView
{
    afterInit()
    {
        super.afterInit();
    }

    hideSuggestion()
    {
        this.$element.hide();
    }

    showSuggestion()
    {
        this.$element.show();
    }
}
