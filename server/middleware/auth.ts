export default defineEventHandler(async (event) => {
  if (event.node.req.url?.startsWith('/api/')) {
    await requireUserSession(event)
  }
})