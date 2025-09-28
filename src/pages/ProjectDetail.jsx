// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { projectService } from '../services/projectService'

export default function ProjectDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [project, setProject] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadProjectData()
  }, [id])

  const loadProjectData = async () => {
    try {
      console.log('Loading project data for:', id) // Debug log
      // Note: We don't have a single project endpoint, so we'll get it from the projects list
      const response = await projectService.getProjects()
      const foundProject = response.projects.find(p => p._id === id)
      
      if (foundProject) {
        setProject(foundProject)
        await loadMessages()
      } else {
        setError('Project not found')
      }
    } catch (error) {
      console.error('Error loading project:', error) // Debug log
      setError('Failed to load project')
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async () => {
    try {
      const response = await projectService.getProjectMessages(id)
      setMessages(response.messages || [])
    } catch (error) {
      console.error('Error loading messages:', error) // Debug log
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      console.log('Sending message:', newMessage) // Debug log
      await projectService.sendMessage(id, newMessage)
      setNewMessage('')
      await loadMessages() // Reload messages
    } catch (error) {
      console.error('Error sending message:', error) // Debug log
      setError('Failed to send message')
    }
  }

  const handleAssignToProject = async () => {
    try {
      console.log('Assigning to project:', id) // Debug log
      await projectService.assignToProject(id)
      await loadProjectData() // Reload project data
    } catch (error) {
      console.error('Error assigning to project:', error) // Debug log
      setError('Failed to assign to project')
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'communication', name: 'Communication' },
    { id: 'progress', name: 'Progress' },
    { id: 'resources', name: 'Resources' }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project?.title}</h1>
            <div className="mt-2 flex items-center space-x-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                project?.status === 'open' ? 'bg-green-100 text-green-800' :
                project?.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {project?.status?.replace('_', ' ')}
              </span>
              {project?.deadline && (
                <span className="text-sm text-gray-500">
                  Due: {new Date(project.deadline).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          
          {user?.role !== 'nonprofit' && project?.status === 'open' && (
            <button
              onClick={handleAssignToProject}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Join Project
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white shadow rounded-lg">
        {activeTab === 'overview' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Project Description</h3>
            <p className="text-gray-700 mb-6">{project?.description}</p>
            
            {project?.requirements && project.requirements.length > 0 && (
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">Requirements</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {project.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900">Status</h5>
                <p className="text-gray-600 capitalize">{project?.status?.replace('_', ' ')}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900">Assigned Students</h5>
                <p className="text-gray-600">{project?.assigned_students?.length || 0}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900">Created</h5>
                <p className="text-gray-600">{new Date(project?.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'communication' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Project Communication</h3>
            
            {/* Messages */}
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No messages yet. Start the conversation!</p>
              ) : (
                messages.map((message) => (
                  <div key={message._id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        {message.sender_id === user?.id ? 'You' : 'Team Member'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(message.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{message.content}</p>
                  </div>
                ))
              )}
            </div>
            
            {/* Send Message Form */}
            <form onSubmit={handleSendMessage} className="flex space-x-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Send
              </button>
            </form>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Progress Tracking</h3>
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Progress tracking coming soon</h3>
              <p className="mt-1 text-sm text-gray-500">Milestones and progress reports will be available here.</p>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Project Resources</h3>
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No resources yet</h3>
              <p className="mt-1 text-sm text-gray-500">Project resources and documents will appear here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

