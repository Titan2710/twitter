import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: "403281804407-2dq75c19r8v5l13o5h5fkrajbpn59796.apps.googleusercontent.com",
      clientSecret: "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",
    }),
    // ...add more providers here
  ],

  pages:{
    signIn: '/auth/signin'
  },

   
  callbacks: {
    async session({session, token}) {
      session.user.username = session.user.name
      .split(" ")
      .join("")
      .toLocaleLowerCase();
      session.user.uid = token.sub
      return session
    }
  }
})