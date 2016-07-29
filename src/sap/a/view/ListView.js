import View from "./View";

export default class ListView extends View
{
    metadata = {
        properties: {
            items: { type: "object", bindable: true, defaultValue: [] },
            selection: { type: "object" },
            selectedId: { type: "object" }
        },
        events: {
            itemClick: { parameters: { item: "object" } }
        }
    };
    afterInit()
    {
        super.afterInit();
        this._$itemTemplates = [];
        this.addStyleClass("nju-list-view");//tian jian qianzhui fangzhi chongtu
        this._initLayout();
        this.$container.on("mousedown", this.getItemElementTag(), this._onclick.bind(this));
    }

    _initLayout()
    {

    }

    getElementTag()
    {
        return "ul";
    }

    getItemElementTag()
    {
        return "li";
    }

    setItems(items)
    {
        this.setProperty("items", items);
        this.prepareItems(items);
    }

    setSelectedId(value = null)
    {
        this.setProperty("selectedId", value);
        if (value === null)
        {
            this.setProperty("selection", value);
        }

        const $item = this.$getItem(value);
        if ($item.length > 0)
        {
            this.setProperty("selection", value);
        }
    }

    setSelection(value)
    {
        this.setProperty("selection", value);
        this.setProperty("selectedId", this.getIdOfItem(value));
        this.selectItem(value);
        this.fireSelectionChanged();
    }

    getTypeOfItem(item)
    {
        return 0;
    }

    getIdOfItem(item)
    {
        if (item.id)
        {
            return item.id;
        }
        else
        {
            return null;
        }
    }

    prepareItems(items = null)
    {
        if (items && items.length && items.length === 0)
        {
            this.clearItems();
            return;
        }

        const $items = this.$getItems();
        let length = this.getItems().length;
        const newLength = items.length;

        while(length > newLength)
        {
            $($items[length - 1]).remove();
            length--;
        }
        items.forEach((item, index) => {
            /* 先不判断item类型是否相等 */
            if((index + 1) > this.getItems().length)
            {
                this.addItem(item);
            }
            else
            {
                $($items[index]).removeClass("selected");
                this.renderItem(item, $($items[index]));
            }
        });
    }

    $getItems()
    {
        return this.$container.children(this.getItemElementTag());
    }

    clearItems()
    {
        this.selection = null;
        if (this._items !== null)
        {
            if (this._items.length > 0)
            {
                this._items.splice(0, this._items.length);
                this.$container.children(this.getItemElementTag()).remove();
            }
        }
        else
        {
            this._items = [];
        }
    }

    addItem(item)
    {
        const itemType = this.getTypeOfItem(item);
        const $item = this.$createItem(itemType);
        this.renderItem(item, $item);
        this.$container.append($item)
    }

    selectItem(item = null)
    {
        const selection = this.getSelection();
        if (selection === item) return;

        if (selection !== null)
        {
            this.$getItem(selection).removeClass("selected");
        }

        this.setProperty("selection", item);
        if (item)
        {
            const $item = this.$getItem(item);
            $item.addClass("selected");
        }

    }

    showSelection()
    {
        this.removeStyleClass("hide-selection");
    }

    hideSelection()
    {
        this.addStyleClass("hide-selection");
    }

    renderItem(item, $item)
    {
        $item.data("item", item);
        $item.attr("id", "i-" + this.getIdOfItem(item));
    }

    $createItem(itemType = 0)
    {
        if (!this._$itemTemplates[itemType])
        {
            this._$itemTemplates[itemType] = this.$createNewItem(itemType);
        }

        return this._$itemTemplates[itemType].clone();
    }

    $createNewItem(itemType = 0)
    {
        return $(`<${this.getItemElementTag()}/>`);
    }

    $getItem(item)
    {
        const id = this.getIdOfItem(item);
        return this.$container.children("#i-" + id);
    }

    _onclick(e)
    {
        const $item = $(e.currentTarget);
        const item = $item.data("item");
        this.fireItemClick();
    }
}
