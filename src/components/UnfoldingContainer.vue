<template>
    <div class="unfolding-container">
		<button class="unfolding-button" @click="toggle()">
			<font-awesome-icon class="unfolding-caret" icon="fa-solid fa-caret-down" />
			{{ title }}
		</button>
		<Transition name="unfold">
			<div v-if="open" class="unfoldable">
				<slot></slot>
			</div>
		</Transition>
	</div>
</template>

<script>

export default {
    name: "UnfoldingContainer",
	props: {
		unfold: Boolean,
		title: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			open: this.unfold
		}
	},
	methods: {
		toggle() {
			this.open = !this.open
		},
		setOpen( open ) {
			this.open = open
		}
	}
}

</script>

<style>
	.unfolding-caret {
		color: white;
	}

	.unfolding-button {
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

	.unfolding-button:hover {
		background-position-x: 100%;
	}

	.unfoldable {
		transform-origin: top;
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