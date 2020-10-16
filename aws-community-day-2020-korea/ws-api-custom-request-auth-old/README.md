# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

## 예제 설명

API Gateway, Websocket API를 생성하고, test 경로에 연결된 Lambda 함수를 호출해보는 예제입니다. 

### Connect Websocket

```
npm i -g wscat
wscat -c wss://a1b2c3d4e5.execute-api.ap-northeast-2.amazonaws.com/prod -H Authorization:testtoken
> {"Action":"test"}
>
```
