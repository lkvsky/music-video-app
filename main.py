import os
import webapp2
import jinja2
import simplejson

from google.appengine.api import users
from google.appengine.ext import db

jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))


class Video(db.Model):
    ytid = db.StringProperty()
    title = db.StringProperty()
    img = db.StringProperty()
    embed = db.BooleanProperty()


class MainPage(webapp2.RequestHandler):
    def get(self):
        template = jinja_environment.get_template('templates/index.html')
        self.response.out.write(template.render())


class VideoHandler(webapp2.RequestHandler):
    def get(self):
        videos = []
        for video in Video.all():
            videos.append({
                "id": video.key().id(),
                "ytid": video.id,
                "title": video.title,
                "img": video.img,
                "embed": video.embed
            })
        self.response.out.write(simplejson.dumps(videos))

    def post(self):
        data = simplejson.loads(self.request.body)
        video = Video(
            ytid = data["ytid"],
            title = data["title"],
            img = data["img"],
            embed = data["embed"]
        ).put()

        self.response.out.write(simplejson.dumps({
            "id": video.id(),
            "ytid": data["ytid"],
            "title": data["title"],
            "img": data["img"],
            "embed": data["embed"]
        }))


app = webapp2.WSGIApplication([('/', MainPage)],  debug=True)
