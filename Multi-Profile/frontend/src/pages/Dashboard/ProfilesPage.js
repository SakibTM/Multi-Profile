// frontend/src/pages/Dashboard/ProfilesPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import profileService from '../../services/profileService';

const ProfilesPage = () => {
  const { currentUser } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  const [filterStorage, setFilterStorage] = useState('all');

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfiles();
      setProfiles(data);
    } catch (err) {
      setError('Failed to fetch profiles. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async (id) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      try {
        await profileService.deleteProfile(id);
        setProfiles(profiles.filter(profile => profile._id !== id));
      } catch (err) {
        setError('Failed to delete profile. Please try again.');
        console.error(err);
      }
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = filterGroup === 'all' || profile.group === filterGroup;
    const matchesStorage = filterStorage === 'all' || profile.storageType === filterStorage;
    
    return matchesSearch && matchesGroup && matchesStorage;
  });

  // Get unique groups for filter
  const groups = [...new Set(profiles.map(profile => profile.group).filter(Boolean))];

  return (
    <div>
      <div className="px-4 py-6 sm:px-0">
        <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Browser Profiles
          </h3>
          <div className="mt-3 sm:mt-0 sm:ml-4">
            <Link
              to="/dashboard/profiles/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Profile
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                  <span className="text-indigo-600 text-xl">🌐</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Profiles
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {profiles.length}
                      </div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <span>/ {currentUser?.profileLimit || 10}</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <span className="text-green-600 text-xl">☁️</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Cloud Profiles
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {profiles.filter(p => p.storageType === 'cloud').length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <span className="text-blue-600 text-xl">💾</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Local Profiles
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {profiles.filter(p => p.storageType === 'local').length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Your Browser Profiles
              </h3>
              <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search profiles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={filterGroup}
                  onChange={(e) => setFilterGroup(e.target.value)}
                >
                  <option value="all">All Groups</option>
                  {groups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
                
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={filterStorage}
                  onChange={(e) => setFilterStorage(e.target.value)}
                >
                  <option value="all">All Storage</option>
                  <option value="local">Local</option>
                  <option value="cloud">Cloud</option>
                </select>
              </div>
            </div>
          </div>
          
          <ul className="divide-y divide-gray-200">
            {loading ? (
              <li className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-gray-500">Loading profiles...</span>
                </div>
              </li>
            ) : filteredProfiles.length === 0 ? (
              <li className="px-4 py-12 sm:px-6 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No profiles</h3>
                <div className="mt-1 text-sm text-gray-500">
                  <p>Get started by creating a new browser profile.</p>
                </div>
                <div className="mt-6">
                  <Link
                    to="/dashboard/profiles/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    New Profile
                  </Link>
                </div>
              </li>
            ) : (
              filteredProfiles.map((profile) => (
                <li key={profile._id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="min-w-0 flex-1 flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center">
                              <span className="text-indigo-800">
                                {profile.browserType === 'chrome' ? '🌐' : '🦊'}
                              </span>
                            </div>
                          </div>
                          <div className="min-w-0 flex-1 px-4">
                            <div>
                              <p className="text-sm font-medium text-indigo-600 truncate">
                                {profile.name}
                              </p>
                              <p className="mt-1 flex items-center text-sm text-gray-500">
                                <span className="truncate">
                                  {profile.group || 'No Group'}
                                </span>
                                <span className="mx-2">•</span>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  profile.storageType === 'cloud' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {profile.storageType === 'cloud' ? 'Cloud' : 'Local'}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => window.location.href = `/dashboard/profiles/${profile._id}/launch`}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              Launch
                            </button>
                            <Link
                              to={`/dashboard/profiles/${profile._id}/edit`}
                              className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteProfile(profile._id)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="text-sm text-gray-500">
                          Created: {new Date(profile.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilesPage;