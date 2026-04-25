import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import SignaturePad from "signature_pad";


/**
 * @namespace employees.control
 */


export default class Signature extends Control {

    constructor(idOrSettings?: string | $SignatureSettings);
    constructor(id?: string, settings?: $SignatureSettings);
    constructor(id?: string, settings?: $SignatureSettings) { super(id, settings); }

    private _signaturePad : SignaturePad;

    static readonly metadata : MetadataOptions = {
        properties: {
            width: {
                type: 'sap.ui.core.CSSSize',
                defaultValue: "300px"
            },
            height: {
                type: 'sap.ui.core.CSSSize',
                defaultValue: "180px"
            },
            backgroudColor : {
                type: 'sap.ui.core.CSSColor',
                defaultValue: "white"
            }
        }
    }

    init () : void {

    }

    onAfterRendering(oEvent: jQuery.Event): void | undefined {

        const canvas = document.querySelector("canvas") as HTMLCanvasElement;

        try {

            this._signaturePad = new SignaturePad(canvas);

        } catch (error) {
            console.log(error);
        }
    }

    public myClear () : void {
        this._signaturePad.clear();
    }


    renderer = {
        apiVersion: 4,
        render : (rm: RenderManager, control: Signature) => {
            rm.openStart("div", control);
            rm.class("signature");
            rm.openEnd();
                rm.openStart("canvas", control);
                rm.openEnd();
                rm.close("canvas");
            rm.close("div");
        }
    }
}