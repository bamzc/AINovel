/**
 * 响应式断点常量
 * 与 Ant Design 5 的断点保持一致，避免双标准混乱
 *
 * @see https://ant.design/components/grid#col
 */

export const BREAKPOINTS = {
  xs: 480,   // 超小屏（小手机）
  sm: 576,   // 小屏（手机）
  md: 768,   // 中屏（平板竖屏）—— 移动端 / 桌面端分界
  lg: 992,   // 大屏（平板横屏 / 小笔记本）
  xl: 1200,  // 超大屏（桌面）
  xxl: 1600, // 超超大屏
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * 媒体查询字符串生成（用于 matchMedia）
 */
export const MEDIA = {
  /** < 768，移动端 */
  mobile: `(max-width: ${BREAKPOINTS.md - 1}px)`,
  /** 768 - 991，平板 */
  tablet: `(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`,
  /** >= 992，桌面 */
  desktop: `(min-width: ${BREAKPOINTS.lg}px)`,
  /** 触屏设备（用于 hover 不靠谱场景） */
  touch: '(hover: none) and (pointer: coarse)',
  /** 偏好减少动效 */
  reducedMotion: '(prefers-reduced-motion: reduce)',
} as const;

/**
 * 默认移动端分界点（< 768 视为移动端）
 * 历史遗留：项目里很多页面用的是 768，保持兼容
 */
export const MOBILE_BREAKPOINT = BREAKPOINTS.md;
