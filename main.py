import os
import webapp2
import jinja2
import json
import urllib2
import logging

from google.appengine.ext import db

jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))


def is_devserver():
    return os.environ['SERVER_SOFTWARE'].startswith("Dev")


def video_search(channel):
    url = "http://gdata.youtube.com/feeds/api/videos?author=%s&v=2&alt=json&format=5" % (channel)
    response = urllib2.urlopen(url)
    results = json.loads(response.read())
    video_list = results.get("feed", {}).get("entry", [])
    artist_videos = []
    for video in video_list:
        artist_videos.append({
            "ytid": video["media$group"]["yt$videoid"]["$t"],
            "title": video["media$group"]["media$title"]["$t"],
            "img": video["media$group"]["media$thumbnail"][0]["url"],
            })
    return json.dumps(artist_videos)


class Artist(db.Model):
    name = db.StringProperty()
    channel = db.StringProperty()
    #  [{ytid: id, title: "title", img: thumbnail_url}]
    videos = db.TextProperty()

    def to_dict(self):
        artist_dict = {"name": self.name, "channel": self.channel, "videos": self.videos}
        return artist_dict


class MainPage(webapp2.RequestHandler):
    def get(self):
        values = {
        'debug': is_devserver()
        }
        template = jinja_environment.get_template('index.html')
        self.response.out.write(template.render(values))


#Handler for Artist collection
class AllArtistHandler(webapp2.RequestHandler):
    def get(self):
        # get all artists from datastore
        # present artists as json
        artists = []
        for artist in Artist.all():
            artist_obj = artist.to_dict()
            artist_obj["id"] = artist.key().id()
            artists.append(artist_obj)
        # remove
        if len(artists) < 1:
            self.response.status = 400
            self.response.out.write("There are no artists yet")
            return
        self.response.out.write(json.dumps(artists))

    def post(self):
        #  get name and channel from request
        #  search youtube for matching videos
        #  store into new artist
        #  save and return artist as json
        data = json.loads(self.request.body)
        name = data.get("name", "")
        channel = data.get("channel", "")
        if len(name) < 1:
            self.response.status = 400
            self.response.out.write("You didn't give us a name")
            return
        if len(channel) < 1:
            self.response.status = 400
            self.response.out.write("You didn't give us a channel")
            return
        q = db.Query(Artist)
        qExist = q.filter("name =", name)
        if qExist.count() > 0:
            self.response.status = 400
            self.response.out.write("This artist already exists")
            return
        try:
            videos_json = video_search(channel)
            artist = Artist(name=name, channel=channel, videos=videos_json)
            artist.put()
            artist_info = artist.to_dict()
            artist_info["id"] = artist.key().id()
            self.response.out.write(json.dumps(artist_info))
        except urllib2.HTTPError, e:
            logging.info(e.read())
            self.response.status = 400
            self.response.out.write("Something went wrong")


class SinglArtistHandler(webapp2.RequestHandler):
    def put(self, id):
        # get artist from datastore
        # update entity based on client request
        # save info
        artist = Artist.get_by_id(int(id))
        if artist is None:
            self.response.status = 404
            self.response.out.write("Diva not found")
            return
        data = json.loads(self.request.body)
        if "name" not in data or "channel" not in data or "videos" not in data:
            self.response.status = 400
            self.response.out.write("give me more")
            return
        artist.name = data["name"]
        if artist.channel != data["channel"]:
            data["videos"] = video_search(data["channel"])
        artist.channel = data["channel"]
        artist.videos = data["videos"]
        artist.put()
        artist_dict = artist.to_dict()
        artist_dict["id"] = id
        self.response.out.write(json.dumps(artist_dict))

    def delete(self, id):
        # get artist (based on artist's name) from datastore
        # remove artist
        # return confirmation
        artist = Artist.get_by_id(int(id))
        if artist is None:
            self.response.status = 404
            self.response.out.write("Diva not found")
            return
        artist.delete()
        deletion_response = "Deletion successful"
        self.response.out.write(json.dumps(deletion_response))


app = webapp2.WSGIApplication([
    ('/', MainPage),
    ('/divas', AllArtistHandler),
    ('/divas/(\d+)', SinglArtistHandler),
    ],  debug=True)
