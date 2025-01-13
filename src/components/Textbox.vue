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
	activated()
	{
		this.$refs.input.setAttribute("value", this.default_string);
		if (this.is_select)
			this.$refs.is_substr.setValue(this.default_substring_enabled);
	},
	methods: {
		check( event ) {
			if ( this.filter( event ) ) return;
			event.preventDefault()
		},
		changed_str( event ) {
			if ( 
				(this.is_select) && 
					this.getValue()[ "string" ] == event.target.value || 
					this.getValue() == event.target.value 
			) return;
			this.$emit( "change", this.getValue() );
		},
		changed_substr_check( value ) {
			if (value == this.getValue()[ "substring" ]) return;
			this.$emit( "change", this.getValue() );
		},
		getValue()
		{
			return (this.is_select) ? 
				{ 
					string: this.$refs.input.value, 
					substring: this.$refs.is_substr.getValue()
				} :
				this.$refs.input.value;
		},
		setValue( value ) {
			this.$refs.input.setAttribute( "value", (this.is_select) ? value.string : value )
			if ( this.is_select )
				this.$refs.is_substr.setValue( value.substring )
			this.$emit( "change", this.getValue() )
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