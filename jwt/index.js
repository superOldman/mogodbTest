// import { injectable } from "inversify";
// import jsonwebtoken from "jsonwebtoken";
// import passport from "passport";
// import { Strategy, ExtractJwt } from "passport-jwt";

const jsonwebtoken = require("jsonwebtoken");
const passport = require("passport");
const { Strategy, ExtractJwt } = require('passport-jwt');

// @injectable()

class JWT {
  secret = "xiaoman$%^&*()asdsd";
  jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: this.secret,
  };
  constructor() {
    this.strategy();
  }

  /**
   * 初始化jwt
   */
  strategy() {
    const strategy = new Strategy(this.jwtOptions, (payload, done) => {
      done(null, payload);
    });
    passport.use(strategy);
  }

  /**
   *
   * @returns 中间件
   */
  middleware() {
    return passport.authenticate("jwt", { session: false });
  }

  /**
   * 创建token
   * @param data Object
   */
  createToken(data) {
    //有效期为7天
    return jsonwebtoken.sign(data, this.secret, { expiresIn: "7d" });
  }

  /**
   *
   * @returns 集成到express
   */
  init() {
    return passport.initialize();
  }
};

module.exports = JWT