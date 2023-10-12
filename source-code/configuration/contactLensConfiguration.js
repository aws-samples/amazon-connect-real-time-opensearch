const response = require('cfn-response');

const associateInstanceStorageConfig = require('../connect/associateInstanceStorageConfig.js');
const disAssociateInstanceStorageConfig = require('../connect/disAssociateInstanceStorageConfig.js');
const listInstanceStorageConfig = require('../connect/listInstanceStorageConfig.js');

exports.handler = async function (event, context, callback) {
    var result = {
        responseStatus: "FAILED",
        responseData: { Data: "Never updated" },
    };
       
    console.log('Version 1');
    console.log("INPUT -  ", JSON.stringify(event));
    try {
        if(event.RequestType === 'Create') {
            console.log('event.RequestType Create');
            const connectInstanceId = event.ResourceProperties.ConnectInstanceId;
            const contactLensKinesisStream = event.ResourceProperties.ContactLensKinesisStream;

            await associateInstanceStorageConfig.process(connectInstanceId, contactLensKinesisStream);

            result.responseStatus = "SUCCESS";
            result.responseData["Data"] = "Created Access Policy";
        } 
        else if (event.RequestType === 'Delete') {
            console.log('event.RequestType Delete');
            const connectInstanceId = event.ResourceProperties.ConnectInstanceId;
            const contactLensKinesisStream = event.ResourceProperties.ContactLensKinesisStream;

            let listRespons = await listInstanceStorageConfig.process(connectInstanceId);

            if(listRespons && listRespons.StorageConfigs && listRespons.StorageConfigs.length > 0){
                let associationId = '';
                for (let index = 0; index < listRespons.StorageConfigs.length; index++) {
                    const element = listRespons.StorageConfigs[index];
                    if(element.KinesisStreamConfig.StreamArn === contactLensKinesisStream){
                        associationId = element.AssociationId;
                    }
                }
                console.log('disAssociateInstanceStorageConfig associationId ', associationId);
                await disAssociateInstanceStorageConfig.process(connectInstanceId, associationId);
            }

            result.responseStatus = 'SUCCESS',
            result.responseData['Data'] = 'Deleted Access Policy';
        }
        else if (event.RequestType === 'Update') {
            console.log('event.RequestType Update');

            result.responseStatus = 'SUCCESS',
            result.responseData['Data'] = 'No Change Required';
        }
    } catch (error) {
        console.log(JSON.stringify(error, 0, 4));
        result.responseStatus = "FAILED";
        result.responseData["Data"] = "Failed to process event";
    }
    finally {
        return await responsePromise(event, context, result.responseStatus, result.responseData, `mainstack`);
    }
};


function responsePromise(event, context, responseStatus, responseData, physicalResourceId) {
    return new Promise(() => response.send(event, context, responseStatus, responseData, physicalResourceId));
}
