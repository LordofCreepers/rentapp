import { contextBridge, ipcRenderer } from "electron";

const FileResult = {
	DIALOG_CANCELLED: 0,
	FILE_NOT_FOUND: 1
}

contextBridge.exposeInMainWorld( "database", {
	fetch_schemas: async () => await ipcRenderer.invoke( "fetch_schemas", {} ),
	read_db: async ( table, fields ) => await ipcRenderer.invoke( "read_db", table, fields ),
	insert_db: async ( table, fields ) => await ipcRenderer.invoke( "insert_db", table, fields ),
	update_db: async ( table, target_fields, new_fields ) => await ipcRenderer.invoke( "update_db", table, target_fields, new_fields ),
	delete_db: async ( table, fields ) => await ipcRenderer.invoke( "delete_db", table, fields ),
	query_db: ( string ) => ipcRenderer.send( "query_db", string )
})

contextBridge.exposeInMainWorld( "file_api", {
	prompt_upload: async ( data ) => await ipcRenderer.invoke( "file_upload_dialog", data ),
	prompt_download: async ( data, blob ) => await ipcRenderer.invoke( "file_download_dialog", data, blob ),
	prompt_save_result: ( table ) => 
		ipcRenderer.send( "file_save_result", table.format, table.name, table.columns, table.rows )
})