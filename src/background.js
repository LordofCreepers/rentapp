'use strict'

import { app, protocol, BrowserWindow, ipcMain, dialog } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import fs from 'fs/promises'
import sqlite3 from 'sqlite3';
import path from 'path'
const isDevelopment = process.env.NODE_ENV !== 'production'

if ( isDevelopment )
	sqlite3.verbose()

const db_path = path.join(
	isDevelopment ? __static : __dirname,
	isDevelopment ? "" : "../../",
	"../src/database"
)
const db_path_file = path.join( db_path, "/database.db" )
const db_path_migrations = path.join( db_path, "/scheme/" )

sqlite3.Database.prototype.run_async = async function( query, ...params ) {
	let db = this
	return new Promise( ( resolve, reject ) => {
		db.run( query, ...params, ( err ) => {
			if ( err ) {
				return reject( err )
			}
			return resolve()
		})
	})
}

sqlite3.Database.prototype.get_async = async function( query, ...params ) {
	let db = this
	return new Promise( ( resolve, reject ) => {
		db.get( query, ...params, ( err, row ) => {
			if ( err ) {
				return reject( err )
			}
			return resolve( row )
		})
	})
}

sqlite3.Database.prototype.all_async = async function( query, ...params ) {
	let db = this
	return new Promise( ( resolve, reject ) => {
		db.all( query, ...params, ( err, row ) => {
			if ( err ) {
				return reject( err )
			}
			return resolve( row )
		})
	})
}

sqlite3.Database.prototype.each_async = async function( callback, query, ...params ) {
	let db = this
	return new Promise( ( resolve, reject ) => {
		db.each( query, ...params, ( err, row ) => {
			if ( err ) {
				return reject( err )
			}
			callback( row )
		}, ( err, count ) => {
			if ( err ) {
				return reject( err )
			}
			return resolve( count )
		})
	})
}

function CompileUpMigrationString( table_name, config ) {
	let result = `CREATE TABLE ${ table_name.toLowerCase() } (`
	let foreigns = []
	for ( const field of config.fields ) {
		
		result += ` ${ field.name.toLowerCase() } ${ field.type.toUpperCase() }`

		if ( field.required != undefined && field.required === true )
			result += ` NOT NULL`

		if ( field.unique != undefined && field.unique === true )
			result += ` UNIQUE`

		if ( field.autoincrement != undefined && field.autoincrement === true )
			result += ` AUTOINCREMENT`

		if ( field.check != undefined )
			result += ` CHECK( ${ field.check } )`
		else if ( field.min != undefined || field.max ) {
			let check = ` CHECK(`

			if ( field.min != undefined )
				check += ` ${ field.name } >= ${ field.min }`

			if ( field.max != undefined )
				check += ` AND ${ field.name } <= ${ field.max }`
			
			check += " )"
			result += check
		}
			
		result += ","
		if ( field.reference != undefined )
			foreigns.push( field )
	}

	if ( config.primary_key.length > 0 )
		result += ` PRIMARY KEY( ${ config.primary_key.join( ", " ) } ),`

	for ( const foreign of foreigns ) {
result += ` FOREIGN KEY( ${ foreign.name.toLowerCase() } ) REFERENCES ${ foreign.reference.table.toLowerCase() }( ${ foreign.reference.column.toLowerCase() } ),`
	}

	result = result.trim()
	if ( result.slice( -1 ) == "," )
		result = result.slice( 0, -1 )
	
	result += " )"

	return result
}

function CompileDownMigrationString( table_name, config ) {
	return `DROP TABLE IF EXISTS ${ table_name.toLowerCase() }`
}

function SQLTypeToPromptType( field_data, prompt_data ) {
	if ( prompt_data.type != undefined )
		return prompt_data.type

	if ( field_data.reference != undefined )
		return "select"

	if ( field_data.type == "integer" || field_data.type == "float" )
		return "number"

	if ( field_data.type == "text" )
		return "string"

	return field_data.type
}

