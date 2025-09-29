"use client";

import { useState } from 'react';

export default function TestSimple() {
  const [result, setResult] = useState<string>('Not tested yet');

  const testAPI = async () => {
    try {
      const response = await fetch('/api/test-simple-bills');
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simple API Test</h1>
      <button 
        onClick={testAPI}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Test API
      </button>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {result}
      </pre>
    </div>
  );
}
