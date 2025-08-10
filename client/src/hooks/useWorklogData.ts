import { useQuery } from "@tanstack/react-query";
import type { DashboardData } from "@shared/schema";
import { format } from "date-fns";

// Mock data for static deployment
const mockDashboardData: DashboardData = {
  totalHours: "32.5h",
  activeAssignees: 4,
  tasksWorked: 12,
  worklogDate: "Friday, December 15, 2023",
  selectedGroup: null,
  assigneeWorklogs: [
    {
      assigneeId: "user1",
      name: "John Doe",
      email: "john.doe@company.com",
      initials: "JD",
      tasksCount: 5,
      hoursLogged: "8.5h",
      progressPercent: 85,
      status: "Active" as const,
    },
    {
      assigneeId: "user2",
      name: "Sarah Adams",
      email: "sarah.adams@company.com",
      initials: "SA",
      tasksCount: 3,
      hoursLogged: "7.0h",
      progressPercent: 70,
      status: "Active" as const,
    },
    {
      assigneeId: "user3",
      name: "Mike Johnson",
      email: "mike.johnson@company.com",
      initials: "MJ",
      tasksCount: 4,
      hoursLogged: "9.0h",
      progressPercent: 100,
      status: "Active" as const,
    },
    {
      assigneeId: "user4",
      name: "Lisa Chen",
      email: "lisa.chen@company.com",
      initials: "LC",
      tasksCount: 0,
      hoursLogged: "0.0h",
      progressPercent: 0,
      status: "Inactive" as const,
    },
  ],
  tasks: [
    {
      key: "DEV-1234",
      summary: "Implement user authentication flow",
      status: "In Progress",
      assignee: "John Doe",
      worklogHours: "2.5h",
    },
    {
      key: "DEV-1235",
      summary: "Fix responsive layout on mobile devices",
      status: "Done",
      assignee: "Sarah Adams",
      worklogHours: "4.0h",
    },
    {
      key: "DEV-1236",
      summary: "Optimize database queries",
      status: "In Progress",
      assignee: "Mike Johnson",
      worklogHours: "3.5h",
    },
  ],
};

export function useWorklogData(selectedGroup?: string | null, selectedDate?: Date | null) {
  return useQuery<DashboardData>({
    queryKey: ['/api/dashboard', selectedGroup, selectedDate],
    queryFn: async () => {
      // Check if we're in a static deployment (no backend available)
      const isStatic = !window.location.origin.includes('localhost') && !window.location.origin.includes('127.0.0.1');
      
      if (isStatic) {
        // Return mock data for static deployment
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
        return mockDashboardData;
      }
      
      const params = new URLSearchParams();
      if (selectedGroup) {
        params.append('group', selectedGroup);
      }
      if (selectedDate) {
        params.append('date', format(selectedDate, 'yyyy-MM-dd'));
      }
      const url = `/api/dashboard${params.toString() ? `?${params.toString()}` : ''}`;
      
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        return response.json();
      } catch (error) {
        // Fallback to mock data if API fails
        console.warn('API not available, using mock data:', error);
        return mockDashboardData;
      }
    },
    refetchOnMount: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
