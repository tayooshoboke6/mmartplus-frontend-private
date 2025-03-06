import React, { useEffect, useState } from 'react';
import { testApiCache, testAuthCookies } from '../tests/auth-cache-test';

const TestAuthCache: React.FC = () => {
  const [cacheTestResults, setCacheTestResults] = useState<string[]>([]);
  const [cookieTestResults, setCookieTestResults] = useState<string[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Capture console logs during tests
  const captureConsoleLogs = (callback: () => Promise<void>, setResults: React.Dispatch<React.SetStateAction<string[]>>) => {
    const logs: string[] = [];
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleGroup = console.group;
    const originalConsoleGroupEnd = console.groupEnd;
    
    // Override console methods to capture output
    console.log = (...args) => {
      logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '));
      originalConsoleLog(...args);
    };
    
    console.error = (...args) => {
      logs.push(`ERROR: ${args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ')}`);
      originalConsoleError(...args);
    };
    
    console.group = (label) => {
      logs.push(`\n--- ${label} ---`);
      originalConsoleGroup(label);
    };
    
    console.groupEnd = () => {
      logs.push(`\n`);
      originalConsoleGroupEnd();
    };
    
    // Run the test and restore console methods
    return callback()
      .finally(() => {
        console.log = originalConsoleLog;
        console.error = originalConsoleError;
        console.group = originalConsoleGroup;
        console.groupEnd = originalConsoleGroupEnd;
        setResults(logs);
      });
  };

  const runTests = async () => {
    setIsRunningTests(true);
    setCacheTestResults([]);
    setCookieTestResults([]);
    
    try {
      await captureConsoleLogs(testApiCache, setCacheTestResults);
      await captureConsoleLogs(testAuthCookies, setCookieTestResults);
    } catch (error) {
      console.error('Error running tests:', error);
    } finally {
      setIsRunningTests(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cache and Cookie Test Page</h1>
      
      <button 
        onClick={runTests}
        disabled={isRunningTests}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
      >
        {isRunningTests ? 'Running Tests...' : 'Run Tests'}
      </button>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-2">API Cache Test Results</h2>
          <pre className="bg-gray-100 p-4 rounded h-96 overflow-auto text-sm">
            {cacheTestResults.length > 0 ? cacheTestResults.join('\n') : 'No results yet. Run the tests to see output.'}
          </pre>
        </div>
        
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Auth Cookie Test Results</h2>
          <pre className="bg-gray-100 p-4 rounded h-96 overflow-auto text-sm">
            {cookieTestResults.length > 0 ? cookieTestResults.join('\n') : 'No results yet. Run the tests to see output.'}
          </pre>
        </div>
      </div>
      
      <div className="mt-6 border-t pt-4">
        <h3 className="font-semibold mb-2">Test Summary:</h3>
        <p>
          These tests verify that the caching and cookie functionality we implemented work correctly.
          The tests check:
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>API response caching for GET requests</li>
          <li>Cache clearing functionality</li>
          <li>Cookie-based authentication storage</li>
          <li>Proper logout that clears both localStorage and cookies</li>
          <li>User role handling across different storage methods</li>
        </ul>
      </div>
    </div>
  );
};

export default TestAuthCache;
