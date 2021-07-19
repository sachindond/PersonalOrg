/*******************************************************
    #Author         :Sachin Dond
    #CreatedDate    :8 July 2021
    #Purpose        :Controller class for to handle apex calls for LWC
    #Update History :    
 */

public with sharing class TabComponentController {
    /*
        #Author         :Sachin Dond
        #CreatedDate    :8 July 2021
        #Purpose        :get list of related address informations
    */
    @AuraEnabled(cacheable=true)
    public static Map<String,Id> getRelatedAddressesRecords(string accountId) {
        system.debug('**Account Id'+accountId);
        Map<String,Id> mapOfAddressTypeRecords = new Map<String,Id>();
        try {
            // Get the list of address records related to current account
            List<Address_Information__c> listOfAddresses = [Select Id,Address_Type__c From Address_Information__c where Account__c =:accountId];
            if(listOfAddresses.size() > 0) {
                
                for(Address_Information__c addressRecord : listOfAddresses) {
                    mapOfAddressTypeRecords.put(addressRecord.Address_Type__c,addressRecord.Id);
                }
            }
            return mapOfAddressTypeRecords;
        }catch(Exception ex) {
            system.debug('** Error Occure'+ex.getMessage());
            return null;
        }
    }
}
