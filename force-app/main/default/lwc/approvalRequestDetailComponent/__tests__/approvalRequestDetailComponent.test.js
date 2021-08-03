/**
 * @ Author: Sachin Dond
 * @ Create Time: 2021-08-02 10:53:09
 * @ Modified by: Sachin Dond
 * @ Modified time: 2021-08-02 14:59:14
 * @ Description: Test cases for component
 * @ User Story:
 */
import { createElement } from "lwc";
import ApprovalRequestDetailComponent from 'c/approvalRequestDetailComponent';
import { registerApexTestWireAdapter } from "@salesforce/sfdx-lwc-jest";
import { getRecord } from "lightning/uiRecordApi";
import { registerLdsTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
const getCaseRecordMock = require('./data/getCaseRecordMock.json');
const getCaseRecordWithRejectStatusMock = require('./data/getCaseRecordRejectStatus.json');
const getRecordAdapter = registerLdsTestWireAdapter(getRecord);
const getRecordRejectAdapter = registerLdsTestWireAdapter(getRecord);
// Describe block
describe("c-approval-request-retail-component testing", () => {
  // before each block
  beforeEach(() => {
    const element = createElement("c-approval-request-detail-component", {
      is: ApprovalRequestDetailComponent
    });
    document.body.appendChild(element);
  });
  test("wiredCaseRecord testing", () => {
    const element = document.querySelector(
      "c-approval-request-detail-component"
    );
    getRecordAdapter.emit(getCaseRecordMock);
    return Promise.resolve().then(() => {});
  });

  test("handleApproveButtonClick testing", () => {
    const element = document.querySelector(
      "c-approval-request-detail-component"
    );
    const approveButtonElement =
      element.shadowRoot.querySelector(".approveButtonCls");
    approveButtonElement.dispatchEvent(new CustomEvent("click"));
    return Promise.resolve().then(() => {});
  });
  test("handleRejectCloseButtonClick testing", () => {
    const element = document.querySelector(
      "c-approval-request-detail-component"
    );
    const rejectCloseButtonElement =
      element.shadowRoot.querySelector(".rejectButtonCls");
    rejectCloseButtonElement.dispatchEvent(new CustomEvent("click"));
    return Promise.resolve().then(() => {});
  });

  test("handleModalCancelButtonClick testing", () => {
    const element = document.querySelector(
      "c-approval-request-detail-component"
    );
    const modalCancelButtonElement =
      element.shadowRoot.querySelector(".cancelButtonCls");
    modalCancelButtonElement.dispatchEvent(new CustomEvent("click"));
    return Promise.resolve().then(() => {});
  });

  test("handleModalApproveRejectButtonClick testing", () => {
    const element = document.querySelector(
      "c-approval-request-detail-component"
    );
    getRecordRejectAdapter.emit(getCaseRecordWithRejectStatusMock);
    return Promise.resolve().then(() => {
      const modalApproveRejectButtonClick = element.shadowRoot.querySelector(
        ".approveRejectButtonCls"
      );
      modalApproveRejectButtonClick.dispatchEvent(new CustomEvent("click"));
    });
  });
  /*
    test('Render c-approval-request-highlight-panel-component',()=>{
        const element = document.querySelector('c-approval-request-detail-component');
        const childCompElement = element.shadowRoot.querySelectorAll('c-approval-request-highlight-panel-component');
        expect(childCompElement.length).toBe(1);
    })
    */
});

