<script>
  import { getContext } from 'svelte'
  import { postMessage } from '../utils';
  import { t } from '../i18n'
  export let parentId

  // form data
  let content = ''
  let nickname = ''
  let email = ''

  let loading = false

  export let onSuccess

  const api = getContext('api')
  const setMessage = getContext('setMessage')
  const { appId, pageId, pageUrl, pageTitle } = getContext('attrs')
  const refresh = getContext('refresh')

  async function addComment() {
    if (!content) {
      alert(t('content_is_required'))
      return
    }

    if (!nickname) {
      alert(t('nickname_is_required'))
      return
    }

    try {
      loading = true
      const res = await api.post('/api/open/comments', {
        appId,
        pageId,
        content,
        nickname,
        email,
        parentId,
        pageUrl,
        pageTitle,
      })
      await refresh()
      teardown()
      postMessage("COMMENT_SENT", {
        message: t('comment_has_been_sent'),
        res,
      })
    } finally {
      loading = false
    }
  }

  function teardown() {
    content = ''
    nickname = ''
    email = ''
    onSuccess && onSuccess()
  }

</script>

<div class="grid grid-cols-1 gap-4">
  <div class="grid grid-cols-2 gap-4">
    <div class="pl-1">
      <label class="mb-2 block dark:text-gray-200" for="nickname">*{t('nickname')}</label>
      <input
        name="nickname"
        class="w-full p-2 border rounded border-gray-200 bg-transparent dark:text-gray-100 dark:outline-none focus:outline-none focus:ring focus:border-blue-300"
        type="text"
        bind:value={nickname}
      />
    </div>
    <div class="pr-1">
      <label class="mb-2 block dark:text-gray-200" for="email">{t('email')}</label>
      <input
        name="email"
        class="w-full p-2 border rounded border-gray-200 bg-transparent  dark:text-gray-100 dark:outline-none focus:outline-none focus:ring focus:border-blue-300"
        type="email"
        bind:value={email}
      />
    </div>
  </div>

  <div class="px-1">
    <label class="mb-2 block dark:text-gray-200" for="reply_content">*{t('reply_placeholder')}</label>
    <textarea
      name="reply_content"
      class="focus:outline-none focus:ring focus:border-blue-300 w-full p-2 border rounded border-gray-200 h-24 bg-transparent dark:text-gray-100 dark:outline-none"
      bind:value={content}
    />
  </div>

  <div class="pl-1">
    <button
      class="border mr-3 rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-300"
      class:cusdis-disabled={loading}
      on:click={addComment}>{loading ? t('sending') : t('post_comment')}</button
    >
  </div>
</div>
