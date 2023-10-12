let getMetricDataV2 = require('./connect/getMetricDataV2.js');
var aoss = require("./aoss.js");
var constants = require('./constants.js');

const collectMetricDataV2 = {
    async get(instanceId, queueArray, hoursData) {
        var todayDate = new Date().toISOString().slice(0, 10);
        console.log(todayDate);

        let response = await getMetricDataV2.getData(instanceId, queueArray, hoursData);

        var datetime = new Date().toISOString();
        var outputObj = {};
        if (response && response.MetricResults && response.MetricResults[0] && response.MetricResults[0].Collections) {
          for (const metricResultCollection of response.MetricResults[0].Collections) {
            console.log(metricResultCollection.Metric.Name);
            console.log(metricResultCollection.Value);
            outputObj[metricResultCollection.Metric.Name] =  metricResultCollection.Value;
          }
        }
    
        var datetime = new Date().toISOString();
        outputObj.EventTimestamp = datetime;
  
        const indexName = constants.getMetricIndex + todayDate;
        await aoss.sendData(indexName, outputObj);
    }
}
module.exports = collectMetricDataV2;