import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'th';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Sidebar
    'sidebar.dashboard': 'Dashboard',
    'sidebar.newsManagement': 'News Management',
    'sidebar.categories': 'Categories',
    'sidebar.workflows': 'n8n Workflows',
    'sidebar.profile': 'Profile',
    'sidebar.signOut': 'Sign Out',
    'sidebar.changeLanguage': 'Change Language',
    'sidebar.language': 'Language',
    
    // Add Category Modal
    'category.addNew': 'Add New Category',
    'category.name': 'Category Name',
    'category.namePlaceholder': 'Enter category name',
    'category.description': 'Description',
    'category.descriptionPlaceholder': 'Describe what this category covers for AI classification',
    'category.color': 'Category Color',
    'category.cancel': 'Cancel',
    'category.add': 'Add Category',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.reset': 'Reset',
    'common.submit': 'Submit',
    'common.confirm': 'Confirm',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.noData': 'No data found',
    
    // News
    'news.title': 'Title',
    'news.category': 'Category',
    'news.status': 'Status',
    'news.date': 'Date',
    'news.actions': 'Actions',
    'news.verify': 'Verify',
    'news.reject': 'Reject',
    'news.pending': 'Pending',
    'news.verified': 'Verified',
    'news.rejected': 'Rejected',
    'news.published': 'Published',
    
    // Categories
    'categories.title': 'Categories',
    'categories.add': 'Add Category',
    'categories.search': 'Search categories...',
    'categories.management': 'Category Management',
    'categories.noCategories': 'No categories found for this search.',
    'categories.unableToLoad': 'Unable to load categories right now.',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.recentNews': 'Recent News',
    'dashboard.recentExecutions': 'Recent Executions',
    
    // Workflows
    'workflows.title': 'Workflows',
    'workflows.recentExecutions': 'Recent Executions',
    'workflows.noLogs': 'No workflow logs found.',
    'workflows.loading': 'Loading...',
    'workflows.success': 'Success',
    'workflows.error': 'Error',
    'workflows.running': 'Running',
    'workflows.pending': 'Pending',
    'workflows.showingPage': 'Showing page',
    'workflows.of': 'of',
    'workflows.totalItems': 'total items',
    
    // News Detail
    'newsDetail.back': 'Back',
    'newsDetail.share': 'Share',
    'newsDetail.bookmark': 'Bookmark',
    'newsDetail.translate': 'Translate',
    'newsDetail.originalSources': 'Original Sources',
    'newsDetail.keywords': 'Keywords',
    'newsDetail.articleStatus': 'Article Status',
    'newsDetail.verify': 'Verify Article',
    'newsDetail.reject': 'Reject Article',
    'newsDetail.cancelVerify': 'Cancel Verification',
    'newsDetail.cancelReject': 'Cancel Rejection',
    'newsDetail.verifiedSuccess': 'News article verified successfully!',
    'newsDetail.rejectedSuccess': 'News article rejected.',
    'newsDetail.cancelVerifySuccess': 'Verification cancelled.',
    'newsDetail.cancelRejectSuccess': 'Rejection cancelled.',
    'newsDetail.notFound': 'News article not found',
    'newsDetail.loadError': 'Failed to load news article. Please try again.',
    'newsDetail.serverError': 'Cannot connect to server. Check your connection.',
    'newsDetail.linkCopied': 'Link copied to clipboard!',
    'newsDetail.articleBookmarked': 'Article bookmarked!',
    'newsDetail.switchedToEnglish': 'Switched to English',
    'newsDetail.switchedToThai': 'Switched to Thai',
    
    // Verification
    'verification.noItems': 'No items pending verification',
    'verification.allProcessed': 'All news items have been processed.',
    'verification.approve': 'Approve',
    'verification.reject': 'Reject',
    
    // Profile
    'profile.title': 'Profile',
    'profile.loading': 'Loading profile...',
    'profile.failedToLoad': 'Failed to load profile data',
    'profile.yourGoogleAccount': 'Your Google account information',
    'profile.information': 'Profile Information',
    'profile.emailVerified': 'Email Verified',
    'profile.firstName': 'First Name',
    'profile.lastName': 'Last Name',
    'profile.emailAddress': 'Email Address',
    'profile.role': 'Role',
    'profile.accountDetails': 'Account Details',
    'profile.accountType': 'Account Type',
    'profile.googleAccount': 'Google Account',
    'profile.signOutDescription': 'Sign out of your Google account. You\'ll need to sign in again to access the application.',
    
    // Workflows
    'workflows.openEditor': 'Open n8n Editor',
    'workflows.activeWorkflow': 'Active Workflow (mockup)',
    'workflows.lastRun': 'Last run:',
    'workflows.nextRun': 'Next run:',
    'workflows.currentConfiguration': 'Current Configuration:',
    'workflows.topic': 'Topic:',
    'workflows.format': 'Format:',
    'workflows.viewLogs': 'View Logs',
    
    // Weekly Categories Config
    'weeklyConfig.title': 'Weekly Categories Configuration',
    'weeklyConfig.description': 'Configure the news topic for automated AI workflow collection',
    'weeklyConfig.loadingOptions': 'Loading options...',
    'weeklyConfig.lastUpdated': 'Last updated:',
    'weeklyConfig.selectTopic': 'Select News Topic for This Week',
    'weeklyConfig.chooseCategory': 'Choose a category...',
    'weeklyConfig.noCategories': 'No categories available',
    'weeklyConfig.selectFormat': 'Select News Format',
    'weeklyConfig.chooseFormat': 'Choose a news format...',
    'weeklyConfig.noFormats': 'No formats available',
    'weeklyConfig.summary': 'Configuration Summary',
    'weeklyConfig.matchesPrevious': 'Configuration matches previous week',
    'weeklyConfig.previousWeek': 'Previous Week\'s Configuration:',
    'weeklyConfig.unsavedChanges': 'You have unsaved changes',
    'weeklyConfig.upToDate': 'Configuration is up to date',
    'weeklyConfig.saving': 'Saving...',
    'weeklyConfig.saveConfig': 'Save Configuration',
    
    // Verification
    'verification.queue': 'Verification Queue',
    'verification.itemsPending': 'items pending',
    'verification.loading': 'Loading pending news...',
    'verification.viewDetails': 'View Details',
    'verification.sources': 'Sources (',
    'verification.adminNotes': 'Admin Notes',
    'verification.addNotes': 'Add your verification notes here...',
    'verification.yesVerify': 'Yes, Verify',
    'verification.yesReject': 'Yes, Reject',
    'verification.at': 'at',
    
    // News Table
    'newsTable.loading': 'Loading news articles...',
    'newsTable.showing': 'Showing',
    'newsTable.article': 'article',
    'newsTable.articles': 'articles',
    'newsTable.selected': 'selected',
    'newsTable.verifyAll': 'Verify All',
    'newsTable.rejectAll': 'Reject All',
    'newsTable.selectAll': 'Select All',
    'newsTable.noArticles': 'No news articles found',
    'newsTable.tryAdjusting': 'Try adjusting your filters or search terms',
    'newsTable.verifyThis': 'Verify this news article',
    'newsTable.rejectThis': 'Reject this news article',
    'newsTable.cancelVerifyDesc': 'Cancel verification - set back to pending',
    'newsTable.cancelRejectDesc': 'Cancel rejection - set back to pending',
    'newsTable.showingPage': 'Showing page',
    'newsTable.totalItems': 'total items)',
    'newsTable.itemsVerified': 'items have been verified successfully!',
    'newsTable.itemsRejected': 'items have been rejected!',
    'newsTable.verificationCancelled': 'verification has been cancelled.',
    'newsTable.rejectionCancelled': 'rejection has been cancelled.',
    'newsTable.selectItemsToVerify': 'Please select items to verify',
    'newsTable.selectItemsToReject': 'Please select items to reject',
    'newsTable.someFailedVerify': 'Some items failed to verify. Please try again.',
    'newsTable.someFailedReject': 'Some items failed to reject. Please try again.',
    'newsTable.failedToLoad': 'Failed to load news articles. Please try again.',
    'newsTable.failedToReject': 'Failed to reject news article. Please try again.',
    'newsTable.failedToCancelVerify': 'Failed to cancel verification. Please try again.',
    'newsTable.failedToCancelReject': 'Failed to cancel rejection. Please try again.',
    
    // News Header
    'newsHeader.title': 'News Management',
    
    // News Filters
    'newsFilters.searchPlaceholder': 'Search news articles...',
    'newsFilters.allCategories': 'All Categories',
    'newsFilters.allStatuses': 'All Statuses',
    'newsFilters.showAll': 'Show All',
    'newsFilters.clear': 'Clear',
    'newsFilters.activeFilters': 'Active filters:',
    'newsFilters.search': 'Search: "',
    'newsFilters.removeSearch': 'Remove search filter',
    'newsFilters.removeCategory': 'Remove category filter',
    'newsFilters.removeStatus': 'Remove status filter',
    'newsFilters.removeDate': 'Remove date filter',
    'newsFilters.clearAll': 'Clear All',
    
    // Category Stats
    'categoryStats.overview': 'Overview',
    'categoryStats.totalCategories': 'Total Categories',
    'categoryStats.activeCategories': 'Active Categories',
    'categoryStats.totalArticles': 'Total Articles',
    
    // Category Distribution
    'categoryDistribution.title': 'Category Distribution',
    'categoryDistribution.noData': 'No category data available',
    
    // Category Card
    'categoryCard.articles': 'Articles',
    
    // News Detail
    'newsDetail.noSources': 'No sources available',
    'newsDetail.noKeywords': 'No keywords available',
    
    // Login
    'login.welcomeBack': 'Welcome Back',
    'login.signInToAdmin': 'Sign in to your admin dashboard',
    'login.signIn': 'Sign In',
    'login.continueWithGoogle': 'Continue with Google',
    'login.copyright': '© 2025 iReadCustomer. All rights reserved.',
    
    // Dashboard
    'dashboard.description': 'Here\'s what\'s happening with your news automation system.',
  },
  th: {
    // Sidebar
    'sidebar.dashboard': 'แดชบอร์ด',
    'sidebar.newsManagement': 'จัดการข่าว',
    'sidebar.categories': 'หมวดหมู่',
    'sidebar.workflows': 'เวิร์กโฟลว์ n8n',
    'sidebar.profile': 'โปรไฟล์',
    'sidebar.signOut': 'ออกจากระบบ',
    'sidebar.changeLanguage': 'เปลี่ยนภาษา',
    'sidebar.language': 'ภาษา',
    
    // Add Category Modal
    'category.addNew': 'เพิ่มหมวดหมู่ใหม่',
    'category.name': 'ชื่อหมวดหมู่',
    'category.namePlaceholder': 'กรอกชื่อหมวดหมู่',
    'category.description': 'คำอธิบาย',
    'category.descriptionPlaceholder': 'อธิบายว่าหมวดหมู่นี้ครอบคลุมอะไรสำหรับการจัดประเภท AI',
    'category.color': 'สีหมวดหมู่',
    'category.cancel': 'ยกเลิก',
    'category.add': 'เพิ่มหมวดหมู่',
    
    // Common
    'common.loading': 'กำลังโหลด...',
    'common.error': 'ข้อผิดพลาด',
    'common.success': 'สำเร็จ',
    'common.cancel': 'ยกเลิก',
    'common.save': 'บันทึก',
    'common.delete': 'ลบ',
    'common.edit': 'แก้ไข',
    'common.close': 'ปิด',
    'common.search': 'ค้นหา',
    'common.filter': 'กรอง',
    'common.reset': 'รีเซ็ต',
    'common.submit': 'ส่ง',
    'common.confirm': 'ยืนยัน',
    'common.back': 'กลับ',
    'common.next': 'ถัดไป',
    'common.previous': 'ก่อนหน้า',
    'common.noData': 'ไม่พบข้อมูล',
    
    // News
    'news.title': 'หัวข้อ',
    'news.category': 'หมวดหมู่',
    'news.status': 'สถานะ',
    'news.date': 'วันที่',
    'news.actions': 'การดำเนินการ',
    'news.verify': 'ยืนยัน',
    'news.reject': 'ปฏิเสธ',
    'news.pending': 'รอดำเนินการ',
    'news.verified': 'ยืนยันแล้ว',
    'news.rejected': 'ปฏิเสธแล้ว',
    'news.published': 'เผยแพร่แล้ว',
    
    // Categories
    'categories.title': 'หมวดหมู่',
    'categories.add': 'เพิ่มหมวดหมู่',
    'categories.search': 'ค้นหาหมวดหมู่...',
    'categories.management': 'จัดการหมวดหมู่',
    'categories.noCategories': 'ไม่พบหมวดหมู่สำหรับการค้นหานี้',
    'categories.unableToLoad': 'ไม่สามารถโหลดหมวดหมู่ได้ในขณะนี้',
    
    // Dashboard
    'dashboard.title': 'แดชบอร์ด',
    'dashboard.recentNews': 'ข่าวล่าสุด',
    'dashboard.recentExecutions': 'การดำเนินการล่าสุด',
    
    // Workflows
    'workflows.title': 'เวิร์กโฟลว์',
    'workflows.recentExecutions': 'การดำเนินการล่าสุด',
    'workflows.noLogs': 'ไม่พบบันทึกเวิร์กโฟลว์',
    'workflows.loading': 'กำลังโหลด...',
    'workflows.success': 'สำเร็จ',
    'workflows.error': 'ข้อผิดพลาด',
    'workflows.running': 'กำลังทำงาน',
    'workflows.pending': 'รอดำเนินการ',
    'workflows.showingPage': 'แสดงหน้า',
    'workflows.of': 'จาก',
    'workflows.totalItems': 'รายการทั้งหมด',
    
    // News Detail
    'newsDetail.back': 'กลับ',
    'newsDetail.share': 'แชร์',
    'newsDetail.bookmark': 'บุ๊กมาร์ก',
    'newsDetail.translate': 'แปล',
    'newsDetail.originalSources': 'แหล่งข้อมูลต้นฉบับ',
    'newsDetail.keywords': 'คำสำคัญ',
    'newsDetail.articleStatus': 'สถานะบทความ',
    'newsDetail.verify': 'ยืนยันบทความ',
    'newsDetail.reject': 'ปฏิเสธบทความ',
    'newsDetail.cancelVerify': 'ยกเลิกการยืนยัน',
    'newsDetail.cancelReject': 'ยกเลิกการปฏิเสธ',
    'newsDetail.verifiedSuccess': 'ยืนยันบทความข่าวสำเร็จ!',
    'newsDetail.rejectedSuccess': 'ปฏิเสธบทความข่าวแล้ว',
    'newsDetail.cancelVerifySuccess': 'ยกเลิกการยืนยันแล้ว',
    'newsDetail.cancelRejectSuccess': 'ยกเลิกการปฏิเสธแล้ว',
    'newsDetail.notFound': 'ไม่พบบทความข่าว',
    'newsDetail.loadError': 'โหลดบทความข่าวไม่สำเร็จ กรุณาลองอีกครั้ง',
    'newsDetail.serverError': 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ ตรวจสอบการเชื่อมต่อของคุณ',
    'newsDetail.linkCopied': 'คัดลอกลิงก์ไปยังคลิปบอร์ดแล้ว!',
    'newsDetail.articleBookmarked': 'บุ๊กมาร์กบทความแล้ว!',
    'newsDetail.switchedToEnglish': 'เปลี่ยนเป็นภาษาอังกฤษ',
    'newsDetail.switchedToThai': 'เปลี่ยนเป็นภาษาไทย',
    
    // Verification
    'verification.noItems': 'ไม่มีรายการที่รอการยืนยัน',
    'verification.allProcessed': 'รายการข่าวทั้งหมดได้รับการประมวลผลแล้ว',
    'verification.approve': 'อนุมัติ',
    'verification.reject': 'ปฏิเสธ',
    
    // Profile
    'profile.title': 'โปรไฟล์',
    'profile.loading': 'กำลังโหลดโปรไฟล์...',
    'profile.failedToLoad': 'โหลดข้อมูลโปรไฟล์ไม่สำเร็จ',
    'profile.yourGoogleAccount': 'ข้อมูลบัญชี Google ของคุณ',
    'profile.information': 'ข้อมูลโปรไฟล์',
    'profile.emailVerified': 'ยืนยันอีเมลแล้ว',
    'profile.firstName': 'ชื่อ',
    'profile.lastName': 'นามสกุล',
    'profile.emailAddress': 'ที่อยู่อีเมล',
    'profile.role': 'บทบาท',
    'profile.accountDetails': 'รายละเอียดบัญชี',
    'profile.accountType': 'ประเภทบัญชี',
    'profile.googleAccount': 'บัญชี Google',
    'profile.signOutDescription': 'ออกจากระบบบัญชี Google ของคุณ คุณจะต้องเข้าสู่ระบบอีกครั้งเพื่อเข้าถึงแอปพลิเคชัน',
    
    // Workflows
    'workflows.openEditor': 'เปิด n8n Editor',
    'workflows.activeWorkflow': 'เวิร์กโฟลว์ที่ใช้งาน (ตัวอย่าง)',
    'workflows.lastRun': 'รันล่าสุด:',
    'workflows.nextRun': 'รันถัดไป:',
    'workflows.currentConfiguration': 'การตั้งค่าปัจจุบัน:',
    'workflows.topic': 'หัวข้อ:',
    'workflows.format': 'รูปแบบ:',
    'workflows.viewLogs': 'ดูบันทึก',
    
    // Weekly Categories Config
    'weeklyConfig.title': 'การตั้งค่าหมวดหมู่อาทิตย์',
    'weeklyConfig.description': 'กำหนดหัวข้อข่าวสำหรับการรวบรวมเวิร์กโฟลว์ AI อัตโนมัติ',
    'weeklyConfig.loadingOptions': 'กำลังโหลดตัวเลือก...',
    'weeklyConfig.lastUpdated': 'อัปเดตล่าสุด:',
    'weeklyConfig.selectTopic': 'เลือกหัวข้อข่าวสำหรับสัปดาห์นี้',
    'weeklyConfig.chooseCategory': 'เลือกหมวดหมู่...',
    'weeklyConfig.noCategories': 'ไม่มีหมวดหมู่ที่ใช้ได้',
    'weeklyConfig.selectFormat': 'เลือกรูปแบบข่าว',
    'weeklyConfig.chooseFormat': 'เลือกรูปแบบข่าว...',
    'weeklyConfig.noFormats': 'ไม่มีรูปแบบที่ใช้ได้',
    'weeklyConfig.summary': 'สรุปการตั้งค่า',
    'weeklyConfig.matchesPrevious': 'การตั้งค่าเหมือนกับสัปดาห์ที่แล้ว',
    'weeklyConfig.previousWeek': 'การตั้งค่าสัปดาห์ที่แล้ว:',
    'weeklyConfig.unsavedChanges': 'คุณมีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก',
    'weeklyConfig.upToDate': 'การตั้งค่าขึ้นถึงวันที่',
    'weeklyConfig.saving': 'กำลังบันทึก...',
    'weeklyConfig.saveConfig': 'บันทึกการตั้งค่า',
    
    // Verification
    'verification.queue': 'คิวการยืนยัน',
    'verification.itemsPending': 'รายการที่รอดำเนินการ',
    'verification.loading': 'กำลังโหลดข่าวที่รอ...',
    'verification.viewDetails': 'ดูรายละเอียด',
    'verification.sources': 'แหล่งที่มา (',
    'verification.adminNotes': 'หมายเหตุผู้ดูแล',
    'verification.addNotes': 'เพิ่มหมายเหตุการยืนยันของคุณที่นี่...',
    'verification.yesVerify': 'ใช่ ยืนยัน',
    'verification.yesReject': 'ใช่ ปฏิเสธ',
    'verification.at': 'เวลา',
    
    // News Table
    'newsTable.loading': 'กำลังโหลดบทความข่าว...',
    'newsTable.showing': 'แสดง',
    'newsTable.article': 'บทความ',
    'newsTable.articles': 'บทความ',
    'newsTable.selected': 'ที่เลือก',
    'newsTable.verifyAll': 'ยืนยันทั้งหมด',
    'newsTable.rejectAll': 'ปฏิเสธทั้งหมด',
    'newsTable.selectAll': 'เลือกทั้งหมด',
    'newsTable.noArticles': 'ไม่พบบทความข่าว',
    'newsTable.tryAdjusting': 'ลองปรับตัวกรองหรือคำค้นหาของคุณ',
    'newsTable.verifyThis': 'ยืนยันบทความข่าวนี้',
    'newsTable.rejectThis': 'ปฏิเสธบทความข่าวนี้',
    'newsTable.cancelVerifyDesc': 'ยกเลิกการยืนยัน - ตั้งกลับเป็นรอดำเนินการ',
    'newsTable.cancelRejectDesc': 'ยกเลิกการปฏิเสธ - ตั้งกลับเป็นรอดำเนินการ',
    'newsTable.showingPage': 'แสดงหน้า',
    'newsTable.totalItems': 'รายการทั้งหมด)',
    'newsTable.itemsVerified': 'รายการได้รับการยืนยันสำเร็จ!',
    'newsTable.itemsRejected': 'รายการได้รับการปฏิเสธ!',
    'newsTable.verificationCancelled': 'การยืนยันถูกยกเลิกแล้ว',
    'newsTable.rejectionCancelled': 'การปฏิเสธถูกยกเลิกแล้ว',
    'newsTable.selectItemsToVerify': 'กรุณาเลือกรายการที่จะยืนยัน',
    'newsTable.selectItemsToReject': 'กรุณาเลือกรายการที่จะปฏิเสธ',
    'newsTable.someFailedVerify': 'บางรายการยืนยันไม่สำเร็จ กรุณาลองอีกครั้ง',
    'newsTable.someFailedReject': 'บางรายการปฏิเสธไม่สำเร็จ กรุณาลองอีกครั้ง',
    'newsTable.failedToLoad': 'โหลดบทความข่าวไม่สำเร็จ กรุณาลองอีกครั้ง',
    'newsTable.failedToReject': 'ปฏิเสธบทความข่าวไม่สำเร็จ กรุณาลองอีกครั้ง',
    'newsTable.failedToCancelVerify': 'ยกเลิกการยืนยันไม่สำเร็จ กรุณาลองอีกครั้ง',
    'newsTable.failedToCancelReject': 'ยกเลิกการปฏิเสธไม่สำเร็จ กรุณาลองอีกครั้ง',
    
    // News Header
    'newsHeader.title': 'จัดการข่าว',
    
    // News Filters
    'newsFilters.searchPlaceholder': 'ค้นหาบทความข่าว...',
    'newsFilters.allCategories': 'หมวดหมู่ทั้งหมด',
    'newsFilters.allStatuses': 'สถานะทั้งหมด',
    'newsFilters.showAll': 'แสดงทั้งหมด',
    'newsFilters.clear': 'ล้าง',
    'newsFilters.activeFilters': 'ตัวกรองที่ใช้งาน:',
    'newsFilters.search': 'ค้นหา: "',
    'newsFilters.removeSearch': 'ลบตัวกรองการค้นหา',
    'newsFilters.removeCategory': 'ลบตัวกรองหมวดหมู่',
    'newsFilters.removeStatus': 'ลบตัวกรองสถานะ',
    'newsFilters.removeDate': 'ลบตัวกรองวันที่',
    'newsFilters.clearAll': 'ล้างทั้งหมด',
    
    // Category Stats
    'categoryStats.overview': 'ภาพรวม',
    'categoryStats.totalCategories': 'หมวดหมู่ทั้งหมด',
    'categoryStats.activeCategories': 'หมวดหมู่ที่ใช้งาน',
    'categoryStats.totalArticles': 'บทความทั้งหมด',
    
    // Category Distribution
    'categoryDistribution.title': 'การกระจายหมวดหมู่',
    'categoryDistribution.noData': 'ไม่มีข้อมูลหมวดหมู่',
    
    // Category Card
    'categoryCard.articles': 'บทความ',
    
    // News Detail
    'newsDetail.noSources': 'ไม่มีแหล่งที่มา',
    'newsDetail.noKeywords': 'ไม่มีคำสำคัญ',
    
    // Login
    'login.welcomeBack': 'ยินดีต้อนรับกลับ',
    'login.signInToAdmin': 'เข้าสู่ระบบแดชบอร์ดผู้ดูแลของคุณ',
    'login.signIn': 'เข้าสู่ระบบ',
    'login.continueWithGoogle': 'ดำเนินการต่อด้วย Google',
    'login.copyright': '© 2025 iReadCustomer สงวนลิขสิทธิ์',
    
    // Dashboard
    'dashboard.description': 'นี่คือสิ่งที่เกิดขึ้นกับระบบอัตโนมัติข่าวของคุณ',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language') as Language;
      return saved === 'en' || saved === 'th' ? saved : 'en';
    }
    return 'en';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
