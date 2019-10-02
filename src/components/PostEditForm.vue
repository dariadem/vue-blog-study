<template>
	
	<div class="post-edit-form">
		<app-error v-if="!isLoading && isError" :message="errorMessage" />

		<div class="collection with-header">
			<h4 class="collection-header form-title">Edit post:</h4>

			<form class="collection-item" @submit.prevent="save" novalidate="true">

				<div class="input-field" :class="{ hasError: $v.postTitle.$error }">
					<input type="text" id="post-title" class="input-post-title"
						autocomplete="off"
						v-model="postTitle"
						@blur="$v.postTitle.$touch()">

					<label for="post-title" :class="{ active: postTitle.length }">Post title</label>
					<span class="error orange-text text-darken-3">Please fill the post title</span>
				</div>

				<div class="input-field" :class="{ hasError: $v.postBody.$error }">
					<textarea id="post-text"
						class="materialize-textarea" rows="10"
						autocomplete="off"
						v-model="postBody"
						@blur="$v.postBody.$touch()"></textarea>

					<label for="post-text" :class="{ active: postBody.length }">Post text</label>
					<span class="error orange-text text-darken-3">Post can not be empty. For discarding changes use "Discard" button.</span>
				</div>

				<div class="input-field input-field-controls">
					<button class="btn btn-discard orange darken-3" type="button"
						@click="discard">
						Discard changes
					</button>
					<app-spinner v-if="isLoading" />
					<button class="btn btn-submit" type="submit" :disabled="$v.$invalid">
						Save
					</button>
				</div>

			</form>
		</div>
	</div>

</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import AppSpinner from '@/components/AppSpinner.vue'
import AppError from '@/components/AppError.vue'

export default {
	props: ['postId'],

	components: {
		AppSpinner,
		AppError
	},

	mixins: [validationMixin],

	data() {
		return {
			isLoading: false,
			isError: false,
			errorMessage: '',
			postTitle: '',
			postBody: ''
		}
	},

	validations: {
		postTitle: {
			required
		},
		postBody: {
			required
		}
	},

	mounted() {
		if (this.$store.state.currentPost.id === this.postId) {
			this.postTitle = this.$store.state.currentPost.title
			this.postBody = this.$store.state.currentPost.body
		}
	},

	methods: {
		discard() {
			this.postTitle = this.postBody = ''
			this.$v.$reset
			this.$emit('discard')
		},

		save() {
			const postData = {
				title: this.postTitle,
				body: this.postBody
			}

			if (!this.$v.$invalid) {
				this.isLoading = true

				this.$store.dispatch('editPost', { postData, postId: this.postId })
					.then(() => {
						this.discard()
					})
					.catch(err => {
						this.errorMessage = 'Error editing post: ' + err.message
						this.isError = true
					})
					.finally(() => {
						this.isLoading = false
					})
			}
		}
	}
}
</script>

<style lang="scss">
.input-post-title {
	font-weight: 700;
	font-size: 1.5rem;
}
.post-edit-form {
	textarea {
		height: auto;
	}
	.btn-discard {
		margin-right: auto;
		margin-left: 0;
	}
}
</style>