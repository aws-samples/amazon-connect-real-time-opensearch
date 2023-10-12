const response = require('cfn-response');
var AWS = require('aws-sdk');
var aws4 = require('aws4');
var { OpenSearchServerlessClient, CreateAccessPolicyCommand, DeleteAccessPolicyCommand} = require("@aws-sdk/client-opensearchserverless");
var client = new OpenSearchServerlessClient();

const region = process.env.AWS_REGION;

exports.handler = async function (event, context, callback) {
    var result = {
        responseStatus: "FAILED",
        responseData: { Data: "Never updated" },
    };
       
    console.log('Version 1');
    console.log("INPUT -  ", JSON.stringify(event));
    try {
        if(event.RequestType === 'Create') {
            await createAccessPolicy(event);
            result.responseStatus = "SUCCESS";
            result.responseData["Data"] = "Created Access Policy";
        } 
        else if (event.RequestType === 'Delete') {
            await deleteAccessPolicy(event);
            result.responseStatus = 'SUCCESS';
            result.responseData['Data'] = 'Deleted Access Policy';
        }
        else if (event.RequestType === 'Update') {
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

async function createAccessPolicy(event) {
    const accountNumber = event.ResourceProperties.AccountNumber;
    const collectionName = event.ResourceProperties.CollectionName;
    const username = event.ResourceProperties.Username;
    const lambdaRole = event.ResourceProperties.LambdaRole;
    const firehoseRole = event.ResourceProperties.FirehoseRole;
    const policyName = collectionName+'-access-policy';
    

    // Creates a data access policy that matches all collections beginning with 'tv-'
        var command = new CreateAccessPolicyCommand({
            description: 'Data access policy to all indexes in Collection ',
            name: policyName,
            type: 'data',
            policy: ' \
            [{ \
                \"Rules\":[ \
                    { \
                        \"Resource\":[ \
                            \"index\/*\/*\" \
                        ], \
                        \"Permission\":[ \
                            \"aoss:CreateIndex\", \
                            \"aoss:DeleteIndex\", \
                            \"aoss:UpdateIndex\", \
                            \"aoss:DescribeIndex\", \
                            \"aoss:ReadDocument\", \
                            \"aoss:WriteDocument\" \
                        ], \
                        \"ResourceType\": \"index\" \
                    }, \
                    { \
                        \"Resource\":[ \
                            \"collection\/'+collectionName+'\" \
                        ], \
                        \"Permission\":[ \
                            \"aoss:CreateCollectionItems\", \
                            \"aoss:DeleteCollectionItems\", \
                            \"aoss:UpdateCollectionItems\", \
                            \"aoss:DescribeCollectionItems\" \
                        ], \
                        \"ResourceType\": \"collection\" \
                    } \
                ], \
                \"Principal\":[ \
                    \"arn:aws:iam::'+accountNumber+':role\/'+lambdaRole+'\", \
                    \"arn:aws:iam::'+accountNumber+':role\/'+firehoseRole+'\", \
                    \"arn:aws:iam::'+accountNumber+':user\/'+username+'\" \
                ] \
            }]'
        });
        console.log(command);
        const response = await client.send(command);
        console.log("Access policy created:");
        console.log(response['accessPolicyDetail']);
}

async function deleteAccessPolicy(event) {
    const collectionName = event.ResourceProperties.CollectionName;
    const policyName = collectionName+'-access-policy';

    // Delete a data access policy 
        var command = new DeleteAccessPolicyCommand({
            name: policyName,
            type: 'data'
        });
        console.log(command);
        const response = await client.send(command);
        console.log("Access policy deleted:");
        console.log(response['accessPolicyDetail']);
}
