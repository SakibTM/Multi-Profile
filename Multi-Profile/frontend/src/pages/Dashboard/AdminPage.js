// frontend/src/pages/Dashboard/AdminPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminService';

const AdminPage = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [profileLimit, setProfileLimit] = useState('');
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [isUserActive, setIsUserActive] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setProfileLimit(user.profileLimit || '');
    setIsUnlimited(user.unlimitedProfiles || false);
    setIsUserActive(user.isActive !== false);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    
    try {
      const updateData = {
        profileLimit: isUnlimited ? -1 : parseInt(profileLimit, 10),
        unlimitedProfiles: isUnlimited,
        isActive: isUserActive
      };
      
      await adminService.updateUser(selectedUser._id, updateData);
      
      // Update the user in the list
      setUsers(users.map(user => 
        user._id === selectedUser._id 
          ? { ...user, ...updateData } 
          : user
      ));
      
      // Update the selected user
      setSelectedUser({ ...selectedUser, ...updateData });
      
      setError('');
    } catch (err) {
      setError('Failed to update user. Please try again.');
      console.error(err);
    }
  };

  const handleToggleUserStatus = async (userId, isActive) => {
    try {
      await adminService.updateUser(userId, { isActive });
      
      // Update the user in the list
      setUsers(users.map(user => 
        user._id === userId 
          ? { ...user, isActive } 
          : user
      ));
      
      // Update the selected user if it's the one being edited
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser({ ...selectedUser, isActive });
        setIsUserActive(isActive);
      }
      
      setError('');
    } catch (err) {
      setError('Failed to update user status. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-b border-gray-200 pb-5">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Admin Panel
        </h3>
        <p className="mt-1 max-w-4xl text-sm text-gray-500">
          Manage users, profile limits, and account settings.
        </p>
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

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                <span className="text-indigo-600 text-xl">👥</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Users
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {users.length}
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
                <span className="text-green-600 text-xl">✅</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Users
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {users.filter(u => u.isActive !== false).length}
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
              <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                <span className="text-red-600 text-xl">❌</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Inactive Users
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {users.filter(u => u.isActive === false).length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                User Management
              </h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {loading ? (
                <li className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-gray-500">Loading users...</span>
                  </div>
                </li>
              ) : users.length === 0 ? (
                <li className="px-4 py-12 sm:px-6 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                </li>
              ) : (
                users.map((user) => (
                  <li key={user._id}>
                    <div className={`px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer ${selectedUser?._id === user._id ? 'bg-indigo-50' : ''}`} onClick={() => handleUserSelect(user)}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="min-w-0 flex-1 flex items-center">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-800 font-medium">
                                  {user.name?.charAt(0).toUpperCase() || 'U'}
                                </span>
                              </div>
                            </div>
                            <div className="min-w-0 flex-1 px-4">
                              <div>
                                <p className="text-sm font-medium text-indigo-600 truncate">
                                  {user.name}
                                </p>
                                <p className="mt-1 flex items-center text-sm text-gray-500">
                                  <span className="truncate">
                                    {user.email}
                                  </span>
                                  <span className="mx-2">•</span>
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    user.isActive !== false 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {user.isActive !== false ? 'Active' : 'Inactive'}
                                  </span>
                                  <span className="mx-2">•</span>
                                  <span className="truncate">
                                    {user.role === 'admin' ? 'Admin' : 'User'}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="flex space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleUserStatus(user._id, user.isActive === false);
                                }}
                                className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white ${
                                  user.isActive === false 
                                    ? 'bg-green-600 hover:bg-green-700' 
                                    : 'bg-red-600 hover:bg-red-700'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                              >
                                {user.isActive === false ? 'Activate' : 'Deactivate'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <div>
          {selectedUser ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Edit User
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {selectedUser.name} ({selectedUser.email})
                </p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="profileLimit" className="block text-sm font-medium text-gray-700">
                      Profile Limit
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="number"
                        name="profileLimit"
                        id="profileLimit"
                        disabled={isUnlimited}
                        value={profileLimit}
                        onChange={(e) => setProfileLimit(e.target.value)}
                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                        min="1"
                      />
                      <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        profiles
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="unlimitedProfiles"
                        name="unlimitedProfiles"
                        type="checkbox"
                        checked={isUnlimited}
                        onChange={(e) => setIsUnlimited(e.target.checked)}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="unlimitedProfiles" className="font-medium text-gray-700">
                        Unlimited Profiles
                      </label>
                      <p className="text-gray-500">Allow this user to create unlimited profiles.</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="isActive"
                        name="isActive"
                        type="checkbox"
                        checked={isUserActive}
                        onChange={(e) => setIsUserActive(e.target.checked)}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="isActive" className="font-medium text-gray-700">
                        Account Active
                      </label>
                      <p className="text-gray-500">Allow this user to access the platform.</p>
                    </div>
                  </div>

                  <div className="pt-5">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleUpdateUser}
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-12 sm:px-6 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No user selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select a user from the list to edit their settings.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;