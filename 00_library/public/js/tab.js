/* タブで表示切り替え */
$(() => {
    let tabs = $(".tab"); // tabのクラスを全て取得し、変数tabsに配列で定義
    $(".tab").on("click", function () { // tabをクリックしたらイベント発火。function() でなく ()=> を使用するとthisの取得がうまくいかなかった
        $(".active").removeClass("active"); // activeクラスを消す
        $(this).addClass("active"); // クリックした箇所にactiveクラスを追加
        const index = tabs.index(this); // クリックした箇所がタブの何番目か判定し、定数indexとして定義
        $(".content").removeClass("show").eq(index).addClass("show"); // showクラスを消して、contentクラスのindex番目にshowクラスを追加

        document.cookie = `${tabName}=${index}`;
        // console.log(document.cookie);
    })
    $(window).on("load", function () {
        var cookiesArray = document.cookie.split(';');
        var cookieExistCheck = true;
        for (var c of cookiesArray) {   //配列の要素を変数cに入れて繰り返す
            var cArray = c.split('=');
            if (cArray[0] == tabName) { //このページで使用しているキーが存在するとき
                cookieExistCheck = false;
                $(".tab").eq(cArray[1]).addClass("active");
                $(".content").eq(cArray[1]).addClass("show");
            }
        }
        if (cookieExistCheck) { //クッキーに記録がない時は0番目のタブを有効にする
            $(".tab").eq(0).addClass("active");
            $(".content").eq(0).addClass("show");
        }
    })
    //クッキー全削除
    /*
    var cookiesArray = document.cookie.split(';');
    for (var c of cookiesArray) {   //配列の要素を変数cに入れて繰り返す
        var cArray = c.split('=');
        document.cookie = cArray[0] + '=;max-age=0' //有効期限=0 に
    }
    // */
})