<template>
	<div class="post">
		<app-spinner v-if="isLoading" />
		<app-error v-else-if="isError" :message="errorMessage" />
		<div v-else>

			<app-error v-if="deletePostError" :message="deletePostErrorMessage" />
			<div v-if="belongsToCurrentUser" class="post-actions right-align blue-grey lighten-5">
				<button class="btn-floating teal darken-3" type="button" title="Edit"
					@click="editPost">
					<img svg-inline src="@/assets/img/icon-edit.svg">
				</button>
				<button class="btn-floating orange darken-3" type="button" title="Delete"
					@click="deletePost">
					<img svg-inline src="@/assets/img/icon-delete.svg">
				</button>
			</div>

			<post-edit-form :postId="post.id" v-if="isEditing" @discard="isEditing = false"/>

			
			<h1 class="post-title">{{ post.title }}</h1>
			<p class="right-align">By <em>{{ postAuthor }}</em></p>
			<div class="post-body section" v-html="post.body"></div>

			<post-comments :postId="post.id"/>
		</div>
	</div>
</template>

<script>
import AppSpinner from '@/components/AppSpinner.vue'
import AppError from '@/components/AppError.vue'
import PostComments from '@/components/PostComments.vue'
import PostEditForm from '@/components/PostEditForm.vue'
export default {
	components: {
		PostComments,
		PostEditForm,
		AppSpinner,
		AppError
	},

	data() {
		return {
			isLoading: true,
			isError: false,
			errorMessage: '',
			deletePostError: false,
			deletePostErrorMessage: '',
			isEditing: false
		}
	},

	computed: {
		post() {
			return this.$store.state.currentPost
		},
		postAuthor() {
			return this.$store.state.currentPostAuthor
		},
		belongsToCurrentUser() {
			return this.$store.state.currentPost.userId === this.$store.state.userId
		}
	},

	mounted() {
		if (!this.post.id ||this.post.id !== this.$route.params.id) {

			this.isLoading = true

			this.$store.dispatch('getPost', this.$route.params.id)
				.catch(err => {
					this.isError = true
					this.errorMessage = 'Error getting post: ' + err.message
				})
				.finally(() => {
					this.isLoading = false
				})
		}
	},

	methods: {
		editPost() {
			this.isEditing = true
		},
		deletePost() {
			if (!this.belongsToCurrentUser) return

			this.$store.dispatch('deletePost', this.post.id)
				.then(() => {
					this.$router.push({name: 'blog'})
				})
				.catch(err => {
					this.deletePostError = true
					this.deletePostErrorMessage = 'Error deleting the post: ' + err.message
				})
		}
	}
}
</script>

<style lang="scss" scoped>
.post-actions {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	margin: 4em 0 0;
	padding: .5em 1em;

	.btn-floating {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 1rem;
	}
}
.post-title {
	font-weight: 700;
	font-size: 1.5rem;
	text-transform: capitalize;
	@media only screen and (min-width: 640px) {
		font-size: 2.5rem;
	}
}
.post-body {
	white-space: pre;
}
</style>