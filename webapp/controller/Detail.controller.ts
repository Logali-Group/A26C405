import Controller from "sap/ui/core/mvc/Controller";
import View from "sap/ui/core/mvc/View";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import UIComponent from "sap/ui/core/UIComponent";
import History from "sap/ui/core/routing/History";
import ProductRating, { ProductRating$ChangeEvent } from "../control/ProductRating";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import MessageToast from "sap/m/MessageToast";

/**
 * @namespace com.logaligroup.invoices
 */


export default class Detail extends Controller {


    public onInit () : void {
        const router = (this.getOwnerComponent() as UIComponent).getRouter();
        router.getRoute("RouteDetails")?.attachPatternMatched(this._bindElement.bind(this));
    }

    private _bindElement (event : Route$PatternMatchedEvent) : void {

        //Reset
        (this.byId("productRating") as ProductRating).reset();

        const args = event.getParameter("arguments") as any;
        const path = args.path as string;
        const view = this.getView() as View;

        view.bindElement({
            path: window.decodeURIComponent(path),
            model: 'northwind'
        });

        console.log((this.getView() as View).getBindingContext("northwind")?.getObject());
    }

    public onNavToBack () : void {
        const history = History.getInstance();
        const previusHash = history.getPreviousHash();

        if (previusHash !== undefined) {
            window.history.go(-1);
        } else {
            const router = (this.getOwnerComponent() as UIComponent).getRouter();
            router.navTo("RouteMain");
        }
    }

    public onRatingChange (event : ProductRating$ChangeEvent) : void {
        const iValue = event.getParameter("value") as number;
        let resourceModel = this.getOwnerComponent()?.getModel("i18n") as ResourceModel;
        let resourceBundle = resourceModel.getResourceBundle() as ResourceBundle;
        MessageToast.show(resourceBundle.getText("ratingConfirmation",[iValue]) || '');
    }



}