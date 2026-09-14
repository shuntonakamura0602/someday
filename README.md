# Someday

> Someday, you'll miss today.

未来の自分の視点から今日を見ることで、「今日という日」を少しだけ大切にしたくなる。
そのきっかけを届けるための、静かなWebサービスです。

ユーザーを急かしたり、不安を煽ったりすることは目的にしていません。人生が有限であることを、恐怖ではなく愛おしさとして感じてもらうことを目指しています。

## 体験の流れ

初めて訪れたユーザーは、以下の流れを一度だけ体験します。

1. **Landing** — 「Someday, you'll miss today.」
2. **生年月日入力**
3. **現在の年齢表示**
4. **Future Perspective** — 未来の自分（60歳など）が、今日を振り返る
5. **You are here now.** — このサービス最大の体験となる瞬間
6. **Youth Value** — 今の年齢に1年間だけ戻れるとしたら、いくら払うか
7. **Today** — もし未来の自分が今日に戻ってきたら、何をしたいか
8. **保存完了**

2回目以降の訪問では、この一連の体験は表示されず、直接Home画面が開きます。

## 主な画面

| パス | 内容 |
| --- | --- |
| `/` | 初回：オンボーディング体験 / 2回目以降：Home（今日の記録） |
| `/life` | Life Calendar（人生を週単位のマスで俯瞰する） |
| `/memories` | これまでの記録の一覧 |
| `/about` | Somedayの考え方について |

## データの扱い

ログイン機能はなく、すべてのデータはブラウザの`localStorage`にのみ保存されます（サーバーやデータベースは使用していません）。

- `someday_profile` — 生年月日など
- `someday_reflections` — 日々の記録
- `someday_youth_value` — Youth Valueで選んだ値

## 開発

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) をブラウザで開くと確認できます。

```bash
npm run build   # 本番ビルド
npm run lint    # ESLint
```

## 技術構成

- Next.js (App Router) / TypeScript
- Tailwind CSS v4
- localStorage（バックエンドなし）
