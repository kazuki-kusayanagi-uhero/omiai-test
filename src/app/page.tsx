// src/app/page.js
import Link from 'next/link'; // Linkコンポーネントをインポート

export default function Home() {
  return (
    <div>
      <h1>ようこそ、私のシンプルなウェブサイトへ！</h1>
      <p>これはNext.jsで作られた最初のページです。</p>
      <nav>
        <ul>
          <li>
            <Link href="/">ホーム</Link> {/* トップページへのリンク */}
          </li>
          <li>
            <Link href="/about">このサイトについて</Link> {/* Aboutページへのリンク */}
          </li>
        </ul>
      </nav>
    </div>
  );
}