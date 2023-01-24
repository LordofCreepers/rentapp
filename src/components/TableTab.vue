<template>
	<div class="tt-table-tab">
		<button class="tt-button" @click="toggle()">
			<font-awesome-icon class="tt-tab-icon" icon="fa-solid fa-caret-down" />
			{{ title }}
		</button>
		<Transition name="unfold">
			<div v-if="open" class="tc-table-content">
				<h4 class="tc-tip">{{ tip }}</h4>
				<div class="tom-table-operation-mode">
					<lable class="tom-label">Операция над записью: </lable>
					<select class="tom-select">
						<option value="Извлечь">Извлечь</option>
						<option value="Создать">Создать</option>
						<option value="Обновить">Обновить</option>
						<option value="Удалить">Удалить</option>
					</select>
				</div>
				<TableFilter v-for="filter of filters" 
					:key="filter.id" 
					:filter_name="filter.id" 
					:type="filter.payload.type" 
					:filter_data="filter.payload.data" 
					@change="( filter, value ) => filter_changed( filter, value )"
				></TableFilter>
				<!-- <div class="tc-filters-controls">
					<button @click="filters_add()" class="tc-filters-control tc-filters-add">
						<font-awesome-icon icon="fa-solid fa-plus" />
					</button>
					<button @click="filters_clear()" class="tc-filters-control tc-filters-clear">
						<font-awesome-icon icon="fa-regular fa-trash-can" />
					</button>
				</div> -->
				<button @click="open_window()" class="tt-button tc-execute">Запустить</button>
			</div>
		</Transition>
	</div>
</template>

<script>
import TableFilter from './TableFilter.vue';


export default {
    name: "TableTab",
    props: {
        title: String,
        tip: String,
        content_types: Object
    },
    components: {
        TableFilter
	},
    data() {
        return {
            open: false,
			filters_data: {}
        };
    },
	computed: {
		filters() {
			let filters = []
			for ( const key in this.content_types ) {
				const element = this.content_types[ key ];
				filters.push( { id: key, payload: element } )
			}
			console.log( filters )
			return filters
		}
	},
    methods: {
        toggle() {
            this.open = !this.open;
        },
		filter_changed( filter, value ) {
			this,filters_data[ filter ] = value
		},
		open_window() {
			window.database.open_win()
		}
    }
}

</script>

<style>
	.tt-table-tab {
		margin: auto;
	}

	.tt-icon {
		color: white;
	}

	@keyframes icon-turn {
		0% {
			transform: rotate( 0deg );
		}
		100% {
			transform: rotate( 90deg );
		}
	}

	.tt-button {
		background: linear-gradient(160deg, #000 85%, rgba(44,62,80,1) 100%);
		width: 100%;
		margin: 0;
		margin-top: 2%;
		padding: 1%;
		background-size: 1000% 100%;
		color: white;
		text-align: left;
		padding-left: 5%;
		box-shadow: none;
		border-radius: 4px;
		border: none;
		transition-property: background;
		transition-duration: 250ms;
	}

	.tom-select {
		margin-left: 1%;
		padding-left: 35vw;
		width: 80%;
		height: 100%;
		background-color: black;
		color: white;
		border-radius: 4px;
	}

	.tc-table-content {
		border: 1px solid black;
		padding-left: 7.5%;
		text-align: left;
		border-radius: 8px;
		transform-origin: top;
	}

	.tt-button:hover {
		background-position-x: 100%;
	}

	.tom-table-operation-mode {
		margin-top: 0%;
		margin-bottom: 5%;
		height: 4vh;
	}

	.tc-tip {
		margin-bottom: 1%;
	}

	.tc-filters {
		background: linear-gradient( 270deg, white 30%, #333 100% );
		border-radius: 4px;
		padding: 2%;
	}

	.tc-filters-controls {
		display: flex;
		justify-content: center;
		margin-top: 0.5%;
		margin-bottom: 1%;
		height: 3vh;
	}

	.tc-filters-control {
		border-radius: 50%;
		margin-left: 1%;
		margin-right: 1%;
		width: 32px;
		height: 32px;
		color: white;
		border: none;
		aspect-ratio: 1 / 1;
	}

	.tc-filters-add {
		background-color: #3f3;
	}

	.tc-filters-clear {
		background-color: red;
	}

	.tc-filters-add:hover {
		background-color: #7f7;
	}

	.tc-filters-clear:hover {
		background-color: #f77;
	}

	.tc-filters-add:active {
		background-color: #3f3;
	}

	.tc-filters-clear:active {
		background-color: red;
	}

	.tc-execute {
		padding: 0.75%;
		margin: auto;
		margin-left: 47.125%;
		width: fit-content;
		text-align: center;
		background-size: 2000% 100%;
		margin-bottom: 1%;
	}

	@keyframes rot90 {
		0% {
			transform: rotateZ( 0deg );
		}
		100% {
			transform: rotateZ( 90deg );
		}
	}

	.tt-caret-down {
		animation: rot90 250ms ease-out normal forwards;
	}

	.tt-caret-right {
		animation: rot90 250ms ease-out reverse backwards;
	}

	.unfold-enter-from, .unfold-leave-to {
		transform: scaleY( 0 );
	}

	.unfold-enter-active, .unfold-leave-active {
		transition-property: transform;
		transition-duration: 100ms;
		transition-timing-function: ease-out;
	}

	.unfold-enter-to, .unfold-leave-from {
		transform: scaleY( 1 );
	}
</style>