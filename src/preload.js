import { contextBridge, ipcRenderer } from "electron";

const FileResult = {
	DIALOG_CANCELLED: 0,
	FILE_NOT_FOUND: 1
}

/* window.database = {
	init: () => ipcRenderer.send( "init-db", {} ),
	read_db: async () => {
		const result = await ipcRenderer.invoke( "read-db", {} )
		console.log( result )
		return result
	}
} */

contextBridge.exposeInMainWorld( "database", {
	fetch_schema: async () => await ipcRenderer.invoke( "fetch_schema", {} ),
	read_db: async ( table, fields ) => await ipcRenderer.invoke( "read_db", table, fields ),
	insert_db: async ( table, fields ) => await ipcRenderer.invoke( "insert_db", table, fields ),
	update_db: async ( table, target_fields, new_fields ) => await ipcRenderer.invoke( "update_db", table, target_fields, new_fields ),
	delete_db: async ( table, fields ) => await ipcRenderer.invoke( "delete_db", table, fields ),
	query_db: ( string ) => ipcRenderer.send( "query_db", string )
})

contextBridge.exposeInMainWorld( "file_api", {
	prompt_upload: async ( data ) => await ipcRenderer.invoke( "file_upload_dialog", data ),
	file_result: {
		DIALOG_CANCELLED: 0,
		FILE_NOT_FOUND: 1
	}
})