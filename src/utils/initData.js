export const initializeData = () => {
  console.log("Initializing data...");

  if (localStorage.getItem("users")) {
    console.log("Users already exist, skipping initialization");
    return;
  }

  const defaultUsers = [
    {
      id: "1",
      username: "admin",
      password: "admin123",
      role: "admin",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      username: "student",
      password: "student123",
      role: "student",
      universityId: "2021001",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      username: "Ali Yaseen",
      password: "password123",
      role: "student",
      universityId: "2021002",
      createdAt: new Date().toISOString(),
    },
    {
      id: "4",
      username: "Braa Aeesh",
      password: "password123",
      role: "student",
      universityId: "2021003",
      createdAt: new Date().toISOString(),
    },
    {
      id: "5",
      username: "Ibn Al-Jawzee",
      password: "password123",
      role: "student",
      universityId: "2021004",
      createdAt: new Date().toISOString(),
    },
    {
      id: "6",
      username: "Ibn Malik",
      password: "password123",
      role: "student",
      universityId: "2021005",
      createdAt: new Date().toISOString(),
    },
    {
      id: "7",
      username: "Ayman Outom",
      password: "password123",
      role: "student",
      universityId: "2021006",
      createdAt: new Date().toISOString(),
    },
  ];

  const defaultProjects = [
    {
      id: "1",
      title: "Website Redesign",
      description: "Redesign the company website to improve user experience.",
      students: ["Student 1", "Student 2"],
      category: "Web Development",
      startDate: "2023-01-01",
      endDate: "2023-06-01",
      status: "Completed",
      progress: 100,
    },
    {
      id: "2",
      title: "Mobile App Development",
      description: "Develop a mobile application for our services.",
      students: ["Student 3", "Student 4"],
      category: "Mobile Development",
      startDate: "2023-02-15",
      endDate: "2023-08-15",
      status: "Completed",
      progress: 100,
    },
    {
      id: "3",
      title: "Data Analysis Project",
      description: "Analyze data from the last quarter to find insights.",
      students: ["Student 5"],
      category: "Data Science",
      startDate: "2023-03-01",
      endDate: "2023-05-01",
      status: "Completed",
      progress: 100,
    },
    {
      id: "4",
      title: "Machine Learning Model",
      description: "Create a machine learning model for predictions.",
      students: ["Student 1", "Student 3"],
      category: "Machine Learning",
      startDate: "2023-04-01",
      endDate: "2023-09-01",
      status: "Completed",
      progress: 100,
    },
    {
      id: "5",
      title: "Machine Learning Model",
      description: "Create a machine learning model for predictions 2.",
      students: ["Student 1", "Student 3"],
      category: "Machine Learning",
      startDate: "2023-04-01",
      endDate: "2026-09-01",
      status: "In Progress",
      progress: 56,
    },
  ];

  const defaultTasks = [
    {
      id: "1",
      projectId: "1",
      name: "Design Homepage",
      description: "Create a responsive design for the homepage.",
      assignedStudent: "Ali Yaseen",
      status: "In Progress",
      dueDate: "2023-04-22",
    },
    {
      id: "2",
      projectId: "1",
      name: "Develop API",
      description: "Set up the backend API for the project.",
      assignedStudent: "Braa Aeesh",
      status: "Completed",
      dueDate: "2023-01-16",
    },
    {
      id: "3",
      projectId: "2",
      name: "Write Documentation",
      description: "Document the project setup and usage.",
      assignedStudent: "Ibn Al-Jawzee",
      status: "Pending",
      dueDate: "2023-03-15",
    },
    {
      id: "4",
      projectId: "2",
      name: "Testing",
      description: "Conduct testing for all features.",
      assignedStudent: "Ibn Malik",
      status: "In Progress",
      dueDate: "2023-11-29",
    },
    {
      id: "5",
      projectId: "3",
      name: "Deploy Application",
      description: "Deploy the application to the production server.",
      assignedStudent: "Ayman Outom",
      status: "Pending",
      dueDate: "2023-03-24",
    },
  ];

  console.log("Saving default data to localStorage");

  localStorage.setItem("users", JSON.stringify(defaultUsers));
  localStorage.setItem("projects", JSON.stringify(defaultProjects));
  localStorage.setItem("tasks", JSON.stringify(defaultTasks));
  localStorage.setItem("dataInitialized", "true");

  console.log("Data initialization complete");
};
