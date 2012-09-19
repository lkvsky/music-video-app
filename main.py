import os
import webapp2
import jinja2
import simplejson
import urllib2
import logging

from google.appengine.ext import db

jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))


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
        template = jinja_environment.get_template('index.html')
        self.response.out.write(template.render())


#Handler for Artist collection
class ArtistHandler(webapp2.RequestHandler):
    def get(self):
        # get all artists from datastore
        # present artists as json
        artists = []
        for artist in Artist.all():
            artist_obj = artist.to_dict()
            artists.append(artist_obj)
        if len(artists) < 1:
            self.response.status = 400
            self.response.out.write("There are no artists yet")
            return
        self.response.out.write(simplejson.dumps(artists))

    def post(self):
        #  get name and ytid from request
        #  search youtube for matching videos
        #  store into new artist
        #  save and return artist as json
        name = self.request.get("name", "")
        channel = self.request.get("channel", "")
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
            self.response.out.write("This channel already exists")
            return
        try:
            url = "http://gdata.youtube.com/feeds/api/videos?author=%s&v=2&alt=json&format=5" % (channel)
            response = urllib2.urlopen(url)
            results = simplejson.loads(response.read())
            video_list = results.get("feed", {}).get("entry", [])
            artist_videos = []
            for video in video_list:
                artist_videos.append({
                    "ytid": video["media$group"]["yt$videoid"]["$t"],
                    "title": video["media$group"]["media$title"]["$t"],
                    "img": video["media$group"]["media$thumbnail"][0]["url"],
                    })
            videos_json = simplejson.dumps(artist_videos)
            artist = Artist(name=name, channel=channel, videos=videos_json)
            artist.put()
            artist_info = artist.to_dict()
            self.response.out.write(simplejson.dumps(artist_info))
        except urllib2.HTTPError, e:
            logging.info(e.read())
            self.response.status = 400
            self.response.out.write("Something went wrong")

    def put(self, artist):
        # get artist from datastore
        # update entity based on client request
        # save info
        q = db.Query(Artist)
        match = q.filter("name =", artist)
        if match.count() == 0:
            return
        returned_artist = match[0]
        data = simplejson.loads(self.request.body)
        returned_artist.name = data["name"]
        returned_artist.channel = data["channel"]
        returned_artist.videos = data["videos"]
        returned_artist.put()
        return_toclient = returned_artist.to_dict()
        self.response.out.write(simplejson.dumps(return_toclient))

    def delete(self, artist):
        # get artist (based on artist's name) from datastore
        # remove artist
        # return confirmation
        q = db.Query(Artist)
        match = q.filter("name =", artist)
        if match.count() == 0:
            return
        match[0].delete()


app = webapp2.WSGIApplication([
    ('/', MainPage),
    ('/divas', ArtistHandler)
    ],  debug=True)
