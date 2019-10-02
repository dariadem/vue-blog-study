<template>
	<div class="post-comments">
		<app-spinner v-if="isLoading" />
		<app-error v-else-if="isError" :message="errorMessage" />
		<div v-else>
			<post-comment-form :postId="postId" />

			<ul class="collection with-header">
				<li class="collection-header"><h2 class="comments-title">Comments</h2></li>
				<li class="collection-item blue-grey lighten-5"
					v-for="(comment, index) in comments" :key="index">
					<p class="comment-title">{{ comment.name }}</p>
					<p class="comment-body">{{ comment.body }}</p>
					<p class="right-align"><em>{{ comment.email }}</em></p>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import AppSpinner from '@/components/AppSpinner.vue'
import AppError from '@/components/AppError.vue'
import PostCommentForm from '@/components/PostCommentForm.vue'
export default {
	props: ['postId'],

	components: { 
		AppSpinner,
		AppError,
		PostCommentForm
	},

	data() {
		return {
			isLoading: true,
			isError: false,
			errorMessage: '',
		}
	},

	computed: {
		comments() {
			return this.$store.state.currentPostComments
		}
	},

	mounted() {
		this.isLoading = true

		this.$store.dispatch('getPostComments', this.postId)
			.catch(err => {
				this.isError = true
				this.errorMessage = 'Error getting comments: ' + err.message
			})
			.finally(() => {
				this.isLoading = false
			})
	}
}
</script>

<style scoped>
.post-comments {
	margin-top: 4em;
}
.comments-title {
	margin: 0;
	font-size: 1.5rem;
}
.comment-title {
	font-weight: 700;
}
.comment-body {
	white-space: pre;
}
</style>