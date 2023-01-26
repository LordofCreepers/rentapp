'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import fs from 'fs/promises'
import sqlite3 from 'sqlite3';
import path from 'path'
sqlite3.verbose()
const isDevelopment = process.env.NODE_ENV !== 'production'

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
	return `DROP TABLE ${ table_name.toLowerCase() }`
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

	db.run( "CREATE TABLE IF NOT EXISTS migrations (title TEXT PRIMARY KEY UNIQUE, up TEXT, down TEXT)" )

	try {
		await fs.stat( db_path_migrations )
	} catch( err ) {
		console.log( err.code )
		if ( err.code == undefined || err.code != "ENOENT" )
			throw err
		db.close()
		return Promise.resolve()
	}
	
	const dirs = await fs.readdir( db_path_migrations, { withFileTypes: true } )
	await ( async () => {
		let queries = []
		for ( const dir of dirs ) {
			queries.push( ( async () => {
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
		
				if ( migration.down != down )
					await db.run_async( "UPDATE migrations SET down = ? WHERE title = ?", down, table_name )
		
				if ( migration.up != up )
				{
					await db.run_async( down )
					await db.run_async( "UPDATE migrations SET up = ? WHERE = ?", up, table_name )
					await db.run_async( up )
				}
			})() )
		}
		return Promise.all( queries )
	})()

	db.close()
	return Promise.resolve()
}

async function DumpDatabase()
{
	const db = new sqlite3.Database( db_path_file )
	const tables = await dbAll( db, "SELECT * FROM sqlite_master WHERE type = 'table'" )
	var data = { sqlite_master: tables }
	for ( const table of tables ) {
		data[ table.name ] = []
		const table_rows = await dbAll( db, `SELECT * FROM ${ table.name }` )
		for ( const row of table_rows ) {
			data[ table.name ].push( row )
		}
	}
	db.close()
	return data
}

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

ipcMain.on( "init-db", InitializeDatabase )
ipcMain.handle( "read-db", DumpDatabase )

async function createMainWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
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

function createPrintWindow() {
	const win = new BrowserWindow({
		width: 640,
		height: 360,
		webPreferences: {
			nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
			contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
		}
	})

	createProtocol( 'app' )
	win.loadURL( 'app//./print.html' )
}

ipcMain.on( "open_win", createPrintWindow )

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
