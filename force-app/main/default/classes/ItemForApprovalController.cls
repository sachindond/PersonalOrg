/*************************************************************************************
    # Author        : Sachin Dond
    # CreatedDate   : 15 July 2021
    # Purpose       : Controller Apex Class 
    # UserStory     :
    # Update History:
    ****************************************************************************
    LastModifiedBy  | LastModifiedDate  | UserStory    | Changes
    ****************************************************************************
                    |                   |              |    
**************************************************************************************/
public with sharing class ItemForApprovalController {
    public static Set<Id> getQueueIds () {
        Set<Id> setOfQueueIds = new Set<Id>();
        List<GroupMember> listOfGroupMember =  [Select  Group.Id From GroupMember Where UserOrGroupId =:UserInfo.getUserId() and Group.Type = 'Queue'];
        for(GroupMember memberRecord : listOfGroupMember) {
            setOfQueueIds.add(memberRecord.Group.Id);
        }
        return setOfQueueIds;
    }
    @AuraEnabled
    public static List<ProcessInstanceWorkItem> getListOfPendingApprovalRecords(){
        system.debug('**lstOfProcessInstanceWorkItem'); 
        try {
            Set<Id> setOfQueueIds = getQueueIds();
            List<ProcessInstanceWorkItem> lstOfProcessInstanceWorkItem = [Select Id,Actor.Name,Actor.Id,ProcessInstance.TargetObject.Name,
                                                                         PriorityProcessInstance.TargetObject.Type,ProcessInstance.TargetObjectId 
                                                                         From ProcessInstanceWorkItem 
                                                                         Where ProcessInstance.Status = 'Pending' and ( ActorId =:UserInfo.getUserId() or ActorId in:setOfQueueIds)];
           
            system.debug('**lstOfProcessInstanceWorkItem'+lstOfProcessInstanceWorkItem); 
            return lstOfProcessInstanceWorkItem;
        } catch (Exception e) {
            system.debug('**error'+e.getMessage());
            return null;
        }
    }
}
