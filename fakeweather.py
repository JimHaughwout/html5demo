from gevent import wsgi
from gevent import monkey
monkey.patch_socket()


class FakeWeather(object):

    weather_data = '{"message":"Model=GFS-OWM, ","cod":"200","calctime":0.0227,"cnt":1,"list":[{"id":745042,"name":"Istanbul","coord":{"lon":28.983311,"lat":41.03508},"distance":0.52,"main":{"temp":291.06,"pressure":1016,"humidity":77,"temp_min":290.93,"temp_max":291.15},"dt":1351021969,"wind":{"speed":5.1,"deg":20},"clouds":{"all":75},"weather":[{"id":211,"main":"Thunderstorm","description":"thunderstorm","icon":"11n"}]}]}'

    def start(self, env, start_response):
        """
        Check for favicon (nginx should handle), and return a
        decoded URL
        """
        start_response('200 OK', [('Content-Type', 'application/json')])
        return [self.weather_data + '\r\n']


if __name__ == '__main__':
    """
    Start WSGI server for fake weather service on port 8090
    """
    print 'Starting fake weather service'
    fweather = FakeWeather()
    wsgi.WSGIServer(('', 8090), fweather.start).serve_forever()
