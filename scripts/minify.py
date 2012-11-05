# -*- coding: utf-8 -*-

print 'Loading minifier'

from slimit import minify

from minify_conf import jsCopyright, jsFiles, jsMinFile

jsDir = '../gadget/static/js/'

print 'Loading files'

def readJS( name ):
	print name
	return file( jsDir + name, 'rb' ).read()

jsText = '\n'.join( map( readJS, jsFiles ) )

print 'Minifying'

jsMinText = minify( jsText, True, True )

print 'Writing ' + jsMinFile

file( jsDir + jsMinFile, 'wb' ).write( jsCopyright + jsMinText )

print 'Done!'
