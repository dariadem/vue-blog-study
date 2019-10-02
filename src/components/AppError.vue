<template>
	<div class="app-error card-panel orange darken-4 white-text">
		<span>{{ message }}</span>
	</div>
</template>

<script>
export default {
	props: {
		message: {
			type: String,
			default: 'Error loading content'
		}
	}
}
</script>