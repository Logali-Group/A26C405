import View from "sap/ui/core/mvc/View";
import BaseController from "./BaseController";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import Signature from "employees/control/Signature";
import Context from "sap/ui/model/odata/v2/Context";
import MessageBox from "sap/m/MessageBox";
import Utils from "employees/utils/Utils";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataListBinding from "sap/ui/model/odata/v2/ODataListBinding";
import Filter from "sap/ui/model/Filter";
import { UploadSet$AfterItemRemovedEvent, UploadSet$BeforeUploadStartsEvent, UploadSet$UploadCompletedEvent } from "sap/m/upload/UploadSet";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import UploadSetItem, { UploadSetItem$OpenPressedEvent } from "sap/m/upload/UploadSetItem";
import Item from "sap/ui/core/Item";


/**
 * @namespace employees.controller 
 * 
 */


export default class OrderDetails extends BaseController {


    public onInit () : void | undefined {
        //bindELement --> Path --> /Orders(XXXXX)
        const router = this.getRouter();
        router.getRoute("RouteOrderDetails")?.attachPatternMatched(this._bindElement.bind(this));
    }

    private _bindElement (event : Route$PatternMatchedEvent) : void {

        const args = event.getParameter("arguments") as any;
        const sOrderId = args.OrderId as string;
        const oView = this.getView() as View;

        oView.bindElement({
            path: `/Orders(${sOrderId})`,
            model: 'northwind',
            events: {
                change : () => {
                    this.read();
                    this.searchFiles();
                },
                dataRequest : () => {
                    oView.setBusy(true);
                },
                dataReceived : () => {
                    oView.setBusy(false);
                }
            }
        })
    };


    public onClearPress () : void {
        const oSignaturePad = this.byId("signature") as Signature;
        oSignaturePad.myClear();
    }

    public async onSavePress () : Promise<void> {
        const signature = this.byId("signature") as Signature;
        const bindingContext = this.getView()?.getBindingContext("northwind") as Context;
        const resourceBundle = this.getResourceBundle();

        if (!signature.isFill()) {
            MessageBox.error(resourceBundle.getText("fillSignature") || '');
        } else {
            const sSignature = signature.getSignature() as string;
            const sMediaContent = sSignature.replace("data:image/png;base64,","");
            const utils = new Utils(this);
            const object= {
                path: "/SignatureSet",
                body: {
                    SapId: utils.getEmail(),
                    OrderId: bindingContext.getProperty("OrderID").toString(),
                    EmployeeId: bindingContext.getProperty("EmployeeID").toString(),
                    MediaContent: sMediaContent,
                    MimeType: "image/png"
                }
            };

            await utils.crud('Create', new JSONModel(object))
        }
    }

    private async read () : Promise<void | ODataListBinding> {
        const context = this.getView()?.getBindingContext("northwind") as Context;
        const utils = new Utils(this);
        const sOrderId = context.getProperty("OrderID").toString();
        const sSapId = utils.getEmail();
        const sEmployeeId = context.getProperty("EmployeeID").toString();

        const body = {
            path: "/SignatureSet",
            filters: [
                new Filter("OrderId","EQ", sOrderId),
                new Filter("SapId","EQ",sSapId),
                new Filter("EmployeeId","EQ", sEmployeeId)
            ]
        };

        const results = await utils.read(new JSONModel(body));
        this.showSignature(results);
    }

    private showSignature ( data : any) : void {
        let oMySignature = data.results[0];
        const sMediaContent = oMySignature.MediaContent;
        const oSignature = this.byId("signature") as Signature;
        oSignature.setSignature("data:image/png;base64,"+sMediaContent);
    }

    public onRefreshPress () : void {
        this.read();
    }

    public onBeforeUploadEvent (event : UploadSet$BeforeUploadStartsEvent) : void {
        const item = event.getParameter("item") as UploadSetItem;
        const sFileName = item.getFileName();
        const context = this.getView()?.getBindingContext("northwind") as Context;
        const model = this.getView()?.getModel("zincidence") as ODataModel;
        const utils = new Utils(this);
        const sOrderId = context.getProperty("OrderID").toString();
        const sSapId = utils.getEmail();
        const sEmployeeId = context.getProperty("EmployeeID").toString();
        const sToken = model.getSecurityToken();
        const sSlug = `${sOrderId};${sSapId};${sEmployeeId};${sFileName}`;

        const addHeaderToken = new Item({
            key: "X-Csrf-Token",
            text: sToken
        });

        const addHeaderSlug = new Item({
            key: "slug",
            text: sSlug
        });

        item.addHeaderField(addHeaderToken);
        item.addHeaderField(addHeaderSlug);
    }

    public onUploadCompletedEvent (event : UploadSet$UploadCompletedEvent) : void {
        const oUploadSet = event.getSource();
            oUploadSet.getBinding("items")?.refresh();
    }

    private searchFiles () : void {
        const context = this.getView()?.getBindingContext("northwind") as Context;
        const utils = new Utils(this);
        const sOrderId = context.getProperty("OrderID").toString();
        const sSapId = utils.getEmail();
        const sEmployeeId = context.getProperty("EmployeeID").toString();

        const oUploadSet = this.byId("upload");
                oUploadSet?.bindAggregation("items", {
                    path: 'zincidence>/FilesSet',
                    filters: [
                        new Filter("OrderId","EQ", sOrderId),
                        new Filter("SapId","EQ",sSapId),
                        new Filter("EmployeeId","EQ",sEmployeeId)
                    ],
                    template: new UploadSetItem({
                        fileName: "{zincidence>FileName}",
                        mediaType: "{zincidence>MimeType}",
                        visibleEdit: false,
                        visibleRemove: true,
                        url: "temporal",
                        openPressed: this.onLinkPress.bind(this)
                    })
                });
    }

    public async onAfterItemRemovedEvent (event : UploadSet$AfterItemRemovedEvent) : Promise<void> {
        const oItem = event.getParameter("item") as UploadSetItem;
        const oContext = oItem.getBindingContext("zincidence") as Context;
        const sPath = oContext.getPath() as string;
        const oObject = {
            path: sPath
        };
        const utils = new Utils(this);
        await utils.crud('Delete', new JSONModel(oObject));
        oItem.getBinding("items")?.refresh();
    }


    private onLinkPress (event : UploadSetItem$OpenPressedEvent) : void {
        const item = event.getSource() as UploadSetItem;
        const context = item.getBindingContext("zincidence") as Context;
        const sPath = context.getPath();
        const sUrl = "/employees/sap/opu/odata/sap/YSAPUI5_SRV_01"+sPath+"/$value";
        item.setUrl(sUrl);
    }

}