/**
 * @ Author: Sachin Dond
 * @ Create Time: 2021-07-20 16:20:43
 * @ Modified by: Sachin Dond
 * @ Modified time: 2021-07-29 19:08:51
 * @ Description:
 * @ User Story:
 */
import { LightningElement, wire, api } from "lwc";
import CASE_STATUS_FIELD from "@salesforce/schema/Case.Status";
import CASE_OBJECT from "@salesforce/schema/Case";
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import getCustomMetadataRecords from "@salesforce/apex/ItemForApprovalController.getPathGuidanceCustomMetadataRecords";
export default class ApprovalRequestPathComponent extends LightningElement {

  @api currentStatusPicklistValue;
  guidanceText;

  connectedCallback() {
    console.log(this.currentStatusPicklistValue + " from connectedCallback");
  }
  // Wire to Property : To get the metadata information of the case object
  @wire(getObjectInfo, { objectApiName: CASE_OBJECT })
  caseMetadata;

  // Wire to Property : To get the picklist value for default record type
  @wire(getPicklistValues, {
    recordTypeId: "$caseMetadata.data.defaultRecordTypeId",
    fieldApiName: CASE_STATUS_FIELD
  })
  caseStatusPicklist;

  // Wire to Function : To get Custom Metadata records from apex
  @wire(getCustomMetadataRecords)
  customMetadataRecords;

  handleChevronButtonClick(event) {
    // Add remove class from chevron button and guided div
    this.template
      .querySelector(".chevronButtonClass")
      .classList.toggle("slds-path__trigger_open");
    this.template
      .querySelector(".slds-path__content")
      .classList.toggle("slds-is-collapsed");

    this.guidedText(
      this.currentStatusPicklistValue,
      this.customMetadataRecords
    );
  }
  // Method when user clicks on specific steps
  handleStepClick(event) {
    console.log("***handleStepClick", event.target.label);
    console.log("**currentStatusPicklistValue", this.currentStatusPicklistValue);
  }
  // Method to handle when path step blur
  handlePathStepBlur(event) {}
  // Method to handle mouse enter step in blur
  handlePathStepMouseEnter(event) {}
  
  guidedText(currentPicklistValue, customMetadataRecords) {
    try {
      console.log("**customMetadataRecords", this.customMetadataRecords);
      this.customMetadataRecords.data.forEach((record) => {
        console.log("**record", record);
        console.log("this.currentPicklistValue", this.currentPicklistValue);
        if (this.currentPicklistValue === record.Picklist_Value__c) {
          this.guidanceText = record.Guidance_Text__c;
        }
      });
    } catch (ex) {
      console.log("**Error", ex.message);
    }
  }
}
