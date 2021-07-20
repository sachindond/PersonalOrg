({
    handleChanged: function(component, message, helper) {
        // Read the message argument to get the values in the message payload
        component.set("v.message", message.getParam("recordId"));
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            workspaceAPI.setTabLabel({
                tabId: focusedTabId,
                label: component.get("v.message")
            });
        }).catch(function(error) {
            console.log(error);
        });
    }
})
