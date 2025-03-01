document.getElementById('qrForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const url = document.getElementById('url').value;
    const fileInput = document.getElementById('file');
    const fileFile = fileInput.files[0];
    if (fileFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            generateQRCode(url, e.target.result);
        }
        reader.readAsDataURL(fileFile);
    } else {
        generateQRCode(url, null);
    }
});

function generateQRCode(url, fileSrc) {
    const qrCodeDiv = document.getElementById('qrCode');
    qrCodeDiv.innerHTML = '';

    const qrCode = new QRCode(qrCodeDiv, {
        text: url,
        width: 250,
        height: 250,
        colorDark: "#000000",
        colorLight: "#ffffff"
    });

    setTimeout(function() {
        const qrCanvas = qrCodeDiv.querySelector('canvas');
        if (fileSrc) {
            addfileToQRCode(qrCanvas, fileSrc);
        } else {
            document.getElementById('btndownload').style.display = 'block';
            document.getElementById('cardqr').style.display = 'block';
        }
    }, 500);
}

function addfileToQRCode(qrCanvas, fileSrc) {
    const ctx = qrCanvas.getContext('2d');
    const file = new Image();
    file.src = fileSrc;
    file.onload = function() {
        const fileMaxSize = qrCanvas.width / 5;
        let fileWidth = file.width;
        let fileHeight = file.height;

        if (fileWidth > fileHeight) {
            if (fileWidth > fileMaxSize) {
                fileHeight *= fileMaxSize / fileWidth;
                fileWidth = fileMaxSize;
            }
        } else {
            if (fileHeight > fileMaxSize) {
                fileWidth *= fileMaxSize / fileHeight;
                fileHeight = fileMaxSize;
            }
        }

        const fileX = (qrCanvas.width - fileWidth) / 2;
        const fileY = (qrCanvas.height - fileHeight) / 2;
        ctx.drawImage(file, fileX, fileY, fileWidth, fileHeight);

        document.getElementById('btndownload').style.display = 'block';
        document.getElementById('cardqr').style.display = 'block';
        // Cập nhật lại mã QR trong <div> sau khi thêm file
        const img = new Image();
        img.src = qrCanvas.toDataURL('image/png');
        qrCodeDiv.innerHTML = '';
        qrCodeDiv.appendChild(img);
    }
}

document.getElementById('downloadPngBtn').addEventListener('click', function() {
    const qrCodeCanvas = document.querySelector('#qrCode canvas');
    if (qrCodeCanvas) {
        const canvas = document.createElement('canvas');
        canvas.width = 1000;
        canvas.height = 1000;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(qrCodeCanvas, 0, 0, 1000, 1000);

        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = 'qrcode.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
});

document.getElementById('downloadJpgBtn').addEventListener('click', function() {
    const qrCodeCanvas = document.querySelector('#qrCode canvas') || document.querySelector('#qrCode img');
    if (qrCodeCanvas) {
        const newCanvas = document.createElement('canvas');
        newCanvas.width = 1000;
        newCanvas.height = 1000;
        const ctx = newCanvas.getContext('2d');
        
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
        ctx.drawImage(qrCodeCanvas, 0, 0, 1000, 1000);

        const url = newCanvas.toDataURL('image/jpeg');
        const a = document.createElement('a');
        a.href = url;
        a.download = 'qrcode.jpg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
});


document.getElementById('file').addEventListener('change', function () {
    var reader = new FileReader();
    reader.onload = function (e) {
        var image = new Image();
        image.onload = function () {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var maxWidth = 100; // Kích thước tối đa bạn muốn thu nhỏ ảnh
            var maxHeight = 100;
            var width = image.width;
            var height = image.height;
            var aspectRatio = width / height;

            if (width > height) {
                if (width > maxWidth) {
                    width = maxWidth;
                    height = width / aspectRatio;
                }
            } else {
                if (height > maxHeight) {
                    height = maxHeight;
                    width = height * aspectRatio;
                }
            }

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(image, 0, 0, width, height);

            var customFileLabel = document.getElementById('customFileLabel');
            customFileLabel.innerHTML = '';
            customFileLabel.appendChild(canvas);
        };
        image.src = e.target.result;
    };
    reader.readAsDataURL(this.files[0]);
});