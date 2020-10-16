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

API Gateway, Rest API를 생성하고 test 리소스를 GET 메소드로 호출해서 Lambda 함수를 연결 실행할 수 있습니다. 권한부여자에서, Header에 보낸 Authorization 값이 일치하는 경우에만 연결을 허용합니다. 

배포까지 완료된 후, 요청을 보내서 동작을 확인해보실 수 있습니다. 주소를 알맞게 변경해주시기 바랍니다. Authorization 에 다른 값을 넣어서 인증이 실패하는 경우도 테스트 해보실 수 있습니다. 

### Send Request

Powershell
```
Invoke-WebRequest https://a1b2c3d4e5.execute-api.ap-northeast-2.amazonaws.com/prod/test -Method 'GET' -Headers @{'Authorization' = 'testtoken'}
```
