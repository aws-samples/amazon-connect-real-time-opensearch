const {
  ConnectClient,
  GetCurrentMetricDataCommand,
} = require("@aws-sdk/client-connect");
const region = process.env.AWS_REGION;
const accountId = process.env.ACCOUNT_ID;
var aoss = require("./aoss.js");
var constants = require('./constants.js');

const currentMetricDataFunction = {
  async getCurrentMetricDataMethod(instanceId, channels, queueSummaryList) {
    const client = new ConnectClient({ region: region });

    var response = null;
    try {
      var input = {};

      input.InstanceId = instanceId;

      var Filters = {};

      Filters.Channels = channels;
      Filters.Queues = queueSummaryList;

      input.Filters = Filters;

      // Average time that contacts waited in the queue before being answered by an agent.
      var CurrentMetrics = [
        {
          Name: "AGENTS_AFTER_CONTACT_WORK",
          Unit: "COUNT",
        },
        {
          Name: "AGENTS_AVAILABLE",
          Unit: "COUNT",
        },
        {
          Name: "AGENTS_ERROR",
          Unit: "COUNT",
        },
        {
          Name: "AGENTS_NON_PRODUCTIVE",
          Unit: "COUNT",
        },
        {
          Name: "AGENTS_ON_CALL",
          Unit: "COUNT",
        },
        {
          Name: "AGENTS_ON_CONTACT",
          Unit: "COUNT",
        },
        {
          Name: "AGENTS_ONLINE",
          Unit: "COUNT",
        },
        {
          Name: "AGENTS_STAFFED",
          Unit: "COUNT",
        },
        {
          Name: "CONTACTS_IN_QUEUE",
          Unit: "COUNT",
        },
        {
          Name: "CONTACTS_SCHEDULED",
          Unit: "COUNT",
        },
        {
          Name: "OLDEST_CONTACT_AGE",
          Unit: "SECONDS",
        },
        {
          Name: "SLOTS_ACTIVE",
          Unit: "COUNT",
        },
        {
          Name: "SLOTS_AVAILABLE",
          Unit: "COUNT",
        },
      ];

      input.CurrentMetrics = CurrentMetrics;

      console.log(input);

      const command = new GetCurrentMetricDataCommand(input);

      response = await client.send(command);
    } catch (error) {
      console.error(error);
    }
    return response;
  },
  async getCurrentMetricDataMethodByGroup(
    instanceId,
    channels,
    queueSummaryList,
    group
  ) {
    const client = new ConnectClient({ region: region });

    var response = null;
    try {
      var input = {};

      input.InstanceId = instanceId;

      var Filters = {};

      Filters.Channels = channels;
      Filters.Queues = queueSummaryList;

      input.Filters = Filters;

      var CurrentMetrics = [
        {
          Name: "AGENTS_AFTER_CONTACT_WORK",
          Unit: "COUNT",
        },
        {
          Name: "AGENTS_AVAILABLE",
          Unit: "COUNT",
        },
        {
          Name: "AGENTS_ERROR",
          Unit: "COUNT",
        },
        {
          Name: "AGENTS_NON_PRODUCTIVE",
          Unit: "COUNT",
        },
        {
          Name: "AGENTS_ON_CALL",
          Unit: "COUNT",
        },
        {
          Name: "AGENTS_ON_CONTACT",
          Unit: "COUNT",
        },
        {
          Name: "AGENTS_ONLINE",
          Unit: "COUNT",
        },
        {
          Name: "AGENTS_STAFFED",
          Unit: "COUNT",
        },
        {
          Name: "CONTACTS_IN_QUEUE",
          Unit: "COUNT",
        },
        {
          Name: "CONTACTS_SCHEDULED",
          Unit: "COUNT",
        },
        {
          Name: "OLDEST_CONTACT_AGE",
          Unit: "SECONDS",
        },
        {
          Name: "SLOTS_ACTIVE",
          Unit: "COUNT",
        },
        {
          Name: "SLOTS_AVAILABLE",
          Unit: "COUNT",
        },
      ];

      input.CurrentMetrics = CurrentMetrics;

      // Group By QUEUE
      var Groupings = [];
      Groupings.push(group);
      input.Groupings = Groupings;

      console.log(input);

      const command = new GetCurrentMetricDataCommand(input);

      response = await client.send(command);
    } catch (error) {
      console.error(error);
    }
    return response;
  },
  async parsegetCurrentMetricDataMethodResponse(response) {
    var outputObj = {};
    if (
      response &&
      response.MetricResults &&
      response.MetricResults[0] &&
      response.MetricResults[0].Collections
    ) {
      for (const metricResultCollection of response.MetricResults[0]
        .Collections) {
        console.log(metricResultCollection.Metric.Name);
        console.log(metricResultCollection.Value);

        outputObj[metricResultCollection.Metric.Name] =
          metricResultCollection.Value;
      }
    }

    var datetime = new Date().toISOString();
    outputObj.EventTimestamp = datetime;

    return outputObj;
  },
  async parsePostCurrentMetricDataMethodByGroup(
    response,
    queueNames,
    todayDate
  ) {
    var datetime = new Date().toISOString();
    if (response && response.MetricResults) {
      for (let index = 0; index < response.MetricResults.length; index++) {
        let outputObj = {};
        const metricResultElement = response.MetricResults[index];

        for (const metricResultCollection of metricResultElement.Collections) {
          console.log(metricResultCollection.Metric.Name);
          console.log(metricResultCollection.Value);
          outputObj[metricResultCollection.Metric.Name] =
            metricResultCollection.Value;
        }
        outputObj["QueueName"] =
          queueNames[metricResultElement.Dimensions.Queue.Id];
        outputObj["EventTimestamp"] = datetime;

        const indexName = constants.queueNameIndex + todayDate;
        await aoss.sendData(indexName, outputObj);
      }
    }
  },
  async getCurrentMetricDataGroupByRoutingProfile(
    instanceId,
    channels,
    routingProfileArray
  ) {
    const client = new ConnectClient({ region: region });

    var response = null;
    try {
      var input = {};

      input.InstanceId = instanceId;

      var Filters = {};
      Filters.Channels = channels;
      Filters.RoutingProfiles = routingProfileArray;

      input.Filters = Filters;

      // Average time that contacts waited in the queue before being answered by an agent.
      input.CurrentMetrics = [
        {
          Name: "AGENTS_AFTER_CONTACT_WORK",
          Unit: "COUNT",
        },
        {
          Name: "AGENTS_AVAILABLE",
          Unit: "COUNT",
        },
        {
          Name: "AGENTS_ERROR",
          Unit: "COUNT",
        },
        {
          Name: "AGENTS_NON_PRODUCTIVE",
          Unit: "COUNT",
        },
        {
          Name: "AGENTS_ON_CALL",
          Unit: "COUNT",
        },
        {
          Name: "AGENTS_ON_CONTACT",
          Unit: "COUNT",
        },
        {
          Name: "AGENTS_ONLINE",
          Unit: "COUNT",
        },
        {
          Name: "AGENTS_STAFFED",
          Unit: "COUNT",
        },
        {
          Name: "CONTACTS_IN_QUEUE",
          Unit: "COUNT",
        },
        {
          Name: "CONTACTS_SCHEDULED",
          Unit: "COUNT",
        },
        {
          Name: "OLDEST_CONTACT_AGE",
          Unit: "SECONDS",
        },
        {
          Name: "SLOTS_ACTIVE",
          Unit: "COUNT",
        },
        {
          Name: "SLOTS_AVAILABLE",
          Unit: "COUNT",
        },
      ];

      // Group By ROUTING_PROFILE
      var Groupings = [];
      Groupings.push("ROUTING_PROFILE");
      input.Groupings = Groupings;

      console.log(input);

      const command = new GetCurrentMetricDataCommand(input);

      response = await client.send(command);
    } catch (error) {
      console.error(error);
    }
    return response;
  },
  async parsePostRoutingProfileOutput(
    response,
    routingProfileNames,
    todayDate
  ) {
    var datetime = new Date().toISOString();
    if (response && response.MetricResults) {
      for (let index = 0; index < response.MetricResults.length; index++) {
        let outputObj = {};
        const metricResultElement = response.MetricResults[index];

        for (const metricResultCollection of metricResultElement.Collections) {
          console.log(metricResultCollection.Metric.Name);
          console.log(metricResultCollection.Value);
          outputObj[metricResultCollection.Metric.Name] =
            metricResultCollection.Value;
        }
        outputObj["RoutingProfileName"] = routingProfileNames[metricResultElement.Dimensions.RoutingProfile.Id];
        outputObj["EventTimestamp"] = datetime;

        const indexName = constants.routingProfileIndex + todayDate;
        await aoss.sendData(indexName, outputObj);
      }
    }
  },
};
module.exports = currentMetricDataFunction;
