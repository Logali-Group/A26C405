import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import RatingIndicator from "sap/m/RatingIndicator";
import Label from "sap/m/Label";
import Button from "sap/m/Button";

/**
 * @namespace com.logaligroup.invoices
 */

export default class ProductRating extends Control {

    constructor(idOrSettings?: string | $ProductRatingSettings);
    constructor(id?: string, settings?: $ProductRatingSettings);
    constructor(id?: string, settings?: $ProductRatingSettings) { super(id, settings); }

    static readonly metadata : MetadataOptions = {
        properties: {
            value: {
                type: 'float',
                defaultValue: 0
            }
        },
        aggregations: {
            _rating: {
                type: 'sap.m.RatingIndicator',
                multiple: false,
                visibility: 'hidden'
            },
            _label: {
                type: 'sap.m.Label',
                multiple: false,
                visibility: 'hidden'
            },
            _button: {
                type: 'sap.m.Button',
                multiple: false,
                visibility: 'hidden'
            }
        },
        events: {
            change: {
                parameters: {
                    value: 'float'
                }
            }
        }
    }


    init () : void {
        this.setAggregation("_rating", new RatingIndicator({
            value: this.getValue(),
            iconSize: '2rem'
        }));

        this.setAggregation("_label", new Label({
            text: '{i18n>productRatingLabelInitial}'
        }).addStyleClass("sapUiSmallMargin"));

        this.setAggregation("_button", new Button({
            text: '{i18n>productRatingButton}'
        }).addStyleClass("sapUiSmallMarginTopBottom"))
    }


    renderer = {
        apiVersion: 4,
        render : (rm : RenderManager, control: ProductRating) => {
            rm.openStart("div", control);
            rm.class("productRating");
            rm.openEnd();
                rm.renderControl(control.getAggregation("_rating") as RatingIndicator);
                rm.renderControl(control.getAggregation("_label") as Label);
                rm.renderControl(control.getAggregation("_button") as Button);
            rm.close("div");
        }
    }

}