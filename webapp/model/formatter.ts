import Controller from "sap/ui/core/mvc/Controller";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";

export default {

    statusText : function (this : Controller, status: string) : string | undefined {
        const resourceModel = this.getView()?.getModel("i18n") as ResourceModel;
        const resourceBundle = resourceModel.getResourceBundle() as ResourceBundle;

        switch (status) {
            case 'A': return resourceBundle.getText("invoiceStatusA");
            case 'B': return resourceBundle.getText("invoiceStatusB");
            case 'C': return resourceBundle.getText("invoiceStatusC");
            default: return status;
        }
    }

}