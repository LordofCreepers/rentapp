import { contextBridge, ipcRenderer } from "electron";

/* window.database = {
	init: () => ipcRenderer.send( "init-db", {} ),
	read_db: async () => {
		const result = await ipcRenderer.invoke( "read-db", {} )
		console.log( result )
		return result
	}
} */

contextBridge.exposeInMainWorld( "database", {
	// init: () => ipcRenderer.send( "init-db", {} ),
	// read_db: async () => await ipcRenderer.invoke( "read-db", {} ),
	open_win: () => ipcRenderer.send( "open_win", {} )
})