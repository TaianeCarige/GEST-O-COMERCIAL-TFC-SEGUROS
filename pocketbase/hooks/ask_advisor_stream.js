routerAdd(
  'POST',
  '/backend/v1/ask-advisor-stream',
  (e) => {
    const body = e.requestInfo().body || {}
    const userId = e.auth?.id
    if (!userId) return e.unauthorizedError('auth required')
    if (!body.message?.trim()) return e.badRequestError('message is required')

    const conv = $ai.agent('tfc-sales-advisor').getOrCreateConversation({
      user_id: userId,
      id: body.conversation_id || null,
    })

    const iter = $ai.agent('tfc-sales-advisor').chat({
      user_id: userId,
      conversation_id: conv.id,
      message: body.message,
      stream: true,
    })

    e.response.header().set('Content-Type', 'text/event-stream')
    e.response.header().set('Cache-Control', 'no-cache')
    e.response.header().set('X-Conversation-Id', conv.id)
    $response.stream(e, iter)
  },
  $apis.requireAuth(),
)
