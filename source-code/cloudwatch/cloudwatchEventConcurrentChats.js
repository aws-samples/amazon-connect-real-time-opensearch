var AWS = require('aws-sdk');
AWS.config.update({region: process.env.AWS_REGION});
var cloudwatch = new AWS.CloudWatch({apiVersion: '2010-08-01'});

var constants = require('../constants.js');
// Last 5 min data duration
const DATA_DURATION= 5;
var aoss = require('../aoss.js');

const cloudwatchEventConcurrentChats = {
	async getData(ConnectInstanceId) {
    let endDate =  new Date();
    let startdate = new Date(endDate);
    startdate.setMinutes(endDate.getMinutes() - DATA_DURATION);

    let StartTime = startdate.toISOString();
    let EndTime = endDate.toISOString();

    let params = {
      'StartTime': StartTime,
      'EndTime': EndTime,
      'MetricDataQueries': [ 
        {
          'Id': 'metric_alias_metrics_view_graph_0', /* required */
          'Label': 'ConcurrentActiveChats',
          'MetricStat': {
            'Metric': { 
              'Dimensions': [
                {
                  "Name": "InstanceId",
                  "Value": ConnectInstanceId
                },
                {
                  "Name": "MetricGroup",
                  "Value": "Chats"
                }
              ],
              'MetricName': 'ConcurrentActiveChats',
              'Namespace': 'AWS/Connect'
            },
            'Period': '300', 
            'Stat': 'Average', 
          }
        }
      ],
    };
    console.log('inputs ',JSON.stringify(params));
    
    let response = await cloudwatch.getMetricData(params).promise();
    console.log(JSON.stringify(response));

    var outputObj ={};
    let datetime = new Date().toISOString();
    outputObj.EventTimestamp = datetime;
    let todayDate = new Date().toISOString().slice(0, 10);
    console.log(todayDate);

    const indexName = constants.concurrentChatIndex + todayDate;

    if (response && response.MetricDataResults) {
      for (let index = 0; index < response.MetricDataResults.length; index++) {
        const record = response.MetricDataResults[index];
        
        if (record.Timestamps && record.Values && record.Values.length > 0) {
          outputObj[record.Label] =  record.Values[0];
          await aoss.sendData(indexName, outputObj);
        }else{
          outputObj['ConcurrentActiveChats'] =  0;
          await aoss.sendData(indexName, outputObj);
        }
    }
    }
  }
}

module.exports = cloudwatchEventConcurrentChats;
