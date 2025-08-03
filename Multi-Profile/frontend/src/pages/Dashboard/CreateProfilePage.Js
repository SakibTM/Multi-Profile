// frontend/src/pages/Dashboard/CreateProfilePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import profileService from '../../services/profileService';

const CreateProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  
  const [profileData, setProfileData] = useState({
    name: '',
    group: '',
    browserType: 'chrome',
    storageType: 'local',
    notes: '',
    // Fingerprint settings
    userAgent: '',
    platform: '',
    language: 'en-US',
    screenResolution: '1920x1080',
    timezone: 'America/New_York',
    webRTC: {
      mode: 'default',
      publicIP: '',
      localIPs: []
    },
    // Proxy settings
    proxy: {
      enabled: false,
      type: 'http',
      host: '',
      port: '',
      username: '',
      password: ''
    },
    // Advanced settings
    headless: false,
    launchArgs: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleNestedInputChange = (parent, field, value) => {
    setProfileData({
      ...profileData,
      [parent]: {
        ...profileData[parent],
        [field]: value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await profileService.createProfile(profileData);
      navigate('/dashboard/profiles');
    } catch (err) {
      setError(err.message || 'Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'General Settings' },
    { id: 'fingerprint', name: 'Browser Fingerprint' },
    { id: 'proxy', name: 'Proxy Settings' },
    { id: 'advanced', name: 'Advanced Settings' }
  ];

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Create New Browser Profile
        </h3>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/profiles')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            Create Profile
          </button>
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

      <div className="mt-6">
        <div className="sm:hidden">
          <select
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.name}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* General Settings Tab */}
        {activeTab === 'general' && (
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">General Information</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Basic information about your browser profile.
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Profile Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={profileData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-4">
                    <label htmlFor="group" className="block text-sm font-medium text-gray-700">
                      Group
                    </label>
                    <input
                      type="text"
                      name="group"
                      id="group"
                      value={profileData.group}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="browserType" className="block text-sm font-medium text-gray-700">
                      Browser Type
                    </label>
                    <select
                      id="browserType"
                      name="browserType"
                      value={profileData.browserType}
                      onChange={handleInputChange}
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="chrome">Chrome</option>
                      <option value="firefox">Firefox</option>
                    </select>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="storageType" className="block text-sm font-medium text-gray-700">
                      Storage Type
                    </label>
                    <select
                      id="storageType"
                      name="storageType"
                      value={profileData.storageType}
                      onChange={handleInputChange}
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="local">Local</option>
                      <option value="cloud">Cloud</option>
                    </select>
                  </div>

                  <div className="col-span-6">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={profileData.notes}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Browser Fingerprint Tab */}
        {activeTab === 'fingerprint' && (
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Browser Fingerprint</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Customize how your browser appears to websites.
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6">
                    <label htmlFor="userAgent" className="block text-sm font-medium text-gray-700">
                      User Agent
                    </label>
                    <input
                      type="text"
                      name="userAgent"
                      id="userAgent"
                      value={profileData.userAgent}
                      onChange={handleInputChange}
                      placeholder="Leave empty for random"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
                      Platform
                    </label>
                    <select
                      id="platform"
                      name="platform"
                      value={profileData.platform}
                      onChange={handleInputChange}
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Random</option>
                      <option value="Win32">Windows</option>
                      <option value="MacIntel">macOS</option>
                      <option value="Linux x86_64">Linux</option>
                    </select>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                      Language
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={profileData.language}
                      onChange={handleInputChange}
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="en-US">English (US)</option>
                      <option value="en-GB">English (UK)</option>
                      <option value="de-DE">German</option>
                      <option value="fr-FR">French</option>
                      <option value="es-ES">Spanish</option>
                    </select>
                  </div>

                  <div className="col-span-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="webRTC-enabled"
                          name="webRTC-enabled"
                          type="checkbox"
                          checked={profileData.webRTC.mode !== 'disabled'}
                          onChange={(e) => handleNestedInputChange('webRTC', 'mode', e.target.checked ? 'default' : 'disabled')}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="webRTC-enabled" className="font-medium text-gray-700">
                          Enable WebRTC
                        </label>
                        <p className="text-gray-500">Allow WebRTC for real-time communication.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Proxy Settings Tab */}
        {activeTab === 'proxy' && (
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Proxy Settings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configure proxy settings for this browser profile.
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="proxy-enabled"
                        name="proxy-enabled"
                        type="checkbox"
                        checked={profileData.proxy.enabled}
                        onChange={(e) => handleNestedInputChange('proxy', 'enabled', e.target.checked)}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="proxy-enabled" className="font-medium text-gray-700">
                        Enable Proxy
                      </label>
                      <p className="text-gray-500">Route browser traffic through a proxy server.</p>
                    </div>
                  </div>

                  {profileData.proxy.enabled && (
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="proxy-type" className="block text-sm font-medium text-gray-700">
                          Proxy Type
                        </label>
                        <select
                          id="proxy-type"
                          name="proxy-type"
                          value={profileData.proxy.type}
                          onChange={(e) => handleNestedInputChange('proxy', 'type', e.target.value)}
                          className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="http">HTTP</option>
                          <option value="https">HTTPS</option>
                          <option value="socks4">SOCKS4</option>
                          <option value="socks5">SOCKS5</option>
                        </select>
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="proxy-host" className="block text-sm font-medium text-gray-700">
                          Proxy Host
                        </label>
                        <input
                          type="text"
                          name="proxy-host"
                          id="proxy-host"
                          required={profileData.proxy.enabled}
                          value={profileData.proxy.host}
                          onChange={(e) => handleNestedInputChange('proxy', 'host', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="proxy-port" className="block text-sm font-medium text-gray-700">
                          Proxy Port
                        </label>
                        <input
                          type="number"
                          name="proxy-port"
                          id="proxy-port"
                          required={profileData.proxy.enabled}
                          value={profileData.proxy.port}
                          onChange={(e) => handleNestedInputChange('proxy', 'port', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="proxy-username" className="block text-sm font-medium text-gray-700">
                          Username (Optional)
                        </label>
                        <input
                          type="text"
                          name="proxy-username"
                          id="proxy-username"
                          value={profileData.proxy.username}
                          onChange={(e) => handleNestedInputChange('proxy', 'username', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="proxy-password" className="block text-sm font-medium text-gray-700">
                          Password (Optional)
                        </label>
                        <input
                          type="password"
                          name="proxy-password"
                          id="proxy-password"
                          value={profileData.proxy.password}
                          onChange={(e) => handleNestedInputChange('proxy', 'password', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Settings Tab */}
        {activeTab === 'advanced' && (
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Advanced Settings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configure advanced browser settings.
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="headless"
                        name="headless"
                        type="checkbox"
                        checked={profileData.headless}
                        onChange={(e) => setProfileData({...profileData, headless: e.target.checked})}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="headless" className="font-medium text-gray-700">
                        Headless Mode
                      </label>
                      <p className="text-gray-500">Run browser without visible UI.</p>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="launchArgs" className="block text-sm font-medium text-gray-700">
                      Browser Launch Arguments
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="launchArgs"
                        name="launchArgs"
                        rows={4}
                        value={profileData.launchArgs.join('\n')}
                        onChange={(e) => setProfileData({
                          ...profileData, 
                          launchArgs: e.target.value.split('\n').filter(arg => arg.trim())
                        })}
                        placeholder="Enter one argument per line"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Additional command-line arguments to pass when launching the browser.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateProfilePage;