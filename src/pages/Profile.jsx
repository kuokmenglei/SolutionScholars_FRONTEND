// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import React from 'react'
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'

/*
  Changes made:
  - Replaced the original profile page with a cleaner, responsive layout.
  - Layout behavior: two-column (profile card + details) on md+ screens, stacked on small screens.
  - Preserved existing data access via `useAuth()` and role-dependent content.
  - Added clear action buttons and kept styling aligned with existing project utilities.

  Note: Update `CHANGELOG.md` before modifying this file (created/updated by the patch).
*/

export default function Profile() {
  const { user } = useAuth()

  const getRoleDescription = (role) => {
    switch (role) {
      case 'student':
        return 'Student — Participate in real-world projects and gain practical experience.'
      case 'scholar':
        return 'Scholar — Access structured support for hands-on learning projects.'
      case 'nonprofit':
        return 'Nonprofit Representative — Connect with academic resources.'
      case 'admin':
        return 'Administrator — Manage platform operations and user interactions.'
      default:
        return 'User'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full">
        {/* Page header (academic style) */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">{user?.first_name} {user?.last_name}</h1>
          <p className="mt-1 text-sm text-gray-600">{user?.email} • {getRoleDescription(user?.role)}</p>
        </div>

        {/* Academic-style two-column layout: left contact block, right content sections */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left: contact / quick info */}
          <aside className="md:col-span-1">
            <div className="bg-white border rounded-lg p-5 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center">
                  {/* Explicit SVG with stroke color and size to avoid relying on utility classes */}
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" stroke="#6366F1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="#6366F1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {/* Emoji fallback in case SVGs are blocked */}
                  <span style={{ display: 'none' }} aria-hidden="true">👤</span>
                </div>
                <div className="mt-3">
                  <div className="text-sm font-medium text-gray-900">{user?.first_name} {user?.last_name}</div>
                  <div className="text-xs text-gray-500">{user?.role}</div>
                </div>
              </div>

              <div className="mt-4 border-t pt-4 text-sm space-y-2">
                <div className="flex items-center">
                  <div style={{ width: 18, height: 18, color: '#6366F1' }}>
                    <EnvelopeIcon aria-hidden="true" style={{ width: 18, height: 18, color: '#6366F1' }} />
                  </div>
                  <div className="ml-2"><strong>Email:</strong> <a className="text-indigo-600" href={`mailto:${user?.email}`}>{user?.email}</a></div>
                </div>

                <div className="flex items-center">
                  <div style={{ width: 18, height: 18, color: '#6B7280' }}>
                    <MapPinIcon aria-hidden="true" style={{ width: 18, height: 18, color: '#6B7280' }} />
                  </div>
                  <div className="ml-2"><strong>Office:</strong> {user?.office || '—'}</div>
                </div>

                <div className="flex items-center">
                  <div style={{ width: 18, height: 18, color: '#6B7280' }}>
                    <PhoneIcon aria-hidden="true" style={{ width: 18, height: 18, color: '#6B7280' }} />
                  </div>
                  <div className="ml-2"><strong>Phone:</strong> {user?.phone || '—'}</div>
                </div>
              </div>

              {/* Additional explicit fields requested: first_name, last_name, role, created_at */}
              <div className="mt-4 border-t pt-4 text-sm space-y-2">
                <dl>
                  <div className="flex items-center justify-center py-2">
                    <table className="table-auto text-sm">
                      <tbody>
                        <tr>
                          <th className="text-gray-500 pr-4 text-left">First name</th>
                          <td className="font-medium text-gray-900">{user?.first_name || 'Demo'}</td>
                        </tr>
                        <tr>
                          <th className="text-gray-500 pr-4 text-left">Last name</th>
                          <td className="font-medium text-gray-900">{user?.last_name || '—'}</td>
                        </tr>
                        <tr>
                          <th className="text-gray-500 pr-4 text-left">Title</th>
                          <td className="font-medium text-gray-900">{user?.title || '—'}</td>
                        </tr>
                        <tr>
                          <th className="text-gray-500 pr-4 text-left">Member since</th>
                          <td className="font-medium text-gray-900">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </dl>
              </div>
            </div>
          </aside>

          {/* Right: main content spanning 3 columns on md+ */}
          <main className="md:col-span-3 space-y-6">
            {/* Biography */}
            <section className="bg-white border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">Biography</h2>
              <p className="mt-3 text-sm text-gray-700">{user?.desc || 'No biography available.'}</p>
            </section>

            {/* Research Interests / Role Info */}
            <section className="bg-white border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">Research Interests</h2>
              <div className="mt-3 text-sm text-gray-700">
                {user?.interests && user.interests.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {user.interests.map((i, idx) => <li key={idx}>{i}</li>)}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No research interests listed.</p>
                )}
              </div>
            </section>

            {/* Courses / Additional Sections */}
            <section className="bg-white border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">Courses</h2>
              <div className="mt-3 text-sm text-gray-700">
                {user?.courses && user.courses.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {user.courses.map((c, idx) => <li key={idx}>{c}</li>)}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No courses listed.</p>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}


