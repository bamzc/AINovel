import React from 'react';
import { theme } from 'antd';
import { useResponsive } from '../../hooks/useResponsive';

interface PageLayoutProps {
  children: React.ReactNode;
  /** 背景色覆盖（默认走 antd token） */
  background?: string;
  /** 是否吃顶部安全区（有自定义顶部栏时设 true） */
  safeTop?: boolean;
  /** 是否吃底部安全区（默认 true） */
  safeBottom?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义 style */
  style?: React.CSSProperties;
}

/**
 * 通用页面外壳
 * - 移动端使用 100dvh 解决 iOS 地址栏问题
 * - 桌面端走 min-height: 100vh，与原行为一致
 * - 默认吃底部安全区，避免 iPhone Home 条压内容
 */
export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  background,
  safeTop = false,
  safeBottom = true,
  className,
  style,
}) => {
  const { token } = theme.useToken();
  const { isMobile } = useResponsive();

  const classNames = [
    isMobile ? 'min-h-screen-d' : '',
    safeTop ? 'safe-top' : '',
    safeBottom ? 'safe-bottom' : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classNames}
      style={{
        minHeight: isMobile ? undefined : '100vh',
        background: background ?? token.colorBgBase,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
