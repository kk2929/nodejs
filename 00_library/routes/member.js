const express = require("express");

/* 使用・関連モジュール(app.js) */
// express-session


module.exports = function () {
    var router = express.Router();
    router.all("/*", function (req, res, next) {
        console.log("■ member.js：ログインセッションのチェック");

        // req.session.login = true;    //コメント化解除でアクセス全スルー

        if (req.session.login) {
            // ログイン済みの場合はスルー
            next();
        } else {
            // 未ログインの場合はリダイレクト
            res.redirect("/manage/90-advanced/login/index/");
        }
    });
    return router;
};