from app.celery_app import celery_app
from influxdb_client import InfluxDBClient, Point
from influxdb_client.client.write_api import SYNCHRONOUS
import time
import os

INFLUXDB_URL = os.environ.get("INFLUXDB_URL", "http://influxdb:8086")
INFLUXDB_TOKEN = os.environ.get("INFLUXDB_TOKEN", "mytoken")
INFLUXDB_ORG = os.environ.get("INFLUXDB_ORG", "myorg")
INFLUXDB_BUCKET = os.environ.get("INFLUXDB_BUCKET", "mybucket")


@celery_app.task
def process_pcap_task(file_contents):
    time.sleep(10)

    client = InfluxDBClient(
        url=INFLUXDB_URL, token=INFLUXDB_TOKEN, org=INFLUXDB_ORG
    )
    write_api = client.write_api(write_options=SYNCHRONOUS)

    point = Point("network_data").field("processed_packets", 100)
    write_api.write(bucket=INFLUXDB_BUCKET, record=point)

    client.close()

    return "Processing Complete"
