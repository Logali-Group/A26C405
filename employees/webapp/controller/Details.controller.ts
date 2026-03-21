import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import BaseController from "./BaseController";
import View from "sap/ui/core/mvc/View";

/**
 * @namespace employees.controller
 */


export default class Details extends BaseController {


    public onInit () : void | undefined {
        const router = this.getRouter();
        router.getRoute("RouteDetails")?.attachPatternMatched(this._bindElement.bind(this));
        
    }

    private _bindElement (event : Route$PatternMatchedEvent) : void {
        const args = event.getParameter("arguments") as any;
        const index = args.index;
        const view = this.getView() as View;
        

        view.bindElement({
            path: '/Employees/'+index,
            model: 'employees'
        });
    }

}