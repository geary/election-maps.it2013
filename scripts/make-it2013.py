# -*- coding: utf-8 -*-

import pg, private

#import cProfile

database = 'it2013'
schema = 'it'
geom = 'geom'
boxGeom = geom
#continentLevel = '97'

regNameTable = schema + '.regname'
depNameTable = schema + '.depname'


#def loadContinents( db ):
#	continentTable = schema + '.continent' + continentLevel
#	srcfile = 'continents-%s' % continentLevel
#	filename = '../shapes/shp/%s/%s.shp' %( srcfile, srcfile )
#	print 'Loading %s' % filename
#	db.dropTable( continentTable )
#	db.loadShapefile(
#		filename, private.TEMP_PATH, continentTable,
#		geom, '3857', 'LATIN1', True
#	)


def loadNameTables( db ):
	db.dropTable( regNameTable )
	db.dropTable( depNameTable )
	
	loadNameTable( db,
		'../shapes/it2013/reg2011.csv',
		regNameTable,
		'cod_reg, nome_reg',
		'''
			cod_reg varchar(2),
			nome_reg varchar(70)
		'''
	)

	loadNameTable( db,
		'../shapes/it2013/dep2011.csv',
		depNameTable,
		'cod_dep, nome_dep',
		'''
			cod_dep varchar(2),
			nome_dep varchar(70)
		'''
	)


def loadNameTable( db, source, table, cols, columns ):
	return db.loadCsvTable( source, table, cols, columns, 'HEADER', 'latin1' )


def makeNation( db ):
	for level in (
		'70',
		'80',
		'90',
		'full',
	):
		provinceTable = schema + '.province' + level
		regionTable = schema + '.region' + level
		deputyTable = schema + '.deputy' + level
		nationTable = schema + '.nation' + level

		db.dropTable( provinceTable )
		db.dropTable( regionTable )
		db.dropTable( deputyTable )
		db.dropTable( nationTable )

		srcfile = 'prov2011-%s' % level
		filename = '../shapes/it2013/%s/%s.shp' %( srcfile, srcfile )
		print 'Loading %s' % filename
		db.loadShapefile(
			filename, private.TEMP_PATH, provinceTable,
			geom, '3857', 'LATIN1', True
		)

		db.executeCommit( '''
			ALTER TABLE %(provinceTable)s
			ALTER COLUMN cod_pro TYPE varchar(3),
			ALTER COLUMN cod_reg TYPE varchar(2),
			ALTER COLUMN cod_dep TYPE varchar(2);
		''' % {
			'provinceTable': provinceTable,
		})
		
		mergeGeometries( db,
			provinceTable, regionTable,
			'cod_reg',
			'''
				cod_reg varchar(5)
			''', '''
				WHERE
					%(provinceTable)s.cod_reg IS NOT NULL
				GROUP BY
					%(provinceTable)s.cod_reg
			''' % {
				'provinceTable': provinceTable,
		})

		mergeGeometries( db,
			provinceTable, deputyTable,
			'cod_dep',
			'''
				cod_dep varchar(5)
			''', '''
				WHERE
					%(provinceTable)s.cod_dep IS NOT NULL
				GROUP BY
					%(provinceTable)s.cod_dep
			''' % {
				'provinceTable': provinceTable,
			})

		mergeGeometries( db, provinceTable, nationTable,
			"'IT' AS cod_nat",
			'''
				cod_nat varchar(2)
			''', '''
				WHERE
					TRUE
				GROUP BY
					TRUE
			''' % {
				'provinceTable': provinceTable,
			})

		updateNames( db, regionTable, regNameTable, 'reg' )
		updateNames( db, deputyTable, depNameTable, 'dep' )
		
		writeNation( db, level, provinceTable, regionTable, deputyTable, nationTable )


def mergeGeometries( db, sourceTable, targetTable, cols, columns, whereGroupBy ):
	db.createMergedGeometryTable(
		sourceTable, geom, targetTable, geom,
		cols, columns, whereGroupBy
	)


def updateRegionNames( db, regionTable ):
	vars = {
	    'regionTable': regionTable,
	    'regNameTable': regNameTable,
	}
	vars['fromWhere'] = '''
		FROM %(regNameTable)s
		WHERE (
			%(regionTable)s.cod_reg = %(regNameTable)s.cod_reg
		)
	''' % vars
	db.executeCommit( '''
		ALTER TABLE %(regionTable)s ADD COLUMN nome_reg varchar(70);
		UPDATE %(regionTable)s
		SET nome_reg = (
			SELECT nome_reg %(fromWhere)s
		)	
		WHERE EXISTS (
			SELECT NULL %(fromWhere)s
		);
	''' % vars )


def updateNames( db, targetTable, nameTable, suffix ):
	vars = {
		'targetTable': targetTable,
		'nameTable': nameTable,
	    'suffix': suffix,
	}
	vars['fromWhere'] = '''
		FROM %(nameTable)s
		WHERE (
			%(targetTable)s.cod_%(suffix)s = %(nameTable)s.cod_%(suffix)s
		)
	''' % vars
	db.executeCommit( '''
		ALTER TABLE %(targetTable)s
		ADD COLUMN nome_%(suffix)s varchar(70);
		
		UPDATE %(targetTable)s
		SET nome_%(suffix)s = (
			SELECT nome_%(suffix)s %(fromWhere)s
		)	
		WHERE EXISTS (
			SELECT NULL %(fromWhere)s
		);
	''' % vars )


def writeNation( db, level, provinceTable, regionTable, deputyTable, nationTable ):
	where = 'true'
	geoid = 'IT'
	geoDistrict = db.makeFeatureCollection(
		provinceTable, boxGeom, geom, geoid, 'Italia',
		'cod_pro', 'nome_pro', "cod_reg || ',' || cod_dep AS regdep", where
	)
	geoRegion = db.makeFeatureCollection(
		regionTable, boxGeom, geom, geoid, 'Italia',
		'cod_reg', 'nome_reg', 'cod_reg', where
	)
	geoDeputy = db.makeFeatureCollection(
		deputyTable, boxGeom, geom, geoid, 'Italia',
		'cod_dep', 'nome_dep', 'cod_dep', where
	)
	geoNation = db.makeFeatureCollection(
		nationTable, boxGeom, geom, geoid, 'Italia',
		'cod_nat', 'cod_nat', 'cod_nat', where
	)
	#	geoContinent = db.makeFeatureCollection(
	#		schema + '.continent' + continentLevel,
	#		boxGeom, geom, geoid, 'World',
	#		'continent', 'continent', 'continent', where
	#	)
	geo = {
		'nation': geoNation,
		'region': geoRegion,
		'deputy': geoDeputy,
		'province': geoDistrict,
		# 'continent': geoContinent,
	}
	writeGeoJSON( db, geoid, level, geo )


def writeGeoJSON( db, geoid, level, geo ):
	filename = '%s/%s-%s-%s' %(
		private.GEOJSON_PATH, schema, geoid, level
	)
	db.writeGeoJSON( filename + '.js', geo, 'loadGeoJSON' )
	db.writeGeoJSON( filename + '.geojson', geo )


def main():
	db = pg.Database( database = database )
	loadNameTables( db )
#	loadContinents( db )
	makeNation( db )
	db.connection.commit()
	db.connection.close()


if __name__ == "__main__":
	main()
	#cProfile.run( 'main()' )
