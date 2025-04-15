import CryptoJS from 'crypto-js';

export const resizeImage = async (file: File): Promise<HTMLCanvasElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 320;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, 320, 320);
      resolve(canvas);
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = URL.createObjectURL(file);
  });
};

export const canvasToByteArray = (canvas: HTMLCanvasElement): Uint8Array => {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return new Uint8Array(imageData.data.buffer);
};

export const createSHA256Hash = (byteArray: Uint8Array): string => {
  const wordArray = CryptoJS.lib.WordArray.create(byteArray);
  return CryptoJS.SHA256(wordArray).toString();
};

export const canvasToBase64 = (canvas: HTMLCanvasElement): string => {
  return canvas.toDataURL('image/jpeg').split(',')[1];
};

export const processImageForUpload = async (file: File): Promise<{ base64: string, hash: string }> => {
  try {
    const canvas = await resizeImage(file);
    
    const jpegBlob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/jpeg', 1.00);
    });
    
    const jpegArrayBuffer = await jpegBlob.arrayBuffer();
    const jpegBytes = new Uint8Array(jpegArrayBuffer);
    
    const wordArray = CryptoJS.lib.WordArray.create(jpegBytes);
    const hash = CryptoJS.SHA256(wordArray).toString();
    
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(',')[1]); 
      };
      reader.readAsDataURL(jpegBlob);
    });
    
    return { base64, hash };
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Failed to process image. Please try a different image.');
  }
};


export const processDefaultAvatar = async (avatarId: number): Promise<{ base64: string, hash: string }> => {
  try {
    const response = await fetch(`/default_avatars/default_${avatarId}.jpg`);
    const blob = await response.blob();
    const file = new File([blob], `default_${avatarId}.jpg`, { type: 'image/jpeg' });
    
    return processImageForUpload(file);
  } catch (error) {
    console.error('Error processing default avatar:', error);
    throw new Error('Failed to process default avatar. Please try again.');
  }
};
