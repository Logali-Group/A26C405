import BaseController from "./BaseController";
import Input from "sap/m/Input";
import Event from "sap/ui/base/Event";
import { FilterBar$ClearEvent, FilterBar$SearchEvent } from "sap/ui/comp/filterbar/FilterBar";
import Control from "sap/ui/core/Control";
import ComboBox from "sap/m/ComboBox";
import Filter from "sap/ui/model/Filter";
import Table from "sap/m/Table";
import ListBinding from "sap/ui/model/ListBinding";
import FilterOperator from "sap/ui/model/FilterOperator";
import ObjectListItem from "sap/m/ObjectListItem";
import Context from "sap/ui/model/Context";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace employees.controller
 */


export default class Master extends BaseController {


    public onInit () : void | undefined {

    }

    public onClearPress (event : FilterBar$ClearEvent) : void {
        const controls = event.getParameter("selectionSet") as Control[];
        const input = controls[0] as Input;
        const combobox = controls[1] as ComboBox;
        input.setValue("");
        combobox.setSelectedKey("");
        this.onSearchPress(event);
    }

    public onSearchPress (event : FilterBar$SearchEvent) : void {
        const controls = event.getParameter("selectionSet") as Control[];
        //@ts-ignore
        //const controls = event.getParameter("selectionSet") as Control[];
        const input = controls[0] as Input;
        const combobox = controls[1] as ComboBox;
        const sEmployee = input.getValue() as string;
        const sCountry = combobox.getSelectedKey() as string;
        const filters = [];

        if (sEmployee) {
            filters.push(new Filter({
                filters:[
                    new Filter("EmployeeID","EQ", sEmployee),
                    new Filter({
                        filters:[
                            new Filter("FirstName","Contains",sEmployee),
                            new Filter("LastName","Contains",sEmployee)
                        ],
                        and: false
                    })
                ],
                and: false
            }));
        }

        if (sCountry) {
            filters.push(new Filter("Country",FilterOperator.EQ, sCountry));
        }

        const table = this.byId("table") as Table;
        const binding = table.getBinding("items") as ListBinding;
        binding.filter(filters);
    }

    public onNavToDetails (event : Event) : void {
        const item = event.getSource() as ObjectListItem;
        const context = item.getBindingContext("northwind") as Context;
        const sEmployeeID = context.getProperty("EmployeeID");
        const router = this.getRouter();
        const viewModel = this.getView()?.getModel("view") as JSONModel;
        viewModel.setProperty("/myLayout","TwoColumnsMidExpanded");
        console.log(context.getPath());

        router.navTo("RouteDetails", {
            ID: sEmployeeID
        });
    }

}