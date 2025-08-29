// Cleanup script - files that were moved to /pages/
const oldFiles = [
  '/components/Dashboard.tsx',
  '/components/Login.tsx', 
  '/components/NewsDetail.tsx',
  '/components/NewsManagement.tsx',
  '/components/Profile.tsx',
  '/components/VerificationQueue.tsx',
  '/components/WorkflowDashboard.tsx',
  '/components/CategoriesManagement.tsx',
  '/components/temp_files_to_remove.txt',
  '/delete_old_files.sh'
];

console.log('Files to be removed:', oldFiles);
console.log('These files have been moved to /pages/ directory');