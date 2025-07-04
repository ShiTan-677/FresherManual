/**
 * ShareAsImage.js - A plugin for Docsify to enable text selection sharing as images
 * This plugin allows users to select text on the page and share it as an image
 * Similar to WeChat's text selection sharing feature
 * 
 * 树礼书院新生手册分享功能
 */

(function() {
  // Configuration options
  const config = {
    buttonText: '分享为图片',
    watermarkText: '树礼书院新生手册',
    logoUrl: 'res/img/ShuLiLogo1.png',
    backgroundColor: '#ffffff',
    textColor: '#34495e',
    fontFamily: '"hk4e_zh-cn", Georgia, Times New Roman, serif',
    fontSize: '16px',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '600px',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    buttonColor: '#42b983',
    buttonTextColor: '#ffffff'
  };

  // Create and append the necessary styles
  function appendStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'hk4e_zh-cn';
        src: url('../res/fonts/hk4e_zh-cn.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
      .share-image-button {
        position: absolute;
        background-color: ${config.buttonColor};
        color: ${config.buttonTextColor};
        border: none;
        border-radius: 4px;
        padding: 5px 10px;
        font-size: 14px;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 2px 5px ${config.shadowColor};
        display: none;
      }
      
      .share-image-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1001;
      }
      
      .share-image-preview {
        position: relative;
        max-width: 90%;
        max-height: 90%;
        background-color: white;
        border-radius: 8px;
        overflow: hidden;
      }
      
      .share-image-actions {
        position: absolute;
        bottom: 20px;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: center;
        gap: 10px;
      }
      
      .share-image-action-button {
        background-color: ${config.buttonColor};
        color: ${config.buttonTextColor};
        border: none;
        border-radius: 4px;
        padding: 8px 15px;
        font-size: 14px;
        cursor: pointer;
      }
      
      .share-image-close {
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: transparent;
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
  }

  // Create the share button element
  function createShareButton() {
    const button = document.createElement('button');
    button.className = 'share-image-button';
    button.textContent = config.buttonText;
    document.body.appendChild(button);
    return button;
  }

  // Handle text selection
  function handleTextSelection() {
    const selection = window.getSelection();
    const shareButton = document.querySelector('.share-image-button');
    
    if (selection.toString().trim().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      // Position the share button near the selection
      shareButton.style.display = 'block';
      shareButton.style.top = `${window.scrollY + rect.bottom + 10}px`;
      shareButton.style.left = `${window.scrollX + rect.left + (rect.width / 2) - (shareButton.offsetWidth / 2)}px`;
    } else {
      shareButton.style.display = 'none';
    }
  }

  // Create an image from the selected text
  function createImageFromSelection() {
    const selection = window.getSelection();
    if (selection.toString().trim().length === 0) return;
    
    // Create a container for the selected text
    const container = document.createElement('div');
    container.style.backgroundColor = config.backgroundColor;
    container.style.color = config.textColor;
    container.style.fontFamily = config.fontFamily;
    container.style.fontSize = config.fontSize;
    container.style.padding = config.padding;
    container.style.borderRadius = config.borderRadius;
    container.style.maxWidth = '400px'; // 限制宽度以适应竖版
    container.style.boxShadow = `0 4px 15px ${config.shadowColor}`;
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.boxSizing = 'border-box';
    
    // Add the selected text
    const textContent = document.createElement('div');
    textContent.style.marginBottom = '40px'; // 增加底部边距，为水印和二维码留出空间
    textContent.innerHTML = selection.toString().replace(/\n/g, '<br>');
    container.appendChild(textContent);
    
    // Add logo in bottom left corner (WeChat style)
    if (config.logoUrl) {
      const logo = document.createElement('img');
      logo.src = config.logoUrl;
      logo.style.position = 'absolute';
      logo.style.bottom = '15px';
      logo.style.left = '20px';
      logo.style.height = '24px';
      logo.style.width = 'auto';
      logo.style.opacity = '0.8';
      container.appendChild(logo);
    }
    
    // Add watermark text (separate from logo)
    const watermark = document.createElement('div');
    watermark.style.position = 'absolute';
    watermark.style.bottom = '15px';
    watermark.style.left = '55px'; // 调整位置，避免与logo重叠
    watermark.style.fontSize = '12px';
    watermark.style.color = '#999';
    watermark.textContent = config.watermarkText;
    container.appendChild(watermark);
    
    // Add QR code if QRCode.js is available
    if (typeof QRCode !== 'undefined') {
      // 检查是否有ShareAsImageExtensions扩展
      if (window.ShareAsImageExtensions && window.ShareAsImageExtensions.generateQRCode) {
        // 使用扩展中的QR码生成函数
        const qrContainer = document.createElement('div');
        qrContainer.style.position = 'absolute';
        qrContainer.style.bottom = '15px';
        qrContainer.style.right = '20px';
        qrContainer.style.width = '80px';
        qrContainer.style.height = '80px';
        container.appendChild(qrContainer);
        
        // 使用扩展中的函数生成QR码
        new QRCode(qrContainer, {
          text: window.ShareAsImageExtensions.getCurrentPageUrl(true), // 包含段落ID
          width: 80,
          height: 80,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        });
      } else {
        // 如果没有扩展，使用默认方法
        const qrContainer = document.createElement('div');
        qrContainer.style.position = 'absolute';
        qrContainer.style.bottom = '15px';
        qrContainer.style.right = '20px';
        qrContainer.style.width = '80px';
        qrContainer.style.height = '80px';
        container.appendChild(qrContainer);
        
        // 使用当前页面URL生成QR码
        new QRCode(qrContainer, {
          text: window.location.href,
          width: 80,
          height: 80,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        });
      }
      
      // Add QR code hint
      const qrHint = document.createElement('div');
      qrHint.style.position = 'absolute';
      qrHint.style.bottom = '95px';
      qrHint.style.right = '20px';
      qrHint.style.fontSize = '12px';
      qrHint.style.color = '#888';
      qrHint.style.textAlign = 'center';
      qrHint.style.width = '80px';
      qrHint.textContent = '扫码阅读完整内容';
      container.appendChild(qrHint);
    } else {
      // Add QR code hint without actual QR code
      const qrHint = document.createElement('div');
      qrHint.style.position = 'absolute';
      qrHint.style.bottom = '10px';
      qrHint.style.right = '20px';
      qrHint.style.fontSize = '14px';
      qrHint.style.color = '#888';
      qrHint.textContent = '树礼书院新生手册';
      container.appendChild(qrHint);
    }
    
    // Temporarily add to document to get dimensions
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    document.body.appendChild(container);
    
    // Use html2canvas to create an image
    html2canvas(container, { 
      backgroundColor: config.backgroundColor,
      scale: 2, // Higher resolution
      logging: false,
      useCORS: true
    }).then(canvas => {
      // Remove the temporary container
      document.body.removeChild(container);
      
      // Hide the share button
      document.querySelector('.share-image-button').style.display = 'none';
      
      // Create a modal to display the image
      showImagePreview(canvas);
    });
  }

  // Show the image preview in a modal
  function showImagePreview(canvas) {
    // Create container
    const container = document.createElement('div');
    container.className = 'share-image-container';
    
    // Create preview wrapper
    const preview = document.createElement('div');
    preview.className = 'share-image-preview';
    
    // Add the canvas
    preview.appendChild(canvas);
    
    // Add action buttons
    const actions = document.createElement('div');
    actions.className = 'share-image-actions';
    
    // Download button
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'share-image-action-button';
    downloadBtn.textContent = '保存图片';
    downloadBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = '树礼新生手册分享.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
    actions.appendChild(downloadBtn);
    
    // Copy to clipboard button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'share-image-action-button';
    copyBtn.textContent = '复制到剪贴板';
    copyBtn.addEventListener('click', () => {
      canvas.toBlob(blob => {
        try {
          // 创建ClipboardItem对象
          const item = new ClipboardItem({ 'image/png': blob });
          // 写入剪贴板
          navigator.clipboard.write([item])
            .then(() => {
              // 显示成功提示
              const toast = document.createElement('div');
              toast.style.position = 'fixed';
              toast.style.bottom = '20px';
              toast.style.left = '50%';
              toast.style.transform = 'translateX(-50%)';
              toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
              toast.style.color = 'white';
              toast.style.padding = '10px 20px';
              toast.style.borderRadius = '4px';
              toast.style.zIndex = '1002';
              toast.textContent = '已复制到剪贴板';
              document.body.appendChild(toast);
              
              // 2秒后移除提示
              setTimeout(() => {
                document.body.removeChild(toast);
              }, 2000);
            })
            .catch(err => {
              console.error('复制到剪贴板失败:', err);
              alert('复制到剪贴板失败，请尝试使用保存图片功能');
            });
        } catch (err) {
          console.error('您的浏览器不支持复制图片到剪贴板:', err);
          alert('您的浏览器不支持复制图片到剪贴板，请尝试使用保存图片功能');
        }
      });
    });
    actions.appendChild(copyBtn);
    
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'share-image-close';
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(container);
    });
    
    // Add elements to DOM
    preview.appendChild(actions);
    container.appendChild(preview);
    container.appendChild(closeBtn);
    document.body.appendChild(container);
    
    // Close on background click
    container.addEventListener('click', (e) => {
      if (e.target === container) {
        document.body.removeChild(container);
      }
    });
  }

  // Initialize the plugin
  function init() {
    // Check if html2canvas is available
    if (typeof html2canvas === 'undefined') {
      console.error('ShareAsImage plugin requires html2canvas library');
      return;
    }
    
    // Add styles
    appendStyles();
    
    // Create share button
    const shareButton = createShareButton();
    
    // Add event listeners
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('selectionchange', handleTextSelection);
    
    shareButton.addEventListener('click', createImageFromSelection);
    
    // Hide share button when clicking elsewhere
    document.addEventListener('mousedown', (e) => {
      if (!e.target.closest('.share-image-button')) {
        shareButton.style.display = 'none';
      }
    });
  }

  // Register the plugin with Docsify
  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = [].concat(function(hook, vm) {
    hook.ready(function() {
      init();
    });
  }, window.$docsify.plugins);
})();