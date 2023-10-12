
const { ConnectClient, ListInstanceStorageConfigsCommand  } = require("@aws-sdk/client-connect"); 

const listInstanceStorageConfig = {

    async process(instanceId) {
        const client = new ConnectClient({ region: process.env.AWS_REGION });

        const input = { 
            'InstanceId': instanceId, 
            'ResourceType': 'REAL_TIME_CONTACT_ANALYSIS_SEGMENTS'
          };
          console.log(JSON.stringify(input));

          const command = new ListInstanceStorageConfigsCommand(input);
          const response = await client.send(command);        
          console.log(JSON.stringify(response));
    }
}
module.exports = listInstanceStorageConfig;
