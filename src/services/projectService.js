// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import api from './authService'

export const projectService = {
  async getProjects() {
    const response = await api.get('/projects')
    return response.data
  },

  async createProject(projectData) {
    const response = await api.post('/projects', projectData)
    return response.data
  },

  async getProject(projectId) {
    const response = await api.get(`/projects/${projectId}`)
    return response.data
  },

  async assignToProject(projectId) {
    const response = await api.post(`/projects/${projectId}/assign`)
    return response.data
  },

  async getProjectMessages(projectId) {
    const response = await api.get(`/projects/${projectId}/messages`)
    return response.data
  },

  async sendMessage(projectId, content) {
    const response = await api.post(`/projects/${projectId}/messages`, { content })
    return response.data
  },

  async getMilestones(projectId) {
    const response = await api.get(`/projects/${projectId}/milestones`)
    return response.data
  },

  async createMilestone(projectId, milestoneData) {
    const response = await api.post(`/projects/${projectId}/milestones`, milestoneData)
    return response.data
  },

  async getProgressReports(projectId) {
    const response = await api.get(`/projects/${projectId}/progress-reports`)
    return response.data
  },

  async createProgressReport(projectId, reportData) {
    const response = await api.post(`/projects/${projectId}/progress-reports`, reportData)
    return response.data
  },

  async getProjectResources(projectId) {
    const response = await api.get(`/projects/${projectId}/resources`)
    return response.data
  }
}

export const resourceService = {
  async getResources(searchQuery = '') {
    const url = searchQuery ? `/resources?search=${encodeURIComponent(searchQuery)}` : '/resources'
    const response = await api.get(url)
    return response.data
  },

  async createResource(resourceData) {
    const response = await api.post('/resources', resourceData)
    return response.data
  }
}

