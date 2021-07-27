import { api, LightningElement, wire } from "lwc";
import { getRecord } from "lightning/uiRecordApi";

export default class ExamplePureLwc extends LightningElement {
  @api
  recordId;

  accountId;
  openAccountButtonDisabled = true;

  @wire(getRecord, { recordId: "$recordId", fields: ["Contact.AccountId"] })
  getRecordAccount({ data }) {
    if (data) {
      this.accountId = data.fields.AccountId.value;
      this.openAccountButtonDisabled = false;
    }
  }
  // On click of account click
  onOpenAccountClick() {
    this.invokeWorkspaceAPI("isConsoleNavigation").then((isConsole) => {
      console.log("**isConsole", isConsole);
      if (isConsole) {
        this.invokeWorkspaceAPI("openTab", {
          url : this.getEncodedComponentDefUrl(),
          focus: true
        }).then((tabId) => {
          console.log("Solution #2 - SubTab ID: ", tabId);
          this.invokeWorkspaceAPI("setTabIcon", {
            tabId: tabId,
            icon: "standard:approval",
            iconAlt: "Approval"
          });
          this.invokeWorkspaceAPI("setTabLabel", {
            tabId: tabId,
            label: "Approval Request"
          });
        });
      }
    });
  }
  // Invoke the  Workspace API - using Window event
  invokeWorkspaceAPI(methodName, methodArgs) {
    return new Promise((resolve, reject) => {
      const apiEvent = new CustomEvent("internalapievent", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          category: "workspaceAPI",
          methodName: methodName,
          methodArgs: methodArgs,
          callback: (err, response) => {
            console.log('***Response',response);
            console.log('***err',err);
            if (err) {
              return reject(err);
            } else {
              return resolve(response);
            }
          }
        }
      });

      window.dispatchEvent(apiEvent);
    });
  }
  getEncodedComponentDefUrl() {
   
    let compDefinition = {
      componentDef: "c:approvalRequestDetailComponent",
      attributes: {
        caseRecordId: '5006F000031wYUlQAM',
        processInstanceWorkItemId: '04i6F00000MFX3hQAH'
      }
    };
    // btoa : convert to base 64
    let encodedCompDef = btoa(JSON.stringify(compDefinition));
    console.log("**encodedCompDef",encodedCompDef);
    // return url with encoded
    return "/one/one.app#" + encodedCompDef;
  }
}
