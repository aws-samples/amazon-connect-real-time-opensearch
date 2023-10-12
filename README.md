# Amazon Connect real-time analytics with Amazon OpenSearch

## Introduction
Call centers handle a large volume of incoming calls, chats, and messages from customers each day, and real-time analytics can help them better understand and respond to these interactions. By using real-time analytics, call centers gain insights into agent performance, call volume, customer satisfaction, and more. These insights enable managers to make informed decisions quickly and in a timely manner, which improves the overall efficiency and effectiveness of the call center. The ability to react in real-time ensures that customer needs are being met promptly, which leads to increased customer satisfaction and loyalty. 

## Prerequisites
To follow along with the solution presented in this blog post, you must understand the following AWS services and features:

* Amazon Connect
* Amazon EventBridge
* AWS Lambda
* AWS CloudFormation
* Amazon Kinesis
* Amazon OpenSearch
* Amazon CloudWatch
* AWS Identity and Access Management (IAM)
* Create and modify AWS IAM roles


## Overview

![Architecture Diagram](diagram/architecture-real-time-aoss.png?raw=true)

Real-time processing of Amazon Connect Contact Center data is made possible through the architecture outlined above. This is accomplished by employing an AWS Lambda to query Amazon Connect metrics every 15 seconds. Furthermore, agent events and conversational analytics are fed into another Lambda using Amazon Kinesis Data Streams. The data is then parsed and formatted by the AWS Lambda to suit Amazon OpenSearch, including the indexing.

There are several benefits to using Amazon OpenSearch Serverless rather than a cluster. For one, OpenSearch Serverless eliminates much of the complexity involved in managing clusters and capacity. It is also cost-effective, as you pay only for what you use by automatically scaling resources to provide the right amount of capacity for your application without affecting data ingestion.

Amazon OpenSearch can ingest other data such as human resources information like agent holidays to provide comprehensive reporting.   

## Walkthrough

1.  Download the content in the "source-code" [here](source-code/). folder.
2.  Run "npm install"
3.  Zip the content after step 2 and name the zip source-code.zip
4.	Create a S3 solution bucket in your AWS account.
5.	Place the source-code.zip file (step 3) in the solution bucket (step 4)
6.	Run the CFT located [here](cft/connect-aoss-cft.yaml).
7.	Following parameters needed for the CFT (Note : Stack name is all lowercase and less than 25 char., at the moment):
    1.	ConnectInstanceId: Copy the Amazon Connect instance ID
    2.	SolutionSourceBucket: Solution bucket created in step 4

![CloudFormation Template Screenshot](diagram/cft-screenshot.png?raw=true)

8. Once the CFT execution is successful. Create users credentials to access the OpenSearch dashboard </br> ![IAM User](diagram/iam-user.png?raw=true)
9. Enable Console Access and set the password, Click Apply </br></br> ![IAM User credential configuration](diagram/iam-user-crednetial-select.png?raw=true)
10. Download the credential file for future ref. </br></br> ![IAM User credential download](diagram/iam-user-crednetial-download.png?raw=true)
11. Get the OpenSeach console URL under the CloudFormation stack's Outputs tab. </br> ![OpenSearch Console URL](diagram/cft-output-tab.png?raw=true)
12. Download the OpenSearch dashboard located [here](opensearch-import/aoss-export.ndjson)
13. Open the OpenSearch dashboard in the another browser session and login with the credential generate in step 9
14. Click on the OpenSearch Stack management </br> ![OpenSearch Stack management](diagram/os-stack-management.png?raw=true)
15. Import the OpenSeach file (downloaded in step 12) </br> ![OpenSearch import](diagram/os-import.png?raw=true)
16. Click on Done </br> ![OpenSearch import](diagram/os-import-done.png?raw=true)
17. Navigate to the OpenSeach Dashboard </br> ![OpenSearch Dashboard](diagram/os-dashboard.png?raw=true)

## Steps to test

Log in to your Amazon Connect instance.
1. Open the CCP and update the Agent status
2. Place test call to reach to the Agent

## Visualize in Amazon OpenSearch

Below is the Amazon OpenSearch Dashboard screesnhot with Amazon Connect data. 
![Real-time analytics Dashboard](diagram/aoss-dashboard.png?raw=true)

## Clean up
In order to remove the resources created by the stack, perform the following steps:

* Delete the CloudFormation template.
* Delete the objects and the S3 bucket created as part of Step 4.

## Conclusion
In conclusion, the architecture outlined above enables real-time processing of Amazon Connect Contact Center data through the use of AWS Lambda, Amazon Kinesis Data Streams and Amazon OpenSearch. Amazon OpenSearch Serverless provides several benefits over a cluster, including reduced complexity in managing clusters and capacity, cost-effectiveness, and the ability to ingest other data such as human resources information for comprehensive reporting. This allows businesses to efficiently manage and analyze their contact center data, leading to improved performance and customer satisfaction.


