import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import BaseController from "./BaseController";
import View from "sap/ui/core/mvc/View";
import JSONModel from "sap/ui/model/json/JSONModel";
import Panel from "sap/m/Panel";
import Button, { Button$PressEvent } from "sap/m/Button";
import Context from "sap/ui/model/Context";
import Utils from "employees/utils/Utils";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import Filter from "sap/ui/model/Filter";
import ODataListBinding from "sap/ui/model/odata/v2/ODataListBinding";
import DatePicker, { DatePicker$ChangeEvent } from "sap/m/DatePicker";
import Input, { Input$LiveChangeEvent } from "sap/m/Input";
import Select, { Select$ChangeEvent } from "sap/m/Select";
import Event from "sap/ui/base/Event";
import ObjectListItem from "sap/m/ObjectListItem";

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
            path: `/Employees(${iEmployeeID})`, // -> Context --> this.getView()?.getBindingContext("NAME_MODEL")
            model: 'northwind',
            events: {
                change: () =>{
                    this.read()
                },
                dataRequest: () => {
                    view.setBusy(true);
                },
                dataReceived : () => {
                    view.setBusy(false);
                }
            }
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

    private async read () : Promise<void> {
        const northwind = this.getView()?.getBindingContext("northwind") as Context;
        const utils = new Utils(this);

        const object = {
            path : '/IncidentsSet',
            filters:[
                new Filter("SapId","EQ", utils.getEmail()),
                new Filter("EmployeeId","EQ", northwind.getProperty("EmployeeID"))
            ]
        };
        
       const oResults = await utils.read(new JSONModel(object));
       this.showIncidents(oResults);
    }

    private showIncidents (data : ODataListBinding | void) : void {
        this.removeAllContent();
        const panel = this.byId("tableIncidence") as Panel;
        const array = (data as any).results;
        
        const form = this.getModel("form") as JSONModel;
        form.setData(array);
        
        //0,1
        array.forEach( async (incidence : object, index : number) => {
            const newIncidence = await this.loadFragment({name:"employees.fragment.NewIncidence"}) as Panel;
            newIncidence.bindElement("form>/"+index); //0,1
            panel.addContent(newIncidence);
        });
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

    public async onSavePress (oEvent : Button$PressEvent) : Promise<void> {

        const button = oEvent.getSource() as Button;
        const context = button.getBindingContext("form") as Context;
        const contextEmployee = button.getBindingContext("northwind") as Context;
        const utils = new Utils(this);
        const sEmail = utils.getEmail();
        const sEmployeeId = (contextEmployee.getProperty("EmployeeID") as number).toString();

        if (typeof context.getProperty("IncidenceId") === 'undefined') {
            const object = {
                path: "/IncidentsSet",
                body: {
                    SapId: sEmail,
                    EmployeeId: sEmployeeId,
                    CreationDate: context.getProperty("CreationDate"),
                    Type: context.getProperty("Type"),
                    Reason: context.getProperty("Reason")
                },
                filters: [
                    new Filter("SapId","EQ", sEmail),
                    new Filter("EmployeeId","EQ", sEmployeeId)
                ]
            };
            const oResult = await utils.crud("Create", new JSONModel(object));
            this.showIncidents(oResult);
        } else {
            const sIncidenceId = context.getProperty("IncidenceId") as string;
            const object = {
                path: `/IncidentsSet(IncidenceId='${sIncidenceId}',SapId='${sEmail}',EmployeeId='${sEmployeeId}')`,
                body: {
                    CreationDate: context.getProperty("CreationDate"),
                    CreationDateX: context.getProperty("CreationDateX"),
                    Type: context.getProperty("Type"),
                    TypeX: context.getProperty("TypeX"),
                    Reason: context.getProperty("Reason"),
                    ReasonX: context.getProperty("ReasonX")
                },
                filters: [
                    new Filter("SapId","EQ", sEmail),
                    new Filter("EmployeeId","EQ", sEmployeeId)
                ]
            };
            console.log(object);
            const oResult = await utils.crud("Update", new JSONModel(object));
            this.showIncidents(oResult);
        }

    }

    public async onDeletePress (event : Button$PressEvent) : Promise<void> {
        const form = event.getSource().getBindingContext("form") as Context;
        const northwind = this.getView()?.getBindingContext("northwind") as Context;
        const utils = new Utils(this);

        const sIncidenceId = form?.getProperty("IncidenceId")
        const sEmail = utils.getEmail();
        const sEmployeeId = (northwind.getProperty("EmployeeID") as number).toString();

        const object = {
            path : `/IncidentsSet(IncidenceId='${sIncidenceId}',SapId='${sEmail}',EmployeeId='${sEmployeeId}')`,
            filters: [
                new Filter("SapId","EQ", sEmail),
                new Filter("EmployeeId","EQ", sEmployeeId)
            ]
        };

        const oResult = await utils.crud('Delete', new JSONModel(object));
        this.showIncidents(oResult);
    }  

    public updateIncidenceCreationDate (event : DatePicker$ChangeEvent) : void {
        const context = (event.getSource() as DatePicker).getBindingContext("form") as Context;
        let oObject = context.getObject() as any;
        oObject.CreationDateX = true;
    }

    public updateIncidenceReason (event : Input$LiveChangeEvent) : void {
        const context = (event.getSource() as Input).getBindingContext("form") as Context;
        let oObject = context.getObject() as any;
        oObject.ReasonX = true;
    }

    public updateIncidenceType (event : Select$ChangeEvent) : void {
        const context = (event.getSource() as Select).getBindingContext("form") as Context;
        let oObject = context.getObject() as any;
        oObject.TypeX = true;
    }

    public onNavToOrderDetails (event : Event) : void {
        const item = event.getSource() as ObjectListItem;
        const context = item.getBindingContext("northwind") as Context;
        const sEmployeeId = context.getProperty("EmployeeID");
        const sOrderId = context.getProperty("OrderID");
        const sPath = context.getPath() as string;
        console.log(sPath);

        const oView = this.getModel("view") as JSONModel;
        oView.setProperty("/myLayout","EndColumnFullScreen");

        const router = this.getRouter();
        router.navTo("RouteOrderDetails",{
            EmployeeId: sEmployeeId,
            OrderId: sOrderId
        });
    }
}