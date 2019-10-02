<template>
	<div class="post-comment-form">
		<app-error v-if="!isLoading && isError" :message="errorMessage" />

		<div class="collection with-header">
			<h2 class="collection-header form-title">Add comment:</h2>

			<form class="collection-item" @submit.prevent="addComment" novalidate="true">

				<div class="input-field" :class="{ hasError: $v.commentName.$error }">

					<input type="text" id="comment-title"
						autocomplete="off"
						v-model="commentName"
						@blur="$v.commentName.$touch()">

					<label for="comment-title">Comment title</label>
					<span class="error orange-text text-darken-3">Please fill the comment title</span>
				</div>

				<div class="input-field" :class="{ hasError: $v.commentBody.$error }">
					<textarea id="comment-text"
						class="materialize-textarea" rows="4"
						autocomplete="off"
						v-model="commentBody"
						@blur="$v.commentBody.$touch()"></textarea>

					<label for="comment-text">Comment text</label>
					<span class="error orange-text text-darken-3">Please write a comment</span>
				</div>

				<div class="input-field" :class="{ hasError: $v.commentEmail.$error }">
					<input type="email" id="comment-email"
						v-model="commentEmail"
						@blur="$v.commentEmail.$touch()">

					<label for="comment-email" :class="{ active: commentEmail.length }">Your email</label>
					<span class="error orange-text text-darken-3">
						<template v-if="!$v.commentEmail.required">Put your email address here</template>
						<template v-if="!$v.commentEmail.email">This email is not correct, check it please</template>
					</span>
				</div>

				<div class="input-field input-field-controls">
					<app-spinner v-if="isLoading" />

					<button class="btn" type="submit" :disabled="$v.$invalid">
						Add comment
					</button>
				</div>
				
			</form>
			
		</div>
	
	</div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
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
			commentName: '',
			commentBody: '',
			commentEmail: ''
		}
	},

	validations: {
		commentName: {
			required
		},
		commentBody: {
			required
		},
		commentEmail: {
			required,
			email
		}
	},

	mounted() {
		if (!Object.entries(this.$store.state.userInfo).length) {
			this.$store.dispatch('getUserInfo')
				.then(() => {
					this.commentEmail = this.$store.state.userInfo.email
				})
				.catch(err => {
					console.log(err.message)
					this.commentEmail = ''
				})
		} else {
			this.commentEmail = this.$store.state.userInfo.email
		}
	},

	methods: {
		addComment() {
			const commentData = {
				postId: this.postId,
				email: this.commentEmail,
				name: this.commentName,
				body: this.commentBody
			}

			if (!this.$v.$invalid) {
				this.isLoading = true

				this.$store.dispatch('postComment', commentData)
					.then(() => {
						this.commentName = this.commentBody = ''
						this.$v.$reset()
					})
					.catch(err => {
						this.errorMessage = 'Error sending comment: ' + err.message
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
.post-comment-form {
	margin-bottom: 2em;
}
.form-title {
	margin: 0;
	font-size: 1.5rem;
}
.input-field {
	position: relative;
	margin-bottom: 2rem;
	padding-bottom: .5rem;

	textarea {
		min-height: 6rem;
	}

	.error {
		visibility: hidden;
		opacity: 0;
		position: absolute;
		left: 0;
		bottom: 0;
		font-size: 12px;
		line-height: 1;
		transition: opacity .25s ease;
	}
	&.hasError {
		.error {
			visibility: visible;
			opacity: 1;
		}
		input, textarea {
			&:not(:focus) {
				border-color: #ef6c00;
			}
		}
	}
}
.input-field-controls {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	.btn {
		margin-left: 3rem;
	}
}
</style>