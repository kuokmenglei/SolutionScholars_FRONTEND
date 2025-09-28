// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { projectService } from '../services/projectService'

export default function Dashboard() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      console.log('Loading projects for dashboard') // Debug log
      const response = await projectService.getProjects()
      setProjects(response.projects || [])
    } catch (error) {
      console.error('Error loading projects:', error) // Debug log
      setError('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const getRoleDescription = (role) => {
    switch (role) {
      case 'student':
        return 'Participate in real-world projects and gain practical experience'
      case 'scholar':
        return 'Access structured support for hands-on learning projects'
      case 'nonprofit':
        return 'Connect with academic resources to solve organizational challenges'
      case 'admin':
        return 'Manage platform operations and user interactions'
      default:
        return 'Welcome to Solution Scholars'
    }
  }

  const getProjectStats = () => {
    const openProjects = projects.filter(p => p.status === 'open').length
    const inProgressProjects = projects.filter(p => p.status === 'in_progress').length
    const completedProjects = projects.filter(p => p.status === 'completed').length

    return { openProjects, inProgressProjects, completedProjects }
  }

  const stats = getProjectStats()

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{getGreeting()}, {user?.first_name} {user?.last_name}</h1>
            <p className="mt-2 text-sm text-gray-600">{getRoleDescription(user?.role)}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/projects" className="btn btn-ghost">View Projects</Link>
            {user?.role === 'nonprofit' ? (
              <Link to="/projects/new" className="btn btn-primary">New Project</Link>
            ) : (
              <Link to="/profile" className="btn">Profile</Link>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Stats Cards (single-line) */}
      <div className="flex flex-row gap-6 mb-8 items-stretch justify-between">
        {[{
          label: 'Open Projects',
          value: stats.openProjects,
          color: '#10b981'
        }, {
          label: 'In Progress',
          value: stats.inProgressProjects,
          color: '#f59e0b'
        }, {
          label: 'Completed',
          value: stats.completedProjects,
          color: '#3b82f6'
        }].map((card) => (
          <div key={card.label} className="card stats-card">
            <div className="p-3 flex items-center gap-4">
              <div style={{ width: 40, height: 40, borderRadius: 999, background: card.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, background: card.color }} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-600">{card.label}</div>
                <div className="text-lg font-bold text-gray-900">{card.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Layout change: place Quick Actions and Recent Projects side-by-side on large screens, stacked on small screens */}
      <div className="mb-8 flex flex-col lg:flex-row lg:items-start lg:space-x-6 gap-6">
        {/* Quick Actions column (left) */}
        <div className="lg:w-1/3">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <Link to="/projects" className="card hover:shadow">
              <div className="flex items-start gap-4">
                <div style={{ width: 44, height: 44, borderRadius: 10, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>
                </div>
                <div>
                  <h4 className="text-base font-medium text-gray-900">View All Projects</h4>
                  <p className="mt-1 text-sm text-gray-500">Browse and manage all available projects</p>
                </div>
              </div>
            </Link>

            <Link to="/profile" className="card hover:shadow">
              <div className="flex items-start gap-4">
                <div style={{ width: 44, height: 44, borderRadius: 10, background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                </div>
                <div>
                  <h4 className="text-base font-medium text-gray-900">Update Profile</h4>
                  <p className="mt-1 text-sm text-gray-500">Manage your account settings and preferences</p>
                </div>
              </div>
            </Link>

            {user?.role === 'nonprofit' && (
              <Link to="/projects/new" className="card hover:shadow">
                <div className="flex items-start gap-4">
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: '#fbf0ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-gray-900">Create New Project</h4>
                    <p className="mt-1 text-sm text-gray-500">Post a new project for students to work on</p>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Recent Projects column (right) */}
        <div className="lg:flex-1">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Projects</h3>
                <Link to="/projects" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  View all
                </Link>
              </div>

              {projects.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto text-gray-400" style={{ width: '30%', height: '30%' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No projects yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by exploring available projects.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.slice(0, 3).map((project) => (
                    <div key={project._id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{project.title}</h4>
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{project.description}</p>
                          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                             ${project.status === 'open' ? 'bg-green-100 text-green-800' :
                                project.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-blue-100 text-blue-800'
                              }`} style={{ padding: '10px' }}>
                              {project.status.replace('_', ' ')}
                            </span>
                            {project.deadline && (
                              <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                        <Link
                          to={`/projects/${project._id}`}
                          className="ml-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

