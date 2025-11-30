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
