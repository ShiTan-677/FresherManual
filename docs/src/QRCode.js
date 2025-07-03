/**
 * QRCode.js - A simple QR code generator for the ShareAsImage plugin
 * This script adds QR code generation functionality to the ShareAsImage plugin
 */

(function() {
  // QR Code generation function
  function generateQRCode(url, size = 100) {
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
  
  // Extend the ShareAsImage plugin to include QR codes
  if (window.ShareAsImageExtensions) {
    window.ShareAsImageExtensions.generateQRCode = generateQRCode;
  } else {
    window.ShareAsImageExtensions = {
      generateQRCode: generateQRCode
    };
  }
})();