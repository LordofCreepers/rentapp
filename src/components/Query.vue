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
            >
            </TableFilter>
        </div>
        <button class="tt-button tc-execute">Запустить</button>
    </UnfoldingContainer>
</template>

<script>
import UnfoldingContainer from './UnfoldingContainer.vue';

export default {
    name: "Query",
    components: {
        UnfoldingContainer
    }
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