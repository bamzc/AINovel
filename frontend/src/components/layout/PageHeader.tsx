import React from 'react';
import { theme } from 'antd';
import { useResponsive } from '../../hooks/useResponsive';
import { SPACING } from '../../theme/spacing';

interface PageHeaderProps {
  /** 标题（可以是 string 或 ReactNode，移动端自动缩级） */
  title: React.ReactNode;
  /** 左侧操作（一般是返回按钮） */
  leftAction?: React.ReactNode;
  /** 右侧操作（重置/设置按钮等） */
  rightAction?: React.ReactNode;
  /** 是否粘性定位 */
  sticky?: boolean;
  /** 背景色（默认走主题色） */
  background?: string;
  /** 文字色 */
  color?: string;
  /** 阴影 */
  shadow?: string;
  /** 自定义最大宽度 */
  maxWidth?: number;
}

/**
 * 通用页面顶部栏
 * - 移动端自动缩小 padding、按钮尺寸、标题级别
 * - 移动端三栏布局保护：左/中/右各占合适宽度，标题居中且可截断
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  leftAction,
  rightAction,
  sticky = true,
  background,
  color,
  shadow,
  maxWidth = 1200,
}) => {
  const { token } = theme.useToken();
  const { isMobile } = useResponsive();

  const bg = background ?? token.colorPrimary;
  const fg = color ?? token.colorWhite;
  const sh =
    shadow ??
    `0 6px 20px color-mix(in srgb, ${token.colorPrimary} 30%, transparent)`;

  return (
    <div
      style={{
        position: sticky ? 'sticky' : 'static',
        top: 0,
        zIndex: 100,
        background: bg,
        boxShadow: sh,
      }}
    >
      <div
        style={{
          maxWidth,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          padding: isMobile
            ? SPACING.headerPadding.mobile
            : SPACING.headerPadding.desktop,
        }}
      >
        {/* 左 */}
        <div
          style={{
            flex: '0 0 auto',
            display: 'flex',
            alignItems: 'center',
            color: fg,
          }}
        >
          {leftAction}
        </div>

        {/* 中 - 标题，flex-min 避免长标题撑爆 */}
        <div
          className="flex-min break-text"
          style={{
            flex: '1 1 auto',
            textAlign: 'center',
            color: fg,
            fontSize: isMobile ? 16 : 22,
            fontWeight: 600,
            lineHeight: 1.2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            padding: '0 8px',
          }}
        >
          {title}
        </div>

        {/* 右 */}
        <div
          style={{
            flex: '0 0 auto',
            display: 'flex',
            alignItems: 'center',
            color: fg,
          }}
        >
          {rightAction}
        </div>
      </div>
    </div>
  );
};
