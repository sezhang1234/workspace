/**
 * 字体加载器工具
 * 确保HarmonyOS字体在页面加载时被正确应用
 */

import { smartFontPreload } from './font-preloader';

// 字体加载状态
let fontsLoaded = false;

// 预加载的字体列表
const fontUrls = [
  '/fonts/HarmonyOS_Sans_SC_Regular.ttf',
  '/fonts/HarmonyOS_Sans_Regular.ttf',
  '/fonts/HarmonyOS_Sans_SC_Medium.ttf',
  '/fonts/HarmonyOS_Sans_Medium.ttf',
  '/fonts/HarmonyOS_Sans_SC_Bold.ttf',
  '/fonts/HarmonyOS_Sans_Bold.ttf',
];

/**
 * 加载字体文件
 */
export const loadFonts = async (): Promise<void> => {
  if (fontsLoaded) {
    return;
  }

  try {
    // 使用FontFace API加载字体
    if ('FontFace' in window) {
      const fontPromises = fontUrls.map(async (url) => {
        const fontName = url.includes('SC') ? 'HarmonyOS Sans SC' : 'HarmonyOS Sans';
        const font = new FontFace(fontName, `url(${url})`);
        await font.load();
        document.fonts.add(font);
        return font;
      });

      await Promise.all(fontPromises);
      fontsLoaded = true;
      console.log('所有字体加载完成');
    } else {
      // 降级处理：使用CSS类名触发字体应用
      document.documentElement.classList.add('fonts-loaded');
      fontsLoaded = true;
    }
  } catch (error) {
    console.warn('字体加载失败，使用系统字体:', error);
    fontsLoaded = true;
  }
};

/**
 * 检查字体是否已加载
 */
export const areFontsLoaded = (): boolean => {
  return fontsLoaded;
};

/**
 * 强制应用字体到页面
 */
export const applyFonts = (): void => {
  // 确保字体应用到根元素
  document.documentElement.style.fontFamily = 'HarmonyOS Sans SC, HarmonyOS Sans, system-ui, sans-serif';
  
  // 添加字体加载完成的类名
  document.documentElement.classList.add('fonts-loaded');
};

// 页面加载完成后自动加载字体
if (typeof window !== 'undefined') {
  // 启动智能字体预加载
  smartFontPreload();
  
  // 在DOMContentLoaded后加载字体
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFonts);
  } else {
    loadFonts();
  }
  
  // 在页面完全加载后再次确保字体应用
  window.addEventListener('load', applyFonts);
}
