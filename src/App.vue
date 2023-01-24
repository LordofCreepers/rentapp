<template>
	<div id="popup">
		<h1>База данных автопроката</h1>
		<h2>Добро пожаловать</h2>
	</div>
	<TableTab 
		v-for="n in 4" 
		:key="n"
		:title="'Какая-то таблица ' + n" tip="Таблица, над записями которой могут совершаться действия" 
		:content_types='{ 
			"Список": { 
				type: "select", 
				data: { options: [ "А", "Б", "В" ] }
			}, 
			"Число": { 
				type: "number" 
			},
			"Дата": {
				type: "date"
			},
			"Правда/ложь": {
				type: "bool"
			},
			"Текст": {
				type: "string"
			} }' />
</template>

<script>
import TableTab from './components/TableTab.vue';

export default {
  name: 'App',
  components: {
	TableTab
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
</style>
