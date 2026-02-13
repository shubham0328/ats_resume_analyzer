import React, { useState } from 'react';
import { FileUpload } from './FileUpload';

interface Props {
  user: { id: number; email: string; is_active: boolean };
  onLogout: () => void;
}

const Dashboard: React.FC<Props> = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState<'overview' | 'upload'>('overview');

  return (
    <div className="min-h-screen bg-gray-100 font-sans overflow-hidden">
      {/* === FIXED FULL-WIDTH NAVBAR (Always Perfect) === */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-gray-200 px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Logo + Menu */}
          <div className="flex items-center space-x-4">
            <button 
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">RA</span>
              </div>
              <div>
                <h1 className="font-semibold text-xl text-gray-900 leading-tight">Resume Analyzer</h1>
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
            </div>
          </div>

          {/* Right: Stats + Profile */}
          <div className="flex items-center space-x-8">
            {/* Mini Stats */}
            <div className="flex items-center space-x-8 hidden md:flex">
              <div className="text-center">
                <div className="font-bold text-lg text-indigo-600">16</div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">Resumes</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-emerald-600">85%</div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">Avg Score</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-purple-600">3</div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">Analyzed</div>
              </div>
            </div>

            {/* Profile Dropdown */}
            <div className="flex items-center space-x p-2 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors group ml-16">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white font-semibold text-sm">{user.email.charAt(0).toUpperCase()}</span>
              </div>
              <div className="hidden sm:block">
                <div className="font-medium text-sm text-gray-900 truncate max-w-32">{user.email}</div>
                <div className="text-xs text-gray-500">Admin</div>
              </div>
              <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-4rem)] pt-16 lg:pt-20">
        {/* === SIDEBAR (Always Visible on Desktop) === */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-2xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <div className="p-6 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-8 pb-6 border-b border-gray-200 flex-shrink-0">Navigation</h3>
            <nav className="flex-1 space-y-1">
              <button
                onClick={() => {
                  setActivePage('overview');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl font-medium transition-all duration-200 group ${
                  activePage === 'overview'
                    ? 'bg-indigo-50 border-r-4 border-indigo-500 text-indigo-800 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                }`}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="truncate">Dashboard</span>
              </button>

              <button
                onClick={() => {
                  setActivePage('upload');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl font-medium transition-all duration-200 group ${
                  activePage === 'upload'
                    ? 'bg-emerald-50 border-r-4 border-emerald-500 text-emerald-800 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                }`}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="truncate">Upload Resume</span>
              </button>
            </nav>

            <div className="mt-8 pt-6 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={onLogout}
                className="w-full flex items-center space-x-3 p-3 text-red-600 font-medium hover:bg-red-50 rounded-xl hover:shadow-sm transition-all duration-200 group"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4-4H7m6 4v12a2 2 0 01-2 2 2 2 0 01-2-2V5" />
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* === MAIN CONTENT (Perfect Spacing Always) === */}
        <main className={`flex-1 w-full overflow-auto transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-0' : 'lg:ml-64'
        }`}>
          <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
            {activePage === 'overview' && (
              <>
                {/* === ROW 1: Stats Cards === */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Resumes</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">16</p>
                      </div>
                      <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-emerald-600 font-medium">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>12% from last week</span>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Avg Score</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">85%</p>
                      </div>
                      <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-emerald-600 font-medium">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>2% increase</span>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Analyzed Today</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">3</p>
                      </div>
                      <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-gray-600 font-medium">
                      <span>Compared to 2 yesterday</span>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Pending</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">5</p>
                      </div>
                      <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-orange-600 font-medium">
                      <span>Waiting for analysis</span>
                    </div>
                  </div>
                </div>

                {/* === ROW 2: Charts + Recent Activity === */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Charts Column */}
                  <div className="xl:col-span-2 space-y-6">
                    {/* Chart 1: Line Chart */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Score Trends</h3>
                        <select className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                          <option>Last 30 days</option>
                          <option>Last 90 days</option>
                          <option>Last 6 months</option>
                        </select>
                      </div>
                      <div className="h-80 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <svg className="w-16 h-16 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <p>Chart placeholder - Connect Chart.js</p>
                        </div>
                      </div>
                    </div>

                    {/* Recent Resumes Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="p-8 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Resumes</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Score</th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Uploaded</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <span className="text-indigo-600 font-semibold">JD</span>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">John Doe</div>
                                    <div className="text-xs text-gray-500">john@example.com</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex px-3 py-1 text-sm font-semibold bg-emerald-100 text-emerald-800 rounded-full">92%</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex px-3 py-1 text-sm font-semibold bg-green-100 text-green-800 rounded-full">Completed</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">2 hours ago</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                    <span className="text-purple-600 font-semibold">JS</span>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">Jane Smith</div>
                                    <div className="text-xs text-gray-500">jane@example.com</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex px-3 py-1 text-sm font-semibold bg-yellow-100 text-yellow-800 rounded-full">78%</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex px-3 py-1 text-sm font-semibold bg-yellow-100 text-yellow-800 rounded-full">Processing</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">5 hours ago</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Quick Stats + Activity */}
                  <div className="space-y-6">
                    {/* Activity Feed */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3 p-4 bg-indigo-50 rounded-xl">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Resume analyzed</p>
                            <p className="text-xs text-gray-500">John Doe - 92% score</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 p-4 bg-emerald-50 rounded-xl">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">New resume uploaded</p>
                            <p className="text-xs text-gray-500">Jane Smith</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
                      <div className="space-y-3">
                        <button className="w-full flex items-center space-x-3 p-4 hover:bg-indigo-50 rounded-xl transition-colors">
                          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <span className="font-medium text-gray-900">Upload New Resume</span>
                        </button>
                        <button className="w-full flex items-center space-x-3 p-4 hover:bg-emerald-50 rounded-xl transition-colors">
                          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                          </div>
                          <span className="font-medium text-gray-900">View Reports</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activePage === 'upload' && <FileUpload />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
