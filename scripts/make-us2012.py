# -*- coding: utf-8 -*-

import re
import pg, private

#import cProfile

schema = 'carto2010'
googGeom = 'goog_geom'
boxGeom = googGeom


#def makeState():
#	db = pg.Database( database = 'usageo_20m' )
#	kind = 'state'
#	combineRegionTables( db, kind )
#	table = '%s.%s00' %( schema, kind )
#	simplegeom = 'goog_geom00'
#	db.addGeometryColumn( table, simplegeom, 3857, True )
#	#addStateLevel( db, kind, table, simplegeom, '99', '16384' )
#	#addStateLevel( db, kind, table, simplegeom, '02', '65536' )
#	#addStateLevel( db, kind, table, simplegeom, '15', '8192' )
#	addStateLevel( db, kind, table, simplegeom, '99', '4096' )
#	addStateLevel( db, kind, table, simplegeom, '02', '32768' )
#	addStateLevel( db, kind, table, simplegeom, '15', '4096' )
#	writeStatesOnly( db )
#	db.connection.commit()
#	db.connection.close()


## TODO: refactor
#def makeCounty():
#	db = pg.Database( database = 'usageo_20m' )
#	kind = 'county'
#	combineRegionTables( db, kind )
#	table = '%s.%s00' %( schema, kind )
#	simplegeom = 'goog_geom00'
#	db.addGeometryColumn( table, simplegeom, 3857, True )
#	addStateLevel( db, kind, table, simplegeom, '99', '4096' )
#	addStateLevel( db, kind, table, simplegeom, '02', '32768' )
#	addStateLevel( db, kind, table, simplegeom, '15', '4096' )
#	writeCountiesOnly( db )
#	db.connection.commit()
#	db.connection.close()


def makeStatesNational():
	db = pg.Database( database = 'usageo_500k' )
	table = 'state'
	level = '4096'
	if level is not None:
		addLevel( db, table, level )
	mergeStates( db, table, level )
	#writeEachState( db, table, level )
	writeAllStates( db, table, level )
	db.connection.commit()
	db.connection.close()


def makeStateCounties():
	db = pg.Database( database = 'usageo_500k' )
	for level in ( '512', ):
		table = 'county_' + level
		fulltable = schema + '.' + table
		shpname = 'us2012-county-500k-%s' % level
		shpfile = '%(path)s/us2012/%(shpname)s/%(shpname)s.shp' %({
			'path': private.OUTPUT_SHAPEFILE_PATH,
			'shpname': shpname,
		})
		db.dropTable( fulltable )
		db.loadShapefile(
			shpfile, private.TEMP_PATH, fulltable,
			googGeom, '3857', 'LATIN1', True
		)
		#mergeStates( db, table, level )
		#writeEachState( db, table, level )
		writeEachStateCounties( db, fulltable, level )
		#db.connection.commit()
		#db.connection.close()
	#level = '512'
	#if level is not None:
	#	addLevel( db, table, level )
	#mergeCounties( db, level )
	#writeEachState( db, table, level )
	#writeAllStates( db, table, level )
	db.connection.commit()
	db.connection.close()


# TODO: refactor
def makeHouseNational():
	db = pg.Database( database = 'usageo_500k' )
	#level = '4096'
	#for level in '512', '4096':
	for level in ( '2048', ):
		table = 'house2012_' + level
		fulltable = schema + '.' + table
		shpname = 'us2012-house2012-%s' % level
		shpfile = '%(path)s/shp/us2012/%(shpname)s/%(shpname)s.shp' %({
			'path': private.OUTPUT_SHAPEFILE_PATH,
			'shpname': shpname,
		})
		db.dropTable( fulltable )
		db.loadShapefile(
			shpfile, private.TEMP_PATH, fulltable,
			googGeom, '3857', 'LATIN1', True #, None, tweakHouseSQL
		)
		#mergeStates( db, table, level )
		#writeEachState( db, table, level )
		writeAllStatesHouse( db, fulltable, level )
		#db.connection.commit()
		#db.connection.close()


