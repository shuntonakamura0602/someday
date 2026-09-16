import type { Dictionary } from "./types";

export const ja: Dictionary = {
  meta: {
    title: "Someday — You'll miss today.",
    description: "未来の自分から今日を見ることで、今という時間の大切さを思い出すWebサービス。",
  },
  nav: {
    today: "今日",
    notes: "ひと言",
    about: "Somedayについて",
  },
  localeSwitcher: {
    label: "English",
  },
  storage: {
    full: "生年月日と記録は、このブラウザーにだけ保存されます（サーバーには送信されません）。別の端末には引き継がれません。ブラウザーのデータを消去したり、プライベートブラウズを終了したりすると失われる場合があります。",
    short: "この記録もブラウザーにだけ保存されます。",
  },
  onboarding: {
    landing: {
      title: "いつか、今日の何でもない時間を、\n懐かしく思うかもしれません。",
      subtitle: "少し先の未来から、今日を眺める短い体験です。",
      cta: "はじめる",
    },
    birthdate: {
      question: "あなたはいつ生まれましたか？",
      explanation: "あなたの年齢に合わせて、\n少し先の未来を想像します。",
      srLabel: "生年月日",
      continue: "続ける",
    },
    future: {
      title: (futureAge: number) =>
        `${futureAge}歳になった自分を、\n少しだけ想像してみてください。`,
      body1: "思い出しているのは、今の年齢の頃の、\n何でもない一日。",
      body2: "いつもの部屋。聞き慣れた声。\n帰り道に見上げた空。",
      body3: "未来のあなたが懐かしく思うとしたら、\nどんな場面でしょう。",
      reassure: "何も浮かばなくても、大丈夫です。",
      cta: "今日へ戻る",
    },
    returnToday: {
      title: "今日は、まだここにあります。",
      body: "特別な一日にしなくても大丈夫。\nこのあとも、あなたの今日が続きます。",
      cta: "今日に戻る",
      noteLink: "何か浮かんだら、ひと言だけ残す",
    },
    note: {
      question: "今、少し心に浮かんだことはありますか。",
      reassure: "何かをする約束でなくて大丈夫。\n書かずに終えてもかまいません。",
      srLabel: "心に浮かんだこと",
      cta: "終える",
    },
    end: {
      title: "また、いつか。\nこの画面は、ここで閉じて大丈夫です。",
      link: "今日のページを見る",
    },
  },
  home: {
    heading: (age: number) => ({ before: "あなたは", highlight: `${age}歳`, after: "です。" }),
    question: (futureAge: number) =>
      `もし${futureAge}歳のあなたが今日に戻ってきたら、\n何を思うでしょう。`,
    noteSrLabel: "今、思ったこと",
    optional: "書かなくても大丈夫です。",
    placeholder:
      "例：\n公園を散歩する\n好きな人に連絡する\n作りたかったものを少し作る\n何もせずゆっくりする",
    saveError: "保存できませんでした。\n入力した内容は、この画面に残っています。\nもう一度お試しください。",
    keep: "今日に残す",
    cancel: "キャンセル",
    savedLabel: "今日あなたが残したもの",
    edit: "編集する",
    editAriaLabel: "今日の記録を編集する",
    replay: "もう一度、未来から今日を見る",
    correctBirthdate: "生年月日を訂正する",
    update: "更新する",
  },
  memories: {
    empty: "まだ何もありません。",
    emptySubtitle: "これからの日々が、ここに少しずつ残っていきます。",
  },
  about: {
    pageTitle: "Somedayについて",
    body: "Somedayは、\nあなたを急かすためのサービスではありません。\n\n人生は有限です。\n\nでも、それは今日を焦って生きなければならない\nという意味ではありません。\n\n未来から振り返ったとき、\n今のあなたの日常は、\n思っている以上に愛おしい時間かもしれません。\n\nSomedayは、\nそれを時々思い出すための場所です。",
    analytics:
      "どの画面がどれくらい見られているかだけを、個人を特定しない形で集計しています。生年月日や記録の内容が送信されることはありません。",
  },
  error: {
    message: "うまくいきませんでした。\nもう一度お試しください。",
    retry: "もう一度試す",
  },
  notFound: {
    message: "ページが見つかりませんでした。",
    backHome: "今日のページへ戻る",
  },
};
