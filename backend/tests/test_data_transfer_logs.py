import unittest

from flask import json
from marshmallow import EXCLUDE

from app import db
from app.model.data_transfer_log import DataTransferLog, DataTransferLogDetail, DataTransferLogSchema
from tests.base_test import BaseTest


class TestDataTransferLogs(BaseTest, unittest.TestCase):

    def test_export_logs_endpoint(self):
        for i in range(20):
            elog = DataTransferLog()
            for x in range(2):
                dlog = DataTransferLogDetail()
                elog.details.append(dlog)
            db.session.add(elog)

        rv = self.app.get('/api/data_transfer_log?pageSize=10',
                          follow_redirects=True,
                          content_type="application/json",
                          headers=self.logged_in_headers())
        self.assert_success(rv)
        response = json.loads(rv.get_data(as_text=True))
        self.assertEquals(20, response['total'])
        self.assertEquals(2, response['pages'])
        self.assertEquals(10, len(response['items']))
        results = DataTransferLogSchema(many=True, session=db.session).load(response['items'], unknown=EXCLUDE)
        self.assertEquals(10, len(results))
