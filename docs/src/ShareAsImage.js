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
    backgroundImageUrl: 'res/img/mainpage/LiBaoArt_byHuangHongKai.png', // 吉祥物图片作为背景
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
    container.style.overflow = 'hidden'; // 确保背景图片不会溢出容器
    container.style.minHeight = '500px'; // 确保容器有足够的高度显示背景图片
    
    // 创建背景图片包装器，但暂不添加到容器中
    let bgWrapper = null;
    let backgroundImg = null;
    
    if (config.backgroundImageUrl) {
      // 创建一个包装器div来包含背景图片，确保正确定位
      bgWrapper = document.createElement('div');
      bgWrapper.style.position = 'absolute';
      bgWrapper.style.top = '0';
      bgWrapper.style.left = '0';
      bgWrapper.style.width = '100%';
      bgWrapper.style.height = '100%';
      bgWrapper.style.zIndex = '0';
      bgWrapper.style.overflow = 'hidden';
      
      // 使用图片元素而不是CSS背景
      backgroundImg = document.createElement('img');
      
      // 使用绝对路径，确保图片能被正确加载
      // 获取当前页面的基础URL
      const baseUrl = window.location.origin + '/';
      const imgPath = config.backgroundImageUrl.replace(/^\.\//g, '');
      const absoluteUrl = baseUrl + imgPath;
      
      console.log('尝试加载图片，绝对路径:', absoluteUrl);
      backgroundImg.src = absoluteUrl;
      
      // 设置图片样式
      backgroundImg.style.width = '100%';
      backgroundImg.style.height = 'auto';
      backgroundImg.style.objectFit = 'cover'; // 改为cover以填充容器
      backgroundImg.style.objectPosition = 'center top'; // 优先显示上半部分
      backgroundImg.style.opacity = '0.6'; // 增加不透明度
      
      // 添加图片加载事件，确保图片加载完成
      backgroundImg.onload = function() {
        console.log('背景图片加载成功:', absoluteUrl);
        console.log('图片尺寸:', backgroundImg.naturalWidth, 'x', backgroundImg.naturalHeight);
        backgroundImg.setAttribute('data-loaded', 'true');
      };
      
      backgroundImg.onerror = function(e) {
        console.error('背景图片加载失败:', absoluteUrl, e);
        // 尝试使用相对路径作为备选
        console.log('尝试使用相对路径:', config.backgroundImageUrl);
        backgroundImg.src = config.backgroundImageUrl;
      };
      
      // 将背景图片添加到包装器中
      bgWrapper.appendChild(backgroundImg);
    }
    
    // Add the selected text
    const textContent = document.createElement('div');
    textContent.style.marginBottom = '40px'; // 增加底部边距，为水印和二维码留出空间
    textContent.style.position = 'relative'; // 相对定位
    textContent.style.zIndex = '1'; // 确保文本在背景图片上方
    textContent.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'; // 半透明背景，提高文字可读性
    textContent.style.padding = '15px'; // 内边距
    textContent.style.borderRadius = '5px'; // 圆角
    textContent.innerHTML = selection.toString().replace(/\n/g, '<br>');
    container.appendChild(textContent);
    
    // 现在添加背景图片包装器（在文本内容之后）
    if (bgWrapper && backgroundImg) {
      // 先添加到容器中，以便能够获取文本内容的高度
      container.insertBefore(bgWrapper, container.firstChild);
      
      // 等待DOM更新，然后调整高度
      setTimeout(() => {
        // 获取文本内容的高度
        let textHeight = textContent.offsetHeight;
        console.log('文本内容高度:', textHeight);
        
        // 根据文本内容动态调整图片显示高度
        // 设置最小高度为文本高度加上一些额外空间（用于水印、二维码等）
        const extraSpace = 150; // 为水印、二维码等元素预留的空间
        const minHeight = Math.max(textHeight + extraSpace, 300); // 最小300px
        const maxHeight = Math.min(backgroundImg.naturalHeight || 800, 800); // 最大800px
        
        // 如果文本内容较少，则显示较少的图片高度
        const adjustedHeight = Math.min(minHeight, maxHeight);
        container.style.minHeight = adjustedHeight + 'px';
        bgWrapper.style.height = adjustedHeight + 'px';
        
        console.log('调整后的容器高度:', adjustedHeight);
      }, 0);
    }
    
    // Add logo in bottom left corner (WeChat style)
    if (config.logoUrl) {
      const logo = document.createElement('img');
      logo.src = config.logoUrl;
      logo.style.position = 'absolute';
      logo.style.bottom = '15px';
      logo.style.left = '20px';
      logo.style.height = '60px'; // 增加logo高度
      logo.style.width = 'auto';
      logo.style.opacity = '0.9'; // 增加不透明度
      container.appendChild(logo);
    }
    
    // Add watermark text (separate from logo)
    const watermark = document.createElement('div');
    watermark.style.position = 'absolute';
    watermark.style.bottom = '30px';
    watermark.style.left = '80px'; // 调整位置，避免与更大的logo重叠
    watermark.style.fontSize = '20px'; // 增加字体大小
    //watermark.style.fontWeight = 'bold'; // 添加粗体
    watermark.style.color = '#666'; // 颜色更深，增加可见度
    watermark.textContent = config.watermarkText;
    container.appendChild(watermark);
    
    // Add QR code if QRCode.js is available
    if (typeof QRCode !== 'undefined') {
      // 创建一个QR码区域包装器，放在右下角
      const qrWrapper = document.createElement('div');
      qrWrapper.style.position = 'absolute';
      qrWrapper.style.bottom = '15px'; // 放在底部
      qrWrapper.style.right = '15px';
      qrWrapper.style.width = '90px';
      qrWrapper.style.height = 'auto';
      qrWrapper.style.zIndex = '2'; // 确保在文本上方
      qrWrapper.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'; // 半透明白色背景
      qrWrapper.style.borderRadius = '5px';
      qrWrapper.style.padding = '5px';
      qrWrapper.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
      container.appendChild(qrWrapper);
      
      // 添加QR码提示文字
      const qrHint = document.createElement('div');
      qrHint.style.fontSize = '10px';
      qrHint.style.color = '#666';
      qrHint.style.textAlign = 'center';
      qrHint.style.marginBottom = '3px';
      qrHint.style.fontWeight = 'bold';
      qrHint.textContent = '扫码阅读完整内容';
      qrWrapper.appendChild(qrHint);
      
      // 创建QR码容器
      const qrContainer = document.createElement('div');
      qrContainer.style.width = '80px';
      qrContainer.style.height = '80px';
      qrContainer.style.margin = '0 auto';
      qrWrapper.appendChild(qrContainer);
      
      // 检查是否有ShareAsImageExtensions扩展
      if (window.ShareAsImageExtensions && window.ShareAsImageExtensions.generateQRCode) {
        // 使用扩展中的函数生成QR码
        new QRCode(qrContainer, {
          text: window.ShareAsImageExtensions.getCurrentPageUrl(true), // 包含段落ID
          width: 80, // 恢复原始尺寸
          height: 80,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        });
      } else {
        // 如果没有扩展，使用默认方法
        new QRCode(qrContainer, {
          text: window.location.href,
          width: 80, // 恢复原始尺寸
          height: 80,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        });
      }
    } else {
      // 如果QRCode库不可用，添加一个简单的提示
      const qrWrapper = document.createElement('div');
      qrWrapper.style.position = 'absolute';
      qrWrapper.style.bottom = '15px';
      qrWrapper.style.right = '15px';
      qrWrapper.style.width = '90px';
      qrWrapper.style.height = 'auto';
      qrWrapper.style.zIndex = '2';
      qrWrapper.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
      qrWrapper.style.borderRadius = '5px';
      qrWrapper.style.padding = '5px';
      qrWrapper.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
      qrWrapper.style.textAlign = 'center';
      qrWrapper.style.fontSize = '12px';
      qrWrapper.style.color = '#666';
      qrWrapper.textContent = '树礼书院新生手册';
      container.appendChild(qrWrapper);
    }
    
    // Temporarily add to document to get dimensions
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    document.body.appendChild(container);
    
    // 添加调试信息
     console.log('准备生成图片，容器尺寸:', container.offsetWidth, 'x', container.offsetHeight);
     console.log('背景图片URL:', config.backgroundImageUrl);
     
     // 确保所有图片都已加载
     const allImages = container.querySelectorAll('img');
     console.log('容器中的图片数量:', allImages.length);
     
     // 显示所有图片的加载状态和路径
     allImages.forEach((img, index) => {
       console.log(`图片 ${index}:`, {
         src: img.src,
         complete: img.complete,
         naturalWidth: img.naturalWidth,
         naturalHeight: img.naturalHeight,
         dataLoaded: img.getAttribute('data-loaded')
       });
     });
     
     // 设置较长的超时时间，确保图片有足够时间加载
      setTimeout(() => {
        console.log('开始生成canvas，延迟确保图片加载');
        
        // 再次检查图片状态
        allImages.forEach((img, index) => {
          console.log(`图片 ${index} 最终状态:`, {
            src: img.src,
            complete: img.complete,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight
          });
        });
        
        // Use html2canvas to create an image
        html2canvas(container, { 
          backgroundColor: config.backgroundColor,
          scale: 2, // Higher resolution
          logging: true, // 启用日志以便调试
          useCORS: true,
          allowTaint: true, // 允许跨域图片
          imageTimeout: 0, // 禁用图片加载超时
          onclone: function(clonedDoc) {
            // 检查克隆后的文档中的图片
            const clonedContainer = clonedDoc.querySelector('div');
            const clonedImages = clonedContainer.querySelectorAll('img');
            console.log('克隆后的图片数量:', clonedImages.length);
            
            // 确保克隆的图片已加载
            clonedImages.forEach((img, index) => {
              console.log(`克隆图片 ${index}:`, {
                src: img.src,
                complete: img.complete,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight
              });
            });
          }
        }).then(canvas => {
          // Remove the temporary container
          document.body.removeChild(container);
          
          // Hide the share button
          document.querySelector('.share-image-button').style.display = 'none';
          
          // Create a modal to display the image
          showImagePreview(canvas);
        }).catch(error => {
           console.error('生成图片时出错:', error);
           alert('生成图片时出错，请重试');
           document.body.removeChild(container);
         });
        }, 1000); // 等待1秒，确保图片加载完成
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