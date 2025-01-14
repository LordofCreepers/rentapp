<template>
	<div class="tt-table-tab">
		<UnfoldingContainer :title="title">
			<div class="tc-table-content">
				<h4 class="tc-tip">{{ tip }}</h4>
				<div class="tom-table-operation-method">
					<h6 class="tom-label">Операция над записью: </h6>
					<select class="tom-select" @change="e => switch_method( e.target.value )">
						<option value="GET" selected>Извлечь</option>
						<option value="POST">Создать</option>
						<option value="PATCH">Обновить</option>
						<option value="DELETE">Удалить</option>
					</select>
				</div>
				<div class="tt-target-values">
					<h5 v-if="method === 'PATCH'">Поля записи для обновления</h5>
					<TableFilter v-for="filter of filters" 
						:key="filter.field_name"
						:ref="filter.field_name"
						:filter_title="filter.pretty_name"
						:filter_name="filter.field_name"
						:type="filter.field_type"
						:filter_data="filter"
						:force_enable="filter.required == 1 && method === 'POST'"
						:is_select="method !== 'POST'"
					></TableFilter>
				</div>
				<div class="tt-new-values" v-if="method === 'PATCH'">
					<h5>Обновлённые значения</h5>
					<TableFilter v-for="filter of filters" 
						:key="filter.field_name + '_new'"
						:ref="filter.field_name + '_new'"
						:filter_title="filter.pretty_name"
						:filter_name="filter.field_name"
						:type="filter.field_type"
						:filter_data="filter"
						:is_select="false"
					></TableFilter>
				</div>
				<button @click="query_execute()" class="tt-button tc-execute">Выполнить</button>
			</div>
		</UnfoldingContainer>
	</div>
</template>

<script>
/* eslint-disable */

import TableFilter from './TableFilter.vue';
import UnfoldingContainer from './UnfoldingContainer.vue';


export default {
    name: "TableTab",
    props: {
        title: {
			type: String,
			required: true
		},
        tip: String,
        filters: {
			type: Array,
			required: true
		}
    },
    components: {
        TableFilter,
		UnfoldingContainer
	},
    data() {
        return {
            open: false,
			method: "GET"
        };
    },
	created() {
		/* for ( const filter of this.filters ) {
			console.log( filter )
		} */
	},
    methods: {
        toggle() {
            this.open = !this.open;
        },
		switch_method( new_method ) {
			this.method = new_method
		},
		query_execute() {
			let final_data = {}
			if ( this.method === 'PATCH' )
			{
				final_data[ "new" ] = {}
				final_data[ "target" ] = {}

				for ( const filter of this.filters )
				{
					let new_el = this.$refs[ filter.field_name + '_new' ][ 0 ];
					let target_el = this.$refs[ filter.field_name ][ 0 ];
					if (target_el.enabled())
						final_data[ "target" ][ filter.field_name ] = target_el.getValue();
					if (new_el.enabled())
						final_data[ "new" ][ filter.field_name ] = new_el.getValue();
				}
			}
			else
			{
				for ( const filter of this.filters )
				{
					let el = this.$refs[ filter.field_name ][ 0 ];
					if (el.enabled())
						final_data[ filter.field_name ] = el.getValue();
				}
			}

			console.log(final_data)

			this.$emit( "query", this.title, this.method, final_data );
		}
    },
	emits: [ "query" ]
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
		border-radius: 8px;
	}

	.tc-table-content {
		border: 1px solid black;
		padding-left: 7.5%;
		padding-right: 7.5%;
		text-align: left;
		border-radius: 8px;
		transform-origin: top;
	}

	.tt-button:hover {
		background-position-x: 100%;
	}

	.tt-new-values {
		border: 1px solid black;
		border-radius: 4px;
		padding: 2%;
		margin-bottom: 1%;
	}

	.tom-table-operation-method {
		display: flex;
		align-items: center;
		margin-top: 0%;
		margin-bottom: 5%;
		height: 50%;
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
</style>