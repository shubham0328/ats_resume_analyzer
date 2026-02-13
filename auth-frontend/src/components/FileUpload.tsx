import React, { useState, useRef, useCallback, useEffect } from 'react';

interface AnalysisResult {
  ats_score: number;
  strengths: string[];
  improvements: string[];
  skills: string[];
  experience: string;
  recommendation: string;
  ats_ready: boolean;
}

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [tokenInfo, setTokenInfo] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🔑 ENHANCED TOKEN HANDLING
  const getToken = (): string | null => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('🔑 TOKEN FOUND:', token.substring(0, 20) + '...');
      return token;
    }
    console.log('❌ NO TOKEN IN localStorage');
    return null;
  };

  // 🔍 TOKEN DEBUG DISPLAY
  useEffect(() => {
    const token = getToken();
    if (token) {
      setTokenInfo('✅ Token present');
    } else {
      setTokenInfo('❌ No token - Login required');
    }
  }, []);

  // Drag & Drop handlers (UNCHANGED - WORKING)
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const pdfFile = files.find(f => f.type === 'application/pdf');
      if (pdfFile && pdfFile.size <= 10 * 1024 * 1024) {
        setFile(pdfFile);
        setError('');
      } else {
        setError('Please drop a PDF file under 10MB');
      }
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    if (input.files && input.files[0]) {
      const pdfFile = input.files[0];
      if (pdfFile.type === 'application/pdf' && pdfFile.size <= 10 * 1024 * 1024) {
        setFile(pdfFile);
        setError('');
      } else {
        setError('Please select a PDF file under 10MB');
      }
    }
    input.value = '';
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  // 🔥 FIXED ANALYZE FUNCTION WITH TOKEN REFRESH
  const handleAnalyze = async () => {
    const token = getToken();
    
    if (!file) {
      setError('Please select a file first');
      return;
    }
    
    if (!token) {
      setError('🚫 No token found. Please login first.');
      return;
    }

    console.log('🚀 Starting analysis with token:', token.substring(0, 20) + '...');
    setAnalyzing(true);
    setError('');
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      // TEST TOKEN FIRST
      const tokenTest = await fetch('http://localhost:8000/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('🔍 Token test response:', tokenTest.status);

      if (!tokenTest.ok) {
        console.log('❌ Token invalid - trying login refresh...');
        setError('Token expired. Please login again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      // MAIN ANALYSIS REQUEST
      const response = await fetch('http://localhost:8000/api/analyze-resume', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('📡 Analysis response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error:', errorText);
        
        if (response.status === 401) {
          setError('🚫 Token invalid/expired. Please login again.');
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          throw new Error(errorText || `HTTP ${response.status}`);
        }
      }

      const data: AnalysisResult = await response.json();
      console.log('✅ SUCCESS:', data);
      setAnalysisResult(data);

    } catch (err: any) {
      console.error('❌ ANALYSIS ERROR:', err);
      setError(err.message || 'Analysis failed. Check if backend is running.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setAnalysisResult(null);
    setError('');
    setDragActive(false);
  };

  // Token status
  const token = getToken();
  const hasToken = !!token;
  const fileSelected = !!file;

  const renderListItems = (items: string[], iconColor: string, borderColor: string) => (
    items.map((item, index) => (
      <div key={index} className={`flex items-start space-x-3 p-5 bg-white rounded-xl border-l-4 shadow-sm hover:shadow-md transition-all ${borderColor}`}>
        <div className={`w-2.5 h-2.5 ${iconColor} rounded-full mt-1.5 flex-shrink-0`}></div>
        <span className="text-lg text-gray-800 leading-relaxed">{item}</span>
      </div>
    ))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-gray-900 to-emerald-600 bg-clip-text text-transparent mb-6">
            AI Resume Analyzer
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-medium max-w-2xl mx-auto">
            Drag & drop OR click to upload your PDF resume. Get instant AI-powered ATS score & feedback.
          </p>
        </div>

        {/* 🔑 TOKEN DEBUG INFO */}
        <div className="max-w-2xl mx-auto mb-8 p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold mr-3 ${
                hasToken ? 'bg-emerald-500' : 'bg-red-500'
              }`}>
                {hasToken ? 'OK' : 'NO'}
              </div>
              <span className="font-semibold text-lg">{tokenInfo}</span>
            </div>
            {hasToken && (
              <button
                onClick={() => {
                  console.log('Current token:', getToken());
                  alert('Token logged to console');
                }}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                🔍 Debug Token
              </button>
            )}
          </div>
        </div>

        {/* Login Required */}
        {!hasToken && (
          <div className="max-w-2xl mx-auto mb-12 p-6 bg-yellow-50 border-2 border-yellow-300 rounded-2xl">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-500 text-white rounded-xl flex items-center justify-center mr-4">
                !
              </div>
              <div>
                <h3 className="text-xl font-bold text-yellow-800">Login Required</h3>
                <p className="text-yellow-700">
                  No valid token found. <button onClick={() => window.location.href = '/login'} className="underline font-semibold">Click to login →</button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-6 bg-red-50 border-2 border-red-300 rounded-2xl">
            <div className="flex items-center text-red-800">
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">{error}</span>
            </div>
          </div>
        )}

        {/* Upload Area - UNCHANGED WORKING */}
        <div className="max-w-2xl mx-auto mb-16">
          <div 
            className={`
              bg-white/80 backdrop-blur-xl rounded-3xl p-12 md:p-16 border-4 border-dashed shadow-2xl transition-all duration-500 cursor-pointer hover:shadow-3xl
              ${dragActive ? 'border-emerald-500 bg-emerald-50/80 ring-4 ring-emerald-200 scale-105' : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/60'}
              ${!hasToken ? 'opacity-60 cursor-not-allowed' : ''}
            `}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={hasToken ? handleClickUpload : undefined}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileInput}
              className="hidden"
              disabled={!hasToken}
            />

            {/* Rest of JSX unchanged... */}
            {!fileSelected ? (
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl mx-auto mb-8 p-6 shadow-xl flex items-center justify-center hover:scale-110 transition-transform">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 16l4-4m0 0l-4-4m4 4H7m6 0v1m-4-4v1m0 2v1m0-6V7m6 6V7m0 0v1m0-2h4m-2 0h2m-2 0H9" />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {dragActive ? 'Drop your PDF!' : 'Drop your resume here'}
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-sm mx-auto">
                  Drag & drop your PDF (max 10MB) or click anywhere
                </p>
                {!hasToken && <p className="text-sm text-yellow-600 font-medium bg-yellow-100 px-4 py-2 rounded-xl">Login to upload files</p>}
              </div>
            ) : (
              <div className="text-center">
                <div className="w-28 h-28 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3 truncate px-4">{file?.name}</h3>
                <p className="text-xl font-mono text-emerald-600 mb-10 font-bold">
                  {(file?.size! / 1024 / 1024).toFixed(1)} MB
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xs mx-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleAnalyze();
                    }}
                    disabled={analyzing || !hasToken}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center h-14 text-lg"
                  >
                    {analyzing ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      '🚀 Analyze Resume'
                    )}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleClear();
                    }}
                    disabled={analyzing}
                    className="px-6 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 h-14"
                  >
                    Change File
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results section unchanged... */}
        {analysisResult && (
          <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200 p-8 md:p-12">
            {/* Same results JSX as before */}
            <div className="text-center mb-12">
              <div className={`
                mx-auto w-28 h-28 md:w-36 md:h-36 rounded-3xl flex items-center justify-center text-4xl md:text-5xl font-black shadow-2xl mb-6 ring-4 ring-white
                ${analysisResult.ats_score >= 80 ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' :
                  analysisResult.ats_score >= 60 ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' :
                  'bg-gradient-to-r from-red-500 to-rose-500 text-white'}
              `}>
                {analysisResult.ats_score}%
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Analysis Complete!</h2>
              <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto font-medium">
                {analysisResult.recommendation}
              </p>
            </div>
            {/* Rest of results unchanged */}
          </div>
        )}
      </div>
    </div>
  );
};

export { FileUpload };
export default FileUpload;
