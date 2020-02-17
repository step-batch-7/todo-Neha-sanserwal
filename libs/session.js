class Session {
  constructor(sessionId, sessionUser) {
    this.sessionId = sessionId;
    this.sessionUser = sessionUser;
  }
  static createSession(user) {
    const range = 10000;
    const randomId = new Date().getTime() + Math.floor(Math.random() * range);
    return new Session(randomId, user);
  }

  get currentSessionId() {
    return this.sessionId;
  }
  isEqualTo(id) {
    return parseInt(id) === this.sessionId;
  }
}

module.exports = { Session };
