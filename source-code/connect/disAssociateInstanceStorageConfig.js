
const { ConnectClient, DisassociateInstanceStorageConfigCommand } = require("@aws-sdk/client-connect"); 

const disAssociateInstanceStorageConfig = {

    async process(instanceId, associationId) {
        const client = new ConnectClient({ region: process.env.AWS_REGION });

        const input = { 
            'InstanceId': instanceId, 
            'ResourceType': 'REAL_TIME_CONTACT_ANALYSIS_SEGMENTS',
            'AssociationId': associationId,
          };
          console.log(JSON.stringify(input));

          const command = new DisassociateInstanceStorageConfigCommand(input);
          const response = await client.send(command);        
          console.log(JSON.stringify(response));
    }
}
module.exports = disAssociateInstanceStorageConfig;
