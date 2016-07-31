import BaseListView from "sap/a/view/BaseListView";

export default class SuggestionListView extends BaseListView
{
    afterInit()
    {
        super.afterInit();
        this.addStyleClass("suggestion-list-view");
    }

    $createNewItem(itemType = 0)
    {
        const $item = super.$createNewItem(0);
        $item.append(`<span class="district"></span>`)
        return $item;
    }

    renderItem(item, $item)
    {
        super.renderItem(item, $item);
        $item.children(".district").html(item.district);
    }
}
