<template>
	<button @click="toggle()">
		<font-awesome-icon v-if="value" class="checkbox-check-mark" icon="fa-solid fa-check"></font-awesome-icon>
		<font-awesome-icon v-else class="checkbox-cross-mark" icon="fa-solid fa-xmark"></font-awesome-icon>
	</button>
</template>

<script>

export default {
	name: "Checkbox",
	props: {
		default_value: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			value: this.default_value,
		}
	},
	methods: {
		toggle() {
			this.value = !this.value
			this.$emit( "change", this.value )
		}
	},
	emits: [ "change" ]
}

</script>