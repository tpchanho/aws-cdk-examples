docker run --rm -v "$($PWD)\layers:/foo" -w /foo lambci/lambda:build-python3.8 pip install -r requirements.txt -t sample03/python/lib/python3.8/site-packages