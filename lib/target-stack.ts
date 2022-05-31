import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as lambda_event_sources from "aws-cdk-lib/aws-lambda-event-sources";
import { SqsDestination } from "aws-cdk-lib/aws-s3-notifications";

export class TargetStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const inputBucket = new s3.Bucket(this, "input-bucket", {
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY
    })

    const storeBucket = new s3.Bucket(this, "store-bucket", { 
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY
    })

    
    const queue = new sqs.Queue(this, "SQS", {
      visibilityTimeout: Duration.seconds(300),
      receiveMessageWaitTime: Duration.seconds(20),
    })

    const lambdafunction = new lambda.Function(this, "lambdaFunction", {
      code: lambda.Code.fromAsset("src"),
      handler: "index.handler",
      functionName: "target-stack-lambda-function",
      runtime: lambda.Runtime.NODEJS_12_X,
    })

    storeBucket.grantReadWrite(lambdafunction)

    inputBucket.addEventNotification(
      s3.EventType.OBJECT_CREATED_PUT,
      new SqsDestination(queue)
    )

    const sqsNotificationEventSource = new lambda_event_sources.SqsEventSource(
      queue
    )

    lambdafunction.addEventSource(sqsNotificationEventSource)
  }
}