def tweakHouseSQL( sqlfile ):
	sql = file( sqlfile ).read()
	sql = re.sub(
		'"descriptio" varchar\(80\)',
		'"descriptio" varchar(254)',
		sql, 1
	)
	sql = re.sub(
		'"dist_id" varchar\(80\)',
		'"dist_id" varchar(254)',
		sql, 1
	)
	#sql = re.sub(
	#	'"goog_geom" varchar\(254\)',
	#	'"not_geom" varchar(254)',
	#	sql, 1
	#)
	#sql = re.sub(
	#	'"goog_geom",goog_geom',
	#	'"not_geom",goog_geom',
	#	sql
	#)
	newfile = re.sub( '\.sql$', '-tweak.sql', sqlfile )
	file( newfile, 'w' ).write( sql )
	return newfile


def makeGopDetail():
	db = pg.Database( database = 'usageo_500k' )
	table = 'gop2012loc'
	level = '512'
	if level is not None:
		addLevel( db, table, level )
	mergeStates( db, table, level )
	writeEachState( db, table, level )
	writeAllStates( db, table, level )
	db.connection.commit()
	db.connection.close()


def addStateLevel( db, kind, table, simplegeom, fips, level ):
	shpname = 'us2012-%(kind)s%(fips)s-20m-%(level)s' %({
		'kind': kind,
		'fips': fips,
		'level': level,
	})
	shpfile = '%(path)s/%(shpname)s/%(shpname)s.shp' %({
		'path': private.OUTPUT_SHAPEFILE_PATH,
		'shpname': shpname,
	})
	temptable = '%s_%s'  %( table, level )
	db.dropTable( temptable )
	db.loadShapefile(
		shpfile, private.TEMP_PATH, temptable,
		simplegeom, '3857', 'LATIN1', True
	)
	db.execute( '''
		UPDATE
			%(table)s
		SET
			%(simplegeom)s =
				ST_MakeValid(
					%(temptable)s.%(simplegeom)s
				)
		FROM %(temptable)s
		WHERE %(table)s.geo_id = %(temptable)s.geo_id
		;
	''' %({
		'table': table,
		'temptable': temptable,
		'simplegeom': simplegeom,
	}) )
	db.connection.commit()
	db.dropTable( temptable )


def addLevel( db, table, level ):
	shpfile = '%(path)s/us2012-%(table)s-500k-%(level)s/us2012-%(table)s-500k-%(level)s.shp' %({
		'path': private.OUTPUT_SHAPEFILE_PATH,
		'table': table,
		'level': level,
	})
	fulltable = '%s.%s' %( schema, table )
	temptable = '%s_%s'  %( fulltable, level )
	simplegeom = 'goog_geom%s' %( level )
	db.dropTable( temptable )
	db.loadShapefile(
		shpfile, private.TEMP_PATH, temptable,
		simplegeom, '3857', 'LATIN1', True
	)
	db.addGeometryColumn( fulltable, simplegeom, 3857, True )
	db.execute( '''
		UPDATE
			%(fulltable)s
		SET
			%(simplegeom)s =
				ST_MakeValid(
					%(temptable)s.%(simplegeom)s
				)
		FROM %(temptable)s
		WHERE %(fulltable)s.geo_id = %(temptable)s.geo_id
		;
	''' %({
		'fulltable': fulltable,
		'temptable': temptable,
		'simplegeom': simplegeom,
	}) )
	#db.dropTable( temptable )
	pass


def mergeStates( db, table, level ):
	geom = simpleGeom( level )
	db.mergeGeometry(
		schema+'.'+table, 'state', geom,
		schema+'.state', 'state', geom
	)


def mergeCounties( db, level ):
	geom = simpleGeom( level )
	db.mergeGeometry(
		schema+'.'+table, 'state', geom,
		schema+'.state', 'state', geom
	)


#def writeEachState( db, table, level ):
#	db.execute( 'SELECT geo_id, name FROM %s.state ORDER BY geo_id;' %( schema ) )
#	for geo_id, name in db.cursor.fetchall():
#		fips = geo_id.split('US')[1]
#		writeState( db, table, level, fips, name )


def writeEachStateCounties( db, table, level ):
	db.execute( 'SELECT geo_id, name FROM %s.state ORDER BY geo_id;' %( schema ) )
	for geo_id, name in db.cursor.fetchall():
		fips = geo_id.split('US')[1]
		writeStateCounties( db, table, level, fips, name )


