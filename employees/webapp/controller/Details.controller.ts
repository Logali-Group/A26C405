import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import BaseController from "./BaseController";
import View from "sap/ui/core/mvc/View";
import JSONModel from "sap/ui/model/json/JSONModel";
import Panel from "sap/m/Panel";
import Button, { Button$PressEvent } from "sap/m/Button";
import Context from "sap/ui/model/Context";
import Utils from "employees/utils/Utils";

/**
 * @namespace employees.controller
 */


export default class Details extends BaseController {

    panel: Panel;

    private formModel () : void {
        const model = new JSONModel([]);
        this.setModel(model,"form");
    }


    public onInit () : void | undefined {
        const router = this.getRouter();
        router.getRoute("RouteDetails")?.attachPatternMatched(this._bindElement.bind(this));
        
    }

    private _bindElement (event : Route$PatternMatchedEvent) : void {

        //reset
        this.removeAllContent();

        //Form - Model
        this.formModel();

        const args = event.getParameter("arguments") as any;
        const iEmployeeID = args.ID;
        const view = this.getView() as View;
        

        view.bindElement({
            path: `/Employees(${iEmployeeID})`,
            model: 'northwind'
        });
    }

    public onClosePress () : void {
        const router = this.getRouter();
        const view = this.getModel("view") as JSONModel;
        view.setProperty("/myLayout","OneColumn");
        router.navTo("RouteMaster");
    }

    private removeAllContent () : void {
        const panel = this.byId("tableIncidence") as Panel;
        panel.removeAllContent();
    }

    public async onCreatePress () : Promise<void> {
        const panel = this.byId("tableIncidence") as Panel;

        const formModel = this.getModel("form") as JSONModel;
        const aData = formModel.getData() as object[];
        const index = aData.length; //0
        aData.push({myIndex: index + 1}); // 1
        formModel.refresh();

        this.panel = await this.loadFragment({name: "employees.fragment.NewIncidence"}) as Panel;

        this.panel.bindElement({
            path: 'form>/'+index,
            model: 'form'
        });

        panel.addContent(this.panel);
    }

    public onSavePress (oEvent : Button$PressEvent) : void {

        const button = oEvent.getSource() as Button;
        const context = button.getBindingContext("form") as Context;
        const contextEmployee = button.getBindingContext("northwind") as Context;
        const utils = new Utils(this);

        const object = {
            path: "/IncidentsSet",
            body: {
                SapId: utils.getEmail(),
                EmployeeId: (contextEmployee.getProperty("EmployeeID") as number).toString(),
                CreationDate: context.getProperty("CreationDate"),
                Type: context.getProperty("Type"),
                Reason: context.getProperty("Reason")
            }
        };
        console.log(object);
        utils.crud("Create", new JSONModel(object));
    }

    public onDeletePress () : void {

        const utils = new Utils(this);

        const object = {
            path : '/IncidentsSet',
            filters:[

            ]
        };
        
        utils.read(new JSONModel(object));
    }
}