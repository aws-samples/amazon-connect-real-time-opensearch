const { defaultProvider } = require('@aws-sdk/credential-provider-node');
const { Client } = require('@opensearch-project/opensearch');
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');
var currentMetricDataFunction = require('./currentMetricDataFunction.js');
var routingProfileList = require('./routingProfileList.js');
var aoss = require('./aoss.js');
var constants = require('./constants.js');

const ConnectInstanceId = process.env.ConnectInstanceId;

const collectRoutingProfileData = {
    async getByGroup(routingProfileArray, routingProfileNames) {
        var todayDate = new Date().toISOString().slice(0, 10);
        console.log(todayDate);

        var routingProfileCurrentMetricOutput = await currentMetricDataFunction.getCurrentMetricDataGroupByRoutingProfile(ConnectInstanceId, constants.channels, routingProfileArray);
        console.log('routingProfileCurrentMetricOutput : ', JSON.stringify(routingProfileCurrentMetricOutput));
    
        var routingProfileCurrentMetricOutputFormatted = await currentMetricDataFunction.parsePostRoutingProfileOutput(routingProfileCurrentMetricOutput,routingProfileNames,todayDate);
        console.log('routingProfileCurrentMetricOutputFormatted : ', JSON.stringify(routingProfileCurrentMetricOutputFormatted));    
    }
}
module.exports = collectRoutingProfileData;