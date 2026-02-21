import Controller from "sap/ui/core/mvc/Controller";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import MessageToast from "sap/m/MessageToast";
import View from "sap/ui/core/mvc/View";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import Fragment from "sap/ui/core/Fragment";
import Dialog from "sap/m/Dialog";


/**
 * @namespace com.logaligroup.invoices.controller
 */

export default class HelloPanel extends Controller {

    private pDialog : Dialog;

    public onInit () : void {

    } 

    public onShowMessage () : void {
        const modelResource = (this.getView() as View).getModel("i18n") as ResourceModel;
        const resourceBundle = modelResource.getResourceBundle() as ResourceBundle;
        MessageToast.show(resourceBundle.getText("message") || 'no text');
    }


    public async onOpenDialog () : Promise<void> {

        //const view = this.getView() as View;

        // if (!this.pDialog) {
        //     this.pDialog = await Fragment.load({
        //         id: view.getId(),
        //         name: "com.logaligroup.invoices.fragment.HelloDialog",
        //         controller: this
        //     }) as Dialog;
        // }

        // view.addDependent(this.pDialog);
        // this.pDialog.open();

        this.pDialog ??= await this.loadFragment({
            name: "com.logaligroup.invoices.fragment.HelloDialog"
        }) as Dialog;

        this.pDialog.open();
    } 

    public onClosePress () : void {
        this.pDialog.close();
    }

}