import Controller from "sap/ui/core/mvc/Controller";
import View from "sap/ui/core/mvc/View";
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

}