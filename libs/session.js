class Session {
  constructor(sessionId, sessionUser) {
    this.sessionId = sessionId;
    this.sessionUser = sessionUser;
  }
  static createSession(user) {
    const randomId = new Date().getTime() + Math.floor(Math.random() * 10000);
    return new Session(randomId, user);
  }

  get currentSession() {
    return { id: this.sessionId, user: this.sessionUser };
  }
  isEqualTo(cookie) {
    return cookie.user === this.sessionUser && cookie.id === this.sessionId;
  }
}

module.exports = { Session };
