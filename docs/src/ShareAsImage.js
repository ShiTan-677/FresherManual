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
    watermarkUrl: 'https://shuli-gz-1259749012.cos.ap-guangzhou.myqcloud.com/img/ShuLiLogo1.png',
    backgroundColor: '#ffffff',
    textColor: '#34495e',
    fontFamily: 'Source Sans Pro, Helvetica Neue, Arial, sans-serif',
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
    container.style.maxWidth = config.maxWidth;
    container.style.boxShadow = `0 4px 15px ${config.shadowColor}`;
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.boxSizing = 'border-box';
    
    // Add the selected text
    const textContent = document.createElement('div');
    textContent.style.marginBottom = '30px';
    textContent.innerHTML = selection.toString();
    container.appendChild(textContent);
    
    // Add watermark
    const watermark = document.createElement('div');
    watermark.style.display = 'flex';
    watermark.style.alignItems = 'center';
    watermark.style.position = 'absolute';
    watermark.style.bottom = '10px';
    watermark.style.left = '20px';
    watermark.style.fontSize = '14px';
    watermark.style.color = '#888';
    
    // Add logo to watermark if available
    if (config.watermarkUrl) {
      const logo = document.createElement('img');
      logo.src = config.watermarkUrl;
      logo.style.height = '20px';
      logo.style.marginRight = '8px';
      watermark.appendChild(logo);
    }
    
    // Add text to watermark
    const watermarkTextElement = document.createElement('span');
    watermarkTextElement.textContent = config.watermarkText;
    watermark.appendChild(watermarkTextElement);
    
    container.appendChild(watermark);
    
    // Add QR code if QRCode.js is available
    if (typeof QRCode !== 'undefined') {
      // Create QR code for current page
      const qrContainer = document.createElement('div');
      qrContainer.style.position = 'absolute';
      qrContainer.style.bottom = '10px';
      qrContainer.style.right = '20px';
      qrContainer.style.width = '80px';
      qrContainer.style.height = '80px';
      container.appendChild(qrContainer);
      
      // Generate QR code for current page
      new QRCode(qrContainer, {
        text: window.location.href,
        width: 80,
        height: 80,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      });
      
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