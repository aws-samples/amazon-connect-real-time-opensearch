const { ConnectClient, ListQueuesCommand } = require("@aws-sdk/client-connect");
const region = process.env.AWS_REGION;

const queueList = {
    async getList(instanceId) {

        const client = new ConnectClient({ region: region });
    
        var response = null;
        try {
            var input = {};
            input.InstanceId = instanceId;
            input.QueueTypes = ['STANDARD'];

            const command = new ListQueuesCommand(input);

            response = await client.send(command);
        } catch (error) {
            console.error(error);
        }
        return response;
    },
    async getQueueArray(response) {
        let queueArray = [];

        if(response && response.QueueSummaryList){
            for(queue of response.QueueSummaryList){
                if(!queueArray.includes(queue.Id)){
                    queueArray.push(queue.Id);
                }
            }
        }
        return queueArray;
    },
    async getQueueNameArray(response) {
        let queueArray = [];
        let queueNames = {};

        if(response && response.QueueSummaryList){
            for(queue of response.QueueSummaryList){
                if(!queueArray.includes(queue.Id)){
                    queueArray.push(queue.Id);
                    queueNames[queue.Id] = queue.Name;
                }
            }
        }
        return queueNames;
    }        

}
module.exports = queueList;