async function InitializeDatabase() 
{
	try {
		await fs.stat( db_path )
	} catch( err ) {
		if ( !isDevelopment || err.code == undefined || err.code != "ENOENT" )
			throw err
		await fs.mkdir( db_path )
	}

	try {
		await fs.stat( db_path_file )
	} catch( err ) {
		if ( !isDevelopment || err.code == undefined || err.code != "ENOENT" )
			throw err
		await fs.writeFile( db_path_file, "" )
	}

	const db = new sqlite3.Database( db_path_file )
	if ( db == undefined )
		return Promise.reject( "Couldn't open the database file" )

	if ( !isDevelopment )
		return Promise.resolve()

	/* db.on( "profile", ( query, time ) => {
		console.log( "Executed '" + query + "' in " + time + " .ms" )
	}) */

	await db.run_async( "CREATE TABLE IF NOT EXISTS migrations (title TEXT PRIMARY KEY UNIQUE, up TEXT NOT NULL, down TEXT)" )
	await db.run_async( "DROP TABLE IF EXISTS prompt_manifest" )
	await db.run_async( "CREATE TABLE IF NOT EXISTS prompt_manifest (			\
		table_name TEXT NOT NULL,												\
		field_name TEXT NOT NULL,												\
		pretty_name TEXT NOT NULL,												\
		field_type TEXT NOT NULL,												\
		required INTEGER NOT NULL,												\
		is_unique INTEGER NOT NULL,												\
		value_check TEXT,														\
		FOREIGN KEY( table_name ) REFERENCES migrations( title )				\
			ON DELETE CASCADE ON UPDATE CASCADE									\
		PRIMARY KEY( table_name, field_name )									\
	)" )
	await db.run_async( "DROP TABLE IF EXISTS prompt_manifest_number" )
	await db.run_async( "CREATE TABLE IF NOT EXISTS prompt_manifest_number (\
		table_name TEXT NOT NULL,											\
		field_name TEXT NOT NULL,											\
		min FLOAT,															\
		max FLOAT,															\
		FOREIGN KEY( table_name ) REFERENCES migrations( title )			\
			ON DELETE CASCADE ON UPDATE CASCADE								\
	)" )
	await db.run_async( "DROP TABLE IF EXISTS prompt_manifest_ref" )
	await db.run_async( "CREATE TABLE IF NOT EXISTS prompt_manifest_ref (	\
		table_name TEXT NOT NULL,											\
		field_name TEXT NOT NULL,											\
		reference_table_name TEXT NOT NULL,									\
		reference_column_name TEXT NOT NULL,								\
		FOREIGN KEY( reference_table_name ) REFERENCES migrations( title )	\
			ON DELETE CASCADE ON UPDATE CASCADE,							\
		FOREIGN KEY( table_name ) REFERENCES migrations( title )			\
			ON DELETE CASCADE ON UPDATE CASCADE								\
	)" )
	await db.run_async( "DROP TABLE IF EXISTS prompt_manifest_tables" )
	await db.run_async( "CREATE TABLE IF NOT EXISTS prompt_manifest_tables (\
		table_name TEXT NOT NULL PRIMARY KEY,								\
		pretty_name TEXT NOT NULL,											\
		FOREIGN KEY( table_name ) REFERENCES migrations( title )			\
			ON DELETE CASCADE ON UPDATE CASCADE								\
	)" )

	try {
		await fs.stat( db_path_migrations )
	} catch( err ) {
		if ( err.code == undefined || err.code != "ENOENT" )
			throw err
		db.close()
		return Promise.resolve()
	}
	
	const dirs = await fs.readdir( db_path_migrations, { withFileTypes: true } )

	for ( const dir of dirs ) {
		if ( !dir.isFile() ) return;
		if ( dir.name.slice( -5 ) != ".json" ) return;

		const json = JSON.parse( await fs.readFile( path.join( db_path_migrations, dir.name ), { encoding: "utf-8" } ) )
	
		const table_name = dir.name.slice( 0, -5 )

		const up = CompileUpMigrationString( table_name, json )
		const down = CompileDownMigrationString( table_name, json )
	
		const migration = await db.get_async( "SELECT * FROM migrations WHERE title = ?", table_name )
		if ( migration == undefined )
		{
			await db.run_async( "INSERT INTO migrations ( title, up, down ) VALUES ( ?, ?, ? )", table_name, up, down )
			await db.run_async( up )
			return
		}
		else {
			if ( migration.down != down )
				await db.run_async( "UPDATE migrations SET down = ? WHERE title = ?", down, table_name )
		
			if ( migration.up != up )
			{
				await db.run_async( down )
				await db.run_async( "UPDATE migrations SET up = ? WHERE title = ?", up, table_name )
				await db.run_async( up )
			}
		}

		await db.run_async( `INSERT INTO prompt_manifest_tables \
			( table_name, pretty_name ) 						\
			VALUES												\
			( '${ table_name }', '${ json.prompt.pretty_name }' )`
		)

		for ( const field of json.fields ) {
			db.run( `INSERT INTO prompt_manifest ( 
				table_name, 
				field_name, 
				pretty_name,
				field_type,
				required,
				is_unique
				${ field.check != undefined ? ", value_check" : "" }
			) VALUES (
				$table_name,
				$field_name,
				$pretty_name,
				$type,
				$required,
				$unique
				${ field.check != undefined ? ", $check" : "" }
			)`, {
				$table_name: table_name,
				$field_name: field.name,
				$pretty_name: json.prompt.fields[ field.name ].pretty_name,
				$type: SQLTypeToPromptType( field, json.prompt.fields[ field.name ] ),
				$required: field.required != undefined && field.required ? 1 : 0,
				$unique: field.unique != undefined && field.unique ? 1 : 0,
				$check: field.check
			})

			if ( field.min != undefined || field.max != undefined )
				db.run( `INSERT INTO prompt_manifest_number (
					table_name,
					field_name
					${ field.min != undefined ? ", min" : "" }
					${ field.max != undefined ? ", max" : "" }
				) VALUES (
					$table_name,
					$field_name
					${ field.min != undefined ? ", $min" : "" }
					${ field.max != undefined ? ", $max" : "" }
				)`, {
					$table_name: table_name,
					$field_name: field.name,
					$min: field.min,
					$max: field.max
				})
						
			if ( field.reference != undefined )
				db.run( `INSERT INTO prompt_manifest_ref (
					table_name,
					field_name,
					reference_table_name,
					reference_column_name
				) VALUES (
					$table_name,
					$field_name,
					$reference_table_name,
					$reference_table_column
				)`, {
					$table_name: table_name,
					$field_name: field.name,
					$reference_table_name: field.reference.table,
					$reference_table_column: field.reference.column
				})
		}
	}

	db.close()
	return Promise.resolve()
}

