/**
 * 响应式间距 token
 * 桌面端保持原有视觉，移动端适度收紧
 */

export const SPACING = {
  /** 页面外层 padding */
  pagePadding: {
    mobile: '16px 12px',
    desktop: '24px 24px',
  },
  /** 顶部栏 padding */
  headerPadding: {
    mobile: '12px 16px',
    desktop: '16px 24px',
  },
  /** 卡片内边距 */
  cardPadding: {
    mobile: 12,
    desktop: 16,
  },
  /** 内容最大宽度 */
  contentMaxWidth: {
    narrow: 800,   // 阅读类、表单类
    medium: 1000,  // 列表类
    wide: 1200,    // 仪表盘类
  },
} as const;

/**
 * 触摸目标最小尺寸（iOS HIG 标准）
 */
export const TOUCH_TARGET_MIN = 44;

/**
 * 安全区 CSS 表达式工具
 */
export const SAFE_AREA = {
  top: 'env(safe-area-inset-top, 0px)',
  bottom: 'env(safe-area-inset-bottom, 0px)',
  left: 'env(safe-area-inset-left, 0px)',
  right: 'env(safe-area-inset-right, 0px)',
} as const;
