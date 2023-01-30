<template>
	<div id="popup">
		<h1>База данных автопроката</h1>
		<h2>Добро пожаловать</h2>
	</div>
	<TableTab 
		v-for="( data, table ) in schema" 
		:key="table"
		:title="data.pretty_name" tip="Шаблон" 
		:filters='data.fields'
		@query="( name, value ) => query_recieve( name, value )"
	/>
	<div v-if="Object.keys( schema ).length > 0" id="spacer"></div>
	<Query></Query>
	<Log ref="log"></Log>
</template>

<script>
import Log from './components/Log.vue';
import Query from './components/Query.vue';
import TableTab from './components/TableTab.vue';

export default {
	name: 'App',
	components: {
		TableTab,
		Log,
		Query
	},
	data() {
		return {
			schema: {}
		}
	},
	async created() {
		this.schema = await window.database.fetch_schema()
	},
	methods: {
		query_recieve( name, value ) {
			this.$refs.log.add( { text: name + ": " + JSON.stringify( value ) } )
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
