import Controller from "sap/ui/core/mvc/Controller";
import MessageToast from "sap/m/MessageToast";
import View from "sap/ui/core/mvc/View";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import JSONModel from "sap/ui/model/json/JSONModel";


/**
 * @namespace com.logaligroup.invoices.controller
 */


export default class Main extends Controller {


    public onInit () : void {
        this.viewModel();
    }


    private viewModel () : void {
        const data = {
            recipient: {
                name: "World",
                details:[
                    {
                        phoneNumber:"1231454654"
                    },
                    {
                        phoneNumber:"asdfasdfasdf"
                    }
                ]
            }
        };
        const model = new JSONModel(data);
        (this.getView() as View).setModel(model,"view");
    }


    public onShowMessage () : void {
        const modelResource = (this.getView() as View).getModel("i18n") as ResourceModel;
        const resourceBundle = modelResource.getResourceBundle() as ResourceBundle;
        MessageToast.show(resourceBundle.getText("message") || 'no text');
    }

}