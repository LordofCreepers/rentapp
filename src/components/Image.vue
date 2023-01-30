<template>
	<input ref="image" type="file" @change="changed()" :accept="accept_types">
</template>

<script>

export default {
	name: "Image",
	props: {
		accept_types: {
			type: Array,
			default: () => { [ "image/*" ] }
		}
	},
	methods: {
		changed() {
			this.$emit( "change", this.$refs.image.files[ 0 ] )	
			this.$refs.image.files = []
		}
	}
}

</script>