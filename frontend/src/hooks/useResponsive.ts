import { useEffect, useState } from 'react';
import { BREAKPOINTS, MEDIA } from '../theme/breakpoints';

export interface ResponsiveState {
  /** 视口宽度 < 768 */
  isMobile: boolean;
  /** 768 <= 视口宽度 < 992 */
  isTablet: boolean;
  /** 视口宽度 >= 992 */
  isDesktop: boolean;
  /** 是否为触屏设备（无 hover、粗指针） */
  isTouch: boolean;
  /** 当前视口宽度（px） */
  width: number;
  /** 当前视口高度（px，优先 visualViewport 解决 iOS 键盘问题） */
  height: number;
}

const SSR_DEFAULT: ResponsiveState = {
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  isTouch: false,
  width: 1280,
  height: 800,
};

const computeState = (): ResponsiveState => {
  if (typeof window === 'undefined') return SSR_DEFAULT;

  const width = window.innerWidth;
  // visualViewport 在 iOS 键盘弹起时更准
  const height = window.visualViewport?.height ?? window.innerHeight;

  const isMobile = width < BREAKPOINTS.md;
  const isTablet = width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
  const isDesktop = width >= BREAKPOINTS.lg;

  const isTouch =
    typeof window.matchMedia === 'function'
      ? window.matchMedia(MEDIA.touch).matches
      : false;

  return { isMobile, isTablet, isDesktop, isTouch, width, height };
};

/**
 * 统一响应式 Hook
 * 取代散落各页面的 `const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)`
 *
 * 内部监听：
 * - matchMedia（性能优于 resize）
 * - orientationchange（横竖屏切换）
 * - visualViewport.resize（iOS 键盘弹起）
 */
export const useResponsive = (): ResponsiveState => {
  const [state, setState] = useState<ResponsiveState>(computeState);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const update = () => setState(computeState());

    // matchMedia 比 resize 事件更省（断点变化才触发）
    const mqMobile = window.matchMedia(MEDIA.mobile);
    const mqTablet = window.matchMedia(MEDIA.tablet);
    const mqDesktop = window.matchMedia(MEDIA.desktop);
    const mqTouch = window.matchMedia(MEDIA.touch);

    // 兼容老版本 Safari（addListener / removeListener）
    const subscribe = (mq: MediaQueryList, handler: () => void) => {
      if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
      }
      mq.addListener(handler);
      return () => mq.removeListener(handler);
    };

    const unsubs = [
      subscribe(mqMobile, update),
      subscribe(mqTablet, update),
      subscribe(mqDesktop, update),
      subscribe(mqTouch, update),
    ];

    // 横竖屏切换（部分设备 mq 不灵敏）
    window.addEventListener('orientationchange', update);

    // visualViewport 监听键盘弹起（仅现代浏览器有）
    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener('resize', update);
    }

    return () => {
      unsubs.forEach((fn) => fn());
      window.removeEventListener('orientationchange', update);
      if (vv) vv.removeEventListener('resize', update);
    };
  }, []);

  return state;
};

/**
 * 简化版：只关心是否为移动端（兼容现有 isMobile 用法）
 */
export const useIsMobile = (): boolean => useResponsive().isMobile;
