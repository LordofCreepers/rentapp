<template>
	<select ref="select" @change="event => changed( event )">
		<option v-for="option in options" :key="option">{{ option }}</option>
	</select>
</template>

<script>

export default {
	name: "Dropdown",
	props: {
		options: {
			type: Array,
			required: true
		},
		default: String
	},
	activated() {
		if ( this.value == undefined ) return;
		for ( const option of this.$refs.select.childNodes ) {
			if ( this.value != option.text ) continue
			option.setAttribute( "selected", true )
			break
		}
	},
	methods: {
		getValue()
		{
			return this.$refs.select.options[ this.$refs.select.selectedIndex ].text;
		},
		changed( event ) {
			this.$emit( "change", this.getValue() );
		}
	},
	emits: [ "change" ]
}

</script>