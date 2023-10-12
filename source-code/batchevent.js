const { defaultProvider } = require('@aws-sdk/credential-provider-node');
const { Client } = require('@opensearch-project/opensearch');
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');

var routingProfileList = require('./routingProfileList.js');
var queueList = require('./queueList.js');
var collectQueueData = require('./collectQueueData.js');
var collectRoutingProfileData = require('./collectRoutingProfileData.js');
var collectMetricDataV2 = require('./collectMetricDataV2.js');
var cloudwatchEventConcurrentCalls = require('./cloudwatch/cloudwatchEventConcurrentCalls.js');
var cloudwatchEventConcurrentChats = require('./cloudwatch/cloudwatchEventConcurrentChats.js');

const ConnectInstanceId = process.env.ConnectInstanceId;

exports.handler = async function (event, context, callback) {
    console.log("INPUT -  ", JSON.stringify(event));
    var result = {};

    // Collect and send Queue Data to Open Search
    let queueListOutput = await queueList.getList(ConnectInstanceId);
    console.log(JSON.stringify(queueListOutput));
    let queueArray = await queueList.getQueueArray(queueListOutput);
    console.log(JSON.stringify(queueArray));
    let queueNames = await queueList.getQueueNameArray(queueListOutput);
    console.log(JSON.stringify(queueNames));

    // Collect and send Routing Profile Data to Open Search
    let routingProfileListOutput = await routingProfileList.get(ConnectInstanceId);
    console.log(JSON.stringify(routingProfileListOutput));
    let routingProfileArray = await routingProfileList.getRoutingProfileArray(routingProfileListOutput);
    console.log(JSON.stringify(routingProfileArray));
    let routingProfileNames = await routingProfileList.getRoutingProfileNames(routingProfileListOutput);
    console.log(JSON.stringify(routingProfileNames));

    await collectQueueData.get(queueArray, queueNames);
    await collectQueueData.getByGroup(queueArray, queueNames);

    await collectRoutingProfileData.getByGroup(routingProfileArray, routingProfileNames);

    await collectMetricDataV2.get(ConnectInstanceId, queueArray, 5);

    await cloudwatchEventConcurrentCalls.getData(ConnectInstanceId);

    await cloudwatchEventConcurrentChats.getData(ConnectInstanceId);

    callback(null, result);
};
