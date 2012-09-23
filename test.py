import unittest
import webapp2
import json

import main


class TestArtist(unittest.TestCase):
    def test_get(self):
        request = webapp2.Request.blank('/divas')
        response = request.get_response(main.app)
        self.assertEqual(response.status_int, 200)
        json_topy = json.loads(response.body)
        self.assertIsInstance(json_topy, list)
