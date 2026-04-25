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


    public async crud (action: string, object? : JSONModel | undefined) : Promise<void | ODataListBinding> {

        return new Promise((resolve,reject)=> {

            MessageBox.confirm(this.resourceBundle.getText("question") || '', {
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.OK,
                onClose: async (sAction : string | null) => {
                    if (sAction === MessageBox.Action.OK) {
                        switch (action) { // Create,Update,Delete
                            case 'Create': resolve(await this._create(object)); break;
                            case 'Update': resolve(await this._update(object)); break;
                            case 'Delete': resolve(await this._delete(object)); break;
                        }
                    }
                }
            });

        });
    }


    public async read (object : JSONModel | undefined) : Promise<void | ODataListBinding> {
        const sPath = object?.getProperty("/path").split("(")[0];
        const aFilters = object?.getProperty("/filters");
        const oModel = this.model;

        return new Promise((resolve, reject) => {
            oModel.read(sPath, {
                filters: aFilters,
                success: (oResults : ODataListBinding) => {
                    resolve(oResults);
                },
                error: () => {
                    MessageBox.error(this.resourceBundle.getText("error") || '');
                    reject();
                }
            });
        });
    }


    private async _create (object : JSONModel | undefined) : Promise<void | ODataListBinding> {
        const sPath = object?.getProperty("/path");
        const oBody = object?.getProperty("/body");
        
        return new Promise((resolve,reject)=>{
            this.model.create(sPath, oBody, {
                success: async () => {
                    MessageBox.success(this.resourceBundle.getText("success") || '');
                    resolve(
                        await this.read(object)
                    );
                },
                error: () => {
                    MessageBox.error(this.resourceBundle.getText("error") || '');
                    reject();
                }
            });
        })

    }

    private async _update (object : JSONModel | undefined) : Promise<void | ODataListBinding> {
        const oModel = this.model;
        const sPath = object?.getProperty("/path");
        const oBody = object?.getProperty("/body");

        return new Promise((resolve,reject) => {
            oModel.update(sPath, oBody, {
                success: async () =>{
                    MessageBox.success(this.resourceBundle.getText("success") || '');
                    resolve(
                        await this.read(object)
                    );
                },
                error : () =>{
                    MessageBox.error(this.resourceBundle.getText("error") || '');
                    reject();
                }
            });
        })
    }

    private async _delete (object : JSONModel | undefined) : Promise<void | ODataListBinding> {
        const oModel = this.model;
        const sPath = object?.getProperty("/path");

        return new Promise((resolve,reject) => {
            oModel.remove(sPath, {
                success: async () =>{
                    MessageBox.success(this.resourceBundle.getText("success") || '');
                    resolve(
                        await this.read(object)
                    );
                },
                error : () =>{
                    MessageBox.error(this.resourceBundle.getText("error") || '');
                    reject();
                }
            });
        }); 
    }

}