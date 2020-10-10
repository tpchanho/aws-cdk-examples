def handler(event, context):
    auth_token = event['headers']['Authorization']
    if auth_token == 'testtoken':
        return generate_policy(event, True)
    else:
        return generate_policy(event, False)
    

def generate_policy(event, is_allow):
        return {
        "principalId": "user",
        "policyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Action": "execute-api:Invoke",
                    "Effect": "Allow" if is_allow else "Deny",
                    "Resource": event['methodArn']
                }
            ]
        }
    }