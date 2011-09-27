#!/usr/bin/env python2.6

import urllib2
from BeautifulSoup import BeautifulSoup

import cgitb
cgitb.enable()
import json
import cgi

def send_json( data ):
    print "Content-type: application/json; charset=utf-8\r\n"
    print json.dumps( data )

def get_attributes( items, attribute ):
    attributes = []
    for x in items:
        try:
            attributes.append( x[attribute] )
        except KeyError:
            pass
    # unique-ify
    return list( set( attributes ) )

def get_javascripts( soup ):
    javascripts = soup.findAll( 'script', type="text/javascript" )
    return get_attributes( javascripts, 'src' )

def get_stylesheets( soup ):
    stylesheets = soup.findAll( 'link', type="text/css" )
    return get_attributes( stylesheets, 'href' )

def get_images( soup ):
    images = soup.findAll( 'img' )
    return get_attributes( images, 'src' )

cgi_data = cgi.FieldStorage( keep_blank_values = True )
url = ""
if not cgi_data:
    url = "http://reddit.com"
else:
    url = cgi_data['site'].value

page = urllib2.urlopen( url )
soup = BeautifulSoup( page )

d = {}
d['javascripts'] = get_javascripts( soup )
d['stylesheets'] = get_stylesheets( soup )
d['images'] = get_images( soup )
d['site'] = url
send_json( d )
