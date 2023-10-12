const date = require('date-and-time')

const { ConnectClient, GetMetricDataV2Command } = require("@aws-sdk/client-connect");
const region = process.env.AWS_REGION;
const accountId = process.env.ACCOUNT_ID;
var constants = require('../constants.js');

const getMetricDataV2 = {
    async getData(instanceId, queueArray, hoursData) {

        const client = new ConnectClient({ region: region });
        var endDate = new Date();
        endDate.setMinutes(endDate.getMinutes() - endDate.getMinutes()%5);

        var startDate = new Date();
        startDate.setMinutes(startDate.getMinutes() - startDate.getMinutes()%5);
        startDate.setHours(startDate.getHours() - hoursData);

        var endDateFormat=date.format(endDate, 'MMMM DD, YY HH:mm');
        var startDateFormat=date.format(startDate, 'MMMM DD, YY HH:mm');

        const start = new Date(startDateFormat);
        const end = new Date(endDateFormat);
    
        var response = null;
        try {
            var input  = {};
            
            input.ResourceArn = "arn:aws:connect:"+region+":"+accountId+":instance/"+instanceId;
            input.EndTime = end;
            input.StartTime = start;

            input.Filters =[
                {
                  "FilterKey": "CHANNEL",
                  "FilterValues": constants.channels
                },
                {
                  "FilterKey": "QUEUE",
                  "FilterValues": queueArray
                }
            ];
            input.Metrics = [
                {
                    'Name': 'AVG_HANDLE_TIME'
                },
                {
                    'Name': 'MAX_QUEUED_TIME'
                },
                {
                    'Name': 'CONTACTS_QUEUED'
                },
                {
                    'Name': 'CONTACTS_HOLD_ABANDONS'
                },
                {
                    'Name': 'CONTACTS_HANDLED'
                },
                {
                    'Name': 'CONTACTS_CREATED'
                },
                {
                    'Name': 'CONTACTS_ABANDONED'
                },
                {
                    'Name': 'AVG_QUEUE_ANSWER_TIME'
                },
                {
                    'Name': 'AVG_INTERACTION_TIME'
                },
                {
                    'Name': 'AVG_HOLD_TIME'
                },
                {
                    'Name': 'AVG_AFTER_CONTACT_WORK_TIME'
                },
                {
                    'Name': 'AVG_ABANDON_TIME'
                },
                {
                    'Name': 'AGENT_SCHEDULED_TIME'
                },
                {
                    'Name': 'AGENT_NON_RESPONSE'
                },
                {
                    'Name': 'AVG_INTERACTION_AND_HOLD_TIME'
                },
                {
                    'Name': 'SERVICE_LEVEL',
                    'Threshold': [
                        {
                            'Comparison': 'LT',
                            'ThresholdValue': 20
                        },
                    ]
                }
                
            ];
            console.log(input);
            const command = new GetMetricDataV2Command(input);
            response = await client.send(command);
            console.log(JSON.stringify(response));
        } catch (error) {
            console.error(error);
        }
        return response;
    }

}
module.exports = getMetricDataV2;