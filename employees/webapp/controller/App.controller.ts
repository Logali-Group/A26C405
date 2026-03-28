import JSONModel from "sap/ui/model/json/JSONModel";
import BaseController from "./BaseController";

/**
 * @namespace employees.controller
 */
export default class App extends BaseController {

    public onInit(): void {
        this.viewModel();
        //this.loadEmployees();
        this.loadCountries();
    }

    private loadEmployees () : void {
        const model = new JSONModel();
        model.loadData("../model/Employees.json");
        this.setModel(model, "employees");
    }

    private loadCountries () : void {
        const model = new JSONModel();
        model.loadData("../model/Countries.json");
        this.setModel(model, "countries");
    }

    private viewModel () : void {
        const data = {
            myLayout : "OneColumn"
        }
        const model = new JSONModel(data);
        this.setModel(model, "view");
    }


}