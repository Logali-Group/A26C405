/*global QUnit*/
import Controller from "employees/controller/Container.controller";

QUnit.module("Container Controller");

QUnit.test("I should test the Container controller", function (assert: Assert) {
	const oAppController = new Controller("Container");
	oAppController.onInit();
	assert.ok(oAppController);
});