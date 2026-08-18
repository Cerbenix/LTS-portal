export default defineEventHandler(async (event) => {
  if (event.node.req.url?.startsWith('/api/')) {
    if (event.node.req.url.startsWith('/api/webhook/')) return
    await requireUserSession(event)
  }
})