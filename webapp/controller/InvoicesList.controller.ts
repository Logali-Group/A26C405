import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import SearchField, { SearchField$SearchEvent } from "sap/m/SearchField";
import List from "sap/m/List";
import ListBinding from "sap/ui/model/ListBinding";
import ComboBox, { ComboBox$ChangeEvent } from "sap/m/ComboBox";
import UIComponent from "sap/ui/core/UIComponent";
import Event from "sap/ui/base/Event";
import ObjectListItem from "sap/m/ObjectListItem";
import Context from "sap/ui/model/Context";

/**
 * @namespace com.logaligroup.invoices.controller
 */

export default class InvoicesList extends Controller {


    public onInit() : void {
        this._loadCurrency();
    }

    private _loadCurrency () : void {
        const data = {
            myCurrency: "USD"
        };
        const model = new JSONModel(data);
        this.getView()?.setModel(model, "currency");
    }

    public onFilterPress () : void {

        const aFilters = [];
        const value = (this.byId("status") as ComboBox).getSelectedKey();
        const query = (this.byId("searchField") as SearchField).getValue();

        if (value) {
            aFilters.push(new Filter("Status","EQ", value));
        }

        if (query) [
            aFilters.push(
                new Filter({
                    filters: [
                        new Filter("ProductName",FilterOperator.Contains, query),
                        new Filter("ShipperName",FilterOperator.Contains, query)
                    ],
                    and: false
                })
            )
        ]

        const oList = this.byId("invoices") as List;
        const binding = oList.getBinding("items") as ListBinding;
        binding.filter(aFilters);
    }

    // public onChangePress (event: ComboBox$ChangeEvent) : void {
    //     const aFilters = [];
    //     const value = (this.byId("status") as ComboBox).getSelectedKey();
    //     console.log(value);

    //     if (value) {
    //         aFilters.push(new Filter("Status","EQ", value));
    //     }

    //     const oList = this.byId("invoices") as List;
    //     const binding = oList.getBinding("items") as ListBinding;
    //     binding.filter(aFilters);
    // }

    // public onSearchFieldHandler (event : SearchField$SearchEvent) : void {
    //     const aFilters = [];
    //     //const oSearchField = event.getSource() as SearchField;
    //     const value = event.getParameter("query");
        
    //     if (value) [
    //         aFilters.push(
    //             new Filter({
    //                 filters: [
    //                     new Filter("ProductName",FilterOperator.Contains, value),
    //                     new Filter("ShipperName",FilterOperator.Contains, value)
    //                 ],
    //                 and: false
    //             })
    //         )
    //     ]

    //     const oList = this.byId("invoices") as List;
    //     const binding = oList.getBinding("items") as ListBinding;
    //     binding.filter(aFilters);
    // }


    public onNavToDetail (event : Event) : void {
        const item = event.getSource() as ObjectListItem;
        const context = item.getBindingContext("northwind") as Context;
        const sPath = window.encodeURIComponent(context.getPath());
        const router = (this.getOwnerComponent() as UIComponent).getRouter();

        router.navTo("RouteDetails",{
            path: sPath,
            model: 'northwind'
        });

    }

}