async function FetchDatabaseSchema() {
	const db = new sqlite3.Database( db_path_file )
	if ( !db )
		throw "Unable to open the database"
	
	let schema = {}

	const tables = await db.all_async( "SELECT * FROM prompt_manifest_tables" )

	for ( const table of tables ) {
		schema[ table.table_name ] = {}
		const table_schema = schema[ table.table_name ]
		table_schema.table_name = table.table_name
		table_schema.pretty_name = table.pretty_name

		const fields = await db.all_async( "SELECT * FROM prompt_manifest WHERE table_name = ?", table.table_name )

		// console.log( `Table's field data: ${ JSON.stringify( fields ) }` )

		if ( fields == undefined ) continue

		table_schema.fields = []

		for ( const field of fields ) {
			const field_number = await db.get_async( "SELECT 		\
				min, 												\
				max 												\
				FROM prompt_manifest_number							\
				WHERE table_name = ? AND field_name = ?", table.table_name, field.field_name 
			)

			const field_ref = await db.get_async( "SELECT 		\
				reference_table_name, 							\
				reference_column_name 							\
				FROM prompt_manifest_ref						\
				WHERE table_name = ? AND field_name = ?", table.table_name, field.field_name
			)

			let field_data = { ...field, ...field_number }

			if ( field_ref != undefined ) {
				const options_table = await db.all_async( `SELECT 
					${ field_ref.reference_column_name } FROM 
					${ field_ref.reference_table_name }`
				)

				field_data.options = []

				for ( const option of options_table )
					field_data.options.push( option.name )
			}

			table_schema.fields.push( field_data )
		}
	}

	db.close()
	return schema
}

async function ReadDatabase( channel, table, fields, database = null ) {
	const is_valid = database != null

	const db = ( database != null ) ? database : new sqlite3.Database( db_path_file )

	let query_string = `SELECT * FROM ${ table }`

	if ( fields != undefined && Object.keys( fields ).length > 0 ) {
		query_string += " WHERE"

		for ( const field_name in fields ) {
			const field_value = fields[ field_name ];

			query_string += ` ${ field_name } = '${ field_value }' AND`
		}

		query_string = query_string.slice( 0, -4 )
	}

	if ( isDevelopment )
		console.log( `Running query: ${ query_string }` )

	let rows
	try {
		rows = await db.all_async( query_string )
	} catch( err ) {
		return {
			status: "err",
			message: err
		}
	}
	
	if ( !is_valid )
		db.close()

	return {
		status: "ok",
		message: `Успешно извлечено ${ rows.length } записей`,
		data: rows
	}
}

