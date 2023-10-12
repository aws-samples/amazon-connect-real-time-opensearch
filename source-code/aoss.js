const { defaultProvider } = require('@aws-sdk/credential-provider-node');
const { Client } = require('@opensearch-project/opensearch');
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');
const region = process.env.AWS_REGION;
var uuid = require('uuid')

const CollectionEndpoint = process.env.CollectionEndpoint;
const ConnectInstanceId = process.env.ConnectInstanceId;

const aoss = {
    async sendData(index, dataOject) {
        console.log('aoss index dataOject' ,index, JSON.stringify(dataOject)); 
    
        const client = new Client({
            ...AwsSigv4Signer({
                region: region,
                service: 'aoss',
                getCredentials: () => {
                    const credentialsProvider = defaultProvider();
                    return credentialsProvider();
                },
            }),
            node: CollectionEndpoint 
        });

        
        if (!(await client.indices.exists({ index })).body) {
            console.log((await client.indices.create({ index })).body);
        }
        
    
        const response = await client.index({
            id: uuid.v1(),
            index: index,
            body: dataOject,
        });
        console.log(response.body);
    }
    

}
module.exports = aoss;