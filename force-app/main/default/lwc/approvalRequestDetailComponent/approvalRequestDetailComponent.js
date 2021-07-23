/**
 * @ Author: Sachin Dond
 * @ Create Time: 2021-07-19 10:45:31
 * @ Modified by: Sachin Dond
 * @ Modified time: 2021-07-22 17:21:41
 * @ Description: This component used as container component for multiple child components
 *                it handle the approve reject action based on that update the approval process record in apex
 * @ User Story:
 */
import { LightningElement, api, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { getRecord, getRecordNotifyChange } from "lightning/uiRecordApi";
import updateApprovalRecord from "@salesforce/apex/ItemForApprovalController.updateApprovalRecord";
import OWNERID_FIELD from "@salesforce/schema/Case.OwnerId";
import STATUS_FIELD from "@salesforce/schema/Case.Status";
import APPROVAL_STATUS_FIELD from "@salesforce/schema/Case.Approval_Status__c";
import loggedInUserId from "@salesforce/user/Id";

export default class ApprovalRequestDetailComponent extends LightningElement {
  // Decorators, Variables Initilization
  @api caseRecordId;                                      // Case Record Id
  @api processInstanceId;                                 // Approval Process ID
  @api processInstanceWorkItemId;                         // Approval Process Work Item ID
  modalHeaderTitle = "";                                  // Use to change modal header title
  isOpenModalPopup = false;                               // Use to control hide show of modal popup
  modalFooterApproveRejectButtonLabel = "";               // Use to control button label
  isApproveButtonDisabled = false;                        // Boolean flag to disable enable the button
  isRejectCloseButtonDisabled = false;                    // Boolean flag used to enable disable button
  isReassignButtonDisabled = false;
  currentStatusPicklistValue;                             // Use to store current case record status picklist value
  
  // Wire Service To Function : Use to get specific fields value from case record
  @wire(getRecord, {
    recordId: "$caseRecordId",
    fields: [OWNERID_FIELD, STATUS_FIELD, APPROVAL_STATUS_FIELD]
  })
  wiredCaseRecord({ error, data }) {
    if (data) {
      console.log('***processInstanceId',this.processInstanceId);
      this.currentStatusPicklistValue = data.fields.Status.value;
      console.log('**Current Picklist Values',this.currentStatusPicklistValue);
      if(data.fields.Status.value === 'Approve') {
        this.isApproveButtonDisabled = true;                     
        this.isRejectCloseButtonDisabled = true;                      
        this.isReassignButtonDisabled = true;
      }
      // Disable Approve button when logged in user is not owner of case
      if (data.fields.OwnerId.value != loggedInUserId) {
        //this.isApproveButtonDisabled = true;
      }
    } else if (error) {
        // TODO : Need to handle error here
    }
  }
  // Method to open Approval Popup
  handleApproveButtonClick() {
    this.modalHeaderTitle = "Approve Case";
    this.isOpenModalPopup = true;
    this.modalFooterApproveRejectButtonLabel = "Approve";
  }
  // Method to open the Reject Reassign Popup
  handleRejectReassignButtonClick() {}

  // Method to open Approval Popup
  handleRejectCloseButtonClick() {
    this.modalHeaderTitle = "Reject & Close Case";
    this.isOpenModalPopup = true;
    this.modalFooterApproveRejectButtonLabel = "Reject & Close";
  }
  /* Modal Popup Methods */
  // Method To Close the Modal Popup
  handleCancelButtonClick() {
    this.isOpenModalPopup = false;
  }
  // Method to Handle Approve/Reject Button Click
  // We send workitem id and based on Button We mark case as Approve or Reject
  handleApproveRejectButtonClick(event) {
    // Get the value of comment
    let comment = this.template.querySelector(".commentInputField").value;
    // if user click on Approve Button
    if (event.target.label === "Approve")
      this.updateApprovalProcessRecord(
        this.processInstanceWorkItemId,
        "Approve",
        comment,
        this.caseRecordId
      );
    else if (event.target.label === "Reject & Close")
      this.updateApprovalProcessRecord(
        this.processInstanceWorkItemId,
        "Reject",
        comment,
        this.caseRecordId
      );
  }
  // Method to set Approval Process with Status Approve/Reject
  updateApprovalProcessRecord(
    processInstanceWorkItemId,
    approvalStatus,
    approvalComment,
    caseRecordId
  ) {
    updateApprovalRecord({
      workItemId: processInstanceWorkItemId,
      approvalStatus: approvalStatus,
      comment: approvalComment,
      caseRecordId: caseRecordId
    })
      .then((result) => {
        if (result) {
          getRecordNotifyChange([
            {
              recordId: this.caseRecordId
            }
          ]);
          this.isOpenModalPopup = false;
          let resultObject = JSON.parse(result);
          if (resultObject.instanceStatus === "Approved") {
            this.isApproveButtonDisabled = true;
            this.isRejectCloseButtonDisabled = true;
            this.isReassignButtonDisabled = true;
            this.showToastMessage(
              "Success",
              "Case Record Approved Successfully",
              "success",
              "dismissable"
            );
          } else if (resultObject.instanceStatus === "Rejected") {
            this.isApproveButtonDisabled = true;
            this.isRejectCloseButtonDisabled = true;
            this.showToastMessage(
              "Success",
              "Case Record Rejected Successfully",
              "success",
              "dismissable"
            );
          }
        }
      })
      .catch((error) => {
        this.showToastMessage(
          "Error",
          "Case Record Failed To Approve",
          "error",
          "dismissable"
        );
      });
  }
  // Method to show the toast message
  showToastMessage(title, message, variant, mode) {
    const event = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant,
      mode: mode
    });
    this.dispatchEvent(event);
  }
}
