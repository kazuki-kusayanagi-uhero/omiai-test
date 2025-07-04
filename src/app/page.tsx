'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

// APIから返されるRDSの各行のデータの型を定義します
// 例として、RDSのテーブルに 'id' (数値) と 'name' (文字列) のカラムがある場合
interface TableRow {
  // テーブルのカラム名と型に合わせて調整してください
  id: string; // varchar は TypeScript では string
  category_id: number; // int は number
  posted_at: string; // timestamp は日付文字列として受け取るため string
  meta: string; // text は string
  contents: string; // text は string
  latest_result_id: number | null; // int は number, null の可能性があれば | null を追加
  created_at: string; // timestamp は string
  updated_at: string; // timestamp は string
}

// API全体から返されるデータの型を定義します
interface ApiResponse {
  message: string;
  data: TableRow[]; // ここが重要: TableRowの配列になります
}

// --- ここまで追記・変更 ---

export default function Home() {
  // apiData の型を ApiResponse または null と明示します
  const [apiData, setApiData] = useState<ApiResponse | null>(null); // 型を ApiResponse に変更
  const [error, setError] = useState<string | null>(null);

  const API_ENDPOINT = 'https://bi8oefs4o3.execute-api.ap-northeast-1.amazonaws.com/omiai-test/get_tabledata/verifications_test';

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
            // JSON.parseの結果を ApiResponse として扱うことをTypeScriptに伝えます
            // バックエンドLambdaがJSON文字列としてbodyを返している場合
            setApiData(JSON.parse(data.body) as ApiResponse); // 型キャストを ApiResponse に変更
          } catch (parseError) {
            console.error("APIレスポンスのbodyパースエラー:", parseError);
            setError("APIからのデータ形式が不正です。");
          }
        } else {
          // もしbodyが文字列でない場合（Lambdaが直接JSONオブジェクトを返している場合など）
          // このケースでは、apiDataの型が合わない可能性があるので注意
          console.warn("APIレスポンスのbodyが文字列ではありませんでした。直接JSONとしてパースを試みます。", data);
          setApiData(data as ApiResponse | null); // ここも型キャストを ApiResponse に変更
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
      <h1 className={styles.title}>Hello World</h1>
      <h2>API からのデータ:</h2>
      {apiData ? (
        <div>
          <p>メッセージ: {apiData.message}</p>
          {/* apiData.data が TableRow の配列として存在するかチェック */}
          {apiData.data && Array.isArray(apiData.data) && apiData.data.length > 0 ? (
            <div>
              <h3>RDS テーブル内容:</h3>
              <table className={styles.table}> {/* CSSで .table スタイルを定義してください */}
                <thead>
                  <tr>
                    {/* ここにテーブルのヘッダーカラムを追加します */}
                    <th>ID</th>
                    <th>Category ID</th>
                    <th>Posted At</th>
                    <th>Meta</th>
                    <th>Contents</th>
                    <th>Latest Result ID</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                  </tr>
                </thead>
                <tbody>
                  {apiData.data.map((row) => (
                    // 各行にはユニークな 'key' プロパティが必要です。
                    // 実際のテーブルのユニークなIDカラムを使用してください。
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.category_id}</td>
                      <td>{row.posted_at}</td>
                      <td>{row.meta}</td>
                      <td>{row.contents}</td>
                      <td>{row.latest_result_id !== null ? row.latest_result_id : 'N/A'}</td>
                      <td>{row.created_at}</td>
                      <td>{row.updated_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>RDSからのデータがありません、または形式が不正です。</p>
          )}
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