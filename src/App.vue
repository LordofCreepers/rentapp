<template>
	<div id="popup">
		<h1>База данных автопроката</h1>
		<h2>Добро пожаловать</h2>
	</div>
	<TableTab 
		v-for="( data, table ) in schemas" 
		:key="table"
		:title="data.pretty_name" 
		:tip="data.tip"
		:filters="data.fields"
		@query="( name, method, fields ) => query_recieve( name, method, fields )"
	/>
	<div v-if="Object.keys( schemas ).length > 0" id="spacer"></div>
	<Query></Query>
	<Log ref="log"></Log>
</template>

<script>
import Log from './components/Log.vue';
import Query from './components/Query.vue';
import TableTab from './components/TableTab.vue';

function CopyObject( obj ) {
	let obj_copy = {}
	for ( const key in obj ) {
		const value = obj[ key ]
		if ( typeof value !== "object" )
			obj_copy[ key ] = value
		else
			obj_copy[ key ] = CopyObject( value )
	}

	return obj_copy
}

export default {
	name: 'App',
	components: {
		TableTab,
		Log,
		Query
	},
	data() {
		return {
			schemas: {}
		}
	},
	async created() {
		this.schemas = await window.database.fetch_schemas()
	},
	methods: {
		async query_recieve( name, method, fields ) {
			const fields_copy = CopyObject( fields )

			let tab_name = ""
			for ( const table_name in this.schemas ) {
				const table = this.schemas[ table_name ];

				if ( table.pretty_name == name ) {
					tab_name = table_name
					break
				}
			}

			let response = null

			switch ( method ) {
				case "GET": {
					response = await window.database.read_db( tab_name, fields_copy )
					break;
				}
				case "POST": {
					response = await window.database.insert_db( tab_name, fields_copy )
					break;
				}
				case "PATCH": {
					response = await window.database.update_db( tab_name, fields_copy.target, fields_copy.new )
					break;
				}
				case "DELETE": {
					response = await window.database.delete_db( tab_name, fields_copy )
					break;
				}
				default:
					break;
			}

			if ( response === null ) {
				throw "Unknown error during request"
			}

			switch ( response.status ) {
				case "ok": {
					if ( response.data.length == 0 ) {
						this.$refs.log.add( { messages: [ { text: "Подходящих записей нет" } ] } )
						break
					}

					let table_data = { 
						name: name, 
						columns: [], 
						rows: [],
						extensions: [
							{
								name: "Текстовый файл",
								name_short: "Текст",
								extensions: [ "txt" ]
							},
							{
								name: "JavaScript Object Notation",
								name_short: "JSON",
								extensions: [ "json" ]
							}
						]
					}

					const header_source = response.data[ 0 ]
					for ( const field_name in header_source ) {
						const field = this.schemas[ tab_name ].fields.filter( value => field_name === value.field_name )[ 0 ]

						table_data.columns.push( field.pretty_name )
					}

					for ( const result of response.data ) {
						let row = []
						for( const field_name in result )
							row.push( result[ field_name ] )
						
						table_data.rows.push( row )
					}

					this.$refs.log.add( { messages: [ 
						{ text: response.message, success: true }, 
						{ table: table_data }
					]})

					break;
				}
				case "err":
					this.$refs.log.add( { messages: [ { text: response.message, success: false } ] } )
					break;
				default:
					break;
			}

			this.$refs.log.$refs.unfolding.setOpen( true )
			setTimeout( () => {
				window.scrollTo({
					top: this.$refs.log.$el.getBoundingClientRect().bottom,
					left: 0,
					behavior: "smooth"
				})
			}, 0 );
		}
	}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding-top: 2%;
}

	#spacer {
		height: 15vh;
	}
</style>
