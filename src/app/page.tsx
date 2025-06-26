'use client'; // Client Component としてマーク

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const [apiData, setApiData] = useState(null);
  const [error, setError] = useState(null);
  const API_ENDPOINT = 'https://l2kln2gnk9.execute-api.ap-northeast-1.amazonaws.com/omiai-test/omiai-test';

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setApiData(data);
      } catch (e) {
        console.error("API呼び出しエラー:", e);
        setError(e.message);
      }
    }

    fetchData();
  }, []); // 空の依存配列でコンポーネントのマウント時に一度だけ実行

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ようこそ、私のシンプルなウェブサイトへ！</h1>
      <p>これはNext.jsで作られた最初のページです。</p>

      <h2>API からのデータ:</h2>
      {apiData ? (
        <div>
          <p>メッセージ: {apiData.message}</p>
          <p>データ: {apiData.data}</p>
        </div>
      ) : error ? (
        <p style={{ color: 'red' }}>APIデータのロード中にエラーが発生しました: {error}</p>
      ) : (
        <p>APIデータをロード中...</p>
      )}

      <nav>
        <ul>
          <li>
            <Link href="/">ホーム</Link>
          </li>
          <li>
            <Link href="/about">このサイトについて</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}