async function InsertIntoDatabase( channel, table, fields ) {
	const db = new sqlite3.Database( db_path_file )

	let query_string = `INSERT INTO ${ table } (`
	let data_string = `) VALUES (`

	if ( fields != undefined && Object.keys( fields ).length > 0 ) {
		for ( const field_name in fields ) {
			const field_value = fields[ field_name ];

			query_string += field_name + ", "
			data_string += `'${ field_value }', `
		}

		query_string = query_string.slice( 0, -2 )
		data_string = data_string.slice( 0, -2 )
	}

	query_string += data_string + ")"

	if ( isDevelopment )
		console.log( `Running query: ${ query_string }` )

	try {
		await db.run_async( query_string )
	} catch( err ) {
		return {
			status: "err",
			message: err
		}
	}

	const rows = ( await ReadDatabase( channel, table, fields, db ) ).data

	db.close()
	return {
		status: "ok",
		message: `Успешно создано ${ rows.length } записей`,
		data: rows
	}
}

async function UpdateDatabase( channel, table, target_fields, new_fields ) {
	const db = new sqlite3.Database( db_path_file )

	let query_string = `UPDATE ${ table } SET `
	let new_data_string = ``
	let target_string = ``

	if ( new_fields != undefined && Object.keys( new_fields ).length > 0 ) {
		for ( const field_name in new_fields ) {
			const field_value = new_fields[ field_name ];

			new_data_string += `${ field_name } = '${ field_value }', `
		}

		new_data_string = new_data_string.slice( 0, -2 )
	}

	if ( target_fields != undefined && Object.keys( target_fields ).length > 0 ) {
		target_string = " WHERE "

		for ( const field_name in target_fields ) {
			const field_value = target_fields[ field_name ];

			target_string += `${ field_name } = '${ field_value }' AND `
		}

		target_string = target_string.slice( 0, -5 )
	}

	query_string += new_data_string + target_string

	if ( isDevelopment )
		console.log( `Running query: ${ query_string }` )

	try {
		await db.run_async( query_string )
	} catch( err ) {
		return {
			status: "err",
			message: err
		}
	}

	const rows = ( await ReadDatabase( channel, table, target_fields, db ) ).data

	db.close()
	return {
		status: "ok",
		message: `Успешно обновлено ${ rows.length } записей`,
		data: rows
	}
}

async function DeleteFromDatabase( channel, table, fields ) {
	const db = new sqlite3.Database( db_path_file )

	let query_string = `DELETE FROM ${ table }`

	if ( fields != undefined && Object.keys( fields ).length > 0 ) {
		query_string += " WHERE"

		for ( const field_name in fields ) {
			const field_value = fields[ field_name ];

			query_string += ` ${ field_name } = '${ field_value }' AND`
		}

		query_string = query_string.slice( 0, -4 )
	}

	if ( isDevelopment )
		console.log( `Running query: ${ query_string }` )

	const rows = ( await ReadDatabase( channel, table, fields, db ) ).data

	try {
		await db.run_async( query_string )
	} catch( err ) {
		return {
			status: "err",
			message: err
		}
	}

	db.close()
	return {
		status: "ok",
		message: `Успешно удалено ${ rows.length } записей`,
		data: rows
	}
}

async function QueryDatabase( channel, string ) {
	const db = new sqlite3.Database( db_path_file )

	await db.run_async( string )

	db.close()
}

async function FileUploadDialog( channel, data ) {
	const result = await dialog.showOpenDialog( { filters: data } )
	if ( result.canceled ) return

	const path = result.filePaths[ 0 ]

	try {
		await fs.stat( path )
	} catch( err ) {
		return {
			status: {
				ok: false,
				code: window.file_result.FILE_NOT_FOUND
			}
		}
	}

	return {
		status: {
			ok: true
		},
		file: await fs.readFile( path ),
		path: path
	}
}

ipcMain.handle( "fetch_schema", FetchDatabaseSchema )
ipcMain.handle( "read_db", ReadDatabase )
ipcMain.handle( "insert_db", InsertIntoDatabase )
ipcMain.handle( "update_db", UpdateDatabase )
ipcMain.handle( "delete_db", DeleteFromDatabase )
ipcMain.on( "query_db", QueryDatabase )
ipcMain.handle( "file_upload_dialog", FileUploadDialog )

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createMainWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
	  preload: path.join( __dirname, "preload.js" )
    }
  })

  InitializeDatabase()

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createMainWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
