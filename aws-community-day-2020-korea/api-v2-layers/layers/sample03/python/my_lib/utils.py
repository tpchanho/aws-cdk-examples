import boto3
from botocore.exceptions import ClientError

def make_response(status_code=200):
    return {
        'statusCode': status_code
    }

def ws_send(request_context, message_str):
    connectionId = request_context['connectionId']
    domain_name = request_context['domainName']
    stage = request_context['stage']
    endpoint_url = f'https://{domain_name}/{stage}'
    api_client = boto3.client(
        'apigatewaymanagementapi', endpoint_url=endpoint_url)
    try:
        api_client.post_to_connection(Data=message_str,
                                      ConnectionId=connectionId)
    except ClientError as e:
        print(e)
        print(message_str)
    except Exception as e:
        print(e)
        print(message_str)