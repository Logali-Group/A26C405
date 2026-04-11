import Controller from "sap/ui/core/mvc/Controller";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import UIComponent from "sap/ui/core/UIComponent";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import JSONModel from "sap/ui/model/json/JSONModel";
import MessageBox from "sap/m/MessageBox";
import ODataListBinding from "sap/ui/model/odata/v2/ODataListBinding";

/**
 * @namespace employees.utils
 */


export default class Utils {

    private controller : Controller;
    private model : ODataModel;
    private resourceBundle : ResourceBundle;

    constructor (controller : Controller) {
        this.controller = controller;
        this.model = (this.controller.getOwnerComponent() as UIComponent).getModel("zincidence") as ODataModel;
        this.resourceBundle = ((this.controller.getOwnerComponent() as UIComponent).getModel("i18n") as ResourceModel).getResourceBundle() as ResourceBundle;
    } 

    public getEmail () : string {
        return "a26c405@logaligroup.com";
    }


    public crud (action: string, object? : JSONModel | undefined) : void {
        MessageBox.confirm(this.resourceBundle.getText("question") || '', {
            actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
            emphasizedAction: MessageBox.Action.OK,
            onClose: (sAction : string | null) => {
                if (sAction === MessageBox.Action.OK) {
                    switch (action) { // Create,Update,Delete
                        case 'Create': this._create(object); break;
                        case 'Update': this._update(); break;
                        case 'Delete': this._delete(); break;
                    }
                }
            }
        });
    }


    public read (object : JSONModel | undefined) : void {
        const sPath = object?.getProperty("/path");
        const aFilters = object?.getProperty("/filters");

        this.model.read(sPath, {
            filters: aFilters,
            success: (oResults : ODataListBinding) => {
                console.log(oResults);
            },
            error: () => {
                MessageBox.error(this.resourceBundle.getText("error") || '');
            }
        });
    }


    private _create (object : JSONModel | undefined) : void {
        const sPath = object?.getProperty("/path");
        const oBody = object?.getProperty("/body");
        
        this.model.create(sPath, oBody, {
            success: () => {
                MessageBox.success(this.resourceBundle.getText("success") || '');
            },
            error: () => {
                MessageBox.error(this.resourceBundle.getText("error") || '')
            }
        });
    }

    private _update () : void {
        console.log("Update");
    }

    private _delete () : void {
        console.log("Delete");
    }

}