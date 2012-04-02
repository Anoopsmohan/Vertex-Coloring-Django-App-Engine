from google.appengine.ext.webapp import template
import cgi,os
from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
import wsgiref.handlers


def find_color(adj,node_colors):
    return node_colors [adj]
	
def check_colored(adj,check_list):
    return check_list [adj]

def give_color(node,adj_list,check_list,node_colors):
    adj_nodes_colors = []
    avail_colors = [0,1,2,3,4,5,6,7,8,9]
    for adj in adj_list[node]:
	if(check_colored(adj,check_list)):
	    used_color = find_color(adj,node_colors)
	    adj_nodes_colors.append(used_color) 
    avail_color_set = set(avail_colors)
    colored_set = set(adj_nodes_colors)
    ok_colors = avail_color_set - colored_set
    ok_colors_list = list(ok_colors)
    return ok_colors_list [0]


class MainPage(webapp.RequestHandler):
    def get(self):
	template_values={}
	path = os.path.join(os.path.dirname(__file__), 'graph.html')
        self.response.out.write(template.render(path,template_values))
	
class Coloring(webapp.RequestHandler):
    def post(self):
	adj_list=eval(self.request.get('name'))
	nodes = range(len(adj_list))
	check_list = []
	i = 0
	while(i < len(adj_list)) :
		check_list.append(0) 
		i += 1
	colors = {
		0 : "red",
		1 : "blue",
		2 : "green",
		3 : "yellow",
		4 : "orange",
		5 : "magenta",
		6 : "#00FF00",
		7 : "#33FFFF",
		8 : "black",
		9 : "pink"
	}
	node_colors = {
	}
	for node in nodes:
		node_colors [node] = give_color(node,adj_list,check_list,node_colors)
		check_list [node] = 1	
	value_color = node_colors.values()
	self.response.out.write(value_color)
application = webapp.WSGIApplication([('/',MainPage),('/posted', Coloring)],
                                     debug=True)
def main():
    run_wsgi_app(application)
if __name__ == "__main__":
    main()
