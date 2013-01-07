# -*- coding: utf-8 -*-

import csv, os, os.path, re, urllib2
from zipfile import ZipFile

import pg
import private


database = 'cz2013'
schema = 'cz'

fullGeom = 'full_geom'
googGeom = 'goog_geom'


def process():
	createDatabase( database)
	db = openDatabase( database )
	db.addUtilityFunctions()
	createSchema( db )
	loadNutsTable( db )
	loadDistrictShapes( db )
	updateDistricts( db )
	# TODO: saveShapefile() crashing, used Manifold to save manually instead
#	saveShapefile( db, 'district'  )
	closeDatabase( db )


def createDatabase( database ):
	print 'Creating database %s' % database
	db = pg.Database( database='postgres' )
	db.createGeoDatabase( database )
	db.connection.close()


def openDatabase( database ):
	print 'Opening database %s' % database
	return pg.Database( database=database )


def closeDatabase( db ):
	db.connection.commit()
	db.connection.close()


def createSchema( db ):
	print 'Creating schema %s' % schema
	db.createSchema( schema )
	db.connection.commit()


def loadNutsTable( db ):
	loadCsvTable( db,
		'../shapes/cz2013/Czech District NUTS.csv',
		'district_nuts',
		'''
			nuts,
			name
		''',
		'''
			nuts varchar(6),
			name varchar(50)
		''',
        'HEADER', 'utf8'
	)
	db.executeCommit( '''
		CREATE INDEX ON cz.district_nuts(nuts);
		CREATE INDEX ON cz.district_nuts(name);
	''')


def loadCsvTable( db, source, table, cols, columns, copyopt='HEADER', encoding='latin1' ):
	target = '%s/%s-utf8.txt' %( private.TEMP_PATH, table )
	utf8 = file(source).read().decode(encoding).encode('utf8')
	file( target, 'w' ).write( utf8 )
	db.executeCommit( '''
		CREATE TABLE %(table)s (
			gid serial,
			%(columns)s
		);
		
		ALTER TABLE %(table)s ADD PRIMARY KEY (gid);
		
		COPY %(table)s ( %(cols)s )
			FROM '%(target)s'
			WITH CSV %(copyopt)s;
	''' %({
		'table': schema + '.' + table,
		'cols': cols,
		'columns': columns,
		'target': target,
		'copyopt': copyopt,
	}) )
	os.remove( target )


def loadDistrictShapes( db ):
	table = schema + '.district'
	filename = '../shapes/cz2013/cz_admin1and2_v2.zip'
	print 'Loading %s' % filename
	db.loadShapefile(
		filename, private.TEMP_PATH, table,
		fullGeom, '4326', 'UTF-8', True,
		'cz_admin2_poly.shp'
	)
	db.addGoogleGeometry( table, fullGeom, googGeom )
	db.indexGeometryColumn( table, googGeom )
	db.executeCommit( '''
		CREATE INDEX ON cz.district(name);
	''')


def updateDistricts( db ):
	fromWhere = '''
		FROM cz.district_nuts
		WHERE (
			cz.district.name = cz.district_nuts.name
		)
	'''
	db.executeCommit( '''
		UPDATE cz.district
			SET name = 'Praha'
			WHERE name LIKE '%%Praha';
			
		ALTER TABLE cz.district
			DROP COLUMN fprint,
			DROP COLUMN prov,
			DROP COLUMN type,
			DROP COLUMN full_geom,
			ADD COLUMN district varchar(6),
			ADD COLUMN region varchar(5),
			ADD COLUMN nation varchar(2);
			
		UPDATE cz.district
		SET district = (
			SELECT nuts %(fromWhere)s
		)	
		WHERE EXISTS (
			SELECT NULL %(fromWhere)s
		);
		UPDATE cz.district
		SET region = left( district, 5 ), nation = left( district, 2 ); 
	''' % {
		'fromWhere': fromWhere,
	})


def saveShapefile( db, table ):
	shpfile = 'cz2013-%s-full' %( table )
	table = schema + '.' + table
	db.saveShapefile(
		shpfile, private.OUTPUT_SHAPEFILE_PATH,
		table, 'goog_geom', '3857'
	)


def main():
	process()
	print 'Done!'


if __name__ == "__main__":
	main()
