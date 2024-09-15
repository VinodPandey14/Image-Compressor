document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-upload');
    const compressBtn = document.getElementById('compress-btn');
    const downloadBtn = document.getElementById('download-btn');
    const messageBox = document.getElementById('message');
    const compressionLevel = document.getElementById('compression-level');
    const clearBtn = document.querySelector('.clear-btn');

    let files = [];
    let originalFilenames = [];

    fileInput.addEventListener('change', (e) => {
        
        files = Array.from(e.target.files);
        originalFilenames = files.map(file => file.name);
        const filenames = originalFilenames.join(', ');
        messageBox.textContent = `${files.length} file(s) selected: ${filenames}`;
    });

    compressBtn.addEventListener('click', async () => {
        if (files.length === 0) {
            messageBox.textContent = 'Please upload files before compression.';
            return;
        }

        messageBox.textContent = 'Compressing...';

        const formData = new FormData();
        files.forEach(file => formData.append('file', file));
        formData.append('level', compressionLevel.value);

        try {
            const response = await fetch('http://127.0.0.1:5000/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to compress files');

            const blob = await response.blob();
            const downloadUrl = URL.createObjectURL(blob);

          
            const newFilenames = originalFilenames.map(name => `compressed_${name}`);
            
            downloadBtn.disabled = false;
            downloadBtn.onclick = () => {
              
                originalFilenames.forEach((filename, index) => {
                    const a = document.createElement('a');
                    a.href = downloadUrl;
                    a.download = newFilenames[index];
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                });
            };

            messageBox.textContent = 'Compression successful! Click download.';
        } catch (error) {
            messageBox.textContent = 'An error occurred during compression: ' + error.message;
        }
    });

    clearBtn.addEventListener('click', () => {
        files = [];
        originalFilenames = [];
        fileInput.value = '';
        messageBox.textContent = '';
        downloadBtn.disabled = true;
    });
});
