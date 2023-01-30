<template>
	<div :class="[ 'tf-table-filter', enabled ? 'active' : 'inactive' ]">
		<Checkbox 
			v-show="!force_enable && !force_disable"
			:default_value="enabled"
			:class="[ 'tf-checkbox-enable', enabled ? 'active' : 'inactive' ]"
			@change="value => toggle( value )" 
		></Checkbox>
		<h6 class="tf-id">{{ filter_name }} {{ enabled ? "" : "(Неактивен)" }}</h6>
		<div class="tf-value-container">
			<Checkbox v-if="type === 'bool'" 
				class="tf-value tf-checkbox"
				@change="this.value = !!!this.value" 
			></Checkbox>
			<Textbox v-else-if="type === 'string'"
				class="tf-value tf-textfield"
				@change="value => this.value = value"
			></Textbox>
			<Numberbox v-else-if="type === 'number'" 
				class="tf-value tf-textfield tf-number"
				:min="( filter_data.min != undefined ) ? filter_data.min : 0"
				:max="( filter_data.max != undefined ) ? filter_data.max : 1"
				@change="value => this.value = value" 
			></Numberbox>
			<Date v-else-if="type === 'date'" 
				class="tf-value tf-date" 
				@change="value => this.value = value" 
			></Date>
			<Dropdown v-else-if="type === 'select'" 
				class="tf-value tf-select"
				:options="filter_data.options"
				@change="value => this.value = value" 
			></Dropdown>
			<Image v-else-if="type === 'image'"
				class="tf-value tf-image"
				@change="value => this.value = value"
			></Image>
		</div>
	</div>
</template>

<script>
import Checkbox from './Checkbox.vue'
import Date from './Date.vue';
import Dropdown from './Dropdown.vue';
import Image from './Image.vue';
import Numberbox from './Numberbox.vue';
import Textbox from './Textbox.vue';

	export default {
    name: "TableFilter",
    props: {
        filter_name: {
			type: String,
			required: true
		},
		type: {
			type: String,
			required: true
		},
		force_enable: Boolean,
		force_disable: Boolean,
        filter_data: {
			type: Object,
			default: () => { return {} }
		}
    },
    data() {
        return {
			enabled_value: false,
			value: null
        };
    },
	computed: {
		enabled() {
			return ( this.enabled_value || this.force_enable ) && !this.force_disable
		}
	},
    methods: {
        toggle( value ) {
			this.enabled_value = value
		},
		changed( value ) {
			this.value = value
			this.$emit( "change", this.filter_name, value )
		}
    },
	emits: [ "change" ],
    components: { Checkbox, Textbox, Numberbox, Date, Dropdown, Image }
}
</script>

<style>
	.tf-table-filter {
		display: flex;
		margin-top: 0%;
		margin-left: 2%;
		margin-right: 5%;
		margin-bottom: 1%;
		border-color: black;
	}

	.tf-table-filter.active {
		background-color: black;
	}
	.tf-table-filter.inactive {
		background-color: #999;
	}

	.tf-id {
		margin-left: 1%;
		color: white
	}

	.tf-type {
		background-color: black;
		border-color: white;
		border-radius: 8px;
		border-width: 4px;
		width: 40%;
		text-align: center;
		color: white;
		margin: 1%;
		margin-right: 2%;
	}

	.tf-value-container {
		width: 60%;
		margin: 0;
		margin-bottom: auto;
		margin-left: 2%;
	}

	.tf-textfield {
		width: 100%;
		height: 100%;
		margin: auto;
		margin-bottom: 1%;
		margin-top: 2%;
		border-radius: 8px;
		border-width: 4px;
		background-color: black;
		color: white;
		border-color: white;
	}

	.tf-select {
		width: 100%;
		height: 100%;
		margin: auto;
		margin-top: 2%;
		margin-bottom: 1%;
		border-radius: 8px;
		border-width: 4px;
		background-color: black;
		color: white;
		border-color: white;
		text-align: center;
	}

	.tf-number {
		text-align: center;
	}

	.tf-checkbox {
		width: 32px;
		height: 32px;
		margin-left: 40%;
		margin-right: 40%;
		margin-top: 2%;
		margin-bottom: 2.5%;
		border-radius: 8px;
		background-color: black;
		border-color: white;
		border-width: 4px;
	}

	.tf-date {
		width: 100%;
		height: 100%;
		margin: auto;
		margin-bottom: 1%;
		margin-top: 1.5%;
		border-radius: 8px;
		border-width: 4px;
		background-color: black;
		color: white;
		border-color: white;
		text-align: center;
	}

	.checkbox-check-mark {
		color: #373;
	}

	.checkbox-cross-mark {
		color: #400
	}

	.tf-checkbox:hover {
		background-color: white;
	}

	.tf-remove {
		background-color: red;
		color: white;
		border-radius: 50%;
		width: 24px;
		height: 24px;
		margin: auto;
		margin-left: 2%;
		margin-right: 1%;
		border: none
	}

	.tf-remove:hover {
		background-color: #ff7777;
	}

	.tf-remove:active {
		background-color: red;
	}

	.tf-checkbox-enable {
		color: white;
		border-radius: 50%;
		width: 24px;
		height: 24px;
		margin: auto;
		margin-left: 1%;
		margin-right: 1%;
		border: none
	}

	.tf-checkbox-enable.active {
		background-color: #3f3;
	}

	.tf-checkbox-enable.inactive {
		background-color: red;
	}

	.tf-checkbox-enable.active:hover {
		background-color: #7f7;
	}

	.tf-checkbox-enable.inactive:hover {
		background-color: #f77;
	}

	.zoom-enter-from, .zoom-leave-to {
		transform: scaleY( 0 );
	}

	.zoom-enter-active {
		transition-property: transform;
		transition-duration: 100ms;
		transition-timing-function: ease-out;
	}

	.zoom-leave-active {
		transition-property: transform;
		transition-duration: 50ms;
		transition-timing-function: linear;
	}

	.zoom-enter-to, .zoom-leave-from {
		transform: scaleY( 1 );
	}

</style>