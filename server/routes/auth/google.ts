export default defineOAuthGoogleEventHandler({
    async onSuccess(event, { user }) {
      const allowedEmails = process.env.ALLOWED_LOGIN_EMAILS?.split(',') || []
  
      if (!allowedEmails.includes(user.email)) {
        throw createError({
          statusCode: 403,
          statusMessage: "Access denied: Unauthorized email address."
        })
      }
  
      await setUserSession(event, {
        user: {
          email: user.email,
          name: user.name,
        }
      })
  
      return sendRedirect(event, '/')
    },
    onError(event) {
      return sendRedirect(event, '/')
    },
  })