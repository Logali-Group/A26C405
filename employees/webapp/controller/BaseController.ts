import Controller from "sap/ui/core/mvc/Controller";
import Router from "sap/ui/core/routing/Router";
import UIComponent from "sap/ui/core/UIComponent";
import Model from "sap/ui/model/Model";
import View from "sap/ui/core/mvc/View";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import History from "sap/ui/core/routing/History";

/**
 * @namespace employees.controller
 */

export default class BaseController extends Controller {

    public getRouter() : Router {
        return (this.getOwnerComponent() as UIComponent).getRouter();
    }

    public getModel (name : string) : Model {
        return (this.getView() as View).getModel(name) as Model;
    }

    public setModel (model : Model, name? : string) : View | undefined {
        return this.getView()?.setModel(model, name);
    }

    public getResourceBundle () : ResourceBundle {
        let resourceModel = (this.getOwnerComponent() as UIComponent).getModel("i18n") as ResourceModel;
        return resourceModel.getResourceBundle() as ResourceBundle;
    }

    public onNavToMain () : void {
        let sPreviousHash = History.getInstance().getPreviousHash();

        if (sPreviousHash !== undefined) {
            history.go(-1);
        } else {
            this.getRouter().navTo("RouteContainer");
        }
    }
}