#def writeState( db, table, level, fips, name ):
#	geom = simpleGeom( level )
#	where = "( state = '%s' )" %( fips )
#	
#	geoState = makeFeatureCollection( db, schema+'.state', boxGeom, geom, '00', 'United States', where )
#	geoCounty = makeFeatureCollection( db, schema+'.'+table, boxGeom, geom, fips, name, where )
#	#geoTown = makeFeatureCollection( db, schema+'.cousub', boxGeom, geom, fips, name, where )
#	
#	geo = {
#		'state': geoState,
#		'county': geoCounty,
#		#'town': geoTown,
#	}
#	
#	writeGeoJSON( db, fips, geom, geo )


def writeStateCounties( db, fulltable, level, fips, name ):
	geom = googGeom  # simpleGeom( level )
	where = "( state = '%s' )" %( fips )
	
	#geoState = makeFeatureCollection( db, schema+'.state', boxGeom, geom, '00', 'United States', where )
	geoCounty = makeFeatureCollection( db, fulltable, boxGeom, geom, fips, name, 'geo_id', 'name', 'lsad', where )
	#geoTown = makeFeatureCollection( db, schema+'.cousub', boxGeom, geom, fips, name, where )
	
	geo = {
		#'state': geoState,
		'county': geoCounty,
		#'town': geoTown,
	}
	
	writeGeoJSON( db, fips, geom, level, geo )


def writeAllStates( db, table, level ):
	geom = simpleGeom( level )
	where = 'true'
	fips = '00'
	geoState = makeFeatureCollection( db,
		schema + '.state',
		boxGeom, geom,
		fips, 'United States', where
	)
	geo = {
		'state': geoState,
	}
	writeGeoJSON( db, fips, geom, geo )
	
	geoGOP = makeFeatureCollection( db,
		schema + '.' + table,
		boxGeom, geom,
		fips, 'United States', where
	)
	geo = {
		'state': geoState,
		'county': geoGOP,
	}
	writeGeoJSON( db, fips+'-county', geom, geo )


#def writeStatesOnly( db ):
#	geom = simpleGeom( '00' )
#	where = 'true'
#	fips = '00'
#	geoState = makeFeatureCollection( db,
#		schema + '.state00',
#		boxGeom, geom,
#		fips, 'United States', where
#	)
#	geo = {
#		'state': geoState,
#	}
#	writeGeoJSON( db, fips, geom, geo )


#def writeCountiesOnly( db ):
#	geom = simpleGeom( '00' )
#	where = 'true'
#	fips = '00'
#	geoCounty = makeFeatureCollection( db,
#		schema + '.county00',
#		boxGeom, geom,
#		fips, 'United States', where
#	)
#	geo = {
#		'county': geoCounty,
#	}
#	writeGeoJSON( db, fips + '-county', geom, geo )


def writeAllStatesHouse( db, fulltable, level ):
	where = 'true'
	name = 'United States House of Representatives'
	fips = '00-house'
	#geoState = db.makeFeatureCollection(
	#	schema + '.state',
	#	boxGeom, fullGeom,
	#	fips, name, where
	#)
	#geo = {
	#	'state': geoState,
	#}
	#writeGeoJSON( db, fips, geom, geo )
	
	geoHouse = db.makeFeatureCollection(
		fulltable,
		boxGeom, googGeom,
		fips, name, 'dist_id', 'dist_id', 'dist_id', where
	)
	geo = {
		#'state': geoState,
		'house': geoHouse,
	}
	writeGeoJSON( db, fips, googGeom, level, geo )


def makeFeatureCollection( db,
	table, boxGeom, polyGeom,
	geoid, name, idCol, nameCol, extraCol, where
):
	return db.makeFeatureCollection(
		table, boxGeom, polyGeom,
		geoid, name, idCol, nameCol, extraCol, where
	)


def writeGeoJSON( db, fips, geom, level, geo ):
	filename = '%s/%s-%s-%s%s.js' %(
		private.GEOJSON_PATH, schema, fips, geom, level
	)
	db.writeGeoJSON( filename, geo, 'loadGeoJSON' )


def simpleGeom( level ):
	if level is None:
		return googGeom
	else:
		return '%s%s' %( googGeom, level )


def main():
	#makeState()
	makeStateCounties()
	#makeGopNational()
	#makeGopDetail()
	makeHouseNational()
	#makeHouseByState()


if __name__ == "__main__":
	main()
	#cProfile.run( 'main()' )
