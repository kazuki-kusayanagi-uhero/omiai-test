// src/app/about/page.js
import Link from 'next/link';

export default function About() {
  return (
    <div>
      <h1>このサイトについて</h1>
      <p>これはNext.jsで作成されたシンプルなウェブサイトです。</p>
      <p>学習目的で作成しました。</p>
      <nav>
        <Link href="/">ホームに戻る</Link>
      </nav>
    </div>
  );
}