# -*- coding: utf-8 -*-

import pg, private

#import cProfile

database = 'cz2013'
schema = 'cz'
geom = 'goog_geom'
boxGeom = geom


def makeRegions():
	db = pg.Database( database = database )
	for level in (
		'full',
		'75',
		'85',
		'90',
	):
		districtTable = schema + '.district' + level
		regionTable = schema + '.region' + level
		nationTable = schema + '.nation' + level
		
		db.dropTable( districtTable )
		db.dropTable( regionTable )
		db.dropTable( nationTable )
		
		srcfile = 'cz2013-district-%s' % level
		filename = '../shapes/cz2013/%s/%s.shp' %( srcfile, srcfile )
		print 'Loading %s' % filename
		db.loadShapefile(
			filename, private.TEMP_PATH, districtTable,
			geom, '3857', 'LATIN1', True
		)
		mergeGeometries( db, districtTable, regionTable,
			'region',
			'''
				region varchar(5)
			''', '''
				WHERE
					%(districtTable)s.region IS NOT NULL
				GROUP BY
					%(districtTable)s.region
			''' % {
				'districtTable': districtTable,
		})
		mergeGeometries( db, districtTable, nationTable,
			'nation',
			'''
				nation varchar(2)
			''', '''
				WHERE
					%(districtTable)s.nation IS NOT NULL
				GROUP BY
					%(districtTable)s.nation
			''' % {
			'districtTable': districtTable,
			})
		writeAllDistricts( db, level )
	db.connection.commit()
	db.connection.close()


def mergeGeometries( db, sourceTable, targetTable, cols, columns, whereGroupBy ):
	db.createMergedGeometryTable(
		sourceTable, geom, targetTable, geom,
		cols, columns, whereGroupBy
	)


def writeAllDistricts( db, level ):
	where = 'true'
	geoid = 'CZ'
	geoDistrict = db.makeFeatureCollection(
		schema + '.district' + level,
		boxGeom, geom, geoid, 'Czech Republic',
		'district', 'name', 'district', where
	)
	geoRegion = db.makeFeatureCollection(
		schema + '.region' + level,
		boxGeom, geom, geoid, 'Czech Republic',
		'region', 'region', 'region', where
	)
	geoNation = db.makeFeatureCollection(
		schema + '.nation' + level,
		boxGeom, geom, geoid, 'Czech Republic',
		'nation', 'nation', 'nation', where
	)
	geo = {
		'nation': geoNation,
		'region': geoRegion,
		'district': geoDistrict,
	}
	writeGeoJSON( db, geoid, level, geo )


def writeGeoJSON( db, geoid, level, geo ):
	filename = '%s/%s-%s-%s' %(
		private.GEOJSON_PATH, schema, geoid, level
	)
	db.writeGeoJSON( filename + '.js', geo, 'loadGeoJSON' )
	db.writeGeoJSON( filename + '.geojson', geo )


def main():
	makeRegions()


if __name__ == "__main__":
	main()
	#cProfile.run( 'main()' )
