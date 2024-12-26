<template>
	<input :class="$attrs.class" ref="input" type="text" @keydown="check" @change="changed_str">
	<div class="substr-container" v-if="is_select">
		<h6>Частичное совпадение: </h6>
		<Checkbox 
			:class="substr_checkbox_class" 
			:force_enabled="false"  
			:force_disabled="false"
			:default_value="this.default_substring_enabled"
			@change="changed_substr_check"
			ref="is_substr" 
		></Checkbox>
	</div>
</template>

<script>
import Checkbox from './Checkbox.vue';


export default {
	name: "Textbox",
	props: {
		default_string: {
			type: String,
			default: ""
		},
		default_substring_enabled: {
			type: Boolean,
			default: false
		},
		filter: {
			type: Function,
			default: () => true
		},
		substr_checkbox_class: {
			type: String,
			default: ""
		},
		is_select: Boolean
	},
	data() {
		return {
			value: (this.is_select) ? "" : { string: "", substring: false }
		}
	},
	created() {
		if (this.is_select)
			this.value = { string: this.default_string, substring: this.default_substring_enabled }
		else
			this.value = this.default_string
	},
	methods: {
		check( event ) {
			if ( this.filter( event ) ) return;
			event.preventDefault()
		},
		changed_str( event ) {
			if ( 
				(this.is_select) && 
					this.value.string == event.target.value || 
					this.value == event.target.value 
			) return;
			this.setValue( 
				(this.is_select) ? 
					{ string: event.target.value, substring: this.value.substring } :
					event.target.value
			)
		},
		changed_substr_check( value ) {
			if (value == this.value.substring) return;
			this.setValue({ string: this.value.string, substring: value })
		},
		setValue( value ) {
			this.value = value
			this.$refs.input.setAttribute( "value", (this.is_select) ? value.string : value )
			if ( !this.is_select ) return
				this.$refs.is_substr.setValue( value.substring )
			this.$emit( "change", this.value )
		}
	},
	emits: [ "change" ],
	components: { Checkbox }
}

</script>

<style>
	.substr-container
	{
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.substr-container > *
	{
		margin-left: 1%;
		margin-right: 1%;
	}

</style>