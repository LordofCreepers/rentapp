<template>
    <UnfoldingContainer title="Пользовательский запрос">
        <div class="query-container">
            <h4 class="query-tip">Позволяет выполнять случайные запросы к базе данных используя SQL</h4>
            <h5 class="query-tip warning">
                Внимание: последствия прямого изменения таблицы могут нарушить целостность базы данных. Используйте с крайней осторожностью
            </h5>
            <TableFilter
                key="query"
                filter_name="Запрос"
                type="string"
                :filter_data="{}"
				@change="value => this.string = value"
            >
            </TableFilter>
			<button class="tt-button tc-execute">Запустить</button>
        </div>
    </UnfoldingContainer>
</template>

<script>
import UnfoldingContainer from './UnfoldingContainer.vue';
import TableFilter from './TableFilter.vue';

export default {
    name: "Query",
    components: {
        UnfoldingContainer,
		TableFilter
    },
	data() {
		return {
			string: ""
		}
	},
	methods: {
		query_execute() {
			this.$emit( "query", "Запрос", this.string )
		}
	},
	emits: [ "query" ]
}

</script>

<style>
    .query-container {
		border: 1px solid black;
		padding-left: 7.5%;
		padding-right: 7.5%;
		text-align: left;
		border-radius: 8px;
		transform-origin: top;
	}

    .query-tip.warning {
        color: red;
    }
</style>