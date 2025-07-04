/**
 * QRCode.js - A simple QR code generator for the ShareAsImage plugin
 * This script adds QR code generation functionality to the ShareAsImage plugin
 */

(function() {
  // Configuration options
  const config = {
    // 设置为true使用GitHub Pages URL，设置为false使用当前页面URL
    useGitHubPages: false,
    // GitHub Pages的基础URL
    githubPagesBaseUrl: 'https://shulicollege.github.io/FresherManual/',
    // 是否在URL中包含段落ID
    includeFragmentId: true
  };

  // 获取当前页面URL，可选择是否包含段落ID
  function getCurrentPageUrl(includeFragmentId = true) {
    // 获取基本URL
    let url;
    if (config.useGitHubPages) {
      // 使用GitHub Pages URL
      const path = window.location.hash.replace('#/', '');
      url = config.githubPagesBaseUrl + '#/' + path;
    } else {
      // 使用当前页面URL
      url = window.location.href;
    }

    // 如果不包含段落ID，则移除URL中的段落ID部分
    if (!includeFragmentId) {
      url = url.split('?')[0];
    }

    return url;
  }

  // QR Code generation function
  function generateQRCode(url = null, size = 100) {
    // 如果没有提供URL，则使用当前页面URL
    if (!url) {
      url = getCurrentPageUrl(config.includeFragmentId);
    }

    // Create a container for the QR code
    const container = document.createElement('div');
    container.style.width = `${size}px`;
    container.style.height = `${size}px`;
    container.style.position = 'absolute';
    container.style.bottom = '10px';
    container.style.right = '20px';
    container.style.backgroundColor = '#ffffff';
    
    // Use a QR code library to generate the code
    // We're using QRCode.js which is a popular library
    new QRCode(container, {
      text: url,
      width: size,
      height: size,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
    
    return container;
  }
  
  // 设置配置选项的函数
  function setConfig(newConfig) {
    Object.assign(config, newConfig);
  }

  // Extend the ShareAsImage plugin to include QR codes
  if (window.ShareAsImageExtensions) {
    window.ShareAsImageExtensions.generateQRCode = generateQRCode;
    window.ShareAsImageExtensions.setQRCodeConfig = setConfig;
    window.ShareAsImageExtensions.getCurrentPageUrl = getCurrentPageUrl;
  } else {
    window.ShareAsImageExtensions = {
      generateQRCode: generateQRCode,
      setQRCodeConfig: setConfig,
      getCurrentPageUrl: getCurrentPageUrl
    };
  }
})();