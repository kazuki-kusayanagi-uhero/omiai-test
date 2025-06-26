// src/app/page.js
import Link from 'next/link'; // Linkコンポーネントをインポート

export default function Home() {
  return (
    <div>
      <h1>Hello World</h1>
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