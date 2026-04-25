import View from "sap/ui/core/mvc/View";
import BaseController from "./BaseController";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import Signature from "employees/control/Signature";


/**
 * @namespace employees.controller 
 * 
 */


export default class OrderDetails extends BaseController {


    public onInit () : void | undefined {
        //bindELement --> Path --> /Orders(XXXXX)
        const router = this.getRouter();
        router.getRoute("RouteOrderDetails")?.attachPatternMatched(this._bindElement.bind(this));
    }

    private _bindElement (event : Route$PatternMatchedEvent) : void {

        const args = event.getParameter("arguments") as any;
        const sOrderId = args.OrderId as string;
        const oView = this.getView() as View;

        oView.bindElement({
            path: `/Orders(${sOrderId})`,
            model: 'northwind',
            events: {
                change : () => {

                },
                dataRequest : () => {
                    oView.setBusy(true);
                },
                dataReceived : () => {
                    oView.setBusy(false);
                }
            }
        })
    };


    public onClearPress () : void {
        const oSignaturePad = this.byId("signature") as Signature;
        oSignaturePad.myClear();
    }

}