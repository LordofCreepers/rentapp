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
const db_path_file = path.join( db_path, "/database.sqlite" )
const db_path_migrations = path.join( db_path, "/migrations/" )
async function InitializeDatabase() 
{
	try {
		await fs.stat( db_path )
	} catch( err ) {
		if ( err.code == undefined || err.code != "ENOENT" )
			throw err
		await fs.mkdir( db_path )
	}

	try {
		await fs.stat( db_path_file )
	} catch( err ) {
		if ( err.code == undefined || err.code != "ENOENT" )
			throw err
		await fs.writeFile( db_path_file, "" )
	}

	const db = new sqlite3.Database( db_path_file )
	if ( db == undefined )
		return Promise.reject( "Couldn't open the database file" )

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
	dirs.forEach( async dir => {
		if ( !dir.isDirectory() ) return;
	
		db.get( "SELECT title FROM migrations WHERE title = ?", dir.name, async ( err, row ) => {
			if ( err ) return
			if ( row != undefined )
				if ( row.up != "" && row.down != "" ) return;
				
			var migration_config = {
				title: dir.name,
				up: "",
				down: ""
			}
			const db_path_cur_migration = path.join( db_path_migrations, dir.name )
			const files = await fs.readdir( db_path_cur_migration, { withFileTypes: true } )
			files.forEach( async file => {
				if ( !file.isFile() ) return;
				switch ( file.name.toLowerCase() ) {
					case "up.sqlite":
						if ( row != undefined || row.up != "" ) break
						migration_config.up = await fs.readFile( path.join( db_path_cur_migration, file.name ), { encoding: "utf-8" } )
						break;
					case "down.sqlite":
						if ( row != undefined || row.down != "" ) break
						migration_config.down = await fs.readFile( path.join( db_path_cur_migration, file.name ), { encoding: "utf-8" } )
						break;
					default:
						break;
				}
			})

			db.run( "INSERT INTO migrations (title, up, down) VALUES (:title, :up, :down)", migration_config )
			if ( migration_config.up == "" ) return;
			db.run( migration_config.up )
	
		})
	});

	db.close()
	return Promise.resolve()
}

async function dbAll( database, query )
{
	return new Promise( ( resolve, reject ) => {
		database.all( query, ( err, rows ) => {
			if ( err )
			{
				reject( err )
				return
			}
			resolve( rows )
		})
	})
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

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
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
