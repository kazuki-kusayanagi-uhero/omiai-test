'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const [apiData, setApiData] = useState(null);
  const [error, setError] = useState(null);
  const API_ENDPOINT = 'https://l2kln2gnk9.execute-api.ap-northeast-1.amazonaws.com/omiai-test/omiai-test'; // あなたのAPIエンドポイントを貼り付け！

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // ここで一度目のパース（API Gatewayのレスポンスオブジェクト全体）

        // ★★★ ここからが変更点です！ ★★★
        // API Gateway のレスポンスの 'body' プロパティが、さらにJSON文字列なので、もう一度パースします
        if (data && typeof data.body === 'string') {
          try {
            setApiData(JSON.parse(data.body)); // bodyの中身をJSONとしてパース
          } catch (parseError) {
            console.error("APIレスポンスのbodyパースエラー:", parseError);
            setError("APIからのデータ形式が不正です。");
          }
        } else {
          // body プロパティがない、または文字列でない場合（予期しない形式）
          setApiData(data); // そのままセット（もしAPIが直接JSONオブジェクトを返した場合用）
        }
        // ★★★ 変更点ここまで ★★★

      } catch (e) {
        console.error("API呼び出しエラー:", e);
        setError(e.message);
      }
    }

    fetchData();
  }, []);

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