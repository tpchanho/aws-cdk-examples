from my_lib.utils import make_response
from my_lib.utils import ws_send

def handler(event, context):
    ws_send(event['requestContext'], 'test reply')
    return make_response()