/**
 * @ Author: Sachin Dond
 * @ Create Time: 2021-07-27 13:56:16
 * @ Modified by: Sachin Dond
 * @ Modified time: 2021-07-27 14:57:17
 * @ Description:
 * @ User Story:
 */
({
  // do init method call when Aura componnet init
  doInit: function (component, event, helper) {
    // get current page referanace to extract url paramenter
    var pageReference = component.get("v.pageReference");
    if (
      pageReference !== undefined &&
      pageReference !== null &&
      pageReference.state != null
    ) {
      // get url parameter here
      var recordId = pageReference.state.c__recordId;
      console.log("**Record ID", recordId);
      component.set("v.recordId", recordId);
      // get workspace api to navigate in console app
      var workspaceAPI = component.find("workspace");
      workspaceAPI
        .isConsoleNavigation()
        .then(function (response) {
          workspaceAPI.getFocusedTabInfo().then(function (response) {
            console.log("**Focused tab id", response.tabId);
            workspaceAPI.setTabLabel({
              tabId: response.tabId,
              label: "Approval Request"
            });
            workspaceAPI.setTabIcon({
              tabId: response.tabId,
              icon: "standard:approval",
              iconAlt: "Approval"
            });
          });
        })
        .catch(function (error) {
          console.log("Error is " + error);
        });
    }
  }
});
