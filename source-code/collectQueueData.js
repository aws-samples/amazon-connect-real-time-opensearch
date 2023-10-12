var currentMetricDataFunction = require('./currentMetricDataFunction.js');
var aoss = require('./aoss.js');
var constants = require('./constants.js');

const ConnectInstanceId = process.env.ConnectInstanceId;

const collectQueueData = {
    async get(queueArray, queueNames) {
        let todayDate = new Date().toISOString().slice(0, 10);
        console.log(todayDate);

        let currentMetricDataMethodResponse = await currentMetricDataFunction.getCurrentMetricDataMethod(ConnectInstanceId, constants.channels, queueArray);
        console.log('currentMetricDataMethodResponse : ', JSON.stringify(currentMetricDataMethodResponse));
    
        let currentMetricDataMethodResponseFormatted = await currentMetricDataFunction.parsegetCurrentMetricDataMethodResponse(currentMetricDataMethodResponse);
        console.log('currentMetricDataMethodResponseFormatted : ', JSON.stringify(currentMetricDataMethodResponseFormatted));
    
        const indexName = constants.queueIndex + todayDate;

        await aoss.sendData(indexName, currentMetricDataMethodResponseFormatted);
        console.log('Fetching Data for Queue - End');
    
    },
    async getByGroup(queueArray, queueNames) {
        let todayDate = new Date().toISOString().slice(0, 10);
        console.log(todayDate);
    
        let currentMetricDataMethodByGroup = await currentMetricDataFunction.getCurrentMetricDataMethodByGroup(ConnectInstanceId, constants.channels, queueArray, 'QUEUE');
        console.log('currentMetricDataMethodByGroup : ', JSON.stringify(currentMetricDataMethodByGroup));
    
        await currentMetricDataFunction.parsePostCurrentMetricDataMethodByGroup(currentMetricDataMethodByGroup, queueNames,todayDate);
    
    }

}
module.exports = collectQueueData;