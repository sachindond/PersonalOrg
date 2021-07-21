/**
 * @ Author: Sachin Dond
 * @ Create Time: 2021-07-19 10:45:31
 * @ Modified by: Sachin Dond
 * @ Modified time: 2021-07-21 17:46:04
 * @ Description:
 * @ User Story:
 */
import { LightningElement, api,wire } from "lwc";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord,getRecordNotifyChange } from 'lightning/uiRecordApi';
import updateApprovalRecord from "@salesforce/apex/ItemForApprovalController.updateApprovalRecord";
import OWNERID_FIELD from '@salesforce/schema/Case.OwnerId';
import STATUS_FIELD from '@salesforce/schema/Case.Status';
import APPROVAL_STATUS_FIELD from '@salesforce/schema/Case.Approval_Status__c';
import loggedInUserId from '@salesforce/user/Id';

export default class ApprovalRequestDetailComponent extends LightningElement {
  // Property, Variables Initilization
  @api caseRecordId;
  @api processInstanceId;
  @api processInstanceWorkItemId;
  modalHeaderTitle = "";
  isOpenModalPopup = false;
  modalFooterApproveRejectButtonLabel = "";
  isApproveButtonDisabled = false;
  isRejectCloseButtonDisabled = false;
  caseStatus;
  // Wire service to get fields value from case record
  @wire(getRecord, {
    recordId: "$caseRecordId",
    fields: [OWNERID_FIELD, STATUS_FIELD, APPROVAL_STATUS_FIELD]
  })
  wiredCaseRecord({ error, data }) {
    if (data) {
      this.caseStatus = data.fields.Status.value;
      // Disable Approve button when logged in user is not owner of case
      if (data.fields.OwnerId.value != loggedInUserId) {
        //this.isApproveButtonDisabled = true;
      }
    } else if (error) {
      
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
    let comment = this.template.querySelector(".commentInputField").value;
    if (event.target.label == "Approve")
      this.updateApprovalProcessRecord(
        this.processInstanceWorkItemId,
        "Approve",
        comment,
        this.caseRecordId
      );
    else if (event.target.label == "Reject & Close")
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
        console.log("**Console.log", result);
        if (result) {
          getRecordNotifyChange([{ recordId: this.caseRecordId }]);
          this.isOpenModalPopup = false;
          let resultObject = JSON.parse(result);
          if (resultObject.instanceStatus == "Approved") {
            isApproveButtonDisabled = true;
            this.showToastMessage(
              "Success",
              "Case Record Approved Successfully",
              "success",
              "dismissable"
            );
          } else if (resultObject.instanceStatus == "Rejected") {
            isRejectCloseButtonDisabled = true;
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
        console.log("**Console.log Error", error);
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
