import ManagedObject from "sap/ui/base/ManagedObject";

import View from "./View";

export default class ViewController extends ManagedObject
{
    metadata = {
        aggregations: {
            childViewControllers: {
                type: "sap.a.view.ViewController"
            }
        },
        properties: {
            viewOptions: { type: "object" }
        }
    };

    constructor(...args)
    {
        super(...args);
        this.afterInit();
    }

    init()
	{

    }

    afterInit()
    {
        this.view = this.createView(this.getViewOptions());
        if (this.view instanceof View)
        {
            this.initView();
        }
        else
        {
            throw new Error("createView(options) must return an instance of sap.a.view.View.");
        }
    }


    getView()
    {
        return this.view;
    }


    createView(options)
    {
        throw new Error("createView(options) must be override in the derived class.");
    }

    initView()
    {

    }

    addChildViewController(viewController, $container)
    {
        if (viewController.getParent()){
            viewController.removeFromParent();
        }
        this.addAggregation("childViewControllers", viewController);
        this.view.addSubview(viewController.view, $container);
        return this;
    }

    removeChildController(viewController, neverUseAgain)
    {
        const result = this.removeAggregation("childViewControllers", viewController);
        if (result)
        {
            this.view.removeSubview(result.view, neverUseAgain);
        }
        return result;
    }

    removeAllChildViewControllers(viewController, neverUseAgain)
    {
        while(this.getChildViewControllers().length > 0)
        {
            const viewController = this.removeAggregation("childViewControllers", this.getChildViewControllers()[0]);
            while (viewController.view.getSubviews().length > 0)
            {
                viewController.view.removeSubview(this.getSubviews()[0], neverUseAgain);
            }
        }
    }

    removeFromParent()
    {
        if (this.getParent())
        {
            this.getParent().removeAllChildViewControllers();
        }
    }

}
