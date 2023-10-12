
const { ConnectClient, AssociateInstanceStorageConfigCommand } = require("@aws-sdk/client-connect"); 

const associateInstanceStorageConfig = {

    async process(instanceId, kinesisStreamArn) {
        const client = new ConnectClient({ region: process.env.AWS_REGION });

        const input = { 
            'InstanceId': instanceId, 
            'ResourceType': 'REAL_TIME_CONTACT_ANALYSIS_SEGMENTS',
            'StorageConfig': { 
              'StorageType': 'KINESIS_STREAM',
              'KinesisStreamConfig': { 
                'StreamArn': kinesisStreamArn
              },
            },
          };
          console.log(JSON.stringify(input));

          const command = new AssociateInstanceStorageConfigCommand(input);
          const response = await client.send(command);        
          console.log(JSON.stringify(response));
    }
}
module.exports = associateInstanceStorageConfig;
