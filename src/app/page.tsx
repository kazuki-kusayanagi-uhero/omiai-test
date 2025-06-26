'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

// APIから返されるデータの型を定義します
interface ApiDataType {
  message: string;
  data: string;
}

export default function Home() {
  // apiData の型を ApiDataType または null と明示します
  const [apiData, setApiData] = useState<ApiDataType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const API_ENDPOINT = 'https://l2kln2gnk9.execute-api.ap-northeast-1.amazonaws.com/omiai-test/omiai-test';

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data && typeof data.body === 'string') {
          try {
            // JSON.parseの結果をApiDataTypeとして扱うことをTypeScriptに伝えます
            setApiData(JSON.parse(data.body) as ApiDataType);
          } catch (parseError) {
            console.error("APIレスポンスのbodyパースエラー:", parseError);
            setError("APIからのデータ形式が不正です。");
          }
        } else {
          // もしbodyが文字列でない場合（予期しない形式）のフォールバック
          // このケースでは、apiDataの型が合わない可能性があるので注意
          setApiData(data as ApiDataType | null); // ここも型キャストを追加
        }
      } catch (e: unknown) {
        console.error("API呼び出しエラー:", e);
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("予期せぬAPIエラーが発生しました。");
        }
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
          {/* apiData が null でなければ、message と data プロパティは存在するとTypeScriptが理解します